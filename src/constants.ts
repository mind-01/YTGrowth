import { 
  Sparkles, 
  FileText, 
  Tag, 
  Hash, 
  CheckSquare, 
  Search, 
  Users, 
  BarChart3, 
  Clock, 
  Lightbulb, 
  Zap, 
  Video, 
  TrendingUp, 
  Calculator, 
  Type as TypeIcon,
  Image as ImageIcon,
  MessageSquare,
  Globe,
  ShieldCheck,
  Eye,
  Calendar,
  Target,
  Flame,
  Download
} from 'lucide-react';

export interface Tool {
  id: string;
  name: string;
  description: string;
  icon: any;
  category: 'SEO' | 'Channel' | 'Content' | 'Analytics';
  path: string;
}

export const TOOLS: Tool[] = [
  // SEO Tools
  { id: 'title-gen', name: 'Title Generator', description: 'Generate viral, high-CTR titles', icon: Sparkles, category: 'SEO', path: '/tool/title-gen' },
  { id: 'desc-gen', name: 'Description Generator', description: 'Create SEO-friendly descriptions', icon: FileText, category: 'SEO', path: '/tool/desc-gen' },
  { id: 'tag-gen', name: 'Tag Generator', description: 'Find the best tags for your video', icon: Tag, category: 'SEO', path: '/tool/tag-gen' },
  { id: 'hash-gen', name: 'Hashtag Generator', description: 'Generate trending hashtags', icon: Hash, category: 'SEO', path: '/tool/hash-gen' },
  { id: 'seo-check', name: 'SEO Checklist', description: 'Complete video optimization audit', icon: CheckSquare, category: 'SEO', path: '/tool/seo-check' },
  { id: 'keyword-res', name: 'Keyword Research', description: 'Find low competition keywords', icon: Search, category: 'SEO', path: '/tool/keyword-res' },
  { id: 'title-analyzer', name: 'Title Score Analyzer', description: 'Evaluate your title strength', icon: Target, category: 'SEO', path: '/tool/title-analyzer' },
  
  // Content Tools
  { id: 'video-ideas', name: 'Video Idea Generator', description: 'Never run out of content ideas', icon: Lightbulb, category: 'Content', path: '/tool/video-ideas' },
  { id: 'shorts-ideas', name: 'Shorts Idea Generator', description: 'Viral ideas for YouTube Shorts', icon: Zap, category: 'Content', path: '/tool/shorts-ideas' },
  { id: 'hook-gen', name: 'Script Hook Generator', description: 'Grab attention in first 5 seconds', icon: Zap, category: 'Content', path: '/tool/hook-gen' },
  { id: 'viral-hooks', name: 'Viral Hook Generator', description: 'Generate high-CTR video hooks', icon: Flame, category: 'Content', path: '/tool/viral-hooks' },
  { id: 'script-gen', name: 'Video Idea Blueprint', description: 'AI-powered video script outlines', icon: FileText, category: 'Content', path: '/tool/script-gen' },
  { id: 'thumb-maker', name: 'Thumbnail AI Ideas', description: 'AI concepts for thumbnails', icon: ImageIcon, category: 'Content', path: '/tool/thumb-maker' },
  { id: 'thumb-score', name: 'Thumbnail Score', description: 'Predict your thumbnail CTR', icon: BarChart3, category: 'Content', path: '/tool/thumb-score' },
  { id: 'thumb-text', name: 'Thumbnail Text Generator', description: 'High-CTR text for thumbnails', icon: TypeIcon, category: 'Content', path: '/tool/thumb-text' },
  { id: 'content-planner', name: 'Content Planner', description: 'Plan your video schedule', icon: Calendar, category: 'Content', path: '/tool/content-planner' },
  { id: 'video-downloader', name: 'Video Downloader', description: 'Download videos in MP4 or Audio', icon: Download, category: 'Content', path: '/tool/video-downloader' },

  // Channel Tools
  { id: 'best-time', name: 'Best Time to Post', description: 'When to upload for max reach', icon: Clock, category: 'Channel', path: '/tool/best-time' },
  { id: 'name-ideas', name: 'Channel Name Ideas', description: 'Find the perfect channel name', icon: TypeIcon, category: 'Channel', path: '/tool/name-ideas' },
  { id: 'monetization', name: 'Monetization Tracker', description: 'Track your path to partner', icon: Calculator, category: 'Channel', path: '/tool/monetization' },
  { id: 'audit', name: 'Channel Audit', description: 'Deep dive into channel performance', icon: ShieldCheck, category: 'Channel', path: '/tool/audit' },
  
  // Analytics Tools
  { id: 'analytics-dash', name: 'Analytics Dashboard', description: 'Visualize your channel growth & metrics', icon: BarChart3, category: 'Analytics', path: '/tool/analytics-dash' },
  { id: 'comp-spy', name: 'Competitor Spy', description: 'See what works for others', icon: Eye, category: 'Analytics', path: '/tool/comp-spy' },
  { id: 'trending-topics', name: 'Trending Topics', description: 'What is hot right now', icon: TrendingUp, category: 'Analytics', path: '/tool/trending-topics' },
  { id: 'sentiment', name: 'Comment Sentiment', description: 'Analyze audience feedback', icon: MessageSquare, category: 'Analytics', path: '/tool/sentiment' },
  { id: 'global-reach', name: 'Global Reach', description: 'Analyze international audience', icon: Globe, category: 'Analytics', path: '/tool/global-reach' },
];

export const REGIONS = [
  { name: 'India', code: 'IN', flag: '🇮🇳' },
  { name: 'USA', code: 'US', flag: '🇺🇸' },
  { name: 'UK', code: 'GB', flag: '🇬🇧' },
  { name: 'Canada', code: 'CA', flag: '🇨🇦' },
  { name: 'Australia', code: 'AU', flag: '🇦🇺' },
  { name: 'Germany', code: 'DE', flag: '🇩🇪' },
  { name: 'France', code: 'FR', flag: '🇫🇷' },
  { name: 'Japan', code: 'JP', flag: '🇯🇵' },
  { name: 'Brazil', code: 'BR', flag: '🇧🇷' },
];

export const LANGUAGES = [
  { name: 'Hindi', code: 'hi' },
  { name: 'English', code: 'en' },
  { name: 'Spanish', code: 'es' },
  { name: 'French', code: 'fr' },
  { name: 'German', code: 'de' },
  { name: 'Japanese', code: 'ja' },
  { name: 'Portuguese', code: 'pt' },
  { name: 'Russian', code: 'ru' },
];

export const CATEGORIES = [
  'Gaming',
  'Tech',
  'Vlogs',
  'Education',
  'Entertainment',
  'Music',
  'Comedy',
  'How-to & Style',
  'News & Politics',
  'Sports',
  'Travel & Events',
  'Pets & Animals',
  'Science & Technology',
];

export const NICHES = [
  'Tech',
  'Comedy',
  'Finance',
  'Vlogging',
  'Gaming',
  'Education',
  'Health & Fitness',
  'Cooking',
  'Travel',
  'Fashion',
  'Business',
  'Motivation'
];

export const TONES = [
  'Professional',
  'Funny',
  'Minimalist',
  'Catchy',
  'Bold',
  'Elegant',
  'Modern',
  'Traditional'
];
