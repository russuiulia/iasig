import dynamic from 'next/dynamic'
import { useEffect } from 'react'
import { useBaggageContext } from '../baggage-context/baggage-context'
import { BaggageSteps } from '../baggage-context/baggage-context.types'
import { BaggageForm } from '../baggage-form/baggage-form'
import { BaggageStepper } from '../baggage-stepper/baggage-stepper'

const DynamicBaggageConfirmation = dynamic(
  () => import('../baggage-confirmation/baggage-confirmation')
)

export const BaggageCalculator = () => {
  useEffect(() => {
    const scrollUp = (): void => window.scroll({ top: 0, left: 0, behavior: 'smooth' })
    scrollUp()
  }, [])

  const { activeStep } = useBaggageContext()

  return (
    <div className="container">
      <div className="pb-16 lg:pb-24 lg:pt-12 pt-6">
        <BaggageStepper />
        {activeStep === BaggageSteps.Baggage ? <BaggageForm /> : <DynamicBaggageConfirmation />}
      </div>
    </div>
  )
}
