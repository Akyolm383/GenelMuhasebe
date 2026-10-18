import React from 'react';
import {
  ArrowRight,
  Check,
  ChevronRight,
  Dices,
} from 'lucide-react';
import type { CompanyScenario } from '../../types/scenario';
import type { AppMode } from '../../store/useAccountingStore';

export interface ScenarioSelectionSectionProps {
  readonly scenarios: CompanyScenario[];
  readonly selectedScenarioId: string;
  readonly onSelectScenarioId: (id: string) => void;
  readonly selectedMode: AppMode;
  readonly onSelectMode: (mode: AppMode) => void;
  readonly onOpenGenerator: () => void;
  readonly onOpenAccountsGuide: () => void;
  readonly onStart: () => void;
}

export const ScenarioSelectionSection: React.FC<
  ScenarioSelectionSectionProps
> = ({
  scenarios,
  selectedScenarioId,
  onSelectScenarioId,
  selectedMode,
  onSelectMode,
  onOpenGenerator,
  onStart,
}) => {
  const selectedScenario =
    scenarios.find((s) => s.id === selectedScenarioId) || scenarios[0];

  const getDifficultyBadgeStyle = (difficulty: string) => {
    if (difficulty === 'Kolay') {
      return {
        label: 'Seviye: Temel',
        badgeClass:
          'bg-secondary-fixed/50 dark:bg-[#113828] text-secondary dark:text-secondary-fixed',
        metaText: 'Kasa, Banka & Çek (101/103)',
        metaClass: 'text-secondary dark:text-secondary-fixed font-semibold',
      };
    }
    if (difficulty === 'Orta') {
      return {
        label: 'Seviye: Orta (Vize)',
        badgeClass:
          'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300',
        metaText: 'Çek Cirosu, POS & %20 KDV',
        metaClass: 'text-primary dark:text-[#FFB4A4] font-semibold',
      };
    }
    return {
      label: 'Seviye: İleri (Final)',
      badgeClass:
        'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300',
      metaText: 'Senet, STMM (621) & Amortisman',
      metaClass: 'text-text-primary dark:text-zinc-100 font-semibold',
    };
  };

  return (
    <section id="dosyalar" className="space-y-8 scroll-mt-28">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border-subtle dark:border-zinc-800 pb-6">
        <div>
          <span className="text-[0.8125rem] font-ledger-readout text-primary dark:text-[#FFB4A4] uppercase tracking-widest font-semibold block mb-1">
            BÖLÜM 04 // ÇALIŞMA SORULARI &amp; UYGULAMA SENARYOLARI
          </span>
          <h2 className="text-[1.75rem] sm:text-[2.25rem] font-section-header font-bold text-text-primary dark:text-[#F5F3EE] tracking-[-0.02em] leading-[1.12]">
            Ders Konularına Göre Uygulama Soruları
          </h2>
        </div>

        <div className="flex items-center gap-3.5 max-w-md">
          <img
            src="/images/atelier-dossier-stamp.png"
            alt="Genel Muhasebe Uygulama Soruları"
            className="w-14 h-14 rounded-2xl object-cover border border-border-subtle dark:border-zinc-800 shadow-xs shrink-0"
          />
          <p className="text-text-secondary dark:text-zinc-400 text-[0.9375rem] font-body-editorial leading-snug">
            Temel çek işlemlerinden KDV mahsubuna ve dönem sonu amortisman
            kayıtlarına kadar istediğin soruyu seçip çözmeye başla.
          </p>
        </div>
      </div>

      {/* Physical Folder Dossier Cards (3 Scenarios + 1 Generator Card) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 tabular-nums">
        {scenarios.map((scenario, idx) => {
          const isSelected = scenario.id === selectedScenarioId;
          const diffMeta = getDifficultyBadgeStyle(scenario.difficulty);
          const dossierNumber = String(idx + 1).padStart(2, '0');

          return (
            <div
              key={scenario.id}
              onClick={() => onSelectScenarioId(scenario.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectScenarioId(scenario.id);
                }
              }}
              className={`bg-surface dark:bg-[#1C1B19] rounded-[2rem] p-6 transition-all space-y-4 relative flex flex-col justify-between cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container ${
                isSelected
                  ? 'border-2 border-primary-container shadow-lg ring-4 ring-primary-container/10'
                  : 'border border-border-subtle dark:border-zinc-800 shadow-xs hover:shadow-md hover:border-text-secondary/50'
              }`}
            >
              {isSelected && (
                <div className="absolute -top-3 right-6 bg-primary-container text-on-primary-container text-[0.6875rem] font-ledger-readout font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-xs">
                  SEÇİLİ SORU SETİ
                </div>
              )}

              <div className="space-y-4">
                <div className="flex justify-between items-start gap-2">
                  <span
                    className={`px-2.5 py-1 rounded text-[0.6875rem] font-ledger-readout font-bold ${
                      isSelected
                        ? 'bg-accent-surface dark:bg-[#3A1D16] text-primary dark:text-[#FFB4A4]'
                        : 'bg-surface-muted dark:bg-zinc-800 text-text-secondary dark:text-zinc-300'
                    }`}
                  >
                    SORU SETİ #{dossierNumber}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[0.6875rem] font-ledger-readout font-bold ${diffMeta.badgeClass}`}
                  >
                    {diffMeta.label}
                  </span>
                </div>

                <div>
                  <h4 className="text-[1.15rem] font-hero-display font-bold text-text-primary dark:text-[#F5F3EE] mb-1.5 leading-snug">
                    {scenario.companyName}
                  </h4>
                  <p className="text-[0.8125rem] text-text-secondary dark:text-zinc-400 font-body-editorial line-clamp-4 leading-relaxed">
                    {scenario.description}
                  </p>
                </div>
              </div>

              <div className="space-y-4 pt-2">
                <div className="pt-4 border-t border-border-subtle dark:border-zinc-800 text-[0.75rem] font-ledger-readout text-text-muted dark:text-zinc-400 space-y-1.5">
                  <div className="flex justify-between">
                    <span>İşlem Sayısı:</span>
                    <span className="font-mono text-text-primary dark:text-zinc-100 font-semibold">
                      {scenario.transactions.length} Yevmiye Sorusu
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Ders Konusu:</span>
                    <span className={diffMeta.metaClass}>
                      {diffMeta.metaText}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectScenarioId(scenario.id);
                    if (isSelected) {
                      onStart();
                    }
                  }}
                  className={`w-full py-2.5 rounded-xl text-[0.8125rem] font-ledger-readout font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? 'bg-primary-container hover:bg-primary text-on-primary-container shadow-xs'
                      : 'bg-surface-muted dark:bg-zinc-800 hover:bg-surface-contrast hover:text-surface dark:hover:bg-[#F5F3EE] dark:hover:text-[#18181B] text-text-primary dark:text-zinc-100'
                  }`}
                >
                  <span>
                    {isSelected ? 'Bu Soruyu Çözmeye Başla' : 'Soruyu Seç'}
                  </span>
                  {isSelected ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          );
        })}

        {/* Dossier #04: Konu Odaklı Soru Üretici */}
        <div className="bg-surface-muted/60 dark:bg-zinc-900/60 rounded-[2rem] p-6 border-2 border-dashed border-border-subtle dark:border-zinc-700 hover:border-text-secondary dark:hover:border-zinc-500 transition-all space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex justify-between items-start gap-2">
              <span className="px-2.5 py-1 rounded bg-surface dark:bg-zinc-800 text-text-primary dark:text-zinc-100 text-[0.6875rem] font-ledger-readout font-bold">
                SORU ÜRETİCİ
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-primary-fixed dark:bg-[#3A1D16] text-primary dark:text-[#FFB4A4] text-[0.6875rem] font-ledger-readout font-bold">
                Sınırsız Pratik
              </span>
            </div>
            <h4 className="text-[1.15rem] font-hero-display font-bold text-text-primary dark:text-[#F5F3EE] mb-1 leading-snug">
              Kendi Çalışma Sorunu Üret
            </h4>
            <p className="text-[0.8125rem] text-text-secondary dark:text-zinc-400 font-body-editorial leading-relaxed">
              İster sadece <strong>Çek &amp; Ciro (101/103)</strong>, ister{' '}
              <strong>KDV İşlemleri (191/391)</strong> ya da genel karma sorular
              seçerek her seferinde yeni rakamlarla pratik yap.
            </p>
          </div>

          <div className="space-y-4 pt-2">
            <div className="pt-4 border-t border-border-subtle dark:border-zinc-800 text-[0.75rem] font-ledger-readout text-text-muted dark:text-zinc-400 space-y-1.5">
              <div className="flex justify-between">
                <span>Konu Seçimi:</span>
                <span className="font-mono text-text-primary dark:text-zinc-100 font-semibold">
                  Çek / KDV / Karma
                </span>
              </div>
              <div className="flex justify-between">
                <span>Tekrar Çözüm:</span>
                <span className="text-semantic-balance dark:text-secondary-fixed font-semibold">
                  Sınırsız Yeni Soru
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onOpenGenerator}
              className="w-full py-2.5 rounded-xl bg-surface dark:bg-zinc-800 border border-border-subtle dark:border-zinc-700 hover:bg-surface-contrast hover:text-surface dark:hover:bg-[#F5F3EE] dark:hover:text-[#18181B] text-text-primary dark:text-zinc-100 text-[0.8125rem] font-ledger-readout font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container"
            >
              <Dices className="w-4 h-4" />
              <span>Özel Soru Seti Oluştur</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Tactile Command Dock */}
      <div className="bg-surface dark:bg-[#1C1B19] rounded-3xl p-5 sm:p-6 border border-border-subtle dark:border-zinc-800 shadow-md flex flex-col lg:flex-row justify-between items-center gap-5">
        {/* Mode Switcher */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
          <span className="font-ledger-readout text-text-muted dark:text-zinc-400 text-[0.8125rem]">
            Çalışma Modu:
          </span>
          <div className="inline-flex flex-wrap justify-center p-1 bg-surface-muted dark:bg-zinc-900 rounded-full border border-border-subtle dark:border-zinc-800">
            <button
              type="button"
              onClick={() => onSelectMode('ogrenme')}
              className={`px-4 py-1.5 rounded-full text-[0.78rem] sm:text-[0.8125rem] font-ledger-readout transition-all flex items-center gap-1.5 cursor-pointer ${
                selectedMode === 'ogrenme'
                  ? 'bg-surface dark:bg-zinc-800 text-text-primary dark:text-white font-semibold shadow-xs'
                  : 'text-text-secondary dark:text-zinc-400 hover:text-text-primary dark:hover:text-zinc-200'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  selectedMode === 'ogrenme'
                    ? 'bg-secondary'
                    : 'bg-text-muted/40'
                }`}
              />
              <span>Öğrenme Modu (İpuçları ve Anlık Rehber Açık)</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectMode('calisma')}
              className={`px-4 py-1.5 rounded-full text-[0.78rem] sm:text-[0.8125rem] font-ledger-readout transition-all flex items-center gap-1.5 cursor-pointer ${
                selectedMode === 'calisma'
                  ? 'bg-surface dark:bg-zinc-800 text-text-primary dark:text-white font-semibold shadow-xs'
                  : 'text-text-secondary dark:text-zinc-400 hover:text-text-primary dark:hover:text-zinc-200'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  selectedMode === 'calisma'
                    ? 'bg-primary-container'
                    : 'bg-text-muted/40'
                }`}
              />
              <span>Sınav Modu (Kendini Test Et)</span>
            </button>
          </div>
        </div>

        {/* Primary Dossier Action CTA */}
        <div className="flex items-center gap-4 w-full sm:w-auto justify-center">
          <button
            type="button"
            onClick={onStart}
            className="w-full sm:w-auto px-7 sm:px-8 py-3.5 rounded-full bg-surface-contrast dark:bg-primary-container text-surface hover:opacity-95 active:scale-[0.98] font-ledger-readout font-semibold text-[0.8125rem] transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-container"
          >
            <span>Seçili Soruyu Çöz: {selectedScenario.companyName}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
