import { useEffect, useState } from 'react'
import ContentLoader from 'react-content-loader'
import { useFormContext } from 'react-hook-form'
import { AiFillCar } from 'react-icons/ai'
import { Currency, useForex } from '~/context/ForexContext'
import { useTranslation } from '~/context/LanguageContext'

interface BadgeProps {
  text: string
  priceEur: number
  zone: string
}

const Badge = ({ text, priceEur, zone }: BadgeProps) => {
  const { convert } = useForex()
  const { setValue } = useFormContext()

  const handleClick = () => {
    setValue('zone', zone)
    setValue('insuranceValidity', '15')
  }

  const calculatedPrice = convert(priceEur, Currency.EUR, Currency.MDL)

  return (
    <button
      onClick={handleClick}
      className="text-xs w-fit flex py-1 px-2.5 md:mx-0 mx-auto leading-none text-center whitespace-nowrap align-baseline font-medium bg-yellow-100 rounded-lg md:mb-0 mb-4"
    >
      <AiFillCar className="mr-2 text-black" />
      <span className="text-yellow-700">{`${text} - ${calculatedPrice.toFixed(2)} MDL`}</span>
    </button>
  )
}

export const PriceBadges: React.FC = () => {
  const { exchangeRateLoaded } = useForex()
  const { translate } = useTranslation()
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  if (!hasMounted) {
    return null
  }

  if (exchangeRateLoaded) {
    return (
      <div className="xl:w-2/5 md:w-3/5 w-full mx-auto">
        <div className="mb-4 flex justify-center">
          <img className="w-5 h-5" src="/images/lightning.png" alt="lightning" />
          <span className="text-black-lightest font-medium ml-2">
            {translate('popular-destinations')}
          </span>
        </div>
        <div className="md:flex md:justify-between items-center ">
          <Badge text={translate('badge-ue')} priceEur={35.91} zone="3" />
          <Badge text={translate('badge-ukr')} priceEur={3.15} zone="1" />
        </div>
      </div>
    )
  }

  return (
    <div className="xl:w-2/5 md:w-3/5 w-full mx-auto">
      <Loader />
    </div>
  )
}

const Loader = (): JSX.Element => (
  <ContentLoader
    speed={2}
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
    style={{
      backgroundColor: '#f5f6f8',
    }}
    className="md:w-full md:h-16 md:mx-0 mx-auto h-24 w-60"
  >
    <rect x="15%" y="4" rx="3" ry="3" width="70%" height="16" className="mx-auto md:hidden flex" />

    <rect x="36%" y="4" rx="3" ry="3" width="32%" height="16" className="mx-auto" />

    <rect x="8%" y="40" rx="3" ry="3" width="84%" height="12" className="md:hidden flex" />
    <rect x="10%" y="76" rx="3" ry="3" width="80%" height="12" className="md:hidden flex" />

    <rect x="10" y="40" rx="3" ry="3" width="35%" height="12" className="md:flex hidden" />
    <rect x="64%" y="40" rx="3" ry="3" width="35%" height="12" className="md:flex hidden" />
  </ContentLoader>
)
