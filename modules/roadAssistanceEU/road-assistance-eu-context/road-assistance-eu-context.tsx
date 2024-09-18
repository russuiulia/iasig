import React, { createContext, useContext, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import { RoadAssistanceEUSteps } from './road-assistance-eu-context.types'

export interface RoadAssistanceEUContextType {
  activeStep: RoadAssistanceEUSteps
  setActiveStep: (step: RoadAssistanceEUSteps) => void
}

export const useRoadAssistanceEUContext = (): RoadAssistanceEUContextType =>
  useContext(RoadAssistanceEUContext)

export const RoadAssistanceEUContext = createContext<RoadAssistanceEUContextType>(
  {} as RoadAssistanceEUContextType
)

export const RoadAssistanceEUProvider: React.FC = (props) => {
  const { children } = props

  const [activeStep, setActiveStep] = useState<RoadAssistanceEUSteps>(RoadAssistanceEUSteps.Vehicle)

  const form = useForm({
    mode: 'onBlur',
    defaultValues: {
      startDate: null,
      endDate: null,
      certificateNumber: '',
      personalDataConsent: false,
      price: null,
      priceRON: null,
      phone: '',
      email: '',
      carModel: '',
      carPlateNumber: '',
      period: '',
      coverage: '',
      minStartDate: null,
      offers: [],
      validData: true,
      fiscalInvoice: false,
    },
  })

  const state = {
    activeStep,
    setActiveStep,
  }

  return (
    <RoadAssistanceEUContext.Provider value={state}>
      <FormProvider {...form}>{children}</FormProvider>
    </RoadAssistanceEUContext.Provider>
  )
}
