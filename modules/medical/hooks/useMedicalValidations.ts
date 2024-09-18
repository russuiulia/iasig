import { differenceInCalendarDays, isBefore, isValid } from 'date-fns'
import { Validation } from '~/modules/shared/types'
import { MedicalFormValues, MedicalPerson } from '../types'
import { MedicalErrorType } from '../types/medical-errors'

export const useMedicalValidations = () => {
  const getDuplicatedPersonIDNP = (persons: MedicalPerson[], person: MedicalPerson) => {
    if (!persons.length) {
      return undefined
    }

    return persons.find((p) => p.idnp && p.idnp === person.idnp)
  }

  const validateInsurance = (values: MedicalFormValues): Validation<MedicalErrorType> => {
    // Has at least 1 country
    if (!values.regions?.length) {
      return { isValid: false, field: 'regions', type: MedicalErrorType.required }
    }

    if (!values.tripPurpose) {
      return { isValid: false, field: 'tripPurpose', type: MedicalErrorType.required }
    }

    if (!values.persons?.length) {
      return { isValid: false, field: 'persons', type: MedicalErrorType.required }
    }

    if (!values.persons?.every((el) => el.birthday)) {
      return { isValid: false, field: 'birthday', type: MedicalErrorType.required }
    }

    const isValidStartDate = values.startDate && isValid(values.startDate)
    if (!isValidStartDate) {
      return { isValid: false, field: 'startDate', type: MedicalErrorType.required }
    }

    // Start date shouldn't be from the past
    if (values.startDate && differenceInCalendarDays(values.startDate, new Date()) < 0) {
      return { isValid: false, field: 'startDate', type: MedicalErrorType.isPast }
    }
    // One time insurance checks
    if (!values.isMultipleType) {
      // Is single type and is missing/invalid end date
      const isValidEndDate = values.endDate && isValid(values.endDate)
      if (!isValidEndDate) {
        return { isValid: false, field: 'endDate', type: MedicalErrorType.required }
      }

      // End date shouldn't be from the past
      if (values.endDate && differenceInCalendarDays(values.endDate, new Date()) < 0) {
        return { isValid: false, field: 'endDate', type: MedicalErrorType.isPast }
      }

      // Start date should be less than end date
      if (isBefore(values.endDate as Date, values.startDate as Date)) {
        return { isValid: false, field: 'endDate', type: MedicalErrorType.startGreaterThanEnd }
      }

      // Insurance should have minimum interval of 3 days
      if (differenceInCalendarDays(values.endDate as Date, values.startDate as Date) <= 2) {
        return { isValid: false, field: 'endDate', type: MedicalErrorType.smallDateInterval }
      }
    }

    // Has all required fields for multiply type insurance
    if (values.isMultipleType) {
      if (!values.insuranceValidity) {
        return { isValid: false, field: 'insuranceValidity', type: MedicalErrorType.required }
      }
      if (!values.insuredDays) {
        return { isValid: false, field: 'insuredDays', type: MedicalErrorType.required }
      }
    }

    // Has selected insured amount
    if (!values.amount) {
      return { isValid: false, field: 'amount', type: MedicalErrorType.required }
    }

    // Has selected insurance company
    if (!values.companyName) {
      return { isValid: false, field: 'companyName', type: MedicalErrorType.required }
    }

    return { isValid: true }
  }

  return { getDuplicatedPersonIDNP, validateInsurance }
}
