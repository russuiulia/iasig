import { StepsMenu } from '../../shared/stepsMenu/stepsMenu'
import { useRoadTaxContext } from '../road-tax-context/road-tax-context'
import { RoadTaxSteps } from '../road-tax-context/road-tax-context.types'

export const RoadTaxStepper = (): JSX.Element => {
  const { activeStep, setActiveStep } = useRoadTaxContext()

  const onStepChange = (newStep: RoadTaxSteps) => {
    if (newStep !== RoadTaxSteps.InsuranceDetails) {
      return
    }

    setActiveStep(newStep)
  }

  return (
    <StepsMenu
      steps={[RoadTaxSteps.InsuranceDetails, RoadTaxSteps.Confirmation]}
      activeStep={activeStep}
      onChange={onStepChange}
      cols={2}
    />
  )
}
