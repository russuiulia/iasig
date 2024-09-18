export const extractPassportSeries = (passportNumber) => {
  if ((passportNumber || '').match(/^\d+$/)) {
    return null
  }

  const regex = /^\d*[a-zA-Z]*/g
  return (passportNumber || '').match(regex)?.[0] || null
}

export const extractPassportNumber = (passportNumber) => {
  const series = extractPassportSeries(passportNumber)
  return (passportNumber || '').split(series).filter((el) => el)[0] || null
}
