/* eslint-disable react-hooks/exhaustive-deps */
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { EmailInput } from '~/components/mui/email-input/email-input'
import { PhoneInputComponent } from '~/components/mui/phone-input-component/phone-input-component'
import { IsgButton } from '~/components/shared/isgButton/isgButton'
import { useTranslation } from '~/context/LanguageContext'
import { useRcaConfirmation, useRcaPreOrder } from '../hooks'
import { RcaContactFormValues } from '../types'
import { RcaErrors } from '../types/rca-errors.types'
import * as ga from '../../../ga'
import * as fbq from '../../../fbq'
import * as fba from '../../../fba'
import { ContractorType, InsuranceType, ItemName } from '~/modules/shared/types/insurance'
import { InvoiceCheckbox } from '~/modules/shared/invoiceCheckbox/invoiceCheckbox'
import { useFormPersist } from '~/utils/useFormPersist'

export const RcaContact = ({ price }): JSX.Element => {
  const { translate, locale } = useTranslation()
  const { basePath, push, query } = useRouter()

  const { confirm } = useRcaConfirmation()
  const { updateContacts, createOrUpdate } = useRcaPreOrder()

  const [isLoading, setIsLoading] = useState(false)

  const {
    handleSubmit,
    control,
    watch,
    trigger,
    setValue,
    getValues,
    setError,
    clearErrors,
    formState: { errors },
  } = useFormContext()

  const { watchForm } = useFormPersist(InsuranceType.RCA, query?.order, {
    watch,
    setValue,
  })

  const watchPhone = watch('phone')
  const watchEmail = watch('email')
  const companyName = watch('companyName')
  const contractorType = watch('contractorType')
  const isCompany = contractorType === ContractorType.COMPANY

  useEffect(() => clearErrors('form'), [watchPhone, watchEmail])

  const onSubmit = async () => {
    setIsLoading(true)

    const isValid = await trigger()
    if (!isValid) {
      setIsLoading(false)
      return
    }
    const updatedPreOrderId = await createOrUpdate(watchForm, query?.order as string)
    if (!updatedPreOrderId) {
      setIsLoading(false)
      setError('form', { type: RcaErrors.createFailed })
      return
    }
    const updated = await updateContacts(getValues() as RcaContactFormValues, query?.order as any)
    if (!updated) {
      setError('form', { type: RcaErrors.confirmFailed })
      setIsLoading(false)
      return
    }
    const orderId = await confirm(query?.order as any)
    if (!orderId) {
      setError('form', { type: RcaErrors.confirmFailed })
      setIsLoading(false)
      return
    }
    const pathname = locale === 'ro' ? basePath : `/${locale}`

    ga.addToCart(Number(price) / 100, orderId, ItemName[InsuranceType.RCA], companyName)
    fbq.addToCart(Number(price) / 100, orderId, ItemName[InsuranceType.RCA], companyName)
    fba.addToCart(Number(price) / 100, orderId, ItemName[InsuranceType.RCA], companyName)
    push(`${pathname}/order?order=${orderId}`)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pb-16 lg:pb-24">
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

      {errors?.form?.type === RcaErrors.confirmFailed && (
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

      <div className="flex justify-center">
        <IsgButton
          type="submit"
          imgSrc="/images/white-arrow.svg"
          text={translate('confirm')}
          styleClass="py-4 h-12 sm:w-44 w-full"
          isLoading={isLoading}
        />
      </div>
    </form>
  )
}
