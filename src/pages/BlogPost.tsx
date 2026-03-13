import React, { useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Markdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { 
  Calendar, 
  Clock, 
  User, 
  ArrowLeft, 
  Share2, 
  Bookmark,
  ChevronRight,
  HelpCircle,
  Facebook,
  Linkedin
} from 'lucide-react';
import { BLOG_POSTS } from '../constants/blogData';

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = BLOG_POSTS.find(p => p.slug === slug);

  // Tool mappings for automatic linking
  const toolMappings = [
    { name: 'YouTube Title Generator Tool', path: '/tool/title-gen' },
    { name: 'YouTube Description Generator Tool', path: '/tool/desc-gen' },
    { name: 'YouTube Tag Generator Tool', path: '/tool/tag-gen' },
    { name: 'YouTube Hashtag Generator Tool', path: '/tool/hash-gen' },
    { name: 'YouTube SEO Checklist', path: '/tool/seo-check' },
    { name: 'YouTube Keyword Research Tool', path: '/tool/keyword-res' },
    { name: 'YouTube Title Score Analyzer', path: '/tool/title-analyzer' },
    { name: 'YouTube Video Idea Generator', path: '/tool/video-ideas' },
    { name: 'YouTube Shorts Idea Generator', path: '/tool/shorts-ideas' },
    { name: 'YouTube Script Hook Generator', path: '/tool/hook-gen' },
    { name: 'YouTube Viral Hook Generator', path: '/tool/viral-hooks' },
    { name: 'YouTube Video Idea Blueprint', path: '/tool/script-gen' },
    { name: 'YouTube Thumbnail AI Ideas', path: '/tool/thumb-maker' },
    { name: 'YouTube Thumbnail Score', path: '/tool/thumb-score' },
    { name: 'YouTube Thumbnail Text Generator', path: '/tool/thumb-text' },
    { name: 'YouTube Content Planner', path: '/tool/content-planner' },
    { name: 'YouTube Video Downloader', path: '/tool/video-downloader' },
    { name: 'YouTube Best Time to Post', path: '/tool/best-time' },
    { name: 'YouTube Channel Name Ideas', path: '/tool/name-ideas' },
    { name: 'YouTube Monetization Tracker', path: '/tool/monetization' },
    { name: 'YouTube Channel Audit Tool', path: '/tool/audit' },
    { name: 'YouTube Analytics Dashboard Tool', path: '/tool/analytics-dash' },
    { name: 'YouTube Competitor Spy Tool', path: '/tool/comp-spy' },
    { name: 'YouTube Trending Topics Tool', path: '/tool/trending-topics' },
    { name: 'YouTube Comment Sentiment Analyzer', path: '/tool/sentiment' },
    { name: 'YouTube Global Reach Analyzer', path: '/tool/global-reach' },
    { name: 'YouTube Global Reach Tool', path: '/tool/global-reach' },
    { name: 'Global Reach Tool', path: '/tool/global-reach' },
    { name: 'Global Reach Analyzer', path: '/tool/global-reach' },
    { name: 'YouTube International Audience Analytics', path: '/tool/global-reach' },
    { name: 'YouTube Global Audience Analysis', path: '/tool/global-reach' },
    { name: 'YouTube Audience Location Analysis', path: '/tool/global-reach' },
    
    // Short versions
    { name: 'Title Generator', path: '/tool/title-gen' },
    { name: 'Description Generator', path: '/tool/desc-gen' },
    { name: 'Tag Generator', path: '/tool/tag-gen' },
    { name: 'Hashtag Generator', path: '/tool/hash-gen' },
    { name: 'SEO Checklist', path: '/tool/seo-check' },
    { name: 'Keyword Research', path: '/tool/keyword-res' },
    { name: 'Title Score Analyzer', path: '/tool/title-analyzer' },
    { name: 'Video Idea Generator', path: '/tool/video-ideas' },
    { name: 'Shorts Idea Generator', path: '/tool/shorts-ideas' },
    { name: 'Script Hook Generator', path: '/tool/hook-gen' },
    { name: 'Viral Hook Generator', path: '/tool/viral-hooks' },
    { name: 'Video Idea Blueprint', path: '/tool/script-gen' },
    { name: 'Thumbnail AI Ideas', path: '/tool/thumb-maker' },
    { name: 'Thumbnail Score', path: '/tool/thumb-score' },
    { name: 'Thumbnail Text Generator', path: '/tool/thumb-text' },
    { name: 'Content Planner', path: '/tool/content-planner' },
    { name: 'Video Downloader', path: '/tool/video-downloader' },
    { name: 'Best Time to Post', path: '/tool/best-time' },
    { name: 'Channel Name Ideas', path: '/tool/name-ideas' },
    { name: 'Monetization Tracker', path: '/tool/monetization' },
    { name: 'Channel Audit Tool', path: '/tool/audit' },
    { name: 'Analytics Dashboard', path: '/tool/analytics-dash' },
    { name: 'Competitor Spy Tool', path: '/tool/comp-spy' },
    { name: 'Trending Topics Tool', path: '/tool/trending-topics' },
    { name: 'Comment Sentiment Analyzer', path: '/tool/sentiment' },
    { name: 'Global Reach Analyzer', path: '/tool/global-reach' },
    
    // Synonyms
    { name: 'YouTube Script Writer', path: '/tool/script-gen' },
    { name: 'YouTube Thumbnail Idea', path: '/tool/thumb-maker' },
    { name: 'YouTube SEO Audit', path: '/tool/audit' },
    { name: 'YouTube Monetization Checker', path: '/tool/monetization' },
    { name: 'YouTube Competitor Analysis', path: '/tool/comp-spy' },
    { name: 'Competitor Spy', path: '/tool/comp-spy' },
    { name: 'Trending Topics', path: '/tool/trending-topics' },
    { name: 'Comment Sentiment', path: '/tool/sentiment' },
    { name: 'YT Growth Tool', path: '/' },
  ];

  // Function to process content and add links for tools and placeholders
  const processContent = (content: string) => {
    let processedContent = content;
    
    // Sort mappings by name length descending to avoid partial matches
    const sortedMappings = [...toolMappings].sort((a, b) => b.name.length - a.name.length);

    sortedMappings.forEach(tool => {
      // 1. Replace placeholders like [Add link to our YouTube Title Generator Tool]
      // These are always replaced as they are explicit requests for links
      const placeholderRegex = new RegExp(`\\[Add link to our ${tool.name}\\]`, 'gi');
      processedContent = processedContent.replace(placeholderRegex, `[${tool.name}](${tool.path})`);
      
      // 2. Replace ONLY the first plain text mention of the tool name if not already linked
      // This ensures the link at the "top" (usually the heading) is kept, but subsequent ones are removed
      let replaced = false;
      
      // We use a function with replace to control the number of replacements
      const toolRegex = new RegExp(tool.name, 'gi');
      processedContent = processedContent.replace(toolRegex, (match, offset, fullText) => {
        if (replaced) return match;

        // Check if it's already part of a markdown link
        const prevChar = fullText.substring(offset - 1, offset);
        const nextChars = fullText.substring(offset + match.length, offset + match.length + 2);
        const isInsideLink = prevChar === '[' || nextChars === '](';
        
        if (!isInsideLink) {
          replaced = true;
          return `[${match}](${tool.path})`;
        }
        
        return match;
      });
    });

    return processedContent;
  };

  useEffect(() => {
    if (post) {
      document.title = post.metaTitle;
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', post.metaDescription);
      }

      const blogSchema = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": post.title,
        "author": {
          "@type": "Person",
          "name": post.author
        },
        "publisher": {
          "@type": "Organization",
          "name": "YT Growth",
          "logo": {
            "@type": "ImageObject",
            "url": "https://ais-dev-5sui2un4r2bd6cxqlajncl-277374021059.asia-east1.run.app/logo.png"
          }
        },
        "datePublished": post.date,
        "description": post.metaDescription
      };

      const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": post.faqs.map(faq => ({
          "@type": "Question",
          "name": faq.q,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.a
          }
        }))
      };

      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.id = 'blog-schema';
      script.innerHTML = JSON.stringify([blogSchema, faqSchema]);
      document.head.appendChild(script);

      return () => {
        const existingScript = document.getElementById('blog-schema');
        if (existingScript) document.head.removeChild(existingScript);
      };
    }
  }, [post]);

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  const processedContent = processContent(post.content);

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section - iLovePDF Style */}
      <div className="bg-[#f3f3f7] pt-32 pb-16">
        <div className="max-w-5xl mx-auto px-6 lg:px-8 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black text-[#33333b] mb-6 tracking-tight leading-tight"
          >
            {post.title}
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-2xl md:text-3xl font-medium text-[#33333b]/80 mb-12 max-w-4xl mx-auto"
          >
            {post.excerpt}
          </motion.p>

          <div className="flex items-center justify-between border-t border-gray-200 pt-8">
            <div className="flex items-center gap-2">
              <Link to="/blog" className="text-brand-red font-bold text-lg hover:underline">
                Blog
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-gray-400 text-sm font-medium mr-2">
                {post.date}
              </div>
              
              <div className="flex items-center gap-2">
                <button title="Share on Facebook" className="w-9 h-9 rounded-full bg-[#3b5998] text-white flex items-center justify-center hover:opacity-80 transition-opacity">
                  <Facebook className="w-4 h-4" />
                </button>
                <button title="Share on X" className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center hover:opacity-80 transition-opacity">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </button>
                <button title="Share on LinkedIn" className="w-9 h-9 rounded-full bg-[#0077b5] text-white flex items-center justify-center hover:opacity-80 transition-opacity">
                  <Linkedin className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto px-6 lg:px-8 py-20">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-20"
        >
          <div className="markdown-body">
            <Markdown
              rehypePlugins={[rehypeRaw]}
              components={{
                h2: ({ children }) => {
                  const id = children?.toString().toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
                  return <h2 id={id}>{children}</h2>;
                },
                h3: ({ children }) => {
                  const id = children?.toString().toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
                  return <h3 id={id}>{children}</h3>;
                },
                a: ({ href, children }) => {
                  const isToolLink = toolMappings.some(tool => href === tool.path);
                  if (isToolLink) {
                    return (
                      <Link 
                        to={href || '#'} 
                        className="text-brand-red font-bold hover:underline decoration-2 underline-offset-4 inline-flex items-center gap-1 group"
                      >
                        {children}
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    );
                  }
                  return (
                    <a href={href} target="_blank" rel="noopener noreferrer" className="text-brand-red hover:underline">
                      {children}
                    </a>
                  );
                }
              }}
            >
              {processedContent}
            </Markdown>
          </div>
        </motion.div>

        {/* FAQ Section */}
        {post.faqs && post.faqs.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20 p-8 md:p-12 rounded-[40px] bg-[#f3f3f7] border border-gray-200"
          >
            <div className="flex items-center gap-3 mb-8">
              <HelpCircle className="w-8 h-8 text-brand-red" />
              <h2 className="text-3xl font-black text-[#33333b] tracking-tight">Frequently Asked Questions</h2>
            </div>
            <div className="space-y-8">
              {post.faqs.map((faq, idx) => (
                <div key={idx} className="group">
                  <h3 className="text-xl font-bold text-[#33333b] mb-3 flex items-start gap-3">
                    <span className="text-brand-red mt-1">Q.</span>
                    {faq.q}
                  </h3>
                  <p className="text-gray-600 font-medium leading-relaxed pl-8">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Internal Link CTA */}
        <div className="p-12 rounded-[40px] bg-[#1a1a1b] text-white relative overflow-hidden mb-20">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-red/20 blur-[100px] rounded-full -mr-32 -mt-32" />
          <div className="relative z-10 text-center">
            <h2 className="text-3xl font-black mb-4 tracking-tight">Ready to grow your channel?</h2>
            <p className="text-white/60 text-lg font-medium mb-8 max-w-xl mx-auto">
              Use the same tools mentioned in this article to scale your YouTube presence today.
            </p>
            <Link 
              to="/" 
              className="inline-flex items-center gap-3 px-10 py-5 bg-brand-red text-white rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-white hover:text-brand-red transition-all shadow-2xl"
            >
              Go to Dashboard <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

const ArrowRight = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
);

export default BlogPost;
