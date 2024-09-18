/* eslint-disable @next/next/no-img-element */
import { useState } from 'react'
import Link from 'next/link'
import { HiOutlineUserCircle } from 'react-icons/hi'

import { IsgDisclosureButton } from '../isgDisclosureButton/isgDisclosureButton'
import { IsgLanguageSelect } from '../isgLanguageSelect/isgLanguageSelect'
import { IsgNavItemsList } from '../isgNavItemsList/navItemLists'
import { Logo } from '../logo/logo'
import { useNavbarBackground } from './hooks/useNavbarBackground'
import { NAV_ITEMS, SOCIAL_MEDIAS } from './isgNavbar.constants'
import { SocialMediaLinks } from '~/components/socialMediaLinks/socialMediaLinks'
import { TranslatedLink } from '~/components/translatedLink/translatedLink'
import {
  COMPANY_EMAIL,
  COMPANY_EMAIL_URL,
  COMPANY_PHONE_NUMBER_HOTLINE,
  COMPANY_PHONE_NUMBER_URL,
} from '~/constants'
import { useTranslation } from '~/context/LanguageContext'
import { useAuth } from '~/context/UserContext'

const IsgNavbar = (): JSX.Element => {
  const { locale, translate } = useTranslation()
  const [open, setOpen] = useState<boolean>(false)
  const { currentUser } = useAuth()

  useNavbarBackground()

  return (
    <nav id="navbar" className={`z-40`}>
      <>
        <div className={`${open ? 'bg-white' : 'bg-transparent'} container`}>
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 relative">
                <Logo />
              </div>
            </div>
            <ul className="hidden md:ml-6 md:flex xl:w-7/12 lg:w-2/3 md:w-3/4 justify-between items-center">
              <IsgNavItemsList navItems={NAV_ITEMS} />
              <IsgLanguageSelect />
              <Link href={COMPANY_PHONE_NUMBER_URL}>
                <a className={`focus:outline-none focus:opacity-80 hover:opacity-80 text-pink`}>
                  {COMPANY_PHONE_NUMBER_HOTLINE}
                </a>
              </Link>
              <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200" aria-hidden="true" />
              {currentUser && !currentUser?.isAnonymous ? (
                <UserProfile currentUser={currentUser} />
              ) : (
                <TranslatedLink key={'/auth'} pageKey={'/auth'} locale={locale}>
                  <span className="cursor-pointer flex items-center ">
                    <HiOutlineUserCircle className="w-6 h-6 mr-2 text-black-lightest font-normal" />
                    {translate(`my-account`)}
                  </span>
                </TranslatedLink>
              )}
            </ul>
            <div className="-mr-2 flex md:hidden">
              <IsgDisclosureButton open={open} onClick={() => setOpen(!open)} />
            </div>
          </div>
        </div>

        <div
          className={`pt-10 md:hidden navbar-collapse flex flex-col justify-around overflow-y-auto overflow-x-hidden pb-12 ${
            open ? 'flex bg-white' : 'hidden'
          }`}
        >
          <div className="navbar-collapse-container pb-10 flex flex-col justify-between">
            <ul className="px-2 text-2xl">
              <IsgNavItemsList
                customStyle="block py-6 text-center"
                navItems={NAV_ITEMS}
                setOpen={(open) => setOpen(open)}
                open={open}
              />
              <IsgLanguageSelect
                customStyle="block py-6 text-center"
                setOpen={(open) => setOpen(open)}
                open={open}
              />
              <div className="block py-6 text-center">
                {currentUser && !currentUser?.isAnonymous ? (
                  <UserProfile currentUser={currentUser} />
                ) : (
                  <TranslatedLink key={'/auth'} pageKey={'/auth'} locale={locale}>
                    <a
                      onClick={() => setOpen(false)}
                      onKeyDown={() => setOpen(false)}
                      role="button"
                      tabIndex={-1}
                      className="flex items-center justify-center"
                    >
                      <HiOutlineUserCircle className="w-8 h-8 mr-2 text-black-lightest font-normal" />
                      {translate(`my-account`)}
                    </a>
                  </TranslatedLink>
                )}
              </div>
              <div className="block py-6 text-center">
                <Link href={COMPANY_PHONE_NUMBER_URL}>
                  <a className="text-pink">{COMPANY_PHONE_NUMBER_HOTLINE}</a>
                </Link>
              </div>
              <div className="block py-6 text-center">
                <Link href={COMPANY_EMAIL_URL}>
                  <a>{COMPANY_EMAIL}</a>
                </Link>
              </div>
            </ul>
            <div className="w-full justify-between items-center flex pb-20 px-20">
              <SocialMediaLinks socialMedias={SOCIAL_MEDIAS} />
              <a href={COMPANY_PHONE_NUMBER_URL} aria-label="company-number">
                <img src="/images/phone-icon.svg" alt="phone-icon" width={24} height={24} />
              </a>
            </div>
          </div>
        </div>
      </>
    </nav>
  )
}

const UserProfile = ({ currentUser }) => {
  const { locale } = useTranslation()

  return currentUser && !currentUser?.isAnonymous ? (
    <a
      // href={`http://localhost:3001/${locale}/insurances`}
      href={`${process.env.NEXT_PUBLIC_CABINET_URL}/${locale}/insurances`}
      className="flex justify-center items-center"
    >
      <img
        className="h-8 w-8 rounded-full bg-gray-50"
        src={
          currentUser.photoURL ||
          `https://ui-avatars.com/api/?size=128&name=${
            currentUser?.displayName || currentUser?.email
          }`
        }
        alt=""
      />
      <span className="flex items-center">
        <span className="flex flex-col items-start">
          {currentUser?.email ? (
            <span className="ml-1 text-sm font-normal text-gray" aria-hidden="true">
              {currentUser?.email}
            </span>
          ) : (
            <></>
          )}
        </span>
      </span>
    </a>
  ) : (
    <></>
  )
}

export default IsgNavbar
