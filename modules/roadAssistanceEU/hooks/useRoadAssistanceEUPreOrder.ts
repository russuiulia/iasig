import { useState } from 'react'
import { useRouter } from 'next/router'
import { useFormContext } from 'react-hook-form'

import { orderV2 } from '../../shared/orderV2'
import {
  RoadAssistanceEUContactFormValues,
  RoadAssistanceEUFormValues,
  RoadAssistanceEUPreOrderInsurance,
} from '../types'
import { PreOrder } from '~/interfaces/preOrder'
import { isV2Order } from '~/modules/shared/orderV2/types'
import { InsuranceType } from '~/modules/shared/types/insurance'
import { getOrdersByUserId, getPreOrderById } from '~/services/firebase.service'
import {
  createRoadAssistanceEUPreOrder,
  updateRoadAssistanceEUPreOrder,
} from '~/services/road-assistance-eu.services'
import { setMidDay } from '~/utils/dateTime'
import { logError } from '~/utils/logger'
import { normalizeDate } from '~/utils/normalizeDate'

export const useRoadAssistanceEUPreOrder = () => {
  const router = useRouter()
  const [loadingOrders, setIsLoadingOrders] = useState(true)
  const [ordersByUserId, setOrdersByUserId] = useState([] as any)
  const { setValue } = useFormContext<RoadAssistanceEUFormValues>()

  const load = async (preOrderId?: string) => {
    if (!preOrderId) {
      return
    }

    const preOrder = await getPreOrderById<RoadAssistanceEUPreOrderInsurance>(preOrderId)

    if (!preOrder) {
      return undefined
    }

    return preOrder
  }

  const loadOrdersByUserId = async (userId?: string) => {
    setIsLoadingOrders(true)
    if (!userId) {
      setIsLoadingOrders(false)
      return
    }

    const orders = await getOrdersByUserId(userId)
    if (!orders?.length) {
      setIsLoadingOrders(false)
      return []
    }

    setOrdersByUserId(orders)
    setIsLoadingOrders(false)
  }

  const create = async (values: RoadAssistanceEUFormValues) => {
    try {
      return await createRoadAssistanceEUPreOrder(
        {
          startDate: setMidDay(normalizeDate(values?.startDate) as Date),
          endDate: setMidDay(normalizeDate(values?.endDate) as Date),
          certificateNumber: values.certificateNumber.toUpperCase(),
          coverage: values.coverage,
          carModel: values.carModel,
          plateNumber: values.plateNumber,
          price: values.price,
          priceRON: values.priceRON,
          period: values.period,
        },
        { fiscalInvoice: values.fiscalInvoice },
        {
          phone: values?.phone ? `+${values?.phone?.replace?.(/\+/g, '')}` : '373',
          email: values?.email || '',
        }
      )
    } catch (error) {
      logError('Failed to create pre-order (roadside-assistance-eu)', error)
    }
  }

  const update = async (preOrderId: string, values: RoadAssistanceEUFormValues) => {
    try {
      await updateRoadAssistanceEUPreOrder(
        preOrderId,
        {
          startDate: setMidDay(normalizeDate(values?.startDate) as Date),
          endDate: setMidDay(normalizeDate(values?.endDate) as Date),
          certificateNumber: values.certificateNumber.toUpperCase(),
          coverage: values.coverage,
          carModel: values.carModel,
          plateNumber: values.plateNumber,
          price: values.price,
          priceRON: values.priceRON,
          period: values.period,
        },
        { fiscalInvoice: values.fiscalInvoice }
      )

      return preOrderId
    } catch (error) {
      logError('Failed to update pre-order (roadside-assistance-eu)', error)
    }
  }

  const updateContacts = async (values: RoadAssistanceEUContactFormValues, orderId?: string) => {
    if (!orderId) {
      return
    }
    try {
      const { createOrUpdateOrder } = orderV2()
      await createOrUpdateOrder({
        contact: {
          email: values.email ?? '',
          phone: `+${values?.phone?.replace?.(/\+/g, '')}` ?? '',
        },
        id: orderId,
      })

      return orderId
    } catch (error) {
      logError('Failed to update contacts for pre-order (roadside-assistance-eu)', error)
    }
  }

  const createOrUpdate = async (values: RoadAssistanceEUFormValues, preOrderId?: string) => {
    try {
      return preOrderId ? await update(preOrderId, values) : await create(values)
    } catch (error) {
      logError('Failed to createOrUpdate pre-order (roadside-assistance-eu)', error)
    }
  }

  const loadPreOrder = async (preOrderId) => {
    const preOrder = (await load(preOrderId)) as PreOrder<any>
    if (!preOrder) {
      return
    }

    const { details, contact } = preOrder

    if (preOrder?.confirmed) {
      router.push(`/order/?order=${router.query.order}`)
      return
    }

    if (!details) {
      return
    }

    setValue('startDate', normalizeDate(details.startDate))
    setValue('certificateNumber', details.certificateNumber)
    setValue('price', details.price)
    setValue('carModel', details.carModel)
    setValue('plateNumber', details.plateNumber)
    setValue('priceRON', details.priceRON)
    setValue('period', details.period)
    setValue('coverage', details.coverage)
    setValue('email', contact?.email)
    setValue('phone', contact?.phone || '373')
  }

  const loadOrderByUserId = (index) => {
    const item = isV2Order(ordersByUserId?.[index])
      ? ordersByUserId?.[index]?.items.find((item) =>
          [
            InsuranceType.ROAD_SIDE_ASSISTANCE_EU,
            InsuranceType.GREEN_CARD,
            InsuranceType.RCA,
          ].includes(item.type)
        )
      : ordersByUserId?.[index]

    const details = item?.details
    const contact = item?.contact

    if (!details) {
      return
    }

    setValue('certificateNumber', details.certificateNumber)
    setValue('price', details.price)
    setValue('carModel', details.carModel)
    setValue('plateNumber', details.plateNumber)
    setValue('priceRON', details.priceRON)
    setValue('email', contact?.email)
    setValue('phone', contact?.phone || '373')
  }

  return {
    createOrUpdate,
    updateContacts,
    loadPreOrder,
    loadOrderByUserId,
    loadOrdersByUserId,
    ordersByUserId,
    loadingOrders,
  }
}
