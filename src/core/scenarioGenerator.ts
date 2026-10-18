import type { CompanyScenario, CommercialTransaction } from '../types/scenario';
import type {
  GeneratorConfig,
  GeneratorFocusArea,
  VirtualLedgerState,
} from '../types/generator';

// Rastgele işletme unvanları havuzu
const COMPANY_NAMES = [
  'Kuzey Ticaret İşletmesi',
  'Atlas Toptan & Dağıtım',
  'Zirve Kırtasiye & Ofis',
  'Hilal Perakende Gıda',
  'Anadolu Hırdavat Sanayi',
  'Boğaziçi Mobilya Dünyası',
  'Pusula Elektronik Mağazası',
  'Doğu Yapı Market',
  'Marmara Kitap & Dağıtım',
  'Ege İtriyat & Kozmetik',
  'Toros Tekstil & Giyim',
  'Gediz Ambalaj ve Ticaret',
];

function pickRandom<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function pickRoundAmount(min: number, max: number, step: number = 5000): number {
  const stepsCount = Math.floor((max - min) / step);
  if (stepsCount <= 0) return min;
  const chosenStep = Math.floor(Math.random() * (stepsCount + 1));
  return min + chosenStep * step;
}

function fmt(num: number): string {
  return new Intl.NumberFormat('tr-TR').format(num) + ' TL';
}

interface ArchetypeContext {
  state: VirtualLedgerState;
  dateStr: string;
  order: number;
  difficulty: 'Kolay' | 'Orta' | 'İleri';
}

interface TransactionArchetype {
  id: string;
  title: string;
  minDifficulty: 'Kolay' | 'Orta' | 'İleri';
  tags: GeneratorFocusArea[];
  isApplicable: (ctx: ArchetypeContext) => boolean;
  generate: (ctx: ArchetypeContext) => {
    transaction: CommercialTransaction;
    applyState: (s: VirtualLedgerState) => void;
  };
}

