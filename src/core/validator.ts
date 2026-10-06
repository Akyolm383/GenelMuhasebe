import type { JournalLine } from '../types/accounting';
import type { CommercialTransaction, CompanyScenario } from '../types/scenario';
import type { 
  EntryValidationResult, 
  LineDiagnostic, 
  ScenarioAuditResult 
} from '../types/validation';
import { getAccountByCode } from './accounts';
import { formatCurrency } from './accountingEngine';

/**
 * Kullanıcının girdiği yevmiye satırlarını ticari işlem için beklenen kayıtla
 * muhasebe kurallarına göre detaylı olarak karşılaştırır ve pedagojik teşhis üretir.
 */
export function validateJournalEntry(
  userLines: JournalLine[], 
  transaction: CommercialTransaction
): EntryValidationResult {
  const generalMessages: string[] = [];
  const diagnostics: LineDiagnostic[] = [];

  // 1. Boş kayıt kontrolü
  const activeLines = userLines.filter(l => l.accountCode && (l.debit > 0 || l.credit > 0));
  if (activeLines.length === 0) {
    return {
      transactionId: transaction.id,
      isValid: false,
      totalDebit: 0,
      totalCredit: 0,
      difference: 0,
      generalMessages: ['Bu işlem için henüz bir yevmiye kaydı girilmedi.'],
      diagnostics: [{
        accountCode: '',
        type: 'EMPTY_ENTRY',
        message: 'Lütfen işleme ilişkin hesapları ve tutarları giriniz.',
        pedagogicalTip: 'İşlemin etkilediği hesapları belirleyerek başlayın. Gerektiğinde "İpucu" butonunu kullanabilirsiniz.'
      }]
    };
  }

  // 2. Matematiksel Denge Kontrolü (Borç == Alacak)
  const totalDebit = activeLines.reduce((sum, l) => sum + (Number(l.debit) || 0), 0);
  const totalCredit = activeLines.reduce((sum, l) => sum + (Number(l.credit) || 0), 0);
  const diff = Math.round(Math.abs(totalDebit - totalCredit) * 100) / 100;

  if (diff > 0.01) {
    generalMessages.push(
      `Yevmiye kaydı dengeli değil! Borç toplamı (${formatCurrency(totalDebit)}) ile Alacak toplamı (${formatCurrency(totalCredit)}) arasında ${formatCurrency(diff)} fark var. Muhasebede çift taraflı kayıt esastır; her maddede Borç ve Alacak eşit olmalıdır.`
    );
  }

  // 3. Beklenen satırlarla detaylı karşılaştırma
  const expectedLines = transaction.expectedEntry.lines;

  // Haritalama: accountCode -> { debit, credit }
  const expectedMap = new Map<string, { debit: number; credit: number }>();
  expectedLines.forEach(l => {
    expectedMap.set(l.accountCode, { debit: l.debit, credit: l.credit });
  });

  const userAccountCodes = new Set(activeLines.map(l => l.accountCode));

  // Kullanıcının girdiği satırları incele
  activeLines.forEach((userLine) => {
    const accCode = userLine.accountCode;
    const accountDef = getAccountByCode(accCode);
    const accName = accountDef?.name || 'Bilinmeyen Hesap';
    const expected = expectedMap.get(accCode);

    if (!expected) {
      // Bu hesap bu işlemde hiç kullanılmamalıydı
      let tip = `${accCode} ${accName} hesabı bu işlem için uygun değildir.`;
      if (accountDef) {
        tip += ` ${accountDef.description}`;
      }

      diagnostics.push({
        accountCode: accCode,
        accountName: accName,
        type: 'WRONG_ACCOUNT',
        message: `Yanlış Hesap Seçimi: "${accCode} ${accName}" bu ticari işlemde yer almamalıdır.`,
        pedagogicalTip: tip,
        suggestedAction: 'İşlemin niteliğini (nakit mi, banka mı, veresiye mi, sermaye mi) yeniden gözden geçirin.'
      });
      return;
    }

    // Hesap doğru. Şimdi taraf ve tutar kontrolü:
    const expectedSide = expected.debit > 0 ? 'BORC' : 'ALACAK';
    const expectedAmount = expected.debit > 0 ? expected.debit : expected.credit;

    const userSide = userLine.debit > 0 ? 'BORC' : (userLine.credit > 0 ? 'ALACAK' : 'YOK');
    const userAmount = userLine.debit > 0 ? userLine.debit : userLine.credit;

    // Yön hatası (Ters kayıt)
    if (userSide !== expectedSide) {
      let pedagogicalTip = '';
      if (accountDef) {
        if (accountDef.nature === 'AKTIF') {
          if (expectedSide === 'BORC') {
            pedagogicalTip = `${accCode} ${accName} aktif karakterli bir varlık hesabıdır. Bu işlemde varlık ARTTIĞI için hesabın BORÇ tarafına yazılmalıdır. Siz Alacak tarafına yazdınız.`;
          } else {
            pedagogicalTip = `${accCode} ${accName} aktif karakterli bir varlık hesabıdır. Bu işlemde varlık AZALDIĞI için hesabın ALACAK tarafına yazılmalıdır. Siz Borç tarafına yazdınız.`;
          }
        } else if (accountDef.nature === 'PASIF') {
          if (expectedSide === 'ALACAK') {
            pedagogicalTip = `${accCode} ${accName} pasif karakterli bir kaynak/borç hesabıdır. Bu işlemde kaynak/borç ARTTIĞI için hesabın ALACAK tarafına yazılmalıdır.`;
          } else {
            pedagogicalTip = `${accCode} ${accName} pasif karakterli bir hesaptır. Borç ödendiğinde (azaldığında) hesabın BORÇ tarafına kaydedilir.`;
          }
        } else if (accountDef.nature === 'GELIR') {
          pedagogicalTip = `${accCode} ${accName} gelir tablosu gelir hesabıdır. Hasılat ve gelirler daima ALACAK kaydedilir.`;
        } else if (accountDef.nature === 'GIDER') {
          pedagogicalTip = `${accCode} ${accName} gider/maliyet hesabıdır. Dönem giderleri kural gereği daima BORÇ kaydedilir.`;
        }
      }

      diagnostics.push({
        accountCode: accCode,
        accountName: accName,
        type: 'WRONG_DIRECTION',
        message: `Ters Kayıt Hatası: "${accCode} ${accName}" hesabı ${expectedSide} tarafına yazılmalıydı, ancak siz ${userSide} tarafına kaydettiniz.`,
        pedagogicalTip: pedagogicalTip || `${accCode} hesabının borç/alacak çalışma kuralını kontrol ediniz.`,
        suggestedAction: `Tutarı ${expectedSide === 'BORC' ? 'Borç' : 'Alacak'} sütununa taşıyın.`
      });
      return;
    }

    // Tutar hatası
    if (Math.abs(userAmount - expectedAmount) > 0.01) {
      diagnostics.push({
        accountCode: accCode,
        accountName: accName,
        type: 'WRONG_AMOUNT',
        message: `Tutar Hatası: "${accCode} ${accName}" için girilen ${formatCurrency(userAmount)} tutarı hatalı. Beklenen tutar: ${formatCurrency(expectedAmount)}.`,
        pedagogicalTip: `İşlem metninde belirtilen tutarı ve şartları dikkatle okuyunuz.`,
        suggestedAction: `Tutarı ${formatCurrency(expectedAmount)} olarak güncelleyiniz.`
      });
      return;
    }

    // Doğru satır
    diagnostics.push({
      accountCode: accCode,
      accountName: accName,
      type: 'CORRECT',
      message: `Doğru: "${accCode} ${accName}" hesabı ${expectedSide} tarafında ${formatCurrency(expectedAmount)} olarak doğru kaydedildi.`,
      pedagogicalTip: accountDef?.ruleExplanation || 'Kayıt muhasebe ilkelerine uygundur.'
    });
  });

  // Eksik hesap kontrolü
  expectedLines.forEach((expLine) => {
    if (!userAccountCodes.has(expLine.accountCode)) {
      const accDef = getAccountByCode(expLine.accountCode);
      const accName = accDef?.name || 'Hesap';
      const side = expLine.debit > 0 ? 'BORÇ' : 'ALACAK';

      diagnostics.push({
        accountCode: expLine.accountCode,
        accountName: accName,
        type: 'MISSING_ACCOUNT',
        message: `Eksik Hesap: Bu işlemde "${expLine.accountCode} ${accName}" hesabı (${side}: ${formatCurrency(expLine.debit || expLine.credit)}) kullanılmalıdır.`,
        pedagogicalTip: accDef?.description || 'Bu hesabı yevmiye maddesine ekleyiniz.',
        suggestedAction: `Yevmiye kaydına ${expLine.accountCode} hesabını ekleyin.`
      });
    }
  });

  // Genel geçerlilik kararı
  const hasErrors = diagnostics.some(d => d.type !== 'CORRECT') || diff > 0.01;
  const isValid = !hasErrors && diagnostics.length > 0;

  if (isValid) {
    generalMessages.push('Tebrikler! Bu işlem için yevmiye maddesi eksiksiz ve muhasebe ilkelerine tam olarak uygun kaydedildi.');
  }

  return {
    transactionId: transaction.id,
    isValid,
    totalDebit,
    totalCredit,
    difference: diff,
    generalMessages,
    diagnostics,
  };
}

