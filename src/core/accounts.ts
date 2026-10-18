import type { Account } from '../types/accounting';

export const ACCOUNTS_MAP: Record<string, Account> = {
  '100': {
    code: '100',
    name: 'Kasa',
    accountClass: 1,
    nature: 'AKTIF',
    normalBalance: 'BORC',
    description: 'İşletmenin kasasında bulunan nakit parayı (kağıt ve madeni para) izler.',
    ruleExplanation: 'Varlık (Aktif) hesabıdır: Kasaya nakit para girdiğinde BORÇ (sol), kasadan para çıktığında ALACAK (sağ) yazılır. Kasada olmayan para harcanamayacağı için asla alacak bakiyesi vermez.'
  },
  '101': {
    code: '101',
    name: 'Alınan Çekler',
    accountClass: 1,
    nature: 'AKTIF',
    normalBalance: 'BORC',
    description: 'Müşterilerden mal satışı veya alacak tahsilatı karşılığında teslim alınan çekleri izler.',
    ruleExplanation: 'Varlık (Aktif) hesabıdır: Müşteriden çek alındığında BORÇ yazılır; çek bankadan tahsil edildiğinde veya bir satıcıya ciro edildiğinde ALACAK yazılır.'
  },
  '102': {
    code: '102',
    name: 'Bankalar',
    accountClass: 1,
    nature: 'AKTIF',
    normalBalance: 'BORC',
    description: 'İşletmenin bankalardaki vadesiz ve vadeli mevduat hesaplarında bulunan parasını izler.',
    ruleExplanation: 'Varlık (Aktif) hesabıdır: Banka hesabına para yatırıldığında veya havale geldiğinde BORÇ, hesaptan para çekildiğinde veya ödeme yapıldığında ALACAK yazılır.'
  },
  '103': {
    code: '103',
    name: 'Verilen Çekler ve Ödeme Emirleri (-)',
    accountClass: 1,
    nature: 'DUZENLEYICI_AKTIF',
    normalBalance: 'ALACAK',
    description: 'İşletmenin kendi banka çek defterinden satıcılara düzenleyip (keşide edip) verdiği çekleri izler. Sonunda (-) işareti bulunan Aktifi Düzenleyen Pasif karakterli hesaptır.',
    ruleExplanation: 'Sınav Kuralı (Aktifi Düzenleyen Pasif Hesap): Kodu 1 ile başlamasına rağmen sonunda (-) işareti olduğu için pasif gibi çalışır! Kendi çekimizi imzalayıp verdiğimizde (keşide ettiğimizde) ALACAK, çek bankamızdan ödendiğinde BORÇ yazılır.'
  },
  '108': {
    code: '108',
    name: 'Diğer Hazır Değerler',
    accountClass: 1,
    nature: 'AKTIF',
    normalBalance: 'BORC',
    description: 'Kredi kartı slipleri (POS cihazı ile yapılan satış alacakları), vadesi gelmiş kuponlar ve pulları izler.',
    ruleExplanation: 'Varlık (Aktif) hesabıdır: Müşteriye kredi kartı (POS) ile satış yapıldığında BORÇ, banka POS tutarını hesabımıza geçirdiğinde ALACAK yazılır.'
  },
  '120': {
    code: '120',
    name: 'Alıcılar',
    accountClass: 1,
    nature: 'AKTIF',
    normalBalance: 'BORC',
    description: 'Müşterilere veresiye (açık hesap / senetsiz) mal veya hizmet satışından doğan alacakları izler.',
    ruleExplanation: 'Varlık (Aktif) hesabıdır: Müşteriye veresiye mal satıldığında (alacağımız arttığında) BORÇ, müşteri borcunu ödediğinde ALACAK yazılır.'
  },
  '121': {
    code: '121',
    name: 'Alacak Senetleri',
    accountClass: 1,
    nature: 'AKTIF',
    normalBalance: 'BORC',
    description: 'Müşterilerden mal satışı veya alacak karşılığında alınan senetleri (bono/poliçe) izler.',
    ruleExplanation: 'Varlık (Aktif) hesabıdır: Müşteriden senet alındığında BORÇ, senet tahsil edildiğinde veya başkasına ciro edildiğinde ALACAK yazılır.'
  },
  '153': {
    code: '153',
    name: 'Ticari Mallar',
    accountClass: 1,
    nature: 'AKTIF',
    normalBalance: 'BORC',
    description: 'Üzerinde değişiklik yapılmadan satılmak amacıyla satın alınan malları (stokları) izler.',
    ruleExplanation: 'Varlık (Aktif) hesabıdır: Mal satın alındığında (veya alış için nakliye ödenmesinde) BORÇ, mal iade edildiğinde veya satılan malın maliyeti düşüldüğünde ALACAK yazılır.'
  },
  '190': {
    code: '190',
    name: 'Devreden KDV',
    accountClass: 1,
    nature: 'AKTIF',
    normalBalance: 'BORC',
    description: 'Ay sonunda İndirilecek KDV (191) toplamı, Hesaplanan KDV (391) toplamından büyük olduğunda sonraki aya devreden KDV alacağını izler.',
    ruleExplanation: 'Varlık (Aktif) hesabıdır: Ay sonu KDV mahsubunda 191 > 391 ise aradaki fark sonraki ayda indirilmek üzere 190 Devreden KDV hesabına BORÇ yazılır.'
  },
  '191': {
    code: '191',
    name: 'İndirilecek KDV',
    accountClass: 1,
    nature: 'AKTIF',
    normalBalance: 'BORC',
    description: 'İşletmenin mal veya hizmet satın alırken ya da gider yaparken satıcıya ödediği Katma Değer Vergisini izler.',
    ruleExplanation: 'Varlık (Aktif) hesabıdır: Mal/hizmet alışında veya gider faturasında KDV ödendiğinde BORÇ yazılır; ay sonunda KDV mahsubu yapılırken ALACAK yazılarak kapatılır.'
  },
  '254': {
    code: '254',
    name: 'Taşıtlar',
    accountClass: 2,
    nature: 'AKTIF',
    normalBalance: 'BORC',
    description: 'İşletme faaliyetlerinde kullanılan otomobil, kamyonet, servis aracı gibi tüm taşıtları izler.',
    ruleExplanation: 'Duran Varlık (Aktif) hesabıdır: Taşıt satın alındığında BORÇ, taşıt satıldığında ALACAK yazılır.'
  },
  '255': {
    code: '255',
    name: 'Demirbaşlar',
    accountClass: 2,
    nature: 'AKTIF',
    normalBalance: 'BORC',
    description: 'Ofiste ve mağazada kullanılan masa, koltuk, bilgisayar, yazıcı, klima gibi uzun ömürlü eşyaları izler.',
    ruleExplanation: 'Duran Varlık (Aktif) hesabıdır: Demirbaş satın alındığında BORÇ, satıldığında veya hurdaya ayrıldığında ALACAK yazılır.'
  },
  '257': {
    code: '257',
    name: 'Birikmiş Amortismanlar (-)',
    accountClass: 2,
    nature: 'DUZENLEYICI_AKTIF',
    normalBalance: 'ALACAK',
    description: 'Taşıt ve demirbaş gibi duran varlıkların yıllar içindeki eskime/yıpranma paylarını izler.',
    ruleExplanation: 'Aktifi Düzenleyen Pasif Hesap (-): Dönem sonunda amortisman (yıpranma payı) ayrıldığında ALACAK yazılır ve bilançoda Duran Varlıklardan eksi (-) olarak düşülür.'
  },
  '300': {
    code: '300',
    name: 'Banka Kredileri',
    accountClass: 3,
    nature: 'PASIF',
    normalBalance: 'ALACAK',
    description: 'Bankalardan çekilen 1 yıldan kısa vadeli ticari kredileri izler.',
    ruleExplanation: 'Borç/Kaynak (Pasif) hesabıdır: Bankadan kredi çekildiğinde borcumuz arttığı için ALACAK, kredi anaparası ödendiğinde BORÇ yazılır.'
  },
  '320': {
    code: '320',
    name: 'Satıcılar',
    accountClass: 3,
    nature: 'PASIF',
    normalBalance: 'ALACAK',
    description: 'Toptancı veya tedarikçilerden veresiye (senetsiz / açık hesap) mal ve hizmet alımından doğan borçları izler.',
    ruleExplanation: 'Borç/Kaynak (Pasif) hesabıdır: Veresiye mal alındığında (borcumuz arttığında) ALACAK, satıcıya ödeme yapıldığında (borcumuz azaldığında) BORÇ yazılır.'
  },
  '321': {
    code: '321',
    name: 'Borç Senetleri',
    accountClass: 3,
    nature: 'PASIF',
    normalBalance: 'ALACAK',
    description: 'İşletmenin mal alımı veya borç ödemesi karşılığında kendi imzalayıp verdiği senetli (bono) borçları izler.',
    ruleExplanation: 'Borç/Kaynak (Pasif) hesabıdır: Kendi borç senedimizi imzalayıp verdiğimizde ALACAK, senet vadesinde ödendiğinde BORÇ yazılır.'
  },
  '360': {
    code: '360',
    name: 'Ödenecek Vergi ve Fonlar',
    accountClass: 3,
    nature: 'PASIF',
    normalBalance: 'ALACAK',
    description: 'Ay sonunda çıkacak KDV borcu, gelir/kurumlar vergisi ve stopaj gibi devlete ödenecek vergileri izler.',
    ruleExplanation: 'Borç/Kaynak (Pasif) hesabıdır: Ödenecek vergi doğduğunda (tahakkuk ettiğinde) ALACAK, vergi dairesine ödendiğinde BORÇ yazılır.'
  },
  '391': {
    code: '391',
    name: 'Hesaplanan KDV',
    accountClass: 3,
    nature: 'PASIF',
    normalBalance: 'ALACAK',
    description: 'Mal veya hizmet satışı yapıldığında fatura üzerinden müşteriden tahsil edilen Katma Değer Vergisini izler.',
    ruleExplanation: 'Borç/Kaynak (Pasif) hesabıdır: Satış yapıldığında müşteriden alınan KDV devlete olan emanet borç olduğu için ALACAK yazılır; ay sonunda KDV mahsubunda BORÇ yazılarak kapatılır.'
  },
  '400': {
    code: '400',
    name: 'Banka Kredileri (Uzun Vadeli)',
    accountClass: 4,
    nature: 'PASIF',
    normalBalance: 'ALACAK',
    description: 'Bankalardan temin edilen 1 yıldan uzun vadeli yatırım ve işletme kredilerini izler.',
    ruleExplanation: 'Uzun Vadeli Kaynak (Pasif): Kredi çekildiğinde ALACAK, ödendiğinde BORÇ yazılır.'
  },
  '500': {
    code: '500',
    name: 'Sermaye',
    accountClass: 5,
    nature: 'PASIF',
    normalBalance: 'ALACAK',
    description: 'İşletme sahiplerinin veya ortaklarının şirketi kurarken koydukları ana sermayeyi izler.',
    ruleExplanation: 'Öz Kaynak (Pasif) hesabıdır: Şirket kurulurken veya sermaye artırıldığında ALACAK yazılır.'
  },
  '590': {
    code: '590',
    name: 'Dönem Net Kârı',
    accountClass: 5,
    nature: 'PASIF',
    normalBalance: 'ALACAK',
    description: 'İşletmenin dönem sonunda gelirlerinin giderlerinden fazla olmasıyla elde ettiği net kârı izler.',
    ruleExplanation: 'Öz Kaynak (Pasif) hesabıdır: Gelirler > Giderler olduğunda kâr özkaynağı artırdığı için bilançoda Pasif (Öz Kaynaklar) tarafında yer alır.'
  },
  '591': {
    code: '591',
    name: 'Dönem Net Zararı (-)',
    accountClass: 5,
    nature: 'DUZENLEYICI_PASIF',
    normalBalance: 'BORC',
    description: 'İşletmenin dönem sonunda giderlerinin gelirlerinden fazla olmasıyla oluşan net zararı izler.',
    ruleExplanation: 'Pasifi Düzenleyen Hesap (-): Dönem zararla kapandığında BORÇ yazılır ve bilançonun Öz Kaynaklar grubunda eksi (-) olarak yer alır.'
  },
  '600': {
    code: '600',
    name: 'Yurtiçi Satışlar',
    accountClass: 6,
    nature: 'GELIR',
    normalBalance: 'ALACAK',
    description: 'Yurt içindeki müşterilere yapılan mal ve hizmet satışlarından elde edilen brüt satış gelirini (hasılatı) izler.',
    ruleExplanation: 'Gelir hesabıdır: Mal veya hizmet satışı yapıldığında satış tutarı (KDV hariç matrah) daima ALACAK yazılır.'
  },
  '610': {
    code: '610',
    name: 'Satıştan İadeler (-)',
    accountClass: 6,
    nature: 'GIDER',
    normalBalance: 'BORC',
    description: 'Müşteriye satılan malların müşteri tarafından beğenilmeyip veya kusurlu çıkıp işletmeye iade edilen kısmını izler.',
    ruleExplanation: 'Geliri Düzenleyen (Gider karakterli) hesap: Müşteri sattığımız malı iade ettiğinde 600 hesabı doğrudan borçlandırılmaz; onun yerine 610 Satıştan İadeler (-) hesabı BORÇ yazılır.'
  },
  '621': {
    code: '621',
    name: 'Satılan Ticari Mallar Maliyeti (-)',
    accountClass: 6,
    nature: 'GIDER',
    normalBalance: 'BORC',
    description: 'Müşteriye satılan ticari malların işletmeye olan alış (geliş) maliyetini izler.',
    ruleExplanation: 'Maliyet/Gider hesabıdır: Satılan malın alış maliyeti kadar 621 hesabı BORÇ yazılır, karşılığında depodan mal çıktığı için 153 Ticari Mallar ALACAK yazılır.'
  },
  '642': {
    code: '642',
    name: 'Faiz Gelirleri',
    accountClass: 6,
    nature: 'GELIR',
    normalBalance: 'ALACAK',
    description: 'Bankadaki vadeli mevduattan veya alacaklardan elde edilen faiz gelirlerini izler.',
    ruleExplanation: 'Gelir hesabıdır: Faiz geliri kazanıldığında daima ALACAK yazılır.'
  },
  '653': {
    code: '653',
    name: 'Komisyon Giderleri (-)',
    accountClass: 6,
    nature: 'GIDER',
    normalBalance: 'BORC',
    description: 'Bankaların çek/senet tahsilatı, havale/EFT işlemleri veya aracılık hizmetleri için kestiği komisyon ücretlerini izler.',
    ruleExplanation: 'Gider hesabıdır: Banka komisyon veya masraf kestiğinde daima BORÇ yazılır.'
  },
  '760': {
    code: '760',
    name: 'Pazarlama, Satış ve Dağıtım Giderleri',
    accountClass: 7,
    nature: 'GIDER',
    normalBalance: 'BORC',
    description: 'Satılan malların müşteriye nakliyesi (kargo), reklam ilanları ve satış mağazası giderlerini izler.',
    ruleExplanation: 'Gider hesabıdır: Reklam, pazarlama veya satış kargo gideri yapıldığında daima BORÇ yazılır.'
  },
  '770': {
    code: '770',
    name: 'Genel Yönetim Giderleri',
    accountClass: 7,
    nature: 'GIDER',
    normalBalance: 'BORC',
    description: 'İşletmenin ofis kirası, elektrik, su, internet, muhasebe, kırtasiye ve yönetim personeli gibi idari giderlerini izler.',
    ruleExplanation: 'Gider hesabıdır: Kira, fatura veya ofis gideri doğduğunda daima BORÇ yazılır.'
  },
  '780': {
    code: '780',
    name: 'Finansman Giderleri',
    accountClass: 7,
    nature: 'GIDER',
    normalBalance: 'BORC',
    description: 'Bankadan kullanılan kredilerin faizlerini ve borçlanma masraflarını izler.',
    ruleExplanation: 'Gider hesabıdır: Kredi faizi ödendiğinde veya tahakkuk ettiğinde daima BORÇ yazılır.'
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
