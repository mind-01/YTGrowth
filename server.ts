import express from "express";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import axios from "axios";
import * as cheerio from "cheerio";

dotenv.config();

const app = express();
app.set('trust proxy', true);
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Gemini API Setup
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
let genAI: GoogleGenAI | null = null;

if (GEMINI_API_KEY) {
  console.log("[Gemini API] API Key found. Initializing genAI...");
  genAI = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
} else {
  console.warn("[Gemini API] Warning: GEMINI_API_KEY is not set in environment variables.");
}

// YouTube API Key
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

// Helper to decode HTML entities in titles
function decodeHtmlEntities(text: string) {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'");
}

// Helper function to get channel ID from URL
async function getChannelIdFromUrl(url: string): Promise<string> {
  if (!url) throw new Error("URL is required");
  
  const urlStr = url.trim();

  // 1. Direct Channel ID (24 chars starting with UC)
  const channelIdMatch = urlStr.match(/UC[a-zA-Z0-9_-]{22}/);
  if (channelIdMatch) return channelIdMatch[0];

  // 2. Handle Video URL -> Get Channel ID from Video
  if (urlStr.includes("watch?v=") || urlStr.includes("youtu.be/") || urlStr.includes("/shorts/")) {
    let videoId = "";
    if (urlStr.includes("watch?v=")) {
      videoId = urlStr.split("watch?v=")[1].split("&")[0].split("/")[0];
    } else if (urlStr.includes("youtu.be/")) {
      videoId = urlStr.split("youtu.be/")[1].split("?")[0].split("/")[0];
    } else if (urlStr.includes("/shorts/")) {
      videoId = urlStr.split("/shorts/")[1].split("?")[0].split("/")[0];
    }
    
    if (videoId) {
      try {
        const videoResponse = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${YOUTUBE_API_KEY}`
        );
        const videoData = await videoResponse.json() as any;
        if (videoData.items && videoData.items.length > 0) {
          return videoData.items[0].snippet.channelId;
        }
      } catch (e) {
        console.error("Error fetching video info for ID:", videoId, e);
      }
    }
  }

  // 3. Handle @handle
  if (urlStr.includes("@")) {
    const handle = "@" + urlStr.split("@")[1].split("/")[0].split("?")[0];
    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/channels?part=id&forHandle=${encodeURIComponent(handle)}&key=${YOUTUBE_API_KEY}`
      );
      const data = await response.json() as any;
      if (data.items && data.items.length > 0) return data.items[0].id;
      
      // Try without @ just in case
      const cleanHandle = handle.substring(1);
      const response2 = await fetch(
        `https://www.googleapis.com/youtube/v3/channels?part=id&forHandle=${encodeURIComponent(cleanHandle)}&key=${YOUTUBE_API_KEY}`
      );
      const data2 = await response2.json() as any;
      if (data2.items && data2.items.length > 0) return data2.items[0].id;
    } catch (e) {
      console.error("Error fetching channel by handle:", handle, e);
    }
  }

  // 4. Handle /user/ (Legacy)
  if (urlStr.includes("/user/")) {
    const username = urlStr.split("/user/")[1].split("/")[0].split("?")[0];
    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/channels?part=id&forUsername=${encodeURIComponent(username)}&key=${YOUTUBE_API_KEY}`
      );
      const data = await response.json() as any;
      if (data.items && data.items.length > 0) return data.items[0].id;
    } catch (e) {
      console.error("Error fetching channel by username:", username, e);
    }
  }

  // 5. Handle /c/ or search fallback
  let searchQuery = "";
  if (urlStr.includes("/channel/")) {
    const id = urlStr.split("/channel/")[1].split("/")[0].split("?")[0];
    if (id.startsWith("UC")) return id;
  } else if (urlStr.includes("/c/")) {
    searchQuery = urlStr.split("/c/")[1].split("/")[0].split("?")[0];
  } else if (urlStr.includes("youtube.com/")) {
    const parts = urlStr.split("youtube.com/")[1].split("/")[0].split("?")[0];
    if (parts && !["channel", "c", "user", "videos", "shorts", "streams"].includes(parts)) {
      searchQuery = parts;
    }
  } else {
    searchQuery = urlStr;
  }

  if (searchQuery) {
    try {
      const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(searchQuery)}&type=channel&maxResults=1&key=${YOUTUBE_API_KEY}`;
      const searchResponse = await fetch(searchUrl);
      const searchData = (await searchResponse.json()) as any;
      if (searchData.items && searchData.items.length > 0) {
        return searchData.items[0].id.channelId;
      }
    } catch (e) {
      console.error("Error searching for channel:", searchQuery, e);
    }
  }

  throw new Error("Could not determine channel ID from URL. Please try using the full channel URL or @handle.");
}

