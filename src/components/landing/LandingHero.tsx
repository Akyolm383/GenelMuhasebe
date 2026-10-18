import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  CheckCircle2,
  CheckCheck,
  Maximize2,
  ReceiptText,
  ShieldCheck,
} from 'lucide-react';
import {
  HERO_VOUCHER_SCENARIOS,
  type HeroVoucherScenario,
} from '../../data/atelierMockData';

export interface LandingHeroProps {
  readonly activeHeroScenarioIndex: number;
  readonly onSelectHeroScenarioIndex: (index: number) => void;
  readonly onStartFullSimulator: () => void;
  readonly onScrollToDossiers: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  activeHeroScenarioIndex,
  onSelectHeroScenarioIndex,
  onStartFullSimulator,
}) => {
  const activeVoucher: HeroVoucherScenario =
    HERO_VOUCHER_SCENARIOS[activeHeroScenarioIndex] ||
    HERO_VOUCHER_SCENARIOS[0];

  return (
    <section
      id="canli-sahne"
      className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start scroll-mt-28"
    >
      {/* Left Column (6 Cols) */}
      <div className="lg:col-span-6 space-y-6 pt-2 lg:pt-4">
        {/* Eyebrow Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface dark:bg-zinc-900 border border-border-subtle dark:border-zinc-800 text-text-secondary dark:text-zinc-300 text-[0.75rem] font-ledger-readout shadow-xs">
          <span className="w-2 h-2 rounded-full bg-primary-container animate-ping shrink-0" />
          <span className="tracking-wider text-[0.72rem] sm:text-[0.75rem] font-semibold text-text-primary dark:text-zinc-100 uppercase">
            GENEL MUHASEBE DERSİ • İNTERAKTİF PRATİK STÜDYOSU
          </span>
        </div>

        {/* Monumental Editorial Display Headline with Inset Pill Capsules */}
        <h1 className="text-[2.25rem] sm:text-[2.95rem] lg:text-[3.45rem] font-hero-display font-bold text-text-primary dark:text-[#F5F3EE] tracking-[-0.03em] leading-[1.09]">
          Genel Muhasebeyi{' '}
          <span className="inline-flex items-center px-3 py-1 mx-1 rounded-full bg-accent-surface dark:bg-[#3A1D16] border border-primary/20 dark:border-primary-container/40 text-primary dark:text-[#FFB4A4] font-ledger-readout text-[0.95rem] sm:text-[1.1rem] align-middle tracking-normal font-semibold tabular-nums">
            BORÇ (SOL)
          </span>{' '}
          ve{' '}
          <span className="inline-flex items-center px-3 py-1 mx-1 rounded-full bg-secondary-fixed/55 dark:bg-[#113828] border border-secondary/30 dark:border-secondary-fixed/30 text-secondary dark:text-secondary-fixed font-ledger-readout text-[0.95rem] sm:text-[1.1rem] align-middle tracking-normal font-semibold">
            ALACAK (SAĞ)
          </span>{' '}
          Mantığıyla Ezberlemeden Öğren.
        </h1>

        {/* Editorial Explanatory Copy */}
        <p className="text-text-secondary dark:text-zinc-400 text-base sm:text-[1.05rem] font-body-editorial leading-[1.65] max-w-xl">
          Derste gördüğün <strong>Yevmiye Defteri</strong>,{' '}
          <strong>Büyük Defter (T-Cetveli)</strong>, <strong>Mizan</strong> ve{' '}
          <strong>Bilanço</strong> konularını adım adım uygula. Çek işlemleri
          (101 Alınan Çekler / 103 Verilen Çekler), KDV hesaplamaları ve alış-satış
          kayıtlarında hangi hesabın neden Borç ya da Alacak yazıldığını anında
          görerek çöz.
        </p>

        {/* Interactive Scenario Quick-Selectors */}
        <div className="space-y-2.5 pt-1">
          <div className="text-[0.75rem] font-ledger-readout uppercase tracking-widest text-text-muted dark:text-zinc-400 font-semibold">
            Canlı Örnek Kayıtlar (Tıkla &amp; İncele):
          </div>
          <div className="flex flex-wrap gap-2.5">
            {HERO_VOUCHER_SCENARIOS.map((item, idx) => {
              const isSelected = idx === activeHeroScenarioIndex;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelectHeroScenarioIndex(idx)}
                  className={`px-4 py-2 rounded-full text-[0.8125rem] font-ledger-readout transition-all cursor-pointer flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container ${
                    isSelected
                      ? 'bg-surface dark:bg-zinc-900 text-primary dark:text-[#FFB4A4] border-2 border-primary-container ring-4 ring-primary-container/10 font-semibold shadow-xs'
                      : 'bg-surface dark:bg-zinc-900/70 border border-border-subtle dark:border-zinc-800 text-text-secondary dark:text-zinc-400 hover:border-text-secondary dark:hover:border-zinc-600 hover:text-text-primary dark:hover:text-zinc-200'
                  }`}
                >
                  {isSelected && (
                    <CheckCircle2 className="w-4 h-4 text-primary-container dark:text-[#FFB4A4] shrink-0" />
                  )}
                  <span>{item.pillLabel}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Row */}
        <div className="flex flex-wrap items-center gap-3.5 pt-3">
          <button
            type="button"
            onClick={onStartFullSimulator}
            className="px-6 sm:px-7 py-3.5 rounded-full bg-primary-container hover:bg-primary text-on-primary-container font-ledger-readout font-semibold text-[0.8125rem] shadow-[0_12px_24px_-6px_rgba(200,75,49,0.35)] active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-container"
          >
            <span>Seçili Soruyu Çözmeye Başla</span>
            <Maximize2 className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 text-[0.8125rem] font-ledger-readout text-semantic-balance dark:text-secondary-fixed bg-secondary-fixed/40 dark:bg-[#113828]/80 px-3.5 py-2.5 rounded-full border border-secondary/20 dark:border-secondary-fixed/25">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span className="font-medium">
              T-Cetveli &amp; Bilanço &ldquo;Kendin Doldur&rdquo; Modu
            </span>
          </div>
        </div>

        {/* Mini Metric Band */}
        <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border-subtle dark:border-zinc-800 max-w-lg tabular-nums">
          <div>
            <div className="text-[1.15rem] sm:text-[1.25rem] font-hero-display font-bold text-text-primary dark:text-[#F5F3EE]">
              101 &amp; 103 (-)
            </div>
            <div className="text-[0.75rem] font-ledger-readout text-text-muted dark:text-zinc-400">
              Çek &amp; Ciro Soruları
            </div>
          </div>
          <div>
            <div className="text-[1.15rem] sm:text-[1.25rem] font-hero-display font-bold text-text-primary dark:text-[#F5F3EE]">
              191 &amp; 391
            </div>
            <div className="text-[0.75rem] font-ledger-readout text-text-muted dark:text-zinc-400">
              %20 KDV &amp; Mahsup
            </div>
          </div>
          <div>
            <div className="text-[1.15rem] sm:text-[1.25rem] font-hero-display font-bold text-text-primary dark:text-[#F5F3EE]">
              T-Cetveli
            </div>
            <div className="text-[0.75rem] font-ledger-readout text-text-muted dark:text-zinc-400">
              Kendin Doldur &amp; Bilanço
            </div>
          </div>
        </div>
      </div>

      {/* Right Column (6 Cols) — Tactile Financial Voucher Stage */}
      <div className="lg:col-span-6">
        <div className="bg-surface dark:bg-[#1C1B19] rounded-[2rem] p-5 sm:p-6 lg:p-7 shadow-[0_12px_32px_-8px_rgba(24,24,27,0.06),0_2px_6px_-1px_rgba(24,24,27,0.04)] border border-border-subtle dark:border-zinc-800 space-y-5 relative overflow-hidden">
          {/* Tactile Paper Watermark / Header Line */}
          <div className="flex flex-wrap justify-between items-center gap-2 pb-3 border-b border-border-subtle dark:border-zinc-800">
            <div className="flex items-center gap-2">
              <ReceiptText className="w-4 h-4 text-text-secondary dark:text-zinc-400" />
              <span className="text-[0.8125rem] font-ledger-readout font-semibold text-text-primary dark:text-[#F5F3EE]">
                CANLI YEVMİYE &amp; T-CETVELİ ÖNİZLEMESİ
              </span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-surface-muted dark:bg-zinc-800 text-text-secondary dark:text-zinc-300 text-[0.6875rem] font-ledger-readout uppercase font-medium tabular-nums">
              {activeVoucher.caseFileCode}
            </span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeVoucher.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="space-y-4"
            >
              {/* Stamped e-Invoice Voucher */}
              <div className="bg-surface-muted/60 dark:bg-zinc-900/80 rounded-xl p-4 border border-border-subtle dark:border-zinc-800 relative overflow-hidden">
                <div className="absolute -right-6 -bottom-6 w-28 h-28 rounded-full border-2 border-semantic-balance/20 dark:border-secondary-fixed/15 flex items-center justify-center pointer-events-none rotate-12">
                  <span className="text-[0.625rem] font-ledger-readout uppercase text-semantic-balance/40 dark:text-secondary-fixed/30 font-bold tracking-widest text-center leading-tight">
                    ÖRNEK BELGE
                    <br />
                    ÇÖZÜMÜ
                  </span>
                </div>

                <div className="flex flex-wrap justify-between items-start gap-2 mb-3">
                  <div>
                    <span className="inline-block px-2 py-0.5 rounded bg-surface dark:bg-zinc-800 border border-border-subtle dark:border-zinc-700 text-[0.6875rem] font-ledger-readout text-text-secondary dark:text-zinc-300 font-semibold tabular-nums">
                      {activeVoucher.invoiceBadge}
                    </span>
                    <p className="text-[0.75rem] font-ledger-readout text-text-muted dark:text-zinc-400 mt-1 tabular-nums">
                      {activeVoucher.invoiceMeta}
                    </p>
                  </div>
                  <span className="text-[0.75rem] font-ledger-readout font-semibold text-primary dark:text-[#FFB4A4] bg-accent-surface dark:bg-[#3A1D16] px-2.5 py-0.5 rounded">
                    {activeVoucher.transactionTypeBadge}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-ledger-readout text-[0.75rem] mb-3">
                  <div className="p-2.5 bg-surface dark:bg-zinc-900 rounded border border-border-subtle dark:border-zinc-800">
                    <span className="text-text-muted dark:text-zinc-400 block text-[0.6875rem]">
                      Satıcı / Kaynak Taraf
                    </span>
                    <span className="font-semibold text-text-primary dark:text-zinc-100">
                      {activeVoucher.sellerName}
                    </span>
                    <span className="text-text-muted dark:text-zinc-500 block text-[0.625rem] tabular-nums">
                      {activeVoucher.sellerVkn}
                    </span>
                  </div>
                  <div className="p-2.5 bg-surface dark:bg-zinc-900 rounded border border-border-subtle dark:border-zinc-800">
                    <span className="text-text-muted dark:text-zinc-400 block text-[0.6875rem]">
                      Alıcı / İşletme Tarafı
                    </span>
                    <span className="font-semibold text-text-primary dark:text-zinc-100">
                      {activeVoucher.buyerName}
                    </span>
                    <span className="text-text-muted dark:text-zinc-500 block text-[0.625rem] tabular-nums">
                      {activeVoucher.buyerVkn}
                    </span>
                  </div>
                </div>

                {/* Monetary Breakdown Table */}
                <div className="space-y-1 font-ledger-readout text-[0.8125rem] border-t border-dashed border-border-subtle dark:border-zinc-700 pt-2 tabular-nums">
                  <div className="flex justify-between text-text-secondary dark:text-zinc-300">
                    <span>{activeVoucher.subtotalLabel}</span>
                    <span className="font-medium text-text-primary dark:text-zinc-100">
                      {activeVoucher.subtotalAmount}
                    </span>
                  </div>
                  <div className="flex justify-between text-text-secondary dark:text-zinc-300">
                    <span>{activeVoucher.taxLabel}</span>
                    <span className="font-medium text-text-primary dark:text-zinc-100">
                      {activeVoucher.taxAmount}
                    </span>
                  </div>
                  <div className="flex justify-between font-semibold text-text-primary dark:text-white text-[0.875rem] pt-1 border-t border-border-subtle dark:border-zinc-800">
                    <span>Toplam İşlem Tutarı:</span>
                    <span className="text-primary dark:text-[#FFB4A4] font-bold">
                      {activeVoucher.totalAmount}
                    </span>
                  </div>
                </div>
              </div>

              {/* Tactile Journal Entry Voucher (Yevmiye Maddesi) */}
              <div className="bg-surface dark:bg-zinc-900 rounded-xl p-4 border-2 border-border-subtle dark:border-zinc-800 shadow-xs space-y-3 tabular-nums">
                <div className="flex justify-between items-center text-[0.8125rem] font-ledger-readout">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-surface-contrast dark:bg-[#F5F3EE] text-surface dark:text-[#18181B] text-[0.6875rem] font-bold">
                      YEVMİYE DEFTERİ
                    </span>
                    <span className="text-text-primary dark:text-zinc-100 font-semibold">
                      Madde No: {activeVoucher.entryNo}
                    </span>
                  </div>
                  <span className="text-text-muted dark:text-zinc-400 text-[0.75rem]">
                    Tarih: {activeVoucher.entryDate}
                  </span>
                </div>

                {/* Table Header */}
                <div className="grid grid-cols-12 gap-2 text-[0.6875rem] font-ledger-readout uppercase text-text-muted dark:text-zinc-400 font-bold border-b border-border-subtle dark:border-zinc-800 pb-1">
                  <div className="col-span-2">KOD</div>
                  <div className="col-span-5">HESAP ADI &amp; NEDENİ</div>
                  <div className="col-span-2 text-right">BORÇ (SOL)</div>
                  <div className="col-span-3 text-right">ALACAK (SAĞ)</div>
                </div>

                {/* Journal Lines */}
                {activeVoucher.journalLines.map((line, lineIdx) => {
                  const isCredit = line.side === 'CREDIT';
                  return (
                    <div
                      key={`${line.code}-${lineIdx}`}
                      className={`grid grid-cols-12 gap-2 font-ledger-readout text-[0.78rem] sm:text-[0.8125rem] items-center py-1.5 ${
                        lineIdx > 0
                          ? 'border-t border-border-subtle/50 dark:border-zinc-800'
                          : ''
                      } ${
                        isCredit
                          ? 'bg-surface-muted/35 dark:bg-zinc-800/40 -mx-2 px-2 rounded'
                          : ''
                      }`}
                    >
                      <div
                        className={`col-span-2 font-bold ${
                          isCredit
                            ? 'text-secondary dark:text-secondary-fixed'
                            : 'text-primary dark:text-[#FFB4A4]'
                        }`}
                      >
                        {line.code}
                      </div>
                      <div
                        className={`col-span-5 min-w-0 ${
                          isCredit
                            ? 'pl-3 sm:pl-4 border-l-2 border-primary/40 dark:border-primary-container/50'
                            : ''
                        }`}
                      >
                        <div className="font-semibold text-text-primary dark:text-zinc-100 truncate">
                          {line.name}
                        </div>
                        <div className="text-[0.6875rem] text-text-muted dark:text-zinc-400 truncate">
                          {line.subtitle}
                        </div>
                      </div>
                      <div
                        className={`col-span-2 text-right ${
                          line.debit !== '—'
                            ? 'font-semibold text-text-primary dark:text-zinc-100'
                            : 'text-text-muted dark:text-zinc-500'
                        }`}
                      >
                        {line.debit}
                      </div>
                      <div
                        className={`col-span-3 text-right ${
                          line.credit !== '—'
                            ? 'font-bold text-secondary dark:text-secondary-fixed'
                            : 'text-text-muted dark:text-zinc-500'
                        }`}
                      >
                        {line.credit}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Micro T-Accounts (Defterikebir T-Cetvelleri) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 tabular-nums">
                {/* T-Account Left */}
                <div className="bg-surface-muted/50 dark:bg-zinc-900/70 rounded-xl p-3 border border-border-subtle dark:border-zinc-800">
                  <div className="text-center font-ledger-readout text-[0.75rem] font-bold pb-1 border-b-2 border-text-primary dark:border-zinc-300 text-text-primary dark:text-zinc-100">
                    {activeVoucher.tAccountLeft.title}
                  </div>
                  <div className="grid grid-cols-2 divide-x divide-text-primary/30 dark:divide-zinc-700 pt-2 font-ledger-readout text-[0.75rem]">
                    <div className="pr-2 space-y-1">
                      <span className="text-[0.625rem] text-text-muted dark:text-zinc-400 block">
                        SOL (BORÇ)
                      </span>
                      <div className="font-semibold text-semantic-balance dark:text-secondary-fixed">
                        {activeVoucher.tAccountLeft.debitAmount}
                      </div>
                      <div className="text-[0.625rem] text-text-secondary dark:text-zinc-400">
                        {activeVoucher.tAccountLeft.debitNote}
                      </div>
                    </div>
                    <div className="pl-2 space-y-1 text-right">
                      <span className="text-[0.625rem] text-text-muted dark:text-zinc-400 block">
                        SAĞ (ALACAK)
                      </span>
                      <div className="text-text-muted dark:text-zinc-500">
                        {activeVoucher.tAccountLeft.creditAmount}
                      </div>
                      <div className="text-[0.625rem] text-text-muted dark:text-zinc-500">
                        {activeVoucher.tAccountLeft.creditNote}
                      </div>
                    </div>
                  </div>
                </div>

                {/* T-Account Right */}
                <div className="bg-surface-muted/50 dark:bg-zinc-900/70 rounded-xl p-3 border border-border-subtle dark:border-zinc-800">
                  <div className="text-center font-ledger-readout text-[0.75rem] font-bold pb-1 border-b-2 border-text-primary dark:border-zinc-300 text-text-primary dark:text-zinc-100">
                    {activeVoucher.tAccountRight.title}
                  </div>
                  <div className="grid grid-cols-2 divide-x divide-text-primary/30 dark:divide-zinc-700 pt-2 font-ledger-readout text-[0.75rem]">
                    <div className="pr-2 space-y-1">
                      <span className="text-[0.625rem] text-text-muted dark:text-zinc-400 block">
                        SOL (BORÇ)
                      </span>
                      <div className="text-text-muted dark:text-zinc-500">
                        {activeVoucher.tAccountRight.debitAmount}
                      </div>
                      <div className="text-[0.625rem] text-text-muted dark:text-zinc-500">
                        {activeVoucher.tAccountRight.debitNote}
                      </div>
                    </div>
                    <div className="pl-2 space-y-1 text-right">
                      <span className="text-[0.625rem] text-text-muted dark:text-zinc-400 block">
                        SAĞ (ALACAK)
                      </span>
                      <div className="font-semibold text-primary dark:text-[#FFB4A4]">
                        {activeVoucher.tAccountRight.creditAmount}
                      </div>
                      <div className="text-[0.625rem] text-secondary dark:text-secondary-fixed">
                        {activeVoucher.tAccountRight.creditNote}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Balance Confirmation Strip */}
              <div className="bg-surface-contrast text-surface rounded-xl p-3 flex flex-col sm:flex-row justify-between items-center gap-2 font-ledger-readout text-[0.75rem] sm:text-[0.8125rem] shadow-md tabular-nums">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-secondary-fixed animate-ping shrink-0" />
                  <span className="text-text-muted">
                    BORÇ (SOL):{' '}
                    <strong className="text-surface font-mono">
                      {activeVoucher.totalAmount}
                    </strong>
                  </span>
                  <span className="text-text-muted">=</span>
                  <span className="text-text-muted">
                    ALACAK (SAĞ):{' '}
                    <strong className="text-surface font-mono">
                      {activeVoucher.totalAmount}
                    </strong>
                  </span>
                </div>
                <div className="px-3 py-1 rounded bg-secondary/30 text-secondary-fixed text-[0.72rem] font-bold flex items-center gap-1 border border-secondary/40 shrink-0">
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>BORÇ = ALACAK EŞİT ✓</span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
