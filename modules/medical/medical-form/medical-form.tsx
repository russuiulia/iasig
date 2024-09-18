/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useFormContext } from 'react-hook-form'
import { AiFillQuestionCircle } from 'react-icons/ai'

import * as fba from '../../../fba'
import * as fbq from '../../../fbq'
import * as ga from '../../../ga'
import { useMedicalOffers, useMedicalPreOrder, useMedicalValidations } from '../hooks'
import { MedicalCompanies } from '../medical-companies/medical-companies'
import { useMedicalContext } from '../medical-context/medical-context'
import { MedicalSteps } from '../medical-context/medical-context.types'
import { MultiplePeriod } from '../medical-multiple-trip-period/medical-multiple-trip-period'
import { MedicalPersons } from '../medical-persons/medical-persons'
import { SingleTripPeriod } from '../medical-single-trip-period/medical-single-trip-period'
import { MedicalErrorType } from '../types/medical-errors'
import { BasicTooltip } from '~/components/basicTooltip/basicTooltip'
import { CheckboxInput } from '~/components/mui/checkbox-input/checkbox-input'
import { RegionSelect } from '~/components/mui/region-select/region-select'
import { EllipsisLoader } from '~/components/shared/EllipsisLoader/ellipsisLoader'
import { IsgButton } from '~/components/shared/isgButton/isgButton'
import { Companies } from '~/constants/companies'
import { useTranslation } from '~/context/LanguageContext'
import { OfferAmount } from '~/modules/shared/offerAmount/offerAmount'
import { InsuranceType, ItemName } from '~/modules/shared/types/insurance'
import { useFormPersist } from '~/utils/useFormPersist'

export const MedicalForm = (): JSX.Element => {
  const { translate } = useTranslation()
  const { setActiveStep, preOrderId } = useMedicalContext()
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

  const { watchForm, clearStorage } = useFormPersist(InsuranceType.MEDICAL, preOrderId, {
    watch,
    setValue,
  })

  const watchIsMultipleType = watch('isMultipleType', false)
  const watchInsuredAmount = watch('amount', '')
  const watchCompany = watch('companyName')
  const includeCovidRisk = watch('includeCovidRisk', false)
  const { createOrUpdate, loadPreOrder, isLoadingPreOrder } = useMedicalPreOrder()

  const {
    canLoadOffers: canLoadMedicalOffers,
    offers,
    visibleCompanies,
    isLoading: isLoadingOffers,
  } = useMedicalOffers(watchForm, isLoadingPreOrder)

  const canLoadOffers = canLoadMedicalOffers && !isLoadingOffers && !isLoadingPreOrder
  const { validateInsurance } = useMedicalValidations()

  useEffect(() => clearErrors(), [JSON.stringify(watchForm)])

  useEffect(() => {
    if (preOrderId) {
      loadPreOrder(preOrderId)
    }
  }, [preOrderId])

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
      setError('form', { type: MedicalErrorType.createFailed })
      setIsLoading(false)
      return
    }

    const price = Number(watchForm.priceEUR) * 0.2
    ga.lead(price, ItemName[InsuranceType.MEDICAL], watchForm.companyName)
    fba.lead(price, ItemName[InsuranceType.MEDICAL], watchForm.companyName)
    fbq.lead(price, ItemName[InsuranceType.MEDICAL], watchForm.companyName)

    setIsLoading(false)
    replace(`${pathname}?order=${updatedPreOrderId}`)
    setActiveStep(MedicalSteps.InsuranceDetails)
    clearStorage()
  }

  const onPersonAction = () => {
    clearErrors()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <RegionSelect setValue={setValue} control={control} errorMessage={errors?.regions?.message} />
      <div className="flex">
        <CheckboxInput
          name="isMultipleType"
          marginRight="8px"
          cssClass="mb-0"
          defaultValue={false}
          control={control}
          label={translate('multiple-travel')}
          handleChange={() => {
            if (!watchIsMultipleType) {
              setValue('insuranceValidity', '')
              setValue('insuredDays', '')
            }
          }}
        />
        <BasicTooltip title={translate('multiple-trip-info')}>
          <AiFillQuestionCircle />
        </BasicTooltip>
      </div>

      {watchIsMultipleType ? <MultiplePeriod /> : <SingleTripPeriod />}

      <MedicalPersons onAction={onPersonAction} />
      {errors?.persons?.type === MedicalErrorType.required && (
        <p className="text-danger">{translate('persons:required')}</p>
      )}

      <div className="mt-8">
        <CheckboxInput
          name="includeCovidRisk"
          defaultValue={false}
          control={control}
          label={translate('covid-risk')}
          cssClass="mb-2"
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
            <OfferAmount control={control} offers={offers} errorMessage={errors?.amount?.message} />

            {!!visibleCompanies?.length && (
              <>
                <MedicalCompanies
                  offers={visibleCompanies}
                  handleChange={(e) => setValue(e.target.name, `${e.target.value}`)}
                  name="companyName"
                  defaultValue={watchForm.companyName}
                  id="medical-companies"
                  includeCovidRisk={includeCovidRisk}
                />
                {watchCompany && (
                  <div
                    className="mt-4"
                    dangerouslySetInnerHTML={{
                      __html: translate(
                        (watchCompany === Companies.Grawe ? `${watchCompany}:` : '') +
                          `insurance:info`
                      ),
                    }}
                  />
                )}
              </>
            )}
          </>
        )}
      </div>

      {errors?.form?.type === MedicalErrorType.createFailed && (
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
