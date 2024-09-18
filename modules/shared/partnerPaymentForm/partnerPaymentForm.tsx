/* eslint-disable react-hooks/exhaustive-deps */
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { TextInputController } from '~/components/mui/text-input-controller/text-input-controller'
import { IsgButton } from '~/components/shared/isgButton/isgButton'
import { useTranslation } from '~/context/LanguageContext'
import { confirmOrder } from '~/services/firebase.service'
import { validateBillNumber } from '~/utils/validateBillNumber'
import { Validation } from '../types'
import { InsuranceType } from '../types/insurance'

enum ErrorType {
  confirmFailed = 'confirmFailed',
}

const validateForm = (values: { [x: string]: any }): Validation<string> => {
  if (!values.billNumber) {
    return { isValid: false, field: 'baggagePcs', type: 'required' }
  }

  return { isValid: true }
}

export const PartnerPaymentForm = ({ type }: { type: InsuranceType }): JSX.Element => {
  const { translate } = useTranslation()
  const { query } = useRouter()

  const [isLoading, setIsLoading] = useState(false)

  const {
    handleSubmit,
    watch,
    setError,
    trigger,
    control,
    formState: { errors },
  } = useFormContext()

  const watchForm = watch()

  const onSubmit = async () => {
    setIsLoading(true)
    const isValid = await trigger()
    if (!isValid) {
      setIsLoading(false)
      return
    }

    const validation = validateForm(watchForm)
    if (!validation.isValid) {
      setError(validation.field as string, { type: validation.type }, { shouldFocus: true })
      setIsLoading(false)
      return
    }

    const orderId = await confirmOrder(query.order as string, watchForm.billNumber, type)
    if (!orderId) {
      setIsLoading(false)
      setError('billNumber', { type: ErrorType.confirmFailed })
      return
    }

    setIsLoading(false)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mb-10 space-y-6">
      <div className="flex justify-center mt-8 sm:flex-row flex-col">
        <TextInputController
          disabled={isLoading}
          name="billNumber"
          control={control}
          defaultValue={watchForm.billNumber}
          label={translate('billNumber:label')}
          rules={{
            validate: {
              validateBillNumber,
            },
          }}
          errorText={
            (errors?.billNumber?.type === 'validateBillNumber' &&
              translate('billNumber:invalid')) ||
            (errors?.billNumber?.type === ErrorType.confirmFailed &&
              translate('billNumber-error')) ||
            errors?.fullName?.message
          }
        />

        <IsgButton
          type="submit"
          text={translate('pay')}
          isLoading={isLoading}
          styleClass="py-4 h-12 sm:w-44 w-full rounded-md h-14 sm:ml-2 sm:mt-0 mt-4"
        />
      </div>
    </form>
  )
}
