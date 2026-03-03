import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  FileText, 
  Tags, 
  Hash, 
  CheckSquare, 
  Key,
  Lightbulb,
  Video,
  PenTool,
  Layout,
  Image,
  Star,
  Clock,
  User,
  DollarSign,
  Activity,
  Eye,
  TrendingUp,
  MessageSquare,
  Globe,
  ArrowRight,
  Sparkles,
  ChevronDown,
  ShieldCheck,
  Zap,
  Target,
  Users,
  LineChart,
  BarChart3,
  CheckCircle2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const FeatureCard = ({ icon: Icon, title, description, delay, id }: { 
  icon: any, 
  title: string, 
  description: string, 
  delay: number,
  id?: string
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.5 }}
  >
    <Link 
      to={id ? `/#${id}` : '/'}
      className="block h-full bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group relative overflow-hidden"
    >
      <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center mb-4 group-hover:bg-brand-red/10 transition-colors">
        <Icon className="w-6 h-6 text-brand-dark group-hover:text-brand-red transition-colors" />
      </div>
      <h3 className="text-lg font-bold text-brand-dark mb-2 tracking-tight">
        {title}
      </h3>
      <p className="text-sm text-brand-gray leading-relaxed font-medium">
        {description}
      </p>
    </Link>
  </motion.div>
);

