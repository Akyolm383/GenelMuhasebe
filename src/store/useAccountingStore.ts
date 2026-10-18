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
export type PracticeViewMode = 'auto' | 'practice';

export interface PracticeLedgerEntry {
  debitTotal: string;
  creditTotal: string;
  balance: string;
  direction: 'BORC' | 'ALACAK' | 'DENK';
}

export interface CustomBalanceItem {
  id: string;
  code: string;
  group: 'DONEN' | 'DURAN' | 'KVYK' | 'UVYK' | 'OZKAYNAK';
  amount: number;
}

const getInitialPracticeAssets = (): CustomBalanceItem[] => [
  { id: 'a1', code: '100', group: 'DONEN', amount: 0 },
  { id: 'a2', code: '', group: 'DONEN', amount: 0 },
];

const getInitialPracticeLiabilities = (): CustomBalanceItem[] => [
  { id: 'l1', code: '500', group: 'OZKAYNAK', amount: 0 },
  { id: 'l2', code: '', group: 'KVYK', amount: 0 },
];

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

  // İnteraktif T-Cetveli ve Bilanço "Kendin Doldur" (Practice) Durumu
  ledgerViewMode: PracticeViewMode;
  balanceViewMode: PracticeViewMode;
  practiceLedgerData: Record<string, PracticeLedgerEntry>;
  practiceAssetItems: CustomBalanceItem[];
  practiceLiabilityItems: CustomBalanceItem[];

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
  restoreSubmittedEntriesAndReturn: () => void;
  resetCurrentScenario: () => void;
  returnToWorkspace: () => void;
  returnToWelcome: () => void;

  // İnteraktif T-Cetveli & Bilanço Aksiyonları
  setLedgerViewMode: (mode: PracticeViewMode) => void;
  setBalanceViewMode: (mode: PracticeViewMode) => void;
  setPracticeLedgerData: (
    updater:
      | Record<string, PracticeLedgerEntry>
      | ((prev: Record<string, PracticeLedgerEntry>) => Record<string, PracticeLedgerEntry>)
  ) => void;
  setPracticeAssetItems: (
    updater: CustomBalanceItem[] | ((prev: CustomBalanceItem[]) => CustomBalanceItem[])
  ) => void;
  setPracticeLiabilityItems: (
    updater: CustomBalanceItem[] | ((prev: CustomBalanceItem[]) => CustomBalanceItem[])
  ) => void;

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

      ledgerViewMode: 'auto',
      balanceViewMode: 'auto',
      practiceLedgerData: {},
      practiceAssetItems: getInitialPracticeAssets(),
      practiceLiabilityItems: getInitialPracticeLiabilities(),

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
          practiceLedgerData: {},
          practiceAssetItems: getInitialPracticeAssets(),
          practiceLiabilityItems: getInitialPracticeLiabilities(),
        }));
      },
      finishScenarioAndShowSummary: () => {
        const scenario = get().getCurrentScenario();
        const { userEntries, hintLevels } = get();
        const result = auditScenario(userEntries, scenario);

        // Görev tamamlandığında (finishlenince) bu senaryoya ait kayıtları sıfırla ki
        // kullanıcı görevi tekrar baştan çözebilsin ("sürekli yapılı" kalmasın).
        // Tamamlanan turun kayıtları result.submittedEntries içinde saklanır.
        const remainingEntries = { ...userEntries };
        const remainingHints = { ...hintLevels };
        scenario.transactions.forEach((tx) => {
          delete remainingEntries[tx.id];
          delete remainingHints[tx.id];
        });

        set({
          auditResult: result,
          userEntries: remainingEntries,
          hintLevels: remainingHints,
          activeTransactionIndex: 0,
          activeTab: 'yevmiye',
          practiceLedgerData: {},
          practiceAssetItems: getInitialPracticeAssets(),
          practiceLiabilityItems: getInitialPracticeLiabilities(),
          currentScreen: 'summary',
          showAuditModal: false,
        });
      },
      restoreSubmittedEntriesAndReturn: () => {
        const { auditResult, userEntries } = get();
        if (auditResult?.submittedEntries) {
          set({
            userEntries: {
              ...userEntries,
              ...auditResult.submittedEntries,
            },
            currentScreen: 'workspace',
          });
        } else {
          set({ currentScreen: 'workspace' });
        }
      },
      resetCurrentScenario: () => {
        const scenario = get().getCurrentScenario();
        const { userEntries, hintLevels } = get();
        const remainingEntries = { ...userEntries };
        const remainingHints = { ...hintLevels };
        scenario.transactions.forEach((tx) => {
          delete remainingEntries[tx.id];
          delete remainingHints[tx.id];
        });
        set({
          userEntries: remainingEntries,
          hintLevels: remainingHints,
          activeTransactionIndex: 0,
          practiceLedgerData: {},
          practiceAssetItems: getInitialPracticeAssets(),
          practiceLiabilityItems: getInitialPracticeLiabilities(),
        });
      },
      returnToWorkspace: () => set({ currentScreen: 'workspace' }),
      returnToWelcome: () => set({ currentScreen: 'welcome' }),

      // İnteraktif T-Cetveli & Bilanço Aksiyonları
      setLedgerViewMode: (mode) => set({ ledgerViewMode: mode }),
      setBalanceViewMode: (mode) => set({ balanceViewMode: mode }),
      setPracticeLedgerData: (updater) =>
        set((state) => ({
          practiceLedgerData:
            typeof updater === 'function' ? updater(state.practiceLedgerData) : updater,
        })),
      setPracticeAssetItems: (updater) =>
        set((state) => ({
          practiceAssetItems:
            typeof updater === 'function' ? updater(state.practiceAssetItems) : updater,
        })),
      setPracticeLiabilityItems: (updater) =>
        set((state) => ({
          practiceLiabilityItems:
            typeof updater === 'function' ? updater(state.practiceLiabilityItems) : updater,
        })),

      // Eylemler
      setMode: (mode) => set({ mode }),
      setScenario: (scenarioId) => set({ 
        currentScenarioId: scenarioId, 
        activeTransactionIndex: 0,
        hintLevels: {},
        auditResult: null,
        practiceLedgerData: {},
        practiceAssetItems: getInitialPracticeAssets(),
        practiceLiabilityItems: getInitialPracticeLiabilities(),
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
          practiceLedgerData: {},
          practiceAssetItems: getInitialPracticeAssets(),
          practiceLiabilityItems: getInitialPracticeLiabilities(),
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
        ledgerViewMode: state.ledgerViewMode,
        balanceViewMode: state.balanceViewMode,
        practiceLedgerData: state.practiceLedgerData,
        practiceAssetItems: state.practiceAssetItems,
        practiceLiabilityItems: state.practiceLiabilityItems,
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
