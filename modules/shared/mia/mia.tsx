/* eslint-disable @next/next/no-img-element */
import styles from './mia.module.scss'
import { useTranslation } from '~/context/LanguageContext'

export const Mia = (): JSX.Element => {
  const { translate } = useTranslation()

  const handleBeginCheckout = () => {}

  return (
    <a
      rel="noreferrer"
      className={`${styles.linkCard} text-left color sm:py-6 sm:px-4 py-3 px-2 sm:h-16 h-14 pointer-events-none`}
      href="#"
      onClick={() => handleBeginCheckout()}
    >
      <img
        src="/images/mia-instant-payments-logo.svg"
        alt="visa-master-card"
        width={50}
        height={20}
        className="object-cover"
      />
      <span className="sm:ml-7 ml-2 font-medium sm:text-sm text-xs text-black-lightest">
        {translate('button:mia-text')}
      </span>
      <span className="ml-auto">
        <img src="/images/arrow.svg" alt="arrow" width={9} height={7} />
      </span>
    </a>
  )
}
