import { useEffect, useRef, useState } from 'react'
import { pickKeyFromObject } from '~/modules/utils/pickKeyFromObject'
import { RoadTaxPriceOutput } from '~/services/interfaces/road-tax'
import { getRoadTaxPrice } from '~/services/road-tax.services'
import { validateCertificateNumber } from '~/utils/validateCertificateNumber'
import { validateIdno, validateIdnx } from '~/utils/validateIdnp'
import { RoadTaxFormValues } from '../types'

export const useRoadTaxPrices = (values: RoadTaxFormValues, setValue: any) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [offer, setOffer] = useState<RoadTaxPriceOutput>({} as RoadTaxPriceOutput)
  const lastUsedFormValue = useRef<RoadTaxFormValues>()

  const shouldRefetchOffers = (values: RoadTaxFormValues) => {
    const fields = ['certificateNumber', 'idnp', 'personalDataConsent']

    const old = pickKeyFromObject(lastUsedFormValue.current, fields)
    const updated = pickKeyFromObject(values, fields)

    return JSON.stringify(updated) !== JSON.stringify(old)
  }

  const canLoadPrices = (values: RoadTaxFormValues) => {
    if (!values?.personalDataConsent) {
      return false
    }

    if (!values?.certificateNumber) {
      return false
    }

    if (!validateCertificateNumber(values.certificateNumber)) {
      return false
    }

    if (!values?.idnp) {
      return false
    }

    if (!validateIdnx(values?.idnp)) {
      return false
    }

    return true
  }

  useEffect(() => {
    const fetch = async () => {
      setIsLoading(true)

      const result = await getRoadTaxPrice({
        certificateNumber: values.certificateNumber.toUpperCase(),
        idnx: values.idnp,
      })
      setOffer(result as RoadTaxPriceOutput)
      setIsLoading(false)
    }

    if (canLoadPrices(values) && shouldRefetchOffers(values)) {
      lastUsedFormValue.current = values
      fetch()
    }
  }, [values])

  useEffect(() => {
    const setPrice = () => {
      if (!offer) {
        return
      }

      setValue('price', offer.price)
      setValue('vinCode', offer.vinCode)
      setValue('carModel', offer.carModel)
      setValue('plateNumber', offer.plateNumber)
      if (validateIdno(values.idnp)) {
        setValue('fullName', offer.contractorName)
      }
    }

    setPrice()
  }, [offer])

  return {
    canLoadPrices: canLoadPrices(values),
    offer,
    isLoading,
  }
}
