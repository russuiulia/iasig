import React, { useMemo } from 'react'

import { TranslatedLink } from '~/components/translatedLink/translatedLink'
import { useTranslation } from '~/context/LanguageContext'
import { MedicalPreOrderInsurance } from '~/modules/medical/types'
import { InsuranceType } from '~/modules/shared/types/insurance'
import { IsgOrder } from '~/services/interfaces/order'

export interface IsgDisclaimerProps {
  order: IsgOrder<any>
}

export const IsgDisclaimer = ({ order }: IsgDisclaimerProps): JSX.Element => {
  const { locale, translate } = useTranslation()

  const getLink = (): string => {
    if ([InsuranceType.RCA, InsuranceType.GREEN_CARD].includes(order.insuranceType)) {
      return `/${order.insuranceType}/terms`
    } else if (order.insuranceType === InsuranceType.MEDICAL) {
      const details = order.details as MedicalPreOrderInsurance
      return `/${order.insuranceType}/${details?.companyName?.toLowerCase()}`
    } else {
      return `/terms-of-services`
    }
  }

  const link = useMemo(() => getLink(), [order])

  return (
    <>
      <div className="flex text-left mt-4">
        <label
          className="flex w-full focus:border-gray-200 border-gray-200 mt-4 font-normal"
          htmlFor="agreeTermsCheckbox"
        >
          <span className="text-xs text-gray">
            {translate('disclaimer1')}{' '}
            <TranslatedLink pageKey={link} locale={locale}>
              <a target="_blank" className={`text-pink hover:opacity-80`}>
                {translate('insurance-conditions')}
              </a>
            </TranslatedLink>
            ,{' '}
            <TranslatedLink pageKey="/terms-of-services" locale={locale}>
              <a
                target="_blank"
                className={`text-pink hover:opacity-80 ${locale !== 'en' ? 'hidden' : ''}`}
              >
                iasig.md{' '}
              </a>
            </TranslatedLink>
            {translate('disclaimer2')}
            <TranslatedLink pageKey="/terms-of-services" locale={locale}>
              <a
                target="_blank"
                className={`text-pink hover:opacity-80 ${locale === 'en' ? 'hidden' : ''}`}
              >
                iasig.md
              </a>
            </TranslatedLink>
            {translate('disclaimer3')}
          </span>
        </label>
      </div>
    </>
  )
}
