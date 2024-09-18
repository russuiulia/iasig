import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import { Controller, useFormContext } from 'react-hook-form'
import { useTranslation } from '~/context/LanguageContext'
import { getAllLocalitiesOptions } from './locality-select.const'

export const LocalitySelect = ({ control, errorMessage, setValue }) => {
  const { translate } = useTranslation()
  const { watch } = useFormContext()
  const selectedOptions = watch('locality')

  const localityOptionsWithGroup = getAllLocalitiesOptions().reduce((acc: any, region: any) => {
    const localitiesWithGroup = region.value.map((locality) => ({
      ...locality,
      group: region.name,
      key: locality.localityId,
    }))
    return [...acc, ...localitiesWithGroup]
  }, []) as any

  const handleSelectionChange = (newValue) => {
    setValue('locality', newValue ?? null)
  }

  return (
    <div>
      <Controller
        name="locality"
        control={control}
        defaultValue={selectedOptions}
        render={({ field: { onChange, onBlur, value, ref }, fieldState: { error } }) => (
          <Autocomplete
            onChange={(_, newValue) => {
              handleSelectionChange(newValue)
              onChange(newValue)
            }}
            renderOption={(props, option) => (
              <li {...props} key={`${option.group}-${option.localityId}`}>
                {option.name}
              </li>
            )}
            value={value}
            onBlur={onBlur}
            options={localityOptionsWithGroup}
            getOptionLabel={(option) => option.name || ''}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label={translate('locality:label')}
                fullWidth
                inputRef={ref}
                error={!!error}
                helperText={error ? errorMessage : null}
              />
            )}
            groupBy={(option) => option.group}
            isOptionEqualToValue={(option, value) => option?.localityId === value?.localityId}
          />
        )}
        rules={{
          required: {
            value: true,
            message: translate(`locality:required`),
          },
        }}
      />
    </div>
  )
}
