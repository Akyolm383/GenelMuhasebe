# DESIGN.md — Genel Muhasebe Stüdyosu (Tactile Financial Atelier)

## 1. Aesthetic Archetype & Atmospheric Polarity
- **Archetype:** *Warm Architectural Paper & Tactile Financial Atelier* (Kinfolk Editorial × Stripe Clean Minimalist × Tactile Ledger Stationery).
- **Stitch Project ID:** `3046252614754840278` (`https://stitch.withgoogle.com/projects/3046252614754840278`)
- **Stitch Design System ID:** `assets/7c1385367a984d338ec7f70f241f44dd`
- **Approved Screen ID:** `3e65f7ccfde74c54a79d7c4c090d2240`
- **Core Philosophy:** Accounting is the art of double-entry equilibrium (`Borç = Alacak`) recorded on tactile archival vellum. Instead of cold generic corporate templates or harsh pure black (`#000000`), the interface uses warm stone ledger paper (`#F5F3EE`), crisp ivory voucher cards (`#FFFFFF`), deep charcoal ink (`#18181B`), calibrated Terracotta Vermilion (`#C84B31`, saturation < 80%) for primary focal stamps/debit highlights, and Deep Forest Jade (`#1F6E50`) for credit/equilibrium verification.

---

## 2. Calibrated Color Tokens
> **Strict Rule:** Pure black (`#000000`) and cheap neon purple-blue gradients are strictly prohibited. Dark mode uses warm obsidian charcoal (`#121211` / `#18181B`).

| Semantic Token | Hex / Value | Purpose |
| :--- | :--- | :--- |
| `--bg-paper` / `background` | `#F5F3EE` | Warm architectural stone paper canvas with subtle `24px` radial dot matrix |
| `--bg-surface` / `surface` | `#FFFFFF` | Crisp ivory ledger voucher & card surface |
| `--bg-surface-muted` / `surface-muted` | `#EAE7DF` | Secondary stone well, recessed input background & pill track |
| `--bg-surface-contrast` / `surface-contrast` | `#18181B` | Deep charcoal ink badge, active index tab & floating balance bar |
| `--text-primary` | `#18181B` | Primary editorial & numerical ink (Zinc-900, never `#000000`) |
| `--text-secondary` | `#57534E` | Secondary warm stone prose & ledger descriptions |
| `--text-muted` | `#8C877E` | Muted metadata, VUK article references & column labels |
| `--accent-primary` / `primary-container` | `#C84B31` | Calibrated Terracotta Vermilion (<80% saturation) — Primary CTA, Debit focal stamp |
| `--accent-primary-deep` / `primary` | `#A6331B` | Pressed/hover terracotta ink state |
| `--accent-surface` | `#FBECE8` | Soft terracotta wash for active badges & focused dossier tiles |
| `--semantic-balance` / `secondary` | `#1F6E50` | Deep Forest Jade — Credit balance & `BORÇ = ALACAK` equilibrium verification |
| `--secondary-fixed` | `#A6F3CD` | Soft jade mint highlight for equilibrium pills |
| `--semantic-warning` | `#B93829` | VUK Md. 134 Reverse-Balance Shield alert tone |
| `--border-subtle` | `#E2DFD7` | `1px` archival ledger hairline border |

---

## 3. Strict Typography Rules
> **Strict Rule:** `Inter`, `Times New Roman`, and `Georgia` are strictly prohibited. All monetary amounts, account codes, and metrics enforce `font-variant-numeric: tabular-nums`.

- **Display & Architectural Headings (`--font-display`):** `'Outfit'`, sans-serif (`weight: 600–800`, `tracking: -0.03em`, `line-height: 1.06`).
- **Editorial Body Copy (`--font-sans`):** `'Plus Jakarta Sans'`, sans-serif (`weight: 400–600`, `line-height: 1.65`).
- **Ledger Readout & TDHP Codes (`--font-mono`):** `'JetBrains Mono'`, monospace (`weight: 500–700`, `tabular-nums`).

---

