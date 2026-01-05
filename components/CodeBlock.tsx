import React, { useState } from 'react';
import { Copy, Check, Play, ExternalLink, Info } from 'lucide-react';
import { ReactNode } from 'react';

interface CodeBlockProps {
  code: string;
  label?: string;
  explanation?: ReactNode;
  playgroundUrl?: string;
  className?: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code, label, explanation, playgroundUrl, className = '' }) => {
  const [showExplanation, setShowExplanation] = useState(false);
  const [copied, setCopied] = useState(false);
  const [runCopied, setRunCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getPlaygroundLink = () => {
    if (playgroundUrl) return playgroundUrl;

    // Auto-generate PHPStan Playground URL
    // 1. Ensure code starts with <?php
    const cleanCode = code.trim();
    const runnableCode = cleanCode.startsWith('<?php') 
      ? cleanCode 
      : `<?php\n\n${cleanCode}`;
    
    // 2. Encode for URL
    const encodedCode = encodeURIComponent(runnableCode);
    
    // 3. Construct URL - PHPStan playground uses 'source' parameter
    return `https://phpstan.org/try?source=${encodedCode}`;
  };

  const finalPlaygroundUrl = getPlaygroundLink();

  const handlePlaygroundClick = () => {
    // Auto-copy code when opening playground
    navigator.clipboard.writeText(code);
    setRunCopied(true);
    setTimeout(() => setRunCopied(false), 3000);
  };

  return (
    <div className={`relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0d1117] my-8 shadow-sm group ${className}`}>
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#161b22]">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700"></div>
          </div>
          <span className="ml-2 text-xs font-semibold text-slate-500 dark:text-slate-400 font-mono uppercase tracking-wider">{label || 'PHP'}</span>
        </div>
        
        <div className="flex items-center gap-2">
           <div className="relative group/run">
             <a
              href={finalPlaygroundUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handlePlaygroundClick}
              className="text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-full font-medium transition-all bg-brand-50 text-brand-700 hover:bg-brand-100 dark:bg-brand-900/30 dark:text-brand-300 dark:hover:bg-brand-900/50 border border-brand-200 dark:border-brand-800"
            >
              <Play size={12} className="fill-current" />
              Run
              <ExternalLink size={10} className="opacity-50" />
            </a>
            {/* Tooltip for Copy Feedback */}
            <div className={`absolute right-0 top-full mt-2 w-48 p-2 bg-slate-800 text-white text-xs rounded shadow-lg transition-opacity duration-200 pointer-events-none z-10 text-center ${runCopied ? 'opacity-100' : 'opacity-0'}`}>
              Code copied! Paste it in the playground.
            </div>
           </div>

          <button 
            onClick={copyToClipboard}
            className="text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md"
            title="Copy code"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
          </button>
          
          {explanation && (
            <button 
              onClick={() => setShowExplanation(!showExplanation)}
              className={`text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-full font-medium transition-all ${
                showExplanation
                  ? 'bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-200' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
              }`}
            >
              <Info size={12} />
              {showExplanation ? 'Hide' : 'Explain'}
            </button>
          )}
        </div>
      </div>

      {showExplanation && explanation && (
        <div className="bg-brand-50/50 dark:bg-brand-900/10 border-b border-brand-100 dark:border-brand-900/20 p-5 text-sm text-slate-700 dark:text-slate-300 animate-in slide-in-from-top-2">
           <div className="flex items-center gap-2 mb-2 text-brand-600 dark:text-brand-400 font-semibold text-xs uppercase tracking-wide">
             <Info size={12} /> Expert Insight
           </div>
           <div className="leading-relaxed">
             {explanation}
           </div>
        </div>
      )}

      <div className="relative group/code">
        <pre className="p-5 overflow-x-auto text-[13px] md:text-sm font-mono text-slate-700 dark:text-slate-300 leading-relaxed bg-white dark:bg-[#0d1117]">
          <code>
            {code.split('\n').map((line, i) => (
              <div key={i} className="table-row">
                <span className="table-cell select-none text-slate-300 dark:text-slate-700 text-right pr-4 w-8 user-select-none">{i + 1}</span>
                <span className="table-cell whitespace-pre">
                  {line.split(/(\/\*[\s\S]*?\*\/|\/\/.*|@\w+(?:-[a-z]+)*|'.*?'|".*?"|\b(?:function|return|class|extends|implements|interface|public|private|protected|static|var|const|true|false|null|array|list|string|int|bool|void|mixed)\b)/g).map((token, j) => {
                     if (token.startsWith('//') || token.startsWith('/*')) return <span key={j} className="text-slate-400 dark:text-gray-500 italic">{token}</span>;
                     if (token.startsWith('@')) return <span key={j} className="text-amber-600 dark:text-yellow-500 font-medium">{token}</span>;
                     if (token.startsWith("'") || token.startsWith('"')) return <span key={j} className="text-emerald-600 dark:text-green-400">{token}</span>;
                     if (['function', 'return', 'class', 'extends', 'implements', 'interface', 'public', 'private', 'protected', 'static', 'var', 'const'].includes(token)) return <span key={j} className="text-purple-600 dark:text-purple-400 font-semibold">{token}</span>;
                     if (['true', 'false', 'null'].includes(token)) return <span key={j} className="text-orange-600 dark:text-orange-400">{token}</span>;
                     if (['array', 'list', 'string', 'int', 'bool', 'void', 'mixed'].includes(token)) return <span key={j} className="text-blue-600 dark:text-blue-400">{token}</span>;
                     return <span key={j}>{token}</span>;
                  })}
                </span>
              </div>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
};

export default CodeBlock;