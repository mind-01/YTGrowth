import express from "express";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

const app = express();
app.set('trust proxy', true);
const PORT = 3000;

app.use(express.json());

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

// API Route for YouTube Channel Info
app.get("/api/youtube/channel-info", async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: "URL parameter is required" });
  }

  if (!YOUTUBE_API_KEY) {
    console.warn("YOUTUBE_API_KEY is not configured. Using mock data for demonstration.");
    return res.json({
      channelName: "Demo Creator",
      profilePicture: "https://picsum.photos/seed/demo/200/200",
      subscriberCount: 450,
      viewCount: 125000,
      watchTime: 1250, // Estimated: viewCount * 0.01
      isMonetized: false,
      gapSubscribers: 550,
      gapWatchTime: 2750,
    });
  }

  try {
    const channelId = await getChannelIdFromUrl(url as string);

    const channelUrl = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelId}&key=${YOUTUBE_API_KEY}`;
    const response = await fetch(channelUrl);
    const data = (await response.json()) as any;

    if (!data.items || data.items.length === 0) {
      throw new Error("Channel not found");
    }

    const channel = data.items[0];
    const subs = parseInt(channel.statistics.subscriberCount || "0");
    const views = parseInt(channel.statistics.viewCount || "0");
    const watchTime = Math.round(views * 0.01); // Heuristic: 1% of views as hours

    res.json({
      channelName: channel.snippet.title,
      profilePicture: channel.snippet.thumbnails.high.url,
      subscriberCount: subs,
      viewCount: views,
      watchTime: watchTime,
      isMonetized: subs >= 1000 && watchTime >= 4000,
      gapSubscribers: Math.max(0, 1000 - subs),
      gapWatchTime: Math.max(0, 4000 - watchTime),
    });

  } catch (error: any) {
    console.error("YouTube Channel Info Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// API Route for YouTube Channel Audit
app.get("/api/youtube/channel-audit", async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: "Channel URL is required" });
  }

  if (!YOUTUBE_API_KEY) {
    return res.json({
      engagementRate: 4.2,
      consistencyScore: 85,
      seoScore: 72,
      retentionEstimate: 65,
      recentVideos: []
    });
  }

  try {
    const channelId = await getChannelIdFromUrl(url as string);
    
    // 1. Get Channel Stats
    const statsResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=statistics,snippet&id=${channelId}&key=${YOUTUBE_API_KEY}`
    );
    const statsData = await statsResponse.json();
    
    if (!statsData.items || statsData.items.length === 0) {
      throw new Error("Channel not found");
    }

    const channel = statsData.items[0];
    const totalViews = parseInt(channel.statistics.viewCount || "0");
    const totalSubs = parseInt(channel.statistics.subscriberCount || "0");

    // 2. Get Recent Videos (last 10)
    const videosResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&maxResults=10&order=date&type=video&key=${YOUTUBE_API_KEY}`
    );
    const videosData = await videosResponse.json();
    const videoIds = (videosData.items || []).map((item: any) => item.id.videoId).join(",");

    // 3. Get Video Stats
    let engagementRate = 0;
    let consistencyScore = 0;
    let recentVideos: any[] = [];

    if (videoIds) {
      const videoStatsResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=statistics,snippet,contentDetails&id=${videoIds}&key=${YOUTUBE_API_KEY}`
      );
      const videoStatsData = await videoStatsResponse.json();
      recentVideos = videoStatsData.items || [];

      let totalLikes = 0;
      let totalComments = 0;
      let totalVideoViews = 0;

      recentVideos.forEach((video: any) => {
        totalLikes += parseInt(video.statistics.likeCount || "0");
        totalComments += parseInt(video.statistics.commentCount || "0");
        totalVideoViews += parseInt(video.statistics.viewCount || "0");
      });

      // Engagement Rate = (Likes + Comments) / Views * 100
      if (totalVideoViews > 0) {
        engagementRate = parseFloat(((totalLikes + totalComments) / totalVideoViews * 100).toFixed(2));
      }

      // Consistency Score (based on upload frequency in last 30 days)
      const now = new Date();
      const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));
      const recentUploads = recentVideos.filter((v: any) => new Date(v.snippet.publishedAt) > thirtyDaysAgo).length;
      
      // Heuristic: 4 uploads a month is 100% consistency for many niches
      consistencyScore = Math.min(100, (recentUploads / 4) * 100);
    }

    res.json({
      channelName: channel.snippet.title,
      subscriberCount: totalSubs,
      totalViews: totalViews,
      engagementRate: engagementRate || 3.5, // Fallback
      consistencyScore: Math.round(consistencyScore) || 70, // Fallback
      recentVideos: recentVideos.map(v => ({
        title: v.snippet.title,
        views: v.statistics.viewCount,
        likes: v.statistics.likeCount,
        comments: v.statistics.commentCount,
        publishedAt: v.snippet.publishedAt
      }))
    });

  } catch (error: any) {
    console.error("YouTube Channel Audit Error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/youtube/keywords", async (req, res) => {
  const { q, regionCode = "IN", relevanceLanguage = "hi" } = req.query;

  if (!q) {
    return res.status(400).json({ error: "Query parameter 'q' is required" });
  }

  if (!YOUTUBE_API_KEY) {
    console.warn("YOUTUBE_API_KEY is not configured. Using mock data for demonstration.");
    return res.json({
      query: q,
      region: regionCode,
      language: relevanceLanguage,
      category: "Demo",
      kdScore: 25,
      isLowCompetition: true,
      metrics: {
        avgViews: 12500,
        avgSubs: 45000,
      },
      results: [
        {
          id: "demo1",
          title: "How to Grow on YouTube (Demo Data)",
          channelTitle: "Creator Academy",
          channelId: "UCxxx",
          publishTime: new Date().toISOString(),
          viewCount: 15000,
          subscriberCount: 50000,
          thumbnail: "https://picsum.photos/seed/demo1/200/120",
        },
        {
          id: "demo2",
          title: "YouTube SEO Secrets 2024",
          channelTitle: "Growth Master",
          channelId: "UCyyy",
          publishTime: new Date().toISOString(),
          viewCount: 8000,
          subscriberCount: 12000,
          thumbnail: "https://picsum.photos/seed/demo2/200/120",
        }
      ]
    });
  }

  try {
    // 1. Search for videos with region and language filters
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(q as string)}&type=video&order=relevance&maxResults=30&regionCode=${regionCode}&relevanceLanguage=${relevanceLanguage}&key=${YOUTUBE_API_KEY}`;
    const searchResponse = await fetch(searchUrl);
    const searchData = (await searchResponse.json()) as any;

    if (searchData.error) {
      throw new Error(searchData.error.message);
    }

    if (!searchData.items || searchData.items.length === 0) {
      return res.json({
        query: q,
        region: regionCode,
        language: relevanceLanguage,
        category: "N/A",
        kdScore: 0,
        isLowCompetition: false,
        isHighOpportunity: false,
        metrics: {
          avgViews: 0,
          avgSubs: 0,
        },
        results: []
      });
    }

    const videoIds = searchData.items.map((item: any) => item.id.videoId).join(",");
    const channelIds = [...new Set(searchData.items.map((item: any) => item.snippet.channelId))].join(",");

    // 2. Get video statistics (views)
    const videoStatsUrl = `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoIds}&key=${YOUTUBE_API_KEY}`;
    const videoStatsResponse = await fetch(videoStatsUrl);
    const videoStatsData = (await videoStatsResponse.json()) as any;

    // 3. Get channel statistics (subscribers)
    const channelStatsUrl = `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${channelIds}&key=${YOUTUBE_API_KEY}`;
    const channelStatsResponse = await fetch(channelStatsUrl);
    const channelStatsData = (await channelStatsResponse.json()) as any;

    // Map stats for easy lookup
    const videoStatsMap = (videoStatsData.items || []).reduce((acc: any, item: any) => {
      acc[item.id] = item.statistics;
      return acc;
    }, {});

    const channelStatsMap = (channelStatsData.items || []).reduce((acc: any, item: any) => {
      acc[item.id] = item.statistics;
      return acc;
    }, {});

    // 4. Process results and calculate KD Score
    const results = searchData.items.map((item: any) => {
      const stats = videoStatsMap[item.id.videoId] || {};
      const channelStats = channelStatsMap[item.snippet.channelId] || {};
      
      return {
        id: item.id.videoId,
        title: decodeHtmlEntities(item.snippet.title),
        channelTitle: item.snippet.channelTitle,
        channelId: item.snippet.channelId,
        publishTime: item.snippet.publishTime,
        viewCount: parseInt(stats.viewCount || "0"),
        subscriberCount: parseInt(channelStats.subscriberCount || "0"),
        thumbnail: item.snippet.thumbnails.medium.url,
      };
    });

    // Competition Analysis (Top 5)
    const top5 = results.slice(0, 5);
    const smallChannelsRanking = top5.some((v: any) => v.subscriberCount < 100000);
    const highOpportunity = top5.some((v: any) => v.subscriberCount < 50000);
    
    const avgViews = results.reduce((sum: number, v: any) => sum + v.viewCount, 0) / results.length;
    const avgSubs = results.reduce((sum: number, v: any) => sum + v.subscriberCount, 0) / results.length;

    // KD Score Logic (0-100)
    let kdScore = 50;
    if (highOpportunity) kdScore = 20;
    else if (smallChannelsRanking) kdScore = 40;
    
    if (avgViews < 50000) kdScore -= 10;
    if (avgSubs > 500000) kdScore += 20;
    
    // Clamp KD Score
    kdScore = Math.max(0, Math.min(100, kdScore));

    // Category Detection
    const queryLower = (q as string).toLowerCase();
    let category = "General";
    if (queryLower.includes("ipl") || queryLower.includes("cricket") || queryLower.includes("football") || queryLower.includes("sports")) category = "Sports";
    else if (queryLower.includes("gaming") || queryLower.includes("minecraft") || queryLower.includes("roblox")) category = "Gaming";
    else if (queryLower.includes("tech") || queryLower.includes("iphone") || queryLower.includes("review")) category = "Tech";
    else if (queryLower.includes("how to") || queryLower.includes("tutorial") || queryLower.includes("learn")) category = "Education";

    res.json({
      query: q,
      region: regionCode,
      language: relevanceLanguage,
      category,
      kdScore,
      isLowCompetition: smallChannelsRanking,
      isHighOpportunity: highOpportunity,
      metrics: {
        avgViews: Math.round(avgViews),
        avgSubs: Math.round(avgSubs),
      },
      results
    });

  } catch (error: any) {
    console.error("YouTube API Error:", error);
    res.status(500).json({ error: error.message });
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

// API Route for YouTube Video Info (for Downloader)
app.get("/api/youtube/video-info", async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: "URL is required" });

  try {
    let videoId = "";
    const urlStr = (url as string).trim();
    
    if (urlStr.includes("watch?v=")) {
      videoId = urlStr.split("watch?v=")[1].split("&")[0].split("/")[0];
    } else if (urlStr.includes("youtu.be/")) {
      videoId = urlStr.split("youtu.be/")[1].split("?")[0].split("/")[0];
    } else if (urlStr.includes("/shorts/")) {
      videoId = urlStr.split("/shorts/")[1].split("?")[0].split("/")[0];
    } else {
      // Try to treat as direct ID if it's 11 chars
      if (urlStr.length === 11) videoId = urlStr;
    }

    if (!videoId) throw new Error("Invalid YouTube URL");

    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${videoId}&key=${YOUTUBE_API_KEY}`
    );
    const data = await response.json() as any;

    if (!data.items || data.items.length === 0) {
      throw new Error("Video not found");
    }

    const video = data.items[0];
    const snippet = video.snippet;
    const contentDetails = video.contentDetails;

    // Convert ISO 8601 duration (PT1M30S) to readable format (1:30)
    const duration = contentDetails.duration
      .replace('PT', '')
      .replace('H', ':')
      .replace('M', ':')
      .replace('S', '')
      .split(':')
      .map((p: string) => p.padStart(2, '0'))
      .join(':')
      .replace(/^0/, '');

    res.json({
      title: decodeHtmlEntities(snippet.title),
      duration: duration,
      thumbnail: snippet.thumbnails.maxres?.url || snippet.thumbnails.high?.url || snippet.thumbnails.default?.url,
      isShort: duration.split(':').length === 1 || (duration.split(':').length === 2 && parseInt(duration.split(':')[0]) === 0 && parseInt(duration.split(':')[1]) <= 60),
      url: `https://www.youtube.com/watch?v=${videoId}`,
      channelTitle: snippet.channelTitle,
      publishedAt: snippet.publishedAt
    });
  } catch (error: any) {
    console.error("Error fetching video info:", error);
    res.status(500).json({ error: error.message || "Failed to fetch video info" });
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
