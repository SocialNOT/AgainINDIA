
import React from 'react';

interface FooterProps {
  onClick: () => void;
}

const Footer: React.FC<FooterProps> = ({ onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="fixed bottom-0 left-0 right-0 z-40 h-8 flex items-center justify-center bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-t border-stone-200 dark:border-slate-800 cursor-pointer transition-colors hover:bg-stone-100 dark:hover:bg-slate-900 pb-1"
    >
      <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-stone-400 dark:text-slate-500 hover:text-saffron-600 dark:hover:text-saffron-400 transition-colors">
        Coded by Rajib Singh
      </span>
    </div>
  );
};

export default Footer;
