export interface HeroVoucherScenario {
  id: string;
  pillLabel: string;
  caseFileCode: string;
  invoiceBadge: string;
  invoiceMeta: string;
  transactionTypeBadge: string;
  sellerName: string;
  sellerVkn: string;
  buyerName: string;
  buyerVkn: string;
  subtotalLabel: string;
  subtotalAmount: string;
  taxLabel: string;
  taxAmount: string;
  totalAmount: string;
  entryNo: string;
  entryDate: string;
  journalLines: {
    code: string;
    name: string;
    subtitle: string;
    debit: string;
    credit: string;
    side: 'DEBIT' | 'CREDIT';
  }[];
  tAccountLeft: {
    title: string;
    debitAmount: string;
    debitNote: string;
    creditAmount: string;
    creditNote: string;
  };
  tAccountRight: {
    title: string;
    debitAmount: string;
    debitNote: string;
    creditAmount: string;
    creditNote: string;
  };
  socraticQuestion: string;
  socraticStep1: string;
  socraticStep2: string;
}

export interface OperationalStepItem {
  stepNumber: string;
  vukReference: string;
  title: string;
  description: string;
  badgeStyle: 'terracotta' | 'deep-terracotta' | 'charcoal' | 'jade';
}

export interface TdhpDossierTile {
  code: string;
  tag: string;
  name: string;
  description: string;
  rule: string;
  isFocal?: boolean;
}

export interface TdhpClassAtlasItem {
  classId: number;
  tabLabel: string;
  polarityTitle: string;
  increaseSide: 'BORÇ (+)' | 'ALACAK (+)';
  decreaseSide: 'ALACAK (-)' | 'BORÇ (-)';
  balanceRule: string;
  tiles: TdhpDossierTile[];
}

