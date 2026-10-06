import type { 
  JournalEntry, 
  LedgerAccount, 
  TrialBalance, 
  TrialBalanceRow, 
  BalanceSheet, 
  BalanceSheetItem,
  AccountClass
} from '../types/accounting';
import { getAccountByCode, ACCOUNTS_MAP } from './accounts';

/**
 * Türk Lirası para birimi formatlayıcı (örn: 100.000 TL)
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('tr-TR', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount) + ' TL';
}

/**
 * Yevmiye kayıtlarından Büyük Defter (T-Hesapları) türetir.
 * Tek Gerçeklik Kaynağı (Single Source of Truth): Yevmiye kayıtlarıdır.
 */
export function deriveLedger(entries: JournalEntry[]): LedgerAccount[] {
  const ledgerMap: Record<string, LedgerAccount> = {};

  // Tüm yevmiye kayıtlarını kronolojik olarak dolaş
  entries.forEach((entry) => {
    entry.lines.forEach((line) => {
      if (!line.accountCode) return;
      const accountDef = getAccountByCode(line.accountCode);
      if (!accountDef) return;

      if (!ledgerMap[line.accountCode]) {
        ledgerMap[line.accountCode] = {
          accountCode: accountDef.code,
          accountName: accountDef.name,
          accountClass: accountDef.accountClass,
          nature: accountDef.nature,
          debitMovements: [],
          creditMovements: [],
          totalDebit: 0,
          totalCredit: 0,
          balance: 0,
          balanceDirection: 'DENK',
        };
      }

      const acc = ledgerMap[line.accountCode];

      if (line.debit > 0) {
        acc.debitMovements.push({
          entryNo: entry.entryNo,
          date: entry.date,
          amount: line.debit,
          direction: 'BORC',
          transactionId: entry.transactionId,
          explanation: entry.description,
        });
        acc.totalDebit += line.debit;
      }

      if (line.credit > 0) {
        acc.creditMovements.push({
          entryNo: entry.entryNo,
          date: entry.date,
          amount: line.credit,
          direction: 'ALACAK',
          transactionId: entry.transactionId,
          explanation: entry.description,
        });
        acc.totalCredit += line.credit;
      }
    });
  });

  // Bakiyeleri hesapla
  const ledgerAccounts = Object.values(ledgerMap).map((acc) => {
    const diff = acc.totalDebit - acc.totalCredit;
    let balance = 0;
    let balanceDirection: 'BORC' | 'ALACAK' | 'DENK' = 'DENK';

    if (diff > 0) {
      balance = diff;
      balanceDirection = 'BORC';
    } else if (diff < 0) {
      balance = Math.abs(diff);
      balanceDirection = 'ALACAK';
    }

    return {
      ...acc,
      balance,
      balanceDirection,
    };
  });

  // Kod sırasına göre diz
  return ledgerAccounts.sort((a, b) => a.accountCode.localeCompare(b.accountCode));
}

/**
 * T-Hesaplarından (Büyük Defter) Mizan tablosu üretir.
 */
export function deriveTrialBalance(ledgerAccounts: LedgerAccount[]): TrialBalance {
  const rows: TrialBalanceRow[] = [];
  let totalDebit = 0;
  let totalCredit = 0;
  let totalDebitBalance = 0;
  let totalCreditBalance = 0;

  ledgerAccounts.forEach((acc) => {
    // Yalnızca hareket görmüş hesaplar mizana girer
    if (acc.totalDebit === 0 && acc.totalCredit === 0) return;

    const debitBalance = acc.balanceDirection === 'BORC' ? acc.balance : 0;
    const creditBalance = acc.balanceDirection === 'ALACAK' ? acc.balance : 0;

    rows.push({
      accountCode: acc.accountCode,
      accountName: acc.accountName,
      totalDebit: acc.totalDebit,
      totalCredit: acc.totalCredit,
      debitBalance,
      creditBalance,
    });

    totalDebit += acc.totalDebit;
    totalCredit += acc.totalCredit;
    totalDebitBalance += debitBalance;
    totalCreditBalance += creditBalance;
  });

  const isBalanced = 
    Math.abs(totalDebit - totalCredit) < 0.01 && 
    Math.abs(totalDebitBalance - totalCreditBalance) < 0.01;

  return {
    rows,
    totalDebit,
    totalCredit,
    totalDebitBalance,
    totalCreditBalance,
    isBalanced,
  };
}

/**
 * Büyük Defter bakiyelerinden ve Gelir/Gider net kârından Bilanço üretir.
 */
