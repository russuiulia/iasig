/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { IsgButton } from '~/components/shared/isgButton/isgButton'
import { useTranslation } from '~/context/LanguageContext'
import { InsuranceType } from '~/modules/shared/types/insurance'
import { areValuesUnique } from '~/modules/utils/areValuesUniq'
import { removeExtraSpaces } from '~/modules/utils/removeExtraSpaces'
import { useFormPersist } from '~/utils/useFormPersist'
import { useMedicalOptionalPreOrder, useMedicalOptionalValidations } from '../hooks'
import { useMedicalOptionalContext } from '../medical-optional-context/medical-optional-context'
import { MedicalOptionalSteps } from '../medical-optional-context/medical-optional-context.types'
import { MedicalOptionalPersonsInfo } from '../medical-optional-persons-info/medical-optional-persons-info'
import { MedicalOptionalErrorType } from '../types/medical-optional-errors'

export const MedicalOptionalPersonsForm = (): JSX.Element => {
  const { translate } = useTranslation()
  const { setActiveStep, preOrderId } = useMedicalOptionalContext()

  const [isLoading, setIsLoading] = useState(false)

  const {
    handleSubmit,
    watch,
    setError,
    setValue,
    clearErrors,
    formState: { errors },
  } = useFormContext()

  const { watchForm } = useFormPersist(InsuranceType.MEDICAL_OPTIONAL, preOrderId, {
    watch,
    setValue,
  })

  const watchPersons = watch('persons')
  const { createOrUpdate, loadPreOrder } = useMedicalOptionalPreOrder()

  const { validateInsurance } = useMedicalOptionalValidations()

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
      !watchForm.persons.every((el) => el.idnp.trim()) ||
      !watchForm.persons.every((el) => removeExtraSpaces(el.fullName)) ||
      !watchForm.persons.every((el) => el.passportNumber.trim())
    ) {
      setError('form', { type: MedicalOptionalErrorType.incomplete })
      setIsLoading(false)
      return
    }

    if (!areValuesUnique(watchForm.persons.filter((el) => el.idnp).map((el) => el.idnp))) {
      setError('form', { type: MedicalOptionalErrorType.duplicated })
      setIsLoading(false)
      return
    }

    const updatedPreOrderId = await createOrUpdate(watchForm, preOrderId)
    if (!updatedPreOrderId) {
      setError('form', { type: MedicalOptionalErrorType.updateFailed })
      setIsLoading(false)
      return
    }

    setIsLoading(false)
    setActiveStep(MedicalOptionalSteps.Confirmation)
  }

  const setPersonsErrors = () => {
    for (const index in watchPersons) {
      if (
        !removeExtraSpaces(watchPersons[index].idnp) ||
        !removeExtraSpaces(watchPersons[index].passportNumber) ||
        !watchPersons[index].birthday ||
        !removeExtraSpaces(watchPersons[index].fullName)
      ) {
        setError(`persons[${index}]`, { type: MedicalOptionalErrorType.required })
      }
    }
    setIsLoading(false)
  }

  const onPersonAction = () => {
    clearErrors()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <MedicalOptionalPersonsInfo onAction={onPersonAction} />
      {errors?.form?.type === MedicalOptionalErrorType.duplicated && (
        <p className="text-danger">{translate('taxCode:duplicate')}</p>
      )}

      {errors?.form?.type === MedicalOptionalErrorType.incomplete && (
        <p className="text-danger">{translate('persons:incomplete')}</p>
      )}

      {errors?.form?.type === MedicalOptionalErrorType.updateFailed && (
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
