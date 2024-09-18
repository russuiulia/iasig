import { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { useMedicalPreOrder } from '../hooks'
import { MedicalContractor } from '../medical-contractor/medical-contractor'
import { useMedicalContext } from '../medical-context/medical-context'
import { MedicalSummary } from '../medical-summary/medical-summary'
import { MedicalFormValues } from '../types'

const MedicalConfirmation = (): JSX.Element => {
  const { getValues } = useFormContext<MedicalFormValues>()
  const values = getValues()
  const { preOrderId } = useMedicalContext()
  const { loadPreOrder } = useMedicalPreOrder()

  useEffect(() => {
    if (preOrderId) {
      loadPreOrder(preOrderId)
    }
  }, [preOrderId])

  return (
    <>
      <div className={`rounded-2xl xl:w-2/5 md:w-3/5 w-full mx-auto mb-10`}>
        <MedicalSummary {...values} />
      </div>
      <MedicalContractor priceEUR={values.priceEUR} />
    </>
  )
}

export default MedicalConfirmation
