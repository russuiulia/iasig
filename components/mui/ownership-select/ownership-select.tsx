import { useFormContext } from 'react-hook-form'
import { SelectInputController } from '~/components/mui/select-input/select-input'
import { useTranslation } from '~/context/LanguageContext'
import { OWNERSHIP_RIGHTS } from './ownership-select.constants'

export const OwnershipSelect = (): JSX.Element => {
  const { translate } = useTranslation()
  const {
    formState: { errors },
    control,
  } = useFormContext()

  return (
    <SelectInputController
      id="ownership"
      name="ownership"
      label={translate('ownership:label')}
      control={control}
      items={[
        <option aria-label="None" key={'none'} value="" />,
        ...OWNERSHIP_RIGHTS.map((value) => (
          <option key={value} value={value}>
            {translate(`ownership:${value}`)}
          </option>
        )),
      ]}
      errorMessage={errors?.ownership?.message}
    />
  )
}
