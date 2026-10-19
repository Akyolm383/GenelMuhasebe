# Genel Muhasebe İnteraktif Öğrenme Platformu 📊

Üniversite Genel Muhasebe dersi için geliştirilmiş, ezber yerine çift taraflı kayıt mantığını ve finansal tablolar arasındaki canlı etkileşimi öğreten modern web uygulaması.

🌐 **Canlı Uygulama:** [https://muhasebe.ramazanakyol.me](https://muhasebe.ramazanakyol.me)

---

## Özellikler

- **Yevmiye Defteri (Journal):** Gerçek muhasebe yevmiye maddesi formatında Borç (Sol) / Alacak (Sağ) kaydı, akıllı hesap arama ve adım adım pedagojik doğrulama (`101 Alınan Çekler` vs `103 Verilen Çekler (-)` ciro/keşide farkı analizi dahil).
- **Büyük Defter (T-Cetveli — Kendin Doldur & Otomatik Mod):** Yevmiye kayıtlarını T-Cetvellerine elle aktarma (`Kendin Doldur` pratik modu), bakiye doğrulama ve tek tıkla otomatik tablo karşılaştırması.
- **Mizan Cetveli (Trial Balance):** Borç/Alacak toplamları ve kalan bakiyelerle canlı denklik kontrolü.
- **Bilanço (Balance Sheet — Kendin Doldur & Otomatik Mod):** Aktif (Varlıklar) ve Pasif (Kaynaklar) sınıflarına göre elle bilanço yerleştirme pratiği, `(-)` düzenleyici aktif hesap (`103`, `257`) işaret kontrolü ve denge doğrulaması.
- **Üniversite Genel Muhasebe I Müfredat Senaryoları & Konu Odaklı Üretici:** Kuruluş, KDV (`191`/`391`), Çek Alımı & Cirosu (`101`), Çek Keşidesi (`103`), Kredi Kartı POS (`108`), Satılan Ticari Mallar Maliyeti (`621`), Satıştan İade (`610`) ve Amortisman (`257`) senaryoları ile konu seçmeli soru üretici.
- **Görev Bitince Otomatik Sıfırlama & Karne:** Tamamlanan görevlerin özet karnesini sunar ve senaryoyu tekrar çözülebilmesi için otomatik sıfırlar.
- **4 Kademeli Sokratik İpuçları:** Sorunun cevabını doğrudan vermeden öğrenciyi düşündüren aşamalı rehberlik.
- **Warm Architectural Paper & Tactile Financial Atelier Tasarım Sistemi:** Kağıt dokulu sıcak taş (`#F5F3EE`) açık tema, kalibre edilmiş koyu tema (`#0C0D0E`) ve tüm ekran boyutlarına tam uyum.

---

## Teknolojiler

- **React 19** & **TypeScript**
- **Vite 8**
- **Tailwind CSS v4** & **Framer Motion**
- **Zustand** (Kalıcı durum yönetimi)
- **Lucide Icons** & **Canvas Confetti**

---

## 🚀 Yerel Geliştirme

```bash
# Bağımlılıkları yükleyin
npm install

# Geliştirme sunucusunu başlatın
npm run dev

# Production derlemesi alın
npm run build
```

---

## 📚 Yeni Senaryo Ekleme Rehberi

Projeye üniversite Genel Muhasebe müfredatına uygun yeni çalışma senaryoları veya Dinamik Soru Üretici şablonları eklemek ister misiniz?
Detaylı veri anatomisi, 4 kademeli Sokratik ipucu metodolojisi, kod şablonları ve matematiksel denklik doğrulama testleri için kapsamlı rehberimizi inceleyin:

👉 [**Senaryo Geliştirme Rehberi (SCENARIO_GUIDE.md)**](./SCENARIO_GUIDE.md)

