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
 * muhasebe kurallarına göre detaylı olarak karşılaştırır ve öğrenci dostu pedagojik teşhis üretir.
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
        pedagogicalTip: 'İşlemin etkilediği hesapları belirleyerek başlayın. Takıldığınızda "İpucu" butonunu kullanabilirsiniz.'
      }]
    };
  }

  // 2. Matematiksel Denge Kontrolü (Borç == Alacak)
  const totalDebit = activeLines.reduce((sum, l) => sum + (Number(l.debit) || 0), 0);
  const totalCredit = activeLines.reduce((sum, l) => sum + (Number(l.credit) || 0), 0);
  const diff = Math.round(Math.abs(totalDebit - totalCredit) * 100) / 100;

  if (diff > 0.01) {
    generalMessages.push(
      `Yevmiye kaydı dengeli değil! Borç (Sol) toplamı (${formatCurrency(totalDebit)}) ile Alacak (Sağ) toplamı (${formatCurrency(totalCredit)}) arasında ${formatCurrency(diff)} fark var. Her yevmiye maddesinde Borç ve Alacak toplamı birbirine eşit olmalıdır.`
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
      // Öğrencilerin sınavda en sık karıştırdığı hesap çiftleri için özel uyarılar:
      let tip = `${accCode} ${accName} hesabı bu işlem için uygun değildir.`;
      if (accCode === '103' && expectedMap.has('101')) {
        tip = 'Sınav Tuzağı Uyarısı: Müşteriden çek alındığında veya daha önce müşteriden alınan bir çek satıcıya CİRO edildiğinde kendi çekimizi vermediğimiz için "103 Verilen Çekler (-)" değil, "101 Alınan Çekler" hesabı kullanılır!';
      } else if (accCode === '101' && expectedMap.has('103')) {
        tip = 'Sınav Tuzağı Uyarısı: İşletme kendi çek defterinden çek düzenleyip (keşide edip) verdiğinde müşteri çeki olmadığı için "101 Alınan Çekler" değil, "103 Verilen Çekler ve Ödeme Emirleri (-)" hesabı kullanılır!';
      } else if (accCode === '391' && expectedMap.has('191')) {
        tip = 'KDV Karışıklığı: Mal veya hizmet satın alırken ödediğimiz KDV için "391 Hesaplanan KDV" değil, "191 İndirilecek KDV" (Borç) kullanılır.';
      } else if (accCode === '191' && expectedMap.has('391')) {
        tip = 'KDV Karışıklığı: Mal veya hizmet satarken müşteriden tahsil ettiğimiz KDV için "191 İndirilecek KDV" değil, "391 Hesaplanan KDV" (Alacak) kullanılır.';
      } else if (accCode === '600' && expectedMap.has('610')) {
        tip = 'İade Kuralı: Müşteri sattığımız malı iade ettiğinde 600 Yurtiçi Satışlar hesabı doğrudan borçlandırılmaz; bunun yerine "610 Satıştan İadeler (-)" hesabı borçlandırılır.';
      } else if (accountDef) {
        tip += ` ${accountDef.description}`;
      }

      diagnostics.push({
        accountCode: accCode,
        accountName: accName,
        type: 'WRONG_ACCOUNT',
        message: `Yanlış Hesap Seçimi: "${accCode} ${accName}" bu işlemde yer almamalıdır.`,
        pedagogicalTip: tip,
        suggestedAction: 'İşlemin niteliğini (nakit, müşteri çeki 101, verilen çek 103, banka 102, veresiye 120/320) yeniden kontrol edin.'
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
            pedagogicalTip = `${accCode} ${accName} bir varlık (Aktif) hesabıdır. Bu işlemde varlığımız ARTTIĞI için hesabın BORÇ (Sol) tarafına yazılmalıdır. Siz Alacak tarafına yazdınız.`;
          } else {
            pedagogicalTip = `${accCode} ${accName} bir varlık (Aktif) hesabıdır. Bu işlemde varlığımız AZALDIĞI (çıktığı) için hesabın ALACAK (Sağ) tarafına yazılmalıdır. Siz Borç tarafına yazdınız.`;
          }
        } else if (accountDef.nature === 'DUZENLEYICI_AKTIF') {
          if (expectedSide === 'ALACAK') {
            pedagogicalTip = `Çok Önemli Kural: "${accCode} ${accName}" hesabı 1 veya 2 ile başlamasına rağmen sonunda (-) işareti bulunan AKTİFİ DÜZENLEYEN PASİF karakterli bir hesaptır! Bu yüzden ilk doğduğunda (örneğin çek keşide edildiğinde veya amortisman ayrıldığında) ALACAK (Sağ) tarafına yazılır.`;
          } else {
            pedagogicalTip = `"${accCode} ${accName}" aktifi düzenleyen pasif karakterli bir hesaptır. Daha önce verilen çek bankadan ödendiğinde (kapatıldığında) hesabın BORÇ (Sol) tarafına yazılır.`;
          }
        } else if (accountDef.nature === 'PASIF') {
          if (expectedSide === 'ALACAK') {
            pedagogicalTip = `${accCode} ${accName} bir borç/kaynak (Pasif) hesabıdır. Bu işlemde borcumuz veya kaynağımız ARTTIĞI için hesabın ALACAK (Sağ) tarafına yazılmalıdır.`;
          } else {
            pedagogicalTip = `${accCode} ${accName} bir borç/kaynak (Pasif) hesabıdır. Borç ödendiğinde veya kapatıldığında (azaldığında) hesabın BORÇ (Sol) tarafına yazılır.`;
          }
        } else if (accountDef.nature === 'DUZENLEYICI_PASIF') {
          pedagogicalTip = `${accCode} ${accName} sonunda (-) işareti bulunan pasifi düzenleyici bir hesaptır ve aktif hesaplar gibi BORÇ (Sol) tarafında çalışır.`;
        } else if (accountDef.nature === 'GELIR') {
          pedagogicalTip = `${accCode} ${accName} bir gelir hesabıdır. Satış ve faiz gibi gelirler doğduğunda kural gereği daima ALACAK (Sağ) tarafına yazılır.`;
        } else if (accountDef.nature === 'GIDER') {
          pedagogicalTip = `${accCode} ${accName} bir gider/maliyet hesabıdır. Giderler, maliyetler ve satış iadeleri doğduğunda kural gereği daima BORÇ (Sol) tarafına yazılır.`;
        }
      }

      diagnostics.push({
        accountCode: accCode,
        accountName: accName,
        type: 'WRONG_DIRECTION',
        message: `Ters Kayıt Hatası: "${accCode} ${accName}" hesabı ${expectedSide === 'BORC' ? 'BORÇ (Sol)' : 'ALACAK (Sağ)'} tarafına yazılmalıydı, ancak siz ${userSide === 'BORC' ? 'Borç' : 'Alacak'} tarafına yazdınız.`,
        pedagogicalTip: pedagogicalTip || `${accCode} hesabının borç/alacak çalışma kuralını kontrol ediniz.`,
        suggestedAction: `Tutarı ${expectedSide === 'BORC' ? 'Borç (Sol)' : 'Alacak (Sağ)'} sütununa taşıyın.`
      });
      return;
    }

    // Tutar hatası
    if (Math.abs(userAmount - expectedAmount) > 0.01) {
      diagnostics.push({
        accountCode: accCode,
        accountName: accName,
        type: 'WRONG_AMOUNT',
        message: `Tutar Hatası: "${accCode} ${accName}" için girilen ${formatCurrency(userAmount)} tutarı hatalı. Olması gereken tutar: ${formatCurrency(expectedAmount)}.`,
        pedagogicalTip: `Soruda verilen tutarı (ve varsa KDV ayrımını) tekrar kontrol ediniz.`,
        suggestedAction: `Tutarı ${formatCurrency(expectedAmount)} olarak güncelleyiniz.`
      });
      return;
    }

    // Doğru satır
    diagnostics.push({
      accountCode: accCode,
      accountName: accName,
      type: 'CORRECT',
      message: `Doğru: "${accCode} ${accName}" hesabı ${expectedSide === 'BORC' ? 'BORÇ' : 'ALACAK'} tarafında ${formatCurrency(expectedAmount)} olarak doğru kaydedildi.`,
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
        pedagogicalTip: accDef?.ruleExplanation || accDef?.description || 'Bu hesabı yevmiye maddesine ekleyiniz.',
        suggestedAction: `Yevmiye kaydına ${expLine.accountCode} hesabını ekleyin.`
      });
    }
  });

  // Genel geçerlilik kararı
  const hasErrors = diagnostics.some(d => d.type !== 'CORRECT') || diff > 0.01;
  const isValid = !hasErrors && diagnostics.length > 0;

  if (isValid) {
    generalMessages.push('Harika! Bu işlem için yevmiye kaydını eksiksiz ve Borç = Alacak kurallarına tam uygun olarak yaptınız.');
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
 * Tüm senaryoyu baştan sona denetleyip karne üretir ve girilen satırların anlık görüntüsünü saklar.
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

  const submittedEntries: Record<string, JournalLine[]> = {};

  const transactionResults = scenario.transactions.map((tx) => {
    const lines = userEntries[tx.id] || [];
    submittedEntries[tx.id] = lines.map((l) => ({ ...l }));
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
    submittedEntries,
    transactionResults,
  };
}
