import React, { useEffect } from 'react';
import { useAccountingStore } from '../../store/useAccountingStore';
import { NavbarTabs } from '../NavbarTabs';
import { JournalEntryForm } from '../JournalEntryForm';
import { LedgerView } from '../LedgerView';
import { TrialBalanceView } from '../TrialBalanceView';
import { BalanceSheetView } from '../BalanceSheetView';
import { 
  ArrowLeft, 
  ChevronLeft, 
  ChevronRight, 
  Flag, 
  Sun, 
  Moon, 
  BookOpen, 
  HelpCircle, 
  Sparkles,
  Calendar,
  Wallet
} from 'lucide-react';
import { formatCurrency } from '../../core/accountingEngine';

interface WorkspaceScreenProps {
  onOpenAccountsGuide: () => void;
}

export const WorkspaceScreen: React.FC<WorkspaceScreenProps> = ({ onOpenAccountsGuide }) => {
  const {
    getCurrentScenario,
    getActiveTransaction,
    activeTransactionIndex,
    setActiveTransactionIndex,
    activeTab,
    mode,
    userEntries,
    requestNextHint,
    autoFillCorrectSolution,
    finishScenarioAndShowSummary,
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
  const totalTx = scenario.transactions.length;

  const handlePrevTx = () => {
    if (activeTransactionIndex > 0) {
      setActiveTransactionIndex(activeTransactionIndex - 1);
    }
  };

  const handleNextTx = () => {
    if (activeTransactionIndex < totalTx - 1) {
      setActiveTransactionIndex(activeTransactionIndex + 1);
    }
  };

  // Kullanıcının kayıt girdiği işlem sayısı
  const recordedCount = scenario.transactions.filter((tx) => {
    const lines = userEntries[tx.id] || [];
    return lines.some((l) => l.accountCode && (l.debit > 0 || l.credit > 0));
  }).length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black text-slate-900 dark:text-zinc-100 flex flex-col justify-between transition-colors">
      {/* 1. Üst Bar: Minimalist ve Odaklanmış Başlık */}
      <header className="border-b border-slate-200 dark:border-zinc-800 bg-white/90 dark:bg-black/90 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-2">
          {/* Sol: Geri Dönüş ve Şirket Adı */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <button
              type="button"
              onClick={returnToWelcome}
              className="p-1.5 text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-zinc-100 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-900 cursor-pointer shrink-0"
              title="Lobiye / Senaryo Seçimine Dön"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                  {scenario.companyName}
                </span>
                <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-zinc-900 text-indigo-700 dark:text-zinc-300 border border-indigo-200/50 dark:border-zinc-800 shrink-0">
                  {scenario.difficulty}
                </span>
              </div>
              <div className="text-[11px] text-slate-500 dark:text-zinc-400 flex items-center gap-2">
                <span className="hidden sm:inline">Kuruluş: {scenario.establishedDate}</span>
                <span className="hidden sm:inline">•</span>
                <span>{recordedCount}/{totalTx} İşlem Kaydedildi</span>
              </div>
            </div>
          </div>

          {/* Sağ: Rehber, Tema ve Bitiş Butonu */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              type="button"
              onClick={onOpenAccountsGuide}
              className="p-2 sm:px-3 sm:py-1.5 text-xs font-medium text-slate-700 dark:text-zinc-200 bg-slate-100 dark:bg-zinc-900 dark:border dark:border-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-800 rounded-lg cursor-pointer"
              title="Hesap Planı Rehberi"
            >
              <BookOpen className="w-4 h-4 text-indigo-500 dark:text-zinc-400 sm:mr-1.5 sm:inline" />
              <span className="hidden sm:inline">Hesap Planı</span>
            </button>

            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Temayı Değiştir"
              className="p-2 text-slate-600 dark:text-zinc-300 bg-slate-100 dark:bg-zinc-900 dark:border dark:border-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-800 rounded-lg cursor-pointer"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-600" />
              )}
            </button>

            <button
              type="button"
              onClick={finishScenarioAndShowSummary}
              className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white rounded-lg text-xs font-bold shadow-xs cursor-pointer transition-colors"
            >
              <Flag className="w-3.5 h-3.5" />
              <span>Bitir & Karne Al</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. Aktif İşlem Odak Kartı (Tek İşlem Vurgusu & Temiz Gezinti) */}
      <div className="bg-white dark:bg-zinc-950 border-b border-slate-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Sol: İşlem Başlığı ve Metni */}
            <div className="space-y-1.5 min-w-0">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="font-mono font-bold bg-indigo-100 dark:bg-zinc-800 text-indigo-800 dark:text-zinc-200 px-2.5 py-0.5 rounded-full">
                  İşlem {activeTx.order} / {totalTx}
                </span>
                <span className="font-mono text-slate-500 dark:text-zinc-400 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500" />
                  {activeTx.date}
                </span>
                {activeTx.amount && (
                  <span className="font-semibold text-slate-700 dark:text-zinc-300 flex items-center gap-1">
                    <Wallet className="w-3.5 h-3.5 text-emerald-500" />
                    {formatCurrency(activeTx.amount)}
                  </span>
                )}
              </div>

              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug">
                {activeTx.description}
              </h2>
            </div>

            {/* Sağ: İpuçları & Önceki / Sonraki Kontrolleri */}
            <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
              {mode === 'ogrenme' && (
                <>
                  <button
                    type="button"
                    onClick={() => requestNextHint(activeTx.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 dark:bg-zinc-900 hover:bg-amber-100 dark:hover:bg-zinc-800 text-amber-800 dark:text-amber-400 border border-amber-200 dark:border-zinc-800 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                  >
                    <HelpCircle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    <span>İpucu Al</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => autoFillCorrectSolution(activeTx.id)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-slate-500 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-zinc-200 text-xs font-medium cursor-pointer"
                    title="Takıldıysan bu işlemin doğru çözümünü deftere aktar"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Çözümü Doldur</span>
                  </button>
                </>
              )}

              <div className="flex items-center gap-1 border-l border-slate-200 dark:border-zinc-800 pl-2">
                <button
                  type="button"
                  disabled={activeTransactionIndex === 0}
                  onClick={handlePrevTx}
                  className="p-1.5 rounded-lg text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-900 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  title="Önceki İşlem"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <button
                  type="button"
                  disabled={activeTransactionIndex === totalTx - 1}
                  onClick={handleNextTx}
                  className="p-1.5 rounded-lg text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-900 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  title="Sonraki İşlem"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Adım Göstergesi (Pills / Mini Dots) */}
          <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-slate-100 dark:border-zinc-800 overflow-x-auto">
            {scenario.transactions.map((tx, idx) => {
              const isActive = idx === activeTransactionIndex;
              const lines = userEntries[tx.id] || [];
              const isRecorded = lines.some((l) => l.accountCode && (l.debit > 0 || l.credit > 0));

              return (
                <button
                  key={tx.id}
                  type="button"
                  onClick={() => setActiveTransactionIndex(idx)}
                  className={`px-2.5 py-1 rounded-md text-xs font-mono font-semibold transition-all shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-indigo-600 dark:bg-white text-white dark:text-black shadow-xs font-bold'
                      : isRecorded
                      ? 'bg-emerald-50 dark:bg-zinc-900 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/50'
                      : 'bg-slate-100 dark:bg-zinc-900/80 text-slate-600 dark:text-zinc-400 hover:bg-slate-200 dark:hover:bg-zinc-800'
                  }`}
                  title={tx.description}
                >
                  <span>#{tx.order}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. Muhasebe Aşamaları Sekmeleri */}
      <NavbarTabs />

      {/* 4. Ana Çalışma Alanı */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'yevmiye' && <JournalEntryForm />}
        {activeTab === 'defterikebir' && <LedgerView />}
        {activeTab === 'mizan' && <TrialBalanceView />}
        {activeTab === 'bilanco' && <BalanceSheetView />}
      </main>

      {/* 5. Alt Bilgi Çubuğu */}
      <footer className="border-t border-slate-200 dark:border-zinc-800 bg-white dark:bg-black py-3 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500 dark:text-zinc-500">
          <div className="flex items-center gap-2">
            <span>Genel Muhasebe İnteraktif Çalışma Alanı</span>
            <span>•</span>
            <span className="font-mono">THP Standartları</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onOpenAccountsGuide}
              className="inline-flex items-center gap-1.5 text-indigo-600 dark:text-zinc-300 hover:underline font-medium cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Hesap Planı & Kurallar Rehberi</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
