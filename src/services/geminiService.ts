import { GoogleGenAI, Type } from "@google/genai";

let aiInstance: GoogleGenAI | null = null;

const getAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY_MISSING: Gemini API key is not configured in the environment.");
  }
  if (!aiInstance) {
    aiInstance = new GoogleGenAI({ apiKey });
  }
  return aiInstance;
};

export const generateTitles = async (topic: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-flash-latest",
    contents: `Generate 5 viral, high-CTR YouTube titles for the topic: "${topic}". Make them catchy and optimized for search.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.STRING,
        },
      },
    },
  });
  if (!response.text) throw new Error("No response from AI");
  return JSON.parse(response.text);
};

export const generateDescription = async (title: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-flash-latest",
    contents: `Create a professional YouTube video description for the title: "${title}". Include an intro, key points, timestamps placeholder, and hashtags.`,
  });
  return response.text || "No description generated.";
};

export const generateTags = async (topic: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-flash-latest",
    contents: `Generate a list of 20 relevant YouTube tags for the topic: "${topic}". Return them as a comma-separated list.`,
  });
  return response.text || "No tags generated.";
};

export const generateThumbnailScore = async (topic: string, imageData?: string, mimeType?: string) => {
  const ai = getAI();
  
  const parts: any[] = [
    { text: `Analyze this YouTube thumbnail image for the topic: "${topic}".
    
    Evaluate the following metrics (0-100):
    1. CTR Predictability: How likely is it to be clicked?
    2. Visual Contrast: Do the text and subject stand out?
    3. Mobile Viewability: Is it readable on small screens?
    
    Provide a list of specific "AI Tips" for improvement.
    
    Return a JSON object:
    {
      "ctrPredictability": number,
      "visualContrast": number,
      "mobileViewability": number,
      "overallScore": number,
      "aiTips": ["Tip 1", "Tip 2", "Tip 3"]
    }` }
  ];

  if (imageData && mimeType) {
    parts.push({
      inlineData: {
        data: imageData.split(',')[1], // Remove data:image/png;base64,
        mimeType: mimeType
      }
    });
  }

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: { parts },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          ctrPredictability: { type: Type.NUMBER },
          visualContrast: { type: Type.NUMBER },
          mobileViewability: { type: Type.NUMBER },
          overallScore: { type: Type.NUMBER },
          aiTips: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["ctrPredictability", "visualContrast", "mobileViewability", "overallScore", "aiTips"]
      }
    }
  });
  
  if (!response.text) throw new Error("No response from AI");
  return JSON.parse(response.text);
};

export const generateThumbnailIdeas = async (topic: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-flash-latest",
    contents: `Generate 4 professional YouTube thumbnail concepts for: "${topic}".
    For each concept, provide:
    - conceptTitle: A short, punchy name for the layout.
    - layoutType: One of ["Split Screen", "Close-up", "Comparison", "Action Shot", "Minimalist"].
    - background: Detailed description of the background elements.
    - subject: Detailed description of the main person or object.
    - textOverlay: The exact text to show and its styling (color, font style).
    - colors: An array of 3 hex codes or color names representing the palette.
    - badges: An array of 2-3 badges from ["High CTR", "Psychology Based", "Trending Style", "Curiosity Gap", "Social Proof"].
    - emotionalHook: The psychological trigger used.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            conceptTitle: { type: Type.STRING },
            layoutType: { type: Type.STRING },
            background: { type: Type.STRING },
            subject: { type: Type.STRING },
            textOverlay: { type: Type.STRING },
            colors: { type: Type.ARRAY, items: { type: Type.STRING } },
            badges: { type: Type.ARRAY, items: { type: Type.STRING } },
            emotionalHook: { type: Type.STRING }
          },
          required: ["conceptTitle", "layoutType", "background", "subject", "textOverlay", "colors", "badges", "emotionalHook"]
        },
      },
    },
  });
  if (!response.text) throw new Error("No response from AI");
  return JSON.parse(response.text);
};

