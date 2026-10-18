import React, { useState } from 'react';
import {
  useAccountingStore,
  type CustomBalanceItem,
} from '../store/useAccountingStore';
import {
  formatCurrency,
  deriveLedger,
  deriveBalanceSheet,
} from '../core/accountingEngine';
import type { JournalEntry } from '../types/accounting';
import { ACCOUNTS_MAP, ACCOUNTS_LIST } from '../core/accounts';
import {
  Landmark,
  CheckCircle2,
  AlertTriangle,
  Eye,
  Edit3,
  Plus,
  Trash2,
  Sparkles,
  HelpCircle,
} from 'lucide-react';

export const BalanceSheetView: React.FC = () => {
  const {
    getBalanceSheet,
    getCurrentScenario,
    balanceViewMode: viewMode,
    setBalanceViewMode: setViewMode,
    practiceAssetItems: userAssetItems,
    setPracticeAssetItems: setUserAssetItems,
    practiceLiabilityItems: userLiabilityItems,
    setPracticeLiabilityItems: setUserLiabilityItems,
  } = useAccountingStore();
  const userBalanceSheet = getBalanceSheet();
  const scenario = getCurrentScenario();

  const expectedJournalEntries: JournalEntry[] = scenario.transactions.map(
    (tx, idx) => ({
      id: 'exp_' + tx.id,
      transactionId: tx.id,
      entryNo: idx + 1,
      date: tx.date,
      description: tx.description,
      lines: tx.expectedEntry.lines.map((l, lIdx) => ({
        id: `exp_l_${idx}_${lIdx}`,
        accountCode: l.accountCode,
        debit: l.debit,
        credit: l.credit,
      })),
    })
  );
  const expectedBalanceSheet = deriveBalanceSheet(
    deriveLedger(expectedJournalEntries),
    scenario.establishedDate
  );

  const hasUserBalanceActivity =
    userBalanceSheet.assets.totalAssets !== 0 ||
    userBalanceSheet.liabilities.totalLiabilitiesAndEquity !== 0;

  const balanceSheet =
    hasUserBalanceActivity || viewMode === 'auto'
      ? userBalanceSheet
      : expectedBalanceSheet;

  const [practiceFeedback, setPracticeFeedback] = useState<{
    isChecked: boolean;
    isCorrect: boolean;
    errors: string[];
  }>({ isChecked: false, isCorrect: false, errors: [] });

  const userTotalAssets = userAssetItems.reduce(
    (sum, item) => sum + (Number(item.amount) || 0),
    0
  );
  const userTotalLiabilities = userLiabilityItems.reduce(
    (sum, item) => sum + (Number(item.amount) || 0),
    0
  );

  const handleAddAsset = () => {
    setUserAssetItems((prev) => [
      ...prev,
      {
        id: 'a_' + Math.random().toString(36).substring(2, 8),
        code: '',
        group: 'DONEN',
        amount: 0,
      },
    ]);
  };

  const handleRemoveAsset = (id: string) => {
    setUserAssetItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleUpdateAsset = (id: string, patch: Partial<CustomBalanceItem>) => {
    setUserAssetItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...patch } : item))
    );
  };

  const handleAddLiability = () => {
    setUserLiabilityItems((prev) => [
      ...prev,
      {
        id: 'l_' + Math.random().toString(36).substring(2, 8),
        code: '',
        group: 'KVYK',
        amount: 0,
      },
    ]);
  };

  const handleRemoveLiability = (id: string) => {
    setUserLiabilityItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleUpdateLiability = (
    id: string,
    patch: Partial<CustomBalanceItem>
  ) => {
    setUserLiabilityItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...patch } : item))
    );
  };

  const handleAutoFillSolution = () => {
    const assets: CustomBalanceItem[] = [];
    balanceSheet.assets.currentAssets.items.forEach((item, idx) => {
      assets.push({
        id: 'sol_c_' + idx,
        code: item.code,
        group: 'DONEN',
        amount: item.amount,
      });
    });
    balanceSheet.assets.nonCurrentAssets.items.forEach((item, idx) => {
      assets.push({
        id: 'sol_nc_' + idx,
        code: item.code,
        group: 'DURAN',
        amount: item.amount,
      });
    });

    const liabilities: CustomBalanceItem[] = [];
    balanceSheet.liabilities.shortTermLiabilities.items.forEach((item, idx) => {
      liabilities.push({
        id: 'sol_st_' + idx,
        code: item.code,
        group: 'KVYK',
        amount: item.amount,
      });
    });
    balanceSheet.liabilities.longTermLiabilities.items.forEach((item, idx) => {
      liabilities.push({
        id: 'sol_lt_' + idx,
        code: item.code,
        group: 'UVYK',
        amount: item.amount,
      });
    });
    balanceSheet.liabilities.equity.items.forEach((item, idx) => {
      liabilities.push({
        id: 'sol_eq_' + idx,
        code: item.code,
        group: 'OZKAYNAK',
        amount: item.amount,
      });
    });

    setUserAssetItems(
      assets.length > 0
        ? assets
        : [{ id: 'a1', code: '100', group: 'DONEN', amount: 0 }]
    );
    setUserLiabilityItems(
      liabilities.length > 0
        ? liabilities
        : [{ id: 'l1', code: '500', group: 'OZKAYNAK', amount: 0 }]
    );
  };

  const handleCheckPractice = () => {
    const errors: string[] = [];

    // Beklenen tüm bilanço kalemlerini haritala
    const expectedItemsMap = new Map<
      string,
      { name: string; amount: number; side: 'AKTIF' | 'PASIF'; group: string }
    >();

    balanceSheet.assets.currentAssets.items.forEach((i) =>
      expectedItemsMap.set(i.code, {
        name: i.name,
        amount: i.amount,
        side: 'AKTIF',
        group: 'DONEN',
      })
    );
    balanceSheet.assets.nonCurrentAssets.items.forEach((i) =>
      expectedItemsMap.set(i.code, {
        name: i.name,
        amount: i.amount,
        side: 'AKTIF',
        group: 'DURAN',
      })
    );
    balanceSheet.liabilities.shortTermLiabilities.items.forEach((i) =>
      expectedItemsMap.set(i.code, {
        name: i.name,
        amount: i.amount,
        side: 'PASIF',
        group: 'KVYK',
      })
    );
    balanceSheet.liabilities.longTermLiabilities.items.forEach((i) =>
      expectedItemsMap.set(i.code, {
        name: i.name,
        amount: i.amount,
        side: 'PASIF',
        group: 'UVYK',
      })
    );
    balanceSheet.liabilities.equity.items.forEach((i) =>
      expectedItemsMap.set(i.code, {
        name: i.name,
        amount: i.amount,
        side: 'PASIF',
        group: 'OZKAYNAK',
      })
    );

    const enteredCodes = new Set<string>();

    userAssetItems.forEach((item) => {
      if (!item.code) return;
      enteredCodes.add(item.code);
      const acc = ACCOUNTS_MAP[item.code];
      if (
        acc &&
        (acc.accountClass === 3 ||
          acc.accountClass === 4 ||
          acc.accountClass === 5)
      ) {
        errors.push(
          `Yanlış Taraf: "${item.code} ${acc.name}" bir borç/sermaye hesabıdır. Aktif (Varlıklar) tarafına yazılamaz, Pasif (Sağ) tarafında yer almalıdır.`
        );
        return;
      }

      const exp = expectedItemsMap.get(item.code);
      if (exp) {
        if (exp.amount < 0 && item.amount > 0) {
          errors.push(
            `Düzenleyici Hesap İşareti: "${item.code} ${exp.name}" sonunda (-) olan düzenleyici bir hesaptır. Aktif toplamını azaltması için tutarını eksi olarak (${formatCurrency(exp.amount)}) girmelisiniz.`
          );
        } else if (Math.abs((Number(item.amount) || 0) - exp.amount) > 0.01) {
          errors.push(
            `${item.code} ${exp.name}: Girilen bakiye (${formatCurrency(
              Number(item.amount) || 0
            )}) hatalı. Olması gereken net bakiye: ${formatCurrency(exp.amount)}.`
          );
        }
      }
    });

    userLiabilityItems.forEach((item) => {
      if (!item.code) return;
      enteredCodes.add(item.code);
      const acc = ACCOUNTS_MAP[item.code];
      if (acc && (acc.accountClass === 1 || acc.accountClass === 2)) {
        errors.push(
          `Yanlış Taraf: "${item.code} ${acc.name}" bir varlık hesabıdır. Pasif tarafına yazılamaz, Aktif (Sol) tarafında yer almalıdır.`
        );
        return;
      }

      const exp = expectedItemsMap.get(item.code);
      if (exp) {
        if (exp.amount < 0 && item.amount > 0) {
          errors.push(
            `Zarar / Düzenleyici İşareti: "${item.code} ${exp.name}" öz kaynakları azaltan (-) bir kalemdir. Tutarını eksi olarak (${formatCurrency(exp.amount)}) girmelisiniz.`
          );
        } else if (Math.abs((Number(item.amount) || 0) - exp.amount) > 0.01) {
          errors.push(
            `${item.code} ${exp.name}: Girilen bakiye (${formatCurrency(
              Number(item.amount) || 0
            )}) hatalı. Olması gereken net bakiye: ${formatCurrency(exp.amount)}.`
          );
        }
      }
    });

    expectedItemsMap.forEach((exp, code) => {
      if (!enteredCodes.has(code)) {
        errors.push(
          `Eksik Hesap: "${code} ${exp.name}" (${formatCurrency(
            exp.amount
          )}) bilançonun ${
            exp.side === 'AKTIF' ? 'Aktif (Varlıklar)' : 'Pasif (Kaynaklar)'
          } tarafına henüz eklenmemiş.`
        );
      }
    });

    const actualAssets = balanceSheet.assets.totalAssets;
    const actualLiabilities =
      balanceSheet.liabilities.totalLiabilitiesAndEquity;

    if (Math.abs(userTotalAssets - actualAssets) > 0.01) {
      errors.push(
        `Aktif Toplamı Hatalı: Girdiğiniz tutar ${formatCurrency(
          userTotalAssets
        )}, olması gereken: ${formatCurrency(actualAssets)}.`
      );
    }

    if (Math.abs(userTotalLiabilities - actualLiabilities) > 0.01) {
      errors.push(
        `Pasif Toplamı Hatalı: Girdiğiniz tutar ${formatCurrency(
          userTotalLiabilities
        )}, olması gereken: ${formatCurrency(actualLiabilities)}.`
      );
    }

    if (Math.abs(userTotalAssets - userTotalLiabilities) > 0.01) {
      errors.push(
        `Bilanço Dengeli Değil: Hazırladığınız bilançoda Aktif (${formatCurrency(
          userTotalAssets
        )}) ile Pasif (${formatCurrency(
          userTotalLiabilities
        )}) arasında ${formatCurrency(
          Math.abs(userTotalAssets - userTotalLiabilities)
        )} fark var.`
      );
    }

    setPracticeFeedback({
      isChecked: true,
      isCorrect: errors.length === 0,
      errors,
    });
  };

  return (
    <div className="space-y-6">
      {/* Üst Bilgi ve Mod Seçimi */}
      <div className="bg-surface dark:bg-[#1C1B19] p-5 sm:p-6 rounded-[2rem] shadow-[0_12px_32px_-8px_rgba(24,24,27,0.05)] border border-border-subtle dark:border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <Landmark className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-card-title font-bold text-text-primary dark:text-white">
              Bilanço ({scenario.companyName})
            </h3>
            {balanceSheet.isBalanced && balanceSheet.assets.totalAssets > 0 ? (
              <span className="inline-flex items-center gap-1 text-xs font-ledger-readout bg-secondary-container/40 text-on-secondary-container px-2.5 py-0.5 rounded-full font-semibold border border-secondary/30">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Aktif = Pasif (Bilanço Dengeli)
              </span>
            ) : balanceSheet.difference !== 0 ? (
              <span className="inline-flex items-center gap-1 text-xs font-ledger-readout bg-accent-surface text-primary px-2.5 py-0.5 rounded-full font-semibold border border-primary/30 tabular-nums">
                <AlertTriangle className="w-3.5 h-3.5" />
                Bilanço Dengesiz:{' '}
                {formatCurrency(Math.abs(balanceSheet.difference))} Fark
              </span>
            ) : null}
          </div>
          <p className="text-xs sm:text-sm font-body-editorial text-text-secondary dark:text-zinc-400 mt-1">
            {viewMode === 'auto'
              ? 'İşletmenin varlıklarını (Aktif) ve kaynaklarını (Pasif) gösteren resmi T-Bilanço'
              : 'Sınav Provası: Hesapları ve bakiyelerini Aktif/Pasif taraflarına kendiniz yerleştirin'}
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
            <span>Otomatik Bilanço</span>
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
            <span>Kendin Doldur (Sınav Provası)</span>
          </button>
        </div>
      </div>

      {/* Sınav Provası İpuçları */}
      {viewMode === 'practice' && (
        <div className="bg-surface dark:bg-[#1C1B19] border border-border-subtle dark:border-zinc-800 rounded-[2rem] p-5 text-xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <HelpCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <div>
                <strong className="block font-card-title text-sm font-bold text-text-primary dark:text-white">
                  Bilanço Çıkarma Sınav Alıştırması
                </strong>
                <span className="text-text-secondary dark:text-zinc-300 font-body-editorial leading-relaxed">
                  T-hesaplarındaki kalan bakiyelere bakarak:{' '}
                  <strong>Aktif (Sol)</strong> tarafa işletmenin varlıklarını,{' '}
                  <strong>Pasif (Sağ)</strong> tarafa ise borçlarını ve
                  sermayesini yerleştiriniz.
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleAutoFillSolution}
                className="px-3.5 py-2 bg-surface-muted dark:bg-zinc-800 border border-border-subtle dark:border-zinc-700 hover:bg-border-subtle text-text-primary dark:text-zinc-200 font-ledger-readout font-semibold rounded-full text-xs cursor-pointer flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                <span>Örnek Çözümü Yükle</span>
              </button>

              <button
                type="button"
                onClick={handleCheckPractice}
                className="px-4 py-2 bg-primary-container hover:bg-primary text-on-primary-container font-ledger-readout font-bold rounded-full shadow-xs cursor-pointer text-xs"
              >
                Bilançomu Kontrol Et
              </button>
            </div>
          </div>

          {practiceFeedback.isChecked && (
            <div
              className={`mt-3 p-4 rounded-2xl border text-xs font-ledger-readout ${
                practiceFeedback.isCorrect
                  ? 'bg-secondary-fixed/25 border-secondary/30 text-secondary'
                  : 'bg-accent-surface border-primary/30 text-primary'
              }`}
            >
              {practiceFeedback.isCorrect ? (
                <div className="flex items-center gap-2 font-bold">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>
                    Tebrikler! Bilançoyu eksiksiz, hesapları doğru taraflara
                    yerleştirerek kuruşu kuruşuna denk çıkardınız.
                  </span>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 font-bold">
                    <AlertTriangle className="w-4 h-4" />
                    <span>
                      Bilançonuzda Düzeltilmesi Gereken Noktalar (
                      {practiceFeedback.errors.length}):
                    </span>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-text-primary pl-1">
                    {practiceFeedback.errors.map((err, idx) => (
                      <li key={idx}>{err}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* 1. KENDİN DOLDUR GÖRÜNÜMÜ */}
      {viewMode === 'practice' && (
        <div className="bg-surface dark:bg-[#1C1B19] rounded-[2rem] shadow-[0_12px_32px_-8px_rgba(24,24,27,0.06)] border border-border-subtle dark:border-zinc-800 overflow-hidden transition-colors tabular-nums">
          <div className="bg-surface-muted/70 dark:bg-zinc-900 text-text-primary dark:text-white py-3.5 px-6 text-center border-b border-border-subtle dark:border-zinc-800">
            <h2 className="text-sm font-card-title font-bold tracking-wide uppercase">
              {scenario.companyName}
            </h2>
            <p className="text-xs text-text-secondary dark:text-zinc-400 mt-0.5 font-ledger-readout">
              Sınav Provası • İnteraktif Bilanço Çizimi
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border-subtle dark:divide-zinc-800">
            {/* AKTİF */}
            <div className="flex flex-col">
              <div className="bg-surface-muted/35 dark:bg-zinc-900/60 py-3 px-4 border-b border-border-subtle dark:border-zinc-800 flex items-center justify-between">
                <span className="font-ledger-readout font-bold text-xs uppercase text-secondary tracking-wider">
                  AKTİF (VARLIKLAR)
                </span>
                <button
                  type="button"
                  onClick={handleAddAsset}
                  className="px-3 py-1 bg-surface-contrast text-surface rounded-full text-xs font-ledger-readout font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Varlık Ekle</span>
                </button>
              </div>

              <div className="p-4 space-y-3 flex-1">
                {userAssetItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-2 bg-surface-muted/40 dark:bg-zinc-900 p-2 rounded-xl border border-border-subtle dark:border-zinc-800"
                  >
                    <select
                      value={item.code}
                      onChange={(e) =>
                        handleUpdateAsset(item.id, { code: e.target.value })
                      }
                      className="flex-1 p-1.5 bg-surface dark:bg-zinc-950 border border-border-subtle dark:border-zinc-700 rounded-lg text-xs font-ledger-readout text-text-primary dark:text-white cursor-pointer"
                    >
                      <option value="">Hesap Seçin...</option>
                      {ACCOUNTS_LIST.map((acc) => (
                        <option key={acc.code} value={acc.code}>
                          {acc.code} {acc.name} ({acc.nature})
                        </option>
                      ))}
                    </select>

                    <select
                      value={item.group}
                      onChange={(e) =>
                        handleUpdateAsset(item.id, {
                          group: e.target.value as 'DONEN' | 'DURAN',
                        })
                      }
                      className="w-32 p-1.5 bg-surface dark:bg-zinc-950 border border-border-subtle dark:border-zinc-700 rounded-lg text-xs font-ledger-readout text-text-secondary dark:text-zinc-300 cursor-pointer"
                    >
                      <option value="DONEN">I. Dönen Varlık</option>
                      <option value="DURAN">II. Duran Varlık</option>
                    </select>

                    <input
                      type="number"
                      value={item.amount > 0 ? item.amount : ''}
                      onChange={(e) =>
                        handleUpdateAsset(item.id, {
                          amount: parseFloat(e.target.value) || 0,
                        })
                      }
                      placeholder="Tutar (TL)"
                      className="w-28 p-1.5 text-right font-ledger-readout text-xs bg-surface dark:bg-zinc-950 border border-border-subtle dark:border-zinc-700 rounded-lg text-text-primary dark:text-white"
                    />

                    <button
                      type="button"
                      onClick={() => handleRemoveAsset(item.id)}
                      className="text-text-muted hover:text-error p-1 cursor-pointer"
                      title="Sil"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="bg-surface-contrast text-surface p-4 flex items-center justify-between font-ledger-readout font-bold text-sm">
                <span className="uppercase tracking-wider">
                  HESAPLANAN AKTİF TOPLAMI:
                </span>
                <span className="text-secondary-fixed">
                  {formatCurrency(userTotalAssets)}
                </span>
              </div>
            </div>

            {/* PASİF */}
            <div className="flex flex-col">
              <div className="bg-surface-muted/35 dark:bg-zinc-900/60 py-3 px-4 border-b border-border-subtle dark:border-zinc-800 flex items-center justify-between">
                <span className="font-ledger-readout font-bold text-xs uppercase text-primary tracking-wider">
                  PASİF (KAYNAKLAR)
                </span>
                <button
                  type="button"
                  onClick={handleAddLiability}
                  className="px-3 py-1 bg-surface-contrast text-surface rounded-full text-xs font-ledger-readout font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Kaynak Ekle</span>
                </button>
              </div>

              <div className="p-4 space-y-3 flex-1">
                {userLiabilityItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-2 bg-surface-muted/40 dark:bg-zinc-900 p-2 rounded-xl border border-border-subtle dark:border-zinc-800"
                  >
                    <select
                      value={item.code}
                      onChange={(e) =>
                        handleUpdateLiability(item.id, { code: e.target.value })
                      }
                      className="flex-1 p-1.5 bg-surface dark:bg-zinc-950 border border-border-subtle dark:border-zinc-700 rounded-lg text-xs font-ledger-readout text-text-primary dark:text-white cursor-pointer"
                    >
                      <option value="">Hesap Seçin...</option>
                      {ACCOUNTS_LIST.map((acc) => (
                        <option key={acc.code} value={acc.code}>
                          {acc.code} {acc.name} ({acc.nature})
                        </option>
                      ))}
                      <option value="590">590 Dönem Net Kârı</option>
                    </select>

                    <select
                      value={item.group}
                      onChange={(e) =>
                        handleUpdateLiability(item.id, {
                          group: e.target.value as
                            | 'KVYK'
                            | 'UVYK'
                            | 'OZKAYNAK',
                        })
                      }
                      className="w-32 p-1.5 bg-surface dark:bg-zinc-950 border border-border-subtle dark:border-zinc-700 rounded-lg text-xs font-ledger-readout text-text-secondary dark:text-zinc-300 cursor-pointer"
                    >
                      <option value="KVYK">III. Kısa Vadeli</option>
                      <option value="UVYK">IV. Uzun Vadeli</option>
                      <option value="OZKAYNAK">V. Öz Kaynak</option>
                    </select>

                    <input
                      type="number"
                      value={item.amount > 0 ? item.amount : ''}
                      onChange={(e) =>
                        handleUpdateLiability(item.id, {
                          amount: parseFloat(e.target.value) || 0,
                        })
                      }
                      placeholder="Tutar (TL)"
                      className="w-28 p-1.5 text-right font-ledger-readout text-xs bg-surface dark:bg-zinc-950 border border-border-subtle dark:border-zinc-700 rounded-lg text-text-primary dark:text-white"
                    />

                    <button
                      type="button"
                      onClick={() => handleRemoveLiability(item.id)}
                      className="text-text-muted hover:text-error p-1 cursor-pointer"
                      title="Sil"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="bg-surface-contrast text-surface p-4 flex items-center justify-between font-ledger-readout font-bold text-sm">
                <span className="uppercase tracking-wider">
                  HESAPLANAN PASİF TOPLAMI:
                </span>
                <span className="text-primary-fixed">
                  {formatCurrency(userTotalLiabilities)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. OTOMATİK BİLANÇO GÖRÜNÜMÜ */}
      {viewMode === 'auto' && (
        <div className="bg-surface dark:bg-[#1C1B19] rounded-[2rem] shadow-[0_12px_32px_-8px_rgba(24,24,27,0.06)] border border-border-subtle dark:border-zinc-800 overflow-hidden transition-colors tabular-nums">
          <div className="bg-surface-muted/70 dark:bg-zinc-900 text-text-primary dark:text-white py-4 px-6 text-center border-b border-border-subtle dark:border-zinc-800">
            <h2 className="text-base font-card-title font-bold tracking-wide uppercase">
              {scenario.companyName}
            </h2>
            <p className="text-xs text-text-secondary dark:text-zinc-400 mt-0.5 font-ledger-readout">
              Tarih: {balanceSheet.date} • Resmi Temel Bilanço (T-Cetveli)
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border-subtle dark:divide-zinc-800">
            {/* SOL: AKTİF (VARLIKLAR) */}
            <div className="flex flex-col">
              <div className="bg-surface-muted/35 dark:bg-zinc-900/60 py-3 px-4 border-b border-border-subtle dark:border-zinc-800 text-center">
                <span className="font-ledger-readout font-bold text-xs uppercase text-secondary dark:text-secondary-fixed tracking-wider">
                  AKTİF (VARLIKLAR)
                </span>
              </div>

              <div className="p-5 flex-1 space-y-6 text-xs">
                {/* I. DÖNEN VARLIKLAR */}
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-border-subtle dark:border-zinc-800 font-ledger-readout font-bold text-text-primary dark:text-white">
                    <span>{balanceSheet.assets.currentAssets.title}</span>
                    <span className="text-secondary dark:text-secondary-fixed">
                      {formatCurrency(balanceSheet.assets.currentAssets.total)}
                    </span>
                  </div>
                  <div className="mt-2.5 space-y-1.5 pl-2">
                    {balanceSheet.assets.currentAssets.items.length > 0 ? (
                      balanceSheet.assets.currentAssets.items.map((item) => (
                        <div
                          key={item.code}
                          className="flex items-center justify-between py-1 text-text-secondary dark:text-zinc-300"
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-ledger-readout font-bold text-text-primary dark:text-zinc-100">
                              {item.code}
                            </span>
                            <span className="font-body-editorial">
                              {item.name}
                            </span>
                          </div>
                          <span className="font-ledger-readout font-semibold text-text-primary dark:text-white">
                            {formatCurrency(item.amount)}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="text-text-muted italic py-1 text-[11px] font-body-editorial">
                        Dönen varlık hareketi yok
                      </div>
                    )}
                  </div>
                </div>

                {/* II. DURAN VARLIKLAR */}
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-border-subtle dark:border-zinc-800 font-ledger-readout font-bold text-text-primary dark:text-white">
                    <span>{balanceSheet.assets.nonCurrentAssets.title}</span>
                    <span className="text-secondary dark:text-secondary-fixed">
                      {formatCurrency(
                        balanceSheet.assets.nonCurrentAssets.total
                      )}
                    </span>
                  </div>
                  <div className="mt-2.5 space-y-1.5 pl-2">
                    {balanceSheet.assets.nonCurrentAssets.items.length > 0 ? (
                      balanceSheet.assets.nonCurrentAssets.items.map((item) => (
                        <div
                          key={item.code}
                          className="flex items-center justify-between py-1 text-text-secondary dark:text-zinc-300"
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-ledger-readout font-bold text-text-primary dark:text-zinc-100">
                              {item.code}
                            </span>
                            <span className="font-body-editorial">
                              {item.name}
                            </span>
                          </div>
                          <span className="font-ledger-readout font-semibold text-text-primary dark:text-white">
                            {formatCurrency(item.amount)}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="text-text-muted italic py-1 text-[11px] font-body-editorial">
                        Duran varlık hareketi yok
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-surface-contrast text-surface p-4 flex items-center justify-between font-ledger-readout font-bold text-sm">
                <span className="uppercase tracking-wider">AKTİF TOPLAMI:</span>
                <span className="text-base text-secondary-fixed">
                  {formatCurrency(balanceSheet.assets.totalAssets)}
                </span>
              </div>
            </div>

            {/* SAĞ: PASİF (KAYNAKLAR) */}
            <div className="flex flex-col">
              <div className="bg-surface-muted/35 dark:bg-zinc-900/60 py-3 px-4 border-b border-border-subtle dark:border-zinc-800 text-center">
                <span className="font-ledger-readout font-bold text-xs uppercase text-primary dark:text-[#FFB4A4] tracking-wider">
                  PASİF (KAYNAKLAR)
                </span>
              </div>

              <div className="p-5 flex-1 space-y-6 text-xs">
                {/* III. KVYK */}
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-border-subtle dark:border-zinc-800 font-ledger-readout font-bold text-text-primary dark:text-white">
                    <span>
                      {balanceSheet.liabilities.shortTermLiabilities.title}
                    </span>
                    <span className="text-primary dark:text-[#FFB4A4]">
                      {formatCurrency(
                        balanceSheet.liabilities.shortTermLiabilities.total
                      )}
                    </span>
                  </div>
                  <div className="mt-2.5 space-y-1.5 pl-2">
                    {balanceSheet.liabilities.shortTermLiabilities.items
                      .length > 0 ? (
                      balanceSheet.liabilities.shortTermLiabilities.items.map(
                        (item) => (
                          <div
                            key={item.code}
                            className="flex items-center justify-between py-1 text-text-secondary dark:text-zinc-300"
                          >
                            <div className="flex items-center gap-2">
                              <span className="font-ledger-readout font-bold text-text-primary dark:text-zinc-100">
                                {item.code}
                              </span>
                              <span className="font-body-editorial">
                                {item.name}
                              </span>
                            </div>
                            <span className="font-ledger-readout font-semibold text-text-primary dark:text-white">
                              {formatCurrency(item.amount)}
                            </span>
                          </div>
                        )
                      )
                    ) : (
                      <div className="text-text-muted italic py-1 text-[11px] font-body-editorial">
                        Kısa vadeli yabancı kaynak hareketi yok
                      </div>
                    )}
                  </div>
                </div>

                {/* IV. UVYK */}
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-border-subtle dark:border-zinc-800 font-ledger-readout font-bold text-text-primary dark:text-white">
                    <span>
                      {balanceSheet.liabilities.longTermLiabilities.title}
                    </span>
                    <span className="text-primary dark:text-[#FFB4A4]">
                      {formatCurrency(
                        balanceSheet.liabilities.longTermLiabilities.total
                      )}
                    </span>
                  </div>
                  <div className="mt-2.5 space-y-1.5 pl-2">
                    {balanceSheet.liabilities.longTermLiabilities.items.length >
                    0 ? (
                      balanceSheet.liabilities.longTermLiabilities.items.map(
                        (item) => (
                          <div
                            key={item.code}
                            className="flex items-center justify-between py-1 text-text-secondary dark:text-zinc-300"
                          >
                            <div className="flex items-center gap-2">
                              <span className="font-ledger-readout font-bold text-text-primary dark:text-zinc-100">
                                {item.code}
                              </span>
                              <span className="font-body-editorial">
                                {item.name}
                              </span>
                            </div>
                            <span className="font-ledger-readout font-semibold text-text-primary dark:text-white">
                              {formatCurrency(item.amount)}
                            </span>
                          </div>
                        )
                      )
                    ) : (
                      <div className="text-text-muted italic py-1 text-[11px] font-body-editorial">
                        Uzun vadeli yabancı kaynak hareketi yok
                      </div>
                    )}
                  </div>
                </div>

                {/* V. ÖZ KAYNAKLAR */}
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-border-subtle dark:border-zinc-800 font-ledger-readout font-bold text-text-primary dark:text-white">
                    <span>{balanceSheet.liabilities.equity.title}</span>
                    <span className="text-primary dark:text-[#FFB4A4]">
                      {formatCurrency(balanceSheet.liabilities.equity.total)}
                    </span>
                  </div>
                  <div className="mt-2.5 space-y-1.5 pl-2">
                    {balanceSheet.liabilities.equity.items.length > 0 ? (
                      balanceSheet.liabilities.equity.items.map((item) => (
                        <div
                          key={item.code}
                          className="flex items-center justify-between py-1 text-text-secondary dark:text-zinc-300"
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-ledger-readout font-bold text-text-primary dark:text-zinc-100">
                              {item.code}
                            </span>
                            <span className="font-body-editorial">
                              {item.name}
                            </span>
                          </div>
                          <span
                            className={`font-ledger-readout font-semibold ${
                              item.amount < 0
                                ? 'text-primary'
                                : 'text-text-primary dark:text-white'
                            }`}
                          >
                            {formatCurrency(item.amount)}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="text-text-muted italic py-1 text-[11px] font-body-editorial">
                        Özkaynak hareketi yok
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-surface-contrast text-surface p-4 flex items-center justify-between font-ledger-readout font-bold text-sm">
                <span className="uppercase tracking-wider">PASİF TOPLAMI:</span>
                <span className="text-base text-primary-fixed">
                  {formatCurrency(
                    balanceSheet.liabilities.totalLiabilitiesAndEquity
                  )}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-surface-muted/50 dark:bg-zinc-900 p-4 border-t border-border-subtle dark:border-zinc-800 text-xs font-ledger-readout flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="font-bold text-text-primary dark:text-white">
                Muhasebe Temel Eşitliği:
              </span>
              <span className="bg-surface dark:bg-zinc-800 px-3 py-1 border border-border-subtle dark:border-zinc-700 rounded-full text-text-primary dark:text-zinc-200 font-semibold">
                Varlıklar = Kaynaklar (Aktif = Pasif)
              </span>
            </div>

            <div className="flex items-center gap-2">
              {balanceSheet.isBalanced &&
              balanceSheet.assets.totalAssets > 0 ? (
                <span className="text-secondary dark:text-secondary-fixed font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  Bilanço Denkliği Sağlandı
                </span>
              ) : (
                <span className="text-primary font-bold flex items-center gap-1">
                  <AlertTriangle className="w-4 h-4" />
                  Fark: {formatCurrency(Math.abs(balanceSheet.difference))}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
