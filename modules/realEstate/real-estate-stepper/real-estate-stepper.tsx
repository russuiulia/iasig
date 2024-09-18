import React from 'react'
import { StepsMenu } from '../../shared/stepsMenu/stepsMenu'
import { useRealEstateContext } from '../real-estate-context/real-estate-context'
import { RealEstateSteps } from '../real-estate-context/real-estate-context.types'

export const RealEstateStepper = (): JSX.Element => {
  const { activeStep, setActiveStep } = useRealEstateContext()

  const onStepChange = (newStep: RealEstateSteps) => {
    if (newStep !== RealEstateSteps.RealEstate) {
      return
    }

    setActiveStep(newStep)
  }

  return (
    <StepsMenu
      steps={[RealEstateSteps.RealEstate, RealEstateSteps.Contractor, RealEstateSteps.Confirmation]}
      activeStep={activeStep}
      onChange={onStepChange}
      cols={3}
    />
  )
}
