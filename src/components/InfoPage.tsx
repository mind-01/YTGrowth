import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, FileText, Shield, HelpCircle, Mail, Info } from 'lucide-react';

export default function InfoPage() {
  const { slug } = useParams();
  
  const content: Record<string, { title: string; icon: any; body: string }> = {
    pricing: {
      title: 'Pricing Plans',
      icon: FileText,
      body: 'Choose the perfect plan for your YouTube growth. We offer flexible options for creators of all sizes.'
    },
    faq: {
      title: 'Frequently Asked Questions',
      icon: HelpCircle,
      body: 'Find answers to common questions about YTGrowth tools, subscriptions, and optimization strategies.'
    },
    privacy: {
      title: 'Privacy Policy',
      icon: Shield,
      body: 'Your privacy is our priority. Learn how we handle your data and protect your information.'
    },
    terms: {
      title: 'Terms & Conditions',
      icon: FileText,
      body: 'Please read our terms of service carefully before using YTGrowth tools.'
    },
    cookies: {
      title: 'Cookie Policy',
      icon: Info,
      body: 'We use cookies to improve your experience. Learn more about how we use them.'
    },
    about: {
      title: 'About Us',
      icon: Info,
      body: 'YTGrowth is dedicated to providing creators with the best AI-powered tools to grow their channels.'
    },
    contact: {
      title: 'Contact Us',
      icon: Mail,
      body: 'Have questions? Get in touch with our support team. We are here to help you grow.'
    }
  };

  const page = content[slug || ''] || {
    title: 'Page Not Found',
    icon: HelpCircle,
    body: 'The page you are looking for does not exist.'
  };

  const Icon = page.icon;

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <Link 
        to="/" 
        className="inline-flex items-center gap-2 text-brand-gray hover:text-brand-red font-bold text-sm mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card-bg rounded-[40px] border border-border-primary p-8 md:p-16 shadow-sm"
      >
        <div className="w-16 h-16 bg-brand-red/10 rounded-2xl flex items-center justify-center text-brand-red mb-8">
          <Icon className="w-8 h-8" />
        </div>
        
        <h1 className="text-4xl font-black text-brand-dark mb-6 tracking-tight">
          {page.title}
        </h1>
        
        <div className="prose prose-red max-w-none">
          <p className="text-lg text-brand-gray leading-relaxed mb-8">
            {page.body}
          </p>
          
          <div className="h-px bg-border-primary w-full my-12" />
          
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-brand-dark">Detailed Content Coming Soon</h2>
            <p className="text-brand-gray">
              We are currently updating our documentation and legal pages to provide you with the most accurate and up-to-date information. 
              Thank you for your patience as we build the ultimate YouTube growth suite.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
