export const emailValidator =
  /^(([^<>()\\[\]\\.,;:\s@"]+(\.[^<>()\\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
export const provisionallyCertNrValidator = /^([B,b]\d{9}|[Aa][Bb]\d{6})$/
export const certificateNumberValidator = /^\d{9}$/
export const passportNumberValidator = /^\d*[a-zA-Z]*\d+$/
export const dateRegex = /^\d{2}.\d{2}.\d{4}$/
export const alphaNumeric = /^[a-zA-Z0-9]+$/
export const orderIdRegex = /^[IAM|IAE|IAI|IAF|IMB|IAO|ROV|TFD|MDV|RSA]{3}[0-9]{6}[A-Z]{3}$/
export const cadastralCodeRegex = /^\d+(\.\d+)*$/
export const costRegex = /^[1-9]{1}[0-9]+$/
export const uaPlateNumber = /[A-Za-zА-Яа-яЁё]{2}\d{4}[A-Za-zА-Яа-яЁё]{2}/
