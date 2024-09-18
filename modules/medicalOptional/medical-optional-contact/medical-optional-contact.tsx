/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import { differenceInYears } from 'date-fns'
import { useRouter } from 'next/router'
import { useFormContext } from 'react-hook-form'
import { InputAdornment } from '@mui/material'

import * as fba from '../../../fba'
import * as fbq from '../../../fbq'
import * as ga from '../../../ga'
import { useMedicalOptionalConfirmation, useMedicalOptionalPreOrder } from '../hooks'
import { useMedicalOptionalContext } from '../medical-optional-context/medical-optional-context'
import { MedicalOptionalFormValues } from '../types'
import { MedicalOptionalErrorType } from '../types/medical-optional-errors'
import { CheckboxInput } from '~/components/mui/checkbox-input/checkbox-input'
import { EmailInput } from '~/components/mui/email-input/email-input'
import { PhoneInputComponent } from '~/components/mui/phone-input-component/phone-input-component'
import { SelectInputController } from '~/components/mui/select-input/select-input'
import { TextInputController } from '~/components/mui/text-input-controller/text-input-controller'
import { IsgButton } from '~/components/shared/isgButton/isgButton'
import { Spinner } from '~/components/shared/spinner/spinner'
import { useTranslation } from '~/context/LanguageContext'
import { medicalOptionalContractorDefault } from '~/modules/medical/utils/medical-contractor-default'
import { ContractorType, InsuranceType, ItemName } from '~/modules/shared/types/insurance'
import { getAddress } from '~/modules/utils/getAddress'
import { getCompany } from '~/services/firebase.service'
import { validateIdno } from '~/utils/validateIdnp'
import { InvoiceCheckbox } from '~/modules/shared/invoiceCheckbox/invoiceCheckbox'

