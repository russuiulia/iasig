import { getFunctions, httpsCallable } from 'firebase/functions'

import { FIREBASE_REGION } from '../../../constants'
import { firebaseApp } from '../../../services/firebase'
import { IsgOrder } from '../../../services/interfaces/order'
import { AdditionalProduct } from '../addons'
import { InsuranceType } from '../types/insurance'
import { CartItem, GreenCardDetailsFirestore, isV2Order, OrderV2 } from './types'
import { Billing } from '~/interfaces/preOrder'

type CreateOrderRequest = {
  items?: CartItem[]
  contact?: {
    phone: string
    email: string
  }
  id?: string
  confirmed?: boolean
}

type CreateOrderResponse = {
  id?: string
  error?: string
}

export const orderV2 = () => {
  const createOrUpdatePreOrder = async (order: CreateOrderRequest) => {
    const functions = getFunctions(firebaseApp, FIREBASE_REGION)

    const fx = httpsCallable<CreateOrderRequest, CreateOrderResponse>(
      functions,
      'createorupdatepreorder'
    )

    const rs = await fx(order)

    return rs.data
  }

  const transformV2ToV1 = <T>(
    order: IsgOrder<T> | OrderV2,
    orderId: string
  ): Partial<IsgOrder<T>> => {
    const invoiceDetails = order?.invoice?.file
    if (isV2Order(order)) {
      const productTypes = [
        InsuranceType.GREEN_CARD,
        InsuranceType.RCA,
        InsuranceType.MEDICAL,
        InsuranceType.MEDICAL_OPTIONAL,
        InsuranceType.REAL_ESTATE,
        InsuranceType.BAGGAGE,
        InsuranceType.ROAD_TAX,
        InsuranceType.MD_VIGNETTE,
        InsuranceType.ROAD_SIDE_ASSISTANCE_EU,
      ]
      const addonTypes = [InsuranceType.RO_VIGNETTE]
      let mainProduct = order.items.find((item) => productTypes.includes(item.type))
      const addons = order.items.filter((item) => addonTypes.includes(item.type))
      const addonAttachments: any[] =
        Object.values(order.productsAttachments || {})
          .filter((value) => addonTypes.includes(value.type))
          .flatMap((value) => value.files) || []

      const documents: any[] =
        Object.values(order.productsAttachments || {})
          .filter((value) => productTypes.includes(value.type) && value.type)
          .flatMap((value) => value.files) || []

      const insuranceType = (mainProduct?.type as InsuranceType) || addons?.[0]?.type || ''

      if (!mainProduct) {
        mainProduct = addons?.[0]
      }

      return {
        completedAt: order.completedAt,
        details: {
          ...(mainProduct?.details as any),
          price: order.details?.price || mainProduct?.details?.price,
          insurancePrice: mainProduct?.details?.price,
          contractorType: (mainProduct?.details as GreenCardDetailsFirestore)?.contractor
            ?.contractorType,
          contractorName: (mainProduct?.details as GreenCardDetailsFirestore)?.contractor?.fullName,
        },
        orderId: orderId,
        addons: (addons.map((addon) => addon.details) as unknown as AdditionalProduct[]) || [],
        addonAttachments,
        documents: [...documents, ...(invoiceDetails ? [invoiceDetails] : [])],
        insuranceType,
        status: order.status as any,
        contact: order.contact as any,
        payment: order.payment as any,
        confirmed: order.confirmed,
        createdAt: order.createdAt?.toDate() as any,
        deliveryRef: order?.deliveryRef,
        seller: order?.seller,
        billing: order?.billing,
      } as IsgOrder<T>
    } else {
      return {
        ...order,
        documents: [...(order.documents || []), ...(invoiceDetails ? [invoiceDetails] : [])],
      }
    }
  }

  const composeOrder = (
    type: InsuranceType,
    details?: any,
    billing?: Partial<Billing>,
    id?: string,
    addons: AdditionalProduct[] = [],
    contact?: any
  ): CreateOrderRequest => {
    return {
      ...(id ? { id } : null),
      ...(contact ? { contact } : null),
      ...(billing ? { billing } : null),
      ...(details
        ? {
            items: [
              {
                type,
                details,
              },
              ...addons.map((addon) => ({
                type: addon.addonType as any,
                details: addon as any,
              })),
            ],
          }
        : null),
    }
  }

  return { createOrUpdateOrder: createOrUpdatePreOrder, transformV2ToV1, composeOrder }
}
