import { ReactElement } from 'react'
import { DefaultSeo } from 'next-seo'
import { useTranslation } from '~/context/LanguageContext'

export const IsgDefaultSeo = (): ReactElement => {
  const { locale, translate } = useTranslation()
  return (
    <DefaultSeo
      openGraph={{
        title: translate('meta-title'),
        description: translate('meta-description'),
        type: 'website',
        locale: locale || 'ro',
        url: process.env.NEXT_PUBLIC_HOST,
        site_name: 'iAsig',
        images: [
          {
            url: `${process.env.NEXT_PUBLIC_HOST}iasig.png`,
            width: 150,
            height: 150,
            alt: 'iAsig',
          },
        ],
      }}
      twitter={{
        handle: 'iasigmd',
        site: 'iasigmd',
        cardType: 'summary',
      }}
      facebook={{
        appId: `${process.env.NEXT_PUBLIC_FACEBOOK_APP_ID}`,
      }}
      additionalMetaTags={[
        {
          name: 'docsearch:language',
          content: locale || 'ro',
        },
        {
          name: 'theme-color',
          content: '#ffffff',
        },
        {
          name: 'author',
          content: 'Labs42',
        },
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1',
        },
      ]}
      additionalLinkTags={[
        {
          rel: 'apple-touch-icon',
          href: '/apple-touch-icon.png',
          sizes: '180x180',
        },
        {
          rel: 'icon',
          href: '/favicon-32x32.png',
          sizes: '32x32',
        },
        {
          rel: 'icon',
          href: '/favicon-16x16.png',
          sizes: '16x16',
        },
        {
          rel: 'mask-icon',
          href: '/safari-pinned-tab.svg',
          color: '#5bbad5',
        },
        {
          rel: 'icon',
          href: '/favicon.ico',
        },
      ]}
    />
  )
}