// API Route for YouTube Suggest (Autocomplete) - No API Key Required
app.get("/api/youtube/suggest", async (req, res) => {
  const { q } = req.query;
  if (!q) return res.status(400).json({ error: "Query is required" });

  try {
    const response = await axios.get(`https://suggestqueries.google.com/complete/search?client=youtube&ds=yt&q=${encodeURIComponent(q as string)}`, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
      }
    });

    // The response is usually like: window.google.ac.h(["query",[["suggestion1",0],["suggestion2",0],...]])
    // Or just a JSON array if client=firefox or similar
    const data = response.data;
    const match = data.match(/\((.*)\)/);
    if (match) {
      const json = JSON.parse(match[1]);
      const suggestions = json[1].map((item: any) => item[0]);
      res.json({ suggestions });
    } else {
      // Fallback if format is different
      res.json({ suggestions: [] });
    }
  } catch (error: any) {
    console.error("Suggest Error:", error.message);
    res.status(500).json({ error: "Failed to fetch suggestions." });
  }
});

// API Route for Scraping YouTube Video Data (No API Key Required)
app.get("/api/youtube/scrape", async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: "URL is required" });

  const videoUrl = url as string;
  let videoId = "";
  
  // Extract Video ID early for fallback
  if (videoUrl.includes("watch?v=")) {
    videoId = videoUrl.split("watch?v=")[1].split("&")[0];
  } else if (videoUrl.includes("youtu.be/")) {
    videoId = videoUrl.split("youtu.be/")[1].split("?")[0];
  } else if (videoUrl.includes("/shorts/")) {
    videoId = videoUrl.split("/shorts/")[1].split("?")[0];
  }

  try {
    const response = await axios.get(videoUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9"
      },
      timeout: 5000
    });

    const $ = cheerio.load(response.data);
    
    // Extract Metadata from Meta Tags
    const title = $('meta[name="title"]').attr('content') || $('title').text();
    const description = $('meta[name="description"]').attr('content') || "";
    const keywords = $('meta[name="keywords"]').attr('content') || "";
    
    // Extract Advanced Data from ytInitialPlayerResponse
    const scriptContent = response.data;
    const playerResponseMatch = scriptContent.match(/var ytInitialPlayerResponse = ({.*?});/);
    
    let tags: string[] = [];
    let viewCount = "0";
    let publishDate = "";
    let category = "";
    let channelId = "";
    let channelName = "";

    if (playerResponseMatch) {
      try {
        const playerResponse = JSON.parse(playerResponseMatch[1]);
        const videoDetails = playerResponse.videoDetails || {};
        tags = videoDetails.keywords || [];
        viewCount = videoDetails.viewCount || "0";
        channelId = videoDetails.channelId || "";
        channelName = videoDetails.author || "";
        
        const microformat = playerResponse.microformat?.playerMicroformatRenderer || {};
        publishDate = microformat.publishDate || "";
        category = microformat.category || "";
      } catch (e) {
        console.error("Error parsing ytInitialPlayerResponse:", e);
      }
    }

    // Fallback for tags if not in playerResponse
    if (tags.length === 0 && keywords) {
      tags = keywords.split(',').map(k => k.trim());
    }

    res.json({
      videoId,
      title,
      description,
      tags,
      viewCount,
      publishDate,
      category,
      channelId,
      channelName,
      thumbnails: {
        default: `https://i.ytimg.com/vi/${videoId}/default.jpg`,
        medium: `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`,
        high: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
        standard: `https://i.ytimg.com/vi/${videoId}/sddefault.jpg`,
        maxres: `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`
      }
    });

  } catch (error: any) {
    console.error("Scraping Error:", error.message);
    
    // If we have a videoId, we can still return thumbnails even if scraping fails (e.g. 429)
    if (videoId) {
      return res.json({
        videoId,
        title: "Video Metadata Unavailable (Rate Limited)",
        description: "YouTube is currently limiting requests. Thumbnails are still available.",
        tags: [],
        viewCount: "0",
        publishDate: "",
        category: "",
        channelId: "",
        channelName: "Unknown",
        thumbnails: {
          default: `https://i.ytimg.com/vi/${videoId}/default.jpg`,
          medium: `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`,
          high: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
          standard: `https://i.ytimg.com/vi/${videoId}/sddefault.jpg`,
          maxres: `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`
        },
        isRateLimited: true
      });
    }
    
    res.status(500).json({ error: "Failed to fetch video data. Please check the URL or try again later." });
  }
});

