import { differenceInCalendarDays, endOfDay } from 'date-fns'
import { utcToZonedTime } from 'date-fns-tz'
import { InsuranceType } from '~/modules/shared/types/insurance'
import { CHISINAU_TIMEZONE } from './timezone'

export const expireSoon = (order) => {
  const { insuranceType, details } = order
  const diffDays = differenceInCalendarDays(
    endOfDay(utcToZonedTime(order?.details?.endDate?.toDate?.()?.toISOString(), CHISINAU_TIMEZONE)),
    endOfDay(utcToZonedTime(new Date().toISOString(), CHISINAU_TIMEZONE))
  )

  return diffDays > daysBeforeExpire(insuranceType, details?.insuredDays) ? false : true
}

export const isActiveInsurance = (order) => {
  const diffDays = differenceInCalendarDays(
    endOfDay(utcToZonedTime(order?.details?.endDate?.toDate?.()?.toISOString(), CHISINAU_TIMEZONE)),
    endOfDay(utcToZonedTime(new Date().toISOString(), CHISINAU_TIMEZONE))
  )

  return diffDays < 0 ? false : true
}

const daysBeforeExpire = (insuranceType: InsuranceType, insuredDays: number): number => {
  switch (insuranceType) {
    case InsuranceType.RCA:
      return 3
    case InsuranceType.MEDICAL:
      return insuredDays >= 30 ? 5 : 1
    default:
      return 1
  }
}

export const isExpired = (endDate) => {
  const diffDays = differenceInCalendarDays(
    endOfDay(utcToZonedTime(endDate?.toDate?.()?.toISOString(), CHISINAU_TIMEZONE)),
    endOfDay(utcToZonedTime(new Date().toISOString(), CHISINAU_TIMEZONE))
  )

  return diffDays < 0
}
