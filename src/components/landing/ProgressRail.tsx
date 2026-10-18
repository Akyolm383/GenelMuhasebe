import React from 'react';
import { motion } from 'motion/react';

export interface SlideNavInfo {
  id: string;
  number: string;
  label: string;
}

const SLIDE_NAV_ITEMS: SlideNavInfo[] = [
  { id: 'slide-01', number: '01', label: '01 • Giriş & Terminal' },
  { id: 'slide-02', number: '02', label: '02 • Canlı Akış Tüneli' },
  { id: 'slide-03', number: '03', label: '03 • Simülasyon Motoru' },
  { id: 'slide-04', number: '04', label: '04 • TDHP Anatomisi' },
  { id: 'slide-05', number: '05', label: '05 • Senaryo Başlatıcı' },
];

interface ProgressRailProps {
  activeSlide: string;
  onSelectSlide: (slideId: string) => void;
}

export const ProgressRail: React.FC<ProgressRailProps> = ({
  activeSlide,
  onSelectSlide,
}) => {
  return (
    <aside
      aria-label="Sunum İlerleme Çubuğu"
      className="fixed left-3 md:left-6 top-1/2 -translate-y-1/2 z-40 hidden sm:flex flex-col items-center"
    >
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md border border-[#C6C6CD] dark:border-zinc-800 shadow-lg rounded-full py-4 px-2.5 flex flex-col items-center gap-3 relative"
      >
        {/* Continuous vertical track line */}
        <div className="absolute top-6 bottom-6 w-[2px] bg-[#C6C6CD]/50 dark:bg-zinc-800 -z-0" />

        {SLIDE_NAV_ITEMS.map((item) => {
          const isActive = activeSlide === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectSlide(item.id)}
              aria-label={item.label}
              aria-current={isActive ? 'step' : undefined}
              className={`group relative z-10 flex items-center justify-center w-7 h-7 rounded-full font-mono text-[11px] transition-all cursor-pointer ${
                isActive
                  ? 'bg-black dark:bg-white text-white dark:text-black font-bold shadow-sm ring-2 ring-[#006C4A]/60 dark:ring-emerald-400/60 scale-105'
                  : 'bg-[#E5EEFF] dark:bg-zinc-900 border border-[#C6C6CD] dark:border-zinc-700 text-[#45464D] dark:text-zinc-400 font-semibold hover:bg-[#DCE9FF] dark:hover:bg-zinc-800'
              }`}
            >
              {item.number}
              <span className="absolute left-10 px-2.5 py-1 bg-[#213145] dark:bg-zinc-900 text-[#EAF1FF] dark:text-zinc-100 border border-white/10 font-sans text-[11px] font-medium rounded shadow-md opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {item.label}
              </span>
            </button>
          );
        })}
      </motion.div>
    </aside>
  );
};
