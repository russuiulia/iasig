import { InsuranceType } from '~/modules/shared/types/insurance'

export interface CardInfo {
  imgSrc?: string
  insuranceType: InsuranceType
  color: string
  pageKey: string
  local?: boolean
}
