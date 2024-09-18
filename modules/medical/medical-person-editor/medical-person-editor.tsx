/* eslint-disable @next/next/no-img-element */
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'

import { MedicalPerson } from '../types'
import { TextInputController } from '~/components/mui/text-input-controller/text-input-controller'
import { TooltipInput } from '~/components/mui/tooltip-input/tooltip-input'
import { passportNumberValidator } from '~/constants'
import { useTranslation } from '~/context/LanguageContext'
import { validateIdnp } from '~/utils/validateIdnp'
import { validateName } from '~/utils/validateName'

export interface MedicalPersonEditorProps {
  person: MedicalPerson
  onConfirm: (person: MedicalPerson) => void
}

export const MedicalPersonEditor = ({
  person,
  onConfirm,
}: MedicalPersonEditorProps): JSX.Element => {
  const { translate } = useTranslation()

  const {
    control,
    getValues,
    setValue,
    trigger,
    formState: { errors },
  } = useForm({ defaultValues: person, mode: 'onBlur' })
  useEffect(() => {
    const { lastName, firstName } = person
    const fullName = [lastName, firstName].join(' ')
    setValue('fullName', fullName)
    setValue('idnp', person.idnp)
    setValue('birthday', person.birthday)
    setValue('passport', person.passport)
    setValue('address', person.address)
    setValue('firstName', person.firstName)
    setValue('lastName', person.lastName)
  }, [person])

  const handleChangeIdnp = async (e) => {
    if (e?.target?.value?.length === 13) {
      await confirmPersonIdnp()
    }
  }

  const confirmPersonIdnp = async () => {
    const triggerErrors = await trigger([`idnp`])
    if (!triggerErrors) {
      return
    }

    onConfirm({ ...person, ...getValues() })
  }

  const confirmPersonName = async (name) => {
    const triggerErrors = await trigger([name])
    if (!triggerErrors) {
      return
    }

    onConfirm({ ...person, ...getValues() })
  }

  const confirmPersonPassport = async () => {
    const triggerErrors = await trigger([`passport`])
    if (!triggerErrors) {
      return
    }

    onConfirm({ ...person, ...getValues() })
  }

  const validatePassportNumber = (passportNumber: string): boolean =>
    passportNumberValidator.test(passportNumber)

  return (
    <section className={`section rounded space-y-6`}>
      <div className="flex md:flex-row flex-col md:justify-content-between md:gap-2 gap-6">
        {['lastName', 'firstName'].map((el) => (
          <TextInputController
            key={el}
            name={el}
            control={control}
            defaultValue={person?.[el]}
            label={translate(el)}
            handleBlur={() => confirmPersonName(el)}
            handleChange={() => confirmPersonName(el)}
            rules={{
              validate: {
                validateName,
              },
            }}
            errorText={
              (errors?.[el]?.type === 'validateName' && translate(`${el}:error`)) ||
              errors?.[el]?.message
            }
          />
        ))}
      </div>
      <TooltipInput
        name="idnp"
        type="tel"
        control={control}
        defaultValue={person?.idnp}
        label={translate('taxCode')}
        rules={{
          validate: {
            validateIdnp,
          },
        }}
        handleBlur={confirmPersonIdnp}
        handleChange={handleChangeIdnp}
        errorText={
          (errors?.idnp?.type === 'validateIdnp' && translate('taxCode:error')) ||
          errors?.idnp?.message
        }
      />
      <TooltipInput
        name="passport"
        control={control}
        defaultValue={person?.passport}
        id="passport"
        label={translate('passportNumber')}
        handleBlur={confirmPersonPassport}
        handleChange={confirmPersonPassport}
        rules={{
          validate: {
            validatePassportNumber,
          },
        }}
        errorText={
          (errors?.passport?.type === 'validatePassportNumber' &&
            translate('passportNumber:error')) ||
          errors?.passport?.message
        }
      />
      <input name="address" type="hidden" value="Republic of Moldova" />
    </section>
  )
}
