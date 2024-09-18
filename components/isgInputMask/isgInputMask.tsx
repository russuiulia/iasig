import { Control, Controller } from 'react-hook-form'
import InputMask from 'react-input-mask'
import { TextField } from '@mui/material'

import { useTranslation } from '~/context/LanguageContext'

interface InputMaskControllerProps {
  rules?: Record<string, any>
  name: string
  control: Control<any>
  defaultValue: string
  label: string
  errorText?: string
  type?: string
  mask?: string
}

export const InputMaskController = ({
  rules = {},
  name,
  control,
  defaultValue,
  label,
  errorText = '',
  type = 'tel',
  mask = '',
}: InputMaskControllerProps): JSX.Element => {
  const { translate } = useTranslation()
  return (
    <div>
      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue}
        render={({ field: { value, onChange, onBlur, ref }, fieldState: { error } }) => {
          return (
            <InputMask mask={mask} value={value} onChange={onChange} onBlur={onBlur}>
              {(inputProps) => (
                <TextField
                  {...inputProps}
                  label={label}
                  type={type}
                  fullWidth
                  inputRef={ref}
                  error={!!error}
                />
              )}
            </InputMask>
          )
        }}
        rules={{
          required: {
            value: true,
            message: translate(`${name}:required`),
          },
          ...rules,
        }}
      />
      <p className="text-danger">{errorText}</p>
    </div>
  )
}
