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
  placeholder = 'Hesap seçiniz veya arayınız...',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [position, setPosition] = useState<DropdownPosition>({ top: 0, left: 0, width: 340, openUpward: false });
  
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedAccount = value ? getAccountByCode(value) : undefined;

  // Pozisyonu hesapla (ekran dışına taşmaması ve yukarı/aşağı akıllı açılması için)
  const updatePosition = () => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const dropdownHeight = 300; // Yaklaşık maksimum yükseklik
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;

    const openUpward = spaceBelow < dropdownHeight && spaceAbove > spaceBelow;
    const width = Math.max(rect.width, 360);

    // Sağ kenardan taşmayı önle
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
      }, 50);

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
        triggerRef.current && !triggerRef.current.contains(target) &&
        dropdownRef.current && !dropdownRef.current.contains(target)
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

  const getNatureBadgeColor = (nature: string) => {
    switch (nature) {
      case 'AKTIF':
        return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950/70 dark:text-blue-300 dark:border-blue-900/60';
      case 'PASIF':
        return 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/70 dark:text-amber-300 dark:border-amber-900/60';
      case 'GELIR':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/70 dark:text-emerald-300 dark:border-emerald-900/60';
      case 'GIDER':
        return 'bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-950/70 dark:text-rose-300 dark:border-rose-900/60';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200 dark:bg-zinc-900 dark:text-zinc-300 dark:border-zinc-800';
    }
  };

  return (
    <div className="relative w-full">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full text-left px-3 py-2 bg-white dark:bg-zinc-900 border rounded-lg shadow-xs flex items-center justify-between text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer ${
          isOpen 
            ? 'border-indigo-500 ring-2 ring-indigo-500/20' 
            : 'border-slate-300 dark:border-zinc-800 hover:border-slate-400 dark:hover:border-zinc-700'
        }`}
      >
        <div className="flex items-center gap-2 truncate">
          {selectedAccount ? (
            <>
              <span className="font-mono font-bold text-indigo-700 dark:text-zinc-200 bg-indigo-50 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-xs shrink-0">
                {selectedAccount.code}
              </span>
              <span className="font-medium text-slate-800 dark:text-zinc-200 truncate">{selectedAccount.name}</span>
            </>
          ) : (
            <span className="text-slate-400 dark:text-zinc-500">{placeholder}</span>
          )}
        </div>
        <ChevronDown className="w-4 h-4 text-slate-400 dark:text-zinc-500 shrink-0 ml-1" />
      </button>

      {/* React Portal ile document.body'ye taşınan açılır menü (overflow-hidden veya table engeline takılmaz) */}
      {isOpen &&
        createPortal(
          <div
            ref={dropdownRef}
            style={{
              position: 'fixed',
              top: position.openUpward ? undefined : `${position.top}px`,
              bottom: position.openUpward ? `${window.innerHeight - position.top}px` : undefined,
              left: `${position.left}px`,
              width: `${position.width}px`,
              zIndex: 99999,
            }}
            className="bg-white dark:bg-zinc-950 border border-slate-300 dark:border-zinc-800 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-100 ring-1 ring-slate-900/10 dark:ring-zinc-800"
          >
            {/* Arama Çubuğu */}
            <div className="p-2.5 border-b border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900 flex items-center gap-2">
              <Search className="w-4 h-4 text-slate-400 dark:text-zinc-500 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Hesap kodu (örn: 100) veya adı ile filtrele..."
                className="w-full text-xs bg-transparent border-none focus:outline-none focus:ring-0 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 font-medium"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="text-xs text-slate-400 hover:text-slate-600 dark:text-zinc-400 dark:hover:text-zinc-200 px-1"
                >
                  Temizle
                </button>
              )}
            </div>

            {/* Hesap Listesi */}
            <div className="max-h-64 overflow-y-auto divide-y divide-slate-100 dark:divide-zinc-800">
              {filteredAccounts.length > 0 ? (
                filteredAccounts.map((acc) => {
                  const isSelected = acc.code === value;
                  return (
                    <div
                      key={acc.code}
                      onClick={() => handleSelect(acc.code)}
                      className={`px-3 py-2.5 cursor-pointer flex items-center justify-between hover:bg-indigo-50/80 dark:hover:bg-zinc-900 transition-colors text-xs ${
                        isSelected ? 'bg-indigo-50/90 dark:bg-zinc-900/90 font-semibold' : ''
                      }`}
                    >
                      <div className="flex items-center gap-2.5 pr-2 truncate">
                        <span className="font-mono font-bold text-slate-800 dark:text-zinc-200 text-xs w-10 shrink-0">
                          {acc.code}
                        </span>
                        <div className="truncate">
                          <span className="text-slate-900 dark:text-white text-xs font-medium block truncate">
                            {acc.name}
                          </span>
                          <span className="text-[10px] text-slate-500 dark:text-zinc-400 block truncate font-normal">
                            {acc.description}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0 ml-2">
                        <span
                          className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded border tracking-wide ${getNatureBadgeColor(
                            acc.nature
                          )}`}
                        >
                          {acc.nature}
                        </span>
                        {isSelected && <Check className="w-4 h-4 text-indigo-600 dark:text-zinc-200 ml-1 shrink-0" />}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-5 text-center text-xs text-slate-500 dark:text-zinc-400 font-medium">
                  &quot;{searchTerm}&quot; ile eşleşen hesap bulunamadı.
                </div>
              )}
            </div>

            {/* Alt Çubuk: Hızlı Bilgi */}
            <div className="px-3 py-1.5 bg-slate-50 dark:bg-zinc-900 border-t border-slate-100 dark:border-zinc-800 text-[10px] text-slate-500 dark:text-zinc-400 flex items-center justify-between">
              <span>{filteredAccounts.length} hesap listeleniyor</span>
              <span className="font-mono">THP Standart</span>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};
