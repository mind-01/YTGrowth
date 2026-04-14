
export const generateLocalTitles = (topic: string) => {
  const templates = [
    `How to ${topic} in 2026 (Step-by-Step Guide)`,
    `Why Everyone is Talking About ${topic} Right Now!`,
    `I Tried ${topic} for 30 Days: Here's What Happened`,
    `The Secret to ${topic} That Nobody Tells You`,
    `5 Mistakes You're Making with ${topic} (And How to Fix Them)`,
    `${topic}: The Ultimate Beginner's Guide`,
    `Is ${topic} Actually Worth It? (Honest Review)`,
    `How I Mastered ${topic} in Just 7 Days`,
    `Top 10 ${topic} Tips for 2026`,
    `Stop Doing ${topic} Until You Watch This!`
  ];
  return templates.map(title => ({ title, ctr: Math.floor(Math.random() * 20) + 80 }));
};

export const generateLocalDescription = (topic: string) => {
  return `In this video, we dive deep into ${topic} and explore everything you need to know to succeed in 2026. Whether you're a beginner or an expert, these tips will help you master ${topic} and grow your channel.

🔥 What you'll learn:
- The basics of ${topic}
- Advanced strategies for ${topic}
- Common mistakes to avoid
- My personal tips for success

Don't forget to LIKE and SUBSCRIBE for more content on ${topic}!

#${topic.replace(/\s+/g, '')} #YouTubeGrowth #ContentCreator #2026`;
};

export const generateLocalViralHooks = (topic: string) => {
  return [
    {
      hook: `Did you know that most people fail at ${topic} because of one simple mistake?`,
      type: "Curiosity Gap",
      why: "It challenges the viewer's knowledge immediately."
    },
    {
      hook: `I spent 100 hours researching ${topic} so you don't have to.`,
      type: "Authority/Value",
      why: "It promises a high return on investment for the viewer's time."
    },
    {
      hook: `Stop scrolling! If you care about ${topic}, you need to see this.`,
      type: "Pattern Interrupt",
      why: "It uses a direct command to grab attention."
    }
  ];
};

export const generateLocalThumbnailText = (topic: string) => {
  const words = topic.split(' ');
  const mainWord = words[0].toUpperCase();
  return [
    `${mainWord} SECRET`,
    `STOP!`,
    `100% WORKS`,
    `EASY ${mainWord}`,
    `WHY?`,
    `FINALLY!`,
    `DON'T DO THIS`
  ];
};

export const generateLocalHashtags = (topic: string) => {
  const base = topic.toLowerCase().replace(/\s+/g, '');
  return [
    `#${base}`,
    `#${base}2026`,
    `#${base}Tips`,
    `#${base}Guide`,
    `#${base}Tutorial`,
    `#YouTubeGrowth`,
    `#ContentCreator`,
    `#ViralVideo`,
    `#Trending`,
    `#GrowthHacks`
  ].join(' ');
};

export const analyzeLocalTitleScore = (title: string) => {
  const length = title.length;
  let score = 70;
  const analysis = [];

  if (length >= 20 && length <= 70) {
    score += 10;
    analysis.push("Perfect title length (20-70 chars).");
  } else {
    score -= 10;
    analysis.push("Title length is not optimal.");
  }

  const powerWords = ['secret', 'mistake', 'stop', 'how to', 'why', 'tried', 'mastered', 'ultimate', 'guide', '2026'];
  const hasPowerWord = powerWords.some(word => title.toLowerCase().includes(word));
  if (hasPowerWord) {
    score += 10;
    analysis.push("Contains high-CTR power words.");
  } else {
    analysis.push("Add power words like 'Secret' or 'Mistake' to increase CTR.");
  }

  if (/[A-Z]/.test(title)) {
    score += 5;
    analysis.push("Good use of capitalization.");
  }

  return {
    score: Math.min(100, score),
    analysis,
    suggestions: [
      "Try adding a number (e.g., '5 Tips').",
      "Use brackets or parentheses for extra context.",
      "Ensure the main keyword is at the beginning."
    ]
  };
};

export const generateLocalThumbnailIdeas = (topic: string) => {
  return [
    {
      conceptTitle: "The Shocking Reveal",
      layoutType: "Close-up",
      background: "Blurred background of a workspace or related setting.",
      subject: "A person with a surprised facial expression pointing at something.",
      textOverlay: "IT WORKS!",
      colors: ["#FF0000", "#FFFFFF", "#000000"],
      badges: ["High CTR", "Psychology Based"],
      emotionalHook: "Curiosity and Surprise"
    },
    {
      conceptTitle: "The Comparison",
      layoutType: "Comparison",
      background: "Split screen with 'Before' and 'After' labels.",
      subject: "A clear difference between two states related to the topic.",
      textOverlay: "BEFORE vs AFTER",
      colors: ["#00FF00", "#FF0000", "#FFFFFF"],
      badges: ["Trending Style", "Social Proof"],
      emotionalHook: "Desire for Transformation"
    }
  ];
};

