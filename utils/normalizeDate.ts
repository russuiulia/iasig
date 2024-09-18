import { fromUnixTime, parseISO } from 'date-fns'

export const normalizeDate = (
  date: Date | number | string | { seconds?: number } | null | undefined
): Date | null => {
  if (typeof date === 'number') {
    return new Date(date)
  } else if (typeof date === 'string') {
    return parseISO(date)
  } else if (date instanceof Date) {
    return date
  } else if (date && typeof date.seconds === 'number') {
    return fromUnixTime(date.seconds)
  }

  return null
}
