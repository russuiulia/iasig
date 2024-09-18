import { useState, useEffect } from 'react'
import ClipboardJS from 'clipboard'
import { GoCopy } from 'react-icons/go'
import { styled } from '@mui/material/styles'
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip'

import { useTranslation } from '~/context/LanguageContext'

export const CopyToClipboardSectionButton = ({ textToCopy, section, id = '' }) => {
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
    <code>
      <BootstrapTooltip
        title={translate('copied')}
        disableHoverListener
        open={isCopied}
        placement="bottom"
        className="pt-4 pl-8"
      >
        <button
          className={`btn-clipboard-${id} block mr-8 ml-auto`}
          data-clipboard-text={textToCopy}
        >
          <GoCopy className="ml-2 h-5 w-5 absolute flex items-end" aria-hidden="true" />
        </button>
      </BootstrapTooltip>
      <div className=" items-center w-full">
        <p className="mr-2">
          {translate('button:wire-transfer-beneficiary')}: {section.beneficiary}
        </p>
      </div>
      <div className=" items-center w-full">
        <p className="mr-2">IDNO: {section.idno}</p>
      </div>
      <div className=" items-center w-full">
        <p className="mr-2">IBAN: {section.iban}</p>
      </div>
      <div className=" items-center w-full">
        <p className="mr-2">
          {translate('button:wire-transfer-destination')}: {section.orderId}
        </p>
      </div>
    </code>
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
