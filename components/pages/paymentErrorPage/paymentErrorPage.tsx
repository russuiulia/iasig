/* eslint-disable @next/next/no-img-element */
import { NextSeo } from 'next-seo'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import { useTranslation } from '~/context/LanguageContext'

export const PaymentErrorPage: React.FC = () => {
  const { locale, translate } = useTranslation()
  const router = useRouter()
  const lang = locale === 'ro' ? '/' : `/${locale}/`

  return (
    <>
      <NextSeo noindex={true} nofollow={true} />
      <div className="container text-center pb-5">
        <div className="flex flex-col h-full py-20 justify-center align-center">
          <img src="/images/failed.png" alt="emoji" width={129} height={144} className="mx-auto" />
          <h2 className="mb-6 text-center">{translate('init-payment-error')}</h2>
          <div className="mt-3 flex justify-center">
            <Link href={`${lang}order?order=${router.query.order}`} legacyBehavior>
              <a className="btn inline-flex justify-center rounded-full items-center text-white bg-pink rounded-lg focus:shadow-outline hover:opacity-80 py-3 px-8 h-12 sm:w-52 w-full">
                {translate('back-to-order')}
              </a>
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
