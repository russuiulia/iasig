import { useState, useEffect } from 'react'
import { GoCopy } from 'react-icons/go'
import { styled } from '@mui/material/styles'
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip'
import ClipboardJS from 'clipboard'
import { useTranslation } from '~/context/LanguageContext'

export const CopyToClipboardButton = ({ textToCopy, id = '' }) => {
  const { translate } = useTranslation()
  const [isCopied, setIsCopied] = useState(false)

  useEffect(() => {
    const clipboard = new ClipboardJS(`.btn-clipboard-${id}`, {
      text: () => textToCopy,
    })

    clipboard.on('success', function (e) {
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
      e.clearSelection()
    })

    return () => {
      clipboard.destroy()
    }
  }, [textToCopy])

  return (
    <div className="flex items-center">
      {textToCopy}
      <BootstrapTooltip
        title={translate('copied')}
        disableHoverListener
        open={isCopied}
        placement="bottom"
      >
        <button className={`btn-clipboard-${id} flex  pr-2`} data-clipboard-text={textToCopy}>
          <GoCopy className="ml-2 h-5 w-5" aria-hidden="true" />
        </button>
      </BootstrapTooltip>
    </div>
  )
}

const BootstrapTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.common.black,
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.black,
  },
}))
