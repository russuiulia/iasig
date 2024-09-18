/* eslint-disable react-hooks/exhaustive-deps */
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { CertificateNumberInput } from '~/components/mui/certificate-number-input/certificate-number-input'
import { CheckboxInput } from '~/components/mui/checkbox-input/checkbox-input'
import { OwnershipSelect } from '~/components/mui/ownership-select/ownership-select'
import { SelectInputController } from '~/components/mui/select-input/select-input'
import { TextInputController } from '~/components/mui/text-input-controller/text-input-controller'
import { TooltipInput } from '~/components/mui/tooltip-input/tooltip-input'
import { IsgButton } from '~/components/shared/isgButton/isgButton'
import { OperatingModes, RcaValidity } from '~/constants/rca'
import { useTranslation } from '~/context/LanguageContext'
import { calculateEndDate } from '~/modules/greenCard/utils/calculate-end-date'
import { Companies } from '~/modules/shared/companies/companies'
import { InsuranceType, ItemName } from '~/modules/shared/types/insurance'
import { useFormPersist } from '~/utils/useFormPersist'
import {
  validateCertificateNumber,
  validateProvisionallyCertNr,
} from '~/utils/validateCertificateNumber'
import { validateIdno, validateIdnx } from '~/utils/validateIdnp'
import * as fba from '../../../fba'
import * as fbq from '../../../fbq'
import * as ga from '../../../ga'
import { RcaCompanies } from '../constants/rca-companies-constants'
import { useRcaPreOrder, useRcaPrice, useRcaValidations } from '../hooks'
import { useRcaContext } from '../rca-context/rca-context'
import { RcaSteps } from '../rca-context/rca-context.types'
import { RcaPriceSummary } from '../rca-price-summary/rca-price-summary'
import { RcaErrors } from '../types/rca-errors.types'
import { OwnershipRights } from '../types/rca-form.types'
import { RcaDocumentDatePicker } from './rca-document-date'
import { RcaStartDatePicker } from './rca-start-date-picker'