export const generateLocalVideoIdeas = (niche: string) => {
  return [
    {
      title: `How to Start ${niche} in 2026`,
      brief: `A comprehensive guide for beginners looking to enter the ${niche} space this year.`,
      hook: `If you've ever wanted to start ${niche}, 2026 is the best time to do it.`,
      points: ["Market analysis", "Equipment needed", "First 30 days plan"],
      audience: "Beginners",
      format: "Long-form",
      difficulty: "Easy"
    },
    {
      title: `The Future of ${niche}: What's Changing?`,
      brief: `Exploring the latest trends and shifts in the ${niche} industry.`,
      hook: `The world of ${niche} is changing faster than ever before.`,
      points: ["New technologies", "Audience shifts", "Sustainability"],
      audience: "Enthusiasts",
      format: "Long-form",
      difficulty: "Medium"
    }
  ];
};

export const generateLocalShortsIdeas = (topic: string) => {
  return [
    {
      title: `${topic} Hack You Didn't Know!`,
      hook: `Stop doing ${topic} the hard way!`,
      script: `Did you know you can save hours on ${topic} by just doing this one simple trick? [Show trick] Try it out and let me know!`,
      visuals: "Fast cuts, text overlays, high energy."
    },
    {
      title: `3 Tips for Better ${topic}`,
      hook: `Want to improve your ${topic}? Here are 3 tips.`,
      script: `Tip 1: [Tip]. Tip 2: [Tip]. Tip 3: [Tip]. Follow for more!`,
      visuals: "Numbered list on screen, b-roll of the process."
    }
  ];
};

export const analyzeLocalSentiment = (text: string) => {
  const positiveWords = ['good', 'great', 'awesome', 'amazing', 'love', 'best', 'helpful', 'thanks', 'wow', 'nice', 'excellent', 'perfect'];
  const negativeWords = ['bad', 'worst', 'hate', 'useless', 'terrible', 'boring', 'slow', 'wrong', 'poor', 'disappointed', 'fail'];
  
  const words = text.toLowerCase().split(/\W+/);
  let positiveCount = 0;
  let negativeCount = 0;
  
  words.forEach(word => {
    if (positiveWords.includes(word)) positiveCount++;
    if (negativeWords.includes(word)) negativeCount++;
  });
  
  const total = positiveCount + negativeCount || 1;
  const positivePercent = Math.round((positiveCount / total) * 100);
  const negativePercent = Math.round((negativeCount / total) * 100);
  const neutralPercent = 100 - positivePercent - negativePercent;

  return {
    sentiment: {
      positive: positivePercent,
      neutral: neutralPercent,
      negative: negativePercent
    },
    analysis: [
      { 
        title: "Top Feedback", 
        content: positivePercent > 50 ? "Audience loves the clarity and value of your content." : "Audience is looking for more depth and practical examples." 
      },
      { 
        title: "Improvements", 
        content: negativePercent > 20 ? "Address the concerns about video length and pacing." : "Consider adding more interactive elements to boost engagement." 
      },
      { 
        title: "Reply Suggestion", 
        content: "Thank your supporters and ask a follow-up question to keep the conversation going." 
      }
    ]
  };
};

export const generateLocalGlobalReach = (topic: string) => {
  return {
    globalDemand: 85,
    strategySummary: `The topic "${topic}" has significant international appeal, especially in tech-forward and emerging markets. Expanding your reach through localized content could double your views.`,
    topCountries: [
      { name: "United States", flag: "🇺🇸", reason: "High search volume for premium content." },
      { name: "India", flag: "🇮🇳", reason: "Massive audience growth in this niche." },
      { name: "United Kingdom", flag: "🇬🇧", reason: "Strong engagement from English-speaking viewers." }
    ],
    subtitleAdvice: [
      { language: "Spanish", reason: "Reach 500M+ viewers in Latin America and Spain." },
      { language: "Hindi", reason: "Capture the fastest-growing digital market." },
      { language: "Portuguese", reason: "High engagement rates from the Brazilian community." }
    ],
    bestTimeZones: [
      { zone: "EST (New York)", time: "10:00 AM", reason: "Morning peak for US East Coast." },
      { zone: "IST (Mumbai)", time: "8:30 PM", reason: "Prime time evening viewing in India." },
      { zone: "GMT (London)", time: "3:00 PM", reason: "Afternoon peak for European viewers." }
    ]
  };
};

