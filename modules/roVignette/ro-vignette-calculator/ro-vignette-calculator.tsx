import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useAuth } from '~/context/UserContext'

import { ExpressOrder } from '~/components/expressOrder/expressOrder'
import { InsuranceType } from '~/modules/shared/types/insurance'
import { useRoVignettePreOrder } from '../hooks'
import { useRoVignetteContext } from '../ro-vignette-context/ro-vignette-context'
import { RoVignetteSteps } from '../ro-vignette-context/ro-vignette-context.types'
import { RoVignetteForm } from '../ro-vignette-form/ro-vignette-form'
import { RoVignetteStepper } from '../ro-vignette-stepper/ro-vignette-stepper'

const DynamicRoVignetteConfirmation = dynamic(
  () => import('../ro-vignette-confirmation/ro-vignette-confirmation')
)

export const RoVignetteCalculator = () => {
  const { isReady, query } = useRouter()
  const { currentUser } = useAuth()

  const { loadOrdersByUserId, loadPreOrder, loadOrderByUserId, loadingOrders, ordersByUserId } =
    useRoVignettePreOrder()

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

  const { activeStep } = useRoVignetteContext()

  return (
    <>
      <div className="pb-4 lg:pt-12 pt-6">
        {isReady && !query?.order && (
          <>
            <ExpressOrder
              ordersByUserId={ordersByUserId}
              loadingOrders={loadingOrders}
              loadOrderByUserId={loadOrderByUserId}
              insuranceType={InsuranceType.RO_VIGNETTE}
            />
          </>
        )}
      </div>
      <RoVignetteStepper />
      {activeStep === RoVignetteSteps.InsuranceDetails ? (
        <RoVignetteForm />
      ) : (
        <DynamicRoVignetteConfirmation />
      )}
    </>
  )
}
