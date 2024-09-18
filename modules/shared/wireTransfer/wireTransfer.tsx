/* eslint-disable @next/next/no-img-element */
import { useState } from 'react'

import styles from './wireTransfer.module.scss'
import { CopyToClipboardSectionButton } from '~/components/copyToClipboardSectionButton/copyToClipboardSectionButton'
import { useTranslation } from '~/context/LanguageContext'

export interface WireTransferProps {
  idno: string
  orderId: string
}
const wireTransferDetails = {
  '1021600002204': {
    Beneficiar: 'IASIG ONLINE SRL',
    IDNO: '1021600002204',
    IBAN: 'MD90AG000000022514177172',
  },
  '1024600043882': {
    Beneficiar: 'Broker de Asigurare-Reasigurare IASIG INSURANCE S.R.L.',
    IDNO: '1024600043882',
    IBAN: 'MD08AG000000022516095659',
  },
  '1016600027490': {
    Beneficiar: 'BROKER DE ASIGURARE BROKER-ASIST S.R.L.',
    IDNO: '1016600027490',
    IBAN: 'MD64PR002224182683001498',
  },
}
export const WireTransfer = ({ idno, orderId }: WireTransferProps): JSX.Element => {
  const { translate } = useTranslation()
  const [isCollapsed, setIsCollapsed] = useState(true)
  return (
    <div>
      <button
        className={`${
          styles.linkCard
        } text-left color sm:py-6 sm:px-4 py-3 px-2 sm:h-16 h-14 cursor-pointer rounded-t mt-2 ${
          isCollapsed ? 'mb-2 rounded' : ''
        }`}
        onClick={() => {
          setIsCollapsed((prevState) => !prevState)
        }}
      >
        <img
          src="/images/wire-transfer.svg"
          alt="visa-master-card"
          width={50}
          height={20}
          className="object-cover"
        />
        <span className="sm:ml-7 ml-2 font-medium sm:text-sm text-xs text-black-lightest">
          {translate('button:wire-transfer-text')}
        </span>
        <span
          className={`ml-auto ${
            !isCollapsed ? 'rotate-90' : ''
          } transition ease-in-out duration-300`}
        >
          <img src="/images/arrow.svg" alt="arrow" width={9} height={7} />
        </span>
      </button>
      {!isCollapsed && (
        <div
          className={`${styles.linkSection} text-left color mb-2 sm:py-6 sm:px-4 w-full py-3 px-2 text-xs`}
        >
          <CopyToClipboardSectionButton
            textToCopy={`${translate('button:wire-transfer-beneficiary')}: ${
              wireTransferDetails[idno].Beneficiar
            } \nIDNO: ${idno} \nIBAN: ${wireTransferDetails[idno].IBAN} \n${translate(
              'button:wire-transfer-destination'
            )}: ${orderId}`}
            section={{
              beneficiary: wireTransferDetails[idno].Beneficiar,
              idno: idno,
              iban: wireTransferDetails[idno].IBAN,
              orderId: orderId,
            }}
            id="wire-transfer"
          />
        </div>
      )}
    </div>
  )
}
