/* eslint-disable @next/next/no-img-element */
import { useRouter } from 'next/navigation'

import { Maib } from '../maib/maib'
import { Mia } from '../mia/mia'
import { MPay } from '../mpay/mpay'
import { InsuranceType } from '../types/insurance'
import { WireTransfer } from '../wireTransfer/wireTransfer'
import { IsgDisclaimer } from '~/components/shared/isgDisclaimer/isgDisclaimer'
import { useTranslation } from '~/context/LanguageContext'
import { IsgOrder, PaymentMethod } from '~/services/interfaces/order'
import { useSearchParams } from 'next/navigation'

export interface PaymentMethodsProps {
  order: IsgOrder<any>
}

export const PaymentMethods = ({ order }: PaymentMethodsProps): JSX.Element => {
  const router = useRouter()
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order');

  const { translate } = useTranslation()

  const getPriceEUR = (order) => {
    return [InsuranceType.RCA, InsuranceType.MEDICAL_OPTIONAL, InsuranceType.REAL_ESTATE].includes(
      order?.insuranceType
    )
      ? Number(order?.details?.price) / 100
      : Number(order?.details?.priceEUR) * 0.2
  }
  const seller = order?.seller
  return (
    <div className="xl:w-2/5 md:w-3/5 w-full mx-auto">
      <div className={`text-left`}>
        <label className="font-medium text-xl leading-8 text-black-lightest">
          {translate('payment-methods-label')}
        </label>
        {seller?.paymentMethods?.includes(PaymentMethod.maib) && (
          <Maib
            orderId={orderId as string}
            priceEUR={getPriceEUR(order)}
            insuranceType={order?.insuranceType}
            companyName={order?.details?.companyName}
          />
        )}
        {seller?.paymentMethods?.includes(PaymentMethod.mpay) && (
          <MPay
            companyName={order?.details?.companyName}
            insuranceType={order?.insuranceType}
            orderId={orderId as string}
            priceEUR={getPriceEUR(order)}
          />
        )}
        {seller?.paymentMethods?.includes(PaymentMethod.wire_transfer) && (
          <WireTransfer idno={seller?.IDNO} orderId={order?.orderId} />
        )}
        {seller?.paymentMethods?.includes(PaymentMethod.mia) && <Mia />}
        {seller?.paymentMethods?.length === 0 ||
          (seller === undefined && <p className="text-center py-8">Nu existǎ metode de platǎ</p>)}
      </div>
      <IsgDisclaimer order={order} />
    </div>
  )
}
