import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

import { InsuranceDownload } from '../insuranceDownload/insuranceDownload'
import { PartnerPaymentForm } from '../partnerPaymentForm/partnerPaymentForm'
import { PaymentMethods } from '../paymentMethods/paymentMethods'
import { Summary } from '../summary/summary'
import { InsuranceType } from '../types/insurance'
import { DeliveryForm } from '~/components/deliveryForm/deliveryForm'
import { SupportPage } from '~/components/pages/supportPage/supportPage'
import { IsgButton } from '~/components/shared/isgButton/isgButton'
import { useTranslation } from '~/context/LanguageContext'
import { useAuth } from '~/context/UserContext'
import { Status } from '~/interfaces/status'
import { getPartnerFeature } from '~/services/firebase.service'
import { IsgOrder } from '~/services/interfaces/order'
import { expireSoon, isActiveInsurance } from '~/utils/checkInsuranceStatus'
import { useExtendInsurance } from '~/utils/useFormPersist'

export interface SummaryBodyProps {
  order: IsgOrder<any>
}

export const SummaryBody = ({ order }: { order: IsgOrder<any> }): JSX.Element => {
  const { currentUser } = useAuth()
  const searchParams = useSearchParams();
  const queryOrder = searchParams.get('order');
  const [displayForm, setDisplayForm] = useState(false)

  useEffect(() => {
    if (!(currentUser && !currentUser?.isAnonymous) || !queryOrder) {
      return
    }

    getPartnerFeature(queryOrder as string, order.insuranceType).then((data) => {
      setDisplayForm(data)
    })
  }, [currentUser?.isAnonymous, queryOrder])

  switch (order.status) {
    case Status.DRAFT:
      return (
        <>
          <Body order={order} />
          {displayForm ? <PartnerPaymentForm type={order.insuranceType} /> : <></>}
          <PaymentMethods order={order} />
        </>
      )
    case Status.EXPIRED:
      return (
        <>
          <Body order={order} />
          <ExtendInsuranceButton order={order} />
        </>
      )
    case Status.PAID:
    case Status.ISSUED:
    case Status.PROCESSING:
      return <Body order={order} />
    case Status.REFUNDED:
      return (
        <>
          <Body order={order} />
          <ExtendInsuranceButton order={order} />
        </>
      )
    case Status.COMPLETED:
      return (
        <>
          <InsuranceDownload
            documents={order?.documents || []}
            insuranceType={order.insuranceType}
            noGap={!!order?.addonAttachments?.length}
          />
          {order?.addonAttachments?.length ? (
            <InsuranceDownload
              documents={order?.addonAttachments || []}
              insuranceType={order.insuranceType}
            />
          ) : null}
          <Body order={order} />
          {expireSoon(order) ? <ExtendInsuranceButton order={order} /> : <></>}
          {isActiveInsurance(order) && <AdditionalInfo order={order} />}
        </>
      )
    case Status.FAILED:
      return (
        <>
          <SupportPage />
          <Body order={order} />
        </>
      )
    default:
      return <></>
  }
}

const Body = ({ order }) => (
  <div className="xl:w-2/5 md:w-3/5 w-full mx-auto">
    <Summary order={order} />
  </div>
)

const ExtendInsuranceButton = ({ order }): JSX.Element => {
  const { isLoading, renewInsurance } = useExtendInsurance(order.insuranceType, {
    ...order.details,
    ...order.contact,
  })

  const { translate } = useTranslation()

  return order.insuranceType !== InsuranceType.RO_VIGNETTE ? (
    <>
      <div className="flex justify-center mt-4">
        <IsgButton
          styleClass="d-block mx-auto py-4 h-12 sm:w-52 w-full"
          type="button"
          text={expireSoon(order) ? translate('extend-insurance') : translate('button:new-order')}
          onClick={() => renewInsurance()}
          isLoading={isLoading}
        />
      </div>
    </>
  ) : (
    <></>
  )
}

const AdditionalInfo = ({ order }: { order: IsgOrder<any> }): JSX.Element => {
  const { translate } = useTranslation()

  switch (order.insuranceType) {
    case InsuranceType.GREEN_CARD:
      return (
        <div className="mt-6">
          <div dangerouslySetInnerHTML={{ __html: translate('check-validity') }} />

          <DeliveryForm order={order} />
        </div>
      )

    default:
      return <></>
  }
}
