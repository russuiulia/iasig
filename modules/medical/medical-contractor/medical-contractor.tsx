/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import { differenceInYears } from 'date-fns'
import { useRouter } from 'next/router'
import { useFormContext } from 'react-hook-form'
import { InputAdornment } from '@mui/material'

import * as fba from '../../../fba'
import * as fbq from '../../../fbq'
import * as ga from '../../../ga'
import { ContractorBirthday } from '../contractor-birthday/contractor-birthday'
import { useMedicalConfirmation, useMedicalPreOrder } from '../hooks'
import { useMedicalContext } from '../medical-context/medical-context'
import { MedicalFormValues } from '../types'
import { MedicalErrorType } from '../types/medical-errors'
import { contractorDefaultValue } from '../utils/medical-contractor-default'
import { CheckboxInput } from '~/components/mui/checkbox-input/checkbox-input'
import { EmailInput } from '~/components/mui/email-input/email-input'
import { PhoneInputComponent } from '~/components/mui/phone-input-component/phone-input-component'
import { SelectInputController } from '~/components/mui/select-input/select-input'
import { TextInputController } from '~/components/mui/text-input-controller/text-input-controller'
import { IsgButton } from '~/components/shared/isgButton/isgButton'
import { Spinner } from '~/components/shared/spinner/spinner'
import { passportNumberValidator } from '~/constants'
import { Companies } from '~/constants/companies'
import { useTranslation } from '~/context/LanguageContext'
import { InvoiceCheckbox } from '~/modules/shared/invoiceCheckbox/invoiceCheckbox'
import { ContractorType, InsuranceType, ItemName } from '~/modules/shared/types/insurance'
import { getCompany } from '~/services/firebase.service'
import { validateIdno, validateIdnp } from '~/utils/validateIdnp'
import { validateName } from '~/utils/validateName'

