import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { TOOLS } from '../constants';
import { ArrowRight, Search } from 'lucide-react';

const ToolsHub = () => {
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredTools = TOOLS.filter(tool => 
    tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categories = ['SEO', 'Content', 'Channel', 'Analytics'];

  return (
    <div className="bg-white min-h-screen pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black text-[#33333b] mb-6 tracking-tight"
          >
            YouTube <span className="text-brand-red">Tools Hub</span>
          </motion.h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            The most comprehensive directory of free AI-powered tools for YouTube creators. 
            Optimize your SEO, generate viral content ideas, and scale your channel faster.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-20">
          <div className="relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400 group-focus-within:text-brand-red transition-colors" />
            <input 
              type="text"
              placeholder="Search for a tool (e.g., 'Title Generator')..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-6 py-5 bg-[#f3f3f7] border-2 border-transparent focus:border-brand-red/20 focus:bg-white rounded-2xl text-lg font-medium outline-none transition-all shadow-sm"
            />
          </div>
        </div>

        {/* Tools Grid by Category */}
        {categories.map(category => {
          const categoryTools = filteredTools.filter(t => t.category === category);
          if (categoryTools.length === 0) return null;

          return (
            <div key={category} className="mb-20">
              <div className="flex items-center gap-4 mb-10">
                <h2 className="text-3xl font-black text-[#33333b] tracking-tight uppercase">
                  {category} Tools
                </h2>
                <div className="h-1 flex-grow bg-[#f3f3f7] rounded-full" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryTools.map((tool, idx) => (
                  <motion.div
                    key={tool.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <Link 
                      to={tool.path}
                      className="group block p-8 bg-white border border-gray-100 rounded-[32px] hover:border-brand-red/30 hover:shadow-2xl hover:shadow-brand-red/5 transition-all duration-300 h-full relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-24 h-24 bg-[#f3f3f7] rounded-bl-[100px] -mr-12 -mt-12 transition-all group-hover:bg-brand-red/5" />
                      
                      <div className="w-14 h-14 rounded-2xl bg-[#f3f3f7] flex items-center justify-center mb-6 group-hover:bg-brand-red group-hover:text-white transition-all duration-300">
                        <tool.icon className="w-7 h-7" />
                      </div>

                      <h3 className="text-2xl font-black text-[#33333b] mb-3 group-hover:text-brand-red transition-colors">
                        {tool.name}
                      </h3>
                      
                      <p className="text-gray-500 font-medium leading-relaxed mb-8">
                        {tool.description}
                      </p>

                      <div className="flex items-center gap-2 text-brand-red font-black text-sm uppercase tracking-widest">
                        Open Tool
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          );
        })}

        {/* SEO Content Section */}
        <div className="mt-32 p-12 md:p-20 rounded-[60px] bg-[#f3f3f7] border border-gray-100">
          <div className="prose prose-xl prose-red max-w-none">
            <h2 className="text-4xl font-black text-[#33333b] mb-10 tracking-tight">Why Use Our YouTube Tools Hub?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-2xl font-bold text-[#33333b] mb-4">100% Free & AI-Powered</h3>
                <p className="text-gray-600 font-medium leading-relaxed">
                  Every tool in our hub is completely free to use. We leverage the latest Artificial Intelligence models to provide you with data-backed insights that were previously only available to professional marketing agencies.
                </p>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-[#33333b] mb-4">Optimized for 2026 Algorithm</h3>
                <p className="text-gray-600 font-medium leading-relaxed">
                  The YouTube algorithm changes constantly. Our tools are updated regularly to ensure they align with the latest search and recommendation patterns, helping you stay ahead of the competition.
                </p>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-[#33333b] mb-4">Complete Growth Suite</h3>
                <p className="text-gray-600 font-medium leading-relaxed">
                  From the initial spark of a video idea to the final SEO audit before you hit publish, our hub provides a complete end-to-end solution for your YouTube growth journey.
                </p>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-[#33333b] mb-4">Data-Driven Decisions</h3>
                <p className="text-gray-600 font-medium leading-relaxed">
                  Stop guessing what works. Use our analytics and research tools to understand exactly what your audience wants and how to deliver it to them effectively.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToolsHub;
