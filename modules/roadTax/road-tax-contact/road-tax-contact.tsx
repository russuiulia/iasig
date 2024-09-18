/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useFormContext } from 'react-hook-form'

import * as fba from '../../../fba'
import * as fbq from '../../../fbq'
import * as ga from '../../../ga'
import { useRoadTaxConfirmation, useRoadTaxPreOrder } from '../hooks'
import { RoadTaxContactFormValues, RoadTaxErrorType } from '../types'
import { EmailInput } from '~/components/mui/email-input/email-input'
import { PhoneInputComponent } from '~/components/mui/phone-input-component/phone-input-component'
import { IsgButton } from '~/components/shared/isgButton/isgButton'
import { useTranslation } from '~/context/LanguageContext'
import { InvoiceCheckbox } from '~/modules/shared/invoiceCheckbox/invoiceCheckbox'
import { ContractorType, InsuranceType, ItemName } from '~/modules/shared/types/insurance'

export const RoadTaxContact = ({ price }): JSX.Element => {
  const { translate, locale } = useTranslation()
  const { basePath, push, query } = useRouter()

  const { confirm } = useRoadTaxConfirmation()
  const { updateContacts } = useRoadTaxPreOrder()

  const [isLoading, setIsLoading] = useState(false)

  const {
    handleSubmit,
    control,
    watch,
    trigger,
    getValues,
    setError,
    clearErrors,
    formState: { errors },
  } = useFormContext()

  const watchPhone = watch('phone')
  const watchEmail = watch('email')
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

    const updated = await updateContacts(
      getValues() as RoadTaxContactFormValues,
      query?.order as any
    )
    if (!updated) {
      setError('form', { type: RoadTaxErrorType.confirmFailed })
      setIsLoading(false)
      return
    }

    const orderId = await confirm(query?.order as any)
    if (!orderId) {
      setError('form', { type: RoadTaxErrorType.confirmFailed })
      setIsLoading(false)
      return
    }

    const pathname = locale === 'ro' ? basePath : `/${locale}`
    ga.addToCart(Number(price) / 100, orderId, ItemName[InsuranceType.ROAD_TAX], 'iAsig')
    fbq.addToCart(Number(price) / 100, orderId, ItemName[InsuranceType.ROAD_TAX], 'iAsig')
    fba.addToCart(Number(price) / 100, orderId, ItemName[InsuranceType.ROAD_TAX], 'iAsig')

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
        required={true}
      />

      {contractorType === ContractorType.COMPANY && (
        <InvoiceCheckbox
          name="fiscalInvoice"
          defaultValue={false}
          control={control}
          required={false}
        />
      )}

      {errors?.form?.type === RoadTaxErrorType.confirmFailed && (
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
