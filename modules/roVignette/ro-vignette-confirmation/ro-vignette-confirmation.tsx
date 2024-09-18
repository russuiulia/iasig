import { useFormContext } from 'react-hook-form'
import { RoVignetteContact } from '../ro-vignette-contact/ro-vignette-contact'
import { RoVignetteSummary } from '../ro-vignette-summary/ro-vignette-summary'
import { RoVignetteFormValues } from '../types'

const RoVignetteConfirmation = (): JSX.Element => {
  const { getValues } = useFormContext<RoVignetteFormValues>()
  const values = getValues()

  return (
    <>
      <div className={`rounded-2xl xl:w-2/5 md:w-3/5 w-full mx-auto mb-10`}>
        <RoVignetteSummary {...values} />
      </div>
      <RoVignetteContact price={values.price} />
    </>
  )
}

export default RoVignetteConfirmation
