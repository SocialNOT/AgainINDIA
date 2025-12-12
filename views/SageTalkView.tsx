
import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { SAGES, LESSONS } from '../constants';
import { Sage, ChatMessage, UserProgress } from '../types';
import { generateSageResponse } from '../services/geminiService';
import { LiveSageService } from '../services/liveSageService';
import { 
  Send, Sparkles, RefreshCw, Mic, MicOff, MessageSquare, Radio, Power, 
  X, Info, Check, ArrowRight, ChevronLeft, User, Brain, Heart, Zap, Shield, Search
} from 'lucide-react';

// --- TYPES ---
interface SageTalkViewProps {
  chatHistory: ChatMessage[];
  setChatHistory: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  progress: UserProgress;
  currentLessonId?: number;
  initialSageId?: string | null;
  onSageChanged?: (sageId: string | null) => void;
}

// --- PORTAL HELPER ---
const Portal = ({ children }: { children: React.ReactNode }) => {
  return typeof document === 'object' ? createPortal(children, document.body) : null;
};

// --- SUB-COMPONENTS ---

// 1. CHAT INTERFACE (The Active Session)
const ChatInterface: React.FC<{
  activeSage: Sage;
  onBack: () => void;
  fullHistory: ChatMessage[];
  setChatHistory: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  progress: UserProgress;
  currentLessonId?: number;
}> = ({ activeSage, onBack, fullHistory, setChatHistory, progress, currentLessonId }) => {
  const [mode, setMode] = useState<'text' | 'live'>('text');
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLiveConnected, setIsLiveConnected] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState<string>('');
  const [audioAmplitude, setAudioAmplitude] = useState(0);

  const scrollRef = useRef<HTMLDivElement>(null);
  const liveServiceRef = useRef<LiveSageService | null>(null);
  const currentLesson = currentLessonId ? LESSONS.find(l => l.id === currentLessonId) : null;

  // Filter history for THIS sage only
  const sageHistory = fullHistory.filter(msg => msg.sageId === activeSage.id);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [sageHistory.length, isLoading, mode]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (liveServiceRef.current) {
        liveServiceRef.current.disconnect();
      }
    };
  }, []);

  const toggleMode = () => {
    if (mode === 'live') {
      if (liveServiceRef.current) {
        liveServiceRef.current.disconnect();
        liveServiceRef.current = null;
        setIsLiveConnected(false);
      }
      setMode('text');
    } else {
      setMode('live');
    }
  };

  const startLiveSession = async () => {
    if (liveServiceRef.current) return;
    liveServiceRef.current = new LiveSageService();
    setIsLiveConnected(true);
    setLiveTranscript("Summoning...");
    
    await liveServiceRef.current.connect({
      sage: activeSage,
      userProgress: progress,
      onAudioData: () => setAudioAmplitude(Math.random() * 100),
      onTranscription: (text, isUser) => setLiveTranscript(isUser ? `You: ${text}` : `${activeSage.name}: ${text}`),
      onDisconnect: () => { setIsLiveConnected(false); liveServiceRef.current = null; }
    });
  };

  const stopLiveSession = () => {
    if (liveServiceRef.current) {
      liveServiceRef.current.disconnect();
      liveServiceRef.current = null;
    }
    setIsLiveConnected(false);
    setLiveTranscript("");
    setAudioAmplitude(0);
  };

  const handleTextSend = async () => {
    if (!input.trim() || isLoading) return;
    
    // Add user message with sageId
    const userMsg: ChatMessage = { 
      id: Date.now().toString(), 
      role: 'user', 
      text: input, 
      timestamp: Date.now(),
      sageId: activeSage.id 
    };
    
    setChatHistory(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    // Prepare history context (only relevant recent messages from this sage)
    const historyForAi = sageHistory.slice(-10).map(m => ({ role: m.role, text: m.text }));
    const context = { currentLesson, progress };
    
    const responseText = await generateSageResponse(activeSage.id, input, historyForAi, context);
    
    // Add model message with sageId
    const modelMsg: ChatMessage = { 
      id: (Date.now() + 1).toString(), 
      role: 'model', 
      text: responseText, 
      sageId: activeSage.id, 
      timestamp: Date.now() 
    };
    
    setChatHistory(prev => [...prev, modelMsg]);
    setIsLoading(false);
  };

  const clearSageHistory = () => {
    if (window.confirm(`Clear history with ${activeSage.name}?`)) {
      setChatHistory(prev => prev.filter(msg => msg.sageId !== activeSage.id));
    }
  };

  return (
    <div className="fixed inset-0 z-[60] bg-stone-50 dark:bg-slate-950 flex flex-col animate-in slide-in-from-right duration-300 text-stone-900 dark:text-slate-100">
      
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-stone-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md z-10 shrink-0 mt-4">
         <button onClick={onBack} className="p-2 -ml-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors flex items-center text-stone-600 dark:text-slate-300">
           <ChevronLeft size={24} className="mr-1" />
           <span className="text-xs font-bold uppercase tracking-widest hidden sm:inline">The Council</span>
         </button>

         <div className="flex items-center space-x-3">
            <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${activeSage.image_gradient_from} ${activeSage.image_gradient_to} flex items-center justify-center`}>
               <span className="font-serif font-bold text-white text-xs">{activeSage.name[0]}</span>
            </div>
            <div className="text-center">
               <div className="text-sm font-serif font-bold text-stone-900 dark:text-white leading-none">{activeSage.name}</div>
               <div className="text-[9px] font-bold uppercase tracking-widest text-stone-500 dark:text-slate-400">{mode === 'live' ? 'Voice Link' : 'Text Link'}</div>
            </div>
         </div>

         {/* Mode Toggle */}
         <button 
           onClick={toggleMode}
           className={`p-2 rounded-full transition-all ${mode === 'live' ? 'bg-red-500 text-white shadow-lg shadow-red-500/30' : 'bg-stone-200 dark:bg-slate-800 text-stone-600 dark:text-slate-300'}`}
         >
           {mode === 'live' ? <Mic size={18} /> : <MessageSquare size={18} />}
         </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-hidden relative">
        {mode === 'live' ? (
          // LIVE MODE UI
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 animate-in fade-in zoom-in-95 duration-500">
             <div className="relative mb-12">
                {isLiveConnected && <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${activeSage.image_gradient_from} ${activeSage.image_gradient_to} blur-3xl opacity-40 animate-pulse`} style={{ transform: `scale(${1 + audioAmplitude / 50})` }}></div>}
                <div className={`relative w-48 h-48 rounded-full p-1 bg-gradient-to-br ${activeSage.image_gradient_from} ${activeSage.image_gradient_to} shadow-2xl transition-transform duration-300 ${isLiveConnected ? 'scale-105' : 'scale-100'}`}>
                   <div className="w-full h-full rounded-full bg-stone-100 dark:bg-slate-900 flex items-center justify-center border-4 border-white dark:border-slate-800 overflow-hidden relative">
                      <span className="font-serif text-8xl font-bold text-stone-800 dark:text-slate-200 opacity-20">{activeSage.name[0]}</span>
                   </div>
                </div>
             </div>
             <p className="font-serif text-xl italic text-stone-800 dark:text-slate-200 text-center min-h-[3rem] max-w-sm">
                {isLiveConnected ? (liveTranscript || "Listening...") : `Summon ${activeSage.name} for a conversation.`}
             </p>
             <div className="mt-12">
                {!isLiveConnected ? (
                  <button onClick={startLiveSession} className="px-8 py-4 bg-stone-900 dark:bg-white text-white dark:text-stone-900 rounded-full font-bold shadow-xl hover:scale-105 transition-transform flex items-center space-x-2">
                    <Mic size={20} /> <span>Begin Voice Session</span>
                  </button>
                ) : (
                  <button onClick={stopLiveSession} className="w-16 h-16 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-xl shadow-red-500/30 transition-transform hover:scale-110">
                    <Power size={24} />
                  </button>
                )}
             </div>
          </div>
        ) : (
          // TEXT MODE UI
          <div className="h-full flex flex-col">
             <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-6 pb-4">
                {sageHistory.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center opacity-40 px-6 text-center">
                    <Sparkles size={48} className="mb-4 text-stone-400 dark:text-slate-600" />
                    <p className="font-serif text-xl italic mb-2 text-stone-700 dark:text-slate-300">
                      "I am listening."
                    </p>
                  </div>
                )}
                {sageHistory.map((msg) => {
                  const isUser = msg.role === 'user';
                  return (
                    <div key={msg.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
                      <div className={`max-w-[85%] p-4 shadow-sm rounded-2xl relative ${isUser ? 'bg-stone-800 dark:bg-white text-stone-100 dark:text-stone-900 rounded-br-none' : 'bg-white dark:bg-slate-800 text-stone-900 dark:text-slate-100 rounded-bl-none border border-stone-200 dark:border-slate-700'}`}>
                        <p className={`text-sm leading-relaxed ${isUser ? 'font-sans' : 'font-serif'}`}>{msg.text}</p>
                      </div>
                    </div>
                  );
                })}
                {isLoading && (
                  <div className="flex justify-start">
                     <div className="bg-white dark:bg-slate-800 rounded-2xl rounded-bl-none p-4 flex space-x-2 items-center shadow-sm border border-stone-200 dark:border-slate-700">
                        <span className="text-[10px] font-bold text-stone-500 dark:text-slate-400 uppercase tracking-widest">{activeSage.name} is thinking</span>
                        <div className="flex space-x-1"><div className="w-1 h-1 bg-stone-400 rounded-full animate-bounce"></div><div className="w-1 h-1 bg-stone-400 rounded-full animate-bounce delay-100"></div><div className="w-1 h-1 bg-stone-400 rounded-full animate-bounce delay-200"></div></div>
                     </div>
                  </div>
                )}
             </div>
             {/* Input */}
             <div className="p-4 pt-2 bg-stone-50 dark:bg-slate-950/90 backdrop-blur-sm">
                <div className="relative max-w-2xl mx-auto flex items-end space-x-2">
                   <button onClick={clearSageHistory} className="p-3 mb-1 rounded-full text-stone-500 hover:bg-stone-200 dark:hover:bg-slate-800 transition-colors" title="Clear this chat"><RefreshCw size={18} /></button>
                   <div className="flex-1 relative">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleTextSend()}
                      placeholder="Ask your question..."
                      className="w-full pl-6 pr-14 py-4 bg-white dark:bg-slate-900 border border-stone-300 dark:border-slate-700 rounded-full focus:outline-none focus:ring-2 focus:ring-stone-500 dark:focus:ring-slate-500 shadow-sm text-sm text-stone-900 dark:text-slate-100 placeholder:text-stone-500 dark:placeholder:text-slate-500"
                    />
                    <button onClick={handleTextSend} disabled={!input.trim() || isLoading} className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-stone-900 dark:bg-white text-white dark:text-stone-900 rounded-full hover:scale-105 transition-transform disabled:opacity-50">
                      <Send size={18} />
                    </button>
                  </div>
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

