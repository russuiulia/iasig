import { useFormContext } from 'react-hook-form'
import { MdVignetteContact } from '../md-vignette-contact/md-vignette-contact'
import { MdVignetteSummary } from '../md-vignette-summary/md-vignette-summary'
import { MdVignetteFormValues } from '../types'

const MdVignetteConfirmation = (): JSX.Element => {
  const { getValues } = useFormContext<MdVignetteFormValues>()
  const values = getValues()

  return (
    <>
      <div className={`rounded-2xl xl:w-2/5 md:w-3/5 w-full mx-auto mb-10`}>
        <MdVignetteSummary {...values} />
      </div>
      <MdVignetteContact price={values.price} />
    </>
  )
}

export default MdVignetteConfirmation