export const HERO_VOUCHER_SCENARIOS: HeroVoucherScenario[] = [
  {
    id: 'kurulus-sermaye',
    pillLabel: '01 • Kuruluş & Sermaye Kaydı',
    caseFileCode: 'ÖRNEK SORU #01 • AÇILIŞ KAYDI',
    invoiceBadge: 'KURULUŞ SÖZLEŞMESİ • AÇILIŞ FİŞİ',
    invoiceMeta: 'Tarih: 01.10.2026 • Konu: Şirket Kuruluşu (Kasa + Banka)',
    transactionTypeBadge: 'Nakit + Banka Sermaye',
    sellerName: 'Kurucu Ortaklar',
    sellerVkn: 'Sermaye Koyma Taahhüdü',
    buyerName: 'ABC Ticaret İşletmesi',
    buyerVkn: 'Yeni Kurulan İşletme',
    subtotalLabel: 'Kasaya Konulan Nakit Para (100):',
    subtotalAmount: '250.000,00 ₺',
    taxLabel: 'Bankaya Yatırılan Mevduat (102):',
    taxAmount: '250.000,00 ₺',
    totalAmount: '500.000,00 ₺',
    entryNo: '001',
    entryDate: '01.10.2026',
    journalLines: [
      {
        code: '100',
        name: 'KASA HESABI',
        subtitle: 'Kasaya para girdi (Varlık Artışı → Sol / Borç)',
        debit: '250.000,00',
        credit: '—',
        side: 'DEBIT',
      },
      {
        code: '102',
        name: 'BANKALAR HESABI',
        subtitle: 'Bankadaki para arttı (Varlık Artışı → Sol / Borç)',
        debit: '250.000,00',
        credit: '—',
        side: 'DEBIT',
      },
      {
        code: '500',
        name: 'SERMAYE HESABI',
        subtitle: 'Şirketin öz sermayesi oluştu (Kaynak Artışı → Sağ / Alacak)',
        debit: '—',
        credit: '500.000,00',
        side: 'CREDIT',
      },
    ],
    tAccountLeft: {
      title: '100 KASA HESABI (BORÇLU)',
      debitAmount: '250.000 ₺',
      debitNote: '(+) Kasaya Giriş',
      creditAmount: '0,00 ₺',
      creditNote: '(-) Çıkış Yok',
    },
    tAccountRight: {
      title: '500 SERMAYE (ALACAKLI)',
      debitAmount: '0,00 ₺',
      debitNote: '(-) Azalış Yok',
      creditAmount: '500.000 ₺',
      creditNote: '(+) Sermaye Kaynağı',
    },
    socraticQuestion: '"100 Kasa neden Borç (Sol), 500 Sermaye neden Alacak (Sağ) yazıldı?"',
    socraticStep1:
      'Kasaya ve bankaya para girdiğinde işletmenin varlıkları artar. Varlık (1. ve 2. grup) hesaplarında her artış SOL (BORÇ) tarafa yazılır.',
    socraticStep2:
      'Bu paranın kaynağı ortakların koyduğu sermayedir. Kaynak ve Sermaye (3, 4 ve 5. grup) hesaplarında her artış SAĞ (ALACAK) tarafa yazılır.',
  },
  {
    id: 'cek-ile-mal-alisi',
    pillLabel: '02 • Çek Vererek Mal Alışı (103 + KDV)',
    caseFileCode: 'ÖRNEK SORU #02 • ÇEK KEŞİDESİ & KDV',
    invoiceBadge: 'ALIŞ FATURASI & ÇEK YAPRAĞI #084',
    invoiceMeta: 'Tarih: 14.10.2026 • Konu: Çek Düzenleyip Mal Alımı (+%20 KDV)',
    transactionTypeBadge: 'Çekle Mal Alışı (103 -)',
    sellerName: 'Marmara Tedarik A.Ş.',
    sellerVkn: 'Satıcı Firma',
    buyerName: 'Anadolu Ticaret A.Ş.',
    buyerVkn: 'Alıcı (Çeki Düzenleyen Biziz)',
    subtotalLabel: 'Alınan Ticari Mal Bedeli (153):',
    subtotalAmount: '100.000,00 ₺',
    taxLabel: 'Alışta Ödenen %20 KDV (191):',
    taxAmount: '20.000,00 ₺',
    totalAmount: '120.000,00 ₺',
    entryNo: '002',
    entryDate: '14.10.2026',
    journalLines: [
      {
        code: '153',
        name: 'TİCARİ MALLAR',
        subtitle: 'Depoya KDV hariç mal girdi (Varlık Artışı → Borç)',
        debit: '100.000,00',
        credit: '—',
        side: 'DEBIT',
      },
      {
        code: '191',
        name: 'İNDİRİLECEK KDV',
        subtitle: 'Alışta ödenen %20 KDV (Devletten KDV Alacağı → Borç)',
        debit: '20.000,00',
        credit: '—',
        side: 'DEBIT',
      },
      {
        code: '103',
        name: 'VERİLEN ÇEKLER VE ÖDEME EMİRLERİ (-)',
        subtitle: 'Kendi çekimizi verdik (Düzenleyici Hesap → Alacak)',
        debit: '—',
        credit: '120.000,00',
        side: 'CREDIT',
      },
    ],
    tAccountLeft: {
      title: '153 TİCARİ MALLAR (BORÇLU)',
      debitAmount: '100.000 ₺',
      debitNote: '(+) Mal Girişi',
      creditAmount: '0,00 ₺',
      creditNote: '(-) Çıkış Yok',
    },
    tAccountRight: {
      title: '103 VERİLEN ÇEKLER (-) (ALACAKLI)',
      debitAmount: '0,00 ₺',
      debitNote: '(-) Bankadan Ödenince',
      creditAmount: '120.000 ₺',
      creditNote: '(+) Çek Keşidesi',
    },
    socraticQuestion: '"Kendi çekimizi verdiğimizde neden 101 değil de 103 Verilen Çekler (-) Alacak yazılır?"',
    socraticStep1:
      '101 Alınan Çekler müşteriden aldığımız çektir. Biz kendi çek karnemizden çek yazıp (keşide edip) satıcıya verdiğimizde 103 Verilen Çekler (-) kullanılır.',
    socraticStep2:
      '103 sonunda (-) işareti olan düzenleyici bir hesaptır: Bankamızdan para çıkacağını gösterdiği için pasif gibi SAĞ (ALACAK) taraftan açılır!',
  },
  {
    id: 'musteri-ceki-satis',
    pillLabel: '03 • Müşteri Çekiyle Satış (101 + 391)',
    caseFileCode: 'ÖRNEK SORU #03 • ÇEKLE SATIŞ & KDV',
    invoiceBadge: 'SATIŞ FATURASI & MÜŞTERİ ÇEKİ #119',
    invoiceMeta: 'Tarih: 21.10.2026 • Konu: Müşteriden Çek Alarak Satış (+%20 KDV)',
    transactionTypeBadge: 'Müşteri Çeki (101) + Satış',
    sellerName: 'Anadolu Ticaret A.Ş.',
    sellerVkn: 'Satıcı (Bizim İşletmemiz)',
    buyerName: 'Ege Perakende Ltd.',
    buyerVkn: 'Müşteri (Çeki Veren Taraf)',
    subtotalLabel: 'Yurtiçi Mal Satış Geliri (600):',
    subtotalAmount: '150.000,00 ₺',
    taxLabel: 'Müşteriden Tahsil Edilen %20 KDV (391):',
    taxAmount: '30.000,00 ₺',
    totalAmount: '180.000,00 ₺',
    entryNo: '003',
    entryDate: '21.10.2026',
    journalLines: [
      {
        code: '101',
        name: 'ALINAN ÇEKLER HESABI',
        subtitle: 'Müşteriden çek aldık (Varlık Artışı → Sol / Borç)',
        debit: '180.000,00',
        credit: '—',
        side: 'DEBIT',
      },
      {
        code: '600',
        name: 'YURTİÇİ SATIŞLAR',
        subtitle: 'Satış geliri doğdu (Gelir Artışı → Sağ / Alacak)',
        debit: '—',
        credit: '150.000,00',
        side: 'CREDIT',
      },
      {
        code: '391',
        name: 'HESAPLANAN KDV',
        subtitle: 'Satışta hesaplanan %20 KDV (Vergi Borcu → Sağ / Alacak)',
        debit: '—',
        credit: '30.000,00',
        side: 'CREDIT',
      },
    ],
    tAccountLeft: {
      title: '101 ALINAN ÇEKLER (BORÇLU)',
      debitAmount: '180.000 ₺',
      debitNote: '(+) Çek Girişi',
      creditAmount: '0,00 ₺',
      creditNote: '(-) Tahsil / Ciro',
    },
    tAccountRight: {
      title: '600 YURTİÇİ SATIŞLAR (ALACAKLI)',
      debitAmount: '0,00 ₺',
      debitNote: '(-) İade Yok',
      creditAmount: '150.000 ₺',
      creditNote: '(+) Satış Geliri',
    },
    socraticQuestion: '"Müşteriden aldığımız çeki başka bir satıcıya ciro edersek hangi hesap kapanır?"',
    socraticStep1:
      'Müşteriden çek aldığımızda 101 Alınan Çekler hesabının BORÇ (Sol) tarafına yazmıştık.',
    socraticStep2:
      'Bu çeki kendi çekimizle karıştırmayız! Başkasına ciro ettiğimizde veya bankadan tahsil ettiğimizde yine 101 Alınan Çekler ALACAK (Sağ) yazılarak kapatılır.',
  },
];

