import React, { useState } from 'react';
import { useAccountingStore, type AppMode } from '../../store/useAccountingStore';
import { SCENARIOS } from '../../data/scenarios';
import { LandingNavbar } from '../landing/LandingNavbar';
import { LandingHero } from '../landing/LandingHero';
import { AccountingPipelineSection } from '../landing/AccountingPipelineSection';
import { BentoFeaturesSection } from '../landing/BentoFeaturesSection';
import { InteractiveTdhbExplorer } from '../landing/InteractiveTdhbExplorer';
import { ScenarioSelectionSection } from '../landing/ScenarioSelectionSection';
import { LandingFooter } from '../landing/LandingFooter';
import { ScenarioGeneratorModal } from '../ScenarioGeneratorModal';

interface WelcomeScreenProps {
  onOpenAccountsGuide: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onOpenAccountsGuide }) => {
  const { 
    startScenario, 
    getAllScenarios,
    currentScenarioId: storeScenarioId,
    mode: storeMode 
  } = useAccountingStore();

  const allScenarios = getAllScenarios();
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(
    storeScenarioId || allScenarios[0]?.id || SCENARIOS[0].id
  );
  const [selectedMode, setSelectedMode] = useState<AppMode>(storeMode || 'ogrenme');
  const [showGeneratorModal, setShowGeneratorModal] = useState(false);

  const handleStart = () => {
    startScenario(selectedScenarioId, selectedMode);
  };

  const scrollToScenarios = () => {
    const el = document.getElementById('scenario-selection');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-black text-zinc-900 dark:text-zinc-100 flex flex-col font-sans transition-colors selection:bg-zinc-200 selection:text-black dark:selection:bg-zinc-800 dark:selection:text-white">
      {/* 1. Üst Sabit Floating Navigasyon Barı */}
      <LandingNavbar
        onOpenAccountsGuide={onOpenAccountsGuide}
        onScrollToScenarios={scrollToScenarios}
      />

      {/* 2. Hero Bölümü (Başlık, Değer Önerisi, Canlı İnteraktif Mini Simülatör) */}
      <LandingHero
        onScrollToScenarios={scrollToScenarios}
        onOpenGenerator={() => setShowGeneratorModal(true)}
      />

      {/* 3. The Accounting Pipeline (4 Adımlı Scrollytelling Bölümü) */}
      <AccountingPipelineSection />

      {/* 4. Bento Grid (Platformun 4 Temel Süper Gücü) */}
      <BentoFeaturesSection />

      {/* 5. Tekdüzen Hesap Planı 6 Temel Sınıfı İnteraktif Keşif Çubuğu */}
      <InteractiveTdhbExplorer onOpenAccountsGuide={onOpenAccountsGuide} />

      {/* 6. Senaryo & Çalışma Modu Seçimi (Simülasyon Başlatıcı) */}
      <ScenarioSelectionSection
        scenarios={allScenarios}
        selectedScenarioId={selectedScenarioId}
        onSelectScenarioId={setSelectedScenarioId}
        selectedMode={selectedMode}
        onSelectMode={setSelectedMode}
        onOpenGenerator={() => setShowGeneratorModal(true)}
        onStart={handleStart}
      />

      {/* 7. Alt Bilgi Alanı (Footer) */}
      <LandingFooter
        onOpenAccountsGuide={onOpenAccountsGuide}
        onScrollToScenarios={scrollToScenarios}
      />

      {/* 8. Algoritmik Rastgele Görev / Senaryo Üretici Modal */}
      <ScenarioGeneratorModal
        isOpen={showGeneratorModal}
        onClose={() => setShowGeneratorModal(false)}
        selectedMode={selectedMode}
      />
    </div>
  );
};
