import { Timestamp } from 'firebase/firestore'

export type RealEstatePreOrderInsurance = {
  cadastralCode: string
  insuredValue: string
  marketValue: string
  replacementCost: string
  startDate: Timestamp
  endDate: Timestamp
  insuranceValidity: number
  insuredDays: string
  price: number
  companyName: string
  beneficiary: string
  beneficiaryName: string
  idnp: string
  amount: string
  fullName: string
  identitySeries: string
  contractorAddress: string
  realEstateType: string
}
