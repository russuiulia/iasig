import {
  differenceInCalendarDays,
  differenceInCalendarMonths,
  differenceInCalendarYears,
  isValid,
} from 'date-fns'
import { useEffect, useRef, useState } from 'react'
import { pickKeyFromObject } from '~/modules/utils/pickKeyFromObject'
import { MedicalOptionalOffers } from '~/services/interfaces/medical-optional'
import { getMedicalOptionalPrice } from '~/services/medical-optional.services'
import { normalizeDate } from '~/utils/normalizeDate'
import { InsuredDays } from '../constants'
import { MedicalOptionalFormValues } from '../types'

export const useMedicalOptionalOffers = (
  values: MedicalOptionalFormValues,
  isLoadingPreOrder: boolean
) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [offers, setOffers] = useState<MedicalOptionalOffers[]>([])
  const lastUsedFormValue = useRef<MedicalOptionalFormValues>()

  const visibleCompanies = values?.amount
    ? offers.find((item) => item.amount === values.amount)?.offers
    : []

  const shouldRefetchOffers = (values: MedicalOptionalFormValues) => {
    const fields = [
      'nationalityCode',
      'persons',
      'includeAdditionalRisk',
      'insuranceValidity',
      'riskFactors',
    ]

    const old = pickKeyFromObject(lastUsedFormValue.current, fields)
    const updated = pickKeyFromObject(values, fields)

    return !isLoadingPreOrder && JSON.stringify(updated) !== JSON.stringify(old)
  }

  const canLoadOffers = (values: MedicalOptionalFormValues) => {
    if (!values?.nationalityCode) {
      return false
    }

    if (!values?.insuranceValidity) {
      return false
    }

    if (!values?.persons?.length) {
      return false
    }

    if (!values?.persons?.every((el) => el.birthday)) {
      return false
    }

    if (!values?.persons?.every((el) => isValid(el.birthday))) {
      return false
    }

    if (
      !values?.persons?.every(
        (el) =>
          el.birthday &&
          isValid(el.birthday) &&
          differenceInCalendarDays(el.birthday, new Date()) < 0 &&
          differenceInCalendarYears(new Date(), el.birthday) <= 102
      )
    ) {
      return false
    }

    const isValidStartDate = values.startDate && isValid(values.startDate)
    if (!isValidStartDate) {
      return false
    }

    if (values.startDate && differenceInCalendarDays(values.startDate, new Date()) < 0) {
      return false
    }

    return true
  }

  useEffect(() => {
    const fetch = async () => {
      setIsLoading(true)
      const result = await getMedicalOptionalPrice({
        country: 'MDA',
        age: values.persons.map((person) =>
          differenceInCalendarMonths(new Date(), normalizeDate(person.birthday) as Date)
        ),
        riskType: values.includeAdditionalRisk ? 'B' : 'A',
        availability: Number(values.insuranceValidity),
        days: InsuredDays[values.insuranceValidity],
        riskFactors: values.riskFactors,
      })

      setOffers(result)
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
