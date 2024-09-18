import { getFunctions, httpsCallable } from 'firebase/functions'

import { orderV2 } from '../modules/shared/orderV2'
import { InsuranceType } from '../modules/shared/types/insurance'
import { firebaseApp } from './firebase'
import { Contact, GetPrice } from './interfaces/order'
import { CreateRcaPreOrder, RcaPriceOutput, RcaPriceRequest } from './interfaces/rca'
import { FIREBASE_REGION } from '~/constants/region'
import { Billing } from '~/interfaces/preOrder'
import { logError } from '~/utils/logger'

const functions = getFunctions(firebaseApp, FIREBASE_REGION)

export const getRcaPrice = async (body: RcaPriceRequest) => {
  try {
    const getRcaPrice = httpsCallable<GetPrice<RcaPriceRequest>, RcaPriceOutput>(
      functions,
      'getprice'
    )
    const response = await getRcaPrice({ values: body, type: InsuranceType.RCA })

    return response?.data
  } catch (e) {
    logError('getRcaPrice error', e)
    return {}
  }
}

export const confirmRcaOrder = async (orderId: string): Promise<string | undefined> => {
  try {
    const { createOrUpdateOrder } = orderV2()
    const response = await createOrUpdateOrder({
      id: orderId,
      confirmed: true,
    })

    return response.id
  } catch (e) {
    logError('confirmRcaOrder error', e)
    return undefined
  }
}

export const createRcaPreOrder = async (
  details: CreateRcaPreOrder,
  billing: Partial<Billing>,
  contact: Contact
): Promise<string | undefined> => {
  try {
    const { createOrUpdateOrder, composeOrder } = orderV2()
    const response = await createOrUpdateOrder({
      ...composeOrder(InsuranceType.RCA, details, billing, undefined, []),
      contact,
    })
    return response.id
  } catch (e) {
    logError('createRcaPreOrder error', e)
    return undefined
  }
}

export const updateRcaPreOrder = async <T>(
  orderId: string,
  details: T,
  billing: Partial<Billing>
): Promise<void> => {
  try {
    const { composeOrder, createOrUpdateOrder } = orderV2()

    await createOrUpdateOrder(composeOrder(InsuranceType.RCA, details, billing, orderId, []))
  } catch (e) {
    logError('update Green Card PreOrder error', e)
    return undefined
  }
}
