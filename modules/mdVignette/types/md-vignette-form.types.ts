export interface MdVignetteContactFormValues {
  phone: string
  email: string
  personalDataConsent: boolean
}

export interface MdVignetteFormValues {
  vehicleType: string
  startDate: Date | null
  country: string
  plateNumber: string
  idnp: string
  driverFullName: string
  personalDataConsent?: boolean
  price: number
  priceEUR: number
  phone?: string
  email?: string
  validity: string
  fiscalInvoice: boolean
}
