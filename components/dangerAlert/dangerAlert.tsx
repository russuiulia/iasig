import { IoMdCloseCircle } from 'react-icons/io'

export interface DangerAlertProps {
  danger: boolean
  text: string
  close: () => void
}

export const DangerAlert = ({ danger, text, close }: DangerAlertProps): JSX.Element => {
  return (
    <div className={`rounded-md bg-red-50 ${danger ? 'block' : 'hidden'} p-4 mt-4`}>
      <div className="flex align-center justify-between">
        <div className="mr-3">
          <p className="text-sm font-medium text-red-700">{text}</p>
        </div>
        <div>
          <IoMdCloseCircle className="h-5 w-5 text-red-400" aria-hidden="true" onClick={close} />
        </div>
      </div>
    </div>
  )
}
