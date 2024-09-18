import { useEffect } from 'react'
import { add, differenceInDays, isValid, sub } from 'date-fns'
import { useFormContext } from 'react-hook-form'
import { RangeInput } from '@mui/lab/DateRangePicker/RangeTypes'

import { TripPurposeLabel } from '../medical-trip-purpose/medical-trip-purpose'
import { MedicalErrorType } from '../types/medical-errors'
import { IsgDateRangePicker } from '~/components/shared/IsgDateRangePicker/IsgDateRangePicker'
import { useTranslation } from '~/context/LanguageContext'

export const SingleTripPeriod = (): JSX.Element => {
  const { translate } = useTranslation()

  const {
    setValue,
    watch,
    clearErrors,
    control,
    formState: { errors },
  } = useFormContext()

  const startDate = watch('startDate')
  const endDate = watch('endDate')
  const watchIsMultipleType = watch('isMultipleType')

  useEffect(() => {
    if (isValid(startDate) && isValid(endDate) && !watchIsMultipleType) {
      const days = differenceInDays(endDate, startDate) + 1
      setValue('insuredDays', days)
      setValue('insuranceValidity', days)
    }
  }, [startDate, endDate, watchIsMultipleType])

  const clearDateError = () => {
    clearErrors('startDate')
    clearErrors('endDate')
  }

  const onStartDateChange = (value: Date) => {
    setValue('startDate', value)
    clearDateError()
  }

  const onEndDateChange = (value: Date) => {
    setValue('endDate', value)
    clearDateError()
  }

  const shouldDisableDate = (date: Date): boolean => {
    return (
      (differenceInDays(new Date(date), new Date(startDate)) < 3 &&
        differenceInDays(new Date(date), new Date(startDate)) > 0) ||
      false
    )
  }

  const rangePickerOptions = {
    inputFormat: 'dd.MM.yyyy',
    mask: '__.__.____',
    control: control,
    startText: translate('startDate'),
    endText: translate('endDate'),
    shouldDisableDate: (date) => shouldDisableDate(date),
    maxDate: isValid(startDate) ? add(sub(startDate, { days: 1 }), { years: 1 }) : undefined,
    disablePast: true,
    value: [startDate, endDate] as RangeInput<Date>,
    onChange: (values) => {
      if (!values[0] || isValid(values[0])) {
        onStartDateChange(values[0])
      }

      if (!values[1] || isValid(values[1])) {
        onEndDateChange(values[1])
      }
    },
  }

  return (
    <div className="space-y-6">
      <IsgDateRangePicker rangePickerOptions={rangePickerOptions} />
      {errors?.startDate?.type === MedicalErrorType.isPast && (
        <p className="text-danger">{translate('startDate-is-in-past')}</p>
      )}
      {errors?.endDate?.type === MedicalErrorType.isPast && (
        <p className="text-danger">{translate('endDate-is-in-past')}</p>
      )}
      {errors?.endDate?.type === MedicalErrorType.smallDateInterval && (
        <p className="text-danger">{translate('small-date-interval')}</p>
      )}
      {errors?.endDate?.type === MedicalErrorType.startGreaterThanEnd && (
        <p className="text-danger">{translate('start-greater-than-end')}</p>
      )}

      <TripPurposeLabel control={control} errorMessage={errors?.tripPurpose?.message} />
    </div>
  )
}
