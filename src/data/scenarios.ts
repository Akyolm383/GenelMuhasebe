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
  {
    id: 'trend-eticaret-iskonto-kolay',
    title: 'Trend E-Ticaret Ltd. - Satış İskontosu, POS ve Kargo Giderleri',
    difficulty: 'Kolay',
    companyName: 'Trend E-Ticaret Ltd. Şti.',
    establishedDate: '10.10.2026',
    initialCapital: 150000,
    description:
      'E-ticaret işletmelerinde kredi kartı (POS) ile satış tahsilatı, kargo/pazarlama giderleri ve müşteriye yapılan erken ödeme (kasa) iskontolarını kapsayan pratik çalışma seti.',
    learningObjectives: [
      'Banka mevduatı ile kuruluş sermayesi kaydı (102 Borç / 500 Alacak)',
      'Ticari mal alımında KDV ve bankadan ödeme kaydı',
      'Kredi kartı sliplerinin 108 Diğer Hazır Değerler hesabında izlenmesi',
      'Müşteriye erken ödeme yapıldığında 611 Satış İskontoları (-) hesabının borçlandırılması',
    ],
    transactions: [
      {
        id: 'tx-tr1',
        order: 1,
        date: '10.10.2026',
        title: 'İşletmenin Banka Sermayesi ile Kuruluşu',
        description:
          'Ortaklar işletmeyi 150.000 TL nakit sermaye ile kurmuş, tutarın tamamı işletmenin banka vadesiz mevduat hesabına yatırılmıştır.',
        amount: 150000,
        expectedEntry: {
          educationalNotes:
            'Banka hesabımızdaki para arttığı için 102 Bankalar (Aktif) borçlandırılır; şirkete taahhüt edilen sermaye için 500 Sermaye (Pasif) alacaklandırılır.',
          lines: [
            { accountCode: '102', debit: 150000, credit: 0 },
            { accountCode: '500', debit: 0, credit: 150000 },
          ],
        },
        hints: [
          {
            level: 1,
            title: '1. Aşama: İşlemde Neler Değişti?',
            content: 'Banka hesabımızdaki nakit varlık arttı ve işletmeye sermaye konuldu.',
          },
          {
            level: 2,
            title: '2. Aşama: Hangi Hesaplar Kullanılır?',
            content: 'Banka hesabı için "102 Bankalar", konulan sermaye için "500 Sermaye" kullanılır.',
          },
          {
            level: 3,
            title: '3. Aşama: Borç ve Alacak Yönleri',
            content: '102 Bankalar BORÇ (150.000 TL), 500 Sermaye ALACAK (150.000 TL) yazılır.',
          },
          {
            level: 4,
            title: '4. Aşama: Tam Yevmiye Kaydı',
            content: '102 Bankalar (Borç: 150.000) / 500 Sermaye (Alacak: 150.000)',
          },
        ],
      },
      {
        id: 'tx-tr2',
        order: 2,
        date: '12.10.2026',
        title: '%20 KDV\'li Toptan Mal Alımı ve Bankadan Ödenmesi',
        description:
          'İşletme, internetten satmak amacıyla 30.000 TL + %20 KDV (6.000 TL) tutarında ticari malı toptancıdan satın almış ve toplam 36.000 TL bedeli banka havalesiyle ödemiştir.',
        amount: 36000,
        expectedEntry: {
          educationalNotes:
            'Satın alınan mallar için 153 Ticari Mallar borçlandırılır; ödenen vergi için 191 İndirilecek KDV borçlandırılır; toplam ödeme için 102 Bankalar alacaklandırılır.',
          lines: [
            { accountCode: '153', debit: 30000, credit: 0 },
            { accountCode: '191', debit: 6000, credit: 0 },
            { accountCode: '102', debit: 0, credit: 36000 },
          ],
        },
        hints: [
          {
            level: 1,
            title: '1. Aşama: İşlemde Neler Değişti?',
            content: 'Depodaki malımız ve ödediğimiz KDV hakkımız arttı, bankadaki paramız azaldı.',
          },
          {
            level: 2,
            title: '2. Aşama: Hangi Hesaplar Kullanılır?',
            content: 'Mallar için "153 Ticari Mallar", alış KDV\'si için "191 İndirilecek KDV", ödeme için "102 Bankalar".',
          },
          {
            level: 3,
            title: '3. Aşama: Borç ve Alacak Yönleri',
            content: '153 BORÇ (30.000 TL), 191 BORÇ (6.000 TL), 102 ALACAK (36.000 TL).',
          },
          {
            level: 4,
            title: '4. Aşama: Tam Yevmiye Kaydı',
            content: '153 Ticari Mallar (B: 30.000) - 191 İnd. KDV (B: 6.000) / 102 Bankalar (A: 36.000)',
          },
        ],
      },
      {
        id: 'tx-tr3',
        order: 3,
        date: '15.10.2026',
        title: 'Kredi Kartı (Sanal POS) ile Mal Satışı',
        description:
          'Müşterilere e-ticaret sitesi üzerinden 40.000 TL + %20 KDV (8.000 TL) tutarında mal satılmış, toplam 48.000 TL tutar müşterilerin kredi kartından sanal POS ile tahsil edilmiştir.',
        amount: 48000,
        expectedEntry: {
          educationalNotes:
            'Kredi kartı slipleri henüz bankaya geçmediği için 108 Diğer Hazır Değerler hesabında borçlandırılır; hasılat için 600 Yurtiçi Satışlar ve tahsil edilen vergi için 391 Hesaplanan KDV alacaklandırılır.',
          lines: [
            { accountCode: '108', debit: 48000, credit: 0 },
            { accountCode: '600', debit: 0, credit: 40000 },
            { accountCode: '391', debit: 0, credit: 8000 },
          ],
        },
        hints: [
          {
            level: 1,
            title: '1. Aşama: Tahsilat Yolu Nedir?',
            content: 'Tahsilat nakit veya banka değil, kredi kartı (POS slipi) iledir.',
          },
          {
            level: 2,
            title: '2. Aşama: POS Slipleri Hangi Hesaba Yazılır?',
            content: 'Kredi kartı slipleri için "108 Diğer Hazır Değerler" borçlandırılır.',
          },
          {
            level: 3,
            title: '3. Aşama: Borç ve Alacak Yönleri',
            content: '108 BORÇ (48.000 TL), 600 ALACAK (40.000 TL), 391 ALACAK (8.000 TL).',
          },
          {
            level: 4,
            title: '4. Aşama: Tam Yevmiye Kaydı',
            content: '108 Diğer Hazır Değerler (B: 48.000) / 600 Yurtiçi Satışlar (A: 40.000) - 391 Hes. KDV (A: 8.000)',
          },
        ],
      },
      {
        id: 'tx-tr4',
        order: 4,
        date: '18.10.2026',
        title: 'Müşteriye Erken Ödeme İskontosu Tanınması (611)',
        description:
          'Daha önce veresiye mal satın alan bir müşteri 10.000 TL tutarındaki borcunu vadesinden önce ödemiştir. Müşteriye %10 (1.000 TL) kasa erken ödeme iskontosu uygulanmış, kalan 9.000 TL işletmenin banka hesabına havale edilmiştir.',
        amount: 10000,
        expectedEntry: {
          educationalNotes:
            'Satıştan sonra tanınan kasa veya miktar iskontoları 600 hesabından doğrudan düşülmez; Gelir tablosunda satış indirimleri grubunda yer alan "611 Satış İskontoları (-)" hesabı BORÇ yazılır.',
          lines: [
            { accountCode: '102', debit: 9000, credit: 0 },
            { accountCode: '611', debit: 1000, credit: 0 },
            { accountCode: '120', debit: 0, credit: 10000 },
          ],
        },
        hints: [
          {
            level: 1,
            title: '1. Aşama: İşlemde Neler Değişti?',
            content: 'Bankamıza 9.000 TL para girdi, müşteriden olan 10.000 TL alacağımız tamamen kapandı, aradaki 1.000 TL indirim ise iskonto gideridir.',
          },
          {
            level: 2,
            title: '2. Aşama: İskonto Hangi Hesaba Yazılır?',
            content: 'Satış faturasından sonra yapılan erken ödeme indirimi için "611 Satış İskontoları (-)" kullanılır.',
          },
          {
            level: 3,
            title: '3. Aşama: Borç ve Alacak Yönleri',
            content: '102 Bankalar BORÇ (9.000 TL), 611 Satış İskontoları BORÇ (1.000 TL) / 120 Alıcılar ALACAK (10.000 TL).',
          },
          {
            level: 4,
            title: '4. Aşama: Tam Yevmiye Kaydı',
            content: '102 Bankalar (B: 9.000) - 611 Satış İskontoları (-) (B: 1.000) / 120 Alıcılar (A: 10.000)',
          },
        ],
      },
    ],
  },
  {
    id: 'bogazici-kredi-faiz-kolay',
    title: 'Boğaziçi Yayıncılık - Banka Kredisi, Demirbaş ve Faiz Ödemesi',
    difficulty: 'Kolay',
    companyName: 'Boğaziçi Kitap ve Yayıncılık A.Ş.',
    establishedDate: '15.10.2026',
    initialCapital: 200000,
    description:
      'İşletmenin bankadan ticari kredi çekmesi, kredi ile demirbaş yatırımı yapması ve kredi anapara ile faiz giderlerinin muhasebeleştirilmesini öğreten temel finansman seti.',
    learningObjectives: [
      'Nakit kasa sermayesi ile kuruluş kaydı (100 Borç / 500 Alacak)',
      'Bankadan çekilen kısa vadeli kredinin 300 Banka Kredileri hesabında izlenmesi',
      'Yatırım amaçlı demirbaş alımının 255 Demirbaşlar hesabında aktifleştirilmesi',
      'Kredi faiz ödemesinde 780 Finansman Giderleri hesabının borçlandırılması',
    ],
    transactions: [
      {
        id: 'tx-bg1',
        order: 1,
        date: '15.10.2026',
        title: 'İşletmenin Nakit Sermaye ile Kuruluşu',
        description:
          'Yayınevi işletmesi 200.000 TL nakit sermaye konularak kurulmuş, tutarın tamamı şirket kasasına teslim edilmiştir.',
        amount: 200000,
        expectedEntry: {
          educationalNotes:
            'Kasa mevcudu arttığı için 100 Kasa borçlandırılır; şirkete taahhüt edilen sermaye için 500 Sermaye alacaklandırılır.',
          lines: [
            { accountCode: '100', debit: 200000, credit: 0 },
            { accountCode: '500', debit: 0, credit: 200000 },
          ],
        },
        hints: [
          {
            level: 1,
            title: '1. Aşama: İşlemde Neler Değişti?',
            content: 'Kasaya 200.000 TL nakit para girdi ve şirketin sermayesi oluştu.',
          },
          {
            level: 2,
            title: '2. Aşama: Hangi Hesaplar Kullanılır?',
            content: '100 Kasa (Aktif) ve 500 Sermaye (Pasif).',
          },
          {
            level: 3,
            title: '3. Aşama: Borç ve Alacak Yönleri',
            content: '100 Kasa BORÇ (200.000 TL) / 500 Sermaye ALACAK (200.000 TL).',
          },
          {
            level: 4,
            title: '4. Aşama: Tam Yevmiye Kaydı',
            content: '100 Kasa (B: 200.000) / 500 Sermaye (A: 200.000)',
          },
        ],
      },
      {
        id: 'tx-bg2',
        order: 2,
        date: '18.10.2026',
        title: 'Bankadan Kısa Vadeli Ticari Kredi Çekilmesi',
        description:
          'İşletme, yayın yatırımlarını finanse etmek üzere bankadan 6 ay vadeli 100.000 TL ticari kredi kullanmış; tutar işletmenin banka vadesiz mevduat hesabına yatırılmıştır.',
        amount: 100000,
        expectedEntry: {
          educationalNotes:
            'Bankadaki mevduatımız arttığı için 102 Bankalar borçlandırılır; bankaya olan kısa vadeli kredi borcumuz arttığı için 300 Banka Kredileri alacaklandırılır.',
          lines: [
            { accountCode: '102', debit: 100000, credit: 0 },
            { accountCode: '300', debit: 0, credit: 100000 },
          ],
        },
        hints: [
          {
            level: 1,
            title: '1. Aşama: Kredi Parası Nereye Girdi?',
            content: 'Kredi tutarı banka vadesiz hesabımıza aktarıldı, aynı zamanda bankaya kredi borcumuz doğdu.',
          },
          {
            level: 2,
            title: '2. Aşama: Hangi Hesaplar Kullanılır?',
            content: 'Banka hesabı için "102 Bankalar", kısa vadeli kredi borcu için "300 Banka Kredileri".',
          },
          {
            level: 3,
            title: '3. Aşama: Borç ve Alacak Yönleri',
            content: 'Varlık artışı olan 102 BORÇ (100.000 TL); borç/kaynak artışı olan 300 ALACAK (100.000 TL).',
          },
          {
            level: 4,
            title: '4. Aşama: Tam Yevmiye Kaydı',
            content: '102 Bankalar (B: 100.000) / 300 Banka Kredileri (A: 100.000)',
          },
        ],
      },
      {
        id: 'tx-bg3',
        order: 3,
        date: '20.10.2026',
        title: 'Ofis ve Baskı İçin Demirbaş Satın Alınması',
        description:
          'Yayınevi ofisi için 50.000 TL + %20 KDV (10.000 TL) tutarında bilgisayar ve baskı ekipmanı (demirbaş) satın alınmış, toplam 60.000 TL işletmenin banka hesabından ödenmiştir.',
        amount: 60000,
        expectedEntry: {
          educationalNotes:
            'Uzun ömürlü büro makineleri 255 Demirbaşlar hesabında aktifleştirilir; ödenen KDV 191 hesabına borç yazılır; bankadan çıkış için 102 hesabı alacaklandırılır.',
          lines: [
            { accountCode: '255', debit: 50000, credit: 0 },
            { accountCode: '191', debit: 10000, credit: 0 },
            { accountCode: '102', debit: 0, credit: 60000 },
          ],
        },
        hints: [
          {
            level: 1,
            title: '1. Aşama: Satın Alınan Şey Nedir?',
            content: 'Satmak için alınan mal değil, ofiste 1 yıldan uzun süre kullanılacak demirbaştır.',
          },
          {
            level: 2,
            title: '2. Aşama: Hangi Hesaplar Kullanılır?',
            content: 'Duran varlık için "255 Demirbaşlar", KDV için "191 İndirilecek KDV", ödeme için "102 Bankalar".',
          },
          {
            level: 3,
            title: '3. Aşama: Borç ve Alacak Yönleri',
            content: '255 BORÇ (50.000 TL), 191 BORÇ (10.000 TL) / 102 ALACAK (60.000 TL).',
          },
          {
            level: 4,
            title: '4. Aşama: Tam Yevmiye Kaydı',
            content: '255 Demirbaşlar (B: 50.000) - 191 İnd. KDV (B: 10.000) / 102 Bankalar (A: 60.000)',
          },
        ],
      },
      {
        id: 'tx-bg4',
        order: 4,
        date: '28.10.2026',
        title: 'Kredi Anapara Taksiti ve Faiz Giderinin Ödenmesi',
        description:
          'Banka kredisinin 1. taksiti olarak 20.000 TL anapara ve 3.000 TL kredi faizi olmak üzere toplam 23.000 TL işletmenin banka hesabından tahsil edilmiştir.',
        amount: 23000,
        expectedEntry: {
          educationalNotes:
            'Kredi anapara ödemesi kredi borcunu azalttığı için 300 Banka Kredileri BORÇ yazılır; faiz külfeti dönem gideri olduğu için 780 Finansman Giderleri BORÇ yazılır; toplam ödeme için 102 Bankalar ALACAK yazılır.',
          lines: [
            { accountCode: '300', debit: 20000, credit: 0 },
            { accountCode: '780', debit: 3000, credit: 0 },
            { accountCode: '102', debit: 0, credit: 23000 },
          ],
        },
        hints: [
          {
            level: 1,
            title: '1. Aşama: Ödenen Tutarın Bileşenleri Nelerdir?',
            content: '20.000 TL anapara borcunu azaltır, 3.000 TL ise borçlanma faiz gideridir.',
          },
          {
            level: 2,
            title: '2. Aşama: Kredi Faizi Hangi Hesaba Yazılır?',
            content: 'Banka kredi faizleri için "780 Finansman Giderleri" borçlandırılır.',
          },
          {
            level: 3,
            title: '3. Aşama: Borç ve Alacak Yönleri',
            content: '300 Banka Kredileri BORÇ (20.000 TL), 780 Finansman Giderleri BORÇ (3.000 TL) / 102 Bankalar ALACAK (23.000 TL).',
          },
          {
            level: 4,
            title: '4. Aşama: Tam Yevmiye Kaydı',
            content:
              '300 Banka Kredileri (B: 20.000) - 780 Finansman Giderleri (B: 3.000) / 102 Bankalar (A: 23.000)',
          },
        ],
      },
    ],
  },
  {
    id: 'atlas-medikal-doviz-orta',
    title: 'Atlas Medikal A.Ş. - Dövizli İşlemler, İthalat ve Kambiyo Kâr/Zararı',
    difficulty: 'Orta',
    companyName: 'Atlas Medikal Cihazlar A.Ş.',
    establishedDate: '01.11.2026',
    initialCapital: 300000,
    description:
      'Döviz alımı, dövizli tıbbi cihaz ithalatı, döviz kurlarının yükselmesinden doğan kambiyo kârı (646) ve yabancı para borç ödemesindeki kambiyo zararı (656) muhasebesi.',
    learningObjectives: [
      'Banka mevduatından nakit döviz kasasına aktarma (100 Borç / 102 Alacak)',
      'Dövizli ticari mal alımının TL karşılığı ile kaydedilmesi',
      'Kur artışında döviz satışından doğan kârın 646 Kambiyo Kârları hesabına alacak yazılması',
      'Kur artışında döviz borcu ödenirken doğan zararın 656 Kambiyo Zararları (-) hesabına borç yazılması',
    ],
    transactions: [
      {
        id: 'tx-at1',
        order: 1,
        date: '01.11.2026',
        title: 'İşletmenin Banka Sermayesi ile Kuruluşu',
        description:
          'Şirket 300.000 TL nakit sermaye ile kurulmuş, sermaye tutarının tamamı şirket adına bankada açılan vadesiz TL hesabına yatırılmıştır.',
        amount: 300000,
        expectedEntry: {
          educationalNotes:
            'Bankadaki TL mevduatımız arttığı için 102 Bankalar borçlandırılır; şirkete taahhüt edilen sermaye için 500 Sermaye alacaklandırılır.',
          lines: [
            { accountCode: '102', debit: 300000, credit: 0 },
            { accountCode: '500', debit: 0, credit: 300000 },
          ],
        },
        hints: [
          {
            level: 1,
            title: '1. Aşama: İşlemde Neler Değişti?',
            content: 'Banka hesabımıza 300.000 TL girdi ve şirketin sermayesi oluştu.',
          },
          {
            level: 2,
            title: '2. Aşama: Hangi Hesaplar Kullanılır?',
            content: '102 Bankalar (Aktif) ve 500 Sermaye (Pasif).',
          },
          {
            level: 3,
            title: '3. Aşama: Borç ve Alacak Yönleri',
            content: '102 Bankalar BORÇ (300.000 TL) / 500 Sermaye ALACAK (300.000 TL).',
          },
          {
            level: 4,
            title: '4. Aşama: Tam Yevmiye Kaydı',
            content: '102 Bankalar (B: 300.000) / 500 Sermaye (A: 300.000)',
          },
        ],
      },
      {
        id: 'tx-at2',
        order: 2,
        date: '03.11.2026',
        title: 'İthalat İçin Bankadan Çekilen TL ile Nakit Döviz Alımı',
        description:
          'İthalat hazırlığı amacıyla bankadaki TL hesabımızdan 120.000 TL çekilerek 1 USD = 30 TL kuru üzerinden 4.000 USD nakit satın alınmış ve şirket kasasına konulmuştur.',
        amount: 120000,
        expectedEntry: {
          educationalNotes:
            'Tekdüzen hesap planında döviz mevcudu 100 Kasa hesabının döviz alt hesabında izlenir. Kasamızdaki para arttığı için 100 Kasa borçlandırılır; bankadaki TL azaldığı için 102 Bankalar alacaklandırılır.',
          lines: [
            { accountCode: '100', debit: 120000, credit: 0 },
            { accountCode: '102', debit: 0, credit: 120000 },
          ],
        },
        hints: [
          {
            level: 1,
            title: '1. Aşama: İşlemde Neler Değişti?',
            content: 'Kasamıza döviz girdi (TL karşılığı 120.000 TL), bankadaki TL mevduatımız azaldı.',
          },
          {
            level: 2,
            title: '2. Aşama: Hangi Hesaplar Kullanılır?',
            content: 'Nakit döviz için "100 Kasa", banka çıkışı için "102 Bankalar".',
          },
          {
            level: 3,
            title: '3. Aşama: Borç ve Alacak Yönleri',
            content: '100 Kasa BORÇ (120.000 TL) / 102 Bankalar ALACAK (120.000 TL).',
          },
          {
            level: 4,
            title: '4. Aşama: Tam Yevmiye Kaydı',
            content: '100 Kasa (B: 120.000) / 102 Bankalar (A: 120.000)',
          },
        ],
      },
      {
        id: 'tx-at3',
        order: 3,
        date: '07.11.2026',
        title: 'Döviz Kasasından Tıbbi Mal Alımı ve KDV\'nin Bankadan Ödenmesi',
        description:
          'İşletme 2.000 USD (60.000 TL maliyet) tutarında tıbbi cihaz malı satın almış ve bedelini döviz kasasından ödemiştir. İşlemin %20 KDV\'si olan 12.000 TL ise banka hesabından havale edilmiştir.',
        amount: 72000,
        expectedEntry: {
          educationalNotes:
            'Alınan tıbbi mallar TL maliyet bedeliyle 153 Ticari Mallar hesabında borçlandırılır; ödenen KDV için 191 borçlandırılır; döviz kasasından çıkış için 100 Kasa ve KDV ödemesi için 102 Bankalar alacaklandırılır.',
          lines: [
            { accountCode: '153', debit: 60000, credit: 0 },
            { accountCode: '191', debit: 12000, credit: 0 },
            { accountCode: '100', debit: 0, credit: 60000 },
            { accountCode: '102', debit: 0, credit: 12000 },
          ],
        },
        hints: [
          {
            level: 1,
            title: '1. Aşama: Giren ve Çıkan Varlıklar Nelerdir?',
            content: 'Depomuza 60.000 TL mal girdi, 12.000 TL KDV hakkı doğdu; kasadan 60.000 TL döviz, bankadan 12.000 TL çıktı.',
          },
          {
            level: 2,
            title: '2. Aşama: Hangi Hesaplar Kullanılır?',
            content: '153 Ticari Mallar, 191 İnd. KDV, 100 Kasa ve 102 Bankalar.',
          },
          {
            level: 3,
            title: '3. Aşama: Borç ve Alacak Yönleri',
            content: '153 BORÇ (60.000 TL), 191 BORÇ (12.000 TL) / 100 ALACAK (60.000 TL), 102 ALACAK (12.000 TL).',
          },
          {
            level: 4,
            title: '4. Aşama: Tam Yevmiye Kaydı',
            content: '153 (B: 60.000) - 191 (B: 12.000) / 100 (A: 60.000) - 102 (A: 12.000)',
          },
        ],
      },
      {
        id: 'tx-at4',
        order: 4,
        date: '15.11.2026',
        title: 'Kalan Dövizin Kur Artışı ile Kârla Bozdurulması (646)',
        description:
          'Kasadaki kalan 2.000 USD döviz (kayıtlı maliyeti 60.000 TL), dolar kurunun 1 USD = 34 TL seviyesine yükselmesiyle 68.000 TL karşılığında bozdurulmuş ve tutar banka hesabımıza yatırılmıştır.',
        amount: 68000,
        expectedEntry: {
          educationalNotes:
            'Bankaya giren 68.000 TL için 102 Bankalar BORÇ yazılır; kasadan çıkan kayıtlı maliyet 60.000 TL için 100 Kasa ALACAK yazılır; kur artışından doğan 8.000 TL kâr ise gelir hesabı olan 646 Kambiyo Kârları hesabına ALACAK yazılır.',
          lines: [
            { accountCode: '102', debit: 68000, credit: 0 },
            { accountCode: '100', debit: 0, credit: 60000 },
            { accountCode: '646', debit: 0, credit: 8000 },
          ],
        },
        hints: [
          {
            level: 1,
            title: '1. Aşama: Döviz Satışında Kâr Nasıl Hesaplanır?',
            content: 'Satış bedeli (68.000 TL) - Kayıtlı defter maliyeti (60.000 TL) = 8.000 TL Kur Farkı Kârı.',
          },
          {
            level: 2,
            title: '2. Aşama: Kur Kârı Hangi Hesaba Yazılır?',
            content: 'Döviz kur artış gelirleri için "646 Kambiyo Kârları" hesabı alacaklandırılır.',
          },
          {
            level: 3,
            title: '3. Aşama: Borç ve Alacak Yönleri',
            content: '102 Bankalar BORÇ (68.000 TL) / 100 Kasa ALACAK (60.000 TL), 646 Kambiyo Kârları ALACAK (8.000 TL).',
          },
          {
            level: 4,
            title: '4. Aşama: Tam Yevmiye Kaydı',
            content: '102 Bankalar (B: 68.000) / 100 Kasa (A: 60.000) - 646 Kambiyo Kârları (A: 8.000)',
          },
        ],
      },
      {
        id: 'tx-at5',
        order: 5,
        date: '25.11.2026',
        title: 'Dövizli Satıcı Borcunun Kur Artışı Zararıyla Ödenmesi (656)',
        description:
          'Daha önce 1 USD = 30 TL kuruyla 1.000 USD (30.000 TL) borçlanılan yabancı satıcıya olan borç, kur 1 USD = 33 TL seviyesine yükseldiğinde 33.000 TL olarak bankadan havale edilmiştir.',
        amount: 33000,
        expectedEntry: {
          educationalNotes:
            'Satıcıya olan kayıtlı 30.000 TL borç kapandığı için 320 Satıcılar BORÇ yazılır; kur artışı yüzünden fazladan ödenen 3.000 TL kur zararı için 656 Kambiyo Zararları (-) BORÇ yazılır; bankadan fiilen çıkan 33.000 TL için 102 Bankalar ALACAK yazılır.',
          lines: [
            { accountCode: '320', debit: 30000, credit: 0 },
            { accountCode: '656', debit: 3000, credit: 0 },
            { accountCode: '102', debit: 0, credit: 33000 },
          ],
        },
        hints: [
          {
            level: 1,
            title: '1. Aşama: Döviz Borcunda Kur Artışı Neden Zarardır?',
            content: '30.000 TL borç için kur yükseldiği için cebimizden 33.000 TL çıkmıştır; aradaki 3.000 TL işletme için kur zararıdır.',
          },
          {
            level: 2,
            title: '2. Aşama: Kur Zararı Hangi Hesaba Yazılır?',
            content: 'Olumsuz kur farkları ve döviz zararları için "656 Kambiyo Zararları (-)" borçlandırılır.',
          },
          {
            level: 3,
            title: '3. Aşama: Borç ve Alacak Yönleri',
            content: '320 Satıcılar BORÇ (30.000 TL), 656 Kambiyo Zararları BORÇ (3.000 TL) / 102 Bankalar ALACAK (33.000 TL).',
          },
          {
            level: 4,
            title: '4. Aşama: Tam Yevmiye Kaydı',
            content: '320 Satıcılar (B: 30.000) - 656 Kambiyo Zararları (-) (B: 3.000) / 102 Bankalar (A: 33.000)',
          },
        ],
      },
    ],
  },
  {
    id: 'dogu-otomotiv-senet-orta',
    title: 'Doğu Otomotiv - Senet Protestosu, Vade Farkı ve Senet Yenileme',
    difficulty: 'Orta',
    companyName: 'Doğu Otomotiv Yedek Parça Ltd.',
    establishedDate: '05.11.2026',
    initialCapital: 250000,
    description:
      'Senetli mal satışı, vadesinde ödenmeyen senedin noterden protesto edilmesi, protesto masrafı, vade farkı (faiz) eklenerek senedin yenilenmesi ve borç senedi ödemesini kapsayan vaka akışı.',
    learningObjectives: [
      'Bileşik sermaye (Kasa + Banka) ile kuruluş kaydı',
      'Senetli satışta 121 Alacak Senetleri ve KDV tahsilatı',
      'Noter protesto masrafının 770 Genel Yönetim Giderleri hesabına kaydı',
      'Senet yenilemesinde eski senedin kapatılması, vade farkı için 642 Faiz Gelirleri ve yeni senedin alınması',
      'Borç senedinin bankadan ödenmesi (321 Borç / 102 Alacak)',
    ],
    transactions: [
      {
        id: 'tx-dg1',
        order: 1,
        date: '05.11.2026',
        title: 'Bileşik Sermaye ile Kuruluş (Kasa + Banka)',
        description:
          'İşletme 100.000 TL nakit kasa ve 150.000 TL banka mevduatı olmak üzere toplam 250.000 TL sermaye konularak kurulmuştur.',
        amount: 250000,
        expectedEntry: {
          educationalNotes:
            'Kasadaki nakit için 100 Kasa BORÇ (100.000 TL), bankadaki para için 102 Bankalar BORÇ (150.000 TL); şirketin toplam sermayesi için 500 Sermaye ALACAK (250.000 TL) yazılır.',
          lines: [
            { accountCode: '100', debit: 100000, credit: 0 },
            { accountCode: '102', debit: 150000, credit: 0 },
            { accountCode: '500', debit: 0, credit: 250000 },
          ],
        },
        hints: [
          {
            level: 1,
            title: '1. Aşama: İşlemde Neler Değişti?',
            content: 'Kasa ve banka varlıklarımız arttı, toplam sermayemiz oluştu.',
          },
          {
            level: 2,
            title: '2. Aşama: Hangi Hesaplar Kullanılır?',
            content: '100 Kasa, 102 Bankalar ve 500 Sermaye.',
          },
          {
            level: 3,
            title: '3. Aşama: Borç ve Alacak Yönleri',
            content: '100 BORÇ (100.000 TL), 102 BORÇ (150.000 TL) / 500 ALACAK (250.000 TL).',
          },
          {
            level: 4,
            title: '4. Aşama: Tam Yevmiye Kaydı',
            content: '100 Kasa (B: 100.000) - 102 Bankalar (B: 150.000) / 500 Sermaye (A: 250.000)',
          },
        ],
      },
      {
        id: 'tx-dg2',
        order: 2,
        date: '08.11.2026',
        title: 'Senet Karşılığı Mal Satışı ve KDV\'nin Peşin Tahsili',
        description:
          'Müşteriye 50.000 TL + %20 KDV (10.000 TL) tutarında yedek parça satılmıştır. KDV tutarı olan 10.000 TL nakit kasaya tahsil edilmiş, kalan 50.000 TL için 30 gün vadeli senet (bono) alınmıştır.',
        amount: 60000,
        expectedEntry: {
          educationalNotes:
            'Kasaya giren nakit için 100 Kasa BORÇ (10.000 TL); alınan senet için 121 Alacak Senetleri BORÇ (50.000 TL); satış geliri için 600 Yurtiçi Satışlar ALACAK (50.000 TL); KDV için 391 Hesaplanan KDV ALACAK (10.000 TL) yazılır.',
          lines: [
            { accountCode: '100', debit: 100000 > 10000 ? 10000 : 10000, credit: 0 },
            { accountCode: '121', debit: 50000, credit: 0 },
            { accountCode: '600', debit: 0, credit: 50000 },
            { accountCode: '391', debit: 0, credit: 10000 },
          ],
        },
        hints: [
          {
            level: 1,
            title: '1. Aşama: Tahsilat Araçları Nelerdir?',
            content: '10.000 TL nakit kasa tahsilatı, 50.000 TL senet teslim alınması.',
          },
          {
            level: 2,
            title: '2. Aşama: Hangi Hesaplar Kullanılır?',
            content: '100 Kasa, 121 Alacak Senetleri, 600 Yurtiçi Satışlar, 391 Hesaplanan KDV.',
          },
          {
            level: 3,
            title: '3. Aşama: Borç ve Alacak Yönleri',
            content: '100 BORÇ (10.000 TL), 121 BORÇ (50.000 TL) / 600 ALACAK (50.000 TL), 391 ALACAK (10.000 TL).',
          },
          {
            level: 4,
            title: '4. Aşama: Tam Yevmiye Kaydı',
            content: '100 Kasa (B: 10.000) - 121 Alacak Senetleri (B: 50.000) / 600 (A: 50.000) - 391 (A: 10.000)',
          },
        ],
      },
      {
        id: 'tx-dg3',
        order: 3,
        date: '20.11.2026',
        title: 'Ödenmeyen Senedin Noterden Protestosu ve Masraf Kaydı',
        description:
          'Vadesi gelen 50.000 TL\'lik müşteri senedi borçlu tarafından ödenmemiştir. İşletme noter aracılığıyla senedi protesto ettirmiş ve 1.500 TL protesto masrafını kasadan peşin ödemiştir.',
        amount: 1500,
        expectedEntry: {
          educationalNotes:
            'Ödenmeyen senedin yasal takibe hazırlanmasında ödenen noter protesto masrafı işletmenin idari gideri olduğu için 770 Genel Yönetim Giderleri BORÇ yazılır; kasadan nakit ödendiği için 100 Kasa ALACAK yazılır.',
          lines: [
            { accountCode: '770', debit: 1500, credit: 0 },
            { accountCode: '100', debit: 0, credit: 1500 },
          ],
        },
        hints: [
          {
            level: 1,
            title: '1. Aşama: Noter Masrafı Hangi Tür Harcamadır?',
            content: 'İşletmenin yönetimsel ve hukuki takip gideridir.',
          },
          {
            level: 2,
            title: '2. Aşama: Hangi Hesaplar Kullanılır?',
            content: 'Gider için "770 Genel Yönetim Giderleri", ödeme için "100 Kasa".',
          },
          {
            level: 3,
            title: '3. Aşama: Borç ve Alacak Yönleri',
            content: '770 Genel Yönetim Giderleri BORÇ (1.500 TL) / 100 Kasa ALACAK (1.500 TL).',
          },
          {
            level: 4,
            title: '4. Aşama: Tam Yevmiye Kaydı',
            content: '770 Genel Yönetim Giderleri (B: 1.500) / 100 Kasa (A: 1.500)',
          },
        ],
      },
      {
        id: 'tx-dg4',
        order: 4,
        date: '22.11.2026',
        title: 'Vade Farkı Eklenerek Senedin Yeni Bir Senetle Yenilenmesi (Reeskont)',
        description:
          'Borçlu müşteri işletmeye başvurarak özür dilemiş ve senedin yenilenmesini talep etmiştir. Protestolu 50.000 TL\'lik senet iade edilmiş, 4.500 TL gecikme faizi (vade farkı) eklenerek 54.500 TL nominal değerli yeni bir senet teslim alınmıştır.',
        amount: 54500,
        expectedEntry: {
          educationalNotes:
            'Alınan yeni senet için 121 Alacak Senetleri BORÇ (54.500 TL) yazılır; müşteriye iade edilen eski senet kapandığı için 121 Alacak Senetleri ALACAK (50.000 TL) yazılır; vade farkı faizi işletmenin geliri olduğu için 642 Faiz Gelirleri ALACAK (4.500 TL) yazılır.',
          lines: [
            { accountCode: '121', debit: 54500, credit: 0 },
            { accountCode: '121', debit: 0, credit: 50000 },
            { accountCode: '642', debit: 0, credit: 4500 },
          ],
        },
        hints: [
          {
            level: 1,
            title: '1. Aşama: Senet Yenileme Mantığı Nedir?',
            content: 'Eski senet alacaklandırılarak portföyden çıkarılır, vade farkı faizi gelir yazılır, yeni senet ise toplam tutarıyla borçlandırılır.',
          },
          {
            level: 2,
            title: '2. Aşama: Vade Farkı Hangi Hesaba Yazılır?',
            content: 'Senet yenilenmesinde kazanılan gecikme/vade faizi için "642 Faiz Gelirleri" alacaklandırılır.',
          },
          {
            level: 3,
            title: '3. Aşama: Borç ve Alacak Yönleri',
            content: '121 Yeni Senet BORÇ (54.500 TL) / 121 Eski Senet ALACAK (50.000 TL), 642 Faiz Gelirleri ALACAK (4.500 TL).',
          },
          {
            level: 4,
            title: '4. Aşama: Tam Yevmiye Kaydı',
            content: '121 Alacak Senetleri [Yeni] (B: 54.500) / 121 Alacak Senetleri [Eski] (A: 50.000) - 642 Faiz Gelirleri (A: 4.500)',
          },
        ],
      },
      {
        id: 'tx-dg5',
        order: 5,
        date: '28.11.2026',
        title: 'İşletmenin Kendi Borç Senedini (321) Bankadan Ödemesi',
        description:
          'İşletmenin daha önce mal alımı karşılığında satıcıya imzalayıp verdiği 35.000 TL tutarındaki borç senedi vadesinde banka mevduat hesabımızdan ödenmiştir.',
        amount: 35000,
        expectedEntry: {
          educationalNotes:
            'Senetli borcumuz azaldığı için pasif borç hesabı 321 Borç Senetleri BORÇ yazılır; bankadaki mevduatımız azaldığı için 102 Bankalar ALACAK yazılır.',
          lines: [
            { accountCode: '321', debit: 35000, credit: 0 },
            { accountCode: '102', debit: 0, credit: 35000 },
          ],
        },
        hints: [
          {
            level: 1,
            title: '1. Aşama: İşlemde Neler Değişti?',
            content: 'Senetli borcumuz bitti (kapandı) ve banka hesabımızdan para çıktı.',
          },
          {
            level: 2,
            title: '2. Aşama: Hangi Hesaplar Kullanılır?',
            content: 'Kendi senetli borcumuz için "321 Borç Senetleri", banka için "102 Bankalar".',
          },
          {
            level: 3,
            title: '3. Aşama: Borç ve Alacak Yönleri',
            content: '321 Borç Senetleri BORÇ (35.000 TL) / 102 Bankalar ALACAK (35.000 TL).',
          },
          {
            level: 4,
            title: '4. Aşama: Tam Yevmiye Kaydı',
            content: '321 Borç Senetleri (B: 35.000) / 102 Bankalar (A: 35.000)',
          },
        ],
      },
    ],
  },
  {
    id: 'ege-lojistik-supheli-orta',
    title: 'Ege Lojistik - Şüpheli Alacaklar ve Karşılık Ayrılması Süreci',
    difficulty: 'Orta',
    companyName: 'Ege Lojistik & Antrepo Hizmetleri',
    establishedDate: '10.11.2026',
    initialCapital: 350000,
    description:
      'Veresiye satış, vadesi geçen alacağın şüpheli hale gelmesi (128), ihtiyatlılık ilkesi gereği karşılık ayrılması (129-654), icra kanalıyla kısmi tahsilat ve karşılık iptali (644).',
    learningObjectives: [
      'Banka sermayesi ile şirket kuruluşu',
      'Veresiye hizmet satışında 120 Alıcılar ve 391 Hesaplanan KDV kaydı',
      'Dava/icra aşamasına gelen alacağın 128 Şüpheli Ticari Alacaklar hesabına aktarılması',
      'Dönem sonu karşılık ayrılmasında 654 Karşılık Giderleri ve 129 Şüpheli Alacaklar Karşılığı (-)',
      'Tahsilatta karşılığın kapatılması ve fazlalığın 644 Konusu Kalmayan Karşılıklar hesabına alacak yazılması',
    ],
    transactions: [
      {
        id: 'tx-eg1',
        order: 1,
        date: '10.11.2026',
        title: 'İşletmenin Banka Sermayesi ile Kuruluşu',
        description:
          'Lojistik şirketi 350.000 TL nakit sermaye ile kurulmuş, tutarın tamamı şirket banka hesabına yatırılmıştır.',
        amount: 350000,
        expectedEntry: {
          educationalNotes:
            'Bankadaki paramız arttığı için 102 Bankalar BORÇ (350.000 TL); ortakların sermayesi için 500 Sermaye ALACAK (350.000 TL) yazılır.',
          lines: [
            { accountCode: '102', debit: 350000, credit: 0 },
            { accountCode: '500', debit: 0, credit: 350000 },
          ],
        },
        hints: [
          {
            level: 1,
            title: '1. Aşama: İşlemde Neler Değişti?',
            content: 'Banka mevcudu arttı ve şirket sermayesi kaydedildi.',
          },
          {
            level: 2,
            title: '2. Aşama: Hangi Hesaplar Kullanılır?',
            content: '102 Bankalar ve 500 Sermaye.',
          },
          {
            level: 3,
            title: '3. Aşama: Borç ve Alacak Yönleri',
            content: '102 BORÇ (350.000 TL) / 500 ALACAK (350.000 TL).',
          },
          {
            level: 4,
            title: '4. Aşama: Tam Yevmiye Kaydı',
            content: '102 Bankalar (B: 350.000) / 500 Sermaye (A: 350.000)',
          },
        ],
      },
      {
        id: 'tx-eg2',
        order: 2,
        date: '12.11.2026',
        title: 'Veresiye Lojistik / Taşımacılık Hizmeti Satışı',
        description:
          'Müşteri firmaya 80.000 TL + %20 KDV (16.000 TL) tutarında veresiye (açık hesap) taşımacılık hizmeti verilmiş ve toplam 96.000 TL fatura düzenlenmiştir.',
        amount: 96000,
        expectedEntry: {
          educationalNotes:
            'Müşteriden olan veresiye alacağımız için 120 Alıcılar BORÇ (96.000 TL); hasılat için 600 Yurtiçi Satışlar ALACAK (80.000 TL); hesaplanan vergi için 391 Hesaplanan KDV ALACAK (16.000 TL) yazılır.',
          lines: [
            { accountCode: '120', debit: 96000, credit: 0 },
            { accountCode: '600', debit: 0, credit: 80000 },
            { accountCode: '391', debit: 0, credit: 16000 },
          ],
        },
        hints: [
          {
            level: 1,
            title: '1. Aşama: İşlemde Neler Değişti?',
            content: 'Veresiye alacağımız arttı, hizmet satış geliri ve KDV borcu doğdu.',
          },
          {
            level: 2,
            title: '2. Aşama: Hangi Hesaplar Kullanılır?',
            content: '120 Alıcılar, 600 Yurtiçi Satışlar, 391 Hesaplanan KDV.',
          },
          {
            level: 3,
            title: '3. Aşama: Borç ve Alacak Yönleri',
            content: '120 BORÇ (96.000 TL) / 600 ALACAK (80.000 TL), 391 ALACAK (16.000 TL).',
          },
          {
            level: 4,
            title: '4. Aşama: Tam Yevmiye Kaydı',
            content: '120 Alıcılar (B: 96.000) / 600 Yurtiçi Satışlar (A: 80.000) - 391 Hes. KDV (A: 16.000)',
          },
        ],
      },
      {
        id: 'tx-eg3',
        order: 3,
        date: '20.11.2026',
        title: 'Alacağın Şüpheli Hale Gelmesi ve İcraya Verilmesi',
        description:
          'Vadesi geçen ve yapılan tüm uyarılara rağmen ödenmeyen 96.000 TL\'lik müşteri alacağı için icra takibi başlatılmış ve alacak şüpheli alacaklar hesabına aktarılmıştır.',
        amount: 96000,
        expectedEntry: {
          educationalNotes:
            'Alacak artık normal alacak olmaktan çıkıp dava/icra safhasına girdiği için 128 Şüpheli Ticari Alacaklar BORÇ yazılır; normal müşteri hesabı olan 120 Alıcılar ALACAK yazılarak kapatılır.',
          lines: [
            { accountCode: '128', debit: 96000, credit: 0 },
            { accountCode: '120', debit: 0, credit: 96000 },
          ],
        },
        hints: [
          {
            level: 1,
            title: '1. Aşama: Şüpheli Alacak Ne Zaman Doğar?',
            content: 'Vadesinde ödenmeyip dava veya icra safhasına intikal eden alacaklar şüpheli hale gelir.',
          },
          {
            level: 2,
            title: '2. Aşama: Hangi Hesaplar Kullanılır?',
            content: 'Yeni durum için "128 Şüpheli Ticari Alacaklar", kapanan alacak için "120 Alıcılar".',
          },
          {
            level: 3,
            title: '3. Aşama: Borç ve Alacak Yönleri',
            content: '128 BORÇ (96.000 TL) / 120 ALACAK (96.000 TL).',
          },
          {
            level: 4,
            title: '4. Aşama: Tam Yevmiye Kaydı',
            content: '128 Şüpheli Ticari Alacaklar (B: 96.000) / 120 Alıcılar (A: 96.000)',
          },
        ],
      },
      {
        id: 'tx-eg4',
        order: 4,
        date: '25.11.2026',
        title: 'İhtiyatlılık Gereği Şüpheli Alacağa %50 Karşılık Ayrılması',
        description:
          'Dönem sonunda icra safhasındaki 96.000 TL\'lik şüpheli alacağın tahsilinin zorlaşması üzerine ihtiyatlılık ilkesi gereğince %50 oranında (48.000 TL) değer düşüklüğü karşılığı ayrılmıştır.',
        amount: 48000,
        expectedEntry: {
          educationalNotes:
            'Ayrılan karşılık dönem gideri olduğu için 654 Karşılık Giderleri (-) BORÇ yazılır; aktifi düzenleyen pasif karakterli hesap olan 129 Şüpheli Ticari Alacaklar Karşılığı (-) ALACAK yazılır.',
          lines: [
            { accountCode: '654', debit: 48000, credit: 0 },
            { accountCode: '129', debit: 0, credit: 48000 },
          ],
        },
        hints: [
          {
            level: 1,
            title: '1. Aşama: Karşılık Ayırma Mantığı Nedir?',
            content: 'Muhtemel zararı şimdiden gider yazarak bilançoda alacağı net değeriyle göstermektir.',
          },
          {
            level: 2,
            title: '2. Aşama: Hangi Hesaplar Kullanılır?',
            content: 'Gider için "654 Karşılık Giderleri (-)", karşılık için "129 Şüpheli Ticari Alacaklar Karşılığı (-)".',
          },
          {
            level: 3,
            title: '3. Aşama: Borç ve Alacak Yönleri',
            content: '654 Karşılık Giderleri BORÇ (48.000 TL) / 129 Şüpheli Alacaklar Karşılığı (-) ALACAK (48.000 TL).',
          },
          {
            level: 4,
            title: '4. Aşama: Tam Yevmiye Kaydı',
            content: '654 Karşılık Giderleri (-) (B: 48.000) / 129 Şüpheli Ticari Alacaklar Karşılığı (-) (A: 48.000)',
          },
        ],
      },
      {
        id: 'tx-eg5',
        order: 5,
        date: '30.11.2026',
        title: 'Şüpheli Alacağın Kısmen Tahsili ve Karşılığın İptali (Sınav Sorusu!)',
        description:
          'İcra dairesi kanalıyla borçludan 60.000 TL nakit tahsil edilerek şirket banka hesabına aktarılmıştır. Kalan 36.000 TL alacak tahsil imkanı kalmadığı için değersiz alacak olarak silinmiş ve önceden ayrılan 48.000 TL karşılık hesabı tamamen kapatılmıştır.',
        amount: 60000,
        expectedEntry: {
          educationalNotes:
            'Bankaya tahsil edilen para için 102 Bankalar BORÇ (60.000 TL); önceden ayrılmış olan karşılık kapatıldığı için 129 Şüpheli Alacaklar Karşılığı (-) BORÇ (48.000 TL); şüpheli alacak tamamen tasfiye olduğu için 128 Şüpheli Alacaklar ALACAK (96.000 TL); zarar beklentisinden fazla tahsilat yapıldığı için aradaki 12.000 TL fazla kısım 644 Konusu Kalmayan Karşılıklar hesabına ALACAK yazılır.',
          lines: [
            { accountCode: '102', debit: 60000, credit: 0 },
            { accountCode: '129', debit: 48000, credit: 0 },
            { accountCode: '128', debit: 0, credit: 96000 },
            { accountCode: '644', debit: 0, credit: 12000 },
          ],
        },
        hints: [
          {
            level: 1,
            title: '1. Aşama: İşlemde Kapanan ve Giren Değerler Nelerdir?',
            content: 'Bankamıza 60.000 TL girdi, 128 hesabı (96.000 TL) ve 129 hesabı (48.000 TL) tamamen kapatılır.',
          },
          {
            level: 2,
            title: '2. Aşama: Fazla Karşılık Nereye Yazılır?',
            content: 'Ayrılan karşılık fiili zarardan (36.000 TL) fazla çıktığı için aradaki 12.000 TL "644 Konusu Kalmayan Karşılıklar" gelir hesabına yazılır.',
          },
          {
            level: 3,
            title: '3. Aşama: Borç ve Alacak Yönleri',
            content: '102 BORÇ (60.000 TL), 129 BORÇ (48.000 TL) / 128 ALACAK (96.000 TL), 644 ALACAK (12.000 TL).',
          },
          {
            level: 4,
            title: '4. Aşama: Tam Yevmiye Kaydı',
            content:
              '102 Bankalar (B: 60.000) - 129 Şüpheli Alacaklar Karşılığı (-) (B: 48.000) / 128 Şüpheli Alacaklar (A: 96.000) - 644 Konusu Kalmayan Karşılıklar (A: 12.000)',
          },
        ],
      },
    ],
  },
  {
    id: 'nova-teknoloji-bordro-ileri',
    title: 'Nova Teknoloji A.Ş. - Personel Bordrosu, SGK ve Vergi Tahakkuku',
    difficulty: 'İleri',
    companyName: 'Nova Yazılım & Teknoloji A.Ş.',
    establishedDate: '01.12.2026',
    initialCapital: 500000,
    description:
      'Yazılım şirketinde kuruluş, lisans satışı, personele maaş avansı verilmesi, aylık ücret bordrosu tahakkuku (brüt ücret, SGK işçi/işveren payları, gelir/damga vergisi, avans mahsubu ve net ücret) ile vergi/SGK borçlarının bankadan ödenmesi.',
    learningObjectives: [
      'Banka ve demirbaş ile bileşik şirket kuruluşu',
      'Yazılım lisans satışı hasılatı ve KDV kaydı',
      'Personele verilen iş/maaş avansının 196 Personel Avansları hesabında izlenmesi',
      'Bordro tahakkukunda 770 Genel Yönetim Giderleri, 360 Ödenecek Vergi, 361 Ödenecek SGK, 196 Avans Mahsubu ve 335 Personele Borçlar dengesi',
      'Net maaşların, SGK primlerinin ve vergi borçlarının bankadan ödenmesi',
    ],
    transactions: [
      {
        id: 'tx-nv1',
        order: 1,
        date: '01.12.2026',
        title: 'Bileşik Sermaye ile Kuruluş (Banka + Demirbaş)',
        description:
          'Yazılım şirketi 400.000 TL banka mevduatı ve 100.000 TL değerinde yazılım geliştirme sunucusu (demirbaş) konularak toplam 500.000 TL sermaye ile kurulmuştur.',
        amount: 500000,
        expectedEntry: {
          educationalNotes:
            'Banka mevduatı için 102 Bankalar BORÇ (400.000 TL); sunucu ekipmanı için 255 Demirbaşlar BORÇ (100.000 TL); ortakların sermaye payı için 500 Sermaye ALACAK (500.000 TL) yazılır.',
          lines: [
            { accountCode: '102', debit: 400000, credit: 0 },
            { accountCode: '255', debit: 100000, credit: 0 },
            { accountCode: '500', debit: 0, credit: 500000 },
          ],
        },
        hints: [
          {
            level: 1,
            title: '1. Aşama: Şirkete Hangi Değerler Konuldu?',
            content: '400.000 TL nakit banka hesabı ve 100.000 TL demirbaş ekipman.',
          },
          {
            level: 2,
            title: '2. Aşama: Hangi Hesaplar Kullanılır?',
            content: '102 Bankalar, 255 Demirbaşlar ve 500 Sermaye.',
          },
          {
            level: 3,
            title: '3. Aşama: Borç ve Alacak Yönleri',
            content: '102 BORÇ (400.000 TL), 255 BORÇ (100.000 TL) / 500 ALACAK (500.000 TL).',
          },
          {
            level: 4,
            title: '4. Aşama: Tam Yevmiye Kaydı',
            content: '102 Bankalar (B: 400.000) - 255 Demirbaşlar (B: 100.000) / 500 Sermaye (A: 500.000)',
          },
        ],
      },
      {
        id: 'tx-nv2',
        order: 2,
        date: '05.12.2026',
        title: 'Yazılım Lisans Satışı ve Bedelinin Bankaya Tahsili',
        description:
          'Kurumsal müşteriye 150.000 TL + %20 KDV (30.000 TL) tutarında yazılım lisansı satılmış ve toplam 180.000 TL bedel şirketin banka hesabına havale gelmiştir.',
        amount: 180000,
        expectedEntry: {
          educationalNotes:
            'Bankaya tahsil edilen tutar için 102 Bankalar BORÇ (180.000 TL); lisans satış hasılatı için 600 Yurtiçi Satışlar ALACAK (150.000 TL); hesaplanan vergi için 391 Hesaplanan KDV ALACAK (30.000 TL) yazılır.',
          lines: [
            { accountCode: '102', debit: 180000, credit: 0 },
            { accountCode: '600', debit: 0, credit: 150000 },
            { accountCode: '391', debit: 0, credit: 30000 },
          ],
        },
        hints: [
          {
            level: 1,
            title: '1. Aşama: Tahsilat ve Gelir Tutarları Nelerdir?',
            content: 'Bankamıza 180.000 TL girdi, 150.000 TL satış gelirimiz, 30.000 TL devlete ödenecek KDV.',
          },
          {
            level: 2,
            title: '2. Aşama: Hangi Hesaplar Kullanılır?',
            content: '102 Bankalar, 600 Yurtiçi Satışlar, 391 Hesaplanan KDV.',
          },
          {
            level: 3,
            title: '3. Aşama: Borç ve Alacak Yönleri',
            content: '102 BORÇ (180.000 TL) / 600 ALACAK (150.000 TL), 391 ALACAK (30.000 TL).',
          },
          {
            level: 4,
            title: '4. Aşama: Tam Yevmiye Kaydı',
            content: '102 Bankalar (B: 180.000) / 600 (A: 150.000) - 391 (A: 30.000)',
          },
        ],
      },
      {
        id: 'tx-nv3',
        order: 3,
        date: '15.12.2026',
        title: 'Personele Maaşından Kesilmek Üzere Avans Verilmesi (196)',
        description:
          'Yazılım mühendisine ay sonu maaşından mahsup edilmek üzere şirket banka hesabından 10.000 TL nakit personel avansı havale edilmiştir.',
        amount: 10000,
        expectedEntry: {
          educationalNotes:
            'Personele maaşına mahsuben ödenen avanslar işletmenin personelden olan alacağı niteliğinde olduğundan 196 Personel Avansları BORÇ (10.000 TL); bankadan para çıktığı için 102 Bankalar ALACAK (10.000 TL) yazılır.',
          lines: [
            { accountCode: '196', debit: 10000, credit: 0 },
            { accountCode: '102', debit: 0, credit: 10000 },
          ],
        },
        hints: [
          {
            level: 1,
            title: '1. Aşama: Maaş Avansı Bir Gider midir?',
            content: 'Hayır! Henüz ay sonu bordro tahakkuk etmediği için bu aşamada işletmenin personelden olan geçici alacağıdır.',
          },
          {
            level: 2,
            title: '2. Aşama: Hangi Hesaplar Kullanılır?',
            content: 'Avans için "196 Personel Avansları", ödeme için "102 Bankalar".',
          },
          {
            level: 3,
            title: '3. Aşama: Borç ve Alacak Yönleri',
            content: '196 Personel Avansları BORÇ (10.000 TL) / 102 Bankalar ALACAK (10.000 TL).',
          },
          {
            level: 4,
            title: '4. Aşama: Tam Yevmiye Kaydı',
            content: '196 Personel Avansları (B: 10.000) / 102 Bankalar (A: 10.000)',
          },
        ],
      },
      {
        id: 'tx-nv4',
        order: 4,
        date: '31.12.2026',
        title: 'Aylık Ücret Bordrosu Tahakkuku (Üniversite Final Sorusu!)',
        description:
          'Aralık ayı personel ücret bordrosu hesaplanmıştır:\n- Brüt Ücret + SGK İşveren Payı Toplam Personel Gideri: 100.000 TL\n- Kesilen Gelir ve Damga Vergisi Kesintisi: 15.000 TL\n- SGK İşçi ve İşveren Primleri Toplamı: 35.000 TL\n- Ay Ortasında Verilen Personel Avansı Mahsubu: 10.000 TL\n- Personele Fiilen Ödenecek Kalan Net Ücret: 40.000 TL',
        amount: 100000,
        expectedEntry: {
          educationalNotes:
            'Tüm personel işçilik gideri 770 Genel Yönetim Giderleri BORÇ (100.000 TL) yazılır; devlete ödenecek vergiler için 360 Ödenecek Vergi ALACAK (15.000 TL); SGK primi için 361 Ödenecek SGK ALACAK (35.000 TL); önceden verilen avans kapatıldığı için 196 Personel Avansları ALACAK (10.000 TL); personele ödenecek net maaş için 335 Personele Borçlar ALACAK (40.000 TL) yazılır.',
          lines: [
            { accountCode: '770', debit: 100000, credit: 0 },
            { accountCode: '360', debit: 0, credit: 15000 },
            { accountCode: '361', debit: 0, credit: 35000 },
            { accountCode: '196', debit: 0, credit: 10000 },
            { accountCode: '335', debit: 0, credit: 40000 },
          ],
        },
        hints: [
          {
            level: 1,
            title: '1. Aşama: Toplam İşçilik Maliyeti Nereye Yazılır?',
            content: 'Brüt ücret + SGK işveren payı toplamı olan 100.000 TL yönetim gideri olarak 770 hesabına borç yazılır.',
          },
          {
            level: 2,
            title: '2. Aşama: Kesintiler ve Avans Mahsubu Hangi Hesaplara Alacak Yazılır?',
            content: 'Vergiler için 360 (15.000 TL), SGK için 361 (35.000 TL), kapatılan avans için 196 (10.000 TL), kalan net maaş borcu için 335 (40.000 TL).',
          },
          {
            level: 3,
            title: '3. Aşama: Borç ve Alacak Yönleri ve Eşitlik',
            content: '770 BORÇ (100.000 TL) = [360: 15.000 + 361: 35.000 + 196: 10.000 + 335: 40.000] ALACAK (100.000 TL).',
          },
          {
            level: 4,
            title: '4. Aşama: Tam Yevmiye Kaydı',
            content: '770 (B: 100.000) / 360 (A: 15.000) - 361 (A: 35.000) - 196 (A: 10.000) - 335 (A: 40.000)',
          },
        ],
      },
      {
        id: 'tx-nv5',
        order: 5,
        date: '02.01.2027',
        title: 'Net Personel Maaşlarının Bankadan Ödenmesi',
        description:
          'Bordro tahakkuku ile 335 Personele Borçlar hesabında bekleyen 40.000 TL net maaş tutarı şirket banka hesabından çalışanların banka hesaplarına havale edilmiştir.',
        amount: 40000,
        expectedEntry: {
          educationalNotes:
            'Personele olan borç ödendiği için 335 Personele Borçlar BORÇ (40.000 TL); bankadan nakit çıktığı için 102 Bankalar ALACAK (40.000 TL) yazılır.',
          lines: [
            { accountCode: '335', debit: 40000, credit: 0 },
            { accountCode: '102', debit: 0, credit: 40000 },
          ],
        },
        hints: [
          {
            level: 1,
            title: '1. Aşama: İşlemde Neler Değişti?',
            content: 'Personele olan maaş borcumuz bitti ve bankadaki mevduatımız azaldı.',
          },
          {
            level: 2,
            title: '2. Aşama: Hangi Hesaplar Kullanılır?',
            content: '335 Personele Borçlar ve 102 Bankalar.',
          },
          {
            level: 3,
            title: '3. Aşama: Borç ve Alacak Yönleri',
            content: '335 BORÇ (40.000 TL) / 102 ALACAK (40.000 TL).',
          },
          {
            level: 4,
            title: '4. Aşama: Tam Yevmiye Kaydı',
            content: '335 Personele Borçlar (B: 40.000) / 102 Bankalar (A: 40.000)',
          },
        ],
      },
      {
        id: 'tx-nv6',
        order: 6,
        date: '10.01.2027',
        title: 'SGK Prim Borçlarının Bankadan Yatırılması',
        description:
          'Sosyal Güvenlik Kurumuna olan 35.000 TL tutarındaki sigorta prim borcu banka mevduat hesabımızdan ödenmiştir.',
        amount: 35000,
        expectedEntry: {
          educationalNotes:
            'Sosyal Güvenlik Kurumuna olan borç ödendiği için 361 Ödenecek SGK Kesintileri BORÇ (35.000 TL); bankadan çıkış için 102 Bankalar ALACAK (35.000 TL) yazılır.',
          lines: [
            { accountCode: '361', debit: 35000, credit: 0 },
            { accountCode: '102', debit: 0, credit: 35000 },
          ],
        },
        hints: [
          {
            level: 1,
            title: '1. Aşama: İşlemde Neler Değişti?',
            content: 'SGK prim borcumuz kapandı ve bankadan ödeme yapıldı.',
          },
          {
            level: 2,
            title: '2. Aşama: Hangi Hesaplar Kullanılır?',
            content: '361 Ödenecek SGK Kesintileri ve 102 Bankalar.',
          },
          {
            level: 3,
            title: '3. Aşama: Borç ve Alacak Yönleri',
            content: '361 BORÇ (35.000 TL) / 102 ALACAK (35.000 TL).',
          },
          {
            level: 4,
            title: '4. Aşama: Tam Yevmiye Kaydı',
            content: '361 Ödenecek SGK Kesintileri (B: 35.000) / 102 Bankalar (A: 35.000)',
          },
        ],
      },
      {
        id: 'tx-nv7',
        order: 7,
        date: '15.01.2027',
        title: 'Muhtasar Vergi Borcunun Bankadan Vergi Dairesine Ödenmesi',
        description:
          'Bordrodan kesilen 15.000 TL tutarındaki gelir ve damga vergisi borcu vergi dairesine banka hesabından yatırılmıştır.',
        amount: 15000,
        expectedEntry: {
          educationalNotes:
            'Devlete olan vergi borcumuz ödendiği için 360 Ödenecek Vergi ve Fonlar BORÇ (15.000 TL); banka mevcudumuz azaldığı için 102 Bankalar ALACAK (15.000 TL) yazılır.',
          lines: [
            { accountCode: '360', debit: 15000, credit: 0 },
            { accountCode: '102', debit: 0, credit: 15000 },
          ],
        },
        hints: [
          {
            level: 1,
            title: '1. Aşama: İşlemde Neler Değişti?',
            content: 'Vergi borcumuz kapandı ve bankadan nakit çıktı.',
          },
          {
            level: 2,
            title: '2. Aşama: Hangi Hesaplar Kullanılır?',
            content: '360 Ödenecek Vergi ve Fonlar ve 102 Bankalar.',
          },
          {
            level: 3,
            title: '3. Aşama: Borç ve Alacak Yönleri',
            content: '360 BORÇ (15.000 TL) / 102 ALACAK (15.000 TL).',
          },
          {
            level: 4,
            title: '4. Aşama: Tam Yevmiye Kaydı',
            content: '360 Ödenecek Vergi ve Fonlar (B: 15.000) / 102 Bankalar (A: 15.000)',
          },
        ],
      },
    ],
  },
  {
    id: 'zirve-insaat-varlik-ileri',
    title: 'Zirve İnşaat - Duran Varlık Satışı, Kâr/Zarar ve Amortisman İtlafı',
    difficulty: 'İleri',
    companyName: 'Zirve İnşaat & Taahhüt A.Ş.',
    establishedDate: '01.01.2026',
    initialCapital: 600000,
    description:
      'Şantiye taşıtı ve demirbaş alımları, dönem sonu amortisman ayrılması, eski taşıtın birikmiş amortismanı kapatılarak kârla satışı (679) ve demirbaşın zararla satışı (689) muhasebesi.',
    learningObjectives: [
      'Banka sermayesi ile inşaat şirketi kuruluşu',
      'Taşıt alımı ve aktifleştirilmesi (254 Taşıtlar)',
      'Duran varlık amortisman ayrılmasında 770 ve 257 hesaplarının işleyişi',
      'Net defter değerinin üzerindeki satışta 257 itlafı, 254 çıkışı ve 679 Satış Kârı kaydı',
      'Net defter değerinin altındaki satışta 689 Diğer Olağandışı Gider ve Zararlar (-) kaydı',
    ],
    transactions: [
      {
        id: 'tx-zr1',
        order: 1,
        date: '01.01.2026',
        title: 'İşletmenin Banka Sermayesi ile Kuruluşu',
        description:
          'İnşaat şirketi 600.000 TL nakit sermaye ile kurulmuş, tutarın tamamı şirket banka hesabına yatırılmıştır.',
        amount: 600000,
        expectedEntry: {
          educationalNotes:
            'Bankadaki paramız arttığı için 102 Bankalar BORÇ (600.000 TL); taahhüt edilen sermaye için 500 Sermaye ALACAK (600.000 TL) yazılır.',
          lines: [
            { accountCode: '102', debit: 600000, credit: 0 },
            { accountCode: '500', debit: 0, credit: 600000 },
          ],
        },
        hints: [
          {
            level: 1,
            title: '1. Aşama: İşlemde Neler Değişti?',
            content: 'Bankaya 600.000 TL para girdi ve şirket sermayesi kaydedildi.',
          },
          {
            level: 2,
            title: '2. Aşama: Hangi Hesaplar Kullanılır?',
            content: '102 Bankalar ve 500 Sermaye.',
          },
          {
            level: 3,
            title: '3. Aşama: Borç ve Alacak Yönleri',
            content: '102 BORÇ (600.000 TL) / 500 ALACAK (600.000 TL).',
          },
          {
            level: 4,
            title: '4. Aşama: Tam Yevmiye Kaydı',
            content: '102 Bankalar (B: 600.000) / 500 Sermaye (A: 600.000)',
          },
        ],
      },
      {
        id: 'tx-zr2',
        order: 2,
        date: '05.01.2026',
        title: 'Şantiye Kamyonu (Taşıt) Satın Alınması',
        description:
          'Şantiyede kullanılmak üzere 200.000 TL + %20 KDV (40.000 TL) olmak üzere toplam 240.000 TL bedelle şantiye kamyonu satın alınmış ve bedeli banka hesabından ödenmiştir.',
        amount: 240000,
        expectedEntry: {
          educationalNotes:
            'Kamyon duran varlık olduğu için 254 Taşıtlar BORÇ (200.000 TL); ödenen KDV için 191 İndirilecek KDV BORÇ (40.000 TL); bankadan ödeme için 102 Bankalar ALACAK (240.000 TL) yazılır.',
          lines: [
            { accountCode: '254', debit: 200000, credit: 0 },
            { accountCode: '191', debit: 40000, credit: 0 },
            { accountCode: '102', debit: 0, credit: 240000 },
          ],
        },
        hints: [
          {
            level: 1,
            title: '1. Aşama: Satın Alınan Varlık Nedir?',
            content: 'Duran varlık olan şantiye kamyonu ve alış KDV\'sidir.',
          },
          {
            level: 2,
            title: '2. Aşama: Hangi Hesaplar Kullanılır?',
            content: '254 Taşıtlar, 191 İndirilecek KDV ve 102 Bankalar.',
          },
          {
            level: 3,
            title: '3. Aşama: Borç ve Alacak Yönleri',
            content: '254 BORÇ (200.000 TL), 191 BORÇ (40.000 TL) / 102 ALACAK (240.000 TL).',
          },
          {
            level: 4,
            title: '4. Aşama: Tam Yevmiye Kaydı',
            content: '254 Taşıtlar (B: 200.000) - 191 (B: 40.000) / 102 (A: 240.000)',
          },
        ],
      },
      {
        id: 'tx-zr3',
        order: 3,
        date: '31.12.2026',
        title: 'Yıl Sonu Taşıt Amortismanının Hesaplanıp Ayrılması',
        description:
          'Dönem sonunda 200.000 TL değerindeki şantiye kamyonu için %20 oranında (40.000 TL) yıllık amortisman (yıpranma payı) ayrılmıştır.',
        amount: 40000,
        expectedEntry: {
          educationalNotes:
            'Dönem gideri için 770 Genel Yönetim Giderleri BORÇ (40.000 TL); biriken eskime payı için aktifi düzenleyen hesap olan 257 Birikmiş Amortismanlar (-) ALACAK (40.000 TL) yazılır.',
          lines: [
            { accountCode: '770', debit: 40000, credit: 0 },
            { accountCode: '257', debit: 0, credit: 40000 },
          ],
        },
        hints: [
          {
            level: 1,
            title: '1. Aşama: Amortisman Nasıl Kaydedilir?',
            content: 'Yıpranma payı gider yazılır, birikmiş amortisman alacaklandırılır.',
          },
          {
            level: 2,
            title: '2. Aşama: Hangi Hesaplar Kullanılır?',
            content: '770 Genel Yönetim Giderleri ve 257 Birikmiş Amortismanlar (-).',
          },
          {
            level: 3,
            title: '3. Aşama: Borç ve Alacak Yönleri',
            content: '770 BORÇ (40.000 TL) / 257 ALACAK (40.000 TL).',
          },
          {
            level: 4,
            title: '4. Aşama: Tam Yevmiye Kaydı',
            content: '770 (B: 40.000) / 257 Birikmiş Amortismanlar (-) (A: 40.000)',
          },
        ],
      },
      {
        id: 'tx-zr4',
        order: 4,
        date: '10.01.2027',
        title: 'Kamyonun Kârla Satışı ve Amortismanın Kapatılması (Vize/Final Klasiği!)',
        description:
          'Kayıtlı maliyeti 200.000 TL, birikmiş amortismanı 40.000 TL olan (net defter değeri 160.000 TL) şantiye kamyonu, 180.000 TL + %20 KDV (36.000 TL) olmak üzere toplam 216.000 TL\'ye satılmış ve tutar banka hesabımıza tahsil edilmiştir.',
        amount: 216000,
        expectedEntry: {
          educationalNotes:
            'Bankaya tahsil edilen tutar için 102 Bankalar BORÇ (216.000 TL); satılan kamyonun biriken amortismanı kapatıldığı için 257 Birikmiş Amortismanlar BORÇ (40.000 TL); kamyon kayıttan çıktığı için 254 Taşıtlar ALACAK (200.000 TL); satış KDV\'si için 391 Hesaplanan KDV ALACAK (36.000 TL); net defter değerinin üzerindeki 20.000 TL satış kârı için 679 Diğer Olağandışı Gelir ve Kârlar ALACAK (20.000 TL) yazılır.',
          lines: [
            { accountCode: '102', debit: 216000, credit: 0 },
            { accountCode: '257', debit: 40000, credit: 0 },
            { accountCode: '254', debit: 0, credit: 200000 },
            { accountCode: '391', debit: 0, credit: 36000 },
            { accountCode: '679', debit: 0, credit: 20000 },
          ],
        },
        hints: [
          {
            level: 1,
            title: '1. Aşama: Net Defter Değeri ve Kâr Nasıl Hesaplanır?',
            content: 'Net Defter Değeri = 200.000 - 40.000 = 160.000 TL. Satış Matrahı 180.000 TL olduğu için (180.000 - 160.000) = 20.000 TL Satış Kârı doğmuştur.',
          },
          {
            level: 2,
            title: '2. Aşama: Amortisman Hesabı Nasıl Kapanır?',
            content: 'Daha önce alacak bakiyesi veren 257 hesabı satış anında BORÇ yazılarak kapatılır (itlaf edilir).',
          },
          {
            level: 3,
            title: '3. Aşama: Borç ve Alacak Yönleri ve Eşitlik',
            content: 'Borç [102: 216.000 + 257: 40.000 = 256.000 TL] = Alacak [254: 200.000 + 391: 36.000 + 679: 20.000 = 256.000 TL].',
          },
          {
            level: 4,
            title: '4. Aşama: Tam Yevmiye Kaydı',
            content: '102 (B: 216.000) - 257 (B: 40.000) / 254 (A: 200.000) - 391 (A: 36.000) - 679 (A: 20.000)',
          },
        ],
      },
      {
        id: 'tx-zr5',
        order: 5,
        date: '15.01.2027',
        title: 'Şantiye Ofis Ekipmanı (Demirbaş) Satın Alınması',
        description:
          'Şantiye ofisi için 30.000 TL + %20 KDV (6.000 TL) tutarında ölçüm cihazı ve bilgisayar (demirbaş) peşin nakit ödenerek satın alınmıştır.',
        amount: 36000,
        expectedEntry: {
          educationalNotes:
            'Alınan demirbaş için 255 Demirbaşlar BORÇ (30.000 TL); ödenen KDV için 191 İndirilecek KDV BORÇ (6.000 TL); kasadan nakit ödeme için 100 Kasa ALACAK (36.000 TL) yazılır.',
          lines: [
            { accountCode: '255', debit: 30000, credit: 0 },
            { accountCode: '191', debit: 6000, credit: 0 },
            { accountCode: '100', debit: 0, credit: 36000 },
          ],
        },
        hints: [
          {
            level: 1,
            title: '1. Aşama: İşlemde Neler Değişti?',
            content: 'Demirbaş varlığımız ve KDV hakkımız arttı, kasadaki nakdimiz azaldı.',
          },
          {
            level: 2,
            title: '2. Aşama: Hangi Hesaplar Kullanılır?',
            content: '255 Demirbaşlar, 191 İnd. KDV, 100 Kasa.',
          },
          {
            level: 3,
            title: '3. Aşama: Borç ve Alacak Yönleri',
            content: '255 BORÇ (30.000 TL), 191 BORÇ (6.000 TL) / 100 ALACAK (36.000 TL).',
          },
          {
            level: 4,
            title: '4. Aşama: Tam Yevmiye Kaydı',
            content: '255 Demirbaşlar (B: 30.000) - 191 (B: 6.000) / 100 Kasa (A: 36.000)',
          },
        ],
      },
      {
        id: 'tx-zr6',
        order: 6,
        date: '20.01.2027',
        title: 'Demirbaş İçin Amortisman Ayrılması',
        description:
          '30.000 TL değerindeki demirbaş için 6.000 TL tutarında amortisman ayrılmıştır.',
        amount: 6000,
        expectedEntry: {
          educationalNotes:
            'Gider için 770 Genel Yönetim Giderleri BORÇ (6.000 TL); aktifi düzenleyen pasif hesap olan 257 Birikmiş Amortismanlar (-) ALACAK (6.000 TL) yazılır.',
          lines: [
            { accountCode: '770', debit: 6000, credit: 0 },
            { accountCode: '257', debit: 0, credit: 6000 },
          ],
        },
        hints: [
          {
            level: 1,
            title: '1. Aşama: Amortisman Kaydı Nasıl Yapılır?',
            content: '770 BORÇ ve 257 ALACAK.',
          },
          {
            level: 2,
            title: '2. Aşama: Hangi Hesaplar Kullanılır?',
            content: '770 ve 257.',
          },
          {
            level: 3,
            title: '3. Aşama: Borç ve Alacak Yönleri',
            content: '770 BORÇ (6.000 TL) / 257 ALACAK (6.000 TL).',
          },
          {
            level: 4,
            title: '4. Aşama: Tam Yevmiye Kaydı',
            content: '770 (B: 6.000) / 257 (A: 6.000)',
          },
        ],
      },
      {
        id: 'tx-zr7',
        order: 7,
        date: '25.01.2027',
        title: 'Eski Demirbaşın Zararla Peşin Satılması (689)',
        description:
          'Kayıtlı değeri 30.000 TL, birikmiş amortismanı 6.000 TL (net defter değeri 24.000 TL) olan demirbaş ekipman, acil nakit ihtiyacı sebebiyle 20.000 TL + %20 KDV (4.000 TL) olmak üzere toplam 24.000 TL peşin bedelle satılmış ve tutar kasaya tahsil edilmiştir.',
        amount: 24000,
        expectedEntry: {
          educationalNotes:
            'Kasaya giren nakit için 100 Kasa BORÇ (24.000 TL); demirbaşın amortismanı kapatıldığı için 257 Birikmiş Amortismanlar BORÇ (6.000 TL); net defter değerinin (24.000 TL) altında (20.000 TL) satıldığı için aradaki 4.000 TL satış zararı için 689 Diğer Olağandışı Gider ve Zararlar (-) BORÇ (4.000 TL); satılan demirbaş için 255 Demirbaşlar ALACAK (30.000 TL); hesaplanan vergi için 391 Hesaplanan KDV ALACAK (4.000 TL) yazılır.',
          lines: [
            { accountCode: '100', debit: 24000, credit: 0 },
            { accountCode: '257', debit: 6000, credit: 0 },
            { accountCode: '689', debit: 4000, credit: 0 },
            { accountCode: '255', debit: 0, credit: 30000 },
            { accountCode: '391', debit: 0, credit: 4000 },
          ],
        },
        hints: [
          {
            level: 1,
            title: '1. Aşama: Duran Varlık Satış Zararı Nasıl Doğar?',
            content: 'Net Defter Değeri = 30.000 - 6.000 = 24.000 TL. Satış tutarı 20.000 TL olduğu için 4.000 TL zarar oluşmuştur.',
          },
          {
            level: 2,
            title: '2. Aşama: Satış Zararı Hangi Hesaba Yazılır?',
            content: 'Olağandışı satış zararları için "689 Diğer Olağandışı Gider ve Zararlar (-)" borçlandırılır.',
          },
          {
            level: 3,
            title: '3. Aşama: Borç ve Alacak Yönleri ve Eşitlik',
            content: 'Borç [100: 24.000 + 257: 6.000 + 689: 4.000 = 34.000 TL] = Alacak [255: 30.000 + 391: 4.000 = 34.000 TL].',
          },
          {
            level: 4,
            title: '4. Aşama: Tam Yevmiye Kaydı',
            content: '100 (B: 24.000) - 257 (B: 6.000) - 689 (B: 4.000) / 255 (A: 30.000) - 391 (A: 4.000)',
          },
        ],
      },
    ],
  },
  {
    id: 'doruk-sanayi-kapanis-ileri',
    title: 'Doruk Sanayi - Dönem Sonu 690 Kapanış ve Gelir Tablosu Devri',
    difficulty: 'İleri',
    companyName: 'Doruk Sanayi ve Üretim Ticaret A.Ş.',
    establishedDate: '01.01.2026',
    initialCapital: 500000,
    description:
      'Genel Muhasebe döngüsünün zirvesi: Ticari mal alım ve satımı, STMM (621) kaydı, faaliyet giderleri, tüm gelir ve giderlerin 690 Dönem Kârı veya Zararı hesabına devredilerek kapatılması, vergi karşılığı ve net kârın (590) özkaynaklara aktarılması.',
    learningObjectives: [
      'Banka sermayesi ile şirket kuruluşu',
      'Mal alımı ve satışı ile KDV mekanizması',
      'Satılan Ticari Mallar Maliyetinin (621) depodan düşülmesi',
      'Faaliyet giderlerinin (760, 770) tahakkuku ve ödenmesi',
      'Tüm gelir hesaplarının 690 hesabına devredilerek kapatılması (600 Borç / 690 Alacak)',
      'Tüm gider hesaplarının 690 hesabına devredilerek kapatılması (690 Borç / 621, 760, 770 Alacak)',
      'Dönem kârı üzerinden kurumlar vergisi (370) ayrılması ve net kârın 590 Dönem Net Kârı hesabına aktarılması',
    ],
    transactions: [
      {
        id: 'tx-dr1',
        order: 1,
        date: '01.01.2026',
        title: 'İşletmenin Banka Sermayesi ile Kuruluşu',
        description:
          'İşletme 500.000 TL nakit sermaye ile kurulmuş, tutarın tamamı şirket banka mevduat hesabına yatırılmıştır.',
        amount: 500000,
        expectedEntry: {
          educationalNotes:
            'Bankadaki paramız arttığı için 102 Bankalar BORÇ (500.000 TL); ortakların sermayesi için 500 Sermaye ALACAK (500.000 TL) yazılır.',
          lines: [
            { accountCode: '102', debit: 500000, credit: 0 },
            { accountCode: '500', debit: 0, credit: 500000 },
          ],
        },
        hints: [
          {
            level: 1,
            title: '1. Aşama: İşlemde Neler Değişti?',
            content: 'Bankaya 500.000 TL girdi ve şirket sermayesi kaydedildi.',
          },
          {
            level: 2,
            title: '2. Aşama: Hangi Hesaplar Kullanılır?',
            content: '102 Bankalar ve 500 Sermaye.',
          },
          {
            level: 3,
            title: '3. Aşama: Borç ve Alacak Yönleri',
            content: '102 BORÇ (500.000 TL) / 500 ALACAK (500.000 TL).',
          },
          {
            level: 4,
            title: '4. Aşama: Tam Yevmiye Kaydı',
            content: '102 Bankalar (B: 500.000) / 500 Sermaye (A: 500.000)',
          },
        ],
      },
      {
        id: 'tx-dr2',
        order: 2,
        date: '10.01.2026',
        title: 'Peşin Ticari Mal Alımı ve Bankadan Ödenmesi',
        description:
          'İşletme, satmak amacıyla 200.000 TL + %20 KDV (40.000 TL) tutarında ticari malı toptancıdan satın almış ve toplam 240.000 TL bedeli bankadan ödemiştir.',
        amount: 240000,
        expectedEntry: {
          educationalNotes:
            'Alınan mallar için 153 Ticari Mallar BORÇ (200.000 TL); alış KDV\'si için 191 İndirilecek KDV BORÇ (40.000 TL); bankadan ödeme için 102 Bankalar ALACAK (240.000 TL) yazılır.',
          lines: [
            { accountCode: '153', debit: 200000, credit: 0 },
            { accountCode: '191', debit: 40000, credit: 0 },
            { accountCode: '102', debit: 0, credit: 240000 },
          ],
        },
        hints: [
          {
            level: 1,
            title: '1. Aşama: İşlemde Neler Değişti?',
            content: 'Depodaki malımız ve KDV hakkımız arttı, bankadaki paramız azaldı.',
          },
          {
            level: 2,
            title: '2. Aşama: Hangi Hesaplar Kullanılır?',
            content: '153 Ticari Mallar, 191 İnd. KDV ve 102 Bankalar.',
          },
          {
            level: 3,
            title: '3. Aşama: Borç ve Alacak Yönleri',
            content: '153 BORÇ (200.000 TL), 191 BORÇ (40.000 TL) / 102 ALACAK (240.000 TL).',
          },
          {
            level: 4,
            title: '4. Aşama: Tam Yevmiye Kaydı',
            content: '153 (B: 200.000) - 191 (B: 40.000) / 102 (A: 240.000)',
          },
        ],
      },
      {
        id: 'tx-dr3',
        order: 3,
        date: '20.01.2026',
        title: 'Peşin Ticari Mal Satışı ve Bankaya Tahsilatı',
        description:
          'İşletme müşterilere 300.000 TL + %20 KDV (60.000 TL) tutarında mal satmış ve toplam 360.000 TL banka hesabımıza tahsil edilmiştir.',
        amount: 360000,
        expectedEntry: {
          educationalNotes:
            'Bankaya tahsil edilen tutar için 102 Bankalar BORÇ (360.000 TL); satış hasılatı için 600 Yurtiçi Satışlar ALACAK (300.000 TL); tahsil edilen vergi için 391 Hesaplanan KDV ALACAK (60.000 TL) yazılır.',
          lines: [
            { accountCode: '102', debit: 360000, credit: 0 },
            { accountCode: '600', debit: 0, credit: 300000 },
            { accountCode: '391', debit: 0, credit: 60000 },
          ],
        },
        hints: [
          {
            level: 1,
            title: '1. Aşama: İşlemde Neler Değişti?',
            content: 'Bankamıza 360.000 TL girdi, 300.000 TL hasılat ve 60.000 TL KDV borcu oluştu.',
          },
          {
            level: 2,
            title: '2. Aşama: Hangi Hesaplar Kullanılır?',
            content: '102 Bankalar, 600 Yurtiçi Satışlar ve 391 Hesaplanan KDV.',
          },
          {
            level: 3,
            title: '3. Aşama: Borç ve Alacak Yönleri',
            content: '102 BORÇ (360.000 TL) / 600 ALACAK (300.000 TL), 391 ALACAK (60.000 TL).',
          },
          {
            level: 4,
            title: '4. Aşama: Tam Yevmiye Kaydı',
            content: '102 Bankalar (B: 360.000) / 600 (A: 300.000) - 391 (A: 60.000)',
          },
        ],
      },
      {
        id: 'tx-dr4',
        order: 4,
        date: '22.01.2026',
        title: 'Satılan Ticari Malların Maliyet Kaydı (621 STMM)',
        description:
          'Satılan malların işletmeye olan alış maliyetinin 160.000 TL olduğu belirlenmiş ve stok çıkış kaydı yapılmıştır.',
        amount: 160000,
        expectedEntry: {
          educationalNotes:
            'Maliyet gideri için 621 Satılan Ticari Mallar Maliyeti (-) BORÇ (160.000 TL); depodan çıkan mallar için 153 Ticari Mallar ALACAK (160.000 TL) yazılır.',
          lines: [
            { accountCode: '621', debit: 160000, credit: 0 },
            { accountCode: '153', debit: 0, credit: 160000 },
          ],
        },
        hints: [
          {
            level: 1,
            title: '1. Aşama: Maliyet Kaydının Amacı Nedir?',
            content: 'Depodaki malı gerçek maliyetiyle çıkıp gelir tablosunda satış maliyeti olarak göstermektir.',
          },
          {
            level: 2,
            title: '2. Aşama: Hangi Hesaplar Kullanılır?',
            content: '621 Satılan Ticari Mallar Maliyeti (-) ve 153 Ticari Mallar.',
          },
          {
            level: 3,
            title: '3. Aşama: Borç ve Alacak Yönleri',
            content: '621 BORÇ (160.000 TL) / 153 ALACAK (160.000 TL).',
          },
          {
            level: 4,
            title: '4. Aşama: Tam Yevmiye Kaydı',
            content: '621 STMM (-) (B: 160.000) / 153 Ticari Mallar (A: 160.000)',
          },
        ],
      },
      {
        id: 'tx-dr5',
        order: 5,
        date: '25.01.2026',
        title: 'Yönetim ve Pazarlama Faaliyet Giderlerinin Bankadan Ödenmesi',
        description:
          'İşletmenin 40.000 TL idari yönetim gideri ve 20.000 TL reklam ve pazarlama gideri olmak üzere toplam 60.000 TL harcaması banka mevduatından ödenmiştir.',
        amount: 60000,
        expectedEntry: {
          educationalNotes:
            'Yönetim giderleri için 770 Genel Yönetim Giderleri BORÇ (40.000 TL); reklam ve dağıtım için 760 Pazarlama Giderleri BORÇ (20.000 TL); bankadan toplam ödeme için 102 Bankalar ALACAK (60.000 TL) yazılır.',
          lines: [
            { accountCode: '770', debit: 40000, credit: 0 },
            { accountCode: '760', debit: 20000, credit: 0 },
            { accountCode: '102', debit: 0, credit: 60000 },
          ],
        },
        hints: [
          {
            level: 1,
            title: '1. Aşama: Hangi Giderler Yapıldı?',
            content: '40.000 TL yönetim gideri ve 20.000 TL pazarlama gideri.',
          },
          {
            level: 2,
            title: '2. Aşama: Hangi Hesaplar Kullanılır?',
            content: '770 Genel Yönetim, 760 Pazarlama ve 102 Bankalar.',
          },
          {
            level: 3,
            title: '3. Aşama: Borç ve Alacak Yönleri',
            content: '770 BORÇ (40.000 TL), 760 BORÇ (20.000 TL) / 102 ALACAK (60.000 TL).',
          },
          {
            level: 4,
            title: '4. Aşama: Tam Yevmiye Kaydı',
            content: '770 (B: 40.000) - 760 (B: 20.000) / 102 (A: 60.000)',
          },
        ],
      },
      {
        id: 'tx-dr6',
        order: 6,
        date: '31.12.2026',
        title: 'Tüm Gelir Hesaplarının 690 Dönem Kârı veya Zararı Hesabına Devri',
        description:
          'Dönem sonunda 600 Yurtiçi Satışlar hesabının 300.000 TL tutarındaki alacak bakiyesi borçlandırılarak kapatılmış ve 690 Dönem Kârı veya Zararı hesabına devredilmiştir.',
        amount: 300000,
        expectedEntry: {
          educationalNotes:
            'Kapanış Kuralı: Alacak bakiyesi veren gelir hesapları borçlandırılarak kapatılır ve 690 hesabının ALACAĞINA aktarılır. Bu sayede 600 hesabı sıfırlanır.',
          lines: [
            { accountCode: '600', debit: 300000, credit: 0 },
            { accountCode: '690', debit: 0, credit: 300000 },
          ],
        },
        hints: [
          {
            level: 1,
            title: '1. Aşama: Gelir Hesapları Dönem Sonu Nasıl Kapatılır?',
            content: 'Tüm gelir hesapları borçlandırılır, özet hesap olan 690 hesabı alacaklandırılır.',
          },
          {
            level: 2,
            title: '2. Aşama: Hangi Hesaplar Kullanılır?',
            content: '600 Yurtiçi Satışlar ve 690 Dönem Kârı veya Zararı.',
          },
          {
            level: 3,
            title: '3. Aşama: Borç ve Alacak Yönleri',
            content: '600 BORÇ (300.000 TL) / 690 ALACAK (300.000 TL).',
          },
          {
            level: 4,
            title: '4. Aşama: Tam Yevmiye Kaydı',
            content: '600 Yurtiçi Satışlar (B: 300.000) / 690 Dönem Kârı veya Zararı (A: 300.000)',
          },
        ],
      },
      {
        id: 'tx-dr7',
        order: 7,
        date: '31.12.2026',
        title: 'Tüm Gider ve Maliyet Hesaplarının 690 Hesabına Devri',
        description:
          'Dönem sonunda borç bakiyesi veren tüm gider hesapları (621 STMM: 160.000 TL, 770 Genel Yönetim: 40.000 TL, 760 Pazarlama: 20.000 TL olmak üzere toplam 220.000 TL) alacaklandırılarak kapatılmış ve 690 Dönem Kârı veya Zararı hesabının borcuna devredilmiştir.',
        amount: 220000,
        expectedEntry: {
          educationalNotes:
            'Kapanış Kuralı: Borç bakiyesi veren gider ve maliyet hesapları alacaklandırılarak kapatılır ve toplamları 690 Dönem Kârı veya Zararı hesabının BORCUNA yazılır. Bu işlem sonrasında 690 hesabında (300.000 Gelir - 220.000 Gider = 80.000 TL Kâr) kalır.',
          lines: [
            { accountCode: '690', debit: 220000, credit: 0 },
            { accountCode: '621', debit: 0, credit: 160000 },
            { accountCode: '770', debit: 0, credit: 40000 },
            { accountCode: '760', debit: 0, credit: 20000 },
          ],
        },
        hints: [
          {
            level: 1,
            title: '1. Aşama: Gider Hesapları Dönem Sonu Nasıl Kapatılır?',
            content: 'Tüm gider hesapları alacaklandırılarak sıfırlanır, toplamları 690 hesabına borç yazılır.',
          },
          {
            level: 2,
            title: '2. Aşama: Hangi Hesaplar Kapatılır?',
            content: '621 STMM (160.000), 770 (40.000), 760 (20.000).',
          },
          {
            level: 3,
            title: '3. Aşama: Borç ve Alacak Yönleri',
            content: '690 BORÇ (220.000 TL) / 621 ALACAK (160.000 TL), 770 ALACAK (40.000 TL), 760 ALACAK (20.000 TL).',
          },
          {
            level: 4,
            title: '4. Aşama: Tam Yevmiye Kaydı',
            content: '690 (B: 220.000) / 621 (A: 160.000) - 770 (A: 40.000) - 760 (A: 20.000)',
          },
        ],
      },
      {
        id: 'tx-dr8',
        order: 8,
        date: '31.12.2026',
        title: 'Vergi Karşılığı Ayrılması ve Net Kârın (590) Bilançoya Aktarılması',
        description:
          '690 hesabında kalan 80.000 TL ticari kâr üzerinden %25 oranında (20.000 TL) kurumlar vergisi karşılığı ayrılmış ve kalan 60.000 TL net kâr 590 Dönem Net Kârı hesabına aktarılarak 690 hesabı tamamen kapatılmıştır.',
        amount: 80000,
        expectedEntry: {
          educationalNotes:
            '690 Dönem Kârı veya Zararı hesabı 80.000 TL borçlandırılarak sıfırlanır; devlete ödenecek vergi karşılığı için 370 Dönem Kârı Vergi Karşılığı ALACAK (20.000 TL) yazılır; şirketin bilançosuna devredecek net kâr için 590 Dönem Net Kârı ALACAK (60.000 TL) yazılır.',
          lines: [
            { accountCode: '690', debit: 80000, credit: 0 },
            { accountCode: '370', debit: 0, credit: 20000 },
            { accountCode: '590', debit: 0, credit: 60000 },
          ],
        },
        hints: [
          {
            level: 1,
            title: '1. Aşama: 690 Hesabı Nasıl Kapanır?',
            content: 'Alacak bakiyesi veren 80.000 TL kâr borçlandırılarak sıfırlanır.',
          },
          {
            level: 2,
            title: '2. Aşama: Vergi Karşılığı ve Net Kâr Nereye Aktarılır?',
            content: 'Vergi için 370 Pasif hesabı (20.000 TL), kalan net kâr için 590 Özkaynak hesabı (60.000 TL) alacaklandırılır.',
          },
          {
            level: 3,
            title: '3. Aşama: Borç ve Alacak Yönleri ve Eşitlik',
            content: '690 BORÇ (80.000 TL) = 370 ALACAK (20.000 TL) + 590 ALACAK (60.000 TL).',
          },
          {
            level: 4,
            title: '4. Aşama: Tam Yevmiye Kaydı',
            content: '690 Dönem Kârı/Zararı (B: 80.000) / 370 Vergi Karşılığı (A: 20.000) - 590 Net Kâr (A: 60.000)',
          },
        ],
      },
    ],
  },
];
