import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { JournalLine, JournalEntry, LedgerAccount, TrialBalance, BalanceSheet } from '../types/accounting';
import type { CompanyScenario, CommercialTransaction } from '../types/scenario';
import type { EntryValidationResult, ScenarioAuditResult } from '../types/validation';
import { SCENARIOS } from '../data/scenarios';
import { deriveLedger, deriveTrialBalance, deriveBalanceSheet } from '../core/accountingEngine';
import { validateJournalEntry, auditScenario } from '../core/validator';

export type AppMode = 'ogrenme' | 'calisma';
export type ActiveTab = 'yevmiye' | 'defterikebir' | 'mizan' | 'bilanco';
export type AppScreen = 'welcome' | 'workspace' | 'summary';
export type AppTheme = 'light' | 'dark';

interface AccountingStore {
  // Ekran ve Tema
  currentScreen: AppScreen;
  theme: AppTheme;

  // Durum
  mode: AppMode;
  currentScenarioId: string;
  customScenarios: Record<string, CompanyScenario>;
  activeTransactionIndex: number;
  activeTab: ActiveTab;
  userEntries: Record<string, JournalLine[]>; // transactionId -> JournalLine[]
  hintLevels: Record<string, number>;        // transactionId -> current hint level (1..4)
  auditResult: ScenarioAuditResult | null;
  showAuditModal: boolean;
  showHintModal: boolean;

  // Getters / Selectors
  getAllScenarios: () => CompanyScenario[];
  getCurrentScenario: () => CompanyScenario;
  getActiveTransaction: () => CommercialTransaction;
  getLinesForActiveTransaction: () => JournalLine[];
  getValidationForActiveTransaction: () => EntryValidationResult;
  getAllJournalEntries: () => JournalEntry[];
  getLedgerAccounts: () => LedgerAccount[];
  getTrialBalance: () => TrialBalance;
  getBalanceSheet: () => BalanceSheet;

  // Ekran & Tema Aksiyonları
  setScreen: (screen: AppScreen) => void;
  toggleTheme: () => void;
  startScenario: (scenarioId: string, mode: AppMode) => void;
  startCustomScenario: (scenario: CompanyScenario, mode: AppMode) => void;
  finishScenarioAndShowSummary: () => void;
  returnToWorkspace: () => void;
  returnToWelcome: () => void;

  // Genel Aksiyonlar
  setMode: (mode: AppMode) => void;
  setScenario: (scenarioId: string) => void;
  setActiveTransactionIndex: (index: number) => void;
  setActiveTab: (tab: ActiveTab) => void;
  setShowAuditModal: (show: boolean) => void;
  setShowHintModal: (show: boolean) => void;
  
  // Yevmiye Defteri Düzenleme
  addLine: (transactionId: string) => void;
  removeLine: (transactionId: string, lineId: string) => void;
  updateLine: (transactionId: string, lineId: string, patch: Partial<JournalLine>) => void;
  resetLinesForTransaction: (transactionId: string) => void;
  
  // İpucu ve Doğrulama
  requestNextHint: (transactionId: string) => void;
  resetAll: () => void;
  runScenarioAudit: () => void;
  autoFillCorrectSolution: (transactionId: string) => void;
}

const createInitialLine = (): JournalLine => ({
  id: 'line_' + Math.random().toString(36).substring(2, 9),
  accountCode: '',
  debit: 0,
  credit: 0,
});