export const RcaForm = (): JSX.Element => {
  const { translate } = useTranslation()
  const { setActiveStep } = useRcaContext()
  const { pathname, replace, query } = useRouter()

  const {
    handleSubmit,
    control,
    watch,
    setError,
    clearErrors,
    setValue,
    trigger,
    formState: { errors },
  } = useFormContext()

  const { watchForm, clearStorage } = useFormPersist(InsuranceType.RCA, query?.order, {
    watch,
    setValue,
  })

  const { canLoadPrice, price: offer, isLoading: isLoadingPrice } = useRcaPrice(watchForm, setValue)
  const [isLoading, setIsLoading] = useState(false)

  const { createOrUpdate } = useRcaPreOrder()
  const { validateInsurance } = useRcaValidations(offer.validData)

  const isValidData = offer.validData === false

  useEffect(() => clearErrors('form'), [JSON.stringify(watchForm)])

  useEffect(() => {
    if (validateIdno(watchForm.idnp)) {
      setValue('operatingMode', 'normal')
    } else {
      setValue('operatingMode', '')
    }
  }, [watchForm.idnp])

  useEffect(() => {
    if (offer.isVehicleProbe === undefined) return

    if (offer.isVehicleProbe === false) {
      setValue('insuranceValidity', '365')
    } else {
      setValue('insuranceValidity', '30')
    }
  }, [watchForm.certificateNumber, offer.isVehicleProbe])

  useEffect(() => {
    setValue('endDate', calculateEndDate(watchForm.startDate as Date, watchForm.insuranceValidity))
  }, [watchForm.startDate, watchForm.insuranceValidity])

  useEffect(() => {
    setValue('documentDate', null)
    setValue('documentNumber', '')
  }, [watchForm.ownership])

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

    if (!watchForm.price) {
      setIsLoading(false)
      setError('form', { type: RcaErrors.priceRequired })
      return
    }
    const updatedPreOrderId = await createOrUpdate(watchForm, query?.order as string)
    if (!updatedPreOrderId) {
      setIsLoading(false)
      setError('form', { type: RcaErrors.createFailed })
      return
    }

    ga.lead(Number(watchForm.price) / 100, ItemName[InsuranceType.RCA], watchForm.companyName)
    fba.lead(Number(watchForm.price) / 100, ItemName[InsuranceType.RCA], watchForm.companyName)
    fbq.lead(Number(watchForm.price) / 100, ItemName[InsuranceType.RCA], watchForm.companyName)

    setIsLoading(false)
    replace(`${pathname}?order=${updatedPreOrderId}`)
    setActiveStep(RcaSteps.Confirmation)
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
      <CertificateNumberInput
        name="certificateNumber"
        label={translate('certificateNumber:label')}
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

      {(offer.isTrailer || watchForm.towingCertificateNumber) && (
        <CertificateNumberInput
          defaultValue={watchForm.towingCertificateNumber}
          name="towingCertificateNumber"
          label={translate('towingCertificateNumber:label')}
          src="/images/nr-certificat-inmatriculare.jpg"
          maxLength={10}
          rules={{
            validate: {
              validateNumber: (value) =>
                validateCertificateNumber(value) || validateProvisionallyCertNr(value),
            },
          }}
          type="text"
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

      {watchForm.price ? <RcaStartDatePicker startDate={watchForm.startDate} /> : <></>}

      {validateIdno(watchForm.idnp) && (
        <SelectInputController
          id="operatingMode"
          name="operatingMode"
          label={translate('operatingMode:label')}
          control={control}
          items={[
            ...OperatingModes.map((value) => (
              <option key={value} value={value}>
                {translate(`operatingMode:${value}`)}
              </option>
            )),
          ]}
          errorMessage={errors?.operatingMode?.message}
        />
      )}

      {isValidData && <OwnershipSelect />}

      {isValidData &&
        [OwnershipRights.Leasing, OwnershipRights.Lease].includes(watchForm?.ownership) && (
          <>
            <TextInputController
              name="documentNumber"
              control={control}
              defaultValue={watchForm.documentDate}
              label={translate('document-number')}
              errorText={errors?.documentNumber?.message}
            />
            <RcaDocumentDatePicker documentDate={watchForm.documentDate} />
          </>
        )}

      {offer.isVehicleProbe === true ? (
        <SelectInputController
          id="insuranceValidity"
          name="insuranceValidity"
          label={translate('validity:label')}
          control={control}
          items={RcaValidity.map((value) => (
            <option key={value} value={value}>
              {translate(`validity:${value}`)}
            </option>
          ))}
          errorMessage={errors?.insuranceValidity?.message}
        />
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

      {canLoadPrice && (
        <RcaPriceSummary
          isLoading={isLoadingPrice}
          details={{
            isTrailer: offer.isTrailer,
            certificateNumber: watchForm.certificateNumber,
            towingModel: watchForm.towingModel,
            towingPlateNumber: watchForm.towingPlateNumber,
            plateNumber: watchForm.plateNumber,
            carModel: watchForm.carModel,
            startDate: watchForm.startDate,
            endDate: watchForm.endDate,
            price: watchForm.price ?? '',
            contractorName: watchForm.contractorName,
            contractorType: watchForm.contractorType,
            insuranceValidity: watchForm.insuranceValidity,
          }}
        />
      )}

      {errors?.form?.type === RcaErrors.invalidData && (
        <p className="-mt-6 text-danger">{translate('invalidData')}</p>
      )}
      {errors?.form?.type === RcaErrors.createFailed && (
        <p className="text-danger">{translate('create-order-error')}</p>
      )}

      {canLoadPrice && !isLoadingPrice && watchForm.price ? (
        <Companies
          offers={RcaCompanies}
          price={watchForm.price}
          handleChange={(e) => setValue(e.target.name, `${e.target.value}`)}
          name="companyName"
          defaultValue={watchForm.companyName}
        ></Companies>
      ) : (
        <></>
      )}

      <div className="flex justify-center mt-8">
        <IsgButton
          type="submit"
          imgSrc="/images/white-arrow.svg"
          text={translate('next')}
          isLoading={isLoading}
          disabled={isLoadingPrice}
          styleClass="py-4 h-12 sm:w-44 w-full"
        />
      </div>
    </form>
  )
}
