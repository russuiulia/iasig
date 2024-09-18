import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useAuth } from '~/context/UserContext'

import { ExpressOrder } from '~/components/expressOrder/expressOrder'
import { InsuranceType } from '~/modules/shared/types/insurance'
import { useRoadTaxPreOrder } from '../hooks'
import { useRoadTaxContext } from '../road-tax-context/road-tax-context'
import { RoadTaxSteps } from '../road-tax-context/road-tax-context.types'
import { RoadTaxForm } from '../road-tax-form/road-tax-form'
import { RoadTaxStepper } from '../road-tax-stepper/road-tax-stepper'

const DynamicRoadTaxConfirmation = dynamic(
  () => import('../road-tax-confirmation/road-tax-confirmation')
)

export const RoadTaxCalculator = () => {
  const { isReady, query } = useRouter()
  const { currentUser } = useAuth()

  const { loadOrdersByUserId, loadPreOrder, ordersByUserId, loadingOrders, loadOrderByUserId } =
    useRoadTaxPreOrder()

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

  const { activeStep } = useRoadTaxContext()
  return (
    <>
      <div className="pb-4 lg:pt-12 pt-6">
        {isReady && !query?.order && (
          <>
            <ExpressOrder
              ordersByUserId={ordersByUserId}
              loadingOrders={loadingOrders}
              loadOrderByUserId={loadOrderByUserId}
              insuranceType={InsuranceType.GREEN_CARD}
            />
          </>
        )}
      </div>
      <>
        <RoadTaxStepper />
        {activeStep === RoadTaxSteps.InsuranceDetails ? (
          <RoadTaxForm />
        ) : (
          <DynamicRoadTaxConfirmation />
        )}
      </>
    </>
  )
}
