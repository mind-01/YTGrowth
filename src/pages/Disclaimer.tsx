import React from 'react';
import { motion } from 'motion/react';
import { 
  ShieldAlert, 
  Database, 
  ExternalLink, 
  AlertTriangle, 
  Scale, 
  RefreshCw,
  Mail,
  ArrowLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Disclaimer = () => {
  const sections = [
    {
      id: "no-professional-advice",
      title: "1. No Professional Advice",
      icon: Scale,
      content: "All analytics insights, data interpretations, growth suggestions, and AI-generated outputs are provided for informational purposes only. YTGrowth does not provide financial, legal, investment, or professional business advice. Users are solely responsible for any decisions made based on the information provided by our platform."
    },
    {
      id: "data-accuracy",
      title: "2. Data Accuracy",
      icon: Database,
      content: "While we strive to provide accurate and up-to-date information, we make no guarantees regarding data completeness, reliability, accuracy, or performance outcomes. All YouTube-related data is retrieved using authorized API services and may be subject to delays, changes, or inaccuracies beyond our control."
    },
    {
      id: "no-affiliation",
      title: "3. No Affiliation",
      icon: ExternalLink,
      content: "YTGrowth is an independent platform. We are not affiliated with, endorsed by, sponsored by, or officially connected to YouTube or Google. All trademarks, logos, and brand names belong to their respective owners."
    },
    {
      id: "external-platform",
      title: "4. External Platform Responsibility",
      icon: AlertTriangle,
      content: "Changes in YouTube algorithms, policies, monetization systems, or API availability may affect our services. YTGrowth shall not be held responsible for channel performance changes, revenue fluctuations, ranking drops, policy violations, or account suspensions. Users must ensure compliance with YouTube’s official policies."
    },
    {
      id: "liability",
      title: "5. Limitation of Liability",
      icon: ShieldAlert,
      content: "Under no circumstances shall YTGrowth be liable for any direct, indirect, incidental, consequential, or special damages arising from the use of our analytics tools, reliance on AI-generated insights, third-party service interruptions, or platform downtime. Use of this platform is at your own discretion and risk."
    },
    {
      id: "updates",
      title: "6. Future Updates",
      icon: RefreshCw,
      content: "We reserve the right to modify this Disclaimer at any time. Changes will be reflected by updating the “Last Updated” date above."
    }
  ];

  return (
    <div className="bg-white min-h-screen pt-24 pb-20">
      {/* SEO Header Section */}
      <header className="max-w-7xl mx-auto px-6 lg:px-8 text-center mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-gray-400 hover:text-brand-red font-bold text-sm mb-8 transition-colors uppercase tracking-widest"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <h1 className="text-5xl md:text-7xl font-black text-brand-dark mb-8 tracking-tighter leading-none">
            Legal <span className="text-brand-red">Disclaimer</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-medium">
            The information provided by YTGrowth on this website is for general informational and analytical purposes only. By using this platform, you acknowledge and agree to the terms outlined below.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4 text-sm text-gray-400 font-bold uppercase tracking-widest">
            <span>Last Updated: March 3, 2026</span>
          </div>
        </motion.div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 lg:px-8">
        <div className="space-y-12">
          {sections.map((section, index) => (
            <motion.section
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center flex-shrink-0 group-hover:bg-brand-red/10 transition-colors duration-500">
                  <section.icon className="w-6 h-6 text-gray-400 group-hover:text-brand-red transition-colors duration-500" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-brand-dark mb-4 tracking-tight">
                    {section.title}
                  </h2>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    {section.content}
                  </p>
                </div>
              </div>
              {index !== sections.length - 1 && (
                <div className="mt-12 h-px bg-gray-100 w-full" />
              )}
            </motion.section>
          ))}
        </div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 bg-brand-dark rounded-[3rem] p-10 md:p-16 text-center text-white relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-red/20 rounded-full blur-[100px] -mr-32 -mt-32" />
          <div className="relative z-10">
            <h2 className="text-3xl font-black mb-6 tracking-tight">Questions regarding this Disclaimer?</h2>
            <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
              If you have any questions or require further clarification, our legal and support team is here to help.
            </p>
            <Link 
              to="/contact"
              className="inline-flex items-center gap-3 bg-brand-red hover:bg-white hover:text-brand-dark text-white px-10 py-5 rounded-2xl font-black text-lg transition-all duration-300 group"
            >
              <Mail className="w-6 h-6 group-hover:scale-110 transition-transform" />
              Contact Us
            </Link>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Disclaimer;
