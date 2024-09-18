import { Timestamp } from 'firebase/firestore'

import { ContractorType } from '~/modules/shared/types/insurance'

export type MedicalOptionalPreOrderInsurance = {
  nationalityCode: string
  startDate: Timestamp
  endDate?: Timestamp
  persons: MedicalOptionalPerson[]
  includeAdditionalRisk: boolean
  riskFactors: string[]
  amount: string
  companyName: string
  price: number
  insuranceValidity: number
  insuredDays: number

  idno: string
  contractorName: string
  contractorBirthday: Date | null
  contractorPassport: string
  contractorType: ContractorType
  contractorAddress: string
}

export interface MedicalOptionalPerson {
  name?: string
  id?: string
  fullName: string
  idnp: string
  birthday: Date | null
  passportNumber: string
  address: string
}
