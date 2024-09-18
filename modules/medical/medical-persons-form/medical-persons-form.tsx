/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'

import { useMedicalPreOrder, useMedicalValidations } from '../hooks'
import { useMedicalContext } from '../medical-context/medical-context'
import { MedicalSteps } from '../medical-context/medical-context.types'
import { MedicalPersonsInfo } from '../medical-persons-info/medical-persons-info'
import { MedicalErrorType } from '../types/medical-errors'
import { IsgButton } from '~/components/shared/isgButton/isgButton'
import { passportNumberValidator } from '~/constants'
import { useTranslation } from '~/context/LanguageContext'
import { InsuranceType } from '~/modules/shared/types/insurance'
import { areValuesUnique } from '~/modules/utils/areValuesUniq'
import { removeExtraSpaces } from '~/modules/utils/removeExtraSpaces'
import { useFormPersist } from '~/utils/useFormPersist'
import { validateIdnp } from '~/utils/validateIdnp'

export const MedicalPersonsForm = (): JSX.Element => {
  const { translate } = useTranslation()
  const { setActiveStep, preOrderId } = useMedicalContext()

  const [isLoading, setIsLoading] = useState(false)

  const {
    handleSubmit,
    watch,
    setError,
    setValue,
    clearErrors,
    formState: { errors },
  } = useFormContext()

  const { watchForm } = useFormPersist(InsuranceType.MEDICAL, preOrderId, {
    watch,
    setValue,
  })

  const watchPersons = watch('persons')

  const { createOrUpdate, loadPreOrder } = useMedicalPreOrder()

  const { validateInsurance } = useMedicalValidations()

  useEffect(() => clearErrors('form'), [JSON.stringify(watchForm)])

  useEffect(() => {
    if (preOrderId) {
      loadPreOrder(preOrderId)
    }
  }, [preOrderId])

  const onSubmit = async () => {
    setIsLoading(true)

    const validation = validateInsurance(watchForm)
    if (!validation.isValid) {
      setError(validation.field as string, { type: validation.type }, { shouldFocus: true })
      setIsLoading(false)
      return
    }

    setPersonsErrors()

    if (
      !watchForm.persons.every((el) => el.idnp.trim() && el.passport.trim() && isPersonName(el))
    ) {
      setError('form', { type: MedicalErrorType.incomplete })
      setIsLoading(false)
      return
    }

    if (!areValuesUnique(watchForm.persons.filter((el) => el.idnp).map((el) => el.idnp))) {
      setError('form', { type: MedicalErrorType.duplicated })
      setIsLoading(false)
      return
    }

    if (!watchForm.persons.every((el) => el.idnp && validateIdnp(el.idnp))) {
      setError('form', { type: MedicalErrorType.incomplete })
      setIsLoading(false)
      return
    }

    if (
      !watchForm.persons.every((el) => el.passport && passportNumberValidator.test(el.passport))
    ) {
      setError('form', { type: MedicalErrorType.incomplete })
      setIsLoading(false)
      return
    }

    const updatedPreOrderId = await createOrUpdate(watchForm, preOrderId)
    if (!updatedPreOrderId) {
      setError('form', { type: MedicalErrorType.updateFailed })
      setIsLoading(false)
      return
    }

    setIsLoading(false)
    setActiveStep(MedicalSteps.Confirmation)
  }

  const setPersonsErrors = () => {
    for (const index in watchPersons) {
      if (
        !removeExtraSpaces(watchPersons[index].idnp) ||
        !removeExtraSpaces(watchPersons[index].passport) ||
        !watchPersons[index].birthday ||
        !isPersonName(watchPersons[index])
      ) {
        setError(`persons[${index}]`, { type: MedicalErrorType.required })
      }

      if (!validateIdnp(watchPersons[index].idnp)) {
        setError(`persons[${index}]`, { type: MedicalErrorType.invalid })
      }
    }
    setIsLoading(false)
  }

  const onPersonAction = () => {
    clearErrors()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <p className="inline-flex items-center rounded-md bg-blue-50 px-3 py-2 text-xs text-blue-700 mb-6">
        {translate('info-message-travel')}
      </p>
      <MedicalPersonsInfo onAction={onPersonAction} />
      {errors?.form?.type === MedicalErrorType.duplicated && (
        <p className="text-danger">{translate('taxCode:duplicate')}</p>
      )}
      {errors?.form?.type === MedicalErrorType.incomplete && (
        <p className="text-danger">{translate('persons:incomplete')}</p>
      )}
      {errors?.form?.type === MedicalErrorType.updateFailed && (
        <p className="text-danger">{translate('update-order-error')}</p>
      )}
      <div className="flex justify-center mt-8">
        <IsgButton
          type="submit"
          imgSrc="/images/white-arrow.svg"
          text={translate('next')}
          isLoading={isLoading}
          styleClass="py-4 h-12 sm:w-44 w-full"
        />
      </div>
    </form>
  )
}

const isPersonName = (person) =>
  removeExtraSpaces(person.lastName) && removeExtraSpaces(person.firstName)
