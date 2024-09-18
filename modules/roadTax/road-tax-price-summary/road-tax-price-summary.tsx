import { useTranslation } from '~/context/LanguageContext'
import { PriceSummaryLoader } from '~/modules/shared/summaryLoader/price-loader'
import { ContractorType } from '~/modules/shared/types/insurance'

type Details = {
  price: number
  carModel: string
  certificateNumber: string
  plateNumber: string
  contractorType: ContractorType
  fullName: string
}

export type PriceSummaryProps = {
  details: Details
  isLoading: boolean
}

export const PriceSummary = ({ details, isLoading }: PriceSummaryProps): JSX.Element => {
  return isLoading ? <PriceSummaryLoader /> : <Summary {...details} />
}

const Summary = ({
  price,
  carModel,
  plateNumber,
  contractorType,
  certificateNumber,
  fullName,
}: Details): JSX.Element => {
  const { translate } = useTranslation()

  return price && certificateNumber ? (
    <div className="bg-gray-lightest rounded-2xl text-left px-6 py-5 text-sm my-10">
      <div>
        <div>
          {contractorType === ContractorType.COMPANY && fullName && (
            <div className="mb-2 md:flex md:justify-between md:align-center">
              <p className="text-gray">{translate('Plătitor')}:</p>
              <p className="text-black-lightest md:text-right" translate="no">
                {fullName}
              </p>
            </div>
          )}

          {carModel && (
            <div className="mb-2 md:flex md:justify-between md:align-center">
              <p className="text-gray">{translate('vehicle')}:</p>
              <p className="text-black-lightest md:text-right" translate="no">
                {carModel} {plateNumber}
              </p>
            </div>
          )}
          <div className="pt-4 border-t border-gray-200">
            <div className="flex justify-between">
              <p className="text-gray">{translate('total')}</p>
              <div className="flex items-end">
                <p className="font-bold text-black-lightest mr-1">{price.toFixed(2)} MDL</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <p className="text-danger">{translate('price-required-error')}</p>
  )
}
