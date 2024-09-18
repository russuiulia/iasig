import React from 'react'
import { StepsMenu } from '../../shared/stepsMenu/stepsMenu'
import { useMedicalContext } from '../medical-context/medical-context'
import { MedicalSteps } from '../medical-context/medical-context.types'

export const MedicalStepper = (): JSX.Element => {
  const { activeStep, setActiveStep } = useMedicalContext()

  const onStepChange = (newStep: MedicalSteps) => {
    if (newStep !== MedicalSteps.TravelDetails) {
      return
    }

    setActiveStep(newStep)
  }

  return (
    <StepsMenu
      steps={[MedicalSteps.TravelDetails, MedicalSteps.InsuranceDetails, MedicalSteps.Confirmation]}
      activeStep={activeStep}
      onChange={onStepChange}
      cols={3}
    />
  )
}
