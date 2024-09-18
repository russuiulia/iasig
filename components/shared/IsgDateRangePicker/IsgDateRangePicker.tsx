import { DesktopDateRangePicker, MobileDateRangePicker } from '@mui/lab'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import { RangeInput } from '@mui/lab/DateRangePicker/RangeTypes'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import * as React from 'react'
import { Control, Controller, useFormContext } from 'react-hook-form'
import { useTranslation } from '~/context/LanguageContext'
import { MedicalErrorType } from '~/modules/medical/types/medical-errors'
import ruLocale from 'date-fns/locale/ru'
import roLocale from 'date-fns/locale/ro'

const localeMap = {
  ro: roLocale,
  ru: ruLocale,
}
export interface IsgDateRangePickerOptions {
  inputFormat: string
  mask: string
  startText: string
  endText: string
  maxDate?: Date
  minDate?: Date
  disablePast: boolean
  control: Control
  onChange: (values: RangeInput<Date>) => void
  value: RangeInput<Date>
  shouldDisableDate?: (date: Date) => boolean
}

export interface IsgDateRangePickerProps {
  rangePickerOptions: IsgDateRangePickerOptions
}

export const IsgDateRangePicker = ({
  rangePickerOptions,
}: IsgDateRangePickerProps): JSX.Element => {
  const {
    formState: { errors, dirtyFields },
  } = useFormContext()

  const { translate, locale } = useTranslation()

  const dateProps = (props) => {
    return {
      ...props,
      inputProps: { ...props.inputProps, placeholder: translate('format-date'), maxLength: 10 },
    }
  }

  const hasRequiredStartDateError =
    dirtyFields?.startDate && errors?.startDate?.type === MedicalErrorType.required

  const hasRequiredEndDateError =
    dirtyFields?.endDate && errors?.endDate?.type === MedicalErrorType.required

  const onClose = () => {
    setTimeout(() => {
      document?.getElementById('startDate')?.blur?.()
    }, 0)
    setTimeout(() => {
      document?.getElementById('endDate')?.blur?.()
    }, 0)
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} locale={localeMap[locale]}>
      <Stack>
        <div className="md:hidden block">
          <MobileDateRangePicker
            {...rangePickerOptions}
            onClose={onClose}
            renderInput={(startProps, endProps) => {
              return (
                <React.Fragment>
                  <div className="flex justify-between w-full">
                    <div className="flex-1 mr-4">
                      <Controller
                        name="startDate"
                        control={rangePickerOptions.control}
                        render={({
                          field: { value, onChange, onBlur, ref },
                          fieldState: { error },
                        }) => {
                          return (
                            <TextField
                              {...dateProps(startProps)}
                              id="startDate"
                              fullWidth
                              onChange={onChange}
                              value={value}
                              error={!!error}
                              onBlur={onBlur}
                              inputRef={ref}
                            />
                          )
                        }}
                        rules={{
                          required: {
                            value: true,
                            message: translate('startDate:required'),
                          },
                        }}
                      />
                      {hasRequiredStartDateError && (
                        <p className="text-danger">{errors?.startDate?.message}</p>
                      )}
                    </div>
                    <div className="flex-1">
                      <Controller
                        name="endDate"
                        control={rangePickerOptions.control}
                        render={({
                          field: { value, onChange, onBlur, ref },
                          fieldState: { error },
                        }) => {
                          return (
                            <TextField
                              {...dateProps(endProps)}
                              id="endDate"
                              fullWidth
                              onChange={onChange}
                              value={value}
                              error={!!error}
                              onBlur={onBlur}
                              inputRef={ref}
                            />
                          )
                        }}
                        rules={{
                          required: {
                            value: true,
                            message: translate('endDate:required'),
                          },
                        }}
                      />
                      {hasRequiredEndDateError && (
                        <p className="text-danger">{errors?.endDate?.message}</p>
                      )}
                    </div>
                  </div>
                </React.Fragment>
              )
            }}
          />
        </div>
        <div className="md:block hidden">
          <DesktopDateRangePicker
            {...rangePickerOptions}
            renderInput={(startProps, endProps) => {
              return (
                <React.Fragment>
                  <div className="flex justify-between w-full">
                    <div className="flex-1 mr-4">
                      <Controller
                        name="startDate"
                        control={rangePickerOptions.control}
                        render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => {
                          return (
                            <TextField
                              {...dateProps(startProps)}
                              fullWidth
                              onChange={() => onChange()}
                              value={value}
                              error={!!error}
                              onBlur={onBlur}
                            />
                          )
                        }}
                        rules={{
                          required: {
                            value: true,
                            message: translate('startDate:required'),
                          },
                        }}
                      />
                      {hasRequiredStartDateError && (
                        <p className="text-danger">{errors?.startDate?.message}</p>
                      )}
                    </div>
                    <div className="flex-1">
                      <Controller
                        name="endDate"
                        control={rangePickerOptions.control}
                        render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => {
                          return (
                            <TextField
                              {...dateProps(endProps)}
                              fullWidth
                              onChange={onChange}
                              value={value}
                              error={!!error}
                              onBlur={onBlur}
                            />
                          )
                        }}
                        rules={{
                          required: {
                            value: true,
                            message: translate('endDate:required'),
                          },
                        }}
                      />
                      {hasRequiredEndDateError && (
                        <p className="text-danger">{errors?.endDate?.message}</p>
                      )}
                    </div>
                  </div>
                </React.Fragment>
              )
            }}
          />
        </div>
      </Stack>
    </LocalizationProvider>
  )
}
