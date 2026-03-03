import React from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  FileText, 
  Tag, 
  Hash, 
  CheckSquare, 
  Search, 
  BarChart3, 
  Clock, 
  Lightbulb, 
  Zap, 
  TrendingUp, 
  Calculator, 
  Type as TypeIcon,
  Image as ImageIcon,
  MessageSquare,
  Globe,
  ShieldCheck,
  Eye,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

const ToolsGuide = () => {
  const categories = [
    {
      title: "CONTENT GENERATION",
      description: "Master the art of content creation with AI-powered tools that handle everything from viral titles to detailed script blueprints.",
      tools: [
        {
          id: 'title-gen',
          name: 'Title Generator',
          icon: Sparkles,
          description: "Our AI-driven Title Generator analyzes millions of high-performing YouTube videos to suggest titles that maximize Click-Through Rate (CTR). By understanding emotional triggers and search intent, it helps you craft headlines that are impossible to ignore. Whether you need something click-baity for entertainment or keyword-rich for education, this tool adapts to your specific niche requirements.",
          cta: 'Generate titles now',
          path: '/tool/title-gen'
        },
        {
          id: 'desc-gen',
          name: 'Description Generator',
          icon: FileText,
          description: "Writing SEO-friendly descriptions is time-consuming. Our generator creates comprehensive, keyword-optimized descriptions that help the YouTube algorithm understand your content better. It includes sections for timestamps, social links, and related videos, ensuring your metadata is complete and professional. Boost your search rankings and viewer engagement with perfectly structured text every time.",
          cta: 'Create descriptions',
          path: '/tool/desc-gen'
        },
        {
          id: 'tag-gen',
          name: 'Tag Generator',
          icon: Tag,
          description: "Tags are still a vital part of YouTube SEO. This tool extracts the most relevant and high-volume tags for your specific topic. It balances broad terms with long-tail keywords to ensure your video appears in both search results and the \"Suggested Videos\" sidebar. Stop guessing which tags work and start using data-backed metadata to drive consistent organic traffic.",
          cta: 'Find tags',
          path: '/tool/tag-gen'
        },
        {
          id: 'hook-gen',
          name: 'Script Hook Generator',
          icon: Zap,
          description: "The first 5 seconds determine if a viewer stays or leaves. Our Hook Generator provides multiple high-retention openings based on proven psychological patterns. From curiosity gaps to problem-solution frameworks, these hooks are designed to stop the scroll and skyrocket your average view duration. Perfect for both long-form content and fast-paced YouTube Shorts.",
          cta: 'Grab attention',
          path: '/tool/hook-gen'
        },
        {
          id: 'script-gen',
          name: 'Video Idea Blueprint',
          icon: FileText,
          description: "Transform a simple idea into a structured masterpiece. The Blueprint tool provides a comprehensive outline for your video, including introduction, key points, transitions, and calls to action. It ensures your content flows logically and keeps viewers engaged until the very end. Save hours of planning and start filming with a professional roadmap that guarantees quality.",
          cta: 'Plan your video',
          path: '/tool/script-gen'
        },
        {
          id: 'thumb-maker',
          name: 'Thumbnail AI Ideas',
          icon: ImageIcon,
          description: "Visual storytelling starts with the thumbnail. Our AI generates creative concepts and visual layouts tailored to your video topic. It suggests color palettes, text placement, and imagery that stand out in a crowded feed. Use these AI-generated concepts to brief your designer or create your own high-impact visuals that drive massive clicks.",
          cta: 'Get visual ideas',
          path: '/tool/thumb-maker'
        }
      ]
    },
    {
      title: "CHANNEL ANALYTICS",
      description: "Deep dive into your channel's performance with professional-grade diagnostic tools and real-time tracking.",
      tools: [
        {
          id: 'audit',
          name: 'Channel Audit',
          icon: ShieldCheck,
          description: "Get a comprehensive health check for your YouTube channel. Our Audit tool analyzes your branding, SEO consistency, and overall performance metrics to identify growth bottlenecks. It provides actionable recommendations on how to improve your channel authority and visibility. Stop wondering why you aren't growing and get a clear diagnostic report today.",
          cta: 'Audit now',
          path: '/tool/audit'
        },
        {
          id: 'monetization',
          name: 'Monetization Tracker',
          icon: Calculator,
          description: "Track your journey to the YouTube Partner Program with precision. This tool monitors your progress toward the 1,000 subscribers and 4,000 watch hours milestones in real-time. It provides projections on when you'll likely hit these targets based on your current growth rate, helping you stay motivated and focused on your financial goals.",
          cta: 'Track progress',
          path: '/tool/monetization'
        },
        {
          id: 'sentiment',
          name: 'Comment Sentiment',
          icon: MessageSquare,
          description: "Understand the pulse of your community. Our AI analyzes thousands of comments to determine the overall mood—positive, negative, or neutral. It identifies common themes and questions, allowing you to respond more effectively and build a stronger relationship with your audience. Turn your comment section into a goldmine of viewer insights.",
          cta: 'Analyze feedback',
          path: '/tool/sentiment'
        },
        {
          id: 'analytics-dash',
          name: 'Analytics Dashboard',
          icon: BarChart3,
          description: "A centralized hub for all your vital metrics. The Dashboard visualizes views, subscribers, watch time, and revenue in beautiful, easy-to-read charts. Compare different time periods and identify trends that are driving your success. It's mission control for your YouTube career, providing the data you need to make informed strategic decisions.",
          cta: 'View dashboard',
          path: '/tool/analytics-dash'
        }
      ]
    },
    {
      title: "RESEARCH & SPY",
      description: "Stay ahead of the competition by uncovering their strategies and identifying viral trends before they peak.",
      tools: [
        {
          id: 'comp-spy',
          name: 'Competitor Spy',
          icon: Eye,
          description: "Ethically monitor your competitors' performance. See which of their videos are getting the most \"Views Per Hour\" and identify their top-performing keywords. Learn from their success and avoid their mistakes. This tool gives you a competitive edge by revealing exactly what is working in your niche right now, allowing you to adapt and outpace them.",
          cta: 'Spy on competitors',
          path: '/tool/comp-spy'
        },
        {
          id: 'trending-topics',
          name: 'Trending Topics',
          icon: TrendingUp,
          description: "Ride the wave of viral content. Our Trending Topics tool scans YouTube and social media to find breakout subjects in your specific niche. By creating content on topics that are currently gaining momentum, you increase your chances of being picked up by the algorithm and reaching a massive new audience. Stay relevant and always be the first to cover what's hot.",
          cta: 'Discover trends',
          path: '/tool/trending-topics'
        },
        {
          id: 'keyword-res',
          name: 'Keyword Research',
          icon: Search,
          description: "The foundation of YouTube SEO. Find high-volume keywords with low competition to dominate search results. Our tool provides search volume data, competition scores, and related keyword suggestions. It helps you identify \"low-hanging fruit\" topics that can drive consistent, long-term traffic to your channel without fighting against massive creators.",
          cta: 'Explore keywords',
          path: '/tool/keyword-res'
        }
      ]
    },
    {
      title: "GLOBAL REACH",
      description: "Expand your audience beyond borders with tools designed for international growth and optimal timing.",
      tools: [
        {
          id: 'global-reach',
          name: 'Global Reach Insights',
          icon: Globe,
          description: "Analyze where your viewers are coming from and identify untapped international markets. This tool provides data on geographic performance and suggests languages for subtitles and localized content. Expanding globally is one of the fastest ways to multiply your views and revenue, and we provide the data to make it happen strategically.",
          cta: 'Go global',
          path: '/tool/global-reach'
        },
        {
          id: 'best-time',
          name: 'Best Time to Post',
          icon: Clock,
          description: "Timing is everything. We analyze your specific audience's activity patterns to recommend the exact hour and day you should upload for maximum initial momentum. By hitting the \"publish\" button when your subscribers are most active, you boost your early engagement metrics, which signals the algorithm to push your video to a wider audience.",
          cta: 'Check timing',
          path: '/tool/best-time'
        },
        {
          id: 'name-ideas',
          name: 'Channel Name Ideas',
          icon: TypeIcon,
          description: "Your brand starts with your name. Our AI generates catchy, memorable, and brandable channel names based on your niche and personality. It checks for availability and ensures the name resonates with your target audience. Whether you want something professional, funny, or abstract, we help you find the perfect identity for your YouTube journey.",
          cta: 'Find your name',
          path: '/tool/name-ideas'
        }
      ]
    },
    {
      title: "ADVANCED SEO",
      description: "Fine-tune your technical SEO and optimize every element of your video for maximum algorithmic visibility.",
      tools: [
        {
          id: 'seo-check',
          name: 'SEO Checklist',
          icon: CheckSquare,
          description: "Never miss a step in your optimization process. Our comprehensive checklist covers everything from title length and tag density to end screens and cards. It's a step-by-step guide to ensuring every video you upload is perfectly tuned for the YouTube algorithm. Consistency in SEO is the key to long-term growth, and this tool makes it easy.",
          cta: 'Check SEO',
          path: '/tool/seo-check'
        },
        {
          id: 'hash-gen',
          name: 'Hashtag Generator',
          icon: Hash,
          description: "Hashtags are essential for categorizing your content and appearing in hashtag search results. Our generator finds trending and relevant hashtags that increase your discoverability. It helps you avoid over-tagging while ensuring you use the most impactful terms for your niche. Boost your reach and connect with viewers searching for specific topics.",
          cta: 'Generate hashtags',
          path: '/tool/hash-gen'
        },
        {
          id: 'thumb-score',
          name: 'Thumbnail Score',
          icon: BarChart3,
          description: "Predict your success before you publish. Our AI-powered Thumbnail Score analyzes your visual assets against high-performing benchmarks in your niche. It provides a score and specific feedback on how to improve contrast, readability, and emotional impact. Optimize your CTR and ensure your hard work gets the views it deserves.",
          cta: 'Score thumbnail',
          path: '/tool/thumb-score'
        },
        {
          id: 'shorts-ideas',
          name: 'Shorts Idea Generator',
          icon: Zap,
          description: "YouTube Shorts is the fastest way to grow in 2024. This tool provides viral-ready concepts specifically designed for the short-form vertical format. From quick tips to satisfying loops, these ideas are optimized for high retention and shareability. Capitalize on the Shorts explosion and feed the algorithm with content that converts viewers into subscribers.",
          cta: 'Get Shorts ideas',
          path: '/tool/shorts-ideas'
        }
      ]
    }
  ];

  return (
    <div className="bg-white min-h-screen pt-24 pb-20">
      {/* Header Section */}
      <header className="max-w-7xl mx-auto px-6 lg:px-8 text-center mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-6xl font-black text-brand-dark mb-6 tracking-tight">
            Welcome to our <span className="text-brand-red">user's guide</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Master the YTGrowth ecosystem with our comprehensive directory. Whether you're a beginner looking to start your journey or a veteran creator aiming to scale, our suite of 20+ AI-powered tools provides the data, insights, and automation you need to dominate the YouTube algorithm. Explore our specialized categories below to find the perfect tool for your current growth stage.
          </p>
        </motion.div>
      </header>

      {/* Categories and Tools */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 space-y-24">
        {categories.map((category) => (
          <section key={category.title} id={category.title.toLowerCase().replace(/\s+/g, '-')}>
            <div className="mb-12">
              <h2 className="text-2xl font-black text-brand-dark mb-4 tracking-wider">
                {category.title}
              </h2>
              <p className="text-gray-500 max-w-2xl">
                {category.description}
              </p>
              <div className="h-1 w-20 bg-brand-red mt-4" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {category.tools.map((tool, toolIdx) => (
                <motion.div
                  key={tool.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: toolIdx * 0.1 }}
                  className="group p-8 rounded-2xl border border-gray-100 bg-white hover:shadow-xl hover:border-brand-red/20 transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <tool.icon className="w-6 h-6 text-brand-red" />
                  </div>
                  <h3 className="text-xl font-bold text-brand-dark mb-4">
                    {tool.name}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-6">
                    {tool.description}
                  </p>
                  <Link 
                    to={tool.path}
                    className="inline-flex items-center gap-2 text-brand-red font-bold text-sm hover:gap-3 transition-all"
                  >
                    {tool.cta}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* SEO Content Section (To reach 1600+ words) */}
      <section className="max-w-4xl mx-auto px-6 lg:px-8 mt-32 pt-20 border-t border-gray-100">
        <div className="prose prose-lg prose-red max-w-none text-gray-700">
          <h2 className="text-3xl font-black text-brand-dark mb-8">The Ultimate Guide to YouTube Growth in 2024</h2>
          <p>
            In the ever-evolving landscape of digital content, YouTube remains the undisputed king of long-form video. However, with over 500 hours of content uploaded every minute, standing out requires more than just "good content." It requires a strategic approach to <strong>YouTube SEO</strong>, <strong>AI-driven content planning</strong>, and <strong>data-backed analytics</strong>. This guide explores how YTGrowth's suite of tools empowers creators to navigate the complex YouTube algorithm and build sustainable, high-authority channels.
          </p>

          <h3 className="text-2xl font-bold text-brand-dark mt-12 mb-4">Understanding the YouTube Algorithm</h3>
          <p>
            The YouTube algorithm is not a single entity but a collection of recommendation systems. Its primary goal is to keep viewers on the platform for as long as possible. To achieve this, it looks at two main categories of data: <strong>Metadata</strong> (Titles, Tags, Descriptions) and <strong>Performance Metrics</strong> (CTR, Average View Duration, Engagement).
          </p>
          <p>
            Our <strong>Title Generator</strong> and <strong>Description Generator</strong> are specifically designed to optimize your metadata. By using LSI (Latent Semantic Indexing) keywords and understanding search intent, these tools ensure that your video is properly indexed. Meanwhile, tools like the <strong>Script Hook Generator</strong> focus on performance by ensuring your video's opening is strong enough to maintain high viewer retention.
          </p>

          <h3 className="text-2xl font-bold text-brand-dark mt-12 mb-4">The Power of AI in Content Creation</h3>
          <p>
            Artificial Intelligence has revolutionized how creators work. Gone are the days of staring at a blank screen wondering what to film next. Our <strong>Video Idea Generator</strong> and <strong>Shorts Idea Generator</strong> use advanced machine learning models to analyze trending topics and audience interests in real-time. This allows you to create content that is already in high demand, significantly reducing the risk of a "flop."
          </p>
          <p>
            Furthermore, the <strong>Video Idea Blueprint</strong> acts as an AI-powered co-writer, helping you structure your thoughts into a professional script. This ensures that your content is not only interesting but also logically sound and optimized for the "watch time" metric that YouTube values so highly.
          </p>

          <h3 className="text-2xl font-bold text-brand-dark mt-12 mb-4">Strategic Research and Competitor Analysis</h3>
          <p>
            You don't have to reinvent the wheel to succeed on YouTube. Often, the best strategy is to look at what is already working in your niche and put your own unique spin on it. The <strong>Competitor Spy</strong> tool allows you to ethically monitor the growth of other channels in your space. By identifying their most successful videos and keywords, you can uncover "content gaps" that you can fill.
          </p>
          <p>
            Combined with <strong>Keyword Research</strong>, you can build a content strategy that targets high-volume search terms while avoiding the most saturated topics. This balanced approach is essential for new channels looking to gain their first 1,000 subscribers and 4,000 watch hours.
          </p>

          <h3 className="text-2xl font-bold text-brand-dark mt-12 mb-4">Global Expansion and Audience Growth</h3>
          <p>
            The internet has no borders, and neither should your YouTube channel. Many creators limit themselves to their local market, missing out on millions of potential viewers worldwide. Our <strong>Global Reach Insights</strong> tool helps you identify which countries are consuming your content and where there is potential for growth.
          </p>
          <p>
            By optimizing your <strong>Best Time to Post</strong> for these international audiences and using our <strong>Language Support</strong> features, you can significantly increase your CPM (Cost Per Mille) and overall revenue. A global audience is a resilient audience, protecting your channel from local economic fluctuations and seasonal trends.
          </p>

          <h3 className="text-2xl font-bold text-brand-dark mt-12 mb-4">Conclusion: Your Journey with YTGrowth</h3>
          <p>
            Success on YouTube is a marathon, not a sprint. It requires consistency, patience, and the right set of tools. YTGrowth is committed to providing creators with the most advanced AI technology available. From the first spark of an idea to the final optimization of a viral hit, we are with you every step of the way.
          </p>
          <p>
            Explore our 20+ tools, use our <strong>SEO Checklist</strong> for every upload, and watch as your channel transforms from a hobby into a high-authority brand. The algorithm is waiting—are you ready to dominate it?
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 mt-32">
        <div className="bg-brand-dark rounded-3xl p-12 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-red/10 rounded-full -mr-32 -mt-32 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-red/10 rounded-full -ml-32 -mb-32 blur-3xl" />
          
          <h2 className="text-3xl md:text-5xl font-black text-white mb-6 relative z-10">
            Ready to scale your channel?
          </h2>
          <p className="text-gray-400 mb-10 max-w-2xl mx-auto relative z-10">
            Join thousands of creators who use YTGrowth to automate their workflow and skyrocket their views.
          </p>
          <Link 
            to="/"
            className="inline-flex items-center justify-center px-8 py-4 bg-brand-red text-white font-black rounded-xl hover:bg-red-600 transition-all transform hover:scale-105 relative z-10"
          >
            Start Growing Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default ToolsGuide;
