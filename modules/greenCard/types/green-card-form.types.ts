import { OwnershipRights } from '~/modules/rca/types'
import { AdditionalProduct } from '~/modules/shared/addons'
import { ContractorType } from '~/modules/shared/types/insurance'

export interface GreenCardContactFormValues {
  phone: string
  email: string
  personalDataConsent: boolean
}

export interface GreenCardFormValues {
  zone: string
  startDate: Date | null
  endDate: Date | null
  insuranceValidity: string
  certificateNumber: string
  towingCertificateNumber: string
  towingModel: string
  towingPlateNumber: string
  ownership: OwnershipRights
  idnp: string
  price: number
  insurancePrice?: number
  priceEUR: number
  carModel: string
  plateNumber: string
  contractorName: string
  contractorType: ContractorType
  fiscalInvoice: boolean
  documentNumber: string
  documentDate: Date | null
  personalDataConsent?: boolean
  companyName: string
  phone?: string
  email?: string
  addons?: AdditionalProduct[]
  vignetteStartDate?: Date | null
  minStartDate: Date | null
}
