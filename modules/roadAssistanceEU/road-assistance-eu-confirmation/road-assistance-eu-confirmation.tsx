import { useFormContext } from 'react-hook-form'

import { RoadAssistanceEUContact } from '../road-assistance-eu-contact/road-assistance-eu-contact'
import { RoadAssistanceEUSummary } from '../road-assistance-eu-summary/road-assistance-eu-summary'
import { RoadAssistanceEUFormValues } from '../types'

const RoadAssistanceEUConfirmation = (): JSX.Element => {
  const { getValues } = useFormContext<RoadAssistanceEUFormValues>()
  const values = getValues()

  return (
    <>
      <div className={`rounded-2xl xl:w-2/5 md:w-3/5 w-full mx-auto mb-10`}>
        <RoadAssistanceEUSummary {...values} />
      </div>
      <RoadAssistanceEUContact price={values.price} />
    </>
  )
}

export default RoadAssistanceEUConfirmation
