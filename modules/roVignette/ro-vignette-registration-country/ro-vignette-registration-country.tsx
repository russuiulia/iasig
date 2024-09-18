import { useFormContext } from 'react-hook-form'

import { RegistrationCountryValues } from './ro-vignette-registration-country.constants'
import { SelectInputController } from '~/components/mui/select-input/select-input'
import { useTranslation } from '~/context/LanguageContext'

export const RegistrationCountry = (): JSX.Element => {
  const { translate } = useTranslation()

  const {
    formState: { errors },
    control,
  } = useFormContext()

  return (
    <SelectInputController
      id="registrationCountry"
      name="registrationCountry"
      label={translate('registrationCountry:label')}
      control={control}
      items={RegistrationCountryValues.map((value) => (
        <option key={value} value={value}>
          {translate(`registrationCountry:${value}`)}
        </option>
      ))}
      errorMessage={errors?.registrationCountry?.message}
    />
  )
}
