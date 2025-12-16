
import React, { useState } from 'react';
import { Save, Calendar, Sparkles, X, PenTool } from 'lucide-react';
import { UserProgress } from '../types';
import { SAGES } from '../constants';
import { generateJournalInsight } from '../services/geminiService';
import ModuleIntro from '../components/ModuleIntro';

interface ReflectViewProps {
  progress: UserProgress;
}

const ReflectView: React.FC<ReflectViewProps> = ({ progress }) => {
  const [entry, setEntry] = useState('');
  const [insight, setInsight] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeSageId, setActiveSageId] = useState(SAGES[0].id); // Default to first sage
  const [showIntro, setShowIntro] = useState(true);

  const handleGetInsight = async () => {
    if (!entry.trim()) return;
    setIsAnalyzing(true);
    const result = await generateJournalInsight(entry, activeSageId);
    setInsight(result);
    setIsAnalyzing(false);
  };
  
  if (showIntro) {
    return (
      <ModuleIntro 
        title="Module 5: The Mirror"
        hook="You are the Universe observing itself"
        description="Document your evolution. Receive AI-powered insight from the Sages based on your personal reflections."
        features={[
          "Distraction-Free Canvas",
          "Sage Insight Analysis",
          "Pattern Recognition"
        ]}
        Icon={PenTool}
        colorClass="text-purple-500"
        bgClass="bg-purple-600"
        onStart={() => setShowIntro(false)}
      />
    );
  }

  return (
    <div className="h-full flex flex-col px-6 pt-24 pb-28 max-w-2xl mx-auto overflow-y-auto">
      <div className="flex items-center justify-between mb-4 flex-none">
        <div>
          <h2 className="font-serif text-3xl font-bold text-stone-900 dark:text-slate-100">Reflect</h2>
          <p className="text-xs font-bold uppercase tracking-widest text-stone-500 dark:text-slate-400 mt-1">Daily Journal</p>
        </div>
        
        {/* Sage Selector for Insight */}
        <div className="flex items-center space-x-2">
           <span className="text-[10px] font-bold uppercase tracking-widest text-stone-500 dark:text-slate-400 hidden sm:inline">Insight by:</span>
           <select 
             value={activeSageId}
             onChange={(e) => setActiveSageId(e.target.value)}
             className="text-xs font-bold bg-white dark:bg-slate-800 text-stone-900 dark:text-slate-200 border border-stone-300 dark:border-slate-700 rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-saffron-400"
           >
             {SAGES.map(s => (
               <option key={s.id} value={s.id}>{s.name}</option>
             ))}
           </select>
        </div>
      </div>

      {/* Journal Editor Card - FLEXIBLE HEIGHT */}
      <div className="flex-1 glass-panel rounded-lg p-1 relative shadow-sm overflow-hidden flex flex-col mb-4 min-h-[200px]">
        {/* Paper visual */}
        <div className="flex-1 bg-white dark:bg-slate-800/50 rounded p-4 sm:p-6 relative flex flex-col">
          <textarea
            value={entry}
            onChange={(e) => setEntry(e.target.value)}
            placeholder="What is your truth today?"
            className="flex-1 w-full resize-none bg-transparent focus:outline-none font-serif text-lg leading-[2rem] text-stone-900 dark:text-slate-100 placeholder:text-stone-400 dark:placeholder:text-slate-500 placeholder:italic"
            style={{ 
              backgroundImage: 'linear-gradient(transparent, transparent 31px, rgba(0,0,0,0.05) 31px)', 
              backgroundSize: '100% 32px', 
              lineHeight: '32px' 
            }}
          />
        </div>
      </div>

      {/* Insight Panel (if available) */}
      {insight && (
        <div className="mb-4 animate-in slide-in-from-bottom-4 fade-in duration-500 flex-none">
          <div className="glass-panel rounded-xl p-5 border-l-4 border-l-saffron-500 relative bg-white/90 dark:bg-slate-900/90">
             <button 
               onClick={() => setInsight(null)} 
               className="absolute top-2 right-2 text-stone-400 hover:text-stone-600 dark:text-slate-400 dark:hover:text-slate-200"
             >
               <X size={14} />
             </button>
             <div className="flex items-center space-x-2 mb-2">
               <Sparkles size={14} className="text-saffron-600" />
               <span className="text-[10px] font-bold uppercase tracking-widest text-stone-600 dark:text-slate-400">
                 {SAGES.find(s => s.id === activeSageId)?.name}'s Insight
               </span>
             </div>
             <p className="font-serif italic text-stone-900 dark:text-slate-100 leading-relaxed text-sm">
               "{insight}"
             </p>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex space-x-3 flex-none">
        <button 
          onClick={handleGetInsight}
          disabled={!entry.trim() || isAnalyzing}
          className="flex-1 py-4 bg-white dark:bg-slate-800 border border-saffron-200 dark:border-saffron-900/30 text-saffron-700 dark:text-saffron-400 rounded-xl font-bold flex items-center justify-center hover:bg-saffron-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
        >
          {isAnalyzing ? (
            <span className="animate-pulse text-xs uppercase tracking-widest">Consulting...</span>
          ) : (
            <>
               <Sparkles size={18} className="mr-2" /> <span className="text-sm">Get Insight</span>
            </>
          )}
        </button>
        
        <button className="flex-1 py-4 bg-stone-900 dark:bg-white text-white dark:text-stone-900 rounded-xl font-bold flex items-center justify-center hover:opacity-90 transition-opacity shadow-lg">
          <Save size={18} className="mr-2" /> <span className="text-sm">Save Entry</span>
        </button>
      </div>
    </div>
  );
};

export default ReflectView;
