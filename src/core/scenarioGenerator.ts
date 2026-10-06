import type { CompanyScenario, CommercialTransaction } from '../types/scenario';
import type { GeneratorConfig, VirtualLedgerState } from '../types/generator';

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

// Rastgele seçim yardımcısı
function pickRandom<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

// Belirtilen minimum ve maksimum aralığında temiz yuvarlak tutar seçici
function pickRoundAmount(min: number, max: number, step: number = 5000): number {
  const stepsCount = Math.floor((max - min) / step);
  if (stepsCount <= 0) return min;
  const chosenStep = Math.floor(Math.random() * (stepsCount + 1));
  return min + chosenStep * step;
}

// Sayı formatlayıcı
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
  isApplicable: (ctx: ArchetypeContext) => boolean;
  generate: (ctx: ArchetypeContext) => {
    transaction: CommercialTransaction;
    applyState: (s: VirtualLedgerState) => void;
  };
}

// Şablonlar listesi
const ARCHETYPES: TransactionArchetype[] = [
  // 1. Kasadan Bankaya Para Yatırma
  {
    id: 'deposit_bank',
    title: 'Bankadaki Mevduat Hesabına Para Yatırılması',
    minDifficulty: 'Kolay',
    isApplicable: ({ state }) => state.cash >= 25000 && state.bank < 60000,
    generate: ({ state, dateStr, order }) => {
      const maxTransfer = Math.min(state.cash - 10000, 40000);
      const amount = pickRoundAmount(10000, maxTransfer, 5000);
      return {
        transaction: {
          id: `gen-tx-${order}`,
          order,
          date: dateStr,
          title: 'Bankaya Nakit Para Yatırılması',
          description: `İşletme kasasından ${fmt(amount)} nakit para alınarak bankadaki vadesiz ticari mevduat hesabına yatırılmıştır.`,
          amount,
          expectedEntry: {
            educationalNotes: 'Bankadaki mevduat arttığı için 102 Bankalar (Aktif) borçlandırılır; kasadan nakit çıktığı için 100 Kasa (Aktif) alacaklandırılır.',
            lines: [
              { accountCode: '102', debit: amount, credit: 0 },
              { accountCode: '100', debit: 0, credit: amount },
            ],
          },
          hints: [
            {
              level: 1,
              title: '1. Aşama: Etkilenen Unsurlar',
              content: 'İşletmenin iki farklı hazır değeri (Kasa ve Banka) arasında nakit yer değiştirmektedir.',
            },
            {
              level: 2,
              title: '2. Aşama: Hesap Karakterleri',
              content: '"100 Kasa" ve "102 Bankalar" hesaplarının her ikisi de Dönen Varlık (Aktif) karakterlidir.',
            },
            {
              level: 3,
              title: '3. Aşama: Artış ve Azalış Yönü',
              content: `Banka hesabımız arttığı için 102 Bankalar BORÇ (${fmt(amount)}); kasadaki nakit azaldığı için 100 Kasa ALACAK (${fmt(amount)}) kaydedilir.`,
            },
            {
              level: 4,
              title: '4. Aşama: Nihai Yevmiye Maddesi',
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

  // 2. Peşin Ticari Mal Alışı
  {
    id: 'purchase_cash',
    title: 'Peşin Ticari Mal Alımı',
    minDifficulty: 'Kolay',
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
            educationalNotes: 'Mal stoğumuz arttığı için 153 Ticari Mallar borçlandırılır; nakit ödeme nedeniyle 100 Kasa alacaklandırılır.',
            lines: [
              { accountCode: '153', debit: amount, credit: 0 },
              { accountCode: '100', debit: 0, credit: amount },
            ],
          },
          hints: [
            {
              level: 1,
              title: '1. Aşama: Etkilenen Unsurlar',
              content: 'İşletmeye yeni ticari mal girmiş, karşılığında kasadan nakit para ödenmiştir.',
            },
            {
              level: 2,
              title: '2. Aşama: Hesap Karakterleri',
              content: 'Satın alınan mallar için "153 Ticari Mallar" (Aktif); nakit ödeme için "100 Kasa" (Aktif) kullanılır.',
            },
            {
              level: 3,
              title: '3. Aşama: Artış ve Azalış Yönü',
              content: `Varlık artışı Borç (153: ${fmt(amount)}), varlık azalışı Alacak (100: ${fmt(amount)}) mantığı ile kaydedilir.`,
            },
            {
              level: 4,
              title: '4. Aşama: Nihai Yevmiye Maddesi',
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

  // 3. Banka Yoluyla (Havale ile) Ticari Mal Alışı
  {
    id: 'purchase_bank',
    title: 'Banka Aracılığıyla Mal Alımı',
    minDifficulty: 'Kolay',
    isApplicable: ({ state }) => state.bank >= 15000,
    generate: ({ state, dateStr, order }) => {
      const maxPurchase = Math.min(state.bank - 5000, 35000);
      const amount = pickRoundAmount(10000, maxPurchase, 5000);
      return {
        transaction: {
          id: `gen-tx-${order}`,
          order,
          date: dateStr,
          title: 'Bankadan Ödenerek Ticari Mal Alımı',
          description: `İşletme, toptancıdan ${fmt(amount)} tutarında ticari mal almış ve bedelini banka mevduat hesabından havale ile ödemiştir.`,
          amount,
          expectedEntry: {
            educationalNotes: 'Mal stoku arttığı için 153 Ticari Mallar borçlandırılır; bankadaki para eksildiği için 102 Bankalar alacaklandırılır.',
            lines: [
              { accountCode: '153', debit: amount, credit: 0 },
              { accountCode: '102', debit: 0, credit: amount },
            ],
          },
          hints: [
            {
              level: 1,
              title: '1. Aşama: Etkilenen Unsurlar',
              content: 'Depodaki ticari mallar artmış, banka hesabındaki para azalmıştır.',
            },
            {
              level: 2,
              title: '2. Aşama: Hesap Karakterleri',
              content: '"153 Ticari Mallar" ve "102 Bankalar" hesapları aktiftir.',
            },
            {
              level: 3,
              title: '3. Aşama: Artış ve Azalış Yönü',
              content: `153 Ticari Mallar hesabında artış → BORÇ (${fmt(amount)}). 102 Bankalar hesabında azalış → ALACAK (${fmt(amount)}).`,
            },
            {
              level: 4,
              title: '4. Aşama: Nihai Yevmiye Maddesi',
              content: `153 Ticari Mallar (Borç: ${fmt(amount)}) / 102 Bankalar (Alacak: ${fmt(amount)})`,
            },
          ],
        },
        applyState: (s) => {
          s.bank -= amount;
          s.inventory += amount;
        },
      };
    },
  },

  // 4. Veresiye (Kredili) Mal Alımı
  {
    id: 'purchase_credit',
    title: 'Veresiye (Kredili) Ticari Mal Alımı',
    minDifficulty: 'Orta',
    isApplicable: () => true,
    generate: ({ dateStr, order }) => {
      const amount = pickRoundAmount(15000, 35000, 5000);
      return {
        transaction: {
          id: `gen-tx-${order}`,
          order,
          date: dateStr,
          title: 'Veresiye Ticari Mal Alımı',
          description: `İşletme, satıcılardan ${fmt(amount)} tutarında ticari malı veresiye (bedeli sonra ödenmek üzere senetsiz) satın almıştır.`,
          amount,
          expectedEntry: {
            educationalNotes: 'Mal stoku arttığı için 153 Ticari Mallar borçlandırılır; satıcıya olan ticari borç arttığı için 320 Satıcılar alacaklandırılır.',
            lines: [
              { accountCode: '153', debit: amount, credit: 0 },
              { accountCode: '320', debit: 0, credit: amount },
            ],
          },
          hints: [
            {
              level: 1,
              title: '1. Aşama: Etkilenen Unsurlar',
              content: 'İşletmenin mal varlığı artmış ve satıcıya olan ticari borcu artmıştır.',
            },
            {
              level: 2,
              title: '2. Aşama: Hesap Karakterleri',
              content: 'Ticari mallar "153 Ticari Mallar" (Aktif); satıcılara olan borç "320 Satıcılar" (Kısa Vadeli Yabancı Kaynak / Pasif) hesabıdır.',
            },
            {
              level: 3,
              title: '3. Aşama: Artış ve Azalış Yönü',
              content: `Aktif hesaplar artınca BORÇ (153), Pasif borç hesapları artınca ALACAK (320) kaydedilir.`,
            },
            {
              level: 4,
              title: '4. Aşama: Nihai Yevmiye Maddesi',
              content: `153 Ticari Mallar (Borç: ${fmt(amount)}) / 320 Satıcılar (Alacak: ${fmt(amount)})`,
            },
          ],
        },
        applyState: (s) => {
          s.inventory += amount;
          s.payables += amount;
        },
      };
    },
  },

  // 5. Peşin Ticari Mal Satışı (Hasılat)
  {
    id: 'sale_cash',
    title: 'Peşin Ticari Mal Satışı',
    minDifficulty: 'Kolay',
    isApplicable: () => true,
    generate: ({ dateStr, order }) => {
      const amount = pickRoundAmount(20000, 50000, 5000);
      return {
        transaction: {
          id: `gen-tx-${order}`,
          order,
          date: dateStr,
          title: 'Peşin Mal Satışı Hasılatı',
          description: `İşletme, müşteriye ${fmt(amount)} tutarında ticari mal satmış ve bedelini nakit (peşin) olarak tahsil etmiştir.`,
          amount,
          expectedEntry: {
            educationalNotes: 'Kasaya nakit girdiği için 100 Kasa borçlandırılır; satış geliri hasılat doğurduğu için 600 Yurtiçi Satışlar alacaklandırılır.',
            lines: [
              { accountCode: '100', debit: amount, credit: 0 },
              { accountCode: '600', debit: 0, credit: amount },
            ],
          },
          hints: [
            {
              level: 1,
              title: '1. Aşama: Etkilenen Unsurlar',
              content: 'İşletmenin kasasına nakit girişi olmuş ve satış geliri (hasılat) elde edilmiştir.',
            },
            {
              level: 2,
              title: '2. Aşama: Hesap Karakterleri',
              content: 'Nakit tahsilat için "100 Kasa" (Aktif); satış hasılatı için "600 Yurtiçi Satışlar" (Gelir Tablosu Hesabı) kullanılır.',
            },
            {
              level: 3,
              title: '3. Aşama: Artış ve Azalış Yönü',
              content: `Kasaya para girdiğinde BORÇ (100). Gelir hesapları doğduğunda ve arttığında daima ALACAK (600) yazılır.`,
            },
            {
              level: 4,
              title: '4. Aşama: Nihai Yevmiye Maddesi',
              content: `100 Kasa (Borç: ${fmt(amount)}) / 600 Yurtiçi Satışlar (Alacak: ${fmt(amount)})`,
            },
          ],
        },
        applyState: (s) => {
          s.cash += amount;
          s.revenues += amount;
        },
      };
    },
  },

  // 6. Veresiye (Kredili) Mal Satışı
  {
    id: 'sale_credit',
    title: 'Veresiye (Kredili) Ticari Mal Satışı',
    minDifficulty: 'Orta',
    isApplicable: () => true,
    generate: ({ dateStr, order }) => {
      const amount = pickRoundAmount(15000, 40000, 5000);
      return {
        transaction: {
          id: `gen-tx-${order}`,
          order,
          date: dateStr,
          title: 'Veresiye Ticari Mal Satışı',
          description: `İşletme, müşteriye ${fmt(amount)} tutarında ticari malı veresiye (açık hesap, bedeli sonradan tahsil edilmek üzere) satmıştır.`,
          amount,
          expectedEntry: {
            educationalNotes: 'Müşteriden olan ticari alacak arttığı için 120 Alıcılar borçlandırılır; satış hasılatı için 600 Yurtiçi Satışlar alacaklandırılır.',
            lines: [
              { accountCode: '120', debit: amount, credit: 0 },
              { accountCode: '600', debit: 0, credit: amount },
            ],
          },
          hints: [
            {
              level: 1,
              title: '1. Aşama: Etkilenen Unsurlar',
              content: 'Müşteriden senetsiz ticari alacağımız doğmuş ve satış hasılatı gerçekleşmiştir.',
            },
            {
              level: 2,
              title: '2. Aşama: Hesap Karakterleri',
              content: 'Müşteriden alacak "120 Alıcılar" (Aktif); satış hasılatı "600 Yurtiçi Satışlar" (Gelir) hesabıdır.',
            },
            {
              level: 3,
              title: '3. Aşama: Artış ve Azalış Yönü',
              content: `Aktif alacak hesabındaki artış → BORÇ (120: ${fmt(amount)}). Hasılat geliri artışı → ALACAK (600: ${fmt(amount)}).`,
            },
            {
              level: 4,
              title: '4. Aşama: Nihai Yevmiye Maddesi',
              content: `120 Alıcılar (Borç: ${fmt(amount)}) / 600 Yurtiçi Satışlar (Alacak: ${fmt(amount)})`,
            },
          ],
        },
        applyState: (s) => {
          s.receivables += amount;
          s.revenues += amount;
        },
      };
    },
  },

  // 7. Müşteriden (Alıcılar) Nakit veya Banka Tahsilatı
  {
    id: 'collect_receivable',
    title: 'Müşteriden Alacağın Tahsili',
    minDifficulty: 'Orta',
    isApplicable: ({ state }) => state.receivables >= 10000,
    generate: ({ state, dateStr, order }) => {
      // Tamamını veya yuvarlak bir kısmını tahsil et
      const amount = state.receivables >= 20000 ? pickRoundAmount(10000, state.receivables, 5000) : state.receivables;
      return {
        transaction: {
          id: `gen-tx-${order}`,
          order,
          date: dateStr,
          title: 'Alıcılardan Alacağın Nakden Tahsili',
          description: `İşletme, daha önce veresiye mal sattığı müşterisinden ${fmt(amount)} tutarındaki alacağını nakit olarak tahsil etmiştir.`,
          amount,
          expectedEntry: {
            educationalNotes: 'Kasaya nakit para girdiği için 100 Kasa borçlandırılır; müşteriden olan alacak azaldığı (kapandığı) için 120 Alıcılar alacaklandırılır.',
            lines: [
              { accountCode: '100', debit: amount, credit: 0 },
              { accountCode: '120', debit: 0, credit: amount },
            ],
          },
          hints: [
            {
              level: 1,
              title: '1. Aşama: Etkilenen Unsurlar',
              content: 'Kasaya nakit para girmiş, buna karşılık müşteriden olan alacak bakiyesi azalmıştır.',
            },
            {
              level: 2,
              title: '2. Aşama: Hesap Karakterleri',
              content: '"100 Kasa" ve "120 Alıcılar" hesaplarının ikisi de Dönen Varlık (Aktif) hesabıdır.',
            },
            {
              level: 3,
              title: '3. Aşama: Artış ve Azalış Yönü',
              content: `Kasadaki artış BORÇ (100). Alacak varlığındaki azalış ise ALACAK (120) olarak kaydedilir.`,
            },
            {
              level: 4,
              title: '4. Aşama: Nihai Yevmiye Maddesi',
              content: `100 Kasa (Borç: ${fmt(amount)}) / 120 Alıcılar (Alacak: ${fmt(amount)})`,
            },
          ],
        },
        applyState: (s) => {
          s.cash += amount;
          s.receivables -= amount;
        },
      };
    },
  },

  // 8. Satıcıya Olan Borcun Bankadan Ödenmesi
  {
    id: 'pay_supplier_bank',
    title: 'Satıcılara Borcun Bankadan Ödenmesi',
    minDifficulty: 'Orta',
    isApplicable: ({ state }) => state.payables >= 10000 && state.bank >= 10000,
    generate: ({ state, dateStr, order }) => {
      const maxPayment = Math.min(state.payables, state.bank);
      const amount = maxPayment >= 20000 ? pickRoundAmount(10000, maxPayment, 5000) : maxPayment;
      return {
        transaction: {
          id: `gen-tx-${order}`,
          order,
          date: dateStr,
          title: 'Satıcıya Olan Borcun Bankadan Ödenmesi',
          description: `İşletme, satıcılara olan veresiye borcunun ${fmt(amount)} tutarındaki kısmını banka mevduat hesabından havale çıkararak ödemiştir.`,
          amount,
          expectedEntry: {
            educationalNotes: 'Satıcılara olan borç eksildiği için pasif hesap olan 320 Satıcılar borçlandırılır; bankadaki mevduat azaldığı için 102 Bankalar alacaklandırılır.',
            lines: [
              { accountCode: '320', debit: amount, credit: 0 },
              { accountCode: '102', debit: 0, credit: amount },
            ],
          },
          hints: [
            {
              level: 1,
              title: '1. Aşama: Etkilenen Unsurlar',
              content: 'Satıcıya olan borcumuz kapanmakta ve banka hesabımızdan para çıkmaktadır.',
            },
            {
              level: 2,
              title: '2. Aşama: Hesap Karakterleri',
              content: 'Satıcı borcu "320 Satıcılar" (Pasif); banka parası "102 Bankalar" (Aktif) hesabıdır.',
            },
            {
              level: 3,
              title: '3. Aşama: Artış ve Azalış Yönü',
              content: `Pasif hesaplar azaldığında BORÇ kaydedilir (320: ${fmt(amount)}). Aktif hesaplar azaldığında ALACAK kaydedilir (102: ${fmt(amount)}).`,
            },
            {
              level: 4,
              title: '4. Aşama: Nihai Yevmiye Maddesi',
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

  // 9. Nakit Kira Gideri Ödenmesi
  {
    id: 'expense_rent',
    title: 'Kira Giderinin Nakit Ödenmesi',
    minDifficulty: 'Kolay',
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
          description: `İşletme faaliyetlerinin yürütüldüğü idari ofisin ${fmt(amount)} tutarındaki aylık kira bedeli kasadan nakit olarak ödenmiştir.`,
          amount,
          expectedEntry: {
            educationalNotes: 'Giderler ortaya çıktığında daima borçlandırılır (770); kasadan para çıktığı için aktif hesap 100 Kasa alacaklandırılır.',
            lines: [
              { accountCode: '770', debit: amount, credit: 0 },
              { accountCode: '100', debit: 0, credit: amount },
            ],
          },
          hints: [
            {
              level: 1,
              title: '1. Aşama: Etkilenen Unsurlar',
              content: 'İşletme bir yönetim gideri yapmış ve kasasından nakit çıkmıştır.',
            },
            {
              level: 2,
              title: '2. Aşama: Hesap Karakterleri',
              content: 'Kira için "770 Genel Yönetim Giderleri" (Gider); nakit için "100 Kasa" (Aktif) kullanılır.',
            },
            {
              level: 3,
              title: '3. Aşama: Artış ve Azalış Yönü',
              content: `Gider hesapları doğduğunda kural gereği BORÇ (770). Kasadaki nakit azaldığı için ALACAK (100) kaydedilir.`,
            },
            {
              level: 4,
              title: '4. Aşama: Nihai Yevmiye Maddesi',
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

  // 10. Bankadan Elektrik/İnternet/Fatura Gideri Ödenmesi
  {
    id: 'expense_utility_bank',
    title: 'İdari Faturaların Bankadan Ödenmesi',
    minDifficulty: 'Kolay',
    isApplicable: ({ state }) => state.bank >= 8000,
    generate: ({ state, dateStr, order }) => {
      const maxUtil = Math.min(state.bank - 3000, 10000);
      const amount = pickRoundAmount(3000, Math.max(3000, maxUtil), 1000);
      return {
        transaction: {
          id: `gen-tx-${order}`,
          order,
          date: dateStr,
          title: 'Elektrik ve İletişim Faturalarının Bankadan Ödenmesi',
          description: `İşletmenin yönetim ofisine ait ${fmt(amount)} tutarındaki elektrik ve internet faturası banka hesabından otomatik ödeme ile karşılanmıştır.`,
          amount,
          expectedEntry: {
            educationalNotes: 'Dönem yönetim gideri tahakkuk ettiği için 770 Genel Yönetim Giderleri borçlandırılır; bankadaki mevduat azaldığı için 102 Bankalar alacaklandırılır.',
            lines: [
              { accountCode: '770', debit: amount, credit: 0 },
              { accountCode: '102', debit: 0, credit: amount },
            ],
          },
          hints: [
            {
              level: 1,
              title: '1. Aşama: Etkilenen Unsurlar',
              content: 'İdari faaliyet faturası ödenmiş ve bankadaki paramız azalmıştır.',
            },
            {
              level: 2,
              title: '2. Aşama: Hesap Karakterleri',
              content: 'Fatura için "770 Genel Yönetim Giderleri" (Gider); banka için "102 Bankalar" (Aktif) kullanılır.',
            },
            {
              level: 3,
              title: '3. Aşama: Artış ve Azalış Yönü',
              content: `Gider artışı BORÇ (770: ${fmt(amount)}). Banka mevduatı azalışı ALACAK (102: ${fmt(amount)}).`,
            },
            {
              level: 4,
              title: '4. Aşama: Nihai Yevmiye Maddesi',
              content: `770 Genel Yönetim Giderleri (Borç: ${fmt(amount)}) / 102 Bankalar (Alacak: ${fmt(amount)})`,
            },
          ],
        },
        applyState: (s) => {
          s.bank -= amount;
          s.expenses += amount;
        },
      };
    },
  },

  // 11. Demirbaş Alımı (İleri Düzey)
  {
    id: 'fixture_purchase',
    title: 'Ofis Demirbaşı Satın Alınması',
    minDifficulty: 'İleri',
    isApplicable: ({ state }) => state.bank >= 20000,
    generate: ({ state, dateStr, order }) => {
      const maxAmount = Math.min(state.bank - 5000, 30000);
      const amount = pickRoundAmount(10000, Math.max(10000, maxAmount), 5000);
      return {
        transaction: {
          id: `gen-tx-${order}`,
          order,
          date: dateStr,
          title: 'Ofis Bilgisayar ve Demirbaş Alımı',
          description: `İşletme, ofis işlerinde kullanılmak üzere ${fmt(amount)} tutarında bilgisayar ve ofis mobilyası almış, bedeli bankadan havale edilmiştir.`,
          amount,
          expectedEntry: {
            educationalNotes: 'Duran varlık niteliğindeki demirbaşlar arttığı için 255 Demirbaşlar borçlandırılır; bankadaki mevduat çıktığı için 102 Bankalar alacaklandırılır.',
            lines: [
              { accountCode: '255', debit: amount, credit: 0 },
              { accountCode: '102', debit: 0, credit: amount },
            ],
          },
          hints: [
            {
              level: 1,
              title: '1. Aşama: Etkilenen Unsurlar',
              content: 'İşletme satmak için değil kullanmak üzere demirbaş almış ve bankadan ödeme yapmıştır.',
            },
            {
              level: 2,
              title: '2. Aşama: Hesap Karakterleri',
              content: 'Demirbaş "255 Demirbaşlar" (Duran Varlık / Aktif); banka "102 Bankalar" (Dönen Varlık / Aktif) hesabıdır.',
            },
            {
              level: 3,
              title: '3. Aşama: Artış ve Azalış Yönü',
              content: `Duran varlık artışı BORÇ (255: ${fmt(amount)}). Banka varlığı azalışı ALACAK (102: ${fmt(amount)}).`,
            },
            {
              level: 4,
              title: '4. Aşama: Nihai Yevmiye Maddesi',
              content: `255 Demirbaşlar (Borç: ${fmt(amount)}) / 102 Bankalar (Alacak: ${fmt(amount)})`,
            },
          ],
        },
        applyState: (s) => {
          s.fixtures += amount;
          s.bank -= amount;
        },
      };
    },
  },

  // 12. Senetli Mal Alışı (İleri Düzey)
  {
    id: 'note_purchase',
    title: 'Senet Verilerek Ticari Mal Alımı',
    minDifficulty: 'İleri',
    isApplicable: () => true,
    generate: ({ dateStr, order }) => {
      const amount = pickRoundAmount(15000, 30000, 5000);
      return {
        transaction: {
          id: `gen-tx-${order}`,
          order,
          date: dateStr,
          title: 'Senet Tanzim Edilerek Mal Alımı',
          description: `İşletme, ${fmt(amount)} tutarında ticari mal almış ve karşılığında 60 gün vadeli kendi borç senedini tanzim edip vermiştir.`,
          amount,
          expectedEntry: {
            educationalNotes: 'Mal stoku arttığı için 153 Ticari Mallar borçlandırılır; imzalanıp verilen senet ticari borç senedi doğurduğu için 321 Borç Senetleri alacaklandırılır.',
            lines: [
              { accountCode: '153', debit: amount, credit: 0 },
              { accountCode: '321', debit: 0, credit: amount },
            ],
          },
          hints: [
            {
              level: 1,
              title: '1. Aşama: Etkilenen Unsurlar',
              content: 'Depodaki mal artmış ve senetli ticari borcumuz artmıştır.',
            },
            {
              level: 2,
              title: '2. Aşama: Hesap Karakterleri',
              content: 'Mallar "153 Ticari Mallar" (Aktif); verilen senet "321 Borç Senetleri" (Pasif) hesabıdır.',
            },
            {
              level: 3,
              title: '3. Aşama: Artış ve Azalış Yönü',
              content: `Aktif varlık artışı BORÇ (153). Pasif borç senedi artışı ALACAK (321).`,
            },
            {
              level: 4,
              title: '4. Aşama: Nihai Yevmiye Maddesi',
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

  // 13. Senetli Mal Satışı (İleri Düzey)
  {
    id: 'note_sale',
    title: 'Senet Alınarak Ticari Mal Satışı',
    minDifficulty: 'İleri',
    isApplicable: () => true,
    generate: ({ dateStr, order }) => {
      const amount = pickRoundAmount(20000, 45000, 5000);
      return {
        transaction: {
          id: `gen-tx-${order}`,
          order,
          date: dateStr,
          title: 'Senet Alınarak Mal Satışı',
          description: `İşletme, müşteriye ${fmt(amount)} tutarında ticari mal satmış ve karşılığında 90 gün vadeli alacak senedi teslim almıştır.`,
          amount,
          expectedEntry: {
            educationalNotes: 'Müşteriden alınan senet ticari alacak senedini arttırdığı için 121 Alacak Senetleri borçlandırılır; satış hasılatı için 600 Yurtiçi Satışlar alacaklandırılır.',
            lines: [
              { accountCode: '121', debit: amount, credit: 0 },
              { accountCode: '600', debit: 0, credit: amount },
            ],
          },
          hints: [
            {
              level: 1,
              title: '1. Aşama: Etkilenen Unsurlar',
              content: 'Elimizdeki senetli alacak artmış ve satış hasılatı gerçekleşmiştir.',
            },
            {
              level: 2,
              title: '2. Aşama: Hesap Karakterleri',
              content: 'Alınan senet "121 Alacak Senetleri" (Aktif); satış hasılatı "600 Yurtiçi Satışlar" (Gelir) hesabıdır.',
            },
            {
              level: 3,
              title: '3. Aşama: Artış ve Azalış Yönü',
              content: `Aktif senet varlığı artışı BORÇ (121). Satış geliri artışı ALACAK (600).`,
            },
            {
              level: 4,
              title: '4. Aşama: Nihai Yevmiye Maddesi',
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

// Ana Senaryo Üretim Motoru
export function generateScenario(config: GeneratorConfig): CompanyScenario {
  const companyName = config.companyName?.trim() || pickRandom(COMPANY_NAMES);
  const difficulty = config.difficulty;
  const targetCount = Math.max(3, Math.min(10, config.transactionCount || 5));

  // 1. Sanal Defter Durumunu Başlat
  const state: VirtualLedgerState = {
    cash: 0,
    bank: 0,
    receivables: 0,
    notesReceivable: 0,
    inventory: 0,
    fixtures: 0,
    bankLoans: 0,
    payables: 0,
    notesPayable: 0,
    capital: 0,
    revenues: 0,
    expenses: 0,
  };

  // 2. Kuruluş Sermayesini Belirle
  const initialCapital = pickRoundAmount(100000, 200000, 25000);
  const establishedDate = '01.11.2026';

  // Kuruluş İşlemini Oluştur (1. İşlem her zaman kuruluştur)
  const tx1: CommercialTransaction = {
    id: 'gen-tx-1',
    order: 1,
    date: '01.11.2026',
    title: 'İşletmenin Nakit Sermaye ile Kuruluşu',
    description: `${companyName}, sahibi tarafından ${fmt(initialCapital)} nakit sermaye tahsis edilerek kurulmuştur. Nakit para kasaya konulmuştur.`,
    amount: initialCapital,
    expectedEntry: {
      educationalNotes: 'Kasaya nakit girişi olduğu için 100 Kasa (Aktif) borçlandırılır; işletmeye kaynak sağlandığı için 500 Sermaye (Özkaynak) alacaklandırılır.',
      lines: [
        { accountCode: '100', debit: initialCapital, credit: 0 },
        { accountCode: '500', debit: 0, credit: initialCapital },
      ],
    },
    hints: [
      {
        level: 1,
        title: '1. Aşama: Etkilenen Unsurlar',
        content: 'İşletmenin kasasındaki nakit para ile şirketin özkaynağı (sermaye) artmaktadır.',
      },
      {
        level: 2,
        title: '2. Aşama: Hesap Karakterleri',
        content: 'Nakit para "100 Kasa" (Aktif); taahhüt edilen özkaynak "500 Sermaye" (Pasif / Özkaynak) hesabında izlenir.',
      },
      {
        level: 3,
        title: '3. Aşama: Artış ve Azalış Yönü',
        content: `Kasadaki nakit artışı BORÇ (100: ${fmt(initialCapital)}). Özkaynaktaki artış ALACAK (500: ${fmt(initialCapital)}).`,
      },
      {
        level: 4,
        title: '4. Aşama: Nihai Yevmiye Maddesi',
        content: `100 Kasa (Borç: ${fmt(initialCapital)}) / 500 Sermaye (Alacak: ${fmt(initialCapital)})`,
      },
    ],
  };

  // Sanal duruma kuruluşu uygula
  state.cash = initialCapital;
  state.capital = initialCapital;

  const transactions: CommercialTransaction[] = [tx1];
  let currentDateDay = 3;
  let lastUsedArchetypeId = '';

  // Zorluk seviyesi kısıtı filtresi
  const difficultyRank: Record<'Kolay' | 'Orta' | 'İleri', number> = {
    Kolay: 1,
    Orta: 2,
    İleri: 3,
  };
  const currentRank = difficultyRank[difficulty];

  // Kalan (targetCount - 1) adet işlemi sırayla üret
  for (let order = 2; order <= targetCount; order++) {
    const dateStr = `${currentDateDay < 10 ? '0' : ''}${currentDateDay}.11.2026`;
    currentDateDay += Math.floor(Math.random() * 2) + 2; // 2 veya 3 gün ileri git

    const ctx: ArchetypeContext = {
      state,
      dateStr,
      order,
      difficulty,
    };

    // Mevcut sanal duruma ve zorluğa uygun şablonları filtrele
    const eligibleArchetypes = ARCHETYPES.filter((arch) => {
      // Zorluk kontrolü
      if (difficultyRank[arch.minDifficulty] > currentRank) return false;
      // Peş peşe aynı işlemi üretmeyi engelle
      if (arch.id === lastUsedArchetypeId) return false;
      // Sanal durum şartı kontrolü (kasa/banka yetiyor mu, borç/alacak var mı?)
      return arch.isApplicable(ctx);
    });

    // Eğer filtre sonucu boşsa (nadir durum), zorunlu olarak peşin mal satışı veya bankaya yatırma gibi güvenli bir işlem seç
    let chosenArchetype = eligibleArchetypes.length > 0 ? pickRandom(eligibleArchetypes) : ARCHETYPES[4]; // Peşin satış her zaman güvenlidir

    const generated = chosenArchetype.generate(ctx);
    generated.applyState(state);
    transactions.push(generated.transaction);
    lastUsedArchetypeId = chosenArchetype.id;
  }

  // Otomatik Öğrenme Kazanımları Çıkar
  const touchedAccounts = new Set<string>();
  transactions.forEach((tx) => {
    tx.expectedEntry.lines.forEach((l) => touchedAccounts.add(l.accountCode));
  });

  const learningObjectives: string[] = [
    'Kuruluş sermayesinin varlık ve özkaynak hesaplarına doğru kaydedilmesi',
  ];
  if (touchedAccounts.has('153')) learningObjectives.push('153 Ticari Mallar hesabının borç ve alacak işleyişi');
  if (touchedAccounts.has('102')) learningObjectives.push('Banka ve Kasa arasındaki likit varlık transferleri');
  if (touchedAccounts.has('320')) learningObjectives.push('Veresiye mal alımında 320 Satıcılar borç ilişkisi');
  if (touchedAccounts.has('120')) learningObjectives.push('Kredili satışlarda 120 Alıcılar alacak takibi');
  if (touchedAccounts.has('600')) learningObjectives.push('600 Yurtiçi Satışlar hesabının gelir tablosu mantığı');
  if (touchedAccounts.has('770')) learningObjectives.push('770 Genel Yönetim Giderleri hesabının daima borçlanma kuralı');
  if (touchedAccounts.has('255')) learningObjectives.push('255 Demirbaşlar ile duran varlık muhasebesi');
  if (touchedAccounts.has('321') || touchedAccounts.has('121')) learningObjectives.push('Kambiyo senetlerinin (Borç/Alacak Senetleri) muhasebeleştirilmesi');

  const id = `generated-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

  return {
    id,
    title: `${companyName} (${difficulty} Seviye Simülasyon)`,
    difficulty,
    companyName,
    establishedDate,
    initialCapital,
    description: `Algoritma tarafından özel olarak türetilmiş, ${targetCount} işlemden oluşan dinamik ${difficulty.toLowerCase()} seviye muhasebe simülasyonu.`,
    learningObjectives,
    transactions,
  };
}
