# Genel Muhasebe Stüdyosu — Senaryo Geliştirme Rehberi 📖

Bu rehber, **Genel Muhasebe İnteraktif Öğrenme Platformu** için yeni vaka senaryoları ve dinamik soru şablonları hazırlamak isteyen eğitmenler, muhasebe öğrencileri ve açık kaynak katkıcıları için hazırlanmıştır.

Platformumuzun temel felsefesi **ezbercilik değil, çift taraflı kayıt mantığını (nedensellik) ve finansal tablolar arasındaki canlı etkileşimi** öğretmektir.

---

## 📑 İçindekiler
1. [Pedagojik İlkeler & Zanaat Standartları](#1-pedagojik-i̇lkeler--zanaat-standartları)
2. [Senaryo Veri Yapısı (Anatomi)](#2-senaryo-veri-yapısı-anatomi)
3. [4 Kademeli Sokratik İpuçları Metodolojisi](#3-4-kademeli-sokratik-i̇puçları-metodolojisi)
4. [Adım Adım Yeni Bir Senaryo Ekleme](#4-adım-adım-yeni-bir-senaryo-ekleme)
5. [Dinamik Soru Üreticiye Şablon / Konu Ekleme](#5-dinamik-soru-üreticiye-şablon--konu-ekleme)
6. [Hesap Planı Kuralları & Düzenleyici (-) Hesaplar](#6-hesap-planı-kuralları--düzenleyici---hesaplar)
7. [Matematiksel Doğrulama ve Test Komutları](#7-matematiksel-doğrulama-ve-test-komutları)

---

## 1. Pedagojik İlkeler & Zanaat Standartları

Yeni bir senaryo kurgularken aşağıdaki 5 kurala kesinlikle uyulmalıdır:

1. **Çift Taraflı Kayıt Denkliği (Pacioli İlkesi):** Her yevmiye maddesinde toplam Borç tutarı, toplam Alacak tutarına **kuruşu kuruşuna eşit** olmalıdır (`Σ Borç === Σ Alacak`).
2. **Gerçekçi ve Güncel Vergi Oranları:** KDV içeren işlemlerde güncel **%20 KDV** standardı (`191 İndirilecek KDV` veya `391 Hesaplanan KDV`) kullanılmalıdır.
3. **Akademik Üniversite Müfredat Dili:** Anlaşılmaz bürokratik kanun maddeleri (`VUK m. 229`, `Emtia`) yerine, öğrencilerin derslerde ve sınavlarda gördüğü açık terimler (*"Borç (Sol) ve Alacak (Sağ) mantığı"*, *"Ticari Mal"*, *"Çek Keşidesi"*, *"Çek Cirosu"*) tercih edilmelidir.
4. **Anti-AI Filtresi:** Soru metinlerinde veya ipuçlarında jenerik yapay zeka klişeleri (*"Next-Gen", "Sinerji yaratmak", "Harika bir deneyim"*) ve alakasız emojiler kullanılmamalıdır. Ciddi, destekleyici ve eğitici bir üslup benimsenmelidir.
5. **Nedensel Bağlantı:** Bir işlemde para veya mal çıkışı varsa, önceki adımlarda o varlığın kasada/bankada/depoda var olduğundan emin olunmalıdır.

---

## 2. Senaryo Veri Yapısı (Anatomi)

Tüm senaryolar [`src/types/scenario.ts`](./src/types/scenario.ts) dosyasında tanımlanan TypeScript tipleriyle inşa edilir:

```typescript
export interface CompanyScenario {
  id: string;                    // Benzersiz tanımlayıcı (örn: 'nova-teknoloji-bordro-ileri')
  title: string;                 // Senaryo başlığı (örn: 'Nova Teknoloji - Personel Bordrosu')
  difficulty: 'Kolay' | 'Orta' | 'İleri';
  companyName: string;           // Şirket unvanı
  establishedDate: string;       // Kuruluş tarihi (GG.AA.YYYY)
  initialCapital: number;        // Başlangıç sermayesi (TL)
  description: string;           // Senaryonun pedagojik özeti
  learningObjectives: string[];  // Kazanımlar listesi
  transactions: CommercialTransaction[]; // Yevmiye soruları dizisi
}
```

Her bir ticari işlem (`CommercialTransaction`) aşağıdaki alanları içerir:

```typescript
export interface CommercialTransaction {
  id: string;              // İşlem kimliği (örn: 'tx-nv1')
  order: number;           // Sıra numarası (1, 2, 3...)
  date: string;            // İşlem tarihi (GG.AA.YYYY)
  title: string;           // İşlem başlığı
  description: string;     // Öğrenciye sunulan soru paragrafı ve tutarlar
  amount: number;          // İşlemin brüt veya ana parasal tutarı
  expectedEntry: {
    educationalNotes: string; // Çözüm sonrası gösterilen öğretmen açıklaması
    lines: {
      accountCode: string; // 3 haneli hesap kodu (örn: '100', '102', '500')
      debit: number;       // Borç tutarı (yoksa 0)
      credit: number;      // Alacak tutarı (yoksa 0)
    }[];
  };
  hints: SocraticHint[];   // 4 kademeli ipucu dizisi
}
```

---

## 3. 4 Kademeli Sokratik İpuçları Metodolojisi

Öğrenciye cevabı direkt vermek yerine adım adım düşünmesini sağlayan 4 kademeli ipucu yapısı zorunludur:

- **1. Aşama (Ne Değişti?):** Hesap kodları anılmadan, fiziksel ve finansal değişim anlatılır (*"Kasadan para çıktı, depoya ticari mal girdi"*).
- **2. Aşama (Hangi Hesaplar?):** Kullanılacak hesap kodları ve hesap sınıfları tanıtılır (*"Mallar için 153 Ticari Mallar, ödeme için 100 Kasa"*).
- **3. Aşama (Borç / Alacak Yönü):** Hesap kuralları hatırlatılır (*"Varlık artışı Borç (153), varlık azalışı Alacak (100) yazılır"*).
- **4. Aşama (Tam Yevmiye Kaydı):** Tutar ve yönleriyle doğru kayıt açıkça gösterilir (*"153 Ticari Mallar (B: 20.000) / 100 Kasa (A: 20.000)"*).

---

## 4. Adım Adım Yeni Bir Senaryo Ekleme

### Adım 1: Senaryoyu Tasarlayın
Yeni senaryonuzu [`src/data/scenarios.ts`](./src/data/scenarios.ts) içindeki `SCENARIOS` dizisinin sonuna ekleyin.

```typescript
// src/data/scenarios.ts
export const SCENARIOS: CompanyScenario[] = [
  // ... mevcut senaryolar ...
  {
    id: 'ornek-lojistik-temel',
    title: 'Örnek Lojistik - Kuruluş ve Taşıt Alımı',
    difficulty: 'Kolay',
    companyName: 'Örnek Lojistik Ltd. Şti.',
    establishedDate: '01.10.2026',
    initialCapital: 300000,
    description: 'Banka sermayesi ile şirket kuruluşu ve taşıt yatırımı işlemlerini kapsayan temel çalışma.',
    learningObjectives: [
      'Banka mevduatıyla kuruluş sermayesinin kaydedilmesi',
      'Taşıt alımında 254 Taşıtlar ve 191 KDV hesaplarının borçlandırılması',
    ],
    transactions: [
      {
        id: 'tx-ol1',
        order: 1,
        date: '01.10.2026',
        title: 'İşletmenin Kuruluşu',
        description: 'Ortaklar 300.000 TL nakit sermaye ile şirketi kurmuş, tutar banka hesabına yatırılmıştır.',
        amount: 300000,
        expectedEntry: {
          educationalNotes: 'Bankadaki mevduat arttığı için 102 Borç, sermaye taahhüdü için 500 Alacak yazılır.',
          lines: [
            { accountCode: '102', debit: 300000, credit: 0 },
            { accountCode: '500', debit: 0, credit: 300000 },
          ],
        },
        hints: [
          { level: 1, title: '1. Aşama: İşlemde Neler Değişti?', content: 'Bankadaki paramız arttı ve sermaye oluştu.' },
          { level: 2, title: '2. Aşama: Hangi Hesaplar Kullanılır?', content: '102 Bankalar (Aktif) ve 500 Sermaye (Pasif).' },
          { level: 3, title: '3. Aşama: Borç ve Alacak Yönleri?', content: '102 BORÇ (300.000 TL) / 500 ALACAK (300.000 TL).' },
          { level: 4, title: '4. Aşama: Tam Yevmiye Kaydı', content: '102 Bankalar (B: 300.000) / 500 Sermaye (A: 300.000)' },
        ],
      },
    ],
  },
];
```

### Adım 2: Konu Etiketini Tanımlayın
[`src/components/landing/ScenarioSelectionSection.tsx`](./src/components/landing/ScenarioSelectionSection.tsx) dosyasındaki `getScenarioTopicMeta` fonksiyonuna senaryonuzun kartında görünecek ders konusunu ekleyin:

```typescript
case 'ornek-lojistik-temel':
  return 'Banka Sermayesi & Taşıt Yatırımı';
```

---

## 5. Dinamik Soru Üreticiye Şablon / Konu Ekleme

Eğer sorunuzun algoritmik olarak rastgele rakamlarla türetilmesini istiyorsanız:

1. **Konu Tipini Ekleyin ([`src/types/generator.ts`](./src/types/generator.ts)):**
   ```typescript
   export type GeneratorFocusArea =
     | 'genel'
     | 'cek_senet'
     | 'kdv_islemleri'
     | 'yeni_konunuz';
   ```

2. **Şablon Fonksiyonunu Yazın ([`src/core/scenarioGenerator.ts`](./src/core/scenarioGenerator.ts)):**
   `ARCHETYPES` dizisine yeni işlem şablonunuzu ekleyin. `isApplicable` şartını ve `applyState` bakiye güncellemesini belirleyin:
   ```typescript
   {
     id: 'ornek_yeni_islem',
     title: 'Yeni İşlem Başlığı',
     minDifficulty: 'Orta',
     tags: ['yeni_konunuz', 'genel'],
     isApplicable: ({ state }) => state.bank >= 20000,
     generate: ({ state, dateStr, order }) => {
       const amount = pickRoundAmount(10000, 30000, 5000);
       return {
         transaction: { /* CommercialTransaction alanları */ },
         applyState: (s) => { s.bank -= amount; }
       };
     }
   }
   ```

3. **Kullanıcı Modaline Seçenek Ekleyin ([`src/components/ScenarioGeneratorModal.tsx`](./src/components/ScenarioGeneratorModal.tsx)):**
   `FOCUS_AREAS` listesine yeni konunun başlık ve açıklamasını ekleyin.

---

## 6. Hesap Planı Kuralları & Düzenleyici (-) Hesaplar

Tüm hesaplar [`src/core/accounts.ts`](./src/core/accounts.ts) içinde kayıtlıdır.

### Düzenleyici Hesap Kuralları:
- **Aktifi Düzenleyen Pasif Karakterli Hesaplar (`DUZENLEYICI_AKTIF`):**
  - `103 Verilen Çekler ve Ödeme Emirleri (-)`
  - `122 Alacak Senetleri Reeskontu (-)`
  - `129 Şüpheli Ticari Alacaklar Karşılığı (-)`
  - `257 Birikmiş Amortismanlar (-)`
  *Kural:* Kodu 1 veya 2 ile başlamasına rağmen sonunda **(-)** bulunur, pasif hesap gibi çalışır (artışlar ALACAK, azalışlar BORÇ) ve bilançonun Aktif tarafında varlıkları eksiltir.

- **Pasifi Düzenleyen Aktif Karakterli Hesaplar (`DUZENLEYICI_PASIF`):**
  - `591 Dönem Net Zararı (-)`
  *Kural:* Borç bakiyesi verir ve bilançoda Özkaynakları eksiltir.

---

## 7. Matematiksel Doğrulama ve Test Komutları

Yazdığınız senaryoları sisteme göndermeden önce mutlaka aşağıdaki doğrulamaları yapın:

### 1. Bütünlük ve Çift Taraflı Kayıt Testi:
Terminalinizde aşağıdaki hızlı komutla tüm senaryoların borç/alacak denkliğini ve ipucu seviyelerini denetleyin:

```bash
node -e "
import('./src/data/scenarios.ts').then(m => {
  import('./src/core/accounts.ts').then(accM => {
    let errors = 0;
    m.SCENARIOS.forEach(s => {
      s.transactions.forEach(tx => {
        let deb = 0, cred = 0;
        tx.expectedEntry.lines.forEach(l => {
          deb += l.debit; cred += l.credit;
          if (!accM.ACCOUNTS_MAP[l.accountCode]) {
            console.error('Bilinmeyen hesap kodu:', l.accountCode, 'Senaryo:', s.id);
            errors++;
          }
        });
        if (Math.abs(deb - cred) > 0.01) {
          console.error('Borç-Alacak denkliği bozuk:', s.id, tx.id, 'Borç:', deb, 'Alacak:', cred);
          errors++;
        }
      });
    });
    console.log('Test bitti. Hata sayısı:', errors);
  });
});
"
```

### 2. TypeScript ve Vite Derleme Testi:
```bash
npm run build
```

Derleme sıfır hatayla (`✓ built in ...`) tamamlanıyorsa senaryonuz yayına hazırdır! Katkılarınız için şimdiden teşekkür ederiz.
