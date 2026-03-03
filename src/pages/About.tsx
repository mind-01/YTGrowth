import React from 'react';
import { motion } from 'motion/react';
import { 
  Info, 
  Target, 
  Zap, 
  Cpu, 
  ShieldCheck, 
  TrendingUp, 
  Mail, 
  Activity,
  Globe,
  Users,
  Code
} from 'lucide-react';

const About = () => {
  const sections = [
    {
      title: "Our Vision",
      icon: Target,
      content: "We aim to empower creators by providing reliable analytics insights that help improve content strategy, audience understanding, and overall channel growth. YTGrowth focuses on simplicity, speed, and clarity — turning complex data into meaningful insights."
    },
    {
      title: "What We Do",
      icon: Activity,
      content: (
        <div className="space-y-4">
          <p>YTGrowth provides a comprehensive suite of tools designed for modern creators:</p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              "Real-time YouTube channel analytics",
              "AI-driven growth insights",
              "Public data analysis",
              "Performance tracking tools"
            ].map((item) => (
              <li key={item} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 text-sm font-medium text-gray-700">
                <div className="w-2 h-2 rounded-full bg-brand-red" />
                {item}
              </li>
            ))}
          </ul>
          <p className="text-sm text-gray-500 italic">We utilize authorized API services to fetch publicly available data and present it in a user-friendly format.</p>
        </div>
      )
    },
    {
      title: "Our Technology",
      icon: Cpu,
      content: (
        <div className="space-y-4">
          <p>YTGrowth operates using secure cloud infrastructure and modern web technologies. We use the <strong>YouTube Data API Services</strong> to retrieve publicly available information in compliance with platform policies.</p>
          <div className="flex items-center gap-4 p-4 bg-brand-dark rounded-2xl text-white">
            <ShieldCheck className="w-8 h-8 text-brand-red shrink-0" />
            <p className="text-sm">We do not access private user data without authorization. Our platform is hosted on reliable cloud infrastructure to ensure performance and stability.</p>
          </div>
        </div>
      )
    },
    {
      title: "Independence & Transparency",
      icon: Globe,
      content: (
        <div className="space-y-4">
          <p>YTGrowth is an independent analytics platform. We are <strong>not affiliated with, endorsed by, sponsored by, or officially connected to YouTube or Google</strong>.</p>
          <p className="text-sm text-gray-500">All trademarks and platform names belong to their respective owners. We maintain full transparency in our operations and data sourcing.</p>
        </div>
      )
    },
    {
      title: "Privacy & Security Commitment",
      icon: ShieldCheck,
      content: (
        <div className="space-y-4">
          <p>We value transparency and user trust above all else. Our commitment to you includes:</p>
          <ul className="space-y-3">
            {[
              { label: "Data Integrity", text: "We do not sell user data to third parties." },
              { label: "Minimal Storage", text: "We do not permanently store personal data." },
              { label: "Secure Processing", text: "All processing is handled responsibly and securely." }
            ].map((item) => (
              <li key={item.label} className="flex gap-4">
                <div className="w-6 h-6 rounded-full bg-brand-red/10 flex items-center justify-center shrink-0">
                  <Zap className="w-3 h-3 text-brand-red" />
                </div>
                <div>
                  <span className="font-bold text-brand-dark block text-sm">{item.label}</span>
                  <span className="text-sm text-gray-600">{item.text}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )
    },
    {
      title: "Future Development",
      icon: TrendingUp,
      content: (
        <div className="space-y-4">
          <p>We continuously improve YTGrowth by enhancing AI models, adding advanced analytics features, and improving performance and usability.</p>
          <p className="text-sm italic text-gray-500">Future updates may include optional account features, advertising integrations, and expanded growth tools.</p>
        </div>
      )
    },
    {
      title: "Contact Us",
      icon: Mail,
      content: (
        <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
          <p className="mb-4">If you have questions, suggestions, or partnership inquiries, please contact us at:</p>
          <a href="mailto:support@ytgrowth.com" className="inline-flex items-center gap-2 text-brand-red hover:underline font-black text-xl">
            <Mail className="w-6 h-6" />
            support@ytgrowth.com
          </a>
        </div>
      )
    }
  ];

  return (
    <div className="bg-white min-h-screen pt-24 pb-20">
      {/* SEO Optimized Hero Section */}
      <header className="max-w-7xl mx-auto px-6 lg:px-8 text-center mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-red/10 text-brand-red text-xs font-black uppercase tracking-[0.2em] mb-8">
            <Users className="w-4 h-4" />
            About YTGrowth
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-brand-dark mb-8 tracking-tighter leading-none">
            Empowering Creators with <br className="hidden md:block" />
            <span className="text-brand-red">AI-Powered Insights</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-medium">
            YTGrowth is an AI-powered YouTube analytics and growth insights platform designed to help creators understand their channel performance through smart data analysis and real-time metrics.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4 text-sm text-gray-400 font-bold uppercase tracking-widest">
            <span>Last Updated: March 3, 2026</span>
          </div>
        </motion.div>
      </header>

      {/* Mission Statement */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 mb-32">
        <div className="bg-brand-dark rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-red rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-red rounded-full blur-[120px]" />
          </div>
          
          <div className="relative z-10">
            <h2 className="text-brand-red text-sm font-black uppercase tracking-[0.3em] mb-6">Our Mission</h2>
            <p className="text-3xl md:text-5xl font-black text-white leading-tight max-w-4xl mx-auto tracking-tight">
              "To make YouTube data more accessible, understandable, and actionable for content creators worldwide."
            </p>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <main className="max-w-5xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-24">
          {sections.map((section, index) => (
            <motion.section
              key={section.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <div className="flex flex-col md:flex-row gap-8 md:gap-16">
                <div className="md:w-1/3">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center border border-gray-100 group-hover:bg-brand-red group-hover:text-white transition-all duration-300">
                      <section.icon className="w-6 h-6" />
                    </div>
                    <h2 className="text-2xl font-black text-brand-dark tracking-tight">
                      {section.title}
                    </h2>
                  </div>
                </div>
                <div className="md:w-2/3">
                  <div className="text-lg text-gray-600 leading-relaxed">
                    {section.content}
                  </div>
                </div>
              </div>
              {index !== sections.length - 1 && (
                <div className="h-px bg-gray-100 w-full mt-24" />
              )}
            </motion.section>
          ))}
        </div>

        {/* Closing Quote */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-40 text-center"
        >
          <p className="text-2xl font-bold text-brand-dark mb-4">Thank you for choosing YTGrowth.</p>
          <p className="text-brand-red font-black text-xl uppercase tracking-widest">We are committed to helping creators grow smarter.</p>
        </motion.div>
      </main>
    </div>
  );
};

export default About;
