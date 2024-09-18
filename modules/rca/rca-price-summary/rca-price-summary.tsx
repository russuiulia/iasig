import { format } from 'date-fns'
import { useTranslation } from '~/context/LanguageContext'
import { PriceSummaryLoader } from '~/modules/shared/summaryLoader/price-loader'
import { ContractorType } from '~/modules/shared/types/insurance'
import { normalizeDate } from '~/utils/normalizeDate'

type Details = {
  price: number
  carModel: string
  towingModel: string
  towingPlateNumber: string
  certificateNumber: string
  plateNumber: string
  startDate: Date
  endDate: Date
  contractorName: string
  contractorType: ContractorType
  isTrailer: boolean | undefined
  insuranceValidity: string
}

export type PriceSummaryProps = {
  details: Details
  isLoading: boolean
}

export const RcaPriceSummary = ({ details, isLoading }: PriceSummaryProps): JSX.Element => {
  return isLoading ? <PriceSummaryLoader /> : <Summary {...details} />
}

const Summary = ({
  price,
  carModel,
  plateNumber,
  startDate,
  endDate,
  contractorName,
  contractorType,
  towingModel,
  towingPlateNumber,
  certificateNumber,
  isTrailer,
  insuranceValidity,
}: Details): JSX.Element => {
  const { translate } = useTranslation()

  return !!(price && certificateNumber) || isTrailer ? (
    <div className="bg-gray-lightest rounded-2xl text-left px-6 py-5 text-sm my-10">
      <div>
        <div>
          {contractorType === ContractorType.COMPANY && contractorName && (
            <div className="mb-2 md:flex md:justify-between md:align-center">
              <p className="text-gray">{translate('insured')}:</p>
              <p className="text-black-lightest md:text-right" translate="no">
                {contractorName}
              </p>
            </div>
          )}

          {carModel && (
            <div className="mb-2 md:flex md:justify-between md:align-center">
              <p className="text-gray">
                {isTrailer ? translate('trailer') : translate('vehicle')}:
              </p>
              <p className="text-black-lightest md:text-right" translate="no">
                {carModel} {plateNumber}
              </p>
            </div>
          )}

          {towingModel && (
            <div className="mb-2 md:flex md:justify-between md:align-center">
              <p className="text-gray">{translate('vehicle')}:</p>
              <p className="text-black-lightest md:text-right" translate="no">
                {towingModel} {towingPlateNumber}
              </p>
            </div>
          )}

          <div className="mb-2 md:flex md:justify-between md:align-center">
            <p className="text-gray">{translate('drivers')}:</p>{' '}
            <p className="text-black-lightest md:text-right">
              {translate('contractType:unlimited')}
            </p>
          </div>

          {startDate && endDate && (
            <div className="md:flex md:justify-between md:align-center">
              <p className="text-gray">{translate('period')}:</p>
              <p className="text-black-lightest md:text-right">
                {`${format(normalizeDate(startDate) as Date, 'dd.MM.yyyy')} - ${format(
                  normalizeDate(endDate) as Date,
                  'dd.MM.yyyy'
                )}  (${translate(`validity:${insuranceValidity}`)})`}{' '}
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
