import { Timestamp } from 'firebase/firestore'

import { IsgOrder } from '../../../../services/interfaces/order'
import { ContractorType, DocumentTypes, InsuranceType } from '../../types/insurance'
import { Billing } from '~/interfaces/preOrder'

export type CreateOrderRequest = {
  items: CartItem[]
  id?: string
}

export enum ORDER_STATUS {
  DRAFT = 'draft',
  PAID = 'paid',
  PROCESSING = 'processing',
  FAILED = 'failed',
  COMPLETED = 'completed',
  REFUNDED = 'refunded',
}

export enum STATUS {
  DRAFT = 'draft',
  PAID = 'paid',
  ISSUED = 'issued',
  COMPLETED = 'completed',
  EXPIRED = 'expired',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

interface CartItemBase {
  id?: string
  error?: string
}

export enum ContractType {
  Unlimited = 'unlimited',
  Limited = 'limited',
}
export enum OwnershipRights {
  Property = 'property',
  Lease = 'lease',
  Leasing = 'leasing',
  PowerOfAttorney = 'power-of-attorney',
}
export type RcaPerson = {
  id?: string
  idnp: string
}

export type RcaDetailsFirestore = {
  idnp: string
  certificateNumber: string
  ownership: OwnershipRights
  documentNumber?: string
  persons?: RcaPerson[]
  price: number
  insurancePrice?: number
  carModel: string
  plateNumber: string
  bonusMalus: string
  companyName: string
  externalContract?: string
  payment?: Payment
  operatingMode: string
  towingCertificateNumber: string
  towingPlateNumber: string
  towingModel: string
  contractor: Contractor
  startDate: Timestamp
  endDate: Timestamp
  documentDate?: Timestamp
  insuranceValidity: number
}

export enum PaymentSource {
  MAIB = 'maib',
  PAYNET = 'paynet',
  MPAY = 'mpay',
}

export type Receipt = {
  id?: string
  amount: number
  currency: string
  receiptId?: number
  orderId: string
  registeredAt?: string
  receivedAt?: any
  source: PaymentSource
  transactionId: string
  paidAt?: any
  status?: Date
}

export type Payment = {
  issuedTo: { idnp: string }
  reason: string
  receipts?: Receipt[]
  status?: string
}

export type Contractor = {
  fullName: string
  birthday?: any
  idnx: string
  address?: {
    country: string
    region: string
    fullAddress: string
  }
  contractorType: ContractorType
  fiscalInvoice: boolean
}

export type GreenCardDetailsFirestore = {
  zone: string
  insuranceValidity: number
  certificateNumber: string
  ownership: OwnershipRights
  carModel: string
  plateNumber: string
  idnp: string
  price: number
  insurancePrice?: number
  priceEUR: number
  companyName: string
  externalContract?: string
  documentNumber?: string
  scannedDocumentRef?: string
  payment?: Payment
  exchangeRate?: number
  towingCertificateNumber: string
  towingPlateNumber: string
  towingModel: string
  contractor: Contractor
  startDate: Timestamp
  endDate: Timestamp
  documentDate?: Timestamp
}

export interface GreenCardItem extends CartItemBase {
  type: InsuranceType.GREEN_CARD
  details: GreenCardDetailsFirestore
}

export interface RcaItem extends CartItemBase {
  type: InsuranceType.RCA
  details: RcaDetailsFirestore
}

export type MedicalPersonFirestore = {
  id: string
  fullName: string
  firstName: string
  lastName: string
  idnp: string
  passportNumber: string
  address: string
  passportSeries: string
  birthday: Timestamp
}

export interface Territories {
  countries: string[]
  region: string
  zoneKey: string[]
  zoneValues: string
}

export interface TripPurpose {
  name: string
  activities: string[]
}

export type MedicalDetailsFirestore = {
  territories: Territories
  tripPurpose: TripPurpose

  includeCovidRisk: boolean
  includeAdditionalRisk: boolean

  amount: string
  companyName: string
  price: number
  insurancePrice?: number
  priceEUR: number

  isMultipleType: boolean
  insuranceValidity: number
  insuredDays: number
  exchangeRate: number
  insuranceType?: InsuranceType
  contractor: Contractor
  externalContract?: string
  persons: MedicalPersonFirestore[]
  startDate: Timestamp
  endDate: Timestamp
}

export interface MedicalItem extends CartItemBase {
  type: InsuranceType.MEDICAL
  details: MedicalDetailsFirestore
}

export type MedicalOptionalDetailsFirestore = {
  nationalityCode: string
  nationalityText: string
  includeAdditionalRisk: boolean
  amount: string
  companyName: string
  price: number
  insurancePrice?: number
  insuranceValidity: number
  insuranceType?: InsuranceType
  riskFactors: string[]
  insuredDays: number
  contractor: Contractor
  persons: MedicalPersonFirestore[]
  startDate: Timestamp
  endDate: Timestamp
}

export interface MedicalOptionalItem extends CartItemBase {
  type: InsuranceType.MEDICAL_OPTIONAL
  details: MedicalOptionalDetailsFirestore
}

export type RealEstateDetailsFirestore = {
  amount: string
  companyName: string
  price: number
  insuranceValidity: number
  insuredDays: number
  insuranceType?: InsuranceType
  beneficiary: string
  beneficiaryName: string
  cadastralCode: string
  insuredValue: string
  marketValue: number
  replacementCost: number
  realEstateType: string
  identitySeries: string
  contractor: Contractor
  startDate: Timestamp
  endDate: Timestamp
}

export interface RealEstateItem extends CartItemBase {
  type: InsuranceType.REAL_ESTATE
  details: RealEstateDetailsFirestore
}

export interface RoVignetteDetails {
  serviceId: number
  categoryId: number
  valid_from_day: number
  valid_from_month: number
  valid_from_year: number
  externalServiceId: number
  externalServiceCategoryId: number
  price: number
  certificateNumber: string
}

export interface RoVignetteItem extends CartItemBase {
  type: InsuranceType.RO_VIGNETTE
  details: RoVignetteDetails
}

export type CartItem =
  | GreenCardItem
  | RcaItem
  | MedicalItem
  | MedicalOptionalItem
  | RealEstateItem
  | RoVignetteItem

export interface ProductAttachment {
  type: InsuranceType
  files?: Documents[]
  status: STATUS
}

export type Documents = {
  name: string
  type: string
  url: string
}

export interface OrderV2 {
  _v: 2
  status?: ORDER_STATUS
  author: Author
  items: CartItem[]
  /**
   * true if items are processed by the backend
   */
  confirmed: boolean
  createdAt: Timestamp
  updatedAt: Timestamp
  completedAt?: Timestamp
  contact?: {
    phone: string
    email?: string
  }
  invoice: { file: { name: DocumentTypes; type: string; url: string } }
  payment?: Payment
  productsAttachments?: {
    [key: string]: ProductAttachment
  }
  details?: {
    price: number
  }
  deliveryRef?: string
  billing: Billing
}

export type Author = {
  uid: string
}
export interface OrderV2 {
  _v: 2
  status?: ORDER_STATUS
  author: Author
  items: CartItem[]
  /**
   * true if items are processed by the backend
   */
  dataConfirmed: boolean
  createdAt: Timestamp
  updatedAt: Timestamp
  completedAt?: Timestamp
  productsAttachments?: {
    [key: string]: ProductAttachment
  }
  details?: {
    price: number
  }
  seller?: Seller
}

export type Seller = {
  IDNO: string
  paymentMethods: string[]
}

export function isV2Order<T>(order: IsgOrder<T> | OrderV2): order is OrderV2 {
  return order._v === 2
}
