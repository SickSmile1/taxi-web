import { notoArabic, notoJP, spectral } from '@/lib/fonts';
import { isRtl, LANGS, type Lang } from '@/lib/translations';

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const rtl = isRtl(lang as Lang);
  const fontClasses = [
    spectral.variable,
    lang === 'ar' ? notoArabic.variable : '',
    lang === 'ja' ? notoJP.variable : '',
  ]
    .filter(Boolean)
    .join(' ');
  return (
    <div
      lang={lang}
      dir={rtl ? 'rtl' : 'ltr'}
      className={fontClasses}
      style={{ minHeight: '100vh' }}
    >
      {children}
    </div>
  );
}
