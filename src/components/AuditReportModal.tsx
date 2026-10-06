import React from 'react';
import { useAccountingStore } from '../store/useAccountingStore';
import { 
  Award, 
  X, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Scale, 
  Landmark,
  ArrowRight,
  TrendingUp,
  FileCheck
} from 'lucide-react';

export const AuditReportModal: React.FC = () => {
  const { 
    showAuditModal, 
    setShowAuditModal, 
    auditResult, 
    getTrialBalance, 
    getBalanceSheet,
    setActiveTransactionIndex,
    setActiveTab,
    getCurrentScenario
  } = useAccountingStore();

  if (!showAuditModal || !auditResult) return null;

  const trialBalance = getTrialBalance();
  const balanceSheet = getBalanceSheet();
  const scenario = getCurrentScenario();

  const handleFixTransaction = (txId: string) => {
    const idx = scenario.transactions.findIndex(t => t.id === txId);
    if (idx !== -1) {
      setActiveTransactionIndex(idx);
      setActiveTab('yevmiye');
      setShowAuditModal(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-700 bg-emerald-50 border-emerald-300';
    if (score >= 60) return 'text-amber-700 bg-amber-50 border-amber-300';
    return 'text-rose-700 bg-rose-50 border-rose-300';
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Başlığı */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-zinc-800 rounded-xl">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-base">
                Muhasebe Denetim & Başarı Raporu
              </h3>
              <p className="text-xs text-slate-400">
                {scenario.companyName} • Genel Değerlendirme Karnesi
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowAuditModal(false)}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal İçeriği */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Başarı Skoru ve Ana Göstergeler */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className={`p-4 rounded-xl border text-center ${getScoreColor(auditResult.scorePercentage)}`}>
              <span className="text-[11px] font-bold uppercase tracking-wider block">Başarı Skoru</span>
              <span className="text-3xl font-black font-mono mt-1 block">
                %{auditResult.scorePercentage}
              </span>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 text-center">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">Doğru Kayıt</span>
              <span className="text-2xl font-bold font-mono text-emerald-700 mt-1 block">
                {auditResult.correctCount} / {auditResult.totalTransactions}
              </span>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 text-center">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">Hatalı Kayıt</span>
              <span className="text-2xl font-bold font-mono text-rose-700 mt-1 block">
                {auditResult.incorrectCount}
              </span>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 text-center">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">Dengesiz Madde</span>
              <span className="text-2xl font-bold font-mono text-amber-700 mt-1 block">
                {auditResult.balanceErrorsCount}
              </span>
            </div>
          </div>

          {/* Hata Analizi Özeti */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2 text-xs">
            <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-black" />
              <span>Hata Dağılımı ve Nedenleri:</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
              <div className="p-2.5 bg-white border border-slate-200 rounded-lg">
                <span className="text-slate-500 block text-[11px]">Yanlış Hesap Seçimi:</span>
                <span className="font-bold text-slate-900 text-sm">{auditResult.accountSelectionErrorsCount} adet</span>
              </div>
              <div className="p-2.5 bg-white border border-slate-200 rounded-lg">
                <span className="text-slate-500 block text-[11px]">Ters Kayıt (Yön Hatası):</span>
                <span className="font-bold text-slate-900 text-sm">{auditResult.directionErrorsCount} adet</span>
              </div>
              <div className="p-2.5 bg-white border border-slate-200 rounded-lg">
                <span className="text-slate-500 block text-[11px]">Borç/Alacak Farkı:</span>
                <span className="font-bold text-slate-900 text-sm">{auditResult.balanceErrorsCount} adet</span>
              </div>
            </div>
          </div>

          {/* Mizan & Bilanço Entegrasyon Durumu */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className={`p-3.5 rounded-xl border flex items-center justify-between ${
              trialBalance.isBalanced 
                ? 'bg-emerald-50 border-emerald-200 text-emerald-950' 
                : 'bg-rose-50 border-rose-200 text-rose-950'
            }`}>
              <div className="flex items-center gap-2">
                <Scale className="w-5 h-5 shrink-0" />
                <div>
                  <span className="font-bold block">Mizan Dengesi</span>
                  <span className="text-[11px] opacity-80">
                    {trialBalance.isBalanced ? 'Borç ve Alacak toplamları denk' : 'Tutarlar veya bakiyeler arasında fark var'}
                  </span>
                </div>
              </div>
              {trialBalance.isBalanced ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              ) : (
                <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
              )}
            </div>

            <div className={`p-3.5 rounded-xl border flex items-center justify-between ${
              balanceSheet.isBalanced 
                ? 'bg-emerald-50 border-emerald-200 text-emerald-950' 
                : 'bg-rose-50 border-rose-200 text-rose-950'
            }`}>
              <div className="flex items-center gap-2">
                <Landmark className="w-5 h-5 shrink-0" />
                <div>
                  <span className="font-bold block">Bilanço Denkliği (Aktif = Pasif)</span>
                  <span className="text-[11px] opacity-80">
                    {balanceSheet.isBalanced ? 'Varlıklar ile kaynaklar birbirine eşit' : `Fark: ${Math.abs(balanceSheet.difference)} TL`}
                  </span>
                </div>
              </div>
              {balanceSheet.isBalanced ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              ) : (
                <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
              )}
            </div>
          </div>

          {/* İşlem Bazlı Detay Listesi */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-slate-500" />
              <span>İşlem Bazında Denetim Çıktısı</span>
            </h4>

            <div className="space-y-2.5">
              {auditResult.transactionResults.map((txRes) => (
                <div
                  key={txRes.transactionId}
                  className={`p-3.5 rounded-xl border transition-all text-xs ${
                    txRes.isValid 
                      ? 'bg-emerald-50/40 border-emerald-200' 
                      : 'bg-rose-50/40 border-rose-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2 font-semibold">
                      {txRes.isValid ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      )}
                      <span className="text-slate-900">
                        #{txRes.order} - {txRes.title}
                      </span>
                    </div>

                    {!txRes.isValid && (
                      <button
                        type="button"
                        onClick={() => handleFixTransaction(txRes.transactionId)}
                        className="text-[11px] font-bold text-black hover:text-zinc-700 underline flex items-center gap-1 shrink-0 cursor-pointer"
                      >
                        <span>Düzelt</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  <div className="mt-2 text-[11px] font-mono grid grid-cols-1 sm:grid-cols-2 gap-2 pl-6">
                    <div className="bg-white/80 p-2 rounded border border-slate-200">
                      <span className="text-slate-500 block font-sans text-[10px]">Sizin Kaydınız:</span>
                      <span className="text-slate-800">{txRes.userSummary}</span>
                    </div>
                    <div className="bg-white/80 p-2 rounded border border-slate-200">
                      <span className="text-slate-500 block font-sans text-[10px]">Doğru Kayıt:</span>
                      <span className="text-black font-bold">{txRes.expectedSummary}</span>
                    </div>
                  </div>

                  {txRes.errors.length > 0 && (
                    <div className="mt-2 pl-6 space-y-1">
                      {txRes.errors.map((err, eIdx) => (
                        <div key={eIdx} className="text-rose-700 text-[11px] flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3 shrink-0" />
                          <span>{err}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Alt Kapat Çubuğu */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Hatalı işlemleri inceleyip yevmiye defterinden düzeltebilirsiniz.
          </span>
          <button
            type="button"
            onClick={() => setShowAuditModal(false)}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
