import { useRouter } from 'next/router'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { RealEstateSteps } from './real-estate-context.types'

export interface RealEstateContextType {
  activeStep: RealEstateSteps
  setActiveStep: (step: RealEstateSteps) => void
  preOrderId?: string
}

export const useRealEstateContext = (): RealEstateContextType => useContext(RealEstateContext)

export const RealEstateContext = createContext<RealEstateContextType>({} as RealEstateContextType)

export const RealEstateProvider: React.FC = (props) => {
  const { query } = useRouter()

  const { children } = props

  const [activeStep, setActiveStep] = useState<RealEstateSteps>(RealEstateSteps.RealEstate)
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
      cadastralCode: '',
      insuredValue: 'RC',
      marketValue: '',
      replacementCost: '',
      startDate: null,
      endDate: null,
      insuranceValidity: '',
      insuredDays: '',
      beneficiary: '',
      beneficiaryName: '',
      fullName: '',
      idnp: '',
      identitySeries: '',
      contractorAddress: '',
      price: null,
      personalDataConsent: false,
      fiscalInvoice: false,
      companyName: '',
      phone: '',
      realEstateType: '',
      email: '',
    },
  })

  const state = {
    activeStep,
    setActiveStep,
    preOrderId,
  }

  return (
    <RealEstateContext.Provider value={state}>
      <FormProvider {...form}>{children}</FormProvider>
    </RealEstateContext.Provider>
  )
}
