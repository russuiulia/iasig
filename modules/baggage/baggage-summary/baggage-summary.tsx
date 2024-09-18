import { format } from 'date-fns'
import { useTranslation } from '~/context/LanguageContext'
import { isValidPhoneNumber } from '~/utils/isValidPhoneNumber'
import { normalizeDate } from '~/utils/normalizeDate'
import { BaggageFormValues } from '../types'

export const BaggageSummary = ({
  price,
  phone,
  email,
  companyName,
  idnp,
  fullName,
  amount,
  flightNumbers,
  baggagePcs,
  departureDate,
  startDate,
}: BaggageFormValues): JSX.Element => {
  const { translate } = useTranslation()
  return (
    <div className="bg-gray-lightest rounded-2xl	mb-8 text-left px-6 py-8 text-sm">
      <div>
        <div>
          {baggagePcs && (
            <div className="mb-2 md:flex md:justify-between md:align-center">
              <p className="text-gray">{translate('baggagePcs')}:</p>
              <p className="text-black-lightest md:text-right" translate="no">
                {baggagePcs}
              </p>
            </div>
          )}
          {flightNumbers && (
            <div className="mb-2 md:flex md:justify-between md:align-center">
              <p className="text-gray">{translate('flightNumbers')}:</p>
              <p className="text-black-lightest md:text-right" translate="no">
                {flightNumbers.join(', ')}
              </p>
            </div>
          )}
          {(departureDate || startDate) && (
            <div className="mb-2 md:flex md:justify-between md:align-center">
              <p className="text-gray">{translate('departureDate:label')}:</p>
              <p className="text-black-lightest md:text-right" translate="no">
                {format(normalizeDate(departureDate || startDate) as Date, 'dd.MM.yyyy')}
              </p>
            </div>
          )}

          {fullName && (
            <div className="mb-2 md:flex md:justify-between md:align-center">
              <p className="text-gray">{translate('name-surname-contractor')}:</p>
              <p className="text-black-lightest md:text-right" translate="no">
                {fullName}
              </p>
            </div>
          )}

          {idnp && (
            <div className="mb-2 md:flex md:justify-between md:align-center">
              <p className="text-gray">{translate('personal-code-contractor')}:</p>
              <p className="text-black-lightest md:text-right">{idnp}</p>
            </div>
          )}

          {companyName && (
            <div className="mb-2 md:flex md:justify-between md:align-center">
              <p className="text-gray">{translate(`insurance-company`)}:</p>
              <p className="text-black-lightest" translate="no">
                {translate(`company:${companyName?.toLowerCase?.()}`)}
              </p>
            </div>
          )}

          {amount && (
            <div className="mb-2 md:flex md:justify-between md:align-center">
              <p className="text-gray">{translate('amount')}:</p>
              <p className="text-black-lightest md:text-right" translate="no">
                {amount.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} EUR
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

      <div className="pt-4 border-t border-gray-200">
        <div className="flex justify-between">
          <p className="text-gray">{translate('total')}</p>
          <div className="flex items-end">
            <p className="font-bold text-black-lightest mr-1">{price?.toFixed?.(2)} MDL </p>
          </div>
        </div>
      </div>
    </div>
  )
}
