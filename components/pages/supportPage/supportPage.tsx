import { useTranslation } from '~/context/LanguageContext'
import { COMPANY_PHONE_NUMBER_HOTLINE, COMPANY_PHONE_NUMBER_URL } from '~/constants'
import styles from './supportPage.module.scss'

export const SupportPage = (): JSX.Element => {
  const { translate } = useTranslation()

  return (
    <>
      <div className={styles.supportLabel}>
        {translate('support-details')}{' '}
        <a href={COMPANY_PHONE_NUMBER_URL} aria-label="company-number" className="text-pink">
          {COMPANY_PHONE_NUMBER_HOTLINE}
        </a>
      </div>
    </>
  )
}
