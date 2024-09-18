import React, { createContext, useContext, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import { RoVignetteSteps } from './ro-vignette-context.types'

export interface RoVignetteContextType {
  activeStep: RoVignetteSteps
  setActiveStep: (step: RoVignetteSteps) => void
}

export const useRoVignetteContext = (): RoVignetteContextType => useContext(RoVignetteContext)

export const RoVignetteContext = createContext<RoVignetteContextType>({} as RoVignetteContextType)

export const RoVignetteProvider: React.FC = (props) => {
  const { children } = props

  const [activeStep, setActiveStep] = useState<RoVignetteSteps>(RoVignetteSteps.InsuranceDetails)

  const form = useForm({
    mode: 'onBlur',
    defaultValues: {
      startDate: null,
      certificateNumber: '',
      personalDataConsent: false,
      price: null,
      priceRON: null,
      phone: '',
      email: '',
      periodDays: null,
      description: '',
      carModel: '',
      carPlateNumber: '',
      vignetteDetails: {},
      registrationCountry: 'MD',
      fiscalInvoice: false,
    },
  })

  const state = {
    activeStep,
    setActiveStep,
  }

  return (
    <RoVignetteContext.Provider value={state}>
      <FormProvider {...form}>{children}</FormProvider>
    </RoVignetteContext.Provider>
  )
}
