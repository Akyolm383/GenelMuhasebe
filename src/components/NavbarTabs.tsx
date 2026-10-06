import React from 'react';
import { useAccountingStore } from '../store/useAccountingStore';
import type { ActiveTab } from '../store/useAccountingStore';
import { BookOpenText, Scale, TableProperties, Landmark } from 'lucide-react';

export const NavbarTabs: React.FC = () => {
  const { activeTab, setActiveTab, getTrialBalance, getBalanceSheet } = useAccountingStore();

  const trialBalance = getTrialBalance();
  const balanceSheet = getBalanceSheet();

  const tabs: { id: ActiveTab; label: string; icon: React.ComponentType<{ className?: string }>; badge?: string; badgeColor?: string }[] = [
    {
      id: 'yevmiye',
      label: 'Yevmiye Defteri',
      icon: BookOpenText,
    },
    {
      id: 'defterikebir',
      label: 'T-Hesapları (Büyük Defter)',
      icon: Scale,
    },
    {
      id: 'mizan',
      label: 'Mizan',
      icon: TableProperties,
      badge: trialBalance.isBalanced ? 'Dengeli' : (trialBalance.rows.length > 0 ? 'Dengesiz' : undefined),
      badgeColor: trialBalance.isBalanced ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800',
    },
    {
      id: 'bilanco',
      label: 'Bilanço',
      icon: Landmark,
      badge: balanceSheet.isBalanced ? 'Dengeli' : (balanceSheet.difference !== 0 ? 'Fark Var' : undefined),
      badgeColor: balanceSheet.isBalanced ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800',
    },
  ];

  return (
    <div className="bg-zinc-100/70 dark:bg-black border-b border-zinc-200/90 dark:border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex space-x-1.5 py-2 overflow-x-auto" aria-label="Tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-2 px-3.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-white dark:bg-zinc-900 text-black dark:text-zinc-100 shadow-xs border border-zinc-200/90 dark:border-zinc-700 font-bold'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-zinc-100 hover:bg-zinc-200/60 dark:hover:bg-zinc-900 border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-black dark:text-white' : 'text-zinc-400 dark:text-zinc-500'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ml-1 border ${
                    tab.badge === 'Dengeli'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-950/70 dark:text-emerald-400 dark:border-emerald-800/60'
                      : 'bg-rose-50 text-rose-700 border-rose-200/80 dark:bg-rose-950/70 dark:text-rose-400 dark:border-rose-800/60'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
