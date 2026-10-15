import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, ArrowRight, CheckCircle2 } from 'lucide-react';

interface AccountClass {
  classId: string;
  className: string;
  nature: 'AKTİF' | 'PASİF' | 'GELİR/GİDER';
  normalBalance: 'BORÇ' | 'ALACAK' | 'DÖNEM SONU SIFIRLANIR';
  desc: string;
  sampleAccounts: { code: string; name: string }[];
}

const ACCOUNT_CLASSES: AccountClass[] = [
  {
    classId: '1',
    className: '1. DÖNEN VARLIKLAR',
    nature: 'AKTİF',
    normalBalance: 'BORÇ',
    desc: 'Bir yıl içinde paraya çevrilmesi veya tüketilmesi öngörülen nakit, banka, alacak ve stok varlıkları.',
    sampleAccounts: [
      { code: '100', name: 'Kasa' },
      { code: '102', name: 'Bankalar' },
      { code: '120', name: 'Alıcılar' },
      { code: '153', name: 'Ticari Mallar' },
      { code: '191', name: 'İndirilecek KDV' },
    ],
  },
  {
    classId: '2',
    className: '2. DURAN VARLIKLAR',
    nature: 'AKTİF',
    normalBalance: 'BORÇ',
    desc: 'Bir yıldan daha uzun süre işletme faaliyetlerinde kullanılmak üzere edinilen makine, bina, taşıt ve demirbaşlar.',
    sampleAccounts: [
      { code: '252', name: 'Binalar' },
      { code: '254', name: 'Taşıtlar' },
      { code: '255', name: 'Demirbaşlar' },
      { code: '257', name: 'Birikmiş Amortismanlar (-)' },
    ],
  },
  {
    classId: '3',
    className: '3. KISA VADELİ YABANCI KAYNAKLAR',
    nature: 'PASİF',
    normalBalance: 'ALACAK',
    desc: 'En çok bir yıl içinde ödenmesi gereken ticari borçlar, kısa vadeli krediler ve vergi borçları.',
    sampleAccounts: [
      { code: '300', name: 'Banka Kredileri' },
      { code: '320', name: 'Satıcılar' },
      { code: '360', name: 'Ödenecek Vergi ve Fonlar' },
      { code: '391', name: 'Hesaplanan KDV' },
    ],
  },
  {
    classId: '4',
    className: '4. UZUN VADELİ YABANCI KAYNAKLAR',
    nature: 'PASİF',
    normalBalance: 'ALACAK',
    desc: 'Geri ödeme süresi bir yılı aşan uzun vadeli banka kredileri ve senetli/senetsiz borçlar.',
    sampleAccounts: [
      { code: '400', name: 'Banka Kredileri (Uzun Vadeli)' },
      { code: '420', name: 'Satıcılar (Uzun Vadeli)' },
    ],
  },
  {
    classId: '5',
    className: '5. ÖZ KAYNAKLAR',
    nature: 'PASİF',
    normalBalance: 'ALACAK',
    desc: 'İşletme sahiplerinin veya ortaklarının işletmeye tahsis ettiği sermaye, yedekler ve geçmiş yıllar kârları.',
    sampleAccounts: [
      { code: '500', name: 'Sermaye' },
      { code: '590', name: 'Dönem Net Kârı' },
      { code: '591', name: 'Dönem Net Zararı (-)' },
    ],
  },
  {
    classId: '6',
    className: '6. GELİR TABLOSU HESAPLARI',
    nature: 'GELİR/GİDER',
    normalBalance: 'DÖNEM SONU SIFIRLANIR',
    desc: 'Dönem içinde elde edilen hasılat ve katlanılan giderler. Dönem sonunda 690 numaralı hesaba devredilerek kapatılır.',
    sampleAccounts: [
      { code: '600', name: 'Yurt İçi Satışlar (+)' },
      { code: '621', name: 'Satılan Ticari Mallar Maliyeti (-)' },
      { code: '770', name: 'Genel Yönetim Giderleri (-)' },
    ],
  },
];

interface InteractiveTdhbExplorerProps {
  onOpenAccountsGuide: () => void;
}

export const InteractiveTdhbExplorer: React.FC<InteractiveTdhbExplorerProps> = ({
  onOpenAccountsGuide,
}) => {
  const [selectedClassIndex, setSelectedClassIndex] = useState(0);
  const activeClass = ACCOUNT_CLASSES[selectedClassIndex];

  return (
    <section id="tdhp-explorer" className="py-16 md:py-24 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        
        {/* Başlık */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-zinc-200 dark:border-zinc-800">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-zinc-800 dark:text-zinc-200">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Tekdüzen Hesap Planı (TDHP) Mimarisi</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-zinc-950 dark:text-white tracking-tight">
              Muhasebenin Alfabesi: 6 Ana Hesap Sınıfı
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Türkiye Muhasebe Standartları ile uyumlu hesap kodlarının mantığını ve bakiye verme kurallarını keşfedin.
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenAccountsGuide}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-xs font-bold text-zinc-900 dark:text-white border border-zinc-300 dark:border-zinc-700 transition-colors cursor-pointer shrink-0"
          >
            <span>Tüm Hesap Planını Aç</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 6 Hesap Sınıfı Seçim Sekmeleri */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {ACCOUNT_CLASSES.map((cls, idx) => {
            const isSelected = idx === selectedClassIndex;
            return (
              <button
                key={cls.classId}
                type="button"
                onClick={() => setSelectedClassIndex(idx)}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'border-black dark:border-white bg-black text-white dark:bg-white dark:text-black shadow-sm'
                    : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/40 text-zinc-700 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700'
                }`}
              >
                <span className="block font-mono text-xs font-black opacity-80">
                  SINIF {cls.classId}
                </span>
                <span className="block text-xs font-bold truncate mt-0.5">
                  {cls.className.replace(`${cls.classId}. `, '')}
                </span>
              </button>
            );
          })}
        </div>

        {/* Seçili Sınıf Detay Kartı */}
        <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-950/70 p-6 sm:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeClass.classId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-zinc-950 dark:text-white">
                    {activeClass.className}
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                    {activeClass.desc}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="px-3 py-1.5 rounded-xl bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 text-xs font-mono font-bold">
                    <span className="text-zinc-400 mr-1.5">Karakter:</span>
                    <span className="text-zinc-900 dark:text-white">{activeClass.nature}</span>
                  </div>
                  <div className="px-3 py-1.5 rounded-xl bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 text-xs font-mono font-bold">
                    <span className="text-zinc-400 mr-1.5">Normal Bakiye:</span>
                    <span className="text-emerald-700 dark:text-emerald-400">{activeClass.normalBalance}</span>
                  </div>
                </div>
              </div>

              {/* Örnek Hesaplar Listesi */}
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 block mb-3">
                  Sık Kullanılan Temel Hesaplar:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                  {activeClass.sampleAccounts.map((acc) => (
                    <div
                      key={acc.code}
                      className="p-3 rounded-2xl bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 flex items-center justify-between"
                    >
                      <div>
                        <span className="font-mono text-xs font-black text-black dark:text-white block">
                          {acc.code}
                        </span>
                        <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                          {acc.name}
                        </span>
                      </div>
                      <CheckCircle2 className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
};
