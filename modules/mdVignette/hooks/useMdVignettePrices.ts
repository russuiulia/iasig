import { useEffect, useRef, useState } from 'react'
import { pickKeyFromObject } from '~/modules/utils/pickKeyFromObject'
import { getMdVignettePrice } from '~/services/md-vignette.services'
import { MdVignetteFormValues } from '../types'

export const useMdVignettePrices = (values: MdVignetteFormValues, setValue: any) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const lastUsedFormValue = useRef<MdVignetteFormValues>()

  const shouldRefetchOffers = (values: MdVignetteFormValues) => {
    const fields = ['vehicleType', 'validity', 'personalDataConsent']

    const old = pickKeyFromObject(lastUsedFormValue.current, fields)
    const updated = pickKeyFromObject(values, fields)

    return JSON.stringify(updated) !== JSON.stringify(old)
  }

  const canLoadPrices = (values: MdVignetteFormValues) => {
    if (!values?.personalDataConsent) {
      return false
    }

    if (!values?.vehicleType) {
      return false
    }

    if (!values?.validity) {
      return false
    }

    return true
  }

  useEffect(() => {
    const fetch = async () => {
      setIsLoading(true)

      const result = await getMdVignettePrice({
        period: values.validity,
        vehicleCategory: values.vehicleType,
      })

      setValue('price', result.priceMDL)
      setValue('priceEUR', result.priceEUR)
      setIsLoading(false)
    }

    if (canLoadPrices(values) && shouldRefetchOffers(values)) {
      lastUsedFormValue.current = values
      fetch()
    }
  }, [values])

  return {
    canLoadPrices: canLoadPrices(values),
    isLoading,
  }
}
