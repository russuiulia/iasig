import React from 'react'
import { useTranslation } from '~/context/LanguageContext'
import { PriceSummaryLoader } from '~/modules/shared/summaryLoader/price-loader'
import { InsuredValuesType } from '../real-estate-form/real-estate-form.constants'

type Details = {
  price: number
  cadastralCode: string
  address: string
  realEstateType: string
  insuredValue: string
  replacementCost: string
  marketValue: string
}
export type PriceSummaryProps = {
  details: Details
  isLoading: boolean
}
export const PriceSummary = ({ details, isLoading }: PriceSummaryProps): JSX.Element => {
  return isLoading ? <PriceSummaryLoader /> : <Summary {...details} />
}

const Summary = ({ ...details }: Details): JSX.Element => {
  const { translate } = useTranslation()

  return (
    <div className="bg-gray-lightest rounded-2xl	mb-8 text-left px-6 py-5 text-sm">
      <div>
        <div>
          {details?.realEstateType && (
            <div className="mb-2 md:flex md:justify-between md:align-center">
              <p className="text-gray">{translate('realEstateType')}:</p>
              <p className="text-black-lightest md:text-right" translate="no">
                {translate(details?.realEstateType)}
              </p>
            </div>
          )}
          {details?.insuredValue && (
            <div className="mb-2 md:flex md:justify-between md:align-center">
              <p className="text-gray">{translate(`insuredValue:${details.insuredValue}`)}:</p>
              <p className="text-black-lightest md:text-right" translate="no">
                {`${(details.insuredValue === InsuredValuesType.MARKET_VALUE
                  ? details.marketValue
                  : details.replacementCost
                )
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} MDL`}
              </p>
            </div>
          )}
          {details.address && (
            <div className="mb-2 md:flex md:justify-between md:align-center">
              <p className="text-gray">{translate('address')}:</p>
              <p className="text-black-lightest md:text-right" translate="no">
                {details.address}
              </p>
            </div>
          )}
        </div>
        <div className="pt-4 border-t border-gray-200">
          <div className="flex justify-between">
            <p className="text-gray">{translate('total')}</p>
            <div className="flex items-end">
              <p className="font-bold text-black-lightest mr-1">
                {details?.price?.toFixed?.(2)} MDL{' '}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