export const useAccountingStore = create<AccountingStore>()(
  persist(
    (set, get) => ({
      currentScreen: 'welcome',
      theme: 'light',
      mode: 'ogrenme',
      currentScenarioId: SCENARIOS[0].id,
      customScenarios: {},
      activeTransactionIndex: 0,
      activeTab: 'yevmiye',
      userEntries: {},
      hintLevels: {},
      auditResult: null,
      showAuditModal: false,
      showHintModal: false,

      getAllScenarios: () => {
        const { customScenarios } = get();
        return [...SCENARIOS, ...Object.values(customScenarios)];
      },

      getCurrentScenario: () => {
        const { currentScenarioId, customScenarios } = get();
        return customScenarios[currentScenarioId] || SCENARIOS.find(s => s.id === currentScenarioId) || SCENARIOS[0];
      },

      getActiveTransaction: () => {
        const scenario = get().getCurrentScenario();
        const { activeTransactionIndex } = get();
        return scenario.transactions[activeTransactionIndex] || scenario.transactions[0];
      },

      getLinesForActiveTransaction: () => {
        const tx = get().getActiveTransaction();
        const entries = get().userEntries[tx.id];
        if (entries && entries.length > 0) return entries;
        // Varsayılan iki boş satır (Biri borç biri alacak için hazır başlangıç)
        return [createInitialLine(), createInitialLine()];
      },

      getValidationForActiveTransaction: () => {
        const tx = get().getActiveTransaction();
        const lines = get().getLinesForActiveTransaction();
        return validateJournalEntry(lines, tx);
      },

      getAllJournalEntries: () => {
        const scenario = get().getCurrentScenario();
        const { userEntries } = get();
        const entries: JournalEntry[] = [];

        scenario.transactions.forEach((tx, idx) => {
          const lines = userEntries[tx.id] || [];
          const validLines = lines.filter(l => l.accountCode && (l.debit > 0 || l.credit > 0));
          if (validLines.length > 0) {
            entries.push({
              id: 'entry_' + tx.id,
              transactionId: tx.id,
              entryNo: idx + 1,
              date: tx.date,
              description: tx.description,
              lines: validLines,
            });
          }
        });

        return entries;
      },

      getLedgerAccounts: () => {
        const entries = get().getAllJournalEntries();
        return deriveLedger(entries);
      },

      getTrialBalance: () => {
        const ledger = get().getLedgerAccounts();
        return deriveTrialBalance(ledger);
      },

      getBalanceSheet: () => {
        const ledger = get().getLedgerAccounts();
        const scenario = get().getCurrentScenario();
        return deriveBalanceSheet(ledger, scenario.establishedDate);
      },

      // Ekran & Tema Aksiyonları
      setScreen: (screen) => set({ currentScreen: screen }),
      toggleTheme: () => {
        const next = get().theme === 'light' ? 'dark' : 'light';
        if (typeof document !== 'undefined') {
          if (next === 'dark') {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        }
        set({ theme: next });
      },
      startScenario: (scenarioId, mode) => {
        set({
          currentScenarioId: scenarioId,
          mode,
          activeTransactionIndex: 0,
          activeTab: 'yevmiye',
          currentScreen: 'workspace',
          showAuditModal: false,
          showHintModal: false,
        });
      },
      startCustomScenario: (scenario, mode) => {
        set((prev) => ({
          customScenarios: {
            ...prev.customScenarios,
            [scenario.id]: scenario,
          },
          currentScenarioId: scenario.id,
          mode,
          activeTransactionIndex: 0,
          activeTab: 'yevmiye',
          currentScreen: 'workspace',
          showAuditModal: false,
          showHintModal: false,
        }));
      },
      finishScenarioAndShowSummary: () => {
        const scenario = get().getCurrentScenario();
        const { userEntries } = get();
        const result = auditScenario(userEntries, scenario);
        set({
          auditResult: result,
          currentScreen: 'summary',
          showAuditModal: false,
        });
      },
      returnToWorkspace: () => set({ currentScreen: 'workspace' }),
      returnToWelcome: () => set({ currentScreen: 'welcome' }),

      // Eylemler
      setMode: (mode) => set({ mode }),
      setScenario: (scenarioId) => set({ 
        currentScenarioId: scenarioId, 
        activeTransactionIndex: 0,
        hintLevels: {},
        auditResult: null,
      }),
      setActiveTransactionIndex: (index) => set({ activeTransactionIndex: index }),
      setActiveTab: (tab) => set({ activeTab: tab }),
      setShowAuditModal: (show) => set({ showAuditModal: show }),
      setShowHintModal: (show) => set({ showHintModal: show }),

      addLine: (transactionId) => {
        const current = get().userEntries[transactionId] || get().getLinesForActiveTransaction();
        set({
          userEntries: {
            ...get().userEntries,
            [transactionId]: [...current, createInitialLine()],
          }
        });
      },

      removeLine: (transactionId, lineId) => {
        const current = get().userEntries[transactionId] || get().getLinesForActiveTransaction();
        const filtered = current.filter(l => l.id !== lineId);
        set({
          userEntries: {
            ...get().userEntries,
            [transactionId]: filtered.length > 0 ? filtered : [createInitialLine()],
          }
        });
      },

      updateLine: (transactionId, lineId, patch) => {
        const current = get().userEntries[transactionId] || get().getLinesForActiveTransaction();
        const updated = current.map(l => l.id === lineId ? { ...l, ...patch } : l);
        set({
          userEntries: {
            ...get().userEntries,
            [transactionId]: updated,
          }
        });
      },

      resetLinesForTransaction: (transactionId) => {
        set({
          userEntries: {
            ...get().userEntries,
            [transactionId]: [createInitialLine(), createInitialLine()],
          }
        });
      },

      requestNextHint: (transactionId) => {
        const current = get().hintLevels[transactionId] || 0;
        if (current < 4) {
          set({
            hintLevels: {
              ...get().hintLevels,
              [transactionId]: current + 1,
            },
            showHintModal: true,
          });
        } else {
          set({ showHintModal: true });
        }
      },

      resetAll: () => {
        set({
          userEntries: {},
          hintLevels: {},
          auditResult: null,
          activeTransactionIndex: 0,
        });
      },

      runScenarioAudit: () => {
        const scenario = get().getCurrentScenario();
        const { userEntries } = get();
        const result = auditScenario(userEntries, scenario);
        set({
          auditResult: result,
          showAuditModal: true,
        });
      },

      autoFillCorrectSolution: (transactionId) => {
        const scenario = get().getCurrentScenario();
        const tx = scenario.transactions.find(t => t.id === transactionId);
        if (!tx) return;

        const newLines: JournalLine[] = tx.expectedEntry.lines.map((l) => ({
          id: 'line_' + Math.random().toString(36).substring(2, 9),
          accountCode: l.accountCode,
          debit: l.debit,
          credit: l.credit,
        }));

        set({
          userEntries: {
            ...get().userEntries,
            [transactionId]: newLines,
          }
        });
      },
    }),
    {
      name: 'genel-muhasebe-store-v1',
      partialize: (state) => ({
        theme: state.theme,
        mode: state.mode,
        currentScenarioId: state.currentScenarioId,
        customScenarios: state.customScenarios,
        userEntries: state.userEntries,
        hintLevels: state.hintLevels,
        currentScreen: state.currentScreen,
        auditResult: state.auditResult,
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.theme === 'dark' && typeof document !== 'undefined') {
          document.documentElement.classList.add('dark');
        } else if (typeof document !== 'undefined') {
          document.documentElement.classList.remove('dark');
        }
      },
    }
  )
);
