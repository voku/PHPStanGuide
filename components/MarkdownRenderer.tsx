import React from 'react';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className = '' }) => {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  
  let currentListItems: string[] = [];
  let currentParagraphLines: string[] = [];

  const flushParagraph = () => {
    if (currentParagraphLines.length > 0) {
      const text = currentParagraphLines.join(' ');
      if (text.trim()) {
        elements.push(
          <p key={`p-${elements.length}`} className="text-[1.05rem] leading-[1.8] text-slate-700 dark:text-slate-300 font-serif mb-6 selection:bg-brand-100 dark:selection:bg-brand-900/30 tracking-normal">
            {parseInline(text)}
          </p>
        );
      }
      currentParagraphLines = [];
    }
  };

  const flushList = () => {
    if (currentListItems.length > 0) {
      elements.push(
        <ul key={`ul-${elements.length}`} className="mb-8 space-y-3">
          {currentListItems.map((item, i) => (
            <li key={i} className="group flex items-start text-[1.05rem] text-slate-700 dark:text-slate-300 leading-relaxed font-serif">
              <span className="shrink-0 mt-2.5 mr-4 w-1.5 h-1.5 bg-slate-300 dark:bg-slate-600 rounded-full group-hover:bg-brand-500 transition-colors" />
              <span>{parseInline(item)}</span>
            </li>
          ))}
        </ul>
      );
      currentListItems = [];
    }
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();
    
    // 1. Handle Empty Lines (Flush buffers)
    if (!trimmed) {
      flushList();
      flushParagraph();
      return;
    }

    // 2. Handle Headers
    if (trimmed.startsWith('#')) {
      flushList();
      flushParagraph();
      
      const match = trimmed.match(/^(#+)\s+(.*)$/);
      if (match) {
        const level = match[1].length;
        const text = match[2];
        const key = `h-${index}`;
        
        // Typography Hierarchy
        if (level === 1) {
          elements.push(
            <h1 key={key} className="text-4xl md:text-5xl font-black font-sans text-slate-900 dark:text-white mt-12 mb-8 tracking-tighter leading-tight">
              {parseInline(text)}
            </h1>
          );
        } else if (level === 2) {
          elements.push(
            <h2 key={key} className="text-2xl md:text-3xl font-extrabold font-sans text-slate-900 dark:text-white mt-12 mb-6 pb-4 border-b border-slate-200 dark:border-slate-800 tracking-tight">
              {parseInline(text)}
            </h2>
          );
        } else {
          // H3 is used for "Key Types" etc - styled as Eyebrow/Subhead
          elements.push(
            <div key={key} className="mt-10 mb-5 flex items-center gap-3">
              <div className="h-4 w-1 bg-brand-500 rounded-full"></div>
              <h3 className="text-sm font-bold font-sans uppercase tracking-widest text-slate-900 dark:text-white">
                {parseInline(text)}
              </h3>
            </div>
          );
        }
        return;
      }
    }

    // 3. Handle Blockquotes
    if (trimmed.startsWith('> ')) {
       flushList();
       flushParagraph();
       elements.push(
         <blockquote key={`bq-${index}`} className="relative pl-6 py-4 my-8 font-serif italic text-xl text-slate-700 dark:text-slate-200 border-l-4 border-brand-500 bg-slate-50 dark:bg-slate-900 rounded-r-lg leading-relaxed">
           {parseInline(trimmed.replace(/^>\s*/, ''))}
         </blockquote>
       );
       return;
    }

    // 4. Handle List Items (* or -)
    // Regex checks for * or - at start of line
    if (/^[*|-]\s/.test(trimmed)) {
      flushParagraph(); // Lists break paragraphs
      currentListItems.push(trimmed.replace(/^[*|-]\s+/, ''));
      return;
    }

    // 5. Handle Paragraphs
    flushList(); // Paragraphs break lists
    currentParagraphLines.push(trimmed);
  });

  // Final flush
  flushList();
  flushParagraph();

  return (
    <div className={`markdown-content ${className}`}>
      {elements}
    </div>
  );
};

// Helper for inline styles
const parseInline = (text: string): React.ReactNode[] => {
  // Matches: **bold**, *italic*, `code`, [link](url)
  const regex = /(\*\*.*?\*\*|\*.*?\*|`.*?`|\[.*?\]\(.*?\))/g;
  const parts = text.split(regex);

  return parts.map((part, i) => {
    // Bold: **text**
    if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
      return <strong key={i} className="font-bold text-slate-900 dark:text-white font-sans tracking-tight">{part.slice(2, -2)}</strong>;
    }
    // Italic: *text*
    if (part.startsWith('*') && part.endsWith('*') && part.length >= 2) { 
      return <em key={i} className="italic font-medium text-slate-800 dark:text-slate-200">{part.slice(1, -1)}</em>;
    }
    // Code: `text`
    if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
      return (
        <code key={i} className="mx-0.5 px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[0.85em] font-mono font-medium text-brand-700 dark:text-brand-300 align-baseline break-words shadow-sm">
          {part.slice(1, -1)}
        </code>
      );
    }
    // Link: [text](url)
    const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
    if (linkMatch) {
       return (
         <a 
           key={i} 
           href={linkMatch[2]} 
           target="_blank" 
           rel="noopener noreferrer" 
           className="inline-flex items-center text-brand-600 dark:text-brand-400 font-medium hover:text-brand-700 dark:hover:text-brand-300 decoration-2 hover:underline underline-offset-2 transition-colors"
         >
           {linkMatch[1]}
         </a>
       );
    }
    return part;
  });
};

export default MarkdownRenderer;