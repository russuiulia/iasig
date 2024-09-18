import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export const pathTranslations = {
  '/green-card': { en: '/en/green-card', ru: '/ru/green-card' },
  '/green-card/terms': {
    en: '/en/green-card/terms',
    ru: '/ru/green-card/terms',
  },
  '/medical': { en: '/en/travel', ru: '/ru/travel' },
  '/medical-optional': { en: '/en/non-residents', ru: '/ru/non-residents' },
  '/medical/donaris': { en: '/en/travel/donaris', ru: '/ru/travel/donaris' },
  '/medical/general': { en: '/en/travel/general', ru: '/ru/travel/general' },
  '/medical/intact': { en: '/en/travel/intact', ru: '/ru/travel/intact' },
  '/medical/moldcargo': {
    en: '/en/travel/moldcargo',
    ru: '/ru/travel/moldcargo',
  },
  '/medical/transelit': {
    en: '/en/travel/transelit',
    ru: '/ru/travel/transelit',
  },
  '/medical/grawe': { en: '/en/travel/grawe', ru: '/ru/travel/grawe' },
  '/rca': { en: '/en/mtpl', ru: '/ru/osago' },
  '/rca/terms': { en: '/en/mtpl/terms', ru: '/ru/osago/terms' },
  '/ipoteca': { en: '/en/mortgage', ru: '/ru/mortgage' },
  '/': { en: '/en', ru: '/ru' },
  '/blog/ce-faci-in-caz-de-accident': {
    en: '/en/blog/what-do-you-do-in-case-of-an-accident',
    ru: '/ru/blog/chto-vy-delayete-v-sluchaye-avarii',
  },
  '/blog/ce-este-si-cum-functioneaza-asigurarea-carte-verde': {
    en: '/en/blog/what-is-and-how-the-green-card-insurance-works',
    ru: '/ru/blog/chto-takoye-i-kak-rabotayet-strakhovaniye-zelenoy-karty',
  },
  '/blog/cat-costa-o-asigurare-rca-si-cum-se-calculeaza-pretul': {
    en: '/en/blog/how-much-a-mtpl-costs-and-how-to-calculate-the-price',
    ru: '/ru/blog/skolko-osago-stoit-i-kak-rasschitat-tsenu',
  },
  '/blog': { en: '/en/blog', ru: '/ru/blog' },
  '/rovinieta': { en: '/en/rovignette', ru: '/ru/rovinyetka' },
  '/terms-of-services': {
    en: '/en/terms-of-services',
    ru: '/ru/terms-of-services',
  },
};

export const TranslatedLink = ({ locale, children, pageKey }) => {
  const asPath = usePathname();
  const pathname = asPath.replace('/ru', '').replace('/en', '');
  const unTranslatedLink =
    locale === 'ro' ? pathname || '/' : `/${locale}${pathname}`;
  const translatedLink = pathTranslations?.[pageKey]?.[locale] || pageKey;
  return (
    <Link href={translatedLink || unTranslatedLink} legacyBehavior>
      {children}
    </Link>
  );
};
