import React, { useEffect } from 'react';
import { useAccountingStore } from '../../store/useAccountingStore';
import type { ActiveTab } from '../../store/useAccountingStore';
import { JournalEntryForm } from '../JournalEntryForm';
import { LedgerView } from '../LedgerView';
import { TrialBalanceView } from '../TrialBalanceView';
import { BalanceSheetView } from '../BalanceSheetView';
import {
  ArrowLeft,
  Sun,
  Moon,
  BookOpen,
  Lightbulb,
  CheckCircle2,
  RotateCcw,
} from 'lucide-react';

export interface WorkspaceScreenProps {
  readonly onOpenAccountsGuide: () => void;
}

export const WorkspaceScreen: React.FC<WorkspaceScreenProps> = ({
  onOpenAccountsGuide,
}) => {
  const {
    getCurrentScenario,
    getActiveTransaction,
    getTrialBalance,
    getBalanceSheet,
    activeTransactionIndex,
    setActiveTransactionIndex,
    activeTab,
    setActiveTab,
    mode,
    userEntries,
    requestNextHint,
    finishScenarioAndShowSummary,
    resetCurrentScenario,
    returnToWelcome,
    theme,
    toggleTheme,
  } = useAccountingStore();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }
  }, [activeTransactionIndex]);

  const scenario = getCurrentScenario();
  const activeTx = getActiveTransaction();
  const trialBalance = getTrialBalance();
  const balanceSheet = getBalanceSheet();
  const totalTx = scenario.transactions.length;

  const recordedCount = scenario.transactions.filter((tx) => {
    const lines = userEntries[tx.id] || [];
    return lines.some((l) => l.accountCode && (l.debit > 0 || l.credit > 0));
  }).length;

  const stages: {
    id: ActiveTab;
    code: string;
    label: string;
    shortLabel: string;
    suffix?: string;
  }[] = [
    {
      id: 'yevmiye',
      code: '01',
      label: 'Yevmiye Defteri',
      shortLabel: 'Yevmiye',
      suffix: activeTab === 'yevmiye' ? '[Aktif]' : undefined,
    },
    {
      id: 'defterikebir',
      code: '02',
      label: 'T-Cetveli (Büyük Defter)',
      shortLabel: 'T-Cetveli',
    },
    {
      id: 'mizan',
      code: '03',
      label: 'Geçici Mizan',
      shortLabel: 'Mizan',
      suffix: trialBalance.isBalanced ? '(Dengeli)' : '(Fark)',
    },
    {
      id: 'bilanco',
      code: '04',
      label: 'Bilanço',
      shortLabel: 'Bilanço',
      suffix: balanceSheet.isBalanced ? '(Denk)' : '(Fark)',
    },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden bg-background dark:bg-[#121211] text-text-primary dark:text-[#F5F3EE] font-body-editorial paper-texture flex flex-col justify-between transition-colors">
      {/* 1. YÜZEN KAPSÜL ÜST ÇALIŞMA TEZGAHI BARI (Stitch Capsule App Bar) */}
      <header className="sticky top-4 z-40 px-3 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto rounded-3xl xl:rounded-full bg-surface/95 dark:bg-[#1C1B19]/95 backdrop-blur-md border border-border-subtle dark:border-zinc-800 shadow-[0_12px_32px_-8px_rgba(24,24,27,0.06),0_2px_6px_-1px_rgba(24,24,27,0.04)] px-3.5 sm:px-5 py-2.5">
          <div className="flex items-center justify-between gap-2 sm:gap-3">
            {/* Sol: Atölye Vitrini & Şirket Dosyası */}
            <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
              <button
                type="button"
                onClick={returnToWelcome}
                className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-text-secondary dark:text-zinc-300 hover:text-text-primary dark:hover:text-white hover:bg-accent-surface dark:hover:bg-zinc-800 transition-colors active:scale-[0.98] cursor-pointer shrink-0"
                title="Ana Sayfaya Dön"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="font-ledger-readout text-xs hidden md:inline leading-tight">
                  Ana Sayfa
                </span>
              </button>

              <div className="h-5 w-px bg-border-subtle dark:bg-zinc-800 hidden sm:block shrink-0" />

              <div className="flex items-center gap-2 shrink-0">
                <span className="hidden lg:inline-flex px-2 py-1 rounded text-[10px] font-ledger-readout font-bold tracking-wider bg-surface-contrast dark:bg-[#F5F3EE] text-surface dark:text-[#18181B] uppercase leading-tight shrink-0">
                  GM / ATÖLYE
                </span>
                <div className="flex flex-col max-w-[135px] sm:max-w-[190px] xl:max-w-[200px]">
                  <span className="font-card-title text-xs sm:text-sm font-bold text-text-primary dark:text-white leading-tight truncate">
                    {scenario.companyName}
                  </span>
                  <div className="flex items-center gap-1.5 font-ledger-readout text-[10px] sm:text-[11px] tabular-nums whitespace-nowrap">
                    <span className="text-secondary dark:text-secondary-fixed font-semibold">
                      {recordedCount}/{totalTx} İşlem Kayıtlı
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Orta (Masaüstü >= 1280px): 4'lü Muhasebe Defter Aşamaları */}
            <nav
              aria-label="Muhasebe Defter Aşamaları"
              className="hidden xl:flex items-center gap-1 bg-surface-muted/70 dark:bg-zinc-900 p-1 rounded-full border border-border-subtle dark:border-zinc-800 shrink-0"
            >
              {stages.map((st) => {
                const isActive = activeTab === st.id;
                return (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => setActiveTab(st.id)}
                    className={`px-3 py-1.5 rounded-full font-ledger-readout text-xs transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                      isActive
                        ? 'bg-primary-container text-on-primary-container font-semibold shadow-xs'
                        : 'text-text-secondary dark:text-zinc-400 hover:text-text-primary dark:hover:text-white hover:bg-surface/60 dark:hover:bg-zinc-800'
                    }`}
                  >
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-surface animate-pulse" />
                    )}
                    <span>
                      {st.code} • {st.shortLabel}
                    </span>
                    {st.suffix && (
                      <span
                        className={`hidden 2xl:inline text-[10px] ${
                          isActive
                            ? 'opacity-95'
                            : 'text-text-muted dark:text-zinc-500'
                        }`}
                      >
                        {st.suffix}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Sağ: Hesap Kodları, Görevi Sıfırla, İpucu, Tema ve Görevi Bitir */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <button
                type="button"
                onClick={onOpenAccountsGuide}
                className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-text-secondary dark:text-zinc-200 hover:text-text-primary hover:bg-surface-muted dark:hover:bg-zinc-800 font-ledger-readout text-xs border border-border-subtle dark:border-zinc-700 transition-colors cursor-pointer"
                title="Hesap Kodları Sözlüğü"
              >
                <BookOpen className="w-3.5 h-3.5 text-primary dark:text-[#FFB4A4]" />
                <span className="hidden lg:inline">Hesap Kodları</span>
              </button>

              <button
                type="button"
                onClick={resetCurrentScenario}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full text-text-secondary dark:text-zinc-300 hover:text-primary hover:bg-accent-surface dark:hover:bg-zinc-800 font-ledger-readout text-xs border border-border-subtle dark:border-zinc-700 transition-colors cursor-pointer"
                title="Bu görevin tüm kayıtlarını sıfırla ve baştan çöz"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Sıfırla</span>
              </button>

              {mode === 'ogrenme' && (
                <button
                  type="button"
                  onClick={() => requestNextHint(activeTx.id)}
                  className="p-2 rounded-full text-text-secondary dark:text-zinc-300 hover:bg-accent-surface dark:hover:bg-zinc-800 hover:text-primary transition-colors relative cursor-pointer"
                  title="Adım Adım Çözüm İpucu"
                >
                  <Lightbulb className="w-4 h-4" />
                  <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-primary" />
                </button>
              )}

              <button
                type="button"
                onClick={toggleTheme}
                aria-label="Temayı Değiştir"
                className="p-2 rounded-full text-text-secondary dark:text-zinc-300 hover:bg-surface-muted dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-amber-400" />
                ) : (
                  <Moon className="w-4 h-4 text-text-primary" />
                )}
              </button>

              <button
                type="button"
                onClick={finishScenarioAndShowSummary}
                className="px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-full bg-surface-contrast dark:bg-[#F5F3EE] hover:bg-text-secondary text-surface dark:text-[#18181B] font-ledger-readout text-[11px] sm:text-xs font-semibold shadow-xs transition-transform active:scale-[0.98] cursor-pointer whitespace-nowrap"
              >
                <span className="hidden sm:inline">Görevi Bitir &amp; Karne Al</span>
                <span className="sm:hidden">Bitir</span>
              </button>
            </div>
          </div>

          {/* Mobil / Tablet Defter Aşamaları (< 1280px) */}
          <div className="flex xl:hidden items-center gap-1.5 mt-2.5 pt-2.5 border-t border-border-subtle dark:border-zinc-800 overflow-x-auto">
            {stages.map((st) => {
              const isActive = activeTab === st.id;
              return (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => setActiveTab(st.id)}
                  className={`px-3 py-1.5 rounded-full font-ledger-readout text-xs transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bg-primary-container text-on-primary-container font-semibold shadow-xs'
                      : 'bg-surface-muted/70 dark:bg-zinc-900 text-text-secondary dark:text-zinc-400'
                  }`}
                >
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-surface" />
                  )}
                  <span>
                    {st.code} • {st.shortLabel}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* 2. ANA SİMÜLASYON ÇALIŞMA TEZGAHI */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 space-y-6">
        {/* İŞLEM ZİNCİRİ (TRANSACTION STEPPER RIBBON) */}
        <section className="bg-surface dark:bg-[#1C1B19] rounded-2xl p-3 border border-border-subtle dark:border-zinc-800 shadow-[0_4px_16px_-4px_rgba(24,24,27,0.04)]">
          <div className="flex items-center gap-2 overflow-x-auto pb-0.5 tabular-nums">
            <span className="font-ledger-readout text-[11px] uppercase tracking-wider text-text-muted dark:text-zinc-400 px-2 font-bold shrink-0">
              İŞLEM ZİNCİRİ:
            </span>

            {scenario.transactions.map((tx, idx) => {
              const isActive = idx === activeTransactionIndex;
              const lines = userEntries[tx.id] || [];
              const isRecorded = lines.some(
                (l) => l.accountCode && (l.debit > 0 || l.credit > 0)
              );

              return (
                <button
                  key={tx.id}
                  type="button"
                  onClick={() => {
                    setActiveTransactionIndex(idx);
                    if (activeTab !== 'yevmiye') {
                      setActiveTab('yevmiye');
                    }
                  }}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-ledger-readout text-xs transition-all shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-accent-surface dark:bg-[#3A1D16] border border-primary/40 text-primary dark:text-[#FFB4A4] font-semibold shadow-xs'
                      : isRecorded
                      ? 'bg-secondary-container/30 dark:bg-emerald-950/60 border border-secondary/25 text-on-secondary-container dark:text-emerald-300'
                      : 'bg-surface-muted dark:bg-zinc-900 text-text-muted dark:text-zinc-400 hover:text-text-primary dark:hover:text-zinc-200'
                  }`}
                  title={tx.description}
                >
                  {isActive ? (
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                    </span>
                  ) : isRecorded ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-secondary dark:text-emerald-400" />
                  ) : null}

                  <span>
                    #{tx.order} {tx.title}
                    {isActive ? ' [Aktif]' : ''}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* AKTİF SEKME İÇERİĞİ */}
        {activeTab === 'yevmiye' && <JournalEntryForm />}
        {activeTab === 'defterikebir' && <LedgerView />}
        {activeTab === 'mizan' && <TrialBalanceView />}
        {activeTab === 'bilanco' && <BalanceSheetView />}
      </main>

      {/* 3. EDİTÖRYAL ATÖLYE ALT BİLGİ ÇUBUĞU (Stitch Editorial Footer) */}
      <footer className="w-full bg-background dark:bg-[#121211] border-t border-border-subtle dark:border-zinc-800 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col items-center md:items-start gap-1">
            <span className="text-lg font-hero-display font-bold tracking-tight text-text-primary dark:text-white">
              Genel Muhasebe Stüdyosu
            </span>
            <p className="text-text-secondary dark:text-zinc-400 font-ledger-readout text-xs text-center md:text-left">
              © 2026 Genel Muhasebe Stüdyosu — Tekdüzen Hesap Planı (TDHP) &amp;
              Çift Taraflı Kayıt Sistemi
            </p>
          </div>

          <nav className="flex flex-wrap items-center justify-center gap-5 font-ledger-readout text-xs">
            <button
              type="button"
              onClick={onOpenAccountsGuide}
              className="text-text-secondary dark:text-zinc-400 hover:text-primary dark:hover:text-white transition-colors cursor-pointer"
            >
              TDHP Dizini
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('yevmiye')}
              className="text-text-secondary dark:text-zinc-400 hover:text-primary dark:hover:text-white transition-colors cursor-pointer"
            >
              Muhasebe İlkeleri
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('mizan')}
              className="text-text-secondary dark:text-zinc-400 hover:text-primary dark:hover:text-white transition-colors cursor-pointer"
            >
              Mizan Kuralları
            </button>
            <button
              type="button"
              onClick={finishScenarioAndShowSummary}
              className="text-text-secondary dark:text-zinc-400 hover:text-primary dark:hover:text-white transition-colors cursor-pointer"
            >
              Denetim Karnesi
            </button>
          </nav>
        </div>
      </footer>
    </div>
  );
};
