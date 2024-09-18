import { DesktopDatePicker, LocalizationProvider } from '@mui/lab'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import { Stack, TextField } from '@mui/material'
import { differenceInCalendarDays, isValid } from 'date-fns'
import {
  Control,
  Controller,
  DeepMap,
  FieldErrors,
  FieldValues,
  useFormContext,
} from 'react-hook-form'
import { useTranslation } from '~/context/LanguageContext'
import { DatePickerError } from '../responsive-date-picker/responsive-date-picker.types'

export interface BirthdayInputProps {
  label: string
  name: string
  inputFormat: string
  value: Date | null
  disableFuture: boolean
  mask: string
  disableOpenPicker: boolean
  dirtyFields: DeepMap<FieldValues, true>
  errors: FieldErrors
  control: Control<any>
  onChange: (value: Date | null) => void
  onBlur: () => void
  id?: string
  invalidBirthday: (value) => boolean
  checkIfIsAdult?: (value) => boolean
}

export const BirthdayInput = (birthdayDate: BirthdayInputProps) => {
  const { translate } = useTranslation()
  const { errors, dirtyFields } = birthdayDate
  const { trigger } = useFormContext()

  const {
    formState: { errors: formErrors },
  } = useFormContext()

  const dateProps = (props) => {
    return {
      ...props,
      inputProps: {
        ...props.inputProps,
        placeholder: translate('format-date'),
        maxLength: 10,
        id: birthdayDate.id,
      },
    }
  }

  const isFuture = (date) =>
    birthdayDate.disableFuture && !(differenceInCalendarDays(date, new Date()) > 0)

  const hasRequiredError =
    errors?.[birthdayDate.name]?.type === DatePickerError.required ||
    formErrors?.[birthdayDate.name]?.type === DatePickerError.required
  const hasInvalidError =
    dirtyFields?.[birthdayDate.name] &&
    errors?.[birthdayDate.name]?.type === DatePickerError.isValid

  const hasInvalidBirthdayError =
    dirtyFields?.[birthdayDate.name] &&
    errors?.[birthdayDate.name]?.type === DatePickerError.invalidBirthday

  const checkIfIsAdultError =
    dirtyFields?.[birthdayDate.name] &&
    errors?.[birthdayDate.name]?.type === DatePickerError.checkIfIsAdult

  const hasFutureError =
    dirtyFields?.[birthdayDate.name] &&
    errors?.[birthdayDate.name]?.type === DatePickerError.isFuture

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Stack>
        <DesktopDatePicker
          {...birthdayDate}
          renderInput={(params) => (
            <Controller
              name={birthdayDate.name}
              control={birthdayDate.control}
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
                      trigger(birthdayDate.name)
                      onBlur()
                      birthdayDate.onBlur()
                    }}
                  />
                )
              }}
              rules={{
                required: {
                  value: true,
                  message: translate('birthday:required'),
                },
                validate: {
                  isValid,
                  isFuture,
                  invalidBirthday: (e) => birthdayDate?.invalidBirthday?.(e),
                  checkIfIsAdult: (e) => birthdayDate?.checkIfIsAdult?.(e),
                },
              }}
            />
          )}
        />

        {hasRequiredError && <p className="text-danger">{translate('birthday:required')}</p>}
        {hasFutureError && <p className="text-danger">{translate(`birthday-is-in-future`)}</p>}
        {hasInvalidError && <p className="text-danger">{translate(`birthday-is-invalid`)}</p>}
        {hasInvalidBirthdayError && (
          <p className="text-danger">{translate('birthday-limit-date')}</p>
        )}
        {checkIfIsAdultError && (
          <p className="text-danger">{translate('person-should-be-adult')}</p>
        )}
      </Stack>
    </LocalizationProvider>
  )
}
