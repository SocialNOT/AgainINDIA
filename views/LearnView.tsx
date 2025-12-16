
import React, { useState, useEffect } from 'react';
import { MOKSHA_STAGES, LESSONS } from '../constants';
import { Lesson, UserProgress, MokshaStage } from '../types';
import { ChevronRight, CheckCircle2, Lock, ChevronDown, Star, Sparkles, Map, Footprints, X, ShieldAlert } from 'lucide-react';
import ModuleIntro from '../components/ModuleIntro';

interface LearnViewProps {
  progress: UserProgress;
  onSelectLesson: (lesson: Lesson) => void;
  activeLesson: Lesson | null;
  onCloseLesson: () => void;
  onCompleteLesson: (lessonId: number, score: number) => void;
}

const LearnView: React.FC<LearnViewProps> = ({ progress, onSelectLesson, activeLesson }) => {
  const [expandedStage, setExpandedStage] = useState<number | null>(1);
  const [lockedModalStage, setLockedModalStage] = useState<MokshaStage | null>(null);
  const [showIntro, setShowIntro] = useState(true);
  
  // Calculate specific progress metrics
  const totalCompleted = progress.completedLessons.length;
  const totalSteps = 108; // Fixed total
  const remainingSteps = totalSteps - totalCompleted;
  const progressPercentage = Math.min(100, Math.round((totalCompleted / totalSteps) * 100));

  // Identify the "Current Stage" (The first stage that has incomplete lessons)
  const firstIncompleteLesson = LESSONS.find(l => !progress.completedLessons.includes(l.id));
  const currentActiveStageId = firstIncompleteLesson ? firstIncompleteLesson.stage : MOKSHA_STAGES[MOKSHA_STAGES.length - 1].id;

  // Auto-expand the stage of the last active lesson on mount
  useEffect(() => {
    if (progress.last_active_lesson) {
      const lesson = LESSONS.find(l => l.id === progress.last_active_lesson);
      if (lesson) {
        setExpandedStage(lesson.stage);
      }
    } else {
      setExpandedStage(currentActiveStageId);
    }
  }, []);

  const handleStageClick = (stage: MokshaStage, isLocked: boolean) => {
    if (isLocked) {
      setLockedModalStage(stage);
    } else {
      setExpandedStage(expandedStage === stage.id ? null : stage.id);
    }
  };

  if (showIntro) {
    return (
      <ModuleIntro 
        title="Module 1: The Path"
        hook="Walk the Path of 108 Steps"
        description="Ancient wisdom isn't just read. It is traveled. Move from awakening to ultimate freedom."
        features={[
          "Structured Evolutionary Stages",
          "Interactive Wisdom Parables",
          "Daily Micro-Steps"
        ]}
        Icon={Map}
        colorClass="text-saffron-500"
        bgClass="bg-saffron-600"
        onStart={() => setShowIntro(false)}
      />
    );
  }

  return (
    // Flex Layout:
    // pt-20 (80px) clears the fixed App Header
    <div className="h-full w-full flex flex-col pt-20 relative bg-stone-50 dark:bg-slate-950">
        
      {/* 1. PROGRESS HEADER - THE PILL TAB (High Contrast) */}
      <div className="flex-none w-full bg-saffron-600 dark:bg-saffron-700 border-b border-saffron-700 dark:border-saffron-800 z-30 shadow-md animate-in slide-in-from-top-2 duration-500">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between text-white">
           
           {/* Left Side: Label & Counters */}
           <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6">
              <div className="flex items-center space-x-2">
                 <Map size={16} className="text-white" />
                 <h2 className="font-serif text-sm font-bold text-white uppercase tracking-widest shadow-sm">
                   The Path
                 </h2>
              </div>
              
              <div className="hidden sm:block h-4 w-px bg-saffron-400/50"></div>
              
              <div className="flex items-center space-x-4 mt-1 sm:mt-0">
                 <div className="flex items-center space-x-1.5 text-[10px] font-bold uppercase tracking-widest text-saffron-100">
                    <CheckCircle2 size={12} />
                    <span>{totalCompleted} Covered</span>
                 </div>
                 <div className="flex items-center space-x-1.5 text-[10px] font-bold uppercase tracking-widest text-saffron-200">
                    <Footprints size={12} />
                    <span>{remainingSteps} Left</span>
                 </div>
              </div>
           </div>

           {/* Right Side: Visual Bar */}
           <div className="flex items-center space-x-3 pl-4">
              <span className="text-xs font-serif font-bold text-white">{progressPercentage}%</span>
              <div className="w-16 h-1.5 bg-black/20 rounded-full overflow-hidden backdrop-blur-sm">
                 <div className="h-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)] transition-all duration-1000 ease-out" style={{ width: `${progressPercentage}%` }}></div>
              </div>
           </div>
        </div>
      </div>

      {/* 2. SCROLLABLE CONTENT AREA */}
      <div className="flex-1 overflow-y-auto scroll-smooth">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 pb-36 space-y-4">
          {MOKSHA_STAGES.map((stage, stageIndex) => {
            const stageLessons = LESSONS.filter(l => l.stage === stage.id);
            const isExpanded = expandedStage === stage.id;
            const completedLessonsInStage = stageLessons.filter(l => progress.completedLessons.includes(l.id));
            const completedCount = completedLessonsInStage.length;
            const totalCount = stageLessons.length;
            
            // Safe access to first lesson for locking logic
            const firstLessonOfStage = stageLessons.length > 0 ? stageLessons[0] : null;
            
            // Logic: Stage Locked if previous stage not done. 
            const isStageLocked = firstLessonOfStage 
              ? (firstLessonOfStage.id > 1 && !progress.completedLessons.includes(firstLessonOfStage.id - 1))
              : true;
            
            // Is this the stage the user is currently working on?
            const isCurrentPhase = stage.id === currentActiveStageId;

            return (
              <div key={stage.id} className="relative">
                {/* Connecting Line */}
                {stageIndex < MOKSHA_STAGES.length - 1 && (
                  <div className="absolute left-6 top-16 bottom-0 w-0.5 bg-stone-200 dark:bg-slate-800 -z-10"></div>
                )}

                {/* Stage Header */}
                <div 
                  onClick={() => handleStageClick(stage, isStageLocked)}
                  className={`
                    relative z-10 rounded-2xl transition-all duration-300 border cursor-pointer overflow-hidden group
                    ${isExpanded 
                      ? 'bg-stone-900 text-white border-stone-900 shadow-2xl scale-[1.01] dark:bg-slate-100 dark:text-slate-900' 
                      : isCurrentPhase
                        ? 'bg-white dark:bg-slate-900 border-saffron-400 dark:border-saffron-500 ring-1 ring-saffron-100 dark:ring-saffron-900/30 shadow-md'
                        : 'bg-white dark:bg-slate-900 border-stone-200 dark:border-slate-800 hover:border-saffron-400 dark:hover:border-saffron-500 shadow-sm'}
                    ${isStageLocked ? 'opacity-70 grayscale-[0.5]' : ''}
                  `}
                >
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {/* Stage Pill Indicator - Smaller */}
                      <div className={`
                        w-10 h-10 rounded-xl flex flex-col items-center justify-center font-serif font-bold text-sm shadow-inner transition-colors relative
                        ${isExpanded 
                           ? 'bg-saffron-500 text-white shadow-lg shadow-saffron-500/30' 
                           : isCurrentPhase
                             ? 'bg-saffron-100 text-saffron-700 dark:bg-saffron-900/40 dark:text-saffron-300'
                             : 'bg-stone-100 dark:bg-slate-800 text-stone-500 dark:text-slate-400'}
                      `}>
                        {stage.id}
                        
                        {/* Current Indicator Dot */}
                        {isCurrentPhase && !isExpanded && (
                          <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-slate-900 animate-pulse"></div>
                        )}
                      </div>

                      <div>
                        <div className="flex items-center space-x-2">
                           {/* Typo Update: Smaller, Uppercase, Tracking Wide */}
                           <h3 className={`font-serif text-sm font-bold uppercase tracking-widest ${isExpanded ? 'text-white dark:text-slate-900' : 'text-stone-800 dark:text-slate-100'}`}>
                             {stage.name}
                           </h3>
                           {isCurrentPhase && !isExpanded && (
                             <span className="px-1.5 py-0.5 bg-saffron-100 dark:bg-saffron-900/30 text-saffron-700 dark:text-saffron-300 text-[8px] font-bold uppercase tracking-widest rounded-full">
                               Active
                             </span>
                           )}
                        </div>
                        
                        <div className="flex items-center mt-1 space-x-2">
                           <div className={`h-1 w-16 rounded-full overflow-hidden ${isExpanded ? 'bg-white/20 dark:bg-black/20' : 'bg-stone-200 dark:bg-slate-700'}`}>
                              <div className={`h-full ${isExpanded ? 'bg-saffron-500' : 'bg-saffron-500'}`} style={{ width: totalCount > 0 ? `${(completedCount / totalCount) * 100}%` : '0%' }}></div>
                           </div>
                           <span className={`text-[9px] font-bold uppercase tracking-widest ${isExpanded ? 'text-white/70 dark:text-slate-900/70' : 'text-stone-400 dark:text-slate-500'}`}>
                             {completedCount}/{totalCount}
                           </span>
                        </div>
                      </div>
                    </div>
                    
                    {!isStageLocked && (
                      <div className={`transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                        <ChevronDown size={16} className={isExpanded ? 'text-white dark:text-slate-900' : 'text-stone-400'} />
                      </div>
                    )}
                    {isStageLocked && <Lock size={16} className="text-stone-400" />}
                  </div>
                </div>

                {/* Lesson List */}
                <div className={`
                   mt-3 ml-5 pl-6 border-l border-stone-200 dark:border-slate-800 space-y-3 transition-all duration-500 ease-in-out
                   ${isExpanded && stageLessons.length > 0 ? 'max-h-[2000px] opacity-100 pb-4' : 'max-h-0 opacity-0 overflow-hidden'}
                `}>
                  {stageLessons.length === 0 && isExpanded && (
                    <div className="p-4 text-xs text-stone-500 italic">Coming soon...</div>
                  )}
                  {stageLessons.map((lesson, idx) => {
                    const isCompleted = progress.completedLessons.includes(lesson.id);
                    const isLocked = lesson.id > 1 && !progress.completedLessons.includes(lesson.id - 1);
                    const isNext = !isCompleted && !isLocked;

                    return (
                      <button 
                        key={lesson.id}
                        onClick={() => !isLocked && onSelectLesson(lesson)}
                        disabled={isLocked}
                        className={`
                          group relative w-full text-left rounded-lg border transition-all duration-300 p-4
                          ${isCompleted 
                            ? 'bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-900/30' 
                            : isNext 
                              ? 'bg-saffron-500 dark:bg-saffron-600 border-saffron-500 dark:border-saffron-600 shadow-xl shadow-saffron-500/20 scale-[1.01] z-10' 
                              : isLocked
                                ? 'bg-stone-50 dark:bg-slate-900 border-transparent opacity-60'
                                : 'bg-white dark:bg-slate-800 border-stone-100 dark:border-slate-700 hover:border-stone-300 dark:hover:border-slate-600'}
                        `}
                      >
                         {/* Timeline Node Connector */}
                        <div className={`
                          absolute -left-[31px] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 z-10 transition-colors duration-300
                          ${isCompleted 
                            ? 'bg-emerald-500 border-emerald-500' 
                            : isNext 
                              ? 'bg-white border-saffron-500 ring-2 ring-saffron-200 dark:ring-saffron-900/50' 
                              : 'bg-stone-200 dark:bg-slate-700 border-stone-200 dark:border-slate-700'}
                        `}></div>

                        {/* Horizontal Line Connector */}
                        <div className="absolute -left-6 top-1/2 w-6 h-px bg-stone-200 dark:bg-slate-800"></div>

                        <div className="flex justify-between items-start">
                          <div className="flex-1 pr-4">
                            <div className="flex items-center space-x-2 mb-1.5">
                               <span className={`text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded ${isCompleted ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300' : isNext ? 'bg-white/25 text-white backdrop-blur-sm' : 'bg-stone-100 text-stone-500 dark:bg-slate-700 dark:text-slate-400'}`}>
                                 Step {idx + 1}
                               </span>
                               {isNext && <span className="text-[9px] font-bold uppercase tracking-widest text-white flex items-center shadow-sm"><Sparkles size={8} className="mr-1"/> Next</span>}
                            </div>
                            
                            {/* Typo Update: Reduced Size */}
                            <h4 className={`font-serif text-lg font-bold leading-tight mb-1 ${isCompleted ? 'text-emerald-900 dark:text-emerald-100' : isNext ? 'text-white' : 'text-stone-900 dark:text-slate-100'}`}>
                              {lesson.title}
                            </h4>
                            
                            <p className={`text-xs line-clamp-1 ${isNext ? 'text-white/90' : 'text-stone-500 dark:text-slate-400'}`}>
                              {lesson.summary.short}
                            </p>
                          </div>

                          <div className="pt-1">
                             {isLocked ? (
                               <Lock size={14} className="text-stone-300 dark:text-slate-600" />
                             ) : isCompleted ? (
                               <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                                 <Star size={12} className="text-emerald-600 dark:text-emerald-400 fill-current" />
                               </div>
                             ) : (
                               <div className={`w-8 h-8 rounded-full transition-colors flex items-center justify-center ${isNext ? 'bg-white/20 text-white' : 'bg-stone-100 dark:bg-slate-700 text-stone-400 group-hover:bg-saffron-100 group-hover:text-saffron-600'}`}>
                                 <ChevronRight size={16} />
                               </div>
                             )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* LOCKED STAGE MODAL */}
      {lockedModalStage && (
         <div className="fixed inset-0 z-[100] bg-stone-900/80 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-200">
            <div className="glass-panel w-full max-w-sm rounded-2xl p-8 shadow-2xl animate-in zoom-in-95 duration-200 bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-700 relative text-center">
               
               <button 
                 onClick={() => setLockedModalStage(null)}
                 className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors"
               >
                 <X size={20} />
               </button>

               <div className="w-20 h-20 bg-stone-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                 <Lock size={32} className="text-stone-400 dark:text-slate-500" />
               </div>

               <h2 className="font-serif text-2xl font-bold text-stone-900 dark:text-white mb-2">
                 The Gate is Closed
               </h2>

               <div className="w-12 h-1 bg-saffron-500 mx-auto rounded-full mb-6"></div>

               <p className="text-stone-600 dark:text-slate-400 mb-8 font-serif italic text-lg leading-relaxed">
                 "Knowledge is a ladder, not a leap. The wisdom of <span className="text-stone-900 dark:text-white font-bold">{lockedModalStage.name}</span> requires the foundation of the previous steps."
               </p>

               <div className="bg-stone-50 dark:bg-slate-800 rounded-xl p-4 mb-6 border border-stone-100 dark:border-slate-700">
                  <div className="flex items-center justify-center space-x-2 text-stone-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest">
                     <ShieldAlert size={14} />
                     <span>Unlock Requirement</span>
                  </div>
                  <div className="mt-2 text-stone-800 dark:text-slate-200 font-bold">
                    Complete Stage {lockedModalStage.id - 1}
                  </div>
               </div>

               <button 
                 onClick={() => setLockedModalStage(null)}
                 className="w-full py-4 bg-saffron-600 text-white rounded-xl font-bold hover:bg-saffron-500 transition-colors shadow-lg shadow-saffron-500/20"
               >
                 Return to Path
               </button>
            </div>
         </div>
      )}
    </div>
  );
};

export default LearnView;