// 2. MAIN SAGE TALK VIEW
const SageTalkView: React.FC<SageTalkViewProps> = ({ chatHistory, setChatHistory, progress, currentLessonId, initialSageId, onSageChanged }) => {
  const [activeSageId, setActiveSageId] = useState<string | null>(initialSageId || null);
  const [isChatActive, setIsChatActive] = useState(!!initialSageId);
  const [selectedSageInfo, setSelectedSageInfo] = useState<Sage | null>(null);

  // Sync internal state if initialSageId changes prop
  useEffect(() => {
    if (initialSageId) {
      setActiveSageId(initialSageId);
      setIsChatActive(true);
    }
  }, [initialSageId]);

  const activeSage = SAGES.find(s => s.id === activeSageId);

  // --- GRID LAYOUT LOGIC ---
  const getGridSpan = (index: number) => {
    if (index < 2) return "col-span-3"; // Row 1 (2 items)
    if (index >= 2 && index < 5) return "col-span-2"; // Row 2 (3 items)
    return "col-span-3"; // Row 3 (2 items)
  };

  const handleStartChat = () => {
    if (selectedSageInfo) {
      setActiveSageId(selectedSageInfo.id);
      setIsChatActive(true);
      setSelectedSageInfo(null);
      if (onSageChanged) onSageChanged(selectedSageInfo.id);
    }
  };

  const handleCloseChat = () => {
    setIsChatActive(false);
    if (!initialSageId) {
      // Only clear active Sage if we aren't stuck in "resume mode"
      setActiveSageId(null);
      if (onSageChanged) onSageChanged(null);
    } else {
      // If we were resumed, closing probably means go back to main menu
      if (onSageChanged) onSageChanged(null); // Signal parent to clear selection
    }
  };

  return (
    <div className="h-full w-full bg-stone-50 dark:bg-slate-950 pt-20 overflow-y-auto flex flex-col text-stone-900 dark:text-slate-100">
      
      {/* 1. Header Area */}
      <div className="px-6 mb-4 flex-none">
        <div className="inline-block px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 rounded-full text-[10px] font-bold uppercase tracking-widest mb-2">
           Daily Guidance
        </div>
        <h2 className="font-serif text-3xl font-bold text-stone-900 dark:text-white">The Council</h2>
      </div>

      {/* 2. SAGE GRID - COMPACT */}
      <div className="flex-1 px-4 sm:px-6 pb-28 flex items-start justify-center animate-in slide-in-from-bottom-4 duration-500">
        <div className="w-full max-w-4xl grid grid-cols-6 gap-px bg-stone-300 dark:bg-slate-800 border border-stone-300 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          {SAGES.map((sage, index) => (
            <button
              key={sage.id}
              onClick={() => setSelectedSageInfo(sage)}
              className={`group relative h-40 sm:h-52 ${getGridSpan(index)} w-full overflow-hidden bg-white dark:bg-slate-900 text-left transition-all duration-300 hover:bg-stone-50 dark:hover:bg-slate-800 flex flex-col items-center justify-center p-4`}
            >
              {/* Background Glow */}
              <div className={`absolute inset-0 bg-gradient-to-br ${sage.image_gradient_from} ${sage.image_gradient_to} opacity-0 group-hover:opacity-10 transition-opacity duration-700`}></div>
              
              {/* Avatar - Slightly smaller */}
              <div className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-full p-1 bg-gradient-to-br ${sage.image_gradient_from} ${sage.image_gradient_to} shadow-lg mb-3 group-hover:scale-110 transition-transform duration-500`}>
                 <div className="w-full h-full rounded-full bg-white dark:bg-slate-900 flex items-center justify-center border-2 border-white dark:border-slate-800 overflow-hidden">
                    <span className="font-serif text-2xl sm:text-3xl font-bold text-stone-800 dark:text-slate-200">{sage.name[0]}</span>
                 </div>
              </div>

              {/* Info */}
              <div className="text-center relative z-10">
                 <h3 className="font-serif text-base sm:text-lg font-bold text-stone-900 dark:text-white mb-0.5 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                   {sage.name}
                 </h3>
                 <p className="text-[9px] font-bold uppercase tracking-widest text-stone-500 dark:text-slate-400 line-clamp-1">
                   {sage.archetype}
                 </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 3. SAGE DETAIL MODAL (Portal) */}
      {selectedSageInfo && (
        <Portal>
          <div className="fixed inset-0 z-[9999] bg-stone-900/60 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="glass-panel w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl animate-in zoom-in-95 duration-200 bg-white dark:bg-slate-900 border border-white/20 relative flex flex-col max-h-[90vh]">
               
               <button onClick={() => setSelectedSageInfo(null)} className="absolute top-4 right-4 p-2 bg-stone-100 dark:bg-slate-800 rounded-full text-stone-500 dark:text-slate-400 hover:bg-stone-200 dark:hover:bg-slate-700 transition-colors z-20">
                 <X size={20} />
               </button>

               <div className="flex-1 overflow-y-auto pt-2">
                  {/* Header */}
                  <div className="flex flex-col items-center mb-8">
                      <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${selectedSageInfo.image_gradient_from} ${selectedSageInfo.image_gradient_to} p-1 shadow-xl mb-4`}>
                         <div className="w-full h-full rounded-full bg-white dark:bg-slate-900 flex items-center justify-center border-4 border-white dark:border-slate-800">
                            <span className="font-serif text-4xl font-bold text-stone-800 dark:text-slate-200">{selectedSageInfo.name[0]}</span>
                         </div>
                      </div>
                      <h2 className="font-serif text-3xl font-bold text-stone-900 dark:text-white text-center">{selectedSageInfo.name}</h2>
                      <p className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mt-1">{selectedSageInfo.archetype}</p>
                  </div>

                  {/* Traits */}
                  <div className="flex flex-wrap justify-center gap-2 mb-8">
                     {selectedSageInfo.personality_traits.slice(0, 3).map(trait => (
                       <span key={trait} className="px-3 py-1 bg-stone-100 dark:bg-slate-800 rounded-full text-[10px] font-bold uppercase tracking-widest text-stone-600 dark:text-slate-300 border border-stone-200 dark:border-slate-700">
                         {trait}
                       </span>
                     ))}
                  </div>

                  {/* Role Description */}
                  <div className="bg-stone-50 dark:bg-slate-800/50 rounded-2xl p-5 mb-6 border border-stone-200 dark:border-slate-700">
                      <div className="flex items-start space-x-3">
                         <div className="mt-1"><Info size={16} className="text-indigo-600 dark:text-indigo-400" /></div>
                         <p className="text-sm text-stone-800 dark:text-slate-200 leading-relaxed font-serif font-medium">
                           {selectedSageInfo.role}. Expert in {selectedSageInfo.knowledge_domains.slice(0,2).join(', ')}.
                         </p>
                      </div>
                  </div>

                  {/* Domains */}
                  <div className="space-y-3 mb-8">
                     <h4 className="text-xs font-bold uppercase tracking-widest text-stone-500 dark:text-slate-400 mb-2">Domains of Mastery</h4>
                     <div className="grid grid-cols-2 gap-3">
                        {selectedSageInfo.knowledge_domains.map(domain => (
                          <div key={domain} className="flex items-center space-x-2 text-xs text-stone-700 dark:text-slate-300 font-bold">
                             <Check size={12} className="text-emerald-600 dark:text-emerald-400" />
                             <span>{domain}</span>
                          </div>
                        ))}
                     </div>
                  </div>
               </div>

               <div className="pt-4 border-t border-stone-200 dark:border-slate-800">
                  <button 
                    onClick={handleStartChat}
                    className="w-full py-4 bg-stone-900 dark:bg-white text-white dark:text-stone-900 rounded-2xl font-bold text-lg shadow-xl hover:scale-[1.02] transition-transform flex items-center justify-center"
                  >
                    Seek Wisdom <ArrowRight size={20} className="ml-2" />
                  </button>
               </div>
            </div>
          </div>
        </Portal>
      )}

      {/* 4. ACTIVE CHAT SESSION (Overlay) */}
      {isChatActive && activeSage && (
        <ChatInterface 
          activeSage={activeSage} 
          onBack={handleCloseChat}
          fullHistory={chatHistory}
          setChatHistory={setChatHistory}
          progress={progress}
          currentLessonId={currentLessonId}
        />
      )}

    </div>
  );
};

export default SageTalkView;
