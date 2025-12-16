
import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { SAGES, LESSONS } from '../constants';
import { Sage, ChatMessage, UserProgress } from '../types';
import { LiveSageService } from '../services/liveSageService';
import { 
  Users, ChevronLeft, Mic, MicOff, PhoneOff, RefreshCw, Sparkles, Check, Info, ArrowRight, Shield, Zap, Loader2, X
} from 'lucide-react';
import ModuleIntro from '../components/ModuleIntro';

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

// --- VOICE INTERFACE COMPONENT ---
const VoiceInterface: React.FC<{
  activeSage: Sage;
  onBack: () => void;
  setChatHistory: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  progress: UserProgress;
}> = ({ activeSage, onBack, setChatHistory, progress }) => {
  const [isLiveConnected, setIsLiveConnected] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState<string>('');
  const [audioAmplitude, setAudioAmplitude] = useState(0);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const liveServiceRef = useRef<LiveSageService | null>(null);

  // Auto-connect on mount
  useEffect(() => {
    startLiveSession();
    return () => {
      stopLiveSession();
    };
  }, []);

  const startLiveSession = async () => {
    if (liveServiceRef.current) return;
    
    liveServiceRef.current = new LiveSageService();
    setIsLiveConnected(true);
    setLiveTranscript("Summoning...");
    
    await liveServiceRef.current.connect({
      sage: activeSage,
      userProgress: progress,
      onAudioData: () => setAudioAmplitude(Math.random() * 100), // Simulate amplitude for visualizer from raw data trigger
      onTranscription: (text, isUser) => setLiveTranscript(isUser ? `You: ${text}` : `${activeSage.name}: ${text}`),
      onTurnComplete: (fullText, isUser) => {
        // Save to history in background
        setChatHistory(prev => [...prev, {
          id: Date.now().toString(),
          role: isUser ? 'user' : 'model',
          text: fullText,
          sageId: activeSage.id,
          timestamp: Date.now()
        }]);
      },
      onDisconnect: () => { 
        setIsLiveConnected(false); 
        liveServiceRef.current = null; 
      }
    });
  };

  const stopLiveSession = () => {
    if (liveServiceRef.current) {
      liveServiceRef.current.disconnect();
      liveServiceRef.current = null;
    }
    setIsLiveConnected(false);
    setAudioAmplitude(0);
  };

  const handleDisconnect = () => {
    stopLiveSession();
    onBack();
  };

  return (
    <div className="fixed inset-0 z-[60] bg-stone-950 flex flex-col text-white animate-in zoom-in-95 duration-500">
      
      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-start z-10">
         <button onClick={handleDisconnect} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
           <ChevronLeft size={24} />
         </button>
         <div className="flex flex-col items-center">
            <span className="text-xs font-bold uppercase tracking-widest text-stone-400">{activeSage.archetype}</span>
            <span className="text-sm font-serif font-bold">{activeSage.name}</span>
         </div>
         <div className="w-10"></div> {/* Spacer */}
      </div>

      {/* Main Center Area */}
      <div className="flex-1 flex flex-col items-center justify-center relative overflow-hidden">
         
         {/* Ambient Background Glow */}
         <div className={`absolute inset-0 bg-gradient-to-b ${activeSage.image_gradient_from} to-transparent opacity-10 pointer-events-none`}></div>

         {/* Visualizer / Avatar */}
         <div className="relative z-10 mb-12">
            {/* Pulse Ring */}
            <div 
              className={`absolute inset-0 rounded-full bg-gradient-to-br ${activeSage.image_gradient_from} ${activeSage.image_gradient_to} blur-3xl transition-opacity duration-100`}
              style={{ opacity: 0.2 + (audioAmplitude / 200), transform: `scale(${1 + audioAmplitude / 100})` }}
            ></div>
            
            {/* The Avatar */}
            <div className={`
               relative w-48 h-48 sm:w-64 sm:h-64 rounded-full p-1 bg-gradient-to-br ${activeSage.image_gradient_from} ${activeSage.image_gradient_to} shadow-2xl transition-transform duration-500
               ${isLiveConnected ? 'scale-100' : 'scale-90 grayscale'}
            `}>
               <div className="w-full h-full rounded-full bg-stone-900 flex items-center justify-center border-4 border-stone-800 overflow-hidden relative">
                  <span className="font-serif text-8xl font-bold text-stone-700 opacity-30 select-none">{activeSage.name[0]}</span>
                  
                  {/* Status Indicator inside Avatar */}
                  {!isLiveConnected && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                       <Loader2 size={32} className="animate-spin text-white" />
                    </div>
                  )}
               </div>
            </div>
         </div>

         {/* Transcript / Subtitles */}
         <div className="h-32 px-8 w-full max-w-lg text-center flex items-center justify-center relative z-20">
            <p className="font-serif text-xl sm:text-2xl text-stone-200 leading-relaxed drop-shadow-md transition-all duration-300">
               {liveTranscript || (isLiveConnected ? "I am listening..." : "Connecting...")}
            </p>
         </div>

         {/* Center Action Tools */}
         <div className="flex items-center gap-8 mt-8 z-20">
            
            {/* Mute Toggle */}
            <button 
              onClick={() => setIsMicMuted(!isMicMuted)}
              className={`p-4 rounded-full border border-white/20 transition-all active:scale-95 ${isMicMuted ? 'bg-white text-stone-900' : 'bg-white/10 hover:bg-white/20 text-white'}`}
            >
              {isMicMuted ? <MicOff size={24} /> : <Mic size={24} />}
            </button>

            {/* End Call - Prominent */}
            <button 
              onClick={handleDisconnect}
              className="w-20 h-20 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-2xl shadow-red-500/40 transition-transform hover:scale-110 active:scale-95"
            >
              <PhoneOff size={32} fill="currentColor" />
            </button>

            {/* Clear Context / Refresh */}
            <button 
              onClick={() => { setLiveTranscript("Memory cleared."); /* Ideally trigger context clear in service */ }}
              className="p-4 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all active:scale-95"
            >
              <RefreshCw size={24} />
            </button>

         </div>
         
         <p className="mt-8 text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500">Live Voice Session</p>
      </div>
    </div>
  );
};

