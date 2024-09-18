/* eslint-disable @next/next/no-img-element */
import { useFormContext } from 'react-hook-form'

import { TextInputController } from '~/components/mui/text-input-controller/text-input-controller'
import { useTranslation } from '~/context/LanguageContext'
import { validateUAPlateNumber } from '~/utils/validateCertificateNumber'

export interface UAPlateNumberInputProps {
  defaultValue: string
  rules?: any
  label: string
  name: string
  maxLength?: number
  src?: string
  type?: string
  text?: string
}
const handleUpperCase = (event: React.ChangeEvent<HTMLInputElement>) => {
  event.target.value = event.target.value.toUpperCase()
}

export const UAPlateNumberInput = ({
  defaultValue,
  label,
  name,
  rules = {
    validate: {
      validatePlateNumber: validateUAPlateNumber,
    },
  },
  maxLength = 8,
  type = '',
}: UAPlateNumberInputProps): JSX.Element => {
  const { translate } = useTranslation()
  const {
    formState: { errors },
    control,
  } = useFormContext()

  return (
    <TextInputController
      name={name}
      type={type}
      control={control}
      defaultValue={defaultValue}
      label={label}
      rules={rules}
      autoComplete="on"
      displayNameInInput={true}
      inputProps={{
        maxLength,
        onChange: handleUpperCase,
      }}
      errorText={
        (errors?.[name]?.type === 'validatePlateNumber' && translate('carPlateNumber:error')) ||
        errors?.[name]?.message
      }
    />
  )
}
