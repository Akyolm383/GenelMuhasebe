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
  const [filterDifficulty, setFilterDifficulty] = React.useState<
    'all' | 'Kolay' | 'Orta' | 'İleri'
  >('all');

  const selectedScenario =
    scenarios.find((s) => s.id === selectedScenarioId) || scenarios[0];

  const getDifficultyBadgeStyle = (difficulty: string) => {
    if (difficulty === 'Kolay') {
      return {
        label: 'Seviye: Temel',
        badgeClass:
          'bg-secondary-fixed/50 dark:bg-[#113828] text-secondary dark:text-secondary-fixed',
        metaClass: 'text-secondary dark:text-secondary-fixed font-semibold',
      };
    }
    if (difficulty === 'Orta') {
      return {
        label: 'Seviye: Orta (Vize)',
        badgeClass:
          'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300',
        metaClass: 'text-primary dark:text-[#FFB4A4] font-semibold',
      };
    }
    return {
      label: 'Seviye: İleri (Final)',
      badgeClass:
        'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300',
      metaClass: 'text-text-primary dark:text-zinc-100 font-semibold',
    };
  };

  const getScenarioTopicMeta = (scenario: CompanyScenario) => {
    switch (scenario.id) {
      case 'abc-ticaret-temel':
        return 'Kuruluş, Kasa & Çek (101/103)';
      case 'trend-eticaret-iskonto-kolay':
        return 'POS, Kargo & İskonto (611)';
      case 'bogazici-kredi-faiz-kolay':
        return 'Banka Kredisi (300) & Faiz (780)';
      case 'anadolu-cek-kdv-orta':
        return 'Çek Cirosu, POS & %20 KDV';
      case 'atlas-medikal-doviz-orta':
        return 'Döviz Alımı & Kur Kâr/Zararı (646/656)';
      case 'dogu-otomotiv-senet-orta':
        return 'Senet Protestosu & Vade Farkı (121/642)';
      case 'ege-lojistik-supheli-orta':
        return 'Şüpheli Alacak & Karşılık (128/129/654)';
      case 'marmara-endustri-ileri':
        return 'Senet, STMM (621) & Amortisman';
      case 'nova-teknoloji-bordro-ileri':
        return 'Personel Bordrosu & SGK (335/361)';
      case 'zirve-insaat-varlik-ileri':
        return 'Duran Varlık Satışı & Kâr/Zarar (679/689)';
      case 'doruk-sanayi-kapanis-ileri':
        return 'Dönem Sonu 690 Devir & Net Kâr (590)';
      default:
        return scenario.difficulty === 'Kolay'
          ? 'Temel Kasa & Çek'
          : scenario.difficulty === 'Orta'
          ? 'Ticari İşlemler & KDV'
          : 'Dönem Sonu & Kapanış';
    }
  };

  const filteredScenarios =
    filterDifficulty === 'all'
      ? scenarios
      : scenarios.filter((s) => s.difficulty === filterDifficulty);

  const counts = {
    all: scenarios.length,
    Kolay: scenarios.filter((s) => s.difficulty === 'Kolay').length,
    Orta: scenarios.filter((s) => s.difficulty === 'Orta').length,
    İleri: scenarios.filter((s) => s.difficulty === 'İleri').length,
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
            Temel çek işlemlerinden KDV mahsubuna, personel bordrosundan dönem sonu 690 kapanış
            kayıtlarına kadar istediğin soruyu seçip çözmeye başla.
          </p>
        </div>
      </div>

      {/* Difficulty Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          type="button"
          onClick={() => setFilterDifficulty('all')}
          className={`px-4 py-2 rounded-xl text-[0.8125rem] font-ledger-readout font-bold whitespace-nowrap transition-all cursor-pointer ${
            filterDifficulty === 'all'
              ? 'bg-surface-contrast text-surface dark:bg-[#F5F3EE] dark:text-[#18181B] shadow-xs'
              : 'bg-surface dark:bg-zinc-900 border border-border-subtle dark:border-zinc-800 text-text-secondary dark:text-zinc-400 hover:text-text-primary dark:hover:text-white'
          }`}
        >
          Tüm Sorular ({counts.all})
        </button>
        <button
          type="button"
          onClick={() => setFilterDifficulty('Kolay')}
          className={`px-4 py-2 rounded-xl text-[0.8125rem] font-ledger-readout font-bold whitespace-nowrap transition-all cursor-pointer ${
            filterDifficulty === 'Kolay'
              ? 'bg-secondary text-on-secondary shadow-xs'
              : 'bg-surface dark:bg-zinc-900 border border-border-subtle dark:border-zinc-800 text-text-secondary dark:text-zinc-400 hover:text-secondary'
          }`}
        >
          Temel Seviye ({counts.Kolay})
        </button>
        <button
          type="button"
          onClick={() => setFilterDifficulty('Orta')}
          className={`px-4 py-2 rounded-xl text-[0.8125rem] font-ledger-readout font-bold whitespace-nowrap transition-all cursor-pointer ${
            filterDifficulty === 'Orta'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'bg-surface dark:bg-zinc-900 border border-border-subtle dark:border-zinc-800 text-text-secondary dark:text-zinc-400 hover:text-amber-500'
          }`}
        >
          Orta (Vize) Seviye ({counts.Orta})
        </button>
        <button
          type="button"
          onClick={() => setFilterDifficulty('İleri')}
          className={`px-4 py-2 rounded-xl text-[0.8125rem] font-ledger-readout font-bold whitespace-nowrap transition-all cursor-pointer ${
            filterDifficulty === 'İleri'
              ? 'bg-primary text-white shadow-xs'
              : 'bg-surface dark:bg-zinc-900 border border-border-subtle dark:border-zinc-800 text-text-secondary dark:text-zinc-400 hover:text-primary'
          }`}
        >
          İleri (Final) Seviye ({counts.İleri})
        </button>
      </div>

      {/* Physical Folder Dossier Cards (Filtered Scenarios + 1 Generator Card) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 tabular-nums">
        {filteredScenarios.map((scenario) => {
          const isSelected = scenario.id === selectedScenarioId;
          const diffMeta = getDifficultyBadgeStyle(scenario.difficulty);
          const topicMeta = getScenarioTopicMeta(scenario);
          const originalIdx = scenarios.findIndex((s) => s.id === scenario.id);
          const dossierNumber = String(originalIdx + 1).padStart(2, '0');

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
                <div className="flex justify-between items-center gap-1.5">
                  <span
                    className={`px-2 py-0.5 rounded text-[0.65rem] font-ledger-readout font-bold whitespace-nowrap shrink-0 ${
                      isSelected
                        ? 'bg-accent-surface dark:bg-[#3A1D16] text-primary dark:text-[#FFB4A4]'
                        : 'bg-surface-muted dark:bg-zinc-800 text-text-secondary dark:text-zinc-300'
                    }`}
                  >
                    SORU SETİ #{dossierNumber}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[0.65rem] font-ledger-readout font-bold whitespace-nowrap shrink-0 ${diffMeta.badgeClass}`}
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
                  <div className="flex justify-between items-center gap-2">
                    <span className="shrink-0">Ders Konusu:</span>
                    <span className={`text-right truncate ${diffMeta.metaClass}`}>
                      {topicMeta}
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
                  className={`w-full py-2.5 rounded-xl text-[0.8125rem] font-ledger-readout font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap ${
                    isSelected
                      ? 'bg-primary-container hover:bg-primary text-on-primary-container shadow-xs'
                      : 'bg-surface-muted dark:bg-zinc-800 hover:bg-surface-contrast hover:text-surface dark:hover:bg-[#F5F3EE] dark:hover:text-[#18181B] text-text-primary dark:text-zinc-100'
                  }`}
                >
                  <span>
                    {isSelected ? 'Bu Soruyu Çözmeye Başla' : 'Soruyu Seç'}
                  </span>
                  {isSelected ? (
                    <Check className="w-4 h-4 shrink-0" />
                  ) : (
                    <ChevronRight className="w-4 h-4 shrink-0" />
                  )}
                </button>
              </div>
            </div>
          );
        })}

        {/* Dossier #04: Konu Odaklı Soru Üretici */}
        <div className="bg-surface-muted/60 dark:bg-zinc-900/60 rounded-[2rem] p-6 border-2 border-dashed border-border-subtle dark:border-zinc-700 hover:border-text-secondary dark:hover:border-zinc-500 transition-all space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex justify-between items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-surface dark:bg-zinc-800 text-text-primary dark:text-zinc-100 text-[0.65rem] font-ledger-readout font-bold whitespace-nowrap shrink-0">
                SORU ÜRETİCİ
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-primary-fixed dark:bg-[#3A1D16] text-primary dark:text-[#FFB4A4] text-[0.65rem] font-ledger-readout font-bold whitespace-nowrap shrink-0">
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
                  10 Farklı Ders Konusu
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
              className="w-full py-2.5 rounded-xl bg-surface dark:bg-zinc-800 border border-border-subtle dark:border-zinc-700 hover:bg-surface-contrast hover:text-surface dark:hover:bg-[#F5F3EE] dark:hover:text-[#18181B] text-text-primary dark:text-zinc-100 text-[0.8125rem] font-ledger-readout font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container"
            >
              <Dices className="w-4 h-4 shrink-0" />
              <span>Özel Soru Seti Oluştur</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Tactile Command Dock */}
      <div className="bg-surface dark:bg-[#1C1B19] rounded-3xl p-4 sm:p-5 lg:px-6 border border-border-subtle dark:border-zinc-800 shadow-md flex flex-col lg:flex-row justify-between items-center gap-4">
        {/* Mode Switcher */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto justify-center lg:justify-start">
          <span className="font-ledger-readout text-text-muted dark:text-zinc-400 text-xs font-semibold uppercase tracking-wider whitespace-nowrap shrink-0">
            Çalışma Modu:
          </span>
          <div className="inline-flex flex-col sm:flex-row items-stretch sm:items-center p-1 bg-surface-muted dark:bg-zinc-900 rounded-2xl sm:rounded-full border border-border-subtle dark:border-zinc-800 w-full sm:w-auto shrink-0">
            <button
              type="button"
              onClick={() => onSelectMode('ogrenme')}
              className={`px-3.5 sm:px-4 py-2 rounded-xl sm:rounded-full text-xs font-ledger-readout transition-all flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap ${
                selectedMode === 'ogrenme'
                  ? 'bg-surface dark:bg-zinc-800 text-text-primary dark:text-white font-semibold shadow-xs'
                  : 'text-text-secondary dark:text-zinc-400 hover:text-text-primary dark:hover:text-zinc-200'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full shrink-0 ${
                  selectedMode === 'ogrenme'
                    ? 'bg-secondary'
                    : 'bg-text-muted/40'
                }`}
              />
              <span>
                Öğrenme Modu{' '}
                <span className="opacity-75 font-normal">(İpuçlu Rehber)</span>
              </span>
            </button>

            <button
              type="button"
              onClick={() => onSelectMode('calisma')}
              className={`px-3.5 sm:px-4 py-2 rounded-xl sm:rounded-full text-xs font-ledger-readout transition-all flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap ${
                selectedMode === 'calisma'
                  ? 'bg-surface dark:bg-zinc-800 text-text-primary dark:text-white font-semibold shadow-xs'
                  : 'text-text-secondary dark:text-zinc-400 hover:text-text-primary dark:hover:text-zinc-200'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full shrink-0 ${
                  selectedMode === 'calisma'
                    ? 'bg-primary-container'
                    : 'bg-text-muted/40'
                }`}
              />
              <span>
                Sınav Modu{' '}
                <span className="opacity-75 font-normal">(Kendini Test Et)</span>
              </span>
            </button>
          </div>
        </div>

        {/* Primary Dossier Action CTA */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-center min-w-0 sm:shrink-0">
          <button
            type="button"
            onClick={onStart}
            className="w-full sm:w-auto max-w-full px-4 sm:px-6 py-2.5 sm:py-3 rounded-full bg-surface-contrast dark:bg-primary-container text-surface hover:opacity-95 active:scale-[0.98] font-ledger-readout font-semibold text-xs transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer whitespace-nowrap min-w-0 sm:shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-container"
          >
            <span className="truncate">
              Seçili Soruyu Çöz:{' '}
              {selectedScenario.companyName.replace(/\s*\(.*?\)\s*/g, '')}
            </span>
            <ArrowRight className="w-4 h-4 shrink-0" />
          </button>
        </div>
      </div>
    </section>
  );
};
