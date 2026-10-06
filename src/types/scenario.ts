import type { JournalLine } from './accounting';

export interface PedagogicalHint {
  level: 1 | 2 | 3 | 4;
  title: string;
  content: string;
}

export interface ExpectedJournalEntry {
  lines: Omit<JournalLine, 'id'>[];
  educationalNotes: string; // "Neden bu kayıt yapıldı? Açıklaması."
}

export interface CommercialTransaction {
  id: string;
  order: number;
  date: string;
  title: string;
  description: string;
  amount: number;
  expectedEntry: ExpectedJournalEntry;
  hints: PedagogicalHint[]; // 1: Etkilenen Unsurlar, 2: Hesap Karakterleri, 3: Artış/Azalış Yönü, 4: Doğru Kayıt
}

export interface CompanyScenario {
  id: string;
  title: string;
  difficulty: 'Kolay' | 'Orta' | 'İleri';
  companyName: string;
  establishedDate: string;
  initialCapital: number;
  description: string;
  learningObjectives: string[];
  transactions: CommercialTransaction[];
}
