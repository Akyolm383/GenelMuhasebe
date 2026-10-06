export type GeneratorDifficulty = 'Kolay' | 'Orta' | 'İleri';

export interface GeneratorConfig {
  difficulty: GeneratorDifficulty;
  transactionCount: number; // e.g. 4, 5, 6, 7, 8
  companyName?: string;
  focusArea?: 'genel' | 'mal_hareketleri' | 'borc_alacak' | 'giderler';
}

export interface VirtualLedgerState {
  cash: number;           // 100 Kasa
  bank: number;           // 102 Bankalar
  receivables: number;    // 120 Alıcılar
  notesReceivable: number;// 121 Alacak Senetleri
  inventory: number;      // 153 Ticari Mallar
  fixtures: number;       // 255 Demirbaşlar
  bankLoans: number;      // 300 Banka Kredileri
  payables: number;       // 320 Satıcılar
  notesPayable: number;   // 321 Borç Senetleri
  capital: number;        // 500 Sermaye
  revenues: number;       // 600 Yurtiçi Satışlar
  expenses: number;       // 770 Genel Yönetim Giderleri
}
