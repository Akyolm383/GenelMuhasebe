import React, { useState } from 'react';
import { useAccountingStore } from '../store/useAccountingStore';
import {
  formatCurrency,
  deriveLedger,
} from '../core/accountingEngine';
import type { JournalEntry } from '../types/accounting';
import {
  Scale,
  Search,
  ArrowUpRight,
  ArrowDownLeft,
  Info,
  Eye,
  Edit3,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';

export const LedgerView: React.FC = () => {
  const {
    getLedgerAccounts,
    setActiveTransactionIndex,
    setActiveTab,
    getCurrentScenario,
    ledgerViewMode: viewMode,
    setLedgerViewMode: setViewMode,
    practiceLedgerData: practiceData,
    setPracticeLedgerData: setPracticeData,
  } = useAccountingStore();
  const [filterQuery, setFilterQuery] = useState('');
  const [filterClass, setFilterClass] = useState<number | 'all'>('all');

  const userLedgerAccounts = getLedgerAccounts();
  const scenario = getCurrentScenario();

  // Eğer öğrenci henüz yevmiye kaydı girmeden doğrudan "Kendin Doldur" T-Cetveli sekmesine geçtiyse,
  // senaryonun beklenen hesaplarını T-Cetveli kartları olarak hazırla ki boş ekran görmesin.
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

  const ledgerAccounts =
    userLedgerAccounts.length > 0
      ? userLedgerAccounts
      : viewMode === 'practice'
      ? expectedLedgerAccounts
      : userLedgerAccounts;

  const [practiceResult, setPracticeResult] = useState<{
    isChecked: boolean;
    isCorrect: boolean;
    errors: string[];
  }>({ isChecked: false, isCorrect: false, errors: [] });

  const displayedAccounts = (
    filterClass === 'all'
      ? ledgerAccounts
      : ledgerAccounts.filter((a) => a.accountClass === filterClass)
  ).filter(
    (acc) =>
      acc.accountCode.includes(filterQuery.trim()) ||
      acc.accountName.toLowerCase().includes(filterQuery.trim().toLowerCase())
  );

  const handleMovementClick = (txId: string) => {
    const index = scenario.transactions.findIndex((t) => t.id === txId);
    if (index !== -1) {
      setActiveTransactionIndex(index);
      setActiveTab('yevmiye');
    }
  };

  const handlePracticeChange = (
    code: string,
    field: 'debitTotal' | 'creditTotal' | 'balance' | 'direction',
    val: string
  ) => {
    setPracticeData((prev) => ({
      ...prev,
      [code]: {
        debitTotal: prev[code]?.debitTotal || '',
        creditTotal: prev[code]?.creditTotal || '',
        balance: prev[code]?.balance || '',
        direction: prev[code]?.direction || 'BORC',
        [field]: val,
      },
    }));
  };

  const handleCheckPractice = () => {
    const errors: string[] = [];

    ledgerAccounts.forEach((acc) => {
      const user = practiceData[acc.accountCode] || {
        debitTotal: '0',
        creditTotal: '0',
        balance: '0',
        direction: 'BORC',
      };

      const uDebit = parseFloat(user.debitTotal) || 0;
      const uCredit = parseFloat(user.creditTotal) || 0;
      const uBal = parseFloat(user.balance) || 0;
      const uDir = user.direction;

      if (Math.abs(uDebit - acc.totalDebit) > 0.01) {
        errors.push(
          `${acc.accountCode} ${acc.accountName}: Borç toplamı yanlış. (Girilen: ${formatCurrency(
            uDebit
          )}, Olması gereken: ${formatCurrency(acc.totalDebit)})`
        );
      }

      if (Math.abs(uCredit - acc.totalCredit) > 0.01) {
        errors.push(
          `${acc.accountCode} ${acc.accountName}: Alacak toplamı yanlış. (Girilen: ${formatCurrency(
            uCredit
          )}, Olması gereken: ${formatCurrency(acc.totalCredit)})`
        );
      }

      if (Math.abs(uBal - acc.balance) > 0.01) {
        errors.push(
          `${acc.accountCode} ${acc.accountName}: Hesap bakiyesi tutarı yanlış. (Girilen: ${formatCurrency(
            uBal
          )}, Olması gereken: ${formatCurrency(acc.balance)})`
        );
      }

      if (uDir !== acc.balanceDirection && acc.balance > 0) {
        const dirName =
          acc.balanceDirection === 'BORC'
            ? 'Borç Bakiyesi'
            : 'Alacak Bakiyesi';
        errors.push(
          `${acc.accountCode} ${acc.accountName}: Bakiye yönü hatalı. Bu hesap ${dirName} vermelidir.`
        );
      }
    });

    setPracticeResult({
      isChecked: true,
      isCorrect: errors.length === 0,
      errors,
    });
  };

  const handleAutoFillPractice = () => {
    const filled: Record<
      string,
      {
        debitTotal: string;
        creditTotal: string;
        balance: string;
        direction: 'BORC' | 'ALACAK' | 'DENK';
      }
    > = {};
    ledgerAccounts.forEach((acc) => {
      filled[acc.accountCode] = {
        debitTotal: acc.totalDebit.toString(),
        creditTotal: acc.totalCredit.toString(),
        balance: acc.balance.toString(),
        direction: acc.balanceDirection,
      };
    });
    setPracticeData(filled);
  };

  const getNatureBadgeColor = (nature: string) => {
    switch (nature) {
      case 'AKTIF':
        return 'bg-secondary-container/40 text-on-secondary-container border-secondary/30';
      case 'PASIF':
        return 'bg-accent-surface text-primary border-primary/30';
      case 'GELIR':
        return 'bg-secondary-fixed/50 text-secondary border-secondary/30';
      case 'GIDER':
        return 'bg-error-container/60 text-semantic-warning border-semantic-warning/30';
      default:
        return 'bg-surface-muted text-text-secondary border-border-subtle';
    }
  };

  return (
    <div className="space-y-6">
      {/* Üst Bilgi ve Mod Değiştirici Çubuğu */}
      <div className="bg-surface dark:bg-[#1C1B19] p-5 sm:p-6 rounded-[2rem] shadow-[0_12px_32px_-8px_rgba(24,24,27,0.05)] border border-border-subtle dark:border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors">
        <div>
          <div className="flex items-center gap-2.5">
            <Scale className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-card-title font-bold text-text-primary dark:text-white">
              Büyük Defter (T-Hesapları Cetveli)
            </h3>
            <span className="text-xs font-ledger-readout bg-surface-muted dark:bg-zinc-800 text-text-primary dark:text-zinc-200 px-3 py-0.5 rounded-full font-semibold border border-border-subtle dark:border-zinc-700 tabular-nums">
              {ledgerAccounts.length} Aktif Hesap
            </span>
          </div>
          <p className="text-xs sm:text-sm font-body-editorial text-text-secondary dark:text-zinc-400 mt-1">
            {viewMode === 'auto'
              ? 'Yevmiye defterinden otomatik aktarılan hesap hareketleri ve canlı T-cetveli bakiyeleri'
              : 'Sınav Provası: Yevmiyeye bakarak her hesabın borç/alacak toplamlarını ve bakiyesini kendiniz çıkarın'}
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
              <span>Kendin Doldur (Sınav Provası)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sınav Provası Bilgi ve Kontrol Kutusu */}
      {viewMode === 'practice' && (
        <div className="bg-surface dark:bg-[#1C1B19] border border-border-subtle dark:border-zinc-800 rounded-[2rem] p-5 text-xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <div>
                <strong className="block font-card-title text-sm font-bold text-text-primary dark:text-white">
                  Nasıl Doldurulur? (Sınav Alıştırması)
                </strong>
                <span className="text-text-secondary dark:text-zinc-300 font-body-editorial leading-relaxed">
                  Yevmiye defterine yaptığınız kayıtlara bakarak her hesabın
                  toplam <strong>Borç</strong> ve <strong>Alacak</strong>{' '}
                  tutarlarını giriniz. Ardından aradaki farkı{' '}
                  <strong>Kalan Bakiye</strong> kutusuna yazıp, bakiye türünü
                  seçiniz.
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleAutoFillPractice}
                className="px-3.5 py-2 bg-surface-muted dark:bg-zinc-800 border border-border-subtle dark:border-zinc-700 hover:bg-border-subtle text-text-primary dark:text-zinc-200 font-ledger-readout font-semibold rounded-full text-xs cursor-pointer flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                <span>Çözümü Doldur</span>
              </button>

              <button
                type="button"
                onClick={handleCheckPractice}
                className="px-4 py-2 bg-primary-container hover:bg-primary text-on-primary-container font-ledger-readout font-bold rounded-full shadow-xs cursor-pointer text-xs"
              >
                T-Hesaplarımı Kontrol Et
              </button>
            </div>
          </div>

          {practiceResult.isChecked && (
            <div
              className={`mt-3 p-4 rounded-2xl border text-xs ${
                practiceResult.isCorrect
                  ? 'bg-secondary-fixed/25 border-secondary/30 text-on-secondary-fixed'
                  : 'bg-accent-surface border-primary/30 text-primary'
              }`}
            >
              {practiceResult.isCorrect ? (
                <div className="flex items-center gap-2 font-ledger-readout font-bold text-secondary">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>
                    Mükemmel! Tüm hesapların borç-alacak toplamlarını ve
                    bakiyelerini eksiksiz çıkardınız.
                  </span>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 font-ledger-readout font-bold text-primary">
                    <AlertTriangle className="w-4 h-4" />
                    <span>
                      Düzeltilmesi Gereken Hatalar ({practiceResult.errors.length}
                      ):
                    </span>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-text-primary pl-1 font-ledger-readout">
                    {practiceResult.errors.map((err, idx) => (
                      <li key={idx}>{err}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Arama ve Sınıf Filtresi */}
      {viewMode === 'auto' && (
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
      )}

      {/* T-Hesapları Izgarası */}
      {displayedAccounts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayedAccounts.map((acc) => {
            const hasDebit = acc.debitMovements.length > 0;
            const hasCredit = acc.creditMovements.length > 0;

            if (viewMode === 'practice') {
              const uData = practiceData[acc.accountCode] || {
                debitTotal: '',
                creditTotal: '',
                balance: '',
                direction: 'BORC',
              };

              return (
                <div
                  key={acc.accountCode}
                  className="bg-surface dark:bg-[#1C1B19] rounded-[1.75rem] shadow-xs border border-border-subtle dark:border-zinc-800 overflow-hidden flex flex-col"
                >
                  <div className="bg-surface-muted/60 dark:bg-zinc-900 px-4 py-3 border-b border-border-subtle dark:border-zinc-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-ledger-readout font-bold text-sm text-text-primary dark:text-white bg-surface dark:bg-zinc-800 px-2 py-0.5 rounded border border-border-subtle">
                        {acc.accountCode}
                      </span>
                      <h4 className="font-card-title font-bold text-sm text-text-primary dark:text-zinc-100 truncate">
                        {acc.accountName}
                      </h4>
                    </div>
                    <span
                      className={`text-[10px] font-ledger-readout font-bold uppercase px-2 py-0.5 rounded border ${getNatureBadgeColor(
                        acc.nature
                      )}`}
                    >
                      {acc.nature}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 text-center text-[11px] font-ledger-readout font-bold uppercase tracking-wider bg-surface-muted/30 dark:bg-zinc-900/60 border-b border-border-subtle dark:border-zinc-800 text-text-secondary">
                    <div className="py-1.5 border-r border-border-subtle dark:border-zinc-800">
                      BORÇ (SOL)
                    </div>
                    <div className="py-1.5">ALACAK (SAĞ)</div>
                  </div>

                  <div className="p-4 space-y-3 flex-1 text-xs font-ledger-readout">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-bold text-secondary mb-1">
                          Borç Toplamı:
                        </label>
                        <input
                          type="number"
                          value={uData.debitTotal}
                          onChange={(e) =>
                            handlePracticeChange(
                              acc.accountCode,
                              'debitTotal',
                              e.target.value
                            )
                          }
                          placeholder="0,00"
                          className="w-full p-2 bg-surface-muted/40 dark:bg-zinc-900 border border-border-subtle dark:border-zinc-800 rounded-lg font-ledger-readout text-xs text-text-primary dark:text-white tabular-nums"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-primary mb-1">
                          Alacak Toplamı:
                        </label>
                        <input
                          type="number"
                          value={uData.creditTotal}
                          onChange={(e) =>
                            handlePracticeChange(
                              acc.accountCode,
                              'creditTotal',
                              e.target.value
                            )
                          }
                          placeholder="0,00"
                          className="w-full p-2 bg-surface-muted/40 dark:bg-zinc-900 border border-border-subtle dark:border-zinc-800 rounded-lg font-ledger-readout text-xs text-text-primary dark:text-white tabular-nums"
                        />
                      </div>
                    </div>

                    <div className="pt-2 border-t border-border-subtle dark:border-zinc-800 grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-bold text-text-secondary mb-1">
                          Kalan Bakiye:
                        </label>
                        <input
                          type="number"
                          value={uData.balance}
                          onChange={(e) =>
                            handlePracticeChange(
                              acc.accountCode,
                              'balance',
                              e.target.value
                            )
                          }
                          placeholder="Fark tutarı"
                          className="w-full p-2 bg-surface-muted/40 dark:bg-zinc-900 border border-border-subtle dark:border-zinc-800 rounded-lg font-ledger-readout text-xs text-text-primary dark:text-white font-semibold tabular-nums"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-text-secondary mb-1">
                          Bakiye Yönü:
                        </label>
                        <select
                          value={uData.direction}
                          onChange={(e) =>
                            handlePracticeChange(
                              acc.accountCode,
                              'direction',
                              e.target.value
                            )
                          }
                          className="w-full p-2 bg-surface-muted/40 dark:bg-zinc-900 border border-border-subtle dark:border-zinc-800 rounded-lg text-xs font-semibold text-text-primary dark:text-white cursor-pointer"
                        >
                          <option value="BORC">Borç Bakiyesi</option>
                          <option value="ALACAK">Alacak Bakiyesi</option>
                          <option value="DENK">Denk (Kapanmış)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              );
            }

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
                    {acc.nature}
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
                          onClick={() => handleMovementClick(mov.transactionId)}
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
                          onClick={() => handleMovementClick(mov.transactionId)}
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
  );
};
