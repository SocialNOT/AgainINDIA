
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import Footer from './components/Footer';
import LearnView from './views/LearnView';
import PracticeView from './views/PracticeView';
import LibraryView from './views/LibraryView';
import SageTalkView from './views/SageTalkView';
import ReflectView from './views/ReflectView';
import LessonModal from './components/LessonModal';
import BookReaderModal from './components/BookReaderModal';
import { ModuleType, Lesson, UserProgress, ChatMessage, LibraryBook, ThemeId } from './types';
import { LESSONS, INITIAL_USER_PROGRESS, VEDIC_THEMES, SAGES } from './constants';
import { Book, Clock, PlayCircle, Check, ToggleLeft, ToggleRight, X, Phone, Mail, Globe, Sparkles, MessageCircle } from 'lucide-react';
import { LIBRARY_BOOKS } from './libraryData';

const App: React.FC = () => {
  // Initialize state
  const [theme, setTheme] = useState<'day' | 'night'>(() => {
    return (localStorage.getItem('theme') as 'day' | 'night') || 'day';
  });

  const [activeModule, setActiveModule] = useState<ModuleType>(ModuleType.LEARN);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [readingBook, setReadingBook] = useState<LibraryBook | null>(null);
  const [showCredits, setShowCredits] = useState(false);
  const [requestedSageId, setRequestedSageId] = useState<string | null>(null);

  const [progress, setProgress] = useState<UserProgress>(() => {
    try {
      const saved = localStorage.getItem('userProgress');
      const parsed = saved ? JSON.parse(saved) : INITIAL_USER_PROGRESS;
      return {
        ...INITIAL_USER_PROGRESS,
        ...parsed,
        settings: {
           ...INITIAL_USER_PROGRESS.settings,
           ...parsed.settings,
           // Ensure new settings exist
           activeThemeId: parsed.settings?.activeThemeId || 'guru',
           autoThemeMode: parsed.settings?.autoThemeMode ?? true
        }
      };
    } catch (e) {
      console.error("Failed to load progress", e);
      return INITIAL_USER_PROGRESS;
    }
  });

  const [chatHistory, setChatHistory] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem('chatHistory');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [showSettings, setShowSettings] = useState(false);
  const [activeSettingsTab, setActiveSettingsTab] = useState<'general' | 'history'>('general');

  // --- CONSTANTS ---
  const ASSOCIATION_LINKS = [
    { name: "ILOVESUNDARBAN.COM", url: "https://ilovesundarban.com" },
    { name: "JAGORONBARTA.COM", url: "https://jagoronbarta.com" },
    { name: "SOCIALNOT.COM", url: "https://socialnot.com" },
    { name: "NUMEROLOGYX.IN", url: "https://numerologyx.in" },
    { name: "NOTAFINANCIALBOT.COM", url: "https://notafinancialbot.com" },
  ];

  // --- VEDIC THEME ENGINE (IMPROVED) ---

  const activeThemeConfig = VEDIC_THEMES.find(t => t.id === progress.settings.activeThemeId) || VEDIC_THEMES[4]; // Default Guru

  // Apply CSS Variables to Root (Refactored for Hex -> RGB conversion)
  const applyThemeToRoot = (themeId: ThemeId) => {
    const config = VEDIC_THEMES.find(t => t.id === themeId);
    if (!config) return;

    const root = document.documentElement;
    
    // Helper: Convert Hex (#ffffff) to RGB (255 255 255)
    // This enables tailwind's opacity syntax like bg-primary-500/50
    const hexToRgb = (hex: string) => {
      // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
      const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
      hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);

      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result 
        ? `${parseInt(result[1], 16)} ${parseInt(result[2], 16)} ${parseInt(result[3], 16)}` 
        : null;
    };

    const setPalette = (name: string, colors: Record<string, string>) => {
      Object.entries(colors).forEach(([shade, hex]) => {
        const rgb = hexToRgb(hex);
        if (rgb) {
          root.style.setProperty(`--color-${name}-${shade}`, rgb);
        }
      });
    };

    // Apply palettes
    setPalette('primary', config.colors.primary);
    setPalette('base', config.colors.base);
    setPalette('dark', config.colors.dark);
  };

  // Auto-Scheduling Effect
  useEffect(() => {
    const checkSchedule = () => {
      if (!progress.settings.autoThemeMode) return;

      const now = new Date();
      
      // 1. Day of Week Theme (0 = Sunday = Surya, etc)
      // VEDIC_THEMES is ordered Sunday(0) to Saturday(6)
      const dayIndex = now.getDay(); 
      const scheduledTheme = VEDIC_THEMES[dayIndex].id;

      if (scheduledTheme !== progress.settings.activeThemeId) {
        // Update Theme without triggering loop (only if different)
         setProgress(prev => ({
           ...prev,
           settings: { ...prev.settings, activeThemeId: scheduledTheme }
         }));
      }

      // 2. Day/Night Cycle (6am to 6pm)
      const hour = now.getHours();
      const isDay = hour >= 6 && hour < 18;
      const scheduledMode = isDay ? 'day' : 'night';

      if (scheduledMode !== theme) {
        setTheme(scheduledMode);
      }
    };

    checkSchedule(); // Run on mount
    const interval = setInterval(checkSchedule, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [progress.settings.autoThemeMode, progress.settings.activeThemeId, theme]);

  // Apply Theme whenever ID changes
  useEffect(() => {
    applyThemeToRoot(progress.settings.activeThemeId);
  }, [progress.settings.activeThemeId]);

  // Apply Dark Mode
  useEffect(() => {
    localStorage.setItem('theme', theme);
    const html = document.documentElement;
    if (theme === 'night') {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }, [theme]);

  // Persistence
  useEffect(() => {
    localStorage.setItem('userProgress', JSON.stringify(progress));
  }, [progress]);

  useEffect(() => {
    localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
  }, [chatHistory]);


  const toggleTheme = () => {
     setTheme(prev => prev === 'day' ? 'night' : 'day');
  };

  const togglePalette = () => {
     // Cycle through themes manually
     const currentIndex = VEDIC_THEMES.findIndex(t => t.id === progress.settings.activeThemeId);
     const nextIndex = (currentIndex + 1) % VEDIC_THEMES.length;
     const nextTheme = VEDIC_THEMES[nextIndex].id;
     
     setProgress(prev => ({
       ...prev,
       settings: { 
         ...prev.settings, 
         activeThemeId: nextTheme,
         autoThemeMode: false // Disable auto mode if user manually switches palette
       }
     }));
  };

  const handleLessonSelect = (lesson: Lesson) => {
    setActiveLesson(lesson);
    setProgress(prev => ({ ...prev, last_active_lesson: lesson.id }));
  };

  const resetToPath = () => {
    setActiveLesson(null);
    setReadingBook(null);
    setActiveModule(ModuleType.LEARN);
  };

  const handleLessonComplete = (lessonId: number, score: number) => {
    setProgress(prev => ({
      ...prev,
      completedLessons: Array.from(new Set([...prev.completedLessons, lessonId])), 
      quizScores: { ...prev.quizScores, [lessonId]: score }
    }));
  };

  const updateProgress = (newProgress: Partial<UserProgress>) => {
    setProgress(prev => ({ ...prev, ...newProgress }));
  };

  // Helper to find book details for history
  const getBookById = (id: string): LibraryBook | undefined => {
    const staticBook = LIBRARY_BOOKS.find(b => b.id === id);
    if (staticBook) return staticBook;
    try {
      const fanBaseBooks = JSON.parse(localStorage.getItem('fanBaseBooks') || '[]');
      return fanBaseBooks.find((b: LibraryBook) => b.id === id);
    } catch (e) {
      return undefined;
    }
  };

  // Logic to get active Chat Sages
  const getActiveChatSages = () => {
    // Get unique sageIDs from history
    const sageIds = Array.from(new Set(chatHistory.map(m => m.sageId))).filter(Boolean);
    return sageIds.map(id => ({
      sage: SAGES.find(s => s.id === id),
      lastMessage: chatHistory.filter(m => m.sageId === id).sort((a,b) => b.timestamp - a.timestamp)[0]
    })).filter(item => item.sage); // Filter out if sage not found
  };

  return (
    <div className="h-[100dvh] w-full flex flex-col relative overflow-hidden font-sans bg-stone-50 dark:bg-slate-950 transition-colors duration-500">
      <Header 
        theme={theme} 
        currentThemeConfig={activeThemeConfig}
        toggleTheme={toggleTheme} 
        togglePalette={togglePalette}
        openSettings={() => { setShowSettings(true); setActiveSettingsTab('general'); }}
        resetView={resetToPath}
      />

      <main className="flex-1 relative w-full h-full pb-6"> {/* pb-6 to account for footer */}
        {/* Module Views - Same Architecture */}
        <div className={`absolute inset-0 w-full h-full transition-all duration-500 ease-in-out ${activeModule === ModuleType.LEARN ? 'opacity-100 z-10 transform-none' : 'opacity-0 translate-y-8 z-0 pointer-events-none'}`}>
          <LearnView 
            progress={progress} 
            activeLesson={activeLesson} 
            onSelectLesson={handleLessonSelect} 
            onCloseLesson={() => setActiveLesson(null)}
            onCompleteLesson={handleLessonComplete}
          />
        </div>
        
        <div className={`absolute inset-0 w-full h-full transition-all duration-500 ease-in-out ${activeModule === ModuleType.PRACTICE ? 'opacity-100 z-10 transform-none' : 'opacity-0 scale-95 z-0 pointer-events-none'}`}>
          <PracticeView />
        </div>

        <div className={`absolute inset-0 w-full h-full transition-all duration-500 ease-in-out ${activeModule === ModuleType.LIBRARY ? 'opacity-100 z-10 transform-none' : 'opacity-0 -translate-x-8 z-0 pointer-events-none'}`}>
          <LibraryView onOpenBook={setReadingBook} progress={progress} />
        </div>

        <div className={`absolute inset-0 w-full h-full transition-all duration-500 ease-in-out ${activeModule === ModuleType.SAGETALK ? 'opacity-100 z-10 transform-none' : 'opacity-0 translate-y-8 z-0 pointer-events-none'}`}>
          <SageTalkView 
            chatHistory={chatHistory} 
            setChatHistory={setChatHistory}
            progress={progress}
            currentLessonId={activeLesson?.id || progress.last_active_lesson}
            initialSageId={requestedSageId}
            onSageChanged={setRequestedSageId} // Allow view to clear request
          />
        </div>

        <div className={`absolute inset-0 w-full h-full transition-all duration-500 ease-in-out ${activeModule === ModuleType.REFLECT ? 'opacity-100 z-10 transform-none' : 'opacity-0 translate-y-8 z-0 pointer-events-none'}`}>
          <ReflectView progress={progress} />
        </div>
      </main>

      <BottomNav 
        currentModule={activeModule} 
        setModule={(mod) => {
          setActiveModule(mod);
          // Clear resume request if user navigates away manually
          if (mod !== ModuleType.SAGETALK) setRequestedSageId(null);
        }} 
        theme={theme} 
      />

      <Footer onClick={() => setShowCredits(true)} />

      {/* Modals */}
      {activeLesson && (
        <LessonModal 
          lesson={activeLesson}
          progress={progress}
          onClose={() => setActiveLesson(null)}
          onComplete={handleLessonComplete}
          onUpdateProgress={updateProgress}
        />
      )}

      {readingBook && (
        <BookReaderModal 
          book={readingBook} 
          onClose={() => setReadingBook(null)}
          progress={progress}
          onUpdateProgress={updateProgress}
        />
      )}

      {/* Credits Modal */}
      {showCredits && (
        <div className="fixed inset-0 z-[120] bg-stone-900/80 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-200">
           <div className="glass-panel w-full max-w-sm rounded-3xl p-8 shadow-2xl animate-in zoom-in-95 duration-200 bg-white dark:bg-slate-900 text-center relative border border-white/20">
              <button 
                onClick={() => setShowCredits(false)}
                className="absolute top-4 right-4 text-stone-400 hover:text-stone-600 dark:text-slate-500 dark:hover:text-slate-300 bg-stone-100 dark:bg-slate-800 rounded-full p-1 transition-colors"
              >
                <X size={20} />
              </button>
              
              <div className="mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-saffron-400 to-red-600 rounded-full mx-auto flex items-center justify-center shadow-lg mb-4 ring-4 ring-white dark:ring-slate-800">
                   <span className="font-serif text-3xl font-bold text-white">RS</span>
                </div>
                <h2 className="font-serif text-2xl font-bold text-stone-900 dark:text-white">Rajib Singh</h2>
                <div className="flex items-center justify-center space-x-2 mt-2">
                   <Sparkles size={14} className="text-saffron-500" />
                   <p className="text-xs font-bold uppercase tracking-widest text-saffron-600 dark:text-saffron-400">AI Engineer</p>
                </div>
              </div>

              <div className="space-y-3 text-sm text-stone-600 dark:text-slate-300 font-medium bg-stone-50 dark:bg-slate-800/50 rounded-xl p-4">
                 <div className="flex items-center justify-center space-x-2">
                    <Phone size={14} className="text-stone-400" /> <span>+91 7998300083</span>
                 </div>
                 <div className="flex items-center justify-center space-x-2">
                    <Mail size={14} className="text-stone-400" /> <span className="uppercase text-xs">admin@againindia.com</span>
                 </div>
              </div>

              <div className="my-6 flex items-center space-x-2 text-stone-300">
                 <div className="h-px flex-1 bg-current"></div>
                 <Globe size={12} />
                 <div className="h-px flex-1 bg-current"></div>
              </div>

              <div className="space-y-3">
                 <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400">In Association With</p>
                 <ul className="space-y-2 text-xs text-stone-600 dark:text-slate-400 font-bold tracking-wide">
                    {ASSOCIATION_LINKS.map((link) => (
                      <li key={link.url}>
                        <a href={link.url} target="_blank" rel="noopener noreferrer" className="hover:text-saffron-500 transition-colors">
                          {link.name}
                        </a>
                      </li>
                    ))}
                 </ul>
              </div>

              <div className="mt-8 pt-4 border-t border-stone-100 dark:border-slate-800">
                 <p className="text-[10px] text-stone-400 uppercase tracking-widest">All Founded by Rajib Singh</p>
              </div>
           </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="glass-panel w-full max-w-md rounded-2xl p-6 shadow-2xl animate-in zoom-in-95 duration-200 bg-white dark:bg-slate-900 max-h-[85vh] flex flex-col border border-stone-200 dark:border-slate-700">
            
            <div className="flex space-x-2 mb-6 border-b border-stone-200 dark:border-slate-700 pb-2">
              <button onClick={() => setActiveSettingsTab('general')} className={`flex-1 pb-2 text-sm font-bold uppercase tracking-widest transition-colors ${activeSettingsTab === 'general' ? 'text-saffron-600 border-b-2 border-saffron-600' : 'text-stone-400 hover:text-stone-600'}`}>Settings</button>
              <button onClick={() => setActiveSettingsTab('history')} className={`flex-1 pb-2 text-sm font-bold uppercase tracking-widest transition-colors ${activeSettingsTab === 'history' ? 'text-saffron-600 border-b-2 border-saffron-600' : 'text-stone-400 hover:text-stone-600'}`}>History</button>
            </div>

            {/* General Settings */}
            {activeSettingsTab === 'general' && (
              <div className="space-y-4 flex-1 overflow-y-auto">
                 {/* Auto-Theme Toggle */}
                 <div className="flex justify-between items-center bg-stone-50 dark:bg-slate-800 p-3 rounded-xl border border-stone-100 dark:border-slate-700">
                   <div>
                     <span className="block font-bold text-stone-700 dark:text-slate-200 text-sm">Vedic Auto-Rhythm</span>
                     <span className="text-[10px] text-stone-500 uppercase tracking-widest">Sync theme with Planet & Sun</span>
                   </div>
                   <button 
                     onClick={() => setProgress(prev => ({ ...prev, settings: { ...prev.settings, autoThemeMode: !prev.settings.autoThemeMode } }))}
                     className={`text-2xl transition-colors ${progress.settings.autoThemeMode ? 'text-saffron-500' : 'text-stone-300'}`}
                   >
                     {progress.settings.autoThemeMode ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
                   </button>
                 </div>

                 <div className="flex justify-between items-center text-stone-700 dark:text-slate-300 p-2">
                   <span>Audio Effects</span>
                   <div className="w-10 h-5 bg-saffron-500 rounded-full relative cursor-pointer shadow-inner"><div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full shadow-sm"></div></div>
                 </div>
                 
                 <div className="pt-4">
                   <button 
                     onClick={() => {
                       if(window.confirm("Reset all progress? This cannot be undone.")) {
                         localStorage.clear();
                         window.location.reload();
                       }
                     }}
                     className="text-xs text-red-500 hover:text-red-700 underline"
                   >
                     Reset All Progress
                   </button>
                 </div>

                 {/* Credits in Settings */}
                 <div className="pt-6 border-t border-stone-100 dark:border-slate-800 mt-4">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-3">About & Credits</h4>
                    <div className="bg-stone-50 dark:bg-slate-800 rounded-xl p-4 mb-4 border border-stone-100 dark:border-slate-700">
                       <p className="text-xs font-bold text-stone-700 dark:text-slate-200 mb-1">Coded by Rajib Singh</p>
                       <div className="flex items-center space-x-2 text-stone-500 dark:text-slate-400 text-[10px]">
                          <Mail size={10} /> <span>admin@againindia.com</span>
                       </div>
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2">In Association With</p>
                    <ul className="space-y-2 text-xs text-stone-600 dark:text-slate-400 font-bold tracking-wide">
                        {ASSOCIATION_LINKS.map((link) => (
                          <li key={link.url}>
                            <a href={link.url} target="_blank" rel="noopener noreferrer" className="hover:text-saffron-500 transition-colors">
                              {link.name}
                            </a>
                          </li>
                        ))}
                    </ul>
                 </div>

                 <hr className="border-stone-200 dark:border-white/10" />
                 <div className="text-center text-xs text-stone-400 font-mono pb-2">
                   AgainINDIA v2.3.0 (Vedic Themes)
                 </div>
              </div>
            )}

            {/* History Tab - ENHANCED with Resume Logic */}
            {activeSettingsTab === 'history' && (
              <div className="space-y-6 flex-1 overflow-y-auto pr-2">
                
                {/* 1. Recent Conversations (NEW) */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-3 flex items-center"><MessageCircle size={14} className="mr-2" /> Recent Conversations</h3>
                  <div className="space-y-2">
                    {getActiveChatSages().length === 0 && <p className="text-xs text-stone-400 italic pl-6">No conversations yet.</p>}
                    {getActiveChatSages().map(({ sage, lastMessage }) => (
                      <div key={sage?.id} className="flex items-center justify-between p-3 bg-stone-50 dark:bg-slate-800 rounded-xl border border-stone-100 dark:border-slate-700">
                        <div className="flex items-center space-x-3 overflow-hidden">
                           <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${sage?.image_gradient_from} ${sage?.image_gradient_to} flex items-center justify-center shrink-0`}>
                              <span className="font-serif font-bold text-white text-xs">{sage?.name[0]}</span>
                           </div>
                           <div className="min-w-0">
                              <div className="font-serif font-bold text-stone-800 dark:text-slate-200 text-sm">{sage?.name}</div>
                              <div className="text-[10px] text-stone-500 truncate mt-0.5">{lastMessage?.text || "..."}</div>
                           </div>
                        </div>
                        <button 
                          onClick={() => { 
                            if(sage) {
                              setActiveModule(ModuleType.SAGETALK); 
                              setRequestedSageId(sage.id);
                              setShowSettings(false); 
                            }
                          }} 
                          className="p-2 bg-white dark:bg-slate-700 rounded-full text-saffron-600 hover:scale-110 transition-transform shadow-sm shrink-0"
                        >
                          <PlayCircle size={20} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. Recent Books */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-3 flex items-center"><Book size={14} className="mr-2" /> Recent Books</h3>
                  <div className="space-y-2">
                    {Object.values(progress.bookSessions || {}).length === 0 && <p className="text-xs text-stone-400 italic pl-6">No books started.</p>}
                    {Object.values(progress.bookSessions || {}).sort((a, b) => b.lastAccessed - a.lastAccessed).map(session => {
                        const book = getBookById(session.bookId);
                        if (!book) return null;
                        const progressPercent = Math.round((session.completedChapters.length / Math.max(session.chapters.length, 1)) * 100);
                        return (
                          <div key={session.bookId} className="flex items-center justify-between p-3 bg-stone-50 dark:bg-slate-800 rounded-xl border border-stone-100 dark:border-slate-700">
                            <div>
                              <div className="font-serif font-bold text-stone-800 dark:text-slate-200 text-sm">{book.title}</div>
                              <div className="text-[10px] text-stone-500 uppercase tracking-widest mt-1">{progressPercent}% Completed • {session.completedChapters.length} Chaps</div>
                            </div>
                            <button onClick={() => { setReadingBook(book); setShowSettings(false); }} className="p-2 bg-white dark:bg-slate-700 rounded-full text-saffron-600 hover:scale-110 transition-transform shadow-sm"><PlayCircle size={20} /></button>
                          </div>
                        );
                      })}
                  </div>
                </div>

                {/* 3. Recent Lessons */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-3 flex items-center"><Clock size={14} className="mr-2" /> Recent Lessons</h3>
                  <div className="space-y-2">
                    {Object.values(progress.lessonSessions || {}).length === 0 && <p className="text-xs text-stone-400 italic pl-6">No lessons started.</p>}
                    {Object.values(progress.lessonSessions || {}).sort((a, b) => b.lastAccessed - a.lastAccessed).map(session => {
                        const lesson = LESSONS.find(l => l.id === session.lessonId);
                        if (!lesson) return null;
                        return (
                          <div key={session.lessonId} className="flex items-center justify-between p-3 bg-stone-50 dark:bg-slate-800 rounded-xl border border-stone-100 dark:border-slate-700">
                            <div>
                              <div className="font-serif font-bold text-stone-800 dark:text-slate-200 text-sm">{lesson.title}</div>
                              <div className="text-[10px] text-stone-500 uppercase tracking-widest mt-1">{session.completedSteps.length} Steps Completed</div>
                            </div>
                            <button onClick={() => { setActiveLesson(lesson); setShowSettings(false); }} className="p-2 bg-white dark:bg-slate-700 rounded-full text-saffron-600 hover:scale-110 transition-transform shadow-sm"><PlayCircle size={20} /></button>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            )}

            <button onClick={() => setShowSettings(false)} className="mt-6 w-full py-3 rounded-xl bg-stone-900 dark:bg-white text-stone-100 dark:text-slate-900 font-bold hover:opacity-90 transition-opacity shadow-lg">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
