import { Control, Controller } from 'react-hook-form'
import { FormControl, InputLabel, Select } from '@mui/material'

import { useTranslation } from '~/context/LanguageContext'

interface SelectInputControllerProps {
  control: Control
  id: string
  name: string
  label: string
  items: JSX.Element[]
  errorMessage?: string
  handleChange?: (e) => void
  defaultValue?: any
  rules?: any
  disabled?: boolean
}

export const SelectInputController = ({
  control,
  id,
  name,
  label,
  items,
  errorMessage,
  handleChange,
  defaultValue = '',
  rules = {},
  disabled = false,
}: SelectInputControllerProps): JSX.Element => {
  const { translate } = useTranslation()
  return (
    <div>
      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue}
        render={({ field: { value, onChange, onBlur, ref }, fieldState: { error } }) => {
          return (
            <FormControl fullWidth>
              <InputLabel id={id}>{label}</InputLabel>
              <Select
                native={true}
                fullWidth
                labelId={id}
                label={label}
                value={value}
                onChange={(e) => {
                  onChange(e.target.value)
                  handleChange?.(e)
                }}
                onBlur={onBlur}
                autoComplete="off"
                error={!!error}
                inputRef={ref}
                disabled={disabled}
              >
                {items}
              </Select>
            </FormControl>
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
      {errorMessage && <p className="text-danger">{errorMessage}</p>}
    </div>
  )
}
