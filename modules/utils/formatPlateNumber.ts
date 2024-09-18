export const formatPlateNumber = (plateNumber) => {
  if (!plateNumber) {
    return ''
  }

  return plateNumber.replace(/(\D)(\d)/, '$1 $2')
}
