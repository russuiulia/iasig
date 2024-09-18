import React, { createContext, useContext, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import { MdVignetteSteps } from './md-vignette-context.types'

export interface MdVignetteContextType {
  activeStep: MdVignetteSteps
  setActiveStep: (step: MdVignetteSteps) => void
}

export const useMdVignetteContext = (): MdVignetteContextType => useContext(MdVignetteContext)

export const MdVignetteContext = createContext<MdVignetteContextType>({} as MdVignetteContextType)

export const MdVignetteProvider: React.FC = (props) => {
  const { children } = props

  const [activeStep, setActiveStep] = useState<MdVignetteSteps>(MdVignetteSteps.InsuranceDetails)

  const form = useForm({
    mode: 'onBlur',
    defaultValues: {
      vehicleType: '',
      startDate: null,
      country: '',
      plateNumber: '',
      idnp: '',
      driverFullName: '',
      personalDataConsent: false,
      price: null,
      priceEUR: null,
      phone: '',
      email: '',
      validity: '',
      fiscalInvoice: false,
    },
  })

  const state = {
    activeStep,
    setActiveStep,
  }

  return (
    <MdVignetteContext.Provider value={state}>
      <FormProvider {...form}>{children}</FormProvider>
    </MdVignetteContext.Provider>
  )
}
