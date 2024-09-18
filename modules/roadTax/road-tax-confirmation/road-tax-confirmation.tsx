import { useFormContext } from 'react-hook-form'
import { RoadTaxContact } from '../road-tax-contact/road-tax-contact'
import { RoadTaxSummary } from '../road-tax-summary/road-tax-summary'
import { RoadTaxFormValues } from '../types'

const RoadTaxConfirmation = (): JSX.Element => {
  const { getValues } = useFormContext<RoadTaxFormValues>()
  const values = getValues()

  return (
    <>
      <div className={`rounded-2xl xl:w-2/5 md:w-3/5 w-full mx-auto mb-10`}>
        <RoadTaxSummary {...values} />
      </div>
      <RoadTaxContact price={values.price} />
    </>
  )
}

export default RoadTaxConfirmation
