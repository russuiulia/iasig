import React, { useState } from 'react'
import Autocomplete from 'react-google-autocomplete'
import { useTranslation } from '~/context/LanguageContext'
import { EAST_BOUND, NORTH_BOUND, SOUTH_BOUND, WEST_BOUND } from '../isgMap/isgMap.constants'
import styles from './googleAutoComplete.module.scss'

export interface GoogleAutoCompleteProps {
  value: string
  onPlaceSelected: (event: any) => void
  onPlaceChange: (event: any) => void
}
export const GoogleAutoComplete = ({
  onPlaceSelected,
  value,
  onPlaceChange,
}: GoogleAutoCompleteProps): JSX.Element => {
  const { translate } = useTranslation()
  const [isValid, setIsValid] = useState(true)

  const validateValue = (): void => (!value ? setIsValid(false) : setIsValid(true))

  return (
    <div className="xl:w-2/5 md:w-3/5 w-full mx-auto mb-10">
      <label htmlFor="deliveryAddress">{translate('delivery-address')}</label>
      <Autocomplete
        id="deliveryAddress"
        name="address"
        placeholder={translate('enter-the-address')}
        required={true}
        className={styles.input}
        onPlaceSelected={onPlaceSelected}
        options={{
          types: ['address'],
          fields: ['formatted_address', 'name'],
          componentRestrictions: {
            country: 'md',
          },
          bounds: {
            north: NORTH_BOUND,
            south: SOUTH_BOUND,
            east: EAST_BOUND,
            west: WEST_BOUND,
          },
          strictBounds: true,
        }}
        value={value}
        onChange={onPlaceChange}
        onKeyUp={() => validateValue()}
        inputAutocompleteValue="off"
        autoComplete="off"
      />
      {!isValid && <p className="text-danger">{translate('fieldRequired:error')}</p>}
    </div>
  )
}
