/* eslint-disable react-hooks/exhaustive-deps */
import { add, differenceInCalendarDays, sub } from 'date-fns'
import { utcToZonedTime } from 'date-fns-tz'
import { useFormContext } from 'react-hook-form'
import { ResponsiveDatePicker } from '~/components/mui/responsive-date-picker/responsive-date-picker'
import { useTranslation } from '~/context/LanguageContext'
import { CHISINAU_TIMEZONE } from '~/utils/timezone'

export const RcaStartDatePicker = ({ startDate }): JSX.Element => {
  const { translate } = useTranslation()

  const { control, clearErrors, setValue, trigger } = useFormContext()

  const startDatePickerOptions = {
    label: translate('startDate'),
    name: 'startDate',
    inputFormat: 'dd.MM.yyyy',
    value: startDate,
    disablePast: true,
    control: control,
    mask: '__.__.____',
    maxDate: add(sub(new Date(), { days: 1 }), { years: 1 }),
    minDate: utcToZonedTime(new Date().toISOString(), CHISINAU_TIMEZONE),
    onChange: async (date) => {
      clearErrors('startDate')
      setValue('startDate', date)
      await trigger('startDate')
    },
    isPast: (date) =>
      !(
        differenceInCalendarDays(
          date,
          utcToZonedTime(new Date().toISOString(), CHISINAU_TIMEZONE)
        ) < 0
      ),
  }

  return <ResponsiveDatePicker {...startDatePickerOptions} />
}
