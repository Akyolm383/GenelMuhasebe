import React, { useState } from 'react';
import { useAccountingStore } from '../store/useAccountingStore';
import { formatCurrency } from '../core/accountingEngine';
import {
  TableProperties,
  CheckCircle2,
  AlertTriangle,
  Eye,
  Edit3,
  HelpCircle,
} from 'lucide-react';

export const TrialBalanceView: React.FC = () => {
  const { getTrialBalance } = useAccountingStore();
  const trialBalance = getTrialBalance();

  const [viewMode, setViewMode] = useState<'auto' | 'practice'>('auto');

  const [practiceRows, setPracticeRows] = useState<
    Record<
      string,
      {
        totalDebit: string;
        totalCredit: string;
        debitBalance: string;
        creditBalance: string;
      }
    >
  >({});

  const [practiceCheckResult, setPracticeCheckResult] = useState<{
    isChecked: boolean;
    errors: string[];
    isCorrect: boolean;
  }>({ isChecked: false, errors: [], isCorrect: false });

  const handlePracticeChange = (
    code: string,
    field: 'totalDebit' | 'totalCredit' | 'debitBalance' | 'creditBalance',
    val: string
  ) => {
    setPracticeRows((prev) => ({
      ...prev,
      [code]: {
        totalDebit: prev[code]?.totalDebit || '',
        totalCredit: prev[code]?.totalCredit || '',
        debitBalance: prev[code]?.debitBalance || '',
        creditBalance: prev[code]?.creditBalance || '',
        [field]: val,
      },
    }));
  };

  const handleCheckPractice = () => {
    const errors: string[] = [];

    trialBalance.rows.forEach((actualRow) => {
      const user = practiceRows[actualRow.accountCode] || {
        totalDebit: '0',
        totalCredit: '0',
        debitBalance: '0',
        creditBalance: '0',
      };
      const uDebit = parseFloat(user.totalDebit) || 0;
      const uCredit = parseFloat(user.totalCredit) || 0;
      const uDebBal = parseFloat(user.debitBalance) || 0;
      const uCredBal = parseFloat(user.creditBalance) || 0;

      if (Math.abs(uDebit - actualRow.totalDebit) > 0.01) {
        errors.push(
          `${actualRow.accountCode} ${actualRow.accountName}: Borç toplamı yanlış. (Girilen: ${uDebit}, Olması gereken: ${actualRow.totalDebit})`
        );
      }
      if (Math.abs(uCredit - actualRow.totalCredit) > 0.01) {
        errors.push(
          `${actualRow.accountCode} ${actualRow.accountName}: Alacak toplamı yanlış. (Girilen: ${uCredit}, Olması gereken: ${actualRow.totalCredit})`
        );
      }
      if (Math.abs(uDebBal - actualRow.debitBalance) > 0.01) {
        errors.push(
          `${actualRow.accountCode} ${actualRow.accountName}: Borç bakiyesi yanlış. (Girilen: ${uDebBal}, Olması gereken: ${actualRow.debitBalance})`
        );
      }
      if (Math.abs(uCredBal - actualRow.creditBalance) > 0.01) {
        errors.push(
          `${actualRow.accountCode} ${actualRow.accountName}: Alacak bakiyesi yanlış. (Girilen: ${uCredBal}, Olması gereken: ${actualRow.creditBalance})`
        );
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
      <div className="bg-surface dark:bg-[#1C1B19] p-5 sm:p-6 rounded-[2rem] shadow-[0_12px_32px_-8px_rgba(24,24,27,0.05)] border border-border-subtle dark:border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <TableProperties className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-card-title font-bold text-text-primary dark:text-white">
              Mizan (Geçici Mizan Cetveli)
            </h3>
            {trialBalance.isBalanced ? (
              <span className="inline-flex items-center gap-1 text-xs font-ledger-readout bg-secondary-container/40 text-on-secondary-container px-2.5 py-0.5 rounded-full font-semibold border border-secondary/30">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Mizan Dengeli
              </span>
            ) : trialBalance.rows.length > 0 ? (
              <span className="inline-flex items-center gap-1 text-xs font-ledger-readout bg-accent-surface text-primary px-2.5 py-0.5 rounded-full font-semibold border border-primary/30">
                <AlertTriangle className="w-3.5 h-3.5" />
                Dengesizlik Var
              </span>
            ) : null}
          </div>
          <p className="text-xs sm:text-sm font-body-editorial text-text-secondary dark:text-zinc-400 mt-1">
            T-hesaplarının toplamlarını ve bakiye denkliklerini doğrulayan resmi
            kontrol cetveli
          </p>
        </div>

        <div className="flex bg-surface-muted dark:bg-zinc-900 p-1 rounded-full border border-border-subtle dark:border-zinc-800 text-xs font-ledger-readout font-semibold">
          <button
            type="button"
            onClick={() => setViewMode('auto')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
              viewMode === 'auto'
                ? 'bg-surface dark:bg-zinc-800 text-text-primary dark:text-white font-bold shadow-xs'
                : 'text-text-secondary dark:text-zinc-400 hover:text-text-primary'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Otomatik Mizan</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('practice')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
              viewMode === 'practice'
                ? 'bg-surface dark:bg-zinc-800 text-text-primary dark:text-white font-bold shadow-xs'
                : 'text-text-secondary dark:text-zinc-400 hover:text-text-primary'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Kendin Doldur (Alıştırma)</span>
          </button>
        </div>
      </div>

      {viewMode === 'practice' && (
        <div className="bg-surface dark:bg-[#1C1B19] border border-border-subtle dark:border-zinc-800 rounded-[2rem] p-5 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <HelpCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <span className="leading-relaxed font-body-editorial text-text-secondary dark:text-zinc-300">
              <strong className="text-text-primary dark:text-white">
                Alıştırma Görevi:
              </strong>{' '}
              T-Hesapları sekmesine bakarak her hesabın borç-alacak tutarlarını
              ve kalan bakiyesini aşağıdaki kutulara giriniz.
            </span>
          </div>
          <button
            type="button"
            onClick={handleCheckPractice}
            className="px-4 py-2 bg-primary-container hover:bg-primary text-on-primary-container font-ledger-readout font-bold rounded-full shadow-xs transition-colors shrink-0 cursor-pointer text-xs"
          >
            Mizanımı Kontrol Et
          </button>
        </div>
      )}

      {practiceCheckResult.isChecked && viewMode === 'practice' && (
        <div
          className={`p-4 rounded-2xl border text-xs font-ledger-readout ${
            practiceCheckResult.isCorrect
              ? 'bg-secondary-fixed/25 border-secondary/30 text-secondary'
              : 'bg-accent-surface border-primary/30 text-primary'
          }`}
        >
          {practiceCheckResult.isCorrect ? (
            <div className="flex items-center gap-2 font-bold">
              <CheckCircle2 className="w-5 h-5" />
              <span>
                Harika! Mizan satırlarınızın ve bakiyelerinizin tamamı doğru
                dolduruldu.
              </span>
            </div>
          ) : (
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 font-bold">
                <AlertTriangle className="w-4 h-4" />
                <span>
                  Mizanınızda tespit edilen hatalar (
                  {practiceCheckResult.errors.length}):
                </span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-text-primary">
                {practiceCheckResult.errors.map((err, idx) => (
                  <li key={idx}>{err}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Mizan Tablosu */}
      <div className="bg-surface dark:bg-[#1C1B19] rounded-[2rem] shadow-[0_12px_32px_-8px_rgba(24,24,27,0.06)] border border-border-subtle dark:border-zinc-800 overflow-hidden transition-colors tabular-nums">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-muted/70 dark:bg-zinc-900 text-text-primary dark:text-white text-xs font-ledger-readout font-bold text-center border-b border-border-subtle dark:border-zinc-800">
                <th
                  colSpan={2}
                  className="py-3 px-4 text-left border-r border-border-subtle dark:border-zinc-800"
                >
                  TDHP HESAP BİLGİSİ
                </th>
                <th
                  colSpan={2}
                  className="py-3 px-4 border-r border-border-subtle dark:border-zinc-800"
                >
                  TUTARLAR TOPLAMI (TL)
                </th>
                <th colSpan={2} className="py-3 px-4">
                  BAKİYELER (KALANLAR) (TL)
                </th>
              </tr>
              <tr className="bg-surface-muted/35 dark:bg-zinc-900/60 text-[11px] font-ledger-readout font-bold text-text-secondary dark:text-zinc-400 uppercase tracking-wider border-b border-border-subtle dark:border-zinc-800">
                <th className="py-2.5 px-3 w-20 text-center border-r border-border-subtle dark:border-zinc-800">
                  Kod
                </th>
                <th className="py-2.5 px-4 border-r border-border-subtle dark:border-zinc-800">
                  Hesap Adı
                </th>
                <th className="py-2.5 px-4 w-36 text-right border-r border-border-subtle dark:border-zinc-800">
                  Borç
                </th>
                <th className="py-2.5 px-4 w-36 text-right border-r border-border-subtle dark:border-zinc-800">
                  Alacak
                </th>
                <th className="py-2.5 px-4 w-36 text-right border-r border-border-subtle dark:border-zinc-800">
                  Borç Bakiye
                </th>
                <th className="py-2.5 px-4 w-36 text-right">Alacak Bakiye</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle dark:divide-zinc-800 text-xs font-ledger-readout">
              {trialBalance.rows.length > 0 ? (
                trialBalance.rows.map((row) => {
                  if (viewMode === 'practice') {
                    const user = practiceRows[row.accountCode] || {
                      totalDebit: '',
                      totalCredit: '',
                      debitBalance: '',
                      creditBalance: '',
                    };
                    return (
                      <tr
                        key={row.accountCode}
                        className="hover:bg-surface-muted/30 dark:hover:bg-zinc-900/40"
                      >
                        <td className="py-2.5 px-3 text-center font-bold text-text-primary dark:text-zinc-200 border-r border-border-subtle dark:border-zinc-800">
                          {row.accountCode}
                        </td>
                        <td className="py-2.5 px-4 font-body-editorial font-medium text-text-primary dark:text-zinc-200 border-r border-border-subtle dark:border-zinc-800">
                          {row.accountName}
                        </td>
                        <td className="py-1.5 px-2 border-r border-border-subtle dark:border-zinc-800">
                          <input
                            type="number"
                            value={user.totalDebit}
                            onChange={(e) =>
                              handlePracticeChange(
                                row.accountCode,
                                'totalDebit',
                                e.target.value
                              )
                            }
                            placeholder="0"
                            className="w-full text-right p-1.5 bg-surface-muted/40 dark:bg-zinc-900 border border-border-subtle dark:border-zinc-800 rounded-md font-ledger-readout text-xs text-text-primary dark:text-white"
                          />
                        </td>
                        <td className="py-1.5 px-2 border-r border-border-subtle dark:border-zinc-800">
                          <input
                            type="number"
                            value={user.totalCredit}
                            onChange={(e) =>
                              handlePracticeChange(
                                row.accountCode,
                                'totalCredit',
                                e.target.value
                              )
                            }
                            placeholder="0"
                            className="w-full text-right p-1.5 bg-surface-muted/40 dark:bg-zinc-900 border border-border-subtle dark:border-zinc-800 rounded-md font-ledger-readout text-xs text-text-primary dark:text-white"
                          />
                        </td>
                        <td className="py-1.5 px-2 border-r border-border-subtle dark:border-zinc-800">
                          <input
                            type="number"
                            value={user.debitBalance}
                            onChange={(e) =>
                              handlePracticeChange(
                                row.accountCode,
                                'debitBalance',
                                e.target.value
                              )
                            }
                            placeholder="0"
                            className="w-full text-right p-1.5 bg-surface-muted/40 dark:bg-zinc-900 border border-border-subtle dark:border-zinc-800 rounded-md font-ledger-readout text-xs text-text-primary dark:text-white"
                          />
                        </td>
                        <td className="py-1.5 px-2">
                          <input
                            type="number"
                            value={user.creditBalance}
                            onChange={(e) =>
                              handlePracticeChange(
                                row.accountCode,
                                'creditBalance',
                                e.target.value
                              )
                            }
                            placeholder="0"
                            className="w-full text-right p-1.5 bg-surface-muted/40 dark:bg-zinc-900 border border-border-subtle dark:border-zinc-800 rounded-md font-ledger-readout text-xs text-text-primary dark:text-white"
                          />
                        </td>
                      </tr>
                    );
                  }

                  return (
                    <tr
                      key={row.accountCode}
                      className="hover:bg-surface-muted/25 dark:hover:bg-zinc-900/40 transition-colors"
                    >
                      <td className="py-3 px-3 text-center font-bold text-text-primary dark:text-white border-r border-border-subtle dark:border-zinc-800">
                        {row.accountCode}
                      </td>
                      <td className="py-3 px-4 font-body-editorial font-medium text-text-primary dark:text-zinc-200 border-r border-border-subtle dark:border-zinc-800">
                        {row.accountName}
                      </td>
                      <td className="py-3 px-4 text-right text-text-primary dark:text-white border-r border-border-subtle dark:border-zinc-800">
                        {row.totalDebit > 0
                          ? formatCurrency(row.totalDebit)
                          : '—'}
                      </td>
                      <td className="py-3 px-4 text-right text-text-primary dark:text-white border-r border-border-subtle dark:border-zinc-800">
                        {row.totalCredit > 0
                          ? formatCurrency(row.totalCredit)
                          : '—'}
                      </td>
                      <td className="py-3 px-4 text-right text-secondary dark:text-secondary-fixed font-semibold border-r border-border-subtle dark:border-zinc-800">
                        {row.debitBalance > 0
                          ? formatCurrency(row.debitBalance)
                          : '—'}
                      </td>
                      <td className="py-3 px-4 text-right text-primary dark:text-[#FFB4A4] font-semibold">
                        {row.creditBalance > 0
                          ? formatCurrency(row.creditBalance)
                          : '—'}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="py-10 text-center text-text-muted font-body-editorial"
                  >
                    Henüz yevmiye kaydı girilmediği için mizan satırı oluşmadı.
                  </td>
                </tr>
              )}
            </tbody>

            <tfoot>
              <tr className="bg-surface-contrast text-surface font-ledger-readout font-bold border-t border-border-subtle text-xs">
                <td
                  colSpan={2}
                  className="py-3.5 px-4 border-r border-white/15 uppercase tracking-wider"
                >
                  GENEL MİZAN TOPLAMLARI:
                </td>
                <td className="py-3.5 px-4 text-right border-r border-white/15">
                  {formatCurrency(trialBalance.totalDebit)}
                </td>
                <td className="py-3.5 px-4 text-right border-r border-white/15">
                  {formatCurrency(trialBalance.totalCredit)}
                </td>
                <td className="py-3.5 px-4 text-right text-secondary-fixed border-r border-white/15">
                  {formatCurrency(trialBalance.totalDebitBalance)}
                </td>
                <td className="py-3.5 px-4 text-right text-primary-fixed">
                  {formatCurrency(trialBalance.totalCreditBalance)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="bg-surface-muted/50 dark:bg-zinc-900 px-6 py-3.5 border-t border-border-subtle dark:border-zinc-800 flex flex-wrap items-center justify-between gap-4 text-xs font-ledger-readout">
          <div className="flex flex-wrap items-center gap-5">
            <div className="flex items-center gap-1.5">
              <span className="text-text-secondary dark:text-zinc-400">
                1. Eşitlik (Tutarlar):
              </span>
              {Math.abs(trialBalance.totalDebit - trialBalance.totalCredit) <
              0.01 ? (
                <span className="text-secondary dark:text-secondary-fixed font-bold">
                  ✓ Borç = Alacak
                </span>
              ) : (
                <span className="text-primary font-bold">✗ Borç ≠ Alacak</span>
              )}
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-text-secondary dark:text-zinc-400">
                2. Eşitlik (Bakiyeler):
              </span>
              {Math.abs(
                trialBalance.totalDebitBalance - trialBalance.totalCreditBalance
              ) < 0.01 ? (
                <span className="text-secondary dark:text-secondary-fixed font-bold">
                  ✓ Borç Kalan = Alacak Kalan
                </span>
              ) : (
                <span className="text-primary font-bold">
                  ✗ Kalanlar Eşit Değil
                </span>
              )}
            </div>
          </div>

          <div className="text-text-muted text-[11px]">
            {trialBalance.rows.length} TDHP Hesabı Hareket Gördü
          </div>
        </div>
      </div>
    </div>
  );
};
