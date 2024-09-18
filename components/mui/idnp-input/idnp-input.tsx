import { useFormContext } from 'react-hook-form'
import { TextInputController } from '~/components/mui/text-input-controller/text-input-controller'
import { useTranslation } from '~/context/LanguageContext'
import { validateIdnp } from '~/utils/validateIdnp'

export interface IdnpInputProps {
  defaultValue: string
  label?: string
}

export const IdnpInput = ({ defaultValue, label = 'taxCode:1' }: IdnpInputProps): JSX.Element => {
  const { translate } = useTranslation()
  const {
    trigger,
    clearErrors,
    formState: { errors },
    control,
  } = useFormContext()

  const handleChange = async (e) => {
    clearErrors('idnp')
    if (e?.target?.value?.length === 13) {
      await trigger('idnp')
    }
  }

  return (
    <TextInputController
      name="idnp"
      control={control}
      defaultValue={defaultValue}
      label={translate(label)}
      rules={{
        validate: {
          validateIdnp,
        },
      }}
      type="tel"
      handleChange={handleChange}
      autoComplete="on"
      inputProps={{ maxLength: 13 }}
      displayNameInInput={true}
      errorText={
        (errors?.idnp?.type === 'validateIdnp' && translate('taxCode:error')) ||
        errors?.idnp?.message
      }
    />
  )
}
