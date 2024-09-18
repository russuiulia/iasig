/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useState } from 'react'
import { add, sub } from 'date-fns'
import { useRouter } from 'next/router'
import { useFormContext } from 'react-hook-form'

import { orderV2 } from '../../shared/orderV2'
import { MedicalOptionalContactFormValues, MedicalOptionalFormValues } from '../types'
import { useTranslation } from '~/context/LanguageContext'
import { medicalOptionalContractorDefault } from '~/modules/medical/utils/medical-contractor-default'
import { MedicalOptionalDetailsFirestore } from '~/modules/shared/orderV2/types'
import { InsuranceType } from '~/modules/shared/types/insurance'
import { removeExtraSpaces } from '~/modules/utils/removeExtraSpaces'
import { getPreOrderById, updatePreOrder } from '~/services/firebase.service'
import { createMedicalOptionalPreOrder } from '~/services/medical-optional.services'
import { setMidDay } from '~/utils/dateTime'
import { logError } from '~/utils/logger'
import { normalizeDate } from '~/utils/normalizeDate'

export const useMedicalOptionalPreOrder = () => {
  const router = useRouter()
  const { translate } = useTranslation()
  const [isLoadingPreOrder, setIsLoadingPreOrder] = useState(false)
  const { setValue } = useFormContext<MedicalOptionalFormValues>()

  const load = async (orderId?: string) => {
    if (!orderId) {
      return
    }

    const preOrder = await getPreOrderById<MedicalOptionalDetailsFirestore>(orderId)
    if (!preOrder) {
      return undefined
    }

    return preOrder
  }

  const create = async (values: MedicalOptionalFormValues) => {
    try {
      return await createMedicalOptionalPreOrder({
        nationalityCode: values.nationalityCode,
        nationalityText: translate(values.nationalityCode, 'common', 'ro'),
        startDate: setMidDay(normalizeDate(values.startDate) as Date),
        endDate: setMidDay(getEndDate(values.startDate, values.insuranceValidity)),
        persons: medicalOptionalPersons(
          values.persons,
          translate(values.nationalityCode, 'common', 'ro')
        ),
        includeAdditionalRisk: values.includeAdditionalRisk,
        amount: values.amount,
        companyName: values.companyName,
        insuranceValidity: Number(values.insuranceValidity),
        riskFactors: values.riskFactors,
        price: values.price,
        insuredDays: values.insuredDays,
      })
    } catch (error) {
      logError('Failed to create pre-order (medical optional)', error)
    }
  }

  const update = async (orderId: string, values: MedicalOptionalFormValues) => {
    try {
      const persons = medicalOptionalPersons(
        values?.persons || [],
        translate(values.nationalityCode, 'common', 'ro')
      )

      await updatePreOrder(
        orderId,
        InsuranceType.MEDICAL_OPTIONAL,
        {
          nationalityCode: values.nationalityCode,
          includeAdditionalRisk: values.includeAdditionalRisk,
          amount: values.amount,
          companyName: values.companyName,
          riskFactors: values.riskFactors,
          price: values.price,
          insuredDays: values.insuredDays,
          persons,
          insuranceValidity: Number(values.insuranceValidity),
          endDate: setMidDay(getEndDate(values.startDate, values.insuranceValidity)),
          startDate: setMidDay(normalizeDate(values.startDate) as Date),
          nationalityText: translate(values.nationalityCode, 'common', 'ro'),
          contractor: {
            fullName: removeExtraSpaces(values.contractorName).toUpperCase(),
            contractorType: values.contractorType,
            idnx: values?.idno?.trim?.(),
            address: { fullAddress: values.contractorAddress },
          },
        },
        { fiscalInvoice: values.fiscalInvoice },
        {
          email: values.email ?? '',
          phone: `+${values?.phone?.replace?.(/\+/g, '')}` ?? '',
        }
      )

      return orderId
    } catch (error) {
      logError('Failed to update pre-order (medical optional)', error)
    }
  }

  const updateContacts = async (values: MedicalOptionalContactFormValues, orderId?: string) => {
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
      //   InsuranceType.MEDICAL_OPTIONAL
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
      logError('Failed to update contacts for pre-order (medical optional)', error)
    }
  }

  const createOrUpdate = async (values: MedicalOptionalFormValues, orderId?: string) => {
    try {
      return orderId ? await update(orderId, values) : await create(values)
    } catch (error) {
      logError('Failed to createOrUpdate pre-order (medical optional)', error)
    }
  }

  const loadPreOrder = async (preOrderId) => {
    setIsLoadingPreOrder(true)
    const preOrder = await load(preOrderId)
    const details = preOrder?.details
    const contact = preOrder?.contact
    const persons = convertPersonsFromFirebase(details?.persons as any)

    if (preOrder?.confirmed) {
      router.push(`/order/?order=${router.query.order}`)
      setIsLoadingPreOrder(false)
      return
    }

    if (!details) {
      setIsLoadingPreOrder(false)
      // TODO: handle when loading failed
      return
    }

    setValue('nationalityCode', details.nationalityCode)
    setValue('riskFactors', details.riskFactors)
    setValue('startDate', normalizeDate(details.startDate))
    setValue('endDate', normalizeDate(details.endDate))
    setValue('persons', persons)
    setValue('includeAdditionalRisk', details.includeAdditionalRisk)
    setValue('amount', details.amount)
    setValue('companyName', details.companyName)
    setValue('insuranceValidity', `${details.insuranceValidity}`)
    setValue('price', details.price)
    setValue('email', contact?.email || '')
    setValue('phone', contact?.phone || '373')
    setValue(
      'idno',
      details?.contractor?.idnx || medicalOptionalContractorDefault(details?.persons).idnx
    )
    setValue(
      'contractorName',
      details?.contractor?.fullName || medicalOptionalContractorDefault(details?.persons).fullName
    )
    setValue(
      'contractorType',
      details?.contractor?.contractorType ||
        medicalOptionalContractorDefault(details?.persons).contractorType
    )
    setValue(
      'contractorAddress',
      details?.contractor?.address?.fullAddress ||
        medicalOptionalContractorDefault(details?.persons).address
    )
    setIsLoadingPreOrder(false)
  }

  return { createOrUpdate, updateContacts, loadPreOrder, isLoadingPreOrder }
}

const medicalOptionalPersons = (persons, address) => {
  return persons.reduce((prev, person) => {
    return [
      ...prev,
      {
        ...person,
        fullName: removeExtraSpaces(person?.fullName)?.toUpperCase() || '',
        passportNumber: person?.passportNumber?.trim()?.toUpperCase() || '',
        birthday: setMidDay(normalizeDate(person?.birthday) as Date),
        idnp: person.idnp?.trim?.() || '',
        address: removeExtraSpaces(person.address) || address,
      },
    ]
  }, [])
}

const convertPersonsFromFirebase = (persons) => {
  return (persons || []).reduce((prev, person) => {
    return [...prev, { ...person, birthday: setMidDay(normalizeDate(person?.birthday) as Date) }]
  }, [])
}

export const getEndDate = (startDate, insuranceValidity) =>
  sub(add(normalizeDate(startDate) as Date, { months: Number(insuranceValidity) }), { days: 1 })
