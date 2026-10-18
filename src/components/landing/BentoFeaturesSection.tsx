import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  FlaskConical,
  Sparkles,
  Brain,
  AlertTriangle,
  ClipboardCheck,
  AlertCircle,
} from 'lucide-react';

const SOCRATIC_STEPS = [
  {
    id: 1,
    label: '1. Değer',
    hint: 'İşletmeye nakit para mı girdi yoksa mal varlığı mı arttı?',
  },
  {
    id: 2,
    label: '2. Nitelik',
    hint: 'Artan varlıklar Bilançonun Aktif (Sol) tarafında yer alır.',
  },
  {
    id: 3,
    label: '3. Kod Grup',
    hint: '15 Stoklar grubundaki 153 Ticari Mallar hesabı borçlandırılır.',
  },
  {
    id: 4,
    label: '4. Madde',
    hint: '153 Ticari Mallar (B) / 100 Kasa (A) denkliği kurulur.',
  },
];

export const BentoFeaturesSection: React.FC = () => {
  const [activeHintStep, setActiveHintStep] = useState<number>(4);
  const currentHint =
    SOCRATIC_STEPS.find((s) => s.id === activeHintStep) || SOCRATIC_STEPS[3];

  return (
    <section
      id="slide-03"
      className="snap-section min-h-[calc(100vh-4rem)] flex flex-col justify-center py-10 lg:py-12 px-3 sm:px-8 border-b border-[#C6C6CD]/50 dark:border-zinc-800/80"
    >
      <div className="max-w-7xl mx-auto w-full pl-0 sm:pl-12">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-3"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E5EEFF] dark:bg-zinc-900 border border-[#C6C6CD]/80 dark:border-zinc-700 font-mono text-[11px] text-[#0B1C30] dark:text-zinc-200 font-bold uppercase tracking-wider mb-2">
              <FlaskConical className="w-3.5 h-3.5 text-[#006C4A] dark:text-emerald-400" />
              <span>SAHNE 03 / 05 • SİMÜLASYON MOTORU</span>
            </div>
            <h2 className="font-headline text-[24px] sm:text-[30px] font-bold text-[#0B1C30] dark:text-white tracking-tight">
              SMMM ve Finans Öğrencileri İçin Özel Geliştirilmiş Laboratuvar
            </h2>
          </div>
          <p className="text-[14px] text-[#45464D] dark:text-zinc-400 max-w-md">
            Ezber yerine nedensellik ilişkisi kurduran modern muhasebe denetim ve öğrenim araç takımı.
          </p>
        </motion.div>

        {/* 2x2 High-Impact Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Bento 1: Dynamic Generator Engine */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.45 }}
            className="bg-white dark:bg-zinc-900 p-5 rounded-xl border border-[#C6C6CD] dark:border-zinc-800 hover:border-black dark:hover:border-zinc-600 transition-all shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-[#E5EEFF] dark:bg-zinc-800 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-black dark:text-white" />
                </div>
                <span className="px-2.5 py-0.5 rounded bg-[#E5EEFF] dark:bg-zinc-800 text-[#0B1C30] dark:text-zinc-200 font-mono text-[11px] font-bold">
                  ALGORİTMİK MOTOR
                </span>
              </div>
              <h3 className="font-headline text-[20px] sm:text-[22px] font-semibold text-[#0B1C30] dark:text-white mb-2 tracking-tight">
                Deterministik Senaryo Motoru
              </h3>
              <p className="text-[14px] text-[#45464D] dark:text-zinc-400 mb-4 leading-relaxed">
                Sonsuz sayıda ticari işlem varyasyonu. Kuruluş sermayesi, fatura, KDV tevkifatı, reeskont ve kur farkı senaryoları dinamik tutarlarla türetilir.
              </p>
            </div>
            <div className="p-2.5 bg-[#EFF4FF] dark:bg-zinc-950 rounded border border-[#C6C6CD]/60 dark:border-zinc-800 font-mono text-[11px] flex justify-between items-center text-[#0B1C30] dark:text-zinc-200">
              <div className="flex items-center gap-2">
                <img
                  src="/images/3d-audit-lab.png"
                  alt="Algoritmik Motor İkonu"
                  className="w-6 h-6 rounded object-cover border border-[#C6C6CD] dark:border-zinc-700"
                />
                <span className="text-[#45464D] dark:text-zinc-400">Senaryo Havuzu:</span>
              </div>
              <span className="font-bold text-[#006C4A] dark:text-emerald-400">
                12.000+ Dinamik Varyasyon
              </span>
            </div>
          </motion.div>

          {/* Bento 2: Socratic Hints */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.45, delay: 0.08 }}
            className="bg-white dark:bg-zinc-900 p-5 rounded-xl border border-[#C6C6CD] dark:border-zinc-800 hover:border-black dark:hover:border-zinc-600 transition-all shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-[#E5EEFF] dark:bg-zinc-800 flex items-center justify-center">
                  <Brain className="w-5 h-5 text-black dark:text-white" />
                </div>
                <span className="px-2.5 py-0.5 rounded bg-[#85F8C4] dark:bg-emerald-950 text-[#002114] dark:text-emerald-300 font-mono text-[11px] font-bold">
                  SOKRATİK DİYALOG
                </span>
              </div>
              <h3 className="font-headline text-[20px] sm:text-[22px] font-semibold text-[#0B1C30] dark:text-white mb-2 tracking-tight">
                4 Kademeli Sokratik İpucu
              </h3>
              <p className="text-[14px] text-[#45464D] dark:text-zinc-400 mb-3 leading-relaxed">
                Cevabı doğrudan vermek yerine muhasebeci gibi akıl yürütmeyi tetikleyen yönlendirme: Varlık/kaynak artış azalışı analiziyle doğru hesaba ulaşma.
              </p>
            </div>
            <div className="space-y-2">
              <div className="grid grid-cols-4 gap-1.5 font-mono text-[11px] text-center">
                {SOCRATIC_STEPS.map((step) => {
                  const isCurrent = step.id === activeHintStep;
                  return (
                    <button
                      key={step.id}
                      type="button"
                      onClick={() => setActiveHintStep(step.id)}
                      className={`p-1.5 rounded transition-colors cursor-pointer ${
                        isCurrent
                          ? 'bg-black dark:bg-white text-white dark:text-black font-bold'
                          : 'bg-[#E5EEFF] dark:bg-zinc-800 font-semibold text-[#0B1C30] dark:text-zinc-300 hover:bg-[#DCE9FF] dark:hover:bg-zinc-700'
                      }`}
                    >
                      {step.label}
                    </button>
                  );
                })}
              </div>
              <div className="px-2.5 py-1.5 rounded bg-[#EFF4FF]/70 dark:bg-zinc-950 border border-[#C6C6CD]/50 dark:border-zinc-800 font-mono text-[11px] text-[#0B1C30] dark:text-zinc-300">
                <strong className="text-[#006C4A] dark:text-emerald-400">
                  {currentHint.label}:
                </strong>{' '}
                {currentHint.hint}
              </div>
            </div>
          </motion.div>

          {/* Bento 3: Reverse Balance Diagnosis */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.45, delay: 0.16 }}
            className="bg-white dark:bg-zinc-900 p-5 rounded-xl border border-[#C6C6CD] dark:border-zinc-800 hover:border-black dark:hover:border-zinc-600 transition-all shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-[#E5EEFF] dark:bg-zinc-800 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-black dark:text-white" />
                </div>
                <span className="px-2.5 py-0.5 rounded bg-[#FFDAD6] dark:bg-rose-950 text-[#93000A] dark:text-rose-300 font-mono text-[11px] font-bold">
                  DENETİM KALKANI
                </span>
              </div>
              <h3 className="font-headline text-[20px] sm:text-[22px] font-semibold text-[#0B1C30] dark:text-white mb-2 tracking-tight">
                Akıllı Ters Bakiye Teşhisi
              </h3>
              <p className="text-[14px] text-[#45464D] dark:text-zinc-400 mb-4 leading-relaxed">
                Kasa veya alacak hesaplarında ters bakiye (kredili kasa hatası) oluştuğunda anında müdahale uyarısı ve VUK/TMS denetim kalkanı devreye girer.
              </p>
            </div>
            <div className="p-2.5 bg-[#FFDAD6]/40 dark:bg-rose-950/40 text-[#93000A] dark:text-rose-300 rounded border border-[#FFDAD6] dark:border-rose-800/70 font-mono text-[11px] flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span className="font-semibold">
                İkaz: 100 Kasa asla alacak kalanı veremez! VUK Mad. 134
              </span>
            </div>
          </motion.div>

          {/* Bento 4: Audit & Performance Report */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.45, delay: 0.24 }}
            className="bg-white dark:bg-zinc-900 p-5 rounded-xl border border-[#C6C6CD] dark:border-zinc-800 hover:border-black dark:hover:border-zinc-600 transition-all shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-[#E5EEFF] dark:bg-zinc-800 flex items-center justify-center">
                  <ClipboardCheck className="w-5 h-5 text-black dark:text-white" />
                </div>
                <span className="px-2.5 py-0.5 rounded bg-[#E5EEFF] dark:bg-zinc-800 text-[#0B1C30] dark:text-zinc-200 font-mono text-[11px] font-bold">
                  SMMM KARNESİ
                </span>
              </div>
              <h3 className="font-headline text-[20px] sm:text-[22px] font-semibold text-[#0B1C30] dark:text-white mb-2 tracking-tight">
                Denetim Raporu &amp; Sınav Karnesi
              </h3>
              <p className="text-[14px] text-[#45464D] dark:text-zinc-400 mb-4 leading-relaxed">
                Simülasyon tamamlandığında yevmiye denkliği (%96), defter-i kebir doğruluğu (%100) ve kapanış mizanı uyumu üzerinden bağımsız denetçi karnesi üretilir.
              </p>
            </div>
            <div className="p-2.5 bg-[#EFF4FF] dark:bg-zinc-950 rounded border border-[#C6C6CD]/60 dark:border-zinc-800 font-mono text-[11px] flex justify-between items-center text-[#0B1C30] dark:text-zinc-200">
              <span className="text-[#45464D] dark:text-zinc-400">SMMM Seviye Skoru:</span>
              <span className="font-bold text-[#006C4A] dark:text-emerald-400 text-[15px]">
                94 / 100 • Üstün Başarı
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
