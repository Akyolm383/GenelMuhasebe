import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FileSpreadsheet, GitMerge, ArrowRight } from 'lucide-react';

interface PipelineStep {
  step: string;
  badge: string;
  title: string;
  description: string;
  keyRule: string;
  visualType: 'document' | 'journal' | 'ledger' | 'balanceSheet';
}

const PIPELINE_STEPS: PipelineStep[] = [
  {
    step: '01',
    badge: 'Finansal Olay & Belge',
    title: 'Ticari İşlem ve Kaynak Belge Doğar',
    description: 'Her muhasebe kaydı gerçek bir ticari belgeye (fatura, perakende satış fişi, banka dekontu, çek vb.) dayanmak zorundadır. Belge olmadan hiçbir kayıt yapılamaz.',
    keyRule: 'Belgesiz kayıt yapılamaz (VUK ve TMS İlkesi).',
    visualType: 'document',
  },
  {
    step: '02',
    badge: 'Yevmiye Kaydı & Terazi',
    title: 'Çift Taraflı Kayıt ve Terazi Dengesi',
    description: 'İşlem analiz edilir ve ilgili hesaplara borç/alacak olarak işlenir. Temel kural: Bir kayıttaki Borç toplamı, mutlaka Alacak toplamına kuruşu kuruşuna eşit olmak zorundadır.',
    keyRule: 'Toplam Borç = Toplam Alacak (Çift Taraflı Kayıt İlkesi).',
    visualType: 'journal',
  },
  {
    step: '03',
    badge: 'Büyük Defter (Defter-i Kebir)',
    title: 'T-Hesaplarına Dağılım ve Bakiye Türetimi',
    description: 'Yevmiye defterine yazılan tutarlar ilgili T-hesaplarına otomatik olarak akar. Hesabın niteliğine göre (Aktif, Pasif, Gider, Gelir) kalan bakiye canlı olarak hesaplanır.',
    keyRule: 'Aktif ve Gider hesapları borç; Pasif ve Gelir hesapları alacak kalanı verir.',
    visualType: 'ledger',
  },
  {
    step: '04',
    badge: 'Mizan ve T-Bilanço Sentezi',
    title: 'Dönem Sonu Mizanı ve Kusursuz Bilanço',
    description: 'T-hesaplarının tüm bakiyeleri Mizan tablosunda toplanıp kontrol edilir. Ardından işletmenin varlıklarını ve bu varlıkların finanse edildiği kaynakları gösteren resmi T-Bilanço üretilir.',
    keyRule: 'Aktif (Varlıklar) = Pasif (Yabancı Kaynaklar + Özkaynaklar).',
    visualType: 'balanceSheet',
  },
];

