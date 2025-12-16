
import React from 'react';
import { ArrowRight, CheckCircle2, LucideIcon } from 'lucide-react';

interface ModuleIntroProps {
  title: string;
  hook: string;
  description: string;
  features: string[];
  onStart: () => void;
  Icon: LucideIcon;
  colorClass: string; // e.g., 'text-saffron-500'
  bgClass: string; // e.g., 'bg-saffron-500'
}

const ModuleIntro: React.FC<ModuleIntroProps> = ({ 
  title, 
  hook, 
  description, 
  features, 
  onStart, 
  Icon, 
  colorClass, 
  bgClass 
}) => {
  return (
    <div className="absolute inset-0 z-50 bg-stone-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 sm:p-8 animate-in fade-in duration-500">
      
      {/* Background Ambience */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl opacity-10 pointer-events-none ${bgClass}`}></div>

      <div className="relative z-10 max-w-md w-full text-center">
        {/* Icon */}
        <div className={`w-24 h-24 mx-auto rounded-3xl bg-white dark:bg-slate-900 shadow-2xl flex items-center justify-center mb-8 border border-stone-100 dark:border-slate-800 animate-float`}>
          <Icon size={48} className={colorClass} strokeWidth={1.5} />
        </div>

        {/* Headlines */}
        <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-stone-400 dark:text-slate-500 mb-4">{title}</h3>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 dark:text-white mb-4 leading-tight">
          {hook}
        </h1>
        <p className="font-serif italic text-stone-600 dark:text-slate-400 text-lg mb-10 leading-relaxed">
          "{description}"
        </p>

        {/* Feature List */}
        <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-2xl p-6 mb-10 border border-stone-200 dark:border-slate-800 text-left shadow-sm">
          <ul className="space-y-4">
            {features.map((feature, idx) => (
              <li key={idx} className="flex items-start space-x-3">
                <CheckCircle2 size={18} className={`mt-0.5 shrink-0 ${colorClass}`} />
                <span className="text-sm font-bold text-stone-700 dark:text-slate-300 uppercase tracking-wide">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Action Button */}
        <button 
          onClick={onStart}
          className={`w-full py-5 rounded-2xl font-bold text-white text-lg shadow-xl hover:scale-[1.02] transition-transform flex items-center justify-center space-x-3 ${bgClass}`}
        >
          <span>Initiate Access</span>
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default ModuleIntro;