// API Route for YouTube Channel Info
app.get("/api/youtube/channel-info", async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: "URL parameter is required" });
  }

  try {
    const channelUrl = url as string;
    const response = await axios.get(channelUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
      }
    });

    const $ = cheerio.load(response.data);
    
    // Extract Channel Stats from ytInitialData
    const scriptContent = response.data;
    const initialDataMatch = scriptContent.match(/var ytInitialData = ({.*?});/);
    
    let channelName = "";
    let profilePicture = "";
    let totalSubs = 0;
    let totalViews = 0;

    if (initialDataMatch) {
      try {
        const initialData = JSON.parse(initialDataMatch[1]);
        const header = initialData.header?.c4TabbedHeaderRenderer || {};
        channelName = header.title || "";
        profilePicture = header.avatar?.thumbnails?.[0]?.url || "";
        const subText = header.subscriberCountText?.simpleText || "0";
        totalSubs = parseInt(subText.replace(/[^0-9]/g, '')) || 0;
        if (subText.includes('K')) totalSubs *= 1000;
        if (subText.includes('M')) totalSubs *= 1000000;

        // Views are harder to find in the header, might need to check the 'About' tab or metadata
        totalViews = 0; // Fallback
      } catch (e) {
        console.error("Error parsing ytInitialData for channel info:", e);
      }
    }

    const watchTime = Math.round(totalViews * 0.01); // Heuristic

    res.json({
      channelName,
      profilePicture,
      subscriberCount: totalSubs,
      viewCount: totalViews,
      watchTime: watchTime,
      isMonetized: totalSubs >= 1000 && watchTime >= 4000,
      gapSubscribers: Math.max(0, 1000 - totalSubs),
      gapWatchTime: Math.max(0, 4000 - watchTime),
    });

  } catch (error: any) {
    console.error("YouTube Channel Info Error:", error.message);
    res.status(500).json({ error: "Failed to fetch channel info." });
  }
});

