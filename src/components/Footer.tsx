import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Globe, 
  Twitter, 
  Facebook, 
  Linkedin, 
  Instagram,
  ChevronDown,
  ExternalLink
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { TOOLS } from '../constants';

const Footer = () => {
  const { language, setLanguage, t } = useLanguage();
  const [isLangOpen, setIsLangOpen] = useState(false);
  const navigate = useNavigate();

  const handleSmoothScroll = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    if (window.location.pathname === '/') {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(`/#${id}`);
    }
  };

  const footerLinks = {
    PRODUCT: [
      { label: t('footer.home'), path: '/', type: 'link' },
      { label: t('footer.features'), path: '/features', type: 'link' },
      { label: t('footer.tool'), path: '/tools', type: 'link' },
      { label: t('footer.faq'), path: '/faq', type: 'link' },
    ],
    LEGAL: [
      { label: t('footer.security'), path: '/security', type: 'link' },
      { label: t('footer.privacy'), path: '/privacy', type: 'link' },
      { label: t('footer.terms'), path: '/terms', type: 'link' },
      { label: t('footer.cookies'), path: '/cookies', type: 'link' },
    ],
    COMPANY: [
      { label: t('footer.about'), path: '/about', type: 'link' },
      { label: t('footer.contact'), path: '/contact', type: 'link' },
      { label: t('footer.blog'), path: '/blog', type: 'link' },
      { label: t('footer.disclaimer'), path: '/disclaimer', type: 'link' },
    ]
  };

  return (
    <footer className="bg-[#1a1a1b] text-white pt-16 pb-8 md:pb-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className="flex flex-col gap-6">
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white">
                {t(`footer.${category.toLowerCase()}`)}
              </h3>
              <ul className="flex flex-col gap-4">
                {links.map((link) => (
                  <li key={link.label} className="relative">
                    {link.type === 'scroll' ? (
                      <button
                        onClick={(e) => handleSmoothScroll(e, link.path)}
                        className="text-sm text-gray-400 hover:text-brand-red transition-colors duration-200 font-medium"
                      >
                        {link.label}
                      </button>
                    ) : (
                      <Link 
                        to={link.path} 
                        className="text-sm text-gray-400 hover:text-brand-red transition-colors duration-200 font-medium"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="h-px bg-gray-800 w-full mb-8" />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Language Switcher */}
          <div className="relative order-2 md:order-1">
            <button 
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800/50 hover:bg-gray-800 text-xs font-bold transition-all border border-gray-700/50"
            >
              <Globe className="w-4 h-4 text-gray-400" />
              <span className="uppercase tracking-widest">{language}</span>
              <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform ${isLangOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isLangOpen && (
              <div className="absolute bottom-full left-0 mb-4 w-[280px] md:w-[600px] bg-[#1a1a1b] rounded-xl border border-gray-800 shadow-2xl overflow-hidden z-50 p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-1">
                  {[
                    'English', 'Español', 'Français', 'Deutsch', 'Italiano', 'Português', '日本語', 'Русский', '한국어',
                    '中文 (简体)', '中文 (繁體)', 'العربية', 'Български', 'Català', 'Nederlands', 'Ελληνικά', 'हिन्दी',
                    'Bahasa Indonesia', 'Bahasa Melayu', 'Polski', 'Svenska', 'ภาษาไทย', 'Türkçe', 'Українська', 'Tiếng Việt'
                  ].map((l) => (
                    <button
                      key={l}
                      onClick={() => {
                        setLanguage(l as any);
                        setIsLangOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-sm font-medium transition-colors rounded-lg flex items-center gap-2 ${
                        language === l ? 'text-brand-red bg-brand-red/10' : 'hover:bg-gray-800 text-gray-400 hover:text-white'
                      }`}
                    >
                      {language === l && <div className="w-1 h-1 rounded-full bg-brand-red" />}
                      {l}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-6 order-1 md:order-2">
            {[
              { icon: Twitter, href: 'https://x.com/ytgrowth' },
              { icon: Facebook, href: 'https://facebook.com/ytgrowth' },
              { icon: Linkedin, href: 'https://linkedin.com/company/ytgrowth' },
              { icon: Instagram, href: 'https://instagram.com/ytgrowth' }
            ].map((social, idx) => (
              <a 
                key={idx} 
                href={social.href} 
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-brand-red transition-all transform hover:scale-110"
              >
                <social.icon className="w-5 h-5" />
              </a>
            ))}
          </div>

          {/* Copyright */}
          <div className="order-3">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] text-center md:text-right">
              {t('footer.copyright')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
