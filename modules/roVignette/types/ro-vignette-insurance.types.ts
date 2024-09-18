import { Timestamp } from 'firebase/firestore'
import { Contractor } from '~/services/interfaces/rca'

export type RoVignettePreOrderInsurance = {
  startDate: Timestamp
  insuranceValidity: number
  certificateNumber: string
  idnp: string
  price: number
  priceEUR: number
  carModel: string
  companyName: string
  contractor: Contractor
}
