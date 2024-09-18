import { useTranslation } from '~/context/LanguageContext';
import { PeriodDisplay } from '~/modules/greenCard/green-card-summary/green-card-summary';
import { isValidPhoneNumber } from '~/utils/isValidPhoneNumber';
import { normalizeDate } from '~/utils/normalizeDate';
import { RoVignetteFormValues } from '../types';

export const RoVignetteSummary = ({
  certificateNumber,
  email,
  phone,
  startDate,
  price,
  carModel,
  carPlateNumber,
  periodDays,
  description,
  priceRON,
}: RoVignetteFormValues): JSX.Element => {
  const { translate } = useTranslation();

  return (
    <div className="bg-gray-lightest rounded-2xl mb-8 text-left px-6 py-8 text-sm">
      <div>
        <div>
          {certificateNumber && (
            <div className="mb-2 md:flex md:justify-between md:align-center">
              <p className="text-gray">
                {translate('certificateNumber-summary')}:
              </p>
              <p className="text-black-lightest md:text-right" translate="no">
                {certificateNumber} ({carModel} {carPlateNumber})
              </p>
            </div>
          )}

          {periodDays ? (
            <div className="mb-2 md:flex md:justify-between md:align-center">
              <p className="text-gray">{translate(`product:period`)}:</p>
              <p className="text-black-lightest" translate="no">
                <PeriodDisplay
                  fromDate={normalizeDate(startDate) as Date}
                  days={periodDays}
                />
              </p>
            </div>
          ) : null}

          {description ? (
            <div className="mb-2 md:flex md:justify-between md:align-center">
              <p className="text-gray">{translate(`description`)}:</p>
              <p className="text-black-lightest" translate="no">
                {description}
              </p>
            </div>
          ) : null}

          {email && (
            <div className="mb-2 md:flex md:justify-between md:align-center">
              <p className="text-gray">{translate('email-summary')}:</p>
              <p className="text-black-lightest" translate="no">
                {' '}
                {email}
              </p>
            </div>
          )}
          {phone && isValidPhoneNumber(phone) && (
            <div className="mb-2 md:flex md:justify-between md:align-center">
              <p className="text-gray">{translate(`phone`)}:</p>
              <p className="text-black-lightest">{phone}</p>
            </div>
          )}
        </div>
      </div>

      <div className="pt-4 border-t border-gray-200">
        <div className="flex justify-between">
          <p className="text-gray">{translate('total')}</p>
          <div className="flex items-end">
            <p className="font-bold text-black-lightest mr-1">
              {price.toFixed(2)} MDL{' '}
              <span className="font-normal">({priceRON} RON)</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
