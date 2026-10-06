export type DiagnosticType = 
  | 'UNBALANCED_ENTRY'        // Borç != Alacak
  | 'EMPTY_ENTRY'             // Hiç satır yok
  | 'WRONG_ACCOUNT'           // İlgisiz / yanlış hesap seçimi
  | 'WRONG_DIRECTION'         // Ters kayıt (Borç yerine Alacak veya tam tersi)
  | 'WRONG_AMOUNT'            // Hesap doğru taraf doğru ama tutar yanlış
  | 'MISSING_ACCOUNT'         // İşlemde bulunması gereken hesap eksik
  | 'EXTRA_ACCOUNT'           // Fazladan ilgisiz hesap eklenmiş
  | 'CORRECT';

export interface LineDiagnostic {
  accountCode: string;
  accountName?: string;
  type: DiagnosticType;
  message: string;
  pedagogicalTip: string; // Neden böyle olduğunun muhasebe mantığı
  suggestedAction?: string;
}

export interface EntryValidationResult {
  transactionId: string;
  isValid: boolean;
  totalDebit: number;
  totalCredit: number;
  difference: number;
  generalMessages: string[];
  diagnostics: LineDiagnostic[];
}

export interface ScenarioAuditResult {
  scenarioId: string;
  totalTransactions: number;
  correctCount: number;
  incorrectCount: number;
  scorePercentage: number;
  balanceErrorsCount: number;
  accountSelectionErrorsCount: number;
  directionErrorsCount: number;
  transactionResults: {
    transactionId: string;
    order: number;
    title: string;
    isValid: boolean;
    errors: string[];
    userSummary: string;
    expectedSummary: string;
  }[];
}
