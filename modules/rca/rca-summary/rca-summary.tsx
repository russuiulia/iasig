import { format } from 'date-fns'
import { useTranslation } from '~/context/LanguageContext'
import { OwnershipRights } from '~/modules/shared/orderV2/types'
import { ContractorType } from '~/modules/shared/types/insurance'
import { isValidPhoneNumber } from '~/utils/isValidPhoneNumber'
import { normalizeDate } from '~/utils/normalizeDate'
import { RcaFormValues } from '../types'

export const RcaSummary = ({
  idnp,
  startDate,
  endDate,
  certificateNumber,
  ownership,
  price,
  carModel,
  plateNumber,
  companyName,
  contractorName,
  contractorType,
  email,
  phone,
  operatingMode,
  towingCertificateNumber,
  towingModel,
  towingPlateNumber,
  insuranceValidity,
  documentDate,
  documentNumber,
}: RcaFormValues): JSX.Element => {
  const { translate } = useTranslation()

  return (
    <div className="bg-gray-lightest rounded-2xl mb-8 text-left px-6 py-8 text-sm">
      <div>
        <div>
          {certificateNumber && (
            <div className="mb-2 md:flex md:justify-between md:align-center">
              <p className="text-gray">
                {`${translate('certificateNumber-summary')} (${translate(
                  towingCertificateNumber ? 'trailer' : 'vehicle'
                ).toLowerCase()})`}
                :
              </p>
              <p className="text-black-lightest md:text-right" translate="no">
                {certificateNumber} ({carModel} {plateNumber})
              </p>
            </div>
          )}

          {towingCertificateNumber && (
            <div className="mb-2 md:flex md:justify-between md:align-center">
              <p className="text-gray">
                {' '}
                {`${translate('certificateNumber-summary')} (${translate(
                  'vehicle'
                ).toLowerCase()})`}
                :
              </p>
              <p className="text-black-lightest md:text-right" translate="no">
                {towingCertificateNumber} ({towingModel} {towingPlateNumber})
              </p>
            </div>
          )}

          {startDate && endDate && (
            <>
              <div className="mb-2 md:flex md:justify-between md:align-center">
                <p className="text-gray">{translate('period')}:</p>
                <p className="text-black-lightest">
                  {`${format(normalizeDate(startDate) as Date, 'dd.MM.yyyy')} - ${format(
                    normalizeDate(endDate) as Date,
                    'dd.MM.yyyy'
                  )}  (${translate(`validity:${insuranceValidity || '360'}`)})`}
                </p>
              </div>
            </>
          )}

          {idnp && (
            <div className="mb-2 md:flex md:justify-between md:align-center">
              <p className="text-gray">{translate('insured')}:</p>
              <p className="text-black-lightest md:text-right">
                {idnp} {contractorType === ContractorType.COMPANY ? `(${contractorName})` : ''}
              </p>
            </div>
          )}

          {contractorType === ContractorType.COMPANY && operatingMode && (
            <div className="mb-2 md:flex md:justify-between md:align-center">
              <p className="text-gray">{translate('operatingMode:label')}:</p>
              <p className="text-black-lightest md:text-right">
                {translate(`operatingMode:${operatingMode}`)}
              </p>
            </div>
          )}

          <div className="mb-2 md:flex md:justify-between md:align-center">
            <p className="text-gray">{translate('drivers')}:</p>{' '}
            <p className="text-black-lightest">{translate('contractType:unlimited')}</p>
          </div>

          {ownership && (
            <div className="mb-2 md:flex md:justify-between md:align-center">
              <p className="text-gray">{translate(`ownership:label`)}:</p>
              <p className="text-black-lightest">{translate(`ownership:${ownership}`)}</p>
            </div>
          )}

          {[OwnershipRights.Lease, OwnershipRights.Leasing].includes(ownership) && (
            <>
              <div className="mb-2 md:flex md:justify-between md:align-center">
                <p className="text-gray">{translate(`document-number`)}:</p>
                <p className="text-black-lightest">{documentNumber}</p>
              </div>
              <div className="mb-2 md:flex md:justify-between md:align-center">
                <p className="text-gray">{translate(`driver:document-date`)}:</p>
                <p className="text-black-lightest">
                  {format(normalizeDate(documentDate) as Date, 'dd.MM.yyyy')}
                </p>
              </div>
            </>
          )}

          {companyName && (
            <div className="mb-2 md:flex md:justify-between md:align-center">
              <p className="text-gray">{translate(`insurance-company`)}:</p>
              <p className="text-black-lightest" translate="no">
                {translate(`company:${companyName?.toLowerCase?.()}`)}
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
            <p className="font-bold text-black-lightest mr-1">{price.toFixed(2)} MDL </p>
          </div>
        </div>
      </div>
    </div>
  )
}
