import { add, differenceInMinutes, endOfDay, setHours } from 'date-fns'
import { setMidDay } from './dateTime'

export const hoursOptions = (): Date[] => {
  const today = new Date()
  const todayEvening = setHours(setMidDay(today), 20)
  const tomorrow = add(todayEvening, { days: 1 })

  return differenceInMinutes(endOfDay(today), today) <= 360 ? [tomorrow] : [todayEvening, tomorrow]
}
