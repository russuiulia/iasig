import { useTranslation } from '~/context/LanguageContext'
import { Delivery } from '~/services/interfaces/order'
import { DeliverySuccessProps } from '~/components/deliverySuccess/deliverySuccess'
import { format } from 'date-fns'

export interface DeliverySummaryProps {
  delivery: Delivery
}

export const DeliverySummary = ({ delivery }: DeliverySuccessProps): JSX.Element => {
  const { translate } = useTranslation()
  return (
    <div className="bg-gray-lightest rounded-2xl mb-8 text-left px-6 py-8 text-sm">
      <div>
        <div>
          {delivery?.address && (
            <div className="mb-2 md:flex md:justify-between md:align-center">
              <p>{translate('delivery-address')}:</p>
              <p className="text-black-lightest md:text-right">{delivery.address}</p>
            </div>
          )}
          {delivery?.deliveryTime && (
            <>
              <div className="mb-2 md:flex md:justify-between md:align-center">
                <p>{translate('delivery-date')}:</p>
                <p className="text-black-lightest">
                  {format(delivery?.deliveryTime?.toDate(), 'dd/MM/yyyy')}
                </p>
              </div>
              <div className="mb-2 md:flex md:justify-between md:align-center">
                <p>{translate('delivery-hour')}:</p>
                <p className="text-black-lightest">
                  {format(delivery?.deliveryTime?.toDate(), 'HH:mm')}
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
