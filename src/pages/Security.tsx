import React from 'react';
import { motion } from 'motion/react';
import { 
  ShieldCheck, 
  Lock, 
  FileCheck, 
  Cloud, 
  ShieldAlert, 
  EyeOff, 
  Server, 
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Security = () => {
  const pillars = [
    {
      title: "End-to-End Encryption",
      icon: Lock,
      color: "text-blue-500",
      bg: "bg-blue-50",
      description: "All data analyzed through our tools is encrypted. We use SSL protocols to ensure your connection is always private and protected from interception."
    },
    {
      title: "No Data Storage",
      icon: FileCheck,
      color: "text-green-500",
      bg: "bg-green-50",
      description: "We do not store your private video files or channel credentials. Reports are generated in real-time and deleted after your session ends."
    },
    {
      title: "YouTube API Compliance",
      icon: ShieldCheck,
      color: "text-red-500",
      bg: "bg-red-50",
      description: "YTGrowth strictly follows YouTube API Services Terms. We only access public data to provide growth insights and never violate user privacy."
    },
    {
      title: "Secure Cloud Infrastructure",
      icon: Cloud,
      color: "text-purple-500",
      bg: "bg-purple-50",
      description: "Our servers are hosted on high-security cloud networks, protected by advanced firewalls to prevent unauthorized access and ensure 99.9% uptime."
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
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-600 text-xs font-black uppercase tracking-widest mb-6">
            <ShieldAlert className="w-4 h-4" />
            Trust & Safety
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-brand-dark mb-6 tracking-tight">
            Your security is our <span className="text-brand-red">priority</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            At YTGrowth, we ensure your YouTube data and channel insights are handled with industry-leading protection. We understand the value of your creative assets and work tirelessly to maintain a secure environment for your growth.
          </p>
        </motion.div>
      </header>

      {/* Security Pillars Grid */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 mb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {pillars.map((pillar, index) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-8 rounded-3xl border border-gray-100 bg-white hover:shadow-xl transition-all duration-300 group"
            >
              <div className={`w-14 h-14 rounded-2xl ${pillar.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <pillar.icon className={`w-7 h-7 ${pillar.color}`} />
              </div>
              <h3 className="text-2xl font-bold text-brand-dark mb-4">
                {pillar.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {pillar.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Trust & Certification Block */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 mb-32">
        <div className="bg-gray-50 rounded-3xl p-8 md:p-12 border border-gray-100 flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1">
            <h2 className="text-3xl font-black text-brand-dark mb-6">International Standards & Data Privacy</h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-8">
              YTGrowth follows strict Information Security Management System (ISMS) guidelines to protect our users. Our processes are designed in alignment with ISO/IEC 27001 standards for cybersecurity and privacy protection.
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <span className="font-bold text-brand-dark">Cybersecurity Protection:</span>
                  <span className="text-gray-600 ml-1 text-sm">Advanced firewalls for channel data.</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <span className="font-bold text-brand-dark">Privacy Protection:</span>
                  <span className="text-gray-600 ml-1 text-sm">Strictly following YouTube's Statement of Applicability.</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <span className="font-bold text-brand-dark">Regular Audits:</span>
                  <span className="text-gray-600 ml-1 text-sm">Constant monitoring of our AI tools for safety.</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="w-full lg:w-auto shrink-0">
            <div className="bg-white border-2 border-gray-100 rounded-2xl p-8 flex flex-col items-center text-center shadow-sm min-w-[240px]">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4 border border-gray-100">
                <ShieldCheck className="w-10 h-10 text-brand-dark" />
              </div>
              <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Security Standard</div>
              <div className="text-2xl font-black text-brand-dark">ISO 27001</div>
              <div className="text-xs font-bold text-gray-500">Compliant Design</div>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed SEO Content Section */}
      <section className="max-w-4xl mx-auto px-6 lg:px-8 border-t border-gray-100 pt-20">
        <div className="prose prose-lg prose-red max-w-none text-gray-700">
          <h2 className="text-3xl font-black text-brand-dark mb-8">How YTGrowth Protects Your YouTube Channel</h2>
          <p>
            In an era where data privacy is paramount, YTGrowth stands as a beacon of trust for YouTube creators. Our <strong>secure YouTube tools</strong> are built with a "privacy-by-design" philosophy. This means that every feature, from our <strong>Channel Audit</strong> to our <strong>Keyword Researcher</strong>, is engineered to provide maximum value with minimum data exposure.
          </p>

          <h3 className="text-2xl font-bold text-brand-dark mt-12 mb-4">Official YouTube API Integration</h3>
          <p>
            We don't use "scrapers" or unauthorized methods to access data. YTGrowth is a verified developer on the Google Cloud Platform and uses the <strong>official YouTube Data API v3</strong>. This ensures that our interactions with the platform are fully compliant with YouTube's policies. By following these strict guidelines, we protect your channel from the risks associated with third-party tools that violate terms of service.
          </p>

          <div className="my-12 p-8 bg-brand-dark rounded-3xl text-white not-prose">
            <h4 className="text-xl font-bold mb-6 flex items-center gap-2">
              <EyeOff className="w-5 h-5 text-brand-red" />
              Our "Zero-Knowledge" Policy
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-brand-red mt-1 shrink-0" />
                <span>We never see your YouTube password or login credentials.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-brand-red mt-1 shrink-0" />
                <span>We do not store your private video metadata or unpublished drafts.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-brand-red mt-1 shrink-0" />
                <span>All analysis happens in volatile memory and is purged after use.</span>
              </li>
            </ul>
          </div>

          <h3 className="text-2xl font-bold text-brand-dark mt-12 mb-4">Enterprise-Grade Infrastructure</h3>
          <p>
            Our backend is powered by <strong>Google Cloud Platform (GCP)</strong>, the same infrastructure that powers YouTube itself. This provides us with world-class physical security, network protection, and data redundancy. Our <strong>SSL/TLS encryption</strong> ensures that the data traveling between your browser and our servers is unreadable to anyone else.
          </p>

          <h3 className="text-2xl font-bold text-brand-dark mt-12 mb-4">Safe Growth Strategies</h3>
          <p>
            Security isn't just about data; it's about the health of your channel. YTGrowth only provides <strong>white-hat SEO tools</strong>. We do not offer services that could lead to channel strikes or bans, such as automated engagement or bot-driven views. Our tools help you grow organically by providing the insights you need to make better content decisions.
          </p>
        </div>
      </section>

      {/* Final Trust CTA */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 mt-32">
        <div className="bg-gray-50 rounded-3xl p-12 flex flex-col md:flex-row items-center justify-between gap-8 border border-gray-100">
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-black text-brand-dark mb-4">Ready to grow safely?</h2>
            <p className="text-gray-600 max-w-md">
              Join 50,000+ creators who trust YTGrowth for their daily channel optimization and security.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              to="/tools"
              className="px-8 py-4 bg-brand-dark text-white font-black rounded-xl hover:bg-black transition-all flex items-center justify-center gap-2"
            >
              Explore Tools
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link 
              to="/faq"
              className="px-8 py-4 bg-white text-brand-dark border border-gray-200 font-black rounded-xl hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
            >
              Security FAQ
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Security;
