export interface CardinalAngle {
  file: string;
  deg: number;
  label: {
    de: string;
    en: string;
    zh: string;
    ar: string;
    es: string;
    fr: string;
    ja: string;
  };
}

export interface FleetCar {
  id: string;
  slug: string;
  name: string;
  brand: string;
  model: string;
  type: {
    de: string;
    en: string;
    zh: string;
    ar: string;
    es: string;
    fr: string;
    ja: string;
  };
  color: {
    de: string;
    en: string;
    zh: string;
    ar: string;
    es: string;
    fr: string;
    ja: string;
  };
  colorDot: string;
  licensePlate: string;
  seats: string;
  seatsCount: number;
  luggage: {
    de: string;
    en: string;
    zh: string;
    ar: string;
    es: string;
    fr: string;
    ja: string;
  };
  badge: {
    de: string;
    en: string;
    zh: string;
    ar: string;
    es: string;
    fr: string;
    ja: string;
  };
  description: {
    de: string;
    en: string;
    zh: string;
    ar: string;
    es: string;
    fr: string;
    ja: string;
  };
  features: {
    de: string[];
    en: string[];
    zh: string[];
    ar: string[];
    es: string[];
    fr: string[];
    ja: string[];
  };
  useCases: {
    de: string[];
    en: string[];
    zh: string[];
    ar: string[];
    es: string[];
    fr: string[];
    ja: string[];
  };
  folder72: string;
  filePrefix72: string;
  folder8: string;
  cardinals: CardinalAngle[];
}

export const FLEET_CARS: FleetCar[] = [
  {
    id: '01_mercedes_e220_white',
    slug: 'mercedes-e220-white',
    name: 'Mercedes-Benz E-Klasse E220',
    brand: 'Mercedes-Benz',
    model: 'E 220 d Limousine',
    type: {
      de: 'Executive Limousine',
      en: 'Executive Sedan',
      zh: '行政级豪华轿车',
      ar: 'ليموزين تنفيذية',
      es: 'Berlina Ejecutiva',
      fr: 'Berline Exécutive',
      ja: 'エグゼクティブセダン',
    },
    color: {
      de: 'Polarweiß',
      en: 'Polar White',
      zh: '极地白',
      ar: 'أبيض قطبي',
      es: 'Blanco Polar',
      fr: 'Blanc Polaire',
      ja: 'ポーラーホワイト',
    },
    colorDot: '#f5f5f5',
    licensePlate: 'FR-FA 444',
    seats: '1–4 Fahrgäste',
    seatsCount: 4,
    luggage: {
      de: '3 große Koffer + Handgepäck',
      en: '3 large suitcases + carry-on bags',
      zh: '3件大号行李箱 + 随身行李',
      ar: '3 حقائب كبيرة + أمتعة يد',
      es: '3 maletas grandes + equipaje de mano',
      fr: '3 grandes valises + bagages à main',
      ja: '大型スーツケース3個 + 手荷物',
    },
    badge: {
      de: 'Business & Komfort',
      en: 'Business & Comfort',
      zh: '商务与舒适',
      ar: 'أعمال وراحة',
      es: 'Negocios y Confort',
      fr: 'Affaires & Confort',
      ja: 'ビジネス & 快適性',
    },
    description: {
      de: 'Die Mercedes-Benz E-Klasse ist der Goldstandard für erstklassige Personenbeförderung. Ausgestattet mit leisem Akustik-Komfort, ergonomischen Sitzen und 2-Zonen-Klimatisierung.',
      en: 'The Mercedes-Benz E-Class is the gold standard for premium passenger transportation. Features quiet acoustic comfort, ergonomic seating, and dual-zone climate control.',
      zh: '梅赛德斯-奔驰E级轿车是高品质客运的黄金标准。配备静音舒适座舱、人体工程学座椅和双区自动空调。',
      ar: 'مرسيدس-بنز الفئة E هي المعيار الذهبي لنقل الركاب المتميز. تتميز براحة صوتية هادئة ومقاعد مريحة وتكييف ثنائي المنطقة.',
      es: 'El Mercedes-Benz Clase E es el estándar de oro para el transporte de pasajeros de primera clase. Equipado con confort acústico, asientos ergonómicos y climatizador bizona.',
      fr: 'La Mercedes-Benz Classe E est la référence absolue pour le transport de personnes haut de gamme. Dotée d’une insonorisation de premier ordre, de sièges ergonomiques et d’une climatisation bi-zone.',
      ja: 'メルセデス・ベンツ Eクラスはプレミアム旅客輸送の世界的標準です。優れた静粛性、人間工学に基づいたシート、2ゾーンエアコンを完備。',
    },
    features: {
      de: [
        '2-Zonen Klimaautomatik',
        'Ergonomische Ledersitze',
        'Geräuscharmes Fahrwerk',
        'Bargeldlose Kartenzahlung / Apple Pay',
        'Smartphone-Ladekabel (USB-C & Lightning)',
      ],
      en: [
        'Dual-zone automatic climate control',
        'Ergonomic leather seats',
        'Ultra-quiet suspension',
        'Contactless payment / Apple Pay',
        'Device chargers (USB-C & Lightning)',
      ],
      zh: [
        '双区自动恒温空调',
        '人体工程学皮质座椅',
        '超静音悬挂系统',
        '支持无接触刷卡及移动支付',
        '提供多种手机充电线',
      ],
      ar: [
        'تكييف هواء أوتوماتيكي ثنائي المنطقة',
        'مقاعد جلدية مريحة',
        'نظام تعليق هادئ',
        'دفع إلكتروني لا تلامسي',
        'شواحن هواتف ذكية',
      ],
      es: [
        'Climatizador automático bizona',
        'Asientos ergonómicos de cuero',
        'Suspensión ultrasilenciosa',
        'Pago sin contacto / Apple Pay',
        'Cargadores para smartphones',
      ],
      fr: [
        'Climatisation automatique bi-zone',
        'Sièges ergonomiques en cuir',
        'Suspension très silencieuse',
        'Paiement sans contact / Apple Pay',
        'Chargeurs pour smartphones',
      ],
      ja: [
        '2ゾーン自動エアコン',
        '人間工学レザーシート',
        '静粛性に優れたサスペンション',
        '非接触決済 / 各種カード対応',
        'スマートフォン充電設備完備',
      ],
    },
    useCases: {
      de: [
        'Stadt- & Geschäftsfahrten Freiburg',
        'Flughafentransfer (1–4 Personen)',
        'Sitzende Krankenfahrten & Arzttermine (§ 60 SGB V)',
        'Diskrete VIP- & Langstreckenfahrten',
      ],
      en: [
        'City rides & business travel in Freiburg',
        'Airport transfers (1–4 passengers)',
        'Medical non-emergency patient rides (§ 60 SGB V)',
        'Discreet VIP & long-distance transfers',
      ],
      zh: [
        '弗赖堡市内出行与商务接送',
        '机场接送（1–4人）',
        '坐式就医专车 (§ 60 SGB V)',
        '尊贵VIP及长途接送',
      ],
      ar: [
        'رحلات داخل فرايبورغ ورحلات أعمال',
        'توصيل المطار (1-4 ركاب)',
        'نقل المرضى الجالسين للعيادات (§ 60 SGB V)',
        'رحلات VIP لمسافات طويلة',
      ],
      es: [
        'Viajes urbanos y de negocios en Friburgo',
        'Traslados al aeropuerto (1–4 personas)',
        'Transporte médico sentado (§ 60 SGB V)',
        'Traslados discretos VIP y larga distancia',
      ],
      fr: [
        'Trajets en ville et voyages d’affaires à Fribourg',
        'Transfert aéroport (1 à 4 personnes)',
        'Transport de malades assis (§ 60 SGB V)',
        'Trajets VIP et longue distance discrets',
      ],
      ja: [
        'フライブルク市内・ビジネス移動',
        '空港送迎（1〜4名様）',
        '通院・医療送迎（着席移動 § 60 SGB V）',
        'VIP・長距離移動',
      ],
    },
    folder72: '/cars/01_mercedes_e220_white/02_turntable_72_frames/',
    filePrefix72: 'mercedes_e220_frame_',
    folder8: '/cars/01_mercedes_e220_white/01_cardinal_8_angles/',
    cardinals: [
      {
        file: '01_mercedes_e220_white_000deg_front.jpg',
        deg: 0,
        label: {
          de: '0° Frontansicht',
          en: '0° Front View',
          zh: '0° 正视图',
          ar: '0° منظر أمامي',
          es: '0° Vista frontal',
          fr: '0° Vue de face',
          ja: '0° 正面',
        },
      },
      {
        file: '02_mercedes_e220_white_045deg_front_right.jpg',
        deg: 45,
        label: {
          de: '45° Vorne Rechts',
          en: '45° Front-Right',
          zh: '45° 右前侧',
          ar: '45° أمامي يمين',
          es: '45° Frontal derecho',
          fr: '45° Avant droit',
          ja: '45° 右前方',
        },
      },
      {
        file: '03_mercedes_e220_white_090deg_right_profile.jpg',
        deg: 90,
        label: {
          de: '90° Seitenprofil Rechts',
          en: '90° Right Profile',
          zh: '90° 右侧轮廓',
          ar: '90° جانبي يمين',
          es: '90° Perfil derecho',
          fr: '90° Profil droit',
          ja: '90° 右側面',
        },
      },
      {
        file: '04_mercedes_e220_white_135deg_rear_right.jpg',
        deg: 135,
        label: {
          de: '135° Hinten Rechts',
          en: '135° Rear-Right',
          zh: '135° 右后侧',
          ar: '135° خلفي يمين',
          es: '135° Trasero derecho',
          fr: '135° Arrière droit',
          ja: '135° 右後方',
        },
      },
      {
        file: '05_mercedes_e220_white_180deg_rear.jpg',
        deg: 180,
        label: {
          de: '180° Heckansicht',
          en: '180° Rear View',
          zh: '180° 后视图',
          ar: '180° منظر خلفي',
          es: '180° Vista trasera',
          fr: '180° Vue arrière',
          ja: '180° 背面',
        },
      },
      {
        file: '06_mercedes_e220_white_225deg_rear_left.jpg',
        deg: 225,
        label: {
          de: '225° Hinten Links',
          en: '225° Rear-Left',
          zh: '225° 左后侧',
          ar: '225° خلفي يسار',
          es: '225° Trasero izquierdo',
          fr: '225° Arrière gauche',
          ja: '225° 左後方',
        },
      },
      {
        file: '07_mercedes_e220_white_270deg_left_profile.jpg',
        deg: 270,
        label: {
          de: '270° Seitenprofil Links',
          en: '270° Left Profile',
          zh: '270° 左侧轮廓',
          ar: '270° جانبي يسار',
          es: '270° Perfil izquierdo',
          fr: '270° Profil gauche',
          ja: '270° 左側面',
        },
      },
      {
        file: '08_mercedes_e220_white_315deg_front_left.jpg',
        deg: 315,
        label: {
          de: '315° Vorne Links',
          en: '315° Front-Left',
          zh: '315° 左前侧',
          ar: '315° أمامي يسار',
          es: '315° Frontal izquierdo',
          fr: '315° Avant gauche',
          ja: '315° 左前方',
        },
      },
    ],
  },
  {
    id: '02_mercedes_vito_black',
    slug: 'mercedes-vito-tourer',
    name: 'Mercedes-Benz Vito Tourer',
    brand: 'Mercedes-Benz',
    model: 'Vito Tourer Großraumtaxi',
    type: {
      de: 'Großraumtaxi (bis 8 Personen)',
      en: 'Large Van (up to 8 Passengers)',
      zh: '大容量多功能商务车（最多8人）',
      ar: 'تاكسي كبير (حتى 8 ركاب)',
      es: 'Gran Monovolumen (hasta 8 personas)',
      fr: 'Grand Taxi Monospace (jusqu’à 8 passagers)',
      ja: 'ジャンボタクシー（最大8名様）',
    },
    color: {
      de: 'Obsidianschwarz Metallic',
      en: 'Obsidian Black Metallic',
      zh: '曜岩黑金属漆',
      ar: 'أسود بركاني ميتاليك',
      es: 'Negro Obsidiana Metalizado',
      fr: 'Noir Obsidienne Métallisé',
      ja: 'オブシディアンブラック',
    },
    colorDot: '#1a1a1a',
    licensePlate: 'FR-FA 4567',
    seats: 'bis zu 8 Fahrgäste',
    seatsCount: 8,
    luggage: {
      de: 'bis zu 8 Großkoffer + Faltrollstuhl / Rollator',
      en: 'up to 8 large suitcases + folding wheelchair / rollator',
      zh: '最多8件大型行李箱 + 折叠轮椅/助行器',
      ar: 'حتى 8 حقائب كبيرة + كرسي متحرك قابل للطي',
      es: 'hasta 8 maletas grandes + silla de ruedas plegable',
      fr: 'jusqu’à 8 grandes valises + fauteuil roulant pliable',
      ja: '大型スーツケース最大8個 + 折りたたみ車椅子',
    },
    badge: {
      de: 'Großraum & Gruppen',
      en: 'Spacious & Groups',
      zh: '大空间与团体出行',
      ar: 'مساحة واسعة والمجموعات',
      es: 'Gran Espacio y Grupos',
      fr: 'Grand Espace & Groupes',
      ja: '広々空間 & グループ',
    },
    description: {
      de: 'Unser Mercedes-Benz Vito Tourer bietet überlegenen Raumkomfort für Gruppen und Familien bis zu 8 Personen. Die breite seitliche Schiebetür garantiert bequemes und barrierearmes Ein- und Aussteigen.',
      en: 'Our Mercedes-Benz Vito Tourer offers superior room and comfort for groups and families up to 8 people. The wide sliding door guarantees easy, barrier-free boarding.',
      zh: '我们的梅赛德斯-奔驰 Vito Tourer 为最多8人的团体和家庭提供极佳的空间舒适度。宽大的侧滑门确保轻松无障碍上下车。',
      ar: 'توفر سيارة مرسيدس-بنز فيتو تورير راحة استثنائية للمجموعات والعائلات التي تصل إلى 8 أشخاص. يضمن الباب الجانبي المنزلق العريض ركوباً سهلاً ومريحاً.',
      es: 'Nuestro Mercedes-Benz Vito Tourer ofrece un confort espacial superior para grupos y familias de hasta 8 personas. La amplia puerta corredera garantiza un acceso cómodo.',
      fr: 'Notre Mercedes-Benz Vito Tourer offre un confort d’espace inégalé pour les groupes et familles jusqu’à 8 personnes. La large porte coulissante latérale garantit une montée facile.',
      ja: 'メルセデス・ベンツ Vito Tourer は最大8名様までのグループやご家族に最高の広さと快適性を提供します。ワイドなスライドドアでスムーズに乗降可能。',
    },
    features: {
      de: [
        'Großzügiger Fahrgastraum für 8 Personen',
        'Breite Schiebetür für komfortablen Einstieg',
        'Separate Klimaregelung im Fond',
        'Getönte Wärmeschutz- & Privacy-Verglasung',
        'Platz für Gepäckberge, Kinderwagen & Rollatoren',
      ],
      en: [
        'Spacious seating compartment for 8 passengers',
        'Wide sliding door for effortless entry',
        'Independent rear climate control',
        'Dark tinted privacy glass',
        'Huge cargo capacity for luggage & strollers',
      ],
      zh: [
        '可容纳8名乘客的宽敞乘客舱',
        '宽大侧滑门，上下车极其方便',
        '后排独立空调温控',
        '深色防晒隐私玻璃',
        '超大行李装载空间，可放婴儿车与轮椅',
      ],
      ar: [
        'مقصورة ركاب فسيحة تتسع لـ 8 أشخاص',
        'باب منزلق واسع للدخول المريح',
        'تحكم منفصل بالتكييف في الخلف',
        'زجاج معتم للخصوصية',
        'مساحة تخزين هائلة للأمتعة والكراسي المتحركة',
      ],
      es: [
        'Espacio generoso para 8 pasajeros',
        'Puerta corredera ancha para fácil acceso',
        'Climatización independiente en plazas traseras',
        'Cristales tintados para mayor privacidad',
        'Enorme capacidad para equipajes y cochecitos',
      ],
      fr: [
        'Habitacle spacieux pour 8 passagers',
        'Porte coulissante large pour un accès facile',
        'Climatisation arrière indépendante',
        'Vitrage teinté athermique et privacy',
        'Grand coffre pour bagages, poussettes et déambulateurs',
      ],
      ja: [
        '8名様がゆったり座れる広大なキャビン',
        '乗降しやすいワイドスライドドア',
        '後部座席専用の独立エアコン',
        'プライバシーを守るスモークガラス',
        '大容量ラゲッジスペース（ベビーカー等対応）',
      ],
    },
    useCases: {
      de: [
        'Familien- & Gruppenreisen bis 8 Personen',
        'Flughafentransfer mit hohem Gepäckaufkommen',
        'Krankenfahrten mit Angehörigen & Gehhilfen',
        'Firmenveranstaltungen & Messe-Shuttle',
      ],
      en: [
        'Family & group travels up to 8 passengers',
        'Airport transfers with heavy luggage',
        'Patient rides with companions & mobility aids',
        'Corporate events & trade fair shuttles',
      ],
      zh: [
        '家庭及团体出游（最多8人）',
        '大件行李机场接送',
        '家属陪同就医就诊',
        '企业商务会议及展会接送',
      ],
      ar: [
        'رحلات العائلات والمجموعات حتى 8 أشخاص',
        'توصيل المطار مع أمتعة كثيرة',
        'نقل المرضى مع مرافقين وأجهزة مساعدة',
        'فعاليات الشركات والمعارض',
      ],
      es: [
        'Viajes familiares y de grupo hasta 8 personas',
        'Traslados al aeropuerto con gran volumen de equipaje',
        'Transporte médico con acompañantes',
        'Eventos de empresa y traslados a ferias',
      ],
      fr: [
        'Voyages en famille et en groupe jusqu’à 8 personnes',
        'Transfert aéroport avec volume important de bagages',
        'Transport médical avec accompagnant',
        'Événements d’entreprise et navettes de salon',
      ],
      ja: [
        '最大8名様のご家族・グループ旅行',
        '大荷物での空港アクセス',
        '付き添いの方や歩行補助具を伴う通院',
        '企業のイベント・展示会シャトル',
      ],
    },
    folder72: '/cars/02_mercedes_vito_black/02_turntable_72_frames/',
    filePrefix72: 'mercedes_vito_frame_',
    folder8: '/cars/02_mercedes_vito_black/01_cardinal_8_angles/',
    cardinals: [
      {
        file: '01_mercedes_vito_black_000deg_front.jpg',
        deg: 0,
        label: {
          de: '0° Frontansicht',
          en: '0° Front View',
          zh: '0° 正视图',
          ar: '0° منظر أمامي',
          es: '0° Vista frontal',
          fr: '0° Vue de face',
          ja: '0° 正面',
        },
      },
      {
        file: '02_mercedes_vito_black_045deg_front_right.jpg',
        deg: 45,
        label: {
          de: '45° Vorne Rechts',
          en: '45° Front-Right',
          zh: '45° 右前侧',
          ar: '45° أمامي يمين',
          es: '45° Frontal derecho',
          fr: '45° Avant droit',
          ja: '45° 右前方',
        },
      },
      {
        file: '03_mercedes_vito_black_090deg_right_profile.jpg',
        deg: 90,
        label: {
          de: '90° Seitenprofil Rechts',
          en: '90° Right Profile',
          zh: '90° 右侧轮廓',
          ar: '90° جانبي يمين',
          es: '90° Perfil derecho',
          fr: '90° Profil droit',
          ja: '90° 右側面',
        },
      },
      {
        file: '04_mercedes_vito_black_135deg_rear_right.jpg',
        deg: 135,
        label: {
          de: '135° Hinten Rechts',
          en: '135° Rear-Right',
          zh: '135° 右后侧',
          ar: '135° خلفي يمين',
          es: '135° Trasero derecho',
          fr: '135° Arrière droit',
          ja: '135° 右後方',
        },
      },
      {
        file: '05_mercedes_vito_black_180deg_rear.jpg',
        deg: 180,
        label: {
          de: '180° Heckansicht',
          en: '180° Rear View',
          zh: '180° 后视图',
          ar: '180° منظر خلفي',
          es: '180° Vista trasera',
          fr: '180° Vue arrière',
          ja: '180° 背面',
        },
      },
      {
        file: '06_mercedes_vito_black_225deg_rear_left.jpg',
        deg: 225,
        label: {
          de: '225° Hinten Links',
          en: '225° Rear-Left',
          zh: '225° 左后侧',
          ar: '225° خلفي يسار',
          es: '225° Trasero izquierdo',
          fr: '225° Arrière gauche',
          ja: '225° 左後方',
        },
      },
      {
        file: '07_mercedes_vito_black_270deg_left_profile.jpg',
        deg: 270,
        label: {
          de: '270° Seitenprofil Links',
          en: '270° Left Profile',
          zh: '270° 左侧轮廓',
          ar: '270° جانبي يسار',
          es: '270° Perfil izquierdo',
          fr: '270° Profil gauche',
          ja: '270° 左側面',
        },
      },
      {
        file: '08_mercedes_vito_black_315deg_front_left.jpg',
        deg: 315,
        label: {
          de: '315° Vorne Links',
          en: '315° Front-Left',
          zh: '315° 左前侧',
          ar: '315° أمامي يسار',
          es: '315° Frontal izquierdo',
          fr: '315° Avant gauche',
          ja: '315° 左前方',
        },
      },
    ],
  },
  {
    id: '03_volvo_s90_white',
    slug: 'volvo-s90-white',
    name: 'Volvo S90 Luxury',
    brand: 'Volvo',
    model: 'S90 Luxury Limousine',
    type: {
      de: 'Premium-Limousine',
      en: 'Premium Luxury Sedan',
      zh: '北欧豪华行政轿车',
      ar: 'ليموزين فاخرة',
      es: 'Berlina de Lujo Premium',
      fr: 'Berline Premium Haut de Gamme',
      ja: 'プレミアムラグジュアリーセダン',
    },
    color: {
      de: 'Kristallweiß-Perleffekt',
      en: 'Crystal White Pearl',
      zh: '水晶白珍珠漆',
      ar: 'أبيض لؤلؤي كريستالي',
      es: 'Blanco Cristal Perlado',
      fr: 'Blanc Cristal Nacré',
      ja: 'クリスタルホワイトパール',
    },
    colorDot: '#f0f3f6',
    licensePlate: 'FR-FA 111',
    seats: '1–4 Fahrgäste',
    seatsCount: 4,
    luggage: {
      de: '3 große Koffer + Handgepäck',
      en: '3 large suitcases + carry-on bags',
      zh: '3件大号行李箱 + 随身行李',
      ar: '3 حقائب كبيرة + أمتعة يد',
      es: '3 maletas grandes + equipaje de mano',
      fr: '3 grandes valises + bagages à main',
      ja: '大型スーツケース3個 + 手荷物',
    },
    badge: {
      de: 'Premium & Langstrecke',
      en: 'Premium & Long Distance',
      zh: '顶级长途奢享',
      ar: 'فاخر ومسافات طويلة',
      es: 'Premium y Larga Distancia',
      fr: 'Premium & Longue Distance',
      ja: 'プレミアム & 長距離',
    },
    description: {
      de: 'Skandinavische Eleganz, preisgekrönte Sicherheitsarchitektur und souveränes Fahrgefühl: Die Volvo S90 Limousine bietet außergewöhnliche Laufruhe für entspannte Fern- und Komfortfahrten.',
      en: 'Scandinavian elegance, award-winning safety architecture, and supreme ride quality: The Volvo S90 Sedan provides unmatched smoothness for relaxing long-distance and comfort journeys.',
      zh: '斯堪的纳维亚优雅设计、屡获殊荣的安全架构与从容的驾乘体验：沃尔沃S90豪华轿车为长途与舒适出行提供非凡的静谧享受。',
      ar: 'أناقة إسكندنافية وهندسة أمان حائزة على جوائز: توفر سيارة فولفو S90 هدوءاً استثنائياً للرحلات الطويلة المريحة.',
      es: 'Elegancia escandinava y seguridad galardonada: El Volvo S90 ofrece una suavidad de marcha inigualable para trayectos largos y confortables.',
      fr: 'Élégance scandinave, sécurité récompensée et confort remarquable : La berline Volvo S90 offre un silence de roulement exceptionnel pour vos longs trajets.',
      ja: 'スカンジナビアの洗練美と世界最高水準の安全性を融合。静かで滑らかな走りで、優雅な長距離・ラグジュアリー移動をお約束します。',
    },
    features: {
      de: [
        'Skandinavisches Luxus-Ambiente',
        'IntelliSafe Fahrerassistenzsysteme',
        'Flüsterleise Fahrgastraum-Dämmung',
        'Sitzheizung & Premium-Klangsystem',
        'Bargeldlose Bezahlung & Quittungsservice',
      ],
      en: [
        'Scandinavian luxury ambiance',
        'IntelliSafe advanced driver assistance',
        'Whisper-quiet acoustic cabin insulation',
        'Heated seats & premium sound system',
        'Card payment & digital receipt service',
      ],
      zh: [
        '北欧豪华座舱设计',
        'IntelliSafe 智能安全辅助系统',
        '顶级NVH隔音静谧车厢',
        '座椅加热与高级音响系统',
        '全流程无现金结算与电子发票',
      ],
      ar: [
        'أجواء فاخرة إسكندنافية',
        'أنظمة مساعدة السائق الذكية IntelliSafe',
        'عزل صوتي فائق الهدوء',
        'تدفئة مقاعد ونظام صوتي مميز',
        'دفع إلكتروني وإيصالات رقمية',
      ],
      es: [
        'Ambiente de lujo escandinavo',
        'Sistemas de asistencia IntelliSafe',
        'Aislamiento acústico supersilencioso',
        'Asientos calefactados y sonido premium',
        'Pago con tarjeta y recibo digital',
      ],
      fr: [
        'Ambiance luxueuse scandinave',
        'Systèmes d’assistance IntelliSafe',
        'Insonorisation acoustique remarquable',
        'Sièges chauffants & sonorisation haut de gamme',
        'Paiement dématérialisé et facture immédiate',
      ],
      ja: [
        '北欧ラグジュアリーインテリア',
        'IntelliSafe 先進安全運転支援システム',
        '極めて高いキャビン静粛性',
        'シートヒーター & 高音質オーディオ',
        '各種キャッシュレス決済対応',
      ],
    },
    useCases: {
      de: [
        'VIP- & Langstreckentransfers (Basel, Zürich, Frankfurt)',
        'Exklusive Hochzeits- & Anlassfahrten',
        'Komfortable Krankenfahrten mit höchster Ruhe',
        'Repräsentative Vorstands- & Gäste-Shuttles',
      ],
      en: [
        'VIP & long-distance transfers (Basel, Zurich, Frankfurt)',
        'Exclusive wedding & event transport',
        'Peaceful and soothing medical rides',
        'Executive corporate & client shuttles',
      ],
      zh: [
        '国际机场VIP长途接送（巴塞尔、苏黎世、法兰克福）',
        '高端婚礼及重大活动用车',
        '宁静舒适的就医陪护出行',
        '企业高管与贵宾接待',
      ],
      ar: [
        'رحلات VIP للمسافات الطويلة (بازل، زيورخ، فرانكفورت)',
        'خدمات حفلات الزفاف والمناسبات الخاصة',
        'نقل طبي مريح وهادئ',
        'خدمات كبار الشخصيات والشركات',
      ],
      es: [
        'Traslados VIP de larga distancia (Basilea, Zúrich, Fráncfort)',
        'Servicio exclusivo para bodas y eventos',
        'Transporte médico tranquilo y confortable',
        'Traslados ejecutivos y de invitados',
      ],
      fr: [
        'Transferts VIP longue distance (Bâle, Zurich, Francfort)',
        'Service exclusif pour mariages et réceptions',
        'Transports médicaux dans un calme absolu',
        'Navettes exécutives et accueil de délégations',
      ],
      ja: [
        'VIP・長距離空港アクセス（バーゼル、チューリッヒ、フランクフルト）',
        'ウェディング・記念日送迎',
        '静かで負担の少ない通院送迎',
        '役員送迎・大切なお客様の接遇',
      ],
    },
    folder72: '/cars/03_volvo_s90_white/02_turntable_72_frames/',
    filePrefix72: 'volvo_s90_white_frame_',
    folder8: '/cars/03_volvo_s90_white/01_cardinal_8_angles/',
    cardinals: [
      {
        file: '01_volvo_s90_white_000deg.jpg',
        deg: 0,
        label: {
          de: '0° Frontansicht',
          en: '0° Front View',
          zh: '0° 正视图',
          ar: '0° منظر أمامي',
          es: '0° Vista frontal',
          fr: '0° Vue de face',
          ja: '0° 正面',
        },
      },
      {
        file: '02_volvo_s90_white_045deg.jpg',
        deg: 45,
        label: {
          de: '45° Vorne Rechts',
          en: '45° Front-Right',
          zh: '45° 右前侧',
          ar: '45° أمامي يمين',
          es: '45° Frontal derecho',
          fr: '45° Avant droit',
          ja: '45° 右前方',
        },
      },
      {
        file: '03_volvo_s90_white_090deg.jpg',
        deg: 90,
        label: {
          de: '90° Seitenprofil Rechts',
          en: '90° Right Profile',
          zh: '90° 右侧轮廓',
          ar: '90° جانبي يمين',
          es: '90° Perfil derecho',
          fr: '90° Profil droit',
          ja: '90° 右側面',
        },
      },
      {
        file: '04_volvo_s90_white_135deg.jpg',
        deg: 135,
        label: {
          de: '135° Hinten Rechts',
          en: '135° Rear-Right',
          zh: '135° 右后侧',
          ar: '135° خلفي يمين',
          es: '135° Trasero derecho',
          fr: '135° Arrière droit',
          ja: '135° 右後方',
        },
      },
      {
        file: '05_volvo_s90_white_180deg.jpg',
        deg: 180,
        label: {
          de: '180° Heckansicht',
          en: '180° Rear View',
          zh: '180° 后视图',
          ar: '180° منظر خلفي',
          es: '180° Vista trasera',
          fr: '180° Vue arrière',
          ja: '180° 背面',
        },
      },
      {
        file: '06_volvo_s90_white_225deg.jpg',
        deg: 225,
        label: {
          de: '225° Hinten Links',
          en: '225° Rear-Left',
          zh: '225° 左后侧',
          ar: '225° خلفي يسار',
          es: '225° Trasero izquierdo',
          fr: '225° Arrière gauche',
          ja: '225° 左後方',
        },
      },
      {
        file: '07_volvo_s90_white_270deg_left_profile.jpg',
        deg: 270,
        label: {
          de: '270° Seitenprofil Links',
          en: '270° Left Profile',
          zh: '270° 左侧轮廓',
          ar: '270° جانبي يسار',
          es: '270° Perfil izquierdo',
          fr: '270° Profil gauche',
          ja: '270° 左側面',
        },
      },
      {
        file: '08_volvo_s90_white_315deg_front_left.jpg',
        deg: 315,
        label: {
          de: '315° Vorne Links',
          en: '315° Front-Left',
          zh: '315° 左前侧',
          ar: '315° أمامي يسار',
          es: '315° Frontal izquierdo',
          fr: '315° Avant gauche',
          ja: '315° 左前方',
        },
      },
    ],
  },
];

