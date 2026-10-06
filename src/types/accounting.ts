export type AccountClass = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type AccountNature = 
  | 'AKTIF' 
  | 'PASIF' 
  | 'GELIR' 
  | 'GIDER' 
  | 'DUZENLEYICI_AKTIF' 
  | 'DUZENLEYICI_PASIF';

export type BalanceDirection = 'BORC' | 'ALACAK' | 'DENK';

export interface Account {
  code: string;           // örn: "100"
  name: string;           // örn: "Kasa"
  accountClass: AccountClass;
  nature: AccountNature;
  normalBalance: 'BORC' | 'ALACAK';
  description: string;    // Eğitici açıklama (Örn: "İşletmenin elindeki nakit Türk lirası ve döviz varlıklarını izler.")
  ruleExplanation: string;// Borç/alacak kuralı açıklaması (Örn: "Aktif hesap: Artışlar BORCA, azalışlar ALACAĞA yazılır.")
}

export interface JournalLine {
  id: string;
  accountCode: string;
  debit: number;          // Borç tutarı
  credit: number;         // Alacak tutarı
}

export interface JournalEntry {
  id: string;
  transactionId: string;
  date: string;
  entryNo: number;
  description: string;
  lines: JournalLine[];
}

export interface LedgerMovement {
  entryNo: number;
  date: string;
  amount: number;
  direction: 'BORC' | 'ALACAK';
  transactionId: string;
  explanation?: string;
}

export interface LedgerAccount {
  accountCode: string;
  accountName: string;
  accountClass: AccountClass;
  nature: AccountNature;
  debitMovements: LedgerMovement[];
  creditMovements: LedgerMovement[];
  totalDebit: number;
  totalCredit: number;
  balance: number;
  balanceDirection: BalanceDirection;
}

export interface TrialBalanceRow {
  accountCode: string;
  accountName: string;
  totalDebit: number;
  totalCredit: number;
  debitBalance: number;
  creditBalance: number;
}

export interface TrialBalance {
  rows: TrialBalanceRow[];
  totalDebit: number;
  totalCredit: number;
  totalDebitBalance: number;
  totalCreditBalance: number;
  isBalanced: boolean;
}

export interface BalanceSheetItem {
  code: string;
  name: string;
  amount: number;
}

export interface BalanceSheetGroup {
  title: string;
  items: BalanceSheetItem[];
  total: number;
}

export interface BalanceSheet {
  date: string;
  assets: {
    currentAssets: BalanceSheetGroup;     // 1 Dönen Varlıklar
    nonCurrentAssets: BalanceSheetGroup;  // 2 Duran Varlıklar
    totalAssets: number;                  // Aktif Toplamı
  };
  liabilities: {
    shortTermLiabilities: BalanceSheetGroup; // 3 Kısa Vadeli Yabancı Kaynaklar
    longTermLiabilities: BalanceSheetGroup;  // 4 Uzun Vadeli Yabancı Kaynaklar
    equity: BalanceSheetGroup;               // 5 Öz Kaynaklar
    totalLiabilitiesAndEquity: number;       // Pasif Toplamı
  };
  isBalanced: boolean;
  difference: number;
}
