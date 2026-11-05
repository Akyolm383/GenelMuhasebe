import React, { useState } from 'react';
import {
  useAccountingStore,
  type PracticeLedgerMovement,
} from '../store/useAccountingStore';
import {
  formatCurrency,
  deriveLedger,
} from '../core/accountingEngine';
import type { JournalEntry } from '../types/accounting';
import { ACCOUNTS_LIST, getAccountByCode } from '../core/accounts';
import {
  Scale,
  Search,
  ArrowUpRight,
  ArrowDownLeft,
  Eye,
  Edit3,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Plus,
  Trash2,
  X,
  FileText,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Lock,
  BookOpen,
} from 'lucide-react';

export const LedgerView: React.FC = () => {
  const {
    getLedgerAccounts,
    getAllJournalEntries,
    setActiveTransactionIndex,
    setActiveTab,
    getCurrentScenario,
    ledgerViewMode: viewMode,
    setLedgerViewMode: setViewMode,
    practiceLedgerData: practiceData,
    setPracticeLedgerData: setPracticeData,
    practiceAccountCodes,
    setPracticeAccountCodes,
  } = useAccountingStore();

  const [filterQuery, setFilterQuery] = useState('');
  const [filterClass, setFilterClass] = useState<number | 'all'>('all');
  const [isReferenceOpen, setIsReferenceOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 1024;
    }
    return true;
  });
  const [isAddAccountModalOpen, setIsAddAccountModalOpen] = useState(false);
  const [modalSearchQuery, setModalSearchQuery] = useState('');
  const [modalClassFilter, setModalClassFilter] = useState<number | 'all'>('all');

  const userLedgerAccounts = getLedgerAccounts();
  const userJournalEntries = getAllJournalEntries();
  const scenario = getCurrentScenario();

  // Senaryonun beklenen resmi yevmiye maddeleri
  const expectedJournalEntries: JournalEntry[] = scenario.transactions.map(
    (tx, idx) => ({
      id: 'exp_' + tx.id,
      transactionId: tx.id,
      entryNo: idx + 1,
      date: tx.date,
      description: tx.description,
      lines: tx.expectedEntry.lines.map((l, lIdx) => ({
        id: `exp_l_${idx}_${lIdx}`,
        accountCode: l.accountCode,
        debit: l.debit,
        credit: l.credit,
      })),
    })
  );
  const expectedLedgerAccounts = deriveLedger(expectedJournalEntries);

  const hasUserJournal = userJournalEntries.length > 0;
  const displayJournalEntries = hasUserJournal
    ? userJournalEntries
    : expectedJournalEntries;

  const ledgerAccounts =
    userLedgerAccounts.length > 0
      ? userLedgerAccounts
      : expectedLedgerAccounts;

  const [practiceResult, setPracticeResult] = useState<{
    isChecked: boolean;
    isCorrect: boolean;
    errors: string[];
  }>({ isChecked: false, isCorrect: false, errors: [] });

  const displayedAutoAccounts = (
    filterClass === 'all'
      ? ledgerAccounts
      : ledgerAccounts.filter((a) => a.accountClass === filterClass)
  ).filter(
    (acc) =>
      acc.accountCode.includes(filterQuery.trim()) ||
      acc.accountName.toLowerCase().includes(filterQuery.trim().toLowerCase())
  );

  const formatNatureLabel = (nature: string) => {
    if (nature.includes('DUZENLEYICI') || nature.includes('DÜZENLEYİCİ')) return 'DÜZENLEYİCİ (-)';
    if (nature === 'GELIR') return 'GELİR';
    if (nature === 'GIDER') return 'GİDER';
    return nature;
  };

  const getNatureBadgeColor = (nature: string) => {
    if (nature.includes('DUZENLEYICI') || nature.includes('DÜZENLEYİCİ')) {
      return 'bg-amber-500/10 text-amber-600 border-amber-500/30 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/40';
    }
    switch (nature) {
      case 'AKTIF':
        return 'bg-secondary-container/40 text-on-secondary-container border-secondary/30 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/40';
      case 'PASIF':
        return 'bg-accent-surface text-primary border-primary/30 dark:bg-[#3A1D16] dark:text-[#FFB4A4] dark:border-primary/40';
      case 'GELIR':
        return 'bg-secondary-fixed/50 text-secondary border-secondary/30 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/40';
      case 'GIDER':
        return 'bg-error-container/60 text-semantic-warning border-semantic-warning/30 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800/40';
      default:
        return 'bg-surface-muted text-text-secondary border-border-subtle dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700';
    }
  };

  const handleMovementClick = (txId: string) => {
    const index = scenario.transactions.findIndex((t) => t.id === txId);
    if (index !== -1) {
      setActiveTransactionIndex(index);
      setActiveTab('yevmiye');
    }
  };

  // --- SINAV PROVASI HESAP AÇMA & HAREKET YÖNETİMİ ---

  const handleAddAccount = (code: string) => {
    if (practiceAccountCodes.includes(code)) return;
    setPracticeAccountCodes([...practiceAccountCodes, code]);
    setPracticeData((prev) => ({
      ...prev,
      [code]: prev[code] || {
        debitMovements: [
          {
            id: 'deb_' + Math.random().toString(36).substring(2, 8),
            entryNo: '1',
            amount: '',
          },
        ],
        creditMovements: [],
        debitTotal: '',
        creditTotal: '',
        balance: '',
        direction: 'BORC',
        isClosed: false,
      },
    }));
    setIsAddAccountModalOpen(false);
  };

  const handleRemoveAccount = (code: string) => {
    setPracticeAccountCodes(practiceAccountCodes.filter((c) => c !== code));
    setPracticeData((prev) => {
      const updated = { ...prev };
      delete updated[code];
      return updated;
    });
  };

  const handleAddMovement = (code: string, side: 'debit' | 'credit') => {
    const newMov: PracticeLedgerMovement = {
      id: 'mov_' + Math.random().toString(36).substring(2, 8),
      entryNo: '',
      amount: '',
    };
    setPracticeData((prev) => {
      const cur = prev[code] || {
        debitMovements: [],
        creditMovements: [],
        debitTotal: '',
        creditTotal: '',
        balance: '',
        direction: 'BORC',
        isClosed: false,
      };
      if (side === 'debit') {
        return {
          ...prev,
          [code]: {
            ...cur,
            debitMovements: [...(cur.debitMovements || []), newMov],
          },
        };
      } else {
        return {
          ...prev,
          [code]: {
            ...cur,
            creditMovements: [...(cur.creditMovements || []), newMov],
          },
        };
      }
    });
  };

  const handleUpdateMovement = (
    code: string,
    side: 'debit' | 'credit',
    movId: string,
    field: 'entryNo' | 'amount',
    val: string
  ) => {
    setPracticeData((prev) => {
      const cur = prev[code];
      if (!cur) return prev;
      const listKey = side === 'debit' ? 'debitMovements' : 'creditMovements';
      const list = cur[listKey] || [];
      const updated = list.map((m) =>
        m.id === movId ? { ...m, [field]: val } : m
      );
      return {
        ...prev,
        [code]: {
          ...cur,
          [listKey]: updated,
        },
      };
    });
  };

  const handleRemoveMovement = (
    code: string,
    side: 'debit' | 'credit',
    movId: string
  ) => {
    setPracticeData((prev) => {
      const cur = prev[code];
      if (!cur) return prev;
      const listKey = side === 'debit' ? 'debitMovements' : 'creditMovements';
      const list = cur[listKey] || [];
      return {
        ...prev,
        [code]: {
          ...cur,
          [listKey]: list.filter((m) => m.id !== movId),
        },
      };
    });
  };

  const handlePracticeFieldChange = (
    code: string,
    field: 'debitTotal' | 'creditTotal' | 'balance' | 'direction',
    val: string
  ) => {
    setPracticeData((prev) => ({
      ...prev,
      [code]: {
        ...prev[code],
        debitTotal: prev[code]?.debitTotal || '',
        creditTotal: prev[code]?.creditTotal || '',
        balance: prev[code]?.balance || '',
        direction: prev[code]?.direction || 'BORC',
        [field]: val,
      },
    }));
  };

  const handleToggleCloseAccount = (code: string) => {
    setPracticeData((prev) => {
      const cur = prev[code];
      if (!cur) return prev;
      return {
        ...prev,
        [code]: {
          ...cur,
          isClosed: !cur.isClosed,
        },
      };
    });
  };

  // --- SINAV PROVASI DENETİMİ (KONTROL ET) ---
  const handleCheckPractice = () => {
    const errors: string[] = [];
    const requiredAccountCodes = Array.from(
      new Set(expectedLedgerAccounts.map((a) => a.accountCode))
    );

    // 1. Eksik Açılan Hesaplar
    requiredAccountCodes.forEach((code) => {
      if (!practiceAccountCodes.includes(code)) {
        const accDef = getAccountByCode(code);
        errors.push(
          `Eksik Hesap: ${code} ${accDef?.name || 'Hesap'} yevmiye kayıtlarında yer alıyor ancak T-cetveli açılmamış.`
        );
      }
    });

    // 2. Gereksiz Açılan Hesaplar
    practiceAccountCodes.forEach((code) => {
      if (!requiredAccountCodes.includes(code)) {
        const accDef = getAccountByCode(code);
        errors.push(
          `Gereksiz Hesap: ${code} ${accDef?.name || 'Hesap'} bu senaryonun hiçbir yevmiye maddesinde kullanılmamıştır.`
        );
      }
    });

    // 3. Hesapların Detaylı Değerlendirmesi
    practiceAccountCodes.forEach((code) => {
      const expAcc = expectedLedgerAccounts.find((a) => a.accountCode === code);
      if (!expAcc) return; // Zaten gereksiz hesap olarak raporlandı

      const uData = practiceData[code] || {
        debitTotal: '0',
        creditTotal: '0',
        balance: '0',
        direction: 'BORC',
        isClosed: false,
      };

      const uDebit = parseFloat(uData.debitTotal) || 0;
      const uCredit = parseFloat(uData.creditTotal) || 0;
      const uBal = parseFloat(uData.balance) || 0;
      const uDir = uData.direction;

      // Borç Toplamı Doğrulaması
      if (Math.abs(uDebit - expAcc.totalDebit) > 0.01) {
        errors.push(
          `${expAcc.accountCode} ${expAcc.accountName}: Borç toplamı yanlış. (Girilen: ${formatCurrency(
            uDebit
          )}, Olması gereken: ${formatCurrency(expAcc.totalDebit)})`
        );
      }

      // Alacak Toplamı Doğrulaması
      if (Math.abs(uCredit - expAcc.totalCredit) > 0.01) {
        errors.push(
          `${expAcc.accountCode} ${expAcc.accountName}: Alacak toplamı yanlış. (Girilen: ${formatCurrency(
            uCredit
          )}, Olması gereken: ${formatCurrency(expAcc.totalCredit)})`
        );
      }

      // Bakiye Tutarı Doğrulaması
      if (Math.abs(uBal - expAcc.balance) > 0.01) {
        errors.push(
          `${expAcc.accountCode} ${expAcc.accountName}: Kalan bakiye tutarı yanlış. (Girilen: ${formatCurrency(
            uBal
          )}, Olması gereken: ${formatCurrency(expAcc.balance)})`
        );
      }

      // Bakiye Yönü Doğrulaması
      if (expAcc.balance > 0 && uDir !== expAcc.balanceDirection) {
        const dirName =
          expAcc.balanceDirection === 'BORC'
            ? 'Borç Bakiyesi'
            : 'Alacak Bakiyesi';
        errors.push(
          `${expAcc.accountCode} ${expAcc.accountName}: Bakiye yönü hatalı. Bu hesap ${dirName} vermelidir.`
        );
      } else if (expAcc.balance === 0 && uDir !== 'DENK') {
        errors.push(
          `${expAcc.accountCode} ${expAcc.accountName}: Borç ve alacak toplamı birbirine eşit olduğundan hesap 'Denk (Kapanmış)' olmalıdır.`
        );
      }

      // Kapatılma Kontrolü
      if (!uData.isClosed) {
        errors.push(
          `${expAcc.accountCode} ${expAcc.accountName}: Hesap bakiye hesaplamasından sonra 'Hesabı Kapat' butonuyla çift çizgi çekilerek kapatılmamış.`
        );
      }
    });

    const isPassed = errors.length === 0 && practiceAccountCodes.length > 0;

    if (isPassed) {
      import('canvas-confetti').then((confetti) => {
        confetti.default({
          particleCount: 85,
          spread: 75,
          origin: { y: 0.6 },
        });
      });
    }

    setPracticeResult({
      isChecked: true,
      isCorrect: isPassed,
      errors,
    });
  };

  // --- ÖRNEK ÇÖZÜMÜ YÜKLE ---
  const handleAutoFillPractice = () => {
    const codes: string[] = [];
    const filled: Record<string, typeof practiceData[string]> = {};

    expectedLedgerAccounts.forEach((acc) => {
      codes.push(acc.accountCode);
      filled[acc.accountCode] = {
        debitMovements: acc.debitMovements.map((m, idx) => ({
          id: `deb_${acc.accountCode}_${idx}`,
          entryNo: String(m.entryNo),
          amount: String(m.amount),
        })),
        creditMovements: acc.creditMovements.map((m, idx) => ({
          id: `crd_${acc.accountCode}_${idx}`,
          entryNo: String(m.entryNo),
          amount: String(m.amount),
        })),
        debitTotal: acc.totalDebit.toString(),
        creditTotal: acc.totalCredit.toString(),
        balance: acc.balance.toString(),
        direction: acc.balanceDirection,
        isClosed: true,
      };
    });

    setPracticeAccountCodes(codes);
    setPracticeData(filled);
    setPracticeResult({ isChecked: false, isCorrect: false, errors: [] });
  };

  const handleResetPractice = () => {
    setPracticeAccountCodes([]);
    setPracticeData({});
    setPracticeResult({ isChecked: false, isCorrect: false, errors: [] });
  };

  const modalFilteredAccounts = ACCOUNTS_LIST.filter((acc) => {
    const matchesQuery =
      acc.code.includes(modalSearchQuery.trim()) ||
      acc.name.toLowerCase().includes(modalSearchQuery.trim().toLowerCase());
    const matchesClass =
      modalClassFilter === 'all' || acc.accountClass === modalClassFilter;
    return matchesQuery && matchesClass;
  });

  return (
    <div className="space-y-6">
      {/* 1. ÜST BİLGİ VE MOD SEÇİM ÇUBUĞU */}
      <div className="bg-surface dark:bg-[#1C1B19] p-5 sm:p-6 rounded-[2rem] shadow-[0_12px_32px_-8px_rgba(24,24,27,0.05)] border border-border-subtle dark:border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors">
        <div>
          <div className="flex items-center gap-2.5">
            <Scale className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-card-title font-bold text-text-primary dark:text-white">
              Büyük Defter (T-Hesapları Cetveli)
            </h3>
            <span className="text-xs font-ledger-readout bg-surface-muted dark:bg-zinc-800 text-text-primary dark:text-zinc-200 px-3 py-0.5 rounded-full font-semibold border border-border-subtle dark:border-zinc-700 tabular-nums">
              {viewMode === 'auto'
                ? `${ledgerAccounts.length} Aktif Hesap`
                : `${practiceAccountCodes.length} Açılan Hesap`}
            </span>
          </div>
          <p className="text-xs sm:text-sm font-body-editorial text-text-secondary dark:text-zinc-400 mt-1">
            {viewMode === 'auto'
              ? 'Yevmiye defterinden otomatik aktarılan hesap hareketleri ve canlı T-cetveli bakiyeleri'
              : 'Sınav Provası: Yevmiyeye bakarak hesapları kendiniz açın, hareketleri işleyin ve bakiye çift çizgisiyle kapatın.'}
          </p>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto">
          <div className="flex bg-surface-muted dark:bg-zinc-900 p-1 rounded-full border border-border-subtle dark:border-zinc-800 text-xs font-ledger-readout font-semibold">
            <button
              type="button"
              onClick={() => setViewMode('auto')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
                viewMode === 'auto'
                  ? 'bg-surface dark:bg-zinc-800 text-text-primary dark:text-white font-bold shadow-xs'
                  : 'text-text-secondary dark:text-zinc-400 hover:text-text-primary'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Otomatik T-Hesapları</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('practice')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
                viewMode === 'practice'
                  ? 'bg-surface dark:bg-zinc-800 text-text-primary dark:text-white font-bold shadow-xs'
                  : 'text-text-secondary dark:text-zinc-400 hover:text-text-primary'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Kendin Doldur &amp; Kapat (Sınav)</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. SINAV PROVASI GÖRÜNÜMÜ (2 SÜTUNLU ÇALIŞMA TEZGAHI) */}
      {viewMode === 'practice' ? (
        <div className="flex flex-col lg:flex-row items-start gap-6">
          {/* SOL SÜTUN: REFERANS YEVMİYE KAYIT DEFTERİ */}
          {isReferenceOpen ? (
            <aside className="w-full lg:w-[380px] shrink-0 bg-surface dark:bg-[#1C1B19] rounded-[2rem] border border-border-subtle dark:border-zinc-800 p-5 shadow-[0_12px_32px_-8px_rgba(24,24,27,0.05)] sticky top-24 max-h-[calc(100vh-120px)] flex flex-col overflow-hidden">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-border-subtle dark:border-zinc-800">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" />
                  <h4 className="font-card-title font-bold text-xs sm:text-sm text-text-primary dark:text-white uppercase tracking-wider">
                    Yevmiye Defteri (Referans)
                  </h4>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-ledger-readout font-bold px-2 py-0.5 rounded-full bg-surface-muted dark:bg-zinc-800 text-text-secondary dark:text-zinc-300">
                    {displayJournalEntries.length} Madde
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsReferenceOpen(false)}
                    className="p-1 text-text-muted hover:text-text-primary rounded-lg transition-colors cursor-pointer"
                    title="Yevmiyeyi Gizle (T-Cetvellerine Odaklan)"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className="text-[11px] text-text-secondary dark:text-zinc-400 font-body-editorial mb-3">
                {hasUserJournal
                  ? 'Yevmiye sekmesinde oluşturduğunuz kayıtlar:'
                  : 'Senaryo resmi yevmiye maddeleri (Referans):'}
              </p>

              {/* Dikey Kaydırılabilir Yevmiye Fişleri */}
              <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 text-xs">
                {displayJournalEntries.map((entry) => (
                  <div
                    key={entry.id}
                    className="p-3.5 rounded-xl bg-surface-muted/40 dark:bg-zinc-900/60 border border-border-subtle dark:border-zinc-800 space-y-2"
                  >
                    <div className="flex items-center justify-between font-ledger-readout text-[11px] font-bold pb-1 border-b border-border-subtle/60">
                      <span className="px-2 py-0.5 rounded bg-primary-container/15 text-primary dark:text-[#FFB4A4]">
                        Madde #{entry.entryNo}
                      </span>
                      <span className="text-text-muted font-normal">
                        {entry.date}
                      </span>
                    </div>

                    <p className="font-body-editorial text-[11px] text-text-secondary dark:text-zinc-300 leading-tight">
                      {entry.description}
                    </p>

                    <div className="divide-y divide-border-subtle/50 dark:divide-zinc-800/60 font-ledger-readout text-[11px] pt-1">
                      {entry.lines.map((line, lIdx) => {
                        const acc = getAccountByCode(line.accountCode);
                        const isDebit = line.debit > 0;
                        return (
                          <div
                            key={lIdx}
                            className={`py-1 flex items-center justify-between ${
                              !isDebit ? 'pl-4' : ''
                            }`}
                          >
                            <span className="text-text-primary dark:text-zinc-200 truncate pr-2">
                              {!isDebit && '↳ '}
                              <strong>{line.accountCode}</strong>{' '}
                              {acc?.name || line.accountCode}
                            </span>
                            <span
                              className={`font-semibold shrink-0 tabular-nums ${
                                isDebit
                                  ? 'text-secondary dark:text-secondary-fixed'
                                  : 'text-primary dark:text-[#FFB4A4]'
                              }`}
                            >
                              {formatCurrency(
                                isDebit ? line.debit : line.credit
                              )}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </aside>
          ) : (
            <button
              type="button"
              onClick={() => setIsReferenceOpen(true)}
              className="w-full lg:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-surface dark:bg-[#1C1B19] hover:bg-surface-muted text-text-primary dark:text-white border border-border-subtle dark:border-zinc-800 rounded-2xl font-ledger-readout text-xs font-semibold shadow-xs cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-primary" />
              <span>Yevmiye Kayıt Defterini Aç</span>
              <ChevronRight className="w-4 h-4 text-text-muted" />
            </button>
          )}

          {/* SAĞ SÜTUN: T-CETVELİ SINAV KAĞIDI ÇALIŞMA ALANI */}
          <div className="flex-1 min-w-0 space-y-6">
            {/* Üst Komuta Çubuğu: Yeni Hesap Aç & Kontrol Butonları */}
            <div className="bg-surface dark:bg-[#1C1B19] border border-border-subtle dark:border-zinc-800 rounded-[2rem] p-5 shadow-xs flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddAccountModalOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-primary-container hover:bg-primary text-on-primary-container font-ledger-readout font-bold text-xs shadow-xs transition-all active:scale-[0.98] cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Yeni T-Cetveli Aç</span>
                </button>

                <button
                  type="button"
                  onClick={handleAutoFillPractice}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-surface-muted dark:bg-zinc-800 hover:bg-border-subtle text-text-primary dark:text-zinc-200 border border-border-subtle font-ledger-readout font-semibold text-xs transition-colors cursor-pointer"
                  title="Tüm T-cetvellerini doğru çözümüyle doldurur"
                >
                  <Sparkles className="w-3.5 h-3.5 text-primary" />
                  <span>Örnek Çözümü Yükle</span>
                </button>

                {practiceAccountCodes.length > 0 && (
                  <button
                    type="button"
                    onClick={handleResetPractice}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-text-muted hover:text-error hover:bg-error-container/20 font-ledger-readout font-semibold text-xs transition-colors cursor-pointer"
                    title="Çalışma kağıdını temizle"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Temizle</span>
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={handleCheckPractice}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-secondary hover:bg-semantic-balance text-white font-ledger-readout font-bold rounded-full shadow-sm text-xs transition-all active:scale-[0.98] cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>T-Cetvellerimi Kontrol Et</span>
              </button>
            </div>

            {/* Sınav Kontrol Sonucu Kartı */}
            {practiceResult.isChecked && (
              <div
                className={`p-5 rounded-[2rem] border text-xs shadow-xs ${
                  practiceResult.isCorrect
                    ? 'bg-secondary-fixed/25 border-secondary/40 text-on-secondary-fixed'
                    : 'bg-accent-surface border-primary/30 text-primary'
                }`}
              >
                {practiceResult.isCorrect ? (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed shrink-0">
                      <CheckCircle2 className="w-5 h-5 text-secondary" />
                    </div>
                    <div>
                      <h4 className="font-card-title text-sm font-bold text-secondary">
                        Tebrikler! Büyük Defter Sınavını Başarıyla Tamamladınız
                      </h4>
                      <p className="text-xs font-body-editorial text-text-secondary mt-1 leading-relaxed">
                        Tüm T-cetvelleri eksiksiz açıldı, yevmiye hareketleri doğru
                        taraflara aktarıldı, borç/alacak toplamları alındı ve
                        hesaplar çift alt çizgiyle kapatıldı.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2 font-ledger-readout font-bold text-primary text-sm">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>
                        Düzeltilmesi Gereken Hatalar ({practiceResult.errors.length} Adet):
                      </span>
                    </div>
                    <ul className="list-disc list-inside space-y-1.5 text-text-primary dark:text-zinc-200 font-ledger-readout pl-1">
                      {practiceResult.errors.map((err, idx) => (
                        <li key={idx} className="leading-snug">
                          {err}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* T-CETVELLERİ IZGARASI VEYA BOŞ DURUM */}
            {practiceAccountCodes.length > 0 ? (
              <div
                className={`grid grid-cols-1 ${
                  isReferenceOpen ? 'xl:grid-cols-2' : 'lg:grid-cols-2 xl:grid-cols-3'
                } gap-5`}
              >
                {practiceAccountCodes.map((code) => {
                  const accDef = getAccountByCode(code);
                  const uData = practiceData[code] || {
                    debitMovements: [],
                    creditMovements: [],
                    debitTotal: '',
                    creditTotal: '',
                    balance: '',
                    direction: 'BORC',
                    isClosed: false,
                  };

                  const isClosed = Boolean(uData.isClosed);

                  return (
                    <div
                      key={code}
                      className={`bg-surface dark:bg-[#1C1B19] rounded-[2rem] border transition-all flex flex-col shadow-xs ${
                        isClosed
                          ? 'border-secondary/40 bg-secondary/5 dark:bg-emerald-950/20'
                          : 'border-border-subtle dark:border-zinc-800'
                      }`}
                    >
                      {/* T-Kart Başlığı */}
                      <div className="px-5 py-3.5 border-b border-border-subtle dark:border-zinc-800 flex items-center justify-between gap-2 bg-surface-muted/40 dark:bg-zinc-900/60 rounded-t-[2rem]">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="font-ledger-readout font-bold text-sm text-text-primary dark:text-white bg-surface dark:bg-zinc-800 px-2.5 py-0.5 rounded-lg border border-border-subtle shrink-0">
                            {code}
                          </span>
                          <h4
                            className="font-card-title font-bold text-sm text-text-primary dark:text-zinc-100 max-w-[130px] sm:max-w-[170px] truncate"
                            title={accDef?.name}
                          >
                            {accDef?.name || 'Hesap'}
                          </h4>
                          <span
                            className={`text-[10px] font-ledger-readout font-bold uppercase px-2 py-0.5 rounded border shrink-0 ${getNatureBadgeColor(
                              accDef?.nature || 'AKTIF'
                            )}`}
                          >
                            {formatNatureLabel(accDef?.nature || 'AKTİF')}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {isClosed ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-ledger-readout font-bold text-secondary dark:text-secondary-fixed bg-secondary-container/30 px-2.5 py-0.5 rounded-full border border-secondary/30">
                              <Lock className="w-3 h-3" />
                              <span>KAPATILDI</span>
                            </span>
                          ) : (
                            <span className="text-[10px] font-ledger-readout text-text-muted">
                              AÇIK (İşleniyor)
                            </span>
                          )}

                          <button
                            type="button"
                            onClick={() => handleRemoveAccount(code)}
                            className="p-1 text-text-muted hover:text-error rounded-lg transition-colors cursor-pointer"
                            title="T-Cetvelini Kağıttan Çıkar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* T-CETVELİ GÖVDESİ (KLASİK RESMİ T ÇİZGİSİ) */}
                      <div className="flex-1 flex flex-col">
                        {/* Sütun Başlıkları */}
                        <div className="grid grid-cols-2 text-center font-ledger-readout text-[11px] font-bold tracking-wider uppercase bg-surface-muted/30 dark:bg-zinc-900/40 border-b-2 border-text-primary dark:border-zinc-400 text-text-secondary dark:text-zinc-300">
                          <div className="py-2 border-r-2 border-text-primary dark:border-zinc-400 flex items-center justify-center gap-1">
                            <ArrowDownLeft className="w-3 h-3 text-secondary" />
                            <span>BORÇ (SOL)</span>
                          </div>
                          <div className="py-2 flex items-center justify-center gap-1">
                            <span>ALACAK (SAĞ)</span>
                            <ArrowUpRight className="w-3 h-3 text-primary" />
                          </div>
                        </div>

                        {/* Hareketler (Sol & Sağ İki Kol) */}
                        <div className="grid grid-cols-2 min-h-[140px] text-xs font-ledger-readout divide-x-2 divide-text-primary dark:divide-zinc-400">
                          {/* SOL: BORÇ HAREKETLERİ */}
                          <div className="p-3 space-y-2 flex flex-col justify-between">
                            <div className="space-y-1.5">
                              {(uData.debitMovements || []).map((mov) => (
                                <div
                                  key={mov.id}
                                  className="flex items-center gap-1.5 p-1 rounded bg-surface-muted/40 dark:bg-zinc-900/50 border border-border-subtle/70"
                                >
                                  <span className="text-[10px] text-text-muted font-bold pl-0.5 select-none">
                                    #
                                  </span>
                                  <input
                                    type="text"
                                    placeholder="1"
                                    value={mov.entryNo}
                                    onChange={(e) =>
                                      handleUpdateMovement(
                                        code,
                                        'debit',
                                        mov.id,
                                        'entryNo',
                                        e.target.value
                                      )
                                    }
                                    className="w-8 shrink-0 text-center text-xs py-1 px-0.5 bg-surface dark:bg-zinc-800 rounded border border-border-subtle font-ledger-readout font-bold"
                                  />
                                  <input
                                    type="number"
                                    placeholder="0,00"
                                    value={mov.amount}
                                    onChange={(e) =>
                                      handleUpdateMovement(
                                        code,
                                        'debit',
                                        mov.id,
                                        'amount',
                                        e.target.value
                                      )
                                    }
                                    className="flex-1 min-w-0 text-right text-xs py-1 px-1 bg-surface dark:bg-zinc-800 rounded border border-border-subtle font-ledger-readout font-bold text-secondary tabular-nums"
                                  />
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleRemoveMovement(
                                        code,
                                        'debit',
                                        mov.id
                                      )
                                    }
                                    className="p-1 text-text-muted hover:text-error rounded shrink-0"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ))}
                            </div>

                            <button
                              type="button"
                              onClick={() => handleAddMovement(code, 'debit')}
                              className="w-full py-1 text-[11px] font-semibold text-secondary hover:bg-secondary-fixed/20 border border-dashed border-secondary/40 rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer mt-2"
                            >
                              <Plus className="w-3 h-3" />
                              <span>Borç Hareketi Ekle</span>
                            </button>
                          </div>

                          {/* SAĞ: ALACAK HAREKETLERİ */}
                          <div className="p-3 space-y-2 flex flex-col justify-between">
                            <div className="space-y-1.5">
                              {(uData.creditMovements || []).map((mov) => (
                                <div
                                  key={mov.id}
                                  className="flex items-center gap-1.5 p-1 rounded bg-surface-muted/40 dark:bg-zinc-900/50 border border-border-subtle/70"
                                >
                                  <span className="text-[10px] text-text-muted font-bold pl-0.5 select-none">
                                    #
                                  </span>
                                  <input
                                    type="text"
                                    placeholder="1"
                                    value={mov.entryNo}
                                    onChange={(e) =>
                                      handleUpdateMovement(
                                        code,
                                        'credit',
                                        mov.id,
                                        'entryNo',
                                        e.target.value
                                      )
                                    }
                                    className="w-8 shrink-0 text-center text-xs py-1 px-0.5 bg-surface dark:bg-zinc-800 rounded border border-border-subtle font-ledger-readout font-bold"
                                  />
                                  <input
                                    type="number"
                                    placeholder="0,00"
                                    value={mov.amount}
                                    onChange={(e) =>
                                      handleUpdateMovement(
                                        code,
                                        'credit',
                                        mov.id,
                                        'amount',
                                        e.target.value
                                      )
                                    }
                                    className="flex-1 min-w-0 text-right text-xs py-1 px-1 bg-surface dark:bg-zinc-800 rounded border border-border-subtle font-ledger-readout font-bold text-primary tabular-nums"
                                  />
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleRemoveMovement(
                                        code,
                                        'credit',
                                        mov.id
                                      )
                                    }
                                    className="p-1 text-text-muted hover:text-error rounded shrink-0"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ))}
                            </div>

                            <button
                              type="button"
                              onClick={() => handleAddMovement(code, 'credit')}
                              className="w-full py-1 text-[11px] font-semibold text-primary hover:bg-accent-surface border border-dashed border-primary/40 rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer mt-2"
                            >
                              <Plus className="w-3 h-3" />
                              <span>Alacak Hareketi Ekle</span>
                            </button>
                          </div>
                        </div>

                        {/* ALT TOPLAMLAR SATIRI */}
                        <div className="grid grid-cols-2 text-xs font-ledger-readout border-t-2 border-text-primary dark:border-zinc-400 bg-surface-muted/50 dark:bg-zinc-900/70">
                          <div className="p-3 border-r-2 border-text-primary dark:border-zinc-400">
                            <label className="block text-[10px] font-bold text-secondary uppercase mb-1">
                              Borç Toplamı (TL)
                            </label>
                            <input
                              type="number"
                              value={uData.debitTotal}
                              onChange={(e) =>
                                handlePracticeFieldChange(
                                  code,
                                  'debitTotal',
                                  e.target.value
                                )
                              }
                              placeholder="0,00"
                              className="w-full p-1.5 text-right bg-surface dark:bg-zinc-800 border border-border-subtle rounded-lg text-xs font-bold text-secondary tabular-nums"
                            />
                          </div>

                          <div className="p-3">
                            <label className="block text-[10px] font-bold text-primary uppercase mb-1">
                              Alacak Toplamı (TL)
                            </label>
                            <input
                              type="number"
                              value={uData.creditTotal}
                              onChange={(e) =>
                                handlePracticeFieldChange(
                                  code,
                                  'creditTotal',
                                  e.target.value
                                )
                              }
                              placeholder="0,00"
                              className="w-full p-1.5 text-right bg-surface dark:bg-zinc-800 border border-border-subtle rounded-lg text-xs font-bold text-primary tabular-nums"
                            />
                          </div>
                        </div>

                        {/* BAKİYE ÇIKARMA & HESABI KAPATMA BÖLÜMÜ */}
                        <div className="p-4 border-t border-border-subtle dark:border-zinc-800 space-y-3 bg-surface dark:bg-[#1C1B19] rounded-b-[2rem]">
                          <div className="grid grid-cols-2 gap-2 text-xs font-ledger-readout">
                            <div>
                              <label className="block text-[10px] font-bold text-text-secondary mb-1">
                                Kalan Bakiye:
                              </label>
                              <input
                                type="number"
                                value={uData.balance}
                                onChange={(e) =>
                                  handlePracticeFieldChange(
                                    code,
                                    'balance',
                                    e.target.value
                                  )
                                }
                                placeholder="Fark tutarı"
                                className="w-full p-2 bg-surface-muted/50 dark:bg-zinc-900 border border-border-subtle rounded-lg text-xs font-bold text-text-primary dark:text-white tabular-nums"
                              />
                            </div>

                            <div>
                              <label className="block text-[10px] font-bold text-text-secondary mb-1">
                                Bakiye Türü:
                              </label>
                              <select
                                value={uData.direction}
                                onChange={(e) =>
                                  handlePracticeFieldChange(
                                    code,
                                    'direction',
                                    e.target.value
                                  )
                                }
                                className="w-full p-2 bg-surface-muted/50 dark:bg-zinc-900 border border-border-subtle rounded-lg text-xs font-semibold text-text-primary dark:text-white cursor-pointer"
                              >
                                <option value="BORC">Borç Bakiyesi</option>
                                <option value="ALACAK">Alacak Bakiyesi</option>
                                <option value="DENK">Denk (Kapanmış)</option>
                              </select>
                            </div>
                          </div>

                          {/* Çift Çizgili Kapatma Alanı */}
                          {isClosed ? (
                            <div className="pt-2">
                              {/* Resmi Muhasebe Çift Alt Çizgisi */}
                              <div className="border-b-4 border-double border-text-primary dark:border-zinc-300 mb-3" />
                              <div className="p-2.5 rounded-xl bg-secondary/15 dark:bg-emerald-950/40 border border-secondary/30 flex items-center justify-between text-xs font-ledger-readout">
                                <span className="font-bold text-secondary dark:text-emerald-300">
                                  ✓ HESAP KAPATILDI ({uData.direction === 'BORC' ? 'Borç Bakiyesi' : uData.direction === 'ALACAK' ? 'Alacak Bakiyesi' : 'Denk'})
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleToggleCloseAccount(code)}
                                  className="text-[11px] underline font-semibold text-text-muted hover:text-text-primary cursor-pointer"
                                >
                                  Yeniden Aç
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleToggleCloseAccount(code)}
                              className="w-full py-2.5 px-4 rounded-xl bg-surface-muted hover:bg-border-subtle dark:bg-zinc-800 dark:hover:bg-zinc-700 text-text-primary dark:text-white font-ledger-readout font-bold text-xs border border-border-subtle transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-[0.99]"
                            >
                              <Lock className="w-3.5 h-3.5 text-primary" />
                              <span>Hesabı Kapat (Çift Çizgi Çek)</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Boş Çalışma Kağıdı Durumu */
              <div className="p-10 sm:p-14 text-center bg-surface dark:bg-[#1C1B19] rounded-[2rem] border-2 border-dashed border-border-subtle dark:border-zinc-800 space-y-4">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-primary-container/15 flex items-center justify-center text-primary">
                  <Scale className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="font-card-title text-base sm:text-lg font-bold text-text-primary dark:text-white">
                    Sınav Çalışma Kağıdınız Hazır (Henüz T-Cetveli Açılmadı)
                  </h4>
                  <p className="text-xs sm:text-sm font-body-editorial text-text-secondary dark:text-zinc-400 mt-1 max-w-lg mx-auto leading-relaxed">
                    Üniversite muhasebe sınavlarında olduğu gibi, sol taraftaki
                    yevmiye maddelerinde geçen hesaplar için tek tek T-cetveli
                    açınız; tutarları borç/alacak taraflarına yazıp çift çizgiyle
                    kapatınız.
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddAccountModalOpen(true)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary-container hover:bg-primary text-on-primary-container font-ledger-readout font-bold text-xs shadow-md transition-all active:scale-[0.98] cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>İlk T-Cetvelini Aç</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleAutoFillPractice}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-surface-muted dark:bg-zinc-800 hover:bg-border-subtle text-text-primary dark:text-zinc-200 border border-border-subtle font-ledger-readout font-semibold text-xs transition-all cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-primary" />
                    <span>Örnek Çözümü Yükle</span>
                  </button>
                </div>

                {/* Sık Kullanılan Hesaplar */}
                <div className="pt-5 border-t border-border-subtle dark:border-zinc-800/80 max-w-md mx-auto">
                  <span className="font-ledger-readout text-[11px] text-text-muted uppercase tracking-wider block mb-2.5">
                    Sık Kullanılan Hesaplar (Tek Tıkla Aç):
                  </span>
                  <div className="flex flex-wrap justify-center gap-2">
                    {['100', '101', '102', '103', '153', '500'].map((code) => {
                      const acc = getAccountByCode(code);
                      if (!acc) return null;
                      return (
                        <button
                          key={code}
                          type="button"
                          onClick={() => handleAddAccount(code)}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-muted/60 dark:bg-zinc-800/60 hover:bg-surface-muted border border-border-subtle text-xs font-ledger-readout text-text-secondary dark:text-zinc-300 transition-colors cursor-pointer"
                        >
                          <Plus className="w-3 h-3 text-primary" />
                          <span>
                            {acc.code} {acc.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* 3. OTOMATİK T-CETVELLERİ GÖRÜNÜMÜ */
        <div className="space-y-6">
          {/* Arama ve Sınıf Filtresi */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-text-muted absolute left-3.5 top-2.5" />
              <input
                type="text"
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                placeholder="TDHP hesap kodu veya adı ara..."
                className="w-full text-xs font-ledger-readout pl-9 pr-3 py-2 bg-surface dark:bg-zinc-900 border border-border-subtle dark:border-zinc-800 rounded-full text-text-primary dark:text-white focus:outline-none focus:border-primary"
              />
            </div>

            <select
              value={filterClass}
              onChange={(e) =>
                setFilterClass(
                  e.target.value === 'all' ? 'all' : Number(e.target.value)
                )
              }
              className="text-xs font-ledger-readout py-2 px-4 bg-surface dark:bg-zinc-900 border border-border-subtle dark:border-zinc-800 rounded-full focus:outline-none cursor-pointer text-text-primary dark:text-zinc-200 font-semibold"
            >
              <option value="all">Tüm TDHP Hesap Sınıfları</option>
              <option value="1">1: Dönen Varlıklar</option>
              <option value="2">2: Duran Varlıklar</option>
              <option value="3">3: KVYK (Kısa Vadeli Yabancı Kaynaklar)</option>
              <option value="5">5: Öz Kaynaklar</option>
              <option value="6">6: Gelir Tablosu</option>
              <option value="7">7: Maliyet Hesapları</option>
            </select>
          </div>

          {displayedAutoAccounts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {displayedAutoAccounts.map((acc) => {
                const hasDebit = acc.debitMovements.length > 0;
                const hasCredit = acc.creditMovements.length > 0;

                return (
                  <div
                    key={acc.accountCode}
                    className="bg-surface dark:bg-[#1C1B19] rounded-[1.75rem] shadow-[0_8px_24px_-6px_rgba(24,24,27,0.05)] border border-border-subtle dark:border-zinc-800 overflow-hidden flex flex-col hover:border-text-muted transition-all tabular-nums"
                  >
                    {/* T-Hesabı Başlığı */}
                    <div className="bg-surface-muted/60 dark:bg-zinc-900 px-4 py-3 border-b border-border-subtle dark:border-zinc-800 flex items-center justify-between">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="font-ledger-readout font-bold text-sm text-text-primary dark:text-white bg-surface dark:bg-zinc-800 px-2 py-0.5 rounded border border-border-subtle dark:border-zinc-700 shrink-0">
                          {acc.accountCode}
                        </span>
                        <h4 className="font-card-title font-bold text-sm text-text-primary dark:text-zinc-100 truncate">
                          {acc.accountName}
                        </h4>
                      </div>
                      <span
                        className={`text-[10px] font-ledger-readout font-bold uppercase px-2 py-0.5 rounded border shrink-0 ${getNatureBadgeColor(
                          acc.nature
                        )}`}
                      >
                        {formatNatureLabel(acc.nature)}
                      </span>
                    </div>

                    {/* Sütun Başlıkları */}
                    <div className="grid grid-cols-2 text-center text-[11px] font-ledger-readout font-bold uppercase tracking-wider bg-surface-muted/25 dark:bg-zinc-900/60 border-b-2 border-text-primary dark:border-zinc-500 text-text-secondary dark:text-zinc-300">
                      <div className="py-1.5 border-r-2 border-text-primary dark:border-zinc-500 flex items-center justify-center gap-1">
                        <ArrowDownLeft className="w-3 h-3 text-secondary" />
                        <span>BORÇ (B)</span>
                      </div>
                      <div className="py-1.5 flex items-center justify-center gap-1">
                        <span>ALACAK (A)</span>
                        <ArrowUpRight className="w-3 h-3 text-primary" />
                      </div>
                    </div>

                    {/* Hareketler */}
                    <div className="flex-1 grid grid-cols-2 text-xs font-ledger-readout min-h-[120px]">
                      <div className="border-r-2 border-text-primary dark:border-zinc-500 p-2.5 divide-y divide-border-subtle/60 dark:divide-zinc-800">
                        {hasDebit ? (
                          acc.debitMovements.map((mov, idx) => (
                            <div
                              key={idx}
                              onClick={() =>
                                handleMovementClick(mov.transactionId)
                              }
                              className="py-1.5 px-1.5 hover:bg-surface-muted/50 dark:hover:bg-zinc-900 rounded cursor-pointer transition-colors flex items-center justify-between"
                              title={`Madde #${mov.entryNo}: Yevmiye fişine gitmek için tıklayın`}
                            >
                              <span className="text-[10px] text-text-muted">
                                #{mov.entryNo}
                              </span>
                              <span className="font-semibold text-secondary dark:text-secondary-fixed">
                                {formatCurrency(mov.amount)}
                              </span>
                            </div>
                          ))
                        ) : (
                          <div className="h-full flex items-center justify-center text-[11px] text-text-muted italic font-body-editorial">
                            Hareket yok
                          </div>
                        )}
                      </div>

                      <div className="p-2.5 divide-y divide-border-subtle/60 dark:divide-zinc-800">
                        {hasCredit ? (
                          acc.creditMovements.map((mov, idx) => (
                            <div
                              key={idx}
                              onClick={() =>
                                handleMovementClick(mov.transactionId)
                              }
                              className="py-1.5 px-1.5 hover:bg-surface-muted/50 dark:hover:bg-zinc-900 rounded cursor-pointer transition-colors flex items-center justify-between"
                              title={`Madde #${mov.entryNo}: Yevmiye fişine gitmek için tıklayın`}
                            >
                              <span className="text-[10px] text-text-muted">
                                #{mov.entryNo}
                              </span>
                              <span className="font-semibold text-primary dark:text-[#FFB4A4]">
                                {formatCurrency(mov.amount)}
                              </span>
                            </div>
                          ))
                        ) : (
                          <div className="h-full flex items-center justify-center text-[11px] text-text-muted italic font-body-editorial">
                            Hareket yok
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Alt Toplamlar */}
                    <div className="grid grid-cols-2 text-xs font-ledger-readout font-bold bg-surface-muted/60 dark:bg-zinc-900 border-t border-border-subtle dark:border-zinc-800">
                      <div className="py-2 px-3 border-r border-border-subtle dark:border-zinc-800 text-right text-text-primary dark:text-white">
                        {formatCurrency(acc.totalDebit)}
                      </div>
                      <div className="py-2 px-3 text-right text-text-primary dark:text-white">
                        {formatCurrency(acc.totalCredit)}
                      </div>
                    </div>

                    {/* Kalan Bakiye */}
                    <div className="bg-surface-contrast text-surface px-4 py-2.5 text-xs font-ledger-readout flex items-center justify-between">
                      <span className="text-text-muted">Bakiye:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-surface">
                          {formatCurrency(acc.balance)}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            acc.balanceDirection === 'BORC'
                              ? 'bg-secondary/30 text-secondary-fixed border-secondary/40'
                              : acc.balanceDirection === 'ALACAK'
                              ? 'bg-primary-container/40 text-primary-fixed border-primary-container/50'
                              : 'bg-white/10 text-zinc-300 border-white/15'
                          }`}
                        >
                          {acc.balanceDirection === 'BORC'
                            ? 'BORÇ BAKİYESİ'
                            : acc.balanceDirection === 'ALACAK'
                            ? 'ALACAK BAKİYESİ'
                            : 'DENK'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-12 text-center bg-surface dark:bg-[#1C1B19] rounded-[2rem] border border-border-subtle dark:border-zinc-800">
              <Scale className="w-10 h-10 text-text-muted mx-auto mb-3" />
              <h4 className="text-base font-card-title font-bold text-text-primary dark:text-white">
                Henüz T-Hesabı Hareketi Yok
              </h4>
              <p className="text-xs sm:text-sm font-body-editorial text-text-secondary dark:text-zinc-400 mt-1 max-w-md mx-auto">
                Yevmiye defterine kayıt girdikçe hesapların T-cetvelleri ve
                bakiyeleri otomatik olarak burada listelenecektir.
              </p>
            </div>
          )}
        </div>
      )}

      {/* 4. YENİ T-CETVELİ AÇMA MODALI */}
      {isAddAccountModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="max-w-lg w-full bg-surface dark:bg-[#1C1B19] rounded-[2rem] border border-border-subtle dark:border-zinc-800 p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-border-subtle dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-primary" />
                <h3 className="font-card-title text-base font-bold text-text-primary dark:text-white">
                  Yeni T-Cetveli Aç (Büyük Defter)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddAccountModalOpen(false)}
                className="p-1.5 text-text-muted hover:text-text-primary rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Arama Inputu */}
            <div className="relative">
              <Search className="w-4 h-4 text-text-muted absolute left-3.5 top-3" />
              <input
                type="text"
                autoFocus
                value={modalSearchQuery}
                onChange={(e) => setModalSearchQuery(e.target.value)}
                placeholder="Hesap kodu (örn: 100) veya adı ara..."
                className="w-full text-xs font-ledger-readout pl-9 pr-3 py-2.5 bg-surface-muted/50 dark:bg-zinc-900 border border-border-subtle dark:border-zinc-800 rounded-xl text-text-primary dark:text-white focus:outline-none focus:border-primary"
              />
            </div>

            {/* Sınıf Filtresi */}
            <div className="flex flex-wrap gap-1.5 text-[11px] font-ledger-readout font-semibold">
              <button
                type="button"
                onClick={() => setModalClassFilter('all')}
                className={`px-2.5 py-1 rounded-full border transition-colors cursor-pointer ${
                  modalClassFilter === 'all'
                    ? 'bg-primary text-white border-primary'
                    : 'bg-surface-muted dark:bg-zinc-800 text-text-secondary border-border-subtle'
                }`}
              >
                Tümü
              </button>
              {[1, 2, 3, 5, 6, 7].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setModalClassFilter(num)}
                  className={`px-2.5 py-1 rounded-full border transition-colors cursor-pointer ${
                    modalClassFilter === num
                      ? 'bg-primary text-white border-primary'
                      : 'bg-surface-muted dark:bg-zinc-800 text-text-secondary border-border-subtle'
                  }`}
                >
                  {num}xx
                </button>
              ))}
            </div>

            {/* Hesap Listesi */}
            <div className="max-h-72 overflow-y-auto space-y-1.5 pr-1 text-xs">
              {modalFilteredAccounts.map((acc) => {
                const isAlreadyAdded = practiceAccountCodes.includes(acc.code);
                return (
                  <div
                    key={acc.code}
                    className="p-2.5 rounded-xl border border-border-subtle/70 dark:border-zinc-800/80 hover:bg-surface-muted/50 dark:hover:bg-zinc-900/60 transition-colors flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-ledger-readout font-bold text-text-primary dark:text-white bg-surface-muted dark:bg-zinc-800 px-2 py-0.5 rounded border border-border-subtle shrink-0">
                        {acc.code}
                      </span>
                      <span className="font-medium text-text-primary dark:text-zinc-200 truncate">
                        {acc.name}
                      </span>
                      <span
                        className={`text-[10px] font-ledger-readout font-bold px-1.5 py-0.5 rounded border shrink-0 ${getNatureBadgeColor(
                          acc.nature
                        )}`}
                      >
                        {formatNatureLabel(acc.nature)}
                      </span>
                    </div>

                    <button
                      type="button"
                      disabled={isAlreadyAdded}
                      onClick={() => handleAddAccount(acc.code)}
                      className={`px-3 py-1.5 rounded-full font-ledger-readout font-bold text-xs shrink-0 transition-all ${
                        isAlreadyAdded
                          ? 'bg-surface-muted text-text-muted cursor-not-allowed border border-border-subtle'
                          : 'bg-primary-container hover:bg-primary text-on-primary-container cursor-pointer shadow-xs active:scale-[0.98]'
                      }`}
                    >
                      {isAlreadyAdded ? 'Açıldı ✓' : '+ Cetveli Aç'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