export const analyzeThumbnail = async (topic: string, title: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-flash-latest",
    contents: `Analyze the potential CTR for a YouTube thumbnail with the title "${title}" on the topic "${topic}". Provide a score out of 100 and 3 suggestions for improvement.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.NUMBER },
          suggestions: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ["score", "suggestions"]
      },
    },
  });
  if (!response.text) throw new Error("No response from AI");
  return JSON.parse(response.text);
};

export const generateVideoIdeas = async (niche: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-flash-latest",
    contents: `Generate 10 trending YouTube video ideas for the niche: "${niche}". 
    For each idea, provide:
    - A bold, catchy title.
    - A clear 2-3 sentence brief of the video concept.
    - A suggested hook (the first 5 seconds script).
    - 3 main bullet points to cover.
    - Target audience description.
    - Format (Shorts or Long-form).
    - Difficulty (Easy, Medium, or Hard).
    - Potential (Viral Potential or Search Based).`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            hook: { type: Type.STRING },
            keyPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
            targetAudience: { type: Type.STRING },
            format: { type: Type.STRING, enum: ["Shorts", "Long-form"] },
            difficulty: { type: Type.STRING, enum: ["Easy", "Medium", "Hard"] },
            potential: { type: Type.STRING, enum: ["Viral Potential", "Search Based"] }
          },
          required: ["title", "description", "hook", "keyPoints", "targetAudience", "format", "difficulty", "potential"]
        },
      },
    },
  });
  if (!response.text) throw new Error("No response from AI");
  return JSON.parse(response.text);
};

export const generateHashtags = async (topic: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-flash-latest",
    contents: `Generate 10 trending and relevant hashtags for a YouTube video about: "${topic}". Return them as a space-separated list starting with #.`,
  });
  return response.text || "No hashtags generated.";
};

export const generateChannelNames = async (input: string, niche: string, tone: string, language: string, length: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-flash-latest",
    contents: `Generate 10 creative, high-quality, and catchy YouTube channel name ideas.
    
    Topic/Keywords: "${input}"
    Niche: "${niche}"
    Tone/Style: "${tone}"
    Target Language: "${language}"
    Name Length: ${length === '1' ? 'Single Word (Powerful, brandable)' : 'Two Words (Standard combinations)'}
    
    Quality Guidelines:
    - Avoid generic, boring, or common names.
    - Use creative adjectives and strong nouns.
    - If Name Length is '1': Generate powerful single words (e.g., Nexa, Techy, Foody, गुरू, क्रांति).
    - If Name Length is '2': Generate standard combinations (e.g., Tech Mastery, Digital Veda, टेक गुरु).
    - If Language is 'Hindi': Generate names in Hindi script.
    - If Language is 'English': Generate names in English.
    - If Language is 'Hinglish': Generate catchy mixes of Hindi and English.
    - Ensure names are memorable, brandable, and unique.
    
    For each name, provide:
    1. The channel name.
    2. A simulated "Availability" status (randomly assign "Available" or "Taken").
    3. A "Why/Meaning" explanation in English.
    
    Return a JSON array of objects:
    [
      {
        "name": "Channel Name",
        "availability": "Available" | "Taken",
        "meaning": "Explanation of why this name works"
      },
      ...
    ]`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            availability: { type: Type.STRING, enum: ["Available", "Taken"] },
            meaning: { type: Type.STRING }
          },
          required: ["name", "availability", "meaning"]
        }
      },
    },
  });
  if (!response.text) throw new Error("No response from AI");
  return JSON.parse(response.text);
};

