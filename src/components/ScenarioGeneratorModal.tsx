import React, { useState } from 'react';
import {
  Wand2,
  X,
  Sparkles,
  Dice5,
  ArrowRight,
  ShieldCheck,
  Building2,
} from 'lucide-react';
import type { GeneratorDifficulty, GeneratorFocusArea } from '../types/generator';
import { generateScenario } from '../core/scenarioGenerator';
import { useAccountingStore, type AppMode } from '../store/useAccountingStore';

interface ScenarioGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedMode: AppMode;
}

const SAMPLE_NAMES = [
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
];

const FOCUS_OPTIONS: {
  id: GeneratorFocusArea;
  title: string;
  subtitle: string;
}[] = [
  {
    id: 'genel',
    title: 'Genel Karma (Tüm Müfredat)',
    subtitle: 'Kasa, Banka, Çek, KDV, Bordro ve Kapanış bir arada',
  },
  {
    id: 'cek_senet',
    title: 'Çek & Ciro Odaklı (101 / 103)',
    subtitle: 'Alınan Çekler (101), Verilen Çekler (103 -) ve Çek Cirosu',
  },
  {
    id: 'kdv_islemleri',
    title: 'KDV Hesaplamaları (191 / 391)',
    subtitle: '%20 KDV’li alış-satış, kredi kartı (108) ve KDV mahsubu',
  },
  {
    id: 'mal_ve_maliyet',
    title: 'Alış-Satış & STMM Maliyeti (621)',
    subtitle: 'Ticari mal alışı, kredili satış, iskonto (611) ve maliyet kaydı',
  },
  {
    id: 'faiz_kredi',
    title: 'Banka Kredisi & Faiz (300 / 780)',
    subtitle: 'Kısa vadeli kredi çekilmesi, faiz tahakkuku ve anapara taksiti',
  },
  {
    id: 'doviz',
    title: 'Dövizli İşlemler & Kambiyo (646 / 656)',
    subtitle: 'Döviz kasası, kur artışı kârı ve döviz borç ödeme kur zararı',
  },
  {
    id: 'supheli_alacak',
    title: 'Şüpheli Alacak & Karşılık (128 / 129 / 654)',
    subtitle: 'İcraya verilen alacaklar, karşılık ayırma ve tahsilat/iptal',
  },
  {
    id: 'bordro',
    title: 'Personel Bordrosu & SGK (335 / 361)',
    subtitle: 'Brüt ücret, vergi/SGK kesintileri, avans mahsubu ve net maaş',
  },
  {
    id: 'varlik_satisi',
    title: 'Duran Varlık Satışı & Kâr/Zarar (679 / 689)',
    subtitle: 'Taşıt/demirbaş satışı, 257 birikmiş amortisman itlafı ve kâr/zarar',
  },
  {
    id: 'donem_sonu',
    title: 'Dönem Sonu 690 Kapanış & Kâr Devri',
    subtitle: 'Tüm gelir ve giderlerin 690 hesabına devri ve net kâr (590) aktarımı',
  },
];

