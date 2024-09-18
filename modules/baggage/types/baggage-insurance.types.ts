import { Timestamp } from 'firebase/firestore'
import { Contractor } from '~/services/interfaces/rca'

export type BaggagePreOrderInsurance = {
  startDate: Timestamp
  price: number
  priceEUR: number
  companyName: string
  amount: string
  baggagePcs: string
  flightNumbers: string[]
  idnp: string
  contractor: Contractor
}
