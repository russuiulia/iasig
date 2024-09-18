import { useCallback, useState, useEffect } from 'react'
import debounce from 'debounce'
import { TextField } from '@mui/material'
import { Controller, useFormContext } from 'react-hook-form'
import { useTranslation } from '~/context/LanguageContext'
import { useRouter } from 'next/router'

interface DebounceInputControllerProps {
  name: string
  label: string
  defaultValue: string
  insuredValue: string
}

export const DebounceInputController = ({
  name,
  label,
  defaultValue,
  insuredValue,
}: DebounceInputControllerProps): JSX.Element => {
  const {
    control,
    formState: { errors },
  } = useFormContext()

  const { translate } = useTranslation()
  const { isReady } = useRouter()
  const [localValue, setLocalValue] = useState(defaultValue)

  useEffect(() => {
    if (isReady) {
      setLocalValue(defaultValue)
    }
  }, [defaultValue, insuredValue])

  const changeHandler = async (event, onChange) => onChange(event)

  const debouncedChangeHandler = useCallback(debounce(changeHandler, 500), [])

  const handleChange = (e) => setLocalValue(e?.target?.value?.replace(/\D/g, ''))

  return (
    <div>
      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue}
        render={({ field: { onBlur, onChange, ref }, fieldState: { error } }) => {
          return (
            <TextField
              fullWidth
              label={label}
              onChange={(e) => {
                handleChange(e)
                debouncedChangeHandler(e, onChange)
              }}
              value={localValue}
              error={!!error}
              type="tel"
              autoComplete="off"
              onBlur={onBlur}
              inputRef={ref}
            />
          )
        }}
        rules={{
          required: {
            value: !localValue,
            message: translate(`${name}:required`),
          },
        }}
      />

      <p className="text-danger">
        {(errors?.[name]?.type === 'validateValue' && translate(`${name}:validate`)) ||
          errors?.[name]?.message}
      </p>
    </div>
  )
}
