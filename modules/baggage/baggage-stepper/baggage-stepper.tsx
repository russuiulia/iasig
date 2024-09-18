import { StepsMenu } from '../../shared/stepsMenu/stepsMenu'
import { useBaggageContext } from '../baggage-context/baggage-context'
import { BaggageSteps } from '../baggage-context/baggage-context.types'

export const BaggageStepper = (): JSX.Element => {
  const { activeStep, setActiveStep } = useBaggageContext()

  const onStepChange = (newStep: BaggageSteps) => {
    if (newStep !== BaggageSteps.Baggage) {
      return
    }

    setActiveStep(newStep)
  }

  return (
    <StepsMenu
      steps={[BaggageSteps.Baggage, BaggageSteps.Confirmation]}
      activeStep={activeStep}
      onChange={onStepChange}
      cols={2}
    />
  )
}