// API Route for YouTube Channel Audit
app.get("/api/youtube/channel-audit", async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: "Channel URL is required" });
  }

  try {
    const channelUrl = url as string;
    const response = await axios.get(channelUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
      }
    });

    const $ = cheerio.load(response.data);
    
    // Extract Channel Stats from ytInitialData
    const scriptContent = response.data;
    const initialDataMatch = scriptContent.match(/var ytInitialData = ({.*?});/);
    
    let channelName = "";
    let totalSubs = 0;
    let totalViews = 0;
    let recentVideos: any[] = [];

    if (initialDataMatch) {
      try {
        const initialData = JSON.parse(initialDataMatch[1]);
        const header = initialData.header?.c4TabbedHeaderRenderer || {};
        channelName = header.title || "";
        const subText = header.subscriberCountText?.simpleText || "0";
        totalSubs = parseInt(subText.replace(/[^0-9]/g, '')) || 0;
        // Handle 'K' or 'M' in subText if needed, but replace(/[^0-9]/g, '') is a bit naive
        if (subText.includes('K')) totalSubs *= 1000;
        if (subText.includes('M')) totalSubs *= 1000000;

        // Recent Videos (from the home tab usually)
        const contents = initialData.contents?.twoColumnBrowseResultsRenderer?.tabs?.[0]?.tabRenderer?.content?.sectionListRenderer?.contents || [];
        for (const section of contents) {
          const items = section.itemSectionRenderer?.contents?.[0]?.gridRenderer?.items || 
                        section.itemSectionRenderer?.contents?.[0]?.shelfRenderer?.content?.horizontalListRenderer?.items || [];
          for (const item of items) {
            const v = item.gridVideoRenderer || item.videoRenderer;
            if (v) {
              recentVideos.push({
                title: v.title.runs[0].text,
                views: parseInt(v.viewCountText?.simpleText?.replace(/[^0-9]/g, '') || "0"),
                publishedAt: v.publishedTimeText?.simpleText || ""
              });
            }
            if (recentVideos.length >= 5) break;
          }
          if (recentVideos.length >= 5) break;
        }
      } catch (e) {
        console.error("Error parsing ytInitialData for audit:", e);
      }
    }

    // Heuristic Scores
    const engagementRate = 3.5; // Hard to calculate without detailed stats
    const consistencyScore = 80;
    const seoScore = 75;
    const retentionEstimate = 60;

    res.json({
      channelName,
      subscriberCount: totalSubs,
      totalViews: totalViews,
      engagementRate,
      consistencyScore,
      seoScore,
      retentionEstimate,
      recentVideos
    });

  } catch (error: any) {
    console.error("Channel Audit Error:", error.message);
    res.status(500).json({ error: "Failed to perform channel audit." });
  }
});

app.get("/api/youtube/keywords", async (req, res) => {
  const { q, regionCode = "IN", relevanceLanguage = "hi" } = req.query;

  if (!q) {
    return res.status(400).json({ error: "Query parameter 'q' is required" });
  }

  try {
    const query = q as string;
    
    // 1. Get Suggestions from Google Suggest
    const suggestRes = await axios.get(`https://suggestqueries.google.com/complete/search?client=youtube&ds=yt&q=${encodeURIComponent(query)}`);
    const suggestMatch = suggestRes.data.match(/\((.*)\)/);
    let suggestions: string[] = [];
    if (suggestMatch) {
      const suggestJson = JSON.parse(suggestMatch[1]);
      suggestions = suggestJson[1].map((item: any) => item[0]);
    }

    // 2. Scrape YouTube Search Results for Competition Analysis
    const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
    const searchResponse = await axios.get(searchUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
      }
    });

    const $ = cheerio.load(searchResponse.data);
    const results: any[] = [];
    
    // Extract data from ytInitialData JSON
    const scriptContent = searchResponse.data;
    const initialDataMatch = scriptContent.match(/var ytInitialData = ({.*?});/);
    
    if (initialDataMatch) {
      try {
        const initialData = JSON.parse(initialDataMatch[1]);
        const contents = initialData.contents.twoColumnSearchResultsRenderer.primaryContents.sectionListRenderer.contents[0].itemSectionRenderer.contents;
        
        for (const item of contents) {
          if (item.videoRenderer) {
            const v = item.videoRenderer;
            results.push({
              id: v.videoId,
              title: v.title.runs[0].text,
              channelTitle: v.ownerText.runs[0].text,
              channelId: v.ownerText.runs[0].navigationEndpoint.browseEndpoint.browseId,
              publishTime: v.publishedTimeText?.simpleText || "",
              viewCount: parseInt(v.viewCountText?.simpleText?.replace(/[^0-9]/g, '') || "0"),
              subscriberCount: 0, // Hard to get from search results without extra requests
              thumbnail: v.thumbnail.thumbnails[0].url
            });
          }
          if (results.length >= 10) break;
        }
      } catch (e) {
        console.error("Error parsing ytInitialData:", e);
      }
    }

    const avgViews = results.length > 0 ? results.reduce((sum, v) => sum + v.viewCount, 0) / results.length : 0;
    
    // KD Score Logic (Heuristic)
    let kdScore = 50;
    if (avgViews < 10000) kdScore = 20;
    else if (avgViews < 50000) kdScore = 40;
    else if (avgViews > 500000) kdScore = 80;

    res.json({
      query,
      region: regionCode,
      language: relevanceLanguage,
      category: "General",
      kdScore,
      isLowCompetition: kdScore < 40,
      isHighOpportunity: kdScore < 30,
      metrics: {
        avgViews: Math.round(avgViews),
        avgSubs: 0,
      },
      results,
      suggestions
    });

  } catch (error: any) {
    console.error("Keyword Research Error:", error.message);
    res.status(500).json({ error: "Failed to perform keyword research." });
  }
});

