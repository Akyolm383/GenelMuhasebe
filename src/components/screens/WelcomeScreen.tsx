import React, { useState } from 'react';
import { useAccountingStore, type AppMode } from '../../store/useAccountingStore';
import { SCENARIOS } from '../../data/scenarios';
import { 
  Building2, 
  Sparkles, 
  GraduationCap, 
  CheckCircle2, 
  ArrowRight, 
  Sun, 
  Moon, 
  BookOpen, 
  ShieldCheck, 
  Calendar,
  Wallet,
  Wand2
} from 'lucide-react';
import { formatCurrency } from '../../core/accountingEngine';
import { ScenarioGeneratorModal } from '../ScenarioGeneratorModal';

interface WelcomeScreenProps {
  onOpenAccountsGuide: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onOpenAccountsGuide }) => {
  const { 
    startScenario, 
    getAllScenarios,
    theme, 
    toggleTheme,
    currentScenarioId: storeScenarioId,
    mode: storeMode 
  } = useAccountingStore();

  const allScenarios = getAllScenarios();
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(storeScenarioId || allScenarios[0]?.id || SCENARIOS[0].id);
  const [selectedMode, setSelectedMode] = useState<AppMode>(storeMode || 'ogrenme');
  const [showGeneratorModal, setShowGeneratorModal] = useState(false);

  const selectedScenario = allScenarios.find((s) => s.id === selectedScenarioId) || allScenarios[0] || SCENARIOS[0];

  const handleStart = () => {
    startScenario(selectedScenario.id, selectedMode);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black text-slate-900 dark:text-zinc-100 flex flex-col justify-between transition-colors">
      {/* Üst Bar */}
      <header className="border-b border-slate-200 dark:border-zinc-800 bg-white/80 dark:bg-black/90 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 dark:bg-zinc-900 dark:border dark:border-zinc-800 flex items-center justify-center text-white shadow-md dark:shadow-none">
              <Building2 className="w-5 h-5 text-white dark:text-zinc-200" />
            </div>
            <div>
              <h1 className="font-bold text-base sm:text-lg leading-tight text-slate-900 dark:text-white">
                Genel Muhasebe
              </h1>
              <p className="text-xs text-slate-500 dark:text-zinc-400 hidden sm:block">
                Üniversite Seviyesi İnteraktif Muhasebe Laboratuvarı
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenAccountsGuide}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-zinc-200 bg-slate-100 dark:bg-zinc-900 dark:border dark:border-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-indigo-500 dark:text-zinc-400" />
              <span className="hidden sm:inline">Hesap Planı Rehberi</span>
              <span className="sm:hidden">Rehber</span>
            </button>

            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Temayı Değiştir"
              className="p-2 text-slate-600 dark:text-zinc-300 bg-slate-100 dark:bg-zinc-900 dark:border dark:border-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-600" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Ana Gövde */}
      <main className="max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10 flex-1">
        {/* Karşılama Başlığı */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-zinc-900 border border-indigo-200 dark:border-zinc-800 text-indigo-700 dark:text-zinc-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500 dark:text-zinc-400" />
            <span>Ezber yok, gerçek muhasebe mantığı var</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            İşlemleri Kaydet, Defteri Tut, <br className="hidden sm:inline" />
            <span className="text-indigo-600 dark:text-zinc-300">Bilanço ve Mizanı Canlı Gör</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-zinc-400 leading-relaxed">
            İşletmenin kuruluşundan dönem sonu bilançosuna kadar tüm süreci bizzat yöneteceksiniz. Hatalarınızda sistem sizi kırmadan pedagojik ipuçlarıyla yönlendirir.
          </p>
        </div>

        {/* 1. Aşama: Senaryo Seçimi */}
        <section className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-600 dark:bg-zinc-100 dark:text-black text-white text-xs flex items-center justify-center font-bold">1</span>
              <span>Çalışmak İstediğiniz Senaryoyu Seçin</span>
            </h3>
            
            <button
              type="button"
              onClick={() => setShowGeneratorModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 dark:bg-white dark:hover:bg-zinc-200 dark:text-black text-white shadow-sm transition-all cursor-pointer"
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span>Rastgele Görev Üret</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allScenarios.map((s) => {
              const isSelected = s.id === selectedScenarioId;
              const diffLower = s.difficulty.toLowerCase();
              const badgeColors = 
                diffLower === 'kolay'
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/60'
                  : diffLower === 'orta'
                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200 dark:border-amber-900/60'
                  : 'bg-purple-100 text-purple-800 dark:bg-purple-950/40 dark:text-purple-400 border-purple-200 dark:border-purple-900/60';

              return (
                <div
                  key={s.id}
                  onClick={() => setSelectedScenarioId(s.id)}
                  className={`relative rounded-2xl p-5 border-2 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-indigo-600 dark:border-zinc-300 bg-white dark:bg-zinc-900/90 shadow-lg shadow-indigo-600/10 dark:shadow-none ring-2 ring-indigo-600/20 dark:ring-zinc-400/20'
                      : 'border-slate-200 dark:border-zinc-800/90 bg-white/70 dark:bg-zinc-950/80 hover:border-slate-300 dark:hover:border-zinc-700 hover:bg-white dark:hover:bg-zinc-900/60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-3 pr-7">
                    <span className={`text-[11px] font-bold uppercase px-2.5 py-0.5 rounded-full border ${badgeColors}`}>
                      {s.difficulty} Seviye
                    </span>
                    <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400 font-mono">
                      {s.transactions.length} İşlem
                    </span>
                  </div>

                  <h4 className="font-bold text-base text-slate-900 dark:text-white mb-1">
                    {s.companyName}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-zinc-400 line-clamp-2 mb-4 leading-relaxed">
                    {s.description}
                  </p>

                  <div className="pt-3 border-t border-slate-100 dark:border-zinc-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-zinc-400">
                    <span className="flex items-center gap-1">
                      <Wallet className="w-3.5 h-3.5 text-indigo-500 dark:text-zinc-400" />
                      {formatCurrency(s.initialCapital)}
                    </span>
                    <span className="flex items-center gap-1 font-mono text-[11px]">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500" />
                      {s.establishedDate}
                    </span>
                  </div>

                  {isSelected && (
                    <div className="absolute top-3.5 right-3.5 text-indigo-600 dark:text-zinc-100">
                      <CheckCircle2 className="w-5 h-5 fill-indigo-100 dark:fill-zinc-800" />
                    </div>
                  )}
                </div>
              );
            })}

            {/* Özel Senaryo Üretme Kartı */}
            <div
              onClick={() => setShowGeneratorModal(true)}
              className="rounded-2xl p-5 border-2 border-dashed border-indigo-300 dark:border-zinc-800 bg-indigo-50/40 dark:bg-zinc-950/60 hover:bg-indigo-50/80 dark:hover:bg-zinc-900/60 hover:border-indigo-500 dark:hover:border-zinc-600 cursor-pointer transition-all flex flex-col justify-between group min-h-[170px]"
            >
              <div className="space-y-2">
                <div className="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-zinc-800 text-indigo-600 dark:text-zinc-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Wand2 className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span>Kendi Görevini Türet</span>
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                </h4>
                <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
                  İşlem sayısını ve zorluğu seçin, durum makinesi algoritması size özel benzersiz bir şirket simülasyonu oluştursun.
                </p>
              </div>
              <div className="pt-3 border-t border-indigo-100 dark:border-zinc-800/80 flex items-center justify-between text-xs font-semibold text-indigo-600 dark:text-zinc-300">
                <span>Parametreleri Ayarla</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </section>

        {/* 2. Aşama: Çalışma Modu Seçimi */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-600 dark:bg-zinc-100 dark:text-black text-white text-xs flex items-center justify-center font-bold">2</span>
              <span>Çalışma Modunuzu Belirleyin</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Öğrenme Modu */}
            <div
              onClick={() => setSelectedMode('ogrenme')}
              className={`rounded-2xl p-5 border-2 cursor-pointer transition-all flex gap-4 ${
                selectedMode === 'ogrenme'
                  ? 'border-indigo-600 dark:border-zinc-300 bg-white dark:bg-zinc-900/90 shadow-md ring-2 ring-indigo-600/20 dark:ring-zinc-400/20'
                  : 'border-slate-200 dark:border-zinc-800/90 bg-white/70 dark:bg-zinc-950/80 hover:border-slate-300 dark:hover:border-zinc-700'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-zinc-800 text-indigo-600 dark:text-zinc-200 flex items-center justify-center shrink-0">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    Öğrenme Modu (Tavsiye Edilen)
                  </h4>
                </div>
                <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                  İlk kez öğrenenler için idealdir. Takıldığınızda 4 aşamalı ipucu alabilir, her işlem için anlık kural açıklamalarını görebilirsiniz.
                </p>
              </div>
            </div>

            {/* Sınav Modu */}
            <div
              onClick={() => setSelectedMode('calisma')}
              className={`rounded-2xl p-5 border-2 cursor-pointer transition-all flex gap-4 ${
                selectedMode === 'calisma'
                  ? 'border-indigo-600 dark:border-zinc-300 bg-white dark:bg-zinc-900/90 shadow-md ring-2 ring-indigo-600/20 dark:ring-zinc-400/20'
                  : 'border-slate-200 dark:border-zinc-800/90 bg-white/70 dark:bg-zinc-950/80 hover:border-slate-300 dark:hover:border-zinc-700'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-200 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    Sınav / Çalışma Modu
                  </h4>
                </div>
                <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                  İpucu ve anlık düzeltme yok. Kayıtlarınızı kendi bilginizle tamamlayıp sonunda kapsamlı bir karne ve denetim raporu alırsınız.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Seçilen Senaryo Özeti & Başlat Butonu */}
        <section className="bg-gradient-to-br from-indigo-900 to-slate-900 dark:from-zinc-900 dark:to-black text-white rounded-3xl p-6 sm:p-8 shadow-xl dark:shadow-none dark:border dark:border-zinc-800 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2">
              <span className="text-xs font-semibold tracking-wider text-indigo-300 dark:text-zinc-400 uppercase">
                Hazır mısınız?
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                {selectedScenario.companyName} için Çalışmayı Başlat
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 dark:text-zinc-400 max-w-2xl">
                Seçtiğiniz senaryoda {selectedScenario.transactions.length} ticari işlem sizi bekliyor. Tüm işlemlerinizi Yevmiye Defteri&apos;ne kaydedip T-Hesapları ve Bilanço üzerindeki yansımalarını inceleyebilirsiniz.
              </p>
            </div>

            <button
              type="button"
              onClick={handleStart}
              className="inline-flex items-center justify-center gap-2 px-6 py-4 bg-indigo-500 hover:bg-indigo-400 dark:bg-white dark:text-black dark:hover:bg-zinc-200 text-white font-bold text-sm sm:text-base rounded-2xl shadow-lg shadow-indigo-500/30 dark:shadow-none transition-all cursor-pointer shrink-0"
            >
              <span>Çalışmaya Başla</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-indigo-800/80 dark:border-zinc-800 text-xs">
            <div>
              <span className="text-indigo-300 dark:text-zinc-400 block">Kuruluş Tarihi</span>
              <span className="font-bold font-mono">{selectedScenario.establishedDate}</span>
            </div>
            <div>
              <span className="text-indigo-300 dark:text-zinc-400 block">Başlangıç Sermayesi</span>
              <span className="font-bold">{formatCurrency(selectedScenario.initialCapital)}</span>
            </div>
            <div>
              <span className="text-indigo-300 dark:text-zinc-400 block">Zorluk Derecesi</span>
              <span className="font-bold capitalize">{selectedScenario.difficulty}</span>
            </div>
            <div>
              <span className="text-indigo-300 dark:text-zinc-400 block">Seçilen Mod</span>
              <span className="font-bold">
                {selectedMode === 'ogrenme' ? 'Öğrenme (Rehberli)' : 'Sınav (Kendi Başına)'}
              </span>
            </div>
          </div>
        </section>
      </main>

      {/* Alt Bilgi */}
      <footer className="border-t border-slate-200 dark:border-zinc-800 bg-white dark:bg-black py-4 text-center text-xs text-slate-500 dark:text-zinc-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Genel Muhasebe İnteraktif Öğrenme Platformu • Üniversite Müfredatı Uyumlu</span>
          <span className="font-mono text-[11px]">Türkiye Muhasebe Standartları & Tekdüzen Hesap Planı</span>
        </div>
      </footer>

      {/* Dinamik Görev Üretici Modal */}
      <ScenarioGeneratorModal
        isOpen={showGeneratorModal}
        onClose={() => setShowGeneratorModal(false)}
        selectedMode={selectedMode}
      />
    </div>
  );
};
