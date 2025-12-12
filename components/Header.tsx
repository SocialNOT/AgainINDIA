
import React from 'react';
import { Sun, Moon, Settings, Palette } from 'lucide-react';
import { ThemeConfig } from '../types';

interface HeaderProps {
  theme: 'day' | 'night';
  currentThemeConfig: ThemeConfig;
  toggleTheme: () => void;
  togglePalette: () => void;
  openSettings: () => void;
  resetView: () => void;
}

const Header: React.FC<HeaderProps> = ({ theme, currentThemeConfig, toggleTheme, togglePalette, openSettings, resetView }) => {
  return (
    <header className="fixed top-4 left-4 right-4 z-50 h-16 flex items-center justify-between glass-panel rounded-2xl px-6 shadow-sm transition-all duration-500">
      
      {/* Brand */}
      <div 
        onClick={resetView}
        className="flex items-center cursor-pointer group"
      >
        <div className="relative">
          <span className={`font-serif text-xl font-bold tracking-widest bg-clip-text text-transparent bg-gradient-to-r ${theme === 'day' ? 'from-saffron-600 to-red-600' : 'from-saffron-400 to-yellow-200'} group-hover:opacity-80 transition-opacity`}>
            AgainINDIA
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center space-x-2">
        {/* Theme Palette Switcher */}
        <button 
          onClick={togglePalette}
          className="p-2.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 text-stone-500 dark:text-slate-300 transition-all duration-300 relative group"
        >
          <Palette size={20} className="text-saffron-500" />
          <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-stone-800 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none transition-opacity">
             {currentThemeConfig.name}
          </span>
        </button>

        {/* Day/Night Toggle */}
        <button 
          onClick={toggleTheme}
          className="p-2.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 text-stone-500 dark:text-slate-300 transition-all duration-300"
        >
          {theme === 'day' ? <Sun size={20} className="text-saffron-500" /> : <Moon size={20} className="text-saffron-300" />}
        </button>

        <button 
          onClick={openSettings}
          className="p-2.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 text-stone-500 dark:text-slate-300 transition-all duration-300"
        >
          <Settings size={20} />
        </button>
      </div>
    </header>
  );
};

export default Header;
