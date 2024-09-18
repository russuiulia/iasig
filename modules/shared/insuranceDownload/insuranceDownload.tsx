/* eslint-disable @next/next/no-img-element */
import { classNames } from '../../../utils/classNames'
import { useTranslation } from '~/context/LanguageContext'
import { DocumentTypes, InsuranceType } from '~/modules/shared/types/insurance'
import { DownloadFileURL } from '~/services/interfaces/order'

export interface InsuranceDownloadProps {
  documents: DownloadFileURL[]
  insuranceType: InsuranceType
  noGap?: boolean
}

export const InsuranceDownload = ({
  documents,
  insuranceType,
  noGap = false,
}: InsuranceDownloadProps): JSX.Element => {
  const { locale, translate } = useTranslation()
  const passes = [DocumentTypes.wallet_pass, DocumentTypes.google_pass]

  const passesDocuments = documents.filter((doc) => doc && passes.includes(doc.name)) || []

  const baseDocuments = documents.filter((doc) => doc && !passes.includes(doc.name)) || []

  const isPolicy = (docName: string): boolean => docName === 'policy' || docName === 'documents'

  const getDocumentIcon = (docName: string) =>
    isPolicy(docName) ? '/images/policy.svg' : `/images/${docName}.svg`

  return (
    <>
      <div
        className={`grid md:flex md:justify-center md:gap-4 gap-1 mb-8 lg:w-8/12 w-full mx-auto`}
      >
        {baseDocuments.map((doc) => {
          const docName = doc.addonName
            ? `${translate(doc.addonType || '')} ${doc.addonName}`
            : translate(`document:${doc.name}`)
          return (
            [DocumentTypes.documents, DocumentTypes.policy, DocumentTypes.invoice].includes(
              doc.name
            ) && (
              <div key={doc.url}>
                <a href={doc.url} rel="noreferrer" target="_blank">
                  <div
                    className={`py-5 lg:px-6 px-4 border border-gray-lightest rounded flex items-center md:justify-center justify-start`}
                  >
                    <img src={getDocumentIcon(doc.name)} alt="policy" width={16} height={16} />
                    <span className="ml-2 mr-3 text-black-lightest">{docName}</span>
                    <span className="md:ml-0 ml-auto">
                      <img src="/images/download-icon.svg" alt={doc.name} width={20} height={20} />
                    </span>
                  </div>
                </a>
              </div>
            )
          )
        })}
      </div>
      <div className={classNames('flex justify-center gap-4', noGap ? '' : 'my-8')}>
        {insuranceType !== InsuranceType.GREEN_CARD &&
          passesDocuments.map((doc) =>
            doc.name === DocumentTypes.wallet_pass ? (
              <div className="h-10" key={doc.name}>
                <a href={doc.url} download="pkpass" className="contents">
                  <img
                    src={`/images/${locale}-add-to-wallet.svg`}
                    alt={doc.name}
                    height={40}
                    className="h-full object-contain"
                  />
                </a>
              </div>
            ) : (
              <div className="h-10" key={doc.name}>
                <a href={doc.url} target="_blank" rel="noreferrer" className="contents">
                  <img
                    src={`/images/${locale}-google-add-to-wallet.svg`}
                    alt={doc.name}
                    height={40}
                    className="h-full object-contain"
                  />
                </a>
              </div>
            )
          )}
      </div>
    </>
  )
}
