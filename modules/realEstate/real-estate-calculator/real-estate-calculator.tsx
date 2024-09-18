import dynamic from 'next/dynamic'
import { useEffect } from 'react'
import { BeneficiaryForm } from '../beneficiary-form/beneficiary-form'
import { useRealEstateContext } from '../real-estate-context/real-estate-context'
import { RealEstateSteps } from '../real-estate-context/real-estate-context.types'
import { RealEstateForm } from '../real-estate-form/real-estate-form'
import { RealEstateStepper } from '../real-estate-stepper/real-estate-stepper'

const DynamicRealEstateConfirmation = dynamic(
  () => import('../real-estate-confirmation/real-estate-confirmation')
)

export const RealEstateCalculator = () => {
  useEffect(() => {
    const scrollUp = (): void => window.scroll({ top: 0, left: 0, behavior: 'smooth' })
    scrollUp()
  }, [])

  const { activeStep } = useRealEstateContext()

  return (
    <div className="container">
      <div className="pb-16 lg:pb-24 lg:pt-12 pt-6">
        <RealEstateStepper />
        {activeStep === RealEstateSteps.RealEstate ? (
          <RealEstateForm />
        ) : activeStep === RealEstateSteps.Contractor ? (
          <BeneficiaryForm />
        ) : (
          <DynamicRealEstateConfirmation />
        )}
      </div>
    </div>
  )
}
