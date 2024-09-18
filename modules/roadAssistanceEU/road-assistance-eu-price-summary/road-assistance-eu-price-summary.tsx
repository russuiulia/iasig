import { useTranslation } from '~/context/LanguageContext'
import { PriceSummaryLoader } from '~/modules/shared/summaryLoader/price-loader'

type Details = {
  certificateNumber: string
  carModel: string
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
  return details.certificateNumber ? (
    <div className="bg-gray-lightest rounded-2xl mb-8 text-left px-6 py-5 text-sm">
      <div>
        <div>
          {details?.carModel && (
            <div className="md:flex md:justify-between md:align-center">
              <p className="text-gray">{translate('vehicle')}:</p>
              <p className="text-black-lightest md:text-right" translate="no">
                {details?.carModel} {details?.plateNumber}
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