export const OPERATIONAL_STEPS: OperationalStepItem[] = [
  {
    stepNumber: '1',
    vukReference: '1. Adım: Soru Analizi',
    title: 'Soruyu & Belgeyi Oku',
    description:
      'İşlemde ne alınıp satıldığını, ödemenin nakit (100), banka (102), müşteri çeki (101) veya kendi çekimizle (103) mi yapıldığını belirle.',
    badgeStyle: 'terracotta',
  },
  {
    stepNumber: '2',
    vukReference: '2. Adım: Sol = Sağ',
    title: 'Yevmiye Defterine Yaz',
    description:
      'Artan varlıkları ve giderleri SOL (Borç) tarafa; artan borçları, sermayeyi ve satış gelirlerini SAĞ (Alacak) tarafa kaydet.',
    badgeStyle: 'deep-terracotta',
  },
  {
    stepNumber: '3',
    vukReference: '3. Adım: T-Cetveli',
    title: 'Büyük Deftere (T) Aktar',
    description:
      'Yevmiye kaydındaki rakamları her hesabın kendi T-cetveline taşı; istersen otomatik izle, istersen "Kendin Doldur" modunda çöz.',
    badgeStyle: 'charcoal',
  },
  {
    stepNumber: '4',
    vukReference: '4. Adım: Bilanço Eşitliği',
    title: 'Mizan & Bilançoyu Eşitle',
    description:
      'Borç ve Alacak toplamlarını kontrol et; Varlıklar (Aktif) = Kaynaklar (Pasif) eşitliğini kendi elinle kurarak soruyu tamamla.',
    badgeStyle: 'jade',
  },
];

