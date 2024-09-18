import { useState } from 'react'
import { useRouter } from 'next/router'
import { useFormContext } from 'react-hook-form'

import { orderV2 } from '../../shared/orderV2'
import { RcaContactFormValues, RcaFormValues, RcaPreOrderInsurance } from '../types'
import { PreOrder } from '~/interfaces/preOrder'
import { isV2Order } from '~/modules/shared/orderV2/types'
import { InsuranceType } from '~/modules/shared/types/insurance'
import { getOrdersByUserId, getPreOrderById } from '~/services/firebase.service'
import { createRcaPreOrder, updateRcaPreOrder } from '~/services/rca.services'
import { setMidDay } from '~/utils/dateTime'
import { logError } from '~/utils/logger'
import { normalizeDate } from '~/utils/normalizeDate'

export const useRcaPreOrder = () => {
  const router = useRouter()
  const [loadingOrders, setIsLoadingOrders] = useState(true)
  const [ordersByUserId, setOrdersByUserId] = useState([] as any)
  const { setValue } = useFormContext<RcaFormValues>()

  const load = async (orderId?: string) => {
    if (!orderId) {
      return
    }

    const preOrder = await getPreOrderById<RcaPreOrderInsurance>(orderId)
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

  const create = async (values: RcaFormValues) => {
    try {
      return await createRcaPreOrder(
        {
          idnp: values.idnp,
          certificateNumber: values.certificateNumber.toUpperCase(),
          towingCertificateNumber: values.towingCertificateNumber?.toUpperCase?.() || '',
          towingModel: values.towingModel || '',
          towingPlateNumber: values.towingPlateNumber || '',
          ownership: values.ownership,
          documentNumber: values.documentNumber,
          documentDate: setMidDay(normalizeDate(values?.documentDate) as Date),
          startDate: setMidDay(normalizeDate(values?.startDate) as Date),
          endDate: setMidDay(normalizeDate(values?.endDate) as Date),
          carModel: values.carModel,
          plateNumber: values.plateNumber,
          price: values.price,
          companyName: values.companyName,
          operatingMode: values.operatingMode,
          insuranceValidity: Number(values.insuranceValidity),
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
        }
      )
    } catch (error) {
      logError('Failed to create pre-order (rca)', error)
    }
  }

  const update = async (orderId: string, values: RcaFormValues) => {
    try {
      await updateRcaPreOrder(
        orderId,
        {
          idnp: values.idnp,
          certificateNumber: values.certificateNumber.toUpperCase(),
          towingCertificateNumber: values.towingCertificateNumber?.toUpperCase?.(),
          towingModel: values.towingModel,
          towingPlateNumber: values.towingPlateNumber,
          ownership: values.ownership,
          documentNumber: values.documentNumber,
          carModel: values.carModel,
          plateNumber: values.plateNumber,
          price: values.price,
          companyName: values.companyName,
          startDate: setMidDay(normalizeDate(values?.startDate) as Date),
          insuranceValidity: Number(values.insuranceValidity),
          endDate: setMidDay(normalizeDate(values?.endDate) as Date),
          documentDate: setMidDay(normalizeDate(values?.documentDate) as Date),
          operatingMode: values.operatingMode,
          contractor: {
            fullName: values.contractorName,
            idnx: values.idnp,
            contractorType: values.contractorType,
          },
        },
        { fiscalInvoice: values.fiscalInvoice }
      )

      return orderId
    } catch (error) {
      logError('Failed to update pre-order (rca)', error)
    }
  }

  const updateContacts = async (values: RcaContactFormValues, orderId?: string) => {
    if (!orderId) {
      return
    }

    try {
      // await updatePreOrder(
      //   orderId,
      //   {
      //     contact: {
      //       email: values.email ?? '',
      //       phone: `+${values?.phone?.replace?.(/\+/g, '')}` ?? '',
      //     },
      //   },
      //   InsuranceType.RCA
      // )

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
      logError('Failed to update contacts for pre-order (rca)', error)
    }
  }

  const createOrUpdate = async (values: RcaFormValues, orderId?: string) => {
    try {
      return orderId ? await update(orderId, values) : await create(values)
    } catch (error) {
      logError('Failed to createOrUpdate pre-order (rca)', error)
    }
  }

  const loadPreOrder = async (preOrderId) => {
    const preOrder = (await load(preOrderId)) as PreOrder<any>
    const { details } = preOrder

    if (preOrder?.confirmed) {
      router.push(`/order/?order=${router.query.order}`)
      return
    }

    if (!details) {
      return
    }

    setValue('idnp', details.idnp)
    setValue('startDate', normalizeDate(details.startDate))
    setValue('endDate', normalizeDate(details.endDate))
    setValue('ownership', details.ownership)
    setValue('certificateNumber', details.certificateNumber)
    setValue('towingCertificateNumber', details.towingCertificateNumber)
    setValue('towingModel', details.towingModel)
    setValue('towingPlateNumber', details.towingPlateNumber)
    setValue('plateNumber', details.plateNumber)
    setValue('carModel', details.carModel)
    setValue('documentNumber', details.documentNumber)
    setValue('documentDate', normalizeDate(details.documentDate))
    setValue('price', details.price)
    setValue('email', preOrder?.contact?.email)
    setValue('phone', preOrder?.contact?.phone || '373')
    setValue('contractorName', details.contractor?.fullName || '')
    setValue('contractorType', details.contractor?.contractorType || '')
    setValue('operatingMode', details?.operatingMode || 'normal')
    setValue('insuranceValidity', details?.insuranceValidity)
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
