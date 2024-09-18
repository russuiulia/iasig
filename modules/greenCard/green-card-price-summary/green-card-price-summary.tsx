import { isValid } from 'date-fns'
import format from 'date-fns/format'
import { useTranslation } from '~/context/LanguageContext'
import { PriceSummaryLoader } from '~/modules/shared/summaryLoader/price-loader'
import { ContractorType } from '~/modules/shared/types/insurance'

type Details = {
  price: number
  priceEUR: number
  startDate: Date
  endDate: Date
  carModel: string
  towingModel: string
  towingPlateNumber: string
  plateNumber: string
  insuranceValidity: string
  certificateNumber: string
  contractorName?: string
  contractorType?: ContractorType
  isTrailer: boolean | undefined
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
  return !!(details.price && details.certificateNumber) || details.isTrailer ? (
    <div className="bg-gray-lightest rounded-2xl	mb-8 text-left px-6 py-5 text-sm">
      <div>
        <div>
          {details.contractorType === ContractorType.COMPANY && details.contractorName && (
            <div className="mb-2 md:flex md:justify-between md:align-center">
              <p className="text-gray">{translate('insured')}:</p>
              <p className="text-black-lightest md:text-right" translate="no">
                {details.contractorName}
              </p>
            </div>
          )}

          {details.carModel && (
            <div className="mb-2 md:flex md:justify-between md:align-center">
              <p className="text-gray">
                {details.isTrailer ? translate('trailer') : translate('vehicle')}:
              </p>
              <p className="text-black-lightest md:text-right" translate="no">
                {details.carModel} {details.plateNumber}
              </p>
            </div>
          )}

          {details.towingModel && (
            <div className="mb-2 md:flex md:justify-between md:align-center">
              <p className="text-gray">{translate('vehicle')}:</p>
              <p className="text-black-lightest md:text-right" translate="no">
                {details.towingModel} {details.towingPlateNumber}
              </p>
            </div>
          )}
          {details?.startDate &&
            isValid(details?.startDate) &&
            details?.startDate &&
            isValid(details?.endDate) && (
              <div className="md:flex md:justify-between md:align-center">
                <p className="text-gray">{translate('period')}:</p>
                <p className="text-black-lightest md:text-right">
                  {`${format(details.startDate, 'dd.MM.yyyy')} - ${format(
                    details.endDate,
                    'dd.MM.yyyy'
                  )} (${translate(`validity:${details.insuranceValidity}`)})`}
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
