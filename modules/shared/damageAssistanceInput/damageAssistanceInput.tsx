/* eslint-disable @next/next/no-img-element */
import React, { useState } from 'react'
import { AiFillQuestionCircle } from 'react-icons/ai'
import { RadioGroup } from '@headlessui/react'
import { CheckCircleIcon } from '@heroicons/react/20/solid'
import { ClickAwayListener, IconButton, Tooltip } from '@mui/material'

import { useTranslation } from '~/context/LanguageContext'

export const DamageAssistanceInput = (): JSX.Element => {
  const { translate } = useTranslation()
  const [open, setOpen] = useState(false)

  const handleTooltipClose = () => {
    setOpen(false)
  }

  const handleTooltipOpen = () => {
    setOpen(true)
  }

  return (
    <div className="border-gray-200">
      <RadioGroup value="damage">
        <div className="mt-4">
          <RadioGroup.Option
            disabled
            value="damage"
            className="items-center border-gray-300 relative flex cursor-pointer rounded-lg border bg-white py-2 pl-4 pr-1 shadow-sm focus:outline-none opacity-80 pointer-events-none"
          >
            <CheckCircleIcon className="h-4 w-4 text-indigo-600" aria-hidden="true" />
            <>
              <span className="flex flex-col flex-1">
                <div className="flex justify-between">
                  <div className="text-sm flex items-center">
                    <img
                      src="/images/all-state-assistance-logo.svg"
                      alt="all-state-assistance"
                      width="35"
                      height="35"
                      className="object-contain mr-3 ml-2"
                    />
                    {translate('damage-assistance')}
                  </div>
                </div>
              </span>
              <ClickAwayListener onClickAway={handleTooltipClose}>
                <Tooltip
                  id="damage-assistance"
                  className="pointer-events-auto"
                  placement="top"
                  title={translate('damage-assistance:tooltip')}
                  onClose={handleTooltipClose}
                  open={open}
                  disableFocusListener
                  disableHoverListener
                  disableTouchListener
                >
                  <IconButton onClick={handleTooltipOpen} tabIndex={-1}>
                    <AiFillQuestionCircle fill="#B8C8D9" />
                  </IconButton>
                </Tooltip>
              </ClickAwayListener>
            </>
          </RadioGroup.Option>
        </div>
      </RadioGroup>
    </div>
  )
}
