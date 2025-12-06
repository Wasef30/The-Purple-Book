import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Copy, Check, Terminal } from 'lucide-react';

interface MarkdownRendererProps {
  content: string;
}

const CodeBlock = ({ inline, className, children, ...props }: any) => {
  const [isCopied, setIsCopied] = useState(false);
  const match = /language-(\w+)/.exec(className || '');

  if (!inline && match) {
    const handleCopy = async () => {
      const text = String(children).replace(/\n$/, '');
      try {
        await navigator.clipboard.writeText(text);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy!', err);
      }
    };

    return (
      <div className="relative my-6 rounded-lg border border-slate-800 bg-[#0b1121] overflow-hidden group shadow-lg">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-3 py-2 bg-slate-900/90 border-b border-slate-800 backdrop-blur-sm">
          <div className="flex items-center gap-3">
             <div className="flex gap-1.5">
               <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/50"></div>
               <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
               <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/50"></div>
             </div>
             <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Terminal className="w-3 h-3 text-cyber-blue" />
                {match[1]}
             </span>
          </div>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-slate-800 transition-all group/btn focus:outline-none"
            title="Copy to Clipboard"
          >
            {isCopied ? (
              <>
                <Check className="w-3.5 h-3.5 text-green-500" />
                <span className="text-[10px] font-bold text-green-500 font-mono">COPIED</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-500 group-hover/btn:text-cyber-blue transition-colors" />
                <span className="text-[10px] font-bold text-slate-500 group-hover/btn:text-cyber-blue font-mono transition-colors">COPY</span>
              </>
            )}
          </button>
        </div>
        
        {/* Code Content */}
        <div className="p-4 overflow-x-auto bg-[#0b1121]">
          <code className={`${className} font-mono text-sm leading-relaxed text-slate-300`} {...props}>
            {children}
          </code>
        </div>
      </div>
    );
  }

  return (
    <code className={`${className} bg-slate-800/50 px-1.5 py-0.5 rounded text-cyber-blue border border-slate-700/50 font-mono text-sm`} {...props}>
      {children}
    </code>
  );
};

// A wrapper to apply our specific prose styles to the markdown output
const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <div className="prose prose-invert prose-slate max-w-none">
      <ReactMarkdown
        components={{
          // Override pre to avoid default browser/typography styling wrapper
          pre: ({children}) => <>{children}</>,
          code: CodeBlock
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;