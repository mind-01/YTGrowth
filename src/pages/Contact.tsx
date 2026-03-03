import React from 'react';
import { motion } from 'motion/react';
import { 
  Mail, 
  MessageSquare, 
  LifeBuoy, 
  Briefcase, 
  Clock, 
  ShieldAlert,
  Send,
  ArrowLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Contact = () => {
  const contactSections = [
    {
      title: "General Inquiries",
      icon: MessageSquare,
      description: "For general questions about our platform, features, or policies:",
      email: "support@ytgrowth.com",
      color: "bg-blue-50 text-blue-600"
    },
    {
      title: "Technical Support",
      icon: LifeBuoy,
      description: "If you are experiencing technical issues, API-related errors, or unexpected behavior, please contact us with:",
      details: [
        "A brief description of the issue",
        "The page or feature involved",
        "Screenshots (if applicable)"
      ],
      email: "tech@ytgrowth.com",
      color: "bg-brand-red/10 text-brand-red"
    },
    {
      title: "Business & Partnership",
      icon: Briefcase,
      description: "For collaborations, partnerships, advertising, or media-related requests, please include relevant details about your proposal.",
      email: "partners@ytgrowth.com",
      color: "bg-emerald-50 text-emerald-600"
    },
    {
      title: "Legal & Compliance",
      icon: ShieldAlert,
      description: "For legal notices, compliance-related matters, or intellectual property concerns. All official communications must be submitted in writing via email.",
      email: "legal@ytgrowth.com",
      color: "bg-amber-50 text-amber-600"
    }
  ];

  return (
    <div className="bg-white min-h-screen pt-24 pb-20">
      {/* Hero Section */}
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
            Get in <span className="text-brand-red">Touch</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-medium">
            We value transparency, communication, and user trust. If you have any questions, feedback, or business inquiries, please feel free to contact us.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4 text-sm text-gray-400 font-bold uppercase tracking-widest">
            <span>Last Updated: March 3, 2026</span>
          </div>
        </motion.div>
      </header>

      {/* Contact Grid */}
      <main className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {contactSections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white border border-gray-100 rounded-[2.5rem] p-8 md:p-12 hover:shadow-xl hover:shadow-gray-100 transition-all duration-500 group"
            >
              <div className={`w-14 h-14 ${section.color} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500`}>
                <section.icon className="w-7 h-7" />
              </div>
              <h2 className="text-2xl font-black text-brand-dark mb-4 tracking-tight">{section.title}</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">{section.description}</p>
              
              {section.details && (
                <ul className="space-y-3 mb-8">
                  {section.details.map((detail) => (
                    <li key={detail} className="flex items-center gap-3 text-sm font-medium text-gray-500">
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-red" />
                      {detail}
                    </li>
                  ))}
                </ul>
              )}

              <a 
                href={`mailto:${section.email}`}
                className="inline-flex items-center gap-3 text-brand-dark hover:text-brand-red font-black text-lg transition-colors"
              >
                <Mail className="w-5 h-5" />
                {section.email}
              </a>
            </motion.div>
          ))}
        </div>

        {/* Response Time & Closing */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2 bg-brand-dark rounded-[3rem] p-10 md:p-16 text-white relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-red/20 rounded-full blur-[100px] -mr-32 -mt-32" />
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-brand-red" />
                </div>
                <h2 className="text-2xl font-black tracking-tight">Response Time</h2>
              </div>
              <p className="text-xl text-gray-300 leading-relaxed mb-8">
                We aim to respond to all inquiries within <span className="text-white font-bold">24–72 business hours</span>. Response times may vary depending on request volume.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="px-6 py-3 rounded-full bg-white/5 border border-white/10 text-sm font-bold uppercase tracking-widest">
                  Monday — Friday
                </div>
                <div className="px-6 py-3 rounded-full bg-white/5 border border-white/10 text-sm font-bold uppercase tracking-widest text-brand-red">
                  9:00 AM — 6:00 PM
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-gray-50 rounded-[3rem] p-10 md:p-16 text-center border border-gray-100"
          >
            <div className="w-20 h-20 bg-white rounded-full shadow-lg flex items-center justify-center mx-auto mb-8">
              <Send className="w-8 h-8 text-brand-red" />
            </div>
            <p className="text-lg font-bold text-brand-dark mb-4">Thank you for being part of our growing community.</p>
            <p className="text-brand-red font-black text-sm uppercase tracking-[0.2em]">We look forward to assisting you.</p>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Contact;
