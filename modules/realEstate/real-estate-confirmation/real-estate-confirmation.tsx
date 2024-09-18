import { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { RealEstateContact } from '../real-estate-contact/real-estate-contact'
import { useRealEstateContext } from '../real-estate-context/real-estate-context'
import { RealEstateSummary } from '../real-estate-summary/real-estate-summary'
import { useRealEstatePreOrder } from '../hooks'
import { RealEstateFormValues } from '../types'

const RealEstateConfirmation = (): JSX.Element => {
  const { getValues } = useFormContext<RealEstateFormValues>()
  const values = getValues()
  const { preOrderId } = useRealEstateContext()
  const { loadPreOrder } = useRealEstatePreOrder()

  useEffect(() => {
    if (preOrderId) {
      loadPreOrder(preOrderId)
    }
  }, [preOrderId])

  return (
    <>
      <div className={`rounded-2xl xl:w-2/5 md:w-3/5 w-full mx-auto mb-10`}>
        <RealEstateSummary {...values} />
      </div>
      <RealEstateContact price={values.price} />
    </>
  )
}

export default RealEstateConfirmation