export const generateLocalBestTime = (category: string, region: string) => {
  return {
    goldenSlot: "6:30 PM",
    heatmap: [
      { day: "Monday", morning: "Medium", afternoon: "Medium", evening: "Peak" },
      { day: "Tuesday", morning: "Low", afternoon: "Medium", evening: "Peak" },
      { day: "Wednesday", morning: "Medium", afternoon: "Peak", evening: "Peak" },
      { day: "Thursday", morning: "Low", afternoon: "Medium", evening: "Peak" },
      { day: "Friday", morning: "Medium", afternoon: "Peak", evening: "Peak" },
      { day: "Saturday", morning: "Peak", afternoon: "Peak", evening: "Medium" },
      { day: "Sunday", morning: "Peak", afternoon: "Medium", evening: "Low" }
    ],
    aiTips: [
      `For ${category} in ${region}, upload 2 hours before peak time to allow YouTube to index your video.`,
      "Weekend mornings are best for long-form educational content.",
      "Weekday evenings (6 PM - 9 PM) are ideal for entertainment and news."
    ]
  };
};

export const generateLocalTrendingTopics = (niche: string) => {
  return [
    { 
      topic: `${niche} in 2026`, 
      whyTrending: "New industry standards and technological shifts.", 
      searchVolume: "High", 
      contentAngle: "Predictive analysis and future-proofing guide.",
      viralScore: 92
    },
    { 
      topic: `Best ${niche} Tools`, 
      whyTrending: "Recent release of AI-powered productivity software.", 
      searchVolume: "Medium", 
      contentAngle: "Top 10 list with practical demonstrations.",
      viralScore: 78
    },
    { 
      topic: `${niche} for Beginners`, 
      whyTrending: "Massive influx of new creators in this space.", 
      searchVolume: "Very High", 
      contentAngle: "Step-by-step roadmap for absolute beginners.",
      viralScore: 85
    }
  ];
};

export const generateLocalAnalyticsDashboard = (channelName: string) => {
  return {
    channelInfo: {
      name: channelName || "Your Channel",
      subs: 12500,
      views: 450000,
      watchTime: 18200
    },
    growthData: [
      { month: 'Jan', views: 32000, subs: 800 },
      { month: 'Feb', views: 38000, subs: 950 },
      { month: 'Mar', views: 45000, subs: 1100 },
      { month: 'Apr', views: 42000, subs: 1050 },
      { month: 'May', views: 55000, subs: 1400 },
      { month: 'Jun', views: 62000, subs: 1600 }
    ],
    trafficSources: [
      { name: 'YouTube Search', value: 45 },
      { name: 'Suggested Videos', value: 30 },
      { name: 'External', value: 15 },
      { name: 'Direct', value: 10 }
    ],
    demographics: [
      { age: '18-24', percentage: 35 },
      { age: '25-34', percentage: 45 },
      { age: '35-44', percentage: 15 },
      { age: '45+', percentage: 5 }
    ],
    insights: [
      "Your search traffic is growing, indicating strong SEO.",
      "Audience retention drops at 2:30 mark in most videos.",
      "Highest engagement comes from the 25-34 age group."
    ],
    recommendations: [
      "Create more content around your top-performing keywords.",
      "Improve your video intros to boost early retention.",
      "Run a community poll to decide your next big project."
    ]
  };
};

export const generateLocalContentPlanner = (topic: string) => {
  return {
    planType: "Monthly",
    items: [
      { day: "Week 1", title: `Introduction to ${topic}`, description: "Comprehensive guide covering the basics and setting the stage." },
      { day: "Week 2", title: `Top 5 ${topic} Hacks`, description: "Fast-paced video showing quick wins and productivity tips." },
      { day: "Week 3", title: `Deep Dive: ${topic} Secrets`, description: "Advanced techniques and insider knowledge for experts." },
      { day: "Week 4", title: `Q&A: Everything about ${topic}`, description: "Addressing common community questions and clearing doubts." }
    ]
  };
};

export const generateLocalAudit = (channel: string) => {
  return {
    channelName: channel || "YouTube Channel",
    subscriberCount: 15000,
    totalViews: 450000,
    engagementRate: 4.2,
    consistencyScore: 85,
    seoScore: 78,
    retentionEstimate: 62,
    recentVideos: [
      { title: "My Latest Video", views: 12000, publishedAt: "2 days ago" },
      { title: "Growth Strategy", views: 8500, publishedAt: "1 week ago" }
    ],
    findings: {
      working: "Your niche focus is strong and titles are well-optimized for search.",
      notWorking: "Thumbnails lack emotional triggers and intros are slightly too long.",
      actionPlan: [
        "Improve thumbnail contrast and use larger text.",
        "Add a hook in the first 10 seconds of every video.",
        "Engage more with comments to boost engagement rate."
      ]
    }
  };
};

