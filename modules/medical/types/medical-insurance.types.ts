import { Timestamp } from 'firebase/firestore'

import { ContractorType } from '~/modules/shared/types/insurance'

export type Territory = {
  countries: string[]
  zoneKey: string[]
  zoneValues: string
  region?: string
}
export interface TripPurpose {
  name: string
  activities: string[]
}

export type MedicalPreOrderInsurance = {
  territories: Territory
  startDate: Timestamp
  endDate?: Timestamp
  tripPurpose: TripPurpose

  persons: MedicalPerson[]

  includeCovidRisk: boolean
  includeAdditionalRisk: boolean

  amount: string
  companyName: string
  price: number
  priceEUR: number

  isMultipleType: boolean
  insuranceValidity: number
  insuredDays: number

  idno: string
  contractorName: string
  contractorBirthday: Date | null
  contractorFirstName: string
  contractorLastName: string
  contractorPassport: string
  contractorType: ContractorType
}

export interface MedicalPerson {
  name?: string
  id?: string
  fullName: string
  idnp: string
  birthday: Date | null
  passport: string
  passportSeries?: string
  passportNumber?: string
  address: string
  firstName: string
  lastName: string
}
