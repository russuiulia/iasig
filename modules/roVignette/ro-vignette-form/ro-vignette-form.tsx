/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useState } from 'react'
import { add, differenceInCalendarDays, sub } from 'date-fns'
import { utcToZonedTime } from 'date-fns-tz'
import { useRouter } from 'next/router'
import { useFormContext } from 'react-hook-form'

import * as fba from '../../../fba'
import * as fbq from '../../../fbq'
import * as ga from '../../../ga'
import { useRoVignettePreOrder, useRoVignettePrices, useRoVignetteValidations } from '../hooks'
import { useRoVignetteContext } from '../ro-vignette-context/ro-vignette-context'
import { RoVignetteSteps } from '../ro-vignette-context/ro-vignette-context.types'
import { RegistrationCountry } from '../ro-vignette-registration-country/ro-vignette-registration-country'
import { RoVignetteErrorType } from '../types'
import { CertificateNumberInput } from '~/components/mui/certificate-number-input/certificate-number-input'
import { CheckboxInput } from '~/components/mui/checkbox-input/checkbox-input'
import {
  ResponsiveDatePicker,
  ResponsiveDatePickerOptions,
} from '~/components/mui/responsive-date-picker/responsive-date-picker'
import { UAPlateNumberInput } from '~/components/mui/ua-plate-number-input/ua-plate-number-input'
import { IsgButton } from '~/components/shared/isgButton/isgButton'
import { useTranslation } from '~/context/LanguageContext'
import { PriceSummary } from '~/modules/roVignette/ro-vignette-price-summary/ro-vignette-price-summary'
import { AdditionalProduct, Addons } from '~/modules/shared/addons'
import { InsuranceType, ItemName } from '~/modules/shared/types/insurance'
import { CHISINAU_TIMEZONE } from '~/utils/timezone'
import { useFormPersist } from '~/utils/useFormPersist'

export const RoVignetteForm = (): JSX.Element => {
  const { translate } = useTranslation()
  const { setActiveStep } = useRoVignetteContext()
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
  const { createOrUpdate } = useRoVignettePreOrder()

  const { watchForm, clearStorage } = useFormPersist(
    InsuranceType.RO_VIGNETTE,
    query?.order,
    {
      watch,
      setValue,
    },
    { exclude: [] }
  )

  const updateAddons = useCallback(
    (value: AdditionalProduct[]) => {
      const valueWithData = value.map((addon) => {
        if (addon.addonType === 'vignette:ro') {
          return {
            ...addon,
            certificateNumber: watchForm.certificateNumber,
            startDate: watchForm.startDate,
            type: 'vignette:ro',
          }
        } else {
          return addon
        }
      })

      if (watchForm.registrationCountry === 'MD') {
        setValue('carPlateNumber', valueWithData[0]?.carPlateNumber)
      }

      setValue('vignetteDetails', valueWithData[0] || {})
      setValue('price', valueWithData[0]?.priceMDL)
      setValue('carModel', valueWithData[0]?.carModel)
      setValue('periodDays', valueWithData[0]?.periodDays)
      setValue('description', valueWithData[0]?.description)
      setValue('priceRON', valueWithData[0]?.price)
    },
    [watchForm.carPlateNumber, watchForm.certificateNumber, watchForm.vignetteStartDate]
  )

  const { offer, isLoading: isLoadingPrices, canLoadPrices } = useRoVignettePrices(watchForm)
  const { validateInsurance } = useRoVignetteValidations()

  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => clearErrors('form'), [JSON.stringify(watchForm)])

  const datePickerOptions: ResponsiveDatePickerOptions = {
    label: translate('vignetteStartDate'),
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
      setError('form', { type: RoVignetteErrorType.createFailed })
      return
    }

    fba.lead(Number(watchForm.price) / 100, ItemName[InsuranceType.RO_VIGNETTE], 'iAsig')
    ga.lead(Number(watchForm.price) / 100, ItemName[InsuranceType.RO_VIGNETTE], 'iAsig')
    fbq.lead(Number(watchForm.price) / 100, ItemName[InsuranceType.RO_VIGNETTE], 'iAsig')

    setIsLoading(false)
    replace(`${pathname}?order=${updatedPreOrderId}`)
    setActiveStep(RoVignetteSteps.Confirmation)
    clearStorage()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pb-40">
      <RegistrationCountry />

      {watchForm?.registrationCountry === 'MD' && (
        <CertificateNumberInput
          defaultValue={watchForm.certificateNumber}
          name="certificateNumber"
          label={translate('vehicle:certificateNumber:label')}
        />
      )}

      {watchForm?.registrationCountry === 'UA' && (
        <UAPlateNumberInput
          defaultValue={watchForm.carPlateNumber}
          name="carPlateNumber"
          label={translate('plateNumber:label')}
        />
      )}

      <ResponsiveDatePicker {...datePickerOptions} />
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
            offers: offer,
            certificateNumber: watchForm.certificateNumber,
            plateNumber: watchForm.carPlateNumber,
          }}
        />
      )}

      {errors?.form?.type === RoVignetteErrorType.invalidData && (
        <p className="-mt-6 text-danger">{translate('invalidData')}</p>
      )}
      {errors?.form?.type === RoVignetteErrorType.createFailed && (
        <p className="text-danger">{translate('create-order-error')}</p>
      )}

      {offer?.length && !isLoadingPrices && canLoadPrices ? (
        <Addons
          selectedDate={watchForm.startDate}
          allAddons={offer}
          onChange={updateAddons}
          insuranceType={InsuranceType.RO_VIGNETTE}
        />
      ) : null}

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
