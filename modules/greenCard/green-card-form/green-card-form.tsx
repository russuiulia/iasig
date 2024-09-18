/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import { add, differenceInCalendarDays, sub } from 'date-fns'
import { utcToZonedTime } from 'date-fns-tz'
import { useRouter } from 'next/router'
import { useFormContext } from 'react-hook-form'
import { SparklesIcon } from '@heroicons/react/20/solid'

import * as fba from '../../../fba'
import * as fbq from '../../../fbq'
import * as ga from '../../../ga'
import { useGreenCardContext } from '../green-card-context/green-card-context'
import { GreenCardSteps } from '../green-card-context/green-card-context.types'
import { GreenCardValidity } from '../green-card-validity/green-card-validity'
import { useGreenCardPreOrder, useGreenCardPrices, useGreenCardValidations } from '../hooks'
import { GreenCardErrorType } from '../types'
import { calculateEndDate } from '../utils/calculate-end-date'
import { CertificateNumberInput } from '~/components/mui/certificate-number-input/certificate-number-input'
import { CheckboxInput } from '~/components/mui/checkbox-input/checkbox-input'
import { OwnershipSelect } from '~/components/mui/ownership-select/ownership-select'
import {
  ResponsiveDatePicker,
  ResponsiveDatePickerOptions,
} from '~/components/mui/responsive-date-picker/responsive-date-picker'
import { TextInputController } from '~/components/mui/text-input-controller/text-input-controller'
import { TooltipInput } from '~/components/mui/tooltip-input/tooltip-input'
import { ZoneRadio } from '~/components/mui/zone-radio/zone-radio'
import { IsgButton } from '~/components/shared/isgButton/isgButton'
import { TranslatedLink } from '~/components/translatedLink/translatedLink'
import { useTranslation } from '~/context/LanguageContext'
import { PriceSummary } from '~/modules/greenCard/green-card-price-summary/green-card-price-summary'
import { OwnershipRights } from '~/modules/rca/types'
// import { AdditionalProduct } from '~/modules/shared/addons'
import { Companies } from '~/modules/shared/companies/companies'
import { DamageAssistanceInput } from '~/modules/shared/damageAssistanceInput/damageAssistanceInput'
import { InsuranceType, ItemName } from '~/modules/shared/types/insurance'
import { normalizeDate } from '~/utils/normalizeDate'
import { CHISINAU_TIMEZONE } from '~/utils/timezone'
import { useFormPersist } from '~/utils/useFormPersist'
import { validateCertificateNumber } from '~/utils/validateCertificateNumber'
import { validateIdnx } from '~/utils/validateIdnp'

