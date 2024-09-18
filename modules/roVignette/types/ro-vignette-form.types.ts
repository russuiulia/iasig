import { AdditionalProduct } from '~/modules/shared/addons'

export interface RoVignetteContactFormValues {
  phone: string
  email: string
  personalDataConsent: boolean
}

export interface RoVignetteFormValues {
  startDate: Date | null
  certificateNumber: string
  personalDataConsent?: boolean
  vignetteDetails: AdditionalProduct
  price: number
  priceRON: number
  periodDays: number
  description: string
  carModel: string
  carPlateNumber: string
  registrationCountry: string
  phone?: string
  email?: string
  fiscalInvoice: boolean
}
