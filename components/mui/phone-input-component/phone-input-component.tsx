import PhoneInput from 'react-phone-input-2'
import { Control, Controller, useFormContext } from 'react-hook-form'
import { useTranslation } from '~/context/LanguageContext'
import { isValidPhoneNumber } from '~/utils/isValidPhoneNumber'
import 'react-phone-input-2/lib/material.css'

export interface PhoneInputProps {
  phone: string
  control: Control
  errorMessage?: string
}

const regions = ['america', 'europe', 'asia', 'oceania', 'africa']
const allowedCountries = ['md', 'ro', 'fr', 'gb', 'de', 'ua']

export const PhoneInputComponent = ({
  phone,
  control,
  errorMessage,
}: PhoneInputProps): JSX.Element => {
  const { translate } = useTranslation()
  const { trigger } = useFormContext()

  return (
    <div>
      <div>
        <Controller
          name="phone"
          control={control}
          defaultValue={phone || '373'}
          render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => {
            return (
              <PhoneInput
                regions={regions}
                preferredCountries={allowedCountries}
                value={value}
                onChange={onChange}
                onBlur={() => {
                  trigger('phone')
                  onBlur()
                }}
                inputProps={{
                  autoComplete: 'tel-national',
                  name: 'phone',
                  required: true,
                }}
                placeholder="37369******"
                inputStyle={{
                  width: '100%',
                  padding: '16.5px 14px 16.5px 58px',
                  lineHeight: '23px',
                  height: '56px',
                }}
                specialLabel={translate('confirmation:phone')}
                inputClass={`w-full border rounded ${error ? 'border-red-500' : 'border-gray-300'}`}
              />
            )
          }}
          rules={{
            required: {
              value: true,
              message: translate('fieldRequired:error'),
            },
            validate: isValidPhoneNumber,
          }}
        />
      </div>
      {errorMessage && <p className="text-danger">{errorMessage}</p>}
    </div>
  )
}