const FAQItem = ({ question, answer }: { question: string, answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex items-center justify-between text-left group"
      >
        <span className="text-lg font-bold text-brand-dark group-hover:text-brand-red transition-colors">
          {question}
        </span>
        <ChevronDown className={`w-5 h-5 text-brand-gray transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="pb-6 text-brand-gray leading-relaxed font-medium">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function Features() {
  const { language, t } = useLanguage();

  const content = {
    English: {
      hero: {
        badge: "AI-Powered Growth",
        title: "All-in-One AI YouTube Growth Tools for Creators Worldwide",
        description: "Grow faster on YouTube using powerful SEO tools, AI content generators, and advanced analytics — all in one platform.",
        cta: "Start Growing Now",
        pricing: "View Pricing"
      },
      valueProp: {
        title: "Save Time. Boost Views. Scale Your Channel.",
        description: "YT Growth simplifies YouTube SEO, content planning, analytics, and monetization tracking using AI automation. Our platform is designed to handle the heavy lifting of channel management, allowing you to focus on what you do best: creating amazing content.",
        items: [
          "Automated SEO optimization for every upload",
          "AI-driven content ideas tailored to your niche",
          "Real-time tracking of monetization milestones",
          "Comprehensive channel health diagnostics"
        ]
      },
      cta: {
        title: "Ready to dominate the algorithm?",
        button: "Generate Results Now",
        subtext: "No Credit Card Required • Global Access"
      },
      trust: {
        title: "Built for Creators. Powered by AI.",
        description: "We combine professional-grade data with advanced artificial intelligence to give you the edge.",
        cards: [
          {
            icon: Zap,
            title: "Performance & Speed",
            description: "Our tools are optimized for speed, fetching data directly from the YouTube API to ensure you have the most up-to-date information at your fingertips."
          },
          {
            icon: LineChart,
            title: "Data-Driven Growth",
            description: "We don't guess; we calculate. Our AI models analyze millions of data points across the YouTube ecosystem to provide you with actionable insights."
          }
        ]
      },
      why: {
        title: "Why YT Growth is the Ultimate YouTube Growth Platform",
        items: [
          "All-in-One Creator Toolkit",
          "AI-Powered Automation",
          "Beginner-Friendly Interface",
          "Advanced Analytics",
          "Global Optimization",
          "Designed for YouTube SEO Success"
        ]
      },
      faq: {
        title: "Frequently Asked Questions",
        description: "Everything you need to know about YT Growth and how it helps you scale.",
        items: [
          { q: "What is YT Growth?", a: "YT Growth is an all-in-one AI-powered toolkit designed to help YouTube creators grow their channels faster through advanced SEO, content generation, and analytics tools." },
          { q: "Is YT Growth suitable for beginners?", a: "Yes, YT Growth is built with a beginner-friendly interface that simplifies complex YouTube SEO and analytics, making it perfect for creators at any stage." },
          { q: "Can I use YT Growth worldwide?", a: "Absolutely! YT Growth supports creators globally with multi-language support and location-based trending insights for various international markets." },
          { q: "Does YT Growth help with YouTube SEO?", a: "Yes, our platform includes a comprehensive suite of SEO tools including title, tag, and description generators, plus keyword research and an SEO checklist." },
          { q: "Is YT Growth AI-powered?", a: "Yes, YT Growth leverages advanced AI models like Gemini to provide intelligent content ideas, sentiment analysis, and predictive growth tracking." }
        ]
      }
    },
    Hindi: {
      hero: {
        badge: "AI-संचालित विकास",
        title: "दुनिया भर के क्रिएटर्स के लिए ऑल-इन-वन AI YouTube ग्रोथ टूल्स",
        description: "शक्तिशाली SEO टूल्स, AI कंटेंट जेनरेटर और एडवांस्ड एनालिटिक्स का उपयोग करके YouTube पर तेज़ी से बढ़ें — सब एक ही प्लेटफॉर्म पर।",
        cta: "अभी बढ़ना शुरू करें",
        pricing: "कीमत देखें"
      },
      valueProp: {
        title: "समय बचाएं। व्यूज बढ़ाएं। अपने चैनल को स्केल करें।",
        description: "YT Growth AI ऑटोमेशन का उपयोग करके YouTube SEO, कंटेंट प्लानिंग, एनालिटिक्स और मुद्रीकरण ट्रैकिंग को सरल बनाता है। हमारा प्लेटफॉर्म चैनल प्रबंधन के भारी काम को संभालने के लिए डिज़ाइन किया गया है, जिससे आप उस पर ध्यान केंद्रित कर सकते हैं जो आप सबसे अच्छा करते हैं: अद्भुत कंटेंट बनाना।",
        items: [
          "हर अपलोड के लिए ऑटोमेटेड SEO ऑप्टिमाइज़ेशन",
          "आपके नीश के लिए तैयार AI-संचालित कंटेंट आइडिया",
          "मुद्रीकरण मील के पत्थर की रियल-टाइम ट्रैकिंग",
          "व्यापक चैनल स्वास्थ्य डायग्नोस्टिक्स"
        ]
      },
      cta: {
        title: "क्या आप एल्गोरिदम पर हावी होने के लिए तैयार हैं?",
        button: "परिणाम उत्पन्न करें",
        subtext: "क्रेडिट कार्ड की आवश्यकता नहीं • वैश्विक पहुंच"
      },
      trust: {
        title: "क्रिएटर्स के लिए निर्मित। AI द्वारा संचालित।",
        description: "हम आपको बढ़त देने के लिए एडवांस्ड आर्टिफिशियल इंटेलिजेंस के साथ प्रोफेशनल-ग्रेड डेटा को मिलाते हैं।",
        cards: [
          {
            icon: Zap,
            title: "प्रदर्शन और गति",
            description: "हमारे टूल्स गति के लिए ऑप्टिमाइज़ किए गए हैं, सीधे YouTube API से डेटा प्राप्त करते हैं।"
          },
          {
            icon: LineChart,
            title: "डेटा-संचालित विकास",
            description: "हम अनुमान नहीं लगाते; हम गणना करते हैं। हमारे AI मॉडल लाखों डेटा पॉइंट्स का विश्लेषण करते हैं।"
          }
        ]
      },
      why: {
        title: "क्यों YT Growth अंतिम YouTube विकास प्लेटफॉर्म है",
        items: [
          "ऑल-इन-वन क्रिएटर टूलकिट",
          "AI-संचालित ऑटोमेशन",
          "शुरुआती-अनुकूल इंटरफेस",
          "एडवांस्ड एनालिटिक्स",
          "ग्लोबल ऑप्टिमाइज़ेशन",
          "YouTube SEO सफलता के लिए डिज़ाइन किया गया"
        ]
      },
      faq: {
        title: "अक्सर पूछे जाने वाले प्रश्न",
        description: "YT Growth के बारे में वह सब कुछ जो आपको जानना चाहिए और यह आपको स्केल करने में कैसे मदद करता है।",
        items: [
          { q: "What is YT Growth?", a: "YT Growth एक ऑल-इन-वन AI-संचालित टूलकिट है जिसे YouTube क्रिएटर्स को उनके चैनल तेज़ी से बढ़ाने में मदद करने के लिए डिज़ाइन किया गया है।" },
          { q: "क्या YT Growth शुरुआती लोगों के लिए उपयुक्त है?", a: "हाँ, YT Growth एक शुरुआती-अनुकूल इंटरफेस के साथ बनाया गया है जो जटिल YouTube SEO को सरल बनाता है।" },
          { q: "क्या मैं दुनिया भर में YT Growth का उपयोग कर सकता हूँ?", a: "बिल्कुल! YT Growth बहु-भाषा समर्थन के साथ विश्व स्तर पर क्रिएटर्स का समर्थन करता है।" },
          { q: "क्या YT Growth YouTube SEO में मदद करता है?", a: "हाँ, हमारे प्लेटफॉर्म में टाइटल, टैग और डिस्क्रिप्शन जेनरेटर सहित SEO टूल्स का एक व्यापक सुइट शामिल है।" },
          { q: "क्या YT Growth AI-संचालित है?", a: "हाँ, YT Growth बुद्धिमान कंटेंट आइडिया और सेंटीमेंट एनालिसिस प्रदान करने के लिए एडवांस्ड AI मॉडल का उपयोग करता है।" }
        ]
      }
    },
    Hinglish: {
      hero: {
        badge: "AI-Powered Growth",
        title: "Duniya bhar ke Creators ke liye All-in-One AI YouTube Growth Tools",
        description: "Powerful SEO tools, AI content generators, aur advanced analytics ka use karke YouTube par fast grow karein — sab ek hi platform par.",
        cta: "Abhi Badhna Shuru Karein",
        pricing: "Pricing Dekhein"
      },
      valueProp: {
        title: "Time Bachayein. Views Badhayein. Channel Scale Karein.",
        description: "YT Growth AI automation ka use karke YouTube SEO, content planning, analytics, aur monetization tracking ko simple banata hai. Humara platform channel management ke heavy kaam ko handle karne ke liye design kiya gaya hai.",
        items: [
          "Har upload ke liye automated SEO optimization",
          "Aapke niche ke liye AI-driven content ideas",
          "Monetization milestones ki real-time tracking",
          "Comprehensive channel health diagnostics"
        ]
      },
      cta: {
        title: "Kya aap algorithm par kabza karne ke liye ready hain?",
        button: "Results Generate Karein",
        subtext: "No Credit Card Required • Global Access"
      },
      trust: {
        title: "Creators ke liye bana. AI se chalta hai.",
        description: "Hum professional-grade data ko advanced AI ke saath mix karte hain aapko edge dene ke liye.",
        cards: [
          {
            icon: Zap,
            title: "Performance & Speed",
            description: "Humare tools fast hain, direct YouTube API se data fetch karte hain."
          },
          {
            icon: LineChart,
            title: "Data-Driven Growth",
            description: "Hum guess nahi karte; calculate karte hain. Millions of data points analyze hote hain."
          }
        ]
      },
      why: {
        title: "Kyun YT Growth best YouTube Growth Platform hai",
        items: [
          "All-in-One Creator Toolkit",
          "AI-Powered Automation",
          "Beginner-Friendly Interface",
          "Advanced Analytics",
          "Global Optimization",
          "YouTube SEO Success ke liye design kiya gaya"
        ]
      },
      faq: {
        title: "Frequently Asked Questions",
        description: "YT Growth ke baare mein sab kuch jo aapko jaanna chahiye.",
        items: [
          { q: "YT Growth kya hai?", a: "YT Growth ek all-in-one AI-powered toolkit hai jo YouTube creators ko grow karne mein help karta hai." },
          { q: "Kya beginners use kar sakte hain?", a: "Haan, YT Growth beginner-friendly hai aur complex SEO ko simple banata hai." },
          { q: "Kya main worldwide use kar sakta hoon?", a: "Bilkul! YT Growth global creators ko support karta hai multi-language support ke saath." },
          { q: "Kya ye SEO mein help karta hai?", a: "Haan, humare paas title, tag, aur description generators jaise comprehensive SEO tools hain." },
          { q: "Kya ye AI-powered hai?", a: "Haan, YT Growth advanced AI models use karta hai content ideas aur sentiment analysis ke liye." }
        ]
      }
    }
  };

  const cur = content[language as keyof typeof content] || content.English;

  useEffect(() => {
    document.title = "YT Growth – Best AI YouTube Growth & SEO Tools Worldwide";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Discover YT Growth, the ultimate AI-powered YouTube toolkit. Optimize titles, tags, thumbnails, keywords, and analytics to grow faster worldwide.');
    }

    // FAQ Schema
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.innerHTML = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": cur.faq.items.map(item => ({
        "@type": "Question",
        "name": item.q,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": item.a
        }
      }))
    });
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [language]);

  return (
    <div className="bg-white min-h-screen">
      {/* 1. Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-red/5 border border-brand-red/10 mb-6">
                <Sparkles className="w-4 h-4 text-brand-red" />
                <span className="text-xs font-black uppercase tracking-widest text-brand-red">{cur.hero.badge}</span>
              </div>
              <h1 className="text-5xl lg:text-7xl font-black text-brand-dark tracking-tighter mb-6 leading-[1.1]">
                {cur.hero.title}
              </h1>
              <p className="text-xl text-brand-gray max-w-xl mb-10 font-medium leading-relaxed">
                {cur.hero.description}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/"
                  className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-brand-red text-white rounded-2xl text-lg font-black uppercase tracking-widest hover:bg-red-600 transition-all shadow-xl shadow-brand-red/20 group"
                >
                  {cur.hero.cta}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/pricing"
                  className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-brand-dark border-2 border-gray-100 rounded-2xl text-lg font-black uppercase tracking-widest hover:bg-gray-50 transition-all"
                >
                  {cur.hero.pricing}
                </Link>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="absolute inset-0 bg-brand-red/10 blur-[120px] rounded-full -z-10" />
              <div className="bg-white p-4 rounded-[3rem] shadow-2xl border border-gray-100 relative overflow-hidden">
                <img 
                  src="https://picsum.photos/seed/ytgrowth/800/600" 
                  alt="YT Growth Dashboard Illustration" 
                  className="rounded-[2.5rem] w-full h-auto"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute bottom-8 left-8 right-8 bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-lg">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 rounded-full bg-brand-red flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-xs font-black text-brand-dark uppercase tracking-widest">Growth Velocity</div>
                      <div className="text-xl font-black text-brand-red">+124%</div>
                    </div>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: '75%' }}
                      transition={{ duration: 1.5, delay: 1 }}
                      className="h-full bg-brand-red" 
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. Value Proposition Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-brand-dark mb-4 tracking-tight">{cur.trust.title}</h2>
            <p className="text-lg text-brand-gray font-medium max-w-2xl mx-auto">{cur.trust.description}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {cur.trust.cards.map((card, i) => (
              <div key={i} className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100">
                <div className={`w-14 h-14 rounded-2xl ${i === 0 ? 'bg-blue-500' : 'bg-emerald-500'} flex items-center justify-center mb-6`}>
                  <card.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-black text-brand-dark mb-4 tracking-tight">{card.title}</h3>
                <p className="text-brand-gray font-medium leading-relaxed">
                  {card.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Why YT Growth Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl lg:text-5xl font-black text-brand-dark mb-8 tracking-tight">
                {cur.why.title}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {cur.why.items.map((item, i) => {
                  const icons = [Target, Zap, Users, BarChart3, Globe, ShieldCheck];
                  const Icon = icons[i % icons.length];
                  return (
                    <div key={i} className="flex items-center gap-3 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                      <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                        <Icon className="w-5 h-5 text-brand-red" />
                      </div>
                      <span className="text-sm font-bold text-brand-dark">{item}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-brand-red/5 blur-[100px] rounded-full -z-10" />
              <img 
                src="https://picsum.photos/seed/success/800/800" 
                alt="Success Illustration" 
                className="rounded-[3rem] shadow-2xl border border-gray-100"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 6. FAQ Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-brand-dark mb-4 tracking-tight">{cur.faq.title}</h2>
            <p className="text-lg text-brand-gray font-medium">{cur.faq.description}</p>
          </div>
          <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-gray-100">
            {cur.faq.items.map((item, i) => (
              <FAQItem key={i} question={item.q} answer={item.a} />
            ))}
          </div>
        </div>
      </section>

      {/* 7. SEO Footer Content & Final CTA */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-brand-dark rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden shadow-2xl mb-24"
          >
            <div className="absolute top-0 left-0 w-full h-full opacity-10">
              <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-red rounded-full blur-[100px]" />
              <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500 rounded-full blur-[100px]" />
            </div>
            
            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-black text-white mb-10 tracking-tight leading-tight">
                {cur.cta.title}
              </h2>
              <Link
                to="/"
                className="inline-flex items-center gap-4 px-12 py-6 bg-brand-red text-white rounded-2xl text-xl font-black uppercase tracking-widest hover:bg-red-600 transition-all shadow-2xl shadow-brand-red/40 group active:scale-95"
              >
                {cur.cta.button}
                <ArrowRight className="w-7 h-7 group-hover:translate-x-2 transition-transform" />
              </Link>
              <p className="mt-8 text-gray-400 font-bold uppercase tracking-widest text-sm">
                {cur.cta.subtext}
              </p>
            </div>
          </motion.div>

          <div className="prose prose-sm max-w-none text-brand-gray font-medium leading-relaxed opacity-60">
            <h2 className="text-brand-dark font-black mb-4">The Ultimate YouTube Creator Toolkit</h2>
            <p>
              In the competitive landscape of digital content, having the right <strong>YouTube growth tools</strong> is essential. YT Growth provides a comprehensive suite of <strong>AI YouTube tools</strong> designed to help creators of all sizes. Whether you're looking for <strong>YouTube SEO tools</strong> to optimize your metadata or advanced analytics to understand your audience, our platform delivers.
            </p>
            <p>
              Our <strong>YouTube creator toolkit</strong> includes everything from keyword research and title generation to monetization tracking and competitor analysis. We help you <strong>grow your YouTube channel fast</strong> by leveraging data-driven insights and AI-powered automation. Join thousands of creators worldwide who trust YT Growth to scale their presence on the world's largest video platform.
            </p>
            <div className="flex flex-wrap gap-4 mt-8">
              <Link to="/" className="text-brand-red hover:underline font-bold">All Tools</Link>
              <Link to="/info/pricing" className="text-brand-red hover:underline font-bold">Pricing Plans</Link>
              <Link to="#" className="text-brand-red hover:underline font-bold">Creator Blog</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// Missing icon component
const CpuIcon = (props: any) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="16" height="16" x="4" y="4" rx="2" />
    <rect width="6" height="6" x="9" y="9" rx="1" />
    <path d="M15 2v2" />
    <path d="M15 20v2" />
    <path d="M2 15h2" />
    <path d="M2 9h2" />
    <path d="M20 15h2" />
    <path d="M20 9h2" />
    <path d="M9 2v2" />
    <path d="M9 20v2" />
  </svg>
);
