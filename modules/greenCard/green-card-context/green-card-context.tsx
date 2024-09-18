import React, { createContext, useContext, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import { GreenCardSteps } from './green-card-context.types'

export interface GreenCardContextType {
  activeStep: GreenCardSteps
  setActiveStep: (step: GreenCardSteps) => void
}

export const useGreenCardContext = (): GreenCardContextType => useContext(GreenCardContext)

export const GreenCardContext = createContext<GreenCardContextType>({} as GreenCardContextType)

export const GreenCardProvider: React.FC = (props) => {
  const { children } = props

  const [activeStep, setActiveStep] = useState<GreenCardSteps>(GreenCardSteps.InsuranceDetails)

  const form = useForm({
    mode: 'onBlur',
    defaultValues: {
      zone: '',
      startDate: null,
      vignetteStartDate: null,
      endDate: null,
      insuranceValidity: '',
      certificateNumber: '',
      towingCertificateNumber: '',
      towingModel: '',
      towingPlateNumber: '',
      isTowingVehicleTrailer: false,
      ownership: '',
      idnp: '',
      carModel: '',
      plateNumber: '',
      contractorName: '',
      contractorType: '',
      fiscalInvoice: false,
      price: null,
      priceEUR: null,
      documentNumber: '',
      documentDate: null,
      personalDataConsent: false,
      companyName: '',
      phone: '',
      email: '',
      minStartDate: null,
    },
  })

  const state = {
    activeStep,
    setActiveStep,
  }

  return (
    <GreenCardContext.Provider value={state}>
      <FormProvider {...form}>{children}</FormProvider>
    </GreenCardContext.Provider>
  )
}
