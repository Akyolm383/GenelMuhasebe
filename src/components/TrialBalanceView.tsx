import React, { useState } from 'react';
import { useAccountingStore } from '../store/useAccountingStore';
import { formatCurrency } from '../core/accountingEngine';
import { TableProperties, CheckCircle2, AlertTriangle, Eye, Edit3, HelpCircle } from 'lucide-react';

export const TrialBalanceView: React.FC = () => {
  const { getTrialBalance } = useAccountingStore();
  const trialBalance = getTrialBalance();

  // 'auto' | 'practice'
  const [viewMode, setViewMode] = useState<'auto' | 'practice'>('auto');

  // Öğrencinin kendi dolduracağı mizan pratik state'i:
  // accountCode -> { debit, credit, debitBal, creditBal }
  const [practiceRows, setPracticeRows] = useState<Record<string, {
    totalDebit: string;
    totalCredit: string;
    debitBalance: string;
    creditBalance: string;
  }>>({});
  const [practiceCheckResult, setPracticeCheckResult] = useState<{
    isChecked: boolean;
    errors: string[];
    isCorrect: boolean;
  }>({ isChecked: false, errors: [], isCorrect: false });

  const handlePracticeChange = (code: string, field: 'totalDebit' | 'totalCredit' | 'debitBalance' | 'creditBalance', val: string) => {
    setPracticeRows(prev => ({
      ...prev,
      [code]: {
        totalDebit: prev[code]?.totalDebit || '',
        totalCredit: prev[code]?.totalCredit || '',
        debitBalance: prev[code]?.debitBalance || '',
        creditBalance: prev[code]?.creditBalance || '',
        [field]: val,
      }
    }));
  };

  const handleCheckPractice = () => {
    const errors: string[] = [];

    trialBalance.rows.forEach(actualRow => {
      const user = practiceRows[actualRow.accountCode] || { totalDebit: '0', totalCredit: '0', debitBalance: '0', creditBalance: '0' };
      const uDebit = parseFloat(user.totalDebit) || 0;
      const uCredit = parseFloat(user.totalCredit) || 0;
      const uDebBal = parseFloat(user.debitBalance) || 0;
      const uCredBal = parseFloat(user.creditBalance) || 0;

      if (Math.abs(uDebit - actualRow.totalDebit) > 0.01) {
        errors.push(`${actualRow.accountCode} ${actualRow.accountName}: Borç toplamı yanlış. (Girilen: ${uDebit}, Olması gereken: ${actualRow.totalDebit})`);
      }
      if (Math.abs(uCredit - actualRow.totalCredit) > 0.01) {
        errors.push(`${actualRow.accountCode} ${actualRow.accountName}: Alacak toplamı yanlış. (Girilen: ${uCredit}, Olması gereken: ${actualRow.totalCredit})`);
      }
      if (Math.abs(uDebBal - actualRow.debitBalance) > 0.01) {
        errors.push(`${actualRow.accountCode} ${actualRow.accountName}: Borç bakiyesi yanlış. (Girilen: ${uDebBal}, Olması gereken: ${actualRow.debitBalance})`);
      }
      if (Math.abs(uCredBal - actualRow.creditBalance) > 0.01) {
        errors.push(`${actualRow.accountCode} ${actualRow.accountName}: Alacak bakiyesi yanlış. (Girilen: ${uCredBal}, Olması gereken: ${actualRow.creditBalance})`);
      }
    });

    setPracticeCheckResult({
      isChecked: true,
      errors,
      isCorrect: errors.length === 0,
    });
  };

  return (
    <div className="space-y-6">
      {/* Üst Başlık ve Mod Değiştirici */}
      <div className="bg-white dark:bg-zinc-950 p-4 rounded-2xl shadow-xs border border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4 transition-colors">
        <div>
          <div className="flex items-center gap-2">
            <TableProperties className="w-5 h-5 text-black dark:text-zinc-200" />
            <h3 className="text-base font-bold text-zinc-900 dark:text-white">
              Mizan (Geçici Mizan Cetveli)
            </h3>
            {trialBalance.isBalanced ? (
              <span className="inline-flex items-center gap-1 text-xs bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-400 px-2.5 py-0.5 rounded-full font-semibold border dark:border-emerald-900/50">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Mizan Dengeli
              </span>
            ) : trialBalance.rows.length > 0 ? (
              <span className="inline-flex items-center gap-1 text-xs bg-rose-100 dark:bg-rose-950/70 text-rose-800 dark:text-rose-400 px-2.5 py-0.5 rounded-full font-semibold border dark:border-rose-900/50">
                <AlertTriangle className="w-3.5 h-3.5" />
                Dengesizlik Var
              </span>
            ) : null}
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            T-hesaplarının toplamlarını ve bakiye denkliklerini doğrulayan kontrol tablosu
          </p>
        </div>

        {/* Görünüm Seçici (Otomatik vs Kendin Doldur) */}
        <div className="flex bg-zinc-100 dark:bg-zinc-900 p-1 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setViewMode('auto')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              viewMode === 'auto'
                ? 'bg-white dark:bg-zinc-800 text-black dark:text-zinc-100 font-bold shadow-xs'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Otomatik Mizan</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('practice')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              viewMode === 'practice'
                ? 'bg-white dark:bg-zinc-800 text-black dark:text-zinc-100 font-bold shadow-xs'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Kendin Doldur (Alıştırma)</span>
          </button>
        </div>
      </div>

      {viewMode === 'practice' && (
        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-2xl p-4 text-xs text-amber-900 dark:text-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-start gap-2">
            <HelpCircle className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
            <span className="leading-relaxed">
              <strong>Alıştırma Görevi:</strong> T-Hesapları sekmesine bakarak her hesabın borç-alacak tutarlarını ve kalan bakiyesini aşağıdaki kutulara giriniz. Ardından doğruluğunu kontrol ediniz.
            </span>
          </div>
          <button
            type="button"
            onClick={handleCheckPractice}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-xs transition-colors shrink-0 cursor-pointer text-xs"
          >
            Mizanımı Kontrol Et
          </button>
        </div>
      )}

      {practiceCheckResult.isChecked && viewMode === 'practice' && (
        <div className={`p-4 rounded-2xl border text-xs ${
          practiceCheckResult.isCorrect 
            ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800/80 text-emerald-900 dark:text-emerald-200' 
            : 'bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800/80 text-rose-900 dark:text-rose-200'
        }`}>
          {practiceCheckResult.isCorrect ? (
            <div className="flex items-center gap-2 font-bold">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span>Harika! Mizan satırlarınızın ve bakiyelerinizin tamamı doğru dolduruldu.</span>
            </div>
          ) : (
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-rose-800 dark:text-rose-300">
                <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                <span>Mizanınızda tespit edilen hatalar ({practiceCheckResult.errors.length}):</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-zinc-700 dark:text-zinc-300">
                {practiceCheckResult.errors.map((err, idx) => (
                  <li key={idx}>{err}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Mizan Tablosu */}
      <div className="bg-white dark:bg-zinc-950 rounded-2xl shadow-xs border border-zinc-200 dark:border-zinc-800 overflow-hidden transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              {/* Birinci Katman Başlıklar */}
              <tr className="bg-zinc-100/90 dark:bg-black text-zinc-900 dark:text-white text-xs font-bold text-center border-b border-zinc-200 dark:border-zinc-800">
                <th colSpan={2} className="py-2.5 px-4 text-left border-r border-zinc-200 dark:border-zinc-800">
                  HESAP BİLGİSİ
                </th>
                <th colSpan={2} className="py-2.5 px-4 border-r border-zinc-200 dark:border-zinc-800 bg-zinc-200/50 dark:bg-zinc-900/60">
                  TUTARLAR (TL)
                </th>
                <th colSpan={2} className="py-2.5 px-4 bg-zinc-100 dark:bg-zinc-900">
                  BAKİYELER (KALANLAR) (TL)
                </th>
              </tr>
              {/* İkinci Katman Sütunlar */}
              <tr className="bg-zinc-50 dark:bg-zinc-900/90 text-[11px] font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider border-b border-zinc-200 dark:border-zinc-800">
                <th className="py-2 px-3 w-20 text-center border-r border-zinc-200 dark:border-zinc-800">Kod</th>
                <th className="py-2 px-4 border-r border-zinc-200 dark:border-zinc-800">Hesap Adı</th>
                <th className="py-2 px-4 w-36 text-right border-r border-zinc-200 dark:border-zinc-800">Borç</th>
                <th className="py-2 px-4 w-36 text-right border-r border-zinc-200 dark:border-zinc-800">Alacak</th>
                <th className="py-2 px-4 w-36 text-right border-r border-zinc-200 dark:border-zinc-800">Borç Bakiye</th>
                <th className="py-2 px-4 w-36 text-right">Alacak Bakiye</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800 text-xs font-mono">
              {trialBalance.rows.length > 0 ? (
                trialBalance.rows.map((row) => {
                  if (viewMode === 'practice') {
                    const user = practiceRows[row.accountCode] || { totalDebit: '', totalCredit: '', debitBalance: '', creditBalance: '' };
                    return (
                      <tr key={row.accountCode} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/40">
                        <td className="py-2.5 px-3 text-center font-bold text-zinc-800 dark:text-zinc-200 border-r border-zinc-100 dark:border-zinc-800">
                          {row.accountCode}
                        </td>
                        <td className="py-2.5 px-4 font-sans font-medium text-zinc-800 dark:text-zinc-200 border-r border-zinc-100 dark:border-zinc-800">
                          {row.accountName}
                        </td>
                        <td className="py-1 px-2 border-r border-zinc-100 dark:border-zinc-800">
                          <input
                            type="number"
                            value={user.totalDebit}
                            onChange={(e) => handlePracticeChange(row.accountCode, 'totalDebit', e.target.value)}
                            placeholder="0"
                            className="w-full text-right p-1.5 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-md font-mono text-xs text-zinc-900 dark:text-white"
                          />
                        </td>
                        <td className="py-1 px-2 border-r border-zinc-100 dark:border-zinc-800">
                          <input
                            type="number"
                            value={user.totalCredit}
                            onChange={(e) => handlePracticeChange(row.accountCode, 'totalCredit', e.target.value)}
                            placeholder="0"
                            className="w-full text-right p-1.5 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-md font-mono text-xs text-zinc-900 dark:text-white"
                          />
                        </td>
                        <td className="py-1 px-2 border-r border-zinc-100 dark:border-zinc-800">
                          <input
                            type="number"
                            value={user.debitBalance}
                            onChange={(e) => handlePracticeChange(row.accountCode, 'debitBalance', e.target.value)}
                            placeholder="0"
                            className="w-full text-right p-1.5 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-md font-mono text-xs text-zinc-900 dark:text-white"
                          />
                        </td>
                        <td className="py-1 px-2">
                          <input
                            type="number"
                            value={user.creditBalance}
                            onChange={(e) => handlePracticeChange(row.accountCode, 'creditBalance', e.target.value)}
                            placeholder="0"
                            className="w-full text-right p-1.5 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-md font-mono text-xs text-zinc-900 dark:text-white"
                          />
                        </td>
                      </tr>
                    );
                  }

                  // Normal Otomatik Görünüm
                  return (
                    <tr key={row.accountCode} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/40 transition-colors">
                      <td className="py-2.5 px-3 text-center font-bold text-zinc-900 dark:text-white border-r border-zinc-100 dark:border-zinc-800">
                        {row.accountCode}
                      </td>
                      <td className="py-2.5 px-4 font-sans font-medium text-zinc-800 dark:text-zinc-200 border-r border-zinc-100 dark:border-zinc-800">
                        {row.accountName}
                      </td>
                      <td className="py-2.5 px-4 text-right text-zinc-900 dark:text-white border-r border-zinc-100 dark:border-zinc-800">
                        {row.totalDebit > 0 ? formatCurrency(row.totalDebit) : '-'}
                      </td>
                      <td className="py-2.5 px-4 text-right text-zinc-900 dark:text-white border-r border-zinc-100 dark:border-zinc-800">
                        {row.totalCredit > 0 ? formatCurrency(row.totalCredit) : '-'}
                      </td>
                      <td className="py-2.5 px-4 text-right text-blue-900 dark:text-blue-400 font-semibold border-r border-zinc-100 dark:border-zinc-800">
                        {row.debitBalance > 0 ? formatCurrency(row.debitBalance) : '-'}
                      </td>
                      <td className="py-2.5 px-4 text-right text-amber-900 dark:text-amber-400 font-semibold">
                        {row.creditBalance > 0 ? formatCurrency(row.creditBalance) : '-'}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-zinc-400 dark:text-zinc-500 font-sans">
                    Henüz yevmiye kaydı girilmediği için mizan satırı oluşmadı.
                  </td>
                </tr>
              )}
            </tbody>

            {/* Mizan Genel Toplamlar ve Denklik Satırı */}
            <tfoot>
              <tr className="bg-zinc-100/90 dark:bg-zinc-900/90 font-bold border-t border-zinc-200 dark:border-zinc-700 text-xs">
                <td colSpan={2} className="py-3 px-4 font-sans text-zinc-900 dark:text-white border-r border-zinc-200 dark:border-zinc-700">
                  GENEL TOPLAMLAR:
                </td>
                <td className="py-3 px-4 text-right font-mono text-zinc-950 dark:text-white font-extrabold border-r border-zinc-200 dark:border-zinc-700">
                  {formatCurrency(trialBalance.totalDebit)}
                </td>
                <td className="py-3 px-4 text-right font-mono text-zinc-950 dark:text-white font-extrabold border-r border-zinc-200 dark:border-zinc-700">
                  {formatCurrency(trialBalance.totalCredit)}
                </td>
                <td className="py-3 px-4 text-right font-mono text-blue-700 dark:text-blue-300 font-extrabold border-r border-zinc-200 dark:border-zinc-700">
                  {formatCurrency(trialBalance.totalDebitBalance)}
                </td>
                <td className="py-3 px-4 text-right font-mono text-amber-700 dark:text-amber-300 font-extrabold">
                  {formatCurrency(trialBalance.totalCreditBalance)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Eşitlik Kontrol Kuralları Çubuğu */}
        <div className="bg-zinc-50/70 dark:bg-zinc-950 px-5 py-3 border-t border-zinc-200 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="text-zinc-600 dark:text-zinc-400 font-medium">1. Eşitlik (Tutarlar):</span>
              {Math.abs(trialBalance.totalDebit - trialBalance.totalCredit) < 0.01 ? (
                <span className="text-emerald-700 dark:text-emerald-400 font-bold">✓ Borç = Alacak</span>
              ) : (
                <span className="text-rose-700 dark:text-rose-400 font-bold">✗ Borç ≠ Alacak</span>
              )}
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-zinc-600 dark:text-zinc-400 font-medium">2. Eşitlik (Bakiyeler):</span>
              {Math.abs(trialBalance.totalDebitBalance - trialBalance.totalCreditBalance) < 0.01 ? (
                <span className="text-emerald-700 dark:text-emerald-400 font-bold">✓ Borç Kalan = Alacak Kalan</span>
              ) : (
                <span className="text-rose-700 dark:text-rose-400 font-bold">✗ Kalanlar Eşit Değil</span>
              )}
            </div>
          </div>

          <div className="text-zinc-500 dark:text-zinc-500 text-[11px]">
            {trialBalance.rows.length} Hesap Hareket Gördü
          </div>
        </div>
      </div>
    </div>
  );
};
