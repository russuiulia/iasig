import { useEffect } from 'react'
import dynamic from 'next/dynamic'
import { RcaSteps } from '../rca-context/rca-context.types'
import { RcaForm } from '../rca-form/rca-form'
import { RcaStepper } from '../rca-stepper/rca-stepper'
import { useRcaContext } from '../rca-context/rca-context'
import { ExpressOrder } from '~/components/expressOrder/expressOrder'
import { useRouter } from 'next/router'
import { useRcaPreOrder } from '../hooks'
import { InsuranceType } from '~/modules/shared/types/insurance'
import { useAuth } from '~/context/UserContext'

const DynamicRcaConfirmation = dynamic(() => import('../rca-confirmation/rca-confirmation'))

export const RcaCalculator = () => {
  const { currentUser } = useAuth()
  const { isReady, query } = useRouter()
  const { activeStep } = useRcaContext()

  const { ordersByUserId, loadOrdersByUserId, loadPreOrder, loadOrderByUserId, loadingOrders } =
    useRcaPreOrder()

  useEffect(() => {
    if (!isReady) return
    if (query?.order) {
      loadPreOrder(query?.order)
    } else {
      loadOrdersByUserId(currentUser?.uid)
    }
  }, [isReady, query?.order, currentUser])

  useEffect(() => {
    const scrollUp = (): void => window.scroll({ top: 0, left: 0, behavior: 'smooth' })
    scrollUp()
  }, [])

  return (
    <>
      <div className="pb-4 lg:pt-12 pt-6">
        {isReady && !query?.order && (
          <ExpressOrder
            ordersByUserId={ordersByUserId}
            loadingOrders={loadingOrders}
            loadOrderByUserId={loadOrderByUserId}
            insuranceType={InsuranceType.RCA}
          />
        )}
      </div>
      <div>
        <RcaStepper />
        {activeStep === RcaSteps.InsuredDetails ? <RcaForm /> : <DynamicRcaConfirmation />}
      </div>
    </>
  )
}
