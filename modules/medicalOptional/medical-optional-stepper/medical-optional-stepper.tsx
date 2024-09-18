import React from 'react'
import { StepsMenu } from '~/modules/shared/stepsMenu/stepsMenu'
import { useMedicalOptionalContext } from '../medical-optional-context/medical-optional-context'
import { MedicalOptionalSteps } from '../medical-optional-context/medical-optional-context.types'

export const MedicalOptionalStepper = (): JSX.Element => {
  const { activeStep, setActiveStep } = useMedicalOptionalContext()

  const onStepChange = (newStep: MedicalOptionalSteps) => {
    if (newStep !== MedicalOptionalSteps.PolicyDetails) {
      return
    }

    setActiveStep(newStep)
  }

  return (
    <StepsMenu
      steps={[
        MedicalOptionalSteps.PolicyDetails,
        MedicalOptionalSteps.Person,
        MedicalOptionalSteps.Confirmation,
      ]}
      activeStep={activeStep}
      onChange={onStepChange}
      cols={3}
    />
  )
}
