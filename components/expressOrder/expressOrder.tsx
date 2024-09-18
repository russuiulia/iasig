import { useEffect, useState } from 'react'
import ContentLoader from 'react-content-loader'
import { useTranslation } from '~/context/LanguageContext'
import { isV2Order } from '~/modules/shared/orderV2/types'
import { InsuranceType } from '~/modules/shared/types/insurance'
import { formatPlateNumber } from '~/modules/utils/formatPlateNumber'
import * as fba from '../../fba'

export const ExpressOrder = ({
  loadingOrders,
  ordersByUserId,
  loadOrderByUserId,
  insuranceType,
}) => {
  const { translate } = useTranslation()
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  if (!hasMounted) {
    return null
  }

  if (loadingOrders) {
    return (
      <div className="xl:w-2/5 md:w-3/5 w-full mx-auto">
        <Loader />
      </div>
    )
  }

  if (ordersByUserId?.length) {
    return (
      <div
        className={`xl:w-2/5 md:w-3/5 w-full mx-auto ${
          ordersByUserId?.length === 2
            ? 'grid md:grid-cols-2 grid-cols-1 gap-4'
            : 'md:flex grid grid-cols-1 justify-center'
        } mt-4`}
      >
        {ordersByUserId.map((el, index) => {
          const details = isV2Order(el)
            ? el.items.find((item) =>
                [
                  InsuranceType.RCA,
                  InsuranceType.GREEN_CARD,
                  InsuranceType.RO_VIGNETTE,
                  InsuranceType.ROAD_TAX,
                ].includes(item.type)
              )?.details
            : el?.details

          const plateNumber = formatPlateNumber(details?.plateNumber)
          return details ? (
            <button
              key={index + 1}
              type="button"
              className="rounded-md bg-white pt-1 pb-2.5 px-2 text-sm  text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              onClick={() => {
                loadOrderByUserId(index)
                fba.express_order(insuranceType)
              }}
            >
              <span className="text-3xs text-center text-gray-200">
                <i>{translate('renew-for')}</i>
              </span>
              <p className="font-semibold truncate text-center">
                {details?.carModel} {plateNumber ? `(${plateNumber})` : ''}
              </p>
            </button>
          ) : null
        })}
      </div>
    )
  }

  return null
}

const Loader = (): JSX.Element => {
  return (
    <ContentLoader
      speed={2}
      backgroundColor="#f3f3f3"
      foregroundColor="#ecebeb"
      style={{
        backgroundColor: '#f5f6f8',
      }}
      className="mx-auto h-16 w-56 mt-4"
    >
      <rect
        x="15%"
        y="4"
        rx="3"
        ry="3"
        width="70%"
        height="16"
        className="mx-auto md:hidden flex"
      />

      <rect x="36%" y="4" rx="3" ry="3" width="32%" height="10" className="mx-auto" />

      <rect x="8%" y="40" rx="3" ry="3" width="84%" height="18" />
    </ContentLoader>
  )
}
