/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useState } from 'react'
import { add, subDays } from 'date-fns'
import { useRouter } from 'next/router'
import { useFormContext } from 'react-hook-form'

import { orderV2 } from '../../shared/orderV2'
import { InsuranceType } from '../../shared/types/insurance'
import { MedicalFormValues, MedicalPreOrderInsurance } from '../types'
import { contractorDefaultValue } from '../utils/medical-contractor-default'
import { getAllRegionOptions } from '~/components/mui/region-select/region-select.const'
import { useTranslation } from '~/context/LanguageContext'
import { MedicalDetailsFirestore } from '~/modules/shared/orderV2/types'
import { removeExtraSpaces } from '~/modules/utils/removeExtraSpaces'
import { getPreOrderById, updatePreOrder } from '~/services/firebase.service'
import { IsgOrder } from '~/services/interfaces/order'
import { createMedicalPreOrder } from '~/services/medical.services'
import { setMidDay } from '~/utils/dateTime'
import { logError } from '~/utils/logger'
import { normalizeDate } from '~/utils/normalizeDate'
import { extractPassportNumber, extractPassportSeries } from '~/utils/splitPassport'

export const useMedicalPreOrder = () => {
  const router = useRouter()
  const { translate } = useTranslation()

  const [isLoadingPreOrder, setIsLoadingPreOrder] = useState(false)
  const { setValue } = useFormContext<MedicalFormValues>()
  const { transformV2ToV1 } = orderV2()

  const load = async (orderId?: string) => {
    if (!orderId) {
      return
    }

    const preOrder = await getPreOrderById<MedicalPreOrderInsurance>(orderId)
    if (!preOrder) {
      return undefined
    }

    const preOrderV1 = transformV2ToV1(preOrder as any, orderId)

    return preOrderV1 as IsgOrder<MedicalDetailsFirestore>
  }

  const create = async (values: MedicalFormValues) => {
    try {
      return await createMedicalPreOrder({
        territories: { ...values.territories, region: values.region },
        startDate: setMidDay(normalizeDate(values.startDate) as Date),
        endDate: setMidDay(getEndDate(values) as Date),
        tripPurpose: JSON.parse(values.tripPurpose),
        persons: medicalPersons(values.persons),
        includeCovidRisk: values.includeCovidRisk,
        includeAdditionalRisk: values.includeAdditionalRisk,
        amount: values.amount,
        companyName: values.companyName,
        isMultipleType: values.isMultipleType,
        insuranceValidity: Number(values.insuranceValidity),
        insuredDays: Number(values.insuredDays),
        price: values.price,
        priceEUR: values.priceEUR,
      })
    } catch (error) {
      logError('Failed to create pre-order (medical)', error)
    }
  }

  const update = async (orderId: string, values: MedicalFormValues) => {
    try {
      await updatePreOrder(orderId, InsuranceType.MEDICAL, {
        includeCovidRisk: values.includeCovidRisk,
        includeAdditionalRisk: values.includeAdditionalRisk,
        amount: values.amount,
        companyName: values.companyName,
        isMultipleType: values.isMultipleType,
        price: values.price,
        priceEUR: values.priceEUR,
        persons: medicalPersons(values?.persons || []),
        territories: { ...values.territories, region: values.region },
        tripPurpose: JSON.parse(values.tripPurpose),
        insuranceValidity: Number(values.insuranceValidity),
        insuredDays: Number(values.insuredDays),
        endDate: setMidDay(getEndDate(values) as Date),
        startDate: setMidDay(normalizeDate(values.startDate) as Date),
      })

      return orderId
    } catch (error) {
      logError('Failed to update pre-order (medical)', error)
    }
  }

  const updateContractorInfo = async (values: MedicalFormValues, orderId?: string) => {
    if (!orderId) {
      return
    }
    try {
      await updatePreOrder(
        orderId,
        InsuranceType.MEDICAL,
        {
          includeCovidRisk: values.includeCovidRisk,
          includeAdditionalRisk: values.includeAdditionalRisk,
          amount: values.amount,
          companyName: values.companyName,
          isMultipleType: values.isMultipleType,
          price: values.price,
          priceEUR: values.priceEUR,
          persons: medicalPersons(values?.persons || []),
          territories: values.territories,
          tripPurpose: JSON.parse(values.tripPurpose),
          insuranceValidity: Number(values.insuranceValidity),
          insuredDays: Number(values.insuredDays),
          endDate: setMidDay(getEndDate(values) as Date),
          startDate: setMidDay(normalizeDate(values.startDate) as Date),
          contractor: {
            fullName:
              removeExtraSpaces(values.contractorName).toUpperCase() ||
              [
                removeExtraSpaces(values.contractorLastName).toUpperCase(),
                removeExtraSpaces(values.contractorFirstName).toUpperCase(),
              ].join(' '),
            firstName: removeExtraSpaces(values.contractorFirstName).toUpperCase(),
            lastName: removeExtraSpaces(values.contractorLastName).toUpperCase(),
            passport: values?.contractorPassport?.trim?.(),
            idnx: values?.idno?.trim?.(),
            contractorType: values.contractorType,
            birthday: values.contractorBirthday,
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
      logError('Failed to update contacts for pre-order (medical)', error)
    }
  }

  const createOrUpdate = async (values: MedicalFormValues, orderId?: string) => {
    try {
      return orderId ? await update(orderId, values) : await create(values)
    } catch (error) {
      logError('Failed to createOrUpdate pre-order (medical)', error)
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

    setValue('territories', details.territories)
    setValue(
      'regions',
      getAllRegionOptions().filter((region) => details?.territories?.zoneKey.includes(region.name))
    )

    setValue('startDate', normalizeDate(details.startDate))
    setValue('endDate', normalizeDate(details.endDate))
    setValue(
      'tripPurpose',
      JSON.stringify({
        activities: details?.tripPurpose?.activities,
        name: details?.tripPurpose?.name,
      })
    )
    setValue('persons', persons)
    setValue('includeCovidRisk', details.includeCovidRisk)
    setValue('includeAdditionalRisk', details.includeAdditionalRisk)
    setValue('amount', details.amount)
    setValue('companyName', details.companyName)
    setValue('isMultipleType', details.isMultipleType)
    setValue('insuranceValidity', `${details.insuranceValidity}`)
    setValue('insuredDays', `${details.insuredDays}`)
    setValue('price', details.price)
    setValue('priceEUR', details.priceEUR)
    setValue('idno', details?.contractor?.idnx || contractorDefaultValue(persons).idnx)
    setValue(
      'contractorName',
      details?.contractor?.fullName || contractorDefaultValue(persons).fullName
    )
    setValue(
      'contractorType',
      details?.contractor?.contractorType || contractorDefaultValue(persons).contractorType
    )
    setValue('email', contact?.email || '')
    setValue('phone', contact?.phone || '373')
    setIsLoadingPreOrder(false)
  }

  const prefillFormForRomania = () => {
    setValue('isMultipleType', true)
    setValue('insuredDays', '90')
    setValue('insuranceValidity', '6')
    setValue(
      'tripPurpose',
      JSON.stringify({
        activities: ['STUDY'],
        name: translate('STUDY'),
      })
    )
    setValue('territories', { countries: ['ROU'], zoneKey: ['ROU'], zoneValues: 'ROMANIA' })
    setValue('regions', [{ name: 'ROU', value: ['ROU'] }])
  }

  return {
    createOrUpdate,
    updateContractorInfo,
    loadPreOrder,
    prefillFormForRomania,
    isLoadingPreOrder,
  }
}

const medicalPersons = (persons) => {
  return persons.reduce((prev, person) => {
    return [
      ...prev,
      {
        fullName: removeExtraSpaces(person?.fullName)?.toUpperCase() || '',
        firstName: removeExtraSpaces(person?.firstName)?.toUpperCase?.() || '',
        lastName: removeExtraSpaces(person?.lastName)?.toUpperCase?.() || '',
        birthday: setMidDay(normalizeDate(person?.birthday) as Date),
        passportSeries: extractPassportSeries(person?.passport)?.toUpperCase() || null,
        passportNumber: extractPassportNumber(person?.passport),
        idnp: person.idnp?.trim?.() || '',
        address: removeExtraSpaces(person.address) || 'Republic of Moldova',
      },
    ]
  }, [])
}

const convertPersonsFromFirebase = (persons) => {
  return persons.reduce((prev, person) => {
    return [
      ...prev,
      {
        ...person,
        birthday: setMidDay(normalizeDate(person?.birthday) as Date),
        passport: (person?.passportSeries || '') + (person?.passportNumber || ''),
      },
    ]
  }, [])
}

const getEndDate = (details: MedicalFormValues) => {
  return !details.isMultipleType && details.endDate
    ? normalizeDate(details.endDate)
    : subDays(
        add(normalizeDate(details.startDate) as Date, {
          months: Number(details.insuranceValidity),
        }),
        1
      )
}
