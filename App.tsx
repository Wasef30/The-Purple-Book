import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import ChapterView from './components/ChapterView';
import ChatInterface from './components/ChatInterface';
import { CHAPTERS, CATEGORY_COLORS, CATEGORY_BG } from './constants';
import { ContentType, GeneratedContent, Category } from './types';
import { generateChapterContent } from './services/geminiService';
import { Menu, Shield, Activity, Lock, Server, Cpu, Globe } from 'lucide-react';

const App: React.FC = () => {
  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(null);
  const [contentCache, setContentCache] = useState<Record<string, GeneratedContent>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Default selected content type
  const [currentContentType, setCurrentContentType] = useState<ContentType>('guide');

  const selectedChapter = CHAPTERS.find(c => c.id === selectedChapterId);

  const handleGenerateContent = async (type: ContentType) => {
    if (!selectedChapterId || !selectedChapter) return;
    
    // Check cache first for this specific type
    const cacheKey = `${selectedChapterId}-${type}`;
    
    // We update the view type immediately
    setCurrentContentType(type);

    if (contentCache[cacheKey]) {
      return; // Already have it, view will render from cache
    }

    setIsLoading(true);
    const content = await generateChapterContent(selectedChapter.promptTopic, type);
    
    setContentCache(prev => ({
      ...prev,
      [cacheKey]: {
        text: content,
        type: type,
        timestamp: Date.now()
      }
    }));
    setIsLoading(false);
  };

  const currentContent = selectedChapterId 
    ? contentCache[`${selectedChapterId}-${currentContentType}`]?.text || null 
    : null;

  // Stats for the dashboard
  const stats = [
    { label: 'Active Modules', value: CHAPTERS.length, icon: Server, color: 'text-cyber-blue' },
    { label: 'Security Clearance', value: 'LEVEL 5', icon: Lock, color: 'text-cyber-red' },
    { label: 'Threat Level', value: 'ELEVATED', icon: Activity, color: 'text-yellow-400' },
    { label: 'System Status', value: 'ONLINE', icon: Cpu, color: 'text-cyber-green' },
  ];

  return (
    <div className="flex h-screen bg-cyber-darker text-slate-200 overflow-hidden font-sans selection:bg-cyber-purple selection:text-white">
      
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-cyber-darker/90 backdrop-blur border-b border-slate-800 flex items-center px-4 z-30">
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 text-slate-400 hover:text-white"
        >
          <Menu className="w-6 h-6" />
        </button>
        <span className="ml-3 font-semibold text-white tracking-tight">The Purple Book</span>
      </div>

      <Sidebar 
        chapters={CHAPTERS}
        selectedChapterId={selectedChapterId}
        onSelectChapter={(id) => {
          setSelectedChapterId(id);
          setCurrentContentType('guide'); // Reset to guide on chapter change
        }}
        isOpen={isSidebarOpen}
        onCloseMobile={() => setIsSidebarOpen(false)}
      />

      <main className="flex-1 overflow-y-auto w-full relative pt-16 lg:pt-0 bg-[#020617]">
        {/* Background Grid Pattern */}
        <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.07] bg-grid"></div>

        <div className="relative z-10 p-6 lg:p-12 min-h-full">
          {selectedChapter ? (
            <ChapterView 
              chapter={selectedChapter}
              content={currentContent}
              contentType={currentContentType}
              isLoading={isLoading}
              onGenerate={handleGenerateContent}
            />
          ) : (
            <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
              
              {/* Hero Section */}
              <div className="text-center mb-16 pt-8">
                <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-slate-900 border border-slate-800 mb-6 shadow-2xl shadow-purple-900/20 relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyber-red via-cyber-purple to-cyber-blue rounded-2xl opacity-20 blur group-hover:opacity-40 transition-opacity"></div>
                  <Shield className="w-12 h-12 text-white relative z-10" />
                </div>
                <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
                  The <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-blue via-cyber-purple to-cyber-red">Purple Book</span>
                </h1>
                <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
                  Advanced playbook for unified cyber defense operations. 
                  Bridge the gap between Red, Blue, and GRC teams with AI-driven intelligence.
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                {stats.map((stat, idx) => (
                  <div key={idx} className="bg-slate-900/50 border border-slate-800/50 p-4 rounded-xl backdrop-blur-sm hover:border-slate-700 transition-colors">
                    <div className="flex items-center gap-3 mb-2">
                      <stat.icon className={`w-4 h-4 ${stat.color}`} />
                      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{stat.label}</span>
                    </div>
                    <div className="text-xl md:text-2xl font-bold text-white font-mono">{stat.value}</div>
                  </div>
                ))}
              </div>

              {/* Quick Access Categories */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { title: 'Red Team Ops', desc: 'Adversary Simulation & Offensive Security', cat: Category.RED },
                  { title: 'Blue Team Def', desc: 'Detection Engineering & DFIR', cat: Category.BLUE },
                  { title: 'Purple Team', desc: 'Cloud Sec, AppSec & Threat Intel', cat: Category.PURPLE },
                  { title: 'GRC & Risk', desc: 'Compliance Frameworks & Governance', cat: Category.GRC },
                  { title: 'Strategy', desc: 'Executive Leadership & Program Dev', cat: Category.STRATEGY },
                  { title: 'Global Intel', desc: 'Threat Feeds & Attribution', cat: Category.GENERAL, icon: Globe },
                ].map((item, idx) => (
                  <button 
                    key={idx}
                    onClick={() => {
                      const firstChapter = CHAPTERS.find(c => c.category === item.cat);
                      if (firstChapter) setSelectedChapterId(firstChapter.id);
                    }}
                    className="text-left group bg-slate-900/40 hover:bg-slate-800/60 border border-slate-800 hover:border-slate-600 p-6 rounded-2xl transition-all duration-300 relative overflow-hidden"
                  >
                    <div className={`absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity`}>
                       <Shield className={`w-24 h-24 ${CATEGORY_COLORS[item.cat]?.split(' ')[0] || 'text-slate-500'}`} />
                    </div>
                    
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${CATEGORY_BG[item.cat] || 'bg-slate-700'} bg-opacity-20`}>
                      <Shield className={`w-5 h-5 ${CATEGORY_COLORS[item.cat]?.split(' ')[0] || 'text-slate-400'}`} />
                    </div>
                    
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyber-blue transition-colors">{item.title}</h3>
                    <p className="text-sm text-slate-400">{item.desc}</p>
                    
                    <div className="mt-4 flex items-center text-xs font-bold text-slate-500 uppercase tracking-widest group-hover:text-white transition-colors">
                      Access Module <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  </button>
                ))}
              </div>
              
              <div className="mt-16 text-center">
                 <p className="text-xs text-slate-600 font-mono">SYSTEM READY // WAITING FOR INPUT</p>
              </div>

            </div>
          )}
        </div>
      </main>

      <ChatInterface 
        currentContextTopic={selectedChapter?.promptTopic || "General Cybersecurity"} 
      />
    </div>
  );
};

export default App;