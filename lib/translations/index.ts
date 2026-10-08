import { ar } from './ar';
import { de } from './de';
import { en } from './en';
import { es } from './es';
import { fr } from './fr';
import { ja } from './ja';
import { zh } from './zh';

export type Lang = 'de' | 'en' | 'zh' | 'ar' | 'es' | 'fr' | 'ja';

export const LANGS: readonly Lang[] = [
  'de',
  'en',
  'zh',
  'ar',
  'es',
  'fr',
  'ja',
];

const RTL_LANGS: readonly Lang[] = ['ar'];

export const isRtl = (lang: Lang): boolean => RTL_LANGS.includes(lang);

export interface Translations {
  nav0: string;
  nav1: string;
  nav2: string;
  nav3: string;
  heroEyebrow: string;
  heroTitle: string;
  heroDescription: string;
  heroSub: string;
  heroCtaCallback: string;
  heroCtaCall: string;
  heroT1: string;
  heroT2: string;
  heroT3: string;
  a_tag: string;
  a_h2: string;
  a_h3a: string;
  a_h3b: string;
  a_warnTitle: string;
  a_warnBody: string;
  a_billBody: string;
  a_listTitle: string;
  a_list: string[];
  a_cta: string;
  a_note: string;
  b_tag: string;
  b_h2: string;
  b_intro: string;
  b_colStandard: string;
  b_colLarge: string;
  b_disclaimer: string;
  airportNotes: string[];
  c_tag: string;
  c_h2: string;
  c_body: string;
  c_tariff: string;
  c_cta: string;
  k_tag: string;
  k_h2: string;
  k_sub: string;
  k_phone: string;
  k_email: string;
  k_concern: string;
  k_concernOpts: string[];
  k_message: string;
  k_messagePh: string;
  k_from: string;
  k_to: string;
  k_date: string;
  k_depart: string;
  k_departOpts: string[];
  k_submit: string;
  k_privacy: string;
  k_either: string;
  k_success: string;
  f_tagline: string;
  f_servicesTitle: string;
  f_legalTitle: string;
  f_impressum: string;
  f_datenschutz: string;
  f_agb: string;
  f_rights: string;
  f_placeholder: string;
  f_vehNote: string;
  sticky: string;
  // Destination page keys
  dest_price_header: string;
  dest_distance_from: string;
  dest_price_note: string;
  dest_why_title: string;
  dest_usps: string[];
  dest_cta_call: string;
  dest_cta_callback: string;
  dest_back: string;
  dest_h1_to_airport: string;
  dest_h1_to_landmark: string;
  // Pricing UI (Stadtfahrten)
  p_title: string;
  p_from: string;
  p_to: string;
  p_distance: string;
  p_base_fare: string;
  p_per_km: string;
  p_night_surcharge: string;
  p_weekend_surcharge: string;
  p_airport_surcharge: string;
  p_total: string;
  p_day_tariff: string;
  p_night_tariff: string;
  p_select_from: string;
  p_select_to: string;
  p_estimate: string;
  p_km: string;
  p_min: string;
  // Service page meta
  meta_kranken_title: string;
  meta_kranken_desc: string;
  meta_flug_title: string;
  meta_flug_desc: string;
  meta_stadt_title: string;
  meta_stadt_desc: string;
  meta_kontakt_title: string;
  meta_kontakt_desc: string;
  meta_datenschutz_title: string;
  meta_datenschutz_desc: string;
  meta_impressum_title: string;
  meta_impressum_desc: string;
  meta_interactive_title: string;
  meta_interactive_desc: string;
  // Hero preview cards
  hero_preview_kranken: string;
  hero_preview_flug: string;
  hero_preview_stadt: string;
  hero_learn_more: string;
  navInteractive: string;
  navService: string;
  navAbout: string;
  // Contact form labels & messages
  nameLabel: string;
  namePlaceholder: string;
  passengerCountLabel: string;
  nameError: string;
  phoneError: string;
  emailError: string;
  privacyError: string;
  k_selectPlaceholder: string;
  k_sending: string;
  k_mailtoSubject: string;
  k_mailtoName: string;
  k_mailtoPhone: string;
  k_mailtoEmail: string;
  k_mailtoConcern: string;
  k_mailtoPickup: string;
  k_mailtoDestination: string;
  k_mailtoTime: string;
  k_mailtoPassengers: string;
  k_mailtoNotes: string;
  k_mailtoSentFrom: string;

  // Menu
  menuOpen: string;
  menuClose: string;
  navigationMenu: string;

  // RouteCalculator
  enterStreet: string;
  calculating: string;
  calculatePrice: string;
  priceOverview: string;
  baseFare: string;
  priceDisclaimer: string;

  // MapIsland
  airportsLabel: string;
  backToFreiburg: string;
  clickRouteTooltip: string;

  // PageClient
  districtsLabel: string;
  suburbsLabel: string;

  // Stadtteil pages
  mapLink: string;
  bookNow: string;
  bookDescription: string;

  // Footer
  districtsToggle: string;

  // Error boundary
  errorTitle: string;
  errorDescription: string;
  errorRetry: string;

  // Not found
  notFoundTitle: string;
  notFoundDescription: string;
  notFoundBack: string;

  // Theme toggle
  themeToggleLight: string;
  themeToggleDark: string;

  // PageClient aria labels
  ariaDistricts: string;
  ariaSuburbs: string;

  // About Us section
  aboutTag: string;
  aboutTitle: string;
  aboutIntro: string;
  aboutHistory: string;
  aboutPhilosophyTitle: string;
  aboutPhilosophyQuote: string;

  // Fuhrpark (Company Cars) section
  navCars: string;
  meta_fuhrpark_title: string;
  meta_fuhrpark_desc: string;
  fuhrpark_tag: string;
  fuhrpark_h2: string;
  fuhrpark_sub: string;
  fuhrpark_tab_360: string;
  fuhrpark_tab_cardinal: string;
  fuhrpark_tab_gallery: string;
  fuhrpark_autospin: string;
  fuhrpark_pause: string;
  fuhrpark_front: string;
  fuhrpark_hint: string;
  fuhrpark_specs_title: string;
  fuhrpark_seats: string;
  fuhrpark_luggage: string;
  fuhrpark_features: string;
  fuhrpark_usecases: string;
  fuhrpark_overview_title: string;
  fuhrpark_overview_sub: string;
}

const ALL: Record<Lang, Translations> = { de, en, zh, ar, es, fr, ja };

export function getTranslation(lang: Lang): Translations {
  return ALL[lang] || ALL.de;
}
