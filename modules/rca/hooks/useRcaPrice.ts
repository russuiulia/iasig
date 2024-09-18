import { useEffect, useRef, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from '~/context/LanguageContext'
import { ContractorType } from '~/modules/shared/types/insurance'
import { pickKeyFromObject } from '~/modules/utils/pickKeyFromObject'
import { RcaPriceOutput } from '~/services/interfaces/rca'
import { getRcaPrice } from '~/services/rca.services'
import { normalizeDate } from '~/utils/normalizeDate'
import {
  validateCertificateNumber,
  validateProvisionallyCertNr,
} from '~/utils/validateCertificateNumber'
import { validateIdno, validateIdnx } from '~/utils/validateIdnp'
import { OwnershipRights, RcaFormValues } from '../types'

export const useRcaPrice = (values: RcaFormValues, setValue: any) => {
  const { translate } = useTranslation()
  const { setError } = useFormContext()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [price, setPrice] = useState<RcaPriceOutput>({} as RcaPriceOutput)
  const lastUsedFormValue = useRef<RcaFormValues>()
  const isValidData = price.validData === false

  const shouldRefetchPrice = (values: RcaFormValues) => {
    const individualFields = [
      'idnp',
      'certificateNumber',
      'personalDataConsent',
      'towingCertificateNumber',
      'insuranceValidity',
    ]
    const companyFields = [...individualFields, 'operatingMode']
    const fields =
      values.contractorType === ContractorType.COMPANY ? companyFields : individualFields

    const old = pickKeyFromObject(lastUsedFormValue.current, fields)
    const updated = pickKeyFromObject(values, fields)

    return JSON.stringify(updated) !== JSON.stringify(old)
  }

  const canLoadPrice = (values: RcaFormValues) => {
    if (!values?.personalDataConsent) {
      return false
    }

    if (!values?.idnp) {
      return false
    }

    if (!validateIdnx(values?.idnp)) {
      return false
    }

    if (!values.certificateNumber) {
      return false
    }

    if (
      !validateCertificateNumber(values.certificateNumber) &&
      !validateProvisionallyCertNr(values.certificateNumber)
    ) {
      return false
    }

    if (
      values.towingCertificateNumber &&
      !validateCertificateNumber(values.towingCertificateNumber) &&
      !validateProvisionallyCertNr(values.towingCertificateNumber)
    ) {
      return false
    }

    if (validateIdno(values.idnp)) {
      if (!values.operatingMode) {
        return false
      }
    }

    return true
  }

  useEffect(() => {
    const fetch = async () => {
      setIsLoading(true)
      const priceBody = {
        idnp: values.idnp,
        startDate: normalizeDate(values.startDate),
        certificateNumber: values.certificateNumber.toUpperCase(),
        documentNumber: values.documentNumber,
        documentDate: normalizeDate(values.documentDate),
        ownership: values.ownership,
        operatingMode: values.operatingMode,
        towingCertificateNumber: values?.towingCertificateNumber?.toUpperCase?.(),
        insuranceValidity: Number(values.insuranceValidity),
      }

      const result = await getRcaPrice(priceBody)
      setPrice(result as RcaPriceOutput)
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

      setValue('price', price?.priceMDL)
      setValue('carModel', price.carModel)
      setValue('plateNumber', price.plateNumber)
      setValue('contractorName', price.contractorName)
      setValue('contractorType', price.contractorType)
      setValue('startDate', normalizeDate(price.expirationDate))
      setValue('ownership', isValidData ? '' : OwnershipRights.Property)
      setValue('towingModel', price.towingModel || '')
      setValue('towingPlateNumber', price.towingPlateNumber || '')
      setValue('isTowingVehicleTrailer', price.isTowingVehicleTrailer)
    }

    if (price?.isTrailer === false) {
      setValue('towingCertificateNumber', '')
    }

    if (price.isTowingVehicleTrailer) {
      setError('towingCertificateNumber', { message: translate('cannotBeTrailer') })
    }

    if (price.isVehicleProbe === false) {
      setValue('insuranceValidity', '365')
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
