/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'

import { useRealEstatePreOrder, useRealEstateValidations } from '../hooks'
import { useRealEstateContext } from '../real-estate-context/real-estate-context'
import { RealEstateSteps } from '../real-estate-context/real-estate-context.types'
import { PriceSummary } from '../real-estate-price-summary/real-estate-price-summary'
import { RealEstateErrorType, RealEstateFormValues } from '../types'
import { InputMaskController } from '~/components/isgInputMask/isgInputMask'
import { CheckboxInput } from '~/components/mui/checkbox-input/checkbox-input'
import { IdnpInput } from '~/components/mui/idnp-input/idnp-input'
import { TextInputController } from '~/components/mui/text-input-controller/text-input-controller'
import { IsgButton } from '~/components/shared/isgButton/isgButton'
import { useTranslation } from '~/context/LanguageContext'
import { getRealEstate } from '~/services/real-estate.services'
import { getAddress, getCadastralCodeMask, isValidCadastralCode } from '~/utils/realEstate'
import { validateName } from '~/utils/validateName'

export const BeneficiaryForm = (): JSX.Element => {
  const { translate } = useTranslation()
  const { setActiveStep, preOrderId } = useRealEstateContext()

  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingAddress, setIsLoadingAddress] = useState(false)
  const [address, setAddress] = useState('')

  const {
    handleSubmit,
    watch,
    setError,
    clearErrors,
    control,
    formState: { errors },
  } = useFormContext()

  const watchForm = watch() as RealEstateFormValues

  const { createOrUpdate, loadPreOrder } = useRealEstatePreOrder()

  const { validateInsurance } = useRealEstateValidations()

  useEffect(() => clearErrors('form'), [JSON.stringify(watchForm)])

  useEffect(() => {
    if (preOrderId) {
      loadPreOrder(preOrderId)
    }
  }, [preOrderId])

  const onSubmit = async () => {
    setIsLoading(true)

    const validation = validateInsurance(watchForm)
    if (!validation.isValid) {
      setError(validation.field as string, { type: validation.type }, { shouldFocus: true })
      setIsLoading(false)
      return
    }

    const updatedPreOrderId = await createOrUpdate(watchForm, preOrderId)
    if (!updatedPreOrderId) {
      setError('form', { type: RealEstateErrorType.updateFailed })
      setIsLoading(false)
      return
    }

    setIsLoading(false)
    setActiveStep(RealEstateSteps.Confirmation)
  }

  useEffect(() => {
    const fetch = async () => {
      setIsLoadingAddress(true)
      const result = await getRealEstate(watchForm.cadastralCode)
      if (!result) {
        setError('form', { type: RealEstateErrorType.realEstateNotFound })
      } else {
        setAddress(getAddress(result))
      }
      setIsLoadingAddress(false)
    }

    if (watchForm.personalDataConsent && isValidCadastralCode?.(watchForm?.cadastralCode)) {
      fetch()
    }
  }, [watchForm.cadastralCode, watchForm.personalDataConsent])

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <InputMaskController
        name="cadastralCode"
        control={control}
        label={translate('cadastralCode')}
        defaultValue={watchForm.cadastralCode}
        errorText={errors?.cadastralCode?.message}
        mask={getCadastralCodeMask(watchForm.realEstateType)}
      />
      <TextInputController
        name="fullName"
        control={control}
        defaultValue={watchForm?.fullName}
        label={translate('fullName')}
        rules={{
          validate: {
            validateName,
          },
        }}
        errorText={
          (errors?.fullName?.type === 'validateName' && translate('fullName:error')) ||
          errors?.fullName?.message
        }
      />
      <IdnpInput defaultValue={watchForm?.idnp} label="contractor-idnp" />
      <TextInputController
        name="identitySeries"
        control={control}
        defaultValue={watchForm.identitySeries}
        label={translate('identity-series')}
        errorText={errors?.identitySeries?.message}
      />
      <TextInputController
        name="contractorAddress"
        control={control}
        defaultValue={watchForm.contractorAddress}
        label={translate('contractor-address')}
        errorText={errors?.contractorAddress?.message}
      />

      {watchForm.personalDataConsent && isValidCadastralCode?.(watchForm?.cadastralCode) && (
        <PriceSummary details={{ ...watchForm, address }} isLoading={isLoadingAddress} />
      )}

      <CheckboxInput
        name="personalDataConsent"
        defaultValue={false}
        control={control}
        required={true}
        label={translate('personalDataConsent')}
      />

      {errors?.form?.type === RealEstateErrorType.updateFailed && (
        <p className="text-danger">{translate('update-order-error')}</p>
      )}

      {errors?.form?.type === RealEstateErrorType.realEstateNotFound && (
        <p className="text-danger">{translate('real-estate-error')}</p>
      )}

      <div className="flex justify-center mt-8">
        <IsgButton
          type="submit"
          imgSrc="/images/white-arrow.svg"
          text={translate('next')}
          isLoading={isLoading}
          disabled={isLoadingAddress}
          styleClass="py-4 h-12 sm:w-44 w-full"
        />
      </div>
    </form>
  )
}
