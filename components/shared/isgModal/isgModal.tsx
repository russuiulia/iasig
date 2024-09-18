/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from 'react'
import { useTranslation } from '~/context/LanguageContext'

export const IsgModal = () => {
  const [open, setOpen] = useState(false)
  const { translate } = useTranslation()

  useEffect(() => {
    const close = (e) => {
      if (e.keyCode === 27) {
        setOpen(false)
      }
    }
    window.addEventListener('keydown', close)
    return () => window.removeEventListener('keydown', close)
  }, [])

  return (
    <>
      <button
        className="block text-blue-200 hover:text-blue focus:outline-none text-sm py-1 text-center"
        type="button"
        data-modal-toggle="defaultModal"
        onClick={() => setOpen(!open)}
      >
        {translate('details')}
      </button>
      {open ? (
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events
        <div
          modal-backdrop=""
          className="bg-gray-900 bg-opacity-50 dark:bg-opacity-80 flex fixed inset-0 z-40 pointer-events-auto"
          onClick={() => setOpen(false)}
          role="button"
          tabIndex={-1}
        >
          <div
            id="defaultModal"
            tabIndex={-1}
            aria-hidden="true"
            className="overflow-y-auto overflow-x fixed top-0 right-0 left-0 z-50 w-full  h-full justify-center items-center"
          >
            <div className="relative mx-auto p-4 w-full max-w-2xl h-auto">
              <div className="relative bg-white rounded-lg shadow">
                <div className="flex justify-between items-start p-5 rounded-t border-b ">
                  <h3 className="text-xl font-semibold text-gray-900 lg:text-2xl">
                    {translate('TripPurpose')}
                  </h3>
                  <button
                    type="button"
                    className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm ml-auto inline-flex items-center"
                    data-modal-toggle="defaultModal"
                    onClick={() => setOpen(false)}
                  >
                    <img
                      src="/images/close-icon.svg"
                      alt="Close Icon"
                      width={32}
                      height={32}
                      className="block"
                      aria-hidden="true"
                    />
                  </button>
                </div>

                <div className="px-6 py-6 md:space-y-8 space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium activity-title"> {translate('TRVL')}</h4>
                    <ul className="md:space-y-3 space-y-2 pl-4">
                      <li className="md:text-base text-sm">{translate('TRVL1')}</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium activity-title"> {translate('ADV')}</h4>
                    <ul className="md:space-y-3 space-y-2 pl-4">
                      {Array(8)
                        .fill(undefined)
                        .map((_, index) => (
                          <li key={index} className="md:text-base text-sm">
                            {translate(`ADV${index + 1}`)}
                          </li>
                        ))}
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium activity-title"> {translate('SKI')}</h4>
                    <ul className="md:space-y-3 space-y-2 pl-4">
                      {Array(2)
                        .fill(undefined)
                        .map((_, index) => (
                          <li key={index} className="md:text-base text-sm">
                            {translate(`SKI${index + 1}`)}
                          </li>
                        ))}
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium activity-title"> {translate('BIZZ')}</h4>
                    <ul className="md:space-y-3 space-y-2 pl-4">
                      <li className="md:text-base text-sm">{translate('BIZZ1')}</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium activity-title"> {translate('STUDY')}</h4>
                    <ul className="md:space-y-3 space-y-2 pl-4">
                      <li className="md:text-base text-sm">{translate('STUDY1')}</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium activity-title"> {translate('WORK')}</h4>
                    <ul className="md:space-y-3 space-y-2 pl-4">
                      {Array(8)
                        .fill(undefined)
                        .map((_, index) => (
                          <li key={index} className="md:text-base text-sm">
                            {translate(`WORK${index + 1}`)}
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  )
}
