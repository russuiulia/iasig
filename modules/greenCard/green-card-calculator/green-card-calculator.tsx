import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { ExpressOrder } from '~/components/expressOrder/expressOrder'
import { PriceBadges } from '~/components/priceBadges/priceBadges'
import { useAuth } from '~/context/UserContext'
import { InsuranceType } from '~/modules/shared/types/insurance'

import { useGreenCardContext } from '../green-card-context/green-card-context'
import { GreenCardSteps } from '../green-card-context/green-card-context.types'
import { GreenCardForm } from '../green-card-form/green-card-form'
import { GreenCardStepper } from '../green-card-stepper/green-card-stepper'
import { useGreenCardPreOrder } from '../hooks'

const DynamicGreenCardConfirmation = dynamic(
  () => import('../green-card-confirmation/green-card-confirmation')
)

export const GreenCardCalculator = () => {
  const { isReady, query } = useRouter()
  const { currentUser } = useAuth()

  const { ordersByUserId, loadOrdersByUserId, loadPreOrder, loadOrderByUserId, loadingOrders } =
    useGreenCardPreOrder()

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

  const { activeStep } = useGreenCardContext()

  return (
    <>
      <div className="pb-4 lg:pt-12 pt-6">
        {isReady && !query?.order && (
          <>
            <PriceBadges />
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
        <GreenCardStepper />
        {activeStep === GreenCardSteps.InsuranceDetails ? (
          <GreenCardForm />
        ) : (
          <DynamicGreenCardConfirmation />
        )}
      </>
    </>
  )
}
