/* eslint-disable react-hooks/exhaustive-deps */
import { differenceInCalendarDays } from 'date-fns'
import { useFormContext } from 'react-hook-form'

import { TripPurposeLabel } from '../medical-trip-purpose/medical-trip-purpose'
import { InsuranceValidity, InsuredDays } from './medical-multiple-trip-period.constants'
import { ResponsiveDatePicker } from '~/components/mui/responsive-date-picker/responsive-date-picker'
import { SelectInputController } from '~/components/mui/select-input/select-input'
import { useTranslation } from '~/context/LanguageContext'

export const MultiplePeriod = (): JSX.Element => {
  const { translate } = useTranslation()

  const {
    control,
    watch,
    setValue,
    clearErrors,
    formState: { errors },
  } = useFormContext()

  const watchStartDate = watch('startDate')
  const watchInsuredDays = watch('insuredDays', '')

  const datePickerOptions = {
    label: translate('startDate'),
    name: 'startDate',
    inputFormat: 'dd.MM.yyyy',
    value: watchStartDate,
    disablePast: true,
    mask: '__.__.____',
    control: control,
    onChange: (date) => {
      setValue('startDate', date)
      clearErrors('startDate')
    },
    isPast: (date) => !(differenceInCalendarDays(date, new Date()) < 0),
  }

  return (
    <div className="space-y-6">
      <SelectInputController
        id="insuredDays"
        name="insuredDays"
        label={translate('insuredDays')}
        control={control}
        items={[
          <option aria-label="None" key={'none'} value="" />,
          ...InsuredDays.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          )),
        ]}
        errorMessage={errors?.insuredDays?.message}
      />
      {!!watchInsuredDays && InsuranceValidity[watchInsuredDays] && (
        <SelectInputController
          id="insuranceValidity"
          name="insuranceValidity"
          label={translate('insuranceValidity')}
          control={control}
          items={[
            <option aria-label="None" key={'none'} value="" />,
            ...InsuranceValidity[watchInsuredDays].map((value) => (
              <option key={value} value={value}>
                {value} {value === '1' ? translate('month') : translate('months')}
              </option>
            )),
          ]}
          errorMessage={errors?.insuranceValidity?.message}
        />
      )}

      <TripPurposeLabel control={control} errorMessage={errors?.tripPurpose?.message} />

      <ResponsiveDatePicker {...datePickerOptions} />
    </div>
  )
}
