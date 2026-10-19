export type GeneratorDifficulty = 'Kolay' | 'Orta' | 'İleri';

export type GeneratorFocusArea =
  | 'genel'
  | 'cek_senet'
  | 'kdv_islemleri'
  | 'mal_ve_maliyet'
  | 'faiz_kredi'
  | 'doviz'
  | 'supheli_alacak'
  | 'bordro'
  | 'varlik_satisi'
  | 'donem_sonu';

export interface GeneratorConfig {
  difficulty: GeneratorDifficulty;
  transactionCount: number; // e.g. 4, 6, 8, 10
  companyName?: string;
  focusArea?: GeneratorFocusArea;
}

export interface VirtualLedgerState {
  cash: number;            // 100 Kasa
  checksReceived: number;  // 101 Alınan Çekler
  bank: number;            // 102 Bankalar
  checksIssued: number;    // 103 Verilen Çekler ve Ödeme Emirleri (-)
  posReceivables: number;  // 108 Diğer Hazır Değerler (Kredi Kartı Slipleri)
  receivables: number;     // 120 Alıcılar
  notesReceivable: number; // 121 Alacak Senetleri
  inventory: number;       // 153 Ticari Mallar
  vatDeductible: number;   // 191 İndirilecek KDV
  fixtures: number;        // 255 Demirbaşlar
  bankLoans: number;       // 300 Banka Kredileri
  payables: number;        // 320 Satıcılar
  notesPayable: number;    // 321 Borç Senetleri
  vatCalculated: number;   // 391 Hesaplanan KDV
  capital: number;         // 500 Sermaye
  revenues: number;        // 600 Yurtiçi Satışlar
  expenses: number;        // 770 Genel Yönetim Giderleri
}
