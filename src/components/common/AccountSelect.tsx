import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ACCOUNTS_LIST, getAccountByCode } from '../../core/accounts';
import { ChevronDown, Search, Check } from 'lucide-react';

interface AccountSelectProps {
  value: string;
  onChange: (accountCode: string) => void;
  placeholder?: string;
}

interface DropdownPosition {
  top: number;
  left: number;
  width: number;
  openUpward: boolean;
}

export const AccountSelect: React.FC<AccountSelectProps> = ({
  value,
  onChange,
  placeholder = 'TDHP Hesap kodu veya adı seçiniz...',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [position, setPosition] = useState<DropdownPosition>({
    top: 0,
    left: 0,
    width: 360,
    openUpward: false,
  });

  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedAccount = value ? getAccountByCode(value) : undefined;

  const updatePosition = () => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const dropdownHeight = 320;
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;

    const openUpward = spaceBelow < dropdownHeight && spaceAbove > spaceBelow;
    const width = Math.max(rect.width, 380);

    let left = rect.left;
    if (left + width > window.innerWidth - 16) {
      left = Math.max(16, window.innerWidth - width - 16);
    }

    setPosition({
      top: openUpward ? rect.top - 6 : rect.bottom + 6,
      left,
      width,
      openUpward,
    });
  };

  useEffect(() => {
    if (isOpen) {
      updatePosition();
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 40);

      const handleScrollOrResize = () => {
        updatePosition();
      };

      window.addEventListener('resize', handleScrollOrResize);
      window.addEventListener('scroll', handleScrollOrResize, true);

      return () => {
        clearTimeout(timer);
        window.removeEventListener('resize', handleScrollOrResize);
        window.removeEventListener('scroll', handleScrollOrResize, true);
      };
    }
  }, [isOpen]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (
        triggerRef.current &&
        !triggerRef.current.contains(target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const filteredAccounts = ACCOUNTS_LIST.filter(
    (acc) =>
      acc.code.includes(searchTerm.trim()) ||
      acc.name.toLowerCase().includes(searchTerm.trim().toLowerCase())
  );

  const handleSelect = (code: string) => {
    onChange(code);
    setIsOpen(false);
    setSearchTerm('');
  };

  const getNatureBadgeStyle = (nature: string) => {
    switch (nature) {
      case 'AKTIF':
        return 'bg-secondary-container/40 text-on-secondary-container border-secondary/30 dark:bg-emerald-950/70 dark:text-emerald-300 dark:border-emerald-800/60';
      case 'PASIF':
        return 'bg-accent-surface text-primary border-primary/30 dark:bg-[#3A1D16] dark:text-[#FFB4A4] dark:border-primary/40';
      case 'GELIR':
        return 'bg-secondary-fixed/50 text-secondary border-secondary/30 dark:bg-emerald-950/70 dark:text-emerald-300 dark:border-emerald-800/60';
      case 'GIDER':
        return 'bg-error-container/60 text-semantic-warning border-semantic-warning/30 dark:bg-rose-950/70 dark:text-rose-300 dark:border-rose-800/60';
      default:
        return 'bg-surface-muted text-text-secondary border-border-subtle dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700';
    }
  };

  const getNatureLabel = (nature: string, accountClass?: number) => {
    if (nature === 'AKTIF') {
      return accountClass === 2 ? 'Aktif • Duran Varlık' : 'Aktif • Dönen Varlık';
    }
    if (nature === 'PASIF') {
      if (accountClass === 5) return 'Pasif • Öz Kaynak';
      if (accountClass === 4) return 'Pasif • U.V. Yabancı Kaynak';
      return 'Pasif • K.V. Yabancı Kaynak';
    }
    if (nature === 'GELIR') return 'Gelir Tablosu • Gelir';
    if (nature === 'GIDER') return 'Maliyet / Gider Hesabı';
    return nature;
  };

  return (
    <div className="relative w-full">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full text-left px-3 py-2 bg-surface dark:bg-zinc-900 border rounded-xl flex items-center justify-between text-sm transition-all focus:outline-none cursor-pointer ${
          isOpen
            ? 'border-primary ring-2 ring-primary/15 dark:border-[#FFB4A4]'
            : 'border-border-subtle dark:border-zinc-800 hover:border-text-muted dark:hover:border-zinc-700'
        }`}
      >
        <div className="flex flex-wrap items-center gap-2 min-w-0">
          {selectedAccount ? (
            <>
              <span className="font-ledger-readout font-bold text-text-primary dark:text-white text-sm shrink-0">
                {selectedAccount.code}
              </span>
              <span className="font-semibold text-text-primary dark:text-zinc-100 uppercase tracking-tight truncate">
                {selectedAccount.name}
              </span>
              <span
                className={`text-[11px] font-ledger-readout px-2 py-0.5 rounded border shrink-0 ${getNatureBadgeStyle(
                  selectedAccount.nature
                )}`}
              >
                {getNatureLabel(selectedAccount.nature, selectedAccount.accountClass)}
              </span>
            </>
          ) : (
            <span className="text-text-muted dark:text-zinc-500 font-body-editorial text-xs sm:text-sm">
              {placeholder}
            </span>
          )}
        </div>
        <ChevronDown className="w-4 h-4 text-text-muted dark:text-zinc-500 shrink-0 ml-2" />
      </button>

      {isOpen &&
        createPortal(
          <div
            ref={dropdownRef}
            style={{
              position: 'fixed',
              top: position.openUpward ? undefined : `${position.top}px`,
              bottom: position.openUpward
                ? `${window.innerHeight - position.top}px`
                : undefined,
              left: `${position.left}px`,
              width: `${position.width}px`,
              zIndex: 99999,
            }}
            className="bg-surface dark:bg-zinc-950 border border-border-subtle dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden ring-1 ring-black/5 dark:ring-zinc-800"
          >
            {/* Arama Çubuğu */}
            <div className="p-3 border-b border-border-subtle dark:border-zinc-800 bg-surface-muted/60 dark:bg-zinc-900 flex items-center gap-2">
              <Search className="w-4 h-4 text-text-muted shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Hesap kodu (örn: 153, 191, 320) veya adı ara..."
                className="w-full text-xs font-ledger-readout bg-transparent border-none focus:outline-none focus:ring-0 text-text-primary dark:text-white placeholder-text-muted"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="text-[11px] font-ledger-readout text-primary hover:underline px-1 cursor-pointer"
                >
                  Temizle
                </button>
              )}
            </div>

            {/* Hesap Listesi */}
            <div className="max-h-64 overflow-y-auto divide-y divide-border-subtle/60 dark:divide-zinc-800">
              {filteredAccounts.length > 0 ? (
                filteredAccounts.map((acc) => {
                  const isSelected = acc.code === value;
                  return (
                    <div
                      key={acc.code}
                      onClick={() => handleSelect(acc.code)}
                      className={`px-3.5 py-2.5 cursor-pointer flex items-center justify-between hover:bg-surface-muted/60 dark:hover:bg-zinc-900 transition-colors text-xs ${
                        isSelected
                          ? 'bg-accent-surface/50 dark:bg-zinc-900 font-semibold'
                          : ''
                      }`}
                    >
                      <div className="flex items-center gap-2.5 pr-2 min-w-0">
                        <span className="font-ledger-readout font-bold text-text-primary dark:text-zinc-200 text-xs w-9 shrink-0">
                          {acc.code}
                        </span>
                        <div className="min-w-0">
                          <span className="text-text-primary dark:text-white text-xs font-semibold block truncate">
                            {acc.name}
                          </span>
                          <span className="text-[11px] text-text-muted dark:text-zinc-400 block truncate font-body-editorial">
                            {acc.description}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0 ml-2">
                        <span
                          className={`text-[10px] font-ledger-readout font-bold uppercase px-2 py-0.5 rounded border tracking-wide ${getNatureBadgeStyle(
                            acc.nature
                          )}`}
                        >
                          {acc.nature}
                        </span>
                        {isSelected && (
                          <Check className="w-4 h-4 text-primary ml-1 shrink-0" />
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-5 text-center text-xs font-ledger-readout text-text-muted">
                  &quot;{searchTerm}&quot; ile eşleşen TDHP hesabı bulunamadı.
                </div>
              )}
            </div>

            {/* Alt Çubuk */}
            <div className="px-3.5 py-2 bg-surface-muted/50 dark:bg-zinc-900 border-t border-border-subtle dark:border-zinc-800 text-[11px] font-ledger-readout text-text-muted flex items-center justify-between">
              <span>{filteredAccounts.length} hesap listeleniyor</span>
              <span>TDHP &amp; VUK Standart</span>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};
