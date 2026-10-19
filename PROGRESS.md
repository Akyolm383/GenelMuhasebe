# PROGRESS.md — Genel Muhasebe Stüdyosu (Taste-First Geliştirme Belleği)

## 1. Seçilen Estetik Arketip & Tasarım Sistemi
- **Arketip:** *Warm Architectural Paper & Tactile Financial Atelier* (Kinfolk Editoryal × Stripe Clean Minimalist × Fiziki Muhasebe Defteri Kırtasiye Estetiği)
- **Kalibre Edilmiş Renk Paleti:**
  - **Zemin (`background`):** `#F5F3EE` (Sıcak mimari taş kağıdı + `24px` radyal nokta matrisi)
  - **Yüzey (`surface`):** `#FFFFFF` (Fildişi yevmiye fişi ve kart plakaları)
  - **İkincil Yüzey (`surface-muted`):** `#EAE7DF` (Gömülü taş zemin)
  - **Kontrast Mürekkep (`surface-contrast` / `text-primary`):** `#18181B` (Derin kömür mürekkebi — saf `#000000` yasak kuralına %100 uyumlu)
  - **Ana Vurgu / Borç Kutbu (`primary-container`):** `#C84B31` (Terracotta Vermilyon, <%80 satürasyon)
  - **Denge / Alacak Kutbu (`semantic-balance`):** `#1F6E50` (Orman Yeşili / Forest Jade)
  - **Karanlık Mod (`dark`):** `#121211` / `#1C1B19` (Sıcak obsidyen kömür zemin)
- **Katı Tipografi:**
  - **Display & Başlıklar:** `Outfit` (`weight: 600–800`, `-0.03em` tracking)
  - **Gövde Metni:** `Plus Jakarta Sans` (`weight: 400–600`)
  - **Defter & Finansal Okuma:** `JetBrains Mono` (`tabular-nums` zorunlu)
  - *Not:* `Inter`, `Times New Roman` ve `Georgia` tamamen kaldırılmıştır.

---

