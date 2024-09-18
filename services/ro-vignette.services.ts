import { getFunctions, httpsCallable } from 'firebase/functions'

import { orderV2 } from '../modules/shared/orderV2'
import { firebaseApp } from './firebase'
import { Contact, GetPrice } from './interfaces/order'
import { CreateRoVignettePreOrder, RoVignetteGetPriceRequest } from './interfaces/ro-vignette'
import { FIREBASE_REGION } from '~/constants'
import { Billing } from '~/interfaces/preOrder'
import { AdditionalProduct } from '~/modules/shared/addons'
import { InsuranceType } from '~/modules/shared/types/insurance'
import { logError } from '~/utils/logger'

const functions = getFunctions(firebaseApp, FIREBASE_REGION)

export const getRoVignettePrice = async (
  body: RoVignetteGetPriceRequest
): Promise<Partial<AdditionalProduct[]>> => {
  try {
    const getRoVignettePrice = httpsCallable<
      GetPrice<RoVignetteGetPriceRequest>,
      AdditionalProduct[]
    >(functions, 'getprice')
    const response = await getRoVignettePrice({ type: InsuranceType.RO_VIGNETTE, values: body })
    return response.data
  } catch (e) {
    logError('getRoVignettePrice error', e)
    return []
  }
}

export const confirmRoVignetteOrder = async (orderId: string): Promise<string | undefined> => {
  try {
    const { createOrUpdateOrder } = orderV2()
    const response = await createOrUpdateOrder({
      id: orderId,
      confirmed: true,
    })

    return response.id
  } catch (e) {
    logError('confirmRoVignetteOrder error', e)
    return undefined
  }
}

export const createRoVignettePreOrder = async (
  details: CreateRoVignettePreOrder,
  billing: Partial<Billing>,
  contact: Contact
): Promise<string | undefined> => {
  try {
    const { createOrUpdateOrder, composeOrder } = orderV2()

    const orderBody = composeOrder(
      InsuranceType.RO_VIGNETTE,
      details,
      billing,
      undefined,
      [],
      contact
    )

    const response = await createOrUpdateOrder(orderBody)

    return response.id
  } catch (e) {
    logError('createRoVignettePreOrder error', e)
    return undefined
  }
}

export const updateRoVignettePreOrder = async <T>(
  orderId: string,
  details: T,
  billing: Partial<Billing>
): Promise<void> => {
  try {
    const { composeOrder, createOrUpdateOrder } = orderV2()

    await createOrUpdateOrder(
      composeOrder(InsuranceType.RO_VIGNETTE, details, billing, orderId, [])
    )
  } catch (e) {
    logError('update Ro-vignette PreOrder error', e)
    return undefined
  }
}
