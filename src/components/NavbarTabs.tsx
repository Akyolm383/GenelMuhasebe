import React from 'react';
import { useAccountingStore } from '../store/useAccountingStore';
import type { ActiveTab } from '../store/useAccountingStore';
import { BookOpenText, Scale, TableProperties, Landmark } from 'lucide-react';

export const NavbarTabs: React.FC = () => {
  const { activeTab, setActiveTab, getTrialBalance, getBalanceSheet } =
    useAccountingStore();

  const trialBalance = getTrialBalance();
  const balanceSheet = getBalanceSheet();

  const tabs: {
    id: ActiveTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
  }[] = [
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
      label: 'Mizan Cetveli',
      icon: TableProperties,
      badge: trialBalance.isBalanced
        ? 'Dengeli'
        : trialBalance.rows.length > 0
        ? 'Dengesiz'
        : undefined,
    },
    {
      id: 'bilanco',
      label: 'Bilanço',
      icon: Landmark,
      badge: balanceSheet.isBalanced
        ? 'Dengeli'
        : balanceSheet.difference !== 0
        ? 'Fark Var'
        : undefined,
    },
  ];

  return (
    <div className="bg-surface-muted/70 dark:bg-[#18181B] border-b border-border-subtle dark:border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav
          className="flex space-x-2 py-2.5 overflow-x-auto"
          aria-label="Muhasebe Defter Sekmeleri"
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-2 px-4 rounded-full text-xs font-ledger-readout whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-surface-contrast dark:bg-[#F5F3EE] text-surface dark:text-[#18181B] shadow-xs font-bold'
                    : 'bg-surface/70 dark:bg-zinc-900 text-text-secondary dark:text-zinc-400 hover:text-text-primary dark:hover:text-zinc-100 border border-border-subtle dark:border-zinc-800'
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${
                    isActive
                      ? 'text-secondary-fixed dark:text-primary-container'
                      : 'text-text-muted dark:text-zinc-500'
                  }`}
                />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold ml-1 border ${
                      tab.badge === 'Dengeli'
                        ? 'bg-secondary-fixed/60 text-secondary border-secondary/30 dark:bg-emerald-950/70 dark:text-emerald-300 dark:border-emerald-800/60'
                        : 'bg-error-container text-semantic-warning border-semantic-warning/30 dark:bg-rose-950/70 dark:text-rose-300 dark:border-rose-800/60'
                    }`}
                  >
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
