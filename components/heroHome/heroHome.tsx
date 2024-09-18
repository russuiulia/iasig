/* eslint-disable @next/next/no-img-element */
import { Link } from 'react-scroll'
import styles from './heroHome.module.scss'
import { useTranslation } from '~/context/LanguageContext'
import Lottie from 'react-lottie-player'
import lottieJson from './lottie.json'

export const Hero = (): JSX.Element => {
  const { translate } = useTranslation()

  return (
    <section>
      <div className={`${styles.headerImg} absolute top-0 z-0`} />
      <div
        className={`container text-left grid lg:grid-cols-12 grid-cols-1 ${styles.header} xl:pt-36  pt-24`}
      >
        <div className="col-span-7 lg:text-left text-center">
          <h1 className="mb-4 md:mb-6">{translate('title', 'home')}</h1>
          <h2 className="lg:mb-6 mb-4">{translate('subtitle', 'home')}</h2>
          <p className="text-xl md:text-2xl leading-9 mb-6 sm:mb-0">
            {translate('subtitle-1', 'home')}
          </p>
          <div className="flex flex-col justify-center lg:hidden">
            <Lottie loop animationData={lottieJson} play />
          </div>
          <div className="mt-14">
            <Link
              to="insurances"
              spy={true}
              smooth={true}
              duration={500}
              offset={-80}
              href="#insurances"
              className="btn inline-flex justify-center w-44 h-14 rounded-full items-center py-4 text-white bg-pink focus:shadow-outline hover:bg-pink-300"
            >
              {translate('buy-now')}
            </Link>
          </div>
        </div>
        <Lottie
          loop
          animationData={lottieJson}
          play
          className="col-span-5 lg:flex hidden flex-col justify-center"
        />
      </div>
    </section>
  )
}
