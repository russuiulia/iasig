/* eslint-disable @next/next/no-img-element */
import { useTranslation } from '~/context/LanguageContext';
import { COMPANY_PHONE_NUMBER_URL } from '~/constants';

export const NotFoundCard = (): JSX.Element => {
  const { locale, translate } = useTranslation();

  return (
    <div className="grid justify-center">
      <img
        src="/images/not-found-order.svg"
        alt="not-found"
        width={249}
        height={202}
        className="mx-auto"
      />
      <h3 className="my-8 text-center">{translate('not-found-order')}</h3>
      <a
        href={locale === 'ro' ? '/#insurances' : `/${locale}/#insurances`}
        className="inline-flex mb-12 justify-center md:px-8 px-4 md:text-xl  h-14 rounded-full items-center h-10 py-4 text-white bg-pink rounded-lg focus:shadow-outline hover:bg-pink-300"
      >
        <span className="mr-2">{translate('button:new-order')}</span>
        <img
          src="/images/white-arrow.svg"
          alt="white-arrow"
          width={24}
          height={24}
        />
      </a>
      <div>
        <span className="text-gray-dark">
          {translate('not-found-order-text')}
          <a
            href={COMPANY_PHONE_NUMBER_URL}
            aria-label="company-number"
            className="text-pink"
          >
            {translate('contact-us-link')}
          </a>
        </span>
      </div>
    </div>
  );
};
