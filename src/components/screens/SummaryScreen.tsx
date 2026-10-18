import React, { useEffect, useState } from 'react';
import { useAccountingStore } from '../../store/useAccountingStore';
import { getAccountByCode } from '../../core/accounts';
import {
  formatCurrency,
  deriveLedger,
  deriveBalanceSheet,
} from '../../core/accountingEngine';
import type { JournalEntry } from '../../types/accounting';
import {
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  ArrowLeft,
  ArrowRight,
  Sun,
  Moon,
  Scale,
  BookOpen,
  FolderOpen,
  FileEdit,
  Lightbulb,
  Wrench,
  Check,
  X,
  GitBranch,
  BarChart3,
} from 'lucide-react';

interface SummaryScreenProps {
  onOpenAccountsGuide: () => void;
}

export const SummaryScreen: React.FC<SummaryScreenProps> = ({
  onOpenAccountsGuide,
}) => {
  const {
    auditResult,
    runScenarioAudit,
    getCurrentScenario,
    userEntries,
    restoreSubmittedEntriesAndReturn,
    returnToWorkspace,
    returnToWelcome,
    setActiveTransactionIndex,
    setActiveTab,
    theme,
    toggleTheme,
  } = useAccountingStore();

  const [filterMode, setFilterMode] = useState<'all' | 'errors' | 'correct'>(
    'all'
  );
  const [expandedCorrectIds, setExpandedCorrectIds] = useState<
    Record<string, boolean>
  >({});

  const scenario = getCurrentScenario();

  useEffect(() => {
    if (!auditResult) {
      runScenarioAudit();
    }
  }, [auditResult, runScenarioAudit]);

  if (!auditResult) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background dark:bg-[#121211] text-text-primary dark:text-[#F5F3EE]">
        <div className="text-center space-y-4">
          <p className="text-sm font-ledger-readout">
            Denetim raporu hazırlanıyor...
          </p>
          <button
            type="button"
            onClick={returnToWelcome}
            className="px-5 py-2.5 bg-surface-contrast text-surface rounded-full text-xs font-ledger-readout font-semibold cursor-pointer"
          >
            Ana Sayfaya Dön
          </button>
        </div>
      </div>
    );
  }

  // Görev tamamlandığında userEntries sıfırlandığı için, karnede tamamlanan turun kayıtlarını (submittedEntries) kullanıyoruz
  const effectiveEntries =
    auditResult.submittedEntries &&
    Object.keys(auditResult.submittedEntries).length > 0
      ? auditResult.submittedEntries
      : userEntries;

  const submittedJournalEntries: JournalEntry[] = [];
  scenario.transactions.forEach((tx, idx) => {
    const lines = effectiveEntries[tx.id] || [];
    const validLines = lines.filter(
      (l) => l.accountCode && (l.debit > 0 || l.credit > 0)
    );
    if (validLines.length > 0) {
      submittedJournalEntries.push({
        id: 'entry_' + tx.id,
        transactionId: tx.id,
        entryNo: idx + 1,
        date: tx.date,
        description: tx.description,
        lines: validLines,
      });
    }
  });

  const balanceSheet = deriveBalanceSheet(
    deriveLedger(submittedJournalEntries),
    scenario.establishedDate
  );

  const {
    totalTransactions,
    correctCount,
    incorrectCount,
    scorePercentage,
    balanceErrorsCount,
    accountSelectionErrorsCount,
    directionErrorsCount,
    transactionResults,
  } = auditResult;

  const totalScenarioVolume = scenario.transactions.reduce((sum, tx) => {
    const txTotal = tx.expectedEntry.lines.reduce(
      (s, l) => s + (l.debit || 0),
      0
    );
    return sum + txTotal;
  }, 0);

  const firstErrorIndex = transactionResults.findIndex((r) => !r.isValid);
  const firstErrorItem =
    firstErrorIndex !== -1 ? transactionResults[firstErrorIndex] : undefined;

  const handleEditTransaction = (txIndex: number) => {
    restoreSubmittedEntriesAndReturn();
    setActiveTransactionIndex(txIndex);
    setActiveTab('yevmiye');
  };

  const handleFixFirstError = () => {
    if (firstErrorIndex !== -1) {
      handleEditTransaction(firstErrorIndex);
    } else {
      restoreSubmittedEntriesAndReturn();
    }
  };

  const handleRestartFresh = () => {
    setActiveTransactionIndex(0);
    setActiveTab('yevmiye');
    returnToWorkspace();
  };

  const filteredResults = transactionResults
    .map((item, idx) => ({ item, idx, tx: scenario.transactions[idx] }))
    .filter(({ item }) => {
      if (filterMode === 'errors') return !item.isValid;
      if (filterMode === 'correct') return item.isValid;
      return true;
    });

  // İlk doğru kaydı varsayılan olarak açık kart gösterelim (Stitch tasarımındaki gibi)
  const firstCorrectTxId = transactionResults.find(
    (r) => r.isValid
  )?.transactionId;

  return (
    <div className="min-h-screen bg-background dark:bg-[#121211] text-text-primary dark:text-[#F5F3EE] font-body-editorial paper-texture flex flex-col justify-between transition-colors">
      {/* 1. YÜZEN KAPSÜL ÜST DENETİM BARI (Stitch Capsule Nav) */}
      <header className="sticky top-4 z-40 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto rounded-3xl lg:rounded-full bg-surface/92 dark:bg-[#1C1B19]/92 backdrop-blur-md border border-border-subtle dark:border-zinc-800 shadow-[0_12px_32px_-8px_rgba(24,24,27,0.06),0_2px_6px_-1px_rgba(24,24,27,0.04)] px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
          {/* Sol: Atölye Vitrini & Denetim Raporu Başlığı */}
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            <button
              type="button"
              onClick={returnToWelcome}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-surface-muted dark:bg-zinc-800 text-text-secondary dark:text-zinc-300 hover:text-text-primary dark:hover:text-white text-xs font-ledger-readout transition-colors cursor-pointer shrink-0"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Atölye Vitrini</span>
            </button>

            <div className="h-5 w-px bg-border-subtle dark:bg-zinc-800 hidden sm:block shrink-0" />

            <div className="flex items-center gap-2.5 min-w-0">
              <span className="hidden md:inline-flex px-2 py-1 rounded text-[10px] font-ledger-readout font-bold tracking-wider bg-surface-contrast dark:bg-[#F5F3EE] text-surface dark:text-[#18181B] uppercase leading-tight shrink-0">
                GM / DENETİM
              </span>
              <div className="min-w-0">
                <h1 className="text-sm sm:text-base font-card-title font-bold text-text-primary dark:text-white leading-tight truncate">
                  Çalışma Sonu Değerlendirme &amp; Denetim Raporu
                </h1>
                <p className="text-[11px] font-ledger-readout text-text-muted dark:text-zinc-400 leading-none mt-0.5 truncate">
                  {scenario.companyName} • {scenario.title}
                </p>
              </div>
            </div>
          </div>

          {/* Sağ: Aksiyon Butonları */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            <button
              type="button"
              onClick={onOpenAccountsGuide}
              className="hidden lg:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-surface dark:bg-zinc-900 border border-border-subtle dark:border-zinc-700 text-text-secondary dark:text-zinc-300 hover:text-text-primary text-xs font-ledger-readout hover:bg-accent-surface transition-colors active:scale-[0.98] cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-primary" />
              <span>TDHP Hesap Planı Rehberi</span>
            </button>

            <button
              type="button"
              onClick={returnToWelcome}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-surface-muted dark:bg-zinc-800 text-text-secondary dark:text-zinc-300 hover:text-text-primary text-xs font-ledger-readout transition-colors active:scale-[0.98] cursor-pointer"
            >
              <FolderOpen className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Başka Vaka Dosyası Seç</span>
            </button>

            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Temayı Değiştir"
              className="p-2 rounded-full bg-surface-muted dark:bg-zinc-800 text-text-secondary dark:text-zinc-300 hover:text-text-primary transition-colors cursor-pointer"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-text-primary" />
              )}
            </button>

            <button
              type="button"
              onClick={handleRestartFresh}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-surface-muted dark:bg-zinc-800 text-text-secondary dark:text-zinc-300 hover:text-text-primary text-xs font-ledger-readout font-semibold transition-colors active:scale-[0.98] cursor-pointer"
              title="Bu görevi sıfırlanmış haliyle baştan tekrar çöz"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Görevi Baştan Çöz</span>
            </button>

            <button
              type="button"
              onClick={restoreSubmittedEntriesAndReturn}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-primary-container text-on-primary-container hover:bg-primary font-ledger-readout text-xs font-semibold transition-all active:scale-[0.98] shadow-xs cursor-pointer"
            >
              <FileEdit className="w-3.5 h-3.5" />
              <span>Kayıtlara Dön &amp; Düzelt</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. ANA DENETİM KANVASI */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 space-y-10">
        {/* ASİMETRİK 7:5 DENETİM KARNESİ HERO BLOĞU */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Sol Kart (7 Sütun): Resmi Genel Muhasebe Denetim Karnesi */}
          <div className="lg:col-span-7 bg-surface dark:bg-[#1C1B19] rounded-[2rem] p-6 sm:p-8 border border-border-subtle dark:border-zinc-800 shadow-[0_12px_32px_-8px_rgba(24,24,27,0.06),0_2px_6px_-1px_rgba(24,24,27,0.04)] relative overflow-hidden flex flex-col justify-between">
            <div>
              {/* Üst Satır & SMMM Mühür Motifi */}
              <div className="flex justify-between items-start gap-4 mb-6">
                <div className="space-y-1.5">
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-surface-muted dark:bg-zinc-800 text-text-secondary dark:text-zinc-300 font-ledger-readout text-xs tabular-nums">
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        scorePercentage >= 50
                          ? 'bg-semantic-balance'
                          : 'bg-primary'
                      }`}
                    />
                    <span>
                      DOSYA REFERANSI: 2026/VUK-084-
                      {scenario.id.slice(0, 2).toUpperCase()}
                    </span>
                  </div>
                  <h2 className="font-hero-display font-bold tracking-tight text-text-primary dark:text-white text-xl sm:text-2xl pt-1">
                    Resmi Genel Muhasebe Denetim Karnesi
                  </h2>
                </div>

                {/* Tactile SMMM Rubber Stamp */}
                <div
                  className={`relative shrink-0 w-24 h-24 rounded-full border-2 border-dashed p-1 flex flex-col items-center justify-center text-center rotate-[-6deg] select-none pointer-events-none ${
                    scorePercentage >= 50
                      ? 'border-semantic-balance/80 bg-secondary-fixed/20 text-semantic-balance dark:text-secondary-fixed'
                      : 'border-primary/80 bg-accent-surface/50 text-primary dark:text-[#FFB4A4]'
                  }`}
                >
                  <span className="text-[7px] font-ledger-readout font-bold tracking-widest uppercase">
                    T.C. MALİ MÜŞAVİR
                  </span>
                  <CheckCircle2 className="w-5 h-5 my-0.5" />
                  <span className="text-[8px] font-ledger-readout font-extrabold tracking-tight leading-tight">
                    SMMM ONAYLI
                  </span>
                  <span className="text-[7px] font-ledger-readout opacity-80 tabular-nums">
                    {scenario.establishedDate}
                  </span>
                </div>
              </div>

              {/* Karne Başlığı ve Değerlendirme Özeti */}
              <div className="space-y-3 pr-2">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="text-xl sm:text-2xl font-section-header font-bold text-text-primary dark:text-white tracking-tight">
                    {scorePercentage >= 80
                      ? 'Kusursuz Defter Tutma ve Bilanço Denkliği'
                      : scorePercentage >= 50
                      ? 'Gelişime Açık Defter Tutma ve Mizan Uyumluluğu'
                      : 'Yevmiye Revizyonu Gerektiren Defter Kayıtları'}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full font-ledger-readout text-xs font-semibold ${
                      balanceErrorsCount === 0
                        ? 'bg-secondary-fixed text-on-secondary-fixed'
                        : 'bg-accent-surface text-primary'
                    }`}
                  >
                    {balanceErrorsCount === 0
                      ? 'Çift Taraflı Kayıt Tam'
                      : `${balanceErrorsCount} Dengesiz Madde`}
                  </span>
                </div>

                <p className="text-text-secondary dark:text-zinc-300 font-body-editorial text-sm sm:text-base leading-relaxed">
                  Toplam {totalTransactions} ticari işlemden {correctCount}{' '}
                  tanesi Tekdüzen Hesap Planı ve çift taraflı kayıt ilkelerine
                  tam uyumlu olarak kaydedilmiştir.{' '}
                  {incorrectCount === 0
                    ? 'Yevmiye defterinde genel matematiksel denklik ve hesap karakterleri kusursuz sağlanmıştır.'
                    : `Yevmiye defterinde ${incorrectCount} maddede hesap kodu, yön veya tutar uyuşmazlığı tespit edilmiştir.`}
                </p>
              </div>
            </div>

            {/* Alt Sandstone Skor ve Metrik Kutusu */}
            <div className="pt-6 mt-6 border-t border-border-subtle dark:border-zinc-800">
              <div className="bg-surface-muted dark:bg-zinc-900 rounded-2xl p-5 mb-5 flex flex-wrap items-center justify-between gap-4 tabular-nums">
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl sm:text-5xl font-hero-display text-text-primary dark:text-white font-extrabold tracking-tight">
                    %{scorePercentage}
                  </span>
                  <div className="flex flex-col">
                    <span className="text-xs font-ledger-readout text-text-muted dark:text-zinc-400 uppercase tracking-wider font-semibold">
                      BAŞARI ORANI
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-ledger-readout font-bold ${
                        scorePercentage >= 50
                          ? 'text-semantic-balance dark:text-secondary-fixed'
                          : 'text-primary dark:text-[#FFB4A4]'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>
                        {scorePercentage >= 50
                          ? 'Yeterli / SMMM Denetiminden Geçti'
                          : 'Yevmiye Fişlerini Gözden Geçiriniz'}
                      </span>
                    </span>
                  </div>
                </div>

                {/* 3'lü Hızlı Metrik Çipleri */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-left font-ledger-readout text-xs w-full xl:w-auto">
                  <div className="bg-surface dark:bg-zinc-950 px-3 py-2 rounded-xl border border-border-subtle dark:border-zinc-800">
                    <span className="text-text-muted block text-[10px]">
                      İşlem Hacmi
                    </span>
                    <span className="font-bold text-text-primary dark:text-white">
                      {formatCurrency(totalScenarioVolume)}
                    </span>
                  </div>
                  <div className="bg-surface dark:bg-zinc-950 px-3 py-2 rounded-xl border border-border-subtle dark:border-zinc-800">
                    <span className="text-text-muted block text-[10px]">
                      Doğrulanan Fiş
                    </span>
                    <span className="font-bold text-text-primary dark:text-white">
                      {correctCount} / {totalTransactions} Madde
                    </span>
                  </div>
                  <div className="bg-surface dark:bg-zinc-950 px-3 py-2 rounded-xl border border-border-subtle dark:border-zinc-800 col-span-2 sm:col-span-1">
                    <span className="text-text-muted block text-[10px]">
                      Bilanço Farkı
                    </span>
                    <span
                      className={`font-bold ${
                        balanceSheet.isBalanced
                          ? 'text-semantic-balance dark:text-secondary-fixed'
                          : 'text-primary'
                      }`}
                    >
                      {formatCurrency(Math.abs(balanceSheet.difference))}
                    </span>
                  </div>
                </div>
              </div>

              {/* Alt Butonlar */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleRestartFresh}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-secondary text-white hover:bg-semantic-balance font-ledger-readout text-xs font-bold transition-all active:scale-[0.98] shadow-xs cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Görevi Baştan Tekrar Çöz (Sıfırlandı)</span>
                </button>

                <button
                  type="button"
                  onClick={handleFixFirstError}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary-container text-on-primary-container hover:bg-primary font-ledger-readout text-xs font-bold transition-all active:scale-[0.98] shadow-xs cursor-pointer"
                >
                  <span>
                    {incorrectCount > 0
                      ? 'Hatalı Maddeleri Yevmiyede Düzelt'
                      : 'Kayıtlarımı Yevmiyede İncele'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={returnToWelcome}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-surface dark:bg-zinc-900 border border-border-subtle dark:border-zinc-700 text-text-secondary dark:text-zinc-300 hover:text-text-primary hover:bg-surface-muted font-ledger-readout text-xs font-medium transition-colors active:scale-[0.98] cursor-pointer"
                >
                  <FolderOpen className="w-3.5 h-3.5" />
                  <span>Başka Soru Seç</span>
                </button>
              </div>
            </div>
          </div>

          {/* Sağ Izgara (5 Sütun): 2x2 Mimari Denetim Bento Karoları */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4 tabular-nums">
            {/* Karo 1: Tam Doğru Kayıt (Jade Equilibrium) */}
            <div className="bg-surface dark:bg-[#1C1B19] rounded-[1.5rem] p-5 border border-secondary-container dark:border-emerald-800/60 bg-gradient-to-br from-surface to-secondary-container/20 dark:from-[#1C1B19] dark:to-emerald-950/20 shadow-[0_12px_32px_-8px_rgba(24,24,27,0.04)] flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="w-8 h-8 rounded-full bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed">
                  <CheckCircle2 className="w-4 h-4" />
                </span>
                <span className="px-2.5 py-0.5 rounded text-[11px] font-ledger-readout font-bold bg-secondary-fixed text-on-secondary-fixed">
                  {correctCount} / {totalTransactions} MADDE
                </span>
              </div>
              <div className="mt-4">
                <span className="text-xs font-ledger-readout text-text-muted block">
                  Kayıt Doğruluğu
                </span>
                <h3 className="text-lg font-card-title text-text-primary dark:text-white font-bold mt-0.5">
                  Tam Doğru Kayıt
                </h3>
                <p className="text-xs text-text-secondary dark:text-zinc-300 mt-1 font-body-editorial leading-normal">
                  Hesap kodları, Borç (Sol) / Alacak (Sağ) yönleri ve tutar
                  hesaplamaları doğru.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-border-subtle/60 dark:border-zinc-800 flex items-center justify-between text-[11px] font-ledger-readout text-semantic-balance dark:text-secondary-fixed font-semibold">
                <span>Başarı Oranı</span>
                <span>%{scorePercentage}</span>
              </div>
            </div>

            {/* Karo 2: Hatalı / Eksik Kayıt (Warm Oxide Warning) */}
            <div className="bg-surface dark:bg-[#1C1B19] rounded-[1.5rem] p-5 border border-outline-variant dark:border-primary/40 bg-gradient-to-br from-surface to-accent-surface dark:from-[#1C1B19] dark:to-[#2A1813]/40 shadow-[0_12px_32px_-8px_rgba(24,24,27,0.04)] flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="w-8 h-8 rounded-full bg-accent-surface dark:bg-[#3A1D16] flex items-center justify-center text-primary dark:text-[#FFB4A4]">
                  <AlertTriangle className="w-4 h-4" />
                </span>
                <span className="px-2.5 py-0.5 rounded text-[11px] font-ledger-readout font-bold bg-primary text-on-primary">
                  {incorrectCount} MADDE
                </span>
              </div>
              <div className="mt-4">
                <span className="text-xs font-ledger-readout text-primary dark:text-[#FFB4A4] font-medium block">
                  Düzeltme İhtiyacı
                </span>
                <h3 className="text-lg font-card-title text-text-primary dark:text-white font-bold mt-0.5">
                  Hatalı / Eksik Kayıt
                </h3>
                <p className="text-xs text-text-secondary dark:text-zinc-300 mt-1 font-body-editorial leading-normal">
                  {firstErrorItem
                    ? `Madde #0${firstErrorItem.order}: İnceleme ve yevmiye düzeltmesi gerektiren fiş mevcuttur.`
                    : 'Düzeltme gerektiren hatalı yevmiye maddesi bulunmamaktadır.'}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-border-subtle/60 dark:border-zinc-800 flex items-center justify-between text-[11px] font-ledger-readout text-primary dark:text-[#FFB4A4] font-semibold">
                <span>Görev Durumu</span>
                <span className="uppercase">Tekrar Çözüme Hazır</span>
              </div>
            </div>

            {/* Karo 3: Çift Taraflı Denge (Ivory Card) */}
            <div className="bg-surface dark:bg-[#1C1B19] rounded-[1.5rem] p-5 border border-border-subtle dark:border-zinc-800 shadow-[0_12px_32px_-8px_rgba(24,24,27,0.04)] flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="w-8 h-8 rounded-full bg-surface-muted dark:bg-zinc-800 flex items-center justify-center text-text-secondary dark:text-zinc-300">
                  <Scale className="w-4 h-4" />
                </span>
                <span
                  className={`text-xs font-ledger-readout font-bold ${
                    balanceErrorsCount === 0
                      ? 'text-semantic-balance dark:text-secondary-fixed'
                      : 'text-primary'
                  }`}
                >
                  {balanceErrorsCount === 0 ? 'DENK' : 'SAPMA VAR'}
                </span>
              </div>
              <div className="mt-4">
                <span className="text-xs font-ledger-readout text-text-muted block">
                  Borç = Alacak Dengesi
                </span>
                <h3 className="text-lg font-card-title text-text-primary dark:text-white font-bold mt-0.5">
                  {balanceErrorsCount === 0
                    ? '0,00 ₺ Sapma'
                    : `${balanceErrorsCount} Dengesiz Fiş`}
                </h3>
                <p className="text-xs text-text-secondary dark:text-zinc-300 mt-1 font-body-editorial leading-normal">
                  {balanceErrorsCount === 0
                    ? `Tüm ${totalTransactions} maddede Borç = Alacak çift taraflı eşitliği matematiksel olarak sağlandı.`
                    : 'Bazı maddelerde Borç ve Alacak toplamları birbirine eşit değil.'}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-border-subtle/60 dark:border-zinc-800 flex items-center justify-between text-[11px] font-ledger-readout text-text-muted">
                <span>Toplam İşlem Hacmi</span>
                <span className="font-semibold text-text-primary dark:text-white">
                  {formatCurrency(totalScenarioVolume)}
                </span>
              </div>
            </div>

            {/* Karo 4: Analiz Teşhisi (Ivory Card) */}
            <div className="bg-surface dark:bg-[#1C1B19] rounded-[1.5rem] p-5 border border-border-subtle dark:border-zinc-800 shadow-[0_12px_32px_-8px_rgba(24,24,27,0.04)] flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="w-8 h-8 rounded-full bg-surface-muted dark:bg-zinc-800 flex items-center justify-center text-text-secondary dark:text-zinc-300">
                  <GitBranch className="w-4 h-4" />
                </span>
                <span className="px-2 py-0.5 rounded text-[11px] font-ledger-readout font-semibold bg-surface-muted dark:bg-zinc-800 text-text-secondary dark:text-zinc-300">
                  HESAP KONTROLÜ
                </span>
              </div>
              <div className="mt-4">
                <span className="text-xs font-ledger-readout text-text-muted block">
                  Yön &amp; Kod Analizi
                </span>
                <h3 className="text-lg font-card-title text-text-primary dark:text-white font-bold mt-0.5">
                  {directionErrorsCount + accountSelectionErrorsCount} Nitelik
                  Uyarısı
                </h3>
                <p className="text-xs text-text-secondary dark:text-zinc-300 mt-1 font-body-editorial leading-normal">
                  {directionErrorsCount + accountSelectionErrorsCount > 0
                    ? `${directionErrorsCount} ters kayıt yönü ve ${accountSelectionErrorsCount} yanlış hesap kodu seçimi tespit edildi.`
                    : 'Hesap niteliklerinde ve borç/alacak yönlerinde hiçbir uyarı tespit edilmedi.'}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-border-subtle/60 dark:border-zinc-800 flex items-center justify-between text-[11px] font-ledger-readout text-text-muted">
                <span>İlgili Madde</span>
                <span className="font-bold text-text-primary dark:text-white">
                  {firstErrorItem
                    ? `#0${firstErrorItem.order} Nolu Fiş`
                    : 'Tamamı Uygun'}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* İŞLEM BAZINDA DENETİM VE PEDAGOJİK KARŞILAŞTIRMA CETVELİ */}
        <section className="space-y-6">
          {/* Bölüm Başlığı ve Filtre Hapları */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-3 border-b border-border-subtle dark:border-zinc-800">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-ledger-readout font-semibold text-primary uppercase tracking-wider mb-1">
                <BarChart3 className="w-3.5 h-3.5" />
                <span>DETAYLI ÇÖZÜM VE KARŞILAŞTIRMA</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-section-header font-bold text-text-primary dark:text-white tracking-tight">
                Soru Bazında Çözüm ve Karşılaştırma Cetveli
              </h2>
              <p className="text-text-secondary dark:text-zinc-400 text-sm font-body-editorial mt-1">
                Yaptığın kayıtların doğru çözümlerle karşılaştırması ve her
                sorunun adım adım muhasebe mantığı.
              </p>
            </div>

            {/* Filtre Hapları */}
            <div className="inline-flex p-1 rounded-full bg-surface-muted dark:bg-zinc-900 border border-border-subtle dark:border-zinc-800 self-start md:self-auto font-ledger-readout text-xs tabular-nums">
              <button
                type="button"
                onClick={() => setFilterMode('all')}
                className={`px-4 py-1.5 rounded-full transition-all cursor-pointer ${
                  filterMode === 'all'
                    ? 'bg-surface dark:bg-zinc-800 text-text-primary dark:text-white font-semibold shadow-xs'
                    : 'text-text-secondary dark:text-zinc-400 hover:text-text-primary'
                }`}
              >
                Tüm Maddeler ({totalTransactions})
              </button>
              <button
                type="button"
                onClick={() => setFilterMode('errors')}
                className={`px-4 py-1.5 rounded-full transition-all flex items-center gap-1.5 cursor-pointer ${
                  filterMode === 'errors'
                    ? 'bg-surface dark:bg-zinc-800 text-text-primary dark:text-white font-semibold shadow-xs'
                    : 'text-text-secondary dark:text-zinc-400 hover:text-text-primary'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                <span>Hatalı Kayıtlar ({incorrectCount})</span>
              </button>
              <button
                type="button"
                onClick={() => setFilterMode('correct')}
                className={`px-4 py-1.5 rounded-full transition-all flex items-center gap-1.5 cursor-pointer ${
                  filterMode === 'correct'
                    ? 'bg-surface dark:bg-zinc-800 text-text-primary dark:text-white font-semibold shadow-xs'
                    : 'text-text-secondary dark:text-zinc-400 hover:text-text-primary'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-semantic-balance" />
                <span>Tam Doğrular ({correctCount})</span>
              </button>
            </div>
          </div>

          {/* Denetim Dosyaları Listesi */}
          <div className="space-y-5">
            {filteredResults.map(({ item, idx, tx }) => {
              const userLines = (effectiveEntries[tx.id] || []).filter(
                (l) => l.accountCode || l.debit > 0 || l.credit > 0
              );
              const userDebitTotal = userLines.reduce(
                (s, l) => s + (l.debit || 0),
                0
              );
              const userCreditTotal = userLines.reduce(
                (s, l) => s + (l.credit || 0),
                0
              );
              const expectedTotal = tx.expectedEntry.lines.reduce(
                (s, l) => s + (l.debit || 0),
                0
              );

              // 1. HATALI VEYA EKSİK KAYIT KARTI (6:6 Yan Yana Karşılaştırma)
              if (!item.isValid) {
                const expectedCodes = new Set(
                  tx.expectedEntry.lines.map((l) => l.accountCode)
                );

                return (
                  <article
                    key={item.transactionId}
                    className="bg-surface dark:bg-[#1C1B19] rounded-[2rem] border-2 border-outline-variant dark:border-primary/40 p-6 lg:p-8 shadow-[0_12px_32px_-8px_rgba(24,24,27,0.06),0_2px_6px_-1px_rgba(24,24,27,0.04)] relative tabular-nums"
                  >
                    {/* Kart Üst Başlığı */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border-subtle dark:border-zinc-800">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded font-ledger-readout text-xs font-bold bg-accent-surface dark:bg-[#3A1D16] text-primary dark:text-[#FFB4A4] border border-outline-variant dark:border-primary/40">
                            {userLines.length === 0
                              ? 'KAYIT GİRİLMEDİ (EKSİK FİŞ)'
                              : 'YÖN / HESAP SEÇİMİ HATASI TESPİT EDİLDİ'}
                          </span>
                          <span className="text-xs font-ledger-readout text-text-muted">
                            Fiş Sıra: {String(tx.order).padStart(3, '0')}/2026
                          </span>
                        </div>
                        <h3 className="text-lg sm:text-xl font-card-title text-text-primary dark:text-white font-bold">
                          Madde #{String(tx.order).padStart(2, '0')} • {tx.date}{' '}
                          • {tx.title}
                        </h3>
                        <p className="text-xs font-ledger-readout text-text-secondary dark:text-zinc-400">
                          İşlem Özeti: {tx.description}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleEditTransaction(idx)}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-primary-container text-on-primary-container hover:bg-primary font-ledger-readout text-xs font-bold transition-all active:scale-[0.98] self-start sm:self-center shrink-0 shadow-xs cursor-pointer"
                      >
                        <Wrench className="w-3.5 h-3.5" />
                        <span>Bu Maddeyi Yevmiyede Düzelt</span>
                      </button>
                    </div>

                    {/* Pedagojik Çözüm Notu & TDHP Mantığı Kutusu */}
                    <div className="my-6 rounded-2xl bg-surface-muted dark:bg-zinc-900 border border-border-subtle dark:border-zinc-800 p-5">
                      <div className="flex items-start gap-3.5">
                        <span className="w-8 h-8 rounded-full bg-accent-surface dark:bg-[#3A1D16] text-primary dark:text-[#FFB4A4] flex items-center justify-center shrink-0 mt-0.5">
                          <Lightbulb className="w-4 h-4" />
                        </span>
                        <div className="space-y-1">
                          <h4 className="text-sm font-card-title font-bold text-text-primary dark:text-white">
                            Pedagojik Çözüm Notu &amp; TDHP Mantığı:
                          </h4>
                          <p className="text-xs sm:text-sm font-body-editorial text-text-secondary dark:text-zinc-300 leading-relaxed">
                            {tx.expectedEntry.educationalNotes}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Yan Yana 6:6 Yevmiye Karşılaştırma Tabloları */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* SOL: Öğrencinin Kaydı */}
                      <div className="rounded-2xl border border-outline-variant dark:border-primary/40 bg-surface dark:bg-zinc-950 p-5 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between pb-3 border-b border-border-subtle dark:border-zinc-800 mb-4">
                            <div className="flex items-center gap-2">
                              <span className="w-2.5 h-2.5 rounded-full bg-primary" />
                              <span className="text-xs font-ledger-readout font-bold text-text-primary dark:text-white uppercase tracking-wider">
                                SİZİN KAYDINIZ (ÖĞRENCİ ÇALIŞMASI)
                              </span>
                            </div>
                            <span className="text-[11px] font-ledger-readout text-primary dark:text-[#FFB4A4] font-semibold bg-accent-surface dark:bg-[#3A1D16] px-2 py-0.5 rounded">
                              {userLines.length === 0
                                ? 'Boş Fiş'
                                : 'Hesap Uyuşmazlığı'}
                            </span>
                          </div>

                          <div className="font-ledger-readout text-xs space-y-2">
                            <div className="grid grid-cols-12 text-text-muted text-[11px] pb-1 border-b border-border-subtle/50 dark:border-zinc-800 font-semibold">
                              <span className="col-span-2">KOD</span>
                              <span className="col-span-5">HESAP ADI</span>
                              <span className="col-span-2 text-right">BORÇ</span>
                              <span className="col-span-3 text-right">
                                ALACAK
                              </span>
                            </div>

                            {userLines.length > 0 ? (
                              userLines.map((uLine) => {
                                const acc = getAccountByCode(uLine.accountCode);
                                const isCodeExpected = expectedCodes.has(
                                  uLine.accountCode
                                );
                                return (
                                  <div
                                    key={uLine.id}
                                    className={`grid grid-cols-12 py-2 items-center px-2 rounded ${
                                      isCodeExpected
                                        ? 'bg-secondary-fixed/15 text-text-primary dark:text-zinc-200'
                                        : 'bg-accent-surface dark:bg-[#3A1D16]/60 text-primary dark:text-[#FFB4A4] border border-outline-variant dark:border-primary/40'
                                    }`}
                                  >
                                    <span className="col-span-2 font-bold">
                                      {uLine.accountCode || '—'}
                                    </span>
                                    <span className="col-span-5 flex items-center gap-1 font-semibold truncate pr-1">
                                      {!isCodeExpected && (
                                        <X className="w-3 h-3 shrink-0" />
                                      )}
                                      <span className="truncate">
                                        {acc?.name || 'Seçilmedi'}
                                      </span>
                                    </span>
                                    <span className="col-span-2 text-right font-bold">
                                      {uLine.debit > 0
                                        ? formatCurrency(uLine.debit)
                                        : '—'}
                                    </span>
                                    <span className="col-span-3 text-right font-bold">
                                      {uLine.credit > 0
                                        ? formatCurrency(uLine.credit)
                                        : '—'}
                                    </span>
                                  </div>
                                );
                              })
                            ) : (
                              <div className="py-4 text-center text-text-muted italic font-body-editorial">
                                Bu işlem için henüz yevmiye satırı girilmemiş.
                              </div>
                            )}
                          </div>

                          {/* Hata Uyarısı */}
                          {item.errors.length > 0 && (
                            <div className="mt-3 p-3 rounded-xl bg-surface-muted dark:bg-zinc-900 text-primary dark:text-[#FFB4A4] text-[11px] font-ledger-readout flex items-start gap-2">
                              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                              <span>HATA: {item.errors[0]}</span>
                            </div>
                          )}
                        </div>

                        <div className="mt-4 pt-3 border-t border-border-subtle dark:border-zinc-800 flex justify-between items-center text-xs font-ledger-readout font-bold">
                          <span className="text-text-muted">
                            Yevmiye Maddesi Toplamı:
                          </span>
                          <div className="space-x-3 text-text-primary dark:text-white">
                            <span>B: {formatCurrency(userDebitTotal)}</span>
                            <span>A: {formatCurrency(userCreditTotal)}</span>
                          </div>
                        </div>
                      </div>

                      {/* SAĞ: Olması Gereken Doğru Kayıt (TDHP Çözümü) */}
                      <div className="rounded-2xl border-2 border-secondary-container dark:border-emerald-800/60 bg-surface dark:bg-zinc-950 p-5 flex flex-col justify-between shadow-xs">
                        <div>
                          <div className="flex items-center justify-between pb-3 border-b border-border-subtle dark:border-zinc-800 mb-4">
                            <div className="flex items-center gap-2">
                              <span className="w-2.5 h-2.5 rounded-full bg-semantic-balance" />
                              <span className="text-xs font-ledger-readout font-bold text-text-primary dark:text-white uppercase tracking-wider">
                                OLMASI GEREKEN DOĞRU KAYIT (TDHP ÇÖZÜMÜ)
                              </span>
                            </div>
                            <span className="text-[11px] font-ledger-readout text-semantic-balance dark:text-secondary-fixed font-semibold bg-secondary-fixed/40 dark:bg-emerald-950 px-2 py-0.5 rounded">
                              Kusursuz TDHP &amp; VUK
                            </span>
                          </div>

                          <div className="font-ledger-readout text-xs space-y-2">
                            <div className="grid grid-cols-12 text-text-muted text-[11px] pb-1 border-b border-border-subtle/50 dark:border-zinc-800 font-semibold">
                              <span className="col-span-2">KOD</span>
                              <span className="col-span-5">HESAP ADI</span>
                              <span className="col-span-2 text-right">BORÇ</span>
                              <span className="col-span-3 text-right">
                                ALACAK
                              </span>
                            </div>

                            {tx.expectedEntry.lines.map((expLine, lIdx) => {
                              const acc = getAccountByCode(expLine.accountCode);
                              const isCredit = expLine.credit > 0;
                              return (
                                <div
                                  key={lIdx}
                                  className={`grid grid-cols-12 py-2 items-center px-2 rounded ${
                                    isCredit
                                      ? 'bg-secondary-fixed/20 dark:bg-emerald-950/40 border border-secondary-fixed dark:border-emerald-800/60 text-semantic-balance dark:text-secondary-fixed'
                                      : 'text-text-primary dark:text-white'
                                  }`}
                                >
                                  <span className="col-span-2 font-bold">
                                    {expLine.accountCode}
                                  </span>
                                  <span className="col-span-5 flex items-center gap-1 font-semibold truncate pr-1">
                                    <Check className="w-3 h-3 text-semantic-balance shrink-0" />
                                    <span className="truncate">
                                      {acc?.name}
                                    </span>
                                  </span>
                                  <span className="col-span-2 text-right font-bold">
                                    {expLine.debit > 0
                                      ? formatCurrency(expLine.debit)
                                      : '—'}
                                  </span>
                                  <span className="col-span-3 text-right font-bold">
                                    {expLine.credit > 0
                                      ? formatCurrency(expLine.credit)
                                      : '—'}
                                  </span>
                                </div>
                              );
                            })}
                          </div>

                          <div className="mt-3 p-3 rounded-xl bg-secondary-fixed/30 dark:bg-emerald-950/50 text-semantic-balance dark:text-secondary-fixed text-[11px] font-ledger-readout flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                            <span>
                              ONAY: TDHP hesap planı kurallarına göre borç ve
                              alacak yönleri tam dengelidir.
                            </span>
                          </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-border-subtle dark:border-zinc-800 flex justify-between items-center text-xs font-ledger-readout font-bold">
                          <span className="text-text-muted">
                            Doğru Madde Dengesi:
                          </span>
                          <div className="space-x-2 text-semantic-balance dark:text-secondary-fixed">
                            <span>B: {formatCurrency(expectedTotal)}</span>
                            <span>=</span>
                            <span>A: {formatCurrency(expectedTotal)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              }

              // 2. TAM DOĞRU KAYITLAR (İlk doğru kayıt veya kullanıcının açtığı kayıt tam kart, diğerleri kompakt satır)
              const isExpanded =
                expandedCorrectIds[item.transactionId] ??
                item.transactionId === firstCorrectTxId;

              if (isExpanded) {
                return (
                  <article
                    key={item.transactionId}
                    className="bg-surface dark:bg-[#1C1B19] rounded-[2rem] border border-border-subtle dark:border-zinc-800 p-6 lg:p-8 shadow-[0_12px_32px_-8px_rgba(24,24,27,0.04)] tabular-nums"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border-subtle dark:border-zinc-800">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded font-ledger-readout text-xs font-bold bg-secondary-fixed text-on-secondary-fixed">
                            TAM DOĞRU KAYIT ✓
                          </span>
                          <span className="text-xs font-ledger-readout text-text-muted">
                            Fiş Sıra: {String(tx.order).padStart(3, '0')}/2026
                          </span>
                        </div>
                        <h3 className="text-lg font-card-title text-text-primary dark:text-white font-bold">
                          Madde #{String(tx.order).padStart(2, '0')} • {tx.date}{' '}
                          • {tx.title}
                        </h3>
                        <p className="text-xs font-ledger-readout text-text-secondary dark:text-zinc-400">
                          {tx.description}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <span className="text-[10px] font-ledger-readout text-text-muted block">
                            PUAN
                          </span>
                          <span className="text-sm font-ledger-readout font-bold text-semantic-balance dark:text-secondary-fixed">
                            100 / 100
                          </span>
                        </div>
                        <span className="w-10 h-10 rounded-full bg-secondary-fixed/40 flex items-center justify-center text-semantic-balance">
                          <CheckCircle2 className="w-5 h-5" />
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 bg-surface-muted dark:bg-zinc-900 rounded-2xl p-4 font-ledger-readout text-xs space-y-1.5 border border-border-subtle dark:border-zinc-800">
                      {tx.expectedEntry.lines.map((expLine, lIdx) => {
                        const acc = getAccountByCode(expLine.accountCode);
                        const isCredit = expLine.credit > 0;
                        return (
                          <div
                            key={lIdx}
                            className={`grid grid-cols-12 py-1.5 items-center ${
                              isCredit
                                ? 'bg-surface dark:bg-zinc-950 px-2 rounded border border-border-subtle/50 dark:border-zinc-800'
                                : ''
                            }`}
                          >
                            <span className="col-span-2 font-bold text-text-primary dark:text-white">
                              {expLine.accountCode}
                            </span>
                            <span className="col-span-6 text-text-secondary dark:text-zinc-300 truncate pr-2">
                              {acc?.name} ({acc?.nature})
                            </span>
                            <span className="col-span-2 text-right font-bold text-text-primary dark:text-white">
                              {expLine.debit > 0
                                ? formatCurrency(expLine.debit)
                                : '—'}
                            </span>
                            <span className="col-span-2 text-right font-bold text-text-primary dark:text-white">
                              {expLine.credit > 0
                                ? formatCurrency(expLine.credit)
                                : '—'}
                            </span>
                          </div>
                        );
                      })}
                      <div className="pt-2 border-t border-border-subtle dark:border-zinc-800 flex flex-wrap justify-between items-center gap-2 text-[11px] text-semantic-balance dark:text-secondary-fixed font-semibold">
                        <span>
                          ✓ Çift Taraflı Denge Tam: Borç Toplamı (
                          {formatCurrency(expectedTotal)}) = Alacak Toplamı (
                          {formatCurrency(expectedTotal)})
                        </span>
                        <span>Aktif / Pasif Karakterleri Doğru</span>
                      </div>
                    </div>
                  </article>
                );
              }

              // Kompakt Doğrulanmış Satır (Tıklanınca Detay Açılır)
              return (
                <div
                  key={item.transactionId}
                  onClick={() =>
                    setExpandedCorrectIds((prev) => ({
                      ...prev,
                      [item.transactionId]: true,
                    }))
                  }
                  className="bg-surface dark:bg-[#1C1B19] rounded-2xl border border-border-subtle dark:border-zinc-800 px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-surface-muted/50 dark:hover:bg-zinc-900 transition-colors cursor-pointer tabular-nums"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <CheckCircle2 className="w-4 h-4 text-semantic-balance shrink-0" />
                    <span className="text-xs font-ledger-readout font-bold text-text-primary dark:text-white shrink-0">
                      Madde #{String(tx.order).padStart(2, '0')}
                    </span>
                    <span className="text-xs text-text-secondary dark:text-zinc-300 truncate">
                      {tx.date} • {tx.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-ledger-readout shrink-0">
                    <span className="text-text-muted">
                      {formatCurrency(expectedTotal)}
                    </span>
                    <span className="text-semantic-balance dark:text-secondary-fixed font-semibold bg-secondary-fixed/30 dark:bg-emerald-950 px-2.5 py-0.5 rounded">
                      Doğrulandı
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* 3. EDİTÖRYAL ATÖLYE ALT BİLGİ ÇUBUĞU (Stitch Editorial Footer) */}
      <footer className="w-full bg-background dark:bg-[#121211] border-t border-border-subtle dark:border-zinc-800 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-1 text-center md:text-left">
            <div className="text-lg font-hero-display text-text-primary dark:text-white font-bold">
              Genel Muhasebe Stüdyosu
            </div>
            <p className="text-xs font-ledger-readout text-text-secondary dark:text-zinc-400">
              © 2026 Genel Muhasebe Stüdyosu — Tekdüzen Hesap Planı (TDHP) &amp;
              Çift Taraflı Kayıt Sistemi
            </p>
            <p className="text-[11px] font-ledger-readout text-text-muted">
              Standartlar: VUK, TMS / TFRS, Kamu Gözetimi Kurumu (KGK)
            </p>
          </div>

          <nav className="flex flex-wrap justify-center items-center gap-6 text-xs font-ledger-readout">
            <button
              type="button"
              onClick={onOpenAccountsGuide}
              className="text-text-secondary dark:text-zinc-400 hover:text-primary transition-colors cursor-pointer"
            >
              TDHP Dizini
            </button>
            <button
              type="button"
              onClick={returnToWorkspace}
              className="text-text-secondary dark:text-zinc-400 hover:text-primary transition-colors cursor-pointer"
            >
              Yevmiye Defterine Dön
            </button>
            <button
              type="button"
              onClick={returnToWelcome}
              className="text-text-secondary dark:text-zinc-400 hover:text-primary transition-colors cursor-pointer"
            >
              Atölye Vitrini
            </button>
          </nav>
        </div>
      </footer>
    </div>
  );
};
