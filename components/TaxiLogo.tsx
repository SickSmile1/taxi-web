import Image from 'next/image';
import { p } from '@/lib/base-path';

const ASPECT = 582 / 285;

interface TaxiLogoProps {
  width?: number;
}

export default function TaxiLogo({ width = 100 }: TaxiLogoProps) {
  return (
    <Image
      src={p('/logo_low_res.png')}
      alt="Taxi-Alica Freiburg"
      width={width}
      height={Math.round(width / ASPECT)}
      style={{ display: 'block', height: 'auto' }}
    />
  );
}
