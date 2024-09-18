import { Timestamp } from 'firebase/firestore'
import { Contractor } from '~/services/interfaces/rca'

import { OwnershipRights } from '.'

export type RcaPreOrderInsurance = {
  startDate: Timestamp
  endDate: Timestamp
  idnp: string
  certificateNumber: string
  insuranceValidity: number
  towingCertificateNumber: string
  towingModel: string
  towingPlateNumber: string
  operatingMode: string
  ownership: OwnershipRights
  documentNumber: string
  documentDate: Timestamp
  price: number
  carModel: string
  plateNumber: string
  companyName: string
  contractor: Contractor
}
