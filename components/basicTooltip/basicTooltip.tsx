import { ClickAwayListener, Tooltip } from '@mui/material'
import { useState } from 'react'

export const BasicTooltip = ({ title, children }) => {
  const [open, setOpen] = useState(false)

  const handleClose = () => {
    setOpen(false)
  }

  const handleOpen = () => {
    setOpen(true)
  }

  return (
    <ClickAwayListener onClickAway={handleClose}>
      <div>
        <Tooltip
          placement="top"
          title={title}
          PopperProps={{
            disablePortal: true,
          }}
          onClose={handleClose}
          open={open}
          disableFocusListener
          disableHoverListener
          disableTouchListener
        >
          <button onClick={handleOpen} type="button">
            {children}
          </button>
        </Tooltip>
      </div>
    </ClickAwayListener>
  )
}
