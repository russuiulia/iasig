import { getFunctions, httpsCallable } from 'firebase/functions'

import { orderV2 } from '../modules/shared/orderV2'
import { firebaseApp } from './firebase'
import {
  CreateMdVignettePreOrder,
  MdVignetteGetPriceRequest,
  MdVignettePrice,
} from './interfaces/md-vignette'
import { Contact, GetPrice } from './interfaces/order'
import { FIREBASE_REGION } from '~/constants'
import { Billing } from '~/interfaces/preOrder'
import { InsuranceType } from '~/modules/shared/types/insurance'
import { logError } from '~/utils/logger'

const functions = getFunctions(firebaseApp, FIREBASE_REGION)

export const getMdVignettePrice = async (
  body: MdVignetteGetPriceRequest
): Promise<MdVignettePrice> => {
  try {
    const getMdVignettePrice = httpsCallable<GetPrice<MdVignetteGetPriceRequest>, MdVignettePrice>(
      functions,
      'getprice'
    )
    const response = await getMdVignettePrice({ type: InsuranceType.MD_VIGNETTE, values: body })
    return response.data
  } catch (e) {
    logError('getMdVignettePrice error', e)
    return {} as MdVignettePrice
  }
}

export const confirmMdVignetteOrder = async (orderId: string): Promise<string | undefined> => {
  try {
    const { createOrUpdateOrder } = orderV2()
    const response = await createOrUpdateOrder({
      id: orderId,
      confirmed: true,
    })

    return response.id
  } catch (e) {
    logError('confirmMdVignetteOrder error', e)
    return undefined
  }
}

export const createMdVignettePreOrder = async (
  details: CreateMdVignettePreOrder,
  contact: Contact
): Promise<string | undefined> => {
  try {
    const { createOrUpdateOrder, composeOrder } = orderV2()

    const orderBody = composeOrder(
      InsuranceType.MD_VIGNETTE,
      details,
      undefined,
      undefined,
      [],
      contact
    )

    const response = await createOrUpdateOrder(orderBody)

    return response.id
  } catch (e) {
    logError('createMdVignettePreOrder error', e)
    return undefined
  }
}

export const updateMdVignettePreOrder = async <T>(
  orderId: string,
  details: T,
  billing: Partial<Billing>
): Promise<void> => {
  try {
    const { composeOrder, createOrUpdateOrder } = orderV2()

    await createOrUpdateOrder(
      composeOrder(InsuranceType.MD_VIGNETTE, details, billing, orderId, [])
    )
  } catch (e) {
    logError('update Md-vignette PreOrder error', e)
    return undefined
  }
}
