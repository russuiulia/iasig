/* eslint-disable @next/next/no-img-element */
import React, { useEffect } from 'react'
import { HiOutlineTicket } from 'react-icons/hi'
import { RadioGroup } from '@headlessui/react'
import { CheckCircleIcon } from '@heroicons/react/20/solid'

import { InsuranceType } from '../types/insurance'
import { useTranslation } from '~/context/LanguageContext'
import { classNames } from '~/utils/classNames'

export type Offer = {
  priceMDL: number
  priceRON: number
  period: string
}

export type Props = {
  allOffers: Offer[]
  coverage: string
  onChange: (value: Offer[]) => void
}

export const OffersCard: React.FC<Props> = ({ allOffers, onChange, coverage }) => {
  const [state, setState] = React.useState({})
  const { translate } = useTranslation()

  useEffect(() => {
    const selectedValue = Object.entries(state)
      .filter(([, value]) => value)
      .map(([, value]) => {
        return allOffers.find((product) => product.period === value)
      }) as Offer[]

    onChange?.(selectedValue || [])
  }, [state])

  if (!allOffers.length) {
    return null
  }

  return (
    <div className="">
      <div className="mt-6">
        <div>
          <div className="border-gray-200">
            <RadioGroup
              value={state[InsuranceType.ROAD_SIDE_ASSISTANCE_EU] || ''}
              onChange={(value) => {
                if (state[InsuranceType.ROAD_SIDE_ASSISTANCE_EU] === value) {
                  setState({ ...state, [InsuranceType.ROAD_SIDE_ASSISTANCE_EU]: null })
                } else {
                  setState({ ...state, [InsuranceType.ROAD_SIDE_ASSISTANCE_EU]: value })
                }
              }}
            >
              <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                {!allOffers.length ? (
                  <div className="text-gray-400">{translate('no-available-products')}</div>
                ) : null}
                {allOffers.map((addon) => (
                  <RadioGroup.Option
                    key={addon.period}
                    value={addon.period}
                    onClick={() => {
                      if (state[InsuranceType.ROAD_SIDE_ASSISTANCE_EU] === addon.period) {
                        setState({ ...state, [InsuranceType.ROAD_SIDE_ASSISTANCE_EU]: null })
                      } else {
                        setState({
                          ...state,
                          [InsuranceType.ROAD_SIDE_ASSISTANCE_EU]: addon.period,
                        })
                      }
                    }}
                    className={({ checked }) =>
                      classNames(
                        checked ? 'border-transparent ring-2 ring-indigo-500' : 'border-gray-300',
                        'relative flex cursor-pointer rounded-lg border bg-white py-4 px-6 shadow-sm focus:outline-none'
                      )
                    }
                  >
                    {({ checked, active }) => (
                      <>
                        <span className="flex flex-col flex-1">
                          <div className="flex justify-between">
                            <div className="text-sm flex items-center pb-2">
                              <HiOutlineTicket className="w-3 h-3 mr-1" />
                              {translate(`road-assistance-${coverage}`)}
                            </div>
                            {checked ? (
                              <CheckCircleIcon
                                className="h-5 w-5 text-indigo-600"
                                aria-hidden="true"
                              />
                            ) : null}
                          </div>
                          <span className="flex flex-row md:flex-col justify-between">
                            <div>
                              <RadioGroup.Label
                                as="span"
                                className="block text-sm font-medium text-gray-900"
                              >
                                {`${translate(addon.period.split('_')[0])} ${translate(
                                  addon.period.split('_')[1]
                                )}`}
                              </RadioGroup.Label>
                              <RadioGroup.Description
                                as="span"
                                className="mt-1 flex items-center text-xs text-gray-500"
                              >
                                A-Autoturisme
                              </RadioGroup.Description>
                            </div>
                            <RadioGroup.Description
                              as="div"
                              className="mt-0 md:mt-6 text-sm font-medium text-gray-900 flex flex-col md:flex-row items-start md:items-center"
                            >
                              <div className="font-bold">{addon.priceMDL} MDL</div>
                              <div className="text-xs opacity-80 ml-0 md:ml-1">
                                ({addon.priceRON} RON)
                              </div>
                            </RadioGroup.Description>
                          </span>
                        </span>
                        <span
                          className={classNames(
                            active ? 'border' : 'border-none',
                            checked ? 'border-indigo-500' : 'border-transparent',
                            'pointer-events-none absolute -inset-px rounded-lg'
                          )}
                          aria-hidden="true"
                        />
                      </>
                    )}
                  </RadioGroup.Option>
                ))}
              </div>
            </RadioGroup>
          </div>
        </div>
      </div>
    </div>
  )
}
