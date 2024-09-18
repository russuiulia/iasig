import * as React from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormLabel from '@mui/material/FormLabel'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'

import { useTranslation } from '~/context/LanguageContext'

const IsgRadio = (props) => {
  return (
    <Radio
      sx={{
        '&:hover': {
          bgcolor: 'transparent',
        },
        '& .MuiSvgIcon-root': {
          fontSize: 16,
        },
      }}
      disableRipple
      {...props}
    />
  )
}

export const ZoneRadio = ({ options, label, name = 'zone' }) => {
  const {
    control,
    formState: { errors },
  } = useFormContext()

  const { translate } = useTranslation()

  return (
    <div>
      <Controller
        name={name}
        control={control}
        defaultValue=""
        rules={{
          required: {
            value: true,
            message: translate(`${name}:required`),
          },
        }}
        render={({ field: { value, onChange, ref } }) => {
          return (
            <>
              <FormControl component="fieldset" fullWidth>
                <RadioGroup onChange={onChange} aria-label={name} name={name} value={value}>
                  <FormLabel
                    component="legend"
                    sx={{
                      color: '#111439 !important',
                      fontSize: '14px !important',
                      lineHeight: '24px !important',
                    }}
                    className="text-black-lightest text-sm leading-6"
                  >
                    {label}
                  </FormLabel>
                  {options.map((value) => (
                    <FormControlLabel
                      sx={{
                        alignItems: 'center !important',
                        padding: '10px 8px',
                        border: '1px solid #B8C8D9',
                        margin: '8px 0px 0px 0px',
                        borderRadius: '4px',
                      }}
                      key={value}
                      value={value}
                      control={<IsgRadio />}
                      label={translate(`${name}:${value}`)}
                      inputRef={ref}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
              <p className="text-danger">{errors?.[name]?.message}</p>
            </>
          )
        }}
      />
    </div>
  )
}
