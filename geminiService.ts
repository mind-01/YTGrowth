import React from 'react';
import { motion } from 'motion/react';
import { 
  Shield, 
  Database, 
  Cookie, 
  Lock, 
  ExternalLink, 
  UserCheck, 
  LogIn, 
  RefreshCw, 
  Mail, 
  Youtube,
  Info,
  Server,
  TrendingUp
} from 'lucide-react';

const Privacy = () => {
  const sections = [
    {
      title: "1. Information We Collect",
      icon: Database,
      content: (
        <div className="space-y-4">
          <div>
            <h3 className="font-bold text-brand-dark mb-1 flex items-center gap-2">
              <Youtube className="w-4 h-4 text-brand-red" /> a) Public YouTube Data
            </h3>
            <p>Our website uses the YouTube Data API provided by Google to fetch publicly available information such as channel statistics, video statistics, and public metadata. We do not access private YouTube data.</p>
          </div>
          <div>
            <h3 className="font-bold text-brand-dark mb-1 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-brand-red" /> b) No Account Required
            </h3>
            <p>Currently, users are not required to create an account or log in to use our tools.</p>
          </div>
          <div>
            <h3 className="font-bold text-brand-dark mb-1 flex items-center gap-2">
              <Shield className="w-4 h-4 text-brand-red" /> c) No Personal Data Storage
            </h3>
            <p>We do not store personal information in any database. All data processing is performed in real-time and is not permanently saved on our servers.</p>
          </div>
          <div>
            <h3 className="font-bold text-brand-dark mb-1 flex items-center gap-2">
              <Server className="w-4 h-4 text-brand-red" /> d) Server & Hosting Data
            </h3>
            <p>Our website is hosted on Vercel. Vercel may automatically collect standard technical information such as IP address, browser type, device type, and access time logs for performance and security purposes.</p>
          </div>
        </div>
      )
    },
    {
      title: "2. Use of YouTube API Services",
      icon: Youtube,
      content: (
        <div className="space-y-4">
          <p>Our application uses the YouTube Data API Services. By using our website, you agree to be bound by the <a href="https://www.youtube.com/t/terms" target="_blank" rel="noopener noreferrer" className="text-brand-red hover:underline">YouTube Terms of Service</a> and the <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-brand-red hover:underline">Google Privacy Policy</a>.</p>
          <p>We do not sell, store, or redistribute YouTube data. Data retrieved is used only to provide real-time analytics and insights to users.</p>
        </div>
      )
    },
    {
      title: "3. Cookies",
      icon: Cookie,
      content: "Currently, we do not use tracking cookies or third-party analytics tools such as Google Analytics. In the future, cookies may be used for performance improvements or advertising services (such as Google AdSense). This Privacy Policy will be updated accordingly if such features are added."
    },
    {
      title: "4. Advertising (Future Use)",
      icon: TrendingUp,
      content: "We may use Google AdSense or other advertising networks in the future. These services may use cookies to serve personalized ads. If advertising services are enabled, this policy will be updated to reflect those changes."
    },
    {
      title: "5. Data Security",
      icon: Lock,
      content: "We implement reasonable technical measures to protect data. However, no online service can guarantee 100% security."
    },
    {
      title: "6. Third-Party Links",
      icon: ExternalLink,
      content: "Our website may contain links to third-party websites. We are not responsible for the privacy practices of external sites."
    },
    {
      title: "7. Children's Privacy",
      icon: UserCheck,
      content: "Our tools are not directed toward children under 13 years of age. We do not knowingly collect personal data from children."
    },
    {
      title: "8. Future Login Feature",
      icon: LogIn,
      content: "Currently, we do not provide user login functionality. If Google Sign-In or account connection features are added in the future, this Privacy Policy will be updated to reflect how user data is handled."
    },
    {
      title: "9. Changes to This Policy",
      icon: RefreshCw,
      content: "We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated revision date."
    },
    {
      title: "10. Contact Us",
      icon: Mail,
      content: (
        <p>
          If you have any questions regarding this Privacy Policy, you may contact us at: <a href="mailto:support@ytgrowth.com" className="text-brand-red hover:underline font-bold">support@ytgrowth.com</a>
        </p>
      )
    }
  ];

  return (
    <div className="bg-bg-primary min-h-screen pt-24 pb-20">
      {/* Header */}
      <header className="max-w-7xl mx-auto px-6 lg:px-8 text-center mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-black text-brand-dark mb-4 tracking-tight">
            Privacy <span className="text-brand-red">Policy</span>
          </h1>
          <p className="text-lg text-brand-gray max-w-2xl mx-auto">
            Welcome to our website. Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect information when you use our tools and services.
          </p>
          <div className="mt-4 text-sm text-brand-gray font-medium">
            Last Updated: March 3, 2026
          </div>
        </motion.div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 lg:px-8">
        <div className="space-y-12">
          {sections.map((section, index) => (
            <motion.section
              key={section.title}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-xl bg-bg-primary flex items-center justify-center group-hover:bg-brand-red/10 transition-colors">
                  <section.icon className="w-5 h-5 text-brand-dark group-hover:text-brand-red transition-colors" />
                </div>
                <h2 className="text-2xl font-bold text-brand-dark">{section.title}</h2>
              </div>
              <div className="pl-14">
                <div className="text-brand-gray leading-relaxed text-lg">
                  {section.content}
                </div>
              </div>
            </motion.section>
          ))}
        </div>

        <div className="mt-20 pt-10 border-t border-border-primary text-center">
          <p className="text-brand-gray italic">
            By using this website, you agree to this Privacy Policy.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Privacy;
