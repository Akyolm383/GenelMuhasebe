import React, { useState, useEffect, useCallback } from 'react';
import { useAccountingStore, type AppMode } from '../../store/useAccountingStore';
import { SCENARIOS } from '../../data/scenarios';
import { LandingNavbar } from '../landing/LandingNavbar';
import { LandingHero } from '../landing/LandingHero';
import { AccountingPipelineSection } from '../landing/AccountingPipelineSection';
import { InteractiveTdhbExplorer } from '../landing/InteractiveTdhbExplorer';
import { ScenarioSelectionSection } from '../landing/ScenarioSelectionSection';
import { ScenarioGeneratorModal } from '../ScenarioGeneratorModal';

const SECTION_IDS = ['canli-sahne', 'koreografi', 'tdhp-atlasi', 'dosyalar'];

export interface WelcomeScreenProps {
  readonly onOpenAccountsGuide: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onOpenAccountsGuide,
}) => {
  const {
    startScenario,
    getAllScenarios,
    currentScenarioId: storeScenarioId,
    mode: storeMode,
  } = useAccountingStore();

  const allScenarios = getAllScenarios();
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(
    storeScenarioId || allScenarios[0]?.id || SCENARIOS[0].id
  );
  const [selectedMode, setSelectedMode] = useState<AppMode>(
    storeMode || 'ogrenme'
  );
  // Sayfa ilk açıldığında her zaman 01 numaralı ilk senaryo seçili başlar
  const [activeHeroScenarioIndex, setActiveHeroScenarioIndex] =
    useState<number>(0);
  const [showGeneratorModal, setShowGeneratorModal] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('canli-sahne');

  const scrollToSection = useCallback((sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(sectionId);
    }
  }, []);

  // Deterministik yukarıdan-aşağıya scroll-spy:
  // Sayfanın en üstündeyken 1. sekme (canli-sahne), aşağı indikçe sırasıyla 2., 3. ve 4. sekme aktif olur.
  useEffect(() => {
    const updateActiveSectionOnScroll = () => {
      const scrollY = window.scrollY;
      if (scrollY < 160) {
        setActiveSection('canli-sahne');
        return;
      }

      const viewportTrigger = window.innerHeight * 0.32;
      let currentId = SECTION_IDS[0];

      for (const id of SECTION_IDS) {
        const el = document.getElementById(id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= viewportTrigger) {
          currentId = id;
        }
      }

      setActiveSection(currentId);
    };

    updateActiveSectionOnScroll();
    window.addEventListener('scroll', updateActiveSectionOnScroll, {
      passive: true,
    });
    window.addEventListener('resize', updateActiveSectionOnScroll, {
      passive: true,
    });
    return () => {
      window.removeEventListener('scroll', updateActiveSectionOnScroll);
      window.removeEventListener('resize', updateActiveSectionOnScroll);
    };
  }, []);

  const handleSelectHeroScenario = (idx: number) => {
    setActiveHeroScenarioIndex(idx);
    if (allScenarios[idx]) {
      setSelectedScenarioId(allScenarios[idx].id);
    }
  };

  const handleSelectDossierScenario = (scenarioId: string) => {
    setSelectedScenarioId(scenarioId);
    const idx = allScenarios.findIndex((s) => s.id === scenarioId);
    if (idx >= 0 && idx < 3) {
      setActiveHeroScenarioIndex(idx);
    }
  };

  const handleToggleMode = () => {
    setSelectedMode((prev) => (prev === 'ogrenme' ? 'calisma' : 'ogrenme'));
  };

  const handleStart = () => {
    startScenario(selectedScenarioId, selectedMode);
  };

  return (
    <div className="min-h-screen bg-background dark:bg-[#121211] text-text-primary dark:text-[#F5F3EE] font-body-editorial paper-texture flex flex-col justify-between antialiased selection:bg-primary-container selection:text-white transition-colors">
      {/* Shared Component: TopNavBar (Capsule Shape) */}
      <LandingNavbar
        activeSection={activeSection}
        selectedMode={selectedMode}
        onToggleMode={handleToggleMode}
        onSelectSection={scrollToSection}
        onOpenAccountsGuide={onOpenAccountsGuide}
        onOpenGenerator={() => setShowGeneratorModal(true)}
        onStartSimulator={handleStart}
      />

      {/* Main Content Container with Top Spacing for Capsule Nav */}
      <main className="pt-28 pb-20 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
        {/* SECTION 01: Asymmetric Split Hero & Tactile Financial Voucher Stage (6:6) */}
        <LandingHero
          activeHeroScenarioIndex={activeHeroScenarioIndex}
          onSelectHeroScenarioIndex={handleSelectHeroScenario}
          onStartFullSimulator={handleStart}
          onScrollToDossiers={() => scrollToSection('dosyalar')}
        />

        {/* SECTION 02 (Top 7:5 Split) & SECTION 03 (Bottom 12-Col) */}
        <div className="space-y-20">
          <AccountingPipelineSection
            activeHeroScenarioIndex={activeHeroScenarioIndex}
          />

          {/* SECTION 03: Hesap Kodları Rehberi */}
          <InteractiveTdhbExplorer onOpenAccountsGuide={onOpenAccountsGuide} />
        </div>

        {/* SECTION 04: Çalışma Soruları & Uygulama Senaryoları */}
        <ScenarioSelectionSection
          scenarios={allScenarios}
          selectedScenarioId={selectedScenarioId}
          onSelectScenarioId={handleSelectDossierScenario}
          selectedMode={selectedMode}
          onSelectMode={setSelectedMode}
          onOpenGenerator={() => setShowGeneratorModal(true)}
          onOpenAccountsGuide={onOpenAccountsGuide}
          onStart={handleStart}
        />
      </main>

      {/* Shared Component: Footer (Student-Friendly Editorial Type) */}
      <footer className="w-full bg-background dark:bg-[#121211] border-t border-border-subtle dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Brand & Copyright */}
          <div className="space-y-2 text-center md:text-left">
            <div className="text-[1.25rem] font-hero-display font-bold text-text-primary dark:text-[#F5F3EE]">
              Genel Muhasebe Stüdyosu
            </div>
            <p className="font-ledger-readout text-text-secondary dark:text-zinc-400 text-[0.8125rem]">
              Üniversite Genel Muhasebe I &amp; II Dersleri İçin İnteraktif Yevmiye, T-Cetveli, Mizan ve Bilanço Çalışma Platformu
            </p>
            <p className="text-[0.75rem] font-ledger-readout text-text-muted dark:text-zinc-500">
              101 Alınan Çekler • 103 Verilen Çekler (-) • 191/391 KDV Hesaplamaları • Kendin Doldur T-Cetveli &amp; Bilanço Pratiği
            </p>
          </div>

          {/* Footer Navigation Links */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-[0.8125rem] font-ledger-readout">
            <button
              type="button"
              onClick={onOpenAccountsGuide}
              className="text-text-primary dark:text-[#F5F3EE] underline underline-offset-4 font-semibold cursor-pointer hover:text-primary transition-colors"
            >
              Hesap Kodları Sözlüğü
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('canli-sahne')}
              className="text-text-secondary dark:text-zinc-400 hover:text-text-primary dark:hover:text-white transition-colors cursor-pointer"
            >
              01 • Yevmiye &amp; T-Cetveli
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('koreografi')}
              className="text-text-secondary dark:text-zinc-400 hover:text-text-primary dark:hover:text-white transition-colors cursor-pointer"
            >
              02 • 4 Adımda Muhasebe
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('tdhp-atlasi')}
              className="text-text-secondary dark:text-zinc-400 hover:text-text-primary dark:hover:text-white transition-colors cursor-pointer"
            >
              03 • Hesap Rehberi
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedMode('calisma');
                scrollToSection('dosyalar');
              }}
              className="text-text-secondary dark:text-zinc-400 hover:text-text-primary dark:hover:text-white transition-colors cursor-pointer"
            >
              04 • Çalışma Soruları
            </button>
          </div>
        </div>
      </footer>

      {/* Dinamik Senaryo / Görev Üretici Modal */}
      <ScenarioGeneratorModal
        isOpen={showGeneratorModal}
        onClose={() => setShowGeneratorModal(false)}
        selectedMode={selectedMode}
      />
    </div>
  );
};
