/* eslint-disable react-hooks/exhaustive-deps */
import { add, differenceInCalendarDays, sub } from 'date-fns'
import { utcToZonedTime } from 'date-fns-tz'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { CheckboxInput } from '~/components/mui/checkbox-input/checkbox-input'
import {
  ResponsiveDatePicker,
  ResponsiveDatePickerOptions,
} from '~/components/mui/responsive-date-picker/responsive-date-picker'
import { IsgButton } from '~/components/shared/isgButton/isgButton'
import { useTranslation } from '~/context/LanguageContext'
import { PriceSummary } from '~/modules/mdVignette/md-vignette-price-summary/md-vignette-price-summary'
import { InsuranceType, ItemName } from '~/modules/shared/types/insurance'
import { CHISINAU_TIMEZONE } from '~/utils/timezone'
import { useFormPersist } from '~/utils/useFormPersist'

import { CountrySelect } from '~/components/mui/country-select/country-select'
import { SelectInputController } from '~/components/mui/select-input/select-input'
import { TextInputController } from '~/components/mui/text-input-controller/text-input-controller'
import * as fba from '../../../fba'
import * as fbq from '../../../fbq'
import * as ga from '../../../ga'
import { useMdVignettePreOrder, useMdVignettePrices, useMdVignetteValidations } from '../hooks'
import { useMdVignetteContext } from '../md-vignette-context/md-vignette-context'
import { MdVignetteSteps } from '../md-vignette-context/md-vignette-context.types'
import { MdVignetteErrorType } from '../types'

export const MdVignetteForm = (): JSX.Element => {
  const { translate } = useTranslation()
  const { setActiveStep } = useMdVignetteContext()
  const { pathname, replace, query } = useRouter()

  const {
    handleSubmit,
    watch,
    setValue,
    trigger,
    setError,
    clearErrors,
    control,
    formState: { errors },
  } = useFormContext()
  const { createOrUpdate } = useMdVignettePreOrder()

  const { watchForm, clearStorage } = useFormPersist(
    InsuranceType.MD_VIGNETTE,
    query?.order,
    {
      watch,
      setValue,
    },
    { exclude: [] }
  )

  const { isLoading: isLoadingPrices, canLoadPrices } = useMdVignettePrices(watchForm, setValue)
  const { validateInsurance } = useMdVignetteValidations()

  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => clearErrors('form'), [JSON.stringify(watchForm)])

  const datePickerOptions: ResponsiveDatePickerOptions = {
    label: translate('md-vignette-startDate'),
    name: 'startDate',
    inputFormat: 'dd.MM.yyyy',
    value: watchForm.startDate,
    control: control,
    disablePast: true,
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

  const onSubmit = async () => {
    setIsLoading(true)
    const isValid = await trigger()
    if (!isValid) {
      setIsLoading(false)
      return
    }

    const validation = validateInsurance(watchForm)

    if (!validation.isValid) {
      setIsLoading(false)
      setError(validation.field as string, { type: validation.type }, { shouldFocus: true })
      return
    }

    const updatedPreOrderId = await createOrUpdate(watchForm, query?.order as string)
    if (!updatedPreOrderId) {
      setIsLoading(false)
      setError('form', { type: MdVignetteErrorType.createFailed })
      return
    }

    fba.lead(Number(watchForm.price) / 100, ItemName[InsuranceType.MD_VIGNETTE], 'iAsig')
    ga.lead(Number(watchForm.price) / 100, ItemName[InsuranceType.MD_VIGNETTE], 'iAsig')
    fbq.lead(Number(watchForm.price) / 100, ItemName[InsuranceType.MD_VIGNETTE], 'iAsig')

    setIsLoading(false)
    replace(`${pathname}?order=${updatedPreOrderId}`)
    setActiveStep(MdVignetteSteps.Confirmation)
    clearStorage()
  }

  const validityOptions = useMemo(() => {
    if (!watchForm.vehicleType) return []

    if (watchForm.vehicleType === 'M1') {
      return ['7_days', '15_days', '30_days', '90_days', '180_days', '>180_days']
    } else {
      return ['1_day', '7_days', '30_days', '90_days', '12_months']
    }
  }, [watchForm.vehicleType])

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pb-40">
      <SelectInputController
        id="vehicleType"
        name="vehicleType"
        label={translate('vehicleType:label')}
        control={control}
        items={[
          <option aria-label="None" key={'none'} value="" />,
          ...['M1', 'M2', 'M3', 'N1', 'N2', 'N3'].map((value) => (
            <option key={value} value={value}>
              {translate(`vehicleType:${value}`)}
            </option>
          )),
        ]}
        errorMessage={errors?.vehicleType?.message}
      />

      <SelectInputController
        id="validity"
        name="validity"
        label={translate('vignette-validity:label')}
        control={control}
        items={[
          <option aria-label="None" key={'none'} value="" />,
          ...validityOptions.map((value) => (
            <option key={value} value={value}>
              {`${translate(value.split('_')[0])} ${translate(value.split('_')[1])}`}
            </option>
          )),
        ]}
        errorMessage={errors?.validity?.message}
      />

      <ResponsiveDatePicker {...datePickerOptions} />

      <CountrySelect
        setValue={setValue}
        control={control}
        errorMessage={errors?.country?.message}
      />

      <TextInputController
        name="plateNumber"
        control={control}
        defaultValue={watchForm?.plateNumber}
        label={translate('plateNumber:label')}
        errorText={errors?.plateNumber?.message}
      />

      <TextInputController
        name="idnp"
        control={control}
        defaultValue={watchForm?.idnp}
        label={translate('idnp-passport:label')}
        errorText={errors?.idnp?.message}
      />

      <TextInputController
        name="driverFullName"
        control={control}
        defaultValue={watchForm?.driverFullName}
        label={translate('driverFullName:label')}
        errorText={errors?.driverFullName?.message}
      />

      <CheckboxInput
        name="personalDataConsent"
        defaultValue={false}
        control={control}
        required={true}
        label={translate('personalDataConsent')}
      />

      {canLoadPrices && (
        <PriceSummary
          isLoading={isLoadingPrices}
          details={{
            price: watchForm.price,
            priceEUR: watchForm.priceEUR,
            vehicleType: watchForm.vehicleType,
            validity: watchForm.validity,
          }}
        />
      )}

      {errors?.form?.type === MdVignetteErrorType.invalidData && (
        <p className="-mt-6 text-danger">{translate('invalidData')}</p>
      )}
      {errors?.form?.type === MdVignetteErrorType.createFailed && (
        <p className="text-danger">{translate('create-order-error')}</p>
      )}

      <div className="flex justify-center mt-8">
        <IsgButton
          styleClass="py-4 h-12 sm:w-44 w-full"
          type="submit"
          imgSrc="/images/white-arrow.svg"
          text={translate('next')}
          isLoading={isLoading}
          disabled={isLoadingPrices}
        />
      </div>
    </form>
  )
}
