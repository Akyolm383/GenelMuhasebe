import React, { useState } from 'react';
import { useAccountingStore } from '../store/useAccountingStore';
import { formatCurrency } from '../core/accountingEngine';
import { Scale, Search, ArrowUpRight, ArrowDownLeft, Info, Eye, Edit3, CheckCircle2, AlertTriangle, Sparkles } from 'lucide-react';

export const LedgerView: React.FC = () => {
  const { getLedgerAccounts, setActiveTransactionIndex, setActiveTab, getCurrentScenario } = useAccountingStore();
  const [filterQuery, setFilterQuery] = useState('');
  const [filterClass, setFilterClass] = useState<number | 'all'>('all');
  const [viewMode, setViewMode] = useState<'auto' | 'practice'>('auto');

  const ledgerAccounts = getLedgerAccounts();
  const scenario = getCurrentScenario();

  // Öğrencinin elle doldurduğu T-Hesabı pratik state'i:
  // accountCode -> { debitTotal, creditTotal, balance, direction }
  const [practiceData, setPracticeData] = useState<Record<string, {
    debitTotal: string;
    creditTotal: string;
    balance: string;
    direction: 'BORC' | 'ALACAK' | 'DENK';
  }>>({});

  const [practiceResult, setPracticeResult] = useState<{
    isChecked: boolean;
    isCorrect: boolean;
    errors: string[];
  }>({ isChecked: false, isCorrect: false, errors: [] });

  // Filtreleme
  const displayedAccounts = (filterClass === 'all'
    ? ledgerAccounts
    : ledgerAccounts.filter(a => a.accountClass === filterClass)
  ).filter(acc => 
    acc.accountCode.includes(filterQuery.trim()) ||
    acc.accountName.toLowerCase().includes(filterQuery.trim().toLowerCase())
  );

  const handleMovementClick = (txId: string) => {
    const index = scenario.transactions.findIndex(t => t.id === txId);
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
    setPracticeData(prev => ({
      ...prev,
      [code]: {
        debitTotal: prev[code]?.debitTotal || '',
        creditTotal: prev[code]?.creditTotal || '',
        balance: prev[code]?.balance || '',
        direction: prev[code]?.direction || 'BORC',
        [field]: val,
      }
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

      // Borç toplamı kontrolü
      if (Math.abs(uDebit - acc.totalDebit) > 0.01) {
        errors.push(`${acc.accountCode} ${acc.accountName}: Borç toplamı yanlış. (Girilen: ${formatCurrency(uDebit)}, Olması gereken: ${formatCurrency(acc.totalDebit)})`);
      }

      // Alacak toplamı kontrolü
      if (Math.abs(uCredit - acc.totalCredit) > 0.01) {
        errors.push(`${acc.accountCode} ${acc.accountName}: Alacak toplamı yanlış. (Girilen: ${formatCurrency(uCredit)}, Olması gereken: ${formatCurrency(acc.totalCredit)})`);
      }

      // Bakiye kontrolü
      if (Math.abs(uBal - acc.balance) > 0.01) {
        errors.push(`${acc.accountCode} ${acc.accountName}: Hesap bakiyesi tutarı yanlış. (Girilen: ${formatCurrency(uBal)}, Olması gereken: ${formatCurrency(acc.balance)})`);
      }

      // Bakiye yönü kontrolü
      if (uDir !== acc.balanceDirection && acc.balance > 0) {
        const dirName = acc.balanceDirection === 'BORC' ? 'Borç Bakiyesi' : 'Alacak Bakiyesi';
        errors.push(`${acc.accountCode} ${acc.accountName}: Bakiye yönü hatalı. Bu hesap ${dirName} vermelidir.`);
      }
    });

    setPracticeResult({
      isChecked: true,
      isCorrect: errors.length === 0,
      errors,
    });
  };

  const handleAutoFillPractice = () => {
    const filled: Record<string, { debitTotal: string; creditTotal: string; balance: string; direction: 'BORC' | 'ALACAK' | 'DENK' }> = {};
    ledgerAccounts.forEach(acc => {
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
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'PASIF':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'GELIR':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'GIDER':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Üst Bilgi ve Mod Değiştirici Çubuğu */}
      <div className="bg-white dark:bg-zinc-950 p-4 rounded-2xl shadow-xs border border-slate-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4 transition-colors">
        <div>
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-indigo-600 dark:text-zinc-200" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Büyük Defter (T-Hesapları)
            </h3>
            <span className="text-xs bg-indigo-50 dark:bg-zinc-900 text-indigo-700 dark:text-zinc-300 px-2.5 py-0.5 rounded-full font-semibold border dark:border-zinc-800">
              {ledgerAccounts.length} Aktif Hesap
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
            {viewMode === 'auto' 
              ? 'Yevmiye defterinden otomatik aktarılan hesap hareketleri ve canlı T-cetveli bakiyeleri'
              : 'Sınav Provası: Yevmiyeye bakarak her hesabın borç/alacak toplamlarını ve bakiyesini kendiniz çıkarın'}
          </p>
        </div>

        {/* Görünüm Seçici (Otomatik vs Sınav Provası) */}
        <div className="flex items-center gap-2">
          <div className="flex bg-slate-100 dark:bg-zinc-900 p-1 rounded-xl border border-slate-200 dark:border-zinc-800 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setViewMode('auto')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === 'auto'
                  ? 'bg-white dark:bg-zinc-800 text-indigo-700 dark:text-zinc-100 shadow-xs'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Otomatik T-Hesapları</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('practice')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === 'practice'
                  ? 'bg-white dark:bg-zinc-800 text-indigo-700 dark:text-zinc-100 shadow-xs'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100'
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
        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-2xl p-4 text-xs text-amber-950 dark:text-amber-200 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <Info className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold text-amber-900 dark:text-amber-200">
                  Nasıl Doldurulur? (Sınav Alıştırması)
                </strong>
                <span className="text-slate-700 dark:text-zinc-300 leading-relaxed">
                  Yevmiye defterine yaptığınız kayıtlara bakarak her hesabın toplam <strong>Borç</strong> ve <strong>Alacak</strong> tutarlarını giriniz.
                  Ardından aradaki farkı <strong>Kalan Bakiye</strong> kutusuna yazıp, bakiye türünü (Borç Bakiyesi / Alacak Bakiyesi) seçiniz.
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleAutoFillPractice}
                className="px-3 py-1.5 bg-white dark:bg-zinc-900 border border-amber-300 dark:border-zinc-700 hover:bg-amber-100 dark:hover:bg-zinc-800 text-amber-900 dark:text-zinc-200 font-semibold rounded-lg text-xs cursor-pointer flex items-center gap-1"
                title="Tüm değerleri doğru çözüme göre otomatik doldur"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>Çözümü Doldur</span>
              </button>

              <button
                type="button"
                onClick={handleCheckPractice}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-xs cursor-pointer text-xs"
              >
                T-Hesaplarımı Kontrol Et
              </button>
            </div>
          </div>

          {practiceResult.isChecked && (
            <div className={`mt-3 p-3.5 rounded-xl border text-xs ${
              practiceResult.isCorrect 
                ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800/80 text-emerald-950 dark:text-emerald-200' 
                : 'bg-rose-50 dark:bg-rose-950/60 border-rose-300 dark:border-rose-800/80 text-rose-950 dark:text-rose-200'
            }`}>
              {practiceResult.isCorrect ? (
                <div className="flex items-center gap-2 font-bold text-emerald-900 dark:text-emerald-200">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <span>Mükemmel! Tüm hesapların borç-alacak toplamlarını ve bakiyelerini eksiksiz çıkardınız.</span>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 font-bold text-rose-900 dark:text-rose-200">
                    <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                    <span>Düzeltilmesi Gereken Hatalar ({practiceResult.errors.length}):</span>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-slate-800 dark:text-zinc-300 pl-1">
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

      {/* Arama ve Sınıf Filtresi (Otomatik Modda) */}
      {viewMode === 'auto' && (
        <div className="flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 flex-1 max-w-sm">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 dark:text-zinc-500 absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                placeholder="Hesap kodu veya adı ara..."
                className="w-full text-xs pl-8 pr-3 py-2 bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-800 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 shadow-2xs"
              />
            </div>
          </div>

          <select
            value={filterClass}
            onChange={(e) => setFilterClass(e.target.value === 'all' ? 'all' : Number(e.target.value))}
            className="text-xs py-2 px-2.5 bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-800 rounded-lg focus:outline-none cursor-pointer text-slate-700 dark:text-zinc-300 font-medium shadow-2xs"
          >
            <option value="all">Tüm Hesap Sınıfları</option>
            <option value="1">1: Dönen Varlıklar</option>
            <option value="2">2: Duran Varlıklar</option>
            <option value="3">3: KVYK (Kısa Vadeli Borçlar)</option>
            <option value="5">5: Öz Kaynaklar</option>
            <option value="6">6: Gelir Tablosu</option>
            <option value="7">7: Maliyet Hesapları</option>
          </select>
        </div>
      )}

      {/* T-Hesapları Izgarası (Grid) */}
      {displayedAccounts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayedAccounts.map((acc) => {
            const hasDebit = acc.debitMovements.length > 0;
            const hasCredit = acc.creditMovements.length > 0;

            // Eğer "Kendin Doldur" modundaysak:
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
                  className="bg-white dark:bg-zinc-950 rounded-2xl shadow-xs border border-slate-300 dark:border-zinc-800 overflow-hidden flex flex-col hover:border-slate-400 dark:hover:border-zinc-700 transition-all"
                >
                  {/* Başlık */}
                  <div className="bg-slate-100 dark:bg-zinc-900 px-4 py-2.5 border-b-2 border-slate-700 dark:border-zinc-700 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sm text-slate-900 dark:text-white bg-white dark:bg-zinc-800 px-2 py-0.5 rounded border border-slate-300 dark:border-zinc-700">
                        {acc.accountCode}
                      </span>
                      <h4 className="font-bold text-sm text-slate-800 dark:text-zinc-100 truncate">
                        {acc.accountName}
                      </h4>
                    </div>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${getNatureBadgeColor(acc.nature)}`}>
                      {acc.nature}
                    </span>
                  </div>

                  {/* Sütun Başlıkları */}
                  <div className="grid grid-cols-2 text-center text-[11px] font-extrabold uppercase tracking-wider bg-slate-50 dark:bg-zinc-900/60 border-b border-slate-300 dark:border-zinc-700 text-slate-700 dark:text-zinc-300">
                    <div className="py-1.5 border-r border-slate-700 dark:border-zinc-700">BORÇ (SOL)</div>
                    <div className="py-1.5">ALACAK (SAĞ)</div>
                  </div>

                  {/* Giriş Alanları */}
                  <div className="p-3.5 space-y-3 bg-slate-50/50 dark:bg-black/40 flex-1 text-xs">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 dark:text-zinc-300 mb-1">
                          Borç Toplamı:
                        </label>
                        <input
                          type="number"
                          value={uData.debitTotal}
                          onChange={(e) => handlePracticeChange(acc.accountCode, 'debitTotal', e.target.value)}
                          placeholder="0,00"
                          className="w-full p-2 bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-800 rounded-lg font-mono text-xs text-slate-900 dark:text-white focus:ring-1 focus:ring-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 dark:text-zinc-300 mb-1">
                          Alacak Toplamı:
                        </label>
                        <input
                          type="number"
                          value={uData.creditTotal}
                          onChange={(e) => handlePracticeChange(acc.accountCode, 'creditTotal', e.target.value)}
                          placeholder="0,00"
                          className="w-full p-2 bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-800 rounded-lg font-mono text-xs text-slate-900 dark:text-white focus:ring-1 focus:ring-indigo-500"
                        />
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-200 dark:border-zinc-800 grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 dark:text-zinc-300 mb-1">
                          Kalan Bakiye:
                        </label>
                        <input
                          type="number"
                          value={uData.balance}
                          onChange={(e) => handlePracticeChange(acc.accountCode, 'balance', e.target.value)}
                          placeholder="Fark tutarı"
                          className="w-full p-2 bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-800 rounded-lg font-mono text-xs text-slate-900 dark:text-white focus:ring-1 focus:ring-indigo-500 font-semibold"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 dark:text-zinc-300 mb-1">
                          Bakiye Yönü:
                        </label>
                        <select
                          value={uData.direction}
                          onChange={(e) => handlePracticeChange(acc.accountCode, 'direction', e.target.value)}
                          className="w-full p-2 bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-800 rounded-lg text-xs font-semibold text-slate-900 dark:text-white focus:ring-1 focus:ring-indigo-500 cursor-pointer"
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

            // Normal Otomatik Görünüm
            return (
              <div 
                key={acc.accountCode} 
                className="bg-white dark:bg-zinc-950 rounded-2xl shadow-xs border border-slate-300 dark:border-zinc-800 overflow-hidden flex flex-col hover:border-slate-400 dark:hover:border-zinc-700 transition-all"
              >
                {/* T-Hesabı Başlığı */}
                <div className="bg-slate-100 dark:bg-zinc-900 px-4 py-2.5 border-b-2 border-slate-700 dark:border-zinc-700 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-slate-900 dark:text-white bg-white dark:bg-zinc-800 px-2 py-0.5 rounded border border-slate-300 dark:border-zinc-700">
                      {acc.accountCode}
                    </span>
                    <h4 className="font-bold text-sm text-slate-800 dark:text-zinc-100 truncate">
                      {acc.accountName}
                    </h4>
                  </div>
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${getNatureBadgeColor(acc.nature)}`}>
                    {acc.nature}
                  </span>
                </div>

                {/* T-Cetveli Sütun Başlıkları: Sol BORÇ, Sağ ALACAK */}
                <div className="grid grid-cols-2 text-center text-[11px] font-extrabold uppercase tracking-wider bg-slate-50 dark:bg-zinc-900/60 border-b border-slate-300 dark:border-zinc-700 text-slate-700 dark:text-zinc-300">
                  <div className="py-1.5 border-r border-slate-700 dark:border-zinc-700 flex items-center justify-center gap-1">
                    <ArrowDownLeft className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                    <span>BORÇ (B)</span>
                  </div>
                  <div className="py-1.5 flex items-center justify-center gap-1">
                    <span>ALACAK (A)</span>
                    <ArrowUpRight className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                  </div>
                </div>

                {/* T-Gövdesi: Hareketler */}
                <div className="flex-1 grid grid-cols-2 text-xs font-mono min-h-[120px]">
                  {/* Sol Taraf: Borç Hareketleri */}
                  <div className="border-r border-slate-700 dark:border-zinc-700 p-2 divide-y divide-slate-100 dark:divide-zinc-800">
                    {hasDebit ? (
                      acc.debitMovements.map((mov, idx) => (
                        <div
                          key={idx}
                          onClick={() => handleMovementClick(mov.transactionId)}
                          className="py-1.5 px-1 hover:bg-blue-50/60 dark:hover:bg-zinc-900 rounded cursor-pointer transition-colors flex items-center justify-between text-slate-800 dark:text-zinc-200"
                          title={`İşlem #${mov.entryNo}: ${mov.explanation || ''} (Yevmiyeye gitmek için tıklayın)`}
                        >
                          <span className="text-[10px] text-slate-600 dark:text-zinc-400 font-sans">
                            #{mov.entryNo}
                          </span>
                          <span className="font-semibold text-blue-900 dark:text-blue-400">
                            {formatCurrency(mov.amount)}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="h-full flex items-center justify-center text-[11px] text-slate-500 dark:text-zinc-500 font-sans italic">
                        Hareket yok
                      </div>
                    )}
                  </div>

                  {/* Sağ Taraf: Alacak Hareketleri */}
                  <div className="p-2 divide-y divide-slate-100 dark:divide-zinc-800">
                    {hasCredit ? (
                      acc.creditMovements.map((mov, idx) => (
                        <div
                          key={idx}
                          onClick={() => handleMovementClick(mov.transactionId)}
                          className="py-1.5 px-1 hover:bg-amber-50/60 dark:hover:bg-zinc-900 rounded cursor-pointer transition-colors flex items-center justify-between text-slate-800 dark:text-zinc-200"
                          title={`İşlem #${mov.entryNo}: ${mov.explanation || ''} (Yevmiyeye gitmek için tıklayın)`}
                        >
                          <span className="text-[10px] text-slate-600 dark:text-zinc-400 font-sans">
                            #{mov.entryNo}
                          </span>
                          <span className="font-semibold text-amber-900 dark:text-amber-400">
                            {formatCurrency(mov.amount)}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="h-full flex items-center justify-center text-[11px] text-slate-500 dark:text-zinc-500 font-sans italic">
                        Hareket yok
                      </div>
                    )}
                  </div>
                </div>

                {/* T-Hesabı Alt Toplamları */}
                <div className="grid grid-cols-2 text-xs font-mono font-bold bg-slate-100 dark:bg-zinc-900/90 border-t-2 border-slate-400 dark:border-zinc-700">
                  <div className="py-2 px-3 border-r border-slate-700 dark:border-zinc-700 text-right text-slate-900 dark:text-white">
                    {formatCurrency(acc.totalDebit)}
                  </div>
                  <div className="py-2 px-3 text-right text-slate-900 dark:text-white">
                    {formatCurrency(acc.totalCredit)}
                  </div>
                </div>

                {/* Bakiye Bilgisi (Kalan) */}
                <div className="bg-slate-800 dark:bg-black text-white px-4 py-2 text-xs flex items-center justify-between border-t dark:border-zinc-800">
                  <span className="text-slate-300 dark:text-zinc-400 font-medium">Hesap Bakiyesi:</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-bold text-sm">
                      {formatCurrency(acc.balance)}
                    </span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      acc.balanceDirection === 'BORC'
                        ? 'bg-blue-900 dark:bg-blue-950/70 text-blue-200 dark:text-blue-300 border dark:border-blue-900/50'
                        : acc.balanceDirection === 'ALACAK'
                        ? 'bg-amber-900 dark:bg-amber-950/70 text-amber-200 dark:text-amber-300 border dark:border-amber-900/50'
                        : 'bg-slate-700 dark:bg-zinc-800 text-slate-300'
                    }`}>
                      {acc.balanceDirection === 'BORC' ? 'BORÇ BAKİYESİ' : acc.balanceDirection === 'ALACAK' ? 'ALACAK BAKİYESİ' : 'DENK (KAPALI)'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-12 text-center bg-white dark:bg-zinc-950 rounded-2xl border border-slate-200 dark:border-zinc-800">
          <Scale className="w-10 h-10 text-slate-300 dark:text-zinc-600 mx-auto mb-3" />
          <h4 className="text-sm font-semibold text-slate-700 dark:text-zinc-300">
            Henüz T-Hesabı Hareketi Yok
          </h4>
          <p className="text-xs text-slate-500 dark:text-zinc-500 mt-1 max-w-sm mx-auto">
            Yevmiye defterine kayıt girdikçe hesapların T-cetvelleri ve bakiyeleri otomatik olarak burada listelenecektir.
          </p>
        </div>
      )}
    </div>
  );
};
