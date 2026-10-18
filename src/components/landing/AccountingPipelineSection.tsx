import React from 'react';
import { BrainCircuit, RefreshCw, ShieldAlert } from 'lucide-react';
import {
  HERO_VOUCHER_SCENARIOS,
  OPERATIONAL_STEPS,
} from '../../data/atelierMockData';

export interface AccountingPipelineSectionProps {
  readonly activeHeroScenarioIndex?: number;
}

export const AccountingPipelineSection: React.FC<
  AccountingPipelineSectionProps
> = ({ activeHeroScenarioIndex = 0 }) => {
  const activeVoucher =
    HERO_VOUCHER_SCENARIOS[activeHeroScenarioIndex] ||
    HERO_VOUCHER_SCENARIOS[0];

  const getStepBadgeClasses = (
    style: 'terracotta' | 'deep-terracotta' | 'charcoal' | 'jade'
  ) => {
    switch (style) {
      case 'terracotta':
        return 'bg-primary-container text-on-primary-container';
      case 'deep-terracotta':
        return 'bg-primary text-white';
      case 'charcoal':
        return 'bg-surface-contrast dark:bg-[#F5F3EE] text-surface dark:text-[#18181B]';
      case 'jade':
        return 'bg-secondary text-white';
    }
  };

  return (
    <section id="koreografi" className="space-y-8 scroll-mt-28">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border-subtle dark:border-zinc-800 pb-6">
        <div>
          <span className="text-[0.8125rem] font-ledger-readout text-primary dark:text-[#FFB4A4] uppercase tracking-widest font-semibold block mb-1">
            BÖLÜM 02 // ADIM ADIM ÇÖZÜM MANTIĞI
          </span>
          <h2 className="text-[1.75rem] sm:text-[2.25rem] font-section-header font-bold text-text-primary dark:text-[#F5F3EE] tracking-[-0.02em] leading-[1.12]">
            Sorudan Bilançoya 4 Adımda Muhasebe Mantığı
          </h2>
        </div>
        <p className="text-text-secondary dark:text-zinc-400 text-base font-body-editorial max-w-md leading-relaxed">
          Sınavda veya ödevde bir muhasebe sorusuyla karşılaştığında Yevmiye,
          T-Cetveli, Mizan ve Bilançoyu nasıl kuracağını adım adım gör.
        </p>
      </div>

      {/* Top Row: Asymmetric 7 : 5 Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: 4-Step Architectural Cards (7 Columns) */}
        <div className="lg:col-span-7 bg-surface dark:bg-[#1C1B19] rounded-[2rem] p-6 lg:p-8 border border-border-subtle dark:border-zinc-800 shadow-xs flex flex-col justify-between space-y-6">
          <div className="flex flex-wrap justify-between items-center gap-2">
            <span className="text-[1.25rem] font-hero-display font-bold text-text-primary dark:text-[#F5F3EE]">
              Bir Muhasebe Sorusu Nasıl Çözülür?
            </span>
            <span className="text-[0.75rem] font-ledger-readout text-text-muted dark:text-zinc-300 bg-surface-muted dark:bg-zinc-800 px-3 py-1 rounded-full">
              Yevmiye → T-Cetveli → Bilanço
            </span>
          </div>

          {/* 4 Sequential Step Blocks */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {OPERATIONAL_STEPS.map((step) => (
              <div
                key={step.stepNumber}
                className="p-4 rounded-2xl bg-surface-muted/40 dark:bg-zinc-900/70 border border-border-subtle dark:border-zinc-800 relative hover:border-primary/40 dark:hover:border-primary-container/50 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <span
                    className={`w-6 h-6 rounded-full text-[0.75rem] font-ledger-readout font-bold flex items-center justify-center tabular-nums ${getStepBadgeClasses(
                      step.badgeStyle
                    )}`}
                  >
                    {step.stepNumber}
                  </span>
                  <span className="text-[0.6875rem] font-ledger-readout text-text-muted dark:text-zinc-400 tabular-nums">
                    {step.vukReference}
                  </span>
                </div>
                <h4 className="font-card-title text-text-primary dark:text-zinc-100 font-semibold text-[1.05rem] mb-1">
                  {step.title}
                </h4>
                <p className="text-[0.8125rem] text-text-secondary dark:text-zinc-400 font-body-editorial leading-normal">
                  {step.description}
                </p>
              </div>
            ))}
          </div>

          {/* Tactile Balance Scale Visual Strip + Bottom Micro Status Bar */}
          <div className="pt-3 border-t border-border-subtle dark:border-zinc-800 space-y-3">
            <div className="flex items-center gap-3.5 p-2.5 rounded-xl bg-surface-muted/45 dark:bg-zinc-900/60 border border-border-subtle/80 dark:border-zinc-800">
              <img
                src="/images/atelier-balance-scale.png"
                alt="Çift Taraflı Kayıt Terazisi ve Mühür"
                className="w-16 h-12 rounded-lg object-cover border border-border-subtle dark:border-zinc-700 shrink-0"
              />
              <div className="min-w-0 flex-1">
                <div className="text-[0.75rem] font-ledger-readout font-semibold text-text-primary dark:text-zinc-100">
                  Çift Taraflı Kayıt Terazisi: Sol (Borç) = Sağ (Alacak)
                </div>
                <p className="text-[0.72rem] text-text-secondary dark:text-zinc-400 truncate">
                  İster otomatik tablo modunda izle, ister T-Cetveli ve Bilançoyu kendi elinle doldur!
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 text-[0.75rem] font-ledger-readout text-text-secondary dark:text-zinc-400">
              <span>
                Uygulama Seçeneği:{' '}
                <strong className="text-semantic-balance dark:text-secondary-fixed">
                  Otomatik veya Kendin Doldur
                </strong>
              </span>
              <span className="flex items-center gap-1.5 text-primary dark:text-[#FFB4A4] font-medium">
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Anında Hata Kontrolü</span>
              </span>
            </div>
          </div>
        </div>

        {/* Right: Student Why-Question Box & Exam Trap Warning (5 Columns) */}
        <div className="lg:col-span-5 bg-surface dark:bg-[#1C1B19] rounded-[2rem] p-6 lg:p-8 border border-border-subtle dark:border-zinc-800 shadow-xs flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-surface dark:bg-[#3A1D16] text-primary dark:text-[#FFB4A4] text-[0.75rem] font-ledger-readout font-semibold">
                <BrainCircuit className="w-3.5 h-3.5" />
                <span>Bu Hesap Neden Oraya Yazıldı?</span>
              </div>
              <span className="text-[0.75rem] font-ledger-readout text-text-muted dark:text-zinc-400 tabular-nums">
                Örnek #{activeHeroScenarioIndex + 1}
              </span>
            </div>

            <h3 className="text-[1.2rem] font-hero-display font-bold text-text-primary dark:text-[#F5F3EE] mb-3 leading-snug">
              {activeVoucher.socraticQuestion}
            </h3>

            <div className="space-y-3 font-ledger-readout text-[0.8125rem]">
              <div className="p-3.5 rounded-xl bg-surface-muted/60 dark:bg-zinc-900/80 border border-border-subtle dark:border-zinc-800 text-text-secondary dark:text-zinc-300 leading-relaxed">
                <strong className="text-text-primary dark:text-zinc-100 block font-semibold mb-1">
                  1. Mantık Adımı:
                </strong>
                <span>{activeVoucher.socraticStep1}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-surface-muted/60 dark:bg-zinc-900/80 border border-border-subtle dark:border-zinc-800 text-text-secondary dark:text-zinc-300 leading-relaxed">
                <strong className="text-text-primary dark:text-zinc-100 block font-semibold mb-1">
                  2. Kayıt Kuralı:
                </strong>
                <span>{activeVoucher.socraticStep2}</span>
              </div>
            </div>
          </div>

          {/* Exam Trap & Reverse Balance Warning Banner */}
          <div className="p-4 rounded-2xl bg-error-container/40 dark:bg-[#3A1816]/60 border border-semantic-warning/30 dark:border-semantic-warning/50 text-text-primary dark:text-zinc-100 space-y-2">
            <div className="flex items-center gap-2 text-semantic-warning dark:text-[#FFB4A4] font-ledger-readout font-bold text-[0.8125rem]">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>SINAV TUZAĞI UYARISI: 101 VE 103 ÇEK FARKI!</span>
            </div>
            <p className="text-[0.75rem] font-body-editorial text-text-secondary dark:text-zinc-300 leading-relaxed">
              <strong className="text-text-primary dark:text-white">
                En Sık Yapılan Hata:
              </strong>{' '}
              Müşteriden çek aldığında <strong>101 Alınan Çekler (Borç)</strong>,
              bu çeki başkasına ciro ettiğinde yine <strong>101 (Alacak)</strong>{' '}
              yazılır. Kendi çek karnenden çek yazıp verdiğinde ise{' '}
              <strong>103 Verilen Çekler (-) (Alacak)</strong> kullanılır!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
