import { removeExtraSpaces } from '~/modules/utils/removeExtraSpaces'

const NAME_REGEX = /^[\da-zA-Z -]+$/
const MAX_LENGTH = 255

export const validateName = (value: string | unknown): boolean => {
  if (typeof value !== 'string') {
    return false
  }

  if (value.length === 0) {
    return false
  }

  if (value.length > MAX_LENGTH) {
    return false
  }

  if (!NAME_REGEX.test(removeExtraSpaces(value))) {
    return false
  }

  return true
}
