

import { InsuranceType } from '../types/insurance'

export type AdditionalProduct = {
  addonCategoryName?: 'vignette' | 'other'
  addonType: string
  carModel: string
  carPlateNumber: string
  currency: string
  description?: string
  externalCategory?: string
  externalServiceCategoryId?: number | string
  externalServiceId: number | string
  maxInterval?: number
  name?: string
  periodDays?: number
  price: number
  priceMDL: number
  regionName?: string
  startDate: Date | null
  priceRON: number
}

type Props = {
  allAddons: AdditionalProduct[]
  onChange: (value: AdditionalProduct[]) => void
  selectedDate: Date
  insuranceType?: InsuranceType
}

