/* eslint-disable react-hooks/exhaustive-deps */
import { differenceInCalendarDays, differenceInDays } from 'date-fns'
import { useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { ResponsiveDatePicker } from '~/components/mui/responsive-date-picker/responsive-date-picker'
import { IsgButton } from '~/components/shared/isgButton/isgButton'
import { useTranslation } from '~/context/LanguageContext'
import { Companies } from '~/modules/shared/companies/companies'
import { useRealEstateContext } from '../real-estate-context/real-estate-context'
import { RealEstateSteps } from '../real-estate-context/real-estate-context.types'
import { RealEstateValidity } from '../real-estate-validity/real-estate-validity'
import { useRealEstatePreOrder, useRealEstateOffers, useRealEstateValidations } from '../hooks'
import { RealEstateErrorType } from '../types'
import { useFormPersist } from '~/utils/useFormPersist'
import { InsuranceType, ItemName } from '~/modules/shared/types/insurance'
import { SelectInputController } from '~/components/mui/select-input/select-input'
import {
  InsuredValues,
  RealEstate,
  Beneficiary,
  BeneficiaryCode,
  InsuredValuesType,
} from './real-estate-form.constants'
import { RealEstateValueInput } from '../real-estate-value-input/real-estate-value-input'
import { useRouter } from 'next/router'
import { calculateEndDate } from '../utils/calculate-end-date'
import { TextInputController } from '~/components/mui/text-input-controller/text-input-controller'
import { EllipsisLoader } from '~/components/shared/EllipsisLoader/ellipsisLoader'
import * as ga from '../../../ga'
import * as fbq from '../../../fbq'
import * as fba from '../../../fba'

export const RealEstateForm = (): JSX.Element => {
  const { translate } = useTranslation()
  const { setActiveStep, preOrderId } = useRealEstateContext()
  const { pathname, replace, isReady } = useRouter()

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

  const { watchForm, clearStorage } = useFormPersist(InsuranceType.REAL_ESTATE, preOrderId, {
    watch,
    setValue,
  })

  const { insuredValue, marketValue, replacementCost, amount, startDate, insuranceValidity } =
    watchForm

  const { createOrUpdate, loadPreOrder, isLoadingPreOrder } = useRealEstatePreOrder()

  const {
    canLoadOffers: canLoadRealEstateOffers,
    offers,
    visibleCompanies,
    isLoading: isLoadingOffers,
  } = useRealEstateOffers(watchForm, isLoadingPreOrder)

  const canLoadOffers = canLoadRealEstateOffers && !isLoadingOffers && !isLoadingPreOrder
  const { validateInsurance } = useRealEstateValidations()

  useEffect(() => clearErrors(), [JSON.stringify(watchForm)])

  useEffect(() => {
    if (preOrderId) {
      loadPreOrder(preOrderId)
    }
  }, [preOrderId])

  useEffect(() => {
    if (startDate && insuranceValidity) {
      const endDate = calculateEndDate(startDate as Date, insuranceValidity)
      setValue('endDate', endDate)
      setValue('insuredDays', Number(differenceInDays(endDate as Date, startDate) + 1))
    }
  }, [insuranceValidity, startDate])

  useEffect(() => {
    if (isReady) {
      setValue('cadastralCode', '')
    }
  }, [isReady, watchForm.realEstateType])

  useEffect(() => {
    setValue(
      'amount',
      insuredValue === InsuredValuesType.MARKET_VALUE ? marketValue : replacementCost
    )
  }, [insuredValue, marketValue, replacementCost])

  useEffect(() => {
    if (!amount) {
      return
    }

    if (!offers?.length) {
      return
    }

    setValue('companyName', '')

    const offerByAmount = offers.find((offer) => offer.amount === watchForm.amount)
    const offerByPrice = offerByAmount?.offers?.find((item) => item.price === watchForm.price)
    if (!offerByPrice) {
      setValue('companyName', '')
    }
  }, [amount])

  useEffect(() => {
    setValue('companyName', '')
    setValue('amount', offers?.[0]?.amount)
    if (!offers?.length) {
      return
    }

    const offerByAmount = offers.find((offer) => offer.amount === watchForm.amount)
    if (!offerByAmount) {
      setValue('amount', offers?.[0]?.amount)
      setValue('companyName', '')
    }

    const offerByPrice = offerByAmount?.offers?.find((item) => item.price === watchForm.price)
    if (!offerByPrice) {
      setValue('companyName', '')
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
      setError('form', { type: RealEstateErrorType.createFailed })
      setIsLoading(false)
      return
    }

    const price = Number(watchForm.price) / 100
    ga.lead(price, ItemName[InsuranceType.REAL_ESTATE], watchForm.companyName)
    fba.lead(price, ItemName[InsuranceType.REAL_ESTATE], watchForm.companyName)
    fbq.lead(price, ItemName[InsuranceType.REAL_ESTATE], watchForm.companyName)

    setIsLoading(false)
    replace(`${pathname}?order=${updatedPreOrderId}`)
    setActiveStep(RealEstateSteps.Contractor)
    clearStorage()
  }

  const datePickerOptions = {
    label: translate('startDate'),
    name: 'startDate',
    inputFormat: 'dd.MM.yyyy',
    value: startDate,
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
        id="realEstateType"
        name="realEstateType"
        label={translate('realEstateType')}
        control={control}
        items={[
          <option aria-label="None" key={'none'} value="" />,
          ...RealEstate.map((value) => (
            <option key={value} value={value}>
              {translate(value)}
            </option>
          )),
        ]}
        errorMessage={errors?.realEstateType?.message}
      />

      <SelectInputController
        id="insuredValue"
        name="insuredValue"
        label={translate('insuredValue:label')}
        control={control}
        items={[
          ...InsuredValues.map((value) => (
            <option key={value} value={value}>
              {translate(`insuredValue:${value}`)}
            </option>
          )),
        ]}
        errorMessage={errors?.insuredValue?.message}
      />

      <RealEstateValueInput
        insuredValue={insuredValue}
        marketValue={marketValue}
        replacementCost={replacementCost}
      />

      <ResponsiveDatePicker {...datePickerOptions} />
      <RealEstateValidity />

      <SelectInputController
        id="beneficiary"
        name="beneficiary"
        label={translate('beneficiary:label')}
        control={control}
        items={[
          <option aria-label="None" key={'none'} value="" />,
          ...Beneficiary.map((value) => (
            <option
              key={value}
              value={value}
              translate={`${value === BeneficiaryCode.OTHER ? 'yes' : 'no'}`}
            >
              {translate(`beneficiary:${value}`)}
            </option>
          )),
        ]}
        errorMessage={errors?.beneficiary?.message}
      />

      {watchForm?.beneficiary === BeneficiaryCode.OTHER && (
        <TextInputController
          name="beneficiaryName"
          control={control}
          defaultValue={watchForm?.beneficiaryName}
          label={translate('beneficiaryName:label')}
          errorText={errors?.beneficiaryName?.message}
        />
      )}

      {errors?.form?.type === RealEstateErrorType.createFailed && (
        <p className="text-danger">{translate('create-order-error')}</p>
      )}

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
          {!!visibleCompanies?.length && (
            <>
              <Companies
                offers={visibleCompanies}
                insuranceType={InsuranceType.REAL_ESTATE}
                price={watchForm.price}
                handleChange={(e) => setValue(e.target.name, `${e.target.value}`)}
                name="companyName"
                defaultValue={watchForm.companyName}
                id="real-estate-companies"
              />

              {watchForm.companyName &&
                translate(`${watchForm.companyName}:franchise`) !==
                  `${watchForm.companyName}:franchise` && (
                  <div className="mt-4">
                    <p className="whitespace-pre-line italic text-xs text-justify">
                      {translate(`${watchForm.companyName}:franchise`)}
                    </p>
                  </div>
                )}
            </>
          )}
        </>
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