## 4. Layout Architecture & Spatial Hierarchy
1. **Floating Capsule Topbar:** Centered `max-w-7xl` rounded-full (`rounded-full`) glassmorphic paper bar (`bg-white/90 backdrop-blur-md border border-[#E2DFD7]`) with `GM / ATÖLYE` charcoal badge, section links (`TDHP Hesap Planı`, `Yevmiye & Defterikebir`, `Mizan & Bilanço`, `Vaka Dosyaları`), live `Mod: Öğrenme / Sınav` indicator, and `Simülatörü Başlat` terracotta CTA.
2. **Section 01 — Asymmetric Split Hero & Tactile Financial Voucher Stage (`6:6` Grid):**
   - **Left Column:** Eyebrow badge, monumental `Outfit` headline with inline capsule pills (`FATURA #084`, `BORÇ = ALACAK`), interactive scenario quick-selector pills (`01 • Kuruluş & Sermaye`, `02 • Kredili Mal Alışı (+KDV)`, `03 • Satış & Tahsilat Döngüsü`), primary CTA, and 3-column architectural metric band (`100 / 999 TDHP Hesap Kodu`, `0,00 ₺ Mizan Sapma Toleransı`, `VUK 229 Mevzuat Uyum Sertifikası`).
   - **Right Column:** Interactive **Çift Taraflı Kayıt Çalışma Masası** housing:
     - Stamped Official e-Invoice Voucher (`RESMİ BELGE ONAYLI` circular seal) that dynamically updates when the user switches scenarios or transactions.
     - Tactile Journal Entry Voucher (`YEVMİYE Madde No`) with indented `320 SATICILAR` credit line.
     - Dual Micro T-Accounts (`Defter-i Kebir T-Cetvelleri`) and a charcoal bottom balance confirmation bar (`TOPLAM BORÇ = TOPLAM ALACAK • DENK MADDE ONAYLANDI`).
3. **Section 02 — Asymmetric Bento Choreography (`7:5` Split + `12-Col` Binder Index Atlas):**
   - **Top Left (7 Cols):** `Operasyonel İcra Zinciri` — 4 sequential VUK-referenced step blocks (`1. Ticari Belge VUK m. 229`, `2. Yevmiye Kaydı VUK m. 216`, `3. Büyük Defter VUK m. 217`, `4. Mizan & Bilanço VUK m. 227`).
   - **Top Right (5 Cols):** `Sokratik Akıl Yürütme Motoru` interactive Q&A reasoning steps + `VUK MADDE 134 — TERS BAKİYE KALKANI DEVREDE` protective warning card.
   - **Bottom Row (12 Cols):** `TDHP 6 Ana Hesap Sınıfı Görsel Atlası` with interactive architectural binder tabs (`1. Dönen Varlıklar` through `6. Gelir Tablosu Hesapları`), mechanical polarity rule banner (`BORÇ (+)` / `ALACAK (-)`), and 5 interactive account dossier tiles per class + full search drawer trigger.
4. **Section 03 — Tactile Company Dossier Cards & Command Dock:**
   - 4 physical folder dossier cards (`DOSYA #01` through `DOSYA #03` mapped to scenarios + `JENERATÖR Parametrik Vaka Simülatörü` dashed card) with difficulty badges, entry counts, and selection ring.
   - Bottom **Tactile Command Dock** with `Öğrenme Modu (İpuçları Aktif)` / `Sınav / SMMM Modu` pill switcher and `Seçili Dosyayı Aç` charcoal launch button.
5. **Unified Atelier Workspace & Audit Summary (`WorkspaceScreen` & `SummaryScreen`):**
   - Carries the exact same `#F5F3EE` stone paper dot-matrix texture, `#FFFFFF` ivory ledger sheets, `#C84B31` terracotta debit accents, `#1F6E50` forest jade credit/balance badges, and `JetBrains Mono` tabular numerals into the live Journal Entry editor, T-Accounts (`LedgerView`), Trial Balance (`TrialBalanceView`), Balance Sheet (`BalanceSheetView`), and Audit Report (`SummaryScreen`).