export interface FleetGalleryItem {
  id: string;
  file: string;
  title: {
    de: string;
    en: string;
    zh: string;
    ar: string;
    es: string;
    fr: string;
    ja: string;
  };
  subtitle: {
    de: string;
    en: string;
    zh: string;
    ar: string;
    es: string;
    fr: string;
    ja: string;
  };
  aspectRatio: string;
}

export const FLEET_GALLERY_IMAGES: FleetGalleryItem[] = [
  {
    id: 'alle_autos',
    file: '/cars/alle_autos.jpg',
    title: {
      de: 'Die Taxi-Alica Gesamtfahrzeugflotte',
      en: 'The Complete Taxi-Alica Vehicle Fleet',
      zh: 'Taxi-Alica 全体车队实景',
      ar: 'كامل أسطول سيارات تاكسي أليكا',
      es: 'La Flota Completa de Taxi-Alica',
      fr: 'L’ensemble de la flotte Taxi-Alica',
      ja: 'Taxi-Alica 保有車両フリート全景',
    },
    subtitle: {
      de: 'Unsere modernen Limousinen und Großraumtaxis einsatzbereit in Freiburg',
      en: 'Our modern sedans and large vans ready for dispatch in Freiburg',
      zh: '整装待发的现代豪华轿车与多功能大容量出租车',
      ar: 'سيارات الليموزين وسيارات الأجرة الكبيرة جاهزة في فرايبورغ',
      es: 'Nuestras berlinas y monovolúmenes listos para el servicio en Friburgo',
      fr: 'Nos berlines et grands taxis prêts pour vos déplacements à Fribourg',
      ja: 'フライブルク市内外へいつでも出動可能な最新セダンおよびジャンボタクシー',
    },
    aspectRatio: '4 / 3',
  },
  {
    id: 'bus_innen',
    file: '/cars/bus_innen.jpg',
    title: {
      de: 'Großraum-Interieur Mercedes Vito',
      en: 'Mercedes Vito Spacious Passenger Cabin',
      zh: '奔驰Vito宽敞豪华内饰空间',
      ar: 'المقصورة الداخلية الفسيحة لمرسيدس فيتو',
      es: 'Interior Espacioso del Mercedes Vito',
      fr: 'Intérieur Spacieux du Mercedes Vito',
      ja: 'メルセデスVito 広々とした客室インテリア',
    },
    subtitle: {
      de: 'Großzügiger Fahrgastraum mit bis zu 8 bequemen Einzelsitzplätzen und viel Beinfreiheit',
      en: 'Spacious passenger cabin with up to 8 comfortable individual seats and generous legroom',
      zh: '宽敞乘员舱，配备最多8个舒适独立座椅与充裕腿部空间',
      ar: 'مقصورة ركاب رحبة تتسع لـ 8 مقاعد مريحة ومساحة واسعة للأرجل',
      es: 'Habitáculo espacioso con hasta 8 cómodas plazas individuales y gran espacio para las piernas',
      fr: 'Habitacle spacieux avec jusqu’à 8 sièges individuels confortables et large espace aux jambes',
      ja: '最大8名様まで快適にお座りいただける足元ゆったり設計のキャビン',
    },
    aspectRatio: '16 / 7',
  },
  {
    id: 'bus_tuer',
    file: '/cars/bus_tuer.jpg',
    title: {
      de: 'Komfortabler & barrierearmer Einstieg',
      en: 'Comfortable & Easy Passenger Boarding',
      zh: '便捷低门槛宽大侧滑门入口',
      ar: 'صعود مريح وسهل للركاب',
      es: 'Acceso Cómodo y Accesible',
      fr: 'Accès Confortable et Facile',
      ja: '乗り降りしやすい快適スライドドア',
    },
    subtitle: {
      de: 'Große Schiebetür und niedrige Trittstufe erleichtern das Einsteigen auch mit Gepäck',
      en: 'Wide sliding door and low step height facilitate boarding even with luggage',
      zh: '宽幅侧滑门配合适中地台，携行李或行动不便时上下车格外轻松',
      ar: 'باب منزلق واسع وعتبة منخفضة لتسهيل الركوب مع الحقائب',
      es: 'La puerta corredera ancha y el escalón bajo facilitan el acceso con equipaje',
      fr: 'La large porte coulissante et le marchepied bas facilitent l’accès avec des bagages',
      ja: '手荷物をお持ちの際やご年配の方も安心して乗り降りできるワイド設計',
    },
    aspectRatio: '4 / 3',
  },
];

export function getCarById(id: string): FleetCar | undefined {
  return FLEET_CARS.find((c) => c.id === id);
}
