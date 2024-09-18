/* eslint-disable @next/next/no-img-element */
import { ClickAwayListener, IconButton, InputAdornment, Tooltip } from '@mui/material'
import { Fragment, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { AiFillQuestionCircle } from 'react-icons/ai'
import { TextInputController } from '~/components/mui/text-input-controller/text-input-controller'
import { useTranslation } from '~/context/LanguageContext'
import { validateCertificateNumber } from '~/utils/validateCertificateNumber'

export interface CertificateNumberInputProps {
  defaultValue: string
  rules?: any
  label: string
  name: string
  maxLength?: number
  src?: string
  type?: string
  text?: string
}

export const CertificateNumberInput = ({
  defaultValue,
  label,
  name,
  rules = {
    validate: {
      validateNumber: validateCertificateNumber,
    },
  },
  maxLength = 9,
  src = '/images/certificate-number.jpg',
  type = 'tel',
  text = '',
}: CertificateNumberInputProps): JSX.Element => {
  const [open, setOpen] = useState(false)
  const { translate } = useTranslation()
  const {
    formState: { errors },
    control,
  } = useFormContext()

  const handleTooltipClose = () => {
    setOpen(false)
  }

  const handleTooltipOpen = () => {
    setOpen(true)
  }

  return (
    <TextInputController
      name={name}
      type={type}
      control={control}
      defaultValue={defaultValue}
      label={label}
      rules={rules}
      autoComplete="on"
      displayNameInInput={true}
      inputProps={{ maxLength }}
      errorText={
        (errors?.[name]?.type === 'validateNumber' && translate('certificateNumber:error')) ||
        errors?.[name]?.message
      }
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <ClickAwayListener onClickAway={handleTooltipClose}>
              <div>
                <Tooltip
                  placement="top"
                  title={
                    <Fragment>
                      {text ? (
                        <p>{text}</p>
                      ) : (
                        <img
                          src={src}
                          alt="black-dropdown"
                          className="rounded-md"
                          height={'233px'}
                          width={'350px'}
                        />
                      )}
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
              </div>
            </ClickAwayListener>
          </InputAdornment>
        ),
      }}
    />
  )
}
