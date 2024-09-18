import { Validation } from '~/modules/shared/types'
import { BaggageErrorType, BaggageFormValues } from '../types'

export const useBaggageValidations = () => {
  const validateInsurance = (values: BaggageFormValues): Validation<BaggageErrorType> => {
    if (!values.baggagePcs) {
      return { isValid: false, field: 'baggagePcs', type: BaggageErrorType.required }
    }

    if (Number(values.baggagePcs) <= 0) {
      return { isValid: false, field: 'baggagePcs', type: BaggageErrorType.required }
    }

    if (!values.flightNumbers?.length) {
      return { isValid: false, field: 'flightNumbers', type: BaggageErrorType.required }
    }

    if (!values.idnp) {
      return { isValid: false, field: 'idnp', type: BaggageErrorType.required }
    }

    if (!values.fullName) {
      return { isValid: false, field: 'fullName', type: BaggageErrorType.required }
    }

    return { isValid: true }
  }

  return { validateInsurance }
}
