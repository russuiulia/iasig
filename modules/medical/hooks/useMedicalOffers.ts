import {
  differenceInCalendarDays,
  differenceInCalendarMonths,
  differenceInCalendarYears,
  isBefore,
  isValid,
} from 'date-fns'
import { useEffect, useRef, useState } from 'react'
import { pickKeyFromObject } from '~/modules/utils/pickKeyFromObject'
import { MedicalOffers } from '~/services/interfaces/medical'
import { getMedicalPrice } from '~/services/medical.services'
import { MedicalFormValues } from '../types'

export const useMedicalOffers = (values: MedicalFormValues, isLoadingPreOrder: boolean) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [offers, setOffers] = useState<MedicalOffers[]>([])
  const lastUsedFormValue = useRef<MedicalFormValues>()

  const visibleCompanies = values?.amount
    ? offers.find((item) => item.amount === values.amount)?.offers
    : []

  const shouldRefetchOffers = (values: MedicalFormValues) => {
    const fields = [
      'regions',
      'tripPurpose',
      'persons',
      'includeCovidRisk',
      'isMultipleType',
      'insuranceValidity',
      'insuredDays',
    ]

    const old = pickKeyFromObject(lastUsedFormValue.current, fields)
    const updated = pickKeyFromObject(values, fields)

    return !isLoadingPreOrder && JSON.stringify(updated) !== JSON.stringify(old)
  }

  const canLoadOffers = (values: MedicalFormValues) => {
    if (!values.insuredDays) {
      return false
    }

    if (!values?.regions?.length) {
      return false
    }
    const isSingleTypeAndIsMissingDate =
      !values.isMultipleType && (!values.startDate || !values.endDate)
    if (isSingleTypeAndIsMissingDate) {
      return false
    }

    const isMissingMultiplyTypeFields =
      !values.startDate || !values.insuranceValidity || !values.insuredDays

    if (values.isMultipleType && isMissingMultiplyTypeFields) {
      return false
    }

    if (!values.tripPurpose) {
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

    if (!values.isMultipleType) {
      const isValidEndDate = values.endDate && isValid(values.endDate)
      if (!isValidEndDate) {
        return false
      }

      if (values.endDate && differenceInCalendarDays(values.endDate, new Date()) < 0) {
        return false
      }

      if (isBefore(values.endDate as Date, values.startDate as Date)) {
        return false
      }

      if (differenceInCalendarDays(values.endDate as Date, values.startDate as Date) <= 2) {
        return false
      }
    }

    return true
  }

  useEffect(() => {
    const fetch = async () => {
      setIsLoading(true)
      const result = await getMedicalPrice({
        country: values.regions
          .reduce(
            (acc: string[], item: { name: string; value: string[] }) => [...acc, ...item.value],
            []
          )
          .join(','),
        days: Number(values.insuredDays),
        unlimited: values.isMultipleType,
        covid: values.includeCovidRisk,
        activityCategoryCode: JSON.parse(values.tripPurpose).activities.join(','),
        age: values.persons.map((person) =>
          differenceInCalendarMonths(new Date(), new Date(person.birthday as Date))
        ),
        riskType: values.includeAdditionalRisk ? 'B' : 'A',
        availability: Number(values.insuranceValidity),
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
