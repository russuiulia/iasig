// 'use client';
import NextLink from 'next/link';
import { Button } from '@nextui-org/react';
import dynamic from 'next/dynamic';

import { FloatingComponents } from './floating-components';

import { title, subtitle } from '@/components/primitives';

const BgLooper = dynamic(
  () => import('./bg-looper').then((mod) => mod.BgLooper),
  {
    ssr: false,
  }
);

import { client } from '../../../sanity/client';
import { getCurrentLocale } from '@/locales/server';

interface HeroData {
  title: string;
  subtitle: string;
  paragraph: string;
  buttonText: string;
}

const fetchHeroData = async (locale: string): Promise<HeroData> => {
  const query = `*[_type == "hero" && language == $locale]{
    title, subtitle, paragraph, buttonText
  }`;

  const heroData = await client.fetch(query, { locale });

  return (
    heroData[0] || { title: '', subtitle: '', paragraph: '', buttonText: '' }
  );
};

export const revalidate = 10;

export const Hero = async () => {
  const locale = getCurrentLocale();
  const heroData = await fetchHeroData(locale);

  return (
    <section className="flex relative overflow-hidden lg:overflow-visible w-full flex-nowrap justify-between items-center h-[calc(100vh_-_64px)] 2xl:h-[calc(84vh_-_64px)]">
      <div className="flex relative z-20 flex-col gap-6 w-full lg:w-1/2 xl:mt-10">
        <div className="text-center leading-8 md:leading-10 md:text-left">
          <div>
            <h1 className={title({ size: 'lg' })}>{heroData.title}</h1>
          </div>
          <div className="mt-6 mb-4">
            <h1 className={title({ color: 'violet' })}>{heroData.subtitle}</h1>
          </div>
          <h2
            className={subtitle({
              fullWidth: true,
              class: 'text-center md:text-left',
            })}
          >
            {heroData.paragraph}
          </h2>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-4">
          <Button
            as={NextLink}
            className="w-full md:h-11 md:w-auto"
            color="primary"
            href="/docs/guide/introduction"
            radius="full"
            size="lg"
          >
            {heroData.buttonText}
          </Button>
        </div>
      </div>

      <FloatingComponents />

      <BgLooper />
    </section>
  );
};
