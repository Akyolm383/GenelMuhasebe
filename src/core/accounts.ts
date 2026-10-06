import type { Account } from '../types/accounting';

export const ACCOUNTS_MAP: Record<string, Account> = {
  '100': {
    code: '100',
    name: 'Kasa',
    accountClass: 1,
    nature: 'AKTIF',
    normalBalance: 'BORC',
    description: 'İşletmenin elinde bulunan nakit Türk Lirası ve yabancı para mevcudunu izler.',
    ruleExplanation: 'Aktif hesap: Kasaya para girişi olduğunda BORÇ, kasadan para çıkışı olduğunda ALACAK kaydedilir. Asla alacak bakiyesi vermez.'
  },
  '101': {
    code: '101',
    name: 'Alınan Çekler',
    accountClass: 1,
    nature: 'AKTIF',
    normalBalance: 'BORC',
    description: 'İşletmenin mal/hizmet satışı karşılığında veya alacak tahsilatında aldığı müşteri çeklerini izler.',
    ruleExplanation: 'Aktif hesap: Müşteriden çek alındığında BORÇ, çek tahsil edildiğinde veya ciro edildiğinde ALACAK kaydedilir.'
  },
  '102': {
    code: '102',
    name: 'Bankalar',
    accountClass: 1,
    nature: 'AKTIF',
    normalBalance: 'BORC',
    description: 'İşletmenin bankalardaki vadesiz ve vadeli mevduat hesaplarını izler.',
    ruleExplanation: 'Aktif hesap: Bankadaki mevduat arttığında (para yatırıldığında/havale geldiğinde) BORÇ, hesaptan para çekildiğinde veya transfer yapıldığında ALACAK kaydedilir.'
  },
  '103': {
    code: '103',
    name: 'Verilen Çekler ve Ödeme Emirleri (-)',
    accountClass: 1,
    nature: 'DUZENLEYICI_AKTIF',
    normalBalance: 'ALACAK',
    description: 'İşletmenin üçüncü kişilere verdiği çekleri izler. Aktifi düzenleyen pasif karakterli hesaptır.',
    ruleExplanation: 'Aktif düzenleyici (Pasif karakterli): Çek keşide edildiğinde (verildiğinde) ALACAK, bankadan ödendiğinde BORÇ kaydedilir.'
  },
  '120': {
    code: '120',
    name: 'Alıcılar',
    accountClass: 1,
    nature: 'AKTIF',
    normalBalance: 'BORC',
    description: 'Müşterilere senetsiz (veresiye) mal veya hizmet satışından doğan ticari alacakları izler.',
    ruleExplanation: 'Aktif hesap: Müşteriye veresiye mal satıldığında (alacağımız arttığında) BORÇ, müşteri borcunu ödediğinde ALACAK kaydedilir.'
  },
  '121': {
    code: '121',
    name: 'Alacak Senetleri',
    accountClass: 1,
    nature: 'AKTIF',
    normalBalance: 'BORC',
    description: 'Ticari faaliyet sonucu müşterilerden alınan senetli (bono/poliçe) alacakları izler.',
    ruleExplanation: 'Aktif hesap: Senet alındığında BORÇ, senet vadesinde tahsil edildiğinde ALACAK kaydedilir.'
  },
  '153': {
    code: '153',
    name: 'Ticari Mallar',
    accountClass: 1,
    nature: 'AKTIF',
    normalBalance: 'BORC',
    description: 'Üzerinde herhangi bir değişiklik yapılmadan satılmak amacıyla alınan malları izler.',
    ruleExplanation: 'Aktif hesap: Ticari mal satın alındığında (stok arttığında) BORÇ, mal satıldığında veya iade edildiğinde ALACAK kaydedilir.'
  },
  '254': {
    code: '254',
    name: 'Taşıtlar',
    accountClass: 2,
    nature: 'AKTIF',
    normalBalance: 'BORC',
    description: 'İşletme faaliyetlerinde kullanılan otomobil, kamyonet vb. tüm motorlu taşıtları izler.',
    ruleExplanation: 'Duran varlık (Aktif): Taşıt satın alındığında BORÇ, taşıt satıldığında veya hurdaya ayrıldığında ALACAK kaydedilir.'
  },
  '255': {
    code: '255',
    name: 'Demirbaşlar',
    accountClass: 2,
    nature: 'AKTIF',
    normalBalance: 'BORC',
    description: 'İşletme faaliyetlerinin yürütülmesinde kullanılan masa, bilgisayar, raf vb. büro malzemelerini izler.',
    ruleExplanation: 'Duran varlık (Aktif): Demirbaş satın alındığında BORÇ, elden çıkarıldığında ALACAK kaydedilir.'
  },
  '257': {
    code: '257',
    name: 'Birikmiş Amortismanlar (-)',
    accountClass: 2,
    nature: 'DUZENLEYICI_AKTIF',
    normalBalance: 'ALACAK',
    description: 'Maddi duran varlıkların kullanım süresi boyunca ayrılan yıpranma paylarını izler.',
    ruleExplanation: 'Aktif düzenleyici: Dönem sonunda amortisman ayrıldığında ALACAK kaydedilir.'
  },
  '300': {
    code: '300',
    name: 'Banka Kredileri',
    accountClass: 3,
    nature: 'PASIF',
    normalBalance: 'ALACAK',
    description: 'Bankalardan çekilen 1 yıldan kısa vadeli nakit kredileri izler.',
    ruleExplanation: 'Pasif hesap (Borç): Bankadan kredi çekildiğinde ALACAK, kredi anapara taksitleri ödendiğinde BORÇ kaydedilir.'
  },
  '320': {
    code: '320',
    name: 'Satıcılar',
    accountClass: 3,
    nature: 'PASIF',
    normalBalance: 'ALACAK',
    description: 'Mal ve hizmet alımlarından doğan senetsiz (veresiye) ticari borçları izler.',
    ruleExplanation: 'Pasif hesap (Kaynak/Borç): Satıcıdan veresiye mal alındığında (borcumuz arttığında) ALACAK, satıcıya borç ödendiğinde BORÇ kaydedilir.'
  },
  '321': {
    code: '321',
    name: 'Borç Senetleri',
    accountClass: 3,
    nature: 'PASIF',
    normalBalance: 'ALACAK',
    description: 'Ticari işlemler sonucu işletmenin imzalayıp verdiği senetli borçları izler.',
    ruleExplanation: 'Pasif hesap: Satıcıya senet imzalanıp verildiğinde ALACAK, senet bankadan veya kasadan ödendiğinde BORÇ kaydedilir.'
  },
  '360': {
    code: '360',
    name: 'Ödenecek Vergi ve Fonlar',
    accountClass: 3,
    nature: 'PASIF',
    normalBalance: 'ALACAK',
    description: 'İşletmenin sorumlu veya mükellef sıfatıyla devlete ödeyeceği vergi borçlarını izler.',
    ruleExplanation: 'Pasif hesap: Vergi borcu tahakkuk ettiğinde ALACAK, vergi dairesine ödendiğinde BORÇ kaydedilir.'
  },
  '400': {
    code: '400',
    name: 'Banka Kredileri (Uzun Vadeli)',
    accountClass: 4,
    nature: 'PASIF',
    normalBalance: 'ALACAK',
    description: 'Bankalardan temin edilen 1 yıldan uzun vadeli kredileri izler.',
    ruleExplanation: 'Uzun vadeli pasif: Kredi alındığında ALACAK, vadesi bir yılın altına düştüğünde 303 hesaba aktarılır veya ödendiğinde BORÇ kaydedilir.'
  },
  '500': {
    code: '500',
    name: 'Sermaye',
    accountClass: 5,
    nature: 'PASIF',
    normalBalance: 'ALACAK',
    description: 'İşletme sahipleri veya ortakları tarafından tahsis edilen tescil edilmiş sermaye tutarını izler.',
    ruleExplanation: 'Öz kaynak hesabı (Pasif): İşletme kurulurken veya sermaye artırıldığında ALACAK kaydedilir. Sermaye azaltılmadıkça borçlandırılmaz.'
  },
  '590': {
    code: '590',
    name: 'Dönem Net Kârı',
    accountClass: 5,
    nature: 'PASIF',
    normalBalance: 'ALACAK',
    description: 'İşletmenin faaliyet dönemi sonucunda elde ettiği net kâr tutarını izler.',
    ruleExplanation: 'Öz kaynak hesabı: Gelir tablosu hesapları kapatılıp dönem kârı çıktığında ALACAK kaydedilir.'
  },
  '591': {
    code: '591',
    name: 'Dönem Net Zararı (-)',
    accountClass: 5,
    nature: 'DUZENLEYICI_PASIF',
    normalBalance: 'BORC',
    description: 'İşletmenin faaliyet dönemi sonucunda ortaya çıkan net zarar tutarını izler.',
    ruleExplanation: 'Pasif düzenleyici (Aktif karakterli): Dönem zararla kapandığında BORÇ kaydedilir, bilançonun özkaynaklarında eksi olarak yer alır.'
  },
  '600': {
    code: '600',
    name: 'Yurtiçi Satışlar',
    accountClass: 6,
    nature: 'GELIR',
    normalBalance: 'ALACAK',
    description: 'Yurt içindeki kişi ve kuruluşlara satılan mal ve hizmet tutarlarını izler.',
    ruleExplanation: 'Gelir hesabı: Mal veya hizmet satışı gerçekleştiğinde hasılat tutarı kadar daima ALACAK kaydedilir. Dönem sonunda kapatılmadıkça borçlandırılmaz.'
  },
  '621': {
    code: '621',
    name: 'Satılan Ticari Mallar Maliyeti (-)',
    accountClass: 6,
    nature: 'GIDER',
    normalBalance: 'BORC',
    description: 'Satılan ticari malların işletmeye olan alış maliyetini izler.',
    ruleExplanation: 'Gider/Maliyet hesabı: Mal satışı yapıldığında satılan malın maliyeti kadar BORÇ kaydedilir (karşılığında 153 alacaklandırılır).'
  },
  '642': {
    code: '642',
    name: 'Faiz Gelirleri',
    accountClass: 6,
    nature: 'GELIR',
    normalBalance: 'ALACAK',
    description: 'Mevduat faizleri ve diğer faiz getirilerini izler.',
    ruleExplanation: 'Gelir hesabı: Faiz tahakkuk ettiğinde veya tahsil edildiğinde ALACAK kaydedilir.'
  },
  '770': {
    code: '770',
    name: 'Genel Yönetim Giderleri',
    accountClass: 7,
    nature: 'GIDER',
    normalBalance: 'BORC',
    description: 'İşletmenin yönetim, kira, elektrik, muhasebe, kırtasiye vb. genel idare giderlerini izler.',
    ruleExplanation: 'Gider hesabı: Gider gerçekleştiğinde daima BORÇ kaydedilir. Dönem sonunda 771 yansıtma hesabı ile 632 Genel Yönetim Giderlerine aktarılarak kapatılır.'
  }
};

export const ACCOUNTS_LIST: Account[] = Object.values(ACCOUNTS_MAP).sort((a, b) => 
  a.code.localeCompare(b.code)
);

export function getAccountByCode(code: string): Account | undefined {
  return ACCOUNTS_MAP[code];
}

export function searchAccounts(query: string): Account[] {
  const clean = query.trim().toLowerCase();
  if (!clean) return ACCOUNTS_LIST;
  return ACCOUNTS_LIST.filter(acc => 
    acc.code.includes(clean) || acc.name.toLowerCase().includes(clean)
  );
}
