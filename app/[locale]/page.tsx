import { Spacer } from '@nextui-org/spacer';

import { Hero } from '@/components/marketing/hero';
import { FeaturesGrid } from '@/components/marketing/features-grid';
import { CustomThemes } from '@/components/marketing/custom-themes';
import { A11yOtb } from '@/components/marketing/a11y-otb';
import { DarkMode } from '@/components/marketing/dark-mode';
import { Customization } from '@/components/marketing/customization';
import { LastButNotLeast } from '@/components/marketing/last-but-not-least';
import { InstallBanner } from '@/components/marketing/install-banner';
import { Community } from '@/components/marketing/community';
import landingContent from '@/content/landing';
import { Sponsors } from '@/components/marketing/sponsors';
import { I18nProviderClient, useCurrentLocale } from '../../locales/client';
import { client } from '@/sanity/client';

export default async function Home({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const query = `*[_type == "hero" && language == "${locale}"]{
    title,subtitle,paragraph,buttonText
  }`;
  const heroData = await client.fetch(query);

  return (
    <I18nProviderClient locale={locale}>
      <main className="container mx-auto max-w-7xl px-6 flex-grow">
        <section className="flex flex-col items-center justify-center">
          <Hero locale={locale} />
          <FeaturesGrid features={landingContent.topFeatures} />
          <Sponsors />
          <CustomThemes />
          <A11yOtb />
          <DarkMode />
          <Customization />
          <LastButNotLeast />
          <Spacer y={24} />
          <InstallBanner />
          <Community />
          <Spacer y={24} />
        </section>
      </main>
    </I18nProviderClient>
  );
}
