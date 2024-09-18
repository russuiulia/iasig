import { Control, Controller } from 'react-hook-form'
import { Checkbox, FormControlLabel, FormGroup } from '@mui/material'

import { useTranslation } from '~/context/LanguageContext'

export interface CheckboxInputProps {
  name: string
  defaultValue: boolean
  control: Control
  required?: boolean
  cssClass?: string
  handleChange?: () => void
  marginRight?: string
}

export const InvoiceCheckbox = ({
  name,
  defaultValue,
  control,
  required = false,
  handleChange,
  cssClass = 'py-3',
  marginRight = '0',
}: CheckboxInputProps): JSX.Element => {
  const { translate } = useTranslation()
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
              label={
                <>
                  <span className="flex flex-col flex-1">
                    <div className="flex justify-between">
                      <div className="text-sm flex items-center">
                        <img
                          src="/images/e-invoice-logo.png"
                          alt="e-invoice-logo"
                          width="70"
                          className="object-contain mr-2"
                        />
                        {translate('invoice-checkbox')}
                      </div>
                    </div>
                  </span>
                </>
              }
            />
          </FormGroup>
        )
      }}
    />
  )
}
