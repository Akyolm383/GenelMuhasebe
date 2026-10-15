import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight, Wand2, Scale, CheckCircle2 } from 'lucide-react';
import { formatCurrency } from '../../core/accountingEngine';

interface LandingHeroProps {
  onScrollToScenarios: () => void;
  onOpenGenerator: () => void;
}

interface SandboxTransaction {
  id: string;
  title: string;
  badge: string;
  desc: string;
  debit: { code: string; name: string; amount: number };
  credit: { code: string; name: string; amount: number };
  secondDebit?: { code: string; name: string; amount: number };
  secondCredit?: { code: string; name: string; amount: number };
}

const DEMO_TRANSACTIONS: SandboxTransaction[] = [
  {
    id: 'tx-1',
    title: 'Nakit Sermaye İle Kuruluş',
    badge: 'Kuruluş',
    desc: 'İşletme 100.000 TL nakit sermaye ile faaliyete başlar.',
    debit: { code: '100', name: 'Kasa', amount: 100000 },
    credit: { code: '500', name: 'Sermaye', amount: 100000 },
  },
  {
    id: 'tx-2',
    title: 'Ticari Mal Alışı (+KDV)',
    badge: 'Mal Hareketi',
    desc: '20.000 TL mal peşin alınmış, 4.000 TL KDV nakit ödenmiştir.',
    debit: { code: '153', name: 'Ticari Mallar', amount: 20000 },
    secondDebit: { code: '191', name: 'İndirilecek KDV', amount: 4000 },
    credit: { code: '100', name: 'Kasa', amount: 24000 },
  },
  {
    id: 'tx-3',
    title: 'Veresiye Mal Satışı',
    badge: 'Satış',
    desc: '40.000 TL tutarındaki mal müşteriye veresiye olarak satılmıştır.',
    debit: { code: '120', name: 'Alıcılar', amount: 40000 },
    credit: { code: '600', name: 'Yurt İçi Satışlar', amount: 40000 },
  },
];

