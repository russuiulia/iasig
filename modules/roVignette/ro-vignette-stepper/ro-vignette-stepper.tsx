import { StepsMenu } from '../../shared/stepsMenu/stepsMenu'
import { useRoVignetteContext } from '../ro-vignette-context/ro-vignette-context'
import { RoVignetteSteps } from '../ro-vignette-context/ro-vignette-context.types'

export const RoVignetteStepper = (): JSX.Element => {
  const { activeStep, setActiveStep } = useRoVignetteContext()

  const onStepChange = (newStep: RoVignetteSteps) => {
    if (newStep !== RoVignetteSteps.InsuranceDetails) {
      return
    }

    setActiveStep(newStep)
  }

  return (
    <StepsMenu
      steps={[RoVignetteSteps.InsuranceDetails, RoVignetteSteps.Confirmation]}
      activeStep={activeStep}
      onChange={onStepChange}
      cols={2}
    />
  )
}
