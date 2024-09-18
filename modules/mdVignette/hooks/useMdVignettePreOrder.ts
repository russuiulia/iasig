import { useState } from 'react'
import { useRouter } from 'next/router'
import { useFormContext } from 'react-hook-form'

import { orderV2 } from '../../shared/orderV2'
import {
  MdVignetteContactFormValues,
  MdVignetteFormValues,
  MdVignettePreOrderInsurance,
} from '../types'
import { useTranslation } from '~/context/LanguageContext'
import { PreOrder } from '~/interfaces/preOrder'
import { isV2Order } from '~/modules/shared/orderV2/types'
import { ContractorType, InsuranceType } from '~/modules/shared/types/insurance'
import { getOrdersByUserId, getPreOrderById } from '~/services/firebase.service'
import { createMdVignettePreOrder, updateMdVignettePreOrder } from '~/services/md-vignette.services'
import { setMidDay } from '~/utils/dateTime'
import { logError } from '~/utils/logger'
import { normalizeDate } from '~/utils/normalizeDate'
import { validateIdno } from '~/utils/validateIdnp'

export const useMdVignettePreOrder = () => {
  const router = useRouter()
  const { translate } = useTranslation()

  const [loadingOrders, setIsLoadingOrders] = useState(true)
  const [ordersByUserId, setOrdersByUserId] = useState([] as any)
  const { setValue } = useFormContext<MdVignetteFormValues>()

  const load = async (preOrderId?: string) => {
    if (!preOrderId) {
      return
    }

    const preOrder = await getPreOrderById<MdVignettePreOrderInsurance>(preOrderId)

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

  const create = async (values: MdVignetteFormValues) => {
    try {
      return await createMdVignettePreOrder(
        {
          vehicleType: values.vehicleType,
          validity: values.validity,
          startDate: setMidDay(normalizeDate(values?.startDate) as Date),
          country: values.country,
          plateNumber: values.plateNumber.toUpperCase(),
          price: values.price,
          priceEUR: values.priceEUR,
          driverFullName: values.driverFullName,
          idnp: values.idnp,
          description: translate(`vehicleType:${values.vehicleType}`, 'common', 'ro'),
          contractor: {
            idnx: values.idnp,
            contractorType: validateIdno(values.idnp)
              ? ContractorType.COMPANY
              : ContractorType.INDIVIDUAL,
            fullName: values.driverFullName,
          },
        },
        {
          phone: values?.phone ? `+${values?.phone?.replace?.(/\+/g, '')}` : '373',
          email: values?.email || '',
        }
      )
    } catch (error) {
      logError('Failed to create pre-order (md-vignette)', error)
    }
  }

  const update = async (preOrderId: string, values: MdVignetteFormValues) => {
    try {
      await updateMdVignettePreOrder(
        preOrderId,
        {
          startDate: setMidDay(normalizeDate(values?.startDate) as Date),
          plateNumber: values.plateNumber.toUpperCase(),
          price: values.price,
          priceEUR: values.priceEUR,
          vehicleType: values.vehicleType,
          country: values.country,
          driverFullName: values.driverFullName,
          idnp: values.idnp,
          validity: values.validity,
          description: translate(`vehicleType:${values.vehicleType}`, 'common', 'ro'),
          contractor: {
            idnx: values.idnp,
            contractorType: validateIdno(values.idnp)
              ? ContractorType.COMPANY
              : ContractorType.INDIVIDUAL,
            fullName: values.driverFullName,
          },
        },
        { fiscalInvoice: values.fiscalInvoice }
      )

      return preOrderId
    } catch (error) {
      logError('Failed to update pre-order (md-vignette)', error)
    }
  }

  const updateContacts = async (values: MdVignetteContactFormValues, orderId?: string) => {
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
      logError('Failed to update contacts for pre-order (md-vignette)', error)
    }
  }

  const createOrUpdate = async (values: MdVignetteFormValues, preOrderId?: string) => {
    try {
      return preOrderId ? await update(preOrderId, values) : await create(values)
    } catch (error) {
      logError('Failed to createOrUpdate pre-order (md-vignette)', error)
    }
  }

  const loadPreOrder = async (preOrderId) => {
    const preOrder = (await load(preOrderId)) as PreOrder<any>
    if (!preOrder) {
      return
    }

    const { details, contact, billing } = preOrder

    if (preOrder?.confirmed) {
      router.push(`/order/?order=${router.query.order}`)
      return
    }

    if (!details) {
      return
    }

    setValue('startDate', normalizeDate(details.startDate))
    setValue('plateNumber', details.plateNumber)
    setValue('price', details.price)
    setValue('priceEUR', details.priceEUR)
    setValue('vehicleType', details.vehicleType)
    setValue('country', details.country)
    setValue('driverFullName', details.driverFullName)
    setValue('validity', details.validity)
    setValue('idnp', details.idnp)
    setValue('email', contact?.email)
    setValue('phone', contact?.phone || '373')
    setValue('fiscalInvoice', billing?.fiscalInvoice || false)
  }

  const loadOrderByUserId = (index) => {
    const item = isV2Order(ordersByUserId?.[index])
      ? ordersByUserId?.[index]?.items.find((item) =>
          [InsuranceType.MD_VIGNETTE].includes(item.type)
        )
      : ordersByUserId?.[index]

    const details = item?.details
    const contact = item?.contact

    if (!details) {
      return
    }

    setValue('price', details.price)
    setValue('plateNumber', details.plateNumber)
    setValue('validity', details.validity)
    setValue('priceEUR', details.priceEUR)
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
