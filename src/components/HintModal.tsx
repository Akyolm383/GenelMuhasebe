import React from 'react';
import { useAccountingStore } from '../store/useAccountingStore';
import { X, ChevronRight, Lightbulb, CheckCircle2 } from 'lucide-react';

export const HintModal: React.FC = () => {
  const {
    showHintModal,
    setShowHintModal,
    getActiveTransaction,
    hintLevels,
    requestNextHint,
  } = useAccountingStore();

  if (!showHintModal) return null;

  const activeTx = getActiveTransaction();
  const currentLevel = hintLevels[activeTx.id] || 1;
  const hints = activeTx.hints;

  return (
    <div className="fixed inset-0 z-50 bg-surface-contrast/65 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-surface dark:bg-[#1C1B19] rounded-[2rem] shadow-2xl max-w-lg w-full border border-border-subtle dark:border-zinc-800 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Başlığı */}
        <div className="bg-surface-contrast text-surface px-6 py-4 flex items-center justify-between border-b border-border-subtle/20">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-primary-container/25 border border-primary-container/40 rounded-full">
              <Lightbulb className="w-4 h-4 text-primary-fixed" />
            </div>
            <div>
              <h3 className="font-card-title font-bold text-sm sm:text-base text-surface">
                Aşamalı Sokratik İpucu
              </h3>
              <p className="text-[11px] font-ledger-readout text-text-muted">
                Vaka Madde #{activeTx.order}: {activeTx.title}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowHintModal(false)}
            className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* İpucu Aşamaları İlerleme Çubuğu */}
        <div className="bg-surface-muted/60 dark:bg-zinc-900 px-6 py-2.5 border-b border-border-subtle dark:border-zinc-800 flex items-center justify-between text-xs font-ledger-readout text-text-secondary dark:text-zinc-300 tabular-nums">
          <span className="font-bold">Aşama {currentLevel} / 4</span>

          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4].map((lvl) => (
              <div
                key={lvl}
                className={`w-6 h-1.5 rounded-full transition-all ${
                  lvl <= currentLevel
                    ? 'bg-primary-container'
                    : 'bg-border-subtle dark:bg-zinc-800'
                }`}
              />
            ))}
          </div>
        </div>

        {/* İpucu İçerikleri */}
        <div className="p-6 space-y-3.5 max-h-[60vh] overflow-y-auto">
          {hints.slice(0, currentLevel).map((hint, idx) => (
            <div
              key={hint.level}
              className={`p-4 rounded-2xl border transition-all ${
                idx === currentLevel - 1
                  ? 'bg-accent-surface/60 dark:bg-[#2A1813]/60 border-primary/30'
                  : 'bg-surface-muted/40 dark:bg-zinc-900/50 border-border-subtle dark:border-zinc-800'
              }`}
            >
              <div className="flex items-center gap-2 mb-1.5 text-xs font-card-title font-bold text-text-primary dark:text-white">
                <CheckCircle2
                  className={`w-4 h-4 ${
                    idx === currentLevel - 1
                      ? 'text-primary'
                      : 'text-secondary'
                  }`}
                />
                <span>{hint.title}</span>
              </div>
              <p className="text-xs sm:text-sm font-body-editorial text-text-secondary dark:text-zinc-300 leading-relaxed pl-6">
                {hint.content}
              </p>
            </div>
          ))}
        </div>

        {/* Modal Alt Çubuğu */}
        <div className="px-6 py-4 bg-surface-muted/50 dark:bg-zinc-900 border-t border-border-subtle dark:border-zinc-800 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setShowHintModal(false)}
            className="px-4 py-2 text-xs font-ledger-readout font-semibold text-text-secondary dark:text-zinc-400 hover:text-text-primary rounded-full transition-colors cursor-pointer"
          >
            Kapat ve Kendim Dene
          </button>

          {currentLevel < 4 ? (
            <button
              type="button"
              onClick={() => requestNextHint(activeTx.id)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary-container hover:bg-primary text-on-primary-container text-xs font-ledger-readout font-bold rounded-full shadow-xs transition-colors cursor-pointer"
            >
              <span>Sonraki Aşamayı Aç</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <span className="text-xs font-ledger-readout font-bold text-secondary bg-secondary-fixed/40 px-3 py-1.5 rounded-full border border-secondary/30">
              Tüm İpuçları Açıldı
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
