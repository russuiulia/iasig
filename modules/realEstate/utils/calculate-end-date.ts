import { add, isValid, subDays } from 'date-fns'
import { RealEstateValues } from '../real-estate-validity/real-estate-validity.constants'

export const calculateEndDate = (startDate: Date, insuranceValidity: string) => {
  if (!startDate && isValid(startDate)) {
    return
  }

  const duration =
    insuranceValidity === RealEstateValues[0]
      ? Number(insuranceValidity)
      : Math.round(Number(insuranceValidity) / 30)

  return subDays(
    add(startDate, { [insuranceValidity === RealEstateValues[0] ? 'days' : 'months']: duration }),
    1
  )
}
