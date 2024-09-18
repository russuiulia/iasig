import { Control } from 'react-hook-form'
import { SelectInputController } from '~/components/mui/select-input/select-input'
import { IsgModal } from '~/components/shared/isgModal/isgModal'
import { useTranslation } from '~/context/LanguageContext'
import { TRIP_PURPOSE } from './medical-trip-purpose.constants'

export interface TripPurposeLabelProps {
  control: Control
  errorMessage: string
}

export const TripPurposeLabel = ({ control, errorMessage }: TripPurposeLabelProps): JSX.Element => {
  const { translate } = useTranslation()

  return (
    <div>
      <SelectInputController
        id="trip-purpose"
        name="tripPurpose"
        label={translate('TripPurpose')}
        control={control}
        items={[
          <option aria-label="None" key={'none'} value="" />,
          ...TRIP_PURPOSE.map((value) => (
            <option key={value} value={`{"activities":["${value}"],"name":"${translate(value)}"}`}>
              {translate(`${value}`)}
            </option>
          )),
        ]}
        errorMessage={errorMessage}
      />
      <IsgModal />
    </div>
  )
}
