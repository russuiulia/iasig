/* eslint-disable @next/next/no-img-element */
import Link from 'next/link'

import { useTranslation } from '~/context/LanguageContext'

export const Logo = (): JSX.Element => {
  const { locale } = useTranslation()
  return (
    <Link href={locale === 'ro' ? '/' : `/${locale}/`}>
      <a aria-label="logo">
        <img src="/images/dark-logo.svg" alt="logo" width={125} height={40} />
      </a>
    </Link>
  )
}
