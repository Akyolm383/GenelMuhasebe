import React, { useState } from 'react';
import { useAccountingStore } from '../store/useAccountingStore';
import { formatCurrency } from '../core/accountingEngine';
import { ACCOUNTS_MAP, ACCOUNTS_LIST } from '../core/accounts';
import { Landmark, CheckCircle2, AlertTriangle, Eye, Edit3, Plus, Trash2, Sparkles, HelpCircle } from 'lucide-react';

interface CustomBalanceItem {
  id: string;
  code: string;
  group: 'DONEN' | 'DURAN' | 'KVYK' | 'UVYK' | 'OZKAYNAK';
  amount: number;
}

export const BalanceSheetView: React.FC = () => {
  const { getBalanceSheet, getCurrentScenario } = useAccountingStore();
  const balanceSheet = getBalanceSheet();
  const scenario = getCurrentScenario();

  const [viewMode, setViewMode] = useState<'auto' | 'practice'>('auto');

  // Öğrencinin interaktif olarak doldurduğu Aktif ve Pasif kalemleri:
  const [userAssetItems, setUserAssetItems] = useState<CustomBalanceItem[]>([
    { id: 'a1', code: '100', group: 'DONEN', amount: 0 },
    { id: 'a2', code: '', group: 'DONEN', amount: 0 },
  ]);

  const [userLiabilityItems, setUserLiabilityItems] = useState<CustomBalanceItem[]>([
    { id: 'l1', code: '500', group: 'OZKAYNAK', amount: 0 },
    { id: 'l2', code: '', group: 'KVYK', amount: 0 },
  ]);

  const [practiceFeedback, setPracticeFeedback] = useState<{
    isChecked: boolean;
    isCorrect: boolean;
    errors: string[];
  }>({ isChecked: false, isCorrect: false, errors: [] });

  // Aktif ve Pasif hesaplama
  const userTotalAssets = userAssetItems.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  const userTotalLiabilities = userLiabilityItems.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

  const handleAddAsset = () => {
    setUserAssetItems(prev => [
      ...prev,
      { id: 'a_' + Math.random().toString(36).substring(2, 8), code: '', group: 'DONEN', amount: 0 }
    ]);
  };

  const handleRemoveAsset = (id: string) => {
    setUserAssetItems(prev => prev.filter(item => item.id !== id));
  };

  const handleUpdateAsset = (id: string, patch: Partial<CustomBalanceItem>) => {
    setUserAssetItems(prev => prev.map(item => item.id === id ? { ...item, ...patch } : item));
  };

  const handleAddLiability = () => {
    setUserLiabilityItems(prev => [
      ...prev,
      { id: 'l_' + Math.random().toString(36).substring(2, 8), code: '', group: 'KVYK', amount: 0 }
    ]);
  };

  const handleRemoveLiability = (id: string) => {
    setUserLiabilityItems(prev => prev.filter(item => item.id !== id));
  };

  const handleUpdateLiability = (id: string, patch: Partial<CustomBalanceItem>) => {
    setUserLiabilityItems(prev => prev.map(item => item.id === id ? { ...item, ...patch } : item));
  };

  // Doğru çözümü öğrenci için otomatik yükleme
  const handleAutoFillSolution = () => {
    const assets: CustomBalanceItem[] = [];
    balanceSheet.assets.currentAssets.items.forEach((item, idx) => {
      assets.push({ id: 'sol_c_' + idx, code: item.code, group: 'DONEN', amount: item.amount });
    });
    balanceSheet.assets.nonCurrentAssets.items.forEach((item, idx) => {
      assets.push({ id: 'sol_nc_' + idx, code: item.code, group: 'DURAN', amount: item.amount });
    });

    const liabilities: CustomBalanceItem[] = [];
    balanceSheet.liabilities.shortTermLiabilities.items.forEach((item, idx) => {
      liabilities.push({ id: 'sol_st_' + idx, code: item.code, group: 'KVYK', amount: item.amount });
    });
    balanceSheet.liabilities.longTermLiabilities.items.forEach((item, idx) => {
      liabilities.push({ id: 'sol_lt_' + idx, code: item.code, group: 'UVYK', amount: item.amount });
    });
    balanceSheet.liabilities.equity.items.forEach((item, idx) => {
      liabilities.push({ id: 'sol_eq_' + idx, code: item.code, group: 'OZKAYNAK', amount: item.amount });
    });

    setUserAssetItems(assets.length > 0 ? assets : [{ id: 'a1', code: '100', group: 'DONEN', amount: 0 }]);
    setUserLiabilityItems(liabilities.length > 0 ? liabilities : [{ id: 'l1', code: '500', group: 'OZKAYNAK', amount: 0 }]);
  };

  // Bilançoyu denetleme
  const handleCheckPractice = () => {
    const errors: string[] = [];

    // 1. Taraf kontrolleri (Aktifte pasif hesap var mı?)
    userAssetItems.forEach((item) => {
      if (!item.code) return;
      const acc = ACCOUNTS_MAP[item.code];
      if (acc && (acc.accountClass === 3 || acc.accountClass === 4 || acc.accountClass === 5)) {
        errors.push(`Yanlış Taraf: "${item.code} ${acc.name}" bir borç/kaynak hesabıdır. Aktif (Varlıklar) tarafına yazılamaz, Pasif tarafında yer almalıdır.`);
      }
    });

    // 2. Pasifte aktif hesap var mı?
    userLiabilityItems.forEach((item) => {
      if (!item.code) return;
      const acc = ACCOUNTS_MAP[item.code];
      if (acc && (acc.accountClass === 1 || acc.accountClass === 2)) {
        errors.push(`Yanlış Taraf: "${item.code} ${acc.name}" bir varlık hesabıdır. Pasif tarafına yazılamaz, Aktif (Varlıklar) tarafında yer almalıdır.`);
      }
    });

    // 3. Toplam denklik kontrolü
    const actualAssets = balanceSheet.assets.totalAssets;
    const actualLiabilities = balanceSheet.liabilities.totalLiabilitiesAndEquity;

    if (Math.abs(userTotalAssets - actualAssets) > 0.01) {
      errors.push(`Aktif Toplamı Hatalı: Girdiğiniz tutar ${formatCurrency(userTotalAssets)}, olması gereken: ${formatCurrency(actualAssets)}.`);
    }

    if (Math.abs(userTotalLiabilities - actualLiabilities) > 0.01) {
      errors.push(`Pasif Toplamı Hatalı: Girdiğiniz tutar ${formatCurrency(userTotalLiabilities)}, olması gereken: ${formatCurrency(actualLiabilities)}.`);
    }

    if (Math.abs(userTotalAssets - userTotalLiabilities) > 0.01) {
      errors.push(`Bilanço Dengeli Değil: Hazırladığınız bilançoda Aktif (${formatCurrency(userTotalAssets)}) ile Pasif (${formatCurrency(userTotalLiabilities)}) arasında ${formatCurrency(Math.abs(userTotalAssets - userTotalLiabilities))} fark var.`);
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
      <div className="bg-white dark:bg-zinc-950 p-4 rounded-2xl shadow-xs border border-slate-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4 transition-colors">
        <div>
          <div className="flex items-center gap-2">
            <Landmark className="w-5 h-5 text-indigo-600 dark:text-zinc-200" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Bilanço ({scenario.companyName})
            </h3>
            {balanceSheet.isBalanced && balanceSheet.assets.totalAssets > 0 ? (
              <span className="inline-flex items-center gap-1 text-xs bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-400 px-2.5 py-0.5 rounded-full font-semibold border dark:border-emerald-900/50">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Aktif = Pasif (Bilanço Dengeli)
              </span>
            ) : balanceSheet.difference !== 0 ? (
              <span className="inline-flex items-center gap-1 text-xs bg-rose-100 dark:bg-rose-950/70 text-rose-800 dark:text-rose-400 px-2.5 py-0.5 rounded-full font-semibold border dark:border-rose-900/50">
                <AlertTriangle className="w-3.5 h-3.5" />
                Bilanço Dengesiz: {formatCurrency(Math.abs(balanceSheet.difference))} Fark
              </span>
            ) : null}
          </div>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
            {viewMode === 'auto'
              ? 'İşletmenin belirli bir tarihteki varlıklarını ve kaynaklarını gösteren resmi T-Bilanço'
              : 'Sınav Provası: Hesapları ve bakiyelerini Aktif/Pasif taraflarına kendiniz yerleştirin'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-slate-100 dark:bg-zinc-900 p-1 rounded-xl border border-slate-200 dark:border-zinc-800 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setViewMode('auto')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === 'auto'
                  ? 'bg-white dark:bg-zinc-800 text-indigo-700 dark:text-zinc-100 shadow-xs'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Otomatik Bilanço</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('practice')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === 'practice'
                  ? 'bg-white dark:bg-zinc-800 text-indigo-700 dark:text-zinc-100 shadow-xs'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Kendin Doldur (Sınav Provası)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sınav Provası İpuçları ve Aksiyon Çubuğu */}
      {viewMode === 'practice' && (
        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-2xl p-4 text-xs text-amber-950 dark:text-amber-200 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <HelpCircle className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold text-amber-900 dark:text-amber-200">
                  Bilanço Çıkarma Sınav Alıştırması:
                </strong>
                <span className="text-slate-700 dark:text-zinc-300 leading-relaxed">
                  T-hesaplarındaki kalan bakiyelere bakarak: <strong>Aktif (Sol)</strong> tarafa işletmenin varlıklarını (Kasa, Banka, Mallar...),
                  <strong>Pasif (Sağ)</strong> tarafa ise borçlarını ve sermayesini yerleştiriniz. Son olarak denetleyin!
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleAutoFillSolution}
                className="px-3 py-1.5 bg-white dark:bg-zinc-900 border border-amber-300 dark:border-zinc-700 hover:bg-amber-100 dark:hover:bg-zinc-800 text-amber-900 dark:text-zinc-200 font-semibold rounded-lg text-xs cursor-pointer flex items-center gap-1"
                title="Doğru bilançoyu incelemek için otomatik doldur"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>Örnek Çözümü Yükle</span>
              </button>

              <button
                type="button"
                onClick={handleCheckPractice}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-xs cursor-pointer text-xs"
              >
                Bilançomu Kontrol Et
              </button>
            </div>
          </div>

          {practiceFeedback.isChecked && (
            <div className={`mt-3 p-3.5 rounded-xl border text-xs ${
              practiceFeedback.isCorrect 
                ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800/80 text-emerald-950 dark:text-emerald-200' 
                : 'bg-rose-50 dark:bg-rose-950/60 border-rose-300 dark:border-rose-800/80 text-rose-950 dark:text-rose-200'
            }`}>
              {practiceFeedback.isCorrect ? (
                <div className="flex items-center gap-2 font-bold text-emerald-900 dark:text-emerald-200">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <span>Tebrikler! Bilançoyu eksiksiz, hesapları doğru taraflara yerleştirerek kuruşu kuruşuna denk çıkardınız.</span>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 font-bold text-rose-900 dark:text-rose-200">
                    <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                    <span>Bilançonuzda Düzeltilmesi Gereken Noktalar ({practiceFeedback.errors.length}):</span>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-slate-800 dark:text-zinc-300 pl-1">
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

      {/* ============================================================== */}
      {/* 1. KENDİN DOLDUR (İNTERAKTİF BİLANÇO PROVASI) GÖRÜNÜMÜ */}
      {/* ============================================================== */}
      {viewMode === 'practice' && (
        <div className="bg-white dark:bg-zinc-950 rounded-2xl shadow-xs border border-slate-300 dark:border-zinc-800 overflow-hidden transition-colors">
          <div className="bg-slate-900 dark:bg-black text-white py-3 px-6 text-center border-b border-slate-700 dark:border-zinc-800">
            <h2 className="text-sm font-bold tracking-wide uppercase">
              {scenario.companyName}
            </h2>
            <p className="text-xs text-slate-400 dark:text-zinc-500 mt-0.5 font-mono">
              Sınav Provası • İnteraktif Bilanço Çizimi
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x-2 divide-slate-400 dark:divide-zinc-700">
            {/* AKTİF (SOL TARAF) */}
            <div className="flex flex-col">
              <div className="bg-blue-50 dark:bg-blue-950/40 py-2.5 px-4 border-b border-slate-300 dark:border-zinc-700 flex items-center justify-between">
                <span className="font-bold text-sm text-blue-900 dark:text-blue-300 tracking-wider">
                  AKTİF (VARLIKLAR)
                </span>
                <button
                  type="button"
                  onClick={handleAddAsset}
                  className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Varlık Ekle</span>
                </button>
              </div>

              <div className="p-4 space-y-3 flex-1 bg-slate-50/30 dark:bg-black/30">
                {userAssetItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-2 bg-slate-50 dark:bg-zinc-900 p-2 rounded-xl border border-slate-200 dark:border-zinc-800">
                    <select
                      value={item.code}
                      onChange={(e) => handleUpdateAsset(item.id, { code: e.target.value })}
                      className="flex-1 p-1.5 bg-white dark:bg-zinc-950 border border-slate-300 dark:border-zinc-700 rounded-lg text-xs font-medium text-slate-900 dark:text-white cursor-pointer"
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
                      onChange={(e) => handleUpdateAsset(item.id, { group: e.target.value as 'DONEN' | 'DURAN' })}
                      className="w-32 p-1.5 bg-white dark:bg-zinc-950 border border-slate-300 dark:border-zinc-700 rounded-lg text-xs text-slate-700 dark:text-zinc-300 cursor-pointer"
                    >
                      <option value="DONEN">I. Dönen Varlık</option>
                      <option value="DURAN">II. Duran Varlık</option>
                    </select>

                    <input
                      type="number"
                      value={item.amount > 0 ? item.amount : ''}
                      onChange={(e) => handleUpdateAsset(item.id, { amount: parseFloat(e.target.value) || 0 })}
                      placeholder="Tutar (TL)"
                      className="w-28 p-1.5 text-right font-mono text-xs bg-white dark:bg-zinc-950 border border-slate-300 dark:border-zinc-700 rounded-lg text-slate-900 dark:text-white"
                    />

                    <button
                      type="button"
                      onClick={() => handleRemoveAsset(item.id)}
                      className="text-slate-400 hover:text-rose-600 dark:text-zinc-500 dark:hover:text-rose-400 p-1 cursor-pointer"
                      title="Sil"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Aktif Toplamı */}
              <div className="bg-slate-100 dark:bg-zinc-900/90 p-3.5 border-t-2 border-b-4 border-double border-slate-700 dark:border-zinc-700 flex items-center justify-between font-bold text-sm text-slate-900 dark:text-white">
                <span className="uppercase tracking-wider">HESAPLANAN AKTİF TOPLAMI:</span>
                <span className="font-mono text-base text-blue-950 dark:text-blue-300 font-black">
                  {formatCurrency(userTotalAssets)}
                </span>
              </div>
            </div>

            {/* PASİF (SAĞ TARAF) */}
            <div className="flex flex-col">
              <div className="bg-amber-50 dark:bg-amber-950/40 py-2.5 px-4 border-b border-slate-300 dark:border-zinc-700 flex items-center justify-between">
                <span className="font-bold text-sm text-amber-900 dark:text-amber-300 tracking-wider">
                  PASİF (KAYNAKLAR)
                </span>
                <button
                  type="button"
                  onClick={handleAddLiability}
                  className="px-2.5 py-1 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Kaynak Ekle</span>
                </button>
              </div>

              <div className="p-4 space-y-3 flex-1 bg-slate-50/30 dark:bg-black/30">
                {userLiabilityItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-2 bg-slate-50 dark:bg-zinc-900 p-2 rounded-xl border border-slate-200 dark:border-zinc-800">
                    <select
                      value={item.code}
                      onChange={(e) => handleUpdateLiability(item.id, { code: e.target.value })}
                      className="flex-1 p-1.5 bg-white dark:bg-zinc-950 border border-slate-300 dark:border-zinc-700 rounded-lg text-xs font-medium text-slate-900 dark:text-white cursor-pointer"
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
                      onChange={(e) => handleUpdateLiability(item.id, { group: e.target.value as 'KVYK' | 'UVYK' | 'OZKAYNAK' })}
                      className="w-32 p-1.5 bg-white dark:bg-zinc-950 border border-slate-300 dark:border-zinc-700 rounded-lg text-xs text-slate-700 dark:text-zinc-300 cursor-pointer"
                    >
                      <option value="KVYK">III. Kısa Vadeli</option>
                      <option value="UVYK">IV. Uzun Vadeli</option>
                      <option value="OZKAYNAK">V. Öz Kaynak</option>
                    </select>

                    <input
                      type="number"
                      value={item.amount > 0 ? item.amount : ''}
                      onChange={(e) => handleUpdateLiability(item.id, { amount: parseFloat(e.target.value) || 0 })}
                      placeholder="Tutar (TL)"
                      className="w-28 p-1.5 text-right font-mono text-xs bg-white dark:bg-zinc-950 border border-slate-300 dark:border-zinc-700 rounded-lg text-slate-900 dark:text-white"
                    />

                    <button
                      type="button"
                      onClick={() => handleRemoveLiability(item.id)}
                      className="text-slate-400 hover:text-rose-600 dark:text-zinc-500 dark:hover:text-rose-400 p-1 cursor-pointer"
                      title="Sil"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Pasif Toplamı */}
              <div className="bg-slate-100 dark:bg-zinc-900/90 p-3.5 border-t-2 border-b-4 border-double border-slate-700 dark:border-zinc-700 flex items-center justify-between font-bold text-sm text-slate-900 dark:text-white">
                <span className="uppercase tracking-wider">HESAPLANAN PASİF TOPLAMI:</span>
                <span className="font-mono text-base text-amber-950 dark:text-amber-300 font-black">
                  {formatCurrency(userTotalLiabilities)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 2. OTOMATİK BİLANÇO GÖRÜNÜMÜ */}
      {/* ============================================================== */}
      {viewMode === 'auto' && (
        <div className="bg-white dark:bg-zinc-950 rounded-2xl shadow-xs border border-slate-300 dark:border-zinc-800 overflow-hidden transition-colors">
          {/* Tablo Üst Başlığı */}
          <div className="bg-slate-900 dark:bg-black text-white py-3 px-6 text-center border-b border-slate-700 dark:border-zinc-800">
            <h2 className="text-sm font-bold tracking-wide uppercase">
              {scenario.companyName}
            </h2>
            <p className="text-xs text-slate-400 dark:text-zinc-500 mt-0.5 font-mono">
              Tarih: {balanceSheet.date} • Temel Bilanço (T-Cetveli)
            </p>
          </div>

          {/* Bilanço Gövdesi */}
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x-2 divide-slate-400 dark:divide-zinc-700">
            {/* ================= SOL: AKTİF (VARLIKLAR) ================= */}
            <div className="flex flex-col">
              <div className="bg-blue-50 dark:bg-blue-950/40 py-2.5 px-4 border-b border-slate-300 dark:border-zinc-700 text-center">
                <span className="font-bold text-sm text-blue-900 dark:text-blue-300 tracking-wider">
                  AKTİF (VARLIKLAR)
                </span>
              </div>

              <div className="p-4 flex-1 space-y-5 text-xs">
                {/* I. DÖNEN VARLIKLAR */}
                <div>
                  <div className="flex items-center justify-between pb-1.5 border-b border-slate-200 dark:border-zinc-800 font-bold text-slate-800 dark:text-zinc-200">
                    <span>{balanceSheet.assets.currentAssets.title}</span>
                    <span className="font-mono text-indigo-900 dark:text-zinc-200">
                      {formatCurrency(balanceSheet.assets.currentAssets.total)}
                    </span>
                  </div>
                  <div className="mt-2 space-y-1.5 pl-2">
                    {balanceSheet.assets.currentAssets.items.length > 0 ? (
                      balanceSheet.assets.currentAssets.items.map((item) => (
                        <div key={item.code} className="flex items-center justify-between py-1 text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-900/40">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[11px] text-slate-500 dark:text-zinc-400">{item.code}</span>
                            <span>{item.name}</span>
                          </div>
                          <span className="font-mono font-medium text-slate-900 dark:text-white">
                            {formatCurrency(item.amount)}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="text-slate-400 dark:text-zinc-500 italic py-1 text-[11px]">Dönen varlık hareketi yok</div>
                    )}
                  </div>
                </div>

                {/* II. DURAN VARLIKLAR */}
                <div>
                  <div className="flex items-center justify-between pb-1.5 border-b border-slate-200 dark:border-zinc-800 font-bold text-slate-800 dark:text-zinc-200">
                    <span>{balanceSheet.assets.nonCurrentAssets.title}</span>
                    <span className="font-mono text-indigo-900 dark:text-zinc-200">
                      {formatCurrency(balanceSheet.assets.nonCurrentAssets.total)}
                    </span>
                  </div>
                  <div className="mt-2 space-y-1.5 pl-2">
                    {balanceSheet.assets.nonCurrentAssets.items.length > 0 ? (
                      balanceSheet.assets.nonCurrentAssets.items.map((item) => (
                        <div key={item.code} className="flex items-center justify-between py-1 text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-900/40">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[11px] text-slate-500 dark:text-zinc-400">{item.code}</span>
                            <span>{item.name}</span>
                          </div>
                          <span className="font-mono font-medium text-slate-900 dark:text-white">
                            {formatCurrency(item.amount)}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="text-slate-400 dark:text-zinc-500 italic py-1 text-[11px]">Duran varlık hareketi yok</div>
                    )}
                  </div>
                </div>
              </div>

              {/* AKTİF TOPLAMI */}
              <div className="bg-slate-100 dark:bg-zinc-900/90 p-3.5 border-t-2 border-b-4 border-double border-slate-700 dark:border-zinc-700 flex items-center justify-between font-bold text-sm text-slate-900 dark:text-white">
                <span className="uppercase tracking-wider">AKTİF TOPLAMI:</span>
                <span className="font-mono text-base text-blue-950 dark:text-blue-300 font-black">
                  {formatCurrency(balanceSheet.assets.totalAssets)}
                </span>
              </div>
            </div>

            {/* ================= SAĞ: PASİF (KAYNAKLAR) ================= */}
            <div className="flex flex-col">
              <div className="bg-amber-50 dark:bg-amber-950/40 py-2.5 px-4 border-b border-slate-300 dark:border-zinc-700 text-center">
                <span className="font-bold text-sm text-amber-900 dark:text-amber-300 tracking-wider">
                  PASİF (KAYNAKLAR)
                </span>
              </div>

              <div className="p-4 flex-1 space-y-5 text-xs">
                {/* III. KISA VADELİ YABANCI KAYNAKLAR */}
                <div>
                  <div className="flex items-center justify-between pb-1.5 border-b border-slate-200 dark:border-zinc-800 font-bold text-slate-800 dark:text-zinc-200">
                    <span>{balanceSheet.liabilities.shortTermLiabilities.title}</span>
                    <span className="font-mono text-indigo-900 dark:text-zinc-200">
                      {formatCurrency(balanceSheet.liabilities.shortTermLiabilities.total)}
                    </span>
                  </div>
                  <div className="mt-2 space-y-1.5 pl-2">
                    {balanceSheet.liabilities.shortTermLiabilities.items.length > 0 ? (
                      balanceSheet.liabilities.shortTermLiabilities.items.map((item) => (
                        <div key={item.code} className="flex items-center justify-between py-1 text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-900/40">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[11px] text-slate-500 dark:text-zinc-400">{item.code}</span>
                            <span>{item.name}</span>
                          </div>
                          <span className="font-mono font-medium text-slate-900 dark:text-white">
                            {formatCurrency(item.amount)}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="text-slate-400 dark:text-zinc-500 italic py-1 text-[11px]">Kısa vadeli borç yok</div>
                    )}
                  </div>
                </div>

                {/* IV. UZUN VADELİ YABANCI KAYNAKLAR */}
                <div>
                  <div className="flex items-center justify-between pb-1.5 border-b border-slate-200 dark:border-zinc-800 font-bold text-slate-800 dark:text-zinc-200">
                    <span>{balanceSheet.liabilities.longTermLiabilities.title}</span>
                    <span className="font-mono text-indigo-900 dark:text-zinc-200">
                      {formatCurrency(balanceSheet.liabilities.longTermLiabilities.total)}
                    </span>
                  </div>
                  <div className="mt-2 space-y-1.5 pl-2">
                    {balanceSheet.liabilities.longTermLiabilities.items.length > 0 ? (
                      balanceSheet.liabilities.longTermLiabilities.items.map((item) => (
                        <div key={item.code} className="flex items-center justify-between py-1 text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-900/40">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[11px] text-slate-500 dark:text-zinc-400">{item.code}</span>
                            <span>{item.name}</span>
                          </div>
                          <span className="font-mono font-medium text-slate-900 dark:text-white">
                            {formatCurrency(item.amount)}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="text-slate-400 dark:text-zinc-500 italic py-1 text-[11px]">Uzun vadeli borç yok</div>
                    )}
                  </div>
                </div>

                {/* V. ÖZ KAYNAKLAR */}
                <div>
                  <div className="flex items-center justify-between pb-1.5 border-b border-slate-200 dark:border-zinc-800 font-bold text-slate-800 dark:text-zinc-200">
                    <span>{balanceSheet.liabilities.equity.title}</span>
                    <span className="font-mono text-indigo-900 dark:text-zinc-200">
                      {formatCurrency(balanceSheet.liabilities.equity.total)}
                    </span>
                  </div>
                  <div className="mt-2 space-y-1.5 pl-2">
                    {balanceSheet.liabilities.equity.items.length > 0 ? (
                      balanceSheet.liabilities.equity.items.map((item) => (
                        <div key={item.code} className="flex items-center justify-between py-1 text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-900/40">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[11px] text-slate-500 dark:text-zinc-400">{item.code}</span>
                            <span>{item.name}</span>
                          </div>
                          <span className={`font-mono font-medium ${item.amount < 0 ? 'text-rose-700 dark:text-rose-400' : 'text-slate-900 dark:text-white'}`}>
                            {formatCurrency(item.amount)}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="text-slate-400 dark:text-zinc-500 italic py-1 text-[11px]">Özkaynak hareketi yok</div>
                    )}
                  </div>
                </div>
              </div>

              {/* PASİF TOPLAMI */}
              <div className="bg-slate-100 dark:bg-zinc-900/90 p-3.5 border-t-2 border-b-4 border-double border-slate-700 dark:border-zinc-700 flex items-center justify-between font-bold text-sm text-slate-900 dark:text-white">
                <span className="uppercase tracking-wider">PASİF TOPLAMI:</span>
                <span className="font-mono text-base text-amber-950 dark:text-amber-300 font-black">
                  {formatCurrency(balanceSheet.liabilities.totalLiabilitiesAndEquity)}
                </span>
              </div>
            </div>
          </div>

          {/* Bilanço Denkliği Dipnotu */}
          <div className="bg-slate-50 dark:bg-zinc-950 p-4 border-t border-slate-300 dark:border-zinc-800 text-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-700 dark:text-zinc-300">Muhasebe Temel Eşitliği:</span>
              <span className="font-mono bg-white dark:bg-zinc-900 px-2 py-0.5 border border-slate-200 dark:border-zinc-800 rounded text-slate-800 dark:text-zinc-200">
                Varlıklar = Kaynaklar (Aktif = Pasif)
              </span>
            </div>

            <div className="flex items-center gap-2">
              {balanceSheet.isBalanced && balanceSheet.assets.totalAssets > 0 ? (
                <span className="text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  Bilanço Denkliği Sağlandı
                </span>
              ) : (
                <span className="text-rose-700 dark:text-rose-400 font-bold flex items-center gap-1">
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
