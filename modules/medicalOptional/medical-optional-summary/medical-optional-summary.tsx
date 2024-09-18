import { format } from 'date-fns'
import { useTranslation } from '~/context/LanguageContext'
import { isValidPhoneNumber } from '~/utils/isValidPhoneNumber'
import { normalizeDate } from '~/utils/normalizeDate'
import { MedicalOptionalFormValues } from '../types'

export const MedicalOptionalSummary = ({
  startDate,
  endDate,
  persons,
  includeAdditionalRisk,
  amount,
  companyName,
  price,
  insuranceValidity,
  email,
  phone,
  riskFactors,
  insuredDays,
  nationalityCode,
}: MedicalOptionalFormValues): JSX.Element => {
  const { translate } = useTranslation()

  return (
    <div className="bg-gray-lightest rounded-2xl	mb-8 text-left px-6 py-8 text-sm">
      <div>
        <div>
          <div className="mb-2 md:flex md:justify-between md:align-center">
            <p className="text-gray">{translate('covered-territory')}:</p>
            <p className="text-black-lightest md:text-right">{translate('MDA')}</p>
          </div>

          {nationalityCode && (
            <div className="mb-2 md:flex md:justify-between md:align-center">
              <p className="text-gray">{translate('nationality')}:</p>
              <p className="text-black-lightest">{translate(nationalityCode)}</p>
            </div>
          )}

          {startDate && endDate && (
            <div className="mb-2 md:flex md:justify-between md:align-center">
              <p className="text-gray">{translate('travel-period')}:</p>{' '}
              <p className="text-black-lightest">
                {format(normalizeDate(startDate) as Date, 'dd.MM.yyyy')} -{' '}
                {format(normalizeDate(endDate) as Date, 'dd.MM.yyyy')}
              </p>
            </div>
          )}

          {insuranceValidity && (
            <div className="mb-2 md:flex md:justify-between md:align-center">
              <p className="text-gray">{translate('insuredDays')}:</p>{' '}
              <p className="text-black-lightest">
                {insuredDays} {translate('days')}
              </p>
            </div>
          )}

          <div className="mb-2 md:flex md:justify-between md:align-center">
            <p className="text-gray">{translate('type-insurance')}:</p>
            <p className="text-black-lightest">
              {includeAdditionalRisk
                ? translate('type-insurance-optional-b')
                : translate('type-insurance-optional-a')}
            </p>
          </div>

          {riskFactors?.length ? (
            <div className="mb-2 md:flex md:justify-between md:align-center">
              <p className="text-gray">{translate('riskFactors')}:</p>
              <div className="flex flex-col md:items-end">
                {riskFactors.map((risk, index) => (
                  <p key={index} className="text-black-lightest">
                    {translate(risk)}
                  </p>
                ))}
              </div>
            </div>
          ) : (
            <></>
          )}

          <div className="mb-2 md:flex md:justify-between md:align-center">
            <p className="text-gray">{translate('amount')}:</p>{' '}
            <p className="text-black-lightest md:text-right">
              {amount}
              {' MDL'}
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
                <p className="text-gray">{translate('person')}:</p>
                <div className="flex flex-col md:items-end">
                  <p className="text-black-lightest" translate="no">
                    {person.name || person.fullName}, {person.idnp},
                  </p>
                  <p className="text-black-lightest" translate="no">
                    {person.passportNumber},{' '}
                    {format(normalizeDate(person.birthday) as Date, 'dd.MM.yyyy')}
                  </p>
                </div>
              </div>
            ))}
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

      <div className="pt-4 border-t border-gray-200">
        <div className="flex justify-between">
          <p className="text-gray">{translate('total')}</p>
          <div className="flex items-end">
            <p className="font-bold text-black-lightest mr-1">{price.toFixed(2)} MDL </p>
          </div>
        </div>
      </div>
    </div>
  )
}
