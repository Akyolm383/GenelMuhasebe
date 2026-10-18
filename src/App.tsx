import React, { useState, useEffect } from 'react';
import { useAccountingStore } from './store/useAccountingStore';
import { WelcomeScreen } from './components/screens/WelcomeScreen';
import { WorkspaceScreen } from './components/screens/WorkspaceScreen';
import { SummaryScreen } from './components/screens/SummaryScreen';
import { HintModal } from './components/HintModal';
import { ACCOUNTS_LIST } from './core/accounts';
import { BookOpen, Scale, X } from 'lucide-react';

export const App: React.FC = () => {
  const { currentScreen, theme } = useAccountingStore();
  const [showAccountsReference, setShowAccountsReference] = useState(false);
  const [refSearch, setRefSearch] = useState('');

  // DOM theme synchronization on mount / change
  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [theme]);

  const filteredReference = ACCOUNTS_LIST.filter(
    (a) =>
      a.code.includes(refSearch.trim()) ||
      a.name.toLowerCase().includes(refSearch.trim().toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background dark:bg-[#121211] text-text-primary dark:text-[#F5F3EE] flex flex-col font-body-editorial paper-texture transition-colors">
      {/* 1. Ekran Yönlendirmesi */}
      {currentScreen === 'welcome' && (
        <WelcomeScreen
          onOpenAccountsGuide={() => setShowAccountsReference(true)}
        />
      )}

      {currentScreen === 'workspace' && (
        <WorkspaceScreen
          onOpenAccountsGuide={() => setShowAccountsReference(true)}
        />
      )}

      {currentScreen === 'summary' && (
        <SummaryScreen
          onOpenAccountsGuide={() => setShowAccountsReference(true)}
        />
      )}

      {/* 2. Modallar */}
      <HintModal />

      {/* 3. Hesap Planı Hızlı Başvuru Rehberi Modalı (Tactile Atelier Uyumlu) */}
      {showAccountsReference && (
        <div className="fixed inset-0 z-50 bg-surface-contrast/65 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface dark:bg-[#1C1B19] rounded-[2rem] shadow-2xl max-w-2xl w-full border border-border-subtle dark:border-zinc-800 overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-surface-contrast text-surface px-6 py-4 flex items-center justify-between border-b border-border-subtle/20">
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-5 h-5 text-secondary-fixed" />
                <div>
                  <h3 className="font-hero-display font-bold text-sm sm:text-base">
                    Tekdüzen Hesap Planı ve İşleyiş Kuralları
                  </h3>
                  <span className="text-[0.6875rem] font-ledger-readout text-text-muted block">
                    GM / ATÖLYE • VUK &amp; TDHP Referans Dizini
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAccountsReference(false)}
                className="p-1.5 text-zinc-400 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Kapat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-surface-muted/60 dark:bg-zinc-900 border-b border-border-subtle dark:border-zinc-800">
              <input
                type="text"
                value={refSearch}
                onChange={(e) => setRefSearch(e.target.value)}
                placeholder="Hesap kodu veya adı arayın (Örn: 100, Kasa, 153, 320)..."
                className="w-full text-[0.8125rem] font-ledger-readout p-3 bg-surface dark:bg-zinc-950 border border-border-subtle dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-container text-text-primary dark:text-white placeholder-text-muted"
              />
            </div>

            <div className="p-5 space-y-3 overflow-y-auto flex-1 text-xs tabular-nums">
              {filteredReference.map((acc) => (
                <div
                  key={acc.code}
                  className="p-4 bg-surface-muted/35 dark:bg-zinc-900/60 border border-border-subtle dark:border-zinc-800 rounded-2xl space-y-1.5 hover:border-primary/40 transition-colors"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 font-bold text-text-primary dark:text-white">
                    <span className="font-ledger-readout text-primary dark:text-[#FFB4A4] text-sm font-bold">
                      {acc.code} — {acc.name}
                    </span>
                    <span className="text-[0.6875rem] uppercase font-ledger-readout font-semibold px-2.5 py-0.5 rounded-full bg-surface dark:bg-zinc-800 border border-border-subtle dark:border-zinc-700 text-text-secondary dark:text-zinc-300">
                      {acc.nature} • Normal Bakiye: {acc.normalBalance}
                    </span>
                  </div>
                  <p className="text-text-secondary dark:text-zinc-400 leading-relaxed font-body-editorial text-[0.8125rem]">
                    {acc.description}
                  </p>
                  <p className="text-semantic-balance dark:text-secondary-fixed font-ledger-readout font-medium pt-1 flex items-center gap-1.5 text-[0.75rem]">
                    <Scale className="w-3.5 h-3.5 shrink-0" />
                    <span>
                      <strong>Kural:</strong> {acc.ruleExplanation}
                    </span>
                  </p>
                </div>
              ))}
            </div>

            <div className="p-4 bg-surface-muted/50 dark:bg-zinc-900 border-t border-border-subtle dark:border-zinc-800 text-right">
              <button
                type="button"
                onClick={() => setShowAccountsReference(false)}
                className="px-6 py-2.5 bg-primary-container hover:bg-primary text-on-primary-container text-xs font-ledger-readout font-semibold rounded-full cursor-pointer transition-colors"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
