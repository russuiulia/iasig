import { TranslatedLink } from '~/components/translatedLink/translatedLink'
import { useTranslation } from '~/context/LanguageContext'

interface Item {
  name: string
  pageKey: string
}

export interface IsgNavItemsListProps {
  navItems: Item[]
  customStyle?: string
  setOpen?: (open: boolean) => void
  open?: boolean
}

export const IsgNavItemsList = ({
  navItems,
  customStyle = '',
  setOpen,
  open,
}: IsgNavItemsListProps): JSX.Element => {
  const { translate, locale } = useTranslation()

  return (
    <>
      {navItems.map((item: Item) => {
        return (
          <li key={item.name}>
            <TranslatedLink pageKey={item.pageKey} locale={locale}>
              <a
                onClick={() => setOpen?.(!open)}
                onKeyDown={() => setOpen?.(!open)}
                role="button"
                tabIndex={-1}
                className={`focus:outline-none focus:opacity-80 hover:opacity-80 ${customStyle}`}
              >
                {translate(`navbar:${item.name}`)}
              </a>
            </TranslatedLink>
          </li>
        )
      })}
    </>
  )
}
