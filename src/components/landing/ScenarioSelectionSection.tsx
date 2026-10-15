import React from 'react';
import { 
  Building2, 
  Sparkles, 
  GraduationCap, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Calendar,
  Wallet,
  Wand2 
} from 'lucide-react';
import type { CompanyScenario } from '../../types/scenario';
import type { AppMode } from '../../store/useAccountingStore';
import { formatCurrency } from '../../core/accountingEngine';

interface ScenarioSelectionSectionProps {
  scenarios: CompanyScenario[];
  selectedScenarioId: string;
  onSelectScenarioId: (id: string) => void;
  selectedMode: AppMode;
  onSelectMode: (mode: AppMode) => void;
  onOpenGenerator: () => void;
  onStart: () => void;
}

export const ScenarioSelectionSection: React.FC<ScenarioSelectionSectionProps> = ({
  scenarios,
  selectedScenarioId,
  onSelectScenarioId,
  selectedMode,
  onSelectMode,
  onOpenGenerator,
  onStart,
}) => {
  const selectedScenario = scenarios.find((s) => s.id === selectedScenarioId) || scenarios[0];

  return (
    <section id="scenario-selection" className="py-16 md:py-24 border-t border-zinc-200 dark:border-zinc-800 bg-[#fafafa] dark:bg-black transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        
        {/* Başlık */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-zinc-800 dark:text-zinc-200">
            <Building2 className="w-3.5 h-3.5" />
            <span>Simülasyon Başlatıcı</span>
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-zinc-950 dark:text-white tracking-tight">
            Çalışmanızı Başlatın
          </h2>
          <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400">
            Hazır bir işletme senaryosu seçin veya parametreleri belirleyerek anında kendi görevinizi türetin.
          </p>
        </div>

        {/* 1. Aşama: Senaryo Seçimi Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-black dark:bg-white text-white dark:text-black text-xs flex items-center justify-center font-bold">1</span>
              <span>İşletme Senaryosunu Seçin</span>
            </h3>
            
            <button
              type="button"
              onClick={onOpenGenerator}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-black hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-black shadow-xs transition-all cursor-pointer"
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span>Rastgele Görev Üret</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {scenarios.map((s) => {
              const isSelected = s.id === selectedScenarioId;
              const diffLower = s.difficulty.toLowerCase();
              const badgeColors = 
                diffLower === 'kolay'
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/60'
                  : diffLower === 'orta'
                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200 dark:border-amber-900/60'
                  : 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100 border-zinc-200 dark:border-zinc-700';

              return (
                <div
                  key={s.id}
                  onClick={() => onSelectScenarioId(s.id)}
                  className={`relative rounded-3xl p-6 border-2 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-black dark:border-white bg-white dark:bg-zinc-900 shadow-md ring-2 ring-black/10 dark:ring-white/20'
                      : 'border-zinc-200 dark:border-zinc-800/90 bg-white dark:bg-zinc-950/80 hover:border-zinc-400 dark:hover:border-zinc-700 hover:shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-3 pr-7">
                    <span className={`text-[11px] font-bold uppercase px-2.5 py-0.5 rounded-full border ${badgeColors}`}>
                      {s.difficulty} Seviye
                    </span>
                    <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 font-mono">
                      {s.transactions.length} İşlem
                    </span>
                  </div>

                  <h4 className="font-bold text-base text-zinc-900 dark:text-white mb-1.5">
                    {s.companyName}
                  </h4>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2 mb-5 leading-relaxed">
                    {s.description}
                  </p>

                  <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
                    <span className="flex items-center gap-1.5">
                      <Wallet className="w-3.5 h-3.5 text-zinc-600 dark:text-zinc-400" />
                      {formatCurrency(s.initialCapital)}
                    </span>
                    <span className="flex items-center gap-1 font-mono text-[11px]">
                      <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                      {s.establishedDate}
                    </span>
                  </div>

                  {isSelected && (
                    <div className="absolute top-4 right-4 text-black dark:text-white">
                      <CheckCircle2 className="w-5 h-5 fill-zinc-100 dark:fill-zinc-800" />
                    </div>
                  )}
                </div>
              );
            })}

            {/* Özel Senaryo Üretme Kartı */}
            <div
              onClick={onOpenGenerator}
              className="rounded-3xl p-6 border-2 border-dashed border-zinc-300 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-950/60 hover:bg-zinc-100 dark:hover:bg-zinc-900/60 hover:border-zinc-500 dark:hover:border-zinc-600 cursor-pointer transition-all flex flex-col justify-between group min-h-[180px]"
            >
              <div className="space-y-2.5">
                <div className="w-10 h-10 rounded-2xl bg-black dark:bg-zinc-800 text-white dark:text-zinc-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Wand2 className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm sm:text-base text-zinc-900 dark:text-white flex items-center gap-1.5">
                  <span>Kendi Görevini Türet</span>
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                </h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  İşlem sayısını ve zorluğu belirleyin, durum makinesi algoritması size özel benzersiz bir şirket simülasyonu oluştursun.
                </p>
              </div>
              <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800/80 flex items-center justify-between text-xs font-semibold text-black dark:text-zinc-300">
                <span>Parametreleri Ayarla</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>

        {/* 2. Aşama: Çalışma Modu Seçimi */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-black dark:bg-white text-white dark:text-black text-xs flex items-center justify-center font-bold">2</span>
              <span>Çalışma Modunuzu Belirleyin</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Öğrenme Modu */}
            <div
              onClick={() => onSelectMode('ogrenme')}
              className={`rounded-3xl p-6 border-2 cursor-pointer transition-all flex gap-4 ${
                selectedMode === 'ogrenme'
                  ? 'border-black dark:border-white bg-white dark:bg-zinc-900 shadow-md ring-2 ring-black/10 dark:ring-white/20'
                  : 'border-zinc-200 dark:border-zinc-800/90 bg-white dark:bg-zinc-950/80 hover:border-zinc-400 dark:hover:border-zinc-700 hover:shadow-xs'
              }`}
            >
              <div className="w-11 h-11 rounded-2xl bg-black dark:bg-zinc-800 text-white dark:text-zinc-200 flex items-center justify-center shrink-0">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm sm:text-base text-zinc-900 dark:text-white">
                    Öğrenme Modu (Rehberli)
                  </h4>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                    Önerilen
                  </span>
                </div>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  İlk kez öğrenenler için idealdir. Takıldığınızda 4 aşamalı ipucu alabilir, her işlem için anlık kural açıklamalarını görebilirsiniz.
                </p>
              </div>
            </div>

            {/* Sınav Modu */}
            <div
              onClick={() => onSelectMode('calisma')}
              className={`rounded-3xl p-6 border-2 cursor-pointer transition-all flex gap-4 ${
                selectedMode === 'calisma'
                  ? 'border-black dark:border-white bg-white dark:bg-zinc-900 shadow-md ring-2 ring-black/10 dark:ring-white/20'
                  : 'border-zinc-200 dark:border-zinc-800/90 bg-white dark:bg-zinc-950/80 hover:border-zinc-400 dark:hover:border-zinc-700 hover:shadow-xs'
              }`}
            >
              <div className="w-11 h-11 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm sm:text-base text-zinc-900 dark:text-white">
                    Sınav / Çalışma Modu
                  </h4>
                </div>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  İpucu ve anlık düzeltme yok. Kayıtlarınızı kendi bilginizle tamamlayıp sonunda kapsamlı bir karne ve denetim raporu alırsınız.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Seçilen Senaryo Özeti & Başlat Butonu */}
        <div className="bg-black dark:bg-zinc-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl dark:border dark:border-zinc-800 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2">
              <span className="text-xs font-semibold tracking-wider text-zinc-400 uppercase font-mono">
                Hazır mısınız?
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                {selectedScenario.companyName} ile Simülasyonu Başlat
              </h3>
              <p className="text-xs sm:text-sm text-zinc-300 dark:text-zinc-400 max-w-2xl">
                Seçtiğiniz senaryoda {selectedScenario.transactions.length} ticari işlem sizi bekliyor. Tüm kayıtlarınızı yapıp T-hesaplarını ve Bilançonuzu eş zamanlı oluşturacaksınız.
              </p>
            </div>

            <button
              type="button"
              onClick={onStart}
              className="inline-flex items-center justify-center gap-2.5 px-7 py-4 bg-white text-black hover:bg-zinc-200 font-black text-sm sm:text-base rounded-2xl shadow-lg transition-all hover:scale-[1.02] cursor-pointer shrink-0"
            >
              <span>Simülasyona Başla</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-zinc-800 text-xs">
            <div>
              <span className="text-zinc-400 block">Kuruluş Tarihi</span>
              <span className="font-bold font-mono text-zinc-200">{selectedScenario.establishedDate}</span>
            </div>
            <div>
              <span className="text-zinc-400 block">Başlangıç Sermayesi</span>
              <span className="font-bold text-zinc-200">{formatCurrency(selectedScenario.initialCapital)}</span>
            </div>
            <div>
              <span className="text-zinc-400 block">Zorluk Seviyesi</span>
              <span className="font-bold capitalize text-zinc-200">{selectedScenario.difficulty}</span>
            </div>
            <div>
              <span className="text-zinc-400 block">Seçilen Mod</span>
              <span className="font-bold text-zinc-200">
                {selectedMode === 'ogrenme' ? 'Öğrenme (Rehberli)' : 'Sınav (Kendi Başına)'}
              </span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
