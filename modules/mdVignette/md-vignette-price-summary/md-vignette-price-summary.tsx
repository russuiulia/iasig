import { useTranslation } from '~/context/LanguageContext'
import { PriceSummaryLoader } from '~/modules/shared/summaryLoader/price-loader'

type Details = {
  vehicleType: string
  validity: string
  price: number
  priceEUR: number
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
  return details.price && details.vehicleType ? (
    <div className="bg-gray-lightest rounded-2xl mb-8 text-left px-6 py-5 text-sm">
      <div>
        <div>
          {details.vehicleType && (
            <div className="mb-2 md:flex md:justify-between md:align-center">
              <p className="text-gray">{translate('vehicleType')}:</p>
              <p className="text-black-lightest md:text-right" translate="no">
                {translate(`vehicleType:${details.vehicleType}`)}
              </p>
            </div>
          )}
          {details.validity && (
            <div className="mb-2 md:flex md:justify-between md:align-center">
              <p className="text-gray">{translate('validity')}:</p>
              <p className="text-black-lightest md:text-right" translate="no">
                {`${translate(details.validity.split('_')[0])} ${translate(
                  details.validity.split('_')[1]
                )}`}
              </p>
            </div>
          )}
        </div>
        <div className="pt-4 border-t border-200">
          <div className="flex justify-between">
            <p className="text-gray">{translate('total')}</p>
            <div className="flex items-end">
              <p className="font-bold text-black-lightest mr-1">{details.price.toFixed(2)} MDL</p>
              {'(' + details.priceEUR.toFixed(2) + ' €' + ')'}
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <p className="text-danger">{translate('price-required-error')}</p>
  )
}
