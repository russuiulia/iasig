import { useState } from 'react'
import { useRouter } from 'next/router'
import { useFormContext } from 'react-hook-form'

import { orderV2 } from '../../shared/orderV2'
import {
  RoVignetteContactFormValues,
  RoVignetteFormValues,
  RoVignettePreOrderInsurance,
} from '../types'
import { PreOrder } from '~/interfaces/preOrder'
import { isV2Order } from '~/modules/shared/orderV2/types'
import { InsuranceType } from '~/modules/shared/types/insurance'
import { getOrdersByUserId, getPreOrderById } from '~/services/firebase.service'
import { createRoVignettePreOrder, updateRoVignettePreOrder } from '~/services/ro-vignette.services'
import { setMidDay } from '~/utils/dateTime'
import { logError } from '~/utils/logger'
import { normalizeDate } from '~/utils/normalizeDate'

export const useRoVignettePreOrder = () => {
  const router = useRouter()
  const [loadingOrders, setIsLoadingOrders] = useState(true)
  const [ordersByUserId, setOrdersByUserId] = useState([] as any)
  const { setValue } = useFormContext<RoVignetteFormValues>()

  const load = async (preOrderId?: string) => {
    if (!preOrderId) {
      return
    }

    const preOrder = await getPreOrderById<RoVignettePreOrderInsurance>(preOrderId)

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

  const create = async (values: RoVignetteFormValues) => {
    try {
      return await createRoVignettePreOrder(
        {
          ...values.vignetteDetails,
          startDate: setMidDay(normalizeDate(values?.startDate) as Date),
          certificateNumber: values.certificateNumber.toUpperCase(),
          registrationCountry: values.registrationCountry,
          ...(values.registrationCountry === 'MD' ? {} : { carPlateNumber: values.carPlateNumber }),
        },
        { fiscalInvoice: values.fiscalInvoice },
        {
          phone: values?.phone ? `+${values?.phone?.replace?.(/\+/g, '')}` : '373',
          email: values?.email || '',
        }
      )
    } catch (error) {
      logError('Failed to create pre-order (ro-vignette)', error)
    }
  }

  const update = async (preOrderId: string, values: RoVignetteFormValues) => {
    try {
      await updateRoVignettePreOrder(
        preOrderId,
        {
          ...values.vignetteDetails,
          certificateNumber: values.certificateNumber.toUpperCase(),
          startDate: setMidDay(normalizeDate(values.startDate) as Date),
          registrationCountry: values.registrationCountry,
          ...(values.registrationCountry === 'MD' ? {} : { carPlateNumber: values.carPlateNumber }),
        },
        { fiscalInvoice: values.fiscalInvoice }
      )

      return preOrderId
    } catch (error) {
      logError('Failed to update pre-order (ro-vignette)', error)
    }
  }

  const updateContacts = async (values: RoVignetteContactFormValues, orderId?: string) => {
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
      logError('Failed to update contacts for pre-order (ro-vignette)', error)
    }
  }

  const createOrUpdate = async (values: RoVignetteFormValues, preOrderId?: string) => {
    try {
      return preOrderId ? await update(preOrderId, values) : await create(values)
    } catch (error) {
      logError('Failed to createOrUpdate pre-order (ro-vignette)', error)
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
    setValue('price', details.priceMDL)
    setValue('carModel', details.carModel)
    setValue('carPlateNumber', details.carPlateNumber)
    setValue('registrationCountry', details.registrationCountry)
    setValue('periodDays', details.periodDays)
    setValue('priceRON', details.price)
    setValue('email', contact?.email)
    setValue('phone', contact?.phone || '373')
  }

  const loadOrderByUserId = (index) => {
    const item = isV2Order(ordersByUserId?.[index])
      ? ordersByUserId?.[index]?.items.find((item) =>
          [InsuranceType.RO_VIGNETTE, InsuranceType.GREEN_CARD, InsuranceType.RCA].includes(
            item.type
          )
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
    setValue('carPlateNumber', details.carPlateNumber)
    setValue('registrationCountry', details.registrationCountry || 'MD')
    setValue('periodDays', details.periodDays)
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
