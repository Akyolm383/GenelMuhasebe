import React, { useEffect } from 'react';
import { useAccountingStore } from '../../store/useAccountingStore';
import { getAccountByCode } from '../../core/accounts';
import { 
  Trophy, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  RotateCcw, 
  ArrowLeft, 
  Sun, 
  Moon, 
  Scale, 
  BookOpen 
} from 'lucide-react';

interface SummaryScreenProps {
  onOpenAccountsGuide: () => void;
}

export const SummaryScreen: React.FC<SummaryScreenProps> = ({ onOpenAccountsGuide }) => {
  const { 
    auditResult, 
    runScenarioAudit,
    getCurrentScenario, 
    returnToWorkspace, 
    returnToWelcome,
    setActiveTransactionIndex,
    theme,
    toggleTheme 
  } = useAccountingStore();

  const scenario = getCurrentScenario();

  useEffect(() => {
    if (!auditResult) {
      runScenarioAudit();
    }
  }, [auditResult, runScenarioAudit]);

  if (!auditResult) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[#fafafa] dark:bg-black text-zinc-800 dark:text-zinc-200">
        <div className="text-center space-y-4">
          <p className="text-sm">Rapor hazırlanıyor...</p>
          <button
            type="button"
            onClick={returnToWelcome}
            className="px-4 py-2 bg-black hover:bg-zinc-800 text-white dark:bg-white dark:text-black rounded-lg text-xs font-semibold cursor-pointer"
          >
            Lobiye Dön
          </button>
        </div>
      </div>
    );
  }

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

  const getScoreColor = () => {
    if (scorePercentage >= 80) return 'text-emerald-500 dark:text-emerald-400';
    if (scorePercentage >= 50) return 'text-amber-500 dark:text-amber-400';
    return 'text-rose-500 dark:text-rose-400';
  };

  const getScoreBadgeBg = () => {
    if (scorePercentage >= 80) return 'bg-emerald-50 dark:bg-zinc-950 border-emerald-200 dark:border-emerald-900/50';
    if (scorePercentage >= 50) return 'bg-amber-50 dark:bg-zinc-950 border-amber-200 dark:border-amber-900/50';
    return 'bg-rose-50 dark:bg-zinc-950 border-rose-200 dark:border-zinc-800';
  };

  const handleEditTransaction = (txIndex: number) => {
    setActiveTransactionIndex(txIndex);
    returnToWorkspace();
  };

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-black text-zinc-900 dark:text-zinc-100 flex flex-col justify-between transition-colors">
      {/* Üst Bar */}
      <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-black/90 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={returnToWelcome}
              className="p-1.5 text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-100 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 cursor-pointer"
              title="Lobiye Dön"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="font-bold text-sm sm:text-base text-zinc-900 dark:text-white">
                Çalışma Sonu Değerlendirme & Denetim Raporu
              </h1>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {scenario.companyName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenAccountsGuide}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-700 dark:text-zinc-200 bg-zinc-100 dark:bg-zinc-900 dark:border dark:border-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-lg cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-zinc-700 dark:text-zinc-400" />
              <span className="hidden sm:inline">Hesap Planı</span>
            </button>

            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Temayı Değiştir"
              className="p-2 text-zinc-600 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-900 dark:border dark:border-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-lg cursor-pointer"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-zinc-800" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Ana Rapor Gövdesi */}
      <main className="max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8 flex-1">
        {/* Karne Başlık Kartı */}
        <section className={`rounded-3xl p-6 sm:p-8 border-2 ${getScoreBadgeBg()} flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs`}>
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-white dark:bg-black dark:border dark:border-zinc-800 shadow-md flex items-center justify-center shrink-0">
              <Trophy className={`w-8 h-8 ${getScoreColor()}`} />
            </div>
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Genel Muhasebe Başarı Karnesi
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-zinc-900 dark:text-white">
                {scorePercentage >= 80 ? 'Harika Bir Çalışma! 🎉' : scorePercentage >= 50 ? 'Gelişime Açık İyi Bir Deneme! 👍' : 'Biraz Daha Pratik Gerek! 💪'}
              </h2>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
                {totalTransactions} işlemden {correctCount} tanesi tam doğru olarak kaydedildi.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            <div className="text-center px-6 py-3 rounded-2xl bg-white dark:bg-black shadow-xs border border-zinc-200 dark:border-zinc-800 w-full sm:w-auto">
              <span className="text-xs text-zinc-500 dark:text-zinc-400 block font-medium">Başarı Oranı</span>
              <span className={`text-3xl font-black ${getScoreColor()}`}>
                %{scorePercentage}
              </span>
            </div>

            <div className="flex flex-col gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={returnToWorkspace}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-black hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Kayıtlara Dön & Düzelt</span>
              </button>

              <button
                type="button"
                onClick={returnToWelcome}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
              >
                <span>Başka Senaryo Seç</span>
              </button>
            </div>
          </div>
        </section>

        {/* 4 İstatistik Kartı */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-4 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 space-y-1">
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Tam Doğru Kayıt</span>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              <span>{correctCount} / {totalTransactions}</span>
            </div>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-500">Hiç hatasız kaydedilenler</p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 space-y-1">
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Hatalı Kayıt</span>
            <div className="text-2xl font-black text-rose-600 dark:text-rose-400 flex items-center gap-2">
              <XCircle className="w-5 h-5" />
              <span>{incorrectCount}</span>
            </div>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-500">Düzeltilmesi gerekenler</p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 space-y-1">
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Dengesiz Yevmiye Maddesi</span>
            <div className={`text-2xl font-black flex items-center gap-2 ${balanceErrorsCount > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-zinc-700 dark:text-zinc-300'}`}>
              <Scale className="w-5 h-5" />
              <span>{balanceErrorsCount}</span>
            </div>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-500">Borç ≠ Alacak olan maddeler</p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 space-y-1">
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Yön / Hesap Hataları</span>
            <div className="text-2xl font-black text-black dark:text-zinc-200 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              <span>{directionErrorsCount + accountSelectionErrorsCount}</span>
            </div>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-500">{directionErrorsCount} ters kayıt, {accountSelectionErrorsCount} yanlış hesap</p>
          </div>
        </section>

        {/* Detaylı İşlem İnceleme Listesi */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              <span>İşlem Bazında Denetim ve Pedagojik Açıklamalar</span>
            </h3>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
              Her işlemi inceleyip düzeltin
            </span>
          </div>

          <div className="space-y-4">
            {transactionResults.map((item, idx: number) => {
              const tx = scenario.transactions[idx];
              const isSuccess = item.isValid;

              return (
                <div
                  key={item.transactionId}
                  className={`rounded-2xl border p-5 bg-white dark:bg-zinc-950 transition-all ${
                    isSuccess
                      ? 'border-emerald-200 dark:border-emerald-900/50 shadow-xs'
                      : 'border-rose-200 dark:border-rose-900/40 shadow-xs'
                  }`}
                >
                  {/* Başlık Satırı */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-zinc-100 dark:border-zinc-800">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300">
                        Madde #{tx?.order || idx + 1}
                      </span>
                      <span className="text-xs text-zinc-400 dark:text-zinc-500 font-mono">({tx?.date})</span>
                      <h4 className="font-bold text-sm text-zinc-900 dark:text-white">
                        {tx?.description}
                      </h4>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full ${
                        isSuccess
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400 border dark:border-emerald-900/50'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-400 border dark:border-rose-900/50'
                      }`}>
                        {isSuccess ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Tam Doğru</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Hatalı / Eksik</span>
                          </>
                        )}
                      </span>

                      {!isSuccess && (
                        <button
                          type="button"
                          onClick={() => handleEditTransaction(idx)}
                          className="px-3 py-1 bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-black dark:text-zinc-200 border border-zinc-200 dark:border-zinc-800 text-xs font-semibold rounded-lg cursor-pointer transition-colors"
                        >
                          Düzelt
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Hata Açıklamaları Kutusu */}
                  {item.errors.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {item.errors.map((errMsg: string, errIdx: number) => (
                        <div
                          key={errIdx}
                          className="p-3 rounded-xl text-xs space-y-1 bg-rose-50 dark:bg-rose-950/30 text-rose-900 dark:text-rose-300 border border-rose-200 dark:border-rose-900/40"
                        >
                          <div className="font-semibold flex items-center gap-1.5">
                            <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                            <span>{errMsg}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Kullanıcı Girişi vs Doğru Çözüm Karşılaştırması */}
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    {/* Kullanıcının Yaptığı Kayıt */}
                    <div className="bg-zinc-50/70 dark:bg-zinc-900/50 p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-2">
                      <span className="font-bold text-zinc-700 dark:text-zinc-300 block text-[11px] uppercase tracking-wider">
                        Sizin Yevmiye Kaydınız
                      </span>
                      <p className="font-mono text-zinc-800 dark:text-zinc-200">{item.userSummary}</p>
                    </div>

                    {/* Olması Gereken Doğru Kayıt */}
                    <div className="bg-zinc-50 dark:bg-zinc-900/30 p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-2">
                      <span className="font-bold text-black dark:text-zinc-300 block text-[11px] uppercase tracking-wider">
                        Olması Gereken Doğru Muhasebe Kaydı
                      </span>
                      <div className="space-y-1">
                        {tx.expectedEntry.lines.map((line, lIdx: number) => {
                          const acc = getAccountByCode(line.accountCode);
                          return (
                            <div key={lIdx} className="flex items-center justify-between font-mono text-[11px] py-1 border-b border-zinc-200 dark:border-zinc-800 last:border-0">
                              <span className={line.credit > 0 ? 'pl-4 text-zinc-600 dark:text-zinc-400' : 'font-semibold text-zinc-900 dark:text-zinc-100'}>
                                {line.accountCode} {acc?.name || ''}
                              </span>
                              <span>
                                {line.debit > 0 ? (
                                  <span className="text-emerald-700 dark:text-emerald-400 font-semibold">{line.debit} TL B</span>
                                ) : (
                                  <span className="text-amber-700 dark:text-amber-400 font-semibold">{line.credit} TL A</span>
                                )}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Alt Eylem Çubuğu */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t border-zinc-200 dark:border-zinc-800">
          <button
            type="button"
            onClick={returnToWelcome}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-xs font-semibold text-zinc-700 dark:text-zinc-300 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Ana Menüye Dön</span>
          </button>

          <button
            type="button"
            onClick={returnToWorkspace}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-black hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 text-white text-xs font-bold shadow-md dark:shadow-none cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Çalışma Alanına Dön ve Hatalarını Düzelt</span>
          </button>
        </div>
      </main>

      {/* Alt Bilgi */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black py-3 text-center text-xs text-zinc-500 dark:text-zinc-500">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-center gap-2">
          <span>Genel Muhasebe Denetim Motoru • Tekdüzen Hesap Planı Doğrulama</span>
        </div>
      </footer>
    </div>
  );
};
