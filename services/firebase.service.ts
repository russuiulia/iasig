import { format } from 'date-fns'
import { utcToZonedTime } from 'date-fns-tz'
import { getAnalytics, logEvent as logFirebaseEvent } from 'firebase/analytics'
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  limit,
  orderBy,
  query,
  where,
} from 'firebase/firestore'
import { getFunctions, httpsCallable } from 'firebase/functions'

import { orderV2 } from '../modules/shared/orderV2'
import { firebaseApp } from './firebase'
import { Company } from './interfaces/company'
import { Contact } from './interfaces/order'
import { FIREBASE_REGION, Status } from '~/constants'
import { Billing, PreOrder } from '~/interfaces/preOrder'
import { InsuranceType } from '~/modules/shared/types/insurance'
import { logError } from '~/utils/logger'
import { CHISINAU_TIMEZONE } from '~/utils/timezone'

const firestore = getFirestore(firebaseApp)
const functions = getFunctions(firebaseApp, FIREBASE_REGION)

export const updatePreOrder = async <T>(
  orderId: string,
  insuranceType: InsuranceType,
  details: T,
  billing?: Partial<Billing>,
  contact?: Contact
): Promise<void> => {
  try {
    const { composeOrder, createOrUpdateOrder } = orderV2()

    await createOrUpdateOrder({
      ...composeOrder(insuranceType, details, billing, orderId, [], contact),
    })
  } catch (e) {
    logError('updatePreOrder error', e)
    return
  }
}

export const getPreOrderById = async <T>(orderId: string): Promise<PreOrder<T> | undefined> => {
  try {
    const docRef = doc(firestore, 'pre-orders', orderId)
    const orderRef = await getDoc(docRef)
    const order = orderRef.exists() ? orderRef.data() : undefined
    const { transformV2ToV1 } = orderV2()
    const transformedOrder = transformV2ToV1(order as any, orderId) as PreOrder<T>

    return transformedOrder
  } catch (e) {
    logError('getPreOrderById error', e)
    return undefined
  }
}

export const getAllTodayCurrency = async (): Promise<any> => {
  try {
    const forexId = format(utcToZonedTime(new Date().toISOString(), CHISINAU_TIMEZONE), 'yyyyMMdd')
    const docRef = doc(firestore, 'forex', forexId)
    const forexRef = await getDoc(docRef)
    const exchangeRate = forexRef.exists() ? forexRef.data() : undefined

    return exchangeRate
  } catch (e) {
    logError('getAllTodayCurrency error', e)
    return undefined
  }
}

export const logEvent = (
  eventName: string,
  eventParams: {
    [key: string]: any
  }
): void => {
  const analytics = getAnalytics(firebaseApp)
  logFirebaseEvent(analytics, eventName, eventParams)
}

export const getCompany = async (idno: string) => {
  try {
    const functions = getFunctions(firebaseApp, FIREBASE_REGION)
    const getCompanyByIdno = httpsCallable<string, Company>(functions, 'getcompany')

    const response = await getCompanyByIdno(idno)

    return response.data
  } catch (e) {
    logError('getCompany error', e)
    return undefined
  }
}

export const getOrdersByUserId = async (userId: string): Promise<any> => {
  let orders: any[] = []
  try {
    const q = query(
      collection(firestore, 'orders'),
      where('status', 'in', [Status.DRAFT, Status.COMPLETED, Status.EXPIRED]),
      where('author.uid', '==', userId),
      where('insuranceType', 'in', [InsuranceType.GREEN_CARD, InsuranceType.RCA]),
      orderBy('createdAt', 'desc'),
      limit(20)
    )
    const snapshot = await getDocs(q)
    orders = [...orders, ...snapshot.docs]
  } catch (e) {
    logError('getOrdersByUserId error', e)
  }

  try {
    const q_v2 = query(
      collection(firestore, 'orders'),
      where('status', 'in', [Status.DRAFT, Status.COMPLETED, Status.EXPIRED]),
      where('author.uid', '==', userId),
      where('productTypes', 'array-contains-any', [
        InsuranceType.RO_VIGNETTE,
        InsuranceType.GREEN_CARD,
        InsuranceType.RCA,
      ]),
      orderBy('createdAt', 'desc'),
      limit(20)
    )
    const snapshot_v2 = await getDocs(q_v2)
    orders = [...orders, ...snapshot_v2.docs]
  } catch (e) {
    logError('getOrdersByUserId (v2) error', e)
  }

  return getUniqueCarModels(orders)
}

function getCarModelFromDoc(doc) {
  if (doc.data()._v === 2) {
    return doc
      .data()
      .items.filter((item) => [InsuranceType.RCA, InsuranceType.GREEN_CARD].includes(item.type))
      .map((item) => item.details.carModel)
  } else {
    return [doc.data().details.carModel]
  }
}

function getUniqueCarModels(arr: any) {
  const uniqueCarModels = [...new Set(arr.flatMap((doc) => getCarModelFromDoc(doc)))].filter(
    Boolean
  )

  const docsForUniqueModels = uniqueCarModels
    .slice(0, 2)
    .map((model) => arr.find((doc) => getCarModelFromDoc(doc).includes(model)))

  return docsForUniqueModels.map((doc) => doc?.data()).filter(Boolean)
}

export const getUserOrdersByInsuranceType = async (
  userId: string,
  insuranceType: InsuranceType
): Promise<any> => {
  try {
    const q = query(
      collection(firestore, 'orders'),
      where('status', 'in', [Status.DRAFT, Status.COMPLETED, Status.EXPIRED, Status.REFUNDED]),
      where('author.uid', '==', userId),
      where('insuranceType', '==', insuranceType)
    )
    const snapshot = await getDocs(q)

    return snapshot.docs.map((order) => {
      return { id: order.id, ...order.data() }
    })
  } catch (e) {
    logError('getUserOrdersByInsuranceType error', e)
    return undefined
  }
}

export const getUserOrdersByUserId = async (userId: string): Promise<any> => {
  try {
    const q = query(
      collection(firestore, 'orders'),
      where('status', 'in', [Status.DRAFT, Status.COMPLETED, Status.EXPIRED, Status.REFUNDED]),
      where('author.uid', '==', userId)
    )
    const snapshot = await getDocs(q)

    return snapshot.docs.map((order) => {
      return { id: order.id, ...order.data() }
    })
  } catch (e) {
    logError('getUserOrdersByUserId error', e)
    return undefined
  }
}

export const getPartnerFeature = async (orderId: string, type: InsuranceType): Promise<boolean> => {
  try {
    const getPartnerFeature = httpsCallable<{ orderId: string; type: InsuranceType }, boolean>(
      functions,
      'getpartnerfeature'
    )
    const response = await getPartnerFeature({ orderId, type })
    return response.data
  } catch (e) {
    logError('getPartnerFeature error', e)
    return false
  }
}

export const confirmOrder = async (
  orderId: string,
  transactionId: string,
  type: InsuranceType
): Promise<boolean> => {
  try {
    const confirmOrder = httpsCallable<
      { orderId: string; transactionId: string; type: InsuranceType },
      boolean
    >(functions, 'payorder')
    const response = await confirmOrder({ orderId, transactionId, type })
    return response.data
  } catch (e) {
    logError('confirmOrder error', e)
    return false
  }
}
