import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../types';
import { generateChatResponse } from '../services/geminiService';
import { MessageSquare, X, Send, Trash2, Terminal } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface ChatInterfaceProps {
  currentContextTopic: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ currentContextTopic }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'model',
      content: 'I am your tactical advisor. Query me regarding the current playbook chapter or any cybersecurity topic.',
      timestamp: Date.now()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages, isOpen]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    const history = messages.slice(-5).map(m => ({ role: m.role, content: m.content }));
    const responseText = await generateChatResponse(history, userMsg.content, currentContextTopic);

    const botMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      content: responseText,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, botMsg]);
    setIsTyping(false);
  };

  const handleClear = () => {
     setMessages([
      {
        id: 'welcome',
        role: 'model',
        content: 'I am your tactical advisor. Query me regarding the current playbook chapter or any cybersecurity topic.',
        timestamp: Date.now()
      }
    ]);
  }

  return (
    <>
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-slate-900 border border-cyber-blue text-cyber-blue rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.5)] hover:bg-cyber-blue hover:text-white hover:shadow-[0_0_25px_rgba(59,130,246,0.8)] transition-all z-50 group"
        >
          <MessageSquare className="w-6 h-6 group-hover:scale-110 transition-transform" />
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyber-blue opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-cyber-blue"></span>
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-[90vw] md:w-[450px] h-[650px] max-h-[80vh] bg-[#0b1121] border border-slate-700/80 rounded-lg shadow-2xl flex flex-col z-50 overflow-hidden backdrop-blur-xl ring-1 ring-white/10 animate-in slide-in-from-bottom-10 fade-in duration-300">
          
          {/* Header */}
          <div className="p-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-cyber-blue/20 flex items-center justify-center border border-cyber-blue/30">
                 <Terminal className="w-4 h-4 text-cyber-blue" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white tracking-wide">TACTICAL_ADVISOR</h3>
                <div className="flex items-center gap-1.5">
                   <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.8)] animate-pulse"></span>
                   <span className="text-[10px] text-slate-400 font-mono">SYSTEM_ONLINE</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
                <button 
                  onClick={handleClear}
                  className="p-2 hover:bg-slate-800 rounded-md text-slate-400 hover:text-red-400 transition-colors"
                  title="Clear Logs"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-slate-800 rounded-md text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-5 bg-slate-950/50 scroll-smooth">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div 
                  className={`max-w-[85%] rounded-lg px-4 py-3 text-sm shadow-md ${
                    msg.role === 'user' 
                      ? 'bg-cyber-blue/90 text-white border border-blue-500/50' 
                      : 'bg-slate-900 text-slate-300 border border-slate-700'
                  }`}
                >
                  {msg.role === 'model' ? (
                     <div className="prose prose-invert prose-sm max-w-none prose-p:leading-relaxed prose-pre:bg-black/50 prose-pre:border prose-pre:border-white/10 prose-code:text-cyber-blue">
                      <ReactMarkdown
                        components={{
                          code({node, inline, className, children, ...props}: any) {
                            const match = /language-(\w+)/.exec(className || '')
                            return !inline && match ? (
                                <code className={className} {...props}>
                                  {children}
                                </code>
                            ) : (
                              <code className="bg-black/30 px-1 py-0.5 rounded text-xs font-mono" {...props}>
                                {children}
                              </code>
                            )
                          }
                        }}
                      >
                        {msg.content}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    msg.content
                  )}
                  <div className={`text-[9px] mt-1 opacity-50 font-mono text-right ${msg.role === 'user' ? 'text-blue-200' : 'text-slate-500'}`}>
                    {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-slate-900 rounded-lg px-4 py-3 border border-slate-700 flex items-center gap-1">
                   <span className="text-xs text-cyber-blue font-mono mr-2">THINKING</span>
                   <div className="w-1 h-1 bg-cyber-blue rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                   <div className="w-1 h-1 bg-cyber-blue rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                   <div className="w-1 h-1 bg-cyber-blue rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 bg-slate-900/90 border-t border-slate-800 backdrop-blur-md">
            <div className="relative">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Enter command or query..."
                className="w-full bg-slate-950/80 border border-slate-700 rounded-lg pl-4 pr-12 py-3 text-sm text-white focus:outline-none focus:border-cyber-blue focus:ring-1 focus:ring-cyber-blue/50 transition-all placeholder:text-slate-600 font-mono"
              />
              <button 
                onClick={handleSend}
                disabled={!inputValue.trim() || isTyping}
                className="absolute right-2 top-2 p-1.5 bg-cyber-blue/10 hover:bg-cyber-blue border border-cyber-blue/30 hover:border-cyber-blue rounded-md text-cyber-blue hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-2 flex justify-between items-center px-1">
                <span className="text-[9px] text-slate-600 font-mono uppercase">Encrypted Channel // TLP:AMBER</span>
                <span className="text-[9px] text-slate-600 font-mono">v2.4.1</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatInterface;