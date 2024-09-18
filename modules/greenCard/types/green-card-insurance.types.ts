import { Timestamp } from 'firebase/firestore'
import { OwnershipRights } from '~/modules/rca/types'
import { Contractor } from '~/services/interfaces/rca'

export type GreenCardPreOrderInsurance = {
  zone: string
  startDate: Timestamp
  endDate: Timestamp
  insuranceValidity: number
  certificateNumber: string
  towingCertificateNumber: string
  towingModel: string
  towingPlateNumber: string
  ownership: OwnershipRights
  idnp: string
  price: number
  priceEUR: number
  carModel: string
  documentNumber: string
  documentDate: Timestamp
  companyName: string
  plateNumber: string
  contractor: Contractor
}
