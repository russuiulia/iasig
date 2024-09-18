import { format } from 'date-fns'
import { useTranslation } from '~/context/LanguageContext'
import { isValidPhoneNumber } from '~/utils/isValidPhoneNumber'
import { normalizeDate } from '~/utils/normalizeDate'
import { MedicalFormValues } from '../types'

export const MedicalSummary = ({
  territories,
  startDate,
  endDate,
  tripPurpose,
  persons,
  includeCovidRisk,
  isMultipleType,
  amount,
  companyName,
  price,
  priceEUR,
  insuranceValidity,
  insuredDays,
  email,
  phone,
  contractor,
}: MedicalFormValues): JSX.Element => {
  const { translate } = useTranslation()

  const purpose = typeof tripPurpose === 'string' ? JSON.parse(tripPurpose) : tripPurpose

  return (
    <div className="bg-gray-lightest rounded-2xl	mb-8 text-left px-6 py-8 text-sm">
      <div>
        <div>
          {territories?.zoneKey?.length ? (
            <div className="mb-2 md:flex md:justify-between md:align-center">
              <p className="text-gray">{translate('insuredCountry')}:</p>
              <p className="text-black-lightest md:text-right">
                {Array.isArray(territories?.zoneKey)
                  ? territories?.zoneKey?.map((el) => translate(el)).join(',')
                  : translate(territories?.zoneKey)}
              </p>
            </div>
          ) : (
            <></>
          )}
          <div className="mb-2 md:flex md:justify-between md:align-center">
            <p className="text-gray">{translate('travel-type')}:</p>{' '}
            <p className="text-black-lightest">
              {isMultipleType ? `${translate(`travel-type:2`)}` : `${translate(`travel-type:1`)}`}
            </p>
          </div>

          {!isMultipleType && endDate && (
            <div className="mb-2 md:flex md:justify-between md:align-center">
              <p className="text-gray">{translate('travel-period')}:</p>{' '}
              <p className="text-black-lightest">
                {format(normalizeDate(startDate) as Date, 'dd.MM.yyyy')} -{' '}
                {format(normalizeDate(endDate) as Date, 'dd.MM.yyyy')}
              </p>
            </div>
          )}

          {isMultipleType && endDate && (
            <div className="mb-2 md:flex md:justify-between md:align-center">
              <p className="text-gray">{translate('travel-period')}:</p>{' '}
              <p className="text-black-lightest">
                {format(normalizeDate(startDate) as Date, 'dd.MM.yyyy')} -{' '}
                {format(normalizeDate(endDate) as Date, 'dd.MM.yyyy')}
              </p>
            </div>
          )}

          {isMultipleType && insuredDays && (
            <div className="mb-2 md:flex md:justify-between md:align-center">
              <p className="text-gray">{translate('insuredDays')}:</p>{' '}
              <p className="text-black-lightest">{insuredDays}</p>
            </div>
          )}

          {isMultipleType && insuranceValidity && (
            <div className="mb-2 md:flex md:justify-between md:align-center">
              <p className="text-gray">{translate('insuranceValidity')}:</p>{' '}
              <p className="text-black-lightest">
                {insuranceValidity}{' '}
                {insuranceValidity > '1' ? translate('months') : translate('month')}
              </p>
            </div>
          )}

          <div className="mb-2 md:flex md:justify-between md:align-center">
            <p className="text-gray">{translate('TripPurpose')}:</p>
            <p className="text-black-lightest">{translate(`${purpose.activities?.[0]}`)}</p>
          </div>

          {includeCovidRisk && (
            <div className="mb-2 md:flex md:justify-between md:align-center">
              <p className="text-gray">{translate('additional-risks')}:</p>
              <p className="text-black-lightest">Covid</p>
            </div>
          )}

          <div className="mb-2 md:flex md:justify-between md:align-center">
            <p className="text-gray">{translate('amount')}:</p>{' '}
            <p className="text-black-lightest md:text-right">
              {amount}
              {' EUR'}
            </p>
          </div>

          <div className="mb-2 md:flex md:justify-between md:align-center">
            <p className="text-gray">{translate('insurance-company')}:</p>
            <p className="text-black-lightest" translate="no">
              {translate(`company:${companyName?.toLowerCase?.()}`)}
            </p>
          </div>

          {persons.length &&
            persons.map((person, index) => (
              <div key={index} className="mb-2 md:flex md:justify-between md:align-center">
                <p className="text-gray">
                  {translate('person')} {index + 1}:
                </p>
                <div className="flex flex-col md:items-end">
                  <p className="text-black-lightest" translate="no">
                    {[person?.name || person.fullName, person.idnp]
                      .filter((el) => Boolean(el.trim()))
                      .join(', ')}
                  </p>
                  <p className="text-black-lightest" translate="no">
                    {[
                      (person?.passportSeries || '') + person?.passportNumber,
                      format(normalizeDate(person.birthday) as Date, 'dd.MM.yyyy'),
                    ]
                      .filter((el) => Boolean(el.trim()))
                      .join(', ')}
                  </p>
                </div>
              </div>
            ))}
          {contractor?.fullName && (
            <div className="mb-2 md:flex md:justify-between md:align-center">
              <p className="text-gray">{translate('policyHolder')}:</p>
              <p className="text-black-lightest md:text-right" translate="no">
                {contractor?.fullName?.toUpperCase?.()}
              </p>
            </div>
          )}
          {email && (
            <div className="mb-2 md:flex md:justify-between md:align-center">
              <p className="text-gray">{translate('email-summary')}:</p>
              <p className="text-black-lightest" translate="no">
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

      <div className="pt-4 border-t border-200">
        <div className="flex justify-between">
          <p className="text-gray">{translate('total')}</p>
          <div className="flex items-end">
            <p className="font-bold text-black-lightest mr-1">{price.toFixed(2)} MDL</p>
            {'(' + priceEUR.toFixed(2) + ' €' + ')'}
          </div>
        </div>
      </div>
    </div>
  )
}
