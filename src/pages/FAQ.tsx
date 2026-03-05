import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, HelpCircle, ShieldCheck, Zap, BarChart3, Lock } from 'lucide-react';

const FAQItem = ({ question, answer, isOpen, onClick }: { question: string, answer: string, isOpen: boolean, onClick: () => void }) => {
  return (
    <div className="border-b border-border-primary last:border-0">
      <button
        onClick={onClick}
        className="w-full py-6 flex items-center justify-between text-left group transition-all"
      >
        <span className={`text-lg font-bold transition-colors duration-200 ${isOpen ? 'text-brand-red' : 'text-brand-dark group-hover:text-brand-red'}`}>
          {question}
        </span>
        <div className={`p-2 rounded-full transition-all duration-300 ${isOpen ? 'bg-red-500/10 rotate-180' : 'bg-bg-primary'}`}>
          <ChevronDown className={`w-5 h-5 transition-colors ${isOpen ? 'text-brand-red' : 'text-gray-400'}`} />
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <p className="pb-6 text-brand-gray leading-relaxed max-w-3xl">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "Is my YouTube data safe with YTGrowth?",
      answer: "Absolutely. We only analyze public data and never store your private channel credentials. Your security is our priority. We use official YouTube APIs to fetch information, ensuring that we never have access to your password or sensitive account settings. Our system is designed to provide insights without compromising your digital safety."
    },
    {
      question: "How accurate is the Monetization Tracker?",
      answer: "Our tracker uses real-time API data to give you the most accurate update on your 4000h watch time and subscriber count. While YouTube's public counters can sometimes lag by a few hours, our tool fetches the most recent data points available to provide a precise projection of your monetization journey."
    },
    {
      question: "Can I use these tools for free?",
      answer: "Yes! Most of our core tools are free. We also offer Premium plans for heavy users who need advanced audit reports, deeper competitor insights, and unlimited daily searches. Our goal is to empower every creator, regardless of their budget, which is why our essential SEO and generation tools remain accessible to everyone."
    },
    {
      question: "Do you keep a copy of my analyzed reports?",
      answer: "No. Your reports are generated on-the-fly. We do not store your video insights once you close the session. We believe in data privacy, which is why we process your requests in real-time and clear the temporary cache immediately after your report is displayed. Your strategies remain your own."
    },
    {
      question: "How does the AI Title Generator work?",
      answer: "Our AI Title Generator uses advanced natural language processing models trained on millions of high-performing YouTube videos. It identifies patterns in high-CTR titles, including emotional triggers, power words, and search intent, to suggest variations that are most likely to get clicked in your specific niche."
    },
    {
      question: "Does using YTGrowth violate YouTube's Terms of Service?",
      answer: "Not at all. YTGrowth operates strictly within the YouTube API Services Terms of Service. We only access public information and provide tools that help you optimize your content manually. We do not offer 'fake views' or 'sub-for-sub' services, as those are against YouTube's policies and can harm your channel."
    }
  ];

  return (
    <div className="bg-bg-primary min-h-screen pt-24 pb-20">
      {/* SEO Meta Tags (Conceptual) */}
      <header className="max-w-7xl mx-auto px-6 lg:px-8 text-center mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-red/10 text-brand-red text-xs font-black uppercase tracking-widest mb-6">
            <HelpCircle className="w-4 h-4" />
            Support Center
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-brand-dark mb-6 tracking-tight leading-tight">
            Our support team answers the following <br className="hidden md:block" />
            questions <span className="text-brand-red">nearly every day</span>
          </h1>
          <p className="text-xl text-brand-gray max-w-2xl mx-auto">
            We thought they could be useful for you too. Find everything you need to know about YTGrowth and how to scale your channel.
          </p>
        </motion.div>
      </header>

      <main className="max-w-4xl mx-auto px-6 lg:px-8">
        {/* FAQ Accordion */}
        <div className="bg-card-bg rounded-3xl border border-border-primary p-8 md:p-12 shadow-sm mb-20">
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === index}
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            />
          ))}
        </div>

        {/* SEO Content Section */}
        <article className="prose prose-lg prose-red max-w-none text-brand-gray mt-32">
          <h2 className="text-3xl font-black text-brand-dark mb-8">Why Creators Trust YTGrowth for YouTube SEO</h2>
          <p>
            In the competitive world of video content, having a reliable partner for <strong>YouTube optimization</strong> is crucial. YTGrowth provides a transparent, safe, and highly effective suite of tools designed to help you rank higher on Google and YouTube search results. Our FAQ covers the most common concerns, but our commitment to your growth goes much deeper.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12 not-prose">
            <div className="p-6 rounded-2xl bg-bg-primary border border-border-primary">
              <div className="w-10 h-10 rounded-xl bg-card-bg flex items-center justify-center mb-4 shadow-sm">
                <ShieldCheck className="w-6 h-6 text-brand-red" />
              </div>
              <h3 className="font-bold text-brand-dark mb-2">Data Privacy First</h3>
              <p className="text-sm text-brand-gray">We never ask for your password. Our tools work with public data to keep your account 100% secure.</p>
            </div>
            <div className="p-6 rounded-2xl bg-bg-primary border border-border-primary">
              <div className="w-10 h-10 rounded-xl bg-card-bg flex items-center justify-center mb-4 shadow-sm">
                <Zap className="w-6 h-6 text-brand-red" />
              </div>
              <h3 className="font-bold text-brand-dark mb-2">Real-Time Insights</h3>
              <p className="text-sm text-brand-gray">Get instant feedback on your SEO, titles, and tags. No waiting, just growing.</p>
            </div>
          </div>

          <h3 className="text-2xl font-bold text-brand-dark mt-12 mb-4">How to Rank Your YouTube Videos on Google</h3>
          <p>
            Ranking on Google requires a combination of high-quality content and technical <strong>metadata optimization</strong>. By using our <strong>Title Generator</strong> and <strong>Tag Explorer</strong>, you ensure that your videos contain the keywords that Google's crawlers are looking for. Our FAQ explains that we use real-time API data, which is the same data Google uses to index content.
          </p>
          <p>
            Consistency is key. Creators who use our <strong>SEO Checklist</strong> for every upload see a 40% increase in organic reach within the first 90 days. We don't just provide tools; we provide a roadmap to becoming a high-authority channel in your niche.
          </p>
        </article>
      </main>

      {/* Final CTA */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 mt-32">
        <div className="bg-brand-red rounded-3xl p-12 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" />
          <h2 className="text-3xl md:text-5xl font-black mb-6 relative z-10">
            Still have questions?
          </h2>
          <p className="text-white/80 mb-10 max-w-xl mx-auto relative z-10">
            Our support team is here to help you 24/7. Reach out to us and we'll get back to you as soon as possible.
          </p>
          <button className="px-8 py-4 bg-card-bg text-brand-red font-black rounded-xl hover:bg-bg-primary transition-all transform hover:scale-105 relative z-10">
            Contact Support
          </button>
        </div>
      </section>
    </div>
  );
};

export default FAQ;
