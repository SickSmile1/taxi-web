export const DOMAIN = 'taxi-alica.de';
export const SITE_URL = 'https://taxi-alica.de';
export const PHONE_TEL = '+4976115537668';
export const PHONE_DISPLAY = '0761 15 53 76 68';
export const ADDRESS_STREET = 'Bötzinger Str. 66';
export const ADDRESS_ZIP = '79111';
export const ADDRESS_CITY = 'Freiburg im Breisgau';
export const ADDRESS_DISTRICT = 'St. Georgen';
export const ADDRESS_FULL =
  'Bötzinger Str. 66, 79111 Freiburg im Breisgau-St. Georgen';
export const GOLD = '#E6B032';
export const DIM = '#9A9A9A';

export const FONT_FAMILY =
  "var(--font-arabic, var(--font-jp, 'Helvetica Neue')), Helvetica, Arial, 'Noto Sans SC', sans-serif";

export const CheckIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24">
    <path
      d="M5 13l4 4L19 7"
      stroke={GOLD}
      strokeWidth="2.4"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const PhoneIcon = ({
  color = '#1A1A1A',
  size = 16,
}: {
  color?: string;
  size?: number;
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path
      d="M6.6 10.8c1.4 2.8 3.8 5.2 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.4c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.6.1.4 0 .8-.3 1z"
      fill={color}
    />
  </svg>
);
