import { RealEstateType } from '~/modules/realEstate/real-estate-form/real-estate-form.constants'
import { cadastralCodeRegex } from '~/constants'

const isValidLengthCadastralCode = (value: string): boolean => {
  switch (value) {
    case RealEstateType.Terrain:
      return value.length === 11
    case RealEstateType.Building:
      return value.length === 14
    case RealEstateType.Rooms:
      return value.length === 18
    default:
      return true
  }
}

export const isValidCadastralCode = (value: string): boolean =>
  cadastralCodeRegex.test(value) && isValidLengthCadastralCode(value)

export const getCadastralCodeMask = (realEstateType: string): string => {
  switch (realEstateType) {
    case RealEstateType.Terrain:
      return '9999999.999'
    case RealEstateType.Building:
      return '9999999.999.99'
    case RealEstateType.Rooms:
      return '9999999.999.99.999'
    default:
      return ''
  }
}

export const getAddress = (realEstate) => {
  const { Address = {} } = realEstate
  const { Street = '', House = '', Flat = '', Locality = '' } = Address
  const flatNumber = Flat ? `ap. ${Flat}` : ''
  return [Street, House, flatNumber, Locality].filter((el) => Boolean(el)).join(', ')
}
