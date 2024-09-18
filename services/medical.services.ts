import { getFunctions, httpsCallable } from 'firebase/functions'

import { orderV2 } from '../modules/shared/orderV2'
import { InsuranceType } from '../modules/shared/types/insurance'
import { firebaseApp } from './firebase'
import { CreateMedicalPreOrder, MedicalOffersRequest } from './interfaces/medical'
import { GetPrice } from './interfaces/order'
import { FIREBASE_REGION } from '~/constants/region'
import { formatMedicalOffers } from '~/utils/formatMedicalOffers'
import { logError } from '~/utils/logger'

export const getMedicalPrice = async (body: MedicalOffersRequest) => {
  try {
    const functions = getFunctions(firebaseApp, FIREBASE_REGION)
    const getMedicalPrice = httpsCallable<GetPrice<MedicalOffersRequest>, any>(
      functions,
      'getprice'
    )

    const response = await getMedicalPrice({ values: body, type: InsuranceType.MEDICAL })

    const allOffers = formatMedicalOffers(response?.data?.tariffsMap || {})
    return allOffers
  } catch (e) {
    logError('getMedicalPrice error', e)
    return []
  }
}

export const confirmMedicalOrder = async (orderId: string): Promise<string | undefined> => {
  try {
    const { createOrUpdateOrder } = orderV2()
    const response = await createOrUpdateOrder({
      id: orderId,
      confirmed: true,
    })

    return response.id
  } catch (e) {
    logError('confirmMedicalOrder error', e)
    return undefined
  }
}

export const createMedicalPreOrder = async (
  details: CreateMedicalPreOrder,
  contact?: { email: string; phone: string }
): Promise<string | undefined> => {
  try {
    const { createOrUpdateOrder, composeOrder } = orderV2()

    const response = await createOrUpdateOrder(
      composeOrder(
        InsuranceType.MEDICAL,
        details,
        undefined,
        undefined,
        [],
        contact || { email: '', phone: '373' }
      )
    )

    return response.id
  } catch (e) {
    logError('createMedicalPreOrder error', e)
    return undefined
  }
}
