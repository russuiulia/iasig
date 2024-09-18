import { format } from 'date-fns'
import { useTranslation } from '~/context/LanguageContext'
import { isValidPhoneNumber } from '~/utils/isValidPhoneNumber'
import { normalizeDate } from '~/utils/normalizeDate'
import { BeneficiaryCode, InsuredValuesType } from '../real-estate-form/real-estate-form.constants'
import { RealEstateFormValues } from '../types'

export const RealEstateSummary = ({
  cadastralCode,
  realEstateType,
  startDate,
  endDate,
  insuranceValidity,
  price,
  phone,
  email,
  companyName,
  idnp,
  beneficiary,
  beneficiaryName,
  insuredValue,
  fullName,
  name,
  insuredDays,
  amount,
  marketValue,
  replacementCost,
  identitySeries,
  contractorAddress,
}: RealEstateFormValues): JSX.Element => {
  const { translate } = useTranslation()

  return (
    <div className="bg-gray-lightest rounded-2xl	mb-8 text-left px-6 py-8 text-sm">
      <div>
        <div>
          {realEstateType && (
            <div className="mb-2 md:flex md:justify-between md:align-center">
              <p className="text-gray">{translate('realEstateType')}:</p>
              <p className="text-black-lightest md:text-right" translate="no">
                {translate(realEstateType)}
              </p>
            </div>
          )}
          {cadastralCode && (
            <div className="mb-2 md:flex md:justify-between md:align-center">
              <p className="text-gray">{translate('cadastralCode')}:</p>
              <p className="text-black-lightest md:text-right" translate="no">
                {cadastralCode}
              </p>
            </div>
          )}

          {insuredValue && (
            <>
              <div className="mb-2 md:flex md:justify-between md:align-center">
                <p className="text-gray">{translate('insuredValue:label')}:</p>
                <p className="text-black-lightest md:text-right" translate="no">
                  {translate(`insuredValue:${insuredValue}`)}
                </p>
              </div>
              <div className="mb-2 md:flex md:justify-between md:align-center">
                <p className="text-gray">{translate(`insuredValue:${insuredValue}`)}:</p>
                <p className="text-black-lightest md:text-right" translate="no">
                  {`${(insuredValue === InsuredValuesType.MARKET_VALUE
                    ? marketValue
                    : replacementCost
                  )
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} MDL`}
                </p>
              </div>
            </>
          )}

          {startDate && endDate && (
            <div className="mb-2 md:flex md:justify-between md:align-center">
              <p className="text-gray">{translate('period')}:</p>
              <p className="text-black-lightest md:text-right">
                {`${format(normalizeDate(startDate) as Date, 'dd.MM.yyyy')} - ${format(
                  normalizeDate(endDate) as Date,
                  'dd.MM.yyyy'
                )}  (${translate(`validity:${insuranceValidity}`)})`}
              </p>
            </div>
          )}

          {insuredDays && (
            <div className="mb-2 md:flex md:justify-between md:align-center">
              <p className="text-gray">{translate('insuredDays')}:</p>{' '}
              <p className="text-black-lightest">
                {insuredDays} {translate('days')}
              </p>
            </div>
          )}

          {(name || fullName) && (
            <div className="mb-2 md:flex md:justify-between md:align-center">
              <p className="text-gray">{translate('name-surname-contractor')}:</p>
              <p className="text-black-lightest md:text-right" translate="no">
                {name || fullName}
              </p>
            </div>
          )}

          {idnp && (
            <div className="mb-2 md:flex md:justify-between md:align-center">
              <p className="text-gray">{translate('personal-code-contractor')}:</p>
              <p className="text-black-lightest md:text-right">{idnp}</p>
            </div>
          )}

          {identitySeries && (
            <div className="mb-2 md:flex md:justify-between md:align-center">
              <p className="text-gray">{translate('identity-series')}:</p>
              <p className="text-black-lightest md:text-right" translate="no">
                {identitySeries}
              </p>
            </div>
          )}

          {contractorAddress && (
            <div className="mb-2 md:flex md:justify-between md:align-center">
              <p className="text-gray">{translate('contractor-address')}:</p>
              <p className="text-black-lightest md:text-right" translate="no">
                {contractorAddress}
              </p>
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
                {amount.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} MDL
              </p>
            </div>
          )}

          {beneficiary && (
            <div className="mb-2 md:flex md:justify-between md:align-center">
              <p className="text-gray">{translate('beneficiary:label')}:</p>
              <p className="text-black-lightest md:text-right" translate="no">
                {beneficiary === BeneficiaryCode.OTHER
                  ? beneficiaryName
                  : translate(`beneficiary:${beneficiary}`)}
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
