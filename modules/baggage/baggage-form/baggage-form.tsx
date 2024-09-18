/* eslint-disable react-hooks/exhaustive-deps */
import { differenceInCalendarDays } from 'date-fns'
import { utcToZonedTime } from 'date-fns-tz'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { CheckboxInput } from '~/components/mui/checkbox-input/checkbox-input'
import { IdnpInput } from '~/components/mui/idnp-input/idnp-input'
import { ResponsiveDatePicker } from '~/components/mui/responsive-date-picker/responsive-date-picker'
import { SelectInputController } from '~/components/mui/select-input/select-input'
import { TextInputController } from '~/components/mui/text-input-controller/text-input-controller'
import { IsgButton } from '~/components/shared/isgButton/isgButton'
import { TagsInput } from '~/components/tagInput/tagInput'
import { useTranslation } from '~/context/LanguageContext'
import { Companies } from '~/modules/shared/companies/companies'
import { InsuranceType, ItemName } from '~/modules/shared/types/insurance'
import { CHISINAU_TIMEZONE } from '~/utils/timezone'
import { useFormPersist } from '~/utils/useFormPersist'
import { validateName } from '~/utils/validateName'
import * as fba from '../../../fba'
import * as fbq from '../../../fbq'
import * as ga from '../../../ga'
import { useBaggageContext } from '../baggage-context/baggage-context'
import { BaggageSteps } from '../baggage-context/baggage-context.types'
import { PriceSummary } from '../baggage-price-summary/baggage-price-summary'
import { useBaggagePreOrder, useBaggagePrice, useBaggageValidations } from '../hooks'
import { BaggageErrorType } from '../types'

export const BaggageForm = (): JSX.Element => {
  const { translate } = useTranslation()
  const { setActiveStep, preOrderId } = useBaggageContext()
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

  const { watchForm, clearStorage } = useFormPersist(InsuranceType.BAGGAGE, preOrderId, {
    watch,
    setValue,
  })

  const {
    canLoadPrice,
    price: offer,
    isLoading: isLoadingPrice,
  } = useBaggagePrice(watchForm, setValue)

  const [isLoading, setIsLoading] = useState(false)

  const { createOrUpdate, loadPreOrder } = useBaggagePreOrder()
  const { validateInsurance } = useBaggageValidations()

  useEffect(() => clearErrors('form'), [JSON.stringify(watchForm)])

  useEffect(() => {
    if (preOrderId) {
      loadPreOrder(preOrderId)
    }
  }, [preOrderId])

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
      setError('form', { type: BaggageErrorType.priceRequired })
      return
    }

    const updatedPreOrderId = await createOrUpdate(watchForm, query?.order as string)
    if (!updatedPreOrderId) {
      setIsLoading(false)
      setError('form', { type: BaggageErrorType.createFailed })
      return
    }

    const price = Number(watchForm.priceEUR) * 0.2
    fba.lead(price, ItemName[InsuranceType.BAGGAGE], watchForm.companyName)
    ga.lead(price, ItemName[InsuranceType.BAGGAGE], watchForm.companyName)
    fbq.lead(price, ItemName[InsuranceType.BAGGAGE], watchForm.companyName)

    setIsLoading(false)
    replace(`${pathname}?order=${updatedPreOrderId}`)
    setActiveStep(BaggageSteps.Confirmation)
    clearStorage()
  }

  const departureDateOptions = {
    label: translate('departureDate:label'),
    name: 'departureDate',
    inputFormat: 'dd.MM.yyyy',
    value: watchForm.departureDate,
    control: control,
    disablePast: true,
    mask: '__.__.____',
    onChange: async (date) => {
      clearErrors('departureDate')
      setValue('departureDate', date)
      await trigger('departureDate')
    },
    isPast: (date) =>
      !(
        differenceInCalendarDays(
          date,
          utcToZonedTime(new Date().toISOString(), CHISINAU_TIMEZONE)
        ) < 0
      ),
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <SelectInputController
        id="baggage-pcs"
        name="baggagePcs"
        label={translate('baggagePcs')}
        control={control}
        items={[
          <option aria-label="None" key={'none'} value="" />,
          ...['1', '2', '3', '4', '5'].map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          )),
        ]}
        errorMessage={errors?.baggagePcs?.message}
      />

      <TagsInput
        errorText={errors?.flightNumbers?.message}
        control={control}
        setValue={setValue}
        value={watchForm.flightNumbers}
      />

      <TextInputController
        name="fullName"
        control={control}
        defaultValue={watchForm?.fullName}
        label={translate('fullName')}
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

      <IdnpInput defaultValue={watchForm?.idnp} label="contractor-idnp" />

      <ResponsiveDatePicker {...departureDateOptions} />

      <CheckboxInput
        name="personalDataConsent"
        defaultValue={false}
        control={control}
        required={true}
        label={translate('personalDataConsent')}
      />

      {canLoadPrice && (
        <PriceSummary
          isLoading={isLoadingPrice}
          details={{
            price: watchForm.price ?? '',
            baggagePcs: watchForm.baggagePcs,
            amount: offer.amount,
          }}
        />
      )}

      {errors?.form?.type === BaggageErrorType.createFailed && (
        <p className="text-danger">{translate('create-order-error')}</p>
      )}

      {canLoadPrice && !isLoadingPrice && !!offer?.companies?.length && (
        <Companies
          offers={offer.companies}
          price={watchForm.price}
          priceEUR={watchForm.priceEUR}
          defaultValue={watchForm.companyName}
          handleChange={(e) => setValue(e.target.name, `${e.target.value}`)}
          name="companyName"
        ></Companies>
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
