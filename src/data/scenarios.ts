import type { CompanyScenario } from '../types/scenario';

export const SCENARIOS: CompanyScenario[] = [
  {
    id: 'abc-ticaret-temel',
    title: 'ABC Ticaret İşletmesi - Kuruluş, Çek ve Temel Döngü',
    difficulty: 'Kolay',
    companyName: 'ABC Ticaret İşletmesi',
    establishedDate: '01.10.2026',
    initialCapital: 100000,
    description:
      'Genel Muhasebe dersinin ilk haftalarında işlenen kuruluş sermayesi, peşin/veresiye mal alımı, müşteriden çek alma (101), kendi çekimizi verme (103) ve çek ödeme işlemlerini kapsayan temel çalışma seti.',
    learningObjectives: [
      'Kuruluş sermayesinin 100 Kasa (Borç) ve 500 Sermaye (Alacak) hesaplarına kaydedilmesi',
      'Peşin ve veresiye mal alımlarında 153 Ticari Mallar ve 320 Satıcılar hesaplarının işleyişi',
      'Müşteriden çek alındığında 101 Alınan Çekler hesabının borçlandırılması',
      'Kendi çekimizi düzenleyip (keşide edip) verdiğimizde 103 Verilen Çekler (-) hesabının alacaklandırılması',
      'Verilen çek bankadan ödendiğinde 103 hesabının borçlandırılarak kapatılması',
      'Gider ödemelerinde 770 Genel Yönetim Giderleri hesabının borçlandırılması',
    ],
    transactions: [
      {
        id: 'tx-1',
        order: 1,
        date: '01.10.2026',
        title: 'İşletmenin Kuruluşu ve Nakit Sermaye Konulması',
        description:
          'İşletme, sahibi tarafından 100.000 TL nakit sermaye konularak kurulmuştur. Tutarın tamamı işletme kasasına yatırılmıştır.',
        amount: 100000,
        expectedEntry: {
          educationalNotes:
            'Kasaya nakit para girdiği için 100 Kasa (Varlık/Aktif) borçlandırılır; işletmeye sermaye konulduğu için 500 Sermaye (Öz Kaynak/Pasif) alacaklandırılır.',
          lines: [
            { accountCode: '100', debit: 100000, credit: 0 },
            { accountCode: '500', debit: 0, credit: 100000 },
          ],
        },
        hints: [
          {
            level: 1,
            title: '1. Aşama: İşlemde Neler Değişti?',
            content:
              'İşletmenin kasasındaki "nakit para" arttı ve işletmeye kurucu tarafından "sermaye" konuldu.',
          },
          {
            level: 2,
            title: '2. Aşama: Hangi Hesap Kodları Kullanılır?',
            content:
              'Nakit para için "100 Kasa" (Varlık/Aktif); konulan sermaye için "500 Sermaye" (Öz Kaynak/Pasif) hesabı kullanılır.',
          },
          {
            level: 3,
            title: '3. Aşama: Hangisi Borç (Sol), Hangisi Alacak (Sağ)?',
            content:
              'Varlık hesapları (100 Kasa) arttığında BORÇ (Sol); Kaynak/Sermaye hesapları (500 Sermaye) arttığında ALACAK (Sağ) yazılır.',
          },
          {
            level: 4,
            title: '4. Aşama: Tam Yevmiye Kaydı',
            content:
              '100 Kasa (Borç: 100.000 TL) / 500 Sermaye (Alacak: 100.000 TL)',
          },
        ],
      },
      {
        id: 'tx-2',
        order: 2,
        date: '03.10.2026',
        title: 'Bankadaki Hesaba Nakit Para Yatırılması',
        description:
          'İşletme kasasından 40.000 TL nakit para alınarak işletmenin bankadaki vadesiz mevduat hesabına yatırılmıştır.',
        amount: 40000,
        expectedEntry: {
          educationalNotes:
            'Bankadaki paramız arttığı için 102 Bankalar borçlandırılır; kasadaki nakit para azaldığı için 100 Kasa alacaklandırılır.',
          lines: [
            { accountCode: '102', debit: 40000, credit: 0 },
            { accountCode: '100', debit: 0, credit: 40000 },
          ],
        },
        hints: [
          {
            level: 1,
            title: '1. Aşama: İşlemde Neler Değişti?',
            content:
              'Kasadan para çıktı (azaldı) ve banka hesabımıza para girdi (arttı).',
          },
          {
            level: 2,
            title: '2. Aşama: Hangi Hesap Kodları Kullanılır?',
            content:
              '"102 Bankalar" ve "100 Kasa" hesaplarının ikisi de Varlık (Aktif) hesabıdır.',
          },
          {
            level: 3,
            title: '3. Aşama: Hangisi Borç, Hangisi Alacak?',
            content:
              'Artan varlık (102 Bankalar) BORÇ; azalan varlık (100 Kasa) ALACAK yazılır.',
          },
          {
            level: 4,
            title: '4. Aşama: Tam Yevmiye Kaydı',
            content:
              '102 Bankalar (Borç: 40.000 TL) / 100 Kasa (Alacak: 40.000 TL)',
          },
        ],
      },
      {
        id: 'tx-3',
        order: 3,
        date: '05.10.2026',
        title: 'Peşin Ticari Mal Alımı',
        description:
          'İşletme, satmak amacıyla 20.000 TL tutarında ticari malı peşin (nakit) olarak satın almıştır.',
        amount: 20000,
        expectedEntry: {
          educationalNotes:
            'Depodaki malımız arttığı için 153 Ticari Mallar borçlandırılır; kasadan nakit ödendiği için 100 Kasa alacaklandırılır.',
          lines: [
            { accountCode: '153', debit: 20000, credit: 0 },
            { accountCode: '100', debit: 0, credit: 20000 },
          ],
        },
        hints: [
          {
            level: 1,
            title: '1. Aşama: İşlemde Neler Değişti?',
            content:
              'Depomuza yeni mal girdi ve kasamızdan nakit para çıktı.',
          },
          {
            level: 2,
            title: '2. Aşama: Hangi Hesap Kodları Kullanılır?',
            content:
              'Alınan mallar için "153 Ticari Mallar" (Varlık/Aktif), nakit ödeme için "100 Kasa" (Varlık/Aktif) kullanılır.',
          },
          {
            level: 3,
            title: '3. Aşama: Hangisi Borç, Hangisi Alacak?',
            content:
              'Ticari mallarımız arttığı için 153 BORÇ; kasadaki nakdimiz azaldığı için 100 ALACAK yazılır.',
          },
          {
            level: 4,
            title: '4. Aşama: Tam Yevmiye Kaydı',
            content:
              '153 Ticari Mallar (Borç: 20.000 TL) / 100 Kasa (Alacak: 20.000 TL)',
          },
        ],
      },
      {
        id: 'tx-4',
        order: 4,
        date: '07.10.2026',
        title: 'Çek Düzenleyerek (Keşide Ederek) Ticari Mal Alımı',
        description:
          'İşletme, toptancıdan 15.000 TL tutarında ticari mal satın almış ve karşılığında kendi çek defterinden 15.000 TL\'lik bir çek yazıp (keşide edip) satıcıya vermiştir.',
        amount: 15000,
        expectedEntry: {
          educationalNotes:
            'Çok Önemli Ders Vurgusu: Mal aldığımız için 153 Ticari Mallar borçlandırılır. Kendi çekimizi verdiğimizde ise "103 Verilen Çekler ve Ödeme Emirleri (-)" hesabı kullanılır ve bu hesap sonunda (-) işareti olduğu için pasif gibi çalışarak ALACAKLANDIRILIR.',
          lines: [
            { accountCode: '153', debit: 15000, credit: 0 },
            { accountCode: '103', debit: 0, credit: 15000 },
          ],
        },
        hints: [
          {
            level: 1,
            title: '1. Aşama: İşlemde Neler Değişti?',
            content:
              'Ticari mal aldık ve karşılığında kendi banka çek defterimizden bir çek imzalayıp (keşide edip) verdik.',
          },
          {
            level: 2,
            title: '2. Aşama: 101 mi Yoksa 103 mü Kullanılır?',
            content:
              'Dikkat! Müşteriden çek almadık, KENDİ çekimizi verdik. Bu yüzden "103 Verilen Çekler ve Ödeme Emirleri (-)" hesabı kullanılır.',
          },
          {
            level: 3,
            title: '3. Aşama: 103 Hesabı Neden Alacak Yazılır?',
            content:
              '103 hesabı 1 ile başlamasına rağmen sonunda (-) işareti bulunan "Aktifi Düzenleyen Pasif" bir hesaptır. Çek verildiğinde ALACAK yazılır!',
          },
          {
            level: 4,
            title: '4. Aşama: Tam Yevmiye Kaydı',
            content:
              '153 Ticari Mallar (Borç: 15.000 TL) / 103 Verilen Çekler ve Ödeme Emirleri (-) (Alacak: 15.000 TL)',
          },
        ],
      },
      {
        id: 'tx-5',
        order: 5,
        date: '10.10.2026',
        title: 'Müşteriden Çek Alarak Ticari Mal Satışı',
        description:
          'İşletme, müşteriye 30.000 TL tutarında ticari mal satmış ve satış bedeli karşılığında müşteriden 30.000 TL\'lik bir çek teslim almıştır.',
        amount: 30000,
        expectedEntry: {
          educationalNotes:
            'Müşteriden çek aldığımızda çek cüzdanımızdaki varlık arttığı için "101 Alınan Çekler" (Aktif) borçlandırılır; satış geliri doğduğu için "600 Yurtiçi Satışlar" alacaklandırılır.',
          lines: [
            { accountCode: '101', debit: 30000, credit: 0 },
            { accountCode: '600', debit: 0, credit: 30000 },
          ],
        },
        hints: [
          {
            level: 1,
            title: '1. Aşama: İşlemde Neler Değişti?',
            content:
              'Müşteriye mal sattık (gelir doğdu) ve karşılığında müşterinin çekini aldık.',
          },
          {
            level: 2,
            title: '2. Aşama: Hangi Hesap Kodları Kullanılır?',
            content:
              'Müşteriden alınan çekler "101 Alınan Çekler" (Varlık/Aktif) hesabında, satış geliri ise "600 Yurtiçi Satışlar" (Gelir) hesabında izlenir.',
          },
          {
            level: 3,
            title: '3. Aşama: Hangisi Borç, Hangisi Alacak?',
            content:
              'Elimizdeki müşteri çeki arttığı için 101 Alınan Çekler BORÇ; satış geliri doğduğu için 600 Yurtiçi Satışlar ALACAK yazılır.',
          },
          {
            level: 4,
            title: '4. Aşama: Tam Yevmiye Kaydı',
            content:
              '101 Alınan Çekler (Borç: 30.000 TL) / 600 Yurtiçi Satışlar (Alacak: 30.000 TL)',
          },
        ],
      },
      {
        id: 'tx-6',
        order: 6,
        date: '12.10.2026',
        title: 'Satıcıya Verdiğimiz Çekin Bankadan Ödenmesi',
        description:
          'Daha önce mal alırken satıcıya keşide edip verdiğimiz 15.000 TL tutarındaki çek, satıcı tarafından bankaya ibraz edilmiş ve işletmemizin banka hesabından ödenmiştir.',
        amount: 15000,
        expectedEntry: {
          educationalNotes:
            'Daha önce alacaklandırdığımız 103 Verilen Çekler (-) hesabı, çek ödendiğinde BORÇLANDIRILARAK kapatılır; para banka hesabımızdan çıktığı için 102 Bankalar alacaklandırılır.',
          lines: [
            { accountCode: '103', debit: 15000, credit: 0 },
            { accountCode: '102', debit: 0, credit: 15000 },
          ],
        },
        hints: [
          {
            level: 1,
            title: '1. Aşama: İşlemde Neler Değişti?',
            content:
              '4. işlemde satıcıya verdiğimiz 15.000 TL\'lik çek banka hesabımızdan ödendi ve çek borcumuz kapandı.',
          },
          {
            level: 2,
            title: '2. Aşama: Hangi Hesap Kodları Kullanılır?',
            content:
              'Verilen çekler için "103 Verilen Çekler ve Ödeme Emirleri (-)", banka ödemesi için "102 Bankalar" kullanılır.',
          },
          {
            level: 3,
            title: '3. Aşama: Hangisi Borç, Hangisi Alacak?',
            content:
              'Çeki verirken 103 hesabını Alacak yazmıştık; şimdi çek ödendiği (kapandığı) için 103 BORÇ yazılır. Bankadaki paramız azaldığı için 102 Bankalar ALACAK yazılır.',
          },
          {
            level: 4,
            title: '4. Aşama: Tam Yevmiye Kaydı',
            content:
              '103 Verilen Çekler ve Ödeme Emirleri (-) (Borç: 15.000 TL) / 102 Bankalar (Alacak: 15.000 TL)',
          },
        ],
      },
      {
        id: 'tx-7',
        order: 7,
        date: '15.10.2026',
        title: 'Veresiye (Açık Hesap) Ticari Mal Alımı',
        description:
          'İşletme, satıcılardan 12.000 TL tutarında ticari malı veresiye (bedeli daha sonra ödenmek üzere senetsiz/açık hesap) satın almıştır.',
        amount: 12000,
        expectedEntry: {
          educationalNotes:
            'Mal stoğumuz arttığı için 153 Ticari Mallar borçlandırılır; satıcıya olan senetsiz borcumuz arttığı için 320 Satıcılar alacaklandırılır.',
          lines: [
            { accountCode: '153', debit: 12000, credit: 0 },
            { accountCode: '320', debit: 0, credit: 12000 },
          ],
        },
        hints: [
          {
            level: 1,
            title: '1. Aşama: İşlemde Neler Değişti?',
            content:
              'Depodaki mallarımız arttı ve satıcıya olan veresiye borcumuz arttı.',
          },
          {
            level: 2,
            title: '2. Aşama: Hangi Hesap Kodları Kullanılır?',
            content:
              'Alınan mal için "153 Ticari Mallar" (Aktif), veresiye borç için "320 Satıcılar" (Pasif) kullanılır.',
          },
          {
            level: 3,
            title: '3. Aşama: Hangisi Borç, Hangisi Alacak?',
            content:
              'Varlık artışı (153) BORÇ; borç/kaynak artışı (320) ALACAK yazılır.',
          },
          {
            level: 4,
            title: '4. Aşama: Tam Yevmiye Kaydı',
            content:
              '153 Ticari Mallar (Borç: 12.000 TL) / 320 Satıcılar (Alacak: 12.000 TL)',
          },
        ],
      },
      {
        id: 'tx-8',
        order: 8,
        date: '18.10.2026',
        title: 'Ofis Kira Giderinin Nakit Ödenmesi',
        description:
          'İşletmenin faaliyet gösterdiği mağaza ve ofisin 5.000 TL tutarındaki aylık kira bedeli kasadan nakit olarak ödenmiştir.',
        amount: 5000,
        expectedEntry: {
          educationalNotes:
            'İşletme gideri doğduğu için 770 Genel Yönetim Giderleri borçlandırılır; kasadan nakit para çıktığı için 100 Kasa alacaklandırılır.',
          lines: [
            { accountCode: '770', debit: 5000, credit: 0 },
            { accountCode: '100', debit: 0, credit: 5000 },
          ],
        },
        hints: [
          {
            level: 1,
            title: '1. Aşama: İşlemde Neler Değişti?',
            content:
              'Kira gideri oluştu ve kasadaki nakit paramız azaldı.',
          },
          {
            level: 2,
            title: '2. Aşama: Hangi Hesap Kodları Kullanılır?',
            content:
              'Kira gideri için "770 Genel Yönetim Giderleri", nakit çıkış için "100 Kasa" kullanılır.',
          },
          {
            level: 3,
            title: '3. Aşama: Hangisi Borç, Hangisi Alacak?',
            content:
              'Tüm gider hesapları doğduğunda daima BORÇ (770) yazılır; kasadan para çıktığı için 100 Kasa ALACAK yazılır.',
          },
          {
            level: 4,
            title: '4. Aşama: Tam Yevmiye Kaydı',
            content:
              '770 Genel Yönetim Giderleri (Borç: 5.000 TL) / 100 Kasa (Alacak: 5.000 TL)',
          },
        ],
      },
    ],
  },
  {
    id: 'anadolu-cek-kdv-orta',
    title: 'Anadolu Ticaret A.Ş. - Çek Cirosu, POS ve KDV Uygulamaları',
    difficulty: 'Orta',
    companyName: 'Anadolu Ticaret A.Ş.',
    establishedDate: '01.11.2026',
    initialCapital: 200000,
    description:
      'Genel Muhasebe vize/final sınavlarında en çok sorulan KDV\'li alış/satış (191/391), çek keşidesi (103), müşteri çekinin satıcıya ciro edilmesi (101), kredi kartlı satış (108) ve ay sonu KDV mahsubu senaryosu.',
    learningObjectives: [
      'Mal alışında 191 İndirilecek KDV (Borç) ve satışta 391 Hesaplanan KDV (Alacak) ayrımı',
      'Kendi çekimizi verdiğimizde 103 Verilen Çekler (-) hesabının alacaklandırılması',
      'Müşteriden alınan çekin ciro edilmesinde 103 değil, 101 Alınan Çekler hesabının alacaklandırılması',
      'Kredi kartı (POS) ile yapılan satışların 108 Diğer Hazır Değerler hesabında izlenmesi',
      'Çek tahsilatında banka komisyon kesintisinin (653 Komisyon Giderleri) muhasebeleştirilmesi',
      'Ay sonunda 391 Hesaplanan KDV ile 191 İndirilecek KDV\'nin mahsup edilmesi',
    ],
    transactions: [
      {
        id: 'tx-ck1',
        order: 1,
        date: '01.11.2026',
        title: 'Bileşik Sermaye ile Kuruluş (Kasa + Banka)',
        description:
          'Anadolu Ticaret A.Ş. 200.000 TL sermaye ile kurulmuştur. Ortaklar sermayenin 80.000 TL\'sini nakit olarak kasaya, 120.000 TL\'sini ise şirketin banka hesabına yatırmıştır.',
        amount: 200000,
        expectedEntry: {
          educationalNotes:
            'Hem kasaya hem bankaya para girdiği için 100 Kasa ve 102 Bankalar borçlandırılır; toplam sermaye için 500 Sermaye alacaklandırılır.',
          lines: [
            { accountCode: '100', debit: 80000, credit: 0 },
            { accountCode: '102', debit: 120000, credit: 0 },
            { accountCode: '500', debit: 0, credit: 200000 },
          ],
        },
        hints: [
          {
            level: 1,
            title: '1. Aşama: İşlemde Neler Değişti?',
            content:
              'Kasaya 80.000 TL, bankaya 120.000 TL girdi; karşılığında 200.000 TL sermaye oluştu.',
          },
          {
            level: 2,
            title: '2. Aşama: Hangi Hesaplar Kullanılır?',
            content:
              '100 Kasa (Aktif), 102 Bankalar (Aktif) ve 500 Sermaye (Pasif/Öz Kaynak).',
          },
          {
            level: 3,
            title: '3. Aşama: Borç ve Alacak Yönleri',
            content:
              'Kasa ve Banka varlıkları arttığı için BORÇ; Sermaye kaynağı arttığı için ALACAK yazılır.',
          },
          {
            level: 4,
            title: '4. Aşama: Tam Yevmiye Kaydı',
            content:
              '100 Kasa (B: 80.000), 102 Bankalar (B: 120.000) / 500 Sermaye (A: 200.000)',
          },
        ],
      },
      {
        id: 'tx-ck2',
        order: 2,
        date: '04.11.2026',
        title: '%20 KDV\'li Mal Alışı ve Çek Keşide Edilmesi',
        description:
          'İşletme, 50.000 TL + %20 KDV (10.000 TL KDV, toplam 60.000 TL) tutarında ticari mal satın almıştır. Toplam 60.000 TL karşılığında satıcıya kendi çek defterinden çek düzenleyip (keşide edip) vermiştir.',
        amount: 50000,
        expectedEntry: {
          educationalNotes:
            'Mal bedeli (50.000 TL) 153 Ticari Mallar hesabına, ödenen KDV (10.000 TL) 191 İndirilecek KDV hesabına BORÇ yazılır. Karşılığında kendi çekimizi verdiğimiz için 103 Verilen Çekler ve Ödeme Emirleri (-) hesabı 60.000 TL ALACAKLANDIRILIR.',
          lines: [
            { accountCode: '153', debit: 50000, credit: 0 },
            { accountCode: '191', debit: 10000, credit: 0 },
            { accountCode: '103', debit: 0, credit: 60000 },
          ],
        },
        hints: [
          {
            level: 1,
            title: '1. Aşama: KDV ve Toplam Tutarı Ayırma',
            content:
              'Malın KDV hariç bedeli 50.000 TL, %20 KDV\'si 10.000 TL\'dir. Satıcıya verilen çekin toplam tutarı 60.000 TL\'dir.',
          },
          {
            level: 2,
            title: '2. Aşama: Alış KDV\'si Hangi Hesaba Yazılır?',
            content:
              'Mal alırken ödediğimiz KDV "191 İndirilecek KDV" hesabında izlenir ve mal bedeli (153) ile birlikte BORÇ yazılır.',
          },
          {
            level: 3,
            title: '3. Aşama: Verilen Çek Hangi Hesaba Yazılır?',
            content:
              'Kendi çekimizi düzenleyip verdiğimiz için "103 Verilen Çekler ve Ödeme Emirleri (-)" hesabı 60.000 TL ALACAK yazılır.',
          },
          {
            level: 4,
            title: '4. Aşama: Tam Yevmiye Kaydı',
            content:
              '153 Ticari Mallar (B: 50.000), 191 İndirilecek KDV (B: 10.000) / 103 Verilen Çekler (-) (A: 60.000)',
          },
        ],
      },
      {
        id: 'tx-ck3',
        order: 3,
        date: '08.11.2026',
        title: '%20 KDV\'li Mal Satışı (Müşteri Çeki + Kredi Kartı POS)',
        description:
          'İşletme, müşteriye 80.000 TL + %20 KDV (16.000 TL KDV, toplam 96.000 TL) tutarında mal satmıştır. Müşteri toplam borcun 56.000 TL\'si için çek vermiş, kalan 40.000 TL\'yi ise kredi kartı (POS cihazı) ile ödemiştir.',
        amount: 80000,
        expectedEntry: {
          educationalNotes:
            'Müşteriden alınan çek (56.000 TL) 101 Alınan Çekler hesabına, kredi kartı POS slibi (40.000 TL) 108 Diğer Hazır Değerler hesabına BORÇ yazılır. KDV hariç satış hasılatı (80.000 TL) 600 Yurtiçi Satışlar hesabına, müşteriden alınan KDV (16.000 TL) 391 Hesaplanan KDV hesabına ALACAK yazılır.',
          lines: [
            { accountCode: '101', debit: 56000, credit: 0 },
            { accountCode: '108', debit: 40000, credit: 0 },
            { accountCode: '600', debit: 0, credit: 80000 },
            { accountCode: '391', debit: 0, credit: 16000 },
          ],
        },
        hints: [
          {
            level: 1,
            title: '1. Aşama: Tahsilat Araçlarını Belirleme',
            content:
              'Müşteriden alınan 56.000 TL çek için "101 Alınan Çekler", kredi kartı (POS) ile çekilen 40.000 TL için "108 Diğer Hazır Değerler" kullanılır.',
          },
          {
            level: 2,
            title: '2. Aşama: Satış ve Satış KDV\'si Hesapları',
            content:
              'Satış geliri (80.000 TL) için "600 Yurtiçi Satışlar", satış üzerinden hesaplanan %20 KDV (16.000 TL) için "391 Hesaplanan KDV" kullanılır.',
          },
          {
            level: 3,
            title: '3. Aşama: Borç ve Alacak Yönleri',
            content:
              '101 ve 108 varlıklarımız arttığı için BORÇ (56.000 + 40.000 = 96.000); 600 satış geliri ve 391 KDV borcu ALACAK (80.000 + 16.000 = 96.000) yazılır.',
          },
          {
            level: 4,
            title: '4. Aşama: Tam Yevmiye Kaydı',
            content:
              '101 Alınan Çekler (B: 56.000), 108 Diğer Hazır Değerler (B: 40.000) / 600 Yurtiçi Satışlar (A: 80.000), 391 Hesaplanan KDV (A: 16.000)',
          },
        ],
      },
      {
        id: 'tx-ck4',
        order: 4,
        date: '12.11.2026',
        title: 'Müşteri Çekinin Ciro Edilerek Mal Alınması (Sınav Sorusu!)',
        description:
          'İşletme, 30.000 TL tutarında (KDV hariç/ihmal edilmiş) yeni ticari mal satın almış; bedelini ödemek için kendi çekini yazmak yerine, daha önce müşteriden aldığı çeklerden 30.000 TL\'lik kısmını satıcıya CİRO etmiştir (devretmiştir).',
        amount: 30000,
        expectedEntry: {
          educationalNotes:
            'Klasik Sınav Vurgusu: Müşteriden daha önce alınan bir çek başkasına CİRO edildiğinde kendi çekimiz olmadığı için ASLA 103 kullanılmaz! Çek cüzdanımızdan müşteri çeki çıktığı için "101 Alınan Çekler" hesabı ALACAKLANDIRILIR.',
          lines: [
            { accountCode: '153', debit: 30000, credit: 0 },
            { accountCode: '101', debit: 0, credit: 30000 },
          ],
        },
        hints: [
          {
            level: 1,
            title: '1. Aşama: "Çek Ciro Etmek" Ne Demektir?',
            content:
              'Ciro etmek, daha önce müşteriden alıp kasamızda (101 hesabında) tuttuğumuz çeki imzalayarak başka bir satıcıya vermektir.',
          },
          {
            level: 2,
            title: '2. Aşama: Sınav Tuzağı — 101 mi, 103 mü?',
            content:
              'Kendi çek defterimizden çek yazmadık! Cüzdanımızdaki müşteri çekini verdik. Bu yüzden "101 Alınan Çekler" hesabı azalır.',
          },
          {
            level: 3,
            title: '3. Aşama: Borç ve Alacak Yönleri',
            content:
              'Mal aldığımız için 153 Ticari Mallar BORÇ; elimizdeki müşteri çeki çıktığı için 101 Alınan Çekler ALACAK yazılır.',
          },
          {
            level: 4,
            title: '4. Aşama: Tam Yevmiye Kaydı',
            content:
              '153 Ticari Mallar (Borç: 30.000 TL) / 101 Alınan Çekler (Alacak: 30.000 TL)',
          },
        ],
      },
      {
        id: 'tx-ck5',
        order: 5,
        date: '16.11.2026',
        title: 'Müşteri Çekinin Bankadan Komisyon Kesintili Tahsili',
        description:
          'İşletme, elinde kalan 26.000 TL tutarındaki müşteri çekini bankaya ibraz ederek tahsil etmiştir. Banka 1.000 TL tahsil komisyonu kestikten sonra kalan 25.000 TL\'yi işletmenin vadesiz mevduat hesabına yatırmıştır.',
        amount: 26000,
        expectedEntry: {
          educationalNotes:
            'Bankaya net giren 25.000 TL için 102 Bankalar, kesilen 1.000 TL masraf için 653 Komisyon Giderleri (-) BORÇ yazılır; tahsil edilen 26.000 TL\'lik müşteri çeki 101 Alınan Çekler hesabından ALACAK yazılarak çıkarılır.',
          lines: [
            { accountCode: '102', debit: 25000, credit: 0 },
            { accountCode: '653', debit: 1000, credit: 0 },
            { accountCode: '101', debit: 0, credit: 26000 },
          ],
        },
        hints: [
          {
            level: 1,
            title: '1. Aşama: İşlemde Neler Değişti?',
            content:
              '26.000 TL\'lik müşteri çeki tahsil edildi (101 azaldı), bankanın kestiği 1.000 TL komisyon gideri oluştu ve banka hesabımıza net 25.000 TL geçti.',
          },
          {
            level: 2,
            title: '2. Aşama: Hangi Hesaplar Kullanılır?',
            content:
              '102 Bankalar (Aktif), 653 Komisyon Giderleri (-) (Gider) ve 101 Alınan Çekler (Aktif).',
          },
          {
            level: 3,
            title: '3. Aşama: Borç ve Alacak Yönleri',
            content:
              'Bankaya giren para (102: 25.000) ve komisyon gideri (653: 1.000) BORÇ; elimizden çıkan müşteri çeki (101: 26.000) ALACAK yazılır.',
          },
          {
            level: 4,
            title: '4. Aşama: Tam Yevmiye Kaydı',
            content:
              '102 Bankalar (B: 25.000), 653 Komisyon Giderleri (B: 1.000) / 101 Alınan Çekler (A: 26.000)',
          },
        ],
      },
      {
        id: 'tx-ck6',
        order: 6,
        date: '22.11.2026',
        title: 'Keşide Ettiğimiz Çekin (103) Bankadan Ödenmesi',
        description:
          '2. işlemde mal alırken satıcıya keşide edip verdiğimiz 60.000 TL tutarındaki çekin vadesi gelmiş ve işletmenin banka mevduat hesabından ödenmiştir.',
        amount: 60000,
        expectedEntry: {
          educationalNotes:
            'Kendi verdiğimiz çek ödendiğinde 103 Verilen Çekler ve Ödeme Emirleri (-) hesabı BORÇLANDIRILARAK kapatılır; ödeme banka hesabımızdan yapıldığı için 102 Bankalar alacaklandırılır.',
          lines: [
            { accountCode: '103', debit: 60000, credit: 0 },
            { accountCode: '102', debit: 0, credit: 60000 },
          ],
        },
        hints: [
          {
            level: 1,
            title: '1. Aşama: İşlemde Neler Değişti?',
            content:
              '2. işlemde verdiğimiz 60.000 TL\'lik çek bankadaki hesabımızdan ödendi.',
          },
          {
            level: 2,
            title: '2. Aşama: Hangi Hesaplar Kullanılır?',
            content:
              '103 Verilen Çekler ve Ödeme Emirleri (-) ile 102 Bankalar.',
          },
          {
            level: 3,
            title: '3. Aşama: Borç ve Alacak Yönleri',
            content:
              'Verilen çek kapandığı için 103 BORÇ (60.000 TL); bankadaki paramız azaldığı için 102 Bankalar ALACAK (60.000 TL) yazılır.',
          },
          {
            level: 4,
            title: '4. Aşama: Tam Yevmiye Kaydı',
            content:
              '103 Verilen Çekler ve Ödeme Emirleri (-) (B: 60.000) / 102 Bankalar (A: 60.000)',
          },
        ],
      },
      {
        id: 'tx-ck7',
        order: 7,
        date: '30.11.2026',
        title: 'Ay Sonu KDV Mahsup (Tahakkuk) Kaydı',
        description:
          'Ay sonunda KDV hesapları karşılaştırılmıştır: Dönem içinde müşterilerden tahsil edilen 391 Hesaplanan KDV toplamı 16.000 TL, mal alırken ödenen 191 İndirilecek KDV toplamı 10.000 TL\'dir. Aradaki 6.000 TL\'lik ödenecek KDV farkı tahakkuk ettirilmiştir.',
        amount: 16000,
        expectedEntry: {
          educationalNotes:
            'Ay sonu KDV mahsubunda: 391 Hesaplanan KDV (16.000 TL) BORÇ yazılarak, 191 İndirilecek KDV (10.000 TL) ALACAK yazılarak kapatılır. 391 > 191 olduğu için aradaki 6.000 TL fark devlete ödenecek vergi borcu olarak 360 Ödenecek Vergi ve Fonlar hesabına ALACAK yazılır.',
          lines: [
            { accountCode: '391', debit: 16000, credit: 0 },
            { accountCode: '191', debit: 0, credit: 10000 },
            { accountCode: '360', debit: 0, credit: 6000 },
          ],
        },
        hints: [
          {
            level: 1,
            title: '1. Aşama: KDV Mahsubu Mantığı Nedir?',
            content:
              'Satışlarda topladığımız KDV\'den (391: 16.000 TL), alışlarda ödediğimiz KDV\'yi (191: 10.000 TL) düşeriz. Kalan 6.000 TL\'yi devlete öderiz.',
          },
          {
            level: 2,
            title: '2. Aşama: 391 ve 191 Nasıl Kapatılır?',
            content:
              'Normalde Alacak çalışan 391 Hesaplanan KDV kapatmak için BORÇ (16.000 TL); normalde Borç çalışan 191 İndirilecek KDV kapatmak için ALACAK (10.000 TL) yazılır.',
          },
          {
            level: 3,
            title: '3. Aşama: Aradaki 6.000 TL Fark Nereye Yazılır?',
            content:
              'Tahsil ettiğimiz KDV daha fazla olduğu için devlete 6.000 TL vergi borcumuz doğmuştur: "360 Ödenecek Vergi ve Fonlar" hesabına ALACAK yazılır.',
          },
          {
            level: 4,
            title: '4. Aşama: Tam Yevmiye Kaydı',
            content:
              '391 Hesaplanan KDV (B: 16.000) / 191 İndirilecek KDV (A: 10.000), 360 Ödenecek Vergi ve Fonlar (A: 6.000)',
          },
        ],
      },
    ],
  },
  {
    id: 'marmara-endustri-ileri',
    title: 'Marmara Endüstri A.Ş. - Senetler, Satış Maliyeti (621) ve Amortisman',
    difficulty: 'İleri',
    companyName: 'Marmara Endüstri A.Ş.',
    establishedDate: '01.12.2026',
    initialCapital: 250000,
    description:
      'Senetli alış-satış (121/321), duran varlık alımı (254 Taşıtlar), satılan ticari malların maliyet kaydı (621 STMM), müşteri satış iadesi (610) ve dönem sonu amortisman (257) işlemlerini kapsayan ileri seviye sınav provası.',
    learningObjectives: [
      'Taşıt alımında kısmi banka, kısmi senetli (321 Borç Senetleri) bileşik kayıt',
      'Senet karşılığı satışta 121 Alacak Senetleri hesabının kullanımı',
      'Satılan malın stoktan çıkış maliyetinin 621 Satılan Ticari Mallar Maliyeti (-) ve 153 Ticari Mallar ile kaydedilmesi',
      'Müşteri mal iadesinde 600 yerine 610 Satıştan İadeler (-) hesabının borçlandırılması',
      'Dönem sonunda duran varlıklar için 257 Birikmiş Amortismanlar (-) ayrılması',
    ],
    transactions: [
      {
        id: 'tx-m1',
        order: 1,
        date: '01.12.2026',
        title: 'Bileşik Sermaye Kuruluşu (Kasa + Banka + Ticari Mal)',
        description:
          'Marmara Endüstri A.Ş. toplam 250.000 TL sermaye ile kurulmuştur. Ortaklar 50.000 TL nakit para, 120.000 TL banka mevduatı ve 80.000 TL değerinde ticari mal koyarak taahhütlerini yerine getirmiştir.',
        amount: 250000,
        expectedEntry: {
          educationalNotes:
            'İşletmeye konulan nakit (100), banka mevduatı (102) ve ticari mal (153) varlıkları borçlandırılır; toplam kuruluş sermayesi için 500 Sermaye alacaklandırılır.',
          lines: [
            { accountCode: '100', debit: 50000, credit: 0 },
            { accountCode: '102', debit: 120000, credit: 0 },
            { accountCode: '153', debit: 80000, credit: 0 },
            { accountCode: '500', debit: 0, credit: 250000 },
          ],
        },
        hints: [
          {
            level: 1,
            title: '1. Aşama: İşlemde Neler Değişti?',
            content:
              'Kasa (50.000), Banka (120.000) ve Ticari Mallar (80.000) olmak üzere üç varlık arttı; karşılığında 250.000 TL Sermaye oluştu.',
          },
          {
            level: 2,
            title: '2. Aşama: Hangi Hesaplar Kullanılır?',
            content:
              '100 Kasa, 102 Bankalar, 153 Ticari Mallar (üçü de Aktif) ve 500 Sermaye (Pasif).',
          },
          {
            level: 3,
            title: '3. Aşama: Borç ve Alacak Yönleri',
            content:
              'Artan tüm varlıklar (100, 102, 153) BORÇ; artan sermaye (500) ALACAK yazılır.',
          },
          {
            level: 4,
            title: '4. Aşama: Tam Yevmiye Kaydı',
            content:
              '100 Kasa (B: 50.000), 102 Bankalar (B: 120.000), 153 Ticari Mallar (B: 80.000) / 500 Sermaye (A: 250.000)',
          },
        ],
      },
      {
        id: 'tx-m2',
        order: 2,
        date: '05.12.2026',
        title: 'Dağıtım Taşıtı Alımı (Kısmi Banka, Kısmi Borç Senedi)',
        description:
          'İşletme, sevkiyatlarda kullanmak üzere 60.000 TL değerinde bir ticari araç satın almıştır. Bedelin 20.000 TL\'si bankadan havale edilmiş, kalan 40.000 TL için satıcıya senet (bono) imzalanıp verilmiştir.',
        amount: 60000,
        expectedEntry: {
          educationalNotes:
            'Alınan araç duran varlık olduğu için 254 Taşıtlar borçlandırılır; bankadan çıkan 20.000 TL için 102 Bankalar ve verilen senet için 321 Borç Senetleri alacaklandırılır.',
          lines: [
            { accountCode: '254', debit: 60000, credit: 0 },
            { accountCode: '102', debit: 0, credit: 20000 },
            { accountCode: '321', debit: 0, credit: 40000 },
          ],
        },
        hints: [
          {
            level: 1,
            title: '1. Aşama: İşlemde Neler Değişti?',
            content:
              '60.000 TL değerinde taşıt alındı, bankadan 20.000 TL çıktı ve 40.000 TL senetli borç doğdu.',
          },
          {
            level: 2,
            title: '2. Aşama: Hangi Hesaplar Kullanılır?',
            content:
              '254 Taşıtlar (Duran Varlık), 102 Bankalar (Dönen Varlık), 321 Borç Senetleri (Pasif).',
          },
          {
            level: 3,
            title: '3. Aşama: Borç ve Alacak Yönleri',
            content:
              'Taşıt arttığı için 254 BORÇ (60.000); banka azaldığı için 102 ALACAK (20.000) ve senet borcu arttığı için 321 ALACAK (40.000).',
          },
          {
            level: 4,
            title: '4. Aşama: Tam Yevmiye Kaydı',
            content:
              '254 Taşıtlar (B: 60.000) / 102 Bankalar (A: 20.000), 321 Borç Senetleri (A: 40.000)',
          },
        ],
      },
      {
        id: 'tx-m3',
        order: 3,
        date: '10.12.2026',
        title: 'Senet Karşılığı Ticari Mal Satışı (Hasılat Kaydı)',
        description:
          'İşletme, müşteriye 70.000 TL tutarında ticari mal satmış ve karşılığında müşteriden 60 gün vadeli alacak senedi (bono) teslim almıştır.',
        amount: 70000,
        expectedEntry: {
          educationalNotes:
            'Müşteriden senet alındığı için 121 Alacak Senetleri borçlandırılır; satış hasılatı doğduğu için 600 Yurtiçi Satışlar alacaklandırılır.',
          lines: [
            { accountCode: '121', debit: 70000, credit: 0 },
            { accountCode: '600', debit: 0, credit: 70000 },
          ],
        },
        hints: [
          {
            level: 1,
            title: '1. Aşama: İşlemde Neler Değişti?',
            content:
              'Senetli alacağımız arttı ve 70.000 TL satış geliri doğdu.',
          },
          {
            level: 2,
            title: '2. Aşama: Hangi Hesaplar Kullanılır?',
            content:
              '121 Alacak Senetleri (Aktif) ve 600 Yurtiçi Satışlar (Gelir).',
          },
          {
            level: 3,
            title: '3. Aşama: Borç ve Alacak Yönleri',
            content:
              '121 Alacak Senetleri BORÇ (70.000 TL); 600 Yurtiçi Satışlar ALACAK (70.000 TL).',
          },
          {
            level: 4,
            title: '4. Aşama: Tam Yevmiye Kaydı',
            content:
              '121 Alacak Senetleri (B: 70.000) / 600 Yurtiçi Satışlar (A: 70.000)',
          },
        ],
      },
      {
        id: 'tx-m4',
        order: 4,
        date: '10.12.2026',
        title: 'Satılan Ticari Malların Maliyet Kaydı (621 STMM)',
        description:
          'Bir önceki işlemde 70.000 TL\'ye satılan ticari malların işletmeye olan alış (depo çıkış) maliyetinin 45.000 TL olduğu tespit edilmiş ve stoktan düşülmüştür.',
        amount: 45000,
        expectedEntry: {
          educationalNotes:
            'Devamlı envanter / maliyet kaydında: Satılan malın alış maliyeti kadar "621 Satılan Ticari Mallar Maliyeti (-)" hesabı BORÇLANDIRILIR; depodan mal çıktığı için "153 Ticari Mallar" hesabı ALACAKLANDIRILIR.',
          lines: [
            { accountCode: '621', debit: 45000, credit: 0 },
            { accountCode: '153', debit: 0, credit: 45000 },
          ],
        },
        hints: [
          {
            level: 1,
            title: '1. Aşama: Maliyet Kaydı Neden Yapılır?',
            content:
              'Mal sattığımızda depodaki malımız (153) azalır ve satılan malın alış bedeli kadar bir maliyet gideri (621) oluşur.',
          },
          {
            level: 2,
            title: '2. Aşama: Hangi Hesaplar Kullanılır?',
            content:
              '"621 Satılan Ticari Mallar Maliyeti (-)" (Maliyet/Gider) ve "153 Ticari Mallar" (Varlık/Stok).',
          },
          {
            level: 3,
            title: '3. Aşama: Borç ve Alacak Yönleri',
            content:
              'Maliyet/gider hesabı olan 621 daima BORÇ (45.000 TL); depodan çıkan malı gösteren 153 Ticari Mallar ALACAK (45.000 TL) yazılır.',
          },
          {
            level: 4,
            title: '4. Aşama: Tam Yevmiye Kaydı',
            content:
              '621 Satılan Ticari Mallar Maliyeti (-) (B: 45.000) / 153 Ticari Mallar (A: 45.000)',
          },
        ],
      },
      {
        id: 'tx-m5',
        order: 5,
        date: '15.12.2026',
        title: 'Müşterinin Sattığımız Malın Bir Kısmını İade Etmesi (610)',
        description:
          'Müşteri, daha önce satın aldığı mallardan 10.000 TL\'lik kısmını standartlara uymadığı gerekçesiyle işletmeye iade etmiştir. İade tutarı müşterinin senetli borcundan düşülmüştür.',
        amount: 10000,
        expectedEntry: {
          educationalNotes:
            'Sınav Kuralı: Satılan mal müşteri tarafından iade edildiğinde 600 Yurtiçi Satışlar hesabı doğrudan borçlandırılmaz! Bunun yerine "610 Satıştan İadeler (-)" hesabı BORÇ yazılır, müşterinin senetli alacağı azaldığı için "121 Alacak Senetleri" ALACAK yazılır.',
          lines: [
            { accountCode: '610', debit: 10000, credit: 0 },
            { accountCode: '121', debit: 0, credit: 10000 },
          ],
        },
        hints: [
          {
            level: 1,
            title: '1. Aşama: Satış İadesinde Hangi Hesap Kullanılır?',
            content:
              'Müşteri mal iade ettiğinde 600 hesabına dokunulmaz; brüt satışı düzeltmek için "610 Satıştan İadeler (-)" hesabı kullanılır.',
          },
          {
            level: 2,
            title: '2. Aşama: Karşı Hesap Nedir?',
            content:
              'İade bedeli müşterinin senetli borcundan düşüldüğü için "121 Alacak Senetleri" azalır.',
          },
          {
            level: 3,
            title: '3. Aşama: Borç ve Alacak Yönleri',
            content:
              '610 Satıştan İadeler (-) gelir azaltıcı (gider karakterli) olduğu için BORÇ (10.000 TL); 121 Alacak Senetleri azaldığı için ALACAK (10.000 TL) yazılır.',
          },
          {
            level: 4,
            title: '4. Aşama: Tam Yevmiye Kaydı',
            content:
              '610 Satıştan İadeler (-) (B: 10.000) / 121 Alacak Senetleri (A: 10.000)',
          },
        ],
      },
      {
        id: 'tx-m6',
        order: 6,
        date: '31.12.2026',
        title: 'Dönem Sonu Taşıt Amortisman (Yıpranma Payı) Kaydı',
        description:
          'Dönem sonunda işletmenin yönetim ve sevkiyat faaliyetlerinde kullanılan 60.000 TL değerindeki taşıt için %20 oranında (12.000 TL) yıllık amortisman (yıpranma payı) ayrılmıştır.',
        amount: 12000,
        expectedEntry: {
          educationalNotes:
            'Amortisman gideri için 770 Genel Yönetim Giderleri BORÇ yazılır; duran varlığın değer azalışını izleyen düzenleyici hesap "257 Birikmiş Amortismanlar (-)" ise ALACAK yazılır.',
          lines: [
            { accountCode: '770', debit: 12000, credit: 0 },
            { accountCode: '257', debit: 0, credit: 12000 },
          ],
        },
        hints: [
          {
            level: 1,
            title: '1. Aşama: Amortisman Nedir?',
            content:
              'Taşıt, bina, demirbaş gibi duran varlıkların yıl sonunda eskime payının gider yazılmasıdır.',
          },
          {
            level: 2,
            title: '2. Aşama: Hangi Hesaplar Kullanılır?',
            content:
              'Gider tarafı için "770 Genel Yönetim Giderleri", biriken yıpranma payı için "257 Birikmiş Amortismanlar (-)" kullanılır (254 Taşıtlar hesabından doğrudan düşülmez!).',
          },
          {
            level: 3,
            title: '3. Aşama: Borç ve Alacak Yönleri',
            content:
              '770 Genel Yönetim Giderleri BORÇ (12.000 TL); aktifi düzenleyen pasif hesap olan 257 Birikmiş Amortismanlar (-) ALACAK (12.000 TL) yazılır.',
          },
          {
            level: 4,
            title: '4. Aşama: Tam Yevmiye Kaydı',
            content:
              '770 Genel Yönetim Giderleri (B: 12.000) / 257 Birikmiş Amortismanlar (-) (A: 12.000)',
          },
        ],
      },
    ],
  },
];
