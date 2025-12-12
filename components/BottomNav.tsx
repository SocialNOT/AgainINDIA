
import React from 'react';
import { BookOpen, Wind, Library, MessageCircle, PenTool } from 'lucide-react';
import { ModuleType } from '../types';

interface BottomNavProps {
  currentModule: ModuleType;
  setModule: (m: ModuleType) => void;
  theme: 'day' | 'night';
}

const BottomNav: React.FC<BottomNavProps> = ({ currentModule, setModule, theme }) => {
  const navItems = [
    { id: ModuleType.LEARN, label: 'Learn', icon: BookOpen },
    { id: ModuleType.PRACTICE, label: 'Practice', icon: Wind },
    { id: ModuleType.LIBRARY, label: 'Library', icon: Library },
    { id: ModuleType.SAGETALK, label: 'SageTalk', icon: MessageCircle },
    { id: ModuleType.REFLECT, label: 'Reflect', icon: PenTool },
  ];

  return (
    <div className="fixed bottom-6 left-0 right-0 flex justify-center z-50 pointer-events-none px-4">
      {/* 
        Container for the Glowing Border Animation
        The 'group' class allows us to change the glow intensity on hover.
      */}
      <div className="relative group pointer-events-auto transition-transform duration-300 hover:scale-[1.02]">
        
        {/* The "Hyper-Real" Glowing Border */}
        {/* Uses animate-gradient-xy to shift the gradient background continuously */}
        <div className="absolute -inset-[2px] bg-gradient-to-r from-saffron-500 via-purple-500 to-saffron-500 rounded-full blur-sm opacity-70 group-hover:opacity-100 transition-opacity duration-500 animate-gradient-xy"></div>
        
        {/* The Navigation Bar Panel */}
        <nav className="relative flex items-center bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl rounded-full px-2 py-2 shadow-2xl shadow-black/20 ring-1 ring-white/10">
          {navItems.map((item) => {
            const isActive = currentModule === item.id;
            const Icon = item.icon;
            
            return (
              <button
                key={item.id}
                onClick={() => setModule(item.id)}
                className={`
                  relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full transition-all duration-500 ease-out mx-1
                  ${isActive 
                    ? 'bg-saffron-500 text-white shadow-[0_0_15px_rgba(245,158,11,0.5)] -translate-y-2 scale-110' 
                    : 'text-stone-400 dark:text-slate-500 hover:bg-stone-100 dark:hover:bg-white/10 hover:text-stone-600 dark:hover:text-slate-300'}
                `}
              >
                {/* Active Indicator Dot (Bottom) */}
                {isActive && (
                  <div className="absolute -bottom-3 w-1 h-1 rounded-full bg-saffron-500 shadow-[0_0_5px_rgba(245,158,11,1)]"></div>
                )}

                <Icon size={isActive ? 22 : 20} strokeWidth={isActive ? 2.5 : 2} />
                
                {/* Floating Tooltip Label */}
                <span className={`
                  absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1 bg-stone-900/90 dark:bg-white/90 text-white dark:text-stone-900 text-[10px] font-bold uppercase tracking-widest rounded-lg opacity-0 transition-all duration-300 pointer-events-none whitespace-nowrap shadow-lg backdrop-blur-sm
                  ${isActive ? 'opacity-100 -translate-y-1' : 'group-hover:opacity-0'}
                `}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default BottomNav;
