import { addDays, format } from 'date-fns'
import { useEffect, useState } from 'react'
import { Currency } from '~/context/ForexContext'
import { useTranslation } from '~/context/LanguageContext'
import { ContractorType } from '~/modules/shared/types/insurance'
import { isValidPhoneNumber } from '~/utils/isValidPhoneNumber'

import { OwnershipRights } from '~/modules/shared/orderV2/types'
import { normalizeDate } from '~/utils/normalizeDate'
import { AdditionalProduct } from '../../shared/addons'
import { GreenCardFormValues } from '../types'

const PriceDisplay = ({ addon }: { addon: AdditionalProduct }) => {
  const currencyMap = {
    EUR: '€',
  }

  const { currency, priceMDL, price, priceRON } = addon

  let originalPrice = 0
  let mdlPrice = 0

  if (currency === Currency.RON) {
    if (priceRON) {
      originalPrice = priceRON
      mdlPrice = price
    } else {
      originalPrice = price
      mdlPrice = priceMDL
    }
  } else {
    mdlPrice = price
  }

  return (
    <span>
      {mdlPrice?.toFixed(2)} MDL
      {currency !== Currency.MDL ? ` (${originalPrice} ${currencyMap[currency] || currency})` : ``}
    </span>
  )
}

export const PeriodDisplay = ({ fromDate, days }: { fromDate: Date; days: number }) => {
  const { translate } = useTranslation()

  const [fromDateLabel, setFromDateLabel] = useState<string | null>(null)
  const [toDateLabel, setToDateLabel] = useState<string | null>(null)

  useEffect(() => {
    if (!fromDate) return
    setFromDateLabel(format(fromDate, 'dd.MM.yyyy'))
    setToDateLabel(format(addDays(fromDate, days - 1), 'dd.MM.yyyy'))
  }, [fromDate, days])

  return (
    <span>
      {fromDateLabel ? <time dateTime={fromDateLabel}>{fromDateLabel}</time> : null}
      {toDateLabel ? <time dateTime={toDateLabel}> - {toDateLabel}</time> : null}
      <span>{` (${days} ${translate(days === 1 ? 'day' : 'days')})`}</span>
    </span>
  )
}

export const GreenCardSummary = ({
  zone,
  startDate,
  endDate,
  insuranceValidity,
  certificateNumber,
  ownership,
  idnp,
  price,
  insurancePrice,
  priceEUR,
  carModel,
  plateNumber,
  contractorName,
  contractorType,
  phone,
  email,
  companyName,
  towingCertificateNumber,
  towingModel,
  towingPlateNumber,
  addons,
  documentNumber,
  documentDate,
}: GreenCardFormValues): JSX.Element => {
  const { translate } = useTranslation()

  return (
    <div className="bg-gray-lightest rounded-2xl mb-2 text-left px-6 py-8 text-sm">
      <div>
        <div>
          {certificateNumber && carModel && (
            <div className="mb-2 md:flex md:justify-between md:align-center">
              <p className="text-gray">
                {' '}
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
          {idnp && (
            <div className="mb-2 md:flex md:justify-between md:align-center">
              <p className="text-gray">{translate('insured')}:</p>
              <p className="text-black-lightest md:text-right">
                {idnp} {contractorType === ContractorType.COMPANY ? `(${contractorName})` : ''}
              </p>
            </div>
          )}
          {ownership && (
            <div className="mb-2 md:flex md:justify-between md:align-center">
              <p className="text-gray">{translate('ownership:label')}:</p>
              <p className="text-black-lightest md:text-right">
                {translate(`ownership:${ownership}`)}
              </p>
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

          {zone && (
            <div className="mb-2 md:flex md:justify-between md:align-center">
              <p className="text-gray">{translate('insuredCountry')}:</p>
              <p className="text-black-lightest md:text-right">{translate(`zone:${zone}`)}</p>
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
          <div className="flex justify-between">
            <p className="text-gray">{`${translate('price:insurance')}:`}</p>
            <div className="flex items-end text-black-lightest">
              <p className="mr-1">{insurancePrice || price.toFixed(2)} MDL</p>
              {'(' + priceEUR.toFixed(2) + ' €' + ')'}
            </div>
          </div>
        </div>
      </div>
      {addons?.map((addon) => (
        <div
          key={`${addon.addonType}-${addon.externalServiceId}`}
          className="mt-2 pt-2 border-t border-gray-200"
        >
          <div className="mb-2 md:flex md:justify-between md:align-center">
            <p className="text-gray">
              {translate(`product:${addon.addonCategoryName || 'other'}`)}:
            </p>
            <p className="text-black-lightest" translate="no">
              {translate(addon.regionName as any) || addon.name}
            </p>
          </div>
          {addon.periodDays ? (
            <div className="mb-2 md:flex md:justify-between md:align-center">
              <p className="text-gray">{translate(`product:period`)}:</p>
              <p className="text-black-lightest" translate="no">
                <PeriodDisplay
                  fromDate={normalizeDate(addon?.startDate) as Date}
                  days={addon.periodDays}
                />
              </p>
            </div>
          ) : null}
          {addon.description ? (
            <div className="mb-2 md:flex md:justify-between md:align-center">
              <p className="text-gray">{translate(`description`)}:</p>
              <p className="text-black-lightest" translate="no">
                {addon.description}
              </p>
            </div>
          ) : null}
          <div className="mb-2 md:flex md:justify-between md:align-center">
            <p className="text-gray">{translate(`price`)}:</p>
            <p className="text-black-lightest" translate="no">
              <PriceDisplay addon={addon} />
            </p>
          </div>
        </div>
      ))}
      <div className="border-t border-gray-200 pt-2 mt-2">
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
        <div className="flex justify-between">
          <p className="text-gray">{translate('total')}</p>
          <div className="flex items-end">
            <p className="font-bold text-black-lightest mr-1">{price.toFixed(2)} MDL</p>
          </div>
        </div>
      </div>
    </div>
  )
}
