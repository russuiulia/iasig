import { getFunctions, httpsCallable } from 'firebase/functions'

import { firebaseApp } from './firebase'
import { Contact, GetPrice } from './interfaces/order'
import {
  CreateRoadTaxPreOrder,
  RoadTaxGetPriceRequest,
  RoadTaxPriceOutput,
} from './interfaces/road-tax'
import { FIREBASE_REGION } from '~/constants/region'
import { Billing } from '~/interfaces/preOrder'
import { orderV2 } from '~/modules/shared/orderV2'
import { InsuranceType } from '~/modules/shared/types/insurance'
import { logError } from '~/utils/logger'

const functions = getFunctions(firebaseApp, FIREBASE_REGION)

export const getRoadTaxPrice = async (
  body: RoadTaxGetPriceRequest
): Promise<RoadTaxPriceOutput> => {
  try {
    const getRoadTaxPrice = httpsCallable<GetPrice<RoadTaxGetPriceRequest>, RoadTaxPriceOutput>(
      functions,
      'getprice'
    )
    const response = await getRoadTaxPrice({ type: InsuranceType.ROAD_TAX, values: body })
    return response.data
  } catch (e) {
    logError('getRoadTaxPrice error', e)
    return {} as RoadTaxPriceOutput
  }
}
export const confirmRoadTaxOrder = async (orderId: string): Promise<string | undefined> => {
  try {
    const { createOrUpdateOrder } = orderV2()
    const response = await createOrUpdateOrder({
      id: orderId,
      confirmed: true,
    })

    return response.id
  } catch (e) {
    logError('confirmRoadTaxOrder error', e)
    return undefined
  }
}

export const createRoadTaxPreOrder = async (
  details: CreateRoadTaxPreOrder,
  billing: Partial<Billing>,
  contact: Contact
): Promise<string | undefined> => {
  try {
    const { createOrUpdateOrder, composeOrder } = orderV2()

    const orderBody = composeOrder(InsuranceType.ROAD_TAX, details, billing, undefined, [], contact)

    const response = await createOrUpdateOrder(orderBody)

    return response.id
  } catch (e) {
    logError('createRoadTaxPreOrder error', e)
    return undefined
  }
}

export const updateRoadTaxPreOrder = async <T>(
  orderId: string,
  details: T,
  billing: Partial<Billing>
): Promise<void> => {
  try {
    const { composeOrder, createOrUpdateOrder } = orderV2()

    await createOrUpdateOrder(composeOrder(InsuranceType.ROAD_TAX, details, billing, orderId, []))
  } catch (e) {
    logError('update Road Tax PreOrder error', e)
    return undefined
  }
}
