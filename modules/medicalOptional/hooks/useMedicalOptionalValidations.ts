import { differenceInCalendarDays, isValid } from 'date-fns'
import { Validation } from '~/modules/shared/types'
import { MedicalOptionalFormValues, MedicalOptionalPerson } from '../types'
import { MedicalOptionalErrorType } from '../types/medical-optional-errors'

export const useMedicalOptionalValidations = () => {
  const getDuplicatedPersonIDNP = (
    persons: MedicalOptionalPerson[],
    person: MedicalOptionalPerson
  ) => {
    if (!persons.length) {
      return undefined
    }

    return persons.find((p) => p.idnp && p.idnp === person.idnp)
  }

  const validateInsurance = (
    values: MedicalOptionalFormValues
  ): Validation<MedicalOptionalErrorType> => {
    if (!values.nationalityCode) {
      return { isValid: false, field: 'nationalityCode', type: MedicalOptionalErrorType.required }
    }

    if (!values.persons?.length) {
      return { isValid: false, field: 'persons', type: MedicalOptionalErrorType.required }
    }

    if (!values.persons?.every((el) => el.birthday)) {
      return { isValid: false, field: 'birthday', type: MedicalOptionalErrorType.required }
    }

    const isValidStartDate = values.startDate && isValid(values.startDate)
    if (!isValidStartDate) {
      return { isValid: false, field: 'startDate', type: MedicalOptionalErrorType.required }
    }

    // Start date shouldn't be from the past
    if (values.startDate && differenceInCalendarDays(values.startDate, new Date()) < 0) {
      return { isValid: false, field: 'startDate', type: MedicalOptionalErrorType.isPast }
    }

    if (!values.insuranceValidity) {
      return { isValid: false, field: 'insuranceValidity', type: MedicalOptionalErrorType.required }
    }

    // Has selected insured amount
    if (!values.amount) {
      return { isValid: false, field: 'amount', type: MedicalOptionalErrorType.required }
    }

    // Has selected insurance company
    if (!values.companyName) {
      return { isValid: false, field: 'companyName', type: MedicalOptionalErrorType.required }
    }

    return { isValid: true }
  }

  return { getDuplicatedPersonIDNP, validateInsurance }
}
