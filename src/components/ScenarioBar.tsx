import React from 'react';
import { useAccountingStore } from '../store/useAccountingStore';
import { formatCurrency } from '../core/accountingEngine';
import { 
  Building2, 
  Calendar, 
  Coins, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  HelpCircle,
  Sparkles
} from 'lucide-react';

export const ScenarioBar: React.FC = () => {
  const {
    getCurrentScenario,
    activeTransactionIndex,
    setActiveTransactionIndex,
    getActiveTransaction,
    userEntries,
    mode,
    requestNextHint,
    autoFillCorrectSolution
  } = useAccountingStore();

  const scenario = getCurrentScenario();
  const activeTx = getActiveTransaction();

  const totalTxCount = scenario.transactions.length;

  return (
    <div className="bg-white border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        {/* Üst Kısım: İşletme Künyesi Bilgi Çubuğu */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-zinc-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-black text-white dark:bg-white dark:text-black rounded-lg">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-zinc-900">{scenario.companyName}</span>
                <span className="text-xs bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded font-mono">
                  {scenario.difficulty} Seviye
                </span>
              </div>
              <p className="text-xs text-zinc-500 mt-0.5 max-w-xl truncate">
                {scenario.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5 text-zinc-600 bg-zinc-50 px-2.5 py-1.5 rounded-md border border-zinc-200">
              <Calendar className="w-4 h-4 text-zinc-400" />
              <span>Kuruluş: <strong>{scenario.establishedDate}</strong></span>
            </div>
            <div className="flex items-center gap-1.5 text-zinc-600 bg-zinc-50 px-2.5 py-1.5 rounded-md border border-zinc-200">
              <Coins className="w-4 h-4 text-amber-500" />
              <span>Başlangıç Sermayesi: <strong>{formatCurrency(scenario.initialCapital)}</strong></span>
            </div>
          </div>
        </div>

        {/* Orta Kısım: İşlem Adımları Gezgini (Stepper) */}
        <div className="pt-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
              Ticari İşlemler ({activeTransactionIndex + 1} / {totalTxCount})
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={activeTransactionIndex === 0}
                onClick={() => setActiveTransactionIndex(activeTransactionIndex - 1)}
                className="p-1 rounded text-zinc-500 hover:text-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-zinc-100"
                title="Önceki İşlem"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                disabled={activeTransactionIndex === totalTxCount - 1}
                onClick={() => setActiveTransactionIndex(activeTransactionIndex + 1)}
                className="p-1 rounded text-zinc-500 hover:text-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-zinc-100"
                title="Sonraki İşlem"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Stepper Butonları */}
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
            {scenario.transactions.map((tx, idx) => {
              const isActive = idx === activeTransactionIndex;
              const entries = userEntries[tx.id] || [];
              const hasRecords = entries.some(l => l.accountCode && (l.debit > 0 || l.credit > 0));

              return (
                <button
                  key={tx.id}
                  type="button"
                  onClick={() => setActiveTransactionIndex(idx)}
                  className={`flex flex-col p-2 text-left rounded-lg border transition-all text-xs cursor-pointer ${
                    isActive
                      ? 'border-black bg-zinc-100 shadow-xs ring-1 ring-black/10'
                      : hasRecords
                      ? 'border-zinc-200 bg-white hover:border-zinc-300'
                      : 'border-dashed border-zinc-200 bg-zinc-50/50 hover:bg-white text-zinc-400'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className={`font-mono font-bold text-[11px] ${isActive ? 'text-black font-extrabold' : 'text-zinc-700'}`}>
                      #{tx.order}
                    </span>
                    {hasRecords ? (
                       <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-zinc-300 shrink-0" />
                    )}
                  </div>
                  <span className={`truncate font-medium text-[11px] ${isActive ? 'text-black font-semibold' : 'text-zinc-700'}`}>
                    {tx.date}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Alt Kısım: Seçili İşlem Detay Kartı */}
        <div className="mt-3 p-3.5 bg-zinc-50 rounded-xl border border-zinc-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-black text-white font-mono text-[11px] font-bold rounded">
                İşlem {activeTx.order}
              </span>
              <span className="text-xs font-semibold text-zinc-500">
                {activeTx.date}
              </span>
              <h2 className="text-sm font-bold text-zinc-900">
                {activeTx.title}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-zinc-700 leading-relaxed font-normal">
              {activeTx.description}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
            <div className="text-right mr-1">
              <span className="block text-[10px] text-zinc-400 uppercase font-semibold">Tutar</span>
              <span className="font-mono font-bold text-sm text-black">
                {formatCurrency(activeTx.amount)}
              </span>
            </div>

            {mode === 'ogrenme' && (
              <>
                <button
                  type="button"
                  onClick={() => requestNextHint(activeTx.id)}
                  className="px-2.5 py-1.5 text-xs font-semibold bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                  title="Aşamalı İpucu İste"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-amber-700" />
                  <span>İpucu</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('Bu işlem için doğru yevmiye kaydını görmek ve yüklemek istiyor musunuz?')) {
                      autoFillCorrectSolution(activeTx.id);
                    }
                  }}
                  className="px-2.5 py-1.5 text-xs font-semibold bg-zinc-100 hover:bg-zinc-200 text-zinc-900 border border-zinc-300 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                  title="Örnek Çözümü Yükle"
                >
                  <Sparkles className="w-3.5 h-3.5 text-black" />
                  <span>Çözümü Göster</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
