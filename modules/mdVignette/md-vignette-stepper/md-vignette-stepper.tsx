import { StepsMenu } from '../../shared/stepsMenu/stepsMenu'
import { useMdVignetteContext } from '../md-vignette-context/md-vignette-context'
import { MdVignetteSteps } from '../md-vignette-context/md-vignette-context.types'

export const MdVignetteStepper = (): JSX.Element => {
  const { activeStep, setActiveStep } = useMdVignetteContext()

  const onStepChange = (newStep: MdVignetteSteps) => {
    if (newStep !== MdVignetteSteps.InsuranceDetails) {
      return
    }

    setActiveStep(newStep)
  }

  return (
    <StepsMenu
      steps={[MdVignetteSteps.InsuranceDetails, MdVignetteSteps.Confirmation]}
      activeStep={activeStep}
      onChange={onStepChange}
      cols={2}
    />
  )
}
