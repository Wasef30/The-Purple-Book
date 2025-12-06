import React, { useEffect, useState } from 'react';
import { Chapter, ContentType } from '../types';
import MarkdownRenderer from './MarkdownRenderer';
import ArchitectureDiagram from './ArchitectureDiagram';
import { BookOpen, AlertTriangle, Terminal, RefreshCw, Wand2, Shield, Crosshair, FileText, Network } from 'lucide-react';
import { CATEGORY_COLORS, CATEGORY_BG } from '../constants';

interface ChapterViewProps {
  chapter: Chapter;
  content: string | null;
  contentType: ContentType;
  isLoading: boolean;
  onGenerate: (type: ContentType) => void;
}

const ChapterView: React.FC<ChapterViewProps> = ({ 
  chapter, 
  content, 
  contentType,
  isLoading, 
  onGenerate 
}) => {
  const [terminalText, setTerminalText] = useState('');
  
  // Terminal animation effect
  useEffect(() => {
    if (isLoading) {
      setTerminalText('');
      const logs = [
        "Initializing secure connection...",
        "Authenticating user credentials...",
        `Accessing module: ${chapter.id.toUpperCase()}`,
        "Decrypting payload...",
        "Rendering tactical data...",
        "Finalizing output stream..."
      ];
      let i = 0;
      const interval = setInterval(() => {
        if (i < logs.length) {
          setTerminalText(prev => prev + `> ${logs[i]}\n`);
          i++;
        } else {
          clearInterval(interval);
        }
      }, 500);
      return () => clearInterval(interval);
    }
  }, [isLoading, chapter.id]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[50vh]">
        <div className="w-full max-w-md bg-slate-950 rounded-lg border border-slate-800 p-6 font-mono text-sm relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyber-purple to-transparent animate-scanline"></div>
          <div className="flex gap-2 mb-4 border-b border-slate-800 pb-2">
            <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
            <span className="ml-auto text-xs text-slate-500">TERMINAL</span>
          </div>
          <div className="text-green-400 whitespace-pre-line min-h-[150px]">
            {terminalText}
            <span className="animate-pulse">_</span>
          </div>
        </div>
        <p className="text-slate-500 mt-6 text-xs uppercase tracking-widest animate-pulse">Decrypting Intelligence...</p>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[60vh] text-center px-6 animate-in fade-in duration-700">
        <div className="relative mb-8">
           <div className={`absolute inset-0 blur-2xl opacity-20 ${CATEGORY_BG[chapter.category]}`}></div>
           <div className={`w-24 h-24 rounded-2xl flex items-center justify-center border-2 ${CATEGORY_COLORS[chapter.category].replace('text-', 'border-').split(' ')[1]} bg-slate-900/80 backdrop-blur-sm relative z-10 shadow-xl`}>
             <BookOpen className={`w-10 h-10 ${CATEGORY_COLORS[chapter.category].split(' ')[0]}`} />
           </div>
        </div>
        
        <div className="space-y-2 mb-10">
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border ${CATEGORY_COLORS[chapter.category]} bg-opacity-10`}>
             <span className="w-2 h-2 rounded-full bg-current animate-pulse"></span>
             {chapter.category}
          </div>
          <h2 className="text-4xl font-bold text-white tracking-tight">{chapter.title}</h2>
          <p className="text-slate-400 max-w-lg mx-auto text-lg leading-relaxed">{chapter.description}</p>
          
          <div className="pt-4 flex justify-center gap-4 flex-wrap">
             <button
              onClick={() => onGenerate('guide')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-cyber-blue/10 hover:bg-cyber-blue/20 text-cyber-blue border border-cyber-blue/50 rounded-lg transition-all hover:scale-105 active:scale-95 font-mono text-sm uppercase tracking-wider"
            >
              <Wand2 className="w-4 h-4" />
              Generate Guide
            </button>
            <button
              onClick={() => onGenerate('case-study')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-cyber-red/10 hover:bg-cyber-red/20 text-cyber-red border border-cyber-red/50 rounded-lg transition-all hover:scale-105 active:scale-95 font-mono text-sm uppercase tracking-wider"
            >
              <Crosshair className="w-4 h-4" />
              Generate Case Study
            </button>
            <button
              onClick={() => onGenerate('lab')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-cyber-green/10 hover:bg-cyber-green/20 text-cyber-green border border-cyber-green/50 rounded-lg transition-all hover:scale-105 active:scale-95 font-mono text-sm uppercase tracking-wider"
            >
              <Terminal className="w-4 h-4" />
              Generate Lab
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-5xl">
          <button 
            onClick={() => onGenerate('guide')}
            className="flex flex-col items-start p-6 bg-slate-900/50 hover:bg-slate-800 border border-slate-800 hover:border-cyber-blue rounded-xl transition-all group relative overflow-hidden text-left"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-cyber-blue/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-blue-900/20">
              <FileText className="w-5 h-5 text-cyber-blue" />
            </div>
            <span className="font-bold text-slate-100 text-lg group-hover:text-cyber-blue transition-colors">Field Manual</span>
            <p className="text-sm text-slate-500 mt-2 leading-snug">Comprehensive theory, architecture diagrams, and strategic concepts.</p>
          </button>

          <button 
            onClick={() => onGenerate('case-study')}
            className="flex flex-col items-start p-6 bg-slate-900/50 hover:bg-slate-800 border border-slate-800 hover:border-cyber-red rounded-xl transition-all group relative overflow-hidden text-left"
          >
             <div className="absolute inset-0 bg-gradient-to-br from-cyber-red/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
             <div className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-red-900/20">
              <Crosshair className="w-5 h-5 text-cyber-red" />
            </div>
            <span className="font-bold text-slate-100 text-lg group-hover:text-cyber-red transition-colors">Case Studies</span>
            <p className="text-sm text-slate-500 mt-2 leading-snug">Declassified real-world breach scenarios and kill chain analysis.</p>
          </button>

          <button 
            onClick={() => onGenerate('lab')}
            className="flex flex-col items-start p-6 bg-slate-900/50 hover:bg-slate-800 border border-slate-800 hover:border-cyber-green rounded-xl transition-all group relative overflow-hidden text-left"
          >
             <div className="absolute inset-0 bg-gradient-to-br from-cyber-green/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
             <div className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-green-900/20">
              <Terminal className="w-5 h-5 text-cyber-green" />
            </div>
            <span className="font-bold text-slate-100 text-lg group-hover:text-cyber-green transition-colors">Tactical Lab</span>
            <p className="text-sm text-slate-500 mt-2 leading-snug">Hands-on command line exercises, payloads, and defense drills.</p>
          </button>

          <button 
            onClick={() => onGenerate('diagram')}
            className="flex flex-col items-start p-6 bg-slate-900/50 hover:bg-slate-800 border border-slate-800 hover:border-cyber-purple rounded-xl transition-all group relative overflow-hidden text-left"
          >
             <div className="absolute inset-0 bg-gradient-to-br from-cyber-purple/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
             <div className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-purple-900/20">
              <Network className="w-5 h-5 text-cyber-purple" />
            </div>
            <span className="font-bold text-slate-100 text-lg group-hover:text-cyber-purple transition-colors">Architecture</span>
            <p className="text-sm text-slate-500 mt-2 leading-snug">Generate interactive network topologies and attack surface maps.</p>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="mb-8 border-b border-slate-800 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
           <div className="flex items-center gap-2 mb-3">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${CATEGORY_COLORS[chapter.category]} uppercase tracking-widest`}>
              {chapter.category}
            </span>
            <span className="text-slate-600 text-[10px] uppercase tracking-wider font-mono flex items-center gap-1">
              // MODULE_ID: {chapter.id.toUpperCase()}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">{chapter.title}</h1>
        </div>

        <div className="flex flex-wrap bg-slate-900/80 p-1.5 rounded-lg border border-slate-800 backdrop-blur-sm gap-1">
          <button 
            onClick={() => onGenerate('guide')}
            className={`px-3 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${contentType === 'guide' ? 'bg-slate-700 text-white shadow ring-1 ring-white/10' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <FileText className="w-3 h-3" /> Guide
          </button>
           <button 
            onClick={() => onGenerate('case-study')}
            className={`px-3 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${contentType === 'case-study' ? 'bg-slate-700 text-white shadow ring-1 ring-white/10' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <Crosshair className="w-3 h-3" /> Case
          </button>
           <button 
            onClick={() => onGenerate('lab')}
            className={`px-3 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${contentType === 'lab' ? 'bg-slate-700 text-white shadow ring-1 ring-white/10' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <Terminal className="w-3 h-3" /> Lab
          </button>
          <button 
            onClick={() => onGenerate('diagram')}
            className={`px-3 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${contentType === 'diagram' ? 'bg-slate-700 text-white shadow ring-1 ring-white/10' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <Network className="w-3 h-3" /> Arch
          </button>
        </div>
      </div>

      {/* Content Container */}
      <div className={`bg-slate-900/40 rounded-xl ${contentType === 'diagram' ? 'p-0 bg-transparent border-none shadow-none' : 'p-8 md:p-12 border border-slate-800 shadow-2xl'} min-h-[500px] relative overflow-hidden group`}>
        
        {contentType === 'diagram' ? (
          <ArchitectureDiagram dataString={content} />
        ) : (
          <>
            {/* Decorative corner accents only for text content */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyber-purple/50 rounded-tl-lg"></div>
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyber-purple/50 rounded-tr-lg"></div>
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyber-purple/50 rounded-bl-lg"></div>
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyber-purple/50 rounded-br-lg"></div>

            <MarkdownRenderer content={content} />
          </>
        )}
        
        <div className="mt-16 pt-8 border-t border-slate-800/50 flex flex-col items-center">
            <p className="text-slate-600 text-xs uppercase tracking-widest mb-4">-- End of Transmission --</p>
            <button 
              onClick={() => onGenerate(contentType)}
              className="px-6 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 text-slate-300 rounded-lg flex items-center gap-2 text-sm transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              Re-Initialize Simulation
            </button>
        </div>
      </div>
    </div>
  );
};

export default ChapterView;