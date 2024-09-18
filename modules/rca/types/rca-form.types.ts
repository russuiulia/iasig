import { ContractorType } from '~/modules/shared/types/insurance'

export enum OwnershipRights {
  Property = 'property',
  Lease = 'lease',
  Leasing = 'leasing',
  PowerOfAttorney = 'power-of-attorney',
}

export interface RcaFormValues {
  contractor: any
  idnp: string
  certificateNumber: string
  towingCertificateNumber: string
  towingModel: string
  towingPlateNumber: string
  operatingMode: string
  ownership: OwnershipRights
  documentNumber: string
  documentDate: Date | null
  insuranceValidity: string
  startDate: Date | null
  endDate: Date | null
  price: number
  carModel: string
  plateNumber: string
  personalDataConsent?: boolean
  companyName: string
  phone?: string
  email?: string
  contractorName: string
  contractorType: ContractorType
  fiscalInvoice: boolean
}

export interface RcaContactFormValues {
  phone: string
  email: string
  personalDataConsent: boolean
}
