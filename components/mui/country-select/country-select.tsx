import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import { Controller, useFormContext } from 'react-hook-form'
import { useTranslation } from '~/context/LanguageContext'
import { COUNTRIES } from './country-select.const'

export const CountrySelect = ({ control, errorMessage, setValue }) => {
  const { translate } = useTranslation()
  const { watch } = useFormContext()
  const selectedOptions = watch('country')

  const handleSelectionChange = (newValue) => {
    setValue('country', newValue ?? null)
  }

  return (
    <div>
      <Controller
        name="country"
        control={control}
        defaultValue={selectedOptions}
        render={({ field: { onChange, onBlur, value, ref }, fieldState: { error } }) => (
          <Autocomplete
            onChange={(_, newValue) => {
              handleSelectionChange(newValue)
              onChange(newValue)
            }}
            value={value}
            onBlur={onBlur}
            options={COUNTRIES}
            getOptionLabel={(option) => (option ? `${option} - ${translate(option)}` : '')}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label={translate('country:label')}
                fullWidth
                inputRef={ref}
                error={!!error}
                helperText={error ? errorMessage : null}
              />
            )}
            isOptionEqualToValue={(option, value) => option === value}
          />
        )}
        rules={{
          required: {
            value: true,
            message: translate(`country:required`),
          },
        }}
      />
    </div>
  )
}
