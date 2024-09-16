import { AdditionalProduct } from '../modules/shared/addons'
import { ContractorType, InsuranceType } from '../modules/shared/types/insurance'

type Contact = {
  phone: string
  email: string
}

/* eslint-disable @typescript-eslint/no-unnecessary-type-constraint */

export interface PreOrder<T extends any> {
  insuranceType: InsuranceType
  createdAt: Date
  confirmed: boolean
  details: T
  contact: Contact
  productTypes?: InsuranceType[]
  addons?: AdditionalProduct[]
  billing?: Billing
}

export type Billing = {
  contractor: ContractorType
  fiscalInvoice: boolean
  fullName: string
  idnx: string
}
