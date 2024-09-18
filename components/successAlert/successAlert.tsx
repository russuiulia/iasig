import { MdCheckCircle } from 'react-icons/md'
import { useTranslation } from '~/context/LanguageContext'

export interface SuccessAlertProps {
  success: boolean
}

export const SuccessAlert = ({ success }: { success: boolean }): JSX.Element => {
  const { translate } = useTranslation()

  return (
    <div className={`rounded-md bg-green-50 ${success ? 'block' : 'hidden'} p-4 mt-4`}>
      <div className="flex">
        <div className="flex-shrink-0">
          <MdCheckCircle className="h-5 w-5 text-green-400" aria-hidden="true" />
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium text-green-700">{translate('sended-message')}</p>
        </div>
      </div>
    </div>
  )
}
