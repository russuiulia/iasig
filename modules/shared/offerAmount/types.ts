export type Offers = {
  amount: string
  offers: OfferPrice[]
}

export type OfferPrice = {
  company: string
  price: number
  priceEUR?: number
  region?: string
}
