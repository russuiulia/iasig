import { useEffect, useState } from 'react'
import { differenceInCalendarDays } from 'date-fns'
import { useRouter, useSearchParams } from 'next/navigation'

import { ProgressStepper } from '../progressStepper/progressStepper'
import { RoadTax } from '../roadTax/roadTax'
import { SummaryHeader } from '../summary/header'
import { SummaryBody } from '../summaryBody/summaryBody'
import { SummaryLoader } from '../summaryLoader/summaryLoader'
import { InsuranceType } from '../types/insurance'
import { DangerAlert } from '~/components/dangerAlert/dangerAlert'
import { ErrorCard } from '~/components/shared/isgErrorCard/isgErrorCard'
import { useTranslation } from '~/context/LanguageContext'
import { Status } from '~/interfaces/status'
import { IsgOrder } from '~/services/interfaces/order'
import { getRoadTaxPrice } from '~/services/road-tax.services'

export interface OrderContentProps {
  order: IsgOrder<any>
  isLoading: boolean
  errorCard: boolean
  id: string
}

export const OrderContent = ({
  order,
  isLoading,
  errorCard,
  id,
}: OrderContentProps): JSX.Element => {
  const { translate } = useTranslation()
  const [open, setOpen] = useState(false)
  const [roadTax, setRoadTax] = useState<number | null>(null)
  const [vinCode, setVinCode] = useState<string>('')
  const router = useRouter()
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order');
  // useEffect(() => {
  //   if (router.isReady) {
  //     setOpen(router?.query?.payment === 'error')
  //   }
  // }, [router?.isReady])

  useEffect(() => {
    const calculatePrice = async () => {
      const result = await getRoadTaxPrice({
        certificateNumber: order?.details?.certificateNumber,
        skipIdnxValidation: true,
      })

      setRoadTax(result?.price)
      setVinCode(result?.vinCode || '')
    }

    if (order.insuranceType === InsuranceType.RCA) {
      calculatePrice()
    }
  }, [order.insuranceType])

  return (
    <>
      {isLoading ? (
        <div className="xl:w-2/5 md:w-3/5 w-full mx-auto">
          <SummaryLoader />
        </div>
      ) : (
        <>
          {errorCard ? (
            <ErrorCard content={translate('summary:error')} />
          ) : (
            <>
              <SummaryHeader order={order} id={id} />
              {order.status !== Status.COMPLETED && (
                <div className="xl:w-2/5 md:w-3/5 w-full mx-auto">
                  <ProgressStepper status={order.status} />
                  {[Status.DRAFT].includes(order.status) && (
                    <>
                      {open && (
                        <div className="mb-8">
                          <DangerAlert
                            danger={open}
                            text={translate('payment-error')}
                            close={() => {
                              setOpen(false)
                              router.replace(`/order?order=${orderId}`)
                            }}
                          />
                        </div>
                      )}
                      {order.insuranceType === InsuranceType.RO_VIGNETTE && (
                        <div className="mb-4 bg-blue-100 text-blue-800 text-sm font-medium me-2 px-1 py-1 rounded">
                          După plată, operatorii noștri vor prelua comanda Dvs și în maxim 3 minute
                          o primiți pe email.
                        </div>
                      )}
                      <p className="font-medium text-xl leading-8 text-black-lightest text-left">
                        {translate('verify-details')}
                      </p>
                    </>
                  )}
                  {[Status.PAID, Status.ISSUED, Status.PROCESSING].includes(order.status) && (
                    <p className="font-medium text-xl leading-8 text-black-lightest text-left">
                      {order.insuranceType === InsuranceType.RO_VIGNETTE
                        ? translate('vignette-release-details')
                        : order.insuranceType === InsuranceType.ROAD_SIDE_ASSISTANCE_EU
                        ? translate('road-assistance-eu-release-details')
                        : translate('release-details')}
                    </p>
                  )}
                </div>
              )}
              <SummaryBody order={{ ...order, orderId: id }} />
              {([Status.PAID, Status.PROCESSING, Status.DRAFT].includes(order.status) ||
                (order.status === Status.COMPLETED &&
                  differenceInCalendarDays(new Date(), order?.completedAt?.toDate?.()) <= 30)) &&
                (roadTax ? (
                  <div className="xl:w-2/5 md:w-3/5 w-full mx-auto mt-10">
                    <RoadTax price={roadTax} vinCode={vinCode} />{' '}
                  </div>
                ) : (
                  <></>
                ))}
            </>
          )}
        </>
      )}
    </>
  )
}