export const generateShortsIdeas = async (topic: string, language: string = 'Hinglish') => {
  const ai = getAI();
  
  let languageInstruction = "";
  if (language === 'English') {
    languageInstruction = "Write as a native American English speaker. Use high-energy, fast-paced YouTube slang (e.g., 'You won't believe this', 'Stop scrolling'). Zero Hindi words allowed. Focus on global viral trends. Tone: Catchy and viral.";
  } else if (language === 'Hindi') {
    languageInstruction = "Write everything in Pure Hindi (Devanagari script). Focus on formal and easy-to-understand Hindi.";
  } else {
    languageInstruction = "Write in a natural mix of Hindi and English (Hinglish). Use words like 'Doston', 'Secret batata hoon', 'Check karein'. Keep the tone relatable for the Indian creator community.";
  }

  const response = await ai.models.generateContent({
    model: "gemini-flash-latest",
    contents: `Generate 5 viral YouTube Shorts ideas for the topic: "${topic}". Focus on high retention and engagement. 
    
    LANGUAGE REQUIREMENT:
    ${languageInstruction}

    TIMING & WORD COUNT ENFORCEMENT:
    - The total word count for the entire script (Hook + Twist + CTA) MUST NOT exceed 65 words.
    - Structure:
      * Hook (0-5s): Must be exactly 5 seconds of speaking time.
      * The Twist/Value (5-25s): Must be exactly 20 seconds of speaking time.
      * Call-to-Action (CTA) (25-30s): Must be exactly 5 seconds of speaking time.

    For each idea, provide:
    1. A viral title.
    2. A target audience description.
    3. A style tag (one of: POV Style 🎥, Educational 💡, Listicle 🔟, Storytelling 📖).
    4. A Trend Score (one of: 🔥 Trending Now, 📈 High Engagement).
    5. A Retention Blueprint consisting of:
       - Hook (0-5s): Must-see opening shot/line to stop the scroll.
       - The Twist/Value (5-25s): The main value or surprising element.
       - Call-to-Action (CTA) (25-30s): Specific way to ask for likes/subs in 1 second.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            targetAudience: { type: Type.STRING },
            styleTag: { type: Type.STRING },
            trendScore: { type: Type.STRING },
            hook: { type: Type.STRING },
            twist: { type: Type.STRING },
            cta: { type: Type.STRING }
          },
          required: ["title", "targetAudience", "styleTag", "trendScore", "hook", "twist", "cta"]
        },
      },
    },
  });
  if (!response.text) throw new Error("No response from AI");
  return JSON.parse(response.text);
};

export const generateHooks = async (topic: string, length: string = '5', language: string = 'Hinglish') => {
  const ai = getAI();
  
  let languageInstruction = "";
  if (language === 'English') {
    languageInstruction = "Write in 100% formal/slang American English. No Hindi influence.";
  } else if (language === 'Hindi') {
    languageInstruction = "Write in Pure Hindi (Devanagari script).";
  } else {
    languageInstruction = "Write in a natural mix of Hindi and English (Hinglish).";
  }

  let lengthInstruction = "";
  if (length === '1') {
    lengthInstruction = "Generate an ultra-short, punchy 1-sentence hook (exactly 1 line). Perfect for fast scrolling.";
  } else if (length === '2') {
    lengthInstruction = "Generate a short, punchy 1-2 sentence hook (approx 2 lines). Perfect for Shorts.";
  } else if (length === '5') {
    lengthInstruction = "Generate a standard opening with a build-up (approx 5 lines).";
  } else if (length === '10') {
    lengthInstruction = "Generate a deep storytelling hook (approx 10 lines). Perfect for Long-form/Documentary style.";
  }

  const effectiveFormat = (length === '5' || length === '10') ? 'Long-form' : 'Short';

  const response = await ai.models.generateContent({
    model: "gemini-flash-latest",
    contents: `Generate 5 powerful script hooks for a ${effectiveFormat} YouTube video about: "${topic}". 
    
    LANGUAGE: ${languageInstruction}
    LENGTH: ${lengthInstruction}
    
    Each hook must be attention-grabbing and optimized for high retention.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: { type: Type.STRING }
      },
    },
  });
  if (!response.text) throw new Error("No response from AI");
  return JSON.parse(response.text);
};

