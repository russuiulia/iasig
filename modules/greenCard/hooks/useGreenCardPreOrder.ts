import { useState } from 'react'
import { useRouter } from 'next/router'
import { useFormContext } from 'react-hook-form'

import { orderV2 } from '../../shared/orderV2'
import {
  GreenCardContactFormValues,
  GreenCardFormValues,
  GreenCardPreOrderInsurance,
} from '../types'
import { PreOrder } from '~/interfaces/preOrder'
import { AdditionalProduct } from '~/modules/shared/addons'
import { isV2Order } from '~/modules/shared/orderV2/types'
import { InsuranceType } from '~/modules/shared/types/insurance'
import { getOrdersByUserId, getPreOrderById } from '~/services/firebase.service'
import { createGreenCardPreOrder, updateGreenCardPreOrder } from '~/services/green-card.services'
import { setMidDay } from '~/utils/dateTime'
import { logError } from '~/utils/logger'
import { normalizeDate } from '~/utils/normalizeDate'

export const useGreenCardPreOrder = () => {
  const router = useRouter()
  const [loadingOrders, setIsLoadingOrders] = useState(true)
  const [ordersByUserId, setOrdersByUserId] = useState([] as any)
  const { setValue } = useFormContext<GreenCardFormValues>()

  const load = async (preOrderId?: string) => {
    if (!preOrderId) {
      return
    }

    const preOrder = await getPreOrderById<GreenCardPreOrderInsurance>(preOrderId)

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

  const create = async (values: GreenCardFormValues) => {
    try {
      return await createGreenCardPreOrder(
        {
          startDate: setMidDay(normalizeDate(values?.startDate) as Date),
          endDate: setMidDay(normalizeDate(values?.endDate) as Date),
          idnp: values.idnp,
          certificateNumber: values.certificateNumber.toUpperCase(),
          ownership: values.ownership,
          insuranceValidity: Number(values.insuranceValidity),
          zone: values.zone,
          carModel: values.carModel,
          plateNumber: values.plateNumber,
          price: values.price,
          priceEUR: values.priceEUR,
          documentDate: setMidDay(normalizeDate(values?.documentDate) as Date),
          documentNumber: values.documentNumber,
          companyName: values.companyName,
          towingCertificateNumber: values.towingCertificateNumber?.toUpperCase?.() || '',
          towingModel: values.towingModel || '',
          towingPlateNumber: values.towingPlateNumber || '',
          contractor: {
            fullName: values.contractorName,
            idnx: values.idnp,
            contractorType: values.contractorType,
          },
        },
        { fiscalInvoice: values.fiscalInvoice },
        {
          phone: values?.phone ? `+${values?.phone?.replace?.(/\+/g, '')}` : '373',
          email: values?.email || '',
        },
        getAddonsWithNormalizedDate((values.addons as AdditionalProduct[]) || [])
      )
    } catch (error) {
      logError('Failed to create pre-order (green-card)', error)
    }
  }

  const update = async (preOrderId: string, values: GreenCardFormValues) => {
    try {
      await updateGreenCardPreOrder(
        preOrderId,
        {
          idnp: values.idnp,
          certificateNumber: values.certificateNumber.toUpperCase(),
          ownership: values.ownership,
          zone: values.zone,
          carModel: values.carModel,
          plateNumber: values.plateNumber,
          towingCertificateNumber: values.towingCertificateNumber?.toUpperCase?.(),
          towingModel: values.towingModel,
          towingPlateNumber: values.towingPlateNumber,
          price: values.price,
          priceEUR: values.priceEUR,
          documentNumber: values.documentNumber,
          companyName: values.companyName,
          insuranceValidity: Number(values.insuranceValidity),
          startDate: setMidDay(normalizeDate(values.startDate) as Date),
          endDate: setMidDay(normalizeDate(values.endDate) as Date),
          documentDate: setMidDay(normalizeDate(values?.documentDate) as Date),
          contractor: {
            fullName: values.contractorName,
            idnx: values.idnp,
            contractorType: values.contractorType,
          },
        },
        { fiscalInvoice: values.fiscalInvoice },
        getAddonsWithNormalizedDate((values.addons as AdditionalProduct[]) || [])
      )

      return preOrderId
    } catch (error) {
      logError('Failed to update pre-order (green-card)', error)
    }
  }

  const getAddonsWithNormalizedDate = (addons: AdditionalProduct[]) =>
    addons.reduce(
      (prev: AdditionalProduct[], addon: AdditionalProduct) => [
        ...prev,
        { ...addon, startDate: setMidDay(normalizeDate(addon?.startDate) as Date) },
      ],
      []
    )

  const updateContacts = async (values: GreenCardContactFormValues, orderId?: string) => {
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
      logError('Failed to update contacts for pre-order (green-card)', error)
    }
  }

  const createOrUpdate = async (values: GreenCardFormValues, preOrderId?: string) => {
    try {
      return preOrderId ? await update(preOrderId, values) : await create(values)
    } catch (error) {
      logError('Failed to createOrUpdate pre-order (green-card)', error)
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

    setValue('zone', details.zone)
    setValue('startDate', normalizeDate(details.startDate))
    setValue('endDate', normalizeDate(details.endDate))
    setValue('insuranceValidity', `${details.insuranceValidity}`)
    setValue('certificateNumber', details.certificateNumber)
    setValue('towingCertificateNumber', details.towingCertificateNumber)
    setValue('towingModel', details.towingModel)
    setValue('towingPlateNumber', details.towingPlateNumber)
    setValue('idnp', details.idnp)
    setValue('ownership', details.ownership)
    setValue('carModel', details.carModel)
    setValue('plateNumber', details.plateNumber)
    setValue('contractorName', details.contractor?.fullName || '')
    setValue('contractorType', details.contractor?.contractorType || '')
    setValue('fiscalInvoice', billing?.fiscalInvoice || false)
    setValue('price', details.price)
    setValue('priceEUR', details.priceEUR)
    setValue('documentNumber', details.documentNumber)
    setValue('documentDate', normalizeDate(details.documentDate))
    setValue('email', contact?.email)
    setValue('phone', contact?.phone || '373')
  }

  const loadOrderByUserId = (index) => {
    const item = isV2Order(ordersByUserId?.[index])
      ? ordersByUserId?.[index]?.items.find((item) =>
          [InsuranceType.GREEN_CARD, InsuranceType.RCA].includes(item.type)
        )
      : ordersByUserId?.[index]
    const details = item?.details
    const contact = item?.contact

    if (!details) {
      return
    }

    setValue('insuranceValidity', '15')
    setValue('certificateNumber', details.certificateNumber)
    setValue('idnp', details.idnp)
    setValue('carModel', details.carModel)
    setValue('plateNumber', details.plateNumber)
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
