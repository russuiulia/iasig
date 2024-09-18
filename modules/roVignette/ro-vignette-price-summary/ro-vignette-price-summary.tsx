import { useTranslation } from '~/context/LanguageContext'
import { AdditionalProduct } from '~/modules/shared/addons'
import { PriceSummaryLoader } from '~/modules/shared/summaryLoader/price-loader'

type Details = {
  offers: AdditionalProduct[]
  certificateNumber: string
  plateNumber: string
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
  return details.offers?.length && (details.certificateNumber || details.plateNumber) ? (
    <div className="bg-gray-lightest rounded-2xl mb-8 text-left px-6 py-5 text-sm">
      <div>
        <div>
          {details?.offers?.[0]?.carModel && (
            <div className="md:flex md:justify-between md:align-center">
              <p className="text-gray">{translate('vehicle')}:</p>
              <p className="text-black-lightest md:text-right" translate="no">
                {details?.offers?.[0]?.carModel} {details?.offers?.[0]?.carPlateNumber}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  ) : (
    <p className="text-danger">{translate('price-required-error')}</p>
  )
}
