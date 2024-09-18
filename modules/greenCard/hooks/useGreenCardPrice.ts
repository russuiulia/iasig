import { useEffect, useRef, useState } from 'react'

import { GreenCardFormValues } from '../types'
import { pickKeyFromObject } from '~/modules/utils/pickKeyFromObject'
import { getGreenCardPrice } from '~/services/green-card.services'
import { GreenCardPrice } from '~/services/interfaces/green-card'
import { validateCertificateNumber } from '~/utils/validateCertificateNumber'
import { validateIdnx } from '~/utils/validateIdnp'

export const useGreenCardPrices = (values: GreenCardFormValues) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [offer, setOffer] = useState<GreenCardPrice>({} as GreenCardPrice)
  const lastUsedFormValue = useRef<GreenCardFormValues>()

  const shouldRefetchOffers = (values: GreenCardFormValues) => {
    const fields = [
      'idnp',
      'certificateNumber',
      'towingCertificateNumber',
      'insuranceValidity',
      'zone',
      'personalDataConsent',
    ]

    const old = pickKeyFromObject(lastUsedFormValue.current, fields)
    const updated = pickKeyFromObject(values, fields)

    return JSON.stringify(updated) !== JSON.stringify(old)
  }

  const canLoadPrices = (values: GreenCardFormValues) => {
    if (!values?.personalDataConsent) {
      return false
    }

    if (!values?.certificateNumber) {
      return false
    }

    if (
      !(
        validateCertificateNumber(values?.certificateNumber) ||
        !!values?.certificateNumber.match(/^([Aa][Bb]\d{6})$/)
      )
    ) {
      return false
    }

    if (
      values.towingCertificateNumber &&
      !validateCertificateNumber(values.towingCertificateNumber)
    ) {
      return false
    }

    if (!values?.insuranceValidity) {
      return false
    }

    if (!values.zone) {
      return false
    }

    if (!values?.idnp) {
      return false
    }

    if (!validateIdnx(values.idnp)) {
      return false
    }

    return true
  }

  useEffect(() => {
    const fetch = async () => {
      setIsLoading(true)

      const result = await getGreenCardPrice({
        idnp: values.idnp,
        certificateNumber: values.certificateNumber.toUpperCase(),
        towingCertificateNumber: values?.towingCertificateNumber?.toUpperCase?.(),
        insuranceValidity: Number(values.insuranceValidity),
        ownership: values.ownership,
        zone: values.zone,
      })
      setOffer(result as GreenCardPrice)
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
