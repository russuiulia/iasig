import { getFunctions, httpsCallable } from 'firebase/functions'

import { orderV2 } from '../modules/shared/orderV2'
import { firebaseApp } from './firebase'
import { GetPrice } from './interfaces/order'
import { CreateRealEstatePreOrder, RealEstateGetPriceRequest } from './interfaces/real-estate'
import { FIREBASE_REGION } from '~/constants/region'
import { InsuranceType } from '~/modules/shared/types/insurance'
import { formatOffers } from '~/utils/formatOffers'
import { logError } from '~/utils/logger'

export const getRealEstatePrice = async (body: RealEstateGetPriceRequest) => {
  try {
    const functions = getFunctions(firebaseApp, FIREBASE_REGION)
    const getRealEstatePrice = httpsCallable<GetPrice<RealEstateGetPriceRequest>, any>(
      functions,
      'getprice'
    )
    const response = await getRealEstatePrice({ values: body, type: InsuranceType.REAL_ESTATE })

    const allOffers = formatOffers(response?.data?.tariffsMap || {})
    return allOffers
  } catch (e) {
    logError('getRealEstatePrice error', e)
    return []
  }
}

export const getRealEstate = async (cadastralCode: string) => {
  try {
    const functions = getFunctions(firebaseApp, FIREBASE_REGION)
    const getRealEstate = httpsCallable<string, string>(functions, 'getrealestate')

    const response = await getRealEstate(cadastralCode)

    return response.data
  } catch (e) {
    logError('getRealEstate error', e)
    return undefined
  }
}

export const confirmRealEstateOrder = async (orderId: string): Promise<string | undefined> => {
  try {
    const { createOrUpdateOrder } = orderV2()
    const response = await createOrUpdateOrder({
      id: orderId,
      confirmed: true,
    })

    return response.id
  } catch (e) {
    logError('confirmRealEstateOrder error', e)
    return undefined
  }
}

export const createRealEstatePreOrder = async (
  details: CreateRealEstatePreOrder,
  contact?: { email: string; phone: string }
): Promise<string | undefined> => {
  try {
    const { createOrUpdateOrder, composeOrder } = orderV2()

    const response = await createOrUpdateOrder(
      composeOrder(
        InsuranceType.REAL_ESTATE,
        details,
        undefined,
        undefined,
        [],
        contact || { email: '', phone: '373' }
      )
    )

    return response.id
  } catch (e) {
    logError('createRealEstatePreOrder error', e)
    return undefined
  }
}
