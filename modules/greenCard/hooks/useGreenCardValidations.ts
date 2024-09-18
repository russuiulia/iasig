import { isValid } from 'date-fns'
import { utcToZonedTime } from 'date-fns-tz'
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays'

import { GreenCardErrorType, GreenCardFormValues } from '../types'
import { OwnershipRights } from '~/modules/rca/types'
import { Validation } from '~/modules/shared/types'
import { CHISINAU_TIMEZONE } from '~/utils/timezone'
import { validateCertificateNumber } from '~/utils/validateCertificateNumber'

export const useGreenCardValidations = (validData?: boolean) => {
  const validateInsurance = (values: GreenCardFormValues): Validation<GreenCardErrorType> => {
    if (!values.insuranceValidity) {
      return { isValid: false, field: 'insuranceValidity', type: GreenCardErrorType.required }
    }

    if (
      !values.certificateNumber &&
      !(
        validateCertificateNumber(values?.certificateNumber) ||
        !!values?.certificateNumber.match(/^([Aa][Bb]\d{6})$/)
      )
    ) {
      return { isValid: false, field: 'certificateNumber', type: GreenCardErrorType.required }
    }

    if (!values.idnp) {
      return { isValid: false, field: 'idnp', type: GreenCardErrorType.required }
    }

    if (!validData && !values.ownership) {
      return { isValid: false, field: 'ownership', type: GreenCardErrorType.required }
    }

    if (!validData && [OwnershipRights.Leasing, OwnershipRights.Lease].includes(values.ownership)) {
      const isValidDocumentDate = values.documentDate && isValid(values.documentDate)
      if (!isValidDocumentDate) {
        return { isValid: false, field: 'documentDate', type: GreenCardErrorType.required }
      }

      if (!values.documentNumber) {
        return { isValid: false, field: 'documentNumber', type: GreenCardErrorType.required }
      }
    }

    const isValidStartDate = values.startDate && isValid(values.startDate)
    if (!isValidStartDate) {
      return { isValid: false, field: 'startDate', type: GreenCardErrorType.required }
    }

    const isNotValidMinStartDate =
      differenceInCalendarDays(values.startDate as Date, new Date(values.minStartDate as Date)) ===
      -1

    if (isNotValidMinStartDate) {
      return { isValid: false, field: 'startDate', type: GreenCardErrorType.isNotValidMinStartDate }
    }

    const isPast =
      differenceInCalendarDays(
        values.startDate as Date,
        utcToZonedTime(new Date().toISOString(), CHISINAU_TIMEZONE)
      ) < 0

    if (isPast) {
      return { isValid: false, field: 'startDate', type: GreenCardErrorType.isPast }
    }

    if (!values?.price) {
      return { isValid: false, field: 'form', type: GreenCardErrorType.priceRequired }
    }

    if (!values.companyName) {
      return { isValid: false, field: 'companyName', type: GreenCardErrorType.required }
    }

    return { isValid: true }
  }

  return { validateInsurance }
}
