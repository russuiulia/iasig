import React, { createContext, useContext, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { RcaSteps } from './rca-context.types'

export interface RcaContextType {
  activeStep: RcaSteps
  setActiveStep: (step: RcaSteps) => void
}

export const useRcaContext = (): RcaContextType => useContext(RcaContext)

export const RcaContext = createContext<RcaContextType>({} as RcaContextType)

export const RcaProvider: React.FC = (props) => {
  const { children } = props

  const [activeStep, setActiveStep] = useState<RcaSteps>(RcaSteps.InsuredDetails)

  const form = useForm({
    mode: 'onBlur',
    defaultValues: {
      idnp: '',
      certificateNumber: '',
      towingCertificateNumber: '',
      towingModel: '',
      towingPlateNumber: '',
      isTowingVehicleTrailer: false,
      operatingMode: 'normal',
      ownership: '',
      startDate: null,
      endDate: null,
      documentNumber: '',
      documentDate: null,
      price: null,
      plateNumber: '',
      personalDataConsent: false,
      companyName: '',
      phone: '',
      email: '',
      contractorName: '',
      insuranceValidity: '365',
      contractorType: '',
      fiscalInvoice: false,
    },
  })

  const state = {
    activeStep,
    setActiveStep,
  }

  return (
    <RcaContext.Provider value={state}>
      <FormProvider {...form}>{children}</FormProvider>
    </RcaContext.Provider>
  )
}