/**
 * Çalışma Modu için tüm senaryoyu baştan sona denetleyip karne üretir.
 */
export function auditScenario(
  userEntries: Record<string, JournalLine[]>, 
  scenario: CompanyScenario
): ScenarioAuditResult {
  let correctCount = 0;
  let incorrectCount = 0;
  let balanceErrorsCount = 0;
  let accountSelectionErrorsCount = 0;
  let directionErrorsCount = 0;

  const transactionResults = scenario.transactions.map((tx) => {
    const lines = userEntries[tx.id] || [];
    const validation = validateJournalEntry(lines, tx);

    if (validation.isValid) {
      correctCount++;
    } else {
      incorrectCount++;
    }

    if (validation.difference > 0.01) balanceErrorsCount++;
    validation.diagnostics.forEach((d) => {
      if (d.type === 'WRONG_ACCOUNT') accountSelectionErrorsCount++;
      if (d.type === 'WRONG_DIRECTION') directionErrorsCount++;
    });

    const errors = validation.diagnostics
      .filter(d => d.type !== 'CORRECT')
      .map(d => d.message);

    const userSummary = lines
      .filter(l => l.accountCode)
      .map(l => `${l.accountCode} (B:${l.debit || 0} / A:${l.credit || 0})`)
      .join(', ') || 'Boş';

    const expectedSummary = tx.expectedEntry.lines
      .map(l => `${l.accountCode} (B:${l.debit || 0} / A:${l.credit || 0})`)
      .join(', ');

    return {
      transactionId: tx.id,
      order: tx.order,
      title: tx.title,
      isValid: validation.isValid,
      errors: validation.difference > 0.01 ? [...validation.generalMessages, ...errors] : errors,
      userSummary,
      expectedSummary,
    };
  });

  const total = scenario.transactions.length;
  const scorePercentage = Math.round((correctCount / (total || 1)) * 100);

  return {
    scenarioId: scenario.id,
    totalTransactions: total,
    correctCount,
    incorrectCount,
    scorePercentage,
    balanceErrorsCount,
    accountSelectionErrorsCount,
    directionErrorsCount,
    transactionResults,
  };
}
