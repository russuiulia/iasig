export const formatMedicalOffers = (offers: { [key: string]: any }) => {
  return Object.entries(offers).reduce((prev: any, curr) => {
    const medicalOffers = Object.values((curr as any)?.[1] || []).reduce(
      (prevOffer: any, offer) => {
        return (offer as Offer)?.tariff
          ? [
              ...prevOffer,
              {
                company: (offer as Offer)?.companyName,
                priceEUR: (offer as Offer)?.tariff,
                price: (offer as Offer)?.priceMDL,
                region: (offer as Offer)?.region,
              },
            ]
          : [...prevOffer]
      },
      []
    ) as { [key: string]: any }[]

    medicalOffers.sort((a, b) => a.priceEUR - b.priceEUR)

    return medicalOffers.length ? [...prev, { amount: curr[0], offers: medicalOffers }] : [...prev]
  }, [])
}

interface Offer {
  companyName: string
  tariff: number
  priceMDL: number
  region: string
}
