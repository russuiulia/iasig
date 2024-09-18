import { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { BaggageContact } from '../baggage-contact/baggage-contact'
import { useBaggageContext } from '../baggage-context/baggage-context'
import { BaggageSummary } from '../baggage-summary/baggage-summary'
import { useBaggagePreOrder } from '../hooks'
import { BaggageFormValues } from '../types'

const BaggageConfirmation = (): JSX.Element => {
  const { getValues } = useFormContext<BaggageFormValues>()
  const values = getValues()
  const { preOrderId } = useBaggageContext()
  const { loadPreOrder } = useBaggagePreOrder()

  useEffect(() => {
    if (preOrderId) {
      loadPreOrder(preOrderId)
    }
  }, [preOrderId])

  return (
    <>
      <div className={`rounded-2xl xl:w-2/5 md:w-3/5 w-full mx-auto mb-10`}>
        <BaggageSummary {...values} />
      </div>
      <BaggageContact priceEUR={values.priceEUR} />
    </>
  )
}

export default BaggageConfirmation
