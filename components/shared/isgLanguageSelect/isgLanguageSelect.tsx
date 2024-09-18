import { TranslatedLink } from '~/components/translatedLink/translatedLink'
import { useTranslation } from '~/context/LanguageContext'

export interface IsgLanguageSelectProps {
  setOpen?: (open: boolean) => void
  open?: boolean
  customStyle?: any
}

export const IsgLanguageSelect = (props): JSX.Element => {
  const { pageKey, translate } = useTranslation()

  return (
    <>
      <li>
        <TranslatedLink key="ro" locale="ro" pageKey={pageKey}>
          <a
            onClick={() => props?.setOpen?.(!open)}
            onKeyDown={() => props?.setOpen?.(!open)}
            role="button"
            tabIndex={-1}
            className={`font-medium focus:outline-none py-1 focus:opacity-80 hover:opacity-50 ${
              props?.customStyle || ''
            }`}
          >
            {translate(`language:ro`)}
          </a>
        </TranslatedLink>
      </li>
      <li>
        <TranslatedLink key="ru" locale="ru" pageKey={pageKey}>
          <a
            onClick={() => props?.setOpen?.(!open)}
            onKeyDown={() => props?.setOpen?.(!open)}
            role="button"
            tabIndex={-1}
            className={`font-medium focus:outline-none py-1 focus:opacity-80 hover:opacity-50 ${
              props?.customStyle || ''
            }`}
          >
            {translate(`language:ru`)}
          </a>
        </TranslatedLink>
      </li>
      <li>
        <TranslatedLink key="en" locale="en" pageKey={pageKey}>
          <a
            onClick={() => props?.setOpen?.(!open)}
            onKeyDown={() => props?.setOpen?.(!open)}
            role="button"
            tabIndex={-1}
            className={`font-medium focus:outline-none py-1 focus:opacity-80 hover:opacity-50 ${
              props?.customStyle || ''
            }`}
          >
            {translate(`language:en`)}
          </a>
        </TranslatedLink>
      </li>
    </>
  )
}
