import * as React from 'react'
import { Control, Controller } from 'react-hook-form'
import OutlinedInput from '@mui/material/OutlinedInput'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import ListItemText from '@mui/material/ListItemText'
import Select from '@mui/material/Select'
import Checkbox from '@mui/material/Checkbox'
import { useTranslation } from '~/context/LanguageContext'

interface SelectMultipleInputControllerProps {
  control: Control
  id: string
  name: string
  label: string
  items: string[]
}

export const SelectMultipleInputController = ({
  control,
  id,
  name,
  label,
  items,
}: SelectMultipleInputControllerProps): JSX.Element => {
  const { translate } = useTranslation()
  return (
    <>
      <Controller
        name={name}
        control={control}
        defaultValue={''}
        render={({ field: { value, onChange, onBlur, ref }, fieldState: { error } }) => {
          return (
            <FormControl fullWidth>
              <InputLabel id={id}>{label}</InputLabel>
              <Select
                labelId={id}
                multiple
                value={value}
                onChange={(e) => onChange(e.target.value)}
                input={<OutlinedInput label={label} />}
                renderValue={(selected) => selected.map((el) => translate(el)).join(', ')}
                inputRef={ref}
                autoComplete="off"
                error={!!error}
                onBlur={onBlur}
              >
                {items.map((item) => (
                  <MenuItem key={item} value={item}>
                    <Checkbox checked={value.indexOf(item) > -1} />
                    <ListItemText primary={translate(item)} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )
        }}
      />
    </>
  )
}
