import { useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'

import { useRoadAssistanceEUPreOrder } from '../hooks'
import { useRoadAssistanceEUContext } from '../road-assistance-eu-context/road-assistance-eu-context'
import { RoadAssistanceEUSteps } from '../road-assistance-eu-context/road-assistance-eu-context.types'
import { RoadAssistanceEUForm } from '../road-assistance-eu-form/road-assistance-eu-form'
import { RoadAssistanceEUStepper } from '../road-assistance-eu-stepper/road-assistance-eu-stepper'
import { ExpressOrder } from '~/components/expressOrder/expressOrder'
import { useAuth } from '~/context/UserContext'
import { InsuranceType } from '~/modules/shared/types/insurance'

const DynamicRoadAssistanceEUConfirmation = dynamic(
  () => import('../road-assistance-eu-confirmation/road-assistance-eu-confirmation')
)

export const RoadAssistanceEUCalculator = () => {
  const { isReady, query } = useRouter()
  const { currentUser } = useAuth()

  const { loadOrdersByUserId, loadPreOrder, loadOrderByUserId, loadingOrders, ordersByUserId } =
    useRoadAssistanceEUPreOrder()

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

  const { activeStep } = useRoadAssistanceEUContext()

  return (
    <>
      <div className="pb-4 lg:pt-12 pt-6">
        {isReady && !query?.order && (
          <>
            <ExpressOrder
              ordersByUserId={ordersByUserId}
              loadingOrders={loadingOrders}
              loadOrderByUserId={loadOrderByUserId}
              insuranceType={InsuranceType.ROAD_SIDE_ASSISTANCE_EU}
            />
          </>
        )}
      </div>
      <RoadAssistanceEUStepper />
      {activeStep === RoadAssistanceEUSteps.Vehicle ? (
        <RoadAssistanceEUForm />
      ) : (
        <DynamicRoadAssistanceEUConfirmation />
      )}
    </>
  )
}
