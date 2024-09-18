import { isValid } from 'date-fns'
import { utcToZonedTime } from 'date-fns-tz'
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays'

import { RoVignetteErrorType, RoVignetteFormValues } from '../types'
import { Validation } from '~/modules/shared/types'
import { CHISINAU_TIMEZONE } from '~/utils/timezone'
import { validateCertificateNumber, validateUAPlateNumber } from '~/utils/validateCertificateNumber'

export const useRoVignetteValidations = () => {
  const validateInsurance = (values: RoVignetteFormValues): Validation<RoVignetteErrorType> => {
    if (!values.registrationCountry) {
      return { isValid: false, field: 'registrationCountry', type: RoVignetteErrorType.required }
    }

    if (values.registrationCountry === 'MD') {
      if (!values.certificateNumber && !validateCertificateNumber(values.certificateNumber)) {
        return { isValid: false, field: 'certificateNumber', type: RoVignetteErrorType.required }
      }
    } else {
      if (!values.carPlateNumber && !validateUAPlateNumber(values.carPlateNumber)) {
        return { isValid: false, field: 'carPlateNumber', type: RoVignetteErrorType.required }
      }
    }

    const isValidStartDate = values.startDate && isValid(values.startDate)
    if (!isValidStartDate) {
      return { isValid: false, field: 'startDate', type: RoVignetteErrorType.required }
    }

    const isPast =
      differenceInCalendarDays(
        values.startDate as Date,
        utcToZonedTime(new Date().toISOString(), CHISINAU_TIMEZONE)
      ) < 0

    if (isPast) {
      return { isValid: false, field: 'startDate', type: RoVignetteErrorType.isPast }
    }

    if (!values?.price) {
      return { isValid: false, field: 'form', type: RoVignetteErrorType.priceRequired }
    }

    return { isValid: true }
  }

  return { validateInsurance }
}
