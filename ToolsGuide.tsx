import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  Search, 
  BarChart3, 
  Zap, 
  ArrowRight, 
  CheckCircle2,
  Lightbulb,
  Target,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';
import { TOOLS } from '../constants';
import { BLOG_POSTS } from '../constants/blogData';

const PillarArticle = () => {
  return (
    <div className="bg-white min-h-screen pt-32 pb-20">
      {/* Hero Section */}
      <div className="max-w-5xl mx-auto px-6 lg:px-8 text-center mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-red/10 text-brand-red text-sm font-black uppercase tracking-widest mb-8"
        >
          <Sparkles className="w-4 h-4" />
          Ultimate Guide 2026
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-8xl font-black text-[#33333b] mb-8 tracking-tight leading-[0.9]"
        >
          Best YouTube <span className="text-brand-red">Growth Tools</span> for Creators
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-medium"
        >
          Master the YouTube algorithm with the most powerful AI-driven tools. 
          From SEO to content generation, this is your complete roadmap to scaling your channel in 2026.
        </motion.p>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <div className="prose prose-2xl prose-red max-w-none text-gray-600 font-medium leading-relaxed">
          <p className="text-3xl text-[#33333b] font-black leading-tight mb-12">
            In 2026, YouTube is no longer just a video platform—it's a sophisticated search and recommendation engine. 
            To succeed, you need to combine creative storytelling with technical precision.
          </p>

          <h2 className="text-4xl font-black text-[#33333b] mt-20 mb-8 tracking-tight">The 4 Pillars of YouTube Success</h2>
          <p>
            Every successful channel is built on four core pillars. Our toolkit is designed to help you master each one:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-16">
            <div className="p-8 rounded-[40px] bg-[#f3f3f7] border border-gray-100">
              <Search className="w-10 h-10 text-brand-red mb-6" />
              <h3 className="text-2xl font-black text-[#33333b] mb-4">1. Search Visibility</h3>
              <p className="text-lg">Optimizing your metadata so the right people can find your content through search.</p>
            </div>
            <div className="p-8 rounded-[40px] bg-[#f3f3f7] border border-gray-100">
              <Zap className="w-10 h-10 text-brand-red mb-6" />
              <h3 className="text-2xl font-black text-[#33333b] mb-4">2. High CTR</h3>
              <p className="text-lg">Crafting titles and thumbnails that compel viewers to stop scrolling and click.</p>
            </div>
            <div className="p-8 rounded-[40px] bg-[#f3f3f7] border border-gray-100">
              <BarChart3 className="w-10 h-10 text-brand-red mb-6" />
              <h3 className="text-2xl font-black text-[#33333b] mb-4">3. Audience Retention</h3>
              <p className="text-lg">Using hooks and structured scripts to keep viewers watching until the very end.</p>
            </div>
            <div className="p-8 rounded-[40px] bg-[#f3f3f7] border border-gray-100">
              <TrendingUp className="w-10 h-10 text-brand-red mb-6" />
              <h3 className="text-2xl font-black text-[#33333b] mb-4">4. Channel Authority</h3>
              <p className="text-lg">Building a consistent brand and auditing your performance to scale effectively.</p>
            </div>
          </div>

          <h2 className="text-4xl font-black text-[#33333b] mt-20 mb-8 tracking-tight">Essential SEO Tools</h2>
          <p>
            Search Engine Optimization is the foundation of evergreen views. If you want your videos to be discovered months after upload, you must master SEO.
          </p>
          <ul className="space-y-6 list-none pl-0">
            <li className="flex items-start gap-4">
              <CheckCircle2 className="w-6 h-6 text-brand-red mt-1 shrink-0" />
              <span>
                <strong><Link to="/tool/keyword-res" className="text-brand-red hover:underline">Keyword Research</Link>:</strong> 
                Find low-competition keywords that you can actually rank for.
              </span>
            </li>
            <li className="flex items-start gap-4">
              <CheckCircle2 className="w-6 h-6 text-brand-red mt-1 shrink-0" />
              <span>
                <strong><Link to="/tool/tag-gen" className="text-brand-red hover:underline">Tag Generator</Link>:</strong> 
                Identify the most relevant tags to help YouTube categorize your content.
              </span>
            </li>
            <li className="flex items-start gap-4">
              <CheckCircle2 className="w-6 h-6 text-brand-red mt-1 shrink-0" />
              <span>
                <strong><Link to="/tool/seo-check" className="text-brand-red hover:underline">SEO Checklist</Link>:</strong> 
                A step-by-step audit to ensure every upload is perfectly optimized.
              </span>
            </li>
          </ul>

          <h2 className="text-4xl font-black text-[#33333b] mt-20 mb-8 tracking-tight">Content & Viral Strategy</h2>
          <p>
            Once you have the technical foundation, you need to focus on the creative side. Viral growth happens when you win the click and the watch time.
          </p>
          <div className="bg-[#f3f3f7] p-10 rounded-[40px] my-12">
            <h3 className="text-2xl font-black text-[#33333b] mb-6">Pro Tip: The Hook is Everything</h3>
            <p className="mb-8">
              The first 5 seconds of your video determine its fate. If you don't grab attention immediately, the algorithm will stop promoting your video.
            </p>
            <Link 
              to="/tool/hook-gen"
              className="inline-flex items-center gap-2 px-6 py-3 bg-brand-red text-white rounded-xl font-black text-sm uppercase tracking-widest hover:bg-red-600 transition-all"
            >
              Try Hook Generator <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <p>
            Don't forget about <strong>YouTube Shorts</strong>. In 2026, Shorts are the most powerful discovery engine on the platform. 
            Use our <Link to="/tool/shorts-ideas" className="text-brand-red hover:underline">Shorts Idea Generator</Link> to feed the algorithm with high-impact vertical content.
          </p>

          <h2 className="text-4xl font-black text-[#33333b] mt-20 mb-8 tracking-tight">Related Reading</h2>
          <p>
            Deepen your knowledge with our expert guides:
          </p>
          <div className="grid grid-cols-1 gap-4 my-10">
            {BLOG_POSTS.slice(0, 3).map(post => (
              <Link 
                key={post.id}
                to={`/blog/${post.slug}`}
                className="group flex items-center justify-between p-6 bg-white border border-gray-100 rounded-2xl hover:border-brand-red/20 hover:shadow-lg transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#f3f3f7] flex items-center justify-center group-hover:bg-brand-red/10 transition-colors">
                    <FileText className="w-6 h-6 text-brand-red" />
                  </div>
                  <span className="text-lg font-bold text-[#33333b]">{post.title}</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-brand-red group-hover:translate-x-1 transition-all" />
              </Link>
            ))}
          </div>

          <h2 className="text-4xl font-black text-[#33333b] mt-20 mb-8 tracking-tight">Conclusion</h2>
          <p>
            Scaling a YouTube channel is a marathon, not a sprint. By leveraging the right tools and staying consistent, you can turn your channel into a global powerhouse. 
            Explore our full <Link to="/tools" className="text-brand-red hover:underline">Tools Hub</Link> to find exactly what you need for your current stage of growth.
          </p>
        </div>

        {/* Final CTA */}
        <div className="mt-32 p-12 md:p-20 rounded-[60px] bg-[#1a1a1b] text-white text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-red/20 blur-[120px] rounded-full -mr-48 -mt-48" />
          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-black mb-8 tracking-tight">Ready to dominate YouTube?</h2>
            <p className="text-xl text-white/60 mb-12 max-w-2xl mx-auto font-medium">
              Join thousands of creators who use our AI toolkit to automate their workflow and skyrocket their views.
            </p>
            <Link 
              to="/"
              className="inline-flex items-center gap-3 px-10 py-5 bg-brand-red text-white rounded-2xl text-lg font-black uppercase tracking-widest hover:bg-white hover:text-brand-red transition-all shadow-2xl"
            >
              Start Growing Now <ArrowRight className="w-6 h-6" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

const FileText = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>
);

const ChevronRight = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
);

export default PillarArticle;
