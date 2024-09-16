export enum InsuranceType {
  GREEN_CARD = 'green-card',
  RCA = 'rca',
  MEDICAL = 'medical',
  MEDICAL_OPTIONAL = 'medical-optional',
  REAL_ESTATE = 'real-estate',
  RO_VIGNETTE = 'vignette:ro',
  MD_VIGNETTE = 'vignette:md',
  BAGGAGE = 'baggage',
  ROAD_TAX = 'road-tax',
  ROAD_SIDE_ASSISTANCE_EU = 'roadside-assistance-eu',
}

export const InsuranceTypeSlugs = {
  [InsuranceType.GREEN_CARD]: 'green-card',
  [InsuranceType.RCA]: 'rca',
  [InsuranceType.MEDICAL]: 'medical',
  [InsuranceType.MEDICAL_OPTIONAL]: 'medical-optional',
  [InsuranceType.REAL_ESTATE]: 'ipoteca',
  [InsuranceType.BAGGAGE]: 'bagaj',
  [InsuranceType.ROAD_TAX]: 'taxa-de-drum',
  [InsuranceType.MD_VIGNETTE]: 'vinieta-md',
}

export const ItemName = {
  [InsuranceType.GREEN_CARD]: 'green-card',
  [InsuranceType.RCA]: 'rca',
  [InsuranceType.MEDICAL]: 'medical',
  [InsuranceType.MEDICAL_OPTIONAL]: 'medical-non-residents',
  [InsuranceType.REAL_ESTATE]: 'mortgage',
  [InsuranceType.BAGGAGE]: 'baggage',
  [InsuranceType.ROAD_TAX]: 'road-tax',
  [InsuranceType.MD_VIGNETTE]: 'vignette:md',
}

export enum DocumentTypes {
  demand = 'demand',
  contract = 'contract',
  policy = 'policy',
  documents = 'documents',
  amicable_settlement = 'amicable_settlement',
  policy_print = 'policy_print',
  wallet_pass = 'wallet_pass',
  google_pass = 'google_pass',
  invoice = 'invoice',
}

export enum ContractorType {
  COMPANY = 'company',
  INDIVIDUAL = 'individual',
}
