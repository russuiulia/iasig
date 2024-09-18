import { useRouter } from 'next/router'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { MedicalSteps } from './medical-context.types'

export interface MedicalContextType {
  activeStep: MedicalSteps
  setActiveStep: (step: MedicalSteps) => void
  preOrderId?: string
}

export const useMedicalContext = (): MedicalContextType => useContext(MedicalContext)

export const MedicalContext = createContext<MedicalContextType>({} as MedicalContextType)

export const MedicalProvider: React.FC = (props) => {
  const { query } = useRouter()

  const { children } = props

  const [activeStep, setActiveStep] = useState<MedicalSteps>(MedicalSteps.TravelDetails)
  const [preOrderId, setPreOrderId] = useState<string | undefined>()

  useEffect(() => {
    const queryPreOrderId = query?.order as string | undefined

    if (queryPreOrderId && queryPreOrderId !== preOrderId) {
      setPreOrderId(queryPreOrderId)
    }
  }, [query.order])

  const form = useForm({
    mode: 'onBlur',
    defaultValues: {
      territories: {},
      regions: [],
      startDate: null,
      endDate: null,
      tripPurpose: '',
      persons: [],
      includeAdditionalRisk: false,
      includeCovidRisk: false,
      isMultipleType: false,
      idno: '',
      contractorName: '',
      contractorFirstName: '',
      contractorLastName: '',
      contractorPassport: '',
      contractorBirthday: null,
      contractorType: '',
      fiscalInvoice: false,
      insuranceValidity: '',
      insuredDays: '',
      price: null,
      priceEUR: null,
      region: '',
      phone: '',
      email: '',
    },
  })

  const state = {
    activeStep,
    setActiveStep,
    preOrderId,
  }

  return (
    <MedicalContext.Provider value={state}>
      <FormProvider {...form}>{children}</FormProvider>
    </MedicalContext.Provider>
  )
}
