import React from 'react';
import { useAccountingStore } from '../store/useAccountingStore';
import { SCENARIOS } from '../data/scenarios';
import { 
  BookOpen, 
  GraduationCap, 
  RotateCcw, 
  Award,
  HelpCircle,
  Building2
} from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    mode, 
    setMode, 
    currentScenarioId, 
    setScenario, 
    resetAll, 
    runScenarioAudit,
    getActiveTransaction,
    requestNextHint
  } = useAccountingStore();

  const activeTx = getActiveTransaction();

  const handleReset = () => {
    if (window.confirm('Tüm kayıtlarınızı sıfırlamak istediğinize emin misiniz?')) {
      resetAll();
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between py-3 gap-3">
          {/* Logo ve Başlık */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center text-white shadow-sm shrink-0">
              <span className="font-mono font-bold text-lg tracking-tighter">GM</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-slate-900 leading-tight">
                  Genel Muhasebe Defteri
                </h1>
                <span className="text-[11px] font-semibold bg-zinc-100 text-zinc-900 border border-zinc-200 px-2 py-0.5 rounded-full">
                  İnteraktif
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Yevmiye → Büyük Defter → Mizan → Bilanço Öğrenme Simülatörü
              </p>
            </div>
          </div>

          {/* Orta Kısım: Senaryo Seçici & Mod Değiştirici */}
          <div className="flex items-center flex-wrap gap-2.5">
            {/* Senaryo Seçici */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
              <Building2 className="w-4 h-4 text-slate-500 ml-1.5" />
              <select
                value={currentScenarioId}
                onChange={(e) => setScenario(e.target.value)}
                className="bg-transparent font-medium text-slate-800 focus:outline-none cursor-pointer pr-2 py-0.5 text-xs"
              >
                {SCENARIOS.map((sc) => (
                  <option key={sc.id} value={sc.id}>
                    {sc.title} ({sc.difficulty})
                  </option>
                ))}
              </select>
            </div>

            {/* Mod Seçici (Öğrenme vs Çalışma) */}
            <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs font-medium">
              <button
                type="button"
                onClick={() => setMode('ogrenme')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-all ${
                  mode === 'ogrenme'
                    ? 'bg-white text-black shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Her işlemde anlık geri bildirim ve aşamalı ipuçları sunar."
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Öğrenme Modu</span>
              </button>

              <button
                type="button"
                onClick={() => setMode('calisma')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-all ${
                  mode === 'calisma'
                    ? 'bg-white text-emerald-700 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Sınav ortamı gibi: İpuçsuz çözün, en sonunda kapsamlı denetim raporu alın."
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Çalışma Modu</span>
              </button>
            </div>
          </div>

          {/* Sağ Kısım: İpucu, Denetim ve Sıfırlama Butonları */}
          <div className="flex items-center gap-2">
            {mode === 'ogrenme' && (
              <button
                type="button"
                onClick={() => requestNextHint(activeTx.id)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-2xs"
              >
                <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
                <span>İpucu İste</span>
              </button>
            )}

            <button
              type="button"
              onClick={runScenarioAudit}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-black hover:bg-zinc-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-xs"
            >
              <Award className="w-3.5 h-3.5" />
              <span>{mode === 'calisma' ? 'Kayıtları Denetle & Karne' : 'Genel Başarı Raporu'}</span>
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
              title="Kayıtları Sıfırla"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
