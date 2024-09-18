import { add, subDays } from 'date-fns'
import { GreenCardValues } from '../green-card-validity/green-card-validity.constants'

export const calculateEndDate = (startDate: Date, insuranceValidity: string) => {
  if (!startDate) {
    return
  }

  const isFirstValue = insuranceValidity?.toString() === GreenCardValues[0]

  const duration = isFirstValue
    ? Number(insuranceValidity)
    : Math.round(Number(insuranceValidity) / 30)

  return subDays(add(startDate, { [isFirstValue ? 'days' : 'months']: duration }), 1)
}
