import { useFormContext } from 'react-hook-form'
import { SelectInputController } from '~/components/mui/select-input/select-input'
import { useTranslation } from '~/context/LanguageContext'
import { RealEstateValues } from './real-estate-validity.constants'

export const RealEstateValidity = (): JSX.Element => {
  const { translate } = useTranslation()

  const {
    formState: { errors },
    control,
  } = useFormContext()

  return (
    <SelectInputController
      id="insuranceValidity"
      name="insuranceValidity"
      label={translate('validity:label')}
      control={control}
      items={[
        <option aria-label="None" key={'none'} value="" />,
        ...RealEstateValues.map((value) => (
          <option key={value} value={value}>
            {translate(`validity:${value}`)}
          </option>
        )),
      ]}
      errorMessage={errors?.insuranceValidity?.message}
    />
  )
}