## 2. Stitch MCP Proje ve Ekran Kimlikleri
- **Onaylanan Ana Stitch Projesi:** `3046252614754840278` ([https://stitch.withgoogle.com/projects/3046252614754840278](https://stitch.withgoogle.com/projects/3046252614754840278))
- **Tasarım Sistemi Varlık Kimliği (`Design System ID`):** `assets/7c1385367a984d338ec7f70f241f44dd`
- **Tamamlanan ve Doğrulanan Ekranlar (`Screen ID`):**
  1. **Karşılama & Eğitim Vitrini (`WelcomeScreen`):** `3e65f7ccfde74c54a79d7c4c090d2240` (`2560x6208`)
     - Yerel Arşiv: `.stitch/designs/atelier-home.html` ve `.stitch/designs/atelier-home.png`
  2. **Canlı Çift Taraflı Kayıt Çalışma Tezgahı (`WorkspaceScreen` & `JournalEntryForm`):** `64aad7cf844140ab99d2b237b2e26ecf` (`2560x3524`)
     - Yerel Arşiv: `.stitch/designs/atelier-simulation-workbench.html` ve `.stitch/designs/atelier-simulation-workbench.png`
  3. **Çalışma Sonu Değerlendirme & SMMM Denetim Raporu (`SummaryScreen`):** `0d713cdc364541e581ce993781c0e366` (`2560x4810`)
     - Yerel Arşiv: `.stitch/designs/atelier-finish-summary.html` ve `.stitch/designs/atelier-finish-summary.png`

---

## 3. Tamamlanan Sayfalar, Bileşenler ve Pedagojik Yükseltmeler
- **Nano Banana Özel Görsel Üretimi (`public/images/`):**
  - `public/images/atelier-balance-scale.png` — Sıcak taş kağıdı üzerinde pirinç/kömür çift taraflı denge terazisi, vermilyon mühür ve orman yeşili dolmakalem.
  - `public/images/atelier-dossier-stamp.png` — Vermilyon iple bağlanmış fildişi muhasebe vaka dosyaları ve yeşim denge taşı.
- **Faz 1 — Karşılama & Eğitim Vitrini (`WelcomeScreen` ve Alt Bileşenleri):**
  - `src/components/landing/LandingNavbar.tsx` — Yüzen kapsül (`rounded-full`) üst bar; DOM sırasıyla birebir örtüşen `01 • Yevmiye & T-Cetveli → 02 • 4 Adımda Muhasebe → 03 • Hesap Kodları Rehberi → 04 • Çalışma Soruları` navigasyonu.
  - `src/components/landing/LandingHero.tsx` — `6:6` asimetrik bölünmüş hero, öğrenci dostu **Borç (Sol) / Alacak (Sağ)** anlatımı ve canlı **Yevmiye & T-Cetveli Önizlemesi** (`01 • Kuruluş & Sermaye Kaydı`, `02 • Çek Vererek Mal Alışı (103 + KDV)`, `03 • Müşteri Çekiyle Satış (101 + 391)`).
  - `src/components/landing/AccountingPipelineSection.tsx` — `7:5` asimetrik Bento: 4 adımda muhasebe çözüm mantığı + *"Bu Hesap Neden Oraya Yazıldı?"* kutusu + **101 Alınan Çekler ile 103 Verilen Çekler (-)** sınav tuzağı uyarısı.
  - `src/components/landing/InteractiveTdhbExplorer.tsx` — 6 ana hesap grubu için öğrenci dostu **Hesap Kodları Rehberi (100 – 770)**.
  - `src/components/landing/ScenarioSelectionSection.tsx` — 3 kapsamlı üniversite Genel Muhasebe soru seti + konu odaklı **Özel Çalışma Sorusu Üretici** kartı.
- **Faz 2 & 3 — Simülasyon Çalışma Tezgahı, İnteraktif "Kendin Doldur" T-Cetveli/Bilanço ve Görev Sıfırlama:**
  - `src/store/useAccountingStore.ts` — Görev tamamlandığında (`finishScenarioAndShowSummary`) aktif senaryonun kayıtlarını `auditResult.submittedEntries` içine fotoğraflayıp `userEntries`, `hintLevels` ve manuel pratik verilerini otomatik sıfırlayan mimari; ayrıca sekmeler arası silinmeyen kalıcı `practiceLedgerData`, `practiceAssetItems` ve `practiceLiabilityItems` durumları.
  - `src/components/JournalEntryForm.tsx` — Sağ sütundaki T-Cetveli ve Bilanço kartlarında doğrudan **`Kendin Doldur`** geçiş butonları; son işlemde **`T-Cetvelini Kendin Doldur`** ve **`Bilançoyu Kendin Doldur`** kısayolları.
  - `src/components/LedgerView.tsx` & `src/components/BalanceSheetView.tsx` — Öğrencinin kendi eliyle T-Cetveli borç/alacak toplamlarını, bakiye yönünü ve Aktif/Pasif bilanço kalemlerini (düzenleyici `103 (-)` ve `257 (-)` hesapları dahil) doldurup kontrol edebildiği interaktif sınav provası modu.
  - `src/core/accounts.ts`, `src/core/accountingEngine.ts`, `src/core/validator.ts`, `src/data/scenarios.ts`, `src/core/scenarioGenerator.ts` — `101 Alınan Çekler`, `103 Verilen Çekler (-)`, çek cirosu, `%20 KDV (191/391)`, kredi kartı slipleri (`108`), `610 Satıştan İadeler (-)`, `621 STMM`, `257 Birikmiş Amortismanlar (-)` ve konu odaklı soru üretici (`Genel Karma`, `Çek & Ciro`, `KDV İşlemleri`, `Alış-Satış & Gider`).
- **Faz 4 — 8 Yeni Üniversite Senaryosu (Toplam 11 Hazır Vaka), Hesap Planı Genişletmesi ve Soru Üretici Güncellemesi:**
  - `src/core/accounts.ts` — 16 yeni standart Tekdüzen hesabı kural ve pedagojik açıklamalarıyla eklendi (`122`, `128`, `129`, `196`, `335`, `361`, `370`, `611`, `644`, `646`, `654`, `656`, `657`, `679`, `689`, `690`, `691`).
  - `src/core/accountingEngine.ts` — `deriveBalanceSheet` içinde `590`/`591` net kâr aktarımının kapanış hesaplarıyla mükemmel uyumlu çalışması sağlandı.
  - `src/data/scenarios.ts` — 8 yeni üniversite vize/final vaka senaryosu (2 Kolay, 3 Orta, 3 İleri) her işlem için 4 aşamalı Sokratik İpuçları ve öğretmen açıklamalarıyla eklendi. Toplam 11 senaryo (67 tam dengeli yevmiye maddesi):
    1. *ABC Ticaret İşletmesi* (Kolay, 8 İşlem) — Kuruluş, Kasa & Çek (101/103)
    2. *Trend E-Ticaret Ltd.* (Kolay, 4 İşlem) — POS, Kargo & İskonto (611)
    3. *Boğaziçi Yayıncılık* (Kolay, 4 İşlem) — Banka Kredisi (300) & Faiz (780)
    4. *Anadolu Ticaret A.Ş.* (Orta, 7 İşlem) — Çek Cirosu, POS & %20 KDV
    5. *Atlas Medikal A.Ş.* (Orta, 5 İşlem) — Döviz Alımı & Kur Kâr/Zararı (646/656)
    6. *Doğu Otomotiv* (Orta, 5 İşlem) — Senet Protestosu & Vade Farkı (121/642)
    7. *Ege Lojistik* (Orta, 5 İşlem) — Şüpheli Alacak & Karşılık (128/129/654)
    8. *Marmara Endüstri A.Ş.* (İleri, 6 İşlem) — Senet, STMM (621) & Amortisman
    9. *Nova Teknoloji A.Ş.* (İleri, 7 İşlem) — Personel Bordrosu & SGK (335/361)
    10. *Zirve İnşaat & Taahhüt* (İleri, 7 İşlem) — Duran Varlık Satışı & Kâr/Zarar (679/689)
    11. *Doruk Sanayi A.Ş.* (İleri, 8 İşlem) — Dönem Sonu 690 Devir & Net Kâr (590)
  - `src/types/generator.ts`, `src/core/scenarioGenerator.ts`, `src/components/ScenarioGeneratorModal.tsx` — Dinamik soru oluşturucuya 10 farklı müfredat alanı (Kredi/Faiz, Döviz, Şüpheli Alacak, Bordro, Varlık Satışı, 690 Kapanış vb.) ve algoritmik şablonlar entegre edildi.
  - `src/components/landing/ScenarioSelectionSection.tsx` — 11 senaryo için dinamik filtre sekmeleri (`Tüm Sorular (11)`, `Temel Seviye (3)`, `Orta (Vize) Seviye (4)`, `İleri (Final) Seviye (4)`) ve konuya özel rozetler eklendi.
- **Otomatik Tarayıcı Testi (`1440px` Masaüstü & `375px` Mobil):**
  - Tüm ekranlar (`WelcomeScreen`, `WorkspaceScreen`, `LedgerView Practice`, `BalanceSheetView Practice`, `SummaryScreen`) `1440px` ve `375px` çözünürlüklerde `hasOverflow: false` (`0` yatay taşma) ve `0` konsol/sayfa hatasıyla doğrulandı.

---

## 4. Sıradaki Adımlar (Next Steps)
1. **Yazdırılabilir (@media print) Çalışma Kağıdı & Çözüm Özeti:** Öğrencinin çözdüğü Yevmiye, T-Cetveli ve Bilanço tablolarını tek tıkla PDF/kağıt çalışma föyü olarak indirmesi.
2. **Kişiselleştirilmiş Sınav Modu:** Öğrencinin seçtiği süre kısıtı ve karışık rastgele soru paketleriyle gerçek üniversite vize/final sınav simülasyonu.
