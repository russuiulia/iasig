/* eslint-disable @next/next/no-img-element */
import { useTranslation } from '~/context/LanguageContext'

import styles from './roadTax.module.scss'
import { CopyToClipboardButton } from '~/components/copyToClipboardButton/copyToClipboardButton'

export const RoadTax = ({ price, vinCode }: { price: number; vinCode: string }): JSX.Element => {
  const { translate } = useTranslation()

  return (
    <div>
      <a
        target="_blank"
        rel="noreferrer"
        className={`${styles.card} text-left color mt-5 sm:py-6 sm:px-4 py-3 px-2 sm:h-16 h-14 sm:justify-normal justify-between`}
        href="https://mpay.gov.md/Services/Service/TFD01"
      >
        <img
          src="/images/roadTax.png"
          alt="road-tax-icon"
          width={30}
          height={30}
          className="object-cover"
        />
        <span className="sm:ml-4 ml-2 font-medium sm:text-sm text-xs text-black-lightest">
          {translate('button:roadTax')}
        </span>
        <div className="ml-auto flex items-center">
          <span className="font-bold sm:text-sm text-xs text-black-lightest">
            {price.toFixed(2)} MDL
          </span>
          <span className="ml-2">
            <img src="/images/arrow.svg" alt="arrow" width={9} height={7} />
          </span>
        </div>
      </a>
      <div className="flex items-center justify-between font-medium sm:text-sm text-xs text-black-lightest pl-2.5 pr-1 border border-gray-lightest border-t-0 rounded-b py-4">
        <span>{translate('vinCode')}:</span>
        <CopyToClipboardButton textToCopy={vinCode} />
      </div>
    </div>
  )
}
