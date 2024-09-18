/* eslint-disable @next/next/no-img-element */
import { useTranslation } from '~/context/LanguageContext'
import * as ga from '../../../ga'
import * as fbq from '../../../fbq'
import * as fba from '../../../fba'

import styles from './mpay.module.scss'
import { InsuranceType, ItemName } from '../types/insurance'

export interface MPayProps {
  orderId: string
  priceEUR: number
  insuranceType: InsuranceType
  companyName: string
}

export const MPay = ({ orderId, priceEUR, insuranceType, companyName }: MPayProps): JSX.Element => {
  const { translate } = useTranslation()

  const handleBeginCheckout = () => {
    ga.beginCheckout(priceEUR, orderId, ItemName[insuranceType], companyName)
    fbq.beginCheckout(priceEUR, orderId, ItemName[insuranceType], companyName)
    fba.beginCheckout(priceEUR, orderId, ItemName[insuranceType], companyName)
  }

  return (
    <div>
      <form
        className={styles.form}
        id="mPay"
        action={process.env.NEXT_PUBLIC_MPAY_URL}
        method="POST"
        target="_blank"
      >
        <input
          type="hidden"
          id="ServiceID"
          name="ServiceID"
          value={process.env.NEXT_PUBLIC_MPAY_SERVICE_ID}
        />
        <input type="hidden" id="OrderKey" name="OrderKey" value={orderId} />
        <input
          type="hidden"
          id="ReturnUrl"
          name="ReturnUrl"
          value={`${process.env.NEXT_PUBLIC_REDIRECT_URL}${orderId}`}
        />
      </form>

      <button
        className={`${styles.mpayCard} mb-2 text-left sm:py-6 sm:px-4 py-3 px-2 sm:h-16 h-14`}
        type="submit"
        form="mPay"
        value="Submit"
        onClick={() => handleBeginCheckout()}
      >
        <img src="/images/mpay.svg" alt="mpay" width={50} height={20} className="object-contain" />
        <span className="sm:ml-7 ml-2 font-medium sm:text-sm text-xs text-black-lightest">
          {translate('mpay:label')}
        </span>
        <span className="ml-auto">
          <img src="/images/arrow.svg" alt="arrow" width={9} height={7} />
        </span>
      </button>
    </div>
  )
}
