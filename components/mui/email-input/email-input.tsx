import { Control, Controller } from 'react-hook-form'
import TextField from '@mui/material/TextField'

import { emailValidator } from '~/constants/validators'
import { useTranslation } from '~/context/LanguageContext'

interface EmailInputProps {
  email: string
  control: Control
  errorMessage?: string
  required?: boolean
}

export const EmailInput = ({
  email,
  errorMessage,
  control,
  required = false,
}: EmailInputProps): JSX.Element => {
  const { translate } = useTranslation()

  const isEmailValid = (email: string): boolean => {
    if (!email?.trim()?.length) {
      return true
    }
    return emailValidator.test(email)
  }

  return (
    <div className="mb-8">
      <Controller
        name="email"
        control={control}
        defaultValue={email}
        render={({ field: { value, onChange, ref }, fieldState: { error } }) => {
          return (
            <TextField
              id="formEmail"
              fullWidth
              label={required ? 'Email' : translate('confirmation:email')}
              onChange={(e) => {
                onChange(e)
                if (isEmailValid(e.target.value)) {
                  onChange(e.target.value)
                }
              }}
              value={value}
              error={!!error}
              type="email"
              autoComplete="email"
              name="email"
              inputRef={ref}
            />
          )
        }}
        rules={{
          required: {
            value: required,
            message: translate('fieldRequired:error'),
          },
          validate: isEmailValid,
        }}
      />

      {errorMessage && <p className="text-danger">{errorMessage}</p>}
    </div>
  )
}
