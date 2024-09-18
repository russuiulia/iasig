import { useTranslation } from '~/context/LanguageContext'
import { PriceSummaryLoader } from '~/modules/shared/summaryLoader/price-loader'

export type PriceSummaryProps = {
  details: {
    price: number
    baggagePcs: string
    amount: string
  }
  isLoading: boolean
}

export const PriceSummary = ({ details, isLoading }: PriceSummaryProps): JSX.Element => {
  return isLoading ? <PriceSummaryLoader /> : <Summary {...details} />
}

const Summary = ({
  ...details
}: {
  price: number
  baggagePcs: string
  amount: string
}): JSX.Element => {
  const { translate } = useTranslation()
  return details.price && details.baggagePcs ? (
    <div className="bg-gray-lightest rounded-2xl	mb-8 text-left px-6 py-5 text-sm">
      <div>
        <div className="mb-2 md:flex md:justify-between md:align-center">
          <p className="text-gray">{translate('baggagePcs')}:</p>
          <p className="text-black-lightest md:text-right" translate="no">
            {details.baggagePcs}
          </p>
        </div>
        {details.amount && (
          <div className="mb-2 md:flex md:justify-between md:align-center">
            <p className="text-gray">{translate('amount')}:</p>
            <p className="text-black-lightest md:text-right" translate="no">
              {details.amount.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} EUR
            </p>
          </div>
        )}
      </div>
    </div>
  ) : (
    <p className="text-danger">{translate('price-required-error')}</p>
  )
}
