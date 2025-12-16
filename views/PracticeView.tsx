
import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { 
  Play, Pause, Wind, Moon, Fingerprint, X, 
  Sparkles, Target, Flower2, RotateCcw, 
  Check, Heart, Eye, Brain, ArrowRight, Info,
  Settings2, ChevronLeft, ChevronRight, Bell, History
} from 'lucide-react';
import ModuleIntro from '../components/ModuleIntro';

// --- TYPES & CONFIG ---
type ToolId = 'prana' | 'drishti' | 'mantra' | 'nidra' | 'dhyana' | 'sankalpa' | 'ananda';

interface ToolConfig {
  id: ToolId;
  title: string;
  subtitle: string;
  description: string; 
  longDescription: string;
  benefits: string[];
  preparation: string;
  icon: React.ElementType;
  gradient: string;
  accent: string;
  gridSpan: string;
}

const TOOLS: ToolConfig[] = [
  // ROW 1: 2 Items (50% width -> col-span-3)
  {
    id: 'prana',
    title: 'Prana',
    subtitle: 'Breathwork',
    description: '4-7-8',
    longDescription: 'Pranayama is the bridge between body and mind. Use specific rhythmic patterns to shift your nervous system state instantly.',
    benefits: ['Reduces anxiety', 'Improves lung capacity', 'Balances energy'],
    preparation: 'Sit comfortably with a straight spine.',
    icon: Wind,
    gradient: 'from-cyan-500/20 to-blue-600/20',
    accent: 'text-cyan-400',
    gridSpan: 'col-span-3' 
  },
  {
    id: 'drishti',
    title: 'Drishti',
    subtitle: 'Focus',
    description: 'Trataka',
    longDescription: 'Trataka (steady gazing) cleanses the eyes and strengthens concentration. Hold your gaze to burn away mental distractions.',
    benefits: ['Improves focus', 'Clears mental fog', 'Develops willpower'],
    preparation: 'Place device at eye level. Do not blink.',
    icon: Eye,
    gradient: 'from-orange-500/20 to-red-600/20',
    accent: 'text-orange-400',
    gridSpan: 'col-span-3'
  },
  // ROW 2: 3 Items (33% width -> col-span-2)
  {
    id: 'mantra',
    title: 'Mantra',
    subtitle: 'Japa',
    description: '108 Reps',
    longDescription: 'Japa is the repetition of a sacred sound. This digital mala tracks your 108 cycles and counts "Malas" completed.',
    benefits: ['Quiets the mind', 'Purifies speech', 'Induces trance'],
    preparation: 'Choose a mantra (e.g., Om).',
    icon: Fingerprint,
    gradient: 'from-emerald-500/20 to-teal-700/20',
    accent: 'text-emerald-400',
    gridSpan: 'col-span-2'
  },
  {
    id: 'nidra',
    title: 'Nidra',
    subtitle: 'Rest',
    description: 'Body Scan',
    longDescription: 'Yoga Nidra is "yogic sleep". Rotate your consciousness through specific marma points to release deep-seated tension.',
    benefits: ['Deep relaxation', 'Releases trauma', 'Restores energy'],
    preparation: 'Lie down on your back (Savasana).',
    icon: Moon,
    gradient: 'from-indigo-600/20 to-violet-900/20',
    accent: 'text-indigo-400',
    gridSpan: 'col-span-2'
  },
  {
    id: 'dhyana',
    title: 'Dhyana',
    subtitle: 'Timer',
    description: 'Silence',
    longDescription: 'Pure meditation is the art of doing nothing. Use interval chimes to keep your awareness sharp without breaking the silence.',
    benefits: ['Expands awareness', 'Stabilizes emotions', 'Inner silence'],
    preparation: 'Sit in a comfortable posture.',
    icon: Brain,
    gradient: 'from-violet-500/20 to-fuchsia-800/20',
    accent: 'text-violet-400',
    gridSpan: 'col-span-2'
  },
  // ROW 3: 2 Items (50% width -> col-span-3)
  {
    id: 'sankalpa',
    title: 'Sankalpa',
    subtitle: 'Intention',
    description: 'Vows',
    longDescription: 'A Sankalpa is a vow taken by your soul. Crystallize your will into a short, positive statement and seal it into your subconscious.',
    benefits: ['Aligns actions', 'Strengthens resolve', 'Manifests change'],
    preparation: 'Reflect on what you truly seek.',
    icon: Target,
    gradient: 'from-red-600/20 to-rose-900/20',
    accent: 'text-rose-400',
    gridSpan: 'col-span-3'
  },
  {
    id: 'ananda',
    title: 'Ananda',
    subtitle: 'Gratitude',
    description: 'Joy',
    longDescription: 'Ananda (Bliss) is cultivated by noticing the good. Plant seeds of gratitude to visually create a garden of positive memories.',
    benefits: ['Rewires brain', 'Reduces stress', 'Increases joy'],
    preparation: 'Think of 3 small things today.',
    icon: Flower2,
    gradient: 'from-pink-500/20 to-rose-400/20',
    accent: 'text-pink-400',
    gridSpan: 'col-span-3'
  }
];