export const GreenCardForm = (): JSX.Element => {
  const { translate, locale } = useTranslation()
  const { setActiveStep } = useGreenCardContext()
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
  const { createOrUpdate } = useGreenCardPreOrder()

  const { watchForm, clearStorage } = useFormPersist(
    InsuranceType.GREEN_CARD,
    query?.order,
    {
      watch,
      setValue,
    },
    { exclude: [] }
  )

  useEffect(() => {
    const totalPrice =
      watchForm.insurancePrice +
      (watchForm.addons?.reduce((acc, addon) => acc + addon.priceMDL, 0) || 0)

    if (totalPrice) {
      setValue('price', totalPrice)
    }
  }, [watchForm.addons, watchForm.insurancePrice])

  // const updateAddons = useCallback(
  //   (value: AdditionalProduct[]) => {
  //     const valueWithData = value.map((addon) => {
  //       if (addon.addonType === 'vignette:ro') {
  //         return {
  //           ...addon,
  //           certificateNumber: watchForm.certificateNumber,
  //           startDate: watchForm.vignetteStartDate,
  //           type: 'vignette:ro',
  //         }
  //       } else {
  //         return addon
  //       }
  //     })
  //     setValue('addons', valueWithData)
  //   },
  //   [watchForm.certificateNumber, watchForm.vignetteStartDate]
  // )

  const { offer, isLoading: isLoadingPrices, canLoadPrices } = useGreenCardPrices(watchForm)
  const { validateInsurance } = useGreenCardValidations(offer.validData)

  const [isLoading, setIsLoading] = useState(false)
  const isValidData = offer.validData === false

  useEffect(() => clearErrors('form'), [JSON.stringify(watchForm)])

  useEffect(() => {
    setValue(
      'endDate',
      calculateEndDate(normalizeDate(watchForm.startDate) as Date, watchForm.insuranceValidity)
    )

    if (!watchForm.vignetteStartDate) {
      setValue('vignetteStartDate', watchForm.startDate)
      clearErrors('vignetteStartDate')
    }
  }, [watchForm.startDate, watchForm.insuranceValidity])

  useEffect(() => {
    setValue('documentDate', null)
    setValue('documentNumber', '')
  }, [watchForm.ownership])

  useEffect(() => {
    const setPrices = () => {
      if (!offer) {
        return
      }

      setValue('price', offer.priceMDL)
      setValue('insurancePrice', offer.priceMDL)
      setValue('priceEUR', offer.priceEUR)
      setValue('carModel', offer.carModel)
      setValue('plateNumber', offer.plateNumber)
      setValue('contractorName', offer.contractorName)
      setValue('contractorType', offer.contractorType)
      setValue('ownership', isValidData ? '' : OwnershipRights.Property)
      setValue('towingModel', offer.towingModel || '')
      setValue('towingPlateNumber', offer.towingPlateNumber || '')
      setValue('isTowingVehicleTrailer', offer.isTowingVehicleTrailer)
      setValue('vehicleCategory', offer.category || '')
      setValue('minStartDate', offer.minStartDate)
    }

    if (offer?.isTrailer === false) {
      setValue('towingCertificateNumber', '')
    }

    if (offer.isTowingVehicleTrailer) {
      setError('towingCertificateNumber', { message: translate('cannotBeTrailer') })
    }

    setValue('companyName', null)
    setPrices()
  }, [JSON.stringify(offer)])

  const datePickerOptions: ResponsiveDatePickerOptions = {
    label: translate('startDate'),
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

  const documentDateOptions = {
    label: translate('driver:document-date'),
    name: 'documentDate',
    inputFormat: 'dd.MM.yyyy',
    value: watchForm.documentDate,
    disableFuture: true,
    maxDate: new Date(),
    control: control,
    mask: '__.__.____',
    onChange: async (date) => {
      clearErrors('documentDate')
      setValue('documentDate', date)
      await trigger('documentDate')
    },
    isFuture: (date) => !(differenceInCalendarDays(date, new Date()) > 0),
  }

  // const vignetteDateOptions = {
  //   label: translate('vignetteStartDate'),
  //   name: 'vignetteStartDate',
  //   inputFormat: 'dd.MM.yyyy',
  //   value: watchForm.vignetteStartDate,
  //   disablePast: true,
  //   mask: '__.__.____',
  //   control: control,
  //   onChange: (date) => {
  //     setValue('vignetteStartDate', date)
  //     clearErrors('vignetteStartDate')
  //   },
  //   isPast: (date) => !(differenceInCalendarDays(date, new Date()) < 0),
  //   maxDate: add(sub(new Date(), { days: 1 }), { months: 1 }),
  // }

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
      setError('form', { type: GreenCardErrorType.createFailed })
      return
    }

    const price = Number(watchForm.priceEUR) * 0.2
    fba.lead(price, ItemName[InsuranceType.GREEN_CARD], watchForm.companyName)
    ga.lead(price, ItemName[InsuranceType.GREEN_CARD], watchForm.companyName)
    fbq.lead(price, ItemName[InsuranceType.GREEN_CARD], watchForm.companyName)

    setIsLoading(false)
    replace(`${pathname}?order=${updatedPreOrderId}`)
    setActiveStep(GreenCardSteps.Confirmation)
    clearStorage()
  }

  const handleChangeIdnp = async (e) => {
    clearErrors('idnp')
    if (e?.target?.value?.length === 13) {
      await trigger('idnp')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <ZoneRadio label={translate('zone:label')} options={[1, 3]} />
      <CertificateNumberInput
        defaultValue={watchForm.certificateNumber}
        name="certificateNumber"
        label={translate('certificateNumber:label')}
        rules={{
          validate: {
            validateNumber: (value) =>
              validateCertificateNumber(value) || !!value.match(/^([Aa][Bb]\d{6})$/),
          },
        }}
      />
      {(offer.isTrailer || watchForm.towingCertificateNumber) && (
        <CertificateNumberInput
          defaultValue={watchForm.towingCertificateNumber}
          name="towingCertificateNumber"
          label={translate('towingCertificateNumber:label')}
          text={translate('towingCertificateNumber:tooltip')}
        />
      )}
      <TooltipInput
        name="idnp"
        type="tel"
        handleChange={handleChangeIdnp}
        control={control}
        defaultValue={watchForm.idnp}
        label={translate('idnp-or-idno')}
        rules={{ validate: { validateIdnx } }}
        autoComplete="on"
        errorText={
          (errors?.idnp?.type === 'validateIdnx' && translate('taxCode:error')) ||
          errors?.idnp?.message
        }
        inputProps={{ maxLength: 13 }}
        insuranceType={InsuranceType.GREEN_CARD}
      />
      <GreenCardValidity />
      {canLoadPrices && !isLoadingPrices && !!offer?.companies?.length && (
        <ResponsiveDatePicker {...datePickerOptions} />
      )}
      {isValidData && <OwnershipSelect />}
      {isValidData &&
      [OwnershipRights.Leasing, OwnershipRights.Lease].includes(watchForm?.ownership) ? (
        <>
          <TextInputController
            name="documentNumber"
            control={control}
            defaultValue={watchForm.documentNumber}
            label={translate('document-number')}
            errorText={errors?.documentNumber?.message}
          />
          <ResponsiveDatePicker {...documentDateOptions} />
        </>
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

      {canLoadPrices && (
        <PriceSummary
          isLoading={isLoadingPrices}
          details={{
            isTrailer: offer.isTrailer,
            certificateNumber: watchForm.certificateNumber,
            towingModel: watchForm.towingModel,
            towingPlateNumber: watchForm.towingPlateNumber,
            plateNumber: watchForm.plateNumber,
            contractorName: watchForm.contractorName,
            carModel: watchForm.carModel,
            contractorType: watchForm.contractorType,
            startDate: normalizeDate(watchForm.startDate) as Date,
            endDate: normalizeDate(watchForm.endDate) as Date,
            insuranceValidity: watchForm.insuranceValidity,
            priceEUR: watchForm.priceEUR ?? '',
            price: watchForm.price ?? '',
          }}
        />
      )}

      {errors?.form?.type === GreenCardErrorType.invalidData && (
        <p className="-mt-6 text-danger">{translate('invalidData')}</p>
      )}
      {errors?.form?.type === GreenCardErrorType.createFailed && (
        <p className="text-danger">{translate('create-order-error')}</p>
      )}

      {canLoadPrices && watchForm.price && !offer?.companies?.length && !isLoadingPrices && (
        <div className="inline-flex w-full justify-center text-black-lightest mt-10">
          {translate('no-offers')} 😞
        </div>
      )}

      {canLoadPrices && !isLoadingPrices && !!offer?.companies?.length && (
        <Companies
          offers={offer.companies}
          price={watchForm.insurancePrice}
          priceEUR={watchForm.priceEUR}
          defaultValue={watchForm.companyName}
          handleChange={(e) => setValue(e.target.name, `${e.target.value}`)}
          name="companyName"
        ></Companies>
      )}

      {canLoadPrices && !isLoadingPrices && !!offer?.companies?.length && <DamageAssistanceInput />}

      {/* {offer?.availableAddons?.length && !!offer?.companies?.length && !isLoadingPrices ? (
        <Addons
          selectedDate={watchForm.vignetteStartDate}
          allAddons={offer.availableAddons}
          onChange={updateAddons}
        />
      ) : null} */}

      {/* {watchForm?.addons?.length && !!offer?.companies?.length && !isLoadingPrices ? (
        <ResponsiveDatePicker {...vignetteDateOptions} />
      ) : (
        <></>
      )} */}

      {watchForm.zone === '3' && !!offer?.companies?.length && !isLoadingPrices && canLoadPrices ? (
        <div className="flex items-center">
          <p className="flex items-center mr-1">
            <SparklesIcon className="w-3 h-3 mr-1 text-pink" />
            {translate('recommended-rovignette')}
          </p>
          <TranslatedLink locale={locale} pageKey={'/rovinieta'}>
            <a target="_blank" rel="noreferrer" className="text-pink">
              {translate('here')}
            </a>
          </TranslatedLink>
          .
        </div>
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
