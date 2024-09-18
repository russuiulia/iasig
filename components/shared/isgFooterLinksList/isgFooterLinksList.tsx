import { TranslatedLink } from '~/components/translatedLink/translatedLink'
import { useTranslation } from '~/context/LanguageContext'

export interface ItemsProps {
  items: Item[]
}

interface Item {
  name: string
  disabled?: boolean
  pageKey?: string
}

export const IsgFooterLinksList = ({ items }: ItemsProps): JSX.Element => {
  const { locale, translate } = useTranslation()

  return (
    <ul className="space-y-4">
      {items.map((item: Item) => (
        <li key={item.name}>
          <TranslatedLink locale={locale} pageKey={item.pageKey}>
            <a
              rel="noreferrer"
              className={`text-base ${item.disabled ? 'pointer-events-none' : ''} hover:text-gray`}
            >
              {translate(`footer:${item.name}`)}
            </a>
          </TranslatedLink>
        </li>
      ))}
    </ul>
  )
}
