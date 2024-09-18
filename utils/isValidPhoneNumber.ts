import parsePhoneNumber from 'libphonenumber-js'

export const isValidPhoneNumber = (phone: string): boolean | undefined => {
  const newPhone = phone.replace(/\+/g, '')
  const parsed = parsePhoneNumber(`+${newPhone}`)
  return parsed ? parsed?.isValid() : false
}