export const AccountingPipelineSection: React.FC = () => {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const activeStep = PIPELINE_STEPS[activeStepIndex];

  return (
    <section id="accounting-pipeline" className="py-16 md:py-24 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        
        {/* Başlık Alanı */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-zinc-800 dark:text-zinc-200">
            <GitMerge className="w-3.5 h-3.5 text-zinc-700 dark:text-zinc-300" />
            <span>Kusursuz Entegre Muhasebe Hattı</span>
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-zinc-950 dark:text-white tracking-tight">
            Faturadan Bilançoya: <br className="hidden sm:inline" />
            <span className="text-zinc-400 dark:text-zinc-500 font-bold">4 Adımlı</span> İnteraktif Akış
          </h2>
          <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Kitaplarda birbirinden bağımsız bölümler gibi öğretilen 4 aşamanın birbirini nasıl anlık beslediğini adım adım inceleyin.
          </p>
        </div>

        {/* 4 Aşamalı Sekme Seçici (Stepper) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {PIPELINE_STEPS.map((step, idx) => {
            const isActive = idx === activeStepIndex;
            return (
              <button
                key={step.step}
                type="button"
                onClick={() => setActiveStepIndex(idx)}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                  isActive
                    ? 'border-black dark:border-white bg-zinc-50 dark:bg-zinc-900/90 shadow-sm ring-1 ring-black/10 dark:ring-white/20'
                    : 'border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-950/40 hover:border-zinc-300 dark:hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`font-mono font-black text-xs ${isActive ? 'text-black dark:text-white' : 'text-zinc-400 dark:text-zinc-500'}`}>
                    ADIM {step.step}
                  </span>
                  {isActive && <div className="w-2 h-2 rounded-full bg-black dark:bg-white" />}
                </div>
                <h3 className={`font-bold text-xs sm:text-sm line-clamp-1 ${isActive ? 'text-zinc-950 dark:text-white' : 'text-zinc-700 dark:text-zinc-400'}`}>
                  {step.badge}
                </h3>
              </button>
            );
          })}
        </div>

        {/* Seçili Adım İçerik Paneli */}
        <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-950/70 p-6 sm:p-10 transition-colors">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Açıklama Kolonu */}
            <div className="lg:col-span-6 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-200/70 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-xs font-mono font-bold">
                <span>ADIM {activeStep.step}</span>
                <span>•</span>
                <span>{activeStep.badge}</span>
              </div>

              <h3 className="text-xl sm:text-3xl font-black text-zinc-950 dark:text-white tracking-tight">
                {activeStep.title}
              </h3>

              <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-300 leading-relaxed">
                {activeStep.description}
              </p>

              <div className="p-4 rounded-2xl bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 text-xs space-y-1">
                <span className="font-bold text-zinc-900 dark:text-white uppercase tracking-wider block text-[10px]">
                  Temel Muhasebe İlkesi:
                </span>
                <p className="text-zinc-700 dark:text-zinc-300 font-medium">
                  ⚖️ {activeStep.keyRule}
                </p>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveStepIndex((prev) => (prev > 0 ? prev - 1 : PIPELINE_STEPS.length - 1))}
                  className="px-4 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-semibold text-zinc-800 dark:text-zinc-200 transition-colors cursor-pointer"
                >
                  Önceki Adım
                </button>
                <button
                  type="button"
                  onClick={() => setActiveStepIndex((prev) => (prev < PIPELINE_STEPS.length - 1 ? prev + 1 : 0))}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 text-xs font-bold transition-all cursor-pointer"
                >
                  <span>Sonraki Adım</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Görsel Simülasyon Kolonu */}
            <div className="lg:col-span-6">
              <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black p-5 sm:p-6 shadow-sm">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeStep.step}
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.25 }}
                  >
                    {/* Görsel 1: Belge / Fatura */}
                    {activeStep.visualType === 'document' && (
                      <div className="space-y-4 font-mono text-xs">
                        <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
                          <div className="flex items-center gap-2">
                            <FileSpreadsheet className="w-4 h-4 text-zinc-500" />
                            <span className="font-bold text-zinc-900 dark:text-white">FATURA NO: E-2026/00142</span>
                          </div>
                          <span className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-[10px]">
                            RESMİ BELGE
                          </span>
                        </div>
                        <div className="space-y-2 text-zinc-600 dark:text-zinc-400">
                          <div className="flex justify-between">
                            <span>Düzenleyen:</span>
                            <span className="font-bold text-zinc-900 dark:text-white">Anadolu Ticaret Ltd. Şti.</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Mal Bedeli:</span>
                            <span className="font-bold text-zinc-900 dark:text-white">50.000,00 TL</span>
                          </div>
                          <div className="flex justify-between">
                            <span>KDV Tutarı (%20):</span>
                            <span className="font-bold text-zinc-900 dark:text-white">10.000,00 TL</span>
                          </div>
                          <div className="flex justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800 text-zinc-900 dark:text-white font-bold text-sm">
                            <span>Genel Toplam:</span>
                            <span>60.000,00 TL</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Görsel 2: Yevmiye Maddesi */}
                    {activeStep.visualType === 'journal' && (
                      <div className="space-y-3 font-mono text-xs">
                        <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800 font-bold text-zinc-400">
                          <span>YEVMİYE KAYDI</span>
                          <span>BORÇ / ALACAK</span>
                        </div>
                        <div className="space-y-1.5">
                          <div className="p-2 bg-zinc-50 dark:bg-zinc-900 rounded-lg flex justify-between">
                            <span>153 TİCARİ MALLAR</span>
                            <span className="font-bold text-zinc-900 dark:text-white">50.000,00 B</span>
                          </div>
                          <div className="p-2 bg-zinc-50 dark:bg-zinc-900 rounded-lg flex justify-between">
                            <span>191 İNDİRİLECEK KDV</span>
                            <span className="font-bold text-zinc-900 dark:text-white">10.000,00 B</span>
                          </div>
                          <div className="p-2 bg-zinc-50 dark:bg-zinc-900 rounded-lg flex justify-between pl-6 text-zinc-600 dark:text-zinc-400">
                            <span>100 KASA</span>
                            <span className="font-bold text-zinc-900 dark:text-white">60.000,00 A</span>
                          </div>
                        </div>
                        <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-bold text-center border border-emerald-200 dark:border-emerald-900/50">
                          ✓ Borç = Alacak (60.000 TL) Eşitliği Sağlandı
                        </div>
                      </div>
                    )}

                    {/* Görsel 3: Büyük Defter (T-Hesapları) */}
                    {activeStep.visualType === 'ledger' && (
                      <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                        <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 bg-zinc-50 dark:bg-zinc-900/50">
                          <div className="text-center font-bold pb-2 border-b border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white">
                            153 TİCARİ MALLAR
                          </div>
                          <div className="grid grid-cols-2 divide-x divide-zinc-200 dark:divide-zinc-700 py-2 min-h-[70px]">
                            <div className="pr-2 font-bold text-zinc-900 dark:text-white">50.000 TL</div>
                            <div className="pl-2 text-zinc-400 text-right">-</div>
                          </div>
                          <div className="border-t border-zinc-200 dark:border-zinc-700 pt-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
                            B. Kalanı: 50.000 TL
                          </div>
                        </div>

                        <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 bg-zinc-50 dark:bg-zinc-900/50">
                          <div className="text-center font-bold pb-2 border-b border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white">
                            100 KASA HESABI
                          </div>
                          <div className="grid grid-cols-2 divide-x divide-zinc-200 dark:divide-zinc-700 py-2 min-h-[70px]">
                            <div className="pr-2 text-zinc-400">100.000 TL</div>
                            <div className="pl-2 font-bold text-zinc-900 dark:text-white text-right">60.000 TL</div>
                          </div>
                          <div className="border-t border-zinc-200 dark:border-zinc-700 pt-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
                            B. Kalanı: 40.000 TL
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Görsel 4: T-Bilanço */}
                    {activeStep.visualType === 'balanceSheet' && (
                      <div className="space-y-3 font-mono text-xs">
                        <div className="text-center font-bold text-zinc-900 dark:text-white pb-1 border-b border-zinc-100 dark:border-zinc-800">
                          DÖNEM SONU T-BİLANÇOSU
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="p-3 bg-zinc-50 dark:bg-zinc-900 rounded-xl space-y-1">
                            <span className="font-bold text-[11px] text-zinc-500 uppercase block">AKTİF (VARLIKLAR)</span>
                            <div className="text-[11px] flex justify-between"><span>Dönen Varlıklar:</span> <strong>90.000 TL</strong></div>
                            <div className="text-[11px] flex justify-between"><span>Duran Varlıklar:</span> <strong>10.000 TL</strong></div>
                            <div className="pt-2 border-t border-zinc-200 dark:border-zinc-700 font-bold text-zinc-950 dark:text-white">
                              AKTİF TOPLAMI: 100.000 TL
                            </div>
                          </div>
                          <div className="p-3 bg-zinc-50 dark:bg-zinc-900 rounded-xl space-y-1">
                            <span className="font-bold text-[11px] text-zinc-500 uppercase block">PASİF (KAYNAKLAR)</span>
                            <div className="text-[11px] flex justify-between"><span>K.V. Borçlar:</span> <strong>0 TL</strong></div>
                            <div className="text-[11px] flex justify-between"><span>Öz Kaynaklar:</span> <strong>100.000 TL</strong></div>
                            <div className="pt-2 border-t border-zinc-200 dark:border-zinc-700 font-bold text-zinc-950 dark:text-white">
                              PASİF TOPLAMI: 100.000 TL
                            </div>
                          </div>
                        </div>
                        <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-bold text-center border border-emerald-200 dark:border-emerald-900/50">
                          ✓ AKTİF = PASİF (BİLANÇO DENGELİ)
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