// 2. MAIN SAGE TALK VIEW
const SageTalkView: React.FC<SageTalkViewProps> = ({ chatHistory, setChatHistory, progress, currentLessonId, initialSageId, onSageChanged }) => {
  const [activeSageId, setActiveSageId] = useState<string | null>(initialSageId || null);
  const [isChatActive, setIsChatActive] = useState(!!initialSageId);
  const [selectedSageInfo, setSelectedSageInfo] = useState<Sage | null>(null);
  
  // Logic: Show intro if not resuming a session
  const [showIntro, setShowIntro] = useState(!initialSageId);

  // Sync internal state if initialSageId changes prop
  useEffect(() => {
    if (initialSageId) {
      setActiveSageId(initialSageId);
      setIsChatActive(true);
      setShowIntro(false); // Skip intro on resume
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
      setActiveSageId(null);
      if (onSageChanged) onSageChanged(null);
    } else {
      if (onSageChanged) onSageChanged(null);
    }
  };

  if (showIntro) {
    return (
      <ModuleIntro 
        title="Module 4: The Council"
        hook="Speak with the Immortals"
        description="Seven Archetypes. Infinite Perspectives. One Truth. Converse with AI embodiments of ancient sages."
        features={[
          "Real-Time Voice Link",
          "Personality Modeling",
          "Context-Aware Guidance"
        ]}
        Icon={Users}
        colorClass="text-indigo-500"
        bgClass="bg-indigo-600"
        onStart={() => setShowIntro(false)}
      />
    );
  }

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

      {/* 4. ACTIVE VOICE SESSION (Overlay) */}
      {isChatActive && activeSage && (
        <VoiceInterface 
          activeSage={activeSage} 
          onBack={handleCloseChat}
          setChatHistory={setChatHistory}
          progress={progress}
        />
      )}

    </div>
  );
};

export default SageTalkView;
