import { Checkbox, FormControlLabel, FormGroup } from '@mui/material'
import { Control, Controller } from 'react-hook-form'

export interface CheckboxInputProps {
  name: string
  defaultValue: boolean
  control: Control
  label: string
  required?: boolean
  cssClass?: string
  handleChange?: () => void
  marginRight?: string
}

export const CheckboxInput = ({
  name,
  defaultValue,
  control,
  label,
  required = false,
  handleChange,
  cssClass = 'mb-6',
  marginRight = '0',
}: CheckboxInputProps): JSX.Element => {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      render={({ field: { value, onChange, ref } }) => {
        return (
          <FormGroup className={cssClass}>
            <FormControlLabel
              htmlFor={name}
              sx={{ alignItems: 'flex-start', marginRight }}
              control={
                <Checkbox
                  id={name}
                  size="small"
                  name={name}
                  required={required}
                  onChange={(_, value) => {
                    handleChange?.()
                    onChange(value)
                  }}
                  inputRef={ref}
                  className="mt-0.5 md:mt-0"
                  checked={value}
                  sx={{
                    color: '#B8C8D9',
                    borderWidth: '1px',
                    '&.Mui-checked': {
                      color: '#025FEA',
                      borderWidth: '1px',
                    },
                  }}
                />
              }
              label={label}
            />
          </FormGroup>
        )
      }}
    />
  )
}
