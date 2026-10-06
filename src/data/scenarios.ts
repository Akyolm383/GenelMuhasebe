import type { CompanyScenario } from '../types/scenario';

export const SCENARIOS: CompanyScenario[] = [
  {
    id: 'abc-ticaret-temel',
    title: 'ABC Ticaret İşletmesi - Kuruluş ve Temel Döngü',
    difficulty: 'Kolay',
    companyName: 'ABC Ticaret İşletmesi',
    establishedDate: '01.10.2026',
    initialCapital: 100000,
    description: 'İşletmenin kuruluşu ile başlayıp peşin/veresiye mal alımı, banka işlemleri, satış hasılatı, borç ödeme ve genel gider işlemlerini kapsayan Genel Muhasebe temel çalışma senaryosu.',
    learningObjectives: [
      'Kuruluş sermayesinin varlık ve özkaynak hesaplarına doğru kaydedilmesi',
      'Ticari mallar ve kasa arasındaki çift taraflı hareketin kavranması',
      'Veresiye mal alımında 320 Satıcılar hesabının işleyişi',
      'Kasa ve Banka arasındaki likit varlık transferleri',
      'Hasılat kaydında 600 Yurtiçi Satışlar hesabının alacaklandırılması',
      'Borç ödemelerinde pasif hesabın borçlandırılması mantığı',
      'Gider kayıtlarında 770 Genel Yönetim Giderleri hesabının borçlandırılması',
    ],
    transactions: [
      {
        id: 'tx-1',
        order: 1,
        date: '01.10.2026',
        title: 'İşletmenin Kuruluşu ve Nakit Sermaye Tahsisi',
        description: 'İşletme, sahibi tarafından 100.000 TL nakit sermaye tahsis edilerek kurulmuştur. Nakit para kasaya konulmuştur.',
        amount: 100000,
        expectedEntry: {
          educationalNotes: 'Kasaya nakit girişi olduğundan 100 Kasa (Aktif) borçlandırılır; işletmeye kaynak sağlandığından 500 Sermaye (Özkaynak) alacaklandırılır.',
          lines: [
            { accountCode: '100', debit: 100000, credit: 0 },
            { accountCode: '500', debit: 0, credit: 100000 },
          ]
        },
        hints: [
          {
            level: 1,
            title: '1. Aşama: Etkilenen Unsurlar',
            content: 'Bu işlem işletmenin "nakit para mevcudunu" ve işletmeye konulan "özkaynağı (sermaye)" etkilemektedir.'
          },
          {
            level: 2,
            title: '2. Aşama: Hesap Karakterleri',
            content: 'Nakit para "100 Kasa" (Aktif/Varlık) hesabında; konulan sermaye ise "500 Sermaye" (Pasif/Özkaynak) hesabında izlenir.'
          },
          {
            level: 3,
            title: '3. Aşama: Artış ve Azalış Yönü',
            content: 'İşletmenin kasasındaki para artmıştır (Aktifteki artış → BORÇ). Aynı zamanda özkaynağı da artmıştır (Kaynaktaki artış → ALACAK).'
          },
          {
            level: 4,
            title: '4. Aşama: Nihai Yevmiye Maddesi',
            content: '100 Kasa (Borç: 100.000 TL) / 500 Sermaye (Alacak: 100.000 TL)'
          }
        ]
      },
      {
        id: 'tx-2',
        order: 2,
        date: '02.10.2026',
        title: 'Peşin Ticari Mal Alımı',
        description: 'İşletme, satılmak üzere 20.000 TL tutarında ticari malı peşin (nakit) olarak satın almıştır.',
        amount: 20000,
        expectedEntry: {
          educationalNotes: 'Satın alınan ticari mal varlığı arttığı için 153 Ticari Mallar borçlandırılır; nakit ödeme nedeniyle para azaldığı için 100 Kasa alacaklandırılır.',
          lines: [
            { accountCode: '153', debit: 20000, credit: 0 },
            { accountCode: '100', debit: 0, credit: 20000 },
          ]
        },
        hints: [
          {
            level: 1,
            title: '1. Aşama: Etkilenen Unsurlar',
            content: 'İşletmeye yeni bir mal girişi olmuş ve karşılığında kasadan nakit para çıkışı gerçekleşmiştir.'
          },
          {
            level: 2,
            title: '2. Aşama: Hesap Karakterleri',
            content: 'Alınan mallar için "153 Ticari Mallar" (Aktif), nakit ödeme için "100 Kasa" (Aktif) kullanılır. Bu işlem aktif içi bir değişimdir.'
          },
          {
            level: 3,
            title: '3. Aşama: Artış ve Azalış Yönü',
            content: 'Ticari mallarımız arttığı için BORÇ kaydedilir. Kasadaki nakdimiz azaldığı için ALACAK kaydedilir.'
          },
          {
            level: 4,
            title: '4. Aşama: Nihai Yevmiye Maddesi',
            content: '153 Ticari Mallar (Borç: 20.000 TL) / 100 Kasa (Alacak: 20.000 TL)'
          }
        ]
      },
      {
        id: 'tx-3',
        order: 3,
        date: '04.10.2026',
        title: 'Veresiye (Kredili) Ticari Mal Alımı',
        description: 'İşletme, satıcılardan 15.000 TL tutarında ticari malı veresiye (bedeli daha sonra ödenmek üzere senetsiz) satın almıştır.',
        amount: 15000,
        expectedEntry: {
          educationalNotes: 'Mal stoku arttığı için 153 Ticari Mallar borçlandırılır; satıcıya olan senetsiz ticari borç arttığı için 320 Satıcılar alacaklandırılır.',
          lines: [
            { accountCode: '153', debit: 15000, credit: 0 },
            { accountCode: '320', debit: 0, credit: 15000 },
          ]
        },
        hints: [
          {
            level: 1,
            title: '1. Aşama: Etkilenen Unsurlar',
            content: 'İşletmenin stokları artmış, ancak ödeme yapılmadığı için satıcıya olan borç da artmıştır.'
          },
          {
            level: 2,
            title: '2. Aşama: Hesap Karakterleri',
            content: 'Ticari mallar "153 Ticari Mallar" (Aktif); satıcılara olan senetsiz borç "320 Satıcılar" (Pasif/Borç) hesabında takip edilir.'
          },
          {
            level: 3,
            title: '3. Aşama: Artış ve Azalış Yönü',
            content: '153 Ticari Mallar aktif bir hesap olup arttığı için BORÇ; 320 Satıcılar pasif bir hesap olup borcumuz arttığı için ALACAK kaydedilir.'
          },
          {
            level: 4,
            title: '4. Aşama: Nihai Yevmiye Maddesi',
            content: '153 Ticari Mallar (Borç: 15.000 TL) / 320 Satıcılar (Alacak: 15.000 TL)'
          }
        ]
      },
      {
        id: 'tx-4',
        order: 4,
        date: '06.10.2026',
        title: 'Bankadaki Mevduat Hesabına Para Yatırılması',
        description: 'İşletme kasasından 25.000 TL nakit para alınarak işletmenin bankadaki vadesiz mevduat hesabına yatırılmıştır.',
        amount: 25000,
        expectedEntry: {
          educationalNotes: 'Bankadaki paramız arttığı için 102 Bankalar borçlandırılır; kasadaki nakit çıktığı için 100 Kasa alacaklandırılır.',
          lines: [
            { accountCode: '102', debit: 25000, credit: 0 },
            { accountCode: '100', debit: 0, credit: 25000 },
          ]
        },
        hints: [
          {
            level: 1,
            title: '1. Aşama: Etkilenen Unsurlar',
            content: 'İşletmenin iki farklı likit varlığı arasında yer değiştirme olmuştur: Banka hesabı ve Kasa.'
          },
          {
            level: 2,
            title: '2. Aşama: Hesap Karakterleri',
            content: '"102 Bankalar" ve "100 Kasa" hesaplarının her ikisi de Aktif (Dönen Varlık) karakterlidir.'
          },
          {
            level: 3,
            title: '3. Aşama: Artış ve Azalış Yönü',
            content: 'Bankadaki mevduat arttığı için 102 Bankalar BORÇ; kasadaki nakit azaldığı için 100 Kasa ALACAK kaydedilir.'
          },
          {
            level: 4,
            title: '4. Aşama: Nihai Yevmiye Maddesi',
            content: '102 Bankalar (Borç: 25.000 TL) / 100 Kasa (Alacak: 25.000 TL)'
          }
        ]
      },
      {
        id: 'tx-5',
        order: 5,
        date: '08.10.2026',
        title: 'Peşin Ticari Mal Satışı (Satış Hasılatı)',
        description: 'İşletme, 30.000 TL tutarında ticari malı müşteriye peşin satmış ve bedelini nakit olarak tahsil etmiştir.',
        amount: 30000,
        expectedEntry: {
          educationalNotes: 'Kasaya para girdiği için 100 Kasa borçlandırılır; mal satışı hasılat doğurduğu için 600 Yurtiçi Satışlar alacaklandırılır.',
          lines: [
            { accountCode: '100', debit: 30000, credit: 0 },
            { accountCode: '600', debit: 0, credit: 30000 },
          ]
        },
        hints: [
          {
            level: 1,
            title: '1. Aşama: Etkilenen Unsurlar',
            content: 'Müşteriden nakit tahsilat yapılmış ve ticari mal satışı geliri (hasılat) doğmuştur.'
          },
          {
            level: 2,
            title: '2. Aşama: Hesap Karakterleri',
            content: 'Nakit tahsilat için "100 Kasa" (Aktif); satış hasılatı için Gelir Tablosu hesabı olan "600 Yurtiçi Satışlar" (Gelir) kullanılır.'
          },
          {
            level: 3,
            title: '3. Aşama: Artış ve Azalış Yönü',
            content: 'Kasaya nakit girdiği için 100 Kasa BORÇ; gelir hesapları kural gereği hasılat doğduğunda daima ALACAK kaydedilir.'
          },
          {
            level: 4,
            title: '4. Aşama: Nihai Yevmiye Maddesi',
            content: '100 Kasa (Borç: 30.000 TL) / 600 Yurtiçi Satışlar (Alacak: 30.000 TL)'
          }
        ]
      },
      {
        id: 'tx-6',
        order: 6,
        date: '10.10.2026',
        title: 'Satıcılara Olan Borcun Bankadan Ödenmesi',
        description: 'İşletme, satıcılara olan veresiye borcunun 10.000 TL\'lik kısmını banka mevduat hesabından havale ile ödemiştir.',
        amount: 10000,
        expectedEntry: {
          educationalNotes: 'Satıcılara olan borç azaldığı için 320 Satıcılar borçlandırılır; bankadaki mevduat azaldığı için 102 Bankalar alacaklandırılır.',
          lines: [
            { accountCode: '320', debit: 10000, credit: 0 },
            { accountCode: '102', debit: 0, credit: 10000 },
          ]
        },
        hints: [
          {
            level: 1,
            title: '1. Aşama: Etkilenen Unsurlar',
            content: 'Satıcıya olan borç kapatılmakta ve ödeme banka hesabından karşılanmaktadır.'
          },
          {
            level: 2,
            title: '2. Aşama: Hesap Karakterleri',
            content: 'Satıcı borcu "320 Satıcılar" (Pasif); banka mevduatı "102 Bankalar" (Aktif) hesabıdır.'
          },
          {
            level: 3,
            title: '3. Aşama: Artış ve Azalış Yönü',
            content: 'Pasif hesaplar azaldığında BORÇ kaydedilir (borcumuz eksildi). Aktif hesaplar azaldığında ALACAK kaydedilir (bankadaki para eksildi).'
          },
          {
            level: 4,
            title: '4. Aşama: Nihai Yevmiye Maddesi',
            content: '320 Satıcılar (Borç: 10.000 TL) / 102 Bankalar (Alacak: 10.000 TL)'
          }
        ]
      },
      {
        id: 'tx-7',
        order: 7,
        date: '12.10.2026',
        title: 'Kira Giderinin Nakit Olarak Ödenmesi',
        description: 'İşletme faaliyetlerinin yürütüldüğü idari ofisin 5.000 TL tutarındaki aylık kira bedeli kasadan nakit olarak ödenmiştir.',
        amount: 5000,
        expectedEntry: {
          educationalNotes: 'Dönem içi genel yönetim gideri doğduğu için 770 Genel Yönetim Giderleri borçlandırılır; kasadan nakit çıktığı için 100 Kasa alacaklandırılır.',
          lines: [
            { accountCode: '770', debit: 5000, credit: 0 },
            { accountCode: '100', debit: 0, credit: 5000 },
          ]
        },
        hints: [
          {
            level: 1,
            title: '1. Aşama: Etkilenen Unsurlar',
            content: 'İşletmenin bir yönetim gideri doğmuş ve karşılığında nakit ödeme yapılmıştır.'
          },
          {
            level: 2,
            title: '2. Aşama: Hesap Karakterleri',
            content: 'Kira gideri "770 Genel Yönetim Giderleri" (Gider); nakit çıkışı "100 Kasa" (Aktif) hesabıdır.'
          },
          {
            level: 3,
            title: '3. Aşama: Artış ve Azalış Yönü',
            content: 'Gider hesapları ortaya çıktığında daima BORÇ kaydedilir. Kasadan para çıktığı için (aktif azalışı) 100 Kasa ALACAK kaydedilir.'
          },
          {
            level: 4,
            title: '4. Aşama: Nihai Yevmiye Maddesi',
            content: '770 Genel Yönetim Giderleri (Borç: 5.000 TL) / 100 Kasa (Alacak: 5.000 TL)'
          }
        ]
      },
      {
        id: 'tx-8',
        order: 8,
        date: '14.10.2026',
        title: 'Veresiye (Kredili) Mal Satışı',
        description: 'İşletme, bir müşteriye 12.000 TL tutarında ticari malı veresiye (bedeli daha sonra tahsil edilmek üzere senetsiz) satmıştır.',
        amount: 12000,
        expectedEntry: {
          educationalNotes: 'Müşteriden senetsiz alacak doğduğu için 120 Alıcılar borçlandırılır; satış hasılatı gerçekleştiği için 600 Yurtiçi Satışlar alacaklandırılır.',
          lines: [
            { accountCode: '120', debit: 12000, credit: 0 },
            { accountCode: '600', debit: 0, credit: 12000 },
          ]
        },
        hints: [
          {
            level: 1,
            title: '1. Aşama: Etkilenen Unsurlar',
            content: 'Müşteriden ticari alacağımız doğmuş ve mal satışı hasılatı elde edilmiştir.'
          },
          {
            level: 2,
            title: '2. Aşama: Hesap Karakterleri',
            content: 'Müşteriden senetsiz alacaklar "120 Alıcılar" (Aktif/Dönen Varlık); hasılat "600 Yurtiçi Satışlar" (Gelir) hesabında takip edilir.'
          },
          {
            level: 3,
            title: '3. Aşama: Artış ve Azalış Yönü',
            content: 'Alacaklarımız arttığı için 120 Alıcılar BORÇ; gelir hesapları hasılat olduğunda daima ALACAK kaydedilir.'
          },
          {
            level: 4,
            title: '4. Aşama: Nihai Yevmiye Maddesi',
            content: '120 Alıcılar (Borç: 12.000 TL) / 600 Yurtiçi Satışlar (Alacak: 12.000 TL)'
          }
        ]
      }
    ]
  },
  {
    id: 'gunes-dagitim-orta',
    title: 'Güneş Ticaret A.Ş. - Duran Varlık & Senet İşlemleri',
    difficulty: 'Orta',
    companyName: 'Güneş Ticaret A.Ş.',
    establishedDate: '15.10.2026',
    initialCapital: 150000,
    description: 'Demirbaş alımı, banka kredisi çekimi, senetli alacak ve borç hareketlerini içeren orta seviye senaryo.',
    learningObjectives: [
      'Duran varlık alımlarının (255 Demirbaşlar) kaydedilmesi',
      'Kısa vadeli banka kredisi kullanımının (300) muhasebeleştirilmesi',
      'Müşteriden bono/senet alınması (121 Alacak Senetleri)',
      'Satıcıya borç senedi keşide edilmesi (321 Borç Senetleri)',
      'Bankadan elde edilen mevduat faiz gelirinin (642) kaydedilmesi',
    ],
    transactions: [
      {
        id: 'tx-g1',
        order: 1,
        date: '15.10.2026',
        title: 'Kuruluş Sermayesinin Bankaya Yatırılması',
        description: 'İşletme 150.000 TL sermaye ile kurulmuş, sermayenin tamamı işletmenin banka mevduat hesabına yatırılmıştır.',
        amount: 150000,
        expectedEntry: {
          educationalNotes: 'Bankadaki mevduat arttığı için 102 Bankalar borçlandırılır; sermaye tahsis edildiği için 500 Sermaye alacaklandırılır.',
          lines: [
            { accountCode: '102', debit: 150000, credit: 0 },
            { accountCode: '500', debit: 0, credit: 150000 },
          ]
        },
        hints: [
          {
            level: 1,
            title: '1. Aşama: Etkilenen Unsurlar',
            content: 'Banka hesabı ve sermaye unsurları.'
          },
          {
            level: 2,
            title: '2. Aşama: Hesap Karakterleri',
            content: '102 Bankalar (Aktif), 500 Sermaye (Özkaynak/Pasif).'
          },
          {
            level: 3,
            title: '3. Aşama: Artış/Azalış Yönü',
            content: 'Bankada artış (BORÇ), sermayede artış (ALACAK).'
          },
          {
            level: 4,
            title: '4. Aşama: Nihai Kayıt',
            content: '102 Bankalar (B: 150.000) / 500 Sermaye (A: 150.000)'
          }
        ]
      },
      {
        id: 'tx-g2',
        order: 2,
        date: '16.10.2026',
        title: 'Büro Mobilyası ve Bilgisayar (Demirbaş) Alımı',
        description: 'Ofis faaliyetlerinde kullanılmak üzere 20.000 TL tutarında masa ve bilgisayar (demirbaş) satın alınmış, bedeli bankadan ödenmiştir.',
        amount: 20000,
        expectedEntry: {
          educationalNotes: 'Duran varlık alımı 255 Demirbaşlar hesabında borçlandırılır; bankadan ödendiği için 102 Bankalar alacaklandırılır.',
          lines: [
            { accountCode: '255', debit: 20000, credit: 0 },
            { accountCode: '102', debit: 0, credit: 20000 },
          ]
        },
        hints: [
          {
            level: 1,
            title: '1. Aşama: Etkilenen Unsurlar',
            content: 'Satılmak için değil kullanılmak için alınan duran varlık ve banka hesabı.'
          },
          {
            level: 2,
            title: '2. Aşama: Hesap Karakterleri',
            content: '255 Demirbaşlar (Duran Varlık/Aktif), 102 Bankalar (Dönen Varlık/Aktif).'
          },
          {
            level: 3,
            title: '3. Aşama: Artış/Azalış Yönü',
            content: 'Demirbaş arttı (BORÇ), banka azaldı (ALACAK).'
          },
          {
            level: 4,
            title: '4. Aşama: Nihai Kayıt',
            content: '255 Demirbaşlar (B: 20.000) / 102 Bankalar (A: 20.000)'
          }
        ]
      },
      {
        id: 'tx-g3',
        order: 3,
        date: '18.10.2026',
        title: 'Kısa Vadeli Banka Kredisi Temini',
        description: 'İşletme, ticari faaliyetlerini finanse etmek üzere bir bankadan 40.000 TL tutarında 6 ay vadeli nakit kredi çekmiş ve bu tutar banka hesabına aktarılmıştır.',
        amount: 40000,
        expectedEntry: {
          educationalNotes: 'Bankadaki para arttığı için 102 Bankalar borçlandırılır; kısa vadeli kredi borcu arttığı için 300 Banka Kredileri alacaklandırılır.',
          lines: [
            { accountCode: '102', debit: 40000, credit: 0 },
            { accountCode: '300', debit: 0, credit: 40000 },
          ]
        },
        hints: [
          {
            level: 1,
            title: '1. Aşama: Etkilenen Unsurlar',
            content: 'Banka hesabındaki para ve bankaya olan kısa vadeli kredi borcu.'
          },
          {
            level: 2,
            title: '2. Aşama: Hesap Karakterleri',
            content: '102 Bankalar (Aktif), 300 Banka Kredileri (Pasif/Kısa Vadeli Yabancı Kaynak).'
          },
          {
            level: 3,
            title: '3. Aşama: Artış/Azalış Yönü',
            content: 'Bankadaki para arttı (BORÇ), kredi borcumuz arttı (ALACAK).'
          },
          {
            level: 4,
            title: '4. Aşama: Nihai Kayıt',
            content: '102 Bankalar (B: 40.000) / 300 Banka Kredileri (A: 40.000)'
          }
        ]
      },
      {
        id: 'tx-g4',
        order: 4,
        date: '20.10.2026',
        title: 'Senet Karşılığı Ticari Mal Satışı',
        description: 'İşletme, 25.000 TL tutarında ticari mal satmış; bedeli karşılığında müşteriden 60 gün vadeli senet (bono) almıştır.',
        amount: 25000,
        expectedEntry: {
          educationalNotes: 'Müşteriden senet alındığı için 121 Alacak Senetleri borçlandırılır; satış hasılatı gerçekleştiği için 600 Yurtiçi Satışlar alacaklandırılır.',
          lines: [
            { accountCode: '121', debit: 25000, credit: 0 },
            { accountCode: '600', debit: 0, credit: 25000 },
          ]
        },
        hints: [
          {
            level: 1,
            title: '1. Aşama: Etkilenen Unsurlar',
            content: 'Müşteriden alınan senetli alacak ve satış geliri.'
          },
          {
            level: 2,
            title: '2. Aşama: Hesap Karakterleri',
            content: '121 Alacak Senetleri (Aktif), 600 Yurtiçi Satışlar (Gelir).'
          },
          {
            level: 3,
            title: '3. Aşama: Artış/Azalış Yönü',
            content: 'Senetli alacak arttı (BORÇ), satış hasılatı doğdu (ALACAK).'
          },
          {
            level: 4,
            title: '4. Aşama: Nihai Kayıt',
            content: '121 Alacak Senetleri (B: 25.000) / 600 Yurtiçi Satışlar (A: 25.000)'
          }
        ]
      },
      {
        id: 'tx-g5',
        order: 5,
        date: '22.10.2026',
        title: 'Senet Düzenlenerek Ticari Mal Alışı',
        description: 'İşletme, satıcılardan 18.000 TL tutarında ticari mal satın almış; karşılığında satıcıya kendi düzenlediği bir borç senedi (bono) vermiştir.',
        amount: 18000,
        expectedEntry: {
          educationalNotes: 'Mal stoku arttığı için 153 Ticari Mallar borçlandırılır; senetli borç doğduğu için 321 Borç Senetleri alacaklandırılır.',
          lines: [
            { accountCode: '153', debit: 18000, credit: 0 },
            { accountCode: '321', debit: 0, credit: 18000 },
          ]
        },
        hints: [
          {
            level: 1,
            title: '1. Aşama: Etkilenen Unsurlar',
            content: 'Ticari mal stoku ve işletmenin imzalayıp verdiği borç senedi.'
          },
          {
            level: 2,
            title: '2. Aşama: Hesap Karakterleri',
            content: '153 Ticari Mallar (Aktif), 321 Borç Senetleri (Pasif/Kaynak).'
          },
          {
            level: 3,
            title: '3. Aşama: Artış/Azalış Yönü',
            content: 'Ticari mal varlığı arttı (BORÇ), senetli borç arttı (ALACAK).'
          },
          {
            level: 4,
            title: '4. Aşama: Nihai Kayıt',
            content: '153 Ticari Mallar (B: 18.000) / 321 Borç Senetleri (A: 18.000)'
          }
        ]
      },
      {
        id: 'tx-g6',
        order: 6,
        date: '25.10.2026',
        title: 'Bankadan Mevduat Faiz Geliri Elde Edilmesi',
        description: 'İşletmenin bankadaki mevduat hesabına 3.000 TL brüt faiz tahakkuk etmiş ve bu tutar doğrudan banka hesabına ilave edilmiştir.',
        amount: 3000,
        expectedEntry: {
          educationalNotes: 'Bankadaki paramız arttığı için 102 Bankalar borçlandırılır; gelir doğduğu için 642 Faiz Gelirleri alacaklandırılır.',
          lines: [
            { accountCode: '102', debit: 3000, credit: 0 },
            { accountCode: '642', debit: 0, credit: 3000 },
          ]
        },
        hints: [
          {
            level: 1,
            title: '1. Aşama: Etkilenen Unsurlar',
            content: 'Banka hesabı ve faiz geliri.'
          },
          {
            level: 2,
            title: '2. Aşama: Hesap Karakterleri',
            content: '102 Bankalar (Aktif), 642 Faiz Gelirleri (Gelir Tablosu Gelir).'
          },
          {
            level: 3,
            title: '3. Aşama: Artış/Azalış Yönü',
            content: 'Bankada artış (BORÇ), gelir hesapları kural gereği hasılat doğduğunda (ALACAK).'
          },
          {
            level: 4,
            title: '4. Aşama: Nihai Kayıt',
            content: '102 Bankalar (B: 3.000) / 642 Faiz Gelirleri (A: 3.000)'
          }
        ]
      }
    ]
  },
  {
    id: 'marmara-endustri-ileri',
    title: 'Marmara Endüstri A.Ş. - Karma (Bileşik) Maddeler',
    difficulty: 'İleri',
    companyName: 'Marmara Endüstri A.Ş.',
    establishedDate: '01.11.2026',
    initialCapital: 200000,
    description: 'Birden fazla borç ve alacak satırı içeren bileşik yevmiye maddeleri, taşıt alımı ve karma ödemeli işlemleri kapsayan ileri seviye senaryo.',
    learningObjectives: [
      'Bileşik (karma) yevmiye maddesi oluşturma yeteneği',
      'Kuruluşta hem nakit hem banka mevduatının birlikte kaydedilmesi',
      'Taşıt alımında kısmi nakit, kısmi vadeli ödeme kaydı',
      'Satışta kısmi peşin, kısmi senetli tahsilat modeli',
    ],
    transactions: [
      {
        id: 'tx-m1',
        order: 1,
        date: '01.11.2026',
        title: 'Bileşik Sermaye Kuruluşu (Kasa + Banka)',
        description: 'İşletme 200.000 TL sermaye ile kurulmuştur. Ortaklar sermayenin 80.000 TL\'sini nakit olarak kasaya, 120.000 TL\'sini ise şirketin banka mevduat hesabına yatırmıştır.',
        amount: 200000,
        expectedEntry: {
          educationalNotes: 'Kasaya ve bankaya aynı anda para girdiği için iki aktif hesap birden borçlandırılır; toplam sermaye için 500 Sermaye alacaklandırılır.',
          lines: [
            { accountCode: '100', debit: 80000, credit: 0 },
            { accountCode: '102', debit: 120000, credit: 0 },
            { accountCode: '500', debit: 0, credit: 200000 },
          ]
        },
        hints: [
          {
            level: 1,
            title: '1. Aşama: Etkilenen Unsurlar',
            content: 'Kasa, Banka ve Sermaye (üç farklı hesap etkilenmektedir).'
          },
          {
            level: 2,
            title: '2. Aşama: Hesap Karakterleri',
            content: '100 Kasa (Aktif), 102 Bankalar (Aktif), 500 Sermaye (Özkaynak/Pasif).'
          },
          {
            level: 3,
            title: '3. Aşama: Artış/Azalış Yönü',
            content: 'Kasada ve bankada artış (ikisi de BORÇ), sermayede artış (ALACAK).'
          },
          {
            level: 4,
            title: '4. Aşama: Nihai Kayıt',
            content: '100 Kasa (B: 80.000) ve 102 Bankalar (B: 120.000) / 500 Sermaye (A: 200.000)'
          }
        ]
      },
      {
        id: 'tx-m2',
        order: 2,
        date: '03.11.2026',
        title: 'Hizmet Taşıtı Alımı (Kısmi Banka, Kısmi Satıcı)',
        description: 'İşletme faaliyetlerinde kullanılmak üzere 60.000 TL değerinde bir taşıt satın alınmıştır. Bedelinin 30.000 TL\'si bankadan havale ile ödenmiş, kalan 30.000 TL için satıcıya borçlanılmıştır.',
        amount: 60000,
        expectedEntry: {
          educationalNotes: 'Taşıt duran varlığı 254 Taşıtlar hesabında borçlandırılır; bankadaki azalış 102 Bankalar ve satıcıya borç 320 Satıcılar hesaplarında alacaklandırılır.',
          lines: [
            { accountCode: '254', debit: 60000, credit: 0 },
            { accountCode: '102', debit: 0, credit: 30000 },
            { accountCode: '320', debit: 0, credit: 30000 },
          ]
        },
        hints: [
          {
            level: 1,
            title: '1. Aşama: Etkilenen Unsurlar',
            content: 'Taşıt varlığı, banka mevduatı ve satıcıya olan senetsiz borç.'
          },
          {
            level: 2,
            title: '2. Aşama: Hesap Karakterleri',
            content: '254 Taşıtlar (Duran Varlık/Aktif), 102 Bankalar (Aktif), 320 Satıcılar (Pasif).'
          },
          {
            level: 3,
            title: '3. Aşama: Artış/Azalış Yönü',
            content: 'Taşıt arttı (BORÇ), banka azaldı (ALACAK), satıcı borcu arttı (ALACAK).'
          },
          {
            level: 4,
            title: '4. Aşama: Nihai Kayıt',
            content: '254 Taşıtlar (B: 60.000) / 102 Bankalar (A: 30.000), 320 Satıcılar (A: 30.000)'
          }
        ]
      },
      {
        id: 'tx-m3',
        order: 3,
        date: '06.11.2026',
        title: 'Ticari Mal Satışı (Kısmi Nakit, Kısmi Senetli)',
        description: 'İşletme, 50.000 TL tutarında mal satmıştır. Müşteri 20.000 TL\'sini nakit ödemiş, kalan 30.000 TL için 90 gün vadeli senet (bono) vermiştir.',
        amount: 50000,
        expectedEntry: {
          educationalNotes: 'Nakit giriş için 100 Kasa, senet için 121 Alacak Senetleri borçlandırılır; toplam satış için 600 Yurtiçi Satışlar alacaklandırılır.',
          lines: [
            { accountCode: '100', debit: 20000, credit: 0 },
            { accountCode: '121', debit: 30000, credit: 0 },
            { accountCode: '600', debit: 0, credit: 50000 },
          ]
        },
        hints: [
          {
            level: 1,
            title: '1. Aşama: Etkilenen Unsurlar',
            content: 'Nakit para (Kasa), müşteri senedi (Alacak Senetleri) ve satış hasılatı.'
          },
          {
            level: 2,
            title: '2. Aşama: Hesap Karakterleri',
            content: '100 Kasa (Aktif), 121 Alacak Senetleri (Aktif), 600 Yurtiçi Satışlar (Gelir).'
          },
          {
            level: 3,
            title: '3. Aşama: Artış/Azalış Yönü',
            content: 'Kasaya para girdi (BORÇ), senetli alacak arttı (BORÇ), satış hasılatı doğdu (ALACAK).'
          },
          {
            level: 4,
            title: '4. Aşama: Nihai Kayıt',
            content: '100 Kasa (B: 20.000) ve 121 Alacak Senetleri (B: 30.000) / 600 Yurtiçi Satışlar (A: 50.000)'
          }
        ]
      },
      {
        id: 'tx-m4',
        order: 4,
        date: '08.11.2026',
        title: 'Satıcıya Olan Senetsiz Borcun Senede Bağlanması',
        description: 'İşletme, satıcılara olan 30.000 TL\'lik senetsiz borcunun 15.000 TL\'lik kısmı için satıcıya 60 gün vadeli borç senedi düzenleyip vermiştir.',
        amount: 15000,
        expectedEntry: {
          educationalNotes: 'Senetsiz borç azaldığı için 320 Satıcılar borçlandırılır; senetli borç arttığı için 321 Borç Senetleri alacaklandırılır (Pasif içi değişim).',
          lines: [
            { accountCode: '320', debit: 15000, credit: 0 },
            { accountCode: '321', debit: 0, credit: 15000 },
          ]
        },
        hints: [
          {
            level: 1,
            title: '1. Aşama: Etkilenen Unsurlar',
            content: 'Satıcıya olan veresiye borç ve imzalanan borç senedi (iki pasif kaynak).'
          },
          {
            level: 2,
            title: '2. Aşama: Hesap Karakterleri',
            content: '320 Satıcılar (Pasif), 321 Borç Senetleri (Pasif).'
          },
          {
            level: 3,
            title: '3. Aşama: Artış/Azalış Yönü',
            content: 'Senetsiz borç azaldı (BORÇ), senetli borç arttı (ALACAK).'
          },
          {
            level: 4,
            title: '4. Aşama: Nihai Kayıt',
            content: '320 Satıcılar (B: 15.000) / 321 Borç Senetleri (A: 15.000)'
          }
        ]
      },
      {
        id: 'tx-m5',
        order: 5,
        date: '10.11.2026',
        title: 'Banka Aracılığıyla Genel İdare ve İletişim Gideri Ödemesi',
        description: 'İşletmenin aylık internet, telefon ve kırtasiye idari giderleri karşılığı olan 6.000 TL işletmenin banka mevduat hesabından havale ile ödenmiştir.',
        amount: 6000,
        expectedEntry: {
          educationalNotes: 'Dönem içi gider gerçekleştiği için 770 Genel Yönetim Giderleri borçlandırılır; bankadaki para çıktığı için 102 Bankalar alacaklandırılır.',
          lines: [
            { accountCode: '770', debit: 6000, credit: 0 },
            { accountCode: '102', debit: 0, credit: 6000 },
          ]
        },
        hints: [
          {
            level: 1,
            title: '1. Aşama: Etkilenen Unsurlar',
            content: 'Genel yönetim gideri ve banka mevduatı.'
          },
          {
            level: 2,
            title: '2. Aşama: Hesap Karakterleri',
            content: '770 Genel Yönetim Giderleri (Gider), 102 Bankalar (Aktif).'
          },
          {
            level: 3,
            title: '3. Aşama: Artış/Azalış Yönü',
            content: 'Gider ortaya çıktı (BORÇ), banka mevduatı azaldı (ALACAK).'
          },
          {
            level: 4,
            title: '4. Aşama: Nihai Kayıt',
            content: '770 Genel Yönetim Giderleri (B: 6.000) / 102 Bankalar (A: 6.000)'
          }
        ]
      }
    ]
  }
];
