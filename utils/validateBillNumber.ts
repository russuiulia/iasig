import { removeExtraSpaces } from '~/modules/utils/removeExtraSpaces'

const NAME_REGEX = /^[A,B,0-9]+$/

export const validateBillNumber = (value: string | unknown): boolean => {
  if (typeof value !== 'string') {
    return false
  }

  if (value.length === 0) {
    return false
  }

  if (!NAME_REGEX.test(removeExtraSpaces(value))) {
    return false
  }

  return true
}
