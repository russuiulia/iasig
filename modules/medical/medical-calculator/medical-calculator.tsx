import { useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'

import { useMedicalPreOrder } from '../hooks'
import { useMedicalContext } from '../medical-context/medical-context'
import { MedicalSteps } from '../medical-context/medical-context.types'
import { MedicalForm } from '../medical-form/medical-form'
import { MedicalPersonsForm } from '../medical-persons-form/medical-persons-form'
import { MedicalStepper } from '../medical-stepper/medical-stepper'
import { ExpressOrderMedical } from '~/components/expressOrderMedical/expressOrderMedical'

const DynamicMedicalConfirmation = dynamic(
  () => import('../medical-confirmation/medical-confirmation')
)

export const MedicalCalculator = () => {
  const { isReady, query } = useRouter()
  const { prefillFormForRomania } = useMedicalPreOrder()

  useEffect(() => {
    const scrollUp = (): void => window.scroll({ top: 0, left: 0, behavior: 'smooth' })
    scrollUp()
  }, [])

  const { activeStep } = useMedicalContext()

  return (
    <>
      <div className="lg:pt-12 pt-6">
        {isReady && !query?.order && (
          <>
            <ExpressOrderMedical prefillFormForRomania={prefillFormForRomania} />
          </>
        )}
      </div>
      <div className="pb-16 lg:pb-24 lg:pt-12 pt-6">
        <MedicalStepper />
        {activeStep === MedicalSteps.TravelDetails ? (
          <MedicalForm />
        ) : activeStep === MedicalSteps.InsuranceDetails ? (
          <MedicalPersonsForm />
        ) : (
          <DynamicMedicalConfirmation />
        )}
      </div>
    </>
  )
}
