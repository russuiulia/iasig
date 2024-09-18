export const formatOffers = (offers: { [key: string]: any }) => {
  return Object.entries(offers).reduce((prev: any, curr) => {
    const medicalOffers = Object.values((curr as any)?.[1] || []).reduce(
      (prevOffer: any, offer) => {
        return (offer as Offer)?.priceMDL
          ? [
              ...prevOffer,
              {
                company: (offer as Offer)?.companyName,
                price: (offer as Offer)?.priceMDL,
              },
            ]
          : [...prevOffer]
      },
      []
    ) as { [key: string]: any }[]
    return medicalOffers.length ? [...prev, { amount: curr[0], offers: medicalOffers }] : [...prev]
  }, [])
}

interface Offer {
  companyName: string
  priceMDL: number
}
