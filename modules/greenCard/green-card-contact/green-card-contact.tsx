/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useFormContext } from 'react-hook-form'

import * as fba from '../../../fba'
import * as fbq from '../../../fbq'
import * as ga from '../../../ga'
import { useGreenCardConfirmation } from '../hooks/useGreenCardConfirmation'
import { useGreenCardPreOrder } from '../hooks/useGreenCardPreOrder'
import { GreenCardErrorType, GreenCardContactFormValues } from '../types'
import { EmailInput } from '~/components/mui/email-input/email-input'
import { PhoneInputComponent } from '~/components/mui/phone-input-component/phone-input-component'
import { IsgButton } from '~/components/shared/isgButton/isgButton'
import { useTranslation } from '~/context/LanguageContext'
import { InvoiceCheckbox } from '~/modules/shared/invoiceCheckbox/invoiceCheckbox'
import { ContractorType, InsuranceType, ItemName } from '~/modules/shared/types/insurance'
import { useFormPersist } from '~/utils/useFormPersist'

export const GreenCardContact = ({ priceEUR }): JSX.Element => {
  const { translate, locale } = useTranslation()
  const { basePath, push, query } = useRouter()

  const { confirm } = useGreenCardConfirmation()
  const { createOrUpdate, updateContacts } = useGreenCardPreOrder()

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

  const { watchForm } = useFormPersist(
    InsuranceType.GREEN_CARD,
    query?.order,
    {
      watch,
      setValue,
    },
    { exclude: [] }
  )

  const watchPhone = watch('phone')
  const watchEmail = watch('email')
  const companyName = watch('companyName')
  const contractorType = watch('contractorType')
  const watchFiscalInvoice = watch('fiscalInvoice')

  useEffect(() => {
    clearErrors('form')
  }, [watchPhone, watchEmail, watchFiscalInvoice])

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
      setError('form', { type: GreenCardErrorType.createFailed })
      return
    }

    const updated = await updateContacts(
      getValues() as GreenCardContactFormValues,
      query?.order as any
    )
    if (!updated) {
      setError('form', { type: GreenCardErrorType.confirmFailed })
      setIsLoading(false)
      return
    }
    const orderId = await confirm(query?.order as any)
    if (!orderId) {
      setError('form', { type: GreenCardErrorType.confirmFailed })
      setIsLoading(false)
      return
    }

    const pathname = locale === 'ro' ? basePath : `/${locale}`
    ga.addToCart(Number(priceEUR) * 0.2, orderId, ItemName[InsuranceType.GREEN_CARD], companyName)
    fbq.addToCart(Number(priceEUR) * 0.2, orderId, ItemName[InsuranceType.GREEN_CARD], companyName)
    fba.addToCart(Number(priceEUR) * 0.2, orderId, ItemName[InsuranceType.GREEN_CARD], companyName)

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

      {contractorType === ContractorType.COMPANY && (
        <InvoiceCheckbox
          name="fiscalInvoice"
          defaultValue={false}
          control={control}
          required={false}
        />
      )}

      {errors?.form?.type === GreenCardErrorType.confirmFailed && (
        <p className="text-danger">{translate('confirm-order-error')}</p>
      )}

      <div className="flex justify-center">
        <IsgButton
          type="submit"
          imgSrc="/images/white-arrow.svg"
          text={translate('confirm')}
          isLoading={isLoading}
          styleClass="py-4 h-12 sm:w-44 w-full"
        />
      </div>
    </form>
  )
}