export const MedicalOptionalContact = ({ price }): JSX.Element => {
  const { translate, locale } = useTranslation()
  const { basePath, push } = useRouter()

  const { confirm } = useMedicalOptionalConfirmation()
  const { createOrUpdate } = useMedicalOptionalPreOrder()
  const { preOrderId } = useMedicalOptionalContext()

  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingCompany, setIsLoadingCompany] = useState(false)

  const {
    handleSubmit,
    control,
    watch,
    trigger,
    getValues,
    setError,
    clearErrors,
    setValue,
    formState: { errors },
  } = useFormContext()

  const watchPhone = watch('phone')
  const watchEmail = watch('email')
  const companyName = watch('companyName')
  const watchPersons = watch('persons')
  const watchContractorIdnx = watch('idno')
  const watchContractorType = watch('contractorType')
  const watchContractorName = watch('contractorName')
  const watchFiscalInvoice = watch('fiscalInvoice')
  const isCompany = watchContractorType === ContractorType.COMPANY

  useEffect(() => {
    clearErrors('form')
  }, [watchPhone, watchEmail])

  useEffect(() => {
    setValue('fiscalInvoice', watchFiscalInvoice)
  }, [watchFiscalInvoice])

  useEffect(() => {
    const fetch = async () => {
      setIsLoadingCompany(true)
      const result = await getCompany(watchContractorIdnx)
      if (!result) {
        setError('idno', { message: translate('companyNotFound') })
        setValue('contractorName', '')
        setValue('contractorAddress', '')
      } else {
        setValue('contractorName', result?.ShortName)
        setValue('contractorAddress', getAddress(result?.Address))
      }
      setIsLoadingCompany(false)
    }

    if (isCompany && validateIdno(watchContractorIdnx)) {
      fetch()
    }
  }, [watchContractorIdnx, watchContractorType])

  const onSubmit = async () => {
    setIsLoading(true)

    const isValid = await trigger()
    if (!isValid) {
      setIsLoading(false)
      return
    }

    const updated = await createOrUpdate(getValues() as MedicalOptionalFormValues, preOrderId)
    if (!updated) {
      setError('form', { type: MedicalOptionalErrorType.confirmFailed })
      setIsLoading(false)
      return
    }

    const orderId = await confirm(preOrderId)
    if (!orderId) {
      setError('form', { type: MedicalOptionalErrorType.confirmFailed })
      setIsLoading(false)
      return
    }

    const pathname = locale === 'ro' ? basePath : `/${locale}`

    ga.addToCart(
      Number(price) / 100,
      orderId,
      ItemName[InsuranceType.MEDICAL_OPTIONAL],
      companyName
    )
    fbq.addToCart(
      Number(price) / 100,
      orderId,
      ItemName[InsuranceType.MEDICAL_OPTIONAL],
      companyName
    )
    fba.addToCart(
      Number(price) / 100,
      orderId,
      ItemName[InsuranceType.MEDICAL_OPTIONAL],
      companyName
    )
    push(`${pathname}/order?order=${orderId}`)
  }

  const handleChange = (e) => {
    setValue('contractorName', JSON.parse(e.target.value).fullName)
    setValue('idno', JSON.parse(e.target.value).idnx)
    setValue('contractorType', JSON.parse(e.target.value).contractorType)
    setValue('contractorAddress', JSON.parse(e.target.value).address)
  }

  const validateContractor = (value) => {
    const person = watchPersons.find((el) => el.idnp === JSON.parse(value).idnx)
    return person?.birthday && differenceInYears(new Date(), person.birthday) >= 18
  }

  const getItems = () => {
    return [
      ...watchPersons.map((value, index) => (
        <option
          disabled={differenceInYears(new Date(), value.birthday) < 18}
          key={index}
          value={`{"fullName":"${value.fullName}","idnx":"${value.idnp}","contractorType":"${ContractorType.INDIVIDUAL}","address":"${value.address}"}`}
          translate="no"
        >
          {value.fullName}
        </option>
      )),
      <option
        key={ContractorType.COMPANY}
        value={`{"fullName":"","idnx":"","contractorType":"${ContractorType.COMPANY}","address":""}`}
        translate="yes"
      >
        {translate('juridical-person')}
      </option>,
    ]
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <SelectInputController
        id="contractor"
        name="contractor"
        handleChange={handleChange}
        label={translate('payer')}
        control={control}
        defaultValue={JSON.stringify(medicalOptionalContractorDefault(watchPersons))}
        items={getItems()}
        errorMessage={
          errors.contractor?.type === 'validate'
            ? translate('contractor:error')
            : errors.email?.message
        }
        rules={{
          validate: {
            validate: validateContractor,
          },
        }}
      />

      {isCompany && (
        <TextInputController
          name="idno"
          control={control}
          defaultValue={watchContractorIdnx}
          label={translate('idno')}
          type="tel"
          autoComplete="on"
          inputProps={{ maxLength: 13 }}
          displayNameInInput={true}
          errorText={
            (errors?.idno?.type === 'validateIdno' && translate('taxCode:error')) ||
            errors?.idno?.message
          }
          helperText={
            (!isLoadingCompany && validateIdno(watchContractorIdnx) && watchContractorName) || ''
          }
          rules={{
            validate: {
              validateIdno,
            },
          }}
          InputProps={
            isLoadingCompany
              ? {
                  endAdornment: (
                    <InputAdornment position="end">
                      <Spinner />
                    </InputAdornment>
                  ),
                }
              : {}
          }
        />
      )}

      <PhoneInputComponent
        phone={watchPhone}
        control={control}
        errorMessage={
          errors.phone?.type === 'validate' ? translate('phoneNumber:error') : errors.phone?.message
        }
      />

      <EmailInput
        control={control}
        email={watchEmail}
        errorMessage={
          errors.email?.type === 'validate' ? translate('email:error') : errors.email?.message
        }
      />

      <CheckboxInput
        name="personalDataConsent"
        defaultValue={false}
        control={control}
        required={true}
        label={translate('personalDataConsent')}
      />

      {errors?.form?.type === MedicalOptionalErrorType.confirmFailed && (
        <p className="text-danger">{translate('confirm-order-error')}</p>
      )}

      {isCompany && (
        <InvoiceCheckbox
          name="fiscalInvoice"
          defaultValue={false}
          control={control}
          required={false}
        />
      )}

      <div className="flex justify-center mt-8">
        <IsgButton
          type="submit"
          imgSrc="/images/white-arrow.svg"
          text={translate('confirm')}
          isLoading={isLoading}
          disabled={isLoadingCompany}
          styleClass="py-4 h-12 sm:w-44 w-full"
        />
      </div>
    </form>
  )
}