const ARCHETYPES: TransactionArchetype[] = [
  // 1. Kasadan Bankaya Para Yatırma
  {
    id: 'deposit_bank',
    title: 'Bankadaki Mevduat Hesabına Para Yatırılması',
    minDifficulty: 'Kolay',
    tags: ['genel'],
    isApplicable: ({ state }) => state.cash >= 30000 && state.bank < 80000,
    generate: ({ state, dateStr, order }) => {
      const maxTransfer = Math.min(state.cash - 15000, 45000);
      const amount = pickRoundAmount(15000, maxTransfer, 5000);
      return {
        transaction: {
          id: `gen-tx-${order}`,
          order,
          date: dateStr,
          title: 'Bankaya Nakit Para Yatırılması',
          description: `İşletme kasasından ${fmt(amount)} nakit para alınarak bankadaki vadesiz mevduat hesabına yatırılmıştır.`,
          amount,
          expectedEntry: {
            educationalNotes:
              'Bankadaki paramız arttığı için 102 Bankalar (Varlık/Aktif) borçlandırılır; kasadan nakit çıktığı için 100 Kasa alacaklandırılır.',
            lines: [
              { accountCode: '102', debit: amount, credit: 0 },
              { accountCode: '100', debit: 0, credit: amount },
            ],
          },
          hints: [
            {
              level: 1,
              title: '1. Aşama: İşlemde Neler Değişti?',
              content:
                'Kasadaki nakit para azaldı, banka hesabımızdaki mevduat arttı.',
            },
            {
              level: 2,
              title: '2. Aşama: Hangi Hesaplar Kullanılır?',
              content:
                '"100 Kasa" ve "102 Bankalar" hesaplarının her ikisi de Varlık (Aktif) hesabıdır.',
            },
            {
              level: 3,
              title: '3. Aşama: Hangisi Borç, Hangisi Alacak?',
              content: `Banka hesabımız arttığı için 102 Bankalar BORÇ (${fmt(amount)}); kasadaki nakit azaldığı için 100 Kasa ALACAK (${fmt(amount)}) yazılır.`,
            },
            {
              level: 4,
              title: '4. Aşama: Tam Yevmiye Kaydı',
              content: `102 Bankalar (Borç: ${fmt(amount)}) / 100 Kasa (Alacak: ${fmt(amount)})`,
            },
          ],
        },
        applyState: (s) => {
          s.cash -= amount;
          s.bank += amount;
        },
      };
    },
  },

  // 2. Çek Keşide Ederek (Kendi Çekimizi Vererek) Mal Alımı (153 / 103)
  {
    id: 'purchase_check_issued',
    title: 'Çek Düzenleyerek (Keşide Ederek) Ticari Mal Alımı',
    minDifficulty: 'Kolay',
    tags: ['genel', 'cek_senet', 'mal_ve_maliyet'],
    isApplicable: ({ state }) => state.bank >= 15000,
    generate: ({ state, dateStr, order }) => {
      const maxCheck = Math.min(state.bank, 35000);
      const amount = pickRoundAmount(10000, Math.max(10000, maxCheck), 5000);
      return {
        transaction: {
          id: `gen-tx-${order}`,
          order,
          date: dateStr,
          title: 'Çek Keşide Ederek Ticari Mal Alımı',
          description: `İşletme, satmak üzere ${fmt(amount)} tutarında ticari mal satın almış ve karşılığında kendi çek defterinden ${fmt(amount)}'lik bir çek düzenleyip (keşide edip) satıcıya vermiştir.`,
          amount,
          expectedEntry: {
            educationalNotes:
              'Mal stoğumuz arttığı için 153 Ticari Mallar borçlandırılır. Kendi çekimizi verdiğimiz için "103 Verilen Çekler ve Ödeme Emirleri (-)" hesabı kullanılır ve sonunda (-) olduğu için ALACAKLANDIRILIR.',
            lines: [
              { accountCode: '153', debit: amount, credit: 0 },
              { accountCode: '103', debit: 0, credit: amount },
            ],
          },
          hints: [
            {
              level: 1,
              title: '1. Aşama: İşlemde Neler Değişti?',
              content:
                'Depomuza ticari mal girdi ve karşılığında kendi banka çekimizi imzalayıp (keşide edip) verdik.',
            },
            {
              level: 2,
              title: '2. Aşama: 101 mi, 103 mü?',
              content:
                'Müşteriden çek almadık, KENDİ çekimizi verdik! Bu nedenle "103 Verilen Çekler ve Ödeme Emirleri (-)" kullanılır.',
            },
            {
              level: 3,
              title: '3. Aşama: 103 Neden Alacak Yazılır?',
              content: `103 hesabı sonunda (-) işareti bulunan aktifi düzenleyen pasif karakterli bir hesaptır. Çek verildiğinde ALACAK (${fmt(amount)}) yazılır.`,
            },
            {
              level: 4,
              title: '4. Aşama: Tam Yevmiye Kaydı',
              content: `153 Ticari Mallar (Borç: ${fmt(amount)}) / 103 Verilen Çekler ve Ödeme Emirleri (-) (Alacak: ${fmt(amount)})`,
            },
          ],
        },
        applyState: (s) => {
          s.inventory += amount;
          s.checksIssued += amount;
        },
      };
    },
  },

  // 3. Müşteriden Çek Alarak Mal Satışı (101 / 600)
  {
    id: 'sale_check_received',
    title: 'Müşteriden Çek Alarak Ticari Mal Satışı',
    minDifficulty: 'Kolay',
    tags: ['genel', 'cek_senet', 'mal_ve_maliyet'],
    isApplicable: () => true,
    generate: ({ dateStr, order }) => {
      const amount = pickRoundAmount(15000, 45000, 5000);
      return {
        transaction: {
          id: `gen-tx-${order}`,
          order,
          date: dateStr,
          title: 'Müşteriden Çek Alarak Mal Satışı',
          description: `İşletme, müşteriye ${fmt(amount)} tutarında ticari mal satmış ve satış bedeli karşılığında müşteriden ${fmt(amount)} tutarında çek teslim almıştır.`,
          amount,
          expectedEntry: {
            educationalNotes:
              'Müşteriden çek alındığında çek cüzdanımızdaki varlık arttığı için 101 Alınan Çekler borçlandırılır; satış geliri doğduğu için 600 Yurtiçi Satışlar alacaklandırılır.',
            lines: [
              { accountCode: '101', debit: amount, credit: 0 },
              { accountCode: '600', debit: 0, credit: amount },
            ],
          },
          hints: [
            {
              level: 1,
              title: '1. Aşama: İşlemde Neler Değişti?',
              content:
                'Müşteriden çek aldık ve mal satışı geliri (hasılatı) elde ettik.',
            },
            {
              level: 2,
              title: '2. Aşama: Hangi Hesaplar Kullanılır?',
              content:
                'Müşteriden alınan çekler için "101 Alınan Çekler" (Aktif), satış geliri için "600 Yurtiçi Satışlar" (Gelir) kullanılır.',
            },
            {
              level: 3,
              title: '3. Aşama: Hangisi Borç, Hangisi Alacak?',
              content: `Müşteri çeki varlığımız arttığı için 101 BORÇ (${fmt(amount)}); satış hasılatı doğduğu için 600 ALACAK (${fmt(amount)}) yazılır.`,
            },
            {
              level: 4,
              title: '4. Aşama: Tam Yevmiye Kaydı',
              content: `101 Alınan Çekler (Borç: ${fmt(amount)}) / 600 Yurtiçi Satışlar (Alacak: ${fmt(amount)})`,
            },
          ],
        },
        applyState: (s) => {
          s.checksReceived += amount;
          s.revenues += amount;
        },
      };
    },
  },

  // 4. Müşteri Çekinin Satıcıya Ciro Edilmesi (153 veya 320 / 101)
  {
    id: 'endorse_customer_check',
    title: 'Müşteri Çekinin Ciro Edilmesi',
    minDifficulty: 'Orta',
    tags: ['genel', 'cek_senet'],
    isApplicable: ({ state }) => state.checksReceived >= 15000,
    generate: ({ state, dateStr, order }) => {
      const amount = state.checksReceived;
      return {
        transaction: {
          id: `gen-tx-${order}`,
          order,
          date: dateStr,
          title: 'Alınan Müşteri Çekinin Satıcıya Ciro Edilmesi',
          description: `İşletme, ${fmt(amount)} tutarında yeni ticari mal satın almış ve bedelini ödemek için daha önce müşteriden aldığı ${fmt(amount)}'lik çeki satıcıya CİRO etmiştir (devretmiştir).`,
          amount,
          expectedEntry: {
            educationalNotes:
              'Sınav Tuzağı Uyarısı: Müşteriden alınan bir çek başkasına CİRO edildiğinde kendi çekimiz olmadığı için 103 kullanılmaz! Cüzdanımızdaki müşteri çeki çıktığı için "101 Alınan Çekler" hesabı ALACAKLANDIRILIR.',
            lines: [
              { accountCode: '153', debit: amount, credit: 0 },
              { accountCode: '101', debit: 0, credit: amount },
            ],
          },
          hints: [
            {
              level: 1,
              title: '1. Aşama: Çek Ciro Etmek Nedir?',
              content:
                'Daha önce müşteriden aldığımız (101 hesabındaki) çeki imzalayıp mal aldığımız satıcıya devretmektir.',
            },
            {
              level: 2,
              title: '2. Aşama: 101 mi, 103 mü?',
              content:
                'Dikkat! Kendi çekimizi yazmadık, elimizdeki müşteri çekini verdik. Bu yüzden "101 Alınan Çekler" hesabı kullanılır.',
            },
            {
              level: 3,
              title: '3. Aşama: Hangisi Borç, Hangisi Alacak?',
              content: `Mal aldığımız için 153 Ticari Mallar BORÇ (${fmt(amount)}); elimizdeki müşteri çeki çıktığı için 101 Alınan Çekler ALACAK (${fmt(amount)}) yazılır.`,
            },
            {
              level: 4,
              title: '4. Aşama: Tam Yevmiye Kaydı',
              content: `153 Ticari Mallar (Borç: ${fmt(amount)}) / 101 Alınan Çekler (Alacak: ${fmt(amount)})`,
            },
          ],
        },
        applyState: (s) => {
          s.inventory += amount;
          s.checksReceived -= amount;
        },
      };
    },
  },

  // 5. Verilen Çekin (103) Bankadan Ödenmesi (103 / 102)
  {
    id: 'pay_issued_check_bank',
    title: 'Verilen Çekin Bankadan Ödenmesi',
    minDifficulty: 'Kolay',
    tags: ['genel', 'cek_senet'],
    isApplicable: ({ state }) =>
      state.checksIssued >= 10000 && state.bank >= state.checksIssued,
    generate: ({ state, dateStr, order }) => {
      const amount = state.checksIssued;
      return {
        transaction: {
          id: `gen-tx-${order}`,
          order,
          date: dateStr,
          title: 'Keşide Edilen Çekin Bankadan Ödenmesi',
          description: `İşletmenin daha önce mal alırken satıcıya keşide edip verdiği ${fmt(amount)} tutarındaki çek, banka mevduat hesabımızdan ödenmiştir.`,
          amount,
          expectedEntry: {
            educationalNotes:
              'Verdiğimiz çek ödendiğinde 103 Verilen Çekler ve Ödeme Emirleri (-) hesabı BORÇLANDIRILARAK kapatılır; bankadaki paramız azaldığı için 102 Bankalar alacaklandırılır.',
            lines: [
              { accountCode: '103', debit: amount, credit: 0 },
              { accountCode: '102', debit: 0, credit: amount },
            ],
          },
          hints: [
            {
              level: 1,
              title: '1. Aşama: İşlemde Neler Değişti?',
              content:
                'Daha önce satıcıya verdiğimiz çek banka hesabımızdan ödendi ve çek borcumuz kapandı.',
            },
            {
              level: 2,
              title: '2. Aşama: Hangi Hesaplar Kullanılır?',
              content:
                '"103 Verilen Çekler ve Ödeme Emirleri (-)" ve "102 Bankalar".',
            },
            {
              level: 3,
              title: '3. Aşama: Hangisi Borç, Hangisi Alacak?',
              content: `Çeki verirken 103'ü Alacak yazmıştık; ödendiğinde kapatmak için 103 BORÇ (${fmt(amount)}), bankadan para çıktığı için 102 ALACAK (${fmt(amount)}) yazılır.`,
            },
            {
              level: 4,
              title: '4. Aşama: Tam Yevmiye Kaydı',
              content: `103 Verilen Çekler ve Ödeme Emirleri (-) (Borç: ${fmt(amount)}) / 102 Bankalar (Alacak: ${fmt(amount)})`,
            },
          ],
        },
        applyState: (s) => {
          s.checksIssued -= amount;
          s.bank -= amount;
        },
      };
    },
  },

  // 6. %20 KDV'li Veresiye Mal Alışı (153 + 191 / 320)
  {
    id: 'purchase_vat_credit',
    title: '%20 KDV\'li Veresiye Ticari Mal Alışı',
    minDifficulty: 'Orta',
    tags: ['genel', 'kdv_islemleri', 'mal_ve_maliyet'],
    isApplicable: () => true,
    generate: ({ dateStr, order }) => {
      const baseAmount = pickRoundAmount(15000, 35000, 5000);
      const vatAmount = Math.round(baseAmount * 0.2);
      const totalAmount = baseAmount + vatAmount;
      return {
        transaction: {
          id: `gen-tx-${order}`,
          order,
          date: dateStr,
          title: '%20 KDV\'li Veresiye Ticari Mal Alımı',
          description: `İşletme, satıcılardan ${fmt(baseAmount)} + %20 KDV (${fmt(vatAmount)} KDV, genel toplam ${fmt(totalAmount)}) tutarında ticari malı veresiye (açık hesap) satın almıştır.`,
          amount: baseAmount,
          expectedEntry: {
            educationalNotes:
              'Mal bedeli 153 Ticari Mallar hesabına, alışta ödenen KDV ise 191 İndirilecek KDV hesabına BORÇ yazılır; toplam borç 320 Satıcılar hesabına ALACAK yazılır.',
            lines: [
              { accountCode: '153', debit: baseAmount, credit: 0 },
              { accountCode: '191', debit: vatAmount, credit: 0 },
              { accountCode: '320', debit: 0, credit: totalAmount },
            ],
          },
          hints: [
            {
              level: 1,
              title: '1. Aşama: KDV Hesaplaması',
              content: `Mal bedeli: ${fmt(baseAmount)}, %20 KDV: ${fmt(vatAmount)}, Satıcıya toplam borç: ${fmt(totalAmount)}.`,
            },
            {
              level: 2,
              title: '2. Aşama: Alış KDV\'si Hangi Hesapta İzlenir?',
              content:
                'Mal alırken yüklenilen KDV "191 İndirilecek KDV" (Aktif) hesabında izlenir.',
            },
            {
              level: 3,
              title: '3. Aşama: Hangisi Borç, Hangisi Alacak?',
              content: `153 Ticari Mallar (${fmt(baseAmount)}) ve 191 İndirilecek KDV (${fmt(vatAmount)}) BORÇ; 320 Satıcılar (${fmt(totalAmount)}) ALACAK yazılır.`,
            },
            {
              level: 4,
              title: '4. Aşama: Tam Yevmiye Kaydı',
              content: `153 Ticari Mallar (B: ${fmt(baseAmount)}), 191 İndirilecek KDV (B: ${fmt(vatAmount)}) / 320 Satıcılar (A: ${fmt(totalAmount)})`,
            },
          ],
        },
        applyState: (s) => {
          s.inventory += baseAmount;
          s.vatDeductible += vatAmount;
          s.payables += totalAmount;
        },
      };
    },
  },

  // 7. %20 KDV'li Peşin veya Kredi Kartlı Mal Satışı (100 veya 108 / 600 + 391)
  {
    id: 'sale_vat_pos',
    title: '%20 KDV\'li ve Kredi Kartlı (POS) Mal Satışı',
    minDifficulty: 'Orta',
    tags: ['genel', 'kdv_islemleri', 'mal_ve_maliyet'],
    isApplicable: () => true,
    generate: ({ dateStr, order }) => {
      const baseAmount = pickRoundAmount(20000, 45000, 5000);
      const vatAmount = Math.round(baseAmount * 0.2);
      const totalAmount = baseAmount + vatAmount;
      return {
        transaction: {
          id: `gen-tx-${order}`,
          order,
          date: dateStr,
          title: '%20 KDV\'li Kredi Kartı (POS) ile Mal Satışı',
          description: `İşletme, müşteriye ${fmt(baseAmount)} + %20 KDV (${fmt(vatAmount)} KDV, toplam ${fmt(totalAmount)}) tutarında mal satmış, müşteri toplam tutarı kredi kartı (POS cihazı) ile ödemiştir.`,
          amount: baseAmount,
          expectedEntry: {
            educationalNotes:
              'Kredi kartı (POS) slipleri "108 Diğer Hazır Değerler" hesabında BORÇ izlenir; KDV hariç satış tutarı "600 Yurtiçi Satışlar" ve müşteriden alınan KDV "391 Hesaplanan KDV" hesabına ALACAK yazılır.',
            lines: [
              { accountCode: '108', debit: totalAmount, credit: 0 },
              { accountCode: '600', debit: 0, credit: baseAmount },
              { accountCode: '391', debit: 0, credit: vatAmount },
            ],
          },
          hints: [
            {
              level: 1,
              title: '1. Aşama: Kredi Kartı (POS) Tahsilatı Nereye Yazılır?',
              content:
                'POS cihazından geçen kredi kartı slipleri nakit kasa değildir; "108 Diğer Hazır Değerler" (Aktif) hesabında izlenir.',
            },
            {
              level: 2,
              title: '2. Aşama: Satış KDV\'si Hangi Hesaba Yazılır?',
              content:
                'Müşteriden tahsil edilen satış KDV\'si "391 Hesaplanan KDV" hesabına ALACAK yazılır.',
            },
            {
              level: 3,
              title: '3. Aşama: Hangisi Borç, Hangisi Alacak?',
              content: `108 Diğer Hazır Değerler (${fmt(totalAmount)}) BORÇ; 600 Yurtiçi Satışlar (${fmt(baseAmount)}) ve 391 Hesaplanan KDV (${fmt(vatAmount)}) ALACAK yazılır.`,
            },
            {
              level: 4,
              title: '4. Aşama: Tam Yevmiye Kaydı',
              content: `108 Diğer Hazır Değerler (B: ${fmt(totalAmount)}) / 600 Yurtiçi Satışlar (A: ${fmt(baseAmount)}), 391 Hesaplanan KDV (A: ${fmt(vatAmount)})`,
            },
          ],
        },
        applyState: (s) => {
          s.posReceivables += totalAmount;
          s.revenues += baseAmount;
          s.vatCalculated += vatAmount;
        },
      };
    },
  },

  // 8. Peşin Ticari Mal Alışı
  {
    id: 'purchase_cash',
    title: 'Peşin Ticari Mal Alımı',
    minDifficulty: 'Kolay',
    tags: ['genel', 'mal_ve_maliyet'],
    isApplicable: ({ state }) => state.cash >= 15000,
    generate: ({ state, dateStr, order }) => {
      const maxPurchase = Math.min(state.cash - 5000, 35000);
      const amount = pickRoundAmount(10000, maxPurchase, 5000);
      return {
        transaction: {
          id: `gen-tx-${order}`,
          order,
          date: dateStr,
          title: 'Peşin Ticari Mal Alımı',
          description: `İşletme, satışını yapmak üzere ${fmt(amount)} tutarında ticari malı peşin (nakit) olarak satın almıştır.`,
          amount,
          expectedEntry: {
            educationalNotes:
              'Mal stoğumuz arttığı için 153 Ticari Mallar borçlandırılır; nakit ödeme nedeniyle 100 Kasa alacaklandırılır.',
            lines: [
              { accountCode: '153', debit: amount, credit: 0 },
              { accountCode: '100', debit: 0, credit: amount },
            ],
          },
          hints: [
            {
              level: 1,
              title: '1. Aşama: İşlemde Neler Değişti?',
              content:
                'İşletmeye yeni ticari mal girmiş, karşılığında kasadan nakit para ödenmiştir.',
            },
            {
              level: 2,
              title: '2. Aşama: Hangi Hesaplar Kullanılır?',
              content:
                'Satın alınan mallar için "153 Ticari Mallar" (Aktif); nakit ödeme için "100 Kasa" (Aktif) kullanılır.',
            },
            {
              level: 3,
              title: '3. Aşama: Hangisi Borç, Hangisi Alacak?',
              content: `Varlık artışı Borç (153: ${fmt(amount)}), varlık azalışı Alacak (100: ${fmt(amount)}) mantığı ile kaydedilir.`,
            },
            {
              level: 4,
              title: '4. Aşama: Tam Yevmiye Kaydı',
              content: `153 Ticari Mallar (Borç: ${fmt(amount)}) / 100 Kasa (Alacak: ${fmt(amount)})`,
            },
          ],
        },
        applyState: (s) => {
          s.cash -= amount;
          s.inventory += amount;
        },
      };
    },
  },

  // 9. Satıcıya Olan Borcun Bankadan Ödenmesi
  {
    id: 'pay_supplier_bank',
    title: 'Satıcılara Borcun Bankadan Ödenmesi',
    minDifficulty: 'Orta',
    tags: ['genel', 'kdv_islemleri'],
    isApplicable: ({ state }) => state.payables >= 10000 && state.bank >= 10000,
    generate: ({ state, dateStr, order }) => {
      const maxPayment = Math.min(state.payables, state.bank);
      const amount =
        maxPayment >= 20000
          ? pickRoundAmount(10000, maxPayment, 5000)
          : maxPayment;
      return {
        transaction: {
          id: `gen-tx-${order}`,
          order,
          date: dateStr,
          title: 'Satıcıya Olan Borcun Bankadan Ödenmesi',
          description: `İşletme, satıcılara olan veresiye borcunun ${fmt(amount)} tutarındaki kısmını banka mevduat hesabından havale çıkararak ödemiştir.`,
          amount,
          expectedEntry: {
            educationalNotes:
              'Satıcılara olan borç eksildiği için pasif hesap olan 320 Satıcılar borçlandırılır; bankadaki mevduat azaldığı için 102 Bankalar alacaklandırılır.',
            lines: [
              { accountCode: '320', debit: amount, credit: 0 },
              { accountCode: '102', debit: 0, credit: amount },
            ],
          },
          hints: [
            {
              level: 1,
              title: '1. Aşama: İşlemde Neler Değişti?',
              content:
                'Satıcıya olan borcumuz kapanmakta ve banka hesabımızdan para çıkmaktadır.',
            },
            {
              level: 2,
              title: '2. Aşama: Hangi Hesaplar Kullanılır?',
              content:
                'Satıcı borcu "320 Satıcılar" (Pasif); banka parası "102 Bankalar" (Aktif) hesabıdır.',
            },
            {
              level: 3,
              title: '3. Aşama: Hangisi Borç, Hangisi Alacak?',
              content: `Pasif hesaplar azaldığında BORÇ kaydedilir (320: ${fmt(amount)}). Aktif hesaplar azaldığında ALACAK kaydedilir (102: ${fmt(amount)}).`,
            },
            {
              level: 4,
              title: '4. Aşama: Tam Yevmiye Kaydı',
              content: `320 Satıcılar (Borç: ${fmt(amount)}) / 102 Bankalar (Alacak: ${fmt(amount)})`,
            },
          ],
        },
        applyState: (s) => {
          s.payables -= amount;
          s.bank -= amount;
        },
      };
    },
  },

  // 10. Nakit Kira Gideri Ödenmesi
  {
    id: 'expense_rent',
    title: 'Kira Giderinin Nakit Ödenmesi',
    minDifficulty: 'Kolay',
    tags: ['genel', 'mal_ve_maliyet'],
    isApplicable: ({ state }) => state.cash >= 10000,
    generate: ({ state, dateStr, order }) => {
      const maxRent = Math.min(state.cash - 5000, 15000);
      const amount = pickRoundAmount(5000, Math.max(5000, maxRent), 2500);
      return {
        transaction: {
          id: `gen-tx-${order}`,
          order,
          date: dateStr,
          title: 'Kira Giderinin Nakit Ödenmesi',
          description: `İşletme faaliyetlerinin yürütüldüğü ofisin ${fmt(amount)} tutarındaki aylık kira bedeli kasadan nakit olarak ödenmiştir.`,
          amount,
          expectedEntry: {
            educationalNotes:
              'Giderler ortaya çıktığında daima borçlandırılır (770); kasadan para çıktığı için aktif hesap 100 Kasa alacaklandırılır.',
            lines: [
              { accountCode: '770', debit: amount, credit: 0 },
              { accountCode: '100', debit: 0, credit: amount },
            ],
          },
          hints: [
            {
              level: 1,
              title: '1. Aşama: İşlemde Neler Değişti?',
              content:
                'İşletme bir yönetim gideri yapmış ve kasasından nakit çıkmıştır.',
            },
            {
              level: 2,
              title: '2. Aşama: Hangi Hesaplar Kullanılır?',
              content:
                'Kira için "770 Genel Yönetim Giderleri" (Gider); nakit için "100 Kasa" (Aktif) kullanılır.',
            },
            {
              level: 3,
              title: '3. Aşama: Hangisi Borç, Hangisi Alacak?',
              content:
                'Gider hesapları doğduğunda kural gereği BORÇ (770). Kasadaki nakit azaldığı için ALACAK (100) kaydedilir.',
            },
            {
              level: 4,
              title: '4. Aşama: Tam Yevmiye Kaydı',
              content: `770 Genel Yönetim Giderleri (Borç: ${fmt(amount)}) / 100 Kasa (Alacak: ${fmt(amount)})`,
            },
          ],
        },
        applyState: (s) => {
          s.cash -= amount;
          s.expenses += amount;
        },
      };
    },
  },

  // 11. Senet Verilerek Mal Alışı
  {
    id: 'note_purchase',
    title: 'Senet Verilerek Ticari Mal Alımı',
    minDifficulty: 'İleri',
    tags: ['genel', 'cek_senet'],
    isApplicable: () => true,
    generate: ({ dateStr, order }) => {
      const amount = pickRoundAmount(15000, 30000, 5000);
      return {
        transaction: {
          id: `gen-tx-${order}`,
          order,
          date: dateStr,
          title: 'Senet Düzenlenerek Mal Alımı',
          description: `İşletme, ${fmt(amount)} tutarında ticari mal almış ve karşılığında 60 gün vadeli kendi borç senedini (bono) imzalayıp vermiştir.`,
          amount,
          expectedEntry: {
            educationalNotes:
              'Mal stoku arttığı için 153 Ticari Mallar borçlandırılır; imzalanıp verilen senet borç doğurduğu için 321 Borç Senetleri alacaklandırılır.',
            lines: [
              { accountCode: '153', debit: amount, credit: 0 },
              { accountCode: '321', debit: 0, credit: amount },
            ],
          },
          hints: [
            {
              level: 1,
              title: '1. Aşama: İşlemde Neler Değişti?',
              content: 'Depodaki mal artmış ve senetli borcumuz artmıştır.',
            },
            {
              level: 2,
              title: '2. Aşama: Hangi Hesaplar Kullanılır?',
              content:
                'Mallar "153 Ticari Mallar" (Aktif); verilen senet "321 Borç Senetleri" (Pasif) hesabıdır.',
            },
            {
              level: 3,
              title: '3. Aşama: Hangisi Borç, Hangisi Alacak?',
              content:
                'Aktif varlık artışı BORÇ (153). Pasif borç senedi artışı ALACAK (321).',
            },
            {
              level: 4,
              title: '4. Aşama: Tam Yevmiye Kaydı',
              content: `153 Ticari Mallar (Borç: ${fmt(amount)}) / 321 Borç Senetleri (Alacak: ${fmt(amount)})`,
            },
          ],
        },
        applyState: (s) => {
          s.inventory += amount;
          s.notesPayable += amount;
        },
      };
    },
  },

  // 12. Senet Alınarak Mal Satışı
  {
    id: 'note_sale',
    title: 'Senet Alınarak Ticari Mal Satışı',
    minDifficulty: 'İleri',
    tags: ['genel', 'cek_senet'],
    isApplicable: () => true,
    generate: ({ dateStr, order }) => {
      const amount = pickRoundAmount(20000, 45000, 5000);
      return {
        transaction: {
          id: `gen-tx-${order}`,
          order,
          date: dateStr,
          title: 'Senet Alınarak Mal Satışı',
          description: `İşletme, müşteriye ${fmt(amount)} tutarında ticari mal satmış ve karşılığında 90 gün vadeli alacak senedi (bono) teslim almıştır.`,
          amount,
          expectedEntry: {
            educationalNotes:
              'Müşteriden alınan senet alacağımızı arttırdığı için 121 Alacak Senetleri borçlandırılır; satış hasılatı için 600 Yurtiçi Satışlar alacaklandırılır.',
            lines: [
              { accountCode: '121', debit: amount, credit: 0 },
              { accountCode: '600', debit: 0, credit: amount },
            ],
          },
          hints: [
            {
              level: 1,
              title: '1. Aşama: İşlemde Neler Değişti?',
              content:
                'Elimizdeki senetli alacak artmış ve satış hasılatı gerçekleşmiştir.',
            },
            {
              level: 2,
              title: '2. Aşama: Hangi Hesaplar Kullanılır?',
              content:
                'Alınan senet "121 Alacak Senetleri" (Aktif); satış hasılatı "600 Yurtiçi Satışlar" (Gelir) hesabıdır.',
            },
            {
              level: 3,
              title: '3. Aşama: Hangisi Borç, Hangisi Alacak?',
              content:
                'Aktif senet varlığı artışı BORÇ (121). Satış geliri artışı ALACAK (600).',
            },
            {
              level: 4,
              title: '4. Aşama: Tam Yevmiye Kaydı',
              content: `121 Alacak Senetleri (Borç: ${fmt(amount)}) / 600 Yurtiçi Satışlar (Alacak: ${fmt(amount)})`,
            },
          ],
        },
        applyState: (s) => {
          s.notesReceivable += amount;
          s.revenues += amount;
        },
      };
    },
  },
];

