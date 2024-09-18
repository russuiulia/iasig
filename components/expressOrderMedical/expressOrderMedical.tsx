import { useEffect, useState } from 'react'

import * as fba from '../../fba'
import { useTranslation } from '~/context/LanguageContext'
import { InsuranceType } from '~/modules/shared/types/insurance'

export const ExpressOrderMedical = ({
  prefillFormForRomania,
  insuranceType = InsuranceType.MEDICAL,
}) => {
  const { translate } = useTranslation()
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  if (!hasMounted) {
    return null
  }

  return (
    <div
      className={`xl:w-2/5 md:w-3/5 w-full mx-auto ${'md:flex grid grid-cols-1 justify-center'} mt-4`}
    >
      <button
        type="button"
        className="rounded-md bg-white py-2.5 px-2 text-sm  text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        onClick={() => {
          prefillFormForRomania()
          fba.express_order(insuranceType)
        }}
      >
        <p className="font-semibold truncate text-center">
          <span role="img" aria-label="student">
            👨‍🎓
          </span>{' '}
          {translate('insurance-study-romania')}{' '}
          <span role="img" aria-label="flag-ro">
            🇷🇴
          </span>
        </p>
      </button>
    </div>
  )
}
