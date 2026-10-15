import React from 'react';
import { BookOpen, Sun, Moon, ArrowRight } from 'lucide-react';
import { useAccountingStore } from '../../store/useAccountingStore';

interface LandingNavbarProps {
  onOpenAccountsGuide: () => void;
  onScrollToScenarios: () => void;
}

export const LandingNavbar: React.FC<LandingNavbarProps> = ({
  onOpenAccountsGuide,
  onScrollToScenarios,
}) => {
  const { theme, toggleTheme } = useAccountingStore();

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/75 dark:bg-black/75 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo & Başlık */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="w-9 h-9 rounded-xl bg-black dark:bg-white text-white dark:text-black flex items-center justify-center font-mono font-black text-sm shadow-sm transition-transform hover:scale-105">
            GM
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm sm:text-base tracking-tight text-zinc-900 dark:text-white">
                Genel Muhasebe
              </span>
              <span className="text-[10px] font-mono font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 hidden sm:inline-block">
                Simülatör v2.0
              </span>
            </div>
          </div>
        </div>

        {/* Hızlı Gezinme Linkleri (Masaüstü) */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-zinc-600 dark:text-zinc-400">
          <button
            type="button"
            onClick={() => scrollToSection('accounting-pipeline')}
            className="hover:text-black dark:hover:text-white transition-colors cursor-pointer"
          >
            Nasıl Çalışır?
          </button>
          <button
            type="button"
            onClick={() => scrollToSection('bento-features')}
            className="hover:text-black dark:hover:text-white transition-colors cursor-pointer"
          >
            Özellikler
          </button>
          <button
            type="button"
            onClick={() => scrollToSection('tdhp-explorer')}
            className="hover:text-black dark:hover:text-white transition-colors cursor-pointer"
          >
            Hesap Planı
          </button>
          <button
            type="button"
            onClick={onScrollToScenarios}
            className="hover:text-black dark:hover:text-white transition-colors cursor-pointer"
          >
            Senaryolar
          </button>
        </nav>

        {/* Sağ Aksiyonlar */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onOpenAccountsGuide}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-zinc-700 dark:text-zinc-200 bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-xl border border-zinc-200/80 dark:border-zinc-800 transition-colors cursor-pointer"
            title="Tekdüzen Hesap Planı Hızlı Rehberi"
          >
            <BookOpen className="w-3.5 h-3.5 text-zinc-600 dark:text-zinc-400" />
            <span className="hidden sm:inline">TDHP Rehberi</span>
          </button>

          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Temayı Değiştir"
            className="p-2 text-zinc-600 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-xl border border-zinc-200/80 dark:border-zinc-800 transition-colors cursor-pointer"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-zinc-800" />
            )}
          </button>

          <button
            type="button"
            onClick={onScrollToScenarios}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-white bg-black hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 rounded-xl shadow-xs transition-all hover:scale-[1.02] cursor-pointer"
          >
            <span>Simülasyonu Aç</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