export const generateSEOChecklist = async (url: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-flash-latest",
    contents: `Analyze the YouTube video at this URL for SEO: "${url}". 
    Return a JSON object with the following structure:
    {
      "videoInfo": {
        "title": "Video Title",
        "thumbnail": "https://picsum.photos/seed/yt/200/120",
        "views": "1.2K",
        "likes": "150"
      },
      "score": 8,
      "checklist": [
        { "label": "Video Title: 60 characters?", "status": "fail" },
        { "label": "Description: 2000 characters?", "status": "pass" },
        { "label": "Great Quality Tags?", "status": "pass" },
        { "label": "HD Thumbnail Resolution?", "status": "pass" },
        { "label": "Clear HD Video Quality?", "status": "pass" },
        { "label": "Useful Links in Description?", "status": "pass" },
        { "label": "Broken Links in Description?", "status": "fail" },
        { "label": "Strong Quality Keywords?", "status": "pass" },
        { "label": "Easy Captions & Transcriptions?", "status": "pass" },
        { "label": "Detailed Timestamp Chapters?", "status": "pass" }
      ]
    }
    Ensure the checklist has exactly 10 items as listed. Simulate the analysis if you cannot access the live URL.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          videoInfo: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              thumbnail: { type: Type.STRING },
              views: { type: Type.STRING },
              likes: { type: Type.STRING }
            },
            required: ["title", "thumbnail", "views", "likes"]
          },
          score: { type: Type.NUMBER },
          checklist: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                label: { type: Type.STRING },
                status: { type: Type.STRING, enum: ["pass", "fail"] }
              },
              required: ["label", "status"]
            }
          }
        },
        required: ["videoInfo", "score", "checklist"]
      }
    }
  });
  if (!response.text) throw new Error("No response from AI");
  return JSON.parse(response.text);
};

export const enhanceKeywordResearch = async (topic: string, youtubeData: any) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-flash-latest",
    contents: `Based on this YouTube search data for "${topic}":
    ${JSON.stringify(youtubeData.results.slice(0, 10))}
    
    Generate:
    1. 10-15 Related LSI Tags for the video description.
    2. 5 Optimized Viral Title Suggestions.
    3. 3 "Sweet Spot" long-tail keywords.
    
    Return a JSON object:
    {
      "relatedTags": "tag1, tag2, ...",
      "optimizedTitles": ["Title 1", ...],
      "sweetSpotKeywords": ["Keyword 1", ...]
    }`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          relatedTags: { type: Type.STRING },
          optimizedTitles: { type: Type.ARRAY, items: { type: Type.STRING } },
          sweetSpotKeywords: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["relatedTags", "optimizedTitles", "sweetSpotKeywords"]
      }
    }
  });
  if (!response.text) throw new Error("No response from AI");
  return JSON.parse(response.text);
};

export const generateScriptOutline = async (input: string, language: string = 'Hinglish') => {
  const ai = getAI();
  
  let languageInstruction = "";
  if (language === 'English') {
    languageInstruction = "CRITICAL: Write the entire script and blueprint in 100% formal English. Do not use any Hindi or Hinglish words. Every single word must be in English.";
  } else if (language === 'Hindi') {
    languageInstruction = "Write the entire script in Pure Hindi (Devanagari script). Focus on formal and easy-to-understand Hindi. Do not use English words unless they are technical terms with no Hindi equivalent.";
  } else {
    languageInstruction = "Use a mix of Hindi and English (Hinglish) as commonly used by Indian YouTubers. Use Hindi for the main narrative and English for technical or common modern terms.";
  }

  const response = await ai.models.generateContent({
    model: "gemini-flash-latest",
    contents: `You are a professional YouTube Script Writer. Write a detailed, engaging video script based on the following information:
    
    ${input}
    
    The script should include:
    1. A high-energy Intro (Hook).
    2. 3-5 detailed Main Points with transitions.
    3. A strong Outro with a Call to Action (CTA).
    
    LANGUAGE REQUIREMENT:
    ${languageInstruction}
    
    Format the output using clear Markdown headings and bullet points.`,
  });
  if (!response.text) throw new Error("No script generated by AI");
  return response.text;
};

export const generateBestTimeToPost = async (category: string, region: string) => {
  const ai = getAI();
  const currentTime = "2026-02-28T00:59:08-08:00"; // From metadata
  
  const response = await ai.models.generateContent({
    model: "gemini-flash-latest",
    contents: `Analyze the best time to post on YouTube for the category: "${category}" in the region: "${region}".
    Current local time is: ${currentTime}.
    
    Provide:
    1. A "GOLDEN SLOT" for today (e.g., "6:30 PM IST").
    2. A weekly heatmap data for all 7 days. For each day, provide activity levels (Peak, Medium, Low) for 3 time slots: Morning (6AM-12PM), Afternoon (12PM-6PM), and Evening (6PM-12AM).
    3. 3 actionable AI tips for scheduling in this category/region.
    
    Return a JSON object:
    {
      "goldenSlot": string,
      "heatmap": [
        { "day": "Monday", "morning": "Low", "afternoon": "Medium", "evening": "Peak" },
        ...
      ],
      "aiTips": ["Tip 1", "Tip 2", "Tip 3"]
    }`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          goldenSlot: { type: Type.STRING },
          heatmap: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                day: { type: Type.STRING },
                morning: { type: Type.STRING, enum: ["Peak", "Medium", "Low"] },
                afternoon: { type: Type.STRING, enum: ["Peak", "Medium", "Low"] },
                evening: { type: Type.STRING, enum: ["Peak", "Medium", "Low"] }
              },
              required: ["day", "morning", "afternoon", "evening"]
            }
          },
          aiTips: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["goldenSlot", "heatmap", "aiTips"]
      }
    }
  });
  if (!response.text) throw new Error("No response from AI");
  return JSON.parse(response.text);
};

export const analyzeChannelMonetization = async (channelUrl: string, language: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analyze this YouTube channel for monetization status and growth: ${channelUrl}.
    
    Target Language for advice: ${language}
    
    Tasks:
    1. Identify Channel Name and Profile Picture URL (if possible, else use a placeholder).
    2. Get/Estimate Subscriber Count.
    3. Estimate Watch Time (based on video count/length/views if public).
    4. Determine if they meet the 1000 subs / 4000 hours threshold.
    5. Calculate the "Gap" to the next milestone.
    6. Provide a 5-step roadmap to reach/surpass monetization.
    
    Return a JSON object:
    {
      "channelName": string,
      "profilePicture": string (URL),
      "subscriberCount": number,
      "watchTime": number (hours),
      "isMonetized": boolean,
      "gapSubscribers": number,
      "gapWatchTime": number,
      "roadmap": [
        "Step 1: AI Advice...",
        "Step 2: AI Advice...",
        "Step 3: AI Advice...",
        "Step 4: AI Advice...",
        "Step 5: AI Advice..."
      ]
    }
    
    LANGUAGE INSTRUCTIONS:
    - If language is 'Hindi', write the 'roadmap' steps in Hindi (Devanagari).
    - If language is 'English', write the 'roadmap' steps in English.`,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          channelName: { type: Type.STRING },
          profilePicture: { type: Type.STRING },
          subscriberCount: { type: Type.NUMBER },
          watchTime: { type: Type.NUMBER },
          isMonetized: { type: Type.BOOLEAN },
          gapSubscribers: { type: Type.NUMBER },
          gapWatchTime: { type: Type.NUMBER },
          roadmap: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["channelName", "profilePicture", "subscriberCount", "watchTime", "isMonetized", "gapSubscribers", "gapWatchTime", "roadmap"]
      }
    }
  });
  if (!response.text) throw new Error("No response from AI");
  return JSON.parse(response.text);
};

export const generateChannelAudit = async (channelUrl: string, channelData: any, language: string = 'English') => {
  const ai = getAI();
  
  let languageInstruction = "";
  if (language === 'English') {
    languageInstruction = "Write all findings, working points, and action plans in 100% English.";
  } else if (language === 'Hindi') {
    languageInstruction = "Write all findings, working points, and action plans in Pure Hindi (Devanagari script).";
  } else {
    languageInstruction = "Write all findings, working points, and action plans in Hinglish (a mix of Hindi and English as commonly used by Indian creators).";
  }

    const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analyze this YouTube channel for a comprehensive health audit: ${channelUrl}.
    
    Current Channel Data from API:
    ${JSON.stringify(channelData, null, 2)}
    
    Tasks:
    1. Evaluate the SEO Score (0-100) based on typical title/tags/description quality for this niche.
    2. Estimate Audience Retention (0-100) based on video lengths and typical performance in this category.
    3. Identify "What's Working": The strongest aspect of the channel.
    4. Identify "What's Not": The biggest weaknesses or missing elements.
    5. Create an "Action Plan": Specific steps for the next 30 days.
    
    LANGUAGE REQUIREMENT:
    ${languageInstruction}
    
    Return a JSON object:
    {
      "engagementRate": number (percentage, e.g., 4.5),
      "consistencyScore": number (0-100),
      "seoScore": number (0-100),
      "retentionEstimate": number (0-100),
      "findings": {
        "working": string,
        "notWorking": string,
        "actionPlan": string[]
      }
    }
    
    Note: Use the provided channelData to inform your scores, especially for engagement and consistency if available. If not, use your search capabilities to estimate.`,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          engagementRate: { type: Type.NUMBER },
          consistencyScore: { type: Type.NUMBER },
          seoScore: { type: Type.NUMBER },
          retentionEstimate: { type: Type.NUMBER },
          findings: {
            type: Type.OBJECT,
            properties: {
              working: { type: Type.STRING },
              notWorking: { type: Type.STRING },
              actionPlan: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["working", "notWorking", "actionPlan"]
          }
        },
        required: ["engagementRate", "consistencyScore", "seoScore", "retentionEstimate", "findings"]
      }
    }
  });
  if (!response.text) throw new Error("No response from AI");
  return JSON.parse(response.text);
};

export const generateCompetitorSpy = async (query: string, competitorData: any, language: string = 'English') => {
  const ai = getAI();
  
  let languageInstruction = "";
  if (language === 'English') {
    languageInstruction = "Write the entire report in 100% English. Use professional marketing terminology.";
  } else if (language === 'Hindi') {
    languageInstruction = "Write the entire report in Pure Hindi (Devanagari script).";
  } else {
    languageInstruction = "Write the entire report in Hinglish (a mix of Hindi and English as commonly used by Indian creators).";
  }

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analyze this YouTube competitor data for: "${query}".
    
    Competitor Data from API:
    ${JSON.stringify(competitorData, null, 2)}
    
    Tasks:
    1. Identify the "Trending Video": Which video from their recent list is performing best relative to others?
    2. Identify "Best Keywords": Based on their titles, what keywords are they likely ranking for?
    3. Analyze "Thumbnail Style": Based on common patterns in their titles and niche, describe their likely thumbnail strategy.
    4. Calculate "Viral Potential" (0-100) based on their average views vs subscriber count.
    
    LANGUAGE REQUIREMENT:
    ${languageInstruction}
    
    Return a JSON object:
    {
      "trendingVideo": string,
      "bestKeywords": string,
      "thumbnailStyle": string,
      "viralPotential": number,
      "avgViews": number,
      "postingFrequency": string
    }
    
    Note: Use the provided competitorData to inform your analysis. If data is limited, use your knowledge of the niche to provide high-quality insights.`,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          trendingVideo: { type: Type.STRING },
          bestKeywords: { type: Type.STRING },
          thumbnailStyle: { type: Type.STRING },
          viralPotential: { type: Type.NUMBER },
          avgViews: { type: Type.NUMBER },
          postingFrequency: { type: Type.STRING }
        },
        required: ["trendingVideo", "bestKeywords", "thumbnailStyle", "viralPotential", "avgViews", "postingFrequency"]
      }
    }
  });
  if (!response.text) throw new Error("No response from AI");
  return JSON.parse(response.text);
};

export const generateTrendingTopics = async (niche: string, timeFrame: string, location: string, language: string) => {
  const ai = getAI();
  
  let languageInstruction = "";
  if (language === 'English') {
    languageInstruction = "Write the entire report in 100% English.";
  } else if (language === 'Hindi') {
    languageInstruction = "Write the entire report in Pure Hindi (Devanagari script).";
  } else {
    languageInstruction = "Write the entire report in Hinglish (a mix of Hindi and English).";
  }

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Find the most viral and trending YouTube topics for the niche: "${niche}".
    
    Filters:
    - Time Frame: ${timeFrame}
    - Location: ${location}
    
    Tasks:
    1. Identify 5 "HOT TOPICS" that are currently viral or rising in this niche.
    2. For each topic, explain "Why it's trending".
    3. Estimate "Search Volume" (High, Medium, Low).
    4. Provide a unique "Content Angle" (AI-powered idea on how to make a video on this).
    5. Calculate a "Viral Score" (0-100%) indicating how quickly a video on this could go viral.
    
    LANGUAGE REQUIREMENT:
    ${languageInstruction}
    
    Return a JSON array of objects:
    [
      {
        "topic": "Topic Name",
        "whyTrending": "Explanation",
        "searchVolume": "High" | "Medium" | "Low",
        "contentAngle": "Unique video idea",
        "viralScore": number (0-100)
      },
      ...
    ]`,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            topic: { type: Type.STRING },
            whyTrending: { type: Type.STRING },
            searchVolume: { type: Type.STRING, enum: ["High", "Medium", "Low"] },
            contentAngle: { type: Type.STRING },
            viralScore: { type: Type.NUMBER }
          },
          required: ["topic", "whyTrending", "searchVolume", "contentAngle", "viralScore"]
        }
      }
    }
  });
  if (!response.text) throw new Error("No response from AI");
  return JSON.parse(response.text);
};

export const generateCommentSentiment = async (url: string, language: string = 'Hinglish') => {
  const ai = getAI();
  
  let languageInstruction = "";
  if (language === 'English' || language === 'en') {
    languageInstruction = "Write the entire analysis in 100% English.";
  } else if (language === 'Hindi' || language === 'hi') {
    languageInstruction = "Write the entire analysis in Pure Hindi (Devanagari script).";
  } else {
    languageInstruction = "Write the entire analysis in Hinglish (a mix of Hindi and English).";
  }

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analyze the audience sentiment and comments for the YouTube video at this URL: "${url}".
    
    Tasks:
    1. Perform a sentiment analysis on the comments.
    2. Calculate percentages for Positive, Neutral, and Negative sentiments.
    3. Identify "Top Feedback": What people love most.
    4. Identify "Improvements": What the audience suggests or dislikes.
    5. Provide "Reply Suggestions": Which types of comments should be prioritized for replies.
    
    LANGUAGE REQUIREMENT:
    ${languageInstruction}
    
    Return a JSON object:
    {
      "sentiment": {
        "positive": number (percentage, e.g., 75),
        "neutral": number (percentage, e.g., 15),
        "negative": number (percentage, e.g., 10)
      },
      "analysis": [
        { "title": "Top Feedback", "content": "Detailed feedback text..." },
        { "title": "Improvements", "content": "Detailed improvement suggestions..." },
        { "title": "Reply Suggestion", "content": "Detailed reply strategy..." }
      ]
    }
    
    Note: If you cannot access live comments, simulate a realistic analysis based on typical audience behavior for the niche of the video.`,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          sentiment: {
            type: Type.OBJECT,
            properties: {
              positive: { type: Type.NUMBER },
              neutral: { type: Type.NUMBER },
              negative: { type: Type.NUMBER }
            },
            required: ["positive", "neutral", "negative"]
          },
          analysis: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                content: { type: Type.STRING }
              },
              required: ["title", "content"]
            }
          }
        },
        required: ["sentiment", "analysis"]
      }
    }
  });
  if (!response.text) throw new Error("No response from AI");
  return JSON.parse(response.text);
};

export const generateGlobalReach = async (topic: string, language: string = 'Hinglish') => {
  const ai = getAI();
  
  let languageInstruction = "";
  if (language === 'English' || language === 'en') {
    languageInstruction = "Write the entire analysis in 100% English.";
  } else if (language === 'Hindi' || language === 'hi') {
    languageInstruction = "Write the entire analysis in Pure Hindi (Devanagari script).";
  } else {
    languageInstruction = "Write the entire analysis in Hinglish (a mix of Hindi and English).";
  }

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Act as a YouTube Global Expansion Strategist. Analyze the international potential for a video about: "${topic}".
    
    Tasks:
    1. Calculate a 'Global Demand' score (0-100) based on international search volume and interest.
    2. Identify the top 3 countries where this video could go viral. Provide the country name, a flag emoji, and a brief reason why.
    3. Recommend 2 specific languages for subtitles to maximize reach.
    4. Suggest the best upload time zones and specific times for a global audience.
    
    LANGUAGE REQUIREMENT:
    ${languageInstruction}
    
    Return a JSON object:
    {
      "globalDemand": number (0-100),
      "topCountries": [
        { "name": "string", "flag": "string", "reason": "string" },
        { "name": "string", "flag": "string", "reason": "string" },
        { "name": "string", "flag": "string", "reason": "string" }
      ],
      "subtitleAdvice": [
        { "language": "string", "reason": "string" },
        { "language": "string", "reason": "string" }
      ],
      "bestTimeZones": [
        { "zone": "string", "time": "string", "reason": "string" }
      ],
      "strategySummary": "string"
    }`,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          globalDemand: { type: Type.NUMBER },
          topCountries: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                flag: { type: Type.STRING },
                reason: { type: Type.STRING }
              },
              required: ["name", "flag", "reason"]
            }
          },
          subtitleAdvice: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                language: { type: Type.STRING },
                reason: { type: Type.STRING }
              },
              required: ["language", "reason"]
            }
          },
          bestTimeZones: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                zone: { type: Type.STRING },
                time: { type: Type.STRING },
                reason: { type: Type.STRING }
              },
              required: ["zone", "time", "reason"]
            }
          },
          strategySummary: { type: Type.STRING }
        },
        required: ["globalDemand", "topCountries", "subtitleAdvice", "bestTimeZones", "strategySummary"]
      }
    }
  });

  if (!response.text) throw new Error("No response from AI");
  return JSON.parse(response.text);
};
