export interface RealEstateContactFormValues {
  phone: string
  email: string
  personalDataConsent: boolean
}

export interface RealEstateFormValues {
  cadastralCode: string
  insuredValue: string
  marketValue: string
  replacementCost: string
  startDate: Date | null
  endDate: Date | null
  insuredDays: string
  insuranceValidity: string
  price: number
  personalDataConsent?: boolean
  companyName: string
  phone?: string
  email?: string
  idnp: string
  identitySeries: string
  contractorAddress: string
  fullName: string
  name?: string
  beneficiary: string
  beneficiaryName: string
  amount: string
  realEstateType: string
  fiscalInvoice: boolean
}
