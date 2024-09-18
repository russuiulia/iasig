/* eslint-disable react-hooks/exhaustive-deps */
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { CertificateNumberInput } from '~/components/mui/certificate-number-input/certificate-number-input'
import { CheckboxInput } from '~/components/mui/checkbox-input/checkbox-input'
import { IsgButton } from '~/components/shared/isgButton/isgButton'
import { useTranslation } from '~/context/LanguageContext'
import { ContractorType, InsuranceType, ItemName } from '~/modules/shared/types/insurance'
import { useFormPersist } from '~/utils/useFormPersist'

import { LocalitySelect } from '~/components/mui/locality-select/locality-select'
import { TextInputController } from '~/components/mui/text-input-controller/text-input-controller'
import { TooltipInput } from '~/components/mui/tooltip-input/tooltip-input'
import {
  validateCertificateNumber,
  validateProvisionallyCertNr,
} from '~/utils/validateCertificateNumber'
import { validateIdno, validateIdnp, validateIdnx } from '~/utils/validateIdnp'
import { validateName } from '~/utils/validateName'
import * as fba from '../../../fba'
import * as fbq from '../../../fbq'
import * as ga from '../../../ga'
import { useRoadTaxPreOrder, useRoadTaxPrices, useRoadTaxValidations } from '../hooks'
import { useRoadTaxContext } from '../road-tax-context/road-tax-context'
import { RoadTaxSteps } from '../road-tax-context/road-tax-context.types'
import { PriceSummary } from '../road-tax-price-summary/road-tax-price-summary'
import { RoadTaxErrorType } from '../types'

export const RoadTaxForm = (): JSX.Element => {
  const { translate } = useTranslation()
  const { setActiveStep } = useRoadTaxContext()
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
  const { createOrUpdate } = useRoadTaxPreOrder()

  const { watchForm, clearStorage } = useFormPersist(
    InsuranceType.ROAD_TAX,
    query?.order,
    {
      watch,
      setValue,
    },
    { exclude: [] }
  )

  const { offer, isLoading: isLoadingPrices, canLoadPrices } = useRoadTaxPrices(watchForm, setValue)
  const { validateInsurance } = useRoadTaxValidations()

  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => clearErrors('form'), [JSON.stringify(watchForm)])

  useEffect(() => {
    setValue('region', watchForm?.locality?.group || '')
    setValue('localityId', watchForm?.locality?.localityId || null)
    setValue('localityName', watchForm?.locality?.name || '')
  }, [watchForm.locality])

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
      setError('form', { type: RoadTaxErrorType.createFailed })
      return
    }

    fba.lead(Number(watchForm.price) / 100, ItemName[InsuranceType.ROAD_TAX], 'iAsig')
    ga.lead(Number(watchForm.price) / 100, ItemName[InsuranceType.ROAD_TAX], 'iAsig')
    fbq.lead(Number(watchForm.price) / 100, ItemName[InsuranceType.ROAD_TAX], 'iAsig')

    setIsLoading(false)
    replace(`${pathname}?order=${updatedPreOrderId}`)
    setActiveStep(RoadTaxSteps.Confirmation)
    clearStorage()
  }

  const handleChangeIdnx = async (e) => {
    clearErrors('idnp')
    setValue('fullName', '')
    if (e?.target?.value?.length === 13) {
      await trigger('idnp')
    }
  }

  const isIdnpValid = useMemo(() => {
    if (!watchForm.idnp) return false

    if (validateIdnp(watchForm.idnp)) {
      setValue('contractorType', ContractorType.INDIVIDUAL)
      return true
    } else if (validateIdno(watchForm.idnp)) {
      setValue('contractorType', ContractorType.COMPANY)
      return false
    } else {
      setValue('contractorType', '')
      return false
    }
  }, [watchForm.idnp])

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pb-40">
      <CertificateNumberInput
        name="certificateNumber"
        label={translate('vehicle:certificateNumber:label')}
        defaultValue={watchForm.certificateNumber}
        src="/images/nr-certificat-inmatriculare.jpg"
        maxLength={10}
        rules={{
          validate: {
            validateNumber: (value) =>
              validateCertificateNumber(value) || validateProvisionallyCertNr(value),
          },
        }}
        type="text"
      />

      <TooltipInput
        name="idnp"
        type="tel"
        handleChange={handleChangeIdnx}
        control={control}
        defaultValue={watchForm.idnp}
        label={translate('idnx')}
        rules={{ validate: { validateIdnx } }}
        autoComplete="on"
        errorText={
          (errors?.idnp?.type === 'validateIdnx' && translate('taxCode:error')) ||
          errors?.idnp?.message
        }
        inputProps={{ maxLength: 13 }}
        insuranceType={InsuranceType.ROAD_TAX}
      />

      {isIdnpValid && (
        <TextInputController
          name="fullName"
          control={control}
          defaultValue={watchForm?.fullName}
          label={translate('fullName-payer')}
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
      )}

      <LocalitySelect
        setValue={setValue}
        control={control}
        errorMessage={errors?.locality?.message}
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
            certificateNumber: watchForm.certificateNumber,
            price: offer.price,
            carModel: watchForm.carModel,
            plateNumber: watchForm.plateNumber,
            contractorType: watchForm.contractorType,
            fullName: watchForm.fullName,
          }}
        />
      )}

      {errors?.form?.type === RoadTaxErrorType.invalidData && (
        <p className="-mt-6 text-danger">{translate('invalidData')}</p>
      )}
      {errors?.form?.type === RoadTaxErrorType.createFailed && (
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
