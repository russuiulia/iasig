export interface RoadAssistanceEUContactFormValues {
  phone: string
  email: string
  personalDataConsent: boolean
}

export interface RoadAssistanceEUFormValues {
  startDate: Date | null
  endDate: Date | null
  certificateNumber: string
  personalDataConsent?: boolean
  price: number
  priceRON: number
  carModel: string
  plateNumber: string
  phone?: string
  email?: string
  period: string
  coverage: string
  minStartDate: Date | null
  fiscalInvoice: boolean
}
