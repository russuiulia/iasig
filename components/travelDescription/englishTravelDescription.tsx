import React from 'react'
import { useMedicalContext } from '~/modules/medical/medical-context/medical-context'
import { MedicalSteps } from '~/modules/medical/medical-context/medical-context.types'

const EnglishTravelDescription = (): JSX.Element => {
  const { activeStep } = useMedicalContext()

  return activeStep === MedicalSteps.TravelDetails ? (
    <>
      <section>
        <h2 className="text-black-lightest text-lg font-medium mb-2">Coverage</h2>
        <p>
          Travel insurance cover unforeseen and necessary expenses resulting from an acute illness
          or personal injury following an accident and death outside their home country. The policy
          includes emergency medical expenses, hospitalization, emergency surgery, emergency
          repatriation in the event of death, and other related expenses. Some insurance companies
          also cover trip cancellation or interruption and dental treatment. Insured amounts range
          from 5,000 EUR to 60,000 EUR depending on the travel destination. Insurance terms for
          several companies, including:
        </p>
        <ul className="list-disc text-pink list-inside">
          <li className="underline">
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={`${process.env.NEXT_PUBLIC_HOST}en/travel/grawe`}
            >
              Grawe
            </a>
          </li>
          <li className="underline">
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={`${process.env.NEXT_PUBLIC_HOST}en/travel/intact`}
            >
              Intact
            </a>
          </li>
          <li className="underline">
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={`${process.env.NEXT_PUBLIC_HOST}en/travel/donaris`}
            >
              Donaris
            </a>
          </li>
          <li className="underline">
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={`${process.env.NEXT_PUBLIC_HOST}en/travel/moldcargo`}
            >
              Moldcargo
            </a>
          </li>
          <li className="underline">
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={`${process.env.NEXT_PUBLIC_HOST}en/travel/transelit`}
            >
              Transelit
            </a>
          </li>
        </ul>{' '}
        <p className="pb-10">can be reviewed for all of the offers listed.</p>
      </section>
      <section>
        <h2 className="text-black-lightest text-lg font-medium mb-2">Cost</h2>
        <p>
          The cost of travel insurance for a single trip is determined on a per-day basis and varies
          depending on the insurance company, travel destination, insured amount, insured person age
          and additional risks. In contrast, multi-trip insurance, or multivisa, has a fixed price
          for a predetermined period. The prices for both single and multi-trip insurance are listed
          in EUR, and the user pays in MDL at the BNM rate.
        </p>
        <p className="mt-2 pb-10">
          To obtain the exact price and compare offers for your travel destination, simply fill out
          the form provided{' '}
          <a className="text-pink" href="#steps-menu">
            above
          </a>
          .
        </p>
      </section>
      <section>
        <h2 className="text-black-lightest text-lg font-medium mb-2">Exclusions</h2>
        <p>
          Travel insurance policy does not cover pre-existing medical conditions, high-risk
          activities (such as extreme sports), illegal activities, self-inflicted injuries, mental
          health conditions. Other exclusions include pregnancy-related expenses, natural disasters
          or epidemics, and non-emergency medical treatment. Every insurance company has a specific
          list of activities that aren’t covered. For a comprehensive list of exclusions for every
          company you can check here:
        </p>
        <ul className="list-disc text-pink list-inside pb-10">
          <li className="underline">
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={`${process.env.NEXT_PUBLIC_HOST}en/travel/grawe/#grawe-uninsured-risks`}
            >
              Grawe
            </a>
          </li>
          <li className="underline">
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={`${process.env.NEXT_PUBLIC_HOST}en/travel/intact/#intact-uninsured-risks`}
            >
              Intact
            </a>
          </li>
          <li className="underline">
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={`${process.env.NEXT_PUBLIC_HOST}en/travel/donaris/#donaris-uninsured-risks`}
            >
              Donaris
            </a>
          </li>
          <li className="underline">
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={`${process.env.NEXT_PUBLIC_HOST}en/travel/moldcargo/#moldcargo-uninsured-risks`}
            >
              Moldcargo
            </a>
          </li>
          <li className="underline">
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={`${process.env.NEXT_PUBLIC_HOST}en/travel/transelit/#transelit-uninsured-risks`}
            >
              Transelit
            </a>
          </li>
        </ul>
      </section>
      <section>
        <h2 className="text-black-lightest text-lg font-medium mb-2">Claim process</h2>
        <p className="pb-10">
          The insured must immediately contact the insurer's Assistance Company in case of an
          insured risk, and provide necessary information. The insurer organizes medical services
          and other necessary services according to the insurance contract. The insured should
          present their insurance policy to medical personnel and must declare in writing to the
          insurer about any expenses related to the insured risk. Relevant documents must be
          presented to the insurer within 30 calendar days, and the insurer completes investigations
          and determines the indemnity amount within a month. In the case of impossibility of
          ascertaining the circumstances, the insurer postpones the examination and notifies the
          reasons.
        </p>
      </section>
      <section className="border-b-gray-lightest">
        <h2 className="text-black-lightest text-lg font-medium mb-2">Customer service</h2>

        <ul className="list-inside list-decimal pb-40">
          <li>Contact the Assistance Company immediately according to the insurance policy.</li>
          <li>
            Notify the Assistance Company in Romanian, or English, providing the insured's name,
            policy number, a phone number where you can be contacted abroad, and details of the
            event.
          </li>
          <li>
            In case of hospitalization, the insured or the doctor must notify the Assistance Company
            within 48 hours, otherwise, the Company will not be able to take a decision to cover
            hospitalization expenses.
          </li>
          <li>
            If you have decided to bear the expenses independently, ask the doctor to provide you
            with all the documents confirming the diagnosis and hospitalization, in the original,
            signed, and stamped.
          </li>
          <li>
            If you have paid for the services independently, within 24 hours after payment, you have
            to inform the Assistance Company of the payment date and the amount of expenses. Keep
            all original receipts and invoices for any services received related to the insured
            case.
          </li>
          <li>
            Within 30 calendar days from the date of return from the trip, you must contact the
            insurance company to submit a claim for insurance compensation.
          </li>
          <li>
            In case of the insured's death as a result of the insured case, relatives or the trusted
            person must notify the Insurer within 48 hours.
          </li>
          <li>
            If you suffer from any chronic illnesses or other pathologies, make sure to bring all
            necessary medications during the trip.
          </li>
        </ul>
      </section>
    </>
  ) : (
    <></>
  )
}

export default EnglishTravelDescription
