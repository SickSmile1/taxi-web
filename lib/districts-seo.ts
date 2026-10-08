import type { Lang } from './translations';

interface DistrictSEOContent {
  title: string;
  description: string;
  intro: string;
  pricingText: string;
  medicalAirport: string;
  titleSectionWhy: string;
  titleSectionPrices: string;
  priceEstimationNote: string;
  faqTrafficTitle: string;
  faqTrafficAnswer: string;
}

const TEMPLATES: Record<Lang, DistrictSEOContent> = {
  de: {
    title: 'Taxi Freiburg {district} | Preise & Rufnummer | Taxi-Alica',
    description:
      'Zuverlässiger Taxi-Service in Freiburg-{district}. Berechnen Sie Ihren Preis zu Flughäfen oder in die Stadt online. Direktabrechnung für Krankenfahrten.',
    intro:
      'Sie benötigen ein Taxi in Freiburg-{district}? Ob für eine spontane Fahrt zum Hauptbahnhof, eine komfortable Krankenfahrt zum Arzt oder einen zuverlässigen Flughafentransfer — Taxi-Alica ist Ihr Partner vor Ort. Wir holen Sie direkt an Ihrer Adresse in {district} ab und bringen Sie sicher an Ihr Ziel.',
    pricingText:
      'Die Fahrtkosten werden transparent nach dem offiziellen Freiburger Taxitarif berechnet. Dank unserer Anbindung an die Stadtteil-Datenbank können Sie den Fahrpreis von {district} zu verschiedenen Zielen direkt berechnen lassen.',
    medicalAirport:
      'Planen Sie eine längere Reise? Wir bieten Flughafentransfers zu allen großen Flughäfen in der Region (EuroAirport Basel, Stuttgart, Frankfurt). Zudem führen wir sitzende Krankenfahrten mit direkter Abrechnung mit allen gesetzlichen und privaten Krankenkassen (§ 60 SGB V) durch.',
    titleSectionWhy: 'Warum Taxi-Alica in {district}?',
    titleSectionPrices: 'Fahrpreis-Schätzungen ab {district}',
    priceEstimationNote:
      'Orientierungsschätzungen auf Basis des amtlichen Freiburger Taxitarifs. Keine verbindlichen Festpreise.',
    faqTrafficTitle:
      'Wie wirkt sich der Verkehr in Freiburg-{district} auf die Fahrzeit aus?',
    faqTrafficAnswer:
      'Zu Hauptverkehrszeiten – insbesondere im morgendlichen Berufsverkehr zwischen 07:30 und 09:00 Uhr – weisen unsere Statistiken eine durchschnittliche Verzögerung von ca. 35% auf. Bitte berücksichtigen Sie diese Pufferzeit bei Ihrer Reiseplanung.',
  },
  en: {
    title: 'Taxi Freiburg {district} | Rates & Booking | Taxi-Alica',
    description:
      'Reliable taxi service in Freiburg-{district}. Calculate your fare to airports or downtown online. Direct billing for medical transport.',
    intro:
      "Need a taxi in Freiburg-{district}? Whether it's a spontaneous ride to the main station, a medical appointment, or a reliable airport transfer — Taxi-Alica is your local service. We pick you up directly from your address in {district} and get you safely to your destination.",
    pricingText:
      'Fares are calculated transparently based on the official Freiburg taxi tariff. You can calculate the estimated price from {district} to other locations right here.',
    medicalAirport:
      'Traveling further? We provide airport transfers to regional hubs like EuroAirport Basel, Stuttgart, or Frankfurt. We also offer medical rides with direct insurance billing.',
    titleSectionWhy: 'Why Taxi-Alica in {district}?',
    titleSectionPrices: 'Estimated Taxi Fares from {district}',
    priceEstimationNote:
      'Orientation estimates based on the official Freiburg taxi tariff. Not binding fixed quotes.',
    faqTrafficTitle:
      'How does traffic in Freiburg-{district} affect the travel time?',
    faqTrafficAnswer:
      'During peak hours – especially during the morning rush hour between 07:30 and 09:00 AM – our statistics show an average traffic delay of approx. 35%. Please consider this buffer time when planning your journey.',
  },
  fr: {
    title: 'Taxi Fribourg {district} | Tarifs & Réservation | Taxi-Alica',
    description:
      'Service de taxi fiable à Fribourg-{district}. Calculez votre tarif vers les aéroports ou le centre-ville. Facturation directe pour le transport médical.',
    intro:
      "Besoin d'un taxi à Fribourg-{district} ? Qu'il s'agisse d'un trajet spontané vers la gare centrale, d'un rendez-vous médical ou d'un transfert aéroport fiable, Taxi-Alica est à votre service. Nous vous prenons en charge directement à votre adresse à {district}.",
    pricingText:
      'Les tarifs sont calculés de manière transparente sur la base du tarif officiel des taxis de Fribourg. Calculez le prix estimé au départ de {district}.',
    medicalAirport:
      "Vous voyagez plus loin ? Nous proposons des transferts vers l'EuroAirport de Bâle, Stuttgart ou Francfort. Nous proposons également des transports médicaux avec facturation directe aux caisses de maladie.",
    titleSectionWhy: 'Pourquoi choisir Taxi-Alica à {district} ?',
    titleSectionPrices: 'Tarifs de taxi estimés depuis {district}',
    priceEstimationNote:
      'Estimations basées sur le tarif officiel des taxis de Fribourg. Pas de tarifs fixes contractuels.',
    faqTrafficTitle:
      'Comment le trafic à Fribourg-{district} affecte-t-il le temps de trajet ?',
    faqTrafficAnswer:
      "Aux heures de pointe – en particulier pendant les heures de pointe du matin entre 07:30 et 09:00 – nos statistiques indiquent un retard moyen de trafic d'environ 35%. Veuillez tenir compte de cette marge de temps lors de la planification de votre voyage.",
  },
  es: {
    title: 'Taxi Friburgo {district} | Precios y Reserva | Taxi-Alica',
    description:
      'Servicio de taxi de confianza en Friburgo-{district}. Calcule el precio a aeropuertos o al centro online. Facturación directa para transporte médico.',
    intro:
      '¿Necesita un taxi en Friburgo-{district}? Ya sea un viaje rápido a la estación central, una cita médica o un traslado al aeropuerto, Taxi-Alica es su opción de confianza. Le recogemos directamente en su dirección en {district}.',
    pricingText:
      'Los precios se calculan según la tarifa oficial de taxi de Friburgo. Calcule el precio estimado desde {district} a cualquier destino.',
    medicalAirport:
      '¿Viaja más lejos? Ofrecemos traslados a aeropuertos como EuroAirport Basilea, Stuttgart o Fráncfort, además de transporte médico con facturación directa a su seguro.',
    titleSectionWhy: '¿Por qué elegir Taxi-Alica en {district}?',
    titleSectionPrices: 'Tarifas estimadas de Taxi desde {district}',
    priceEstimationNote:
      'Tarifas estimadas basadas en la tarifa oficial de taxi de Friburgo. Sin compromisos contractuales.',
    faqTrafficTitle:
      '¿Cómo afecta el tráfico en Friburgo-{district} al tiempo de viaje?',
    faqTrafficAnswer:
      'Durante las horas punta, especialmente durante la hora punta de la mañana entre las 07:30 y las 09:00, nuestras estadísticas muestran un retraso medio debido al tráfico de aprox. un 35%. Tenga en cuenta este margen al planificar su viaje.',
  },
  zh: {
    title: '弗赖堡 {district} 出租车 | 价格与预约 | Taxi-Alica',
    description:
      '弗赖堡 {district} 地区可靠的出租车服务。在线计算前往机场或市中心的价格。支持医疗乘车直接报销。',
    intro:
      '需要在弗赖堡 {district} 乘搭出租车吗？无论是前往火车总站、就医还是机场接送，Taxi-Alica 都是您的第一选择。我们直接在 {district} 的地址接您，安全送达目的地。',
    pricingText:
      '车费根据弗赖堡官方出租车费率透明计算。您可以在线计算从 {district} 出发的价格。',
    medicalAirport:
      '前往其他城市？我们提供前往巴塞尔欧洲机场、斯图加特或法兰克福机场的接送服务，并提供医疗乘车直接与医保结算的服务。',
    titleSectionWhy: '为什么在 {district} 选择 Taxi-Alica？',
    titleSectionPrices: '从 {district} 出发的估算车费',
    priceEstimationNote:
      '基于弗赖堡官方出租车费率的估算价格。不作为固定报价依据。',
    faqTrafficTitle: '弗赖堡 {district} 的交通状况对行程时间有什么影响？',
    faqTrafficAnswer:
      '在高峰时段（尤其是早上 07:30 至 09:00 之间的早高峰期间），我们的统计数据表明，由于堵车，平均行程时间会延迟约 35%。在规划行程时请预留充足的备用时间。',
  },
  ar: {
    title: 'تاكسي فرايبورغ {district} | الأسعار والحجز | تاكسي أليكا',
    description:
      'خدمة تاكسي موثوقة في فرايبورغ-{district}. احسب تكلفة رحلتك إلى المطارات أو وسط المدينة. فواتير مباشرة للنقل الطبي.',
    intro:
      'هل تحتاج إلى تاكسي في فرايبورغ-{district}؟ سواء كانت رحلة سريعة إلى المحطة الرئيسية، أو موعد طبي، أو نقل موثوق إلى المطار — تاكسي أليكا في خدمتكم. نقلك مباشرة من عنوانك في {district}.',
    pricingText:
      'يتم احتساب الأسعار بشفافية بناءً على تعريفة التاكسي الرسمية في فرايبورغ. احسب السعر التقريبي من {district} إلى أي مكان.',
    medicalAirport:
      'هل تسافر لمسافة أبعد؟ نوفر انتقالات إلى مطار بازل، شتوتغارت، أو فرانكفورت. كما نوفر رحلات علاجية مع فوترة مباشرة للتأمين الصحي.',
    titleSectionWhy: 'لماذا تختار تاكسي أليكا في {district}؟',
    titleSectionPrices: 'أسعار التاكسي التقديرية من {district}',
    priceEstimationNote:
      'تقديرات تعتمد على تعريفة سيارات الأجرة الرسمية في فرايبورغ. ليست أسعاراً ثابتة ملزمة.',
    faqTrafficTitle:
      'كيف تؤثر حركة المرور في فرايبورغ-{district} على وقت الرحلة؟',
    faqTrafficAnswer:
      'خلال ساعات الذروة – خاصة ذروة المرور الصباحية بين 07:30 و 09:00 صباحاً – تشير إحصاءاتنا إلى تأخير متوسط في حركة المرور بنسبة تقارب 35%. يرجى مراعاة هذا الوقت الإضافي عند التخطيط لرحلتكم.',
  },
  ja: {
    title: 'フライブルク {district} タクシー | 料金と予約 | Taxi-Alica',
    description:
      'フライブルクの {district} 地区で信頼できるタクシーサービス。空港や市内中心部への料金をオンラインで計算。通院送迎の保険直接請求対応。',
    intro:
      'フライブルクの {district} でタクシーをお探しですか？中央駅への急な移動、通院、空港送迎など、Taxi-Alica が安心・確実にお送りします。{district} のご指定の場所までお迎えに上がります。',
    pricingText:
      '運賃はフライブルク市公定のタクシー料金表に基づき計算されます。{district} から目的地までの目安料金を今すぐ算出できます。',
    medicalAirport:
      '遠方へのお出かけですか？バーゼル・ミュールーズ空港、シュトゥットガルト空港、フランクフルト空港への送迎、健康保険直接請求対応 of 通院タクシーも運行しています。',
    titleSectionWhy: 'なぜ {district} で Taxi-Alica なのか？',
    titleSectionPrices: '{district} 発のタクシー概算料金',
    priceEstimationNote:
      'フライブルク公定タクシー運賃に基づく概算値です。確定料金ではありません。',
    faqTrafficTitle:
      'フライブルク {district} の交通状況は所要時間にどのように影響しますか？',
    faqTrafficAnswer:
      '混雑時間帯（特に午前 07:30 から 09:00 までの朝のラッシュアワー）には、統計上、渋滞により所要時間が平均で約 35% 遅延します。ご旅行の計画を立てる際は、この余裕時間を考慮に入れてください。',
  },
};

export function getDistrictSEO(
  district: string,
  lang: Lang,
): DistrictSEOContent {
  const t = TEMPLATES[lang] ?? TEMPLATES.de;
  const replace = (str: string) => str.replace(/{district}/g, district);
  return {
    title: replace(t.title),
    description: replace(t.description),
    intro: replace(t.intro),
    pricingText: replace(t.pricingText),
    medicalAirport: replace(t.medicalAirport),
    titleSectionWhy: replace(t.titleSectionWhy),
    titleSectionPrices: replace(t.titleSectionPrices),
    priceEstimationNote: replace(t.priceEstimationNote),
    faqTrafficTitle: replace(t.faqTrafficTitle),
    faqTrafficAnswer: replace(t.faqTrafficAnswer),
  };
}
