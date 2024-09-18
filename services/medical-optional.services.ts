import { getFunctions, httpsCallable } from 'firebase/functions'

import { orderV2 } from '../modules/shared/orderV2'
import { InsuranceType } from '../modules/shared/types/insurance'
import { firebaseApp } from './firebase'
import {
  CreateMedicalOptionalPreOrder,
  MedicalOptionalOffersRequest,
} from './interfaces/medical-optional'
import { GetPrice } from './interfaces/order'
import { FIREBASE_REGION } from '~/constants/region'
import { formatOffers } from '~/utils/formatOffers'
import { logError } from '~/utils/logger'

export const getMedicalOptionalPrice = async (body: MedicalOptionalOffersRequest) => {
  try {
    const functions = getFunctions(firebaseApp, FIREBASE_REGION)
    const getMedicalOptionalPrice = httpsCallable<GetPrice<MedicalOptionalOffersRequest>, any>(
      functions,
      'getprice'
    )

    const response = await getMedicalOptionalPrice({
      type: InsuranceType.MEDICAL_OPTIONAL,
      values: body,
    })

    const allOffers = formatOffers(response?.data?.tariffsMap || {})
    return allOffers
  } catch (e) {
    logError('getMedicalOptionalPrice error', e)
    return []
  }
}

export const confirmMedicalOptionalOrder = async (orderId: string): Promise<string | undefined> => {
  try {
    const { createOrUpdateOrder } = orderV2()
    const response = await createOrUpdateOrder({
      id: orderId,
      confirmed: true,
    })

    return response.id
  } catch (e) {
    logError('confirmMedicalOptionalOrder error', e)
    return undefined
  }
}

export const createMedicalOptionalPreOrder = async (
  details: CreateMedicalOptionalPreOrder,
  contact?: { email: string; phone: string }
): Promise<string | undefined> => {
  try {
    const { createOrUpdateOrder, composeOrder } = orderV2()

    const response = await createOrUpdateOrder(
      composeOrder(
        InsuranceType.MEDICAL_OPTIONAL,
        details,
        undefined,
        undefined,
        [],
        contact || { email: '', phone: '373' }
      )
    )

    return response.id
  } catch (e) {
    logError('createMedicalOptionalPreOrder error', e)
    return undefined
  }
}
