import { Contractor } from '~/services/interfaces/rca'

export type RoadTaxPreOrderInsurance = {
  certificateNumber: string
  idnp: string
  price: number
  carModel: string
  companyName: string
  contractor: Contractor
}
