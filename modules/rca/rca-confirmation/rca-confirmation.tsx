import { useFormContext } from 'react-hook-form'
import { RcaContact } from '../rca-contact/rca-contact'
import { RcaSummary } from '../rca-summary/rca-summary'
import { RcaFormValues } from '../types'

const RcaConfirmation = (): JSX.Element => {
  const { getValues } = useFormContext<RcaFormValues>()
  const values = getValues()

  return (
    <>
      <div className={`rounded-2xl xl:w-2/5 md:w-3/5 w-full mx-auto mb-10`}>
        <RcaSummary {...values} />
      </div>
      <RcaContact price={values.price} />
    </>
  )
}

export default RcaConfirmation
