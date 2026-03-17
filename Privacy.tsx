import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowRight, User } from 'lucide-react';
import { BLOG_POSTS } from '../constants/blogData';

const Blog = () => {
  return (
    <div className="min-h-screen bg-bg-primary pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-black text-brand-dark mb-6 tracking-tight"
          >
            Creator <span className="text-brand-red">Blog</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-brand-gray max-w-2xl mx-auto font-medium leading-relaxed"
          >
            Expert insights, algorithm updates, and growth strategies to help you dominate the YouTube landscape.
          </motion.p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {BLOG_POSTS.map((post, idx) => (
            <motion.div 
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + (idx * 0.1) }}
              className="flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm border border-border-primary hover:shadow-xl transition-all group"
            >
              {/* Top Colored Block */}
              <Link to={`/blog/${post.slug}`} className="block">
                <div className={`aspect-[4/3] p-8 flex flex-col justify-center relative overflow-hidden ${
                  post.cardColor === 'red' ? 'bg-brand-red text-white' : 'bg-gray-100 text-brand-dark'
                }`}>
                  {/* Logo/Icon Placeholder */}
                  <div className="absolute top-6 left-6">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${
                      post.cardColor === 'red' ? 'border-white/30 bg-white/10' : 'border-gray-300 bg-gray-200'
                    }`}>
                      <div className={`w-4 h-4 rounded-sm rotate-45 ${
                        post.cardColor === 'red' ? 'bg-white' : 'bg-brand-dark'
                      }`} />
                    </div>
                  </div>
                  
                  <h2 className="text-3xl font-black leading-tight tracking-tight">
                    {post.shortTitle}
                  </h2>
                </div>
              </Link>

              {/* Bottom Content Block */}
              <div className="p-8 flex flex-col flex-grow">
                <div className="text-xs font-bold text-brand-gray mb-3">
                  {post.date}
                </div>
                
                <Link to={`/blog/${post.slug}`} className="block mb-4">
                  <h3 className="text-xl font-black text-brand-dark group-hover:text-brand-red transition-colors leading-tight">
                    {post.title}
                  </h3>
                </Link>
                
                <p className="text-brand-gray text-sm font-medium leading-relaxed mb-6 line-clamp-3">
                  {post.excerpt}
                </p>
                
                <div className="mt-auto">
                  <Link 
                    to={`/blog/${post.slug}`} 
                    className="text-brand-red font-black text-sm uppercase tracking-widest hover:underline inline-flex items-center gap-2"
                  >
                    Read More
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="mt-32 p-12 rounded-[40px] bg-brand-dark text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-red/20 blur-[100px] rounded-full -mr-32 -mt-32" />
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-4xl font-black mb-4 tracking-tight">Stay Ahead of the Curve</h2>
            <p className="text-white/60 text-lg font-medium mb-8">
              Join 50,000+ creators who get our weekly algorithm updates and growth hacks delivered straight to their inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-grow bg-white/10 border border-white/20 rounded-2xl px-6 py-4 text-white placeholder:text-white/40 focus:outline-none focus:border-brand-red transition-colors"
              />
              <button className="bg-brand-red text-white font-black uppercase tracking-[0.2em] text-xs px-8 py-4 rounded-2xl hover:bg-white hover:text-brand-red transition-all shadow-xl">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;
