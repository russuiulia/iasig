/* eslint-disable react-hooks/exhaustive-deps */
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { EmailInput } from '~/components/mui/email-input/email-input'
import { PhoneInputComponent } from '~/components/mui/phone-input-component/phone-input-component'
import { IsgButton } from '~/components/shared/isgButton/isgButton'
import { useTranslation } from '~/context/LanguageContext'
import { InsuranceType, ItemName } from '~/modules/shared/types/insurance'
import * as fba from '../../../fba'
import * as fbq from '../../../fbq'
import * as ga from '../../../ga'
import { useBaggageContext } from '../baggage-context/baggage-context'
import { useBaggageConfirmation, useBaggagePreOrder } from '../hooks'
import { BaggageContactFormValues, BaggageErrorType } from '../types'

export const BaggageContact = ({ priceEUR }): JSX.Element => {
  const { translate, locale } = useTranslation()
  const { basePath, push } = useRouter()

  const { confirm } = useBaggageConfirmation()
  const { updateContacts } = useBaggagePreOrder()
  const { preOrderId } = useBaggageContext()

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
  const companyName = watch('companyName')

  useEffect(() => {
    clearErrors('form')
  }, [watchPhone, watchEmail])

  const onSubmit = async () => {
    setIsLoading(true)
    const isValid = await trigger()
    if (!isValid) {
      setIsLoading(false)
      return
    }
    const updated = await updateContacts(getValues() as BaggageContactFormValues, preOrderId)
    if (!updated) {
      setError('form', { type: BaggageErrorType.confirmFailed })
      setIsLoading(false)
      return
    }
    const orderId = await confirm(preOrderId)
    if (!orderId) {
      setError('form', { type: BaggageErrorType.confirmFailed })
      setIsLoading(false)
      return
    }
    const pathname = locale === 'ro' ? basePath : `/${locale}`

    ga.addToCart(Number(priceEUR) * 0.2, orderId, ItemName[InsuranceType.BAGGAGE], companyName)
    fbq.addToCart(Number(priceEUR) * 0.2, orderId, ItemName[InsuranceType.BAGGAGE], companyName)
    fba.addToCart(Number(priceEUR) * 0.2, orderId, ItemName[InsuranceType.BAGGAGE], companyName)

    push(`${pathname}/order?order=${orderId}`)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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

      {errors?.form?.type === BaggageErrorType.confirmFailed && (
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
