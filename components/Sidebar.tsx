import React, { useState, useEffect } from 'react';
import { Chapter, Category } from '../types';
import { CATEGORY_COLORS, CATEGORY_BG } from '../constants';
import * as Icons from 'lucide-react';
import { ChevronDown, ChevronRight, Hexagon, Search, X, FileText } from 'lucide-react';

interface SidebarProps {
  chapters: Chapter[];
  selectedChapterId: string | null;
  onSelectChapter: (id: string) => void;
  isOpen: boolean;
  onCloseMobile: () => void;
}

const CATEGORY_ORDER = [
  Category.RED,
  Category.BLUE,
  Category.PURPLE,
  Category.GRC,
  Category.STRATEGY
];

const CATEGORY_LABELS: Record<Category, string> = {
  [Category.RED]: 'Red Team Ops',
  [Category.BLUE]: 'Blue Team Defense',
  [Category.PURPLE]: 'Purple Team / Cloud',
  [Category.GRC]: 'GRC & Risk',
  [Category.STRATEGY]: 'Command Strategy',
  [Category.GENERAL]: 'General'
};

const Sidebar: React.FC<SidebarProps> = ({ chapters, selectedChapterId, onSelectChapter, isOpen, onCloseMobile }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    [Category.RED]: true,
    [Category.BLUE]: true,
    [Category.PURPLE]: true,
    [Category.GRC]: true,
    [Category.STRATEGY]: true,
  });

  // Auto-expand all categories when searching
  useEffect(() => {
    if (searchQuery) {
      setExpandedCategories(prev => {
        const next = { ...prev };
        CATEGORY_ORDER.forEach(cat => next[cat] = true);
        return next;
      });
    }
  }, [searchQuery]);

  // Auto-expand and scroll to selected chapter
  useEffect(() => {
    if (selectedChapterId) {
      const chapter = chapters.find(c => c.id === selectedChapterId);
      if (chapter) {
        // Ensure category is expanded
        setExpandedCategories(prev => ({
          ...prev,
          [chapter.category]: true
        }));
        
        // Wait for the expansion render, then scroll to element
        setTimeout(() => {
          const el = document.getElementById(`chapter-${chapter.id}`);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
        }, 150);
      }
    }
  }, [selectedChapterId, chapters]);

  const toggleCategory = (cat: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [cat]: !prev[cat]
    }));
  };

  const filteredChapters = chapters.filter(chapter => 
    chapter.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    chapter.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedChapters = filteredChapters.reduce((acc, chapter) => {
    if (!acc[chapter.category]) acc[chapter.category] = [];
    acc[chapter.category].push(chapter);
    return acc;
  }, {} as Record<Category, Chapter[]>);

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={`fixed inset-0 bg-black/80 z-40 transition-opacity lg:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onCloseMobile}
      />

      {/* Sidebar Content */}
      <aside 
        className={`fixed top-0 left-0 z-50 h-full w-80 bg-cyber-darker border-r border-slate-800/60 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="h-full flex flex-col bg-[#020617] relative">
          {/* Decorative side strip */}
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-cyber-red via-cyber-purple to-cyber-blue"></div>

          <div className="p-6 pb-4 border-b border-slate-800/50">
            <div className="flex items-center gap-3 cursor-pointer mb-4" onClick={() => onSelectChapter('')}>
              <div className="w-10 h-10 rounded bg-slate-900 border border-slate-700 flex items-center justify-center relative overflow-hidden group">
                 <div className="absolute inset-0 bg-gradient-to-br from-cyber-red/20 via-cyber-purple/20 to-cyber-blue/20 group-hover:opacity-100 opacity-50 transition-opacity"></div>
                <Icons.BookOpen className="text-white w-5 h-5 relative z-10" />
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-tight text-white leading-none font-mono">PURPLE_BOOK</h1>
                <p className="text-[10px] text-cyber-muted mt-1 uppercase tracking-widest">v2.0 // Classified</p>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-500 group-focus-within:text-cyber-blue transition-colors" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-8 py-2 border border-slate-700 rounded-lg leading-5 bg-slate-900/50 text-slate-300 placeholder-slate-500 focus:outline-none focus:bg-slate-900 focus:border-cyber-blue focus:ring-1 focus:ring-cyber-blue sm:text-sm transition-all"
                placeholder="Search modules..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-white"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
            {filteredChapters.length === 0 && searchQuery && (
              <div className="text-center py-8">
                <p className="text-slate-500 text-sm">No modules found matching query.</p>
              </div>
            )}

            {CATEGORY_ORDER.map((category) => {
              const categoryChapters = groupedChapters[category];
              if (!categoryChapters) return null;
              
              const isExpanded = expandedCategories[category];
              
              return (
                <div key={category} className="space-y-1">
                  <button 
                    onClick={() => toggleCategory(category)}
                    className="w-full flex items-center justify-between p-2 text-xs font-bold text-slate-400 uppercase tracking-wider hover:text-white transition-colors"
                  >
                    <div className="flex items-center gap-2">
                       <Hexagon className={`w-3 h-3 ${CATEGORY_COLORS[category].split(' ')[0]}`} fill="currentColor" fillOpacity={0.2} />
                       {CATEGORY_LABELS[category]}
                    </div>
                    {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                  </button>

                  {isExpanded && (
                    <div className="space-y-0.5 ml-2 pl-2 border-l border-slate-800">
                      {categoryChapters.map((chapter) => {
                        // Dynamic icon lookup with fallback to FileText
                        const IconComponent = (Icons as any)[chapter.icon] || FileText;
                        const isSelected = selectedChapterId === chapter.id;
                        
                        return (
                          <button
                            key={chapter.id}
                            id={`chapter-${chapter.id}`}
                            onClick={() => {
                              onSelectChapter(chapter.id);
                              onCloseMobile();
                            }}
                            className={`w-full text-left flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 group relative overflow-hidden ${
                              isSelected 
                                ? 'bg-slate-800/80 text-white' 
                                : 'text-slate-400 hover:bg-slate-900/50 hover:text-slate-200'
                            }`}
                          >
                            {isSelected && (
                               <div className={`absolute left-0 top-0 bottom-0 w-0.5 ${CATEGORY_BG[category]}`}></div>
                            )}
                            {/* Render icon with fallback */}
                            <IconComponent className={`w-4 h-4 min-w-[16px] transition-colors ${isSelected ? CATEGORY_COLORS[category].split(' ')[0] : 'text-slate-600 group-hover:text-slate-400'}`} />
                            <div className="flex-1 min-w-0">
                                <span className="text-sm font-medium truncate block">{chapter.title}</span>
                                {searchQuery && (
                                    <span className="text-[10px] text-slate-600 truncate block mt-0.5">{chapter.description}</span>
                                )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          <div className="p-4 border-t border-slate-800 bg-slate-950/30">
             <div className="flex items-center gap-2 text-[10px] text-slate-600 font-mono">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span>SYSTEM ONLINE</span>
                <span className="ml-auto">LATENCY: 12ms</span>
             </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;