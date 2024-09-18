import { isValid } from 'date-fns'
import { utcToZonedTime } from 'date-fns-tz'
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays'
import { Validation } from '~/modules/shared/types'
import { CHISINAU_TIMEZONE } from '~/utils/timezone'
import { MdVignetteErrorType, MdVignetteFormValues } from '../types'

export const useMdVignetteValidations = () => {
  const validateInsurance = (values: MdVignetteFormValues): Validation<MdVignetteErrorType> => {
    if (!values.plateNumber) {
      return { isValid: false, field: 'plateNumber', type: MdVignetteErrorType.required }
    }

    const isValidStartDate = values.startDate && isValid(values.startDate)
    if (!isValidStartDate) {
      return { isValid: false, field: 'startDate', type: MdVignetteErrorType.required }
    }

    const isPast =
      differenceInCalendarDays(
        values.startDate as Date,
        utcToZonedTime(new Date().toISOString(), CHISINAU_TIMEZONE)
      ) < 0

    if (isPast) {
      return { isValid: false, field: 'startDate', type: MdVignetteErrorType.isPast }
    }

    if (!values?.vehicleType) {
      return { isValid: false, field: 'vehicleType', type: MdVignetteErrorType.required }
    }

    if (!values?.country) {
      return { isValid: false, field: 'country', type: MdVignetteErrorType.required }
    }

    if (!values?.driverFullName) {
      return { isValid: false, field: 'driverFullName', type: MdVignetteErrorType.required }
    }

    if (!values?.idnp) {
      return { isValid: false, field: 'idnp', type: MdVignetteErrorType.required }
    }

    if (!values?.price) {
      return { isValid: false, field: 'form', type: MdVignetteErrorType.priceRequired }
    }

    return { isValid: true }
  }

  return { validateInsurance }
}
