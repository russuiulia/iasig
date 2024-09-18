import { useTranslation } from '~/context/LanguageContext'
import { isValidPhoneNumber } from '~/utils/isValidPhoneNumber'
import { RoadTaxFormValues } from '../types'

export const RoadTaxSummary = ({
  idnp,
  certificateNumber,
  price,
  carModel,
  plateNumber,
  fullName,
  contractorType,
  localityName,
  region,
  email,
  phone,
}: RoadTaxFormValues): JSX.Element => {
  const { translate } = useTranslation()

  return (
    <div className="bg-gray-lightest rounded-2xl mb-8 text-left px-6 py-8 text-sm">
      <div>
        <div>
          {certificateNumber && (
            <div className="mb-2 md:flex md:justify-between md:align-center">
              <p className="text-gray">
                {`${translate('certificateNumber-summary')} (${translate('vehicle')})`}:
              </p>
              <p className="text-black-lightest md:text-right" translate="no">
                {certificateNumber} ({carModel} {plateNumber})
              </p>
            </div>
          )}

          {idnp && (
            <div className="mb-2 md:flex md:justify-between md:align-center">
              <p className="text-gray">{translate('idnx')}:</p>
              <p className="text-black-lightest md:text-right">
                {idnp} {`(${fullName})`}
              </p>
            </div>
          )}

          {contractorType && (
            <div className="mb-2 md:flex md:justify-between md:align-center">
              <p className="text-gray">{'Plătitor'}:</p>
              <p className="text-black-lightest md:text-right">{translate(contractorType)}</p>
            </div>
          )}

          {region && (
            <div className="mb-2 md:flex md:justify-between md:align-center">
              <p className="text-gray">{translate('Raion / Municipiu plătitorului')}:</p>
              <p className="text-black-lightest md:text-right" translate="no">
                {region}
              </p>
            </div>
          )}

          {localityName && (
            <div className="mb-2 md:flex md:justify-between md:align-center">
              <p className="text-gray">{'Localitatea plătitorului'}:</p>
              <p className="text-black-lightest md:text-right" translate="no">
                {localityName}
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
            <p className="font-bold text-black-lightest mr-1">{price.toFixed(2)} MDL </p>
          </div>
        </div>
      </div>
    </div>
  )
}
