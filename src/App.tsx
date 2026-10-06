import React, { useState, useEffect } from 'react';
import { useAccountingStore } from './store/useAccountingStore';
import { WelcomeScreen } from './components/screens/WelcomeScreen';
import { WorkspaceScreen } from './components/screens/WorkspaceScreen';
import { SummaryScreen } from './components/screens/SummaryScreen';
import { HintModal } from './components/HintModal';
import { ACCOUNTS_LIST } from './core/accounts';
import { BookOpen, X } from 'lucide-react';

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
    (a) => a.code.includes(refSearch.trim()) || a.name.toLowerCase().includes(refSearch.trim().toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black text-slate-900 dark:text-zinc-100 flex flex-col font-sans transition-colors">
      {/* 1. Ekran Yönlendirmesi */}
      {currentScreen === 'welcome' && (
        <WelcomeScreen onOpenAccountsGuide={() => setShowAccountsReference(true)} />
      )}

      {currentScreen === 'workspace' && (
        <WorkspaceScreen onOpenAccountsGuide={() => setShowAccountsReference(true)} />
      )}

      {currentScreen === 'summary' && (
        <SummaryScreen onOpenAccountsGuide={() => setShowAccountsReference(true)} />
      )}

      {/* 2. Modallar */}
      <HintModal />

      {/* 3. Hesap Planı Hızlı Başvuru Rehberi Modalı (OLED Dark Uyumlu) */}
      {showAccountsReference && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-950 rounded-3xl shadow-2xl max-w-2xl w-full border border-slate-200 dark:border-zinc-800 overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-indigo-900 dark:bg-zinc-900 text-white px-5 py-4 flex items-center justify-between border-b border-indigo-800 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-300 dark:text-zinc-400" />
                <h3 className="font-bold text-sm sm:text-base">Tekdüzen Hesap Planı ve İşleyiş Kuralları</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAccountsReference(false)}
                className="p-1.5 text-slate-300 hover:text-white dark:text-zinc-400 dark:hover:text-zinc-100 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-zinc-900/80 border-b border-slate-200 dark:border-zinc-800">
              <input
                type="text"
                value={refSearch}
                onChange={(e) => setRefSearch(e.target.value)}
                placeholder="Hesap kodu veya adı arayın (Örn: 100, Kasa, 153)..."
                className="w-full text-xs p-2.5 bg-white dark:bg-black border border-slate-300 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:focus:ring-zinc-400 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500"
              />
            </div>

            <div className="p-4 space-y-3 overflow-y-auto flex-1 text-xs">
              {filteredReference.map((acc) => (
                <div key={acc.code} className="p-3.5 bg-slate-50 dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-800 rounded-2xl space-y-1.5">
                  <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
                    <span className="font-mono text-indigo-700 dark:text-zinc-200">{acc.code} {acc.name}</span>
                    <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-slate-200 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300">
                      {acc.nature} • Normal Bakiye: {acc.normalBalance}
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-zinc-400 leading-relaxed">{acc.description}</p>
                  <p className="text-indigo-950 dark:text-zinc-300 font-medium pt-1">
                    ⚖️ <strong>Kural:</strong> {acc.ruleExplanation}
                  </p>
                </div>
              ))}
            </div>

            <div className="p-3 bg-slate-50 dark:bg-zinc-900/80 border-t border-slate-200 dark:border-zinc-800 text-right">
              <button
                type="button"
                onClick={() => setShowAccountsReference(false)}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-900 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-white text-xs font-semibold rounded-xl cursor-pointer"
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
