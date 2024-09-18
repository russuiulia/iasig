import { isValid } from 'date-fns'
const allSectors = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27,
  28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 80,
]
const IDNP_REGEX = /^((2\d{12})|(09\d{11}))$/
const IDNO_REGEX = /^(1\d{12})$/

const validate = (value, regex) => {
  if (!regex.test(value)) {
    return false
  }

  const crc = value
    .substring(0, 12)
    .split('')
    .reduce((acc, char, i) => acc + Number(char) * (i % 3 === 0 ? 7 : i % 3 === 1 ? 3 : 1), 0)

  return Number(value[12]) === crc % 10
}

export const validateIdnp = (value) => validate(value, IDNP_REGEX)
export const validateIdno = (value) => validate(value, IDNO_REGEX)
export const validateIdnx = (value) => validateIdnp(value) || validateIdno(value)

export const validateCNP = (value: string): boolean => {
  if (!value) return false

  if (value.length !== 13) {
    return false
  }

  const control = [2, 7, 9, 1, 4, 6, 3, 5, 8, 2, 7, 9]
  const controlNumber =
    control
      .map((el, index) => {
        return el * Number(value[index])
      })
      .reduce((acc, curr) => acc + curr, 0) % 11

  const number = controlNumber === 10 ? 1 : controlNumber

  if (number !== Number(value[12])) {
    return false
  }

  const year = value.slice(1, 3)
  const month = value.slice(3, 5)
  const day = value.slice(5, 7)

  if (!isValid(new Date(`${month}/${day}/${year}`))) {
    return false
  }

  const sector = Number(value.slice(7, 9))

  if (!allSectors.includes(sector)) {
    return false
  }

  return true
}
