import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Globe, 
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

  const Pinterest = (props: any) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.966 1.406-5.966s-.359-.72-.359-1.781c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.607 0 11.985-5.365 11.985-11.987C24.021 5.367 18.624 0 12.017 0z"/>
    </svg>
  );

  const Medium = (props: any) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.41-3.38 6.41S14.2 15.54 14.2 12s1.51-6.41 3.38-6.41 3.38 2.87 3.38 6.41zM24 12c0 3.17-.53 5.75-1.19 5.75s-1.19-2.58-1.19-5.75.53-5.75 1.19-5.75S24 8.83 24 12z"/>
    </svg>
  );

  const Quora = (props: any) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M15.742 17.201c.907-.908 1.568-2.044 1.884-3.291.317-1.247.317-2.573 0-3.82-.316-1.247-.977-2.383-1.884-3.291-.908-.907-2.044-1.568-3.291-1.884-1.247-.317-2.573-.317-3.82 0-1.247.316-2.383.977-3.291 1.884-.907.908-1.568 2.044-1.884 3.291-.317 1.247-.317 2.573 0 3.82.316 1.247.977 2.383 1.884 3.291.908.907 2.044 1.568 3.291 1.884 1.247.317 2.573.317 3.82 0 1.247-.316 2.383-.977 3.291-1.884zm-5.492-9.201c.712 0 1.417.14 2.074.412.657.272 1.25.674 1.744 1.183.494.509.88 1.108 1.137 1.763.257.655.387 1.354.387 2.059 0 .705-.13 1.404-.387 2.059-.257.655-.643 1.254-1.137 1.763-.494.509-1.087.911-1.744 1.183-.657.272-1.362.412-2.074.412-.712 0-1.417-.14-2.074-.412-.657-.272-1.25-.674-1.744-1.183-.494-.509-.88-1.108-1.137-1.763-.257-.655-.387-1.354-.387-2.059 0-.705.13-1.404.387-2.059.257-.655.643-1.254 1.137-1.763.494-.509 1.087-.911 1.744-1.183.657-.272 1.362-.412 2.074-.412zm13.75 14.25l-4.5-4.5c.9-.9 1.5-2.1 1.8-3.3.3-1.2.3-2.5 0-3.8-.3-1.2-.9-2.4-1.8-3.3-.9-.9-2.1-1.5-3.3-1.8-1.2-.3-2.5-.3-3.8 0-1.2.3-2.4.9-3.3 1.8-.9.9-1.5 2.1-1.8 3.3-.3 1.2-.3 2.5 0 3.8.3 1.2.9 2.4 1.8 3.3.9.9 2.1 1.5 3.3 1.8 1.2.3 2.5.3 3.8 0 1.2-.3 2.4-.9 3.3-1.8l4.5 4.5 1.5-1.5z"/>
    </svg>
  );

  const Reddit = (props: any) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.966 0 1.75.783 1.75 1.75 0 .672-.375 1.25-.933 1.541.028.194.043.39.043.588 0 2.73-3.13 4.953-6.99 4.953-3.86 0-6.99-2.224-6.99-4.953 0-.198.015-.393.043-.588-.558-.291-.933-.869-.933-1.541 0-.967.784-1.75 1.75-1.75.477 0 .901.182 1.207.491 1.194-.856 2.85-1.419 4.674-1.488l.82-3.847 2.346.494c-.047.136-.073.282-.073.434zm-7.51 9.306c-.69 0-1.25.56-1.25 1.25 0 .69.56 1.25 1.25 1.25.69 0 1.25-.56 1.25-1.25 0-.69-.56-1.25-1.25-1.25zm5 0c-.69 0-1.25.56-1.25 1.25 0 .69.56 1.25 1.25 1.25.69 0 1.25-.56 1.25-1.25 0-.69-.56-1.25-1.25-1.25zm-5.465 3.19c-.114.117-.114.306 0 .423.71.71 1.89.88 2.465.88.575 0 1.755-.17 2.465-.88.114-.117.114-.306 0-.423-.114-.117-.306-.117-.423 0-.533.533-1.443.68-2.042.68-.6 0-1.51-.147-2.042-.68-.117-.117-.31-.117-.423 0z"/>
    </svg>
  );

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
              { icon: Instagram, path: '/instagram' },
              { icon: Pinterest, path: '/pinterest' },
              { icon: Medium, path: '/medium' },
              { icon: Quora, path: '/quora' },
              { icon: Reddit, path: '/reddit' }
            ].map((social, idx) => (
              <Link 
                key={idx} 
                to={social.path} 
                className="text-gray-400 hover:text-brand-red transition-all transform hover:scale-110"
              >
                <social.icon className="w-5 h-5" />
              </Link>
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
