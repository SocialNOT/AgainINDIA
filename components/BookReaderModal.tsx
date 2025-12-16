
import React, { useState, useEffect, useRef } from 'react';
import { LibraryBook, UserProgress, BookSession } from '../types';
import { ArrowLeft, Book, Sparkles, Loader2, CheckCircle2, X, Feather, Lightbulb, Zap, ArrowRight, MapPin, Globe, Languages, Check, Copy, Share2 } from 'lucide-react';
import { generateBookStructure, generateBookChapter, translateText, detectLanguageFromCoordinates, generateBookOverview } from '../services/geminiService';

interface BookReaderModalProps {
  book: LibraryBook;
  onClose: () => void;
  progress: UserProgress;
  onUpdateProgress: (newProgress: Partial<UserProgress>) => void;
}

const INDIAN_LANGUAGES = [
  "Hindi", "Tamil", "Telugu", "Bengali", "Marathi", 
  "Gujarati", "Kannada", "Malayalam", "Odia", "Punjabi", 
  "Assamese", "Sanskrit", "Urdu", "Maithili", "Konkani", "Nepali"
];

// Reused ContentBlock from LessonModal for consistency
const ContentBlock: React.FC<{
  type: 'tale' | 'wisdom' | 'practice';
  title?: string;
  content: string;
  icon?: React.ReactNode;
  activeLanguage: string;
  setActiveLanguage: (lang: string) => void;
}> = ({ type, title, content, icon, activeLanguage, setActiveLanguage }) => {
  const [displayText, setDisplayText] = useState(content);
  const [translatedCache, setTranslatedCache] = useState<Record<string, string>>({});
  const [isTranslating, setIsTranslating] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

  useEffect(() => {
    const updateText = async () => {
      if (activeLanguage === 'English') {
        setDisplayText(content);
        return;
      }
      
      if (translatedCache[activeLanguage]) {
        setDisplayText(translatedCache[activeLanguage]);
      } else {
        setIsTranslating(true);
        const translated = await translateText(content, activeLanguage);
        if (translated) {
            setTranslatedCache(prev => ({ ...prev, [activeLanguage]: translated }));
            setDisplayText(translated);
        } else {
            // FALLBACK TO ORIGINAL CONTENT ON FAILURE
            setDisplayText(content);
        }
        setIsTranslating(false);
      }
    };

    updateText();
  }, [activeLanguage, content]);

  const handleCopy = () => {
    navigator.clipboard.writeText(displayText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const containerStyle = type === 'tale' 
    ? "relative group px-2 sm:px-4"
    : type === 'wisdom'
      ? "bg-stone-100/50 dark:bg-slate-800/30 p-6 sm:p-8 rounded-2xl border border-stone-200 dark:border-slate-700"
      : type === 'practice'
        ? "bg-gradient-to-br from-stone-50 to-white dark:from-slate-900 dark:to-slate-900 p-6 sm:p-8 rounded-2xl border-l-4 border-emerald-500 shadow-md"
        : "";

  const textStyle = type === 'tale'
    ? "font-serif text-lg sm:text-xl leading-loose text-stone-800 dark:text-stone-200"
    : type === 'wisdom'
      ? "text-lg text-stone-700 dark:text-slate-300 leading-8 font-sans"
      : type === 'practice'
        ? "text-xl font-serif italic text-stone-800 dark:text-stone-200 leading-relaxed"
        : "text-lg leading-relaxed";

  return (
    <div className={containerStyle}>
       {type === 'tale' && <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-stone-300 to-transparent dark:from-stone-700 rounded-full"></div>}
       <div className={type === 'tale' ? "pl-6 sm:pl-8" : ""}>
          {(icon || title) && (
            <div className={`flex items-center space-x-2 mb-4 ${type === 'tale' ? 'text-stone-900 dark:text-stone-100' : type === 'wisdom' ? 'text-blue-800 dark:text-blue-300' : 'text-emerald-700 dark:text-emerald-400'}`}>
              {icon}
              {title && <h3 className="font-bold uppercase tracking-widest text-xs opacity-70">{title}</h3>}
            </div>
          )}
          <div className={`${textStyle} min-h-[60px]`}>
            {isTranslating ? (
              <div className="flex items-center space-x-3 text-saffron-500 animate-pulse py-4">
                <Loader2 size={18} className="animate-spin" />
                <span className="text-sm font-bold tracking-wide">Translating to {activeLanguage}...</span>
              </div>
            ) : (
               <div dangerouslySetInnerHTML={{ __html: displayText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>') }} />
            )}
          </div>
          <div className="flex flex-wrap items-center gap-4 mt-6 pt-4 border-t border-stone-200/50 dark:border-slate-700/50 opacity-90 transition-opacity relative">
            <div className="relative">
              <button 
                onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                className={`flex items-center space-x-1.5 text-[10px] font-bold uppercase tracking-widest transition-colors px-2 py-1 rounded-md ${activeLanguage !== 'English' ? 'text-saffron-600 bg-saffron-50 dark:bg-saffron-900/20' : 'text-stone-400 hover:text-saffron-600 dark:text-slate-500 dark:hover:text-saffron-400'}`}
              >
                <Languages size={14} />
                <span>{activeLanguage === 'English' ? 'Translate' : activeLanguage}</span>
              </button>
              {showLanguageMenu && (
                <div className="absolute top-full left-0 mt-2 w-48 max-h-60 overflow-y-auto glass-panel bg-white/95 dark:bg-slate-900/95 shadow-xl rounded-xl z-50 border border-stone-200 dark:border-slate-700 animate-in fade-in zoom-in-95 duration-200">
                  <div className="p-1">
                    <button onClick={() => { setActiveLanguage('English'); setShowLanguageMenu(false); }} className={`w-full text-left px-3 py-2 text-xs font-bold rounded-lg flex items-center justify-between ${activeLanguage === 'English' ? 'bg-stone-100 dark:bg-slate-800' : ''}`}><span>English</span>{activeLanguage === 'English' && <Check size={12} />}</button>
                    {INDIAN_LANGUAGES.map(lang => (
                      <button key={lang} onClick={() => { setActiveLanguage(lang); setShowLanguageMenu(false); }} className={`w-full text-left px-3 py-2 text-xs font-medium rounded-lg flex items-center justify-between ${activeLanguage === lang ? 'bg-saffron-50 dark:bg-saffron-900/20 text-saffron-700 dark:text-saffron-300' : ''}`}><span>{lang}</span>{activeLanguage === lang && <Check size={12} />}</button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="h-4 w-px bg-stone-200 dark:bg-slate-700"></div>
            <button onClick={handleCopy} className="flex items-center space-x-1.5 text-[10px] font-bold uppercase tracking-widest text-stone-400 hover:text-emerald-600 transition-colors">{isCopied ? <Check size={14} /> : <Copy size={14} />}<span>{isCopied ? 'Copied' : 'Copy'}</span></button>
          </div>
       </div>
    </div>
  );
};

const BookReaderModal: React.FC<BookReaderModalProps> = ({ book, onClose, progress, onUpdateProgress }) => {
  // Try to find existing session
  const existingSession = progress.bookSessions?.[book.id];

  const [chapters, setChapters] = useState<string[]>(existingSession?.chapters || []);
  const [isLoadingChapters, setIsLoadingChapters] = useState(!existingSession?.chapters || existingSession.chapters.length === 0);
  
  const [activeChapterIndex, setActiveChapterIndex] = useState<number | null>(existingSession?.lastActiveIndex ?? null);
  
  // Try to load cached content if we are active
  const [chapterContent, setChapterContent] = useState<string | null>(
    (activeChapterIndex !== null && existingSession?.chapterContentCache?.[activeChapterIndex]) || null
  );
  
  const [isContentLoading, setIsContentLoading] = useState(false);
  const [completedChapters, setCompletedChapters] = useState<number[]>(existingSession?.completedChapters || []);
  const [richDescription, setRichDescription] = useState<string | null>(existingSession?.richDescription || null);
  const [isDescriptionLoading, setIsDescriptionLoading] = useState(!richDescription);
  
  const [activeLanguage, setActiveLanguage] = useState('English');
  const [detectingLocation, setDetectingLocation] = useState(true);

  const contentRef = useRef<HTMLDivElement>(null);

  // Helper to update session state safely
  const updateSession = (updates: Partial<BookSession>) => {
    const currentSession = progress.bookSessions?.[book.id] || {
      bookId: book.id,
      chapters: [],
      completedChapters: [],
      chapterContentCache: {},
      lastActiveIndex: null,
      richDescription: undefined,
      lastAccessed: Date.now()
    };

    onUpdateProgress({
      bookSessions: {
        ...progress.bookSessions,
        [book.id]: {
          ...currentSession,
          ...updates,
          lastAccessed: Date.now()
        }
      }
    });
  };

  // 1. Initial Load: Generate Study Plan & Description if not present
  useEffect(() => {
    const init = async () => {
      // Check for cached structure?
      if (chapters.length === 0) {
        const plan = await generateBookStructure(book);
        setChapters(plan);
        updateSession({ chapters: plan });
        setIsLoadingChapters(false);
      } else {
        setIsLoadingChapters(false);
      }

      if (!richDescription) {
        setIsDescriptionLoading(true);
        const desc = await generateBookOverview(book);
        setRichDescription(desc);
        updateSession({ richDescription: desc });
        setIsDescriptionLoading(false);
      } else {
        setIsDescriptionLoading(false);
      }

      // Geo-detect language
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(async (pos) => {
          const lang = await detectLanguageFromCoordinates(pos.coords.latitude, pos.coords.longitude);
          if (lang && INDIAN_LANGUAGES.includes(lang)) setActiveLanguage(lang);
          setDetectingLocation(false);
        }, () => setDetectingLocation(false));
      } else {
        setDetectingLocation(false);
      }
    };
    init();
  }, [book.id]); // Only run if book ID changes

  // Scroll to top when chapter opens
  useEffect(() => {
    if (activeChapterIndex !== null && contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, [activeChapterIndex, chapterContent]);

  const handleChapterClick = async (index: number) => {
    if (activeChapterIndex === index) return;
    
    setActiveChapterIndex(index);
    updateSession({ lastActiveIndex: index });

    // Check cache
    if (existingSession?.chapterContentCache?.[index]) {
      setChapterContent(existingSession.chapterContentCache[index]);
      return;
    }

    setChapterContent(null);
    setIsContentLoading(true);

    const content = await generateBookChapter(book, chapters[index]);
    setChapterContent(content);
    
    // Save to cache
    updateSession({
      lastActiveIndex: index,
      chapterContentCache: {
        ...(progress.bookSessions?.[book.id]?.chapterContentCache || {}),
        [index]: content
      }
    });

    setIsContentLoading(false);
  };

  const closeChapter = () => {
    setActiveChapterIndex(null);
    setChapterContent(null);
    updateSession({ lastActiveIndex: null });
  };

  const completeChapter = () => {
    if (activeChapterIndex !== null && !completedChapters.includes(activeChapterIndex)) {
      const newCompleted = [...completedChapters, activeChapterIndex];
      setCompletedChapters(newCompleted);
      updateSession({ completedChapters: newCompleted });
    }
    closeChapter();
  };

  // Content Parser (Same as LessonModal)
  const renderContent = (text: string) => {
    if (!text) return null;
    const sections = text.split(/(?=^# |^### )/gm);
    const find = (k: string) => sections.find(s => s.toLowerCase().includes(k.toLowerCase()))?.replace(/^#+ .*$/m, '').trim();

    const title = text.match(/^#\s*(.+)$/m)?.[1];
    let intro = sections[0].replace(/^# .*$/m, '').trim();
    if (intro.includes('###')) intro = intro.split('###')[0].trim();

    const tale = find('The Tale') || find('Story') || find('History');
    const wisdom = find('The Wisdom') || find('Analysis') || find('Insight');
    const practice = find('Your Practice') || find('Reflection');

    if (!tale && !wisdom && !practice) return <div className="font-serif text-lg leading-relaxed whitespace-pre-wrap">{text}</div>;

    return (
      <div className="space-y-10 pb-28 animate-in fade-in duration-700">
        <div className="text-center mb-10 px-4">
          {title && <h2 className="font-serif text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-saffron-600 to-amber-700 dark:from-saffron-400 dark:to-amber-200 mb-6">{title}</h2>}
          {intro && <div className="text-xl text-stone-600 dark:text-stone-300 font-serif italic opacity-90 leading-loose max-w-2xl mx-auto">{intro}</div>}
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-stone-300 dark:via-stone-600 to-transparent mx-auto mt-8 rounded-full"></div>
        </div>
        {tale && <ContentBlock type="tale" title="The Text" content={tale} icon={<Feather size={16} className="text-saffron-500" />} activeLanguage={activeLanguage} setActiveLanguage={setActiveLanguage} />}
        {wisdom && <ContentBlock type="wisdom" title="The Insight" content={wisdom} icon={<Lightbulb size={16} />} activeLanguage={activeLanguage} setActiveLanguage={setActiveLanguage} />}
        {practice && <ContentBlock type="practice" title="Contemplation" content={practice} icon={<Zap size={16} fill="currentColor" />} activeLanguage={activeLanguage} setActiveLanguage={setActiveLanguage} />}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[70] bg-stone-50 dark:bg-slate-950 animate-in slide-in-from-bottom-5 duration-300 flex flex-col">
       {/* Header */}
       <div className="h-16 flex items-center justify-between px-6 border-b border-stone-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md z-10 shrink-0">
          <button onClick={onClose} className="p-2 -ml-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors flex items-center text-stone-500 dark:text-slate-400">
            <ArrowLeft size={24} className="mr-1" />
            <span className="text-xs font-bold uppercase tracking-widest hidden sm:inline">Back</span>
          </button>
          <div className="flex items-center space-x-3 text-stone-500 dark:text-slate-400">
            <Book size={16} />
            <span className="text-xs font-bold uppercase tracking-widest truncate max-w-[150px]">{book.title}</span>
          </div>
       </div>

       <div className="flex-1 overflow-y-auto bg-stone-50 dark:bg-slate-950 relative">
         <div className="max-w-3xl mx-auto p-6 sm:p-10 pb-32">
           
           {/* Book Intro */}
           <div className="mb-12 text-center sm:text-left">
             <div className="inline-block px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4">
               {book.category}
             </div>
             <h1 className="font-serif text-4xl sm:text-6xl font-bold mb-6 text-stone-900 dark:text-slate-100 leading-[1.1]">{book.title}</h1>
             {/* Use Rich Description if available, otherwise fallback */}
             {isDescriptionLoading ? (
               <div className="flex items-center justify-center sm:justify-start space-x-2 text-stone-400 animate-pulse py-4">
                 <Loader2 size={16} className="animate-spin" />
                 <span className="text-sm font-bold uppercase tracking-widest">Expanding Knowledge...</span>
               </div>
             ) : (
                <div className="font-serif text-xl sm:text-2xl text-stone-600 dark:text-slate-400 leading-relaxed max-w-2xl whitespace-pre-wrap">
                  {richDescription || book.description}
                </div>
             )}
             {book.author && <p className="mt-6 text-xs font-bold uppercase tracking-widest text-stone-400">Authored By: {book.author}</p>}
           </div>

           {/* Chapter List (Study Plan) */}
           {isLoadingChapters ? (
             <div className="flex flex-col items-center justify-center py-20 space-y-6">
               <Loader2 size={48} className="animate-spin text-saffron-500" />
               <p className="text-lg font-serif italic text-stone-500">Shruti is analyzing the texts...</p>
             </div>
           ) : (
             <div className="mb-8">
               <div className="flex items-center space-x-3 mb-8">
                  <div className="h-px flex-1 bg-stone-200 dark:bg-slate-800"></div>
                  <span className="text-xs font-bold uppercase tracking-widest text-stone-400">Study Plan</span>
                  <div className="h-px flex-1 bg-stone-200 dark:bg-slate-800"></div>
               </div>
               <div className="relative pt-2 pb-6 pl-4 sm:pl-0">
                  {chapters.map((chapter, idx) => {
                    const isDone = completedChapters.includes(idx);
                    return (
                      <div key={idx} onClick={() => handleChapterClick(idx)} className="relative pl-14 sm:pl-16 group cursor-pointer mb-6 last:mb-0">
                         {idx < chapters.length - 1 && <div className={`absolute left-[27px] sm:left-[29px] top-12 bottom-[-40px] w-0.5 transition-colors duration-500 ${completedChapters.includes(idx) && completedChapters.includes(idx + 1) ? 'bg-emerald-500' : 'bg-stone-200 dark:bg-slate-800'}`}></div>}
                         <div className={`absolute left-0 top-1 w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold border-2 transition-all duration-300 z-10 shadow-sm ${isDone ? 'bg-emerald-500 border-emerald-500 text-white scale-100 shadow-emerald-500/30' : 'bg-white dark:bg-slate-900 border-stone-200 dark:border-slate-700 text-stone-400 group-hover:border-saffron-400 group-hover:text-saffron-500'}`}>
                           {isDone ? <CheckCircle2 size={24} /> : idx + 1}
                         </div>
                         <div className={`p-6 rounded-2xl border-2 transition-all duration-300 relative overflow-hidden ${isDone ? 'bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-900/30 opacity-70' : 'bg-white dark:bg-slate-900 border-stone-100 dark:border-slate-800 hover:border-saffron-300 dark:hover:border-saffron-500/50 hover:shadow-lg hover:-translate-y-1'}`}>
                            <div className="flex justify-between items-center">
                              <span className={`font-serif text-xl font-bold transition-colors ${isDone ? 'text-emerald-800 dark:text-emerald-100 line-through decoration-emerald-500/30' : 'text-stone-900 dark:text-slate-100'}`}>{chapter}</span>
                              {!isDone && <ArrowRight size={20} className="text-stone-300 group-hover:text-saffron-500 transition-colors transform group-hover:translate-x-1" />}
                            </div>
                         </div>
                      </div>
                    );
                  })}
               </div>
             </div>
           )}
         </div>
       </div>

       {/* Chapter Reader Overlay */}
       {activeChapterIndex !== null && (
         <div className="fixed inset-0 z-[100] bg-stone-50 dark:bg-slate-900 flex flex-col animate-in fade-in slide-in-from-bottom-10 duration-500">
            <div className="px-6 py-6 flex justify-between items-start shrink-0 bg-stone-50/90 dark:bg-slate-900/90 backdrop-blur-sm z-20">
               <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-0.5 shadow-xl shrink-0">
                     <div className="w-full h-full rounded-full bg-white dark:bg-slate-800 flex items-center justify-center overflow-hidden">
                        <span className="font-serif text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-indigo-600 to-purple-600">S</span>
                     </div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1">Part {activeChapterIndex + 1}</div>
                    <h3 className="font-serif text-lg sm:text-2xl font-bold text-stone-900 dark:text-slate-100 leading-none">{chapters[activeChapterIndex]}</h3>
                  </div>
               </div>
               <button onClick={closeChapter} className="p-3 bg-stone-200 dark:bg-slate-800 rounded-full hover:bg-stone-300 dark:hover:bg-slate-700 transition-colors">
                  <X size={24} className="text-stone-600 dark:text-slate-300" />
               </button>
            </div>

            <div ref={contentRef} className="flex-1 overflow-y-auto px-6 sm:px-10 pb-32 max-w-4xl mx-auto w-full relative">
               <div className="max-w-none pt-8">
                  {isContentLoading ? (
                    <div className="flex flex-col items-center justify-center py-40 space-y-8">
                      <div className="relative">
                        <div className="absolute inset-0 bg-saffron-500 blur-2xl opacity-20 animate-pulse"></div>
                        <Loader2 size={64} className="animate-spin text-saffron-500 relative z-10" />
                      </div>
                      <p className="text-lg font-serif italic text-stone-500 animate-pulse">Reading the pages...</p>
                    </div>
                  ) : (
                    renderContent(chapterContent || '')
                  )}
               </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-white via-white to-transparent dark:from-slate-900 dark:via-slate-900 pt-20 z-20">
               <button onClick={completeChapter} disabled={isContentLoading} className="w-full max-w-lg mx-auto py-5 bg-stone-900 dark:bg-white text-white dark:text-stone-900 rounded-2xl font-bold text-lg shadow-2xl shadow-stone-900/20 hover:scale-[1.02] transition-transform flex items-center justify-center">
                  <CheckCircle2 size={24} className="mr-3" />
                  Complete Part
               </button>
            </div>
         </div>
       )}
    </div>
  );
};

export default BookReaderModal;
