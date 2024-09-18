/* eslint-disable @typescript-eslint/ban-types */
import React, { useCallback, useContext } from 'react'
import { translations } from '../translations/locales'
import { Locale } from '../translations/types'

type TranslationPath =
  | keyof typeof translations.ro.common
  | keyof typeof translations.ro.contact
  | keyof typeof translations.ro.home
  | keyof typeof translations.ro.notFound
  | keyof typeof translations.ro.payment
  | keyof typeof translations.ro.greenCard

interface ContextProps {
  pageKey: string
  locale: Locale
  translate: (
    key: TranslationPath | (string & {}),
    path?: keyof typeof translations.ro | (string & {}),
    language?: 'ru' | 'ro' | 'en'
  ) => string
}

export const LanguageContext = React.createContext<ContextProps>({
  locale: 'ro',
  translate: () => '',
  pageKey: '',
})

export const LanguageProvider: React.FC<ContextProps> = ({ locale, children, pageKey }) => {
  const translate = useCallback(
    (
      key: TranslationPath | (string & {}),
      path: keyof typeof translations.ro | (string & {}) = 'common',
      language: 'ru' | 'ro' | 'en' = locale
    ): string => {
      return translations[language || locale]?.[path]?.[key] || key
    },
    [locale]
  )

  return (
    <LanguageContext.Provider
      value={{
        locale,
        translate,
        pageKey,
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

export const useTranslation = (): ContextProps => useContext(LanguageContext)
