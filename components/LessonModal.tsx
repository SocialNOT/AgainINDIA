
import React, { useState, useEffect, useRef } from 'react';
import { MOKSHA_STAGES, LESSONS, SAGES } from '../constants';
import { Lesson, UserProgress, LessonSession } from '../types';
import { ChevronDown, Star, Sparkles, Check, X, CheckCircle2, PlayCircle, Book, ArrowRight, BrainCircuit, RotateCcw, Feather, Lightbulb, Zap, Loader2, ArrowLeft, Languages, Copy, Share2, MapPin, Globe } from 'lucide-react';
import QuizView from '../views/QuizView';
import { generateFlowStepContent, translateText, detectLanguageFromCoordinates } from '../services/geminiService';

interface LessonModalProps {
  lesson: Lesson;
  progress: UserProgress;
  onClose: () => void;
  onComplete: (lessonId: number, score: number) => void;
  onUpdateProgress: (newProgress: Partial<UserProgress>) => void; // Added for persistence
}

type LessonViewState = 'study' | 'quiz' | 'complete';

const INDIAN_LANGUAGES = [
  "Hindi", "Tamil", "Telugu", "Bengali", "Marathi", 
  "Gujarati", "Kannada", "Malayalam", "Odia", "Punjabi", 
  "Assamese", "Sanskrit", "Urdu", "Maithili", "Konkani", "Nepali"
];

