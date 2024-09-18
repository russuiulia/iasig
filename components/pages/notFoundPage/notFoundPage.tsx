/* eslint-disable @next/next/no-img-element */
import Link from 'next/link'
import React from 'react'
import { useTranslation } from '~/context/LanguageContext'

export const NotFoundPage: React.FC = () => {
  const { locale, translate } = useTranslation()

  return (
    <>
      <div className="container text-center pb-5">
        <div className="flex flex-col h-full py-20 justify-center align-center">
          <img src="/images/emoji.svg" alt="emoji" width={96} height={97} className="mx-auto" />
          <p className="text-9xl my-6 text-center font-bold text-gray-200">404</p>
          <h2 className="mb-6 text-center">{translate('not-found-page', 'notFound')}</h2>
          <div className="mt-3 flex justify-center">
            <Link href={locale === 'ro' ? '/' : `/${locale}`}>
              <a className="btn inline-flex justify-center rounded-full items-center text-white bg-pink rounded-lg focus:shadow-outline hover:opacity-80 py-3 px-8 h-12 sm:w-44 w-full">
                {translate('back-to-home', 'notFound')}
              </a>
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
