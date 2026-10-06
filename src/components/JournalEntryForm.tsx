import React from 'react';
import { useAccountingStore } from '../store/useAccountingStore';
import { AccountSelect } from './common/AccountSelect';
import { getAccountByCode } from '../core/accounts';
import { formatCurrency } from '../core/accountingEngine';
import { 
  Plus, 
  Trash2, 
  RotateCcw, 
  CheckCircle, 
  AlertTriangle, 
  ArrowRight, 
  Info, 
  Scale 
} from 'lucide-react';

export const JournalEntryForm: React.FC = () => {
  const {
    getActiveTransaction,
    getLinesForActiveTransaction,
    getValidationForActiveTransaction,
    addLine,
    removeLine,
    updateLine,
    resetLinesForTransaction,
    mode,
    activeTransactionIndex,
    setActiveTransactionIndex,
    getCurrentScenario,
  } = useAccountingStore();

  const activeTx = getActiveTransaction();
  const lines = getLinesForActiveTransaction();
  const validation = getValidationForActiveTransaction();
  const scenario = getCurrentScenario();

  const handleDebitChange = (lineId: string, val: string) => {
    const num = Math.max(0, parseFloat(val) || 0);
    updateLine(activeTx.id, lineId, {
      debit: num,
      credit: num > 0 ? 0 : 0, // Borç girildiyse alacağı sıfırla
    });
  };

  const handleCreditChange = (lineId: string, val: string) => {
    const num = Math.max(0, parseFloat(val) || 0);
    updateLine(activeTx.id, lineId, {
      credit: num,
      debit: num > 0 ? 0 : 0, // Alacak girildiyse borcu sıfırla
    });
  };

  const hasNextTx = activeTransactionIndex < scenario.transactions.length - 1;

  return (
    <div className="space-y-6">
      {/* Yevmiye Defteri Çerçevesi */}
      <div className="bg-white dark:bg-zinc-950 rounded-2xl shadow-xs border border-slate-200 dark:border-zinc-800 overflow-hidden transition-colors">
        {/* Defter Üst Başlığı */}
        <div className="bg-slate-800 dark:bg-zinc-900 text-white px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 border-b border-slate-700 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs bg-slate-700 dark:bg-zinc-800 px-2.5 py-1 rounded-md text-slate-200 dark:text-zinc-200 font-bold">
              Madde No: #{activeTx.order}
            </span>
            <span className="text-sm font-semibold tracking-wide text-slate-100 dark:text-zinc-100">
              Yevmiye Defteri Kaydı
            </span>
            <span className="text-xs text-slate-400 dark:text-zinc-500 font-mono">
              ({activeTx.date})
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => addLine(activeTx.id)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-black hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Satır Ekle</span>
            </button>
            <button
              type="button"
              onClick={() => resetLinesForTransaction(activeTx.id)}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-slate-300 hover:text-white dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-slate-700 dark:hover:bg-zinc-800 rounded-lg text-xs transition-colors cursor-pointer"
              title="Bu işlemi temizle"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Temizle</span>
            </button>
          </div>
        </div>

        {/* 1. MOBİL KART GÖRÜNÜMÜ (< 768px) */}
        <div className="block md:hidden p-4 space-y-3 bg-slate-50/50 dark:bg-black/50">
          {lines.map((line, index) => {
            const accountDef = line.accountCode ? getAccountByCode(line.accountCode) : undefined;
            const isCreditSide = line.credit > 0;

            return (
              <div 
                key={line.id} 
                className={`p-3.5 rounded-xl border bg-white dark:bg-zinc-950 space-y-3 transition-colors ${
                  isCreditSide 
                    ? 'border-amber-200 dark:border-amber-900/60 shadow-xs' 
                    : line.debit > 0
                    ? 'border-blue-200 dark:border-blue-900/60 shadow-xs'
                    : 'border-slate-200 dark:border-zinc-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded-md ${
                    line.debit > 0
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/70 dark:text-blue-300'
                      : line.credit > 0
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300'
                      : 'bg-slate-100 text-slate-500 dark:bg-zinc-900 dark:text-zinc-400'
                  }`}>
                    {line.debit > 0 ? 'BORÇ KAYDI' : line.credit > 0 ? 'ALACAK KAYDI' : `Satır #${index + 1}`}
                  </span>

                  <button
                    type="button"
                    onClick={() => removeLine(activeTx.id, line.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 dark:text-zinc-500 dark:hover:text-rose-400 rounded-lg cursor-pointer"
                    title="Satırı Sil"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-600 dark:text-zinc-300 block mb-1">
                    Hesap Kodu ve Adı
                  </label>
                  <AccountSelect
                    value={line.accountCode}
                    onChange={(code) => updateLine(activeTx.id, line.id, { accountCode: code })}
                    placeholder="Hesap seçiniz..."
                  />
                  {accountDef && (
                    <div className="mt-1 text-[11px] text-slate-500 dark:text-zinc-400 flex items-center gap-1.5">
                      <span className="font-semibold text-slate-700 dark:text-zinc-200">{accountDef.nature}</span>
                      <span>•</span>
                      <span className="truncate">{accountDef.description}</span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-semibold text-blue-700 dark:text-blue-400 block mb-1">
                      Borç (TL)
                    </label>
                    <input
                      type="number"
                      step="1"
                      min="0"
                      value={line.debit > 0 ? line.debit : ''}
                      onChange={(e) => handleDebitChange(line.id, e.target.value)}
                      placeholder="0,00"
                      className="w-full text-right font-mono font-semibold text-sm px-3 py-2 bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-800 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-amber-700 dark:text-amber-400 block mb-1">
                      Alacak (TL)
                    </label>
                    <input
                      type="number"
                      step="1"
                      min="0"
                      value={line.credit > 0 ? line.credit : ''}
                      onChange={(e) => handleCreditChange(line.id, e.target.value)}
                      placeholder="0,00"
                      className="w-full text-right font-mono font-semibold text-sm px-3 py-2 bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-800 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 2. MASAÜSTÜ TABLO GÖRÜNÜMÜ (>= 768px) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100/90 dark:bg-zinc-900/90 text-[11px] font-bold text-slate-600 dark:text-zinc-300 uppercase tracking-wider border-b border-slate-200 dark:border-zinc-800">
                <th className="py-2.5 px-3 w-16 text-center">Yön</th>
                <th className="py-2.5 px-4 min-w-[280px]">Hesap Kodu ve Adı</th>
                <th className="py-2.5 px-4 w-40 text-right">Borç (TL)</th>
                <th className="py-2.5 px-4 w-40 text-right">Alacak (TL)</th>
                <th className="py-2.5 px-2 w-12 text-center">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-zinc-800 text-sm">
              {lines.map((line, index) => {
                const accountDef = line.accountCode ? getAccountByCode(line.accountCode) : undefined;
                const isCreditSide = line.credit > 0;

                return (
                  <tr 
                    key={line.id} 
                    className={`hover:bg-slate-50/80 dark:hover:bg-zinc-900/50 transition-colors ${
                      isCreditSide ? 'bg-slate-50/40 dark:bg-zinc-950/40' : ''
                    }`}
                  >
                    {/* Yön / İndikatör */}
                    <td className="py-3 px-3 text-center">
                      <span className={`text-[10px] font-bold font-mono px-1.5 py-0.5 rounded ${
                        line.debit > 0
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/70 dark:text-blue-300'
                          : line.credit > 0
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300'
                          : 'bg-slate-100 text-slate-400 dark:bg-zinc-900 dark:text-zinc-500'
                      }`}>
                        {line.debit > 0 ? 'BORÇ' : line.credit > 0 ? 'ALACAK' : `#${index + 1}`}
                      </span>
                    </td>

                    {/* Hesap Seçimi */}
                    <td className="py-3 px-4">
                      <div className={`transition-all ${isCreditSide ? 'pl-8' : 'pl-0'}`}>
                        <AccountSelect
                          value={line.accountCode}
                          onChange={(code) => updateLine(activeTx.id, line.id, { accountCode: code })}
                          placeholder="Hesap seçiniz..."
                        />
                        {accountDef && (
                          <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-500 dark:text-zinc-400">
                            <span className="font-semibold text-slate-700 dark:text-zinc-200">{accountDef.nature}</span>
                            <span>•</span>
                            <span className="truncate max-w-sm">{accountDef.description}</span>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Borç Tutarı Girişi */}
                    <td className="py-3 px-4">
                      <div className="relative">
                        <input
                          type="number"
                          step="1"
                          min="0"
                          value={line.debit > 0 ? line.debit : ''}
                          onChange={(e) => handleDebitChange(line.id, e.target.value)}
                          placeholder="0,00"
                          className="w-full text-right font-mono font-semibold text-sm px-3 py-2 bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-800 rounded-lg text-slate-900 dark:text-white shadow-2xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </td>

                    {/* Alacak Tutarı Girişi */}
                    <td className="py-3 px-4">
                      <div className="relative">
                        <input
                          type="number"
                          step="1"
                          min="0"
                          value={line.credit > 0 ? line.credit : ''}
                          onChange={(e) => handleCreditChange(line.id, e.target.value)}
                          placeholder="0,00"
                          className="w-full text-right font-mono font-semibold text-sm px-3 py-2 bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-800 rounded-lg text-slate-900 dark:text-white shadow-2xs focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                        />
                      </div>
                    </td>

                    {/* Satır Silme */}
                    <td className="py-3 px-2 text-center">
                      <button
                        type="button"
                        onClick={() => removeLine(activeTx.id, line.id)}
                        className="text-slate-400 hover:text-rose-600 dark:text-zinc-500 dark:hover:text-rose-400 p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                        title="Satırı Sil"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>

            {/* Masaüstü Toplam ve Denge Çubuğu */}
            <tfoot>
              <tr className="bg-slate-100 dark:bg-zinc-900/90 text-xs font-bold border-t-2 border-slate-300 dark:border-zinc-800">
                <td colSpan={2} className="py-3 px-4 text-slate-700 dark:text-zinc-300">
                  <div className="flex items-center gap-2">
                    <Scale className="w-4 h-4 text-slate-500 dark:text-zinc-400" />
                    <span>Yevmiye Maddesi Toplamları:</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-right font-mono text-sm text-slate-900 dark:text-white">
                  {formatCurrency(validation.totalDebit)}
                </td>
                <td className="py-3 px-4 text-right font-mono text-sm text-slate-900 dark:text-white">
                  {formatCurrency(validation.totalCredit)}
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Mobil Toplam Gösterimi (< 768px) */}
        <div className="block md:hidden px-4 py-3 bg-slate-100 dark:bg-zinc-900/90 border-t border-slate-200 dark:border-zinc-800 text-xs font-bold">
          <div className="flex items-center justify-between text-slate-700 dark:text-zinc-300 mb-1">
            <span>Toplam Borç:</span>
            <span className="font-mono text-blue-600 dark:text-blue-400">{formatCurrency(validation.totalDebit)}</span>
          </div>
          <div className="flex items-center justify-between text-slate-700 dark:text-zinc-300">
            <span>Toplam Alacak:</span>
            <span className="font-mono text-amber-600 dark:text-amber-400">{formatCurrency(validation.totalCredit)}</span>
          </div>
        </div>

        {/* Denge Bildirimi Şeridi (Hem Mobil Hem Masaüstü) */}
        <div className="px-4 sm:px-6 py-3 bg-slate-50 dark:bg-zinc-950 border-t border-slate-200 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-medium text-slate-600 dark:text-zinc-400">Denge Durumu:</span>
            {validation.totalDebit === 0 && validation.totalCredit === 0 ? (
              <span className="inline-flex items-center gap-1 font-semibold text-slate-600 dark:text-zinc-300 bg-slate-200 dark:bg-zinc-900 px-2.5 py-0.5 rounded-full">
                <Info className="w-3.5 h-3.5 text-slate-500 dark:text-zinc-400" />
                Tutar Girişi Bekleniyor
              </span>
            ) : validation.difference < 0.01 && validation.totalDebit > 0 ? (
              <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/80 px-2.5 py-0.5 rounded-full border dark:border-emerald-900/50">
                <CheckCircle className="w-3.5 h-3.5" />
                Borç ve Alacak Eşit (Dengeli)
              </span>
            ) : (
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 font-semibold text-rose-700 dark:text-rose-300 bg-rose-100 dark:bg-rose-950/80 px-2.5 py-0.5 rounded-full border dark:border-rose-900/50">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Dengesiz: {formatCurrency(validation.difference)} Fark Var
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const diff = validation.difference;
                    if (diff <= 0.01) return;
                    const isDebitMissing = validation.totalDebit < validation.totalCredit;
                    const emptyLine = lines.find(l => l.debit === 0 && l.credit === 0);
                    if (emptyLine) {
                      updateLine(activeTx.id, emptyLine.id, isDebitMissing ? { debit: diff, credit: 0 } : { credit: diff, debit: 0 });
                    } else {
                      addLine(activeTx.id);
                    }
                  }}
                  className="text-[11px] font-bold text-zinc-800 dark:text-zinc-200 hover:text-black bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 px-2 py-0.5 rounded border border-zinc-300 dark:border-zinc-700 cursor-pointer transition-colors"
                >
                  Farkı {validation.totalDebit < validation.totalCredit ? 'Borca' : 'Alacağa'} Ekle
                </button>
              </div>
            )}
          </div>

          <div className="text-slate-500 dark:text-zinc-500 text-[11px]">
            {activeTx.expectedEntry.lines.length} hesap etkileniyor • Çift taraflı kayıt ilkesi
          </div>
        </div>
      </div>

      {/* Doğrulama ve Sokratik Teşhis Paneli (Öğrenme Modunda Aktif) */}
      {mode === 'ogrenme' && (
        <div className="space-y-3">
          {validation.isValid ? (
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 rounded-2xl flex items-start justify-between gap-3 shadow-xs">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 rounded-xl shrink-0 mt-0.5">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-emerald-950 dark:text-emerald-200">
                    Kayıt Tamamen Doğru! 🎉
                  </h4>
                  <p className="text-xs text-emerald-900 dark:text-emerald-300 mt-1 leading-relaxed">
                    {activeTx.expectedEntry.educationalNotes}
                  </p>
                </div>
              </div>

              {hasNextTx && (
                <button
                  type="button"
                  onClick={() => setActiveTransactionIndex(activeTransactionIndex + 1)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors shrink-0 cursor-pointer"
                >
                  <span>Sonraki İşlem</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ) : (
            <div className="p-4 bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-2xl space-y-3 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-2">
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
                  <span className="text-xs font-bold text-slate-800 dark:text-zinc-200 uppercase tracking-wide">
                    Öğretici Geri Bildirim ve Teşhis
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 dark:text-zinc-400">
                  Muhasebe Kuralları Kontrolü
                </span>
              </div>

              {/* Genel Mesajlar (Örn: Dengesizlik) */}
              {validation.generalMessages.map((msg, idx) => (
                <div key={idx} className="p-2.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-xl text-xs text-rose-800 dark:text-rose-300 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
                  <span className="leading-relaxed font-medium">{msg}</span>
                </div>
              ))}

              {/* Satır Bazlı Teşhisler */}
              <div className="space-y-2">
                {validation.diagnostics.map((diag, idx) => {
                  if (diag.type === 'CORRECT') return null;

                  return (
                    <div 
                      key={idx}
                      className="p-3 bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/50 rounded-xl text-xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between font-semibold text-amber-900 dark:text-amber-200">
                        <span>{diag.message}</span>
                        {diag.accountCode && (
                          <span className="font-mono text-[10px] bg-amber-200/70 dark:bg-amber-900/70 px-1.5 py-0.5 rounded text-amber-950 dark:text-amber-200">
                            Hesap {diag.accountCode}
                          </span>
                        )}
                      </div>
                      <p className="text-slate-700 dark:text-zinc-300 leading-relaxed font-normal">
                        💡 <strong>Muhasebe Mantığı:</strong> {diag.pedagogicalTip}
                      </p>
                      {diag.suggestedAction && (
                        <p className="text-zinc-800 dark:text-zinc-300 text-[11px] font-medium pt-0.5">
                          👉 <strong>Öneri:</strong> {diag.suggestedAction}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