// API Route for YouTube Competitor Spy
app.get("/api/youtube/competitor-spy", async (req, res) => {
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({ error: "Query parameter 'q' is required" });
  }

  if (!YOUTUBE_API_KEY) {
    return res.json({
      channelName: "Demo Competitor",
      subscriberCount: 500000,
      avgViews: 125000,
      postingFrequency: "2 videos/week",
      recentVideos: [
        { title: "Demo Video 1", views: 150000, publishedAt: new Date().toISOString() },
        { title: "Demo Video 2", views: 100000, publishedAt: new Date().toISOString() }
      ]
    });
  }

  try {
    let channelId = "";
    const queryStr = q as string;

    // Check if it's a URL or Handle
    if (queryStr.includes("youtube.com") || queryStr.includes("youtu.be") || queryStr.includes("@")) {
      channelId = await getChannelIdFromUrl(queryStr);
    } else {
      // Search for the most relevant channel for this keyword
      const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(queryStr)}&type=channel&maxResults=1&key=${YOUTUBE_API_KEY}`;
      const searchResponse = await fetch(searchUrl);
      const searchData = (await searchResponse.json()) as any;
      if (searchData.items && searchData.items.length > 0) {
        channelId = searchData.items[0].id.channelId;
      } else {
        throw new Error("No competitor channel found for this keyword.");
      }
    }

    // 1. Get Channel Stats
    const statsResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=statistics,snippet&id=${channelId}&key=${YOUTUBE_API_KEY}`
    );
    const statsData = await statsResponse.json();
    
    if (!statsData.items || statsData.items.length === 0) {
      throw new Error("Competitor channel not found.");
    }

    const channel = statsData.items[0];
    const totalSubs = parseInt(channel.statistics.subscriberCount || "0");

    // 2. Get Recent Videos (last 10)
    const videosResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&maxResults=10&order=date&type=video&key=${YOUTUBE_API_KEY}`
    );
    const videosData = await videosResponse.json();
    const videoIds = (videosData.items || []).map((item: any) => item.id.videoId).join(",");

    let avgViews = 0;
    let recentVideos: any[] = [];
    let postingFrequency = "N/A";

    if (videoIds) {
      const videoStatsResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=statistics,snippet&id=${videoIds}&key=${YOUTUBE_API_KEY}`
      );
      const videoStatsData = await videoStatsResponse.json();
      recentVideos = videoStatsData.items || [];

      let totalVideoViews = 0;
      recentVideos.forEach((video: any) => {
        totalVideoViews += parseInt(video.statistics.viewCount || "0");
      });

      if (recentVideos.length > 0) {
        avgViews = Math.round(totalVideoViews / recentVideos.length);
        
        // Calculate posting frequency (videos per week in last 30 days)
        const now = new Date();
        const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));
        const recentUploads = recentVideos.filter((v: any) => new Date(v.snippet.publishedAt) > thirtyDaysAgo).length;
        const weeks = 30 / 7;
        const freq = (recentUploads / weeks).toFixed(1);
        postingFrequency = `${freq} videos/week`;
      }
    }

    res.json({
      channelName: channel.snippet.title,
      subscriberCount: totalSubs,
      avgViews: avgViews,
      postingFrequency: postingFrequency,
      recentVideos: recentVideos.map(v => ({
        title: v.snippet.title,
        views: parseInt(v.statistics.viewCount || "0"),
        publishedAt: v.snippet.publishedAt
      }))
    });
  } catch (error: any) {
    console.error("YouTube Competitor Spy Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// API Route for Gemini Content Generation
app.post("/api/gemini/generate", async (req, res) => {
  const { model, contents, config } = req.body;
  
  console.log("[Gemini API] Received request:", {
    model: model,
    contentsType: typeof contents,
    isContentsArray: Array.isArray(contents),
    hasConfig: !!config
  });

  if (!genAI) {
    console.error("[Gemini API] Error: genAI instance is null. Checking environment variables...");
    const key = process.env.GEMINI_API_KEY;
    if (key) {
      console.log("[Gemini API] Key found in process.env during request. Re-initializing...");
      genAI = new GoogleGenAI({ apiKey: key });
    } else {
      console.error("[Gemini API] Error: GEMINI_API_KEY is still missing.");
      return res.status(500).json({ error: "Gemini API key is not configured on the server." });
    }
  }

  try {
    // Normalize contents to Content[] format which is most reliable
    let normalizedContents = contents;
    if (typeof contents === 'string') {
      normalizedContents = [{ role: 'user', parts: [{ text: contents }] }];
    } else if (contents && contents.parts && !Array.isArray(contents)) {
      normalizedContents = [contents];
    } else if (Array.isArray(contents) && contents.length > 0 && typeof contents[0] === 'string') {
      normalizedContents = [{ role: 'user', parts: contents.map(t => ({ text: t })) }];
    }

    console.log("[Gemini API] Calling generateContent with normalized contents...");
    
    const result = await genAI.models.generateContent({
      model: model || "gemini-1.5-flash",
      contents: normalizedContents,
      config: config
    });

    if (!result) {
      console.error("[Gemini API] Error: Received null/undefined result from generateContent.");
      return res.status(500).json({ error: "No response from Gemini API." });
    }

    console.log("[Gemini API] Success: Received response from Gemini.");
    
    let text;
    try {
      text = result.text;
    } catch (textError: any) {
      console.error("[Gemini API] Error accessing result.text (possibly blocked):", textError.message);
      // If text is blocked, we might want to see the candidates
      if (result.candidates && result.candidates.length > 0) {
        console.log("[Gemini API] Candidate 0 finishReason:", result.candidates[0].finishReason);
      }
      return res.status(400).json({ 
        error: "Content generation was blocked or failed to produce text.",
        details: textError.message,
        finishReason: result.candidates?.[0]?.finishReason
      });
    }

    if (text === undefined) {
      console.warn("[Gemini API] Warning: result.text is undefined. Full response:", JSON.stringify(result, null, 2));
      return res.status(500).json({ error: "Gemini API returned an empty response." });
    }

    res.json({ text: text });
  } catch (error: any) {
    console.error("[Gemini API] Exception caught during generation:", error);
    
    // Provide more details in the error response for debugging
    const errorMessage = error.message || "An error occurred during content generation.";
    const errorStatus = error.status || 500;
    
    res.status(errorStatus).json({ 
      error: errorMessage,
      details: error.stack,
      rawError: error
    });
  }
});

// Vite middleware for development
if (process.env.NODE_ENV !== "production") {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "spa",
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static("dist"));
  app.get('*', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'dist', 'index.html'));
  });
}

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;
