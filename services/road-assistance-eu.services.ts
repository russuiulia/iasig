import { getFunctions, httpsCallable } from 'firebase/functions'

import { orderV2 } from '../modules/shared/orderV2'
import { firebaseApp } from './firebase'
import { Contact, GetPrice } from './interfaces/order'
import {
  CreateRoadAssistanceEUPreOrder,
  RoadAssistanceEUGetPriceRequest,
} from './interfaces/road-assistance-eu'
import { FIREBASE_REGION } from '~/constants'
import { Billing } from '~/interfaces/preOrder'
import { Offer } from '~/modules/shared/offersCard'
import { InsuranceType } from '~/modules/shared/types/insurance'
import { logError } from '~/utils/logger'

const functions = getFunctions(firebaseApp, FIREBASE_REGION)

type RoadAssistanceEUPriceResponse = {
  offers: Offer[]
  carModel: string
  plateNumber: string
  minStartDate: string
  validData: boolean
}

export const getRoadAssistanceEUPrice = async (
  body: RoadAssistanceEUGetPriceRequest
): Promise<RoadAssistanceEUPriceResponse> => {
  try {
    const getRoadAssistanceEUPrice = httpsCallable<
      GetPrice<RoadAssistanceEUGetPriceRequest>,
      RoadAssistanceEUPriceResponse
    >(functions, 'getprice')

    const response = await getRoadAssistanceEUPrice({
      type: InsuranceType.ROAD_SIDE_ASSISTANCE_EU,
      values: body,
    })

    return response.data
  } catch (e) {
    logError('getRoadAssistanceEUPrice error', e)
    return {} as RoadAssistanceEUPriceResponse
  }
}

export const confirmRoadAssistanceEUOrder = async (
  orderId: string
): Promise<string | undefined> => {
  try {
    const { createOrUpdateOrder } = orderV2()
    const response = await createOrUpdateOrder({
      id: orderId,
      confirmed: true,
    })

    return response.id
  } catch (e) {
    logError('confirmRoadAssistanceEUOrder error', e)
    return undefined
  }
}

export const createRoadAssistanceEUPreOrder = async (
  details: CreateRoadAssistanceEUPreOrder,
  billing: Partial<Billing>,
  contact: Contact
): Promise<string | undefined> => {
  try {
    const { createOrUpdateOrder, composeOrder } = orderV2()

    const orderBody = composeOrder(
      InsuranceType.ROAD_SIDE_ASSISTANCE_EU,
      details,
      billing,
      undefined,
      [],
      contact
    )

    const response = await createOrUpdateOrder(orderBody)

    return response.id
  } catch (e) {
    logError('createRoadAssistanceEUPreOrder error', e)
    return undefined
  }
}

export const updateRoadAssistanceEUPreOrder = async <T>(
  orderId: string,
  details: T,
  billing: Partial<Billing>
): Promise<void> => {
  try {
    const { composeOrder, createOrUpdateOrder } = orderV2()

    await createOrUpdateOrder(
      composeOrder(InsuranceType.ROAD_SIDE_ASSISTANCE_EU, details, billing, orderId)
    )
  } catch (e) {
    logError('update Road assistance EU PreOrder error', e)
    return undefined
  }
}
