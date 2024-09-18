import { isValid } from 'date-fns'
import { zonedTimeToUtc } from 'date-fns-tz'
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays'
import { costRegex } from '~/constants'
import { Validation } from '~/modules/shared/types'
import { CHISINAU_TIMEZONE } from '~/utils/timezone'
import { BeneficiaryCode } from '../real-estate-form/real-estate-form.constants'
import { RealEstateValueType } from '../real-estate-value-input/real-estate-value-input.types'
import { RealEstateErrorType, RealEstateFormValues } from '../types'

export const useRealEstateValidations = () => {
  const validateInsurance = (values: RealEstateFormValues): Validation<RealEstateErrorType> => {
    if (!values.realEstateType) {
      return { isValid: false, field: 'realEstateType', type: RealEstateErrorType.required }
    }

    if (!values.insuredValue) {
      return { isValid: false, field: 'insuredValue', type: RealEstateErrorType.required }
    }

    if (values.insuredValue === RealEstateValueType.MARKET_VALUE) {
      if (!values.marketValue) {
        return { isValid: false, field: 'marketValue', type: RealEstateErrorType.required }
      }
      if (!values.marketValue.toString().match(costRegex)) {
        return { isValid: false, field: 'marketValue', type: RealEstateErrorType.validateValue }
      }
    }

    if (values.insuredValue === RealEstateValueType.REPLACEMENT_COST) {
      if (!values.replacementCost) {
        return { isValid: false, field: 'replacementCost', type: RealEstateErrorType.required }
      }

      if (!values.replacementCost.toString().match(costRegex)) {
        return { isValid: false, field: 'replacementCost', type: RealEstateErrorType.validateValue }
      }
    }

    if (!values.insuranceValidity) {
      return { isValid: false, field: 'insuranceValidity', type: RealEstateErrorType.required }
    }

    const isValidStartDate = values.startDate && isValid(values.startDate)
    if (!isValidStartDate) {
      return { isValid: false, field: 'startDate', type: RealEstateErrorType.required }
    }

    const isPast =
      differenceInCalendarDays(
        values.startDate as Date,
        zonedTimeToUtc(new Date(), CHISINAU_TIMEZONE)
      ) < 0

    if (isPast) {
      return { isValid: false, field: 'startDate', type: RealEstateErrorType.isPast }
    }

    if (!values.beneficiary) {
      return { isValid: false, field: 'beneficiary', type: RealEstateErrorType.required }
    }

    if (values.beneficiary === BeneficiaryCode.OTHER && !values.beneficiaryName) {
      return { isValid: false, field: 'beneficiaryName', type: RealEstateErrorType.required }
    }

    if (!values?.price) {
      return { isValid: false, field: 'form', type: RealEstateErrorType.priceRequired }
    }

    if (!values.companyName) {
      return { isValid: false, field: 'companyName', type: RealEstateErrorType.required }
    }

    return { isValid: true }
  }

  return { validateInsurance }
}
