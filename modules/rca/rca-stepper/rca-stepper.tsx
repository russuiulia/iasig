import React from 'react'
import { StepsMenu } from '../../shared/stepsMenu/stepsMenu'
import { useRcaContext } from '../rca-context/rca-context'
import { RcaSteps } from '../rca-context/rca-context.types'

export const RcaStepper = (): JSX.Element => {
  const { activeStep, setActiveStep } = useRcaContext()

  const onStepChange = (newStep: RcaSteps) => {
    if (newStep !== RcaSteps.InsuredDetails) {
      return
    }

    setActiveStep(newStep)
  }

  return (
    <StepsMenu
      steps={[RcaSteps.InsuredDetails, RcaSteps.Confirmation]}
      activeStep={activeStep}
      onChange={onStepChange}
      cols={2}
    />
  )
}
