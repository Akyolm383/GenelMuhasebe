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
  '122': {
    code: '122',
    name: 'Alacak Senetleri Reeskontu (-)',
    accountClass: 1,
    nature: 'DUZENLEYICI_AKTIF',
    normalBalance: 'ALACAK',
    description: 'Dönem sonunda henüz vadesi gelmemiş alacak senetlerinin peşin (tasarruf) değerine indirgenmesi için ayrılan reeskont tutarını izler.',
    ruleExplanation: 'Aktifi Düzenleyen Pasif Karakterli Hesap (-): Dönem sonu reeskont kaydında ALACAK yazılır (karşılığında 657 Reeskont Faiz Gideri borçlandırılır). Yeni dönemin başında ters kayıtla BORÇ yazılarak kapatılır.'
  },
  '128': {
    code: '128',
    name: 'Şüpheli Ticari Alacaklar',
    accountClass: 1,
    nature: 'AKTIF',
    normalBalance: 'BORC',
    description: 'Vadesinde tahsil edilemeyen, protesto edilen veya dava/icra safhasına aktarılan senetli ve senetsiz ticari alacakları izler.',
    ruleExplanation: 'Varlık (Aktif) hesabıdır: Bir alacak şüpheli hale gelip icraya verildiğinde 120 veya 121 hesabı alacaklandırılırken 128 Şüpheli Ticari Alacaklar hesabı BORÇ yazılır.'
  },
  '129': {
    code: '129',
    name: 'Şüpheli Ticari Alacaklar Karşılığı (-)',
    accountClass: 1,
    nature: 'DUZENLEYICI_AKTIF',
    normalBalance: 'ALACAK',
    description: 'Şüpheli hale gelen alacaklar için ihtiyatlılık ilkesi gereğince ayrılan değer düşüklüğü karşılıklarını izler.',
    ruleExplanation: 'Aktifi Düzenleyen Pasif Hesap (-): Karşılık ayrıldığında ALACAK yazılır (karşılığında 654 Karşılık Gideri borçlandırılır). Alacak tahsil edildiğinde veya değersizleştiğinde BORÇ yazılarak kapatılır.'
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
  '196': {
    code: '196',
    name: 'Personel Avansları',
    accountClass: 1,
    nature: 'AKTIF',
    normalBalance: 'BORC',
    description: 'İşletme personelinin maaşından mahsup edilmek üzere veya iş masrafı için personele önceden ödenen nakit avansları izler.',
    ruleExplanation: 'Varlık/Alacak (Aktif) hesabıdır: Personele avans verildiğinde BORÇ yazılır; ay sonunda maaş bordrosu tahakkuk ettiğinde avans maaştan düşülerek ALACAK yazılır ve kapatılır.'
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
  '335': {
    code: '335',
    name: 'Personele Borçlar',
    accountClass: 3,
    nature: 'PASIF',
    normalBalance: 'ALACAK',
    description: 'Aylık bordro tahakkuku sonucunda işletme çalışanlarına fiilen ödenecek net maaş tutarlarını izler.',
    ruleExplanation: 'Borç/Kaynak (Pasif) hesabıdır: Bordro tahakkuk ettiğinde personelin hak ettiği net ücret ALACAK yazılır; maaşlar bankadan çalışanların hesaplarına ödendiğinde BORÇ yazılır.'
  },
  '360': {
    code: '360',
    name: 'Ödenecek Vergi ve Fonlar',
    accountClass: 3,
    nature: 'PASIF',
    normalBalance: 'ALACAK',
    description: 'Ay sonunda çıkacak KDV borcu, personel bordrosundaki gelir/damga vergisi ve stopaj gibi devlete ödenecek vergileri izler.',
    ruleExplanation: 'Borç/Kaynak (Pasif) hesabıdır: Ödenecek vergi doğduğunda (tahakkuk ettiğinde) ALACAK, vergi dairesine ödendiğinde BORÇ yazılır.'
  },
  '361': {
    code: '361',
    name: 'Ödenecek Sosyal Güvenlik Kesintileri',
    accountClass: 3,
    nature: 'PASIF',
    normalBalance: 'ALACAK',
    description: 'Personel bordrosundan kesilen çalışan SGK primi ile işletmenin ödemekle yükümlü olduğu SGK işveren primini izler.',
    ruleExplanation: 'Borç/Kaynak (Pasif) hesabıdır: Bordro tahakkukunda SGK primi tahakkuk ettiğinde ALACAK yazılır; SGK primleri bankadan Sosyal Güvenlik Kurumuna ödendiğinde BORÇ yazılarak kapatılır.'
  },
  '370': {
    code: '370',
    name: 'Dönem Kârı Vergi ve Diğer Yasal Yükümlülük Karşılıkları',
    accountClass: 3,
    nature: 'PASIF',
    normalBalance: 'ALACAK',
    description: 'Dönem kârı üzerinden devlete ödenecek kurumlar/gelir vergisi karşılığını izler.',
    ruleExplanation: 'Kısa Vadeli Borç (Pasif) hesabıdır: Dönem sonunda kâr üzerinden vergi karşılığı ayrıldığında (691 Borç) 370 hesabı ALACAK yazılır.'
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
  '611': {
    code: '611',
    name: 'Satış İskontoları (-)',
    accountClass: 6,
    nature: 'GIDER',
    normalBalance: 'BORC',
    description: 'Malların satışından sonra, müşterinin borcunu vadesinden önce peşin ödemesi (kasa iskontosu) veya miktar indirimi nedeniyle yapılan tenzilatları izler.',
    ruleExplanation: 'Geliri Düzenleyen (Gider) hesabıdır: Fatura kesildikten sonra müşteriye erken ödeme iskontosu yapıldığında 611 hesabı daima BORÇ yazılır.'
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
    description: 'Bankadaki vadeli mevduattan veya alacak senetlerinin yenilenmesinden (vade farkı) elde edilen faiz gelirlerini izler.',
    ruleExplanation: 'Gelir hesabıdır: Faiz geliri kazanıldığında daima ALACAK yazılır.'
  },
  '644': {
    code: '644',
    name: 'Konusu Kalmayan Karşılıklar',
    accountClass: 6,
    nature: 'GELIR',
    normalBalance: 'ALACAK',
    description: 'Önceki dönemlerde veya cari dönemde ayrılmış olan şüpheli alacak karşılıklarının tahsilat sonucunda iptal edilen kısmını izler.',
    ruleExplanation: 'Gelir hesabıdır: Şüpheli bir alacak kısmen veya tamamen tahsil edildiğinde karşılık bakiyesi iptal edilerek 644 hesabına ALACAK yazılır.'
  },
  '646': {
    code: '646',
    name: 'Kambiyo Kârları',
    accountClass: 6,
    nature: 'GELIR',
    normalBalance: 'ALACAK',
    description: 'Döviz kurlarındaki artıştan doğan döviz satış kârlarını ve dövizli alacakların kur artışından doğan olumlu kur farklarını izler.',
    ruleExplanation: 'Gelir hesabıdır: Döviz satıldığında veya dövizli varlıkların kur değerlemesinde kâr oluştuğunda daima ALACAK yazılır.'
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
  '654': {
    code: '654',
    name: 'Karşılık Giderleri (-)',
    accountClass: 6,
    nature: 'GIDER',
    normalBalance: 'BORC',
    description: 'Şüpheli hale gelen ticari alacaklar için ihtiyatlılık ilkesi gereği ayrılan karşılıkların gider boyutunu izler.',
    ruleExplanation: 'Gider hesabıdır: Şüpheli alacak için değer düşüklüğü karşılığı ayrıldığında (129 Alacak) 654 hesabı daima BORÇ yazılır.'
  },
  '656': {
    code: '656',
    name: 'Kambiyo Zararları (-)',
    accountClass: 6,
    nature: 'GIDER',
    normalBalance: 'BORC',
    description: 'Döviz kurlarındaki düşüşten veya dövizli borçların kur artışı nedeniyle yükselmesinden doğan kur farkı zararlarını izler.',
    ruleExplanation: 'Gider hesabıdır: Döviz satışında veya dövizli işlem değerlemesinde kur zararı oluştuğunda daima BORÇ yazılır.'
  },
  '657': {
    code: '657',
    name: 'Reeskont Faiz Giderleri (-)',
    accountClass: 6,
    nature: 'GIDER',
    normalBalance: 'BORC',
    description: 'Dönem sonunda henüz vadesi gelmemiş alacak senetlerine ayrılan reeskont faiz tutarını izler.',
    ruleExplanation: 'Gider hesabıdır: Alacak senetlerine reeskont ayrıldığında (122 Alacak) 657 hesabı daima BORÇ yazılır.'
  },
  '679': {
    code: '679',
    name: 'Diğer Olağandışı Gelir ve Kârlar',
    accountClass: 6,
    nature: 'GELIR',
    normalBalance: 'ALACAK',
    description: 'İşletmenin ana faaliyet konusu dışında gerçekleşen duran varlık (taşıt/demirbaş) satış kârlarını izler.',
    ruleExplanation: 'Gelir hesabıdır: Taşıt veya demirbaş net defter değerinin üzerinde satıldığında oluşan satış kârı 679 hesabına ALACAK yazılır.'
  },
  '689': {
    code: '689',
    name: 'Diğer Olağandışı Gider ve Zararlar (-)',
    accountClass: 6,
    nature: 'GIDER',
    normalBalance: 'BORC',
    description: 'İşletmenin ana faaliyet konusu dışındaki duran varlık (taşıt/demirbaş) satış zararlarını izler.',
    ruleExplanation: 'Gider hesabıdır: Taşıt veya demirbaş net defter değerinin altında bir fiyata zararla satıldığında oluşan zarar 689 hesabına BORÇ yazılır.'
  },
  '690': {
    code: '690',
    name: 'Dönem Kârı veya Zararı',
    accountClass: 6,
    nature: 'GELIR',
    normalBalance: 'ALACAK',
    description: 'Dönem sonunda tüm gelir ve gider hesaplarının devredilerek toplandığı muhasebe özet kapanış hesabıdır.',
    ruleExplanation: 'Dönem Sonu Özet Kapanış Hesabı: Gelir hesapları (600, 642, 646, 679 vb.) borçlandırılarak 690 ALACAĞINA; gider/maliyet hesapları (621, 653, 654, 760, 770, 780 vb.) alacaklandırılarak 690 BORCUNA devredilir.'
  },
  '691': {
    code: '691',
    name: 'Dönem Kârı Vergi ve Diğer Yasal Yükümlülük Karşılıkları (-)',
    accountClass: 6,
    nature: 'GIDER',
    normalBalance: 'BORC',
    description: 'Dönem kârı üzerinden ayrılan kurumlar vergisi karşılığının gelir tablosundaki net kârı azaltan boyutunu izler.',
    ruleExplanation: 'Gider/Düzenleyici Hesap (-): Vergi karşılığı ayrıldığında 691 BORÇ (karşılığında 370 Pasif Alacak) yazılır.'
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
