import React from 'react';
import { useAccountingStore } from '../store/useAccountingStore';
import { X, ChevronRight, Lightbulb, CheckCircle2 } from 'lucide-react';

export const HintModal: React.FC = () => {
  const { 
    showHintModal, 
    setShowHintModal, 
    getActiveTransaction, 
    hintLevels, 
    requestNextHint 
  } = useAccountingStore();

  if (!showHintModal) return null;

  const activeTx = getActiveTransaction();
  const currentLevel = hintLevels[activeTx.id] || 1;
  const hints = activeTx.hints;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-zinc-950 rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 dark:border-zinc-800 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Başlığı */}
        <div className="bg-amber-600 dark:bg-zinc-900 text-white px-5 py-4 flex items-center justify-between border-b dark:border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-white/20 dark:bg-zinc-800 rounded-lg">
              <Lightbulb className="w-5 h-5 text-white dark:text-amber-400" />
            </div>
            <div>
              <h3 className="font-bold text-sm">
                Aşamalı Sokratik İpucu
              </h3>
              <p className="text-xs text-amber-100 dark:text-zinc-400">
                İşlem #{activeTx.order}: {activeTx.title}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowHintModal(false)}
            className="p-1 text-white/80 hover:text-white dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-white/10 dark:hover:bg-zinc-800 rounded-md transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* İpucu Aşamaları İlerleme Çubuğu */}
        <div className="bg-amber-50 dark:bg-zinc-900/80 px-5 py-2.5 border-b border-amber-200/60 dark:border-zinc-800 flex items-center justify-between text-xs text-amber-900 dark:text-amber-300">
          <div className="flex items-center gap-1.5 font-semibold">
            <span>Aşama {currentLevel} / 4</span>
          </div>

          <div className="flex items-center gap-1">
            {[1, 2, 3, 4].map((lvl) => (
              <div
                key={lvl}
                className={`w-5 h-1.5 rounded-full transition-all ${
                  lvl <= currentLevel ? 'bg-amber-600 dark:bg-amber-500' : 'bg-amber-200 dark:bg-zinc-800'
                }`}
              />
            ))}
          </div>
        </div>

        {/* İpucu İçerikleri */}
        <div className="p-5 space-y-4 max-h-[60vh] overflow-y-auto">
          {hints.slice(0, currentLevel).map((hint, idx) => (
            <div 
              key={hint.level}
              className={`p-3.5 rounded-xl border transition-all ${
                idx === currentLevel - 1 
                  ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-300 dark:border-amber-900/50 ring-1 ring-amber-400/40 dark:ring-amber-500/20' 
                  : 'bg-slate-50 dark:bg-zinc-900/50 border-slate-200 dark:border-zinc-800'
              }`}
            >
              <div className="flex items-center gap-2 mb-1.5 text-xs font-bold text-slate-800 dark:text-zinc-200">
                <CheckCircle2 className={`w-4 h-4 ${idx === currentLevel - 1 ? 'text-amber-600 dark:text-amber-400' : 'text-slate-400 dark:text-zinc-500'}`} />
                <span>{hint.title}</span>
              </div>
              <p className="text-xs text-slate-700 dark:text-zinc-300 leading-relaxed pl-6">
                {hint.content}
              </p>
            </div>
          ))}
        </div>

        {/* Modal Alt Çubuğu */}
        <div className="px-5 py-3.5 bg-slate-50 dark:bg-zinc-900 border-t border-slate-200 dark:border-zinc-800 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setShowHintModal(false)}
            className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100 hover:bg-slate-200/70 dark:hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
          >
            Kapat ve Kendim Dene
          </button>

          {currentLevel < 4 ? (
            <button
              type="button"
              onClick={() => requestNextHint(activeTx.id)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <span>Sonraki Aşamayı Aç</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/80 px-3 py-1.5 rounded-lg border dark:border-emerald-900/50">
              Tüm İpuçları Açıldı
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
