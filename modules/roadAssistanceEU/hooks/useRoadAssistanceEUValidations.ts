import { isValid } from 'date-fns'
import { utcToZonedTime } from 'date-fns-tz'
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays'

import { RoadAssistanceEUErrorType, RoadAssistanceEUFormValues } from '../types'
import { Validation } from '~/modules/shared/types'
import { CHISINAU_TIMEZONE } from '~/utils/timezone'
import { validateCertificateNumber } from '~/utils/validateCertificateNumber'

export const useRoadAssistanceEUValidations = () => {
  const validateInsurance = (
    values: RoadAssistanceEUFormValues
  ): Validation<RoadAssistanceEUErrorType> => {
    if (!values.certificateNumber && !validateCertificateNumber(values.certificateNumber)) {
      return {
        isValid: false,
        field: 'certificateNumber',
        type: RoadAssistanceEUErrorType.required,
      }
    }

    const isValidStartDate = values.startDate && isValid(values.startDate)
    if (!isValidStartDate) {
      return { isValid: false, field: 'startDate', type: RoadAssistanceEUErrorType.required }
    }

    const isNotValidMinStartDate =
      differenceInCalendarDays(values.startDate as Date, new Date(values.minStartDate as Date)) ===
      -1

    if (isNotValidMinStartDate) {
      return {
        isValid: false,
        field: 'startDate',
        type: RoadAssistanceEUErrorType.isNotValidMinStartDate,
      }
    }

    const isPast =
      differenceInCalendarDays(
        values.startDate as Date,
        utcToZonedTime(new Date().toISOString(), CHISINAU_TIMEZONE)
      ) < 0

    if (isPast) {
      return { isValid: false, field: 'startDate', type: RoadAssistanceEUErrorType.isPast }
    }

    if (!values?.price) {
      return { isValid: false, field: 'form', type: RoadAssistanceEUErrorType.priceRequired }
    }

    return { isValid: true }
  }

  return { validateInsurance }
}
