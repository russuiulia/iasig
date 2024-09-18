import { isValid } from 'date-fns'
import roLocale from 'date-fns/locale/ro'
import ruLocale from 'date-fns/locale/ru'
import { Control, Controller, useFormContext } from 'react-hook-form'
import { DesktopDatePicker, LocalizationProvider, MobileDatePicker } from '@mui/lab'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import { Stack, TextField } from '@mui/material'

import { DatePickerError } from './responsive-date-picker.types'
import { useTranslation } from '~/context/LanguageContext'

const localeMap = {
  ro: roLocale,
  ru: ruLocale,
}

export interface ResponsiveDatePickerOptions {
  label: string
  name: string
  inputFormat: string
  value: Date
  disablePast?: boolean
  disableFuture?: boolean
  mask: string
  control: Control
  onChange: (value: Date | null) => void
  maxDate?: Date
  minDate?: Date
  isPast?: (date) => boolean
  isFuture?: (date) => boolean
}

export const ResponsiveDatePicker = (datePickerOptions: ResponsiveDatePickerOptions) => {
  const { translate, locale } = useTranslation()

  const {
    formState: { errors, dirtyFields },
  } = useFormContext()

  const dateProps = (props) => {
    return {
      ...props,
      inputProps: { ...props.inputProps, placeholder: translate('format-date'), maxLength: 10 },
    }
  }

  const hasRequiredError =
    (dirtyFields?.[datePickerOptions.name] &&
      errors?.[datePickerOptions.name]?.type === DatePickerError.required) ||
    errors?.[datePickerOptions.name]?.type === DatePickerError.required
  const hasPastError =
    dirtyFields?.[datePickerOptions.name] &&
    errors?.[datePickerOptions.name]?.type === DatePickerError.isPast
  const hasFutureError =
    dirtyFields?.[datePickerOptions.name] &&
    errors?.[datePickerOptions.name]?.type === DatePickerError.isFuture
  const hasInvalidError =
    dirtyFields?.[datePickerOptions.name] &&
    errors?.[datePickerOptions.name]?.type === DatePickerError.isValid
  const hasInvalidMinStartDate =
    dirtyFields?.[datePickerOptions.name] &&
    errors?.[datePickerOptions.name]?.type === DatePickerError.isNotValidMinStartDate

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} locale={localeMap[locale]}>
      <Stack>
        <div className="md:block hidden">
          <DesktopDatePicker
            {...datePickerOptions}
            renderInput={(params) => (
              <Controller
                name={datePickerOptions.name}
                control={datePickerOptions.control}
                render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => {
                  return (
                    <TextField
                      {...dateProps(params)}
                      fullWidth
                      onChange={onChange}
                      value={value}
                      autoComplete="off"
                      error={!!error}
                      onBlur={() => {
                        onBlur()
                      }}
                    />
                  )
                }}
                rules={{
                  required: {
                    value: true,
                    message: translate(`${datePickerOptions.name}:required`),
                  },
                  validate: {
                    isValid,
                    isPast: (date) => datePickerOptions?.isPast?.(date),
                    isFuture: (date) => datePickerOptions?.isFuture?.(date),
                  },
                }}
              />
            )}
          />
          {hasRequiredError && (
            <p className="text-danger">{translate(`${datePickerOptions.name}:required`)}</p>
          )}
          {hasPastError && (
            <p className="text-danger">{translate(`${datePickerOptions.name}-is-in-past`)}</p>
          )}
          {hasFutureError && (
            <p className="text-danger">{translate(`${datePickerOptions.name}-is-in-future`)}</p>
          )}
          {hasInvalidError && (
            <p className="text-danger">{translate(`${datePickerOptions.name}-is-invalid`)}</p>
          )}
          {hasInvalidMinStartDate && (
            <p className="text-danger">{translate(`${datePickerOptions.name}-min-is-invalid`)}</p>
          )}
        </div>
        <div className="md:hidden block">
          <MobileDatePicker
            {...datePickerOptions}
            renderInput={(params) => (
              <Controller
                name={datePickerOptions.name}
                control={datePickerOptions.control}
                render={({ field: { value, onChange, onBlur, ref }, fieldState: { error } }) => {
                  return (
                    <TextField
                      {...dateProps(params)}
                      fullWidth
                      onChange={onChange}
                      value={value}
                      autoComplete="off"
                      error={!!error}
                      onBlur={() => {
                        onBlur()
                      }}
                      inputRef={ref}
                    />
                  )
                }}
                rules={{
                  required: {
                    value: true,
                    message: translate('fieldRequired:error'),
                  },
                  validate: {
                    isValid,
                    isPast: (date) => datePickerOptions?.isPast?.(date),
                    isFuture: (date) => datePickerOptions?.isFuture?.(date),
                  },
                }}
              />
            )}
          />
          {hasRequiredError && (
            <p className="text-danger">{translate(`${datePickerOptions.name}:required`)}</p>
          )}
          {hasPastError && (
            <p className="text-danger">{translate(`${datePickerOptions.name}-is-in-past`)}</p>
          )}
          {hasFutureError && (
            <p className="text-danger">{translate(`${datePickerOptions.name}-is-in-future`)}</p>
          )}
          {hasInvalidError && (
            <p className="text-danger">{translate(`${datePickerOptions.name}-is-invalid`)}</p>
          )}
          {hasInvalidMinStartDate && (
            <p className="text-danger">{translate(`${datePickerOptions.name}-min-is-invalid`)}</p>
          )}
        </div>
      </Stack>
    </LocalizationProvider>
  )
}