export const generateLocalMonetization = (channel: string) => {
  return {
    channelName: channel || "YouTube Channel",
    subscriberCount: 850,
    viewCount: 25000,
    watchTime: 1200,
    isMonetized: false,
    gapSubscribers: 150,
    gapWatchTime: 2800,
    profilePicture: "",
    roadmap: [
      "Create 3 more high-engagement videos this week.",
      "Optimize your top 5 videos for search to boost watch time.",
      "Promote your channel on social media to reach 1000 subs."
    ]
  };
};

export const generateLocalScriptOutline = (topic: string) => {
  return `# Script Outline: ${topic}

## 1. The Hook (0:00 - 0:45)
* Start with a shocking fact about ${topic}.
* Promise to reveal the secret by the end of the video.
* Quick intro: "Hi, I'm [Name], and today we're mastering ${topic}."

## 2. The Problem (0:45 - 2:30)
* Explain why most people fail at ${topic}.
* Share a personal story or common struggle.

## 3. The Solution (2:30 - 8:00)
* Step 1: The Basics of ${topic}.
* Step 2: Advanced ${topic} Techniques.
* Step 3: My #1 Secret Tip.

## 4. The Call to Action (8:00 - 9:00)
* Ask viewers to comment their thoughts on ${topic}.
* Subscribe for more ${topic} content.

## 5. The Outro (9:00 - 10:00)
* Summary of key points.
* Tease the next video.`;
};

export const generateLocalHooks = (topic: string) => {
  return [
    {
      hook: `If you're still doing ${topic} the old way, you're losing views.`,
      style: "Fear of Missing Out"
    },
    {
      hook: `I found a way to master ${topic} in half the time.`,
      style: "Value Proposition"
    },
    {
      hook: `Most people think ${topic} is hard, but they're wrong.`,
      style: "Controversial"
    }
  ];
};

export const generateLocalChannelNames = (topic: string) => {
  const base = topic.charAt(0).toUpperCase() + topic.slice(1);
  return [
    `${base} Mastery`,
    `${base} Hub`,
    `${base} Central`,
    `The ${base} Show`,
    `${base} Insider`,
    `${base} Lab`,
    `${base} Academy`,
    `Simply ${base}`,
    `${base} Pro`,
    `${base} Zone`
  ];
};

export const generateLocalCompetitorSpy = (topic: string) => {
  return {
    channelName: topic || "Competitor",
    trendingVideo: `How to Master ${topic} in 2026`,
    bestKeywords: `${topic}, tutorial, guide, 2026, tips`,
    thumbnailStyle: "High contrast, large text, emotional face",
    avgViews: 45000,
    viralPotential: 85,
    postingFrequency: "3 times per week"
  };
};

export const generateLocalThumbnailScore = (topic: string) => {
  return {
    overallScore: 85,
    ctrPredictability: 88,
    visualContrast: 82,
    mobileViewability: 90,
    aiTips: [
      "Increase the font size of the main text overlay.",
      "Use a high-contrast color for the background to make the subject pop.",
      "Add a 'surprised' face or a clear emotional hook to increase curiosity."
    ]
  };
};

export const generateLocalKeywordResearch = (query: string) => {
  return {
    query,
    kdScore: 35,
    isLowCompetition: true,
    isHighOpportunity: true,
    metrics: {
      avgViews: 125000,
      avgSubs: 45000
    },
    results: [
      { id: "1", title: `How to master ${query}`, viewCount: 250000, channelTitle: "Growth Pro" },
      { id: "2", title: `${query} for Beginners`, viewCount: 180000, channelTitle: "Easy Guide" },
      { id: "3", title: `Top 10 ${query} Tips`, viewCount: 95000, channelTitle: "Niche King" }
    ],
    suggestions: [
      `${query} tutorial`,
      `${query} 2026`,
      `${query} guide`,
      `best ${query} tools`,
      `${query} mistakes`
    ]
  };
};

export const generateLocalScrapeData = (url: string) => {
  const videoId = url.includes('v=') ? url.split('v=')[1].split('&')[0] : "dQw4w9WgXcQ";
  return {
    videoId,
    title: "YouTube Video Metadata",
    description: "This is a fallback description for the analyzed video.",
    tags: ["YouTube", "Growth", "Tutorial", "2026"],
    viewCount: "150000",
    publishDate: new Date().toISOString(),
    category: "Education",
    channelId: "UC1234567890",
    channelName: "YouTube Creator",
    thumbnails: {
      default: `https://i.ytimg.com/vi/${videoId}/default.jpg`,
      medium: `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`,
      high: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
      standard: `https://i.ytimg.com/vi/${videoId}/sddefault.jpg`,
      maxres: `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`
    }
  };
};


