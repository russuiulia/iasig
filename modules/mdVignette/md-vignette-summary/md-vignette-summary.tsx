import { format } from 'date-fns'
import { useTranslation } from '~/context/LanguageContext'
import { isValidPhoneNumber } from '~/utils/isValidPhoneNumber'
import { normalizeDate } from '~/utils/normalizeDate'
import { MdVignetteFormValues } from '../types'

export const MdVignetteSummary = ({
  plateNumber,
  email,
  phone,
  startDate,
  price,
  driverFullName,
  idnp,
  vehicleType,
  priceEUR,
  validity,
  country,
}: MdVignetteFormValues): JSX.Element => {
  const { translate } = useTranslation()

  return (
    <div className="bg-gray-lightest rounded-2xl mb-8 text-left px-6 py-8 text-sm">
      <div>
        <div>
          {vehicleType && (
            <div className="mb-2 md:flex md:justify-between md:align-center">
              <p className="text-gray">{translate('vehicleType')}:</p>
              <p className="text-black-lightest md:text-right">
                {translate(`vehicleType:${vehicleType}`)}
              </p>
            </div>
          )}

          {validity && (
            <div className="mb-2 md:flex md:justify-between md:align-center">
              <p className="text-gray">{translate('validity')}:</p>
              <p className="text-black-lightest md:text-right">
                {`${translate(validity.split('_')[0])} ${translate(validity.split('_')[1])}`}
              </p>
            </div>
          )}

          {startDate && (
            <div className="mb-2 md:flex md:justify-between md:align-center">
              <p className="text-gray">{translate('md-vignette-startDate')}:</p>
              <p className="text-black-lightest md:text-right" translate="no">
                {format(normalizeDate(startDate) as Date, 'dd.MM.yyyy')}
              </p>
            </div>
          )}

          {country && (
            <div className="mb-2 md:flex md:justify-between md:align-center">
              <p className="text-gray">{translate('country-registration')}:</p>
              <p className="text-black-lightest md:text-right">{`${country} - ${translate(
                country
              )}`}</p>
            </div>
          )}

          {plateNumber && (
            <div className="mb-2 md:flex md:justify-between md:align-center">
              <p className="text-gray">{translate('certificateNumber-summary')}:</p>
              <p className="text-black-lightest md:text-right" translate="no">
                {plateNumber}
              </p>
            </div>
          )}

          {idnp && (
            <div className="mb-2 md:flex md:justify-between md:align-center">
              <p className="text-gray">{translate('idnp-passport:label')}:</p>
              <p className="text-black-lightest md:text-right" translate="no">
                {idnp}
              </p>
            </div>
          )}

          {driverFullName && (
            <div className="mb-2 md:flex md:justify-between md:align-center">
              <p className="text-gray">{translate('driverFullName:label')}:</p>
              <p className="text-black-lightest md:text-right" translate="no">
                {driverFullName}
              </p>
            </div>
          )}

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
              {price.toFixed(2)} MDL <span className="font-normal">({priceEUR} EUR)</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