export function generateScenario(config: GeneratorConfig): CompanyScenario {
  const companyName = config.companyName?.trim() || pickRandom(COMPANY_NAMES);
  const difficulty = config.difficulty;
  const focusArea: GeneratorFocusArea = config.focusArea || 'genel';
  const targetCount = Math.max(4, Math.min(10, config.transactionCount || 6));

  const state: VirtualLedgerState = {
    cash: 0,
    checksReceived: 0,
    bank: 0,
    checksIssued: 0,
    posReceivables: 0,
    receivables: 0,
    notesReceivable: 0,
    inventory: 0,
    vatDeductible: 0,
    fixtures: 0,
    bankLoans: 0,
    payables: 0,
    notesPayable: 0,
    vatCalculated: 0,
    capital: 0,
    revenues: 0,
    expenses: 0,
  };

  const initialCapital = pickRoundAmount(120000, 220000, 20000);
  const cashPart = Math.round(initialCapital * 0.5);
  const bankPart = initialCapital - cashPart;
  const establishedDate = '01.11.2026';

  const tx1: CommercialTransaction = {
    id: 'gen-tx-1',
    order: 1,
    date: '01.11.2026',
    title: 'İşletmenin Kuruluşu (Kasa ve Banka Sermayesi)',
    description: `${companyName}, toplam ${fmt(initialCapital)} sermaye ile kurulmuştur. Tutarın ${fmt(cashPart)}'lik kısmı nakit olarak kasaya, ${fmt(bankPart)}'lik kısmı ise banka hesabına yatırılmıştır.`,
    amount: initialCapital,
    expectedEntry: {
      educationalNotes:
        'Kuruluşta kasaya ve bankaya para girdiği için 100 Kasa ve 102 Bankalar borçlandırılır; toplam sermaye için 500 Sermaye alacaklandırılır.',
      lines: [
        { accountCode: '100', debit: cashPart, credit: 0 },
        { accountCode: '102', debit: bankPart, credit: 0 },
        { accountCode: '500', debit: 0, credit: initialCapital },
      ],
    },
    hints: [
      {
        level: 1,
        title: '1. Aşama: İşlemde Neler Değişti?',
        content: `Kasaya ${fmt(cashPart)}, bankaya ${fmt(bankPart)} girdi ve ${fmt(initialCapital)} sermaye oluştu.`,
      },
      {
        level: 2,
        title: '2. Aşama: Hangi Hesaplar Kullanılır?',
        content:
          '"100 Kasa" (Aktif), "102 Bankalar" (Aktif) ve "500 Sermaye" (Öz Kaynak/Pasif).',
      },
      {
        level: 3,
        title: '3. Aşama: Hangisi Borç, Hangisi Alacak?',
        content:
          'Artan varlıklar (100 ve 102) BORÇ; artan sermaye kaynağı (500) ALACAK yazılır.',
      },
      {
        level: 4,
        title: '4. Aşama: Tam Yevmiye Kaydı',
        content: `100 Kasa (B: ${fmt(cashPart)}), 102 Bankalar (B: ${fmt(bankPart)}) / 500 Sermaye (A: ${fmt(initialCapital)})`,
      },
    ],
  };

  state.cash += cashPart;
  state.bank += bankPart;
  state.capital += initialCapital;

  const transactions: CommercialTransaction[] = [tx1];
  const recentIds: string[] = [];

  const allowedLevels = new Set<'Kolay' | 'Orta' | 'İleri'>(['Kolay']);
  if (difficulty === 'Orta' || difficulty === 'İleri') allowedLevels.add('Orta');
  if (difficulty === 'İleri') allowedLevels.add('İleri');

  for (let i = 2; i <= targetCount; i++) {
    const day = Math.min(28, 1 + (i - 1) * 3);
    const dateStr = `${day.toString().padStart(2, '0')}.11.2026`;

    const ctx: ArchetypeContext = {
      state,
      dateStr,
      order: i,
      difficulty,
    };

    let candidates = ARCHETYPES.filter(
      (a) =>
        (allowedLevels.has(a.minDifficulty) || a.tags.includes(focusArea)) &&
        a.isApplicable(ctx)
    );

    if (focusArea !== 'genel') {
      const focused = candidates.filter((a) => a.tags.includes(focusArea));
      if (focused.length > 0) {
        candidates = focused;
      }
    }

    const nonRecent = candidates.filter((a) => !recentIds.includes(a.id));
    if (nonRecent.length > 0) {
      candidates = nonRecent;
    }

    const chosen =
      candidates.length > 0 ? pickRandom(candidates) : ARCHETYPES[2];
    const result = chosen.generate(ctx);
    result.applyState(state);
    transactions.push(result.transaction);

    recentIds.push(chosen.id);
    if (recentIds.length > 2) recentIds.shift();
  }

  const focusLabelMap: Record<GeneratorFocusArea, string> = {
    genel: 'Karma Müfredat',
    cek_senet: 'Çek & Senet Odaklı',
    kdv_islemleri: 'KDV & Mahsup Odaklı',
    mal_ve_maliyet: 'Alış-Satış & Gider Odaklı',
  };

  return {
    id: 'custom-' + Math.random().toString(36).substring(2, 9),
    title: `${companyName} (${focusLabelMap[focusArea]} • ${difficulty})`,
    difficulty,
    companyName,
    establishedDate,
    initialCapital,
    description: `${companyName} için Genel Muhasebe müfredatına uygun olarak üretilmiş ${transactions.length} işlemlik (${focusLabelMap[focusArea]}) çalışma senaryosu.`,
    learningObjectives: [
      'Varlık ve kaynak hesaplarının Borç/Alacak yönlerini doğru belirleme',
      'Çek (101/103), KDV (191/391) ve cari hesap (120/320) kurallarını uygulama',
      'Yevmiye kayıtlarından T-Cetveli ve Bilanço denkliğine ulaşma',
    ],
    transactions,
  };
}
