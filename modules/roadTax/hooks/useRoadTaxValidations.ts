import { Validation } from '~/modules/shared/types'
import { validateCertificateNumber } from '~/utils/validateCertificateNumber'
import { validateIdnx } from '~/utils/validateIdnp'
import { RoadTaxErrorType, RoadTaxFormValues } from '../types'

export const useRoadTaxValidations = () => {
  const validateInsurance = (values: RoadTaxFormValues): Validation<RoadTaxErrorType> => {
    if (!values.certificateNumber && !validateCertificateNumber(values.certificateNumber)) {
      return { isValid: false, field: 'certificateNumber', type: RoadTaxErrorType.required }
    }

    if (!values.idnp && !validateIdnx(values.idnp)) {
      return { isValid: false, field: 'idnp', type: RoadTaxErrorType.required }
    }

    if (!values?.price) {
      return { isValid: false, field: 'form', type: RoadTaxErrorType.priceRequired }
    }

    return { isValid: true }
  }

  return { validateInsurance }
}
