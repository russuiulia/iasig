import { useEffect, useRef, useState } from 'react'
import { pickKeyFromObject } from '~/modules/utils/pickKeyFromObject'
import { RealEstateOffers } from '~/services/interfaces/real-estate'
import { getRealEstatePrice } from '~/services/real-estate.services'
import { costRegex } from '~/constants'
import { InsuredValuesType } from '../real-estate-form/real-estate-form.constants'
import { RealEstateValueType } from '../real-estate-value-input/real-estate-value-input.types'
import { RealEstateFormValues } from '../types'

export const useRealEstateOffers = (values: RealEstateFormValues, isLoadingPreOrder: boolean) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [offers, setOffers] = useState<RealEstateOffers[]>([])
  const lastUsedFormValue = useRef<RealEstateFormValues>()

  const visibleCompanies = values?.amount
    ? offers.find((item) => item.amount === values.amount)?.offers
    : []

  const shouldRefetchOffers = (values: RealEstateFormValues) => {
    const fields = [
      'beneficiary',
      'realEstateType',
      'insuredValue',
      'marketValue',
      'replacementCost',
      'insuranceValidity',
    ]

    const old = pickKeyFromObject(lastUsedFormValue.current, fields)
    const updated = pickKeyFromObject(values, fields)

    return !isLoadingPreOrder && JSON.stringify(updated) !== JSON.stringify(old)
  }

  const canLoadOffers = (values: RealEstateFormValues) => {
    if (!values.realEstateType) {
      return false
    }

    if (!values.insuredValue) {
      return false
    }

    if (values.insuredValue === RealEstateValueType.MARKET_VALUE) {
      if (!values.marketValue) return false
      if (!values.marketValue.toString().match(costRegex)) return false
    }

    if (values.insuredValue === RealEstateValueType.REPLACEMENT_COST) {
      if (!values.replacementCost) return false
      if (!values.replacementCost.toString().match(costRegex)) return false
    }

    if (!values.insuranceValidity) {
      return false
    }

    if (!values.beneficiary) {
      return false
    }

    return true
  }

  useEffect(() => {
    const fetch = async () => {
      setIsLoading(true)
      const result = await getRealEstatePrice({
        realEstateType: values.realEstateType,
        valueType: values.insuredValue,
        amount: (values.insuredValue === InsuredValuesType.MARKET_VALUE
          ? values.marketValue
          : values.replacementCost
        ).toString(),
        period: Number(values.insuranceValidity),
        beneficiaryCode: values.beneficiary,
      })

      setOffers(result as any)
      setIsLoading(false)
    }

    if (canLoadOffers(values) && shouldRefetchOffers(values)) {
      lastUsedFormValue.current = values
      fetch()
    }
  }, [values, isLoadingPreOrder])

  return {
    canLoadOffers: canLoadOffers(values),
    offers,
    visibleCompanies,
    isLoading,
  }
}
