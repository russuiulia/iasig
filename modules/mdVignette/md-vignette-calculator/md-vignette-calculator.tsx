import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useAuth } from '~/context/UserContext'

import { useMdVignettePreOrder } from '../hooks'
import { useMdVignetteContext } from '../md-vignette-context/md-vignette-context'
import { MdVignetteSteps } from '../md-vignette-context/md-vignette-context.types'
import { MdVignetteForm } from '../md-vignette-form/md-vignette-form'
import { MdVignetteStepper } from '../md-vignette-stepper/md-vignette-stepper'

const DynamicMdVignetteConfirmation = dynamic(
  () => import('../md-vignette-confirmation/md-vignette-confirmation')
)

export const MdVignetteCalculator = () => {
  const { isReady, query } = useRouter()
  const { currentUser } = useAuth()

  const { loadOrdersByUserId, loadPreOrder } = useMdVignettePreOrder()

  useEffect(() => {
    const scrollUp = (): void => window.scroll({ top: 0, left: 0, behavior: 'smooth' })
    scrollUp()
  }, [])

  useEffect(() => {
    if (!isReady) return

    if (query?.order) {
      loadPreOrder(query?.order)
    } else {
      loadOrdersByUserId(currentUser?.uid)
    }
  }, [isReady, query?.order, currentUser])

  const { activeStep } = useMdVignetteContext()

  return (
    <>
      <MdVignetteStepper />
      {activeStep === MdVignetteSteps.InsuranceDetails ? (
        <MdVignetteForm />
      ) : (
        <DynamicMdVignetteConfirmation />
      )}
    </>
  )
}
