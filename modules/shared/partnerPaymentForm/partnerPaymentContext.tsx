import React, { createContext, useContext } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

export const PartnerPaymentContext = createContext({})

interface PartnerPaymentProviderInterface {
  children: React.ReactNode
}

export const PartnerPaymentProvider: React.FC<PartnerPaymentProviderInterface> = ({ children }) => {
  const form = useForm({
    mode: 'onBlur',
    defaultValues: {
      billNumber: '',
    },
  })

  return (
    <PartnerPaymentContext.Provider value={{}}>
      <FormProvider {...form}>{children}</FormProvider>
    </PartnerPaymentContext.Provider>
  )
}

export const usePartnerPayment = () => useContext(PartnerPaymentContext)
