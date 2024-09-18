import { ContractorType } from '~/modules/shared/types/insurance'

export interface RoadTaxContactFormValues {
  phone: string
  email: string
  personalDataConsent: boolean
}

export interface RoadTaxFormValues {
  certificateNumber: string
  personalDataConsent?: boolean
  price: number
  carModel: string
  plateNumber: string
  idnp: string
  vinCode: string
  phone?: string
  email?: string
  locality: { localityId: number; group: string; name: string; key: number }
  region: string
  fullName: string
  contractorType: ContractorType
  localityId: number | null
  localityName: string
  fiscalInvoice: boolean
}
