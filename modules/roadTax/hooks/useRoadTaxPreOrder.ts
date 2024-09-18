import { useState } from 'react'
import { useRouter } from 'next/router'
import { useFormContext } from 'react-hook-form'

import { orderV2 } from '../../shared/orderV2'
import { RoadTaxContactFormValues, RoadTaxFormValues, RoadTaxPreOrderInsurance } from '../types'
import { PreOrder } from '~/interfaces/preOrder'
import { isV2Order } from '~/modules/shared/orderV2/types'
import { InsuranceType } from '~/modules/shared/types/insurance'
import { getOrdersByUserId, getPreOrderById } from '~/services/firebase.service'
import { createRoadTaxPreOrder, updateRoadTaxPreOrder } from '~/services/road-tax.services'
import { logError } from '~/utils/logger'

export const useRoadTaxPreOrder = () => {
  const router = useRouter()
  const [loadingOrders, setIsLoadingOrders] = useState(true)
  const [ordersByUserId, setOrdersByUserId] = useState([] as any)
  const { setValue } = useFormContext<RoadTaxFormValues>()

  const load = async (preOrderId?: string) => {
    if (!preOrderId) {
      return
    }

    const preOrder = await getPreOrderById<RoadTaxPreOrderInsurance>(preOrderId)

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

  const create = async (values: RoadTaxFormValues) => {
    try {
      return await createRoadTaxPreOrder(
        {
          certificateNumber: values.certificateNumber.toUpperCase(),
          idnp: values.idnp,
          carModel: values.carModel,
          plateNumber: values.plateNumber,
          price: values.price,
          region: values.region,
          localityId: values.localityId,
          fullName: values.fullName.trim().toUpperCase(),
          localityName: values.localityName,
          vinCode: values.vinCode,
          contractor: {
            contractorType: values.contractorType,
            fullName: values.fullName.trim().toUpperCase(),
            idnx: values.idnp,
          },
        },
        { fiscalInvoice: values.fiscalInvoice },
        {
          phone: values?.phone ? `+${values?.phone?.replace?.(/\+/g, '')}` : '373',
          email: values?.email || '',
        }
      )
    } catch (error) {
      logError('Failed to create pre-order (road-tax)', error)
    }
  }

  const update = async (preOrderId: string, values: RoadTaxFormValues) => {
    try {
      await updateRoadTaxPreOrder(
        preOrderId,
        {
          certificateNumber: values.certificateNumber.toUpperCase(),
          region: values.region,
          localityId: values.localityId,
          localityName: values.localityName,
          fullName: values.fullName.trim().toUpperCase(),
          idnp: values.idnp,
          carModel: values.carModel,
          plateNumber: values.plateNumber,
          price: values.price,
          vinCode: values.vinCode,
          contractor: {
            contractorType: values.contractorType,
            fullName: values.fullName.trim().toUpperCase(),
            idnx: values.idnp,
          },
        },
        { fiscalInvoice: values.fiscalInvoice }
      )

      return preOrderId
    } catch (error) {
      logError('Failed to update pre-order (road-tax)', error)
    }
  }

  const updateContacts = async (values: RoadTaxContactFormValues, orderId?: string) => {
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
      logError('Failed to update contacts for pre-order (road-tax)', error)
    }
  }

  const createOrUpdate = async (values: RoadTaxFormValues, preOrderId?: string) => {
    try {
      return preOrderId ? await update(preOrderId, values) : await create(values)
    } catch (error) {
      logError('Failed to createOrUpdate pre-order (road-tax)', error)
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

    setValue('certificateNumber', details.certificateNumber)
    setValue('price', details.price)
    setValue('carModel', details.carModel)
    setValue('fullName', details.fullName)
    setValue('contractorType', details.contractor.contractorType)
    setValue('locality', {
      localityId: details.localityId,
      name: details.localityName,
      group: details.region,
      key: details.localityId,
    })

    setValue('region', details.region)
    setValue('idnp', details.idnp)
    setValue('plateNumber', details.plateNumber)
    setValue('email', contact?.email)
    setValue('phone', contact?.phone || '373')
    setValue('fiscalInvoice', billing?.fiscalInvoice || false)
  }

  const loadOrderByUserId = (index) => {
    const item = isV2Order(ordersByUserId?.[index])
      ? ordersByUserId?.[index]?.items.find((item) =>
          [InsuranceType.ROAD_TAX, InsuranceType.GREEN_CARD, InsuranceType.RCA].includes(item.type)
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
    loadOrdersByUserId,
    ordersByUserId,
    loadingOrders,
    loadOrderByUserId,
  }
}
