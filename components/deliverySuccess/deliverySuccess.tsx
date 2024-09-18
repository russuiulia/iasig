import { useTranslation } from '~/context/LanguageContext'
import { Delivery } from '~/services/interfaces/order'
import { DeliveryStepper } from '../../modules/shared/deliveryStepper/deliveryStepper'
import { DELIVERY_STATUS } from '../../modules/shared/deliveryStepper/deliveryStepper.constants'
import { DeliverySummary } from '../../modules/shared/summary/delivery'
import { IsgButton } from '~/components/shared/isgButton/isgButton'
import { useState } from 'react'
import { cancelDelivery } from '~/services/green-card.services'
export interface DeliverySuccessProps {
  delivery: Delivery
  orderId?: string
}

export const DeliverySuccess = ({ delivery, orderId = '' }: DeliverySuccessProps): JSX.Element => {
  const { translate } = useTranslation()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(false)

  const cancelOrderDelivery = async (id): Promise<void> => {
    setIsLoading(true)
    setError(false)

    const res = await cancelDelivery(id)
    if (!res) {
      setError(true)
    }
    setIsLoading(false)
  }

  return (
    <div className="text-center xl:w-2/5 md:w-3/5 w-full mx-auto">
      <DeliveryStepper status={delivery.status || DELIVERY_STATUS.SCHEDULED} />
      <DeliverySummary delivery={delivery} />
      {error && <p className="text-danger">{translate('delivery-error')}</p>}
      {[DELIVERY_STATUS.SCHEDULED].includes(delivery.status) && (
        <IsgButton
          isLoading={isLoading}
          text={translate('cancel-delivery')}
          onClick={() => cancelOrderDelivery(orderId)}
          styleClass="py-4 h-12 sm:w-44 w-full"
        />
      )}
    </div>
  )
}
