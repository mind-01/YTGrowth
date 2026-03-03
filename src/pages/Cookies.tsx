import React from 'react';
import { motion } from 'motion/react';
import { 
  Cookie, 
  Shield, 
  Settings, 
  ExternalLink, 
  Info, 
  RefreshCw, 
  Mail, 
  Server,
  Lock,
  EyeOff,
  BarChart3
} from 'lucide-react';

const Cookies = () => {
  const sections = [
    {
      title: "1. What Are Cookies?",
      icon: Cookie,
      content: (
        <div className="space-y-4">
          <p>Cookies are small text files stored on your device when you visit a website. They help websites function properly, improve user experience, and provide certain technical capabilities.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
              <h3 className="font-bold text-brand-dark mb-2 flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-brand-red" />
                Session Cookies
              </h3>
              <p className="text-sm text-gray-600">These are temporary and expire as soon as you close your web browser.</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
              <h3 className="font-bold text-brand-dark mb-2 flex items-center gap-2">
                <Lock className="w-4 h-4 text-brand-red" />
                Persistent Cookies
              </h3>
              <p className="text-sm text-gray-600">These remain on your device for a set period or until you manually delete them.</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "2. How YTGrowth Uses Cookies",
      icon: Settings,
      content: (
        <div className="space-y-4">
          <p>Currently, YTGrowth uses only <strong>essential technical cookies</strong> necessary for the core operation of our platform. These cookies are vital for:</p>
          <ul className="list-disc pl-6 space-y-2 text-gray-600">
            <li>Maintaining website functionality and navigation.</li>
            <li>Optimizing performance for a faster user experience.</li>
            <li>Security monitoring to protect against unauthorized access.</li>
          </ul>
          <p className="bg-brand-red/5 p-4 rounded-xl border border-brand-red/10 text-brand-dark font-medium flex items-center gap-3">
            <EyeOff className="w-5 h-5 text-brand-red shrink-0" />
            We do not currently use behavioral tracking cookies or personal profiling technologies.
          </p>
        </div>
      )
    },
    {
      title: "3. Third-Party Services",
      icon: Server,
      content: (
        <div className="space-y-4">
          <p>Our platform relies on trusted third-party infrastructure providers to deliver our services efficiently. These include:</p>
          <ul className="list-disc pl-6 space-y-2 text-gray-600">
            <li><strong>Hosting Services:</strong> Provided by Vercel for fast and secure content delivery.</li>
            <li><strong>API Providers:</strong> YouTube Data API (Google) for fetching public channel insights.</li>
          </ul>
          <p>These providers may collect limited technical information (such as IP address, browser type, and server logs) strictly for operational and security purposes.</p>
        </div>
      )
    },
    {
      title: "4. Analytics & Advertising",
      icon: BarChart3,
      content: (
        <div className="space-y-4">
          <p>At present, YTGrowth maintains a clean, tracker-free environment for our users. We do <strong>NOT</strong> use:</p>
          <div className="flex flex-wrap gap-3">
            {['Google Analytics', 'Advertising Cookies', 'Interest-based Trackers'].map((item) => (
              <span key={item} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium border border-gray-200">
                {item}
              </span>
            ))}
          </div>
          <p className="text-sm italic text-gray-500 mt-4">
            Note: In the future, we may integrate services such as Google AdSense. If such services are implemented, this Cookie Policy will be updated to reflect those changes.
          </p>
        </div>
      )
    },
    {
      title: "5. Managing Cookie Preferences",
      icon: RefreshCw,
      content: (
        <div className="space-y-4">
          <p>You have full control over your cookie preferences. Most modern web browsers allow you to manage cookies directly through their settings menus.</p>
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
            <h3 className="font-bold text-brand-dark mb-4">Common Browser Controls:</h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                "View all stored cookies",
                "Delete specific cookies",
                "Block third-party cookies",
                "Set 'Do Not Track' requests",
                "Clear cookies on exit",
                "Block all cookies"
              ].map((control) => (
                <li key={control} className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-red" />
                  {control}
                </li>
              ))}
            </ul>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            <strong>Warning:</strong> Disabling essential cookies may impact the functionality and performance of certain features on our website.
          </p>
        </div>
      )
    },
    {
      title: "6. Data Protection & Security",
      icon: Shield,
      content: "We follow industry-standard technical and organizational measures to ensure that any cookie-related data is processed securely and responsibly. No tracking technology is used beyond what is strictly necessary for the operation of our services."
    },
    {
      title: "7. Updates to This Policy",
      icon: Info,
      content: "We reserve the right to update this Cookie Policy as our services evolve. Any changes will be reflected by updating the “Last Updated” date at the top of this page. We encourage users to review this policy periodically."
    },
    {
      title: "8. Contact Information",
      icon: Mail,
      content: (
        <div className="p-6 bg-brand-dark rounded-2xl text-white">
          <p className="mb-4">If you have any questions or concerns regarding our Cookie Policy, please reach out to our support team:</p>
          <a href="mailto:support@ytgrowth.com" className="inline-flex items-center gap-2 text-brand-red hover:text-white transition-colors font-bold text-lg">
            <Mail className="w-5 h-5" />
            support@ytgrowth.com
          </a>
        </div>
      )
    }
  ];

  return (
    <div className="bg-white min-h-screen pt-24 pb-20">
      {/* SEO Optimized Header */}
      <header className="max-w-7xl mx-auto px-6 lg:px-8 text-center mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-red/10 text-brand-red text-xs font-bold uppercase tracking-widest mb-6">
            <Cookie className="w-3 h-3" />
            Transparency First
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-brand-dark mb-4 tracking-tight">
            Cookie <span className="text-brand-red">Policy</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            This Cookie Policy explains how YTGrowth uses cookies and similar tracking technologies to provide a secure and efficient experience for our users. By continuing to use our platform, you agree to the practices described below.
          </p>
          <div className="mt-6 flex items-center justify-center gap-4 text-sm text-gray-400 font-medium">
            <span>Last Updated: March 3, 2026</span>
            <span className="w-1 h-1 rounded-full bg-gray-300" />
            <span>Version 1.2</span>
          </div>
        </motion.div>
      </header>

      {/* Main Content Grid */}
      <main className="max-w-4xl mx-auto px-6 lg:px-8">
        <div className="space-y-16">
          {sections.map((section, index) => (
            <motion.section
              key={section.title}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              <div className="flex items-start gap-6">
                <div className="hidden sm:flex w-12 h-12 rounded-2xl bg-gray-50 items-center justify-center shrink-0 border border-gray-100 group">
                  <section.icon className="w-6 h-6 text-brand-dark group-hover:text-brand-red transition-colors" />
                </div>
                <div className="flex-grow">
                  <div className="flex items-center gap-3 mb-4">
                    <section.icon className="w-5 h-5 text-brand-red sm:hidden" />
                    <h2 className="text-2xl font-bold text-brand-dark tracking-tight">
                      {section.title}
                    </h2>
                  </div>
                  <div className="text-gray-600 leading-relaxed text-lg">
                    {section.content}
                  </div>
                </div>
              </div>
            </motion.section>
          ))}
        </div>

        {/* Footer Agreement */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-24 p-8 rounded-3xl bg-gray-50 border border-gray-100 text-center"
        >
          <p className="text-gray-600 italic leading-relaxed">
            "By using YTGrowth, you acknowledge that you have read and understood this Cookie Policy. We are committed to protecting your privacy while providing the best YouTube growth tools in the industry."
          </p>
        </motion.div>
      </main>
    </div>
  );
};

export default Cookies;
