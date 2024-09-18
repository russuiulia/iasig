import { useRouter } from 'next/router'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { MedicalOptionalSteps } from './medical-optional-context.types'

export interface MedicalOptionalContextType {
  activeStep: MedicalOptionalSteps
  setActiveStep: (step: MedicalOptionalSteps) => void
  preOrderId?: string
}

export const useMedicalOptionalContext = (): MedicalOptionalContextType =>
  useContext(MedicalOptionalContext)

export const MedicalOptionalContext = createContext<MedicalOptionalContextType>(
  {} as MedicalOptionalContextType
)

export const MedicalOptionalProvider: React.FC = (props) => {
  const { query } = useRouter()

  const { children } = props

  const [activeStep, setActiveStep] = useState<MedicalOptionalSteps>(
    MedicalOptionalSteps.PolicyDetails
  )
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
      nationalityCode: '',
      startDate: null,
      endDate: null,
      persons: [],
      includeAdditionalRisk: false,
      riskFactors: [],
      insuranceValidity: '',
      price: null,
      phone: '',
      email: '',
      insuredDays: null,
      idno: '',
      contractorName: '',
      contractorType: '',
      contractorAddress: '',
      fiscalInvoice: false,
    },
  })

  const state = {
    activeStep,
    setActiveStep,
    preOrderId,
  }

  return (
    <MedicalOptionalContext.Provider value={state}>
      <FormProvider {...form}>{children}</FormProvider>
    </MedicalOptionalContext.Provider>
  )
}