export function deriveBalanceSheet(ledgerAccounts: LedgerAccount[], date: string): BalanceSheet {
  const currentAssetsItems: BalanceSheetItem[] = [];
  const nonCurrentAssetsItems: BalanceSheetItem[] = [];
  const shortTermItems: BalanceSheetItem[] = [];
  const longTermItems: BalanceSheetItem[] = [];
  const equityItems: BalanceSheetItem[] = [];

  // Gelir ve Gider farkını (Faaliyet Kâr/Zararını) hesapla
  let totalRevenue = 0;
  let totalExpense = 0;

  ledgerAccounts.forEach((acc) => {
    const accDef = ACCOUNTS_MAP[acc.accountCode];
    const accClass = accDef ? accDef.accountClass : (parseInt(acc.accountCode[0]) as AccountClass);

    // Gelir hesapları (6 grubu gelir karakterli)
    if (accClass === 6) {
      if (accDef?.nature === 'GELIR') {
        totalRevenue += (acc.totalCredit - acc.totalDebit);
      } else {
        totalExpense += (acc.totalDebit - acc.totalCredit);
      }
    } else if (accClass === 7) {
      // 7 grubu gider hesapları (örn: 770)
      totalExpense += (acc.totalDebit - acc.totalCredit);
    }
  });

  const netIncome = totalRevenue - totalExpense;

  ledgerAccounts.forEach((acc) => {
    const accDef = ACCOUNTS_MAP[acc.accountCode];
    const accClass = accDef ? accDef.accountClass : (parseInt(acc.accountCode[0]) as AccountClass);

    // Sadece bilanço hesapları (1, 2, 3, 4, 5) bilançoda listelenir
    if (accClass >= 1 && accClass <= 5) {
      let netAmount = 0;

      // Aktif karakterli hesap veya düzenleyici pasif
      if (acc.balanceDirection === 'BORC') {
        netAmount = acc.balance;
      } else if (acc.balanceDirection === 'ALACAK') {
        netAmount = acc.balance;
      }

      // Aktifi düzenleyen pasif hesaplar eksi (-) olarak aktife girer (örn: 103, 257)
      if (accDef?.nature === 'DUZENLEYICI_AKTIF') {
        netAmount = -acc.balance;
      }
      // Pasifi düzenleyen aktif hesaplar eksi (-) olarak pasife girer (örn: 591)
      if (accDef?.nature === 'DUZENLEYICI_PASIF') {
        netAmount = -acc.balance;
      }

      if (netAmount !== 0) {
        const item: BalanceSheetItem = {
          code: acc.accountCode,
          name: acc.accountName,
          amount: netAmount,
        };

        if (accClass === 1) currentAssetsItems.push(item);
        else if (accClass === 2) nonCurrentAssetsItems.push(item);
        else if (accClass === 3) shortTermItems.push(item);
        else if (accClass === 4) longTermItems.push(item);
        else if (accClass === 5) equityItems.push(item);
      }
    }
  });

  // Henüz kapatılmamış gelir/giderden doğan kâr/zarar varsa özkaynaklara ekle
  if (netIncome > 0) {
    equityItems.push({
      code: '590',
      name: 'Dönem Net Kârı',
      amount: netIncome,
    });
  } else if (netIncome < 0) {
    equityItems.push({
      code: '591',
      name: 'Dönem Net Zararı (-)',
      amount: netIncome, // negatif
    });
  }

  const totalCurrent = currentAssetsItems.reduce((sum, item) => sum + item.amount, 0);
  const totalNonCurrent = nonCurrentAssetsItems.reduce((sum, item) => sum + item.amount, 0);
  const totalAssets = totalCurrent + totalNonCurrent;

  const totalShort = shortTermItems.reduce((sum, item) => sum + item.amount, 0);
  const totalLong = longTermItems.reduce((sum, item) => sum + item.amount, 0);
  const totalEquity = equityItems.reduce((sum, item) => sum + item.amount, 0);
  const totalLiabilitiesAndEquity = totalShort + totalLong + totalEquity;

  const diff = Math.round((totalAssets - totalLiabilitiesAndEquity) * 100) / 100;
  const isBalanced = Math.abs(diff) < 0.01;

  return {
    date,
    assets: {
      currentAssets: {
        title: 'I. DÖNEN VARLIKLAR',
        items: currentAssetsItems,
        total: totalCurrent,
      },
      nonCurrentAssets: {
        title: 'II. DURAN VARLIKLAR',
        items: nonCurrentAssetsItems,
        total: totalNonCurrent,
      },
      totalAssets,
    },
    liabilities: {
      shortTermLiabilities: {
        title: 'III. KISA VADELİ YABANCI KAYNAKLAR',
        items: shortTermItems,
        total: totalShort,
      },
      longTermLiabilities: {
        title: 'IV. UZUN VADELİ YABANCI KAYNAKLAR',
        items: longTermItems,
        total: totalLong,
      },
      equity: {
        title: 'V. ÖZ KAYNAKLAR',
        items: equityItems,
        total: totalEquity,
      },
      totalLiabilitiesAndEquity,
    },
    isBalanced,
    difference: diff,
  };
}
