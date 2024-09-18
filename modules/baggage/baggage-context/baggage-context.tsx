import React, { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { FormProvider, useForm } from 'react-hook-form'

import { BaggageSteps } from './baggage-context.types'

export interface BaggageContextType {
  activeStep: BaggageSteps
  setActiveStep: (step: BaggageSteps) => void
  preOrderId?: string
}

export const useBaggageContext = (): BaggageContextType => useContext(BaggageContext)

export const BaggageContext = createContext<BaggageContextType>({} as BaggageContextType)

export const BaggageProvider: React.FC = (props) => {
  const { query } = useRouter()

  const { children } = props

  const [activeStep, setActiveStep] = useState<BaggageSteps>(BaggageSteps.Baggage)
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
      departureDate: null,
      fullName: '',
      idnp: '',
      price: null,
      priceEUR: null,
      personalDataConsent: false,
      companyName: '',
      phone: '',
      email: '',
      flightNumbers: [],
      baggagePcs: '',
      fiscalInvoice: false,
    },
  })

  const state = {
    activeStep,
    setActiveStep,
    preOrderId,
  }

  return (
    <BaggageContext.Provider value={state}>
      <FormProvider {...form}>{children}</FormProvider>
    </BaggageContext.Provider>
  )
}
