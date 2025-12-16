
import React, { useState, useEffect } from 'react';
import { Search, Book, Bookmark, X, Filter, User, LayoutGrid, List, Users, Sparkles, Plus, Loader2, ArrowRight, Clock, PlayCircle, ChevronDown, Check } from 'lucide-react';
import { LIBRARY_BOOKS, LIBRARY_CATEGORIES } from '../libraryData';
import { LibraryBook, UserProgress } from '../types';
import { findExternalLibraryItem } from '../services/geminiService';
import ModuleIntro from '../components/ModuleIntro';

type ViewMode = 'categorical' | 'alphabetical' | 'author' | 'ongoing';

interface LibraryViewProps {
  onOpenBook: (book: LibraryBook) => void;
  progress: UserProgress;
}

const LibraryView: React.FC<LibraryViewProps> = ({ onOpenBook, progress }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategories, setActiveCategories] = useState<string[]>(['All']);
  const [selectedBook, setSelectedBook] = useState<LibraryBook | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('categorical');
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  
  // FanBase State (Persisted)
  const [fanBaseBooks, setFanBaseBooks] = useState<LibraryBook[]>(() => {
    try {
      const saved = localStorage.getItem('fanBaseBooks');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  
  const [isSearchingAI, setIsSearchingAI] = useState(false);
  const [aiSearchError, setAiSearchError] = useState<string | null>(null);

  // Persist FanBase
  useEffect(() => {
    localStorage.setItem('fanBaseBooks', JSON.stringify(fanBaseBooks));
  }, [fanBaseBooks]);

  const toggleCategory = (cat: string) => {
    if (cat === 'All') {
      setActiveCategories(['All']);
      return;
    }
    setActiveCategories(prev => {
      if (prev.includes('All')) return [cat];
      if (prev.includes(cat)) {
        const newCats = prev.filter(c => c !== cat);
        return newCats.length === 0 ? ['All'] : newCats;
      }
      return [...prev, cat];
    });
  };

  // Combine static library + FanBase
  const allBooks = [...LIBRARY_BOOKS, ...fanBaseBooks];

  // Dynamic Category List including FanBase if exists
  const dynamicCategories = ['All', ...(fanBaseBooks.length > 0 ? ['FanBase'] : []), ...LIBRARY_CATEGORIES.filter(c => c !== 'All')];

  const filteredBooks = allBooks.filter(book => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = 
      book.title.toLowerCase().includes(term) || 
      (book.author && book.author.toLowerCase().includes(term)) ||
      (book.subCategory && book.subCategory.toLowerCase().includes(term));
    
    // FanBase Filtering Logic
    const isFanBase = book.id.startsWith('generated');
    const isFanBaseFilterActive = activeCategories.includes('FanBase');
    
    let matchesCategory = false;
    if (activeCategories.includes('All')) {
      matchesCategory = true;
    } else {
      // Check if book matches any active category
      const matchesStandardCat = activeCategories.includes(book.category);
      // Special check for FanBase filter
      if (isFanBaseFilterActive) {
        if (activeCategories.length === 1) {
           // Only FanBase selected
           matchesCategory = isFanBase;
        } else {
           // FanBase + Others selected (e.g. FanBase OR Philosophy)
           matchesCategory = isFanBase || matchesStandardCat;
        }
      } else {
        matchesCategory = matchesStandardCat;
      }
    }
    
    return matchesSearch && matchesCategory;
  });

  const handleAiSearch = async () => {
    if (!searchTerm.trim()) return;
    
    setIsSearchingAI(true);
    setAiSearchError(null);
    
    try {
      const newBook = await findExternalLibraryItem(searchTerm);
      
      if (newBook) {
        // ROBUST DUPLICATE CHECK
        const exists = allBooks.some(b => 
          b.title.trim().toLowerCase() === newBook.title.trim().toLowerCase() ||
          (b.author && newBook.author && b.author.trim().toLowerCase() === newBook.author.trim().toLowerCase() && b.title.trim().toLowerCase().includes(newBook.title.trim().toLowerCase()))
        );

        if (!exists) {
          setFanBaseBooks(prev => [newBook, ...prev]);
          setSelectedBook(newBook); // Open it immediately
        } else {
          setAiSearchError("This text is already in the archives.");
        }
      } else {
        setAiSearchError("The Akashic Records could not verify this text as a valid IKS source.");
      }
    } catch (e) {
      setAiSearchError("Connection to the Ether interrupted.");
    } finally {
      setIsSearchingAI(false);
    }
  };

  const handleStartReading = (book: LibraryBook) => {
    setSelectedBook(null);
    onOpenBook(book);
  };

  // Helper to get progress for a book
  const getBookProgress = (bookId: string) => {
    const session = progress.bookSessions?.[bookId];
    if (!session || !session.chapters || session.chapters.length === 0) return null;
    return Math.round((session.completedChapters.length / session.chapters.length) * 100);
  };

  const renderBookCard = (book: LibraryBook) => {
    const completion = getBookProgress(book.id);
    return (
      <div 
        key={book.id}
        onClick={() => setSelectedBook(book)}
        className="group relative flex bg-white dark:bg-slate-900 rounded-xl overflow-hidden border border-stone-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer h-32"
      >
        {/* Left Color Strip */}
        <div className={`w-3 h-full bg-gradient-to-b ${book.color}`}></div>
        
        <div className="p-4 flex flex-col justify-between flex-1 relative z-10">
            <div>
              <div className="flex justify-between items-start">
                <h4 className="font-serif font-bold text-stone-900 dark:text-slate-100 line-clamp-2 leading-tight pr-2 group-hover:text-saffron-600 transition-colors">
                  {book.title}
                </h4>
                {book.id.startsWith('generated') && (
                  <Sparkles size={12} className="text-saffron-500 shrink-0" />
                )}
              </div>
              <p className="text-xs text-stone-500 dark:text-slate-400 mt-1 line-clamp-1">
                {book.author || "Unknown Author"}
              </p>
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-[9px] font-bold uppercase tracking-wider bg-stone-100 dark:bg-slate-800 text-stone-600 dark:text-slate-400 px-2 py-0.5 rounded-md border border-stone-200 dark:border-slate-700">
                {book.subCategory || "General"}
              </span>
              
              {/* Mini Progress Bar on Card */}
              {completion !== null && (
                <div className="flex items-center space-x-2">
                    <div className="w-16 h-1 bg-stone-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500" style={{ width: `${completion}%` }}></div>
                    </div>
                    <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400">{completion}%</span>
                </div>
              )}
            </div>
        </div>
        
        {/* Decorative circle */}
        <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-gradient-to-br from-stone-50 to-stone-100 dark:from-slate-800 dark:to-slate-900 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-0"></div>
      </div>
    );
  };

  // ... (Rest of render methods: renderCategoricalView, renderAlphabeticalView, renderAuthorView, renderOngoingView - unchanged but included in logic)
  
  const renderCategoricalView = () => {
    // Separate FanBase books and Standard books
    const fanBaseItems = filteredBooks.filter(b => b.id.startsWith('generated'));
    const standardItems = filteredBooks.filter(b => !b.id.startsWith('generated'));

    // Group Standard Books by Category
    const grouped: Record<string, LibraryBook[]> = {};
    standardItems.forEach(book => {
      if (!grouped[book.category]) grouped[book.category] = [];
      grouped[book.category].push(book);
    });

    return (
      <div className="space-y-10 pb-10">
        
        {/* FanBase Section - Rendered Separately at Top */}
        {fanBaseItems.length > 0 && (
           <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="flex items-center space-x-2 font-serif text-lg font-bold text-indigo-500 dark:text-indigo-400 uppercase tracking-widest mb-4 border-b border-indigo-100 dark:border-indigo-900/50 pb-2">
              <Sparkles size={18} className="text-indigo-500 animate-pulse" />
              <span>FanBase Collection</span>
              <span className="text-[10px] bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 px-2 py-0.5 rounded-full ml-2">
                User Discovered
              </span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
               {fanBaseItems.map(book => renderBookCard(book))}
            </div>
          </div>
        )}

        {/* Standard Categories */}
        {Object.keys(grouped).sort().map(category => (
          <div key={category} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="flex items-center space-x-2 font-serif text-lg font-bold text-stone-400 dark:text-slate-400 uppercase tracking-widest mb-4 border-b border-stone-200 dark:border-slate-800 pb-2">
              <span className="w-2 h-2 rounded-full bg-saffron-500"></span>
              <span>{category}</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {grouped[category].map(book => renderBookCard(book))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderAlphabeticalView = () => {
    const grouped: Record<string, LibraryBook[]> = {};
    filteredBooks.sort((a,b) => a.title.localeCompare(b.title)).forEach(book => {
      const letter = book.title.charAt(0).toUpperCase();
      if (!grouped[letter]) grouped[letter] = [];
      grouped[letter].push(book);
    });

    return (
      <div className="space-y-8 pb-10">
         {Object.keys(grouped).sort().map(letter => (
           <div key={letter} className="relative pl-12 animate-in fade-in duration-300">
              <div className="absolute left-0 top-0 w-8 h-8 rounded-lg bg-gradient-to-br from-stone-200 to-stone-300 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center font-serif font-bold text-stone-700 dark:text-slate-300 shadow-sm">
                {letter}
              </div>
              <div className="grid grid-cols-1 gap-2">
                 {grouped[letter].map(book => {
                   const completion = getBookProgress(book.id);
                   const isFanBase = book.id.startsWith('generated');
                   return (
                    <div 
                      key={book.id}
                      onClick={() => setSelectedBook(book)}
                      className="flex items-center justify-between p-4 rounded-xl bg-white dark:bg-slate-900 border border-stone-100 dark:border-slate-800 hover:border-saffron-300 dark:hover:border-saffron-500/50 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                    >
                        <div className="flex-1 mr-4">
                          <h4 className="font-bold text-stone-800 dark:text-slate-200 group-hover:text-saffron-600 transition-colors flex items-center">
                            {book.title}
                            {isFanBase && <Sparkles size={12} className="text-indigo-500 ml-2" />}
                          </h4>
                          <div className="flex items-center justify-between mt-1">
                            <p className="text-xs text-stone-500 dark:text-slate-400">
                              {book.author} <span className="mx-1 text-stone-300">•</span> {book.category}
                            </p>
                            {completion !== null && (
                              <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-full">
                                {completion}% Read
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-stone-50 dark:bg-slate-800 flex items-center justify-center group-hover:bg-saffron-50 dark:group-hover:bg-saffron-900/20 transition-colors shrink-0">
                          <ArrowRight size={14} className="text-stone-300 dark:text-slate-500 group-hover:text-saffron-500" />
                        </div>
                    </div>
                   );
                 })}
              </div>
           </div>
         ))}
      </div>
    );
  };

  const renderAuthorView = () => {
    const grouped: Record<string, LibraryBook[]> = {};
    filteredBooks.forEach(book => {
      const author = book.author || "Unknown";
      if (!grouped[author]) grouped[author] = [];
      grouped[author].push(book);
    });

    return (
      <div className="space-y-6 pb-10">
         {Object.keys(grouped).sort().map(author => (
           <div key={author} className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-stone-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow animate-in fade-in slide-in-from-bottom-2">
              <div className="flex items-center justify-between mb-4">
                 <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full bg-stone-100 dark:bg-slate-800 flex items-center justify-center border-2 border-white dark:border-slate-700 shadow-sm">
                        <User size={20} className="text-stone-500 dark:text-slate-400" />
                    </div>
                    <div>
                        <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-slate-100">
                        {author}
                        </h3>
                        <p className="text-[10px] uppercase tracking-widest text-stone-400 dark:text-slate-500">Author</p>
                    </div>
                 </div>
                 <span className="text-xs font-bold bg-saffron-50 dark:bg-saffron-900/20 text-saffron-600 dark:text-saffron-400 px-3 py-1 rounded-full">
                   {grouped[author].length} works
                 </span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                 {grouped[author].map(book => {
                   const completion = getBookProgress(book.id);
                   return (
                    <div 
                      key={book.id} 
                      onClick={() => setSelectedBook(book)}
                      className="p-3 rounded-lg border border-stone-100 dark:border-slate-700 hover:border-saffron-300 dark:hover:border-saffron-500 cursor-pointer flex items-center space-x-3 transition-all bg-stone-50/50 dark:bg-slate-950/50 hover:bg-white dark:hover:bg-slate-800"
                    >
                        <div className={`w-1.5 h-8 rounded-full bg-gradient-to-b ${book.color}`}></div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                             <h4 className="text-sm font-bold text-stone-800 dark:text-slate-200 line-clamp-1">{book.title}</h4>
                             {completion !== null && <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 mt-1"></div>}
                          </div>
                          <p className="text-[10px] text-stone-500 dark:text-slate-400 uppercase tracking-wider">{book.subCategory}</p>
                        </div>
                    </div>
                   );
                 })}
              </div>
           </div>
         ))}
      </div>
    );
  };

  const renderOngoingView = () => {
    // Get books with sessions from progress
    const sessions = progress.bookSessions || {};
    const sessionBookIds = Object.keys(sessions);
    
    // Sort by lastAccessed
    const sortedSessionIds = sessionBookIds.sort((a, b) => {
      return (sessions[b]?.lastAccessed || 0) - (sessions[a]?.lastAccessed || 0);
    });

    const ongoingBooks = sortedSessionIds
      .map(id => allBooks.find(b => b.id === id))
      .filter((b): b is LibraryBook => !!b);

    if (ongoingBooks.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in">
           <div className="w-20 h-20 bg-stone-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
              <Clock size={32} className="text-stone-300 dark:text-slate-600" />
           </div>
           <h3 className="font-serif text-xl font-bold text-stone-700 dark:text-slate-300 mb-2">No Active Readings</h3>
           <p className="text-stone-500 dark:text-slate-500 max-w-xs text-sm">
             Start reading a book from the library to see it appear here.
           </p>
           <button 
             onClick={() => setViewMode('categorical')}
             className="mt-6 px-6 py-3 bg-saffron-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-saffron-500/20 hover:scale-105 transition-transform"
           >
             Explore Library
           </button>
        </div>
      );
    }

    return (
      <div className="space-y-6 pb-10">
         {ongoingBooks.map(book => {
           const session = sessions[book.id];
           const progressPercent = Math.round((session.completedChapters.length / Math.max(session.chapters.length, 1)) * 100);
           const nextChapterIndex = session.lastActiveIndex !== null ? session.lastActiveIndex : session.completedChapters.length;
           const nextChapterName = session.chapters[nextChapterIndex] || "Conclusion";
           const isFanBase = book.id.startsWith('generated');
           
           return (
             <div 
               key={book.id}
               onClick={() => handleStartReading(book)}
               className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-stone-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-saffron-300 dark:hover:border-saffron-500/50 transition-all cursor-pointer group animate-in slide-in-from-bottom-2"
             >
                <div className="flex justify-between items-start mb-4">
                   <div className="flex items-start space-x-4">
                      {/* Book Cover / Color */}
                      <div className={`w-16 h-24 rounded-lg bg-gradient-to-br ${book.color} shadow-md flex items-center justify-center text-white/20`}>
                        <Book size={32} />
                      </div>
                      
                      <div>
                        <div className="flex space-x-2">
                           <div className="inline-block px-2 py-0.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 text-[9px] font-bold uppercase tracking-widest rounded mb-1">
                           {book.category}
                           </div>
                           {isFanBase && <div className="inline-block px-2 py-0.5 bg-saffron-50 dark:bg-saffron-900/30 text-saffron-600 dark:text-saffron-300 text-[9px] font-bold uppercase tracking-widest rounded mb-1">FanBase</div>}
                        </div>
                        <h3 className="font-serif text-xl font-bold text-stone-900 dark:text-slate-100 mb-1 group-hover:text-saffron-600 transition-colors">
                          {book.title}
                        </h3>
                        <p className="text-xs text-stone-500 dark:text-slate-400">
                          {book.author}
                        </p>
                      </div>
                   </div>
                   
                   <div className="w-10 h-10 rounded-full bg-saffron-50 dark:bg-saffron-900/20 text-saffron-600 dark:text-saffron-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <PlayCircle size={20} fill="currentColor" className="opacity-20" />
                      <PlayCircle size={20} className="absolute" />
                   </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                   <div className="flex justify-between text-[10px] uppercase font-bold tracking-widest text-stone-400 dark:text-slate-500">
                      <span>Progress</span>
                      <span className="text-stone-700 dark:text-slate-300">{progressPercent}%</span>
                   </div>
                   <div className="h-2 w-full bg-stone-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 transition-all duration-700" style={{ width: `${progressPercent}%` }}></div>
                   </div>
                </div>

                {/* Next Step Hint */}
                <div className="mt-4 pt-3 border-t border-stone-100 dark:border-slate-800 flex items-center text-xs text-stone-500 dark:text-slate-400">
                   <ArrowRight size={14} className="mr-2 text-saffron-500" />
                   <span className="truncate">
                     Continue: <span className="font-bold text-stone-700 dark:text-slate-300">{nextChapterName}</span>
                   </span>
                </div>
             </div>
           );
         })}
      </div>
    );
  };

  if (showIntro) {
    return (
      <ModuleIntro 
        title="Module 3: The Archives"
        hook="Access the Memory of Civilization"
        description="From the Vedas to Quantum Consciousness. Ask the Ether and receive validated knowledge."
        features={[
          "AI-Verified Sources Only",
          "Deep Akashic Search",
          "Personalized Study Plans"
        ]}
        Icon={Book}
        colorClass="text-blue-500"
        bgClass="bg-blue-600"
        onStart={() => setShowIntro(false)}
      />
    );
  }

  return (
    <div className="h-full flex flex-col pt-20 relative bg-stone-50 dark:bg-slate-950">
      
      {/* 1. FIXED CONTROL DECK (Title, Switcher, Search, Categories) */}
      <div className="flex-none px-6 pb-2 pt-4 bg-transparent z-30 space-y-5">
        
        {/* Top Row: Title & View Switcher */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif text-2xl font-bold text-stone-800 dark:text-slate-100 flex items-center">
               Archives 
               <span className="ml-2 text-[10px] w-6 h-6 flex items-center justify-center font-sans font-bold bg-stone-900 text-white rounded-full shadow-lg">
                 {filteredBooks.length}
               </span>
            </h2>
          </div>

          <div className="flex items-center bg-stone-900 p-1.5 rounded-xl border border-stone-800 shadow-xl shadow-saffron-500/10">
             <button onClick={() => setViewMode('categorical')} className={`p-1.5 rounded-lg transition-all ${viewMode === 'categorical' ? 'bg-saffron-600 text-white shadow-md' : 'text-stone-400 hover:text-white'}`} title="Categories">
               <LayoutGrid size={16} />
             </button>
             <button onClick={() => setViewMode('alphabetical')} className={`p-1.5 rounded-lg transition-all ${viewMode === 'alphabetical' ? 'bg-saffron-600 text-white shadow-md' : 'text-stone-400 hover:text-white'}`} title="A-Z">
               <List size={16} />
             </button>
             <button onClick={() => setViewMode('author')} className={`p-1.5 rounded-lg transition-all ${viewMode === 'author' ? 'bg-saffron-600 text-white shadow-md' : 'text-stone-400 hover:text-white'}`} title="Authors">
               <Users size={16} />
             </button>
             {/* Ongoing View Button */}
             <div className="w-px h-4 bg-stone-700 mx-1.5"></div>
             <button onClick={() => setViewMode('ongoing')} className={`p-1.5 rounded-lg transition-all ${viewMode === 'ongoing' ? 'bg-emerald-600 text-white shadow-md' : 'text-stone-400 hover:text-white'}`} title="Ongoing Readings">
               <Bookmark size={16} />
             </button>
          </div>
        </div>
        
        {/* HERO SEARCH BAR - Dark Background for Readability */}
        {viewMode !== 'ongoing' && (
          <div className="relative group animate-in fade-in slide-in-from-top-2">
            <div className="absolute -inset-[1px] bg-gradient-to-r from-saffron-500 via-pink-500 to-purple-600 rounded-2xl opacity-60 blur-sm transition-opacity duration-500 animate-pulse"></div>
            <div className="relative flex items-center bg-stone-900 rounded-2xl overflow-hidden shadow-2xl">
              <div className="pl-4 text-stone-400">
                <Search size={18} />
              </div>
              <input 
                  type="text"
                  placeholder="Search titles, authors, or ask Shruti..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAiSearch()}
                  className="w-full px-3 py-4 bg-transparent focus:outline-none text-sm font-bold placeholder:font-normal placeholder:text-stone-500 text-white"
              />
              <button 
                onClick={handleAiSearch}
                className="m-1.5 p-2.5 bg-gradient-to-r from-saffron-500 to-red-500 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all"
                title="Search"
              >
                <ArrowRight size={18} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        )}

        {/* CATEGORY DROPDOWN - Dark Background for Readability */}
        {viewMode !== 'ongoing' && (
          <div className="px-0 animate-in fade-in slide-in-from-top-2 relative z-20">
            <button
              onClick={() => setShowCategoryMenu(!showCategoryMenu)}
              className={`w-full flex items-center justify-between p-4 bg-stone-900 border rounded-2xl shadow-lg transition-all duration-200 group ${showCategoryMenu ? 'border-saffron-500 ring-1 ring-saffron-500' : 'border-stone-800 hover:border-saffron-500/50'}`}
            >
              <div className="flex items-center space-x-4">
                <div className={`p-2 rounded-lg transition-colors ${activeCategories.includes('All') ? 'bg-stone-800 text-stone-400' : 'bg-saffron-600 text-white shadow-lg shadow-saffron-500/30'}`}>
                   <Filter size={18} />
                </div>
                <div className="text-left">
                   <span className="block text-[10px] font-bold uppercase tracking-widest text-saffron-500 mb-0.5">Filter By</span>
                   <span className="block text-sm font-bold text-white">
                     {activeCategories.includes('All') ? 'All Categories' : activeCategories.length === 1 ? activeCategories[0] : `${activeCategories.length} Active Filters`}
                   </span>
                </div>
              </div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-stone-800 transition-transform duration-300 ${showCategoryMenu ? 'rotate-180 bg-stone-700' : ''}`}>
                 <ChevronDown size={16} className="text-stone-300" />
              </div>
            </button>

            {/* Backdrop to close */}
            {showCategoryMenu && (
              <div className="fixed inset-0 z-40" onClick={() => setShowCategoryMenu(false)}></div>
            )}

            {/* Dropdown Menu - Dark Theme */}
            {showCategoryMenu && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[60vh] overflow-y-auto z-50 ring-1 ring-white/10">
                 <div className="p-2 space-y-1">
                    {dynamicCategories.map(cat => {
                       const isActive = activeCategories.includes(cat);
                       const isFanBase = cat === 'FanBase';
                       return (
                         <button
                           key={cat}
                           onClick={() => toggleCategory(cat)}
                           className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${isActive ? 'bg-stone-800 text-white' : 'text-stone-400 hover:bg-stone-800/50 hover:text-stone-200'}`}
                         >
                            <div className="flex items-center space-x-3">
                               {isFanBase && <Sparkles size={14} className={isActive ? 'text-indigo-400' : 'text-stone-500'} />}
                               <span>{cat}</span>
                            </div>
                            {isActive && <div className="w-5 h-5 rounded-full bg-saffron-600 flex items-center justify-center"><Check size={12} className="text-white" /></div>}
                         </button>
                       );
                    })}
                 </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 2. MAIN SCROLLABLE CONTENT */}
      <div className="flex-1 overflow-y-auto px-6 pt-6 pb-28">
        
        {/* FanBase / Empty State Handler */}
        {filteredBooks.length === 0 && searchTerm && viewMode !== 'ongoing' && (
          <div className="flex flex-col items-center justify-center py-16 animate-in fade-in slide-in-from-bottom-4">
             <div className="relative mb-6">
                <div className="absolute inset-0 bg-saffron-500 blur-2xl opacity-20 rounded-full animate-pulse"></div>
                <div className="w-24 h-24 bg-gradient-to-br from-white to-stone-100 dark:from-slate-800 dark:to-slate-900 rounded-full flex items-center justify-center relative z-10 border border-white/50 dark:border-slate-700 shadow-xl">
                   <Sparkles size={32} className="text-saffron-500" />
                </div>
             </div>
             
             <h3 className="font-serif text-2xl font-bold text-stone-800 dark:text-slate-100 mb-2">
               Consult the Ether
             </h3>
             <p className="text-stone-500 dark:text-slate-400 text-center max-w-xs mb-8 leading-relaxed text-sm">
               "{searchTerm}" is not in our archives. Ask Shruti to search the Akashic Records for verified knowledge.
             </p>

             {aiSearchError && (
               <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300 text-xs font-bold rounded-xl border border-red-200 dark:border-red-800 flex items-center space-x-2">
                 <X size={14} />
                 <span>{aiSearchError}</span>
               </div>
             )}

             <button 
               onClick={handleAiSearch}
               disabled={isSearchingAI}
               className="w-full max-w-xs py-4 bg-stone-900 dark:bg-white text-white dark:text-stone-900 rounded-2xl font-bold shadow-2xl hover:scale-[1.02] transition-transform flex items-center justify-center space-x-3 disabled:opacity-70 disabled:scale-100"
             >
               {isSearchingAI ? (
                 <>
                   <Loader2 size={20} className="animate-spin" />
                   <span>Searching...</span>
                 </>
               ) : (
                 <>
                   <Sparkles size={20} />
                   <span>Summon Knowledge</span>
                 </>
               )}
             </button>
             
             <div className="mt-8 flex items-center space-x-2 text-[10px] text-stone-400 uppercase tracking-widest">
               <div className="w-1 h-1 bg-stone-300 rounded-full"></div>
               <span>AI-Verified Sources Only</span>
               <div className="w-1 h-1 bg-stone-300 rounded-full"></div>
             </div>
          </div>
        )}

        {/* Views */}
        {viewMode === 'categorical' && filteredBooks.length > 0 && renderCategoricalView()}
        {viewMode === 'alphabetical' && filteredBooks.length > 0 && renderAlphabeticalView()}
        {viewMode === 'author' && filteredBooks.length > 0 && renderAuthorView()}
        {viewMode === 'ongoing' && renderOngoingView()}

      </div>

      {/* Book Detail Modal */}
      {selectedBook && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-stone-900/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 border border-white/20 relative max-h-[85vh]">
            
            <button 
              onClick={() => setSelectedBook(null)}
              className="absolute top-4 right-4 z-20 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors backdrop-blur-md"
            >
              <X size={20} />
            </button>

            {/* Header Art with Pattern */}
            <div className={`h-56 bg-gradient-to-br ${selectedBook.color} relative p-8 flex flex-col justify-end overflow-hidden`}>
               <div className="absolute inset-0 opacity-20 mix-blend-overlay" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, black 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
               <div className="absolute -right-12 -top-12 text-white opacity-10 rotate-12">
                  <Book size={220} />
               </div>

               <div className="relative z-10">
                  <div className="flex space-x-2 mb-3">
                    <div className="inline-block px-3 py-1 bg-black/20 backdrop-blur-md rounded-lg text-white text-[10px] font-bold uppercase tracking-widest border border-white/20">
                      {selectedBook.category}
                    </div>
                    {/* FanBase Badge */}
                    {selectedBook.id.startsWith('generated') && (
                       <div className="inline-block px-3 py-1 bg-indigo-500/80 backdrop-blur-md rounded-lg text-white text-[10px] font-bold uppercase tracking-widest border border-white/20 flex items-center shadow-lg shadow-indigo-500/20">
                         <Sparkles size={10} className="mr-1" /> FanBase
                       </div>
                    )}
                  </div>
                  <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white shadow-black drop-shadow-lg leading-[1.1] mb-2">
                    {selectedBook.title}
                  </h2>
               </div>
            </div>

            <div className="p-8 overflow-y-auto">
              {selectedBook.author && (
                <div className="flex items-center space-x-4 mb-8 pb-8 border-b border-stone-100 dark:border-slate-800">
                  <div className="w-12 h-12 rounded-full bg-stone-100 dark:bg-slate-800 flex items-center justify-center text-stone-500 dark:text-slate-400 border border-stone-200 dark:border-slate-700">
                    <User size={24} />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Authored by</div>
                    <div className="text-xl font-bold text-stone-800 dark:text-slate-200 font-serif">{selectedBook.author}</div>
                  </div>
                </div>
              )}

              <div className="space-y-6">
                 {selectedBook.subCategory && (
                   <div>
                     <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">Topic</span>
                     <div className="mt-2 inline-flex items-center px-4 py-2 rounded-xl bg-stone-50 dark:bg-slate-800 text-sm font-medium text-stone-700 dark:text-slate-300 border border-stone-100 dark:border-slate-700">
                       {selectedBook.subCategory}
                     </div>
                   </div>
                 )}
                
                <div>
                   <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">Summary</span>
                   <p className="mt-3 text-lg text-stone-800 dark:text-slate-200 leading-relaxed font-serif">
                     {selectedBook.description || "Description unavailable in this excerpt."}
                   </p>
                </div>

                <div className="pt-6">
                  {progress.bookSessions?.[selectedBook.id] ? (
                     <button 
                      onClick={() => handleStartReading(selectedBook)}
                      className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:scale-[1.02] transition-transform flex items-center justify-center space-x-2 shadow-xl shadow-emerald-500/30"
                    >
                       <Bookmark size={20} />
                       <span>Resume Reading ({Math.round((progress.bookSessions[selectedBook.id].completedChapters.length / progress.bookSessions[selectedBook.id].chapters.length) * 100)}%)</span>
                    </button>
                  ) : (
                    <button 
                      onClick={() => handleStartReading(selectedBook)}
                      className="w-full py-4 bg-stone-900 dark:bg-white text-white dark:text-stone-900 rounded-2xl font-bold hover:scale-[1.02] transition-transform flex items-center justify-center space-x-2 shadow-xl"
                    >
                       <Book size={20} />
                       <span>Read Full Text</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LibraryView;
