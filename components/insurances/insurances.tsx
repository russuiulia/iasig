/* eslint-disable @next/next/no-img-element */
import { TranslatedLink } from '../translatedLink/translatedLink'
import { INSURANCES } from './insurances.constants'
import styles from './insurances.module.scss'
import { CardInfo } from './insurances.types'
import { useTranslation } from '~/context/LanguageContext'
import { InsuranceType } from '~/modules/shared/types/insurance'

export const Insurances = (): JSX.Element => {
  const { translate } = useTranslation()

  return (
    <section id="insurances" className="container">
      <h2 className="text-center lg:mb-6 mb-4">{translate('insurances-title', 'home')}</h2>
      <p className="w-full mx-auto text-center lg:text-2xl text-lg pb-16">
        {translate('insurances-subtitle', 'home')}
      </p>
      <div className="pb-16 grid xl:grid-cols-3 grid-cols-1 gap-2 xl:gap-3 w-full">
        {INSURANCES.map((el: CardInfo, index: number) => (
          <InsuranceCard el={el} index={index} key={index} />
        ))}
      </div>
    </section>
  )
}

export const InsuranceCard = ({ el, index }: { el: CardInfo; index: number }): JSX.Element => {
  const { locale, translate } = useTranslation()
  return (
    <TranslatedLink key={index} locale={locale} pageKey={el.pageKey}>
      <a
        className={`flex flex-col col-span-1 bg-${
          el.color
        }-lightest rounded-2xl relative px-6 pt-6 pb-14 ${
          styles[`${el.color}Card`]
        } overflow-hidden`}
      >
        <span style={{ width: 'auto', height: 70 }} className="sm:mb-6 mb-1">
          <img
            src={
              el.local
                ? `/images/${
                    el.insuranceType === InsuranceType.RO_VIGNETTE ? 'rovinieta' : el.insuranceType
                  }.png`
                : `${process.env.NEXT_PUBLIC_CF_LINK}/${el.imgSrc}/small`
            }
            alt="asigurari-online"
            className={`object-contain w-auto ${
              [InsuranceType.GREEN_CARD, InsuranceType.RCA].includes(el.insuranceType)
                ? 'h-3/4'
                : 'h-full'
            }`}
          />
        </span>
        <span>
          <p className="lg:text-2xl font-bold text-black-lightest text-xl mb-1">
            {translate(el.insuranceType)}
          </p>
          <p className="color-gray">{translate(`${el.insuranceType}-subtitle`)}</p>
          <span
            className={`btn absolute bottom-6 inline-flex inter-500 justify-center w-28 items-center h-6 py-4 text-pink bg-transparent focus:shadow-outline hover:bg-pink-300`}
          >
            {translate('button-order')}
            <img
              src="/images/pink-arrow-right.svg"
              alt="pink-arrow"
              width={20}
              height={20}
              className="ml-2"
            />
          </span>
        </span>{' '}
      </a>
    </TranslatedLink>
  )
}
