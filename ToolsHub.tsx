import React from 'react';
import { motion } from 'motion/react';
import { 
  Shield, 
  ExternalLink, 
  UserCheck, 
  LogIn, 
  RefreshCw, 
  Mail, 
  Youtube,
  Info,
  Server,
  TrendingUp,
  Lock,
  Database
} from 'lucide-react';

const Terms = () => {
  const sections = [
    {
      title: "1. Acceptance of Terms",
      icon: UserCheck,
      content: "By using YTGrowth, you confirm that you have read, understood, and agreed to these Terms & Conditions and our Privacy Policy. Your continued use of the platform constitutes acceptance of any future updates or modifications."
    },
    {
      title: "2. Service Description",
      icon: TrendingUp,
      content: "YTGrowth is an independent AI-powered YouTube analytics and growth insights platform. We provide real-time analytical insights using publicly available data obtained via authorized API services. YTGrowth is an independent platform and is not affiliated with, endorsed by, sponsored by, or officially connected to YouTube or Google."
    },
    {
      title: "3. Use of YouTube API Services",
      icon: Youtube,
      content: (
        <div className="space-y-4">
          <p>Our platform uses the YouTube Data API Services provided by Google. By using YTGrowth, you also agree to comply with the <a href="https://www.youtube.com/t/terms" target="_blank" rel="noopener noreferrer" className="text-brand-red hover:underline">YouTube Terms of Service</a> and the <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-brand-red hover:underline">Google Privacy Policy</a>.</p>
          <p>We access only publicly available data and do not access private user information without authorization. Users must not misuse, manipulate, scrape, reverse-engineer, or exploit any YouTube API data provided through our platform.</p>
        </div>
      )
    },
    {
      title: "4. User Responsibilities",
      icon: Info,
      content: "Users are solely responsible for how they interpret and use insights provided by YTGrowth, ensuring compliance with YouTube’s policies and applicable laws, and maintaining lawful and ethical usage of our services. Any attempt to abuse, scrape, automate extraction, disrupt, or overload our systems is strictly prohibited."
    },
    {
      title: "5. Intellectual Property Rights",
      icon: Lock,
      content: "All content, algorithms, AI systems, designs, branding, interface elements, and proprietary methodologies used on YTGrowth are protected under applicable international copyright, trademark, and intellectual property laws. No part of this platform may be copied, reproduced, modified, distributed, or commercially exploited without prior written permission."
    },
    {
      title: "6. Accuracy of Information",
      icon: Shield,
      content: "While we strive to provide accurate and up-to-date analytics, we do not guarantee the completeness, reliability, or absolute accuracy of data. All insights are provided for informational purposes only. YTGrowth is not responsible for business decisions, monetization outcomes, ranking changes, or channel performance results based on our tool’s data."
    },
    {
      title: "7. Limitation of Liability",
      icon: ExternalLink,
      content: "To the maximum extent permitted by law: YTGrowth shall not be liable for any direct, indirect, incidental, consequential, or special damages arising from use or inability to use our services, API disruptions, platform downtime, third-party data inaccuracies, or YouTube policy changes. Use of the platform is at your own risk."
    },
    {
      title: "8. Termination of Access",
      icon: RefreshCw,
      content: "We reserve the right to suspend, restrict, or permanently block access to users who violate these Terms, attempt to scrape or reverse-engineer our platform, breach YouTube’s Terms of Service, or engage in unlawful or abusive behavior. Termination may occur without prior notice."
    },
    {
      title: "9. Third-Party Services",
      icon: Server,
      content: "Our services rely on third-party providers, including YouTube Data API Services and hosting infrastructure providers. We are not responsible for outages, interruptions, or changes made by third-party services."
    },
    {
      title: "10. Security Standards",
      icon: Lock,
      content: "We implement industry-standard technical and organizational security measures to protect our platform and maintain operational integrity. However, no digital service can guarantee absolute security."
    },
    {
      title: "11. Future Features",
      icon: Info,
      content: "We may introduce additional features in the future, including Google Sign-In, user dashboards, and advertising services (such as Google AdSense). These Terms will be updated accordingly if such features are implemented."
    },
    {
      title: "12. Modifications to Terms",
      icon: RefreshCw,
      content: "We reserve the right to update or modify these Terms at any time. Changes will be reflected by updating the “Last Updated” date at the top of this page. Continued use of the platform after changes constitutes acceptance of the revised Terms."
    },
    {
      title: "13. Governing Law",
      icon: Shield,
      content: "These Terms shall be governed and interpreted in accordance with applicable international digital service regulations and relevant jurisdictional laws."
    },
    {
      title: "14. Contact Information",
      icon: Mail,
      content: (
        <p>
          For questions regarding these Terms & Conditions, please contact: <a href="mailto:support@ytgrowth.com" className="text-brand-red hover:underline font-bold">support@ytgrowth.com</a>
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
            Terms & <span className="text-brand-red">Conditions</span>
          </h1>
          <p className="text-lg text-brand-gray max-w-2xl mx-auto">
            Welcome to YTGrowth. These Terms & Conditions (“Terms”) govern your access to and use of our website, tools, and services. By accessing or using YTGrowth, you agree to be legally bound by these Terms and our Privacy Policy.
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
            By using YTGrowth, you acknowledge that you have read, understood, and agreed to these Terms & Conditions.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Terms;
