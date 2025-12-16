
import React from 'react';
import { BookOpen, Wind, Library, MessageCircle, PenTool } from 'lucide-react';
import { ModuleType } from '../types';

interface BottomNavProps {
  currentModule: ModuleType;
  setModule: (m: ModuleType) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentModule, setModule }) => {
  const navItems = [
    { id: ModuleType.LEARN, label: 'Path', icon: BookOpen },
    { id: ModuleType.PRACTICE, label: 'Do', icon: Wind },
    { id: ModuleType.LIBRARY, label: 'Read', icon: Library },
    { id: ModuleType.SAGETALK, label: 'Ask', icon: MessageCircle },
    { id: ModuleType.REFLECT, label: 'Log', icon: PenTool },
  ];

  return (
    <div className="fixed bottom-9 left-0 right-0 flex justify-center z-50 pointer-events-none px-4 pb-safe">
      {/* 
        Container for the Glowing Border Animation
      */}
      <div className="relative group pointer-events-auto transition-transform duration-300 hover:scale-[1.01]">
        
        {/* The "Hyper-Real" Glowing Border */}
        <div className="absolute -inset-[1px] bg-gradient-to-r from-saffron-500 via-purple-500 to-saffron-500 rounded-full blur-[2px] opacity-60 group-hover:opacity-90 transition-opacity duration-500 animate-gradient-xy"></div>
        
        {/* The Navigation Bar Panel */}
        <nav className="relative flex items-center bg-white/95 backdrop-blur-xl rounded-full px-2 py-1.5 shadow-2xl shadow-black/20 ring-1 ring-white/10">
          {navItems.map((item) => {
            const isActive = currentModule === item.id;
            const Icon = item.icon;
            
            return (
              <button
                key={item.id}
                onClick={() => setModule(item.id)}
                className={`
                  relative flex flex-col items-center justify-center w-11 h-9 sm:w-12 sm:h-10 rounded-full transition-all duration-300 mx-0.5
                  ${isActive 
                    ? 'bg-stone-100 text-saffron-600 shadow-inner' 
                    : 'text-stone-400 hover:bg-stone-50 hover:text-stone-600'}
                `}
              >
                <div className={`transition-transform duration-300 ${isActive ? '-translate-y-0.5' : 'translate-y-0.5'}`}>
                   <Icon size={isActive ? 18 : 16} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                
                {/* Label under icon - Ultra Compact */}
                <span className={`
                  text-[8px] font-bold uppercase tracking-wider mt-0.5 transition-all duration-300
                  ${isActive ? 'opacity-100 translate-y-0 text-saffron-700' : 'opacity-0 scale-90 hidden'}
                `}>
                  {item.label}
                </span>
                
                {/* Active Dot */}
                {isActive && (
                  <div className="absolute -bottom-1 w-1 h-1 rounded-full bg-saffron-500 shadow-[0_0_5px_rgba(245,158,11,0.8)]"></div>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default BottomNav;