export const TDHP_CLASS_ATLAS: TdhpClassAtlasItem[] = [
  {
    classId: 1,
    tabLabel: '1. DÖNEN VARLIKLAR (100-199)',
    polarityTitle: '1 ile Başlayan Varlık Hesapları (Kasa, Çek, Banka, Mal):',
    increaseSide: 'BORÇ (+)',
    decreaseSide: 'ALACAK (-)',
    balanceRule: 'İstisna: 103 Verilen Çekler (-) düzenleyicidir, Alacak çalışır!',
    tiles: [
      {
        code: '100',
        tag: 'Nakit Para',
        name: 'KASA HESABI',
        description: 'Kasaya nakit para girdiğinde Borç (Sol), kasadan nakit ödendiğinde Alacak (Sağ) yazılır.',
        rule: 'Para Girişi: Borç / Çıkışı: Alacak',
      },
      {
        code: '101',
        tag: 'Müşteri Çeki',
        name: 'ALINAN ÇEKLER',
        description: 'Müşteriden çek aldığımızda Borçlanır; çeki tahsil ettiğimizde veya ciro ettiğimizde Alacaklanır.',
        rule: 'Çek Alınca: Borç / Ciroda: Alacak',
      },
      {
        code: '103',
        tag: 'Sınav Odaklı (-)',
        name: 'VERİLEN ÇEKLER (-)',
        description: 'Kendi çekimizi düzenleyip (keşide edip) verdiğimizde kullanılır. Sonunda (-) olduğu için ters çalışır!',
        rule: 'Çek Verince: Alacak / Ödenince: Borç',
        isFocal: true,
      },
      {
        code: '153',
        tag: 'Stok / Mal',
        name: 'TİCARİ MALLAR',
        description: 'Satmak için aldığımız mallar KDV hariç tutarıyla Borç (Sol) tarafa kaydedilir.',
        rule: 'Mal Alışı: Borç / Çıkışı: Alacak',
      },
      {
        code: '191',
        tag: 'Alış KDV',
        name: 'İNDİRİLECEK KDV',
        description: 'Mal veya gider faturası aldığımızda ödediğimiz KDV tutarı her zaman Borç (Sol) yazılır.',
        rule: 'Alışta: Borç / Ay Sonu: Alacak',
      },
    ],
  },
  {
    classId: 2,
    tabLabel: '2. DURAN VARLIKLAR (250-257)',
    polarityTitle: '2 ile Başlayan Uzun Ömürlü Varlıklar (Bina, Taşıt, Demirbaş):',
    increaseSide: 'BORÇ (+)',
    decreaseSide: 'ALACAK (-)',
    balanceRule: 'İstisna: 257 Birikmiş Amortismanlar (-) Alacak çalışır!',
    tiles: [
      {
        code: '252',
        tag: 'Gayrimenkul',
        name: 'BİNALAR',
        description: 'Şirketin kullanmak için satın aldığı mağaza, depo ve ofis binaları.',
        rule: 'Alındığında Borç (Sol) yazılır',
      },
      {
        code: '253',
        tag: 'Üretim',
        name: 'TESİS, MAKİNE VE CİHAZLAR',
        description: 'Üretimde kullanılan fabrika makineleri ve iş ekipmanları.',
        rule: 'Alındığında Borç (Sol) yazılır',
      },
      {
        code: '254',
        tag: 'Aktif Odak',
        name: 'TAŞITLAR',
        description: 'Şirket işlerinde kullanılmak üzere alınan kamyonet, otomobil ve ticari araçlar.',
        rule: 'Alımda: Borç / Satışta: Alacak',
        isFocal: true,
      },
      {
        code: '255',
        tag: 'Ofis Eşyası',
        name: 'DEMİRBAŞLAR',
        description: 'Bilgisayar, masa, koltuk, klima ve yazar kasa gibi ofis eşyaları.',
        rule: 'Alındığında Borç (Sol) yazılır',
      },
      {
        code: '257',
        tag: 'Düzenleyici (-)',
        name: 'BİRİKMİŞ AMORTİSMANLAR (-)',
        description: 'Duran varlıkların yıl sonu yıpranma payı. Bilançoda varlıkları eksi (-) olarak azaltır.',
        rule: 'Yıpranma ayrıldığında Alacaklanır',
      },
    ],
  },
  {
    classId: 3,
    tabLabel: '3. KISA VADELİ BORÇLAR (300-391)',
    polarityTitle: '3 ile Başlayan Kısa Vadeli Borç Hesapları (1 Yıldan Kısa):',
    increaseSide: 'ALACAK (+)',
    decreaseSide: 'BORÇ (-)',
    balanceRule: 'Kural: Borçlarımız arttığında SAĞ (Alacak) tarafa yazılır',
    tiles: [
      {
        code: '300',
        tag: 'Banka Borcu',
        name: 'BANKA KREDİLERİ',
        description: 'Bankadan çekilen ticari krediler. Kredi çekildiğinde Alacak, ödendiğinde Borç yazılır.',
        rule: 'Kredi Çekince: Alacak / Ödeyince: Borç',
      },
      {
        code: '320',
        tag: 'Açık Hesap',
        name: 'SATICILAR',
        description: 'Tedarikçiden veresiye (senetsiz/çeksiz) mal aldığımızda doğan borcumuz.',
        rule: 'Veresiye Alış: Alacak / Ödeme: Borç',
        isFocal: true,
      },
      {
        code: '321',
        tag: 'Senetli Borç',
        name: 'BORÇ SENETLERİ',
        description: 'Mal veya taşıt alırken karşı tarafa imzalayıp verdiğimiz bono/senet borçları.',
        rule: 'Senet Verince: Alacak / Ödeyince: Borç',
      },
      {
        code: '360',
        tag: 'Vergi Borcu',
        name: 'ÖDENECEK VERGİ VE FONLAR',
        description: 'Ay sonunda 391 Hesaplanan KDV > 191 İndirilecek KDV olduğunda devlete ödenecek net KDV borcu.',
        rule: 'Tahakkukta: Alacak / Ödemede: Borç',
      },
      {
        code: '391',
        tag: 'Satış KDV',
        name: 'HESAPLANAN KDV',
        description: 'Müşteriye mal sattığımızda faturada hesapladığımız KDV. Satışta Alacak (Sağ) yazılır.',
        rule: 'Satışta: Alacak / Ay Sonu: Borç',
      },
    ],
  },
  {
    classId: 4,
    tabLabel: '4. UZUN VADELİ BORÇLAR (400-499)',
    polarityTitle: '4 ile Başlayan Uzun Vadeli Borçlar (1 Yıldan Uzun Vadeli):',
    increaseSide: 'ALACAK (+)',
    decreaseSide: 'BORÇ (-)',
    balanceRule: 'Kural: 3. grup gibidir, sadece vadesi 1 yıldan uzundur',
    tiles: [
      {
        code: '400',
        tag: 'Aktif Odak',
        name: 'UZUN VADELİ BANKA KREDİLERİ',
        description: 'Geri ödemesi 1 yıldan uzun sürecek olan banka yatırım kredileri.',
        rule: 'Kullanımda: Alacak / Ödemede: Borç',
        isFocal: true,
      },
      {
        code: '420',
        tag: 'Ticari Borç',
        name: 'UZUN VADELİ SATICILAR',
        description: '1 yıldan uzun vadeli anlaşmalarla yapılan veresiye mal alım borçları.',
        rule: 'Vadesi 1 yılın altına inince 320 olur',
      },
      {
        code: '421',
        tag: 'Senetli Borç',
        name: 'UZUN VADELİ BORÇ SENETLERİ',
        description: 'Vadesi 12 aydan daha uzun olan senetli ticari borçlar.',
        rule: 'Senet verildiğinde Alacaklanır',
      },
      {
        code: '472',
        tag: 'Çalışan Fonu',
        name: 'KIDEM TAZMİNATI KARŞILIĞI',
        description: 'Personelin ileride ödenecek kıdem tazminatı için ayrılan uzun vadeli karşılık.',
        rule: 'Karşılık ayrıldığında Alacaklanır',
      },
      {
        code: '480',
        tag: 'Gelecek Dönem',
        name: 'GELECEK YILLARA AİT GELİRLER',
        description: 'Peşin tahsil edilen ancak gelecek yıllara ait olan kira/hizmet gelirleri.',
        rule: 'Tahsil edildiğinde Alacaklanır',
      },
    ],
  },
  {
    classId: 5,
    tabLabel: '5. ÖZKAYNAKLAR / SERMAYE (500-599)',
    polarityTitle: '5 ile Başlayan Şirket Sermayesi ve Kâr/Zarar Hesapları:',
    increaseSide: 'ALACAK (+)',
    decreaseSide: 'BORÇ (-)',
    balanceRule: 'Kural: Sermaye ve Kâr şirketin öz kaynağıdır, Alacak (Sağ) çalışır',
    tiles: [
      {
        code: '500',
        tag: 'Aktif Odak',
        name: 'SERMAYE HESABI',
        description: 'Şirket kurulurken ortakların koyduğu para, mal ve demirbaşların toplam kaynağı.',
        rule: 'Kuruluşta her zaman Alacak (Sağ)',
        isFocal: true,
      },
      {
        code: '501',
        tag: 'Düzenleyici (-)',
        name: 'ÖDENMEMİŞ SERMAYE (-)',
        description: 'Ortakların şirkete koymayı söz verdiği (taahhüt ettiği) ama henüz ödemediği kısım.',
        rule: 'Taahhütte: Borç / Ödendikçe: Alacak',
      },
      {
        code: '540',
        tag: 'Güvence',
        name: 'YASAL YEDEKLER',
        description: 'Şirket kârından kanunen ayrılıp şirkette bırakılan güvence payları.',
        rule: 'Ayrıldığında Alacak (Sağ) yazılır',
      },
      {
        code: '590',
        tag: 'Net Kâr (+)',
        name: 'DÖNEM NET KÂRI',
        description: 'Gelirler giderlerden fazla olduğunda oluşan net kâr. Öz kaynağı artırır.',
        rule: 'Bilançonun Pasifinde (+) yer alır',
      },
      {
        code: '591',
        tag: 'Net Zarar (-)',
        name: 'DÖNEM NET ZARARI (-)',
        description: 'Giderler gelirlerden fazla olduğunda oluşan zarar. Öz kaynağı azaltır.',
        rule: 'Bilançonun Pasifinde (-) yer alır',
      },
    ],
  },
  {
    classId: 6,
    tabLabel: '6 & 7. GELİR VE GİDERLER (600-799)',
    polarityTitle: 'Unutma: Giderler her zaman BORÇ (Sol), Gelirler her zaman ALACAK (Sağ) çalışır!',
    increaseSide: 'ALACAK (+)',
    decreaseSide: 'BORÇ (-)',
    balanceRule: 'Altın Kural: Satış Geliri (600) → Sağ | Kira/Maliyet Gideri (621, 770) → Sol',
    tiles: [
      {
        code: '600',
        tag: 'Satış Geliri',
        name: 'YURTİÇİ SATIŞLAR',
        description: 'Müşteriye mal sattığımızda satış tutarı her zaman bu hesabın Alacak (Sağ) tarafına yazılır.',
        rule: 'Mal Satışında: Alacak (Sağ)',
        isFocal: true,
      },
      {
        code: '610',
        tag: 'Satış İadesi (-)',
        name: 'SATIŞTAN İADELER (-)',
        description: 'Müşteri sattığımız malı iade ettiğinde 600 silinmez; 610 hesabı Borç (Sol) yazılır.',
        rule: 'Müşteri İadesinde: Borç (Sol)',
      },
      {
        code: '621',
        tag: 'Maliyet Gideri',
        name: 'SATILAN TİCARİ MALLAR MALİYETİ',
        description: 'Sattığımız malın bize geliş (alış) maliyeti. Depodan çıkan mal 153 Alacak, 621 Borç yazılır.',
        rule: 'Maliyet Kaydında: Borç (Sol)',
      },
      {
        code: '770',
        tag: 'Ofis Gideri',
        name: 'GENEL YÖNETİM GİDERLERİ',
        description: 'Ofis kirası, elektrik, su, muhasebeci ücreti ve demirbaş amortisman giderleri.',
        rule: 'Gider Doğduğunda: Borç (Sol)',
      },
      {
        code: '653',
        tag: 'Banka Kesintisi',
        name: 'KOMİSYON GİDERLERİ',
        description: 'Çek tahsilinde veya banka işlemlerinde bankanın kestiği masraf ve komisyonlar.',
        rule: 'Kesinti Olduğunda: Borç (Sol)',
      },
    ],
  },
];
