import React, { useState } from 'react';
import { 
  Wand2, 
  X, 
  Sparkles, 
  Dice5, 
  ArrowRight, 
  ShieldCheck, 
  Building2 
} from 'lucide-react';
import type { GeneratorDifficulty } from '../types/generator';
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

export const ScenarioGeneratorModal: React.FC<ScenarioGeneratorModalProps> = ({
  isOpen,
  onClose,
  selectedMode,
}) => {
  const { startCustomScenario } = useAccountingStore();

  const [difficulty, setDifficulty] = useState<GeneratorDifficulty>('Kolay');
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
      transactionCount,
      companyName: companyName.trim() || undefined,
    });

    startCustomScenario(generated, selectedMode);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Başlık */}
        <div className="px-6 py-4.5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/60 dark:bg-zinc-900/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-white/10 text-black dark:text-zinc-100 flex items-center justify-center border border-zinc-200 dark:border-zinc-800">
              <Wand2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg text-zinc-900 dark:text-white flex items-center gap-2">
                Rastgele Görev / Senaryo Üretici
                <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-300">
                  Algoritmik
                </span>
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Sanal finansal durum makinesiyle hatasız ve pedagojik görev türetin
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Alanı */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Zorluk Seviyesi Seçimi */}
          <div className="space-y-2.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 flex items-center justify-between">
              <span>Zorluk Seviyesi</span>
              <span className="text-[11px] font-normal text-zinc-500 dark:text-zinc-500">
                {difficulty === 'Kolay' && 'Temel hesaplar (Kasa, Banka, Mal, Gider)'}
                {difficulty === 'Orta' && 'Veresiye alış-satış, Alıcılar & Satıcılar'}
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
                      // Kolay seçilirse varsayılan 5 işlem, ileri seçilirse 8 işlem yapalım
                      if (level === 'Kolay' && transactionCount > 6) setTransactionCount(5);
                      if (level === 'İleri' && transactionCount < 6) setTransactionCount(8);
                    }}
                    className={`py-3 px-3 rounded-xl border text-center transition-all cursor-pointer font-medium text-xs sm:text-sm flex flex-col items-center gap-1.5 ${
                      isSelected
                        ? 'border-black dark:border-white bg-zinc-100 dark:bg-white/10 text-black dark:text-white font-bold shadow-xs'
                        : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-white dark:bg-zinc-900/60 text-zinc-700 dark:text-zinc-300'
                    }`}
                  >
                    <span>{level}</span>
                    <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-normal">
                      {level === 'Kolay' ? '1. Hafta Temel' : level === 'Orta' ? 'Borç / Alacak' : 'İleri Düzey'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* İşlem Sayısı Seçimi */}
          <div className="space-y-2.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 flex items-center justify-between">
              <span>İşlem Sayısı</span>
              <span className="text-[11px] font-normal text-zinc-500 dark:text-zinc-500">
                {transactionCount} Ticari İşlem
              </span>
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[4, 6, 8, 10].map((cnt) => {
                const isSelected = transactionCount === cnt;
                return (
                  <button
                    key={cnt}
                    type="button"
                    onClick={() => setTransactionCount(cnt)}
                    className={`py-2 px-3 rounded-lg border text-center transition-all cursor-pointer text-xs font-semibold ${
                      isSelected
                        ? 'border-black dark:border-white bg-zinc-100 dark:bg-white/10 text-black dark:text-white font-bold'
                        : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-white dark:bg-zinc-900/40 text-zinc-700 dark:text-zinc-400'
                    }`}
                  >
                    {cnt} İşlem
                  </button>
                );
              })}
            </div>
          </div>

          {/* Şirket Adı Belirleme & Karıştırma */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
              İşletme Unvanı
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Building2 className="w-4 h-4 absolute left-3 top-3 text-zinc-400 dark:text-zinc-500" />
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="İşletme adını yazın veya zar atın..."
                  className="w-full pl-9 pr-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs sm:text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition-colors"
                />
              </div>
              <button
                type="button"
                onClick={handleRandomizeName}
                title="Rastgele Unvan Seç"
                className="px-3 py-2 bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-700 dark:text-zinc-300 transition-colors flex items-center gap-1.5 text-xs font-medium cursor-pointer"
              >
                <Dice5 className="w-4 h-4 text-zinc-700 dark:text-zinc-400" />
                <span className="hidden sm:inline">Zar At</span>
              </button>
            </div>
          </div>

          {/* Simülasyon Kural Garantisi & Detay Kartı */}
          <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-zinc-800 dark:text-zinc-200">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Algoritmik Doğruluk & Pedagojik Güvence</span>
            </div>
            <ul className="text-[11px] text-zinc-600 dark:text-zinc-400 space-y-1.5 list-disc list-inside">
              <li>
                <strong className="text-zinc-800 dark:text-zinc-300">Sanal Kasa/Banka Kontrolü:</strong> Kasa asla eksiye düşmez (ters bakiye vermez).
              </li>
              <li>
                <strong className="text-zinc-800 dark:text-zinc-300">Nedensel İşlem Sırası:</strong> Borç oluşmadan ödeme, alacak oluşmadan tahsilat üretilmez.
              </li>
              <li>
                <strong className="text-zinc-800 dark:text-zinc-300">Bilanço ve Mizan Uyumu:</strong> Çift taraflı kayıt ve denge matematiksel olarak tam korunur.
              </li>
              <li>
                <strong className="text-zinc-800 dark:text-zinc-300">4 Kademeli İpuçları:</strong> Her işlem için pedagojik ipucu adımları dinamik oluşturulur.
              </li>
            </ul>
          </div>
        </div>

        {/* Alt Eylem Barı */}
        <div className="px-6 py-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/80 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs sm:text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer"
          >
            Vazgeç
          </button>

          <button
            type="button"
            onClick={handleGenerateAndStart}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-white dark:text-black bg-black hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 transition-colors shadow-sm cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Senaryoyu Türet ve Başla</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
