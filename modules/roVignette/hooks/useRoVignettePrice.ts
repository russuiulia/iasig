import { useEffect, useRef, useState } from 'react'

import { RoVignetteFormValues } from '../types'
import { AdditionalProduct } from '~/modules/shared/addons'
import { InsuranceType } from '~/modules/shared/types/insurance'
import { pickKeyFromObject } from '~/modules/utils/pickKeyFromObject'
import { getRoVignettePrice } from '~/services/ro-vignette.services'
import { validateCertificateNumber, validateUAPlateNumber } from '~/utils/validateCertificateNumber'

export const useRoVignettePrices = (values: RoVignetteFormValues) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [offer, setOffer] = useState<AdditionalProduct[]>([] as AdditionalProduct[])
  const lastUsedFormValue = useRef<RoVignetteFormValues>()

  const shouldRefetchOffers = (values: RoVignetteFormValues) => {
    const fields = ['personalDataConsent', 'registrationCountry']

    const allFields =
      values.registrationCountry === 'MD'
        ? [...fields, 'certificateNumber']
        : [...fields, 'carPlateNumber']

    const old = pickKeyFromObject(lastUsedFormValue.current, allFields)
    const updated = pickKeyFromObject(values, allFields)

    return JSON.stringify(updated) !== JSON.stringify(old)
  }

  const canLoadPrices = (values: RoVignetteFormValues) => {
    if (!values?.personalDataConsent) {
      return false
    }

    if (!values?.registrationCountry) {
      return false
    }

    if (values.registrationCountry === 'MD') {
      if (!values?.certificateNumber) {
        return false
      }

      if (!validateCertificateNumber(values.certificateNumber)) {
        return false
      }
    } else {
      if (!values?.carPlateNumber) {
        return false
      }

      if (!validateUAPlateNumber(values.carPlateNumber)) {
        return false
      }
    }

    return true
  }

  useEffect(() => {
    const fetch = async () => {
      setIsLoading(true)

      const result = await getRoVignettePrice({
        zone: '3',
        forInsuranceType: InsuranceType.RO_VIGNETTE,
        registrationCountry: values.registrationCountry,
        ...(values.registrationCountry === 'MD'
          ? { certificateNumber: values.certificateNumber.toUpperCase() }
          : { carPlateNumber: values.carPlateNumber }),
      })
      setOffer(result as AdditionalProduct[])
      setIsLoading(false)
    }

    if (canLoadPrices(values) && shouldRefetchOffers(values)) {
      lastUsedFormValue.current = values
      fetch()
    }
  }, [values])

  return {
    canLoadPrices: canLoadPrices(values),
    offer,
    isLoading,
  }
}
