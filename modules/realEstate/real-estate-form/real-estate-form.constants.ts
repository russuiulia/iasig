export const InsuredValues = ['RC', 'MV'] // marketValue, replacementCost
export enum InsuredValuesType {
  MARKET_VALUE = 'MV',
  REPLACEMENT_COST = 'RC',
}

export enum RealEstateType {
  Building = 'building',
  Rooms = 'rooms',
  Terrain = 'terrain',
}

export const RealEstate = [RealEstateType.Rooms, RealEstateType.Building, RealEstateType.Terrain]

export enum BeneficiaryCode {
  MAIB = 'maib',
  MICB = 'micb',
  VICTORIA = 'victoria',
  OTHER = 'other',
}

export const Beneficiary = [
  BeneficiaryCode.MICB,
  BeneficiaryCode.MAIB,
  BeneficiaryCode.VICTORIA,
  BeneficiaryCode.OTHER,
]
