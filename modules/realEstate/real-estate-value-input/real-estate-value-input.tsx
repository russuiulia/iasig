import { DebounceInputController } from '~/components/mui/debounce-input-controller/debounce-input-controller'
import { useTranslation } from '~/context/LanguageContext'
import { RealEstateValueType } from './real-estate-value-input.types'

interface RealEstateValueInputProps {
  insuredValue: string
  replacementCost: string
  marketValue: string
}

export const RealEstateValueInput = ({
  insuredValue,
  marketValue,
  replacementCost,
}: RealEstateValueInputProps): JSX.Element => {
  const { translate } = useTranslation()

  return insuredValue === RealEstateValueType.MARKET_VALUE ? (
    <DebounceInputController
      name="marketValue"
      label={translate('marketValue:label')}
      defaultValue={marketValue}
      insuredValue={insuredValue}
    />
  ) : (
    <DebounceInputController
      name="replacementCost"
      label={translate('replacementCost:label')}
      defaultValue={replacementCost}
      insuredValue={insuredValue}
    />
  )
}
