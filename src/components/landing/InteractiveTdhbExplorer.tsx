import React, { useState } from 'react';
import { BookOpen, Info } from 'lucide-react';
import { TDHP_CLASS_ATLAS } from '../../data/atelierMockData';

export interface InteractiveTdhbExplorerProps {
  readonly onOpenAccountsGuide: () => void;
}

export const InteractiveTdhbExplorer: React.FC<
  InteractiveTdhbExplorerProps
> = ({ onOpenAccountsGuide }) => {
  const [activeClassId, setActiveClassId] = useState<number>(1);
  const [focusedAccountCode, setFocusedAccountCode] = useState<string>('103');

  const currentClass =
    TDHP_CLASS_ATLAS.find((c) => c.classId === activeClassId) ||
    TDHP_CLASS_ATLAS[0];

  const handleSelectClass = (classId: number) => {
    setActiveClassId(classId);
    const found = TDHP_CLASS_ATLAS.find((c) => c.classId === classId);
    const defaultFocal =
      found?.tiles.find((t) => t.isFocal)?.code || found?.tiles[0]?.code || '';
    setFocusedAccountCode(defaultFocal);
  };

  return (
    <section
      id="tdhp-atlasi"
      className="bg-surface dark:bg-[#1C1B19] rounded-[2rem] p-6 lg:p-8 border border-border-subtle dark:border-zinc-800 shadow-xs space-y-6 scroll-mt-28"
    >
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
        <div>
          <span className="text-[0.75rem] font-ledger-readout text-primary dark:text-[#FFB4A4] uppercase tracking-widest font-semibold block mb-1">
            BÖLÜM 03 // HESAP KODLARI REHBERİ (100 – 770)
          </span>
          <h3 className="text-[1.25rem] sm:text-[1.45rem] font-hero-display font-bold text-text-primary dark:text-[#F5F3EE]">
            Hangi Hesap Kodu Neyi Gösterir, Nereye Yazılır?
          </h3>
          <p className="text-[0.8125rem] text-text-secondary dark:text-zinc-400 font-ledger-readout">
            Genel Muhasebe dersinde en çok karşına çıkacak hesap grupları ve Borç (Sol) / Alacak (Sağ) çalışma kuralları.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3.5 py-1.5 rounded-full bg-surface-muted dark:bg-zinc-800 border border-border-subtle dark:border-zinc-700 font-ledger-readout text-text-secondary dark:text-zinc-300 text-[0.75rem]">
            6 Ana Hesap Grubu
          </span>
          <button
            type="button"
            onClick={onOpenAccountsGuide}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-accent-surface dark:bg-[#3A1D16] hover:bg-primary-container hover:text-white text-primary dark:text-[#FFB4A4] border border-primary/20 text-[0.75rem] font-ledger-readout font-semibold transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Tüm Hesap Kodları Sözlüğü</span>
          </button>
        </div>
      </div>

      {/* 6 Index Tabs (Architectural Binder Style) */}
      <div
        className="flex flex-wrap gap-2 border-b border-border-subtle dark:border-zinc-800 pb-4"
        role="tablist"
        aria-label="6 Ana Hesap Grubu"
      >
        {TDHP_CLASS_ATLAS.map((cls) => {
          const isActive = cls.classId === activeClassId;
          return (
            <button
              key={cls.classId}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => handleSelectClass(cls.classId)}
              className={`px-3.5 sm:px-4 py-2.5 rounded-xl text-[0.75rem] sm:text-[0.8125rem] font-ledger-readout transition-all cursor-pointer flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container ${
                isActive
                  ? 'bg-surface-contrast dark:bg-[#F5F3EE] text-surface dark:text-[#18181B] font-semibold shadow-xs'
                  : 'bg-surface-muted dark:bg-zinc-900 hover:bg-surface dark:hover:bg-zinc-800 text-text-secondary dark:text-zinc-300 font-medium border border-border-subtle dark:border-zinc-800'
              }`}
            >
              {isActive && (
                <span className="w-2 h-2 rounded-full bg-secondary-fixed dark:bg-secondary shrink-0" />
              )}
              <span>{cls.tabLabel}</span>
            </button>
          );
        })}
      </div>

      {/* Mechanical Rule Banner */}
      <div className="p-3.5 rounded-xl bg-surface-container-low dark:bg-zinc-900/90 border border-primary-container/20 dark:border-zinc-800 flex flex-col sm:flex-row justify-between sm:items-center gap-3 font-ledger-readout text-[0.8125rem]">
        <div className="flex items-start sm:items-center gap-2 text-text-primary dark:text-zinc-100 leading-relaxed">
          <Info className="w-4 h-4 text-primary dark:text-[#FFB4A4] shrink-0 mt-0.5 sm:mt-0" />
          <span>
            <strong>{currentClass.polarityTitle}</strong> Artışlar{' '}
            <span className="text-semantic-balance dark:text-secondary-fixed font-bold bg-surface dark:bg-zinc-800 px-2 py-0.5 rounded border border-border-subtle dark:border-zinc-700">
              {currentClass.increaseSide}
            </span>{' '}
            tarafa, Azalışlar{' '}
            <span className="text-primary dark:text-[#FFB4A4] font-bold bg-surface dark:bg-zinc-800 px-2 py-0.5 rounded border border-border-subtle dark:border-zinc-700">
              {currentClass.decreaseSide}
            </span>{' '}
            tarafa yazılır.
          </span>
        </div>
        <span className="text-text-muted dark:text-zinc-400 text-[0.75rem] font-mono shrink-0">
          {currentClass.balanceRule}
        </span>
      </div>

      {/* 5 Interactive Account Dossier Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 pt-1 tabular-nums">
        {currentClass.tiles.map((tile) => {
          const isFocused = tile.code === focusedAccountCode;
          return (
            <button
              key={tile.code}
              type="button"
              onClick={() => setFocusedAccountCode(tile.code)}
              className={`text-left p-4 rounded-2xl transition-all space-y-2 group flex flex-col justify-between cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container ${
                isFocused
                  ? 'bg-accent-surface/65 dark:bg-[#3A1D16]/70 border-2 border-primary-container shadow-xs'
                  : 'bg-surface-muted/30 dark:bg-zinc-900/60 border border-border-subtle dark:border-zinc-800 hover:border-primary dark:hover:border-primary-container/60'
              }`}
            >
              <div className="space-y-2 w-full">
                <div className="flex justify-between items-start gap-2">
                  <span className="text-[1.125rem] font-bold font-ledger-readout text-primary dark:text-[#FFB4A4] group-hover:scale-105 transition-transform">
                    {tile.code}
                  </span>
                  <span
                    className={`text-[0.625rem] font-ledger-readout px-2 py-0.5 rounded ${
                      isFocused
                        ? 'bg-primary-container text-white font-semibold'
                        : 'bg-surface dark:bg-zinc-800 border border-border-subtle dark:border-zinc-700 text-text-muted dark:text-zinc-400'
                    }`}
                  >
                    {isFocused ? 'Seçili Hesap' : tile.tag}
                  </span>
                </div>
                <h5 className="font-card-title text-text-primary dark:text-zinc-100 font-semibold text-[0.9375rem] leading-snug">
                  {tile.name}
                </h5>
                <p className="text-[0.75rem] text-text-secondary dark:text-zinc-400 leading-relaxed">
                  {tile.description}
                </p>
              </div>

              <div
                className={`w-full text-[0.6875rem] font-ledger-readout pt-2 border-t font-semibold ${
                  isFocused
                    ? 'text-primary dark:text-[#FFB4A4] border-primary/20 dark:border-primary-container/30'
                    : 'text-semantic-balance dark:text-secondary-fixed border-border-subtle dark:border-zinc-800'
                }`}
              >
                {tile.rule}
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};
