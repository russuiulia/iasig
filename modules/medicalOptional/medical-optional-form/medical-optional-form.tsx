/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import { differenceInCalendarDays, differenceInDays } from 'date-fns'
import { useRouter } from 'next/router'
import { useFormContext } from 'react-hook-form'

import * as fba from '../../../fba'
import * as fbq from '../../../fbq'
import * as ga from '../../../ga'
import { InsuranceValidity } from '../constants'
import {
  getEndDate,
  useMedicalOptionalOffers,
  useMedicalOptionalPreOrder,
  useMedicalOptionalValidations,
} from '../hooks'
import { useMedicalOptionalContext } from '../medical-optional-context/medical-optional-context'
import { MedicalOptionalSteps } from '../medical-optional-context/medical-optional-context.types'
import { MedicalOptionalPersons } from '../medical-optional-persons/medical-optional-persons'
import { MedicalOptionalErrorType } from '../types/medical-optional-errors'
import { CheckboxInput } from '~/components/mui/checkbox-input/checkbox-input'
import { COUNTRIES } from '~/components/mui/region-select/region-select.const'
import { ResponsiveDatePicker } from '~/components/mui/responsive-date-picker/responsive-date-picker'
import { SelectInputController } from '~/components/mui/select-input/select-input'
import { SelectMultipleInputController } from '~/components/mui/select-multiple-input/select-multiple-input'
import { EllipsisLoader } from '~/components/shared/EllipsisLoader/ellipsisLoader'
import { IsgButton } from '~/components/shared/isgButton/isgButton'
import { useTranslation } from '~/context/LanguageContext'
import { Companies } from '~/modules/shared/companies/companies'
import { OfferAmount } from '~/modules/shared/offerAmount/offerAmount'
import { InsuranceType, ItemName } from '~/modules/shared/types/insurance'
import { useFormPersist } from '~/utils/useFormPersist'

