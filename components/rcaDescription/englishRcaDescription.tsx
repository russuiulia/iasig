import React from 'react'
import { useRcaContext } from '~/modules/rca/rca-context/rca-context'
import { RcaSteps } from '~/modules/rca/rca-context/rca-context.types'

const EnglishRcaDescription = (): JSX.Element => {
  const { activeStep } = useRcaContext()

  return activeStep === RcaSteps.InsuredDetails ? (
    <>
      <section>
        <h2 className="text-black-lightest text-lg font-medium mb-2">Coverage</h2>
        <p>
          MTPL insurance is a mandatory auto liability insurance valid in the territory of the
          Republic of Moldova. The insurance covers the payment of insurance compensation for
          damages caused as a result of vehicle accidents that occur on the territory of the
          Republic of Moldova. The insured risks include the damage suffered by third parties, such
          as bodily injury or death, property damage, or destruction.
        </p>
        <p className="mt-4">
          The maximum limits of compensation for damages caused by vehicles are:
        </p>
        <ul className="list-disc ml-10">
          <li>
            Up to <b>100 000 euros</b> for damage or destruction of property (compared to one
            million lei at present);
          </li>
          <li>
            Up to <b>100 000 euros</b> for each injured person in case of bodily harm or death, but
            not more than <b>500 000 euros</b>, regardless of the number of people injured in a road
            accident (compared to one million lei at present);
          </li>
          <li>
            Up to <b>15 000 lei</b> for damages claimed based on the amicable settlement procedure
            of the accident;
          </li>
          Up to <b>5 000 euros</b> for moral damages (only as a result of disability or death) for
          an injured person, but not more than <b>10 000 euros</b>, regardless of the number of
          injured persons.
          <li></li>
        </ul>
        <p className="mt-4 pb-10">
          The maximum compensation limits apply for each accident, regardless of the number of
          vehicles involved.
        </p>
      </section>
      <section>
        <h2 className="text-black-lightest text-lg font-medium mb-2">Cost</h2>
        <p>
          The cost of MTPL insurance in the Republic of Moldova varies depending on several factors,
          including the type of vehicle, the cylinder capacity/electric power, the insured person's
          status (legal/individual), the insured person's domicile, the insured person's driving
          history (Bonus/Malus), and the vehicle's intended use.
        </p>
        <p className="mt-4 pb-10">
          To obtain an exact price, please complete the form{' '}
          <a className="text-pink" href="#steps-menu">
            above
          </a>
          .
        </p>
      </section>
      <section>
        <h2 className="text-black-lightest text-lg font-medium mb-2">Claim process</h2>
        <ul className="list-decimal	ml-4 pb-10">
          <li>
            In the case of minor damages (estimated up to 15,000 MDL), you can opt for an amicable
            settlement. The amicable settlement is a simple option and can only be carried out when
            two vehicles are involved in an accident, and both have valid documents (MTPL insurance,
            technical inspection report).
          </li>
          <li>
            If you have opted for an amicable settlement, complete the form together with the other
            driver and make a copy each. You can download the form{' '}
            <a
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink"
              href={process.env.NEXT_PUBLIC_AMICABLE_SETTLEMENT}
            >
              here
            </a>
            .
          </li>
          <li>
            If an amicable settlement is not possible, request a police report and obtain a copy of
            it.
          </li>
          <li>
            Notify your insurance company immediately and provide them with all the necessary
            information and documents to start the claim process.
          </li>
          <li>Check and document all the damages and take photos if possible.</li>
        </ul>
      </section>
      <section>
        <h2 className="text-black-lightest text-lg font-medium mb-2">Exclusions</h2>
        <p className="pb-10">
          The insurance contract does not cover damages caused to the property of the insured person
          by auto liability, in cases where these damages are caused by a vehicle owned by the
          insured person, the part of the damage that exceeds the maximum compensation limits
          provided by law, damages caused by the loss or destruction of valuables, money, precious
          stones, objects made of precious metals and intellectual property, damages caused at the
          workplace through the use of machinery or equipment mounted on the vehicle, accidents that
          occur during the loading and unloading of goods, environmental pollution, accidents that
          occur during sports competitions and training, damages caused in situations where the
          insurer's liability has not started or has ended, as well as compensation for moral
          damages.
        </p>
      </section>
      <section className="border-b-gray-lightest">
        <h2 className="text-black-lightest text-lg font-medium mb-2">Renewal</h2>
        <p className="pb-40">
          To renew MTPL insurance in Moldova, simply complete the form{' '}
          <a className="text-pink" href="#steps-menu">
            above
          </a>
          , choose the insured period, make the payment, and receive the policy via email. It is
          important to request the extension of the insurance before the expiration date of the
          current contract; otherwise, you will be at risk of driving without valid insurance.
        </p>
      </section>
    </>
  ) : (
    <></>
  )
}

export default EnglishRcaDescription