export const ScenarioGeneratorModal: React.FC<ScenarioGeneratorModalProps> = ({
  isOpen,
  onClose,
  selectedMode,
}) => {
  const { startCustomScenario } = useAccountingStore();

  const [difficulty, setDifficulty] = useState<GeneratorDifficulty>('Orta');
  const [focusArea, setFocusArea] = useState<GeneratorFocusArea>('cek_senet');
  const [transactionCount, setTransactionCount] = useState<number>(6);
  const [companyName, setCompanyName] = useState<string>(SAMPLE_NAMES[0]);

  if (!isOpen) return null;

  const handleRandomizeName = () => {
    const remaining = SAMPLE_NAMES.filter((n) => n !== companyName);
    const chosen = remaining[Math.floor(Math.random() * remaining.length)];
    setCompanyName(chosen);
  };

  const handleGenerateAndStart = () => {
    const generated = generateScenario({
      difficulty,
      focusArea,
      transactionCount,
      companyName: companyName.trim() || undefined,
    });

    startCustomScenario(generated, selectedMode);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-xl bg-surface dark:bg-zinc-950 border border-border-subtle dark:border-zinc-800 rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Başlık */}
        <div className="px-6 py-4.5 border-b border-border-subtle dark:border-zinc-800 flex items-center justify-between bg-surface-muted/50 dark:bg-zinc-900/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent-surface dark:bg-[#3A1D16] text-primary dark:text-[#FFB4A4] flex items-center justify-center border border-primary/20">
              <Wand2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-hero-display font-bold text-base sm:text-lg text-text-primary dark:text-white flex items-center gap-2">
                Özel Çalışma Sorusu Üretici
                <span className="text-[10px] uppercase font-ledger-readout font-bold px-2 py-0.5 rounded-full bg-secondary-fixed/50 dark:bg-[#113828] text-secondary dark:text-secondary-fixed">
                  Yeni Rakamlar
                </span>
              </h3>
              <p className="text-xs text-text-secondary dark:text-zinc-400">
                Çalışmak istediğin ders konusunu ve soru sayısını seç, yeni bir soru seti oluştur.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-text-muted hover:text-text-primary dark:hover:text-white hover:bg-surface-muted dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Alanı */}
        <div className="p-6 space-y-5 overflow-y-auto">
          {/* Ders Konusu / Odak Alanı Seçimi */}
          <div className="space-y-2.5">
            <label className="text-xs font-ledger-readout font-bold uppercase tracking-wider text-text-secondary dark:text-zinc-400">
              1. Çalışmak İstediğin Ders Konusu
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {FOCUS_OPTIONS.map((opt) => {
                const isSelected = focusArea === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setFocusArea(opt.id)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col gap-1 ${
                      isSelected
                        ? 'border-2 border-primary-container bg-accent-surface/50 dark:bg-[#3A1D16]/60 text-text-primary dark:text-white shadow-xs'
                        : 'border-border-subtle dark:border-zinc-800 hover:border-text-secondary bg-surface dark:bg-zinc-900/60 text-text-secondary dark:text-zinc-300'
                    }`}
                  >
                    <span className="font-ledger-readout font-bold text-xs sm:text-[0.8125rem] text-text-primary dark:text-zinc-100">
                      {opt.title}
                    </span>
                    <span className="text-[11px] text-text-muted dark:text-zinc-400 leading-snug">
                      {opt.subtitle}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Zorluk Seviyesi Seçimi */}
          <div className="space-y-2.5">
            <label className="text-xs font-ledger-readout font-bold uppercase tracking-wider text-text-secondary dark:text-zinc-400 flex items-center justify-between">
              <span>2. Zorluk Seviyesi</span>
              <span className="text-[11px] font-normal text-text-muted">
                {difficulty === 'Kolay' && 'Temel Kasa, Banka ve Çek (101/103)'}
                {difficulty === 'Orta' && 'Çek Cirosu, %20 KDV ve Veresiye İşlemler'}
                {difficulty === 'İleri' && 'Senetler, Demirbaşlar ve Birleşik Kayıtlar'}
              </span>
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {(['Kolay', 'Orta', 'İleri'] as const).map((level) => {
                const isSelected = difficulty === level;
                return (
                  <button
                    key={level}
                    type="button"
                    onClick={() => {
                      setDifficulty(level);
                      if (level === 'Kolay' && transactionCount > 6) setTransactionCount(5);
                      if (level === 'İleri' && transactionCount < 6) setTransactionCount(8);
                    }}
                    className={`py-2.5 px-3 rounded-xl border text-center transition-all cursor-pointer font-ledger-readout font-medium text-xs sm:text-sm flex flex-col items-center gap-1 ${
                      isSelected
                        ? 'border-2 border-primary-container bg-accent-surface/50 dark:bg-[#3A1D16]/60 text-primary dark:text-[#FFB4A4] font-bold shadow-xs'
                        : 'border-border-subtle dark:border-zinc-800 hover:border-text-secondary bg-surface dark:bg-zinc-900/60 text-text-secondary dark:text-zinc-300'
                    }`}
                  >
                    <span>{level}</span>
                    <span className="text-[10px] text-text-muted dark:text-zinc-400 font-normal">
                      {level === 'Kolay' ? 'Temel Düzey' : level === 'Orta' ? 'Vize Düzeyi' : 'Final Düzeyi'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* İşlem Sayısı Seçimi */}
          <div className="space-y-2.5">
            <label className="text-xs font-ledger-readout font-bold uppercase tracking-wider text-text-secondary dark:text-zinc-400 flex items-center justify-between">
              <span>3. Soru (Yevmiye Maddesi) Sayısı</span>
              <span className="text-[11px] font-normal text-text-muted tabular-nums">
                {transactionCount} İşlem
              </span>
            </label>
            <div className="grid grid-cols-4 gap-2 tabular-nums">
              {[4, 6, 8, 10].map((cnt) => {
                const isSelected = transactionCount === cnt;
                return (
                  <button
                    key={cnt}
                    type="button"
                    onClick={() => setTransactionCount(cnt)}
                    className={`py-2 px-3 rounded-xl border text-center transition-all cursor-pointer text-xs font-ledger-readout font-semibold ${
                      isSelected
                        ? 'border-2 border-primary-container bg-accent-surface/50 dark:bg-[#3A1D16]/60 text-primary dark:text-[#FFB4A4] font-bold'
                        : 'border-border-subtle dark:border-zinc-800 hover:border-text-secondary bg-surface dark:bg-zinc-900/40 text-text-secondary dark:text-zinc-400'
                    }`}
                  >
                    {cnt} Soru
                  </button>
                );
              })}
            </div>
          </div>

          {/* Şirket Adı Belirleme & Karıştırma */}
          <div className="space-y-2">
            <label className="text-xs font-ledger-readout font-bold uppercase tracking-wider text-text-secondary dark:text-zinc-400">
              4. Örnek İşletme Adı
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Building2 className="w-4 h-4 absolute left-3 top-3 text-text-muted" />
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="İşletme adını yazın veya rastgele seçin..."
                  className="w-full pl-9 pr-3 py-2 bg-surface dark:bg-zinc-900 border border-border-subtle dark:border-zinc-800 rounded-xl text-xs sm:text-sm text-text-primary dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-container transition-colors"
                />
              </div>
              <button
                type="button"
                onClick={handleRandomizeName}
                title="Rastgele İsim Seç"
                className="px-3.5 py-2 bg-surface-muted dark:bg-zinc-900 hover:bg-border-subtle/50 dark:hover:bg-zinc-800 border border-border-subtle dark:border-zinc-800 rounded-xl text-text-secondary dark:text-zinc-300 transition-colors flex items-center gap-1.5 text-xs font-ledger-readout font-semibold cursor-pointer"
              >
                <Dice5 className="w-4 h-4" />
                <span className="hidden sm:inline">Değiştir</span>
              </button>
            </div>
          </div>

          {/* Bilgi Kartı */}
          <div className="p-4 rounded-2xl bg-surface-muted/60 dark:bg-zinc-900/60 border border-border-subtle dark:border-zinc-800 space-y-2">
            <div className="flex items-center gap-2 text-xs font-ledger-readout font-bold text-text-primary dark:text-zinc-200">
              <ShieldCheck className="w-4 h-4 text-semantic-balance" />
              <span>Öğrenci Dostu Soru Motoru</span>
            </div>
            <ul className="text-[11px] text-text-secondary dark:text-zinc-400 space-y-1 list-disc list-inside">
              <li>
                Kasa veya stokta olmayan paranın/malın çıkışı sorulmaz; tüm rakamlar birbiriyle tutarlıdır.
              </li>
              <li>
                Her soruda 4 adımlı ipucu, T-Cetveli &ldquo;Kendin Doldur&rdquo; ve Bilanço eşitleme pratiği yer alır.
              </li>
            </ul>
          </div>
        </div>

        {/* Alt Eylem Barı */}
        <div className="px-6 py-4 border-t border-border-subtle dark:border-zinc-800 bg-surface-muted/40 dark:bg-zinc-900/80 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs sm:text-sm font-ledger-readout font-semibold text-text-secondary dark:text-zinc-400 hover:text-text-primary dark:hover:text-white transition-colors cursor-pointer"
          >
            Vazgeç
          </button>

          <button
            type="button"
            onClick={handleGenerateAndStart}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-ledger-readout font-semibold text-xs sm:text-sm text-on-primary-container bg-primary-container hover:bg-primary transition-colors shadow-sm cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Soruları Oluştur ve Başla</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
