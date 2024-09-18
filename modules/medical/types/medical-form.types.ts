import { ContractorType } from '~/modules/shared/types/insurance'
import { MedicalPerson, Territory } from '.'

export interface MedicalFormValues {
  territories: Territory
  regions: { name: string; value: string[] }[]
  startDate: Date | null
  endDate?: Date | null
  tripPurpose: string
  persons: MedicalPerson[]
  includeAdditionalRisk: boolean
  includeCovidRisk: boolean

  amount: string
  companyName: string
  price: number
  priceEUR: number

  isMultipleType: boolean

  idno: string
  contractorName: string
  contractorBirthday: Date | null
  contractorFirstName: string
  contractorLastName: string
  contractorPassport: string
  contractorType: ContractorType
  fiscalInvoice: boolean

  insuredDays: string
  insuranceValidity: string
  region?: string

  phone?: string
  email?: string
  contractor?: Contractor
}

export type Contractor = {
  fullName: string
  idnx: string
  birthday: Date | null
  firstName: string
  lastName: string
  passport: string
  address: {
    country: string
    region: string
    fullAddress: string
  }
  contractorType: ContractorType
}
