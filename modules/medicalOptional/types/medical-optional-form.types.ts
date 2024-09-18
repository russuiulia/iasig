import { MedicalOptionalPerson } from '.'
import { Contractor } from '~/modules/shared/orderV2/types'
import { ContractorType } from '~/modules/shared/types/insurance'

export interface MedicalOptionalFormValues {
  nationalityCode: string
  startDate: Date | null
  endDate?: Date | null
  riskFactors: string[]
  persons: MedicalOptionalPerson[]
  includeAdditionalRisk: boolean
  amount: string
  companyName: string
  price: number
  insuranceValidity: string
  phone?: string
  email?: string
  insuredDays: number
  contractorType: ContractorType
  contractorName: string
  idno: string
  contractorAddress: string
  contractor?: Contractor
  fiscalInvoice: boolean
}

export interface MedicalOptionalContactFormValues {
  phone: string
  email: string
  personalDataConsent: boolean
}
