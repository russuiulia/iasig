/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useState } from 'react'
import { add, differenceInCalendarDays, sub } from 'date-fns'
import { utcToZonedTime } from 'date-fns-tz'
import { useRouter } from 'next/router'
import { useFormContext } from 'react-hook-form'

import * as fba from '../../../fba'
import * as fbq from '../../../fbq'
import * as ga from '../../../ga'
import {
  useRoadAssistanceEUPrice,
  useRoadAssistanceEUPreOrder,
  useRoadAssistanceEUValidations,
} from '../hooks'
import { useRoadAssistanceEUContext } from '../road-assistance-eu-context/road-assistance-eu-context'
import { RoadAssistanceEUSteps } from '../road-assistance-eu-context/road-assistance-eu-context.types'
import { RoadAssistanceEUErrorType } from '../types'
import { CertificateNumberInput } from '~/components/mui/certificate-number-input/certificate-number-input'
import { CheckboxInput } from '~/components/mui/checkbox-input/checkbox-input'
import {
  ResponsiveDatePicker,
  ResponsiveDatePickerOptions,
} from '~/components/mui/responsive-date-picker/responsive-date-picker'
import { ZoneRadio } from '~/components/mui/zone-radio/zone-radio'
import { IsgButton } from '~/components/shared/isgButton/isgButton'
import { useTranslation } from '~/context/LanguageContext'
import { PriceSummary } from '~/modules/roadAssistanceEU/road-assistance-eu-price-summary/road-assistance-eu-price-summary'
import { OffersCard } from '~/modules/shared/offersCard'
import { InsuranceType, ItemName } from '~/modules/shared/types/insurance'
import { CHISINAU_TIMEZONE } from '~/utils/timezone'
import { useFormPersist } from '~/utils/useFormPersist'

export const RoadAssistanceEUForm = (): JSX.Element => {
  const { translate } = useTranslation()
  const { setActiveStep } = useRoadAssistanceEUContext()
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
  const { createOrUpdate } = useRoadAssistanceEUPreOrder()

  const { watchForm, clearStorage } = useFormPersist(
    InsuranceType.ROAD_SIDE_ASSISTANCE_EU,
    query?.order,
    {
      watch,
      setValue,
    },
    { exclude: [] }
  )

  const updateOffer = useCallback(
    (value: any[]) => {
      setValue('price', value[0]?.priceMDL)
      setValue('priceRON', value[0]?.priceRON)
      setValue('period', value[0]?.period || '')
    },
    [watchForm.certificateNumber]
  )

  useEffect(() => {
    if (watchForm.period) {
      const duration = {
        [watchForm?.period.split('_')[1]]: Number(watchForm?.period.split('_')[0]),
      }
      setValue('endDate', sub(add(watchForm.startDate, duration), { days: 1 }))
    }
  }, [watchForm.period, watchForm.startDate])

  const { isLoading: isLoadingPrices, canLoadPrices } = useRoadAssistanceEUPrice(
    watchForm,
    setValue
  )
  const { validateInsurance } = useRoadAssistanceEUValidations()

  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => clearErrors('form'), [JSON.stringify(watchForm)])

  const datePickerOptions: ResponsiveDatePickerOptions = {
    label: translate('contractStartDate'),
    name: 'startDate',
    inputFormat: 'dd.MM.yyyy',
    value: watchForm.startDate,
    control: control,
    disablePast: true,
    mask: '__.__.____',
    maxDate: add(sub(new Date(), { days: 1 }), { years: 1 }),
    minDate: utcToZonedTime(watchForm?.minStartDate, CHISINAU_TIMEZONE),
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
      setError('form', { type: RoadAssistanceEUErrorType.createFailed })
      return
    }

    fba.lead(
      Number(watchForm.price) / 100,
      ItemName[InsuranceType.ROAD_SIDE_ASSISTANCE_EU],
      'iAsig'
    )
    ga.lead(Number(watchForm.price) / 100, ItemName[InsuranceType.ROAD_SIDE_ASSISTANCE_EU], 'iAsig')
    fbq.lead(
      Number(watchForm.price) / 100,
      ItemName[InsuranceType.ROAD_SIDE_ASSISTANCE_EU],
      'iAsig'
    )

    setIsLoading(false)
    replace(`${pathname}?order=${updatedPreOrderId}`)
    setActiveStep(RoadAssistanceEUSteps.Confirmation)
    clearStorage()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pb-40">
      <ZoneRadio label={translate('coverage:label')} options={['RO', 'RO_EU']} name="coverage" />

      <CertificateNumberInput
        defaultValue={watchForm.certificateNumber}
        name="certificateNumber"
        label={translate('vehicle:certificateNumber:label')}
      />

      {watchForm.offers?.length && !isLoadingPrices && canLoadPrices ? (
        <ResponsiveDatePicker {...datePickerOptions} />
      ) : (
        <></>
      )}
      <CheckboxInput
        name="personalDataConsent"
        defaultValue={false}
        control={control}
        required={true}
        label={translate('personalDataConsent')}
      />

      {canLoadPrices && watchForm.validData && (
        <PriceSummary
          isLoading={isLoadingPrices}
          details={{
            certificateNumber: watchForm.certificateNumber,
            plateNumber: watchForm.plateNumber,
            carModel: watchForm.carModel,
          }}
        />
      )}

      {watchForm.validData === false && (
        <p className="-mt-6 text-danger">{translate('road-assistance:invalidData')}</p>
      )}
      {errors?.form?.type === RoadAssistanceEUErrorType.createFailed && (
        <p className="text-danger">{translate('create-order-error')}</p>
      )}

      {watchForm.offers?.length && !isLoadingPrices && canLoadPrices ? (
        <OffersCard
          allOffers={watchForm.offers}
          onChange={updateOffer}
          coverage={watchForm.coverage}
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