export const MedicalContractor = ({ priceEUR }): JSX.Element => {
  const { translate, locale } = useTranslation()
  const { basePath, push } = useRouter()

  const { confirm } = useMedicalConfirmation()
  const { updateContractorInfo } = useMedicalPreOrder()
  const { preOrderId } = useMedicalContext()

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
  const watchContractorType = watch('contractorType')
  const watchContractorName = watch('contractorName')
  const watchContractorPassport = watch('contractorPassport')
  const watchContractorFirstName = watch('contractorFirstName')
  const watchContractorLastName = watch('contractorLastName')
  const watchContractorBirthday = watch('contractorBirthday')
  const watchContractorIdnx = watch('idno')
  const watchContractor = watch('contractor')
  const watchFiscalInvoice = watch('fiscalInvoice')
  const isCompany = watchContractorType === ContractorType.COMPANY

  useEffect(() => {
    clearErrors('form')
  }, [watchPhone, watchEmail])

  useEffect(() => {
    const fetch = async () => {
      setIsLoadingCompany(true)
      setValue('contractorFirstName', '')
      setValue('contractorLastName', '')
      setValue('contractorPassport', '')
      setValue('contractorBirthday', null)
      setValue('fiscalInvoice', false)
      const result = await getCompany(watchContractorIdnx)
      if (!result) {
        setError('idno', { message: translate('companyNotFound') })
        setValue('contractorName', '')
      } else {
        setValue('contractorName', result?.ShortName)
      }
      setIsLoadingCompany(false)
    }

    if (isCompany && validateIdno(watchContractorIdnx)) {
      fetch()
    }
  }, [watchContractorIdnx, watchContractorType])

  useEffect(() => {
    if (watchContractor && JSON?.parse?.(watchContractor)?.id === 'another') {
      setValue('idno', '')
      setValue('contractorName', '')
      setValue('contractorFirstName', '')
      setValue('contractorLastName', '')
      setValue('contractorPassport', '')
      setValue('contractorBirthday', null)
      setValue('contractorBirthday', null)
      setValue('fiscalInvoice', false)
    }
  }, [watchContractor])

  const validateContractor = (value) => {
    const person = watchPersons.find((el) => el.idnp === JSON.parse(value).idnx)
    return person?.birthday && differenceInYears(new Date(), person.birthday) >= 18
  }

  const onSubmit = async () => {
    setIsLoading(true)

    const isValid = await trigger()
    if (!isValid) {
      setIsLoading(false)
      return
    }

    const updated = await updateContractorInfo(getValues() as MedicalFormValues, preOrderId)
    if (!updated) {
      setError('form', { type: MedicalErrorType.confirmFailed })
      setIsLoading(false)
      return
    }

    const orderId = await confirm(preOrderId)
    if (!orderId) {
      setError('form', { type: MedicalErrorType.confirmFailed })
      setIsLoading(false)
      return
    }

    const pathname = locale === 'ro' ? basePath : `/${locale}`
    ga.addToCart(Number(priceEUR) * 0.2, orderId, ItemName[InsuranceType.MEDICAL], companyName)
    fbq.addToCart(Number(priceEUR) * 0.2, orderId, ItemName[InsuranceType.MEDICAL], companyName)
    fba.addToCart(Number(priceEUR) * 0.2, orderId, ItemName[InsuranceType.MEDICAL], companyName)

    push(`${pathname}/order?order=${orderId}`)
  }

  const handleChange = (e) => {
    setValue('contractorName', JSON.parse(e.target.value).fullName)
    setValue('idno', JSON.parse(e.target.value).idnx)
    setValue('contractorType', JSON.parse(e.target.value).contractorType)
  }

  const getItems = () => {
    return [
      ...watchPersons.map((value, index) => (
        <option
          disabled={differenceInYears(new Date(), value.birthday) < 18}
          key={index}
          value={`{"fullName":"${value.fullName}","idnx":"${value.idnp}","contractorType":"${ContractorType.INDIVIDUAL}","id":"${value.idnp}"}`}
          translate="no"
        >
          {value.fullName}
        </option>
      )),
      <option
        key={ContractorType.COMPANY}
        value={`{"fullName":"","idnx":"","contractorType":"${ContractorType.COMPANY}","id":""}`}
        translate="yes"
      >
        {translate('juridical-person')}
      </option>,
      <option
        key={ContractorType.INDIVIDUAL}
        value={`{"fullName":"","idnx":"","contractorType":"${ContractorType.INDIVIDUAL}","id":"another"}`}
        translate="yes"
      >
        {translate('another-person')}
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
        defaultValue={JSON.stringify(contractorDefaultValue(watchPersons))}
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

      {watchContractor && JSON?.parse?.(watchContractor)?.id === 'another' && (
        <>
          <div className="flex md:flex-row flex-col md:justify-content-between md:gap-2 gap-6">
            <TextInputController
              name="contractorLastName"
              control={control}
              defaultValue={watchContractorLastName}
              label={translate('lastName')}
              rules={{
                validate: {
                  validateName,
                },
              }}
              errorText={
                (errors?.contractorLastName?.type === 'validateName' &&
                  translate(`lastName:error`)) ||
                errors?.contractorLastName?.message
              }
            />
            <TextInputController
              name="contractorFirstName"
              control={control}
              defaultValue={watchContractorFirstName}
              label={translate('firstName')}
              rules={{
                validate: {
                  validateName,
                },
              }}
              errorText={
                (errors?.contractorFirstName?.type === 'validateName' &&
                  translate(`firstName:error`)) ||
                errors?.contractorFirstName?.message
              }
            />
          </div>

          <TextInputController
            name="idno"
            control={control}
            defaultValue={watchContractorIdnx}
            label={translate('taxCode')}
            rules={{
              validate: {
                validateIdnp,
              },
            }}
            errorText={
              (errors?.idno?.type === MedicalErrorType.validateIdnp &&
                translate('taxCode:error')) ||
              (errors?.idno?.type === MedicalErrorType.required && translate('idnp:required'))
            }
          />

          <TextInputController
            name="contractorPassport"
            control={control}
            defaultValue={watchContractorPassport}
            label={translate('passportNumber')}
            rules={{
              validate: {
                validatePassportNumber: (v) => passportNumberValidator.test(v),
              },
            }}
            errorText={
              (errors?.contractorPassport?.type === 'validatePassportNumber' &&
                translate('passportNumber:error')) ||
              errors?.contractorPassport?.message
            }
          />

          <ContractorBirthday value={watchContractorBirthday} />
        </>
      )}

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
        defaultValue={watchFiscalInvoice}
        control={control}
        required={true}
        label={translate(`personalDataConsent${companyName === Companies.Grawe ? ':grawe' : ''}`)}
      />

      {errors?.form?.type === MedicalErrorType.confirmFailed && (
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
