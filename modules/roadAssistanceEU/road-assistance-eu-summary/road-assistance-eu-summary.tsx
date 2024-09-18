import { format } from 'date-fns'

import { RoadAssistanceEUFormValues } from '../types'
import { useTranslation } from '~/context/LanguageContext'
import { isValidPhoneNumber } from '~/utils/isValidPhoneNumber'
import { normalizeDate } from '~/utils/normalizeDate'

export const RoadAssistanceEUSummary = ({
  certificateNumber,
  email,
  phone,
  price,
  carModel,
  plateNumber,
  priceRON,
  period,
  coverage,
  startDate,
  endDate,
}: RoadAssistanceEUFormValues): JSX.Element => {
  const { translate } = useTranslation()

  return (
    <div className="bg-gray-lightest rounded-2xl mb-8 text-left px-6 py-8 text-sm">
      <div>
        <div>
          {certificateNumber && (
            <div className="mb-2 md:flex md:justify-between md:align-center">
              <p className="text-gray">{translate('certificateNumber-summary')}:</p>
              <p className="text-black-lightest md:text-right" translate="no">
                {certificateNumber} ({carModel} {plateNumber})
              </p>
            </div>
          )}

          {period ? (
            <div className="mb-2 md:flex md:justify-between md:align-center">
              <p className="text-gray">{translate(`product:period`)}:</p>
              <p className="text-black-lightest" translate="no">
                {format(normalizeDate(startDate) as Date, 'dd.MM.yyyy')} -
                {format(normalizeDate(endDate) as Date, 'dd.MM.yyyy')}(
                {`${translate(period.split('_')[0])} ${translate(period.split('_')[1])}`})
              </p>
            </div>
          ) : null}

          {coverage ? (
            <div className="mb-2 md:flex md:justify-between md:align-center">
              <p className="text-gray">{translate('coverage:label')}:</p>
              <p className="text-black-lightest" translate="no">
                {translate(`coverage:${coverage}`)}
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
              {price.toFixed(2)} MDL <span className="font-normal">({priceRON} RON)</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
