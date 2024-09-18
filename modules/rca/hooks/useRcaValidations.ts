import { differenceInCalendarDays, isValid } from 'date-fns'
import { utcToZonedTime } from 'date-fns-tz'
import { Validation } from '~/modules/shared/types'
import { CHISINAU_TIMEZONE } from '~/utils/timezone'
import {
  validateCertificateNumber,
  validateProvisionallyCertNr,
} from '~/utils/validateCertificateNumber'
import { validateIdno } from '~/utils/validateIdnp'
import { OwnershipRights, RcaFormValues } from '../types'
import { RcaErrors } from '../types/rca-errors.types'

export const useRcaValidations = (validData?: boolean) => {
  const validateInsurance = (values: RcaFormValues): Validation<RcaErrors> => {
    if (!values.idnp) {
      return { isValid: false, field: 'idnp', type: RcaErrors.required }
    }

    if (!values.insuranceValidity) {
      return { isValid: false, field: 'insuranceValidity', type: RcaErrors.required }
    }

    if (!values.companyName) {
      return { isValid: false, field: 'companyName', type: RcaErrors.required }
    }

    if (
      !values.certificateNumber &&
      !validateCertificateNumber(values.certificateNumber) &&
      !validateProvisionallyCertNr(values.certificateNumber)
    ) {
      return { isValid: false, field: 'certificateNumber', type: RcaErrors.required }
    }

    if (!validData && !values.ownership) {
      return { isValid: false, field: 'ownership', type: RcaErrors.required }
    }

    const isValidStartDate = values.startDate && isValid(values.startDate)
    if (!isValidStartDate) {
      return { isValid: false, field: 'startDate', type: RcaErrors.required }
    }

    if (
      values.startDate &&
      differenceInCalendarDays(
        values.startDate,
        utcToZonedTime(new Date().toISOString(), CHISINAU_TIMEZONE)
      ) < 0
    ) {
      return { isValid: false, field: 'startDate', type: RcaErrors.isPast }
    }

    if (!validData && [OwnershipRights.Leasing, OwnershipRights.Lease].includes(values.ownership)) {
      const isValidDocumentDate = values.documentDate && isValid(values.documentDate)
      if (!isValidDocumentDate) {
        return { isValid: false, field: 'documentDate', type: RcaErrors.required }
      }

      if (!values.documentNumber) {
        return { isValid: false, field: 'documentNumber', type: RcaErrors.required }
      }
    }

    if (validateIdno(values.idnp)) {
      if (!values.operatingMode) {
        return { isValid: false, field: 'operatingMode', type: RcaErrors.required }
      }
    }

    return { isValid: true }
  }

  return { validateInsurance }
}
