import React from 'react';
import {
  ArrowRight,
  BookOpen,
  Moon,
  SlidersHorizontal,
  Sun,
} from 'lucide-react';
import { useAccountingStore, type AppMode } from '../../store/useAccountingStore';

export interface LandingNavbarProps {
  readonly activeSection: string;
  readonly selectedMode: AppMode;
  readonly onToggleMode: () => void;
  readonly onSelectSection: (sectionId: string) => void;
  readonly onOpenAccountsGuide: () => void;
  readonly onOpenGenerator: () => void;
  readonly onStartSimulator: () => void;
}

export const LandingNavbar: React.FC<LandingNavbarProps> = ({
  activeSection,
  selectedMode,
  onToggleMode,
  onSelectSection,
  onOpenAccountsGuide,
  onOpenGenerator,
  onStartSimulator,
}) => {
  const { theme, toggleTheme } = useAccountingStore();

  // Sayfadaki gerçek yukarıdan aşağıya (DOM) sıralamasıyla birebir aynı sıra:
  // 1. canli-sahne -> 2. koreografi -> 3. tdhp-atlasi -> 4. dosyalar
  const navItems = [
    { id: 'canli-sahne', code: '01', label: 'Yevmiye & T-Cetveli' },
    { id: 'koreografi', code: '02', label: '4 Adımda Muhasebe' },
    { id: 'tdhp-atlasi', code: '03', label: 'Hesap Rehberi' },
    { id: 'dosyalar', code: '04', label: 'Çalışma Soruları' },
  ];

  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 w-[calc(100%-1.5rem)] sm:w-[calc(100%-2rem)] max-w-7xl rounded-full z-50 bg-surface/95 dark:bg-[#1C1B19]/95 backdrop-blur-md border border-border-subtle dark:border-zinc-800 shadow-[0_12px_32px_-8px_rgba(24,24,27,0.06),0_2px_6px_-1px_rgba(24,24,27,0.04)] transition-colors">
      <div className="flex justify-between items-center px-3 sm:px-4 xl:px-5 py-2 sm:py-2.5 w-full gap-2">
        {/* Brand Logo / Product Name */}
        <button
          type="button"
          onClick={() => onSelectSection('canli-sahne')}
          className="flex items-center gap-2 group text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container rounded-full min-w-0 shrink sm:shrink-0"
        >
          <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full bg-surface-contrast dark:bg-[#F5F3EE] text-surface dark:text-[#18181B] text-[10px] font-ledger-readout font-bold tracking-wider uppercase whitespace-nowrap shrink-0">
            <span className="xl:hidden">GM</span>
            <span className="hidden xl:inline">GM / ATÖLYE</span>
          </span>
          <span className="text-xs sm:text-sm font-hero-display font-bold tracking-tight text-text-primary dark:text-[#F5F3EE] leading-tight truncate sm:whitespace-nowrap group-hover:text-primary transition-colors">
            Genel Muhasebe Stüdyosu
          </span>
        </button>

        {/* Center Navigation Links */}
        <nav
          className="hidden lg:flex items-center gap-2 xl:gap-4 shrink-0"
          aria-label="Ana Bölümler"
        >
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectSection(item.id)}
                className={`cursor-pointer transition-colors pb-0.5 whitespace-nowrap flex items-center gap-1 text-[11px] xl:text-xs font-body-editorial focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container rounded ${
                  isActive
                    ? 'text-primary dark:text-[#FFB4A4] border-b-2 border-primary dark:border-[#FFB4A4] font-bold'
                    : 'text-text-secondary dark:text-zinc-400 hover:text-text-primary dark:hover:text-white font-semibold'
                }`}
              >
                <span className="font-ledger-readout text-[10px] opacity-75">
                  {item.code} •
                </span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Trailing Action Controls */}
        <div className="flex items-center gap-1 sm:gap-1.5 xl:gap-2 shrink-0">
          {/* Interactive Mode Switcher Pill */}
          <button
            type="button"
            onClick={onToggleMode}
            title="Çalışma Modunu Değiştir (Öğrenme / Sınav)"
            className="hidden xl:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-muted dark:bg-zinc-800/90 text-text-secondary dark:text-zinc-200 text-[11px] font-ledger-readout font-medium border border-border-subtle dark:border-zinc-700 hover:border-text-secondary transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container"
          >
            <span
              className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                selectedMode === 'ogrenme'
                  ? 'bg-secondary animate-pulse'
                  : 'bg-primary-container'
              }`}
            />
            <span>
              Mod: {selectedMode === 'ogrenme' ? 'Öğrenme' : 'Sınav'}
            </span>
          </button>

          {/* Trailing Icon Actions: Generator, Accounts Guide, Theme */}
          <div className="flex items-center gap-0.5 text-text-secondary dark:text-zinc-300 shrink-0">
            <button
              type="button"
              onClick={onOpenGenerator}
              className="hidden sm:inline-flex p-1.5 rounded-full hover:bg-accent-surface dark:hover:bg-zinc-800 hover:text-primary dark:hover:text-[#FFB4A4] active:scale-95 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container"
              title="Yeni Çalışma Sorusu Üret"
              aria-label="Yeni Çalışma Sorusu Üret"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onOpenAccountsGuide}
              className="hidden sm:inline-flex p-1.5 rounded-full hover:bg-accent-surface dark:hover:bg-zinc-800 hover:text-primary dark:hover:text-[#FFB4A4] active:scale-95 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container"
              title="Hesap Kodları Sözlüğü"
              aria-label="Hesap Kodları Sözlüğü"
            >
              <BookOpen className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={toggleTheme}
              className="p-1.5 rounded-full hover:bg-accent-surface dark:hover:bg-zinc-800 hover:text-primary dark:hover:text-[#FFB4A4] active:scale-95 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container"
              title="Temayı Değiştir"
              aria-label="Temayı Değiştir"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Trailing Primary Action: Simülatörü Başlat */}
          <button
            type="button"
            onClick={onStartSimulator}
            className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-full bg-primary-container hover:bg-primary text-on-primary-container text-xs font-ledger-readout font-semibold shadow-sm active:scale-[0.98] transition-all duration-150 cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-container"
          >
            <span className="hidden sm:inline">Çözmeye Başla</span>
            <span className="sm:hidden">Başla</span>
            <ArrowRight className="w-3.5 h-3.5 shrink-0" />
          </button>
        </div>
      </div>
    </header>
  );
};
