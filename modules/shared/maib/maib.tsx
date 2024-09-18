/* eslint-disable @next/next/no-img-element */
import * as fba from '../../../fba'
import * as fbq from '../../../fbq'
import * as ga from '../../../ga'
import { InsuranceType, ItemName } from '../types/insurance'
import styles from './maib.module.scss'
import { useTranslation } from '~/context/LanguageContext'

export interface MaibProps {
  orderId: string
  priceEUR: number
  insuranceType: InsuranceType
  companyName: string
}

export const Maib = ({ orderId, priceEUR, insuranceType, companyName }: MaibProps): JSX.Element => {
  const { locale, translate } = useTranslation()

  const handleBeginCheckout = () => {
    ga.beginCheckout(priceEUR, orderId, ItemName[insuranceType], companyName)
    fbq.beginCheckout(priceEUR, orderId, ItemName[insuranceType], companyName)
    fba.beginCheckout(priceEUR, orderId, ItemName[insuranceType], companyName)
  }

  return (
    <a
      target="_blank"
      rel="noreferrer"
      className={`${styles.linkCard} text-left color mt-4 sm:py-6 sm:px-4 py-3 px-2 sm:h-16 h-14`}
      href={`${process.env.NEXT_PUBLIC_HOST_FUNCTION}/maibData?language=${
        locale || 'ro'
      }&orderId=${orderId}&insuranceType=${insuranceType}`}
      onClick={() => handleBeginCheckout()}
    >
      <img
        src="/images/visaMastercard.svg"
        alt="visa-master-card"
        width={50}
        height={20}
        className="object-cover"
      />
      <span className="sm:ml-7 ml-2 font-medium sm:text-sm text-xs text-black-lightest">
        {translate('button:credit-card-text')}
      </span>
      <span className="ml-auto">
        <img src="/images/arrow.svg" alt="arrow" width={9} height={7} />
      </span>
    </a>
  )
}
