import Autocomplete from '@mui/material/Autocomplete'
import Chip from '@mui/material/Chip'
import TextField from '@mui/material/TextField'
import { Controller } from 'react-hook-form'
import { useTranslation } from '~/context/LanguageContext'

export const TagsInput = ({ control, errorText, setValue, value }) => {
  const { translate } = useTranslation()

  const handleSelectionChange = (newValue) => setValue('flightNumbers', newValue)

  return (
    <div>
      <Controller
        name="flightNumbers"
        control={control}
        defaultValue={[]}
        render={({ field: { onBlur, ref }, fieldState: { error } }) => {
          return (
            <Autocomplete
              value={value}
              multiple
              id="tags-filled"
              options={[]}
              onChange={(_, newValue) => {
                handleSelectionChange?.(newValue)
              }}
              freeSolo
              onBlur={onBlur}
              renderTags={(value: readonly string[], getTagProps) =>
                value.map((option: string, index: number) => (
                  <Chip
                    variant="outlined"
                    label={option}
                    {...getTagProps({ index })}
                    key={option}
                  />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  label={translate('flightNumbers:label')}
                  inputRef={ref}
                  error={!!error}
                />
              )}
            />
          )
        }}
        rules={{
          required: {
            value: true,
            message: translate(`flightNumbers:required`),
          },
        }}
      />
      {errorText && <p className="text-danger">{errorText}</p>}
    </div>
  )
}
