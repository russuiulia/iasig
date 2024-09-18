import { StepsMenu } from '../../shared/stepsMenu/stepsMenu'
import { useRoadAssistanceEUContext } from '../road-assistance-eu-context/road-assistance-eu-context'
import { RoadAssistanceEUSteps } from '../road-assistance-eu-context/road-assistance-eu-context.types'

export const RoadAssistanceEUStepper = (): JSX.Element => {
  const { activeStep, setActiveStep } = useRoadAssistanceEUContext()

  const onStepChange = (newStep: RoadAssistanceEUSteps) => {
    if (newStep !== RoadAssistanceEUSteps.Vehicle) {
      return
    }

    setActiveStep(newStep)
  }

  return (
    <StepsMenu
      steps={[RoadAssistanceEUSteps.Vehicle, RoadAssistanceEUSteps.Confirmation]}
      activeStep={activeStep}
      onChange={onStepChange}
      cols={2}
    />
  )
}
