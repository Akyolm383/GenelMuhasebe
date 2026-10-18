import React from 'react';
import { useAccountingStore } from '../store/useAccountingStore';
import { AccountSelect } from './common/AccountSelect';
import { getAccountByCode } from '../core/accounts';
import { formatCurrency } from '../core/accountingEngine';
import {
  Plus,
  X,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Info,
  Scale,
  Sparkles,
  FileText,
  ArrowUpRight,
  Receipt,
  Wallet,
  Columns3,
  ShieldCheck,
  Lightbulb,
  ChevronLeft,
  ChevronRight,
  Edit3,
} from 'lucide-react';

export const JournalEntryForm: React.FC = () => {
  const {
    getActiveTransaction,
    getLinesForActiveTransaction,
    getValidationForActiveTransaction,
    getLedgerAccounts,
    getBalanceSheet,
    addLine,
    removeLine,
    updateLine,
    resetLinesForTransaction,
    autoFillCorrectSolution,
    requestNextHint,
    finishScenarioAndShowSummary,
    setActiveTab,
    setLedgerViewMode,
    setBalanceViewMode,
    mode,
    activeTransactionIndex,
    setActiveTransactionIndex,
    getCurrentScenario,
  } = useAccountingStore();

  const activeTx = getActiveTransaction();
  const lines = getLinesForActiveTransaction();
  const validation = getValidationForActiveTransaction();
  const scenario = getCurrentScenario();
  const ledgerAccounts = getLedgerAccounts();
  const balanceSheet = getBalanceSheet();

  const totalTx = scenario.transactions.length;
  const hasPrevTx = activeTransactionIndex > 0;
  const hasNextTx = activeTransactionIndex < totalTx - 1;

  const handleDebitChange = (lineId: string, val: string) => {
    const num = Math.max(0, parseFloat(val) || 0);
    updateLine(activeTx.id, lineId, {
      debit: num,
      credit: num > 0 ? 0 : 0,
    });
  };

  const handleCreditChange = (lineId: string, val: string) => {
    const num = Math.max(0, parseFloat(val) || 0);
    updateLine(activeTx.id, lineId, {
      credit: num,
      debit: num > 0 ? 0 : 0,
    });
  };

  // Vaka evrakı altındaki 3'lü özet kutusu için hesaplamalar
  const expectedDebitTotal = activeTx.expectedEntry.lines.reduce(
    (sum, l) => sum + (l.debit || 0),
    0
  );
  const kdvLine = activeTx.expectedEntry.lines.find(
    (l) => l.accountCode === '191' || l.accountCode === '391'
  );
  const kdvAmount = kdvLine ? kdvLine.debit || kdvLine.credit : 0;
  const baseAmount =
    kdvAmount > 0
      ? Math.max(0, expectedDebitTotal - kdvAmount)
      : activeTx.amount || expectedDebitTotal;

  // Sağ sütundaki Canlı T-Cetveli önizlemesi için aktif satırlardaki hesaplar (yoksa genel defterden veya beklenen hesaplardan)
  const activeAccountCodes = Array.from(
    new Set(
      lines
        .map((l) => l.accountCode)
        .filter((code): code is string => Boolean(code))
    )
  );

  const previewTAccounts =
    activeAccountCodes.length > 0
      ? activeAccountCodes.map((code) => {
          const existing = ledgerAccounts.find((a) => a.accountCode === code);
          if (existing) return existing;
          const accDef = getAccountByCode(code);
          const lineDebit = lines
            .filter((l) => l.accountCode === code)
            .reduce((s, l) => s + (l.debit || 0), 0);
          const lineCredit = lines
            .filter((l) => l.accountCode === code)
            .reduce((s, l) => s + (l.credit || 0), 0);
          const bal = Math.abs(lineDebit - lineCredit);
          const dir =
            lineDebit > lineCredit
              ? 'BORC'
              : lineCredit > lineDebit
              ? 'ALACAK'
              : 'DENK';
          return {
            accountCode: code,
            accountName: accDef?.name || 'Hesap',
            totalDebit: lineDebit,
            totalCredit: lineCredit,
            balance: bal,
            balanceDirection: dir,
          };
        })
      : ledgerAccounts.slice(0, 3).length > 0
      ? ledgerAccounts.slice(0, 3)
      : activeTx.expectedEntry.lines.slice(0, 3).map((exp) => {
          const accDef = getAccountByCode(exp.accountCode);
          return {
            accountCode: exp.accountCode,
            accountName: accDef?.name || 'Hesap',
            totalDebit: 0,
            totalCredit: 0,
            balance: 0,
            balanceDirection: 'DENK' as const,
          };
        });

  const kasaLedger = ledgerAccounts.find((a) => a.accountCode === '100');

  return (
    <div className="space-y-6">
      {/* 1. ÜST 8:4 BÖLÜNMÜŞ SATIR: VAKA EVRAKI & SOKRATİK AKIL YÜRÜTME */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Sol (8 Sütun): Resmi Ticari Evrak / Fatura Kartı */}
        <div className="lg:col-span-8 bg-surface dark:bg-[#1C1B19] rounded-[2rem] p-6 sm:p-7 border border-border-subtle dark:border-zinc-800 shadow-[0_12px_32px_-8px_rgba(24,24,27,0.05)] relative overflow-hidden flex flex-col justify-between">
          {/* Terracotta Üst Vurgu Şeridi */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-primary-container" />

          <div>
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-border-subtle dark:border-zinc-800">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface-muted dark:bg-zinc-800 font-ledger-readout text-[11px] font-bold text-text-secondary dark:text-zinc-300 tracking-wider uppercase">
                  <FileText className="w-3.5 h-3.5 text-primary" />
                  <span>
                    RESMİ E-EVRAK #FT-2026-08{activeTx.order}
                  </span>
                </span>
                <span className="text-text-muted dark:text-zinc-400 font-ledger-readout text-xs tabular-nums">
                  {activeTx.date}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-surface dark:bg-[#3A1D16] border border-primary/20 text-primary dark:text-[#FFB4A4] font-ledger-readout text-xs font-semibold tabular-nums">
                  <span>
                    Vaka Madde #{activeTx.order} / {totalTx}
                  </span>
                </div>

                <div className="inline-flex items-center gap-1 pl-1">
                  <button
                    type="button"
                    disabled={!hasPrevTx}
                    onClick={() =>
                      setActiveTransactionIndex(activeTransactionIndex - 1)
                    }
                    className="p-1.5 rounded-full border border-border-subtle dark:border-zinc-700 text-text-secondary dark:text-zinc-300 hover:bg-surface-muted dark:hover:bg-zinc-800 disabled:opacity-35 disabled:cursor-not-allowed cursor-pointer transition-colors"
                    title="Önceki İşlem"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    disabled={!hasNextTx}
                    onClick={() =>
                      setActiveTransactionIndex(activeTransactionIndex + 1)
                    }
                    className="p-1.5 rounded-full border border-border-subtle dark:border-zinc-700 text-text-secondary dark:text-zinc-300 hover:bg-surface-muted dark:hover:bg-zinc-800 disabled:opacity-35 disabled:cursor-not-allowed cursor-pointer transition-colors"
                    title="Sonraki İşlem"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-2.5">
              <h2 className="font-section-header text-2xl sm:text-3xl font-bold text-text-primary dark:text-white tracking-tight leading-tight">
                {activeTx.title}
              </h2>
              <p className="text-text-secondary dark:text-zinc-300 font-body-editorial text-sm sm:text-base leading-relaxed max-w-3xl">
                {activeTx.description}
              </p>
            </div>
          </div>

          {/* 3'lü Sandstone Evrak Matrah Özeti */}
          <div className="mt-6 p-4 rounded-xl bg-surface-muted/60 dark:bg-zinc-900/70 border border-border-subtle dark:border-zinc-800 grid grid-cols-1 sm:grid-cols-3 gap-4 tabular-nums">
            <div className="flex flex-col">
              <span className="font-ledger-readout text-[11px] text-text-muted dark:text-zinc-400 uppercase">
                Matrah Tutar (İşlem Bedeli)
              </span>
              <span className="font-ledger-readout text-base font-bold text-text-primary dark:text-white tracking-tight mt-0.5">
                {formatCurrency(baseAmount)}
              </span>
            </div>

            <div className="flex flex-col sm:border-l sm:border-border-subtle dark:sm:border-zinc-800 sm:pl-4">
              <span className="font-ledger-readout text-[11px] text-text-muted dark:text-zinc-400 uppercase">
                {kdvAmount > 0
                  ? 'Hesaplanan / İndirilecek KDV'
                  : 'Etkilenen TDHP Hesapları'}
              </span>
              <span className="font-ledger-readout text-base font-bold text-primary dark:text-[#FFB4A4] tracking-tight mt-0.5">
                {kdvAmount > 0
                  ? formatCurrency(kdvAmount)
                  : `${activeTx.expectedEntry.lines.length} Adet Hesap`}
              </span>
            </div>

            <div className="flex flex-col sm:border-l sm:border-border-subtle dark:sm:border-zinc-800 sm:pl-4">
              <span className="font-ledger-readout text-[11px] text-text-muted dark:text-zinc-400 uppercase">
                Genel Yevmiye Toplamı
              </span>
              <span className="font-ledger-readout text-base font-bold text-text-primary dark:text-white tracking-tight mt-0.5">
                {formatCurrency(expectedDebitTotal)}
              </span>
            </div>
          </div>
        </div>

        {/* Sağ (4 Sütun): Sokratik Akıl Yürütme & VUK Pedagojik Asistanı */}
        <div className="lg:col-span-4 bg-surface dark:bg-[#1C1B19] rounded-[2rem] p-6 sm:p-7 border border-border-subtle dark:border-zinc-800 shadow-[0_12px_32px_-8px_rgba(24,24,27,0.05)] flex flex-col justify-between relative bg-gradient-to-br from-surface via-surface to-accent-surface/35 dark:from-[#1C1B19] dark:to-[#281A16]">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => requestNextHint(activeTx.id)}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-surface dark:bg-[#3A1D16] text-primary dark:text-[#FFB4A4] font-ledger-readout text-xs font-bold hover:bg-primary-container hover:text-white transition-colors cursor-pointer"
                title="Detaylı kademeli Sokratik ipucu penceresini aç"
              >
                <Lightbulb className="w-3.5 h-3.5" />
                <span>Sokratik Akıl Yürütme</span>
              </button>
              <span className="font-ledger-readout text-[11px] text-text-muted dark:text-zinc-400">
                VUK Md. 229
              </span>
            </div>

            <h3 className="font-card-title text-lg font-bold text-text-primary dark:text-white">
              Çift Taraflı Kayıt Mantığı
            </h3>

            <div className="space-y-3 font-body-editorial text-text-secondary dark:text-zinc-300 text-xs sm:text-sm leading-relaxed">
              {activeTx.expectedEntry.lines.map((expLine, idx) => {
                const accDef = getAccountByCode(expLine.accountCode);
                const isDebit = expLine.debit > 0;
                return (
                  <div key={idx} className="flex items-start gap-2.5">
                    {isDebit ? (
                      <ArrowUpRight className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                    ) : expLine.accountCode.includes('91') ? (
                      <Receipt className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                    ) : (
                      <Wallet className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    )}
                    <p>
                      <strong className="text-text-primary dark:text-white font-semibold">
                        {accDef?.nature === 'AKTIF'
                          ? isDebit
                            ? 'Varlık Artışı:'
                            : 'Varlık Azalışı:'
                          : accDef?.nature === 'PASIF'
                          ? isDebit
                            ? 'Kaynak / Borç Azalışı:'
                            : 'Kaynak / Borç Artışı:'
                          : accDef?.nature === 'GIDER'
                          ? 'Dönem Gideri:'
                          : 'Dönem Geliri:'}
                      </strong>{' '}
                      <span className="font-ledger-readout font-semibold text-text-primary dark:text-zinc-200">
                        {expLine.accountCode} {accDef?.name}
                      </span>{' '}
                      hesabı ({accDef?.nature || 'TDHP'}) etkilenir ve{' '}
                      <span
                        className={`font-ledger-readout font-bold ${
                          isDebit
                            ? 'text-secondary dark:text-secondary-fixed'
                            : 'text-primary dark:text-[#FFB4A4]'
                        }`}
                      >
                        {isDebit ? 'BORÇ' : 'ALACAK'}
                      </span>{' '}
                      tarafına işlenir.
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-border-subtle dark:border-zinc-800 flex flex-col sm:flex-row items-center gap-2">
            {mode === 'ogrenme' ? (
              <button
                type="button"
                onClick={() => autoFillCorrectSolution(activeTx.id)}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-surface-muted dark:bg-zinc-800 hover:bg-border-subtle dark:hover:bg-zinc-700 text-text-primary dark:text-white font-ledger-readout text-xs font-semibold transition-all active:scale-[0.98] cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                <span>Doğru Çözümü Fişe Aktar</span>
              </button>
            ) : (
              <div className="w-full text-center py-2 px-3 rounded-full bg-surface-muted dark:bg-zinc-800 text-text-muted text-xs font-ledger-readout">
                Sınav Modu Aktif • Kendi Kaydınızı Giriniz
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 2. ALT 8:4 ASİMETRİK MUHASEBE ÇALIŞMA TEZGAHI */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* SOL SÜTUN (8 Sütun): YEVMİYE DEFTERİ KAYIT FİŞİ */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-surface dark:bg-[#1C1B19] rounded-[2rem] border border-border-subtle dark:border-zinc-800 shadow-[0_12px_32px_-8px_rgba(24,24,27,0.06),0_2px_6px_-1px_rgba(24,24,27,0.04)] overflow-hidden">
            {/* Fiş Üst Başlığı ve Aksiyonlar */}
            <div className="px-6 py-5 bg-surface dark:bg-[#1C1B19] border-b border-border-subtle dark:border-zinc-800 flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary" />
                  <h3 className="font-card-title text-lg font-bold text-text-primary dark:text-white tracking-tight uppercase">
                    YEVMİYE DEFTERİ KAYIT FİŞİ
                  </h3>
                </div>
                <div className="flex flex-wrap items-center gap-2 mt-1 font-ledger-readout text-xs text-text-secondary dark:text-zinc-400 tabular-nums">
                  <span>
                    Madde No: #{String(activeTx.order).padStart(2, '0')}
                  </span>
                  <span className="text-text-muted">•</span>
                  <span>Tarih: {activeTx.date}</span>
                  <span className="text-text-muted hidden sm:inline">•</span>
                  <span className="text-text-muted hidden sm:inline">
                    Tekdüzen Hesap Planı (TDHP) Esaslı
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => addLine(activeTx.id)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-surface-muted dark:bg-zinc-800 hover:bg-border-subtle dark:hover:bg-zinc-700 text-text-primary dark:text-white font-ledger-readout text-xs font-semibold transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Yeni Satır Ekle</span>
                </button>
                <button
                  type="button"
                  onClick={() => resetLinesForTransaction(activeTx.id)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-text-muted hover:text-error hover:bg-error-container/30 font-ledger-readout text-xs transition-colors cursor-pointer"
                  title="Fişteki tüm satırları sıfırla"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Fişi Temizle</span>
                </button>
              </div>
            </div>

            {/* MOBİL KART GÖRÜNÜMÜ (< 768px) */}
            <div className="block md:hidden p-4 space-y-3 bg-background/60 dark:bg-zinc-950/50">
              {lines.map((line, index) => {
                const accountDef = line.accountCode
                  ? getAccountByCode(line.accountCode)
                  : undefined;
                const isCreditSide = line.credit > 0;
                const isDebitSide = line.debit > 0;

                return (
                  <div
                    key={line.id}
                    className={`p-4 rounded-2xl border bg-surface dark:bg-zinc-900 space-y-3 transition-colors ${
                      isCreditSide
                        ? 'border-primary/30 bg-accent-surface/10'
                        : isDebitSide
                        ? 'border-secondary/30'
                        : 'border-border-subtle dark:border-zinc-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-[11px] font-bold font-ledger-readout px-2.5 py-0.5 rounded border ${
                          isDebitSide
                            ? 'bg-secondary-container/40 text-on-secondary-container border-secondary/30'
                            : isCreditSide
                            ? 'bg-accent-surface text-primary border-primary/30'
                            : 'bg-surface-muted text-text-muted border-border-subtle'
                        }`}
                      >
                        {isDebitSide
                          ? 'BORÇ'
                          : isCreditSide
                          ? 'ALACAK'
                          : `SATIR #${index + 1}`}
                      </span>

                      <button
                        type="button"
                        onClick={() => removeLine(activeTx.id, line.id)}
                        className="p-1.5 text-text-muted hover:text-error rounded-lg cursor-pointer"
                        title="Satırı Çıkar"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div>
                      <AccountSelect
                        value={line.accountCode}
                        onChange={(code) =>
                          updateLine(activeTx.id, line.id, { accountCode: code })
                        }
                      />
                      {accountDef && (
                        <div className="mt-1.5 text-[11px] text-text-muted font-body-editorial">
                          Açıklama: {accountDef.description}
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label className="text-[10px] font-ledger-readout font-bold text-secondary uppercase block mb-1">
                          BORÇ (TL)
                        </label>
                        <input
                          type="number"
                          step="1"
                          min="0"
                          value={line.debit > 0 ? line.debit : ''}
                          onChange={(e) =>
                            handleDebitChange(line.id, e.target.value)
                          }
                          placeholder="0,00"
                          className="w-full text-right font-ledger-readout font-semibold text-sm px-3 py-2 bg-surface-muted/40 dark:bg-zinc-950 border border-border-subtle dark:border-zinc-800 rounded-lg text-text-primary dark:text-white tabular-nums focus:outline-none focus:border-secondary"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-ledger-readout font-bold text-primary uppercase block mb-1">
                          ALACAK (TL)
                        </label>
                        <input
                          type="number"
                          step="1"
                          min="0"
                          value={line.credit > 0 ? line.credit : ''}
                          onChange={(e) =>
                            handleCreditChange(line.id, e.target.value)
                          }
                          placeholder="0,00"
                          className="w-full text-right font-ledger-readout font-semibold text-sm px-3 py-2 bg-surface-muted/40 dark:bg-zinc-950 border border-border-subtle dark:border-zinc-800 rounded-lg text-primary dark:text-[#FFB4A4] tabular-nums focus:outline-none focus:border-primary"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* MASAÜSTÜ TABLO GÖRÜNÜMÜ (>= 768px) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-muted/50 dark:bg-zinc-900/60 border-b border-border-subtle dark:border-zinc-800 font-ledger-readout text-[11px] text-text-secondary dark:text-zinc-400 uppercase tracking-wider">
                    <th className="py-3 px-5 w-24">YÖN</th>
                    <th className="py-3 px-4">TDHP HESAP KODU VE ADI</th>
                    <th className="py-3 px-4 text-right w-44">BORÇ (TL)</th>
                    <th className="py-3 px-4 text-right w-44">ALACAK (TL)</th>
                    <th className="py-3 px-4 text-center w-14">İŞLEM</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle dark:divide-zinc-800 text-sm">
                  {lines.map((line, index) => {
                    const accountDef = line.accountCode
                      ? getAccountByCode(line.accountCode)
                      : undefined;
                    const isCreditSide = line.credit > 0;
                    const isDebitSide = line.debit > 0;

                    return (
                      <tr
                        key={line.id}
                        className={`group transition-colors ${
                          isCreditSide
                            ? 'bg-accent-surface/10 hover:bg-accent-surface/25 dark:bg-[#2A1813]/30'
                            : 'hover:bg-surface-muted/25 dark:hover:bg-zinc-900/40'
                        }`}
                      >
                        {/* YÖN Rozeti */}
                        <td className="py-3.5 px-5 align-middle">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded font-ledger-readout text-[11px] font-bold border ${
                              isDebitSide
                                ? 'bg-secondary-container/40 text-on-secondary-container border-secondary/30 dark:bg-emerald-950/70 dark:text-emerald-300 dark:border-emerald-800/50'
                                : isCreditSide
                                ? 'bg-accent-surface text-primary border-primary/30 dark:bg-[#3A1D16] dark:text-[#FFB4A4] dark:border-primary/40'
                                : 'bg-surface-muted text-text-muted border-border-subtle dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700'
                            }`}
                          >
                            {isDebitSide
                              ? 'BORÇ'
                              : isCreditSide
                              ? 'ALACAK'
                              : `#0${index + 1}`}
                          </span>
                        </td>

                        {/* TDHP Hesap Seçimi (Alacak satırlarında geleneksel içeriden girinti) */}
                        <td
                          className={`py-3.5 px-4 align-middle transition-all ${
                            isCreditSide ? 'pl-9' : 'pl-4'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {isCreditSide && (
                              <span className="text-text-muted font-ledger-readout select-none">
                                ↳
                              </span>
                            )}
                            <div className="flex-1 min-w-[260px]">
                              <AccountSelect
                                value={line.accountCode}
                                onChange={(code) =>
                                  updateLine(activeTx.id, line.id, {
                                    accountCode: code,
                                  })
                                }
                              />
                            </div>
                          </div>
                          {accountDef && (
                            <div
                              className={`text-[12px] text-text-muted dark:text-zinc-400 font-body-editorial mt-1 ${
                                isCreditSide ? 'pl-5' : ''
                              }`}
                            >
                              Açıklama: {accountDef.description}
                            </div>
                          )}
                        </td>

                        {/* BORÇ (TL) Girişi */}
                        <td className="py-3.5 px-4 align-middle text-right">
                          <input
                            type="number"
                            step="1"
                            min="0"
                            value={line.debit > 0 ? line.debit : ''}
                            onChange={(e) =>
                              handleDebitChange(line.id, e.target.value)
                            }
                            placeholder="0,00"
                            className={`w-full font-ledger-readout font-semibold text-right rounded-lg px-2.5 py-1.5 tabular-nums outline-none transition-all border ${
                              isDebitSide
                                ? 'text-text-primary dark:text-white bg-surface-muted/50 dark:bg-zinc-900 border-border-subtle dark:border-zinc-700 focus:border-secondary focus:ring-1 focus:ring-secondary focus:bg-surface'
                                : 'text-text-muted bg-surface-muted/20 dark:bg-zinc-900/40 border-border-subtle/60 dark:border-zinc-800 focus:border-secondary focus:bg-surface'
                            }`}
                          />
                        </td>

                        {/* ALACAK (TL) Girişi */}
                        <td className="py-3.5 px-4 align-middle text-right">
                          <input
                            type="number"
                            step="1"
                            min="0"
                            value={line.credit > 0 ? line.credit : ''}
                            onChange={(e) =>
                              handleCreditChange(line.id, e.target.value)
                            }
                            placeholder="0,00"
                            className={`w-full font-ledger-readout font-semibold text-right rounded-lg px-2.5 py-1.5 tabular-nums outline-none transition-all border ${
                              isCreditSide
                                ? 'text-primary dark:text-[#FFB4A4] bg-accent-surface/35 dark:bg-[#3A1D16]/40 border-primary/30 focus:border-primary focus:ring-1 focus:ring-primary focus:bg-surface'
                                : 'text-text-muted bg-surface-muted/20 dark:bg-zinc-900/40 border-border-subtle/60 dark:border-zinc-800 focus:border-primary focus:bg-surface'
                            }`}
                          />
                        </td>

                        {/* Satır Sil */}
                        <td className="py-3.5 px-4 align-middle text-center">
                          <button
                            type="button"
                            onClick={() => removeLine(activeTx.id, line.id)}
                            className="p-1.5 rounded-lg text-text-muted hover:text-error hover:bg-error-container/25 transition-colors cursor-pointer"
                            title="Satırı Çıkar"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* YÜKSEK KONTRASTLI DENKLİK DOCK'U (#18181B Charcoal Ink) */}
            <div className="bg-surface-contrast text-surface p-6 border-t border-border-subtle">
              <div className="flex flex-col md:flex-row items-center justify-between gap-5">
                {/* Sol: Yevmiye Maddesi Toplamları ve Denklik Durumu */}
                <div className="space-y-2 text-center md:text-left">
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 font-ledger-readout text-sm tabular-nums">
                    <span className="text-text-muted uppercase text-xs tracking-wider">
                      YEVMİYE MADDESİ TOPLAMLARI:
                    </span>
                    <span className="text-surface font-bold">
                      BORÇ {formatCurrency(validation.totalDebit)}
                    </span>
                    <span className="text-text-muted font-bold">=</span>
                    <span className="text-surface font-bold">
                      ALACAK {formatCurrency(validation.totalCredit)}
                    </span>
                  </div>

                  {validation.isValid ? (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/30 text-secondary-fixed border border-secondary/40 text-xs font-ledger-readout font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>
                        ✓ BORÇ = ALACAK DENKLİĞİ SAĞLANDI • ÇİFT TARAFLI KAYIT
                        DOĞRU
                      </span>
                    </div>
                  ) : validation.totalDebit === 0 &&
                    validation.totalCredit === 0 ? (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-zinc-300 border border-white/15 text-xs font-ledger-readout">
                      <Info className="w-3.5 h-3.5" />
                      <span>
                        HENÜZ KAYIT GİRİLMEDİ • HESAPLARI SEÇİP TUTARLARI
                        YAZINIZ
                      </span>
                    </div>
                  ) : validation.difference < 0.01 ? (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-container/30 text-primary-fixed border border-primary-container/50 text-xs font-ledger-readout font-semibold">
                      <Scale className="w-3.5 h-3.5" />
                      <span>
                        MATEMATİKSEL DENGE TAM • HESAP KODU VEYA TUTARI KONTROL
                        EDİNİZ
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-container/40 text-primary-fixed border border-primary-container/60 text-xs font-ledger-readout font-semibold tabular-nums">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>
                          DENGESİZ KAYIT: {formatCurrency(validation.difference)}{' '}
                          FARK VAR
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const diff = validation.difference;
                          if (diff <= 0.01) return;
                          const isDebitMissing =
                            validation.totalDebit < validation.totalCredit;
                          const emptyLine = lines.find(
                            (l) => l.debit === 0 && l.credit === 0
                          );
                          if (emptyLine) {
                            updateLine(
                              activeTx.id,
                              emptyLine.id,
                              isDebitMissing
                                ? { debit: diff, credit: 0 }
                                : { credit: diff, debit: 0 }
                            );
                          } else {
                            addLine(activeTx.id);
                          }
                        }}
                        className="px-2.5 py-1 rounded-full bg-white/15 hover:bg-white/25 text-white text-[11px] font-ledger-readout font-semibold transition-colors cursor-pointer"
                      >
                        Farkı{' '}
                        {validation.totalDebit < validation.totalCredit
                          ? 'Borca'
                          : 'Alacağa'}{' '}
                        Ekle
                      </button>
                    </div>
                  )}
                </div>

                {/* Sağ: Sonraki İşleme Geç / Kendin Doldur / Bitir CTA */}
                {hasNextTx ? (
                  <button
                    type="button"
                    onClick={() =>
                      setActiveTransactionIndex(activeTransactionIndex + 1)
                    }
                    className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-primary-container hover:bg-primary text-on-primary-container font-ledger-readout font-bold text-sm shadow-[0_4px_16px_rgba(200,75,49,0.3)] transition-all active:scale-[0.98] shrink-0 cursor-pointer"
                  >
                    <span>Sonraki İşleme Geç (#{activeTx.order + 1})</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <div className="flex flex-wrap items-center justify-center md:justify-end gap-2.5 w-full md:w-auto">
                    <button
                      type="button"
                      onClick={() => {
                        setLedgerViewMode('practice');
                        setActiveTab('defterikebir');
                      }}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full bg-white/15 hover:bg-white/25 text-white border border-white/20 font-ledger-readout font-semibold text-xs transition-all cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>T-Cetvelini Kendin Doldur</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setBalanceViewMode('practice');
                        setActiveTab('bilanco');
                      }}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full bg-white/15 hover:bg-white/25 text-white border border-white/20 font-ledger-readout font-semibold text-xs transition-all cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Bilançoyu Kendin Doldur</span>
                    </button>
                    <button
                      type="button"
                      onClick={finishScenarioAndShowSummary}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-secondary hover:bg-semantic-balance text-white font-ledger-readout font-bold text-sm shadow-sm transition-all active:scale-[0.98] shrink-0 cursor-pointer"
                    >
                      <span>Görevi Bitir &amp; Karne Al</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ÖĞRENME MODU: CANLI PEDAGOJİK TEŞHİS KARTI */}
          {mode === 'ogrenme' &&
            (validation.totalDebit > 0 || validation.totalCredit > 0) && (
              <div className="bg-surface dark:bg-[#1C1B19] rounded-[1.75rem] p-5 border border-border-subtle dark:border-zinc-800 shadow-xs space-y-3">
                {validation.isValid ? (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed shrink-0 mt-0.5">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-card-title text-sm font-bold text-text-primary dark:text-white">
                        Harika! Yevmiye Kaydı Doğru
                      </h4>
                      <p className="text-xs sm:text-sm font-body-editorial text-text-secondary dark:text-zinc-300 mt-1 leading-relaxed">
                        {activeTx.expectedEntry.educationalNotes}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between pb-2 border-b border-border-subtle dark:border-zinc-800">
                      <span className="font-ledger-readout text-xs font-bold uppercase tracking-wider text-primary">
                        Anlık Hata Kontrolü &amp; Çözüm İpucu
                      </span>
                      <span className="font-ledger-readout text-[11px] text-text-muted">
                        Öğrenme Modu
                      </span>
                    </div>

                    {validation.diagnostics
                      .filter((d) => d.type !== 'CORRECT')
                      .map((diag, idx) => (
                        <div
                          key={idx}
                          className="p-3.5 rounded-xl bg-accent-surface/50 dark:bg-[#2A1813]/50 border border-primary/20 text-xs space-y-1"
                        >
                          <div className="flex items-center justify-between font-ledger-readout font-bold text-primary dark:text-[#FFB4A4]">
                            <span>{diag.message}</span>
                            {diag.accountCode && (
                              <span className="px-2 py-0.5 rounded bg-surface dark:bg-zinc-900 text-text-primary dark:text-zinc-200 border border-border-subtle">
                                Kod: {diag.accountCode}
                              </span>
                            )}
                          </div>
                          <p className="font-body-editorial text-text-secondary dark:text-zinc-300 leading-relaxed">
                            <strong className="text-text-primary dark:text-white">
                              Muhasebe Mantığı:
                            </strong>{' '}
                            {diag.pedagogicalTip}
                          </p>
                          {diag.suggestedAction && (
                            <p className="font-ledger-readout text-[11px] text-secondary dark:text-secondary-fixed font-semibold pt-0.5">
                              Öneri: {diag.suggestedAction}
                            </p>
                          )}
                        </div>
                      ))}
                  </div>
                )}
              </div>
            )}
        </div>

        {/* SAĞ SÜTUN (4 Sütun): CANLI BÜYÜK DEFTER & ANLIK BİLANÇO TERAZİSİ */}
        <div className="lg:col-span-4 space-y-6">
          {/* KART 1: CANLI BÜYÜK DEFTER (T-CETVELİ) */}
          <div className="bg-surface dark:bg-[#1C1B19] rounded-[2rem] p-6 border border-border-subtle dark:border-zinc-800 shadow-[0_12px_32px_-8px_rgba(24,24,27,0.05)]">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-border-subtle dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <Columns3 className="w-4 h-4 text-primary" />
                <h4 className="font-card-title text-xs sm:text-sm uppercase tracking-wider font-bold text-text-primary dark:text-white">
                  BÜYÜK DEFTER (T-CETVELİ)
                </h4>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-ledger-readout font-bold bg-secondary-container/40 text-on-secondary-container">
                CANLI
              </span>
            </div>

            <div className="space-y-3.5">
              {previewTAccounts.map((tAcc) => (
                <div
                  key={tAcc.accountCode}
                  className="p-3.5 rounded-xl bg-surface-muted/40 dark:bg-zinc-900/60 border border-border-subtle dark:border-zinc-800 tabular-nums"
                >
                  <div className="text-center font-ledger-readout font-bold text-xs text-text-primary dark:text-white pb-1.5 border-b-2 border-text-primary dark:border-zinc-400">
                    {tAcc.accountCode} {tAcc.accountName.toUpperCase()}
                  </div>

                  <div className="grid grid-cols-2 divide-x-2 divide-text-primary dark:divide-zinc-400 pt-2 pb-1 text-center font-ledger-readout text-xs">
                    <div>
                      <span className="text-[10px] text-text-muted block">
                        BORÇ (SOL)
                      </span>
                      <span
                        className={
                          tAcc.totalDebit > 0
                            ? 'text-secondary dark:text-secondary-fixed font-semibold'
                            : 'text-text-muted'
                        }
                      >
                        {formatCurrency(tAcc.totalDebit)}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-text-muted block">
                        ALACAK (SAĞ)
                      </span>
                      <span
                        className={
                          tAcc.totalCredit > 0
                            ? 'text-primary dark:text-[#FFB4A4] font-semibold'
                            : 'text-text-muted'
                        }
                      >
                        {formatCurrency(tAcc.totalCredit)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-2 pt-1.5 border-t border-border-subtle dark:border-zinc-800 flex justify-between items-center text-[11px] font-ledger-readout text-text-secondary dark:text-zinc-400">
                    <span>Kalan Bakiye:</span>
                    <span
                      className={`font-bold ${
                        tAcc.balanceDirection === 'BORC'
                          ? 'text-secondary dark:text-secondary-fixed'
                          : tAcc.balanceDirection === 'ALACAK'
                          ? 'text-primary dark:text-[#FFB4A4]'
                          : 'text-text-muted'
                      }`}
                    >
                      {tAcc.balanceDirection === 'BORC'
                        ? `Borç: ${formatCurrency(tAcc.balance)}`
                        : tAcc.balanceDirection === 'ALACAK'
                        ? `Alacak: ${formatCurrency(tAcc.balance)}`
                        : 'Denk (0,00 ₺)'}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setLedgerViewMode('auto');
                  setActiveTab('defterikebir');
                }}
                className="py-2 px-3 rounded-xl border border-border-subtle dark:border-zinc-800 hover:bg-surface-muted/60 dark:hover:bg-zinc-800 text-xs font-ledger-readout font-semibold text-text-secondary dark:text-zinc-300 transition-colors cursor-pointer"
              >
                Otomatik T-Cetvelleri
              </button>
              <button
                type="button"
                onClick={() => {
                  setLedgerViewMode('practice');
                  setActiveTab('defterikebir');
                }}
                className="py-2 px-3 rounded-xl bg-accent-surface dark:bg-[#3A1D16] hover:bg-primary-container hover:text-white text-primary dark:text-[#FFB4A4] border border-primary/20 text-xs font-ledger-readout font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Kendin Doldur</span>
              </button>
            </div>
          </div>

          {/* KART 2: ANLIK BİLANÇO TERAZİSİ & TERS BAKİYE KONTROLÜ */}
          <div className="bg-surface dark:bg-[#1C1B19] rounded-[2rem] p-6 border border-border-subtle dark:border-zinc-800 shadow-[0_12px_32px_-8px_rgba(24,24,27,0.05)] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border-subtle dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <Scale className="w-4 h-4 text-secondary" />
                <h4 className="font-card-title text-xs sm:text-sm uppercase tracking-wider font-bold text-text-primary dark:text-white">
                  BİLANÇO TERAZİSİ (AKTİF = PASİF)
                </h4>
              </div>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-ledger-readout font-bold ${
                  balanceSheet.isBalanced
                    ? 'bg-secondary/10 text-secondary dark:text-secondary-fixed'
                    : 'bg-accent-surface text-primary'
                }`}
              >
                {balanceSheet.isBalanced ? 'EŞİT ✓' : 'FARK VAR'}
              </span>
            </div>

            {/* Aktif / Pasif Toplamları ve Terazi Çubuğu */}
            <div className="p-4 rounded-xl bg-surface-muted/50 dark:bg-zinc-900/60 border border-border-subtle dark:border-zinc-800 space-y-3 tabular-nums">
              <div className="flex justify-between items-center font-ledger-readout text-xs">
                <span className="text-text-secondary dark:text-zinc-400 font-medium">
                  Aktif (Varlıklar) Toplamı:
                </span>
                <span className="font-bold text-text-primary dark:text-white">
                  {formatCurrency(balanceSheet.assets.totalAssets)}
                </span>
              </div>
              <div className="flex justify-between items-center font-ledger-readout text-xs">
                <span className="text-text-secondary dark:text-zinc-400 font-medium">
                  Pasif (Kaynaklar) Toplamı:
                </span>
                <span className="font-bold text-text-primary dark:text-white">
                  {formatCurrency(
                    balanceSheet.liabilities.totalLiabilitiesAndEquity
                  )}
                </span>
              </div>

              <div className="w-full bg-border-subtle dark:bg-zinc-800 h-2 rounded-full overflow-hidden flex">
                <div className="w-1/2 bg-secondary h-full" />
                <div className="w-1/2 bg-primary-container h-full" />
              </div>

              <div
                className={`text-center font-ledger-readout text-[11px] font-bold pt-1 ${
                  balanceSheet.isBalanced
                    ? 'text-secondary dark:text-secondary-fixed'
                    : 'text-primary dark:text-[#FFB4A4]'
                }`}
              >
                Fark: {formatCurrency(Math.abs(balanceSheet.difference))} •{' '}
                {balanceSheet.isBalanced
                  ? 'Varlıklar = Kaynaklar Eşitliği Sağlandı'
                  : 'Aktif / Pasif Dengesini Kontrol Ediniz'}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setBalanceViewMode('auto');
                  setActiveTab('bilanco');
                }}
                className="py-2 px-3 rounded-xl border border-border-subtle dark:border-zinc-800 hover:bg-surface-muted/60 dark:hover:bg-zinc-800 text-xs font-ledger-readout font-semibold text-text-secondary dark:text-zinc-300 transition-colors cursor-pointer"
              >
                Otomatik Bilanço
              </button>
              <button
                type="button"
                onClick={() => {
                  setBalanceViewMode('practice');
                  setActiveTab('bilanco');
                }}
                className="py-2 px-3 rounded-xl bg-accent-surface dark:bg-[#3A1D16] hover:bg-primary-container hover:text-white text-primary dark:text-[#FFB4A4] border border-primary/20 text-xs font-ledger-readout font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Bilançoyu Kendin Doldur</span>
              </button>
            </div>

            {/* Ters Bakiye Kalkanı */}
            <div className="p-3.5 rounded-xl bg-accent-surface/40 dark:bg-[#2A1813]/40 border border-border-subtle dark:border-zinc-800 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <div className="text-xs space-y-1">
                <span className="font-ledger-readout font-bold text-text-primary dark:text-white block">
                  Kasa Ters Bakiye Kontrolü
                </span>
                <p className="text-text-secondary dark:text-zinc-300 leading-relaxed font-body-editorial">
                  <span className="font-ledger-readout font-semibold text-text-primary dark:text-zinc-100 tabular-nums">
                    100 KASA Kalanı:{' '}
                    {kasaLedger
                      ? `${formatCurrency(kasaLedger.balance)} ${
                          kasaLedger.balanceDirection === 'BORC'
                            ? 'Borç'
                            : kasaLedger.balanceDirection === 'ALACAK'
                            ? 'Alacak (Hatalı!)'
                            : 'Denk'
                        }.`
                      : '0,00 ₺.'}
                  </span>{' '}
                  {kasaLedger?.balanceDirection === 'ALACAK'
                    ? 'Dikkat: Kasada olmayan nakit para çıkılamaz, 100 Kasa alacak bakiyesi veremez!'
                    : 'Kasada ters bakiye yok. Varlık hesapları Borç (Sol) bakiyesi verir.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