// --- PORTAL HELPER ---
const Portal = ({ children }: { children: React.ReactNode }) => {
  return typeof document === 'object' ? createPortal(children, document.body) : null;
};

// --- TOOL: PRANA (Breathwork) ---
const BREATH_PATTERNS = {
  '4-7-8': { name: 'Relax', inhale: 4, hold: 7, exhale: 8, holdEmpty: 0 },
  '4-4-4-4': { name: 'Box', inhale: 4, hold: 4, exhale: 4, holdEmpty: 4 },
  '6-0-6-0': { name: 'Balance', inhale: 6, hold: 0, exhale: 6, holdEmpty: 0 },
};

const PranaTool = () => {
  const [patternKey, setPatternKey] = useState<keyof typeof BREATH_PATTERNS>('4-7-8');
  const [status, setStatus] = useState<'idle' | 'running'>('idle');
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale' | 'holdEmpty'>('inhale');
  const [timeLeft, setTimeLeft] = useState(4);
  const [cycles, setCycles] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const pattern = BREATH_PATTERNS[patternKey];

  useEffect(() => {
    if (status === 'running') {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev > 1) return prev - 1;
          
          // Phase Logic
          if (phase === 'inhale') {
            if (pattern.hold > 0) { setPhase('hold'); return pattern.hold; }
            else { setPhase('exhale'); return pattern.exhale; }
          } 
          else if (phase === 'hold') {
            setPhase('exhale'); return pattern.exhale;
          } 
          else if (phase === 'exhale') {
            setCycles(c => c + 1); // Cycle complete
            if (pattern.holdEmpty > 0) { setPhase('holdEmpty'); return pattern.holdEmpty; }
            else { setPhase('inhale'); return pattern.inhale; }
          }
          else { // holdEmpty
            setPhase('inhale'); return pattern.inhale;
          }
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [status, phase, pattern]);

  // Dynamic Styles based on phase duration
  const getScale = () => {
    if (status === 'idle') return { transform: 'scale(1)', transition: 'transform 0.5s ease' };
    
    const duration = timeLeft * 1000; 
    
    let transitionDuration = 0;
    let scale = 1;
    let ease = 'linear';

    if (phase === 'inhale') { scale = 1.5; transitionDuration = pattern.inhale; ease = 'ease-out'; }
    if (phase === 'hold') { scale = 1.5; transitionDuration = 0.1; } // Stay
    if (phase === 'exhale') { scale = 1; transitionDuration = pattern.exhale; ease = 'ease-in-out'; }
    if (phase === 'holdEmpty') { scale = 1; transitionDuration = 0.1; } // Stay

    return {}; 
  };
  
  const phaseClass = 
    status === 'idle' ? 'scale-100 duration-500' :
    phase === 'inhale' ? 'scale-150 ease-out' :
    phase === 'hold' ? 'scale-150' :
    phase === 'exhale' ? 'scale-100 ease-in-out' :
    'scale-100'; // holdEmpty

  // Hack to set duration dynamically using style
  const durationStyle = { transitionDuration: `${status === 'idle' ? 0.5 : (
    phase === 'inhale' ? pattern.inhale : 
    phase === 'hold' ? 0 : 
    phase === 'exhale' ? pattern.exhale : 0
  )}s` };

  return (
    <div className="flex flex-col items-center justify-center h-full relative w-full">
       
       {/* Pattern Selector */}
       <div className="absolute top-20 flex space-x-2 z-20">
         {(Object.keys(BREATH_PATTERNS) as Array<keyof typeof BREATH_PATTERNS>).map(k => (
           <button 
             key={k}
             onClick={() => { setStatus('idle'); setPatternKey(k); setPhase('inhale'); setTimeLeft(BREATH_PATTERNS[k].inhale); setCycles(0); }}
             className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border transition-colors ${patternKey === k ? 'bg-cyan-500 text-white border-cyan-500' : 'text-stone-500 border-stone-700 hover:border-cyan-500'}`}
           >
             {BREATH_PATTERNS[k].name}
           </button>
         ))}
       </div>

       <div className="relative mb-20 w-64 h-64 flex items-center justify-center">
          <div className={`absolute inset-0 rounded-full bg-cyan-400/20 blur-3xl transition-transform ${phaseClass}`} style={durationStyle}></div>
          <div className={`w-32 h-32 rounded-full border-4 border-cyan-300/50 bg-cyan-500/10 backdrop-blur-sm flex items-center justify-center transition-transform ${phaseClass}`} style={durationStyle}>
            <span className="text-3xl font-bold text-white font-mono">{status === 'idle' ? patternKey : timeLeft}</span>
          </div>
          <div className="absolute -bottom-20 text-center w-full">
            <h3 className="text-2xl font-serif text-white tracking-widest uppercase animate-in fade-in min-h-[2rem]">
              {status === 'idle' ? 'Ready' : (phase === 'holdEmpty' ? 'Hold' : phase)}
            </h3>
            {status === 'running' && <div className="text-xs text-cyan-300 font-bold uppercase tracking-widest mt-2">Cycle: {cycles}</div>}
          </div>
       </div>

       <button 
         onClick={() => {
           if (status === 'idle') {
             setStatus('running'); setPhase('inhale'); setTimeLeft(pattern.inhale); setCycles(0);
           } else {
             setStatus('idle');
           }
         }}
         className="w-20 h-20 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20 transition-all active:scale-95 z-20"
       >
         {status === 'idle' ? <Play size={32} className="ml-1 text-white" /> : <Pause size={32} className="text-white" />}
       </button>
    </div>
  );
};

// --- TOOL: DRISHTI (Yantra Focus) ---
const DrishtiTool = () => {
  const [isHolding, setIsHolding] = useState(false);
  const [totalFocusTime, setTotalFocusTime] = useState(0);
  const [sessionTime, setSessionTime] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startHold = () => {
    setIsHolding(true);
    const start = Date.now();
    intervalRef.current = setInterval(() => {
       setSessionTime(prev => prev + 1);
       setTotalFocusTime(prev => prev + 1); // Logic enhancement: Accumulate focus time
    }, 100);
  };

  const endHold = () => {
    setIsHolding(false);
    setSessionTime(0);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  // Visual feedback based on stability (time held)
  const stability = Math.min(100, sessionTime / 2); // Cap at 100 (approx 20 seconds to max stability)

  return (
    <div 
      className="flex flex-col items-center justify-center h-full relative bg-stone-950 select-none touch-none w-full"
      onMouseDown={startHold} onMouseUp={endHold} onMouseLeave={endHold}
      onTouchStart={startHold} onTouchEnd={endHold} onContextMenu={e => e.preventDefault()}
    >
       <div className="absolute top-20 flex flex-col items-center animate-pulse">
          <span className="text-stone-500 font-bold uppercase tracking-widest text-xs mb-1">Total Focus Time</span>
          <span className="text-orange-500 font-mono text-xl">{(totalFocusTime / 10).toFixed(1)}s</span>
       </div>

       <div className="relative w-80 h-80 flex items-center justify-center">
          {/* Reactive Outer Rings */}
          <div className={`absolute inset-0 border border-orange-500/20 rounded-full transition-all duration-1000 ${isHolding ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}></div>
          <div className={`absolute inset-10 border border-orange-500/30 rounded-full transition-all duration-1000 delay-75 ${isHolding ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}></div>
          
          {/* Stability Glow */}
          <div 
            className="absolute inset-0 bg-orange-500/10 rounded-full blur-3xl transition-all duration-300"
            style={{ opacity: stability / 100, transform: `scale(${1 + stability / 200})` }}
          ></div>

          {/* Central Bindu */}
          <div className={`relative z-10 w-4 h-4 rounded-full bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.8)] transition-all duration-200 ${isHolding ? 'scale-150 bg-orange-400' : 'scale-100 animate-pulse'}`}></div>
          
          {/* Stability Text */}
          {isHolding && (
            <div className="absolute mt-32 text-orange-500/50 text-[10px] uppercase tracking-[0.3em] font-bold">
               Stabilizing
            </div>
          )}
       </div>

       <div className="absolute bottom-24 text-stone-600 text-xs font-bold uppercase tracking-widest">
         {isHolding ? "Breathe • Gaze • Stillness" : "Touch & Hold the Bindu"}
       </div>
    </div>
  );
};

// --- TOOL: MANTRA (Japa) ---
const MantraTool = () => {
  const [count, setCount] = useState(0);
  const [malas, setMalas] = useState(0);
  const [lastTap, setLastTap] = useState(0);

  const handleClick = () => {
    const now = Date.now();
    if (now - lastTap < 100) return; // Debounce
    setLastTap(now);

    if (count < 108) {
      setCount(c => c + 1);
    } else {
      // Mala Complete logic
      setMalas(m => m + 1);
      setCount(0);
    }
  };

  const progress = (count / 108) * 100;

  return (
    <div 
      onClick={handleClick}
      className="flex flex-col items-center justify-center h-full relative cursor-pointer select-none w-full bg-slate-950"
    >
       <div className="absolute top-20 flex flex-col items-center">
          <span className="text-stone-500 text-xs font-bold uppercase tracking-widest">Malas Completed</span>
          <div className="flex space-x-1 mt-1">
             {[...Array(Math.min(malas, 5))].map((_, i) => (
               <div key={i} className="w-2 h-2 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50"></div>
             ))}
             {malas > 5 && <span className="text-emerald-500 text-xs font-bold">+{malas - 5}</span>}
          </div>
       </div>
       
       <div className="relative w-72 h-72 flex items-center justify-center">
          {/* Track */}
          <svg className="absolute inset-0 w-full h-full -rotate-90">
             <circle cx="144" cy="144" r="120" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-stone-800" />
             {/* Progress Arc */}
             <circle 
                cx="144" cy="144" r="120" 
                stroke="currentColor" strokeWidth="12" fill="transparent" 
                className="text-emerald-600 transition-all duration-200 ease-out" 
                strokeDasharray="753.6" 
                strokeDashoffset={753.6 - (753.6 * (count / 108))} 
                strokeLinecap="round"
             />
          </svg>
          
          {/* Active Bead Visual */}
          <div 
             className="absolute w-6 h-6 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)] transition-all duration-200"
             style={{ 
               top: '50%', left: '50%',
               transform: `translate(-50%, -50%) rotate(${count * (360/108) - 90}deg) translate(120px) rotate(-${count * (360/108) - 90}deg)`
             }}
          ></div>

          <div className="text-center">
             <div className="text-7xl font-serif font-bold text-white mb-2 tabular-nums">{count}</div>
             <div className="text-emerald-500 font-bold tracking-widest text-xs uppercase">Target: 108</div>
          </div>
       </div>

       <div className="absolute bottom-24 text-stone-500 text-xs uppercase tracking-widest animate-pulse">
         Tap to Chant
       </div>

       <button onClick={(e) => {e.stopPropagation(); setCount(0); setMalas(0);}} className="absolute bottom-8 right-8 p-3 bg-white/10 rounded-full text-stone-400 hover:text-white transition-colors">
         <RotateCcw size={16} />
       </button>
    </div>
  );
};

// --- TOOL: NIDRA (Marma Body Scan) ---
const NidraTool = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [activePoint, setActivePoint] = useState<number>(-1);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const POINTS = [
    { id: 0, name: "Crown", instruction: "Feel the sensation at the top of the head.", x: 50, y: 5 },
    { id: 1, name: "Third Eye", instruction: "Focus on the point between the eyebrows.", x: 50, y: 12 },
    { id: 2, name: "Throat", instruction: "Relax the jaw and throat center.", x: 50, y: 20 },
    { id: 3, name: "Right Shoulder", instruction: "Bring awareness to the right shoulder joint.", x: 30, y: 25 },
    { id: 4, name: "Right Elbow", instruction: "Feel the right elbow.", x: 25, y: 40 },
    { id: 5, name: "Right Hand", instruction: "Awareness of the right thumb and fingers.", x: 20, y: 55 },
    { id: 6, name: "Heart Center", instruction: "Return to the center of the chest. Radiant.", x: 50, y: 30 },
    { id: 7, name: "Left Shoulder", instruction: "Shift to the left shoulder joint.", x: 70, y: 25 },
    { id: 8, name: "Left Elbow", instruction: "Feel the left elbow.", x: 75, y: 40 },
    { id: 9, name: "Left Hand", instruction: "Awareness of the left thumb and fingers.", x: 80, y: 55 },
    { id: 10, name: "Navel", instruction: "Feel the navel rising and falling.", x: 50, y: 45 },
    { id: 11, name: "Root", instruction: "Awareness of the base of the spine.", x: 50, y: 55 },
    { id: 12, name: "Right Knee", instruction: "Right knee cap and joint.", x: 40, y: 75 },
    { id: 13, name: "Right Foot", instruction: "Right ankle and toes.", x: 40, y: 95 },
    { id: 14, name: "Left Knee", instruction: "Left knee cap and joint.", x: 60, y: 75 },
    { id: 15, name: "Left Foot", instruction: "Left ankle and toes.", x: 60, y: 95 },
    { id: 16, name: "Whole Body", instruction: "Feel the entire body as one field of energy.", x: 50, y: 50 } 
  ];

  const toggleSession = () => {
    if (isRunning) {
      setIsRunning(false);
      if (timerRef.current) clearInterval(timerRef.current);
    } else {
      setIsRunning(true);
      if(activePoint === -1) setActivePoint(0);
    }
  };

  const nextPoint = () => setActivePoint(p => Math.min(p + 1, POINTS.length - 1));
  const prevPoint = () => setActivePoint(p => Math.max(p - 1, 0));

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setActivePoint(prev => {
          if (prev >= POINTS.length - 1) { setIsRunning(false); return prev; }
          return prev + 1;
        });
      }, 5000); // 5s per point
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isRunning]);

  return (
    <div className="flex flex-col items-center justify-center h-full relative w-full bg-slate-950 text-indigo-100">
      <div className="absolute top-20 left-6 right-6 text-center z-20">
         <h2 className="text-2xl font-serif font-bold text-indigo-300 transition-all duration-500">
           {activePoint !== -1 ? POINTS[activePoint].name : "Yoga Nidra"}
         </h2>
         <p className="text-sm font-medium text-indigo-200/80 mt-2 min-h-[3rem] transition-opacity duration-500">
           {activePoint !== -1 ? POINTS[activePoint].instruction : "Rotate your consciousness through the body to release deep tension."}
         </p>
      </div>

      <div className="relative w-full max-w-xs aspect-[3/4] p-4 mt-8">
         <svg viewBox="0 0 100 100" className="w-full h-full opacity-20 drop-shadow-2xl text-indigo-500">
            <path d="M50,5 C55,5 58,10 58,15 C58,20 55,22 50,22 C45,22 42,20 42,15 C42,10 45,5 50,5 Z" fill="currentColor" />
            <path d="M42,23 L58,23 L70,25 L75,40 L80,55 L70,55 L65,40 L60,30 L60,55 L65,75 L65,95 L55,95 L55,60 L45,60 L45,95 L35,95 L35,75 L40,55 L40,30 L35,40 L30,55 L20,55 L25,40 L30,25 Z" fill="currentColor" />
         </svg>
         {POINTS.map((pt, idx) => {
           if (pt.name === "Whole Body") return null;
           const isActive = activePoint === idx;
           const isPast = activePoint > idx;
           return (
             <div key={idx} className={`absolute w-3 h-3 rounded-full -translate-x-1/2 -translate-y-1/2 transition-all duration-700 ${isActive ? 'bg-white shadow-[0_0_15px_3px_rgba(255,255,255,0.8)] scale-150 z-10' : isPast ? 'bg-indigo-500/40 scale-100' : 'bg-indigo-900/30 scale-75'}`} style={{ left: `${pt.x}%`, top: `${pt.y}%` }}></div>
           );
         })}
         {activePoint === 16 && <div className="absolute inset-0 bg-indigo-500/10 blur-xl animate-pulse rounded-full"></div>}
      </div>

      <div className="absolute bottom-16 z-20 flex items-center space-x-6">
         <button onClick={prevPoint} className="p-3 bg-white/5 rounded-full hover:bg-white/10 text-indigo-300"><ChevronLeft size={20} /></button>
         <button onClick={toggleSession} className="w-16 h-16 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-indigo-900/50 transition-transform hover:scale-105">
           {isRunning ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
         </button>
         <button onClick={nextPoint} className="p-3 bg-white/5 rounded-full hover:bg-white/10 text-indigo-300"><ChevronRight size={20} /></button>
      </div>
    </div>
  );
};

// --- TOOL: DHYANA (Timer) ---
const DhyanaTool = () => {
  const [duration, setDuration] = useState(10);
  const [timeLeft, setTimeLeft] = useState(10 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [intervalBell, setIntervalBell] = useState(false);
  const [showBellVisual, setShowBellVisual] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(t => {
          // Interval Bell Logic (Every 1 min)
          if (intervalBell && (t - 1) % 60 === 0 && t - 1 !== 0) {
            triggerBell();
          }
          return t - 1;
        });
      }, 1000);
    } else if (timeLeft === 0) { setIsRunning(false); }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isRunning, timeLeft, intervalBell]);

  const triggerBell = () => {
    setShowBellVisual(true);
    setTimeout(() => setShowBellVisual(false), 2000);
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec < 10 ? '0' : ''}${sec}`;
  };

  return (
    <div className="flex flex-col items-center justify-center h-full relative w-full">
       
       {/* Bell Visualizer */}
       {showBellVisual && (
         <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
           <div className="w-full h-full bg-violet-500/10 animate-ping rounded-full"></div>
         </div>
       )}

       <div className={`text-6xl font-mono font-light text-white mb-10 transition-opacity ${isRunning ? 'opacity-100' : 'opacity-70'}`}>
         {formatTime(timeLeft)}
       </div>
       
       {!isRunning && (
         <div className="flex space-x-4 mb-8">
            {[5, 10, 20, 30].map(min => (
              <button key={min} onClick={() => { setDuration(min); setTimeLeft(min * 60); }} className={`w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-sm font-bold transition-all ${duration === min ? 'bg-white text-violet-900' : 'text-white hover:bg-white/10'}`}>
                {min}
              </button>
            ))}
         </div>
       )}
       
       {/* Interval Bell Toggle */}
       <button 
         onClick={() => setIntervalBell(!intervalBell)}
         className={`mb-12 flex items-center space-x-2 px-4 py-2 rounded-full border text-xs font-bold uppercase tracking-widest transition-colors ${intervalBell ? 'bg-violet-500/20 border-violet-500 text-violet-300' : 'border-white/10 text-stone-500 hover:border-white/30'}`}
       >
         <Bell size={14} className={intervalBell ? 'fill-current' : ''} />
         <span>Interval Chime</span>
       </button>

       <button onClick={() => setIsRunning(!isRunning)} className="w-20 h-20 bg-violet-600 hover:bg-violet-500 text-white rounded-full flex items-center justify-center shadow-2xl shadow-violet-900/50 transition-transform active:scale-95">
         {isRunning ? <Pause size={32} /> : <Play size={32} className="ml-1" />}
       </button>
    </div>
  );
};

// --- TOOL: SANKALPA (Intention) ---
const SankalpaTool = () => {
  const [text, setText] = useState('');
  const [sealed, setSealed] = useState(false);
  const [history, setHistory] = useState<string[]>([]);

  const handleSeal = () => {
    if(!text.trim()) return;
    setSealed(true);
    // Add to history after delay
    setTimeout(() => {
      setHistory(prev => [text, ...prev]);
      // Reset after showing the seal state
      setTimeout(() => {
        setSealed(false);
        setText('');
      }, 2000);
    }, 1500);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full px-6 w-full">
       <div className={`w-full max-w-sm aspect-[3/4] bg-[#fdfbf7] text-stone-900 rounded-sm shadow-2xl transition-all duration-700 p-8 flex flex-col items-center text-center relative overflow-hidden ${sealed ? 'scale-95 brightness-95' : 'scale-100'}`}>
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")' }}></div>
          <Target className={`text-red-800 mb-6 ${sealed ? 'opacity-50' : 'opacity-100'}`} size={32} />
          <h2 className="font-serif text-2xl font-bold text-red-900 mb-8 uppercase tracking-widest border-b-2 border-red-900/20 pb-2">Sankalpa</h2>
          
          {sealed ? (
            <div className="flex-1 flex flex-col items-center justify-center animate-in zoom-in duration-500">
               <p className="font-serif text-xl italic leading-relaxed text-stone-800">"{text}"</p>
               <div className="mt-8 w-16 h-16 rounded-full border-4 border-red-800/50 flex items-center justify-center animate-bounce">
                 <div className="w-12 h-12 bg-red-800 rounded-full opacity-20 blur-md"></div>
                 <span className="absolute text-[10px] font-bold text-red-900 uppercase -rotate-12 border-2 border-red-900 px-1">Sealed</span>
               </div>
            </div>
          ) : (
            <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="I vow to..." className="flex-1 w-full bg-transparent resize-none outline-none font-serif text-xl text-stone-800 placeholder:text-stone-300 text-center" />
          )}
       </div>

       {/* History Stack */}
       {!sealed && history.length > 0 && (
         <div className="mt-4 flex items-center space-x-2 text-stone-500 cursor-pointer hover:text-white transition-colors group">
           <History size={14} />
           <span className="text-xs font-bold uppercase tracking-widest">Active Vows: {history.length}</span>
         </div>
       )}

       <button 
         onClick={handleSeal}
         disabled={sealed}
         className="mt-6 px-8 py-3 bg-stone-800 text-stone-200 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-stone-700 transition-colors disabled:opacity-50"
       >
         {sealed ? "Sealing..." : "Seal Vow"}
       </button>
    </div>
  );
};

// --- TOOL: ANANDA (Gratitude) ---
const AnandaTool = () => {
  const [items, setItems] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('ananda_items');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  const [input, setInput] = useState('');

  useEffect(() => {
    localStorage.setItem('ananda_items', JSON.stringify(items));
  }, [items]);

  const add = () => { if (input.trim()) { setItems(prev => [input, ...prev]); setInput(''); } };

  return (
    <div className="flex flex-col h-full w-full max-w-lg mx-auto relative pt-24 pb-8 px-6">
       <div className="flex-1 relative overflow-hidden mb-6">
          {items.length === 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-pink-300/40">
               <Flower2 size={80} />
               <p className="mt-4 font-serif italic">Plant a seed of joy...</p>
            </div>
          )}
          
          {/* Garden View */}
          <div className="absolute inset-0 overflow-y-auto no-scrollbar pb-20 p-4">
             {items.map((item, i) => (
               <div 
                 key={i} 
                 className="animate-in zoom-in duration-500 mb-4 inline-block mr-2"
                 style={{ animationDelay: `${i * 50}ms` }}
               >
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full flex items-center gap-2 hover:bg-white/20 transition-colors cursor-default">
                     <Heart size={10} fill="currentColor" className="text-pink-300" />
                     <span className="text-white font-serif text-sm">{item}</span>
                  </div>
               </div>
             ))}
          </div>
       </div>
       <div className="relative">
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && add()} placeholder="I am grateful for..." className="w-full bg-white/10 border border-white/20 rounded-full py-4 pl-6 pr-14 text-white placeholder:text-pink-200/50 outline-none focus:bg-white/20 transition-all" />
          <button onClick={add} disabled={!input.trim()} className="absolute right-2 top-2 bottom-2 aspect-square bg-pink-500 rounded-full flex items-center justify-center text-white disabled:opacity-50 hover:bg-pink-600 transition-colors"><Check size={20} /></button>
       </div>
    </div>
  );
};

// --- MAIN PRACTICE VIEW ---

const PracticeView: React.FC = () => {
  const [activeToolId, setActiveToolId] = useState<ToolId | null>(null);
  const [selectedToolInfo, setSelectedToolInfo] = useState<ToolConfig | null>(null);
  const [showIntro, setShowIntro] = useState(true);

  const activeTool = TOOLS.find(t => t.id === activeToolId);

  if (showIntro) {
    return (
      <ModuleIntro 
        title="Module 2: The Sanctuary"
        hook="Silence the Noise. Awaken the Force."
        description="Theory is useless without Sadhana. Enter your digital dojo for breath, focus, and deep rest."
        features={[
          "Digital Tantra (Breath & Gaze)",
          "Guided Yoga Nidra",
          "Sealed Intentions (Sankalpa)"
        ]}
        Icon={Target}
        colorClass="text-emerald-500"
        bgClass="bg-emerald-600"
        onStart={() => setShowIntro(false)}
      />
    );
  }

  return (
    <div className="h-full w-full bg-stone-50 dark:bg-slate-950 pt-20 overflow-y-auto flex flex-col">
      
      {/* 1. Header Area */}
      <div className="px-6 mb-4 flex-none">
        <div className="inline-block px-3 py-1 bg-saffron-100 dark:bg-saffron-900/30 text-saffron-700 dark:text-saffron-300 rounded-full text-[10px] font-bold uppercase tracking-widest mb-2">
           Daily Sadhana
        </div>
        <h2 className="font-serif text-3xl font-bold text-stone-900 dark:text-slate-100">The Sanctuary</h2>
      </div>

      {/* 2. COMPACT GRID LAYOUT - REDUCED HEIGHT AND SPACING */}
      <div className="flex-1 px-4 sm:px-6 pb-28 flex items-start justify-center">
        <div className="w-full max-w-4xl grid grid-cols-6 gap-px bg-stone-300 dark:bg-slate-800 border border-stone-300 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          {TOOLS.map((tool) => {
            const Icon = tool.icon;
            return (
              <button
                key={tool.id}
                onClick={() => setSelectedToolInfo(tool)}
                className={`group relative h-32 sm:h-48 ${tool.gridSpan} w-full overflow-hidden bg-white dark:bg-slate-900 text-left transition-all duration-300 hover:bg-stone-50 dark:hover:bg-slate-800 flex flex-col justify-between`}
              >
                {/* Background Glow Pulse */}
                <div className={`absolute inset-0 bg-gradient-to-br ${tool.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-pulse`}></div>
                
                {/* Watermark Icon */}
                <Icon strokeWidth={1} className="absolute -right-4 -bottom-4 w-20 h-20 sm:w-28 sm:h-28 text-stone-100 dark:text-slate-800 group-hover:text-stone-200 dark:group-hover:text-slate-700 transition-all duration-500 rotate-12 group-hover:rotate-0 group-hover:scale-110" />

                <div className="relative z-10 h-full flex flex-col justify-between p-3 sm:p-5 w-full">
                  <div className="flex justify-between items-start">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-stone-100 dark:bg-slate-800 flex items-center justify-center border border-stone-200 dark:border-slate-700 group-hover:border-transparent group-hover:bg-white/50 dark:group-hover:bg-black/20 transition-all">
                       <Icon size={16} className={`sm:w-5 sm:h-5 text-stone-500 dark:text-slate-400 group-hover:${tool.accent} transition-colors`} />
                    </div>
                  </div>
                  <div>
                     <div className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-stone-500 dark:text-slate-400 mb-0.5">{tool.subtitle}</div>
                     <h3 className="font-serif text-lg sm:text-xl font-bold text-stone-900 dark:text-white leading-none group-hover:text-black dark:group-hover:text-white transition-colors">{tool.title}</h3>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. TOOL GATEWAY MODAL (Portal Z-INDEX 9999) */}
      {selectedToolInfo && (
        <Portal>
          <div className="fixed inset-0 z-[9999] bg-stone-900/60 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="glass-panel w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl animate-in zoom-in-95 duration-200 bg-white dark:bg-slate-900 border border-white/20 relative flex flex-col max-h-[90vh]">
               <button onClick={() => setSelectedToolInfo(null)} className="absolute top-4 right-4 p-2 bg-stone-100 dark:bg-slate-800 rounded-full text-stone-500 dark:text-slate-400 hover:bg-stone-200 dark:hover:bg-slate-700 transition-colors z-20">
                 <X size={20} />
               </button>
               <div className="flex-1 overflow-y-auto">
                  <div className="flex items-center space-x-4 mb-6 pt-2">
                      <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br ${selectedToolInfo.gradient} flex items-center justify-center shadow-lg shrink-0`}>
                      <selectedToolInfo.icon size={28} className="text-stone-900 dark:text-white" />
                      </div>
                      <div>
                      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 dark:text-white">{selectedToolInfo.title}</h2>
                      <p className="text-xs font-bold uppercase tracking-widest text-stone-600 dark:text-slate-400">{selectedToolInfo.subtitle}</p>
                      </div>
                  </div>
                  <p className="text-stone-800 dark:text-slate-200 leading-relaxed mb-6 font-serif text-sm sm:text-base font-medium">
                      {selectedToolInfo.longDescription}
                  </p>
                  <div className="bg-stone-50 dark:bg-slate-800/50 rounded-xl p-4 mb-6 border border-stone-200 dark:border-slate-700">
                      <h4 className="text-[10px] font-bold uppercase tracking-widest text-stone-500 dark:text-slate-400 mb-3 flex items-center">
                      <Sparkles size={12} className="mr-1" /> Key Benefits
                      </h4>
                      <ul className="space-y-2">
                      {selectedToolInfo.benefits.map((benefit, idx) => (
                          <li key={idx} className="flex items-start text-sm text-stone-900 dark:text-slate-200 font-medium">
                              <Check size={14} className="mr-2 mt-0.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                              {benefit}
                          </li>
                      ))}
                      </ul>
                  </div>
                  <div className="flex items-start space-x-3 mb-8 text-xs text-stone-600 dark:text-slate-400 italic">
                      <Info size={14} className="shrink-0 mt-0.5" />
                      <span>Prep: {selectedToolInfo.preparation}</span>
                  </div>
               </div>
               <div className="pt-4 border-t border-stone-200 dark:border-slate-800">
                  <button onClick={() => { setActiveToolId(selectedToolInfo.id); setSelectedToolInfo(null); }} className="w-full py-4 bg-stone-900 dark:bg-white text-white dark:text-stone-900 rounded-2xl font-bold text-lg shadow-xl hover:scale-[1.02] transition-transform flex items-center justify-center">
                  Begin Practice <ArrowRight size={20} className="ml-2" />
                  </button>
               </div>
            </div>
          </div>
        </Portal>
      )}

      {/* 4. ACTIVE TOOL FULL SCREEN OVERLAY (Portal Z-INDEX 10000) */}
      {activeToolId && activeTool && (
        <Portal>
          <div className="fixed inset-0 z-[10000] bg-stone-950 animate-in fade-in duration-300 flex flex-col">
             {/* Header Area for Close Button - Positioned absolutely at top */}
             <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-start z-[10001] pointer-events-none">
                <div className="flex items-center space-x-3 pointer-events-auto mt-safe-top pt-2">
                   <div className={`p-2 rounded-full bg-gradient-to-br ${activeTool.gradient} opacity-80`}>
                      <activeTool.icon size={18} className="text-white" />
                   </div>
                   <span className="font-serif text-lg font-bold text-white tracking-wide">{activeTool.title}</span>
                </div>
                {/* CLOSE BUTTON - Fixed to ensure visibility over everything */}
                <button 
                  onClick={() => setActiveToolId(null)}
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center text-white transition-colors pointer-events-auto mt-2"
                >
                  <X size={20} />
                </button>
             </div>

             <div className="flex-1 relative overflow-hidden flex flex-col items-center justify-center">
               <div className={`absolute inset-0 bg-gradient-to-br ${activeTool.gradient} opacity-10 pointer-events-none`}></div>
               
               {activeToolId === 'prana' && <PranaTool />}
               {activeToolId === 'drishti' && <DrishtiTool />}
               {activeToolId === 'mantra' && <MantraTool />}
               {activeToolId === 'nidra' && <NidraTool />}
               {activeToolId === 'dhyana' && <DhyanaTool />}
               {activeToolId === 'sankalpa' && <SankalpaTool />}
               {activeToolId === 'ananda' && <AnandaTool />}
             </div>
          </div>
        </Portal>
      )}

    </div>
  );
};

export default PracticeView;
