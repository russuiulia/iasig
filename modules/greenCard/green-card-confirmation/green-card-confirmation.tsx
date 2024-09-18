import { useFormContext } from 'react-hook-form'
import { GreenCardContact } from '../green-card-contact/green-card-contact'
import { GreenCardSummary } from '../green-card-summary/green-card-summary'
import { GreenCardFormValues } from '../types'

const GreenCardConfirmation = (): JSX.Element => {
  const { getValues } = useFormContext<GreenCardFormValues>()
  const values = getValues()

  return (
    <>
      <div className={`rounded-2xl xl:w-2/5 md:w-3/5 w-full mx-auto mb-10`}>
        <GreenCardSummary {...values} />
      </div>
      <GreenCardContact priceEUR={values.priceEUR} />
    </>
  )
}

export default GreenCardConfirmation