export const LandingHero: React.FC<LandingHeroProps> = ({
  onScrollToScenarios,
  onOpenGenerator,
}) => {
  const [activeDemoIndex, setActiveDemoIndex] = useState(0);
  const activeTx = DEMO_TRANSACTIONS[activeDemoIndex];

  const totalDebit = (activeTx.debit.amount || 0) + (activeTx.secondDebit?.amount || 0);
  const totalCredit = (activeTx.credit.amount || 0) + (activeTx.secondCredit?.amount || 0);
  const isBalanced = totalDebit === totalCredit;

  return (
    <section className="relative overflow-hidden pt-8 pb-16 md:pt-14 md:pb-24">
      {/* Hafif Arka Plan Deseni */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(#e4e4e7_1px,transparent_1px)] dark:bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:24px_24px] opacity-60 dark:opacity-40" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Sol Kolon: Başlık ve Değer Önerisi */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-zinc-800 dark:text-zinc-200 shadow-2xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-zinc-800 dark:text-zinc-200" />
              <span>Türkiye&apos;nin İlk İnteraktif Muhasebe Simülatörü</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-zinc-950 dark:text-white leading-[1.12]"
            >
              Ezberleme. <br />
              <span className="text-zinc-400 dark:text-zinc-500 font-bold">Kaydet, Gör,</span>{' '}
              <span className="underline decoration-zinc-300 dark:decoration-zinc-700 decoration-4 underline-offset-8">
                Anla.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-sm sm:text-base lg:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-xl mx-auto lg:mx-0"
            >
              Çift taraflı kayıt sistemini soyut formüllerden kurtardık. Yevmiye maddesini girin; tutarların T-hesaplarına akışını, mizanın dengelenişini ve T-bilançosunun anlık oluşumunu canlı izleyin.
            </motion.p>

            {/* Aksiyon Butonları */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2"
            >
              <button
                type="button"
                onClick={onScrollToScenarios}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-black hover:bg-zinc-800 text-white dark:bg-white dark:text-black dark:hover:bg-zinc-200 font-bold text-sm shadow-md transition-all hover:scale-[1.02] cursor-pointer"
              >
                <span>Senaryo Seç & Başla</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onOpenGenerator}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-semibold text-sm border border-zinc-200 dark:border-zinc-800 transition-all cursor-pointer"
              >
                <Wand2 className="w-4 h-4" />
                <span>Rastgele Görev Türet</span>
              </button>
            </motion.div>

            {/* Güven ve Özellik Rozetleri */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="pt-4 border-t border-zinc-200 dark:border-zinc-800 flex flex-wrap items-center justify-center lg:justify-start gap-y-2 gap-x-5 text-xs text-zinc-500 dark:text-zinc-400 font-medium"
            >
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Tekdüzen Hesap Planı (TDHP)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Anlık Terazi & Bakiye Denetimi</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>4 Kademeli Sokratik İpuçları</span>
              </div>
            </motion.div>
          </div>

          {/* Sağ Kolon: Canlı İnteraktif Simülatör Sandbox Widget'ı */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-6 w-full"
          >
            <div className="relative rounded-3xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-5 sm:p-6 shadow-xl dark:shadow-none transition-colors">
              
              {/* Sandbox Üst Başlık & Kontroller */}
              <div className="flex items-center justify-between pb-4 border-b border-zinc-200 dark:border-zinc-800 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 font-mono text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                    Canlı Simülatör Demomuz
                  </span>
                </div>
                <div className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-mono text-[11px] font-bold border ${
                  isBalanced
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/60'
                    : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-900/60'
                }`}>
                  <Scale className="w-3 h-3" />
                  <span>{isBalanced ? 'TERAZİ DENGELİ' : 'DENGESİZ'}</span>
                </div>
              </div>

              {/* Tıklanabilir Örnek İşlem Seçici */}
              <div className="space-y-1.5 mb-4">
                <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 block">
                  İşlem Seçin &amp; Canlı Akışı İzleyin:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {DEMO_TRANSACTIONS.map((demo, idx) => (
                    <button
                      key={demo.id}
                      type="button"
                      onClick={() => setActiveDemoIndex(idx)}
                      className={`p-2 rounded-xl text-left border text-xs font-semibold transition-all cursor-pointer ${
                        activeDemoIndex === idx
                          ? 'bg-black text-white dark:bg-white dark:text-black border-black dark:border-white shadow-xs'
                          : 'bg-zinc-50 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
                      }`}
                    >
                      <span className="block text-[10px] opacity-75 font-mono">Örnek #{idx + 1}</span>
                      <span className="block truncate">{demo.badge}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Seçili İşlem Detay Kartı */}
              <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 mb-4 text-xs">
                <div className="flex items-center justify-between font-bold text-zinc-900 dark:text-white mb-1">
                  <span>{activeTx.title}</span>
                  <span className="font-mono text-zinc-500 dark:text-zinc-400 text-[11px]">{formatCurrency(totalDebit)}</span>
                </div>
                <p className="text-zinc-600 dark:text-zinc-400 text-[11px] leading-relaxed">
                  {activeTx.desc}
                </p>
              </div>

              {/* Dinamik Yevmiye Maddesi Animasyonu */}
              <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black p-3.5 space-y-2 font-mono text-xs mb-4">
                <div className="flex items-center justify-between text-[11px] font-bold text-zinc-400 dark:text-zinc-500 border-b border-zinc-100 dark:border-zinc-800 pb-1.5">
                  <span>HESAP ADI &amp; KODU</span>
                  <div className="flex gap-6">
                    <span className="w-16 text-right">BORÇ</span>
                    <span className="w-16 text-right">ALACAK</span>
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTx.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-1.5"
                  >
                    {/* Borç Satırı 1 */}
                    <div className="flex items-center justify-between py-1 bg-zinc-50 dark:bg-zinc-900/40 px-2 rounded-lg">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-black dark:text-white">{activeTx.debit.code}</span>
                        <span className="text-zinc-800 dark:text-zinc-200">{activeTx.debit.name}</span>
                      </div>
                      <div className="flex gap-6">
                        <span className="w-16 text-right font-bold text-zinc-950 dark:text-white">
                          {formatCurrency(activeTx.debit.amount)}
                        </span>
                        <span className="w-16 text-right text-zinc-400">-</span>
                      </div>
                    </div>

                    {/* Varsa Borç Satırı 2 */}
                    {activeTx.secondDebit && (
                      <div className="flex items-center justify-between py-1 bg-zinc-50 dark:bg-zinc-900/40 px-2 rounded-lg">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-black dark:text-white">{activeTx.secondDebit.code}</span>
                          <span className="text-zinc-800 dark:text-zinc-200">{activeTx.secondDebit.name}</span>
                        </div>
                        <div className="flex gap-6">
                          <span className="w-16 text-right font-bold text-zinc-950 dark:text-white">
                            {formatCurrency(activeTx.secondDebit.amount)}
                          </span>
                          <span className="w-16 text-right text-zinc-400">-</span>
                        </div>
                      </div>
                    )}

                    {/* Alacak Satırı 1 */}
                    <div className="flex items-center justify-between py-1 bg-zinc-50 dark:bg-zinc-900/40 px-2 rounded-lg pl-6">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-zinc-700 dark:text-zinc-300">{activeTx.credit.code}</span>
                        <span className="text-zinc-700 dark:text-zinc-300">{activeTx.credit.name}</span>
                      </div>
                      <div className="flex gap-6">
                        <span className="w-16 text-right text-zinc-400">-</span>
                        <span className="w-16 text-right font-bold text-zinc-950 dark:text-white">
                          {formatCurrency(activeTx.credit.amount)}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Toplam Bakiye ve Terazi Kontrolü */}
                <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between font-bold text-xs">
                  <span className="text-zinc-600 dark:text-zinc-400">Yevmiye Toplamı:</span>
                  <div className="flex gap-6 font-mono font-black text-zinc-950 dark:text-white">
                    <span className="w-16 text-right">{formatCurrency(totalDebit)}</span>
                    <span className="w-16 text-right">{formatCurrency(totalCredit)}</span>
                  </div>
                </div>
              </div>

              {/* Alt T-Hesapları Önizleme Hapları */}
              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                <div className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900/70 border border-zinc-200 dark:border-zinc-800 text-center">
                  <span className="text-zinc-500 dark:text-zinc-400 block text-[10px]">T-HESABI BORÇ HANESİ</span>
                  <strong className="text-zinc-900 dark:text-white text-xs">{activeTx.debit.code} {activeTx.debit.name} (+)</strong>
                </div>
                <div className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900/70 border border-zinc-200 dark:border-zinc-800 text-center">
                  <span className="text-zinc-500 dark:text-zinc-400 block text-[10px]">T-HESABI ALACAK HANESİ</span>
                  <strong className="text-zinc-900 dark:text-white text-xs">{activeTx.credit.code} {activeTx.credit.name} (-)</strong>
                </div>
              </div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
