
import React, { useState } from 'react';
import { Lesson } from '../types';
import { Award, Check, X, ArrowRight, RotateCcw } from 'lucide-react';

interface QuizViewProps {
  lesson: Lesson;
  onComplete: (score: number, passed: boolean) => void;
  onCancel: () => void;
}

const QuizView: React.FC<QuizViewProps> = ({ lesson, onComplete, onCancel }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);

  const question = lesson.quiz[currentQuestionIndex];
  const passingScore = Math.ceil(lesson.quiz.length * 0.7); // 70% to pass

  const handleOptionClick = (option: string) => {
    if (isAnswered) return;
    setSelectedOption(option);
    setIsAnswered(true);
    
    let newScore = score;
    if (option === question.answer) {
      newScore = score + 1;
      setScore(newScore);
    }

    setTimeout(() => {
      if (currentQuestionIndex < lesson.quiz.length - 1) {
        setCurrentQuestionIndex(i => i + 1);
        setSelectedOption(null);
        setIsAnswered(false);
      } else {
        // Quiz finished
        const finalScore = option === question.answer ? score + 1 : score;
        const passed = finalScore >= passingScore;
        onComplete(finalScore, passed);
      }
    }, 1500);
  };

  return (
    <div className="h-full w-full flex flex-col pt-4 animate-in slide-in-from-right duration-300">
      <div className="flex justify-between items-center mb-6">
        <button 
          onClick={onCancel}
          className="text-stone-400 hover:text-stone-600 dark:text-slate-500"
        >
          Cancel
        </button>
        <span className="text-xs font-bold text-saffron-600">{currentQuestionIndex + 1}/{lesson.quiz.length}</span>
      </div>

      <div className="flex-1 flex flex-col max-w-md mx-auto w-full">
        <h3 className="font-serif text-xl font-bold mb-8 leading-snug">
          {question.question}
        </h3>

        <div className="space-y-3">
          {question.options.map((option, idx) => {
            let stateStyle = "border-stone-200 dark:border-slate-700 hover:border-saffron-400 dark:hover:border-saffron-500 bg-white dark:bg-slate-800";
            
            if (isAnswered) {
              if (option === question.answer) {
                stateStyle = "border-green-500 bg-green-50 dark:bg-green-900/20";
              } else if (option === selectedOption) {
                stateStyle = "border-red-500 bg-red-50 dark:bg-red-900/20";
              } else {
                stateStyle = "opacity-50";
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleOptionClick(option)}
                disabled={isAnswered}
                className={`w-full p-4 rounded-xl border-2 text-left transition-all duration-200 flex items-center justify-between ${stateStyle}`}
              >
                <span className="font-sans text-sm text-stone-800 dark:text-slate-200">{option}</span>
                {isAnswered && option === question.answer && <Check size={18} className="text-green-600" />}
                {isAnswered && option === selectedOption && option !== question.answer && <X size={18} className="text-red-600" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default QuizView;
