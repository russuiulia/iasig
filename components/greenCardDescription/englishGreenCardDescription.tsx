import React, { useState } from 'react'
import { IoMdCalendar, IoMdCar, IoMdArrowDown, IoMdArrowForward } from 'react-icons/io'

import { BasicTooltip } from '../basicTooltip/basicTooltip'
import { ALL_PRICES, CATEGORIES, ZONES } from '~/constants'
import { useTranslation } from '~/context/LanguageContext'
import { useGreenCardContext } from '~/modules/greenCard/green-card-context/green-card-context'
import { GreenCardSteps } from '~/modules/greenCard/green-card-context/green-card-context.types'
import { GreenCardValues } from '~/modules/greenCard/green-card-validity/green-card-validity.constants'

const EnglishGreenCardDescription = (): JSX.Element => {
  const { translate } = useTranslation()
  const [zone, setZone] = useState('CA')
  const { activeStep } = useGreenCardContext()

  return activeStep === GreenCardSteps.InsuranceDetails ? (
    <>
      <section>
        <h2 className="text-black-lightest text-lg font-medium mb-2">Coverage</h2>
        <p>
          The Green Card is a mandatory insurance for external motor vehicle liability. The purpose
          of the insurance is to provide compensation for damages resulting from motor vehicle
          accidents that occur outside the country caused by vehicles registered in the Republic of
          Moldova. The insured risks include damages suffered by third parties, such as bodily
          injury or death, damage or destruction of property.
        </p>
        <p className="mt-2 pb-10">
          The insured amount is determined by the National Bureaus of Motor Insurers in the
          countries where the accident occurred, in accordance with the law on mandatory motor
          vehicle liability insurance in force at the time of the accident.
        </p>
      </section>
      <section>
        <h2 className="text-black-lightest text-lg font-medium mb-2">Territories covered</h2>
        <p>
          The Green Card system currently covers 46 countries represented by national insurance
          bureaus, categorized into 2 zones:
        </p>
        <ul className="list-disc ml-10 pb-10">
          <li>Zone 1: Ukraine</li>
          <li>
            Zone 3: All member countries (Austria, Albania, Andorra, Azerbaijan, Belgium, Bulgaria,
            Bosnia and Herzegovina, Switzerland, Cyprus, Czech Republic, Germany, Denmark, Spain,
            Estonia, France, Finland, Liechtenstein, Greece, Hungary, Croatia, Italy, Iran, Ireland,
            Iceland, Luxembourg, Lithuania, Latvia, Malta, Morocco, North Macedonia, Montenegro,
            Norway, Netherlands, Portugal, Poland, Romania, Sweden, Slovakia, Slovenia, Serbia,
            Tunisia, Turkey, Ukraine, and the United Kingdom)
          </li>
        </ul>
      </section>
      <section>
        <h2 className="text-black-lightest text-lg font-medium mb-2">Cost</h2>
        <p>
          The insurance premium is regulated by BNM and is established in EUR, payment is made in
          Lei at the BNM exchange rate on the day of payment. The price of the Green Card insurance
          policy varies depending on the vehicle category and destination, according to the table
          below. For trailers, a separate Green Card is issued, and the price is 10% of the
          calculated value for the vehicle that is towing the trailer.
        </p>
        <ul className="flex flex-row list-none border-b-0 pl-0 mb-4" role="tablist">
          {ZONES.map((value) => (
            <li
              className={`flex-1 border-b-2 ${
                zone === value
                  ? 'border-b-black-lightest text-black-lightest'
                  : 'border-b-gray-lightest'
              } lg:text-base text-xxs`}
              role="presentation"
              key={value}
            >
              <button
                className="mx-auto block lg:py-3 py-1 hover:opacity-80 focus:opacity-80"
                role="tab"
                onClick={() => setZone(value)}
              >
                {translate(`zone:${value}`, 'greenCard')}
              </button>
            </li>
          ))}
        </ul>

        <div className="pb-10">
          {ZONES.map((value) => (
            <div className="tab-content text-black-lightest" id="tabs-tabContent" key={value}>
              <div
                className={`tab-pane fade overflow-auto ${
                  zone === value ? 'block transition duration-75' : 'hidden'
                }`}
                id={`tabs-${value}`}
                role="tabpanel"
              >
                <table className="border text-center w-full table-auto">
                  <thead className="border-b">
                    <tr className="bg-gray-lightest">
                      <th
                        scope="col"
                        className="lg:text-base text-xs font-medium lg:p-2 p-1 border-r"
                      >
                        <div className="flex items-center justify-center">
                          <IoMdCalendar />
                          <IoMdArrowDown className="md:mr-1" /> / <IoMdCar className="md:ml-1" />
                          <IoMdArrowForward />
                        </div>
                      </th>
                      <th
                        scope="col"
                        className="lg:text-base text-xxs font-medium text-center lg:p-2 p-1 border-r"
                      >
                        <BasicTooltip title={translate('vehicle:A', 'greenCard')}>
                          <img
                            src="/images/car-up-to-9-seats.svg"
                            alt="car up to 9 seats"
                            width="30px"
                            height="15px"
                            className="mx-auto"
                          />
                        </BasicTooltip>
                      </th>
                      <th
                        scope="col"
                        className="lg:text-base text-xxs font-medium text-center lg:p-2 p-1 border-r"
                      >
                        <BasicTooltip title={translate('vehicle:C1', 'greenCard')}>
                          <img
                            src="/images/truck-up-to-3-t.svg"
                            alt="truck up to 3 t"
                            width="30px"
                            height="15px"
                            className="mx-auto"
                          />
                        </BasicTooltip>
                      </th>
                      <th
                        scope="col"
                        className="lg:text-base text-xxs font-medium text-center lg:p-2 p-1 border-r"
                      >
                        <BasicTooltip title={translate('vehicle:C2', 'greenCard')}>
                          <img
                            src="/images/truck-above-3-t.svg"
                            alt="truck above 3 t"
                            width="30px"
                            height="15px"
                            className="mx-auto"
                          />
                        </BasicTooltip>
                      </th>
                      <th
                        scope="col"
                        className="lg:text-base text-xxs font-medium text-center lg:p-2 p-1 border-r"
                      >
                        <BasicTooltip title={translate('vehicle:E1', 'greenCard')}>
                          <img
                            src="/images/van-up-to-17-seats.svg"
                            alt="van up to 17 seats"
                            width="30px"
                            height="15px"
                            className="mx-auto"
                          />
                        </BasicTooltip>
                      </th>
                      <th
                        scope="col"
                        className="lg:text-base text-xxs font-medium text-center lg:p-2 p-1 border-r"
                      >
                        <BasicTooltip title={translate('vehicle:E2', 'greenCard')}>
                          <img
                            src="/images/bus-above-17-seats.svg"
                            alt="bus above 17 seats"
                            width="30px"
                            height="15px"
                            className="mx-auto"
                          />
                        </BasicTooltip>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {GreenCardValues.map((value, index) => (
                      <tr className="border-b" key={value}>
                        <td className="lg:p-2 p-1 whitespace-nowrap md:text-base text-xxs text-black-lightest border-r">
                          {translate(`validity:${value}`)}
                        </td>
                        {CATEGORIES.map((category) => (
                          <td
                            className="lg:p-2 p-1 whitespace-nowrap md:text-base text-xxs text-black-lightest border-r"
                            key={category}
                          >
                            € {ALL_PRICES[zone][index][value][category].toFixed(2)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section>
        <h2 className="text-black-lightest text-lg font-medium mb-2">Eligibility</h2>
        <p className="pb-10">
          Insurance companies in the Republic of Moldova conclude Green Card insurance contracts
          exclusively for vehicles registered in the Republic of Moldova. To be able to conclude the
          contract, it is necessary to have a permanent registration certificate.
        </p>
      </section>
      <section>
        <h2 className="text-black-lightest text-lg font-medium mb-2">Claim process</h2>
        <p className="pb-10">
          The evaluation of damages and the payment of compensation for external motor vehicle
          liability insurance are made by the National Green Card Bureaus or their correspondents,
          in accordance with the legislation in force and established procedures. In case the
          National Bureaus can only pay compensation through a legal process, the Insurer will
          provide instructions to the insured and pay the damages provided by the court decision.
          The reimbursement of compensation and expenses paid to third parties is made by the
          Insurer in the requested currency.
        </p>
        <p className="pb-10">
          For further assistance, check the attached insurance policy for the contact details of our
          partner company, which specializes in international claims adjustment and support in
          damage recovery. They help our clients simplify and speed up the claims process.
        </p>
      </section>
      <section className="border-b-gray-lightest">
        <h2 className="text-black-lightest text-lg font-medium mb-2">Cancelation</h2>
        <p>
          The contract can be modified at any time during the period of validity or until the entry
          into force and must be in writing depending on the insured period. The insurance contract
          may be terminated by mutual agreement in writing or by court decision. Termination of the
          contract implies the cessation of protection and the reimbursement of insurance premiums,
          except in cases where the insurer has already made compensation payments or has received
          an accident notice.
        </p>
        <p className="mt-2">
          *In the case of insurance policies issued for a short period of time, such as 15 days or 1
          month, no partial or full refunds of the insurance premium will be granted if the policy
          has entered into force.
        </p>
        <p className="mt-2  pb-40">
          **In the case of any contract that can be terminated, the insurer may retain a 20%
          management fee.
        </p>
      </section>
    </>
  ) : (
    <></>
  )
}

export default EnglishGreenCardDescription
