import React, { createContext, useContext, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import { RoadTaxSteps } from './road-tax-context.types'

export interface RoadTaxContextType {
  activeStep: RoadTaxSteps
  setActiveStep: (step: RoadTaxSteps) => void
}

export const useRoadTaxContext = (): RoadTaxContextType => useContext(RoadTaxContext)

export const RoadTaxContext = createContext<RoadTaxContextType>({} as RoadTaxContextType)

export const RoadTaxProvider: React.FC = (props) => {
  const { children } = props

  const [activeStep, setActiveStep] = useState<RoadTaxSteps>(RoadTaxSteps.InsuranceDetails)

  const form = useForm({
    mode: 'onBlur',
    defaultValues: {
      certificateNumber: '',
      personalDataConsent: false,
      price: null,
      phone: '',
      email: '',
      carModel: '',
      plateNumber: '',
      idnp: '',
      companyName: '',
      contractorType: '',
      locality: null,
      localityId: null,
      localityName: '',
      fullName: '',
      fiscalInvoice: false,
    },
  })

  const state = {
    activeStep,
    setActiveStep,
  }

  return (
    <RoadTaxContext.Provider value={state}>
      <FormProvider {...form}>{children}</FormProvider>
    </RoadTaxContext.Provider>
  )
}
