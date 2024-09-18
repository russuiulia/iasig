/* eslint-disable @next/next/no-img-element */
import Link from 'next/link'
import { SocialMediaLinks } from '~/components/socialMediaLinks/socialMediaLinks'
import { COMPANY_EMAIL, COMPANY_EMAIL_URL, COMPANY_PHONE_NUMBER_URL } from '~/constants'
import { Logo } from '../logo/logo'
import { IsgFooterLinksList } from '../isgFooterLinksList/isgFooterLinksList'
import { NAVIGATION, SOCIAL_MEDIAS } from './isgFooter.constants'
import { useTranslation } from '~/context/LanguageContext'

export const IsgFooter = (): JSX.Element => {
  const { translate } = useTranslation()

  return (
    <footer aria-labelledby="footerHeading">
      <h2 id="footerHeading" className="sr-only">
        Footer
      </h2>
      <div className="container pb-20 pt-28 md:pt-48 border-gray-lightest border-t">
        <div className="grid grid-cols-2 md:grid xl:grid-cols-6 md:grid-cols-3 xl:gap-4">
          <div className="col-span-2 xl:col-span-2 md:col-span-1 mb-10 xl:mb-0">
            <Logo />
            <div className="mt-6 md:mt-8 flex">
              <SocialMediaLinks socialMedias={SOCIAL_MEDIAS} />
              <a href={COMPANY_PHONE_NUMBER_URL} aria-label="company-number">
                <img src="/images/phone-icon.svg" alt="phone" width={24} height={24} />
              </a>
            </div>
            <div className="mt-6 md:mt-8"></div>
            <div className="mt-6 md:mt-2 text-black-lightest">
              <Link href={COMPANY_EMAIL_URL}>
                <a className="text-black-lightest hover:text-gray">{COMPANY_EMAIL}</a>
              </Link>
            </div>
            <address data-nosnippet className="mt-2 md:mt-2 text-black-lightest not-italic text-xs">
              <strong data-nosnippet>S.R.L. IASIG ONLINE</strong>
              <br />
              IDNO: 1021600002204
              <br />
              str. Albișoara 42, Chișinău, 2005
            </address>
            <ul className="flex items-center mt-6 h-5 space-x-2">
              <li className="h-full">
                <img
                  src="/images/mastercard.png"
                  alt="visa-master-card"
                  width={30}
                  height={20}
                  className="object-contain h-full"
                />
              </li>
              <li className="h-full">
                <img
                  src="/images/visa.png"
                  alt="visa"
                  width={40}
                  height={20}
                  className="object-contain h-full"
                />
              </li>
              <li className="h-full">
                <img
                  src="/images/mpay.png"
                  alt="mpay"
                  width={45}
                  height={20}
                  className="object-contain h-full"
                />
              </li>
              <li className="h-full">
                <img
                  src="/images/apple-pay.svg"
                  alt="apple-pay"
                  width={40}
                  height={20}
                  className="object-contain h-full"
                />
              </li>
              <li className="h-full">
                <img
                  src="/images/google-pay.svg"
                  alt="google-pay"
                  width={40}
                  height={20}
                  className="object-contain h-full"
                />
              </li>
            </ul>
            {/* <div className="hidden xl:block">
                <IsgLanguageSelect />
              </div> */}

            <p className="mt-6 text-gray-200 hidden xl:block">
              &copy; {new Date().getFullYear()}. {translate('copyright')}
            </p>
          </div>
          <div className="col-span-2 md:col-span-1 mb-10 xl:mb-0">
            <p className="text-black-lightest text-lg font-bold">{translate('footer:title-1')}</p>
            <div className="md:grid md:grid-cols-2 md:gap-4 mt-6 md:mt-10">
              <div>
                <IsgFooterLinksList items={NAVIGATION.insurances1} />
              </div>
              {/* <div className="mt-4 md:mt-0">
                  <IsgFooterLinksList items={NAVIGATION.insurances2} />
                </div> */}
            </div>
          </div>
          <div className="col-span-2 md:col-span-1 mb-10 xl:mb-0">
            <p className="text-black-lightest text-lg font-bold mb-6 md:mb-10">
              {translate('footer:title-2')}
            </p>
            <IsgFooterLinksList items={NAVIGATION.about} />
          </div>
          <div className="col-span-2 md:col-span-1 mb-10 xl:mb-0">
            <p className="text-black-lightest text-lg font-bold mb-6 md:mb-10">
              {translate('footer:title-3')}
            </p>
            <IsgFooterLinksList items={NAVIGATION.legal} />
          </div>
        </div>
        {/* <div className="xl:hidden block">
            <IsgLanguageSelect />
          </div> */}
        <p className="text-gray-200 xl:hidden block">
          &copy; {new Date().getFullYear()}. {translate('copyright')}
        </p>
      </div>
    </footer>
  )
}
