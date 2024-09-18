import { getFunctions, httpsCallable } from 'firebase/functions'

import { AdditionalProduct } from '../modules/shared/addons'
import { orderV2 } from '../modules/shared/orderV2'
import { firebaseApp } from './firebase'
import { DeliveryBody } from './interfaces/delivery'
import {
  CreateGreenCardPreOrder,
  GreenCardGetPriceRequest,
  GreenCardPrice,
} from './interfaces/green-card'
import { Contact, GetPrice } from './interfaces/order'
import { FIREBASE_REGION } from '~/constants'
import { Billing } from '~/interfaces/preOrder'
import { InsuranceType } from '~/modules/shared/types/insurance'
import { logError } from '~/utils/logger'

const functions = getFunctions(firebaseApp, FIREBASE_REGION)

export const getGreenCardPrice = async (
  body: GreenCardGetPriceRequest
): Promise<Partial<GreenCardPrice>> => {
  try {
    const getGreenCardPrice = httpsCallable<GetPrice<GreenCardGetPriceRequest>, GreenCardPrice>(
      functions,
      'getprice'
    )
    const response = await getGreenCardPrice({ type: InsuranceType.GREEN_CARD, values: body })
    return response.data
  } catch (e) {
    logError('getGreenCardPrice error', e)
    return {}
  }
}

export const confirmGreenCardOrder = async (orderId: string): Promise<string | undefined> => {
  try {
    const { createOrUpdateOrder } = orderV2()
    const response = await createOrUpdateOrder({
      id: orderId,
      confirmed: true,
    })

    return response.id
  } catch (e) {
    logError('confirmGreenCardOrder error', e)
    return undefined
  }
}

export const createGreenCardPreOrder = async (
  details: CreateGreenCardPreOrder,
  billing: Partial<Billing>,
  contact: Contact,
  addons?: AdditionalProduct[]
): Promise<string | undefined> => {
  try {
    const { createOrUpdateOrder, composeOrder } = orderV2()

    const orderBody = composeOrder(
      InsuranceType.GREEN_CARD,
      details,
      billing,
      undefined,
      addons || [],
      contact
    )

    const response = await createOrUpdateOrder(orderBody)

    return response.id
  } catch (e) {
    logError('createGreenCardPreOrder error', e)
    return undefined
  }
}

export const updateGreenCardPreOrder = async <T>(
  orderId: string,
  details: T,
  billing: Partial<Billing>,
  addons?: AdditionalProduct[]
): Promise<void> => {
  try {
    const { composeOrder, createOrUpdateOrder } = orderV2()

    await createOrUpdateOrder(
      composeOrder(InsuranceType.GREEN_CARD, details, billing, orderId, addons)
    )
  } catch (e) {
    logError('update Green Card PreOrder error', e)
    return undefined
  }
}

export const createNewDelivery = async (body: DeliveryBody): Promise<any> => {
  try {
    const createDelivery = httpsCallable(functions, 'createdelivery')
    const response: any = await createDelivery(body)
    return response.data
  } catch (e) {
    logError('createNewDelivery error', e)
    return null
  }
}

export const cancelDelivery = async (orderId: string): Promise<boolean> => {
  try {
    const cancelDelivery = httpsCallable(functions, 'canceldelivery')
    await cancelDelivery(orderId)
    return true
  } catch (e) {
    logError('cancelDelivery error', e)
    return false
  }
}
