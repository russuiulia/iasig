import { useState } from 'react'
import { useRouter } from 'next/router'
import { useFormContext } from 'react-hook-form'

import { orderV2 } from '../../shared/orderV2'
import { InsuredValuesType } from '../real-estate-form/real-estate-form.constants'
import {
  RealEstateContactFormValues,
  RealEstateFormValues,
  RealEstatePreOrderInsurance,
} from '../types'
import { ContractorType, InsuranceType } from '~/modules/shared/types/insurance'
import { removeExtraSpaces } from '~/modules/utils/removeExtraSpaces'
import { getPreOrderById, updatePreOrder } from '~/services/firebase.service'
import { createRealEstatePreOrder } from '~/services/real-estate.services'
import { setMidDay } from '~/utils/dateTime'
import { logError } from '~/utils/logger'
import { normalizeDate } from '~/utils/normalizeDate'

export const useRealEstatePreOrder = () => {
  const router = useRouter()
  const [isLoadingPreOrder, setIsLoadingPreOrder] = useState(false)
  const { setValue } = useFormContext<RealEstateFormValues>()

  const load = async (preOrderId?: string) => {
    if (!preOrderId) {
      return
    }

    const preOrder = await getPreOrderById<RealEstatePreOrderInsurance>(preOrderId)
    if (!preOrder) {
      return undefined
    }

    return preOrder
  }

  const create = async (values: RealEstateFormValues) => {
    try {
      const { insuredValue, marketValue, replacementCost } = values
      return await createRealEstatePreOrder({
        realEstateType: values.realEstateType,
        insuredValue, //MV or RC
        marketValue: insuredValue === InsuredValuesType.MARKET_VALUE ? Number(marketValue) : null,
        replacementCost:
          insuredValue === InsuredValuesType.REPLACEMENT_COST ? Number(replacementCost) : null,
        startDate: setMidDay(normalizeDate(values?.startDate) as Date),
        endDate: setMidDay(normalizeDate(values?.endDate) as Date),
        insuredDays: Number(values.insuredDays),
        insuranceValidity: Number(values.insuranceValidity),
        price: values.price,
        companyName: values.companyName,
        amount: values.amount,
        beneficiary: values.beneficiary,
        beneficiaryName: values.beneficiaryName,
      })
    } catch (error) {
      logError('Failed to create pre-order (real-estate)', error)
    }
  }

  const update = async (preOrderId: string, values: RealEstateFormValues) => {
    try {
      const { insuredValue, marketValue, replacementCost } = values
      await updatePreOrder(
        preOrderId,
        InsuranceType.REAL_ESTATE,
        {
          realEstateType: values.realEstateType,
          insuredValue, //MV or RC
          insuredDays: Number(values.insuredDays),
          insuranceValidity: Number(values.insuranceValidity),
          price: values.price,
          companyName: values.companyName,
          amount: values.amount,
          beneficiary: values.beneficiary,
          beneficiaryName: values.beneficiaryName,
          marketValue: insuredValue === InsuredValuesType.MARKET_VALUE ? Number(marketValue) : null,
          replacementCost:
            insuredValue === InsuredValuesType.REPLACEMENT_COST ? Number(replacementCost) : null,
          startDate: setMidDay(normalizeDate(values.startDate) as Date),
          endDate: setMidDay(normalizeDate(values.endDate) as Date),
          cadastralCode: values?.cadastralCode || '',
          identitySeries: values?.identitySeries || '',
          contractor: {
            fullName: removeExtraSpaces(values?.fullName)?.toUpperCase() || '',
            idnx: values?.idnp?.trim?.() || '',
            address: {
              fullAddress: values?.contractorAddress || '',
            },
            contractorType: ContractorType.INDIVIDUAL,
          },
        },
        { fiscalInvoice: values.fiscalInvoice }
      )

      return preOrderId
    } catch (error) {
      logError('Failed to update pre-order (real-estate)', error)
    }
  }

  const updateContacts = async (values: RealEstateContactFormValues, orderId?: string) => {
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
      //   InsuranceType.REAL_ESTATE
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
      logError('Failed to update contacts for pre-order (real-estate)', error)
    }
  }

  const createOrUpdate = async (values: RealEstateFormValues, preOrderId?: string) => {
    try {
      return preOrderId ? await update(preOrderId, values) : await create(values)
    } catch (error) {
      logError('Failed to createOrUpdate pre-order (real-estate)', error)
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

    setValue('realEstateType', details.realEstateType)
    setValue('insuredValue', details.insuredValue)
    setValue('marketValue', details.marketValue || '')
    setValue('replacementCost', details.replacementCost || '')
    setValue('startDate', normalizeDate(details.startDate))
    setValue('endDate', normalizeDate(details.endDate))
    setValue('insuredDays', details.insuredDays)
    setValue('insuranceValidity', details.insuranceValidity)
    setValue('idnp', details.contractor?.idnx || '')
    setValue('fullName', details.contractor?.fullName || '')
    setValue('cadastralCode', details.cadastralCode || '')
    setValue('identitySeries', details.identitySeries || '')
    setValue('contractorAddress', details.contractor?.address?.fullAddress || '')
    setValue('beneficiary', details.beneficiary)
    setValue('beneficiaryName', details.beneficiaryName)
    setValue('price', details.price)
    setValue('email', preOrder?.contact?.email || '')
    setValue('phone', preOrder?.contact?.phone || '373')
    setIsLoadingPreOrder(false)
  }

  return { createOrUpdate, updateContacts, loadPreOrder, isLoadingPreOrder }
}
