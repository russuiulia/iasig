import { useEffect, useRef, useState } from 'react'

import { RoadAssistanceEUFormValues } from '../types'
import { pickKeyFromObject } from '~/modules/utils/pickKeyFromObject'
import { getRoadAssistanceEUPrice } from '~/services/road-assistance-eu.services'
import { validateCertificateNumber } from '~/utils/validateCertificateNumber'

export const useRoadAssistanceEUPrice = (values: RoadAssistanceEUFormValues, setValue: any) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const lastUsedFormValue = useRef<RoadAssistanceEUFormValues>()

  const shouldRefetchOffers = (values: RoadAssistanceEUFormValues) => {
    const fields = ['certificateNumber', 'coverage', 'personalDataConsent']

    const old = pickKeyFromObject(lastUsedFormValue.current, fields)
    const updated = pickKeyFromObject(values, fields)

    return JSON.stringify(updated) !== JSON.stringify(old)
  }

  const canLoadPrices = (values: RoadAssistanceEUFormValues) => {
    if (!values?.personalDataConsent) {
      return false
    }

    if (!values?.coverage) {
      return false
    }

    if (!values?.certificateNumber) {
      return false
    }

    if (!validateCertificateNumber(values.certificateNumber)) {
      return false
    }

    return true
  }

  useEffect(() => {
    const fetch = async () => {
      setIsLoading(true)

      const result = await getRoadAssistanceEUPrice({
        certificateNumber: values.certificateNumber.toUpperCase(),
        coverage: values.coverage,
      })

      setValue('offers', result.offers)
      setValue('carModel', result.carModel)
      setValue('plateNumber', result.plateNumber)
      setValue('minStartDate', result.minStartDate)
      setValue('validData', result.validData)

      setIsLoading(false)
    }

    if (canLoadPrices(values) && shouldRefetchOffers(values)) {
      lastUsedFormValue.current = values
      fetch()
    }
  }, [JSON.stringify(values)])

  return {
    canLoadPrices: canLoadPrices(values),
    isLoading,
  }
}
