export interface BaggageContactFormValues {
  phone: string
  email: string
  personalDataConsent: boolean
}

export interface BaggageFormValues {
  price: number
  priceEUR: number
  personalDataConsent?: boolean
  companyName: string
  phone?: string
  email?: string
  idnp: string
  amount: string
  flightNumbers: string[]
  baggagePcs: string
  departureDate: Date | null
  fullName: string
  startDate?: Date
  fiscalInvoice: boolean
}
