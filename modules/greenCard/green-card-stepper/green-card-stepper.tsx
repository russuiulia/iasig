import React from 'react'
import { StepsMenu } from '../../shared/stepsMenu/stepsMenu'
import { useGreenCardContext } from '../green-card-context/green-card-context'
import { GreenCardSteps } from '../green-card-context/green-card-context.types'

export const GreenCardStepper = (): JSX.Element => {
  const { activeStep, setActiveStep } = useGreenCardContext()

  const onStepChange = (newStep: GreenCardSteps) => {
    if (newStep !== GreenCardSteps.InsuranceDetails) {
      return
    }

    setActiveStep(newStep)
  }

  return (
    <StepsMenu
      steps={[GreenCardSteps.InsuranceDetails, GreenCardSteps.Confirmation]}
      activeStep={activeStep}
      onChange={onStepChange}
      cols={2}
    />
  )
}