// --- Sub-component for Story Sections with Tools ---
const ContentBlock: React.FC<{
  type: 'tale' | 'wisdom' | 'practice' | 'default';
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

  // Sync display text when active language changes
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
            // Optional: Alert or visual cue could be added here
        }
        setIsTranslating(false);
      }
    };

    updateText();
  }, [activeLanguage, content]);

  // Styling based on type
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

  const handleCopy = () => {
    navigator.clipboard.writeText(displayText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title || 'Lesson Insight',
          text: displayText,
        });
      } catch (err) {
        console.log('Share canceled');
      }
    } else {
      handleCopy();
      alert('Copied to clipboard (Share not supported)');
    }
  };

  return (
    <div className={containerStyle}>
       {type === 'tale' && <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-stone-300 to-transparent dark:from-stone-700 rounded-full"></div>}
       
       <div className={type === 'tale' ? "pl-6 sm:pl-8" : ""}>
          {/* Header */}
          {(icon || title) && (
            <div className={`flex items-center space-x-2 mb-4 ${type === 'tale' ? 'text-stone-900 dark:text-stone-100' : type === 'wisdom' ? 'text-blue-800 dark:text-blue-300' : 'text-emerald-700 dark:text-emerald-400'}`}>
              {icon}
              {title && <h3 className="font-bold uppercase tracking-widest text-xs opacity-70">{title}</h3>}
            </div>
          )}

          {/* Content */}
          <div className={`${textStyle} min-h-[60px]`}>
            {isTranslating ? (
              <div className="flex items-center space-x-3 text-saffron-500 animate-pulse py-4">
                <Loader2 size={18} className="animate-spin" />
                <span className="text-sm font-bold tracking-wide">Translating to {activeLanguage}...</span>
              </div>
            ) : (
               type === 'tale' && activeLanguage === 'English' ? (
                 <p>
                   <span className="first-letter:text-5xl first-letter:font-serif first-letter:font-bold first-letter:mr-3 first-letter:float-left first-letter:text-saffron-600 first-letter:leading-none">
                     {displayText.charAt(0)}
                   </span>
                   {displayText.slice(1)}
                 </p>
               ) : (
                 // Render bolding if present
                 <div dangerouslySetInnerHTML={{ __html: displayText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>') }} />
               )
            )}
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-4 mt-6 pt-4 border-t border-stone-200/50 dark:border-slate-700/50 opacity-90 transition-opacity relative">
            
            {/* Language Selector */}
            <div className="relative">
              <button 
                onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                className={`flex items-center space-x-1.5 text-[10px] font-bold uppercase tracking-widest transition-colors px-2 py-1 rounded-md ${activeLanguage !== 'English' ? 'text-saffron-600 bg-saffron-50 dark:bg-saffron-900/20' : 'text-stone-400 hover:text-saffron-600 dark:text-slate-500 dark:hover:text-saffron-400'}`}
              >
                <Languages size={14} />
                <span>{activeLanguage === 'English' ? 'Translate' : activeLanguage}</span>
                <ChevronDown size={12} className={`transition-transform ${showLanguageMenu ? 'rotate-180' : ''}`} />
              </button>

              {/* Language Dropdown */}
              {showLanguageMenu && (
                <div className="absolute top-full left-0 mt-2 w-48 max-h-60 overflow-y-auto glass-panel bg-white/95 dark:bg-slate-900/95 shadow-xl rounded-xl z-50 border border-stone-200 dark:border-slate-700 animate-in fade-in zoom-in-95 duration-200">
                  <div className="p-1">
                    <button
                      onClick={() => { setActiveLanguage('English'); setShowLanguageMenu(false); }}
                      className={`w-full text-left px-3 py-2 text-xs font-bold rounded-lg flex items-center justify-between ${activeLanguage === 'English' ? 'bg-stone-100 dark:bg-slate-800 text-stone-900 dark:text-white' : 'text-stone-500 dark:text-slate-400 hover:bg-stone-50 dark:hover:bg-slate-800'}`}
                    >
                      <span>English (Original)</span>
                      {activeLanguage === 'English' && <Check size={12} />}
                    </button>
                    <div className="h-px bg-stone-100 dark:bg-slate-800 my-1"></div>
                    {INDIAN_LANGUAGES.map(lang => (
                      <button
                        key={lang}
                        onClick={() => { setActiveLanguage(lang); setShowLanguageMenu(false); }}
                        className={`w-full text-left px-3 py-2 text-xs font-medium rounded-lg flex items-center justify-between ${activeLanguage === lang ? 'bg-saffron-50 dark:bg-saffron-900/20 text-saffron-700 dark:text-saffron-300' : 'text-stone-600 dark:text-slate-300 hover:bg-stone-50 dark:hover:bg-slate-800'}`}
                      >
                        <span>{lang}</span>
                        {activeLanguage === lang && <Check size={12} />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="h-4 w-px bg-stone-200 dark:bg-slate-700"></div>

            <button 
              onClick={handleCopy}
              className="flex items-center space-x-1.5 text-[10px] font-bold uppercase tracking-widest text-stone-400 hover:text-emerald-600 dark:text-slate-500 dark:hover:text-emerald-400 transition-colors"
            >
              {isCopied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
              <span>{isCopied ? 'Copied' : 'Copy'}</span>
            </button>
            
            <button 
              onClick={handleShare}
              className="flex items-center space-x-1.5 text-[10px] font-bold uppercase tracking-widest text-stone-400 hover:text-blue-600 dark:text-slate-500 dark:hover:text-blue-400 transition-colors"
            >
              <Share2 size={14} />
              <span>Share</span>
            </button>
          </div>
       </div>
    </div>
  );
};


const LessonModal: React.FC<LessonModalProps> = ({ lesson, progress, onClose, onComplete, onUpdateProgress }) => {
  const [viewState, setViewState] = useState<LessonViewState>('study');
  const [lastScore, setLastScore] = useState(0);
  
  // Hydrate from session storage or start empty
  const existingSession = progress.lessonSessions?.[lesson.id];
  const [completedFlowSteps, setCompletedFlowSteps] = useState<number[]>(existingSession?.completedSteps || []);
  
  // Translation State (Global for Modal)
  const [activeLanguage, setActiveLanguage] = useState<string>('English');
  const [detectingLocation, setDetectingLocation] = useState(true);

  // AI Flow Interaction State
  const [activeFlowStepIndex, setActiveFlowStepIndex] = useState<number | null>(null);
  
  // Hydrate content from session cache if available for active step
  const [flowContent, setFlowContent] = useState<string | null>(null);
  const [isFlowLoading, setIsFlowLoading] = useState(false);
  
  const modalContentRef = useRef<HTMLDivElement>(null);

  // Helper to update session
  const updateSession = (updates: Partial<LessonSession>) => {
    const currentSession = progress.lessonSessions?.[lesson.id] || {
      lessonId: lesson.id,
      completedSteps: [],
      stepContentCache: {},
      lastAccessed: Date.now()
    };

    onUpdateProgress({
      lessonSessions: {
        ...progress.lessonSessions,
        [lesson.id]: {
          ...currentSession,
          ...updates,
          lastAccessed: Date.now()
        }
      }
    });
  };

  // Smart Location Detection on Mount
  useEffect(() => {
    const detectLocation = async () => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            try {
              const detectedLang = await detectLanguageFromCoordinates(latitude, longitude);
              // Only auto-switch if not English and valid
              if (detectedLang && detectedLang !== 'English' && INDIAN_LANGUAGES.includes(detectedLang)) {
                setActiveLanguage(detectedLang);
              }
            } catch (e) {
              console.log("Language detection failed, using English");
            } finally {
              setDetectingLocation(false);
            }
          },
          (error) => {
            console.log("Geolocation permission denied or error", error);
            setDetectingLocation(false);
          }
        );
      } else {
        setDetectingLocation(false);
      }
    };

    detectLocation();
  }, []);

  // Scroll modal content to top when flow modal opens
  useEffect(() => {
    if (activeFlowStepIndex !== null && modalContentRef.current) {
        modalContentRef.current.scrollTop = 0;
    }
  }, [activeFlowStepIndex, flowContent]);

  const handleQuizResult = (score: number, passed: boolean) => {
    setLastScore(score);
    if (passed) {
      onComplete(lesson.id, score);
    }
    setViewState('complete');
  };

  const handleFlowStepClick = async (idx: number) => {
    if (activeFlowStepIndex === idx) return;

    setActiveFlowStepIndex(idx);
    
    // Check cache first
    const cachedContent = existingSession?.stepContentCache?.[idx];
    if (cachedContent) {
      setFlowContent(cachedContent);
      return;
    }

    setFlowContent(null);
    setIsFlowLoading(true);

    const stepText = lesson.flow[idx];
    
    // Call Shruti (Core Engine) directly without specific Sage ID
    try {
      const content = await generateFlowStepContent(lesson, stepText);
      setFlowContent(content);
      // Cache the result
      updateSession({
        stepContentCache: {
          ...(progress.lessonSessions?.[lesson.id]?.stepContentCache || {}),
          [idx]: content
        }
      });
    } catch (e) {
      setFlowContent("The wisdom is currently silent. Please try again.");
    }
    
    setIsFlowLoading(false);
  };

  const closeFlowModal = () => {
    setActiveFlowStepIndex(null);
    setFlowContent(null);
  };

  const completeActiveStep = () => {
    if (activeFlowStepIndex !== null) {
      if (!completedFlowSteps.includes(activeFlowStepIndex)) {
        const newCompleted = [...completedFlowSteps, activeFlowStepIndex];
        setCompletedFlowSteps(newCompleted);
        updateSession({ completedSteps: newCompleted });
      }
      closeFlowModal();
    }
  };

  const allFlowStepsComplete = completedFlowSteps.length === lesson.flow.length;

  // --- Robust Content Parser ---
  const renderStructuredContent = (content: string) => {
    if (!content) return null;

    // Split by markdown headers if possible, otherwise use newlines
    const rawSections = content.split(/(?=^# |^### )/gm);
    
    // Helper to find content block by fuzzy keyword
    const findSection = (keyword: string) => {
      const section = rawSections.find(s => s.toLowerCase().includes(keyword.toLowerCase()));
      if (!section) return null;
      // Remove header line to get just body
      return section.replace(/^#+ .*$/m, '').trim(); 
    };

    // 1. Title (Usually the first line starting with #)
    const titleMatch = content.match(/^#\s*(.+)$/m);
    const title = titleMatch ? titleMatch[1] : null;

    // 2. Intro (Everything before the first ### section, excluding title)
    let intro = rawSections[0].replace(/^# .*$/m, '').trim();
    if (intro.includes('###')) intro = intro.split('###')[0].trim();

    // 3. Tale
    const tale = findSection('The Tale') || findSection('Story');
    
    // 4. Wisdom
    const wisdom = findSection('The Wisdom') || findSection('Philosophy') || findSection('Insight');
    
    // 5. Practice
    const practice = findSection('Your Practice') || findSection('Action');

    // Fallback: If structured parsing fails completely, just show the raw content
    if (!tale && !wisdom && !practice) {
       return <div className="font-serif text-lg leading-relaxed whitespace-pre-wrap">{content}</div>;
    }

    return (
      <div className="space-y-10 pb-28 animate-in fade-in duration-700">
        
        {/* Intro Section */}
        <div className="text-center mb-10 px-4">
          {title && (
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-saffron-600 to-amber-700 dark:from-saffron-400 dark:to-amber-200 mb-6 leading-tight">
              {title}
            </h2>
          )}
          {intro && (
            <div className="text-xl text-stone-600 dark:text-stone-300 font-serif italic opacity-90 leading-loose max-w-2xl mx-auto">
              {intro}
            </div>
          )}
          
          {/* Geolocation Feedback */}
          {detectingLocation ? (
            <div className="flex items-center justify-center space-x-2 mt-4 text-xs font-bold uppercase tracking-widest text-saffron-500 animate-pulse">
              <MapPin size={12} />
              <span>Detecting Location...</span>
            </div>
          ) : activeLanguage !== 'English' && (
            <div className="flex items-center justify-center space-x-2 mt-4 text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
              <Globe size={12} />
              <span>Adapted to {activeLanguage}</span>
            </div>
          )}
          
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-stone-300 dark:via-stone-600 to-transparent mx-auto mt-8 rounded-full"></div>
        </div>

        {/* The Tale Block */}
        {tale && (
           <ContentBlock 
             type="tale" 
             title="The Tale" 
             content={tale} 
             icon={<Feather size={16} className="text-saffron-500" />} 
             activeLanguage={activeLanguage}
             setActiveLanguage={setActiveLanguage}
           />
        )}

        {/* The Wisdom Block */}
        {wisdom && (
           <ContentBlock 
             type="wisdom" 
             title="The Wisdom" 
             content={wisdom} 
             icon={<Lightbulb size={16} />} 
             activeLanguage={activeLanguage}
             setActiveLanguage={setActiveLanguage}
           />
        )}

        {/* Your Practice Block */}
        {practice && (
           <ContentBlock 
             type="practice" 
             title="Your Practice" 
             content={practice} 
             icon={<Zap size={16} fill="currentColor" />} 
             activeLanguage={activeLanguage}
             setActiveLanguage={setActiveLanguage}
           />
        )}
      </div>
    );
  };

  return (
    // Base Modal Layer
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-stone-50 dark:bg-slate-950 animate-in slide-in-from-bottom-5 duration-300">
        
        {/* Main Content Container */}
        <div className="w-full h-full flex flex-col relative overflow-hidden bg-stone-50 dark:bg-slate-950">
          
          {/* Header */}
          <div className="h-16 flex items-center justify-between px-6 border-b border-stone-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md z-10 shrink-0">
             <button onClick={onClose} className="p-2 -ml-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors flex items-center text-stone-500 dark:text-slate-400">
               <ArrowLeft size={24} className="mr-1" />
               <span className="text-xs font-bold uppercase tracking-widest hidden sm:inline">Back</span>
             </button>

             <div className="flex items-center space-x-3 text-stone-500 dark:text-slate-400">
               <div className="w-8 h-8 rounded-full bg-stone-200 dark:bg-slate-800 flex items-center justify-center font-bold text-xs">
                 {lesson.id}
               </div>
               <span className="text-xs font-bold uppercase tracking-widest truncate max-w-[150px]">
                 {lesson.title}
               </span>
             </div>
          </div>

          <div className="flex-1 overflow-y-auto bg-stone-50 dark:bg-slate-950 relative">
            {viewState !== 'complete' && viewState !== 'quiz' && (
              <div className="max-w-3xl mx-auto p-6 sm:p-10 pb-32">
                
                {/* Hero Title Area */}
                <div className="mb-12 relative text-center sm:text-left">
                  <div className="inline-block px-3 py-1 bg-saffron-100 dark:bg-saffron-900/30 text-saffron-700 dark:text-saffron-300 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4">
                    Core Concept
                  </div>
                  <h1 className="font-serif text-4xl sm:text-6xl font-bold mb-6 text-stone-900 dark:text-slate-100 leading-[1.1]">
                    {lesson.title}
                  </h1>
                  <p className="font-serif text-xl sm:text-2xl italic text-stone-600 dark:text-slate-400 leading-relaxed max-w-2xl">
                    "{lesson.summary.short}"
                  </p>
                </div>

                {/* Wisdom Content */}
                <div className="mb-16">
                   <div className="glass-panel p-8 rounded-2xl border border-stone-100 dark:border-slate-800 shadow-sm relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-6 opacity-5">
                         <Book size={120} />
                      </div>
                      <p className="text-lg sm:text-xl text-stone-800 dark:text-slate-200 leading-9 font-serif relative z-10">
                        {lesson.summary.long}
                      </p>
                   </div>
                </div>

                {/* The Flow Map */}
                <div className="mb-8">
                   <div className="flex items-center space-x-3 mb-8">
                      <div className="h-px flex-1 bg-stone-200 dark:bg-slate-800"></div>
                      <span className="text-xs font-bold uppercase tracking-widest text-stone-400">The Journey</span>
                      <div className="h-px flex-1 bg-stone-200 dark:bg-slate-800"></div>
                   </div>
                   
                   <div className="relative pt-2 pb-6 pl-4 sm:pl-0">
                      {lesson.flow.map((step, idx) => {
                        const isDone = completedFlowSteps.includes(idx);
                        return (
                          <div 
                            key={idx} 
                            onClick={() => handleFlowStepClick(idx)}
                            className="relative pl-14 sm:pl-16 group cursor-pointer mb-8 last:mb-0"
                          >
                             {/* Connector Line */}
                             {idx < lesson.flow.length - 1 && (
                                <div className={`absolute left-[27px] sm:left-[29px] top-12 bottom-[-40px] w-0.5 transition-colors duration-500 ${completedFlowSteps.includes(idx) && completedFlowSteps.includes(idx + 1) ? 'bg-emerald-500' : 'bg-stone-200 dark:bg-slate-800'}`}></div>
                             )}

                             {/* Interactive Bubble */}
                             <div className={`
                               absolute left-0 top-1 w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold border-2 transition-all duration-300 z-10 shadow-sm
                               ${isDone 
                                 ? 'bg-emerald-500 border-emerald-500 text-white scale-100 shadow-emerald-500/30' 
                                 : 'bg-white dark:bg-slate-900 border-stone-200 dark:border-slate-700 text-stone-400 group-hover:border-saffron-400 group-hover:text-saffron-500'}
                             `}>
                               {isDone ? <Check size={24} strokeWidth={3} /> : idx + 1}
                             </div>

                             {/* Card */}
                             <div className={`
                               p-6 rounded-2xl border-2 transition-all duration-300 relative overflow-hidden
                               ${isDone 
                                 ? 'bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-900/30 opacity-70' 
                                 : 'bg-white dark:bg-slate-900 border-stone-100 dark:border-slate-800 hover:border-saffron-300 dark:hover:border-saffron-500/50 hover:shadow-lg hover:-translate-y-1'}
                             `}>
                                <div className="flex justify-between items-center">
                                  <span className={`font-serif text-xl font-bold transition-colors ${isDone ? 'text-emerald-800 dark:text-emerald-100 line-through decoration-emerald-500/30' : 'text-stone-900 dark:text-slate-100'}`}>
                                    {step}
                                  </span>
                                  {!isDone && <ArrowRight size={20} className="text-stone-300 group-hover:text-saffron-500 transition-colors transform group-hover:translate-x-1" />}
                                </div>
                             </div>
                          </div>
                        );
                      })}
                   </div>
                </div>

              </div>
            )}

            {/* Quiz View */}
            {viewState === 'quiz' && (
              <div className="h-full flex flex-col p-6 max-w-2xl mx-auto">
                <QuizView 
                  lesson={lesson} 
                  onComplete={handleQuizResult} 
                  onCancel={() => setViewState('study')} 
                />
              </div>
            )}

            {/* Completion View */}
            {viewState === 'complete' && (
               <div className="h-full flex flex-col items-center justify-center text-center animate-in zoom-in duration-300 p-8">
                 <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-saffron-500/10 to-emerald-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
                 </div>

                 {lastScore >= Math.ceil(lesson.quiz.length * 0.7) ? (
                   <div className="relative z-10 max-w-md w-full">
                     <div className="w-28 h-28 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-full flex items-center justify-center mb-8 shadow-2xl shadow-emerald-500/40 mx-auto animate-float">
                       <CheckCircle2 size={56} className="text-white" />
                     </div>
                     <h2 className="font-serif text-5xl font-bold mb-4 text-stone-900 dark:text-slate-100">Mastery</h2>
                     <p className="text-stone-600 dark:text-slate-400 mb-10 font-serif italic text-lg">The wisdom is now yours.</p>
                     
                     <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-lg border border-stone-100 dark:border-slate-700 mb-10">
                        <div className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-2">Quiz Score</div>
                        <div className="text-5xl font-bold text-stone-900 dark:text-slate-100 font-serif">{lastScore} <span className="text-2xl text-stone-400">/ {lesson.quiz.length}</span></div>
                     </div>

                     <button 
                       onClick={onClose}
                       className="w-full py-5 bg-stone-900 dark:bg-white text-white dark:text-stone-900 rounded-2xl font-bold hover:scale-[1.02] transition-transform flex items-center justify-center shadow-xl text-lg"
                     >
                       Continue Journey <ArrowRight size={20} className="ml-3" />
                     </button>
                   </div>
                 ) : (
                   <div className="relative z-10 max-w-md w-full">
                     <div className="w-24 h-24 bg-stone-200 dark:bg-slate-700 rounded-full flex items-center justify-center mb-6 mx-auto">
                       <RotateCcw size={48} className="text-stone-500 dark:text-slate-400" />
                     </div>
                     <h2 className="font-serif text-4xl font-bold mb-4 text-stone-800 dark:text-slate-100">Review Needed</h2>
                     <p className="text-stone-500 mb-10 text-lg">Knowledge deepens with repetition.</p>
                     <div className="flex flex-col space-y-4">
                        <button 
                          onClick={() => setViewState('study')}
                          className="w-full py-4 bg-white dark:bg-slate-800 border-2 border-stone-200 dark:border-slate-700 rounded-2xl font-bold hover:bg-stone-50 dark:hover:bg-slate-700 text-stone-700 dark:text-slate-300"
                        >
                          Review Wisdom
                        </button>
                        <button 
                          onClick={() => setViewState('quiz')}
                          className="w-full py-4 bg-saffron-600 text-white rounded-2xl font-bold hover:bg-saffron-500 shadow-lg shadow-saffron-500/20"
                        >
                          Retry Quiz
                        </button>
                     </div>
                   </div>
                 )}
               </div>
            )}
          </div>

          {/* AI Flow Step Modal - FULLSCREEN OVERLAY (Z-100) */}
          {activeFlowStepIndex !== null && (
            <div className="fixed inset-0 z-[100] bg-stone-50 dark:bg-slate-900 flex flex-col animate-in fade-in slide-in-from-bottom-10 duration-500">
              
              {/* Overlay Header */}
              <div className="px-6 py-6 flex justify-between items-start shrink-0 bg-stone-50/90 dark:bg-slate-900/90 backdrop-blur-sm z-20">
                 <div className="flex items-center space-x-4">
                  {/* Branding: Shruti (Core Engine) */}
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-0.5 shadow-xl shrink-0">
                     <div className="w-full h-full rounded-full bg-white dark:bg-slate-800 flex items-center justify-center overflow-hidden">
                        <span className="font-serif text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-indigo-600 to-purple-600">S</span>
                     </div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1">Step {activeFlowStepIndex + 1}</div>
                    <h3 className="font-serif text-lg sm:text-2xl font-bold text-stone-900 dark:text-slate-100 leading-none">
                      {lesson.flow[activeFlowStepIndex]}
                    </h3>
                  </div>
                </div>

                <button 
                  onClick={closeFlowModal}
                  className="p-3 bg-stone-200 dark:bg-slate-800 rounded-full hover:bg-stone-300 dark:hover:bg-slate-700 transition-colors"
                >
                  <X size={24} className="text-stone-600 dark:text-slate-300" />
                </button>
              </div>

              {/* Overlay Content Scrollable */}
              <div ref={modalContentRef} className="flex-1 overflow-y-auto px-6 sm:px-10 pb-32 max-w-4xl mx-auto w-full relative">
                <div className="max-w-none pt-8">
                  {isFlowLoading ? (
                    <div className="flex flex-col items-center justify-center py-40 space-y-8">
                      <div className="relative">
                        <div className="absolute inset-0 bg-saffron-500 blur-2xl opacity-20 animate-pulse"></div>
                        <Loader2 size={64} className="animate-spin text-saffron-500 relative z-10" />
                      </div>
                      <p className="text-lg font-serif italic text-stone-500 animate-pulse">
                        Consulting the Akashic Records...
                      </p>
                    </div>
                  ) : (
                    renderStructuredContent(flowContent || '')
                  )}
                </div>
              </div>

              {/* Bottom Action Button - Pinned to bottom of overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-white via-white to-transparent dark:from-slate-900 dark:via-slate-900 pt-20 z-20">
                <button 
                  onClick={completeActiveStep}
                  disabled={isFlowLoading}
                  className="w-full max-w-lg mx-auto py-5 bg-stone-900 dark:bg-white text-white dark:text-stone-900 rounded-2xl font-bold text-lg shadow-2xl shadow-stone-900/20 hover:scale-[1.02] transition-transform flex items-center justify-center"
                >
                  <CheckCircle2 size={24} className="mr-3" />
                  Complete Step
                </button>
              </div>
            </div>
          )}

          {/* Sticky Footer for Study Mode */}
          {viewState === 'study' && activeFlowStepIndex === null && (
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white to-transparent dark:from-slate-900 dark:via-slate-900 pt-16 z-20">
              <button 
                onClick={() => setViewState('quiz')}
                className={`
                   w-full max-w-md mx-auto py-4 text-white rounded-2xl shadow-xl flex items-center justify-center font-bold tracking-wide text-lg transition-all duration-300
                   ${allFlowStepsComplete 
                      ? 'bg-emerald-600 hover:bg-emerald-500 scale-[1.02] shadow-emerald-500/30' 
                      : 'bg-stone-900 dark:bg-white dark:text-stone-900 hover:scale-[1.01] active:scale-95'}
                `}
              >
                {allFlowStepsComplete ? (
                   <>
                     <CheckCircle2 className="mr-3" size={24} />
                     Ready for Mastery
                   </>
                ) : (
                   <>
                     <BrainCircuit className="mr-3" size={24} />
                     Begin Practice
                   </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
  );
};

export default LessonModal;
