import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Copy, Check, Loader2, Sparkles, Link as LinkIcon, Clipboard, XCircle, CheckCircle2, ExternalLink, ThumbsUp, ThumbsDown, Eye, Search, Filter, TrendingUp, Users, Calendar, Globe, Languages, Smartphone, Tv, Zap, Target, Lightbulb, FileText, Image as ImageIcon, Type as TypeIcon, ChevronDown, ChevronUp, Download, Layout, Palette, MousePointer2, Info, Video, Upload, Monitor, Clock, Edit, AlertCircle, Tag, MessageSquare, Bookmark, BookmarkCheck, Play, Send, User as UserIcon, Star } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { Link, useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { TOOLS, REGIONS, LANGUAGES, CATEGORIES, NICHES, TONES } from '../constants';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { 
  db, 
  auth as firebaseAuth, 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  serverTimestamp, 
  getDoc, 
  doc,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged
} from '../firebase.ts';
import type { FirebaseUser } from '../firebase.ts';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

import * as gemini from '../services/geminiService';
import ReactMarkdown from 'react-markdown';
import he from 'he';
import html2canvas from 'html2canvas';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

export default function ToolPage() {
  const { t } = useLanguage();
  const { user, loading: authLoading, toggleSaveTool, isSaved } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tool = TOOLS.find(t => t.id === id);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showLowCompOnly, setShowLowCompOnly] = useState(false);
  const [region, setRegion] = useState('IN');
  const [language, setLanguage] = useState('hi');
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [blueprintLanguage, setBlueprintLanguage] = useState(() => localStorage.getItem('ytgrowth_blueprint_lang') || 'Hinglish');
  const [shortsLanguage, setShortsLanguage] = useState(() => localStorage.getItem('ytgrowth_shorts_lang') || 'Hinglish');
  const [hookLength, setHookLength] = useState(() => localStorage.getItem('ytgrowth_hook_length') || '5');
  const [hookLanguage, setHookLanguage] = useState(() => localStorage.getItem('ytgrowth_hook_lang') || 'Hinglish');
  const [toast, setToast] = useState<string | null>(null);

  const resultRef = useRef<HTMLDivElement>(null);

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [thumbnailImage, setThumbnailImage] = useState<string | null>(null);
  const [thumbnailMimeType, setThumbnailMimeType] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Gaming');
  const [selectedRegion, setSelectedRegion] = useState('India');
  const [selectedNiche, setSelectedNiche] = useState('Tech');
  const [selectedTone, setSelectedTone] = useState('Catchy');
  const [selectedNameLanguage, setSelectedNameLanguage] = useState('Hinglish');
  const [selectedNameLength, setSelectedNameLength] = useState('2');
  const [channelUrl, setChannelUrl] = useState('');
  const [monetizationLanguage, setMonetizationLanguage] = useState('Hindi');
  const [isEditingWatchTime, setIsEditingWatchTime] = useState(false);
  const [manualWatchTime, setManualWatchTime] = useState('');
  const [auditLanguage, setAuditLanguage] = useState(() => localStorage.getItem('ytgrowth_audit_lang') || 'English');
  const [spyLanguage, setSpyLanguage] = useState(() => localStorage.getItem('ytgrowth_spy_lang') || 'English');
  const [activeMetricInfo, setActiveMetricInfo] = useState<{title: string, desc: string} | null>(null);
  const [trendTimeFrame, setTrendTimeFrame] = useState('Today');
  const [trendLocation, setTrendLocation] = useState('India');
  const [trendLanguage, setTrendLanguage] = useState('Hinglish');
  const [plannerType, setPlannerType] = useState('Weekly');

  const handleFile = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setThumbnailImage(e.target?.result as string);
        setThumbnailMimeType(file.type);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const LAYOUT_METADATA: Record<string, { subtitle: string; description: string }> = {
    'Split Screen': { subtitle: '(Dynamic Contrast)', description: 'Best for showing a transformation or two key elements.' },
    'Close-up': { subtitle: '(Focus on Face/Object)', description: 'Best for high-emotion videos or detailed product reviews.' },
    'Comparison': { subtitle: '(Before vs After)', description: 'Best for tutorials, results, or "versus" style content.' },
    'Action Shot': { subtitle: '(Movement & Energy)', description: 'Best for vlogs, challenges, or high-energy tutorials.' },
    'Minimalist': { subtitle: '(Clean & Focused)', description: 'Best for professional tutorials or thought-leadership content.' }
  };

  useEffect(() => {
    localStorage.setItem('ytgrowth_blueprint_lang', blueprintLanguage);
  }, [blueprintLanguage]);

  useEffect(() => {
    localStorage.setItem('ytgrowth_shorts_lang', shortsLanguage);
  }, [shortsLanguage]);

  useEffect(() => {
    localStorage.setItem('ytgrowth_hook_length', hookLength);
  }, [hookLength]);

  useEffect(() => {
    localStorage.setItem('ytgrowth_hook_lang', hookLanguage);
  }, [hookLanguage]);

  useEffect(() => {
    localStorage.setItem('ytgrowth_audit_lang', auditLanguage);
  }, [auditLanguage]);

  useEffect(() => {
    localStorage.setItem('ytgrowth_spy_lang', spyLanguage);
  }, [spyLanguage]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  useEffect(() => {
    // Reset state when switching tools
    setResult(null);
    setLoading(false);
    setLoadingAction(null);
    setExpandedId(null);

    const q = searchParams.get('q');
    if (q && tool) {
      const decodedQ = decodeURIComponent(q);
      setInput(decodedQ);
      // Small delay to ensure the UI feels responsive and state is settled
      const timer = setTimeout(() => {
        handleAction(decodedQ);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setInput('');
    }

    // Special handling for script-gen pre-fill from localStorage
    if (tool?.id === 'script-gen') {
      const storedData = localStorage.getItem('ytgrowth_script_data');
      if (storedData) {
        try {
          const { title, hook, keyPoints } = JSON.parse(storedData);
          // Sanitize inputs to remove any problematic characters
          const cleanTitle = title?.replace(/[^\w\s\d\-\(\)\?\!\.\,]/gi, '') || '';
          const cleanHook = hook?.replace(/[^\w\s\d\-\(\)\?\!\.\,]/gi, '') || '';
          const cleanPoints = Array.isArray(keyPoints) 
            ? keyPoints.map((p: string) => p.replace(/[^\w\s\d\-\(\)\?\!\.\,]/gi, ''))
            : [];

          const prefilledInput = `Title: ${cleanTitle}\n\nHook: ${cleanHook}\n\nKey Points:\n${cleanPoints.map((p: string) => `- ${p}`).join('\n')}`;
          setInput(prefilledInput);
          localStorage.removeItem('ytgrowth_script_data');
        } catch (e) {
          console.error("Error parsing script pre-fill data:", e);
          localStorage.removeItem('ytgrowth_script_data');
        }
      }
    }

    // Restore video-ideas state if available
    if (tool?.id === 'video-ideas' && !q) {
      const storedResult = sessionStorage.getItem('ytgrowth_video_ideas_result');
      const storedInput = sessionStorage.getItem('ytgrowth_video_ideas_input');
      if (storedResult && storedInput) {
        setResult(JSON.parse(storedResult));
        setInput(storedInput);
      }
    }
  }, [id, searchParams]);

  const toggleSaveToolWithFeedback = async (toolId: string) => {
    if (authLoading) return;
    if (!user) {
      setToast('Please sign in to save tools');
      return;
    }
    const wasSaved = isSaved(toolId);
    await toggleSaveTool(toolId);
    setToast(wasSaved ? 'Removed from saved tools' : 'Added to saved tools');
  };

  if (!tool) return <div>Tool not found</div>;

  const decodeHtml = (html: string) => {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  };

  const handleAction = async (overrideInput?: string, customLength?: string) => {
    const currentInput = overrideInput || input;
    if (!currentInput.trim()) return;
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      let data;
      switch (tool.id) {
        case 'seo-check':
          data = await gemini.generateSEOChecklist(currentInput);
          break;
        case 'keyword-res':
          // 1. Fetch real-time data from YouTube API via our server with region and language
          const ytResponse = await fetch(`/api/youtube/keywords?q=${encodeURIComponent(currentInput)}&regionCode=${region}&relevanceLanguage=${language}`);
          const ytData = await ytResponse.json();
          if (ytData.error) throw new Error(ytData.error);
          
          // 2. Enhance with AI insights
          const aiInsights = await gemini.enhanceKeywordResearch(currentInput, ytData);
          data = { ...ytData, ...aiInsights };
          break;
        case 'title-gen':
          data = await gemini.generateTitles(currentInput);
          break;
        case 'desc-gen':
          data = await gemini.generateDescription(currentInput);
          break;
        case 'tag-gen':
          data = await gemini.generateTags(currentInput);
          break;
        case 'hash-gen':
          data = await gemini.generateHashtags(currentInput);
          break;
        case 'name-ideas':
          data = await gemini.generateChannelNames(currentInput, selectedNiche, selectedTone, selectedNameLanguage, selectedNameLength);
          break;
        case 'monetization':
          const monResponse = await fetch(`/api/youtube/channel-info?url=${encodeURIComponent(channelUrl)}`);
          if (!monResponse.ok) {
            data = await gemini.analyzeChannelMonetization(channelUrl, null, monetizationLanguage);
          } else {
            const monData = await monResponse.json();
            if (monData.error) throw new Error(monData.error);
            setManualWatchTime(monData.watchTime.toString());
            data = await gemini.analyzeChannelMonetization(channelUrl, monData, monetizationLanguage);
          }
          break;
        case 'audit':
          const auditDataResponse = await fetch(`/api/youtube/channel-audit?url=${encodeURIComponent(channelUrl)}`);
          const auditRawData = await auditDataResponse.json();
          if (auditRawData.error) throw new Error(auditRawData.error);
          data = await gemini.generateChannelAudit(channelUrl, auditRawData, auditLanguage);
          break;
        case 'comp-spy':
          const queries = currentInput.split(/[\n,]+/).map(q => q.trim()).filter(q => q.length > 0);
          if (queries.length > 1) {
            const results = await Promise.all(queries.map(async (q) => {
              const res = await fetch(`/api/youtube/competitor-spy?q=${encodeURIComponent(q)}`);
              const raw = await res.json();
              if (raw.error) return { error: raw.error, query: q };
              const aiRes = await gemini.generateCompetitorSpy(q, raw, spyLanguage);
              return { ...aiRes, ...raw, query: q };
            }));
            data = results;
          } else {
            const spyResponse = await fetch(`/api/youtube/competitor-spy?q=${encodeURIComponent(currentInput)}`);
            const spyRawData = await spyResponse.json();
            if (spyRawData.error) throw new Error(spyRawData.error);
            data = await gemini.generateCompetitorSpy(currentInput, spyRawData, spyLanguage);
          }
          break;
        case 'shorts-ideas':
          data = await gemini.generateShortsIdeas(currentInput, shortsLanguage);
          break;
        case 'script-gen':
          try {
            data = await gemini.generateScriptOutline(currentInput, blueprintLanguage);
          } catch (aiError: any) {
            console.error("Script AI Error:", aiError);
            // Fallback: Format the input into a readable outline if AI fails
            data = `# Script Outline (Fallback)\n\n${currentInput.split('\n').map(line => line.trim() ? `* ${line}` : '').join('\n')}\n\n*Note: AI generation failed. This is a formatted version of your input.*`;
          }
          break;
        case 'video-ideas':
          data = await gemini.generateVideoIdeas(currentInput);
          break;
        case 'hook-gen':
          data = await gemini.generateHooks(currentInput, customLength || hookLength, hookLanguage);
          break;
        case 'thumb-score':
          data = await gemini.generateThumbnailScore(currentInput, thumbnailImage || undefined, thumbnailMimeType || undefined);
          break;
        case 'thumb-maker':
          data = await gemini.generateThumbnailIdeas(currentInput);
          break;
        case 'best-time':
          data = await gemini.generateBestTimeToPost(selectedCategory, selectedRegion);
          break;
        case 'trending-topics':
          data = await gemini.generateTrendingTopics(currentInput, trendTimeFrame, trendLocation, trendLanguage);
          break;
        case 'sentiment':
          data = await gemini.generateCommentSentiment(currentInput, language);
          break;
        case 'global-reach':
          data = await gemini.generateGlobalReach(currentInput, language);
          break;
        case 'analytics-dash':
          const dashResponse = await fetch(`/api/youtube/channel-audit?url=${encodeURIComponent(channelUrl)}`);
          const dashRawData = await dashResponse.json();
          if (dashRawData.error) throw new Error(dashRawData.error);
          data = await gemini.generateAnalyticsDashboard(channelUrl, dashRawData, language);
          break;
        case 'content-planner':
          data = await gemini.generateContentPlanner(currentInput, plannerType);
          break;
        case 'title-analyzer':
          data = await gemini.analyzeTitleScore(currentInput);
          break;
        case 'viral-hooks':
          data = await gemini.generateViralHooks(currentInput);
          break;
        case 'thumb-text':
          data = await gemini.generateThumbnailText(currentInput);
          break;
        default:
          data = "This tool is under development. Please try Title Generator or Description Generator.";
      }
      if (!data || (Array.isArray(data) && data.length === 0)) {
        setResult("No results were generated. Please try a different topic.");
      } else {
        setResult(data);
        if (tool.id === 'video-ideas') {
          sessionStorage.setItem('ytgrowth_video_ideas_result', JSON.stringify(data));
          sessionStorage.setItem('ytgrowth_video_ideas_input', currentInput);
        }
      }
    } catch (error: any) {
      console.error("Tool Action Error:", error);
      // Log specific details for debugging
      if (error.message?.includes('quota')) console.error("API Quota Limit Reached");
      if (error.message?.includes('key')) console.error("API Authentication/Key Issue");

      const errorMessage = error.message?.includes('API_KEY') 
        ? "API Key error. Please check your Gemini API configuration."
        : error.message || "Error generating content. The model might be busy or the topic is restricted. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, id?: string) => {
    navigator.clipboard.writeText(text);
    if (id) {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } else {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
    setToast('Copied to clipboard!');
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    setToast(t('tool.url_copied'));
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInput(text);
    } catch (err) {
      console.error('Failed to read clipboard contents: ', err);
    }
  };

  const isSEOCheck = tool.id === 'seo-check';
  const isKeywordRes = tool.id === 'keyword-res';
  const isSentiment = tool.id === 'sentiment';
  const isGlobalReach = tool.id === 'global-reach';
  const isAnalyticsDash = tool.id === 'analytics-dash';
  const isPlanner = tool.id === 'content-planner';
  const isTitleAnalyzer = tool.id === 'title-analyzer';
  const isViralHooks = tool.id === 'viral-hooks';
  const isThumbText = tool.id === 'thumb-text';

  // Ensure result is cleared when tool changes
  useEffect(() => {
    setResult(null);
    setInput('');
  }, [tool.id]);

  return (
    <div className="max-w-4xl mx-auto px-4 pt-20 sm:pt-24 pb-12">
      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-[10px] sm:text-[11px] font-black text-brand-gray uppercase tracking-widest hover:text-brand-red transition-colors group"
        >
          <ArrowLeft className="w-3 h-3 sm:w-3.5 sm:h-3.5 group-hover:-translate-x-1 transition-transform" />
          {t('nav.back')}
        </button>
      </div>

      <div className="bg-card-bg rounded-[2rem] sm:rounded-[40px] border border-border-primary p-5 sm:p-8 shadow-sm mb-8">
        <div className="text-center mb-6 sm:mb-8 relative">
          <button
            onClick={() => toggleSaveToolWithFeedback(tool.id)}
            className={cn(
              "hidden sm:block absolute sm:-top-2 sm:-right-2 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl transition-all shadow-lg border border-border-primary z-30 active:scale-90 hover:scale-110",
              isSaved(tool.id) 
                ? "bg-brand-red text-white border-brand-red" 
                : "bg-card-bg text-brand-gray hover:text-brand-red hover:border-brand-red"
            )}
            title={isSaved(tool.id) ? "Remove from saved" : "Save tool"}
          >
            {isSaved(tool.id) ? (
              <BookmarkCheck className="w-5 h-5 sm:w-6 sm:h-6 fill-current" />
            ) : (
              <Bookmark className="w-5 h-5 sm:w-6 sm:h-6" />
            )}
          </button>
          <h1 className="text-2xl sm:text-3xl font-black text-brand-dark mb-2">{t(`tool.${tool.id}.name`)}</h1>
          <p className="text-sm sm:text-base text-brand-gray font-medium mb-6">
            {tool.id === 'desc-gen' 
              ? "Generate high-ranking YouTube descriptions to boost SEO, views, and engagement" 
              : tool.id === 'tag-gen'
              ? "Generate high-ranking YouTube tags to increase video visibility, SEO, and reach"
              : tool.id === 'title-analyzer'
              ? "Analyze and improve your YouTube title for higher CTR and rankings"
              : tool.id === 'title-gen'
              ? "Generate viral, high-CTR YouTube titles that rank higher and go viral"
              : tool.id === 'hash-gen'
              ? "Generate trending YouTube hashtags to increase discoverability and reach"
              : tool.id === 'video-ideas'
              ? "Never run out of content ideas with our AI-powered video idea generator"
              : tool.id === 'shorts-ideas'
              ? "Viral ideas for YouTube Shorts to explode your channel growth"
              : tool.id === 'hook-gen' || tool.id === 'viral-hooks'
              ? "Generate high-CTR video hooks to grab attention in the first 5 seconds"
              : tool.id === 'script-gen'
              ? "AI-powered video script outlines to help you create better content faster"
              : tool.id === 'thumb-text'
              ? "Generate high-CTR text for your thumbnails to boost your views"
              : t(`tool.${tool.id}.desc`)}
          </p>
          
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={copyUrl}
              className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-bg-primary border border-border-primary text-[9px] sm:text-[10px] font-black text-brand-dark hover:text-brand-red hover:border-brand-red transition-all shadow-sm"
            >
              <LinkIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              {t('tool.copy_url')}
            </button>

            <button
              onClick={() => toggleSaveToolWithFeedback(tool.id)}
              className={cn(
                "sm:hidden inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-bg-primary border border-border-primary text-[9px] font-black transition-all shadow-sm active:scale-90",
                isSaved(tool.id) 
                  ? "text-brand-red border-brand-red bg-brand-red/5" 
                  : "text-brand-dark hover:text-brand-red hover:border-brand-red"
              )}
            >
              {isSaved(tool.id) ? (
                <BookmarkCheck className="w-3 h-3 fill-current" />
              ) : (
                <Bookmark className="w-3 h-3" />
              )}
              {isSaved(tool.id) ? "SAVED" : "SAVE"}
            </button>
          </div>
        </div>

        {isSEOCheck || isKeywordRes || isSentiment || isGlobalReach || isAnalyticsDash ? (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-4xl font-black text-brand-dark mb-4 tracking-tight">
                {t('nav.analyze_content')}
              </h2>
              <p className="text-brand-gray max-w-md mx-auto mb-8 font-medium">
                {isKeywordRes ? "Enter your video topic or title to find the best ranking keywords." : 
                 isSentiment ? "Video ka link yahan paste karein audience ka mood janne ke liye..." : 
                 isGlobalReach ? "Apne video ka topic likhein global audience check karne ke liye..." :
                 isAnalyticsDash ? "Enter your channel URL to see a visual growth dashboard." :
                 "Paste a YouTube video link below to get a detailed SEO score and actionable insights."}
              </p>
              
              <div className="relative max-w-xl mx-auto mb-6">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-dark">
                  {isKeywordRes || isGlobalReach ? <Search className="w-5 h-5" /> : <LinkIcon className="w-5 h-5" />}
                </div>
                <input 
                  type="text"
                  className="w-full pl-12 sm:pl-14 pr-24 sm:pr-32 py-3 sm:py-5 rounded-full border border-border-primary bg-card-bg text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-all text-base sm:text-lg font-medium shadow-sm"
                  placeholder={isKeywordRes || isGlobalReach ? t('nav.enter_topic') : isAnalyticsDash ? t('nav.paste_channel_link') : t('nav.paste_video_link')}
                  value={isAnalyticsDash ? channelUrl : input}
                  onChange={(e) => isAnalyticsDash ? setChannelUrl(e.target.value) : setInput(e.target.value)}
                />
                <button 
                  onClick={async () => {
                    try {
                      const text = await navigator.clipboard.readText();
                      if (isAnalyticsDash) setChannelUrl(text);
                      else setInput(text);
                    } catch (err) {
                      console.error('Failed to read clipboard contents: ', err);
                    }
                  }}
                  className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl bg-white border border-border-primary hover:bg-bg-primary transition-all text-xs sm:text-sm font-bold text-brand-dark shadow-sm"
                >
                  <Clipboard className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  {t('nav.paste')}
                </button>
              </div>

              {isKeywordRes && (
                <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
                  <div className="flex items-center gap-2 px-4 py-2 bg-card-bg border border-border-primary rounded-2xl shadow-sm">
                    <Globe className="w-4 h-4 text-brand-gray" />
                    <select 
                      value={region}
                      onChange={(e) => setRegion(e.target.value)}
                      className="text-sm font-bold text-brand-dark bg-transparent focus:outline-none cursor-pointer"
                    >
                      {REGIONS.map(r => (
                        <option key={r.code} value={r.code}>{r.flag} {r.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-card-bg border border-border-primary rounded-2xl shadow-sm">
                    <Languages className="w-4 h-4 text-brand-gray" />
                    <select 
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="text-sm font-bold text-brand-dark bg-transparent focus:outline-none cursor-pointer"
                    >
                      {LANGUAGES.map(l => (
                        <option key={l.code} value={l.code}>{l.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {(isSentiment || isGlobalReach) && (
                <div className="flex flex-col items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                  <div className="flex items-center gap-2">
                    <Languages className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-brand-gray" />
                    <span className="text-[8px] sm:text-[10px] font-black text-brand-gray uppercase tracking-widest">Analysis Language</span>
                  </div>
                  <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2">
                    {[
                      { id: 'en', label: '🇺🇸 English' },
                      { id: 'hi', label: '🇮🇳 Hindi' },
                      { id: 'hinglish', label: '🌍 Hinglish' }
                    ].map((lang) => (
                      <button
                        key={lang.id}
                        onClick={() => setLanguage(lang.id)}
                        className={`px-3 sm:px-6 py-1.5 sm:py-2.5 rounded-lg sm:rounded-xl text-[8px] sm:text-[10px] font-bold sm:font-black uppercase tracking-wider transition-all ${
                          language === lang.id 
                          ? 'bg-brand-dark text-white shadow-lg scale-105' 
                          : 'bg-card-bg text-brand-gray border border-border-primary hover:border-brand-red hover:text-brand-red'
                        }`}
                      >
                        {lang.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={() => handleAction(isAnalyticsDash ? "ANALYTICS_DASHBOARD" : undefined)}
                disabled={loading || (isAnalyticsDash ? !channelUrl : !input.trim())}
                className="btn-primary w-full max-w-xl py-4 sm:py-5 text-lg sm:text-xl font-black uppercase tracking-widest mb-2"
              >
                {loading ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : (isKeywordRes ? t('nav.search_keywords') : (isSentiment || isGlobalReach || isAnalyticsDash) ? t('nav.generate_results') : t('nav.checklist'))}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {tool.id === 'thumb-score' && (
              <div className="mb-8">
                <label className="block text-sm font-bold text-brand-dark mb-4 uppercase tracking-widest">
                  Upload Thumbnail
                </label>
                <div 
                  className={`relative group cursor-pointer transition-all duration-300 ${
                    dragActive ? 'scale-[1.02]' : ''
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    accept="image/*"
                    onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                  />
                  <div className={`
                    aspect-video rounded-[40px] border-4 border-dashed transition-all duration-300 flex flex-col items-center justify-center p-8 text-center
                    ${thumbnailImage ? 'border-brand-red bg-brand-red/5' : dragActive ? 'border-brand-red bg-brand-red/5' : 'border-border-primary bg-bg-primary hover:border-brand-red/50 hover:bg-bg-primary/80'}
                  `}>
                    {thumbnailImage ? (
                      <div className="relative w-full h-full flex items-center justify-center group/img">
                        <img 
                          src={thumbnailImage} 
                          alt="Thumbnail Preview" 
                          className="max-h-full rounded-2xl shadow-2xl transition-transform group-hover/img:scale-[1.02]"
                          referrerPolicy="no-referrer"
                        />
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setThumbnailImage(null);
                            setThumbnailMimeType(null);
                          }}
                          className="absolute top-4 right-4 p-2 bg-brand-dark text-white rounded-full shadow-xl hover:bg-brand-red transition-colors z-20"
                        >
                          <XCircle className="w-5 h-5" />
                        </button>
                        <div className="absolute inset-0 bg-brand-dark/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center rounded-2xl">
                          <p className="text-white font-black uppercase tracking-widest text-sm">Click or Drag to Replace</p>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="w-20 h-20 rounded-3xl bg-card-bg border border-border-primary shadow-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                          <Upload className="w-8 h-8 text-brand-red" />
                        </div>
                        <h3 className="text-xl font-black text-brand-dark mb-2">Drop your thumbnail here</h3>
                        <p className="text-brand-gray font-bold text-sm max-w-xs">Supports JPG, PNG, WEBP. AI will analyze visual elements for scoring.</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}

            {tool.id === 'best-time' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-brand-gray uppercase tracking-widest">
                    Channel Category
                  </label>
                  <select 
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-bg-primary border border-border-primary text-sm font-bold text-brand-dark focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red outline-none transition-all"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-brand-gray uppercase tracking-widest">
                    Target Region
                  </label>
                  <select 
                    value={selectedRegion}
                    onChange={(e) => setSelectedRegion(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-bg-primary border border-border-primary text-sm font-bold text-brand-dark focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red outline-none transition-all"
                  >
                    {REGIONS.map(reg => (
                      <option key={reg.name} value={reg.name}>{reg.flag} {reg.name}</option>
                    ))}
                    <option value="Global">🌍 Global</option>
                  </select>
                </div>
              </div>
            )}

            {tool.id === 'name-ideas' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-brand-gray uppercase tracking-widest">
                      Niche Selector
                    </label>
                    <select 
                      value={selectedNiche}
                      onChange={(e) => setSelectedNiche(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-bg-primary border border-border-primary text-sm font-bold text-brand-dark focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red outline-none transition-all"
                    >
                      {NICHES.map(niche => (
                        <option key={niche} value={niche}>{niche}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-brand-gray uppercase tracking-widest">
                      Tone Selector
                    </label>
                    <select 
                      value={selectedTone}
                      onChange={(e) => setSelectedTone(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-bg-primary border border-border-primary text-sm font-bold text-brand-dark focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red outline-none transition-all"
                    >
                      {TONES.map(tone => (
                        <option key={tone} value={tone}>{tone}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 flex items-center gap-4 p-4 bg-bg-primary rounded-2xl border border-border-primary">
                    <div className="flex items-center gap-2">
                      <Languages className="w-4 h-4 text-brand-gray" />
                      <span className="text-[10px] font-black text-brand-gray uppercase tracking-widest">Output Language</span>
                    </div>
                    <div className="flex gap-2">
                      {[
                        { id: 'English', label: '🇺🇸 English' },
                        { id: 'Hindi', label: '🇮🇳 Hindi' },
                        { id: 'Hinglish', label: '🌍 Hinglish' }
                      ].map((lang) => (
                        <button
                          key={lang.id}
                          onClick={() => setSelectedNameLanguage(lang.id)}
                          className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${
                            selectedNameLanguage === lang.id 
                            ? 'bg-brand-red text-white shadow-md' 
                            : 'bg-card-bg text-brand-gray border border-border-primary hover:border-brand-red hover:text-brand-red'
                          }`}
                        >
                          {lang.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex-1 flex items-center gap-4 p-4 bg-bg-primary rounded-2xl border border-border-primary">
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-brand-gray" />
                      <span className="text-[10px] font-black text-brand-gray uppercase tracking-widest">Name Length</span>
                    </div>
                    <div className="flex gap-2">
                      {[
                        { id: '1', label: '☝️ 1-Word' },
                        { id: '2', label: '✌️ 2-Words' }
                      ].map((len) => (
                        <button
                          key={len.id}
                          onClick={() => setSelectedNameLength(len.id)}
                          className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${
                            selectedNameLength === len.id 
                            ? 'bg-brand-red text-white shadow-md' 
                            : 'bg-card-bg text-brand-gray border border-border-primary hover:border-brand-red hover:text-brand-red'
                          }`}
                        >
                          {len.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {(tool.id === 'monetization' || tool.id === 'audit') && (
              <div className="space-y-6 sm:space-y-8">
                <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-bg-primary rounded-xl sm:rounded-2xl border border-border-primary">
                  <div className="flex items-center gap-2">
                    <Languages className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-brand-gray" />
                    <span className="text-[8px] sm:text-[10px] font-black text-brand-gray uppercase tracking-widest">Report Language</span>
                  </div>
                  <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2">
                    {[
                      { id: 'English', label: '🇺🇸 English' },
                      { id: 'Hindi', label: '🇮🇳 Hindi' },
                      { id: 'Hinglish', label: '🌍 Hinglish' }
                    ].map((lang) => (
                      <button
                        key={lang.id}
                        onClick={() => {
                          if (tool.id === 'monetization') setMonetizationLanguage(lang.id);
                          else setAuditLanguage(lang.id);
                        }}
                        className={`px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-[8px] sm:text-[10px] font-bold sm:font-black uppercase tracking-wider transition-all ${
                          (tool.id === 'monetization' ? monetizationLanguage : auditLanguage) === lang.id 
                            ? 'bg-brand-red text-white shadow-md' 
                            : 'bg-card-bg text-brand-gray border border-border-primary hover:border-brand-red hover:text-brand-red'
                        }`}
                      >
                        {lang.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-brand-gray uppercase tracking-widest">
                    YouTube Channel Link
                  </label>
                  <div className="relative">
                    <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-gray" />
                    <input 
                      type="text"
                      value={channelUrl}
                      onChange={(e) => setChannelUrl(e.target.value)}
                      placeholder={tool.id === 'audit' ? "Analyze karne ke liye YouTube Channel ka link yahan paste karein..." : "Paste YouTube Channel Link here to track..."}
                      className="w-full pl-12 pr-4 py-4 rounded-2xl bg-bg-primary border border-border-primary text-lg font-black text-brand-dark focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="flex justify-center">
                  <button
                    onClick={() => handleAction(tool.id === 'audit' ? "CHANNEL_AUDIT" : "MONETIZATION_TRACKER")}
                    disabled={loading || !channelUrl}
                    className="btn-primary w-full md:w-1/2 py-5 text-xl font-black uppercase tracking-widest"
                  >
                    {loading ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : result ? "RE-CHECK DATA" : "GENERATE RESULTS"}
                  </button>
                </div>
              </div>
            )}

            {tool.id === 'comp-spy' && (
              <div className="flex flex-col items-center gap-3 sm:gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <Languages className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-brand-gray" />
                  <span className="text-[8px] sm:text-[10px] font-black text-brand-gray uppercase tracking-widest">Report Language</span>
                </div>
                <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2">
                  {[
                    { id: 'English', label: '🇺🇸 English' },
                    { id: 'Hindi', label: '🇮🇳 Hindi' },
                    { id: 'Hinglish', label: '🌍 Hinglish' }
                  ].map((lang) => (
                    <button
                      key={lang.id}
                      onClick={() => setSpyLanguage(lang.id)}
                      className={`px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-[8px] sm:text-[10px] font-bold sm:font-black uppercase tracking-wider transition-all ${
                        spyLanguage === lang.id 
                        ? 'bg-brand-red text-white shadow-md' 
                        : 'bg-card-bg text-brand-gray border border-border-primary hover:border-brand-red hover:text-brand-red'
                      }`}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {tool.id === 'trending-topics' && (
              <div className="space-y-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-brand-gray" />
                      <span className="text-[10px] font-black text-brand-gray uppercase tracking-widest">Time Frame</span>
                    </div>
                    <div className="flex gap-1">
                      {['Today', 'This Week', 'This Month'].map((tf) => (
                        <button
                          key={tf}
                          onClick={() => setTrendTimeFrame(tf)}
                          className={`flex-1 px-2 py-2 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all ${
                            trendTimeFrame === tf 
                            ? 'bg-brand-red text-white shadow-md' 
                            : 'bg-card-bg text-brand-gray border border-border-primary hover:border-brand-red'
                          }`}
                        >
                          {tf}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Globe className="w-3.5 h-3.5 text-brand-gray" />
                      <span className="text-[10px] font-black text-brand-gray uppercase tracking-widest">Location</span>
                    </div>
                    <div className="flex gap-1">
                      {['India', 'USA', 'Global'].map((loc) => (
                        <button
                          key={loc}
                          onClick={() => setTrendLocation(loc)}
                          className={`flex-1 px-2 py-2 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all ${
                            trendLocation === loc 
                            ? 'bg-brand-red text-white shadow-md' 
                            : 'bg-card-bg text-brand-gray border border-border-primary hover:border-brand-red'
                          }`}
                        >
                          {loc}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Languages className="w-3.5 h-3.5 text-brand-gray" />
                      <span className="text-[10px] font-black text-brand-gray uppercase tracking-widest">Language</span>
                    </div>
                    <div className="flex gap-1">
                      {['English', 'Hindi', 'Hinglish'].map((lang) => (
                        <button
                          key={lang}
                          onClick={() => setTrendLanguage(lang)}
                          className={`flex-1 px-2 py-2 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all ${
                            trendLanguage === lang 
                            ? 'bg-brand-dark text-white shadow-md' 
                            : 'bg-card-bg text-brand-gray border border-border-primary hover:border-brand-red'
                          }`}
                        >
                          {lang === 'English' ? '🇺🇸 EN' : lang === 'Hindi' ? '🇮🇳 HI' : '🌍 HG'}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {tool.id !== 'thumb-score' && tool.id !== 'best-time' && tool.id !== 'monetization' && tool.id !== 'audit' && (
              <div>
                <label className="block text-sm font-bold text-brand-dark mb-2 uppercase tracking-widest">
                  {tool.id === 'trending-topics' ? 'Niche / Keyword' : 'Enter your video topic or keywords'}
                </label>
                <textarea
                  className="input-field min-h-[80px] sm:min-h-[120px] resize-none py-3 sm:py-4 px-4 sm:px-6"
                  placeholder={
                    tool.id === 'title-gen' ? "Enter your video topic or title..." : 
                    tool.id === 'desc-gen' ? "Enter your video topic, title, or keywords..." :
                    tool.id === 'tag-gen' ? "Enter your video topic, title, or keywords..." :
                    tool.id === 'hash-gen' ? "Enter your video topic or keywords..." :
                    tool.id === 'name-ideas' ? "Enter keywords (e.g., Cooking, Fitness)..." :
                    tool.id === 'comp-spy' ? "Enter links or topic..." :
                    tool.id === 'trending-topics' ? "Enter your niche..." :
                    tool.id === 'content-planner' ? "Enter your niche..." :
                    tool.id === 'title-analyzer' ? "Enter your video title to analyze..." :
                    tool.id === 'viral-hooks' ? "Enter your video topic or keywords..." :
                    tool.id === 'thumb-text' ? "Enter your video topic or keywords..." :
                    "Enter your video topic, title, or keywords..."
                  }
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
              </div>
            )}

            {tool.id === 'best-time' && (
              <button
                onClick={() => handleAction("SCHEDULE_ADVISOR")}
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed py-4"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Analyzing Schedule...
                  </>
                ) : (
                  <>
                    <Clock className="w-5 h-5" />
                    Find Best Time to Post
                  </>
                )}
              </button>
            )}

            {tool.id === 'content-planner' && (
              <div className="flex items-center gap-4 p-4 bg-bg-primary rounded-2xl border border-border-primary">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-brand-gray" />
                  <span className="text-[10px] font-black text-brand-gray uppercase tracking-widest">Plan Type</span>
                </div>
                <div className="flex gap-2">
                  {['Weekly', 'Monthly'].map((type) => (
                    <button
                      key={type}
                      onClick={() => setPlannerType(type)}
                      className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${
                        plannerType === type 
                        ? 'bg-brand-red text-white shadow-md' 
                        : 'bg-card-bg text-brand-gray border border-border-primary hover:border-brand-red hover:text-brand-red'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {tool.id === 'script-gen' && (
              <div className="flex items-center gap-4 p-4 bg-bg-primary rounded-2xl border border-border-primary">
                <div className="flex items-center gap-2">
                  <Languages className="w-4 h-4 text-brand-gray" />
                  <span className="text-[10px] font-black text-brand-gray uppercase tracking-widest">Output Language</span>
                </div>
                <div className="flex gap-2">
                  {['English', 'Hindi', 'Hinglish'].map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setBlueprintLanguage(lang)}
                      className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${
                        blueprintLanguage === lang 
                        ? 'bg-brand-red text-white shadow-md' 
                        : 'bg-card-bg text-brand-gray border border-border-primary hover:border-brand-red hover:text-brand-red'
                      }`}
                    >
                      {lang === 'English' ? '🇬🇧 English' : lang === 'Hindi' ? '🇮🇳 Hindi' : '🌍 Hinglish'}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {tool.id === 'shorts-ideas' && (
              <div className="flex items-center gap-4 p-4 bg-bg-primary rounded-2xl border border-border-primary">
                <div className="flex items-center gap-2">
                  <Languages className="w-4 h-4 text-brand-gray" />
                  <span className="text-[10px] font-black text-brand-gray uppercase tracking-widest">Output Language</span>
                </div>
                <div className="flex gap-2">
                  {['English', 'Hindi', 'Hinglish'].map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setShortsLanguage(lang)}
                      className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${
                        shortsLanguage === lang 
                        ? 'bg-brand-red text-white shadow-md' 
                        : 'bg-card-bg text-brand-gray border border-border-primary hover:border-brand-red hover:text-brand-red'
                      }`}
                    >
                      {lang === 'English' ? '🇺🇸 English' : lang === 'Hindi' ? '🇮🇳 Hindi' : '🌍 Hinglish'}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {tool.id === 'hook-gen' && (
              <div className="space-y-6">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2">
                    <Languages className="w-4 h-4 text-brand-gray" />
                    <span className="text-[10px] font-black text-brand-gray uppercase tracking-widest">Output Language</span>
                  </div>
                  <div className="flex gap-2">
                    {['English', 'Hindi', 'Hinglish'].map((lang) => (
                      <button
                        key={lang}
                        onClick={() => setHookLanguage(lang)}
                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${
                          hookLanguage === lang 
                          ? 'bg-brand-red text-white shadow-md' 
                          : 'bg-card-bg text-brand-gray border border-border-primary hover:border-brand-red hover:text-brand-red'
                        }`}
                      >
                        {lang === 'English' ? '🇺🇸 English' : lang === 'Hindi' ? '🇮🇳 Hindi' : '🌍 Hinglish'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { id: '1', label: '1 Line Hook ⚡', desc: 'Ultra short' },
                    { id: '2', label: '2 Line Hook 📱', desc: 'For Shorts' },
                    { id: '5', label: '5 Line Hook 📺', desc: 'Standard' },
                    { id: '10', label: '10 Line Hook 📖', desc: 'Storytelling' }
                  ].map((l) => (
                    <button
                      key={l.id}
                      onClick={() => {
                        setHookLength(l.id);
                        handleAction(undefined, l.id);
                      }}
                      disabled={loading || !input.trim()}
                      className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all group disabled:opacity-50 ${
                        hookLength === l.id 
                        ? 'bg-brand-red border-brand-red text-white shadow-xl scale-[1.02]' 
                        : 'bg-card-bg border-border-primary text-brand-dark hover:border-brand-red hover:shadow-lg'
                      }`}
                    >
                      <span className="text-[10px] font-black uppercase tracking-wider mb-1">{l.label}</span>
                      <span className={`text-[8px] font-bold uppercase opacity-50 ${hookLength === l.id ? 'text-white' : 'text-brand-gray'}`}>
                        {l.desc}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {tool.id !== 'hook-gen' && tool.id !== 'best-time' && tool.id !== 'monetization' && tool.id !== 'audit' && (
              <>
                <button
                  onClick={() => handleAction()}
                  disabled={loading || !input.trim()}
                  className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed py-4 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      {tool.id === 'desc-gen' ? 'Generate SEO Description' : 
                     tool.id === 'tag-gen' ? 'Generate YouTube Tags' : 
                     tool.id === 'title-gen' ? 'Generate Viral Titles' :
                     tool.id === 'hash-gen' ? 'Generate Hashtags' :
                     tool.id === 'title-analyzer' ? 'Analyze Title Score' :
                     tool.id === 'video-ideas' ? 'Generate Video Ideas' :
                     tool.id === 'shorts-ideas' ? 'Generate Shorts Ideas' :
                     tool.id === 'hook-gen' || tool.id === 'viral-hooks' ? 'Generate Video Hooks' :
                     tool.id === 'script-gen' ? 'Generate Script Blueprint' :
                     tool.id === 'thumb-text' ? 'Generate Thumbnail Text' :
                     'Generate Results'}
                    </>
                  )}
                </button>
                <p className="text-[10px] text-brand-gray mt-3 font-medium opacity-80 text-center">
                  ⚡ AI-powered • SEO optimized • Ready to use
                </p>
              </>
            )}
          </div>
        )}

        <AnimatePresence mode="wait">
          {loading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12 border-t border-gray-100 mt-8"
            >
              <Loader2 className="w-10 h-10 animate-spin text-brand-red mx-auto mb-4" />
              <p className="text-brand-gray font-black uppercase tracking-widest text-xs">
                {tool.id === 'script-gen' ? `Writing your professional script in ${blueprintLanguage}...` : 
                 tool.id === 'shorts-ideas' ? `Generating viral shorts in ${shortsLanguage}...` :
                 isPlanner ? "Creating your content plan..." :
                 isTitleAnalyzer ? "Analyzing title strength..." :
                 isViralHooks ? "Generating viral hooks..." :
                 isThumbText ? "Creating thumbnail text..." :
                 isKeywordRes ? "Researching keywords..." : 
                 isSEOCheck ? "Analyzing video SEO..." : "Generating your results..."}
              </p>
              <p className="text-[10px] text-brand-gray/60 mt-2 font-bold">This may take a few seconds</p>
            </motion.div>
          )}

          {result && !loading && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="border-t border-border-primary pt-8 mt-8"
            >
              <AnimatePresence>
                {toast && (
                  <motion.div
                    initial={{ opacity: 0, y: 20, x: '-50%' }}
                    animate={{ opacity: 1, y: 0, x: '-50%' }}
                    exit={{ opacity: 0, y: 20, x: '-50%' }}
                    className="fixed bottom-8 left-1/2 z-50 px-6 py-3 bg-brand-dark text-white rounded-2xl shadow-2xl border border-white/10 flex items-center gap-3"
                  >
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-black uppercase tracking-widest">{toast}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Error Message */}
              {error && (
                <div className="mb-8 p-6 rounded-[40px] bg-brand-red/5 border border-brand-red/20 text-brand-red text-center">
                  <p className="font-black text-sm">{error}</p>
                </div>
              )}

              {tool.id === 'name-ideas' && Array.isArray(result) ? (
                <div className="space-y-8">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black text-brand-dark uppercase tracking-[0.4em] flex items-center gap-3">
                      <Sparkles className="w-4 h-4 text-brand-red" />
                      Brand Architect Results
                    </h3>
                  </div>
                  <div className="space-y-4 step-container">
                    {result.map((item: any, idx: number) => (
                      <div key={idx} className="flex flex-col md:flex-row gap-6 p-6 rounded-[40px] bg-card-bg border border-border-primary shadow-sm hover:shadow-md transition-all group step-box">
                        <div className="w-12 h-12 rounded-2xl bg-brand-dark text-white flex items-center justify-center shrink-0 font-black text-lg group-hover:bg-brand-red transition-colors shadow-lg">
                          {idx + 1}
                        </div>
                        <div className="flex-1 space-y-3">
                          <div className="flex flex-wrap items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                              <h4 className="text-xl font-black text-brand-dark tracking-tight">{item.name}</h4>
                              <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 ${
                                item.availability === 'Available' 
                                ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' 
                                : 'bg-rose-100 text-rose-700 border border-rose-200'
                              }`}>
                                {item.availability === 'Available' ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                                {item.availability === 'Available' ? 'Available' : 'Taken'}
                              </span>
                            </div>
                            <button 
                              onClick={() => {
                                navigator.clipboard.writeText(item.name);
                                setCopiedId(`name-${idx}`);
                                setTimeout(() => setCopiedId(null), 2000);
                              }}
                              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-bg-primary border border-border-primary text-[10px] font-black text-brand-dark hover:bg-brand-red hover:text-white hover:border-brand-red transition-all shadow-sm"
                            >
                              {copiedId === `name-${idx}` ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                              {copiedId === `name-${idx}` ? 'COPIED' : 'COPY NAME'}
                            </button>
                          </div>
                          <div className="p-4 rounded-2xl bg-bg-primary/50 border border-border-primary">
                            <p className="text-[9px] font-black text-brand-gray uppercase tracking-widest mb-1">Brand Strategy / Why</p>
                            <p className="text-sm text-brand-dark font-bold leading-relaxed">{item.meaning}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : tool.id === 'monetization' && result ? (
                <div className="space-y-8">
                  {/* Channel Header */}
                  <div className="bg-card-bg rounded-[40px] border border-border-primary p-8 shadow-sm flex flex-col md:flex-row items-center gap-8 relative">
                    <button 
                      onClick={() => copyToClipboard(`Channel: ${result.channelName}\nSubs: ${result.subscriberCount}\nWatch Time: ${manualWatchTime || result.watchTime}h\nMonetized: ${(result.subscriberCount >= 1000 && Number(manualWatchTime || result.watchTime) >= 4000) ? 'Yes' : 'No'}`)}
                      className="absolute top-6 right-6 flex items-center gap-2 px-4 py-2 rounded-xl bg-bg-primary border border-border-primary text-xs font-black text-brand-dark hover:text-brand-red transition-all shadow-sm"
                    >
                      {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Clipboard className="w-4 h-4" />}
                      {copied ? 'COPIED' : 'COPY STATS'}
                    </button>

                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-brand-red/10 shadow-xl">
                      <img 
                        src={result.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(result.channelName)}&background=random`} 
                        alt={result.channelName}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex-1 text-center md:text-left">
                      <h2 className="text-3xl font-black text-brand-dark uppercase tracking-tight mb-4">{result.channelName}</h2>
                      <div className="flex flex-wrap justify-center md:justify-start gap-4">
                        <div className="px-4 py-2 rounded-xl bg-brand-red/5 border border-brand-red/10">
                          <span className="text-[10px] font-black text-brand-red uppercase tracking-widest block">Subscribers</span>
                          <span className="text-xl font-black text-brand-dark">{result.subscriberCount.toLocaleString()}</span>
                        </div>
                        <div className="px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-100 group relative">
                          <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest block">Watch Time</span>
                          <div className="flex items-center gap-2">
                            {isEditingWatchTime ? (
                              <input 
                                type="number"
                                value={manualWatchTime}
                                onChange={(e) => setManualWatchTime(e.target.value)}
                                onBlur={() => setIsEditingWatchTime(false)}
                                autoFocus
                                className="w-20 bg-transparent border-b border-emerald-300 outline-none text-xl font-black text-brand-dark"
                              />
                            ) : (
                              <>
                                <span className="text-xl font-black text-brand-dark">{Number(manualWatchTime || result.watchTime).toLocaleString()}h</span>
                                <button 
                                  onClick={() => setIsEditingWatchTime(true)}
                                  className="p-1 hover:bg-emerald-100 rounded-lg transition-colors"
                                >
                                  <Edit className="w-3 h-3 text-emerald-600" />
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                        <div className={`px-4 py-2 rounded-xl ${(result.subscriberCount >= 1000 && Number(manualWatchTime || result.watchTime) >= 4000) ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white shadow-lg shadow-amber-500/20'}`}>
                          <span className="text-[10px] font-black uppercase tracking-widest block opacity-80">Status</span>
                          <span className="text-xl font-black">{(result.subscriberCount >= 1000 && Number(manualWatchTime || result.watchTime) >= 4000) ? 'MONETIZED' : 'NOT MONETIZED'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Progress Dashboard - Centered */}
                  <div className="flex flex-col md:flex-row justify-center items-center gap-8 flex-row-mobile">
                    {/* Watch Time Progress */}
                    <div className="bg-card-bg rounded-[40px] border border-border-primary p-8 shadow-sm text-center w-full max-w-sm">
                      <h3 className="text-sm font-black text-brand-gray uppercase tracking-widest mb-6">Watch Time Progress</h3>
                      <div className="relative w-48 h-48 mx-auto mb-6">
                        <svg className="w-full h-full -rotate-90">
                          <circle
                            cx="96"
                            cy="96"
                            r="88"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="12"
                            className="text-border-primary"
                          />
                          <motion.circle
                            cx="96"
                            cy="96"
                            r="88"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="12"
                            strokeDasharray={552.92}
                            initial={{ strokeDashoffset: 552.92 }}
                            animate={{ strokeDashoffset: 552.92 - (552.92 * Math.min((Number(manualWatchTime || result.watchTime) / 4000) * 100, 100)) / 100 }}
                            className="text-brand-red"
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-4xl font-black text-brand-dark">{Math.round(Math.min((Number(manualWatchTime || result.watchTime) / 4000) * 100, 100))}%</span>
                          <span className="text-[10px] font-bold text-brand-gray uppercase tracking-widest">of 4000 Hrs</span>
                        </div>
                      </div>
                      <p className="text-sm font-bold text-brand-gray">
                        {Math.max(0, 4000 - Number(manualWatchTime || result.watchTime)) > 0 
                          ? `${Math.max(0, 4000 - Number(manualWatchTime || result.watchTime))} hours remaining` 
                          : 'Goal Reached! 🎉'}
                      </p>
                    </div>

                    {/* Subscribers Progress */}
                    <div className="bg-card-bg rounded-[40px] border border-border-primary p-8 shadow-sm text-center w-full max-w-sm">
                      <h3 className="text-sm font-black text-brand-gray uppercase tracking-widest mb-6">Subscribers Progress</h3>
                      <div className="relative w-48 h-48 mx-auto mb-6">
                        <svg className="w-full h-full -rotate-90">
                          <circle
                            cx="96"
                            cy="96"
                            r="88"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="12"
                            className="text-border-primary"
                          />
                          <motion.circle
                            cx="96"
                            cy="96"
                            r="88"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="12"
                            strokeDasharray={552.92}
                            initial={{ strokeDashoffset: 552.92 }}
                            animate={{ strokeDashoffset: 552.92 - (552.92 * Math.min((result.subscriberCount / 1000) * 100, 100)) / 100 }}
                            className="text-emerald-500"
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-4xl font-black text-brand-dark">{Math.round(Math.min((result.subscriberCount / 1000) * 100, 100))}%</span>
                          <span className="text-[10px] font-bold text-brand-gray uppercase tracking-widest">of 1000 Subs</span>
                        </div>
                      </div>
                      <p className="text-sm font-bold text-brand-gray">
                        {Math.max(0, 1000 - result.subscriberCount) > 0 
                          ? `${Math.max(0, 1000 - result.subscriberCount)} subscribers remaining` 
                          : 'Goal Reached! 🎉'}
                      </p>
                    </div>
                  </div>

                  {/* AI Growth Tips */}
                  {result.roadmap && result.roadmap.length > 0 && (
                    <div className="bg-card-bg rounded-[40px] border border-border-primary shadow-sm overflow-hidden">
                      <div className="flex items-center justify-between px-8 py-6 border-b border-border-primary bg-bg-primary">
                        <div>
                          <h2 className="text-xl font-black text-brand-dark uppercase tracking-widest">AI Growth Tips</h2>
                          <p className="text-xs text-brand-gray font-bold mt-1">Strategic advice based on your current stats</p>
                        </div>
                      </div>
                      <div className="p-8 space-y-4">
                        {result.roadmap.map((tip: string, idx: number) => (
                          <div key={idx} className="flex gap-4 items-start">
                            <div className="w-2 h-2 rounded-full bg-brand-red mt-2 flex-shrink-0" />
                            <p className="text-brand-dark font-bold leading-relaxed">{tip}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : tool.id === 'audit' && result.findings ? (
                <div className="space-y-8">
                  {/* Health Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { 
                        label: auditLanguage === 'Hindi' ? 'जुड़ाव दर' : auditLanguage === 'Hinglish' ? 'Engagement Rate' : 'Engagement Rate', 
                        value: `${result.engagementRate}%`, icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50' 
                      },
                      { 
                        label: auditLanguage === 'Hindi' ? 'अपलोड निरंतरता' : auditLanguage === 'Hinglish' ? 'Upload Consistency' : 'Upload Consistency', 
                        value: `${result.consistencyScore}%`, icon: Calendar, color: 'text-emerald-600', bg: 'bg-emerald-50' 
                      },
                      { 
                        label: auditLanguage === 'Hindi' ? 'SEO स्कोर' : auditLanguage === 'Hinglish' ? 'SEO Score' : 'SEO Score', 
                        value: `${result.seoScore}/100`, icon: Target, color: 'text-purple-600', bg: 'bg-purple-50' 
                      },
                      { 
                        label: auditLanguage === 'Hindi' ? 'रिटेंशन अनुमान' : auditLanguage === 'Hinglish' ? 'Retention Estimate' : 'Retention Estimate', 
                        value: `${result.retentionEstimate}%`, icon: Zap, color: 'text-amber-600', bg: 'bg-amber-50' 
                      }
                    ].map((card, idx) => (
                      <div key={idx} className={`${card.bg} p-6 rounded-[2rem] border border-white shadow-sm flex flex-col items-center text-center`}>
                        <div className={`w-12 h-12 rounded-2xl bg-card-bg flex items-center justify-center mb-4 shadow-sm ${card.color}`}>
                          <card.icon className="w-6 h-6" />
                        </div>
                        <span className="text-[10px] font-black text-brand-gray uppercase tracking-widest mb-1">{card.label}</span>
                        <span className={`text-2xl font-black ${card.color}`}>{card.value}</span>
                      </div>
                    ))}
                  </div>

                  {/* Detailed Findings Document */}
                  <div className="bg-card-bg rounded-[40px] border border-border-primary shadow-sm overflow-hidden">
                    <div className="p-8 md:p-12 space-y-12">
                      <div className="flex items-center justify-between border-b border-border-primary pb-8">
                        <div>
                          <h2 className="text-2xl font-black text-brand-dark uppercase tracking-widest">
                            {auditLanguage === 'Hindi' ? 'चैनल ऑडिट रिपोर्ट' : auditLanguage === 'Hinglish' ? 'Channel Audit Report' : 'Channel Audit Report'}
                          </h2>
                          <p className="text-xs text-brand-gray font-bold mt-1">
                            {auditLanguage === 'Hindi' ? 'AI-संचालित प्रदर्शन विश्लेषण' : auditLanguage === 'Hinglish' ? 'AI-Powered Performance Analysis' : 'AI-Powered Performance Analysis'}
                          </p>
                        </div>
                        <button 
                          onClick={() => {
                            const labels = {
                              report: auditLanguage === 'Hindi' ? 'चैनल ऑडिट रिपोर्ट' : 'CHANNEL AUDIT REPORT',
                              metrics: auditLanguage === 'Hindi' ? 'मेट्रिक्स' : 'METRICS',
                              engagement: auditLanguage === 'Hindi' ? 'जुड़ाव दर' : 'Engagement Rate',
                              consistency: auditLanguage === 'Hindi' ? 'निरंतरता' : 'Consistency',
                              seo: auditLanguage === 'Hindi' ? 'SEO स्कोर' : 'SEO Score',
                              retention: auditLanguage === 'Hindi' ? 'रिटेंशन अनुमान' : 'Retention Estimate',
                              findings: auditLanguage === 'Hindi' ? 'निष्कर्ष' : 'FINDINGS',
                              working: auditLanguage === 'Hindi' ? 'क्या काम कर रहा है' : 'WHAT\'S WORKING',
                              notWorking: auditLanguage === 'Hindi' ? 'क्या नहीं' : 'WHAT\'S NOT',
                              actionPlan: auditLanguage === 'Hindi' ? 'एक्शन प्लान' : 'ACTION PLAN'
                            };

                            const report = `${labels.report}\n\n` +
                              `${labels.metrics}:\n` +
                              `- ${labels.engagement}: ${result.engagementRate}%\n` +
                              `- ${labels.consistency}: ${result.consistencyScore}%\n` +
                              `- ${labels.seo}: ${result.seoScore}/100\n` +
                              `- ${labels.retention}: ${result.retentionEstimate}%\n\n` +
                              `${labels.findings}:\n` +
                              `1. ${labels.working}: ${result.findings.working}\n` +
                              `2. ${labels.notWorking}: ${result.findings.notWorking}\n` +
                              `3. ${labels.actionPlan}:\n${result.findings.actionPlan.map((s: string, i: number) => `   - ${s}`).join('\n')}`;
                            navigator.clipboard.writeText(report);
                            setToast(auditLanguage === 'Hindi' ? "ऑडिट रिपोर्ट कॉपी हो गई!" : "AUDIT REPORT COPIED!");
                            setTimeout(() => setToast(null), 2000);
                          }}
                          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-brand-red text-white text-[10px] font-black uppercase tracking-widest hover:bg-brand-dark transition-all shadow-lg shadow-brand-red/20"
                        >
                          <Clipboard className="w-4 h-4" />
                          {auditLanguage === 'Hindi' ? 'ऑडिट रिपोर्ट कॉपी करें' : auditLanguage === 'Hinglish' ? 'Copy Audit Report' : 'Copy Audit Report'}
                        </button>
                      </div>

                      <div className="space-y-12 step-container">
                        <div className="flex gap-6 step-box">
                          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 font-black text-lg">1</div>
                          <div className="space-y-2">
                            <h4 className="text-sm font-black text-brand-gray uppercase tracking-widest">
                              {auditLanguage === 'Hindi' ? 'क्या काम कर रहा है' : auditLanguage === 'Hinglish' ? 'What\'s Working' : 'What\'s Working'}
                            </h4>
                            <p className="text-lg text-brand-dark font-bold leading-relaxed">{result.findings.working}</p>
                          </div>
                        </div>

                        <div className="flex gap-6">
                          <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 font-black text-lg">2</div>
                          <div className="space-y-2">
                            <h4 className="text-sm font-black text-brand-gray uppercase tracking-widest">
                              {auditLanguage === 'Hindi' ? 'क्या नहीं' : auditLanguage === 'Hinglish' ? 'What\'s Not' : 'What\'s Not'}
                            </h4>
                            <p className="text-lg text-brand-dark font-bold leading-relaxed">{result.findings.notWorking}</p>
                          </div>
                        </div>

                        <div className="flex gap-6">
                          <div className="w-12 h-12 rounded-2xl bg-brand-dark text-white flex items-center justify-center shrink-0 font-black text-lg">3</div>
                          <div className="space-y-2">
                            <h4 className="text-sm font-black text-brand-gray uppercase tracking-widest">
                              {auditLanguage === 'Hindi' ? '30-दिन का एक्शन प्लान' : auditLanguage === 'Hinglish' ? '30-Day Action Plan' : '30-Day Action Plan'}
                            </h4>
                            <div className="space-y-4 mt-4">
                              {result.findings.actionPlan.map((step: string, idx: number) => (
                                <div key={idx} className="flex items-center gap-4 p-4 rounded-2xl bg-bg-primary border border-border-primary">
                                  <div className="w-2 h-2 rounded-full bg-brand-red" />
                                  <p className="text-brand-dark font-bold">{step}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : tool.id === 'best-time' ? (
                <div className="bg-card-bg rounded-[40px] border border-border-primary shadow-sm overflow-hidden">
                  <div className="flex items-center justify-between px-8 py-4 border-b border-border-primary bg-bg-primary">
                    <span className="text-[10px] font-black text-brand-gray uppercase tracking-widest">Strategic Schedule Advisor</span>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => {
                          const tipsText = (result.aiTips || []).map((tip: string, i: number) => `${i + 1}. ${tip}`).join('\n');
                          const heatmapText = (result.heatmap || []).map((row: any) => `${row.day}: Morning=${row.morning}, Afternoon=${row.afternoon}, Evening=${row.evening}`).join('\n');
                          copyToClipboard(`GOLDEN SLOT: ${result.goldenSlot}\n\nWEEKLY HEATMAP:\n${heatmapText}\n\nRECOMMENDATIONS:\n${tipsText}`);
                          setToast('Recommendations Copied!');
                        }}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-card-bg border border-border-primary text-[10px] font-black text-brand-dark hover:text-brand-red transition-all shadow-sm"
                      >
                        {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                        {copied ? 'COPIED' : 'COPY RECOMMENDATIONS'}
                      </button>
                    </div>
                  </div>
                  <div ref={resultRef} className="p-8 text-brand-dark leading-[1.6] bg-card-bg">
                    <div className="space-y-12">
                      {/* Golden Slot Highlight */}
                      <div className="bg-brand-red/10 border border-brand-red/20 rounded-[2rem] p-8 flex items-center justify-between shadow-sm flex-row-mobile">
                        <div>
                          <h3 className="text-[10px] font-black text-brand-red uppercase tracking-[0.3em] mb-2">Golden Slot Today</h3>
                          <p className="text-4xl font-black text-brand-dark tracking-tighter">{result.goldenSlot}</p>
                          <p className="text-[10px] font-bold text-brand-gray uppercase tracking-widest mt-2 opacity-60">Based on {selectedCategory} trends in {selectedRegion}</p>
                        </div>
                        <div className="w-16 h-16 rounded-2xl bg-brand-red text-white flex items-center justify-center shadow-lg shadow-brand-red/30">
                          <Clock className="w-8 h-8" />
                        </div>
                      </div>

                      {/* Weekly Heatmap */}
                      <div className="space-y-6">
                        <h3 className="text-xs font-black text-brand-dark uppercase tracking-[0.4em] flex items-center gap-3">
                          <div className="w-2 h-2 bg-brand-red rounded-full animate-pulse" />
                          Weekly Audience Heatmap
                        </h3>
                        <div className="overflow-x-auto rounded-3xl border border-border-primary shadow-sm">
                          <table className="w-full text-left border-collapse bg-card-bg">
                            <thead>
                              <tr className="bg-bg-primary">
                                <th className="py-4 px-6 text-[10px] font-black text-brand-gray uppercase tracking-widest border-b border-border-primary">Day</th>
                                <th className="py-4 px-6 text-[10px] font-black text-brand-gray uppercase tracking-widest border-b border-border-primary">Morning (6-12)</th>
                                <th className="py-4 px-6 text-[10px] font-black text-brand-gray uppercase tracking-widest border-b border-border-primary">Afternoon (12-6)</th>
                                <th className="py-4 px-6 text-[10px] font-black text-brand-gray uppercase tracking-widest border-b border-border-primary">Evening (6-12)</th>
                              </tr>
                            </thead>
                            <tbody>
                              {(result.heatmap || []).map((row: any, i: number) => (
                                <tr key={i} className="border-b border-border-primary hover:bg-bg-primary transition-colors">
                                  <td className="py-4 px-6 text-xs font-black text-brand-dark">{row.day}</td>
                                  <td className="py-4 px-6">
                                    <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                                      row.morning === 'Peak' ? 'bg-emerald-100 text-emerald-700' : 
                                      row.morning === 'Medium' ? 'bg-amber-100 text-amber-700' : 
                                      'bg-bg-primary text-brand-gray'
                                    }`}>
                                      {row.morning}
                                    </span>
                                  </td>
                                  <td className="py-4 px-6">
                                    <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                                      row.afternoon === 'Peak' ? 'bg-emerald-100 text-emerald-700' : 
                                      row.afternoon === 'Medium' ? 'bg-amber-100 text-amber-700' : 
                                      'bg-bg-primary text-brand-gray'
                                    }`}>
                                      {row.afternoon}
                                    </span>
                                  </td>
                                  <td className="py-4 px-6">
                                    <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                                      row.evening === 'Peak' ? 'bg-emerald-100 text-emerald-700' : 
                                      row.evening === 'Medium' ? 'bg-amber-100 text-amber-700' : 
                                      'bg-bg-primary text-brand-gray'
                                    }`}>
                                      {row.evening}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Recommendations */}
                      <div className="space-y-6">
                        <h3 className="text-xs font-black text-brand-dark uppercase tracking-[0.4em] flex items-center gap-3">
                          <Sparkles className="w-4 h-4 text-brand-red" />
                          Strategic Recommendations
                        </h3>
                        <div className="space-y-4">
                          {(result.aiTips || []).map((tip: string, idx: number) => (
                            <div key={idx} className="flex gap-6 p-6 rounded-[2rem] bg-card-bg border border-border-primary shadow-sm hover:shadow-md transition-all group">
                              <div className="w-10 h-10 rounded-xl bg-brand-dark text-white flex items-center justify-center shrink-0 font-black text-sm group-hover:bg-brand-red transition-colors">
                                {idx + 1}
                              </div>
                              <div className="pt-1">
                                <p className="text-[10px] font-black text-brand-red uppercase tracking-widest mb-1">AI Tip</p>
                                <p className="text-sm text-brand-dark font-bold leading-relaxed">{tip}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : typeof result === 'string' ? (
                <div className="bg-card-bg rounded-[40px] border border-border-primary shadow-sm overflow-hidden">
                  <div className="flex items-center justify-between px-8 py-4 border-b border-border-primary bg-bg-primary">
                    <span className="text-[10px] font-black text-brand-gray uppercase tracking-widest">Generated Document</span>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => copyToClipboard(result)}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-card-bg border border-border-primary text-[10px] font-black text-brand-dark hover:text-brand-red transition-all shadow-sm"
                      >
                        {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                        {copied ? 'COPIED' : 'COPY SCRIPT'}
                      </button>
                    </div>
                  </div>
                  <div ref={resultRef} className="p-8 text-brand-dark leading-[1.6] bg-card-bg">
                    <ReactMarkdown
                      components={{
                        h1: ({ children }) => <h1 className="text-2xl font-black text-[#0F0F0F] mb-6 mt-2">{children}</h1>,
                        h2: ({ children }) => <h2 className="text-xl font-black text-[#0F0F0F] mb-4 mt-6">{children}</h2>,
                        h3: ({ children }) => <h3 className="text-lg font-black text-[#0F0F0F] mb-3 mt-5">{children}</h3>,
                        p: ({ children }) => <p className="mb-4">{children}</p>,
                        ul: ({ children }) => <ul className="list-disc pl-6 mb-6 space-y-2">{children}</ul>,
                        ol: ({ children }) => <ol className="list-decimal pl-6 mb-6 space-y-2">{children}</ol>,
                        li: ({ children }) => <li className="pl-1">{children}</li>,
                        strong: ({ children }) => <strong className="font-bold text-[#0F0F0F]">{children}</strong>,
                      }}
                    >
                      {result}
                    </ReactMarkdown>
                  </div>
                </div>
              ) : (isGlobalReach && result?.globalDemand !== undefined) ? (
                <div className="space-y-8">
                  {/* Global Demand Score */}
                  <div className="bg-card-bg rounded-[40px] border border-border-primary p-8 shadow-sm text-center">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-sm font-black text-brand-dark uppercase tracking-widest">Global Potential</h3>
                      <button 
                        onClick={() => {
                          const strategy = `GLOBAL EXPANSION STRATEGY\n\nGLOBAL DEMAND: ${result.globalDemand}%\n\n1. TOP COUNTRIES:\n${result.topCountries.map((c: any) => `${c.flag} ${c.name}: ${c.reason}`).join('\n')}\n\n2. SUBTITLE ADVICE:\n${result.subtitleAdvice.map((s: any) => `${s.language}: ${s.reason}`).join('\n')}\n\n3. BEST UPLOAD TIMES:\n${result.bestTimeZones.map((t: any) => `${t.zone} (${t.time}): ${t.reason}`).join('\n')}\n\nSUMMARY:\n${result.strategySummary}`;
                          copyToClipboard(strategy);
                        }}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-card-bg border border-border-primary text-[10px] font-black text-brand-dark hover:text-brand-red transition-all shadow-sm"
                      >
                        {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Clipboard className="w-3 h-3" />}
                        {copied ? 'COPIED' : 'COPY GLOBAL STRATEGY'}
                      </button>
                    </div>

                    <div className="relative w-48 h-48 mx-auto mb-6">
                      <svg className="w-full h-full" viewBox="0 0 100 100">
                        <circle
                          className="text-border-primary stroke-current"
                          strokeWidth="10"
                          fill="transparent"
                          r="40"
                          cx="50"
                          cy="50"
                        />
                        <motion.circle
                          className="text-brand-red stroke-current"
                          strokeWidth="10"
                          strokeLinecap="round"
                          fill="transparent"
                          r="40"
                          cx="50"
                          cy="50"
                          initial={{ strokeDasharray: "0 251.2" }}
                          animate={{ strokeDasharray: `${(result.globalDemand / 100) * 251.2} 251.2` }}
                          style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-4xl font-black text-brand-dark">{result.globalDemand}%</span>
                        <span className="text-[10px] font-black text-brand-gray uppercase tracking-widest">Demand Score</span>
                      </div>
                    </div>
                    <p className="text-brand-gray max-w-md mx-auto">
                      {result.strategySummary}
                    </p>
                  </div>

                  {/* Strategic Roadmap */}
                  <div className="bg-card-bg rounded-[40px] border border-border-primary shadow-sm overflow-hidden">
                    <div className="px-8 py-4 border-b border-border-primary bg-bg-primary">
                      <span className="text-[10px] font-black text-brand-gray uppercase tracking-widest">Global Expansion Roadmap</span>
                    </div>
                    <div className="p-8 space-y-8">
                      {/* 1. Top Countries */}
                      <div className="flex gap-6">
                        <div className="w-12 h-12 rounded-2xl bg-brand-red text-white flex items-center justify-center shrink-0 text-xl font-black shadow-lg shadow-brand-red/20">
                          1
                        </div>
                        <div className="flex-1 pt-1">
                          <h4 className="text-sm font-black text-brand-dark uppercase tracking-widest mb-4 flex items-center gap-2">
                            <Globe className="w-4 h-4 text-brand-red" />
                            [🌍 Top Countries]
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {result.topCountries.map((country: any, idx: number) => (
                              <div key={idx} className="p-4 rounded-2xl bg-bg-primary border border-border-primary hover:border-brand-red/30 transition-colors">
                                <div className="text-2xl mb-2">{country.flag}</div>
                                <div className="font-black text-brand-dark text-xs uppercase mb-1">{country.name}</div>
                                <p className="text-[10px] text-brand-gray leading-tight">{country.reason}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* 2. Subtitle Advice */}
                      <div className="flex gap-6">
                        <div className="w-12 h-12 rounded-2xl bg-brand-red text-white flex items-center justify-center shrink-0 text-xl font-black shadow-lg shadow-brand-red/20">
                          2
                        </div>
                        <div className="flex-1 pt-1">
                          <h4 className="text-sm font-black text-brand-dark uppercase tracking-widest mb-4 flex items-center gap-2">
                            <Languages className="w-4 h-4 text-brand-red" />
                            [🗣️ Subtitle Advice]
                          </h4>
                          <div className="space-y-3">
                            {result.subtitleAdvice.map((advice: any, idx: number) => (
                              <div key={idx} className="flex items-start gap-3 p-4 rounded-2xl bg-bg-primary border border-border-primary">
                                <div className="w-2 h-2 rounded-full bg-brand-red mt-1.5 shrink-0" />
                                <div>
                                  <div className="font-black text-brand-dark text-xs uppercase mb-0.5">{advice.language}</div>
                                  <p className="text-[11px] text-brand-gray">{advice.reason}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* 3. Best Time Zone */}
                      <div className="flex gap-6">
                        <div className="w-12 h-12 rounded-2xl bg-brand-red text-white flex items-center justify-center shrink-0 text-xl font-black shadow-lg shadow-brand-red/20">
                          3
                        </div>
                        <div className="flex-1 pt-1">
                          <h4 className="text-sm font-black text-brand-dark uppercase tracking-widest mb-4 flex items-center gap-2">
                            <Clock className="w-4 h-4 text-brand-red" />
                            [⏰ Best Time Zone]
                          </h4>
                          <div className="space-y-3">
                            {result.bestTimeZones.map((tz: any, idx: number) => (
                              <div key={idx} className="p-4 rounded-2xl bg-bg-primary border border-border-primary">
                                <div className="flex items-center justify-between mb-2">
                                  <div className="font-black text-brand-dark text-xs uppercase">{tz.zone}</div>
                                  <div className="px-2 py-1 rounded-lg bg-brand-red/10 text-brand-red text-[10px] font-black">{tz.time}</div>
                                </div>
                                <p className="text-[11px] text-brand-gray">{tz.reason}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (isSentiment && result?.sentiment) ? (
                <div className="space-y-8">
                  {/* Sentiment Overview (Mood Meter) */}
                  <div className="bg-card-bg rounded-[40px] border border-border-primary p-8 shadow-sm text-center">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-sm font-black text-brand-dark uppercase tracking-widest">Mood Meter</h3>
                      <button 
                        onClick={() => {
                          const summary = `SENTIMENT SUMMARY\n\nMOOD METER:\n😊 Positive: ${result.sentiment.positive}%\n😐 Neutral: ${result.sentiment.neutral}%\n😡 Negative: ${result.sentiment.negative}%\n\nANALYSIS:\n${result.analysis.map((a: any, i: number) => `${i+1}. [${a.title}]: ${a.content}`).join('\n')}`;
                          copyToClipboard(summary);
                        }}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-card-bg border border-border-primary text-[10px] font-black text-brand-dark hover:text-brand-red transition-all shadow-sm"
                      >
                        {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Clipboard className="w-3 h-3" />}
                        {copied ? 'COPIED' : 'COPY SENTIMENT SUMMARY'}
                      </button>
                    </div>

                    <div className="flex h-12 w-full rounded-2xl overflow-hidden mb-8 shadow-inner border border-border-primary">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${result.sentiment.positive}%` }}
                        className="h-full bg-emerald-500 flex items-center justify-center text-white text-xs font-black"
                      >
                        {result.sentiment.positive > 10 && `${result.sentiment.positive}%`}
                      </motion.div>
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${result.sentiment.neutral}%` }}
                        className="h-full bg-amber-400 flex items-center justify-center text-white text-xs font-black"
                      >
                        {result.sentiment.neutral > 10 && `${result.sentiment.neutral}%`}
                      </motion.div>
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${result.sentiment.negative}%` }}
                        className="h-full bg-rose-500 flex items-center justify-center text-white text-xs font-black"
                      >
                        {result.sentiment.negative > 10 && `${result.sentiment.negative}%`}
                      </motion.div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
                        <div className="text-2xl mb-1">😊</div>
                        <div className="text-lg font-black text-emerald-700">{result.sentiment.positive}%</div>
                        <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Positive</div>
                        <p className="text-[9px] text-emerald-600/70 mt-1">Fans and Supporters</p>
                      </div>
                      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100">
                        <div className="text-2xl mb-1">😐</div>
                        <div className="text-lg font-black text-amber-700">{result.sentiment.neutral}%</div>
                        <div className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">Neutral</div>
                        <p className="text-[9px] text-amber-600/70 mt-1">Questions & Suggestions</p>
                      </div>
                      <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100">
                        <div className="text-2xl mb-1">😡</div>
                        <div className="text-lg font-black text-rose-700">{result.sentiment.negative}%</div>
                        <div className="text-[10px] font-bold text-rose-600 uppercase tracking-wider">Negative</div>
                        <p className="text-[9px] text-rose-600/70 mt-1">Haters or Critical</p>
                      </div>
                    </div>
                  </div>

                  {/* AI Analysis Report */}
                  <div className="bg-card-bg rounded-[40px] border border-border-primary shadow-sm overflow-hidden">
                    <div className="px-8 py-4 border-b border-border-primary bg-bg-primary">
                      <span className="text-[10px] font-black text-brand-gray uppercase tracking-widest">AI Analysis Report</span>
                    </div>
                    <div className="p-8 space-y-6">
                      {result.analysis.map((item: any, idx: number) => (
                        <div key={idx} className="flex gap-6 group">
                          <div className="w-12 h-12 rounded-2xl bg-bg-primary border border-border-primary flex items-center justify-center shrink-0 text-xl font-black text-brand-red group-hover:bg-brand-red group-hover:text-white transition-all">
                            {idx + 1}
                          </div>
                          <div className="flex-1 pt-1">
                            <h4 className="text-sm font-black text-brand-dark uppercase tracking-widest mb-2 flex items-center gap-2">
                              {item.title === 'Top Feedback' && <ThumbsUp className="w-4 h-4 text-emerald-500" />}
                              {item.title === 'Improvements' && <AlertCircle className="w-4 h-4 text-amber-500" />}
                              {item.title === 'Reply Suggestion' && <MessageSquare className="w-4 h-4 text-brand-red" />}
                              [{item.title}]
                            </h4>
                            <p className="text-brand-gray leading-relaxed">{item.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (isPlanner && result?.items) ? (
                <div className="space-y-6 step-container">
                  <div className="bg-card-bg rounded-[40px] border border-border-primary p-8 shadow-sm text-center">
                    <h3 className="text-xl font-black text-brand-dark uppercase tracking-widest mb-2">{result.planType} Content Plan</h3>
                    <p className="text-brand-gray text-sm">Your AI-generated content schedule for {input}</p>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    {result.items.map((item: any, idx: number) => (
                      <div key={idx} className="p-6 rounded-[2rem] bg-card-bg border border-border-primary hover:border-brand-red transition-all group step-box">
                        <div className="flex items-center gap-4 mb-3">
                          <div className="w-10 h-10 rounded-xl bg-brand-red/10 text-brand-red flex items-center justify-center font-black text-xs">
                            {item.day}
                          </div>
                          <h4 className="font-black text-brand-dark uppercase tracking-widest text-sm group-hover:text-brand-red transition-colors">{item.title}</h4>
                        </div>
                        <p className="text-brand-gray text-xs leading-relaxed pl-14">{item.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (isTitleAnalyzer && result?.score !== undefined) ? (
                <div className="space-y-8">
                  <div className="bg-card-bg rounded-[40px] border border-border-primary p-10 shadow-sm text-center">
                    <div className="inline-flex items-center justify-center w-32 h-32 rounded-full border-8 border-brand-red/10 mb-6 relative">
                      <span className="text-4xl font-black text-brand-dark">{result.score}</span>
                      <span className="absolute -bottom-2 bg-brand-red text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">Title Score</span>
                    </div>
                    <h3 className="text-lg font-black text-brand-dark uppercase tracking-widest mb-2">"{input}"</h3>
                    <p className="text-brand-gray text-sm">AI analysis of your video title strength</p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 grid-cols-mobile-1">
                    {[
                      { label: 'Keywords', value: result.analysis.keywords, icon: Search },
                      { label: 'Emotion', value: result.analysis.emotion, icon: Sparkles },
                      { label: 'Curiosity', value: result.analysis.curiosity, icon: Eye },
                      { label: 'Length', value: result.analysis.length, icon: TypeIcon }
                    ].map((metric, idx) => (
                      <div key={idx} className="p-6 rounded-[2rem] bg-card-bg border border-border-primary text-center">
                        <metric.icon className="w-5 h-5 text-brand-red mx-auto mb-3" />
                        <div className="text-xl font-black text-brand-dark mb-1">{metric.value}%</div>
                        <div className="text-[10px] font-black text-brand-gray uppercase tracking-widest">{metric.label}</div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-card-bg rounded-[40px] border border-border-primary shadow-sm overflow-hidden">
                    <div className="px-8 py-4 border-b border-border-primary bg-bg-primary">
                      <span className="text-[10px] font-black text-brand-gray uppercase tracking-widest">AI Suggestions for Improvement</span>
                    </div>
                    <div className="p-8 space-y-4 step-container">
                      {result.suggestions.map((suggestion: string, idx: number) => (
                        <div key={idx} className="flex items-start gap-4 p-4 rounded-2xl bg-bg-primary border border-border-primary group hover:border-brand-red transition-all step-box">
                          <div className="w-8 h-8 rounded-xl bg-brand-red text-white flex items-center justify-center shrink-0 font-black text-xs shadow-lg shadow-brand-red/20">
                            {idx + 1}
                          </div>
                          <p className="text-brand-dark text-sm font-bold pt-1.5">{suggestion}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (isViralHooks && Array.isArray(result)) ? (
                <div className="space-y-6 step-container">
                  <div className="bg-card-bg rounded-[40px] border border-border-primary p-8 shadow-sm text-center">
                    <h3 className="text-xl font-black text-brand-dark uppercase tracking-widest mb-2">Viral Hooks</h3>
                    <p className="text-brand-gray text-sm">5 high-retention opening hooks for {input}</p>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    {result.map((item: any, idx: number) => (
                      <div key={idx} className="p-6 rounded-[2rem] bg-card-bg border border-border-primary hover:border-brand-red transition-all group relative overflow-hidden step-box">
                        <div className="absolute top-0 right-0 p-4">
                          <button 
                            onClick={() => copyToClipboard(item.hook, `hook-${idx}`)}
                            className="p-2 rounded-xl bg-bg-primary border border-border-primary text-brand-gray hover:text-brand-red transition-all"
                          >
                            {copiedId === `hook-${idx}` ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                          </button>
                        </div>
                        <div className="flex items-center gap-3 mb-4">
                          <span className="px-3 py-1 rounded-full bg-brand-red/10 text-brand-red text-[10px] font-black uppercase tracking-widest">
                            {item.style} Style
                          </span>
                        </div>
                        <p className="text-brand-dark font-bold text-lg leading-relaxed pr-12">"{item.hook}"</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (isThumbText && Array.isArray(result)) ? (
                <div className="space-y-6 step-container">
                  <div className="bg-card-bg rounded-[40px] border border-border-primary p-8 shadow-sm text-center">
                    <h3 className="text-xl font-black text-brand-dark uppercase tracking-widest mb-2">Thumbnail Text Ideas</h3>
                    <p className="text-brand-gray text-sm">Short, punchy text for maximum CTR</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {result.map((text: string, idx: number) => (
                      <div key={idx} className="p-6 rounded-[2rem] bg-card-bg border border-border-primary hover:border-brand-red transition-all group flex items-center justify-between step-box">
                        <span className="text-xl font-black text-brand-dark uppercase tracking-tighter italic group-hover:text-brand-red transition-colors">"{text}"</span>
                        <button 
                          onClick={() => copyToClipboard(text, `text-${idx}`)}
                          className="p-2 rounded-xl bg-bg-primary border border-border-primary text-brand-gray hover:text-brand-red transition-all"
                        >
                          {copiedId === `text-${idx}` ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (isSEOCheck && result?.videoInfo) ? (
                <div className="space-y-8">
                  {/* Video Info Header */}
                  <div className="flex items-center gap-4 p-4 rounded-3xl border border-border-primary bg-card-bg shadow-sm">
                    <img 
                      src={result.videoInfo.thumbnail} 
                      alt="Thumbnail" 
                      className="w-32 h-20 object-cover rounded-2xl"
                    />
                    <div className="flex-1">
                      <h3 className="font-bold text-brand-dark line-clamp-2 mb-1">{result.videoInfo.title}</h3>
                      <div className="flex items-center gap-4 text-xs text-brand-gray">
                        <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {result.videoInfo.views}</span>
                        <span className="flex items-center gap-1"><ThumbsUp className="w-3 h-3" /> {result.videoInfo.likes}</span>
                      </div>
                    </div>
                  </div>

                  {/* Score Card */}
                  <div className="text-center p-8 rounded-[40px] bg-card-bg border border-border-primary shadow-sm">
                    <h2 className="text-2xl font-black text-brand-dark mb-4">Video SEO Check</h2>
                    <div className="w-full h-3 bg-bg-primary rounded-full mb-4 overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(result.score / 10) * 100}%` }}
                        className="h-full bg-emerald-500 rounded-full"
                      />
                    </div>
                    <div className="text-4xl font-black text-emerald-600 mb-4">
                      {result.score} <span className="text-2xl text-brand-gray font-medium">out of 10</span>
                    </div>
                    <p className="text-brand-gray max-w-md mx-auto">
                      Complete your checklist for better optimization and improved organic search results for your video.
                    </p>
                  </div>

                  {/* Checklist */}
                  <div>
                    <h4 className="text-sm font-black text-brand-dark uppercase tracking-widest mb-4">SEO Checklist</h4>
                    <div className="space-y-3">
                      {result.checklist?.map((item: any, idx: number) => (
                        <div 
                          key={idx} 
                          className={`flex items-center justify-between p-4 rounded-2xl border ${
                            item.status === 'pass' 
                              ? 'bg-emerald-50/50 border-emerald-100 text-emerald-900' 
                              : 'bg-red-50/50 border-red-100 text-red-900'
                          }`}
                        >
                          <span className="font-bold">{item.label}</span>
                          {item.status === 'pass' ? (
                            <CheckCircle2 className="w-6 h-6 text-emerald-500 fill-white" />
                          ) : (
                            <XCircle className="w-6 h-6 text-red-500 fill-white" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (isKeywordRes && result?.results) ? (
                <div className="space-y-8">
                  {/* Summary Stats & KD Score */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-card-bg rounded-3xl border border-border-primary p-6 shadow-sm text-center">
                      <div className="inline-flex p-3 rounded-2xl bg-brand-red/10 text-brand-red mb-4">
                        <TrendingUp className="w-6 h-6" />
                      </div>
                      <h4 className="text-xs font-black text-brand-gray uppercase tracking-widest mb-1">Difficulty Score</h4>
                      <div className={`text-3xl font-black ${
                        (result.kdScore || 0) <= 30 ? 'text-emerald-500' : 
                        (result.kdScore || 0) <= 70 ? 'text-amber-500' : 'text-red-500'
                      }`}>
                        {result.kdScore ?? 'N/A'}/100
                      </div>
                      <p className="text-[10px] font-bold text-brand-gray mt-2">
                        {(result.kdScore || 0) <= 30 ? 'EASY TO RANK' : 
                         (result.kdScore || 0) <= 70 ? 'MEDIUM COMPETITION' : 'HARD TO RANK'}
                      </p>
                    </div>

                    <div className="bg-card-bg rounded-3xl border border-border-primary p-6 shadow-sm text-center">
                      <div className="inline-flex p-3 rounded-2xl bg-blue-500/10 text-blue-500 mb-4">
                        <Users className="w-6 h-6" />
                      </div>
                      <h4 className="text-xs font-black text-brand-gray uppercase tracking-widest mb-1">Avg. Subscribers</h4>
                      <div className="text-3xl font-black text-brand-dark">
                        {result.metrics?.avgSubs ? `${(result.metrics.avgSubs / 1000).toFixed(1)}K` : 'N/A'}
                      </div>
                      <p className="text-[10px] font-bold text-brand-gray mt-2 uppercase">Market Size</p>
                    </div>

                    <div className="bg-card-bg rounded-3xl border border-border-primary p-6 shadow-sm text-center relative overflow-hidden">
                      <div className="absolute top-4 right-4">
                        <span className="px-2 py-1 bg-brand-red text-white text-[10px] font-black uppercase rounded-md">
                          {result.category}
                        </span>
                      </div>
                      <div className="inline-flex p-3 rounded-2xl bg-emerald-500/10 text-emerald-500 mb-4">
                        <Sparkles className="w-6 h-6" />
                      </div>
                      <h4 className="text-xs font-black text-brand-gray uppercase tracking-widest mb-1">Opportunity</h4>
                      <div className={`text-3xl font-black ${result.isHighOpportunity ? 'text-emerald-500' : result.isLowCompetition ? 'text-emerald-400' : 'text-brand-gray'}`}>
                        {result.isHighOpportunity ? 'VERY HIGH' : result.isLowCompetition ? 'HIGH' : 'LOW'}
                      </div>
                      <p className="text-[10px] font-bold text-brand-gray mt-2 uppercase">Ranking Potential</p>
                    </div>
                  </div>

                  {/* Metrics Table */}
                  <div className="bg-card-bg rounded-3xl border border-border-primary p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-black text-brand-dark uppercase tracking-widest">Keyword Metrics Table</h3>
                      <button 
                        onClick={() => setShowLowCompOnly(!showLowCompOnly)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                          showLowCompOnly ? 'bg-brand-red text-white' : 'bg-bg-primary text-brand-gray hover:bg-bg-secondary'
                        }`}
                      >
                        <Filter className="w-4 h-4" />
                        {showLowCompOnly ? 'Showing High Opportunity' : 'Filter Opportunities'}
                      </button>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="text-xs font-bold text-brand-gray uppercase tracking-wider border-b border-border-primary">
                            <th className="pb-3">Video Title</th>
                            <th className="pb-3">Channel</th>
                            <th className="pb-3">Views</th>
                            <th className="pb-3">Subs</th>
                            <th className="pb-3">Opportunity Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border-primary">
                          {result.results?.filter((v: any) => !showLowCompOnly || v.subscriberCount < 100000)
                            .map((v: any, idx: number) => (
                            <tr key={idx} className="text-sm group hover:bg-bg-primary transition-colors">
                              <td className="py-4 pr-4">
                                <div className="flex items-center gap-3">
                                  <img src={v.thumbnail} className="w-16 h-10 object-cover rounded-lg shadow-sm" alt="" />
                                  <span className="font-bold text-brand-dark line-clamp-1 max-w-[200px]">{v.title}</span>
                                </div>
                              </td>
                              <td className="py-4 text-brand-gray font-medium">{v.channelTitle}</td>
                              <td className="py-4 text-brand-dark font-black">{(v.viewCount / 1000).toFixed(1)}K</td>
                              <td className="py-4 text-brand-gray">{(v.subscriberCount / 1000).toFixed(1)}K</td>
                              <td className="py-4">
                                {v.subscriberCount < 50000 ? (
                                  <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase rounded-md">
                                    High Opportunity
                                  </span>
                                ) : v.subscriberCount < 100000 ? (
                                  <span className="px-2 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase rounded-md">
                                    Low Comp
                                  </span>
                                ) : (
                                  <span className="px-2 py-1 bg-bg-primary text-gray-400 text-[10px] font-black uppercase rounded-md">
                                    Competitive
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* AI Enhanced Sections */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Optimized Titles */}
                    <div className="bg-card-bg rounded-3xl border border-border-primary p-6 shadow-sm">
                      <h3 className="text-lg font-black text-brand-dark uppercase tracking-widest mb-4">Viral Title Suggestions</h3>
                      <div className="space-y-3">
                        {result.optimizedTitles?.map((title: string, idx: number) => (
                          <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-brand-red/10 border border-brand-red/20 group">
                            <span className="font-black text-brand-dark text-sm leading-tight">{title}</span>
                            <button onClick={() => copyToClipboard(title)} className="p-2 text-brand-gray hover:text-brand-red transition-colors opacity-0 group-hover:opacity-100">
                              <Copy className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Sweet Spot Keywords */}
                    <div className="bg-card-bg rounded-3xl border border-border-primary p-6 shadow-sm">
                      <h3 className="text-lg font-black text-brand-dark uppercase tracking-widest mb-4">"Sweet Spot" Keywords</h3>
                      <div className="space-y-3">
                        {result.sweetSpotKeywords?.map((kw: string, idx: number) => (
                          <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-emerald-50/10 border border-emerald-500/20 group">
                            <span className="font-bold text-emerald-900">{kw}</span>
                            <button onClick={() => copyToClipboard(kw)} className="p-2 text-emerald-600 hover:text-emerald-800 transition-colors opacity-0 group-hover:opacity-100">
                              <Copy className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Related Tags (Copy Box) */}
                  <div className="bg-brand-dark rounded-3xl p-8 text-white shadow-xl">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-lg font-black uppercase tracking-widest">Related LSI Tags</h3>
                        <p className="text-xs text-gray-400 font-bold mt-1">Copy & paste into your video description</p>
                      </div>
                      <button 
                        onClick={() => copyToClipboard(result.relatedTags)}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all font-bold text-sm"
                      >
                        {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                        {copied ? 'Copied!' : 'Copy All Tags'}
                      </button>
                    </div>
                    <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-gray-300 leading-relaxed font-medium text-sm">
                      {result.relatedTags}
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-brand-dark">Generated Results</h2>
                    {tool.id !== 'comp-spy' && (
                      <button
                        onClick={() => copyToClipboard(typeof result === 'string' ? result : JSON.stringify(result, null, 2))}
                        className="flex items-center gap-2 text-sm font-medium text-brand-gray hover:text-brand-red transition-colors"
                      >
                        {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                        {copied ? 'Copied!' : 'Copy All'}
                      </button>
                    )}
                  </div>

                  <div className="prose prose-red max-w-none">
                    {tool.id === 'video-ideas' && Array.isArray(result) ? (
                      <div className="space-y-6">
                        {result.map((idea: any, idx: number) => (
                          <div 
                            key={idx} 
                            className="bg-card-bg rounded-3xl border border-border-primary shadow-sm overflow-hidden transition-all hover:shadow-md"
                          >
                            <div 
                              className="p-6 cursor-pointer"
                              onClick={() => setExpandedId(expandedId === idx ? null : idx)}
                            >
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                  <div className="flex flex-wrap gap-2 mb-3">
                                    <span className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                                      idea.format === 'Shorts' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'
                                    }`}>
                                      {idea.format === 'Shorts' ? <Smartphone className="w-3 h-3" /> : <Tv className="w-3 h-3" />}
                                      {idea.format}
                                    </span>
                                    <span className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                                      idea.difficulty === 'Easy' ? 'bg-emerald-50 text-emerald-600' : 
                                      idea.difficulty === 'Medium' ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'
                                    }`}>
                                      <Zap className="w-3 h-3" />
                                      {idea.difficulty}
                                    </span>
                                    <span className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                                      idea.potential === 'Viral Potential' ? 'bg-brand-red/10 text-brand-red' : 'bg-bg-primary text-brand-gray'
                                    }`}>
                                      {idea.potential === 'Viral Potential' ? <Sparkles className="w-3 h-3" /> : <Search className="w-3 h-3" />}
                                      {idea.potential}
                                    </span>
                                  </div>
                                  <h3 className="text-xl font-black text-brand-dark mb-2 leading-tight">
                                    {decodeHtml(idea.title)}
                                  </h3>
                                  <p className="text-brand-gray text-sm font-medium leading-relaxed">
                                    {idea.description}
                                  </p>
                                </div>
                                <div className="shrink-0 mt-1">
                                  {expandedId === idx ? <ChevronUp className="w-6 h-6 text-brand-gray" /> : <ChevronDown className="w-6 h-6 text-brand-gray" />}
                                </div>
                              </div>
                            </div>

                            <AnimatePresence>
                              {expandedId === idx && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  className="border-t border-border-primary bg-bg-primary/30"
                                >
                                  <div className="p-6 space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                      <div className="space-y-4">
                                        <div>
                                          <h4 className="flex items-center gap-2 text-xs font-black text-brand-dark uppercase tracking-widest mb-2">
                                            <Sparkles className="w-4 h-4 text-brand-red" />
                                            Suggested Hook
                                          </h4>
                                          <p className="text-sm text-brand-gray bg-bg-primary p-4 rounded-2xl border border-border-primary italic">
                                            "{idea.hook}"
                                          </p>
                                        </div>
                                        <div>
                                          <h4 className="flex items-center gap-2 text-xs font-black text-brand-dark uppercase tracking-widest mb-2">
                                            <Target className="w-4 h-4 text-blue-500" />
                                            Target Audience
                                          </h4>
                                          <p className="text-sm text-brand-gray font-medium">
                                            {idea.targetAudience}
                                          </p>
                                        </div>
                                      </div>
                                      <div>
                                        <h4 className="flex items-center gap-2 text-xs font-black text-brand-dark uppercase tracking-widest mb-2">
                                          <Lightbulb className="w-4 h-4 text-amber-500" />
                                          Key Points to Cover
                                        </h4>
                                        <ul className="space-y-2">
                                          {idea.keyPoints.map((point: string, pIdx: number) => (
                                            <li key={pIdx} className="flex items-start gap-2 text-sm text-brand-gray font-medium">
                                              <div className="w-1.5 h-1.5 rounded-full bg-brand-red mt-1.5 shrink-0" />
                                              {point}
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    </div>

                                    <div className="pt-6 border-t border-border-primary flex flex-wrap gap-3">
                                      <button 
                                        disabled={loadingAction !== null}
                                        onClick={() => {
                                          setLoadingAction(`keyword-${idx}`);
                                          setTimeout(() => navigate(`/tool/keyword-res?q=${encodeURIComponent(idea.title)}`), 500);
                                        }}
                                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-card-bg border border-border-primary text-xs font-bold text-brand-dark hover:border-brand-red hover:text-brand-red transition-all shadow-sm disabled:opacity-50"
                                      >
                                        {loadingAction === `keyword-${idx}` ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                                        Analyze Keyword
                                      </button>
                                      <button 
                                        disabled={loadingAction !== null}
                                        onClick={() => {
                                          setLoadingAction(`script-${idx}`);
                                          localStorage.setItem('ytgrowth_script_data', JSON.stringify({
                                            title: idea.title,
                                            hook: idea.hook,
                                            keyPoints: idea.keyPoints
                                          }));
                                          setTimeout(() => navigate(`/tool/script-gen`), 500);
                                        }}
                                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-card-bg border border-border-primary text-xs font-bold text-brand-dark hover:border-brand-red hover:text-brand-red transition-all shadow-sm disabled:opacity-50"
                                      >
                                        {loadingAction === `script-${idx}` ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
                                        Create Script
                                      </button>
                                      <button 
                                        disabled={loadingAction !== null}
                                        onClick={() => {
                                          setLoadingAction(`thumb-${idx}`);
                                          setTimeout(() => navigate(`/tool/thumb-maker?q=${encodeURIComponent(`Thumbnail ideas for: ${idea.title} targeting ${idea.targetAudience}`)}`), 500);
                                        }}
                                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-card-bg border border-border-primary text-xs font-bold text-brand-dark hover:border-brand-red hover:text-brand-red transition-all shadow-sm disabled:opacity-50"
                                      >
                                        {loadingAction === `thumb-${idx}` ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
                                        Get Thumbnail Ideas
                                      </button>
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        ))}
                      </div>
                    ) : tool.id === 'thumb-maker' && Array.isArray(result) ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 step-container">
                        {result.map((concept: any, idx: number) => (
                          <div key={idx} className="bg-card-bg rounded-[40px] border border-border-primary overflow-hidden shadow-sm hover:shadow-xl transition-all group step-box">
                            {/* Storyboard Header/Sketch Placeholder */}
                            <div className="aspect-video bg-bg-primary flex items-center justify-center border-b border-border-primary relative overflow-hidden">
                              <div className="absolute inset-0 opacity-10 pointer-events-none">
                                <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                              </div>
                              <div className="flex flex-col items-center gap-2 text-brand-gray group-hover:scale-110 transition-transform duration-500">
                                <div className="flex items-center gap-2">
                                  {concept.layoutType === 'Split Screen' ? <Layout className="w-10 h-10" /> :
                                   concept.layoutType === 'Close-up' ? <Target className="w-10 h-10" /> :
                                   concept.layoutType === 'Comparison' ? <Zap className="w-10 h-10" /> :
                                   concept.layoutType === 'Action Shot' ? <TrendingUp className="w-10 h-10" /> :
                                   <ImageIcon className="w-10 h-10" />}
                                </div>
                                <div className="text-center px-4">
                                  <div className="flex items-center justify-center gap-1">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">{concept.layoutType}</span>
                                    <div className="group/info relative">
                                      <Info className="w-3 h-3 cursor-help text-brand-gray/50 hover:text-brand-red transition-colors" />
                                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-brand-dark text-white text-[10px] rounded-lg opacity-0 group-hover/info:opacity-100 transition-opacity pointer-events-none z-10 shadow-xl">
                                        {LAYOUT_METADATA[concept.layoutType]?.description || 'Professional YouTube layout.'}
                                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-brand-dark" />
                                      </div>
                                    </div>
                                  </div>
                                  <span className="text-[8px] font-bold text-brand-gray/60 uppercase tracking-widest block mt-0.5">
                                    {LAYOUT_METADATA[concept.layoutType]?.subtitle || ''}
                                  </span>
                                </div>
                              </div>
                              
                              {/* Badges */}
                              <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                                {concept.badges?.map((badge: string, bIdx: number) => (
                                  <span key={bIdx} className="px-2 py-1 bg-brand-dark text-white text-[8px] font-black uppercase rounded-md tracking-wider shadow-lg">
                                    {badge === 'High CTR' ? '🔥 ' : badge === 'Psychology Based' ? '🧠 ' : badge === 'Trending Style' ? '⚡ ' : '✨ '}
                                    {badge}
                                  </span>
                                ))}
                              </div>
                            </div>

                            <div className="p-8">
                              <h3 className="text-xl font-black text-brand-dark mb-6 leading-tight">{concept.conceptTitle}</h3>
                              
                              <div className="space-y-6 mb-8">
                                <div className="flex gap-4">
                                  <div className="w-1 h-auto bg-brand-red/20 rounded-full" />
                                  <div>
                                    <h4 className="text-[10px] font-black text-brand-gray uppercase tracking-widest mb-1">Background</h4>
                                    <p className="text-sm text-brand-dark font-medium leading-relaxed">{concept.background}</p>
                                  </div>
                                </div>
                                <div className="flex gap-4">
                                  <div className="w-1 h-auto bg-emerald-500/20 rounded-full" />
                                  <div>
                                    <h4 className="text-[10px] font-black text-brand-gray uppercase tracking-widest mb-1">Subject</h4>
                                    <p className="text-sm text-brand-dark font-medium leading-relaxed">{concept.subject}</p>
                                  </div>
                                </div>
                                <div className="flex gap-4">
                                  <div className="w-1 h-auto bg-blue-500/20 rounded-full" />
                                  <div>
                                    <h4 className="text-[10px] font-black text-brand-gray uppercase tracking-widest mb-1">Text Overlay</h4>
                                    <p className="text-sm text-brand-dark font-black italic">{concept.textOverlay}</p>
                                  </div>
                                </div>
                              </div>

                              {/* Color Palette */}
                              <div className="mb-8 p-4 bg-bg-primary rounded-2xl">
                                <h4 className="text-[10px] font-black text-brand-gray uppercase tracking-widest mb-3 flex items-center gap-2">
                                  <Palette className="w-3 h-3" /> Color Palette
                                </h4>
                                <div className="flex gap-3">
                                  {concept.colors?.map((color: string, cIdx: number) => (
                                    <div key={cIdx} className="flex items-center gap-2">
                                      <div 
                                        className="w-6 h-6 rounded-full border border-border-primary shadow-sm" 
                                        style={{ backgroundColor: color.includes('#') ? color : color.toLowerCase() }} 
                                      />
                                      <span className="text-[10px] font-bold text-brand-gray uppercase">{color}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Action Buttons */}
                              <div className="grid grid-cols-2 gap-3">
                                <div className="flex gap-2">
                                  <button 
                                    onClick={() => {
                                      const brief = `Concept: ${concept.conceptTitle}\nLayout: ${concept.layoutType}\nBackground: ${concept.background}\nSubject: ${concept.subject}\nText: ${concept.textOverlay}\nColors: ${concept.colors.join(', ')}`;
                                      copyToClipboard(brief);
                                    }}
                                    className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-card-bg border border-border-primary text-[10px] font-black text-brand-dark hover:border-brand-red hover:text-brand-red transition-all shadow-sm"
                                  >
                                    <Download className="w-3.5 h-3.5" />
                                    BRIEF
                                  </button>
                                  <button 
                                    onClick={() => {
                                      const briefOnly = `Background: ${concept.background}\nSubject: ${concept.subject}\nText Overlay: ${concept.textOverlay}`;
                                      navigator.clipboard.writeText(briefOnly);
                                      setCopiedId(`brief-${idx}`);
                                      setTimeout(() => setCopiedId(null), 2000);
                                    }}
                                    className="flex items-center justify-center p-3 rounded-xl bg-card-bg border border-border-primary text-brand-dark hover:text-brand-red transition-all shadow-sm"
                                    title="Copy Brief Data Only"
                                  >
                                    {copiedId === `brief-${idx}` ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                                  </button>
                                </div>
                                <button 
                                  className="relative flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-brand-dark text-white text-[10px] font-black opacity-50 cursor-not-allowed group-hover:opacity-100 transition-all shadow-lg"
                                >
                                  <Sparkles className="w-3.5 h-3.5" />
                                  AI GEN
                                  <span className="absolute -top-2 -right-2 px-1.5 py-0.5 bg-brand-red text-[7px] font-black rounded shadow-sm">SOON</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : tool.id === 'shorts-ideas' && Array.isArray(result) ? (
                      <div className="space-y-4">
                        <div className="bg-card-bg rounded-[40px] border border-border-primary shadow-sm p-6 md:p-10 font-sans">
                          <div className="space-y-4 step-container">
                            {result.map((idea: any, idx: number) => (
                              <div 
                                key={idx} 
                                className="group relative bg-bg-primary/50 hover:bg-card-bg rounded-3xl border border-transparent hover:border-border-primary transition-all duration-500 p-6 step-box"
                              >
                                <div className="flex items-start justify-between gap-4">
                                  <div className="flex-1">
                                    <h3 className="text-xl font-black text-brand-dark leading-tight group-hover:text-brand-red transition-colors">
                                      {idx + 1}. {idea.title}
                                    </h3>
                                    <p className="text-xs font-bold text-brand-gray mt-1 uppercase tracking-widest opacity-60">
                                      Target: {idea.targetAudience}
                                    </p>
                                  </div>
                                  
                                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button 
                                      onClick={() => {
                                        const script = `Shorts Title: ${idea.title}\nTarget Audience: ${idea.targetAudience}\n---\n⚡ THE HOOK (0-5s): ${idea.hook}\n🧠 THE VALUE (5-25s): ${idea.twist}\n🎯 THE CTA (25-30s): ${idea.cta}`;
                                        copyToClipboard(script);
                                        setToast(`Copied Script #${idx + 1}!`);
                                      }}
                                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-dark text-white text-[10px] font-black hover:bg-brand-red transition-all shadow-lg"
                                    >
                                      <Clipboard className="w-3.5 h-3.5" />
                                      COPY THIS SCRIPT
                                    </button>
                                  </div>
                                </div>

                                {/* Hover Reveal Content */}
                                <div className="max-h-0 overflow-hidden group-hover:max-h-[500px] transition-all duration-700 ease-in-out">
                                  <div className="pt-6 mt-6 border-t border-border-primary space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                      <div className="space-y-2">
                                        <h4 className="text-[10px] font-black text-brand-red uppercase tracking-widest flex items-center gap-2">
                                          <Zap className="w-3 h-3" /> HOOK (0-5s)
                                        </h4>
                                        <p className="text-sm text-brand-dark font-medium leading-relaxed italic">
                                          {idea.hook}
                                        </p>
                                      </div>

                                      <div className="space-y-2">
                                        <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-2">
                                          <TrendingUp className="w-3 h-3" /> VALUE (5-25s)
                                        </h4>
                                        <p className="text-sm text-brand-dark font-medium leading-relaxed">
                                          {idea.twist}
                                        </p>
                                      </div>

                                      <div className="space-y-2">
                                        <h4 className="text-[10px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2">
                                          <MousePointer2 className="w-3 h-3" /> CTA (25-30s)
                                        </h4>
                                        <p className="text-sm text-brand-dark font-medium leading-relaxed">
                                          {idea.cta}
                                        </p>
                                      </div>
                                    </div>

                                    <div className="flex gap-2 pt-2">
                                      <span className="px-2.5 py-1 bg-bg-primary text-brand-gray text-[9px] font-black uppercase rounded-lg tracking-wider">
                                        {idea.styleTag}
                                      </span>
                                      <span className="px-2.5 py-1 bg-brand-red/10 text-brand-red text-[9px] font-black uppercase rounded-lg tracking-wider">
                                        {idea.trendScore}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : tool.id === 'hook-gen' && Array.isArray(result) ? (
                      <div className="space-y-6 step-container">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {result.map((hook: string, idx: number) => (
                            <div 
                              key={idx} 
                              className="group relative bg-card-bg rounded-[2rem] border border-border-primary shadow-sm hover:shadow-xl transition-all duration-300 p-8 flex flex-col step-box"
                            >
                              <div className="flex items-start justify-between gap-4 mb-6">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full bg-brand-dark text-white text-xs font-black flex items-center justify-center shadow-lg">
                                    {idx + 1}
                                  </div>
                                  <span className="text-[10px] font-black text-brand-gray uppercase tracking-widest opacity-60">
                                    Viral Hook Option
                                  </span>
                                </div>
                                
                                <button 
                                  onClick={() => {
                                    copyToClipboard(hook);
                                    setToast(`Copied Hook #${idx + 1}!`);
                                  }}
                                  className="opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-xl bg-bg-primary text-brand-dark hover:text-brand-red hover:bg-brand-red/5"
                                  title="Copy Hook"
                                >
                                  <Clipboard className="w-4 h-4" />
                                </button>
                              </div>

                              <div className="flex-1">
                                <p className="text-lg text-brand-dark font-medium leading-relaxed italic">
                                  "{hook}"
                                </p>
                              </div>

                              <div className="mt-6 pt-6 border-t border-gray-50 flex items-center justify-between">
                                <div className="flex gap-2">
                                  <span className="px-2.5 py-1 bg-bg-primary text-brand-gray text-[9px] font-black uppercase rounded-lg tracking-wider">
                                    {hookLength} Lines
                                  </span>
                                  <span className="px-2.5 py-1 bg-brand-red/5 text-brand-red text-[9px] font-black uppercase rounded-lg tracking-wider">
                                    High Retention
                                  </span>
                                </div>
                                <button 
                                  onClick={() => {
                                    copyToClipboard(hook);
                                    setToast(`Copied Hook #${idx + 1}!`);
                                  }}
                                  className="text-[10px] font-black text-brand-red uppercase tracking-widest hover:underline"
                                >
                                  Copy Script
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : tool.id === 'thumb-score' && result ? (
                      <div className="space-y-10">
                        {/* Header with Copy Button */}
                        <div className="flex items-center justify-between bg-card-bg p-6 rounded-[2rem] border border-border-primary shadow-sm">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-brand-red/10 flex items-center justify-center">
                              <Zap className="w-5 h-5 text-brand-red" />
                            </div>
                            <div>
                              <h3 className="text-sm font-black text-brand-dark uppercase tracking-widest">AI Analysis Dashboard</h3>
                              <p className="text-[10px] font-bold text-brand-gray uppercase tracking-widest opacity-60">Real-time Thumbnail Performance Score</p>
                            </div>
                          </div>
                          <button 
                            onClick={() => {
                              const tipsText = (result.aiTips || []).map((tip: string, i: number) => `${i + 1}. ${tip}`).join('\n');
                              copyToClipboard(tipsText);
                              setToast('Improvements Copied!');
                            }}
                            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-dark text-white text-[10px] font-black hover:bg-brand-red transition-all shadow-lg shadow-brand-dark/20 uppercase tracking-widest"
                          >
                            <Clipboard className="w-3.5 h-3.5" />
                            Copy Improvements
                          </button>
                        </div>

                        {/* Main Stats Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                          {/* Overall Score Card */}
                          <div className="lg:col-span-1 bg-brand-dark rounded-[3rem] p-10 text-white flex flex-col items-center justify-center text-center shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                              <div className="absolute top-[-10%] left-[-10%] w-[120%] h-[120%] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-brand-red via-transparent to-transparent" />
                            </div>
                            
                            <div className="relative w-48 h-48 flex items-center justify-center mb-8">
                              <svg className="w-full h-full transform -rotate-90">
                                <circle
                                  cx="96"
                                  cy="96"
                                  r="84"
                                  stroke="currentColor"
                                  strokeWidth="16"
                                  fill="transparent"
                                  className="text-white/10"
                                />
                                <circle
                                  cx="96"
                                  cy="96"
                                  r="84"
                                  stroke="currentColor"
                                  strokeWidth="16"
                                  fill="transparent"
                                  strokeDasharray={528}
                                  strokeDashoffset={528 - (528 * result.overallScore) / 100}
                                  strokeLinecap="round"
                                  className="text-brand-red transition-all duration-1000 ease-out"
                                />
                              </svg>
                              <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-6xl font-black tracking-tighter">{result.overallScore}</span>
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-50 mt-1">Overall Score</span>
                              </div>
                            </div>
                            
                            <div className="space-y-1">
                              <p className="text-xs font-black uppercase tracking-[0.2em] text-white/60">Performance Level</p>
                              <p className={`text-2xl font-black uppercase tracking-widest ${
                                result.overallScore >= 80 ? 'text-emerald-400' : result.overallScore >= 50 ? 'text-amber-400' : 'text-brand-red'
                              }`}>
                                {result.overallScore >= 80 ? 'Excellent' : result.overallScore >= 50 ? 'Average' : 'Needs Work'}
                              </p>
                            </div>
                          </div>

                          {/* Key Metrics Card */}
                          <div className="lg:col-span-2 bg-card-bg rounded-[3rem] p-10 border border-border-primary shadow-xl space-y-10">
                            {[
                              { label: 'CTR Predictability', value: result.ctrPredictability || 0, icon: Zap, color: 'text-brand-red', bg: 'bg-brand-red' },
                              { label: 'Visual Contrast', value: result.visualContrast || 0, icon: Palette, color: 'text-blue-500', bg: 'bg-blue-500' },
                              { label: 'Mobile Viewability', value: result.mobileViewability || 0, icon: Smartphone, color: 'text-emerald-500', bg: 'bg-emerald-500' }
                            ].map((metric, i) => (
                              <div key={i} className="space-y-4">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-xl ${metric.bg}/10 flex items-center justify-center`}>
                                      <metric.icon className={`w-5 h-5 ${metric.color}`} />
                                    </div>
                                    <span className="text-sm font-black text-brand-dark uppercase tracking-widest">{metric.label}</span>
                                  </div>
                                  <span className={`text-xl font-black ${
                                    metric.value >= 80 ? 'text-emerald-500' : metric.value >= 50 ? 'text-amber-500' : 'text-brand-red'
                                  }`}>
                                    {metric.value}%
                                  </span>
                                </div>
                                <div className="w-full h-4 bg-bg-primary rounded-full overflow-hidden p-1 shadow-inner">
                                  <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${metric.value}%` }}
                                    transition={{ duration: 1, delay: i * 0.2 }}
                                    className={`h-full rounded-full shadow-lg ${
                                      metric.value >= 80 ? 'bg-emerald-500' : metric.value >= 50 ? 'bg-amber-500' : 'bg-brand-red'
                                    }`}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* AI Advice Section */}
                        <div className="bg-card-bg rounded-[3rem] p-10 border border-border-primary shadow-xl">
                          <h3 className="text-xs font-black text-brand-dark uppercase tracking-[0.4em] mb-10 flex items-center gap-4">
                            <div className="w-2 h-2 bg-brand-red rounded-full animate-pulse" />
                            AI Optimization Advice
                          </h3>
                          <div className="space-y-6">
                            {(result.aiTips || []).map((tip: string, idx: number) => (
                              <div key={idx} className="flex gap-6 group p-6 rounded-[2rem] hover:bg-bg-primary transition-all border border-transparent hover:border-border-primary">
                                <div className="w-12 h-12 rounded-2xl bg-brand-dark text-white flex items-center justify-center shrink-0 font-black text-lg shadow-lg group-hover:bg-brand-red transition-colors">
                                  {idx + 1}
                                </div>
                                <div className="pt-1">
                                  <p className="text-sm font-black text-brand-red uppercase tracking-widest mb-1">AI Tip</p>
                                  <p className="text-base text-brand-dark font-bold leading-relaxed">{tip}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Mobile Preview Section */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="bg-brand-dark rounded-[3rem] p-10 text-white space-y-8 shadow-2xl">
                            <h3 className="text-xs font-black uppercase tracking-[0.4em] flex items-center gap-3 opacity-60">
                              <Tv className="w-4 h-4" /> YouTube Dark Mode
                            </h3>
                            <div className="aspect-video bg-[#0F0F0F] rounded-2xl overflow-hidden border border-white/10 p-4 space-y-4">
                              <div className="flex gap-3">
                                <div className="w-full aspect-video rounded-xl overflow-hidden bg-gray-800">
                                  {thumbnailImage && <img src={thumbnailImage} className="w-full h-full object-cover" referrerPolicy="no-referrer" />}
                                </div>
                              </div>
                              <div className="flex gap-3">
                                <div className="w-10 h-10 rounded-full bg-gray-800 shrink-0" />
                                <div className="space-y-2 flex-1">
                                  <div className="h-4 bg-gray-800 rounded w-3/4" />
                                  <div className="h-3 bg-gray-800 rounded w-1/2" />
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="bg-bg-primary rounded-[3rem] p-10 space-y-8 border border-border-primary shadow-xl">
                            <h3 className="text-xs font-black text-brand-dark uppercase tracking-[0.4em] flex items-center gap-3 opacity-60">
                              <Smartphone className="w-4 h-4" /> Small Mobile View
                            </h3>
                            <div className="flex justify-center">
                              <div className="w-[200px] aspect-[9/19] bg-card-bg rounded-[40px] border-[6px] border-brand-dark overflow-hidden shadow-2xl relative">
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-5 bg-brand-dark rounded-b-2xl z-20" />
                                <div className="p-2 space-y-4 mt-6">
                                  <div className="aspect-video rounded-lg overflow-hidden bg-bg-primary border border-border-primary">
                                    {thumbnailImage && <img src={thumbnailImage} className="w-full h-full object-cover" referrerPolicy="no-referrer" />}
                                  </div>
                                  <div className="space-y-2">
                                    <div className="h-2 bg-bg-primary rounded w-full" />
                                    <div className="h-2 bg-bg-primary rounded w-2/3" />
                                  </div>
                                  <div className="aspect-video rounded-lg overflow-hidden bg-bg-primary border border-border-primary">
                                    {thumbnailImage && <img src={thumbnailImage} className="w-full h-full object-cover" referrerPolicy="no-referrer" />}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : tool.id === 'comp-spy' && result ? (
                      <div className="space-y-8">
                        {Array.isArray(result) ? (
                          <div className="grid grid-cols-1 gap-8">
                            <div className="flex items-center justify-between bg-brand-dark rounded-[2rem] p-6 text-white shadow-xl">
                              <div className="flex items-center gap-3">
                                <Target className="w-6 h-6 text-brand-red" />
                                <div>
                                  <h3 className="text-sm font-black uppercase tracking-widest">Comparison Mode</h3>
                                  <p className="text-[10px] font-bold opacity-60 uppercase tracking-widest">Comparing {result.length} Competitors</p>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                {result.map((res: any, idx: number) => (
                                  <div key={idx} className="px-3 py-1 bg-white/10 rounded-lg text-[10px] font-black uppercase tracking-widest">
                                    {res.channelName || res.query}
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                              {result.map((res: any, idx: number) => (
                                <div key={idx} className="relative">
                                  {res.error ? (
                                    <div className="bg-red-50 border border-red-100 rounded-[40px] p-8 text-center h-full flex flex-col items-center justify-center">
                                      <AlertCircle className="w-8 h-8 text-brand-red mb-4" />
                                      <p className="text-brand-dark font-black uppercase tracking-widest text-xs mb-2">Failed: {res.query}</p>
                                      <p className="text-brand-gray text-[10px] font-bold">{res.error}</p>
                                    </div>
                                  ) : (
                                    <div className="bg-card-bg rounded-[40px] border border-border-primary shadow-sm p-8 relative overflow-hidden h-full">
                                      <div className="mb-8">
                                        <h2 className="text-[10px] font-black text-brand-red uppercase tracking-[0.3em] mb-1">Competitor {idx + 1}</h2>
                                        <h1 className="text-xl font-black text-brand-dark uppercase tracking-tight truncate">
                                          {res.channelName}
                                        </h1>
                                      </div>
                                      <div className="space-y-6 mb-8">
                                        {[
                                          { label: 'Trending Video', value: res.trendingVideo, icon: TrendingUp, color: 'text-brand-red' },
                                          { label: 'Best Keywords', value: res.bestKeywords, icon: Tag, color: 'text-blue-500' },
                                          { label: 'Thumbnail Style', value: res.thumbnailStyle, icon: ImageIcon, color: 'text-emerald-500' }
                                        ].map((insight, i) => (
                                          <div key={i} className="group/item">
                                            <div className="flex items-center justify-between mb-1">
                                              <div className="flex items-center gap-2">
                                                <insight.icon className={`w-3 h-3 ${insight.color}`} />
                                                <p className="text-[9px] font-black text-brand-gray uppercase tracking-widest">{insight.label}</p>
                                              </div>
                                              <button 
                                                onClick={() => {
                                                  copyToClipboard(insight.value);
                                                  setToast(`${insight.label} Copied!`);
                                                }}
                                                className="opacity-0 group-hover/item:opacity-100 p-1.5 hover:bg-bg-primary rounded-lg transition-all"
                                              >
                                                <Copy className="w-3 h-3 text-brand-gray" />
                                              </button>
                                            </div>
                                            <p className="text-sm text-brand-dark font-bold leading-relaxed">{insight.value}</p>
                                          </div>
                                        ))}
                                      </div>
                                      <div className="grid grid-cols-2 gap-4 pt-6 border-t border-border-primary">
                                        <div 
                                          onClick={() => setActiveMetricInfo({
                                            title: "Avg Views Analysis",
                                            desc: `Aapke competitor ke pichle 10 videos ka average views ${res.avgViews.toLocaleString()} hai. Ye data batata hai ki unki audience kitni loyal hai.`
                                          })}
                                          className="bg-bg-primary rounded-2xl p-4 text-center cursor-pointer hover:bg-blue-50 transition-colors group/card"
                                        >
                                          <div className="flex items-center justify-center gap-1 mb-1">
                                            <Eye className="w-3 h-3 text-blue-500" />
                                            <h4 className="text-[8px] font-black text-brand-gray uppercase tracking-widest">Avg Views</h4>
                                          </div>
                                          <div className="text-lg font-black text-brand-dark">
                                            {res.avgViews >= 1000000 ? `${(res.avgViews / 1000000).toFixed(1)}M` : res.avgViews >= 1000 ? `${(res.avgViews / 1000).toFixed(1)}K` : res.avgViews}
                                          </div>
                                          <Info className="w-2.5 h-2.5 text-brand-gray mx-auto mt-1 opacity-0 group-hover/card:opacity-100 transition-opacity" />
                                        </div>
                                        <div 
                                          onClick={() => setActiveMetricInfo({
                                            title: "Viral Potential",
                                            desc: `Is channel ka Viral Potential ${res.viralPotential}% hai. Ye score subscriber count aur views ke ratio se calculate kiya gaya hai. Jitna zyada score, utni zyada viral hone ki umeed!`
                                          })}
                                          className="bg-bg-primary rounded-2xl p-4 text-center cursor-pointer hover:bg-brand-red/5 transition-colors group/card"
                                        >
                                          <div className="flex items-center justify-center gap-1 mb-1">
                                            <Zap className="w-3 h-3 text-brand-red" />
                                            <h4 className="text-[8px] font-black text-brand-gray uppercase tracking-widest">Viral Score</h4>
                                          </div>
                                          <div className={`text-lg font-black ${res.viralPotential >= 80 ? 'text-emerald-500' : res.viralPotential >= 50 ? 'text-amber-500' : 'text-brand-red'}`}>
                                            {res.viralPotential}%
                                          </div>
                                          <Info className="w-2.5 h-2.5 text-brand-gray mx-auto mt-1 opacity-0 group-hover/card:opacity-100 transition-opacity" />
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="bg-card-bg rounded-[40px] border border-border-primary shadow-sm p-8 md:p-12 relative overflow-hidden">
                            {/* Top Right Copy Button */}
                            <div className="absolute top-8 right-8">
                              <button 
                                onClick={() => {
                                  const report = `COMPETITOR SPY REPORT: ${result.channelName}\n\nVIRAL INSIGHTS:\n1. Trending Video: ${result.trendingVideo}\n2. Best Keywords: ${result.bestKeywords}\n3. Thumbnail Style: ${result.thumbnailStyle}\n\nSTATS:\n- Avg Views: ${result.avgViews.toLocaleString()}\n- Viral Potential: ${result.viralPotential}/100\n- Posting Frequency: ${result.postingFrequency}`;
                                  copyToClipboard(report);
                                  setToast('Spy Report Copied!');
                                }}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-red text-white text-[10px] font-black hover:bg-brand-dark transition-all shadow-lg uppercase tracking-widest"
                              >
                                <Clipboard className="w-3.5 h-3.5" />
                                COPY SPY REPORT
                              </button>
                            </div>

                            <div className="mb-12">
                              <h2 className="text-xs font-black text-brand-red uppercase tracking-[0.3em] mb-2">Market Analysis</h2>
                              <h1 className="text-3xl font-black text-brand-dark uppercase tracking-tight">
                                Competitor Spy: <span className="text-brand-red">{result.channelName}</span>
                              </h1>
                            </div>

                            <div className="space-y-10">
                              <div>
                                <h3 className="text-sm font-black text-brand-dark uppercase tracking-widest mb-6 flex items-center gap-3">
                                  <div className="w-2 h-2 bg-brand-red rounded-full" />
                                  Viral Insights
                                </h3>
                                <div className="space-y-6">
                                  {[
                                    { label: 'Trending Video', value: result.trendingVideo, icon: TrendingUp, color: 'text-brand-red', bg: 'bg-brand-red/10' },
                                    { label: 'Best Keywords', value: result.bestKeywords, icon: Tag, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                                    { label: 'Thumbnail Style', value: result.thumbnailStyle, icon: ImageIcon, color: 'text-emerald-500', bg: 'bg-emerald-500/10' }
                                  ].map((insight, idx) => (
                                    <div key={idx} className="flex gap-6 group">
                                      <div className="w-12 h-12 rounded-2xl bg-bg-primary flex items-center justify-center shrink-0 font-black text-brand-dark shadow-sm group-hover:bg-brand-dark group-hover:text-white transition-all">
                                        {idx + 1}
                                      </div>
                                      <div className="pt-1 flex-1">
                                        <div className="flex items-center justify-between mb-1">
                                          <div className="flex items-center gap-2">
                                            <insight.icon className={`w-3.5 h-3.5 ${insight.color}`} />
                                            <p className="text-[10px] font-black text-brand-gray uppercase tracking-widest">{insight.label}</p>
                                          </div>
                                          <button 
                                            onClick={() => {
                                              copyToClipboard(insight.value);
                                              setToast(`${insight.label} Copied!`);
                                            }}
                                            className="opacity-0 group-hover:opacity-100 p-2 hover:bg-bg-primary rounded-xl transition-all"
                                          >
                                            <Copy className="w-4 h-4 text-brand-gray" />
                                          </button>
                                        </div>
                                        <p className="text-base text-brand-dark font-bold leading-relaxed">{insight.value}</p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10 border-t border-border-primary">
                                <div 
                                  onClick={() => setActiveMetricInfo({
                                    title: "Avg Views Analysis",
                                    desc: `Aapke competitor ke pichle 10 videos ka average views ${result.avgViews.toLocaleString()} hai. Ye data batata hai ki unki audience kitni loyal hai aur content kitna engage kar raha hai.`
                                  })}
                                  className="bg-bg-primary rounded-3xl p-6 text-center border border-transparent hover:border-border-primary transition-all cursor-pointer group/card"
                                >
                                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center mx-auto mb-4">
                                    <Eye className="w-5 h-5" />
                                  </div>
                                  <h4 className="text-[10px] font-black text-brand-gray uppercase tracking-widest mb-1">Avg Views</h4>
                                  <div className="text-2xl font-black text-brand-dark">
                                    {result.avgViews >= 1000000 ? `${(result.avgViews / 1000000).toFixed(1)}M` : result.avgViews >= 1000 ? `${(result.avgViews / 1000).toFixed(1)}K` : result.avgViews}
                                  </div>
                                  <div className="flex items-center justify-center gap-1 mt-1 opacity-0 group-hover/card:opacity-100 transition-opacity">
                                    <Info className="w-3 h-3 text-brand-gray" />
                                    <p className="text-[8px] font-bold text-brand-gray uppercase tracking-widest">Click for Info</p>
                                  </div>
                                </div>

                                <div 
                                  onClick={() => setActiveMetricInfo({
                                    title: "Viral Potential",
                                    desc: `Is channel ka Viral Potential ${result.viralPotential}% hai. Ye score subscriber count aur views ke ratio se calculate kiya gaya hai. Jitna zyada score, utni zyada viral hone ki umeed!`
                                  })}
                                  className="bg-bg-primary rounded-3xl p-6 text-center border border-transparent hover:border-border-primary transition-all cursor-pointer group/card"
                                >
                                  <div className="w-10 h-10 rounded-xl bg-brand-red/10 text-brand-red flex items-center justify-center mx-auto mb-4">
                                    <Zap className="w-5 h-5" />
                                  </div>
                                  <h4 className="text-[10px] font-black text-brand-gray uppercase tracking-widest mb-1">Viral Potential</h4>
                                  <div className={`text-2xl font-black ${result.viralPotential >= 80 ? 'text-emerald-500' : result.viralPotential >= 50 ? 'text-amber-500' : 'text-brand-red'}`}>
                                    {result.viralPotential}%
                                  </div>
                                  <div className="flex items-center justify-center gap-1 mt-1 opacity-0 group-hover/card:opacity-100 transition-opacity">
                                    <Info className="w-3 h-3 text-brand-gray" />
                                    <p className="text-[8px] font-bold text-brand-gray uppercase tracking-widest">Click for Info</p>
                                  </div>
                                </div>

                                <div className="bg-bg-primary rounded-3xl p-6 text-center border border-transparent hover:border-border-primary transition-all">
                                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto mb-4">
                                    <Calendar className="w-5 h-5" />
                                  </div>
                                  <h4 className="text-[10px] font-black text-brand-gray uppercase tracking-widest mb-1">Posting Freq</h4>
                                  <div className="text-lg font-black text-brand-dark leading-tight mt-1">
                                    {result.postingFrequency}
                                  </div>
                                  <p className="text-[8px] font-bold text-brand-gray mt-1 uppercase tracking-widest">Consistency</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : tool.id === 'analytics-dash' && result ? (
                      <div className="space-y-10">
                        <div className="bg-card-bg rounded-[40px] border border-border-primary shadow-sm p-8 md:p-12 relative overflow-hidden">
                          <div className="mb-12">
                            <h2 className="text-xs font-black text-brand-red uppercase tracking-[0.3em] mb-2">Channel Growth</h2>
                            <h1 className="text-3xl font-black text-brand-dark uppercase tracking-tight">
                              Analytics Dashboard: <span className="text-brand-red">{result.channelInfo.name}</span>
                            </h1>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
                            <div className="bg-bg-primary rounded-3xl p-6 text-center border border-border-primary">
                              <Users className="w-6 h-6 text-brand-red mx-auto mb-3" />
                              <h4 className="text-[10px] font-black text-brand-gray uppercase tracking-widest mb-1">Subscribers</h4>
                              <div className="text-xl font-black text-brand-dark">{result.channelInfo.subs.toLocaleString()}</div>
                            </div>
                            <div className="bg-bg-primary rounded-3xl p-6 text-center border border-border-primary">
                              <Eye className="w-6 h-6 text-blue-500 mx-auto mb-3" />
                              <h4 className="text-[10px] font-black text-brand-gray uppercase tracking-widest mb-1">Total Views</h4>
                              <div className="text-xl font-black text-brand-dark">{result.channelInfo.views.toLocaleString()}</div>
                            </div>
                            <div className="bg-bg-primary rounded-3xl p-6 text-center border border-border-primary">
                              <Clock className="w-6 h-6 text-amber-500 mx-auto mb-3" />
                              <h4 className="text-[10px] font-black text-brand-gray uppercase tracking-widest mb-1">Watch Time</h4>
                              <div className="text-xl font-black text-brand-dark">{result.channelInfo.watchTime.toLocaleString()}h</div>
                            </div>
                            <div className="bg-bg-primary rounded-3xl p-6 text-center border border-border-primary">
                              <TrendingUp className="w-6 h-6 text-emerald-500 mx-auto mb-3" />
                              <h4 className="text-[10px] font-black text-brand-gray uppercase tracking-widest mb-1">Growth Score</h4>
                              <div className="text-xl font-black text-brand-dark">8.4/10</div>
                            </div>
                          </div>

                          <div className="space-y-12">
                            {/* Growth Chart */}
                            <div className="bg-bg-primary rounded-[2rem] p-8 border border-border-primary">
                              <h3 className="text-sm font-black text-brand-dark uppercase tracking-widest mb-8 flex items-center gap-3">
                                <TrendingUp className="w-5 h-5 text-brand-red" />
                                6-Month Growth Trend
                              </h3>
                              <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                  <LineChart data={result.growthData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                                    <XAxis 
                                      dataKey="month" 
                                      axisLine={false} 
                                      tickLine={false} 
                                      tick={{ fontSize: 10, fontWeight: 900, fill: '#6B7280' }}
                                      dy={10}
                                    />
                                    <YAxis 
                                      axisLine={false} 
                                      tickLine={false} 
                                      tick={{ fontSize: 10, fontWeight: 900, fill: '#6B7280' }}
                                    />
                                    <Tooltip 
                                      contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 900 }}
                                    />
                                    <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase' }} />
                                    <Line type="monotone" dataKey="views" stroke="#FF4444" strokeWidth={4} dot={{ r: 6, fill: '#FF4444' }} activeDot={{ r: 8 }} name="Views" />
                                    <Line type="monotone" dataKey="subs" stroke="#3B82F6" strokeWidth={4} dot={{ r: 6, fill: '#3B82F6' }} activeDot={{ r: 8 }} name="Subscribers" />
                                  </LineChart>
                                </ResponsiveContainer>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                              {/* Traffic Sources */}
                              <div className="bg-bg-primary rounded-[2rem] p-8 border border-border-primary">
                                <h3 className="text-sm font-black text-brand-dark uppercase tracking-widest mb-8 flex items-center gap-3">
                                  <Globe className="w-5 h-5 text-blue-500" />
                                  Traffic Sources
                                </h3>
                                <div className="h-[250px] w-full">
                                  <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                      <Pie
                                        data={result.trafficSources}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                      >
                                        {result.trafficSources.map((entry: any, index: number) => (
                                          <Cell key={`cell-${index}`} fill={['#FF4444', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6'][index % 5]} />
                                        ))}
                                      </Pie>
                                      <Tooltip 
                                        contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 900, backgroundColor: 'var(--card-bg)', color: 'var(--text-primary)' }}
                                      />
                                      <Legend />
                                    </PieChart>
                                  </ResponsiveContainer>
                                </div>
                              </div>

                              {/* Demographics */}
                              <div className="bg-bg-primary rounded-[2rem] p-8 border border-border-primary">
                                <h3 className="text-sm font-black text-brand-dark uppercase tracking-widest mb-8 flex items-center gap-3">
                                  <Users className="w-5 h-5 text-emerald-500" />
                                  Audience Age
                                </h3>
                                <div className="h-[250px] w-full">
                                  <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={result.demographics} layout="vertical">
                                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E7EB" />
                                      <XAxis type="number" hide />
                                      <YAxis 
                                        dataKey="age" 
                                        type="category" 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{ fontSize: 10, fontWeight: 900, fill: '#6B7280' }}
                                      />
                                      <Tooltip />
                                      <Bar dataKey="percentage" fill="#FF4444" radius={[0, 10, 10, 0]} barSize={20} />
                                    </BarChart>
                                  </ResponsiveContainer>
                                </div>
                              </div>
                            </div>

                            {/* Insights & Recommendations */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                              <div className="space-y-4">
                                <h3 className="text-xs font-black text-brand-gray uppercase tracking-widest flex items-center gap-2">
                                  <Lightbulb className="w-4 h-4 text-amber-500" />
                                  Key Insights
                                </h3>
                                <div className="space-y-3">
                                  {result.insights.map((insight: string, idx: number) => (
                                    <div key={idx} className="p-4 bg-card-bg rounded-2xl border border-border-primary shadow-sm text-sm font-bold text-brand-dark flex gap-3">
                                      <div className="w-5 h-5 rounded-full bg-amber-50/10 text-amber-600 flex items-center justify-center shrink-0 text-[10px] font-black">
                                        {idx + 1}
                                      </div>
                                      {insight}
                                    </div>
                                  ))}
                                </div>
                              </div>
                              <div className="space-y-4">
                                <h3 className="text-xs font-black text-brand-gray uppercase tracking-widest flex items-center gap-2">
                                  <Zap className="w-4 h-4 text-brand-red" />
                                  Next Steps
                                </h3>
                                <div className="space-y-3">
                                  {result.recommendations.map((rec: string, idx: number) => (
                                    <div key={idx} className="p-4 bg-brand-dark text-white rounded-2xl shadow-lg text-sm font-bold flex gap-3">
                                      <div className="w-5 h-5 rounded-full bg-white/10 text-white flex items-center justify-center shrink-0 text-[10px] font-black">
                                        {idx + 1}
                                      </div>
                                      {rec}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : tool.id === 'trending-topics' && Array.isArray(result) ? (
                      <div className="space-y-8">
                        <div className="bg-card-bg rounded-[40px] border border-border-primary shadow-sm p-8 md:p-12 relative overflow-hidden">
                          {/* Top Right Copy Button */}
                          <div className="absolute top-8 right-8">
                            <button 
                              onClick={() => {
                                const report = result.map((t: any, idx: number) => 
                                  `${idx + 1}. ${t.topic}\nWhy: ${t.whyTrending}\nVolume: ${t.searchVolume}\nAngle: ${t.contentAngle}\nScore: ${t.viralScore}%`
                                ).join('\n\n');
                                copyToClipboard(report);
                                setToast('Topic Ideas Copied!');
                              }}
                              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-red text-white text-[10px] font-black hover:bg-brand-dark transition-all shadow-lg uppercase tracking-widest"
                            >
                              <Clipboard className="w-3.5 h-3.5" />
                              COPY TOPIC IDEAS
                            </button>
                          </div>

                          <div className="mb-12">
                            <h2 className="text-xs font-black text-brand-red uppercase tracking-[0.3em] mb-2">Trend Finder</h2>
                            <h1 className="text-3xl font-black text-brand-dark uppercase tracking-tight">
                              Viral Topics: <span className="text-brand-red">{input}</span>
                            </h1>
                          </div>

                          <div className="space-y-6">
                            {result.map((topic: any, idx: number) => (
                              <div key={idx} className="group p-6 rounded-[2rem] bg-bg-primary border border-transparent hover:border-brand-red/20 hover:bg-card-bg hover:shadow-xl transition-all">
                                <div className="flex flex-col md:flex-row gap-6">
                                  <div className="w-12 h-12 rounded-2xl bg-brand-dark text-white flex items-center justify-center shrink-0 font-black text-lg shadow-lg group-hover:bg-brand-red transition-colors">
                                    {idx + 1}
                                  </div>
                                  <div className="flex-1 space-y-4">
                                    <div className="flex flex-wrap items-center justify-between gap-4">
                                      <div className="flex items-center gap-3">
                                        <TrendingUp className="w-5 h-5 text-brand-red" />
                                        <h3 className="text-xl font-black text-brand-dark uppercase tracking-tight">{topic.topic}</h3>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 ${
                                          topic.searchVolume === 'High' ? 'bg-emerald-500/10 text-emerald-600' :
                                          topic.searchVolume === 'Medium' ? 'bg-amber-500/10 text-amber-600' :
                                          'bg-blue-500/10 text-blue-600'
                                        }`}>
                                          <Search className="w-3 h-3" />
                                          {topic.searchVolume} Volume
                                        </div>
                                        <div className="px-3 py-1 bg-brand-red/10 text-brand-red rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                                          <Zap className="w-3 h-3" />
                                          {topic.viralScore}% Viral
                                        </div>
                                      </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                      <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                          <Info className="w-3.5 h-3.5 text-brand-gray" />
                                          <p className="text-[10px] font-black text-brand-gray uppercase tracking-widest">Why it's trending</p>
                                        </div>
                                        <p className="text-sm text-brand-dark font-bold leading-relaxed">{topic.whyTrending}</p>
                                      </div>
                                      <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                          <Lightbulb className="w-3.5 h-3.5 text-brand-red" />
                                          <p className="text-[10px] font-black text-brand-red uppercase tracking-widest">Content Angle</p>
                                        </div>
                                        <p className="text-sm text-brand-dark font-bold leading-relaxed italic">"{topic.contentAngle}"</p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : Array.isArray(result) ? (
                      <div className="space-y-4">
                        {result.map((item: any, idx: number) => (
                          <div key={idx} className="p-4 rounded-xl bg-bg-primary border border-border-primary group relative">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                {typeof item === 'string' ? (
                                  <p className="text-brand-dark font-medium">{item}</p>
                                ) : (
                                  <>
                                    <h4 className="font-bold text-brand-dark mb-1">{item.title}</h4>
                                    <p className="text-sm text-brand-gray">{item.description}</p>
                                  </>
                                )}
                              </div>
                              <button
                                onClick={() => copyToClipboard(typeof item === 'string' ? item : item.title)}
                                className="p-2 opacity-0 group-hover:opacity-100 transition-opacity hover:text-brand-red"
                              >
                                <Copy className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : typeof result === 'string' && result.startsWith('Error:') ? (
                      <div className="p-8 bg-red-50 border border-red-100 rounded-[2rem] text-center">
                        <div className="w-16 h-16 bg-card-bg rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                          <AlertCircle className="w-8 h-8 text-brand-red" />
                        </div>
                        <h3 className="text-lg font-black text-brand-dark uppercase tracking-widest mb-2">Analysis Failed</h3>
                        <p className="text-brand-gray font-bold">{result.replace('Error: ', '')}</p>
                        <button 
                          onClick={() => setResult(null)}
                          className="mt-6 px-8 py-3 bg-brand-red text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-brand-dark transition-all"
                        >
                          Try Again
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="markdown-body result-box">
                          {typeof result === 'string' && (tool.id === 'tag-gen' || tool.id === 'hash-gen') ? (
                            <div className="tag-grid">
                              {result.split(/[,\s]+/).filter(Boolean).map((tag: string, i: number) => (
                                <span key={i} className="tag-item">{tag.startsWith('#') ? tag : `#${tag}`}</span>
                              ))}
                            </div>
                          ) : (
                            <ReactMarkdown>{typeof result === 'string' ? result : ''}</ReactMarkdown>
                          )}
                        </div>
                        <button
                          onClick={() => copyToClipboard(typeof result === 'string' ? result : JSON.stringify(result, null, 2))}
                          className="w-full flex md:hidden items-center justify-center gap-2 py-4 rounded-2xl bg-brand-red text-white font-black uppercase tracking-widest shadow-lg shadow-brand-red/20"
                        >
                          <Copy className="w-5 h-5" />
                          Copy Result
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {activeMetricInfo && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-brand-dark/40 backdrop-blur-sm"
            onClick={() => setActiveMetricInfo(null)}
          >
            <div 
              className="bg-card-bg rounded-[40px] p-8 max-w-sm w-full shadow-2xl border border-border-primary"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-black text-brand-dark uppercase tracking-widest">{activeMetricInfo.title}</h3>
                <button onClick={() => setActiveMetricInfo(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <XCircle className="w-6 h-6 text-brand-gray" />
                </button>
              </div>
              <p className="text-brand-gray font-bold leading-relaxed">{activeMetricInfo.desc}</p>
              <button 
                onClick={() => setActiveMetricInfo(null)}
                className="w-full mt-6 py-3 bg-brand-dark text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-brand-red transition-all"
              >
                Got it!
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Related Tools Section */}
      <div className="mt-24">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-red/10 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-brand-red" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-brand-dark uppercase tracking-tight">Related Tools</h2>
              <p className="text-brand-gray font-medium">Boost your growth with these tools</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TOOLS
            .filter(t => t.id !== tool.id)
            .sort(() => 0.5 - Math.random())
            .slice(0, 6)
            .map((relatedTool) => (
              <Link
                key={relatedTool.id}
                to={relatedTool.path}
                className="group p-5 rounded-2xl bg-card-bg border border-border-primary hover:border-brand-red transition-all shadow-sm hover:shadow-md"
              >
                <div className="w-10 h-10 rounded-xl bg-bg-primary group-hover:bg-brand-red/10 text-brand-gray group-hover:text-brand-red flex items-center justify-center mb-3 transition-colors">
                  <relatedTool.icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-brand-dark group-hover:text-brand-red transition-colors text-sm mb-1">
                  {t(`tool.${relatedTool.id}.name`)}
                </h3>
                <p className="text-xs text-brand-gray line-clamp-1">
                  {t(`tool.${relatedTool.id}.desc`)}
                </p>
              </Link>
            ))}
        </div>
      </div>

      {/* Comment & Feedback Section */}
      <div id="comment-section-container" className="mt-16 pt-16 border-t border-border-primary block">
        <CommentSection toolId={tool.id} />
      </div>
    </div>
  );
}

function CommentSection({ toolId }: { toolId: string }) {
  const { t } = useLanguage();
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [rating, setRating] = useState<'good' | 'bad' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
      setFirebaseUser(user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const q = query(
      collection(db, 'comments'),
      where('toolId', '==', toolId),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const commentsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setComments(commentsData);
    }, (err) => {
      console.error("Error fetching comments:", err);
    });

    return () => unsubscribe();
  }, [toolId]);

  const handleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(firebaseAuth, provider);
      setError(null);
    } catch (err: any) {
      if (err.code === 'auth/popup-closed-by-user') {
        setError("Sign-in popup was closed before completion. Please try again.");
      } else {
        console.error("Sign in error:", err);
        setError("An error occurred during sign-in. Please try again.");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firebaseUser) {
      handleSignIn();
      return;
    }
    if (!newComment.trim() || !rating) {
      setError("Please provide a comment and a rating.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await addDoc(collection(db, 'comments'), {
        toolId,
        userId: firebaseUser.uid,
        userName: firebaseUser.displayName || 'Anonymous',
        content: newComment.trim(),
        rating,
        createdAt: serverTimestamp()
      });
      setNewComment('');
      setRating(null);
    } catch (err: any) {
      console.error("Error adding comment:", err);
      setError("Failed to post comment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-brand-red/10 flex items-center justify-center">
          <MessageSquare className="w-6 h-6 text-brand-red" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-brand-dark uppercase tracking-tight">User Feedback</h2>
          <p className="text-brand-gray font-medium">Tell us what you think about this tool</p>
        </div>
      </div>

      {/* Comment Form */}
      <div className="bg-card-bg rounded-[40px] p-8 border border-border-primary shadow-sm mb-12">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-wrap items-center gap-4 mb-2">
            <span className="text-sm font-black text-brand-dark uppercase tracking-widest">How was your experience?</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setRating('good')}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all",
                  rating === 'good' 
                    ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" 
                    : "bg-emerald-50 border border-emerald-100 text-emerald-600 hover:bg-emerald-100"
                )}
              >
                <ThumbsUp className="w-4 h-4" />
                Good
              </button>
              <button
                type="button"
                onClick={() => setRating('bad')}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all",
                  rating === 'bad' 
                    ? "bg-brand-red text-white shadow-lg shadow-brand-red/20" 
                    : "bg-red-50 border border-red-100 text-brand-red hover:bg-red-100"
                )}
              >
                <ThumbsDown className="w-4 h-4" />
                Bad
              </button>
            </div>
          </div>

          <div className="relative">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={firebaseUser ? "Write your feedback here..." : "Sign in to leave a comment..."}
              className="w-full min-h-[120px] p-6 rounded-3xl bg-bg-primary border border-border-primary focus:border-brand-red focus:ring-4 focus:ring-brand-red/5 transition-all resize-none text-brand-dark font-medium placeholder:text-brand-gray/50"
              disabled={isSubmitting}
            />
            {!firebaseUser && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-[2px] rounded-3xl">
                <button
                  type="button"
                  onClick={handleSignIn}
                  className="flex items-center gap-2 px-6 py-3 bg-brand-dark text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-brand-red transition-all shadow-xl"
                >
                  <UserIcon className="w-4 h-4" />
                  Sign in with Google
                </button>
              </div>
            )}
          </div>

          {error && (
            <p className="text-brand-red text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {error}
            </p>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting || !firebaseUser}
              className="flex items-center gap-2 px-8 py-4 bg-brand-red text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-brand-dark transition-all shadow-lg shadow-brand-red/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              Post Comment
            </button>
          </div>
        </form>
      </div>

      {/* Comments List */}
      <div className="space-y-6">
        <h3 className="text-sm font-black text-brand-dark uppercase tracking-widest mb-4 flex items-center gap-2">
          Recent Feedback
          <span className="bg-brand-red/10 text-brand-red px-2 py-0.5 rounded-lg text-[10px]">{comments.length}</span>
        </h3>

        {comments.length === 0 ? (
          <div className="text-center py-12 bg-bg-primary rounded-[40px] border border-dashed border-border-primary">
            <MessageSquare className="w-12 h-12 text-brand-gray/20 mx-auto mb-4" />
            <p className="text-brand-gray font-bold">No comments yet. Be the first to share your thoughts!</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {comments.map((comment) => (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={comment.id}
                className="bg-card-bg p-6 rounded-3xl border border-border-primary shadow-sm flex gap-4"
              >
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-xl bg-brand-dark/5 flex items-center justify-center text-brand-dark">
                    <UserIcon className="w-5 h-5" />
                  </div>
                </div>
                <div className="flex-grow">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-brand-dark text-sm">{comment.userName}</span>
                      {comment.rating === 'good' ? (
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-600 text-[10px] font-bold">
                          <ThumbsUp className="w-3 h-3" />
                          Good
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-red-50 text-brand-red text-[10px] font-bold">
                          <ThumbsDown className="w-3 h-3" />
                          Bad
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-brand-gray font-bold">
                      {comment.createdAt?.toDate ? new Date(comment.createdAt.toDate()).toLocaleDateString() : 'Just now'}
                    </span>
                  </div>
                  <p className="text-brand-gray font-medium text-sm leading-relaxed">
                    {comment.content}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
