import { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { useMedicalOptionalPreOrder } from '../hooks'
import { MedicalOptionalContact } from '../medical-optional-contact/medical-optional-contact'
import { useMedicalOptionalContext } from '../medical-optional-context/medical-optional-context'
import { MedicalOptionalSummary } from '../medical-optional-summary/medical-optional-summary'
import { MedicalOptionalFormValues } from '../types'

const MedicalOptionalConfirmation = (): JSX.Element => {
  const { getValues } = useFormContext<MedicalOptionalFormValues>()
  const values = getValues()
  const { preOrderId } = useMedicalOptionalContext()
  const { loadPreOrder } = useMedicalOptionalPreOrder()

  useEffect(() => {
    if (preOrderId) {
      loadPreOrder(preOrderId)
    }
  }, [preOrderId])

  return (
    <>
      <div className={`rounded-2xl xl:w-2/5 md:w-3/5 w-full mx-auto mb-10`}>
        <MedicalOptionalSummary {...values} />
      </div>
      <MedicalOptionalContact price={values.price} />
    </>
  )
}

export default MedicalOptionalConfirmation
