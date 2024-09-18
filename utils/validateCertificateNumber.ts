import {
  certificateNumberValidator,
  provisionallyCertNrValidator,
  uaPlateNumber,
} from '~/constants'

export const validateCertificateNumber = (certificateNumber: string) => {
  return !!certificateNumber.match(certificateNumberValidator)
}

export const validateProvisionallyCertNr = (certificateNumber: string) => {
  return !!certificateNumber.match(provisionallyCertNrValidator)
}

export const validateUAPlateNumber = (plateNumber: string) => {
  return !!plateNumber.match(uaPlateNumber)
}
