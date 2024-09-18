import { useEffect, useRef, useState } from 'react'
import { pickKeyFromObject } from '~/modules/utils/pickKeyFromObject'
import { getBaggagePrice } from '~/services/baggage.services'
import { BaggagePriceOutput } from '~/services/interfaces/baggage'
import { BaggageFormValues } from '../types'

export const useBaggagePrice = (values: BaggageFormValues, setValue: any) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [price, setPrice] = useState<BaggagePriceOutput>({} as BaggagePriceOutput)
  const lastUsedFormValue = useRef<BaggageFormValues>()

  const shouldRefetchPrice = (values: BaggageFormValues) => {
    const fields = ['baggagePcs', 'personalDataConsent']

    const old = pickKeyFromObject(lastUsedFormValue.current, fields)
    const updated = pickKeyFromObject(values, fields)

    return JSON.stringify(updated) !== JSON.stringify(old)
  }

  const canLoadPrice = (values: BaggageFormValues) => {
    if (!values.baggagePcs) {
      return false
    }

    if (Number(values.baggagePcs) <= 0) {
      return false
    }

    return true
  }

  useEffect(() => {
    const fetch = async () => {
      setIsLoading(true)

      const result = await getBaggagePrice({ baggagePcs: Number(values.baggagePcs) })
      setPrice(result as BaggagePriceOutput)
      setIsLoading(false)
    }

    if (canLoadPrice(values) && shouldRefetchPrice(values)) {
      lastUsedFormValue.current = values
      fetch()
    }
  }, [values])

  useEffect(() => {
    const setPrice = () => {
      if (!price) {
        return
      }

      setValue('price', price.priceMDL)
      setValue('priceEUR', price.priceEUR)
    }

    setValue('companyName', null)
    setPrice()
  }, [price])

  return {
    canLoadPrice: canLoadPrice(values),
    price,
    isLoading,
  }
}
