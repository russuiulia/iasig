/* eslint-disable react-hooks/exhaustive-deps */
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { EmailInput } from '~/components/mui/email-input/email-input'
import { PhoneInputComponent } from '~/components/mui/phone-input-component/phone-input-component'
import { IsgButton } from '~/components/shared/isgButton/isgButton'
import { useTranslation } from '~/context/LanguageContext'
import { useRealEstateContext } from '../real-estate-context/real-estate-context'
import { useRealEstateConfirmation } from '../hooks/useRealEstateConfirmation'
import { useRealEstatePreOrder } from '../hooks/useRealEstatePreOrder'
import { RealEstateContactFormValues, RealEstateErrorType } from '../types'
import { InsuranceType, ItemName } from '~/modules/shared/types/insurance'
import * as ga from '../../../ga'
import * as fbq from '../../../fbq'
import * as fba from '../../../fba'

export const RealEstateContact = ({ price }): JSX.Element => {
  const { translate, locale } = useTranslation()
  const { basePath, push } = useRouter()

  const { confirm } = useRealEstateConfirmation()
  const { updateContacts } = useRealEstatePreOrder()
  const { preOrderId } = useRealEstateContext()

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
    const updated = await updateContacts(getValues() as RealEstateContactFormValues, preOrderId)
    if (!updated) {
      setError('form', { type: RealEstateErrorType.confirmFailed })
      setIsLoading(false)
      return
    }
    const orderId = await confirm(preOrderId)
    if (!orderId) {
      setError('form', { type: RealEstateErrorType.confirmFailed })
      setIsLoading(false)
      return
    }
    const pathname = locale === 'ro' ? basePath : `/${locale}`

    ga.addToCart(Number(price) / 100, orderId, ItemName[InsuranceType.REAL_ESTATE], companyName)
    fbq.addToCart(Number(price) / 100, orderId, ItemName[InsuranceType.REAL_ESTATE], companyName)
    fba.addToCart(Number(price) / 100, orderId, ItemName[InsuranceType.REAL_ESTATE], companyName)
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

      {errors?.form?.type === RealEstateErrorType.confirmFailed && (
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
