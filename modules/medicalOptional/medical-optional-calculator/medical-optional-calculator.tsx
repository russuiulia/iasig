import dynamic from 'next/dynamic'
import { useEffect } from 'react'
import { useMedicalOptionalContext } from '../medical-optional-context/medical-optional-context'
import { MedicalOptionalSteps } from '../medical-optional-context/medical-optional-context.types'
import { MedicalOptionalForm } from '../medical-optional-form/medical-optional-form'
import { MedicalOptionalPersonsForm } from '../medical-optional-persons-form/medical-optional-persons-form'
import { MedicalOptionalStepper } from '../medical-optional-stepper/medical-optional-stepper'

const DynamicMedicalOptionalConfirmation = dynamic(
  () => import('../medical-optional-confirmation/medical-optional-confirmation')
)

export const MedicalOptionalCalculator = () => {
  useEffect(() => {
    const scrollUp = (): void => window.scroll({ top: 0, left: 0, behavior: 'smooth' })
    scrollUp()
  }, [])

  const { activeStep } = useMedicalOptionalContext()

  return (
    <div className="container">
      <div className="pb-16 lg:pb-24 lg:pt-12 pt-6">
        <MedicalOptionalStepper />
        {activeStep === MedicalOptionalSteps.PolicyDetails ? (
          <MedicalOptionalForm />
        ) : activeStep === MedicalOptionalSteps.Person ? (
          <MedicalOptionalPersonsForm />
        ) : (
          <DynamicMedicalOptionalConfirmation />
        )}
      </div>
    </div>
  )
}
