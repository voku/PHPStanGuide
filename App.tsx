import React, { useState, useEffect } from 'react';
import { GUIDE_SECTIONS } from './constants';
import { GuideSection, UserState } from './types';
import CodeBlock from './components/CodeBlock';
import { 
  Terminal, 
  CheckCircle2, 
  Award, 
  Menu, 
  X, 
  Moon, 
  Sun, 
  GraduationCap,
  Github
} from 'lucide-react';

const App: React.FC = () => {
  // --- State ---
  const [darkMode, setDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [userState, setUserState] = useState<UserState>(() => {
    const saved = localStorage.getItem('phpstan_hero_state_v3');
    return saved ? JSON.parse(saved) : {
      xp: 0,
      readSections: [],
      masteredSections: []
    };
  });
  const [activeSectionId, setActiveSectionId] = useState<string>(GUIDE_SECTIONS[0].id);

  // --- Effects ---
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('phpstan_hero_state_v3', JSON.stringify(userState));
  }, [userState]);

  // Track both active section AND detailed scroll percentage
  useEffect(() => {
    const handleScroll = () => {
      // 1. Update Scroll Progress Bar (0-100%)
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
      setScrollProgress(progress);

      // 2. Active Section Spy
      const headerOffset = 150;
      let currentId = activeSectionId;
      
      GUIDE_SECTIONS.forEach(section => {
        const el = document.getElementById(section.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= headerOffset && rect.bottom >= headerOffset) {
            currentId = section.id;
          }
        }
      });
      
      if (currentId !== activeSectionId) {
        setActiveSectionId(currentId);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Init
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeSectionId]);

  // --- Actions ---
  const handleCompleteSection = (sectionId: string) => {
    if (!userState.readSections.includes(sectionId)) {
      setUserState(prev => ({
        ...prev,
        readSections: [...prev.readSections, sectionId],
        xp: prev.xp + 50
      }));
    }
  };

  const handleQuizResult = (sectionId: string, success: boolean) => {
    if (success && !userState.masteredSections.includes(sectionId)) {
      setUserState(prev => ({
        ...prev,
        masteredSections: [...prev.masteredSections, sectionId],
        xp: prev.xp + 100 // Bonus for quiz mastery
      }));
    }
  };

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  const calculateCompletion = () => {
    const total = GUIDE_SECTIONS.length;
    const completed = userState.readSections.length;
    return Math.round((completed / total) * 100);
  };

  // --- Components ---
  const Navbar = () => (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white/95 dark:bg-[#0f172a]/95 backdrop-blur-md shadow-sm border-b border-slate-200/50 dark:border-slate-800/50">
      
      {/* Main Header Content */}
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div 
          className="flex items-center gap-3 cursor-pointer group" 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <div className="w-8 h-8 rounded bg-slate-900 dark:bg-white flex items-center justify-center text-white dark:text-slate-900 transition-transform duration-300 group-hover:scale-105">
            <Terminal size={16} strokeWidth={3} />
          </div>
          <span className="font-bold text-slate-900 dark:text-white tracking-tight font-sans text-lg">PHPStan Guide</span>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          
          {/* Completion Status Pill */}
          <div className="hidden md:flex items-center gap-3 px-3 py-1.5 transition-colors">
            <span className="text-[11px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider font-sans">Progress</span>
            <div className="h-1.5 w-24 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
               <div className="h-full bg-brand-600 dark:bg-brand-500 transition-all duration-500" style={{ width: `${calculateCompletion()}%` }} />
            </div>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 font-mono">{calculateCompletion()}%</span>
          </div>
          
          <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 mx-1 hidden md:block"></div>

          <a 
            href="https://github.com/voku/PHPStanGuide"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Contribute on GitHub"
          >
            <Github size={18} />
            <span className="hidden lg:inline">Contribute</span>
          </a>

          <button 
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 text-slate-500 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400 transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Toggle Theme"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <button 
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
          >
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* Bottom Scroll Progress Line */}
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-transparent">
        <div 
          className="h-full bg-brand-600 shadow-[0_0_10px_rgba(79,70,229,0.5)] transition-all duration-100 ease-out" 
          style={{ width: `${scrollProgress}%` }}
        />
      </div>
    </header>
  );

  const TableOfContents = ({ isMobile = false }) => (
    <nav className="space-y-0.5">
      {GUIDE_SECTIONS.map((section, idx) => {
        const isActive = activeSectionId === section.id;
        const isCompleted = userState.readSections.includes(section.id);
        
        return (
          <button
            key={section.id}
            onClick={() => scrollToSection(section.id)}
            className={`w-full text-left py-2 px-3 rounded-md text-sm transition-all flex items-center justify-between group ${
              isActive 
                ? 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white font-semibold' 
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/30'
            }`}
          >
            <span className="flex items-center gap-3 truncate">
              <span className={`text-[10px] font-mono w-4 ${isActive ? 'text-brand-600 dark:text-brand-400' : 'text-slate-300 dark:text-slate-600'}`}>
                {(idx + 1).toString().padStart(2, '0')}
              </span>
              <span className="truncate font-sans tracking-tight">{section.title.replace(/^\d+\.\s*/, '')}</span>
            </span>
            {isCompleted && <CheckCircle2 size={14} className="text-brand-600 dark:text-brand-500 shrink-0" />}
          </button>
        );
      })}
    </nav>
  );

  const SectionCheckpoint = ({ section }: { section: GuideSection }) => {
    const isRead = userState.readSections.includes(section.id);
    if (isRead) return null;

    return (
      <div className="my-10 flex justify-center">
        <button
          onClick={() => handleCompleteSection(section.id)}
          className="group relative px-8 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-full shadow-sm hover:shadow-md hover:border-brand-500 dark:hover:border-brand-500 transition-all flex items-center gap-3 font-sans"
        >
          <div className="w-5 h-5 rounded-full border-2 border-slate-300 dark:border-slate-600 group-hover:border-brand-600 group-hover:bg-brand-600 transition-colors"></div>
          <span className="font-semibold text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white tracking-tight">
            Mark as Understood
          </span>
        </button>
      </div>
    );
  };

  const InlineQuiz = ({ section }: { section: GuideSection }) => {
    const [selected, setSelected] = useState<number | null>(null);
    const [isRevealed, setIsRevealed] = useState(false);
    
    if (!section.quiz) return null;

    const isMastered = userState.masteredSections.includes(section.id);

    if (isMastered) {
      return (
        <div className="mt-8 mb-8 p-4 bg-slate-50 dark:bg-slate-900 border-l-4 border-brand-500 rounded-r-lg flex items-start gap-4">
          <div className="p-1.5 bg-brand-100 dark:bg-brand-900/50 rounded-full text-brand-600 dark:text-brand-400 shrink-0 mt-0.5">
            <CheckCircle2 size={16} />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white text-sm font-sans uppercase tracking-wide">Concept Mastered</h4>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 font-serif leading-relaxed">You've verified your knowledge for this section.</p>
          </div>
        </div>
      );
    }

    const handleSelect = (idx: number) => {
      if (isRevealed) return;
      setSelected(idx);
      setIsRevealed(true);
      const correct = section.quiz!.options[idx].isCorrect;
      handleQuizResult(section.id, correct);
    };

    return (
      <div className="my-10 bg-white dark:bg-[#11161f] border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden font-sans">
        <div className="bg-slate-50 dark:bg-slate-800/30 px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
            <GraduationCap size={16} /> Checkpoint
          </span>
        </div>
        
        <div className="p-6 md:p-8">
          <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-6 leading-relaxed">
            {section.quiz.question}
          </h3>
          
          <div className="space-y-3">
            {section.quiz.options.map((opt, idx) => {
              let style = "border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300";
              
              if (isRevealed) {
                if (opt.isCorrect) style = "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 font-medium";
                else if (selected === idx) style = "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-300";
                else style = "opacity-50 border-transparent";
              } else if (selected === idx) {
                 style = "border-brand-500 bg-brand-50 text-brand-700";
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  disabled={isRevealed}
                  className={`w-full text-left p-4 rounded-lg border text-sm transition-all duration-200 flex justify-between items-center ${style}`}
                >
                  <span className="leading-relaxed">{opt.text}</span>
                  {isRevealed && opt.isCorrect && <CheckCircle2 size={18} className="text-emerald-600 dark:text-emerald-400" />}
                </button>
              );
            })}
          </div>

          {isRevealed && selected !== null && (
             <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 animate-in fade-in slide-in-from-top-2">
               <p className="text-sm text-slate-600 dark:text-slate-400 leading-7 font-serif">
                 <strong className={`font-sans uppercase text-xs tracking-wide mr-2 ${section.quiz.options[selected].isCorrect ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
                   {section.quiz.options[selected].isCorrect ? "Correct" : "Incorrect"}
                 </strong>
                 {section.quiz.options[selected].explanation}
               </p>
             </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen font-sans bg-slate-50 dark:bg-[#0f172a] text-slate-900 dark:text-slate-200 transition-colors duration-300 ${darkMode ? 'dark' : ''}`}>
      <Navbar />

      {/* Mobile Menu */}
      <div className={`fixed inset-0 z-[60] transform transition-transform duration-300 md:hidden ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}></div>
        <div className="absolute right-0 top-0 bottom-0 w-80 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl p-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-8">
            <span className="font-bold text-xl text-slate-900 dark:text-white font-sans tracking-tight">Index</span>
            <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
              <X size={24} />
            </button>
          </div>
          
          <a 
            href="https://github.com/voku/PHPStanGuide"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-4 py-3 mb-4 text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors rounded-lg bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700"
          >
            <Github size={20} />
            <span>Contribute on GitHub</span>
          </a>
          
          <TableOfContents isMobile={true} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex pt-24 px-4 sm:px-6 lg:px-8 gap-16 relative">
        <main className="flex-1 max-w-3xl min-w-0 pb-32 mx-auto lg:mx-0">
          <div className="mb-16 mt-8">
            <h1 className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white tracking-tighter mb-6 font-sans leading-tight">
              The PHPDoc Guide <br/>
              <span className="text-brand-600 dark:text-brand-500">2026 Edition</span>
            </h1>
            <p className="text-xl sm:text-2xl text-slate-600 dark:text-slate-400 leading-relaxed font-serif text-balance">
              Master modern PHP types. Stop writing <code className="text-[0.9em] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 font-mono text-slate-900 dark:text-slate-200 font-medium">array</code>. Start writing strict contracts.
            </p>
          </div>

          <div className="space-y-16">
            {GUIDE_SECTIONS.map((section, index) => (
              <section key={section.id} id={section.id} className="scroll-mt-32 group">
                
                {/* HIDE SECTION TITLE FOR INTRO TO PREVENT REDUNDANCY */}
                {section.id !== 'intro' && (
                  <div className="flex items-baseline gap-4 mb-8">
                    <span className="text-slate-200 dark:text-slate-800 text-5xl font-black select-none absolute -ml-16 hidden lg:block font-sans">
                      {(index + 1).toString().padStart(2, '0')}
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-sans tracking-tight relative z-10">
                      {section.title.replace(/^\d+\.\s*/, '')}
                    </h2>
                  </div>
                )}

                {/* Direct Rendering of ReactNode Content */}
                <div className="markdown-content">
                  {section.content}
                </div>

                <div className="space-y-8 mt-8">
                  {section.codeBlocks.map((block, idx) => (
                    <CodeBlock 
                      key={idx} 
                      code={block.code} 
                      label={block.label} 
                      explanation={block.explanation}
                      playgroundUrl={block.playgroundUrl}
                    />
                  ))}
                </div>

                <SectionCheckpoint section={section} />
                <InlineQuiz section={section} />
                
                {index < GUIDE_SECTIONS.length - 1 && (
                  <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-800 to-transparent mt-16"></div>
                )}
              </section>
            ))}
          </div>
          
          <div className="mt-32 p-8 sm:p-12 bg-slate-900 text-white rounded-2xl text-center shadow-xl border border-slate-800">
            <div className="w-16 h-16 bg-brand-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-brand-900/50">
               <Award size={32} className="text-white" />
            </div>
            <h3 className="text-3xl font-bold mb-3 font-sans tracking-tight">Guide Completed</h3>
            <p className="text-slate-400 mb-8 font-serif text-lg">You've leveled up your PHP type safety knowledge.</p>
            <div className="inline-block px-6 py-3 bg-slate-800 rounded-lg border border-slate-700">
              <span className="text-slate-400 font-sans uppercase text-xs tracking-wider mr-3">Total Experience</span>
              <span className="text-3xl font-mono font-bold text-brand-400">{userState.xp} XP</span>
            </div>
          </div>
        </main>

        <aside className="hidden lg:block w-72 shrink-0">
          <div className="sticky top-28 space-y-10">
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest mb-6 font-sans border-b border-slate-100 dark:border-slate-800 pb-2">Contents</h4>
              <TableOfContents />
            </div>
            
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)]">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 rounded-lg flex items-center justify-center border border-brand-100 dark:border-brand-900/50">
                  <Terminal size={20} />
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-sans mb-0.5">Rank</div>
                  <div className="font-bold text-slate-900 dark:text-white font-sans tracking-tight">
                    {userState.xp < 500 ? 'Junior Typer' : userState.xp < 1000 ? 'Strict Typer' : 'PHPStan Hero'}
                  </div>
                </div>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-serif border-t border-slate-100 dark:border-slate-800 pt-4 mt-2">
                Complete sections and quizzes to earn XP. Validated knowledge is the only currency here.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default App;