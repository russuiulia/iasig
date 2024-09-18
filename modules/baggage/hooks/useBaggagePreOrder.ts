import { useState } from 'react'
import { useRouter } from 'next/router'
import { useFormContext } from 'react-hook-form'

import { orderV2 } from '../../shared/orderV2'
import { BaggageContactFormValues, BaggageFormValues, BaggagePreOrderInsurance } from '../types'
import { ContractorType, InsuranceType } from '~/modules/shared/types/insurance'
import { removeExtraSpaces } from '~/modules/utils/removeExtraSpaces'
import { createBaggagePreOrder } from '~/services/baggage.services'
import { getPreOrderById, updatePreOrder } from '~/services/firebase.service'
import { setMidDay } from '~/utils/dateTime'
import { logError } from '~/utils/logger'
import { normalizeDate } from '~/utils/normalizeDate'

export const useBaggagePreOrder = () => {
  const router = useRouter()
  const [isLoadingPreOrder, setIsLoadingPreOrder] = useState(false)
  const { setValue } = useFormContext<BaggageFormValues>()

  const load = async (preOrderId?: string) => {
    if (!preOrderId) {
      return
    }

    const preOrder = await getPreOrderById<BaggagePreOrderInsurance>(preOrderId)
    if (!preOrder) {
      return undefined
    }

    return preOrder
  }

  const create = async (values: BaggageFormValues) => {
    try {
      return await createBaggagePreOrder({
        fullName: values.fullName.trim().toUpperCase(),
        idnp: values.idnp,
        baggagePcs: values.baggagePcs,
        price: values.price,
        priceEUR: values.priceEUR,
        companyName: values.companyName,
        flightNumbers: values?.flightNumbers
          .filter((el) => el.trim())
          .map((el) => el.trim().toUpperCase()),
        amount: values.amount,
        startDate: setMidDay(normalizeDate(values.departureDate) as Date),
        contractor: {
          fullName: removeExtraSpaces(values?.fullName)?.toUpperCase() || '',
          idnx: values?.idnp?.trim?.() || '',
          contractorType: ContractorType.INDIVIDUAL,
        },
      })
    } catch (error) {
      logError('Failed to create pre-order (baggage)', error)
    }
  }

  const update = async (preOrderId: string, values: BaggageFormValues) => {
    try {
      await updatePreOrder(
        preOrderId,
        InsuranceType.BAGGAGE,
        {
          fullName: values.fullName.trim().toUpperCase(),
          idnp: values.idnp,
          baggagePcs: Number(values.baggagePcs),
          price: values.price,
          priceEUR: values.priceEUR,
          companyName: values.companyName,
          amount: values.amount,
          startDate: setMidDay(normalizeDate(values.departureDate) as Date),
          flightNumbers: values?.flightNumbers
            .filter((el) => el.trim())
            .map((el) => el.trim().toUpperCase()),
          contractor: {
            fullName: removeExtraSpaces(values?.fullName)?.toUpperCase() || '',
            idnx: values?.idnp?.trim?.() || '',
            contractorType: ContractorType.INDIVIDUAL,
          },
        },
        { fiscalInvoice: values.fiscalInvoice }
      )

      return preOrderId
    } catch (error) {
      logError('Failed to update pre-order (baggage)', error)
    }
  }

  const updateContacts = async (values: BaggageContactFormValues, orderId?: string) => {
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
      logError('Failed to update contacts for pre-order (baggage)', error)
    }
  }

  const createOrUpdate = async (values: BaggageFormValues, preOrderId?: string) => {
    try {
      return preOrderId ? await update(preOrderId, values) : await create(values)
    } catch (error) {
      logError('Failed to createOrUpdate pre-order (baggage)', error)
    }
  }

  const loadPreOrder = async (preOrderId) => {
    setIsLoadingPreOrder(true)
    const preOrder = await load(preOrderId)
    const { details } = preOrder as any

    if (preOrder?.confirmed) {
      router.push(`/order/?order=${router.query.order}`)
      setIsLoadingPreOrder(false)
      return
    }

    if (!details) {
      setIsLoadingPreOrder(false)
      return
    }

    setValue('baggagePcs', `${details.baggagePcs}`)
    setValue('departureDate', normalizeDate(details.startDate))
    setValue('idnp', details.contractor?.idnx || '')
    setValue('amount', details.amount)
    setValue('fullName', details.contractor?.fullName || '')
    setValue('flightNumbers', details.flightNumbers || [])
    setValue('priceEUR', details.priceEUR)
    setValue('price', details.price)
    setValue('email', preOrder?.contact?.email || '')
    setValue('phone', preOrder?.contact?.phone || '373')
    setIsLoadingPreOrder(false)
  }

  return { createOrUpdate, updateContacts, loadPreOrder, isLoadingPreOrder }
}
