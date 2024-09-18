import { Control } from 'react-hook-form'
import { SelectInputController } from '~/components/mui/select-input/select-input'
import { useTranslation } from '~/context/LanguageContext'
import { Offers } from './types'

export interface OfferAmountProps {
  control: Control
  offers: Offers[]
  errorMessage?: string
  currency?: 'MDL' | 'EUR'
}

export const OfferAmount = ({
  offers,
  control,
  errorMessage,
  currency = 'EUR',
}: OfferAmountProps): JSX.Element => {
  const { translate } = useTranslation()

  return (
    <div className={'my-8'}>
      <SelectInputController
        id="amount"
        name="amount"
        label={translate('amount')}
        control={control}
        items={[
          ...offers.map((value) => (
            <option key={value.amount} value={value.amount}>
              {`${value.amount.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} ${currency} (${
                value.offers.length
              }  ${translate('oferts')})`}
            </option>
          )),
        ]}
        errorMessage={errorMessage}
      />
    </div>
  )
}
