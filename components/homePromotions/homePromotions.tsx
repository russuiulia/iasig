/* eslint-disable @next/next/no-img-element */
import { useTranslation } from '~/context/LanguageContext'
import { IsgImage } from '../shared/isgImage/isgImage'

export const HomePromotions = (): JSX.Element => {
  const { translate } = useTranslation()

  return (
    <section className="container">
      <div className="py-16 sm:py-32 lg:py-24 grid md:grid-cols-2 grid-cols-1 items-center md:gap-28 gap-8">
        <IsgImage
          src="a89bdeb5-1514-44a6-096f-2bee48925400"
          width={640}
          height={797}
          className="rounded-3xl object-cover"
          showSmall={false}
        />

        <div className="className={`text-left`}">
          <h3 className="mb-6">{translate('promotions-title', 'home')}</h3>
          <p className="mb-6">{translate('promotions-subtitle-1', 'home')}</p>
          <p>{translate('promotions-subtitle-2', 'home')}</p>

          <div className="grid grid-cols-12 gap-4 mt-8 md:text-left text-center">
            <div className="md:col-span-3 col-span-3">
              <p className="sm:text-3xl text-2xl text-blue font-bold mb-1">
                24/7<small className="text-xl">&nbsp;</small>
              </p>
              <p>{translate('available', 'home')}</p>
            </div>
            <div className="md:col-span-3 col-span-6">
              <p className="sm:text-3xl text-2xl text-blue font-bold mb-1">
                {'< 1 '}
                <small className="text-xl">{translate('minute')}</small>
              </p>
              <p>{translate('for-be-insured', 'home')}</p>
            </div>
            <div className="md:col-span-6 col-span-3">
              <p className="sm:text-3xl text-2xl text-blue font-bold mb-1">
                100<small className="text-xl">%</small>
              </p>
              <p>{translate('online', 'home')}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
