import { set } from 'date-fns'

export const setMidDay = (day: Date) => {
  if (!day) {
    return day
  }
  return set(day, { hours: 12, minutes: 0, seconds: 0 })
}
