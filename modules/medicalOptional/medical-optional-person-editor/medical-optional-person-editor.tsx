/* eslint-disable @next/next/no-img-element */
import { useEffect } from 'react'
import { useForm, useFormContext } from 'react-hook-form'
import { TextInputController } from '~/components/mui/text-input-controller/text-input-controller'
import { TooltipInput } from '~/components/mui/tooltip-input/tooltip-input'
import { alphaNumeric } from '~/constants'
import { useTranslation } from '~/context/LanguageContext'
import { InsuranceType } from '~/modules/shared/types/insurance'
import { normalizeDate } from '~/utils/normalizeDate'
import { validateName } from '~/utils/validateName'
import { MedicalOptionalPerson } from '../types'

export interface MedicalOptionalPersonEditorProps {
  person: MedicalOptionalPerson
  onConfirm: (person: MedicalOptionalPerson) => void
}

export const MedicalOptionalPersonEditor = ({
  person,
  onConfirm,
}: MedicalOptionalPersonEditorProps): JSX.Element => {
  const { translate } = useTranslation()

  const {
    control,
    getValues,
    setValue,
    trigger,
    formState: { errors },
  } = useForm({ defaultValues: person, mode: 'onBlur' })

  const { watch } = useFormContext()
  const watchNationalityCode = watch('nationalityText')

  useEffect(() => {
    setValue('fullName', person.fullName)
    setValue('idnp', person.idnp)
    setValue('birthday', normalizeDate(person.birthday))
    setValue('passportNumber', person.passportNumber)
    setValue('address', person.address)
  }, [person])

  const confirmPersonIdnp = async () => {
    const triggerErrors = await trigger([`idnp`])
    if (!triggerErrors) {
      return
    }

    onConfirm({ ...person, ...getValues() })
  }

  const confirmPersonName = async () => {
    const triggerErrors = await trigger([`name`])
    if (!triggerErrors) {
      return
    }

    onConfirm({ ...person, ...getValues() })
  }

  const confirmPersonPassport = async () => {
    const triggerErrors = await trigger([`passportNumber`])
    if (!triggerErrors) {
      return
    }

    onConfirm({ ...person, ...getValues() })
  }

  const validatePassportNumber = (passportNumber: string): boolean =>
    alphaNumeric.test(passportNumber)

  return (
    <section className={`section rounded space-y-6`}>
      <TextInputController
        name="fullName"
        control={control}
        defaultValue={person?.fullName}
        label={translate('fullName')}
        handleBlur={confirmPersonName}
        handleChange={confirmPersonName}
        rules={{
          validate: {
            validateName,
          },
        }}
        errorText={
          (errors?.fullName?.type === 'validateName' && translate('fullName:error')) ||
          errors?.fullName?.message
        }
      />
      <TooltipInput
        name="idnp"
        type="text"
        control={control}
        defaultValue={person?.idnp}
        label={translate('personal-code')}
        rules={{}}
        handleBlur={confirmPersonIdnp}
        errorText={
          (errors?.idnp?.type === 'validateIdnp' && translate('taxCode:error')) ||
          errors?.idnp?.message
        }
        insuranceType={InsuranceType.MEDICAL_OPTIONAL}
      />
      <TooltipInput
        name="passportNumber"
        control={control}
        defaultValue={person?.passportNumber}
        id="passportNumber"
        label={translate('passportNumber')}
        handleBlur={confirmPersonPassport}
        handleChange={confirmPersonPassport}
        rules={{
          validate: {
            validatePassportNumber,
          },
        }}
        errorText={
          (errors?.passportNumber?.type === 'validatePassportNumber' &&
            translate('passportNumber:error')) ||
          errors?.passportNumber?.message
        }
        insuranceType={InsuranceType.MEDICAL_OPTIONAL}
      />
      <input name="address" type="hidden" value={watchNationalityCode} />
    </section>
  )
}
