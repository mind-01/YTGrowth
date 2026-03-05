import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 
  | 'English' | 'Español' | 'Français' | 'Deutsch' | 'Italiano' | 'Português' | '日本語' | 'Русский' | '한국어'
  | '中文 (简体)' | '中文 (繁體)' | 'العربية' | 'Български' | 'Català' | 'Nederlands' | 'Ελληνικά' | 'हिन्दी'
  | 'Bahasa Indonesia' | 'Bahasa Melayu' | 'Polski' | 'Svenska' | 'ภาษาไทย' | 'Türkçe' | 'Українська' | 'Tiếng Việt';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  English: {
    'hero.title': 'Best AI YouTube Growth Tools:',
    'hero.subtitle': 'Optimize SEO & Boost Views Free',
    'hero.description': 'Unlock your channel\'s potential with our 100% free AI-powered toolkit. From keyword research to viral title generation, get everything you need to dominate the YouTube algorithm.',
    'hero.badge': '✨ 20+ Free AI Tools for YouTube Creators',
    'search.placeholder': 'Search for a tool...',
    'dashboard.no_tools': 'No tools found',
    'dashboard.no_tools_desc': 'Try searching for something else or change the category.',
    'nav.dashboard': 'Dashboard',
    'nav.get_started': 'Start Free',
    'footer.product': 'Product',
    'footer.legal': 'Legal',
    'footer.company': 'Company',
    'footer.copyright': '© 2026 YTGrowth - Your YouTube Growth Partner',
    'footer.home': 'Home',
    'footer.features': 'Features',
    'footer.price': 'Price',
    'footer.tool': 'Tool',
    'footer.faq': 'FAQ',
    'footer.security': 'Security',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms & Conditions',
    'footer.cookies': 'Cookies',
    'footer.about': 'About Us',
    'footer.contact': 'Contact Us',
    'footer.blog': 'Blog',
    'footer.disclaimer': 'Disclaimer',
    'nav.home': 'Home',
    'nav.stats': 'My Stats',
    'nav.trending': 'Trending',
    'nav.settings': 'Settings',
    'nav.back': 'Back',
    'nav.analyze_content': 'Analyze Your Content',
    'nav.paste': 'Paste',
    'nav.enter_topic': 'Enter video topic...',
    'nav.paste_video_link': 'Paste YouTube video link here...',
    'nav.paste_channel_link': 'Paste YouTube channel link here...',
    'nav.generate_results': 'GENERATE RESULTS',
    'nav.search_keywords': 'SEARCH KEYWORDS',
    'nav.checklist': 'CHECKLIST',
    'nav.all_tools': 'All Tools 🛠️',
    'nav.ultimate_suite': 'The Ultimate YouTube Growth Suite',
    'nav.quick_search': 'Quick search tools...',
    'cat.all': 'All',
    'cat.saved': 'Saved',
    'cat.seo': 'SEO',
    'cat.content': 'Content',
    'cat.channel': 'Channel',
    'cat.analytics': 'Analytics',
    'cat.analytics_global': 'Analytics & Global',
    'cat.seo_tools': 'SEO Tools',
    'cat.content_tools': 'Content Tools',
    'cat.channel_tools': 'Channel Tools',
    // Tool Names
    'tool.title-gen.name': 'Title Generator',
    'tool.desc-gen.name': 'Description Generator',
    'tool.tag-gen.name': 'Tag Generator',
    'tool.hash-gen.name': 'Hashtag Generator',
    'tool.seo-check.name': 'SEO Checklist',
    'tool.keyword-res.name': 'Keyword Research',
    'tool.video-ideas.name': 'Video Idea Generator',
    'tool.shorts-ideas.name': 'Shorts Idea Generator',
    'tool.hook-gen.name': 'Script Hook Generator',
    'tool.script-gen.name': 'Video Idea Blueprint',
    'tool.thumb-maker.name': 'Thumbnail AI Ideas',
    'tool.thumb-score.name': 'Thumbnail Score',
    'tool.best-time.name': 'Best Time to Post',
    'tool.name-ideas.name': 'Channel Name Ideas',
    'tool.monetization.name': 'Monetization Tracker',
    'tool.audit.name': 'Channel Audit',
    'tool.analytics-dash.name': 'Analytics Dashboard',
    'tool.comp-spy.name': 'Competitor Spy',
    'tool.trending-topics.name': 'Trending Topics',
    'tool.sentiment.name': 'Comment Sentiment',
    'tool.global-reach.name': 'Global Reach',
    // Tool Descriptions
    'tool.title-gen.desc': 'Generate viral, high-CTR titles',
    'tool.desc-gen.desc': 'Create SEO-friendly descriptions',
    'tool.tag-gen.desc': 'Find the best tags for your video',
    'tool.hash-gen.desc': 'Generate trending hashtags',
    'tool.seo-check.desc': 'Complete video optimization audit',
    'tool.keyword-res.desc': 'Find low competition keywords',
    'tool.video-ideas.desc': 'Never run out of content ideas',
    'tool.shorts-ideas.desc': 'Viral ideas for YouTube Shorts',
    'tool.hook-gen.desc': 'Grab attention in first 5 seconds',
    'tool.script-gen.desc': 'AI-powered video script outlines',
    'tool.thumb-maker.desc': 'AI concepts for thumbnails',
    'tool.thumb-score.desc': 'Predict your thumbnail CTR',
    'tool.best-time.desc': 'When to upload for max reach',
    'tool.name-ideas.desc': 'Find the perfect channel name',
    'tool.monetization.desc': 'Track your path to partner',
    'tool.audit.desc': 'Deep dive into channel performance',
    'tool.analytics-dash.desc': 'Visualize your channel growth & metrics',
    'tool.comp-spy.desc': 'See what works for others',
    'tool.trending-topics.desc': 'What is hot right now',
    'tool.sentiment.desc': 'Analyze audience feedback',
    'tool.global-reach.desc': 'Analyze international audience'
  },
  'हिन्दी': {
    'hero.title': 'बेस्ट AI YouTube ग्रोथ टूल्स:',
    'hero.subtitle': 'SEO ऑप्टिमाइज़ करें और व्यूज बढ़ाएं फ्री',
    'hero.description': 'हमारे 100% फ्री AI-पावर्ड टूलकिट के साथ अपने चैनल की क्षमता को अनलॉक करें। कीवर्ड रिसर्च से लेकर वायरल टाइटल जनरेशन तक, वह सब कुछ पाएं जो आपको यूट्यूब एल्गोरिदम पर हावी होने के लिए चाहिए।',
    'hero.badge': '✨ 20+ फ्री AI टूल्स यूट्यूब क्रिएटर्स के लिए',
    'search.placeholder': 'टूल सर्च करें...',
    'dashboard.no_tools': 'कोई टूल नहीं मिला',
    'dashboard.no_tools_desc': 'कुछ और सर्च करें या कैटेगरी बदलें।',
    'nav.dashboard': 'डैशबोर्ड',
    'nav.get_started': 'फ्री शुरू करें',
    'nav.all_tools': 'सभी टूल्स 🛠️',
    'nav.ultimate_suite': 'अल्टीमेट यूट्यूब ग्रोथ सुइट',
    'nav.quick_search': 'क्विक सर्च टूल्स...',
    'footer.product': 'प्रोडक्ट',
    'footer.legal': 'लीगल',
    'footer.company': 'कंपनी',
    'footer.copyright': '© 2026 YTGrowth - आपका YouTube ग्रोथ पार्टनर',
    'footer.home': 'होम',
    'footer.features': 'फीचर्स',
    'footer.price': 'प्राइस',
    'footer.tool': 'टूल',
    'footer.faq': 'FAQ',
    'footer.security': 'सिक्योरिटी',
    'footer.privacy': 'प्राइवेसी पॉलिसी',
    'footer.terms': 'नियम और शर्तें',
    'footer.cookies': 'कुकीज़',
    'footer.about': 'हमारे बारे में',
    'footer.contact': 'संपर्क करें',
    'footer.blog': 'ब्लॉग',
    'footer.disclaimer': 'डिस्क्लेमर',
    'nav.home': 'होम',
    'nav.stats': 'मेरे स्टैट्स',
    'nav.trending': 'ट्रेंडिंग',
    'nav.settings': 'सेटिंग्स',
    'nav.back': 'पीछे',
    'nav.analyze_content': 'अपने कंटेंट का विश्लेषण करें',
    'nav.paste': 'पेस्ट करें',
    'nav.enter_topic': 'वीडियो टॉपिक लिखें...',
    'nav.paste_video_link': 'यूट्यूब वीडियो लिंक यहाँ पेस्ट करें...',
    'nav.paste_channel_link': 'यूट्यूब चैनल लिंक यहाँ पेस्ट करें...',
    'nav.generate_results': 'रिजल्ट जनरेट करें',
    'nav.search_keywords': 'कीवर्ड सर्च करें',
    'nav.checklist': 'चेकलिस्ट',
    'cat.all': 'सभी',
    'cat.saved': 'सेव्ड',
    'cat.seo': 'SEO',
    'cat.content': 'कंटेंट',
    'cat.channel': 'चैनल',
    'cat.analytics': 'एनालिटिक्स',
    'cat.analytics_global': 'एनालिटिक्स और ग्लोबल',
    'cat.seo_tools': 'SEO टूल्स',
    'cat.content_tools': 'कंटेंट टूल्स',
    'cat.channel_tools': 'चैनल टूल्स',
    // Tool Names
    'tool.title-gen.name': 'टाइटल जनरेटर',
    'tool.desc-gen.name': 'डिस्क्रिप्शन जनरेटर',
    'tool.tag-gen.name': 'टैग जनरेटर',
    'tool.hash-gen.name': 'हैशटैग जनरेटर',
    'tool.seo-check.name': 'SEO चेकलिस्ट',
    'tool.keyword-res.name': 'कीवर्ड रिसर्च',
    'tool.video-ideas.name': 'वीडियो आइडिया जनरेटर',
    'tool.shorts-ideas.name': 'शॉर्ट्स आइडिया जनरेटर',
    'tool.hook-gen.name': 'स्क्रिप्ट हुक जनरेटर',
    'tool.script-gen.name': 'वीडियो आइडिया ब्लूप्रिंट',
    'tool.thumb-maker.name': 'थंबनेल AI आइडियाज',
    'tool.thumb-score.name': 'थंबनेल स्कोर',
    'tool.best-time.name': 'पोस्ट करने का सही समय',
    'tool.name-ideas.name': 'चैनल नाम आइडियाज',
    'tool.monetization.name': 'मोनेटाइजेशन ट्रैकर',
    'tool.audit.name': 'चैनल ऑडिट',
    'tool.analytics-dash.name': 'एनालिटिक्स डैशबोर्ड',
    'tool.comp-spy.name': 'कंपटीटर स्पाई',
    'tool.trending-topics.name': 'ट्रेंडिंग टॉपिक्स',
    'tool.sentiment.name': 'कमेंट सेंटीमेंट',
    'tool.global-reach.name': 'ग्लोबल रीच',
    // Tool Descriptions
    'tool.title-gen.desc': 'वायरल, हाई-CTR टाइटल बनाएं',
    'tool.desc-gen.desc': 'SEO-फ्रेंडली डिस्क्रिप्शन बनाएं',
    'tool.tag-gen.desc': 'अपने वीडियो के लिए बेस्ट टैग खोजें',
    'tool.hash-gen.desc': 'ट्रेंडिंग हैशटैग जनरेट करें',
    'tool.seo-check.desc': 'कम्प्लीट वीडियो ऑप्टिमाइजेशन ऑडिट',
    'tool.keyword-res.desc': 'कम कॉम्पिटिशन वाले कीवर्ड खोजें',
    'tool.video-ideas.desc': 'कंटेंट आइडियाज की कभी कमी नहीं होगी',
    'tool.shorts-ideas.desc': 'यूट्यूब शॉर्ट्स के लिए वायरल आइडियाज',
    'tool.hook-gen.desc': 'पहले 5 सेकंड में ध्यान खींचें',
    'tool.script-gen.desc': 'AI-पावर्ड वीडियो स्क्रिप्ट आउटलाइन',
    'tool.thumb-maker.desc': 'थंबनेल के लिए AI कॉन्सेप्ट्स',
    'tool.thumb-score.desc': 'अपने थंबनेल CTR की भविष्यवाणी करें',
    'tool.best-time.desc': 'मैक्स रीच के लिए कब अपलोड करें',
    'tool.name-ideas.desc': 'परफेक्ट चैनल नाम खोजें',
    'tool.monetization.desc': 'पार्टनर बनने की अपनी राह ट्रैक करें',
    'tool.audit.desc': 'चैनल परफॉरमेंस की गहरी जांच',
    'tool.analytics-dash.desc': 'अपने चैनल की ग्रोथ और मैट्रिक्स देखें',
    'tool.comp-spy.desc': 'देखें कि दूसरों के लिए क्या काम करता है',
    'tool.trending-topics.desc': 'अभी क्या हॉट है',
    'tool.sentiment.desc': 'ऑडियंस फीडबैक का विश्लेषण करें',
    'tool.global-reach.desc': 'इंटरनेशनल ऑडियंस का विश्लेषण करें'
  },
  // Placeholder translations for other languages (defaulting to English keys)
  'Español': {}, 'Français': {}, 'Deutsch': {}, 'Italiano': {}, 'Português': {}, '日本語': {}, 'Русский': {}, '한국어': {},
  '中文 (简体)': {}, '中文 (繁體)': {}, 'العربية': {}, 'Български': {}, 'Català': {}, 'Nederlands': {}, 'Ελληνικά': {},
  'Bahasa Indonesia': {}, 'Bahasa Melayu': {}, 'Polski': {}, 'Svenska': {}, 'ภาษาไทย': {}, 'Türkçe': {}, 'Українська': {}, 'Tiếng Việt': {}
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('English');

  const t = (key: string) => {
    return translations[language][key] || translations['English'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
