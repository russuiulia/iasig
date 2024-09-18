/* eslint-disable @next/next/no-img-element */
import { ClickAwayListener, IconButton, InputAdornment, Tooltip } from '@mui/material'
import { Fragment, useState } from 'react'
import { AiFillQuestionCircle } from 'react-icons/ai'
import { TextInputController } from '~/components/mui/text-input-controller/text-input-controller'
import { useTranslation } from '~/context/LanguageContext'
import { InsuranceType } from '~/modules/shared/types/insurance'

export interface TooltipInputProps {
  name: string
  defaultValue: string
  rules: any
  errorText: string | undefined
  label: string
  handleBlur?: () => void
  handleChange?: any
  control: any
  id?: string
  type?: string
  insuranceType?: InsuranceType
  inputProps?: any
  displayNameInInput?: boolean
  autoComplete?: 'on' | 'off'
}

export const TooltipInput = ({
  name,
  defaultValue,
  rules,
  errorText,
  handleBlur,
  handleChange,
  label,
  control,
  id = '',
  type = 'text',
  insuranceType = InsuranceType.MEDICAL,
  inputProps = {},
  displayNameInInput = true,
  autoComplete = 'off',
}: TooltipInputProps): JSX.Element => {
  const [open, setOpen] = useState(false)
  const { translate } = useTranslation()

  const handleTooltipClose = () => {
    setOpen(false)
  }

  const handleTooltipOpen = () => {
    setOpen(true)
  }

  return (
    <TextInputController
      name={name}
      displayNameInInput={displayNameInInput}
      id={id}
      type={type}
      control={control}
      defaultValue={defaultValue}
      label={label}
      rules={rules}
      handleBlur={handleBlur}
      handleChange={handleChange}
      errorText={errorText}
      inputProps={inputProps}
      autoComplete={autoComplete}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <ClickAwayListener onClickAway={handleTooltipClose}>
              <Tooltip
                placement="top"
                title={
                  <Fragment>
                    <p>{translate(`${insuranceType}-${name}:tooltip`)}</p>
                  </Fragment>
                }
                onClose={handleTooltipClose}
                open={open}
                disableFocusListener
                disableHoverListener
                disableTouchListener
              >
                <IconButton onClick={handleTooltipOpen} tabIndex={-1}>
                  <AiFillQuestionCircle />
                </IconButton>
              </Tooltip>
            </ClickAwayListener>
          </InputAdornment>
        ),
      }}
    />
  )
}
