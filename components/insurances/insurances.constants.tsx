import { CardInfo } from './insurances.types'
import { InsuranceType } from '~/modules/shared/types/insurance'

export const INSURANCES: CardInfo[] = [
  {
    insuranceType: InsuranceType.MEDICAL,
    color: 'gray',
    local: true,
    pageKey: '/medical',
  },
  {
    imgSrc: '09bc50c0-df85-4f78-9138-f79985822100',
    color: 'green',
    insuranceType: InsuranceType.GREEN_CARD,
    pageKey: '/green-card',
  },
  {
    imgSrc: 'c7831ec3-a441-46e4-ab94-26c90c039800',
    color: 'blue',
    insuranceType: InsuranceType.RCA,
    pageKey: '/rca',
  },
  {
    insuranceType: InsuranceType.RO_VIGNETTE,
    color: 'peach',
    local: true,
    pageKey: '/rovinieta',
  },
  {
    insuranceType: InsuranceType.ROAD_SIDE_ASSISTANCE_EU,
    color: 'frenchPass',
    local: true,
    pageKey: '/asistenta-rutiera-ue',
  },
  {
    insuranceType: InsuranceType.MEDICAL_OPTIONAL,
    local: true,
    color: 'purple',
    pageKey: '/medical-optional',
  },
  {
    insuranceType: InsuranceType.REAL_ESTATE,
    color: 'orange',
    local: true,
    pageKey: '/ipoteca',
  },
]
