export const getAddress = (address) => {
  if (!address) return ''

  const { Street = '', House = '', Locality = '', Region = '' } = address
  const streetNumber = Street ? `str. ${Street}` : ''

  return [Locality, Region, streetNumber, House].filter((el) => Boolean(el)).join(', ')
}