export const MedicalOptionalForm = (): JSX.Element => {
  const { translate } = useTranslation()
  const { setActiveStep, preOrderId } = useMedicalOptionalContext()
  const { pathname, replace } = useRouter()

  const [isLoading, setIsLoading] = useState(false)

  const {
    handleSubmit,
    control,
    watch,
    setError,
    setValue,
    clearErrors,
    trigger,
    formState: { errors },
  } = useFormContext()

  const { watchForm, clearStorage } = useFormPersist(InsuranceType.MEDICAL_OPTIONAL, preOrderId, {
    watch,
    setValue,
  })

  const watchInsuredAmount = watch('amount', '')
  const watchStartDate = watch('startDate')
  const watchInsuranceValidity = watch('insuranceValidity')

  const { createOrUpdate, loadPreOrder, isLoadingPreOrder } = useMedicalOptionalPreOrder()

  const {
    canLoadOffers: canLoadMedicalOptionalOffers,
    offers,
    visibleCompanies,
    isLoading: isLoadingOffers,
  } = useMedicalOptionalOffers(watchForm, isLoadingPreOrder)

  const canLoadOffers = canLoadMedicalOptionalOffers && !isLoadingOffers && !isLoadingPreOrder
  const { validateInsurance } = useMedicalOptionalValidations()

  useEffect(() => clearErrors(), [JSON.stringify(watchForm)])

  useEffect(() => {
    if (preOrderId) {
      loadPreOrder(preOrderId)
    }
  }, [preOrderId])

  useEffect(() => {
    if (watchStartDate && watchInsuranceValidity) {
      setValue(
        'insuredDays',
        Number(
          differenceInDays(getEndDate(watchStartDate, watchInsuranceValidity), watchStartDate) + 1
        )
      )
    }
  }, [watchInsuranceValidity, watchStartDate])

  useEffect(() => {
    if (!watchInsuredAmount) {
      return
    }

    if (!offers?.length) {
      return
    }

    setValue('companyName', null)

    const offerByAmount = offers.find((offer) => offer.amount === watchForm.amount)
    const offerByPrice = offerByAmount?.offers?.find((item) => item.price === watchForm.price)
    if (!offerByPrice) {
      setValue('companyName', null)
    }
  }, [watchInsuredAmount])

  useEffect(() => {
    setValue('companyName', null)
    setValue('amount', offers?.[0]?.amount)
    if (!offers?.length) {
      return
    }

    const offerByAmount = offers.find((offer) => offer.amount === watchForm.amount)
    if (!offerByAmount) {
      setValue('amount', offers?.[0]?.amount)
      setValue('companyName', null)
    }

    const offerByPrice = offerByAmount?.offers?.find((item) => item.price === watchForm.price)
    if (!offerByPrice) {
      setValue('companyName', null)
    }
  }, [offers])

  const onSubmit = async () => {
    setIsLoading(true)
    const isValid = await trigger()
    if (!isValid) {
      setIsLoading(false)
      return
    }

    const validation = validateInsurance(watchForm)
    if (!validation.isValid) {
      setError(validation.field as string, { type: validation.type }, { shouldFocus: true })
      setIsLoading(false)
      return
    }
    const updatedPreOrderId = await createOrUpdate(watchForm, preOrderId)
    if (!updatedPreOrderId) {
      setError('form', { type: MedicalOptionalErrorType.createFailed })
      setIsLoading(false)
      return
    }

    const price = Number(watchForm.price) / 100
    ga.lead(price, ItemName[InsuranceType.MEDICAL_OPTIONAL], watchForm.companyName)
    fba.lead(price, ItemName[InsuranceType.MEDICAL_OPTIONAL], watchForm.companyName)
    fbq.lead(price, ItemName[InsuranceType.MEDICAL_OPTIONAL], watchForm.companyName)

    setIsLoading(false)
    replace(`${pathname}?order=${updatedPreOrderId}`)
    setActiveStep(MedicalOptionalSteps.Person)
    clearStorage()
  }

  const onPersonAction = () => {
    clearErrors()
  }

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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <SelectInputController
        id="nationality"
        name="nationalityCode"
        label={translate('nationality')}
        control={control}
        items={[
          <option aria-label="None" key={'none'} value="" />,
          ...COUNTRIES.map((value) => (
            <option key={value} value={value}>
              {translate(`${value}`)}
            </option>
          )),
        ]}
        errorMessage={errors?.nationalityCode?.message}
      />

      <ResponsiveDatePicker {...datePickerOptions} />
      <SelectInputController
        id="insuranceValidity"
        name="insuranceValidity"
        label={translate('period')}
        control={control}
        items={[
          <option aria-label="None" key={'none'} value="" />,
          ...InsuranceValidity.map((value) => (
            <option key={value} value={value}>
              {value} {value === '1' ? translate('month') : translate('months')}
            </option>
          )),
        ]}
        errorMessage={errors?.insuranceValidity?.message}
      />

      <MedicalOptionalPersons onAction={onPersonAction} />
      {errors?.persons?.type === MedicalOptionalErrorType.required && (
        <p className="text-danger">{translate('persons:required')}</p>
      )}

      <SelectMultipleInputController
        label={translate('riskFactors')}
        id="multipleRisksSelect"
        control={control}
        name="riskFactors"
        items={['HWC', 'PCD']}
      />

      <div className="mt-8">
        <CheckboxInput
          name="includeAdditionalRisk"
          defaultValue={false}
          control={control}
          label={translate('inpatient-treatment')}
        />

        {(isLoadingOffers || isLoadingPreOrder) && (
          <div className="inline-flex w-full justify-center italic text-blue-200 mt-10">
            {translate('offers-loading')} <EllipsisLoader />
          </div>
        )}

        {canLoadOffers && !offers?.length && (
          <div className="inline-flex w-full justify-center text-black-lightest mt-10">
            {translate('no-offers')} 😞
          </div>
        )}

        {canLoadOffers && !!offers?.length && (
          <>
            <OfferAmount
              control={control}
              offers={offers}
              errorMessage={errors?.amount?.message}
              currency="MDL"
            />

            {!!visibleCompanies?.length && (
              <>
                <Companies
                  offers={visibleCompanies}
                  insuranceType={InsuranceType.MEDICAL_OPTIONAL}
                  price={watchForm.price}
                  handleChange={(e) => setValue(e.target.name, `${e.target.value}`)}
                  name="companyName"
                  defaultValue={watchForm.companyName}
                  id="medical-companies"
                />
              </>
            )}
          </>
        )}
      </div>

      {errors?.form?.type === MedicalOptionalErrorType.createFailed && (
        <p className="text-danger">{translate('create-order-error')}</p>
      )}

      <div className="flex justify-center mt-8">
        <IsgButton
          type="submit"
          imgSrc="/images/white-arrow.svg"
          text={translate('next')}
          isLoading={isLoading}
          disabled={isLoadingOffers}
          styleClass="py-4 h-12 sm:w-44 w-full"
        />
      </div>
    </form>
  )
}
