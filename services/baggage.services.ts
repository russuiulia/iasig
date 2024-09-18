import { getFunctions, httpsCallable } from 'firebase/functions'

import { orderV2 } from '../modules/shared/orderV2'
import { firebaseApp } from './firebase'
import {
  BaggageGetPriceRequest,
  BaggagePriceOutput,
  CreateBaggagePreOrder,
} from './interfaces/baggage'
import { GetPrice } from './interfaces/order'
import { FIREBASE_REGION } from '~/constants'
import { Billing } from '~/interfaces/preOrder'
import { InsuranceType } from '~/modules/shared/types/insurance'
import { logError } from '~/utils/logger'

const functions = getFunctions(firebaseApp, FIREBASE_REGION)

export const getBaggagePrice = async (
  body: BaggageGetPriceRequest
): Promise<Partial<BaggagePriceOutput>> => {
  try {
    const getBaggagePrice = httpsCallable<GetPrice<BaggageGetPriceRequest>, BaggagePriceOutput>(
      functions,
      'getprice'
    )
    const response = await getBaggagePrice({ type: InsuranceType.BAGGAGE, values: body })
    return response.data
  } catch (e) {
    logError('getBaggagePrice error', e)
    return {}
  }
}

export const confirmBaggageOrder = async (orderId: string): Promise<string | undefined> => {
  try {
    const { createOrUpdateOrder } = orderV2()
    const response = await createOrUpdateOrder({
      id: orderId,
      confirmed: true,
    })

    return response.id
  } catch (e) {
    logError('confirmBaggageOrder error', e)
    return undefined
  }
}

export const createBaggagePreOrder = async (
  details: CreateBaggagePreOrder
): Promise<string | undefined> => {
  try {
    const { createOrUpdateOrder, composeOrder } = orderV2()

    const orderBody = composeOrder(InsuranceType.BAGGAGE, details, undefined, undefined, [], {})

    const response = await createOrUpdateOrder(orderBody)

    return response.id
  } catch (e) {
    logError('createBaggagePreOrder error', e)
    return undefined
  }
}

export const updateBaggagePreOrder = async <T>(
  orderId: string,
  details: T,
  billing: Partial<Billing>
): Promise<void> => {
  try {
    const { composeOrder, createOrUpdateOrder } = orderV2()

    await createOrUpdateOrder(composeOrder(InsuranceType.BAGGAGE, details, billing, orderId, []))
  } catch (e) {
    logError('Update Baggage PreOrder error', e)
    return undefined
  }
}
