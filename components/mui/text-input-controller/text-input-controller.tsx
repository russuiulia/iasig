import { Control, Controller, useFormContext } from 'react-hook-form'
import { FilledInputProps, TextField } from '@mui/material'

import { useTranslation } from '~/context/LanguageContext'

interface TextInputControllerProps {
  rules?: Record<string, any>
  inputProps?: Record<string, any>
  name: string
  control: Control<any>
  defaultValue: string
  id?: string
  label: string
  errorText?: string | boolean
  placeholder?: string
  handleBlur?: () => void
  handleChange?: (e) => void
  autoComplete?: 'off' | 'on'
  displayNameInInput?: boolean
  InputProps?: Partial<FilledInputProps>
  type?: string
  helperText?: string
  onKeyDown?: any
  onKeyUp?: any
  required?: boolean
  disabled?: boolean
}

export const TextInputController = ({
  rules = {},
  name,
  control,
  defaultValue,
  id = '',
  label,
  errorText = '',
  inputProps = {},
  placeholder = '',
  type = 'text',
  handleBlur,
  handleChange,
  autoComplete = 'off',
  displayNameInInput = false,
  InputProps = {},
  helperText = '',
  onKeyUp,
  onKeyDown,
  required = true,
  disabled = false,
}: TextInputControllerProps): JSX.Element => {
  const { trigger } = useFormContext()
  const { translate } = useTranslation()

  return (
    <div className="w-full">
      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue}
        render={({ field: { value, onChange, onBlur, ref }, fieldState: { error } }) => {
          return (
            <TextField
              translate="no"
              {...(displayNameInInput ? { name } : {})}
              fullWidth
              id={id}
              label={label}
              onChange={(e) => {
                onChange(e)
                handleChange?.(e)
              }}
              value={value}
              error={!!error}
              type={type}
              autoComplete={autoComplete}
              inputProps={inputProps}
              placeholder={placeholder}
              onBlur={() => {
                trigger(name)
                onBlur()
                handleBlur?.()
              }}
              helperText={helperText}
              InputProps={InputProps}
              inputRef={ref}
              onKeyDown={onKeyDown}
              onKeyUp={onKeyUp}
              disabled={disabled}
            />
          )
        }}
        rules={{
          required: {
            value: required,
            message: translate(`${name}:required`),
          },
          ...rules,
        }}
      />
      <p className="text-danger">{errorText}</p>
    </div>
  )
}
