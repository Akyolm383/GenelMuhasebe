import React from 'react';
import { motion } from 'motion/react';
import { Wand2, HelpCircle, ShieldAlert, Award, Cpu, CheckCircle2 } from 'lucide-react';

export const BentoFeaturesSection: React.FC = () => {
  return (
    <section id="bento-features" className="py-16 md:py-24 border-t border-zinc-200 dark:border-zinc-800 bg-[#fafafa] dark:bg-black transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        
        {/* Başlık */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-zinc-800 dark:text-zinc-200">
            <Cpu className="w-3.5 h-3.5" />
            <span>Modern Pedagoji &amp; Yazılım Mimarisi</span>
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-zinc-950 dark:text-white tracking-tight">
            Muhasebeyi Kolaylaştıran <br className="hidden sm:inline" />
            <span className="text-zinc-400 dark:text-zinc-500 font-bold">4 Temel Güç</span>
          </h2>
          <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Klasik ders kitaplarında saatlerce aradığınız kuralları interaktif algoritmalarla anında öğrenin.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          
          {/* Kart 1: Algoritmik Senaryo Motoru (Geniş 7 Kolon) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="md:col-span-7 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 sm:p-8 flex flex-col justify-between group hover:border-zinc-400 dark:hover:border-zinc-700 transition-all shadow-xs"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-black dark:bg-white text-white dark:text-black flex items-center justify-center shadow-xs">
                <Wand2 className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="font-mono text-xs font-bold uppercase text-zinc-400 dark:text-zinc-500 tracking-wider">
                  DETERMİNİSTİK MOTOR
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-zinc-950 dark:text-white tracking-tight">
                  Sonsuz Sayıda Rastgele Ticari Senaryo
                </h3>
              </div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Ezber soruları unutun. Durum makinesi algoritmamız; şirket kuruluşundan vadeli mal alımına, çek/senet tahsilatından KDV mahsubuna kadar matematiksel olarak çözülebilir sonsuz sayıda özgün işletme senaryosu türetir.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs font-mono text-zinc-500 dark:text-zinc-400">
              <span className="flex items-center gap-1.5 font-semibold text-zinc-900 dark:text-white">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Matematiksel Olarak %100 Doğrulanmış
              </span>
              <span>Kolay • Orta • Zor</span>
            </div>
          </motion.div>

          {/* Kart 2: Sokratik 4 Aşamalı İpuçları (5 Kolon) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="md:col-span-5 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 sm:p-8 flex flex-col justify-between group hover:border-zinc-400 dark:hover:border-zinc-700 transition-all shadow-xs"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
                <HelpCircle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="font-mono text-xs font-bold uppercase text-zinc-400 dark:text-zinc-500 tracking-wider">
                  PEDAGOJİK REHBER
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-zinc-950 dark:text-white tracking-tight">
                  4 Kademeli Sokratik İpucu
                </h3>
              </div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Tıkandığınızda cevabı doğrudan verip ezberletmez. Önce düşündürücü soru sorar, ardından ilgili hesap kodlarını fısıldar, en son gerekirse tam çözümü gösterir.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center gap-1 text-[11px] font-mono font-bold text-amber-700 dark:text-amber-400">
              <span>Seviye 1 (Düşün)</span> → <span>Seviye 2 (Kodlar)</span> → <span>Seviye 3 (Çözüm)</span>
            </div>
          </motion.div>

          {/* Kart 3: Anlık Pedagojik Teşhis (5 Kolon) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="md:col-span-5 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 sm:p-8 flex flex-col justify-between group hover:border-zinc-400 dark:hover:border-zinc-700 transition-all shadow-xs"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-zinc-900 dark:bg-zinc-800 text-white flex items-center justify-center shadow-xs">
                <ShieldAlert className="w-6 h-6 text-rose-400" />
              </div>
              <div className="space-y-1">
                <span className="font-mono text-xs font-bold uppercase text-zinc-400 dark:text-zinc-500 tracking-wider">
                  CANLI KONTROL
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-zinc-950 dark:text-white tracking-tight">
                  Akıllı Hata Teşhisi
                </h3>
              </div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                &quot;100 Kasa hesabı alacak bakiyesi veremez, çünkü cebinizde olmayan parayı harcayamazsınız.&quot; Hatalarınızı cezalandırmaz, nedenini öğreterek düzeltir.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs text-rose-600 dark:text-rose-400 font-mono font-semibold">
              <span>Ters Bakiye Uyarıları</span>
              <span>KDV Mahsup Kontrolü</span>
            </div>
          </motion.div>

          {/* Kart 4: Sınav Modu & Kapsamlı Denetim Raporu (Geniş 7 Kolon) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="md:col-span-7 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 sm:p-8 flex flex-col justify-between group hover:border-zinc-400 dark:hover:border-zinc-700 transition-all shadow-xs"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-black dark:bg-white text-white dark:text-black flex items-center justify-center shadow-xs">
                <Award className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="font-mono text-xs font-bold uppercase text-zinc-400 dark:text-zinc-500 tracking-wider">
                  ÖLÇME VE DEĞERLENDİRME
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-zinc-950 dark:text-white tracking-tight">
                  Kapsamlı Denetim Raporu &amp; Sınav Karnesi
                </h3>
              </div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Çalışma modunu açtığınızda tüm ipuçları kapanır, gerçek bir sınav ortamı başlar. Tüm kayıtlarınızı tamamladığınızda sistem mali müşavir titizliğiyle yevmiye, mizan ve bilançonuzu denetleyip detaylı bir karne üretir.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs font-mono text-zinc-500 dark:text-zinc-400">
              <span className="font-semibold text-zinc-900 dark:text-white">Puanlama: 100 Üzerinden Karne Notu</span>
              <span>Hata Analiz Dökümü</span>
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
};
