import { differenceInCalendarYears } from 'date-fns'
import React from 'react'
import { useForm } from 'react-hook-form'
import { BirthdayInput, BirthdayInputProps } from '~/components/mui/birthday-input/birthday-input'
import { useTranslation } from '~/context/LanguageContext'
import { MedicalPerson } from '../types'

export interface MedicalPersonBirthdayProps {
  person: MedicalPerson
  onConfirm: (person: MedicalPerson) => void
  id?: string
}

export const MedicalPersonBirthday = ({
  person,
  onConfirm,
  id,
}: MedicalPersonBirthdayProps): JSX.Element => {
  const { translate } = useTranslation()

  const {
    control,
    getValues,
    setValue,
    clearErrors,
    trigger,
    formState: { errors, dirtyFields },
  } = useForm({ defaultValues: person, mode: 'onBlur' })
  const confirmPerson = () => onConfirm({ ...person, ...getValues() })

  const birthdayDateOptions: BirthdayInputProps = {
    label: translate('birthday'),
    name: 'birthday',
    value: person?.birthday || null,
    dirtyFields,
    id,
    errors,
    disableFuture: true,
    disableOpenPicker: true,
    inputFormat: 'dd.MM.yyyy',
    mask: '__.__.____',
    control: control,
    onChange: async (date) => {
      setValue('birthday', date)
      clearErrors('birthday')
      await confirmPerson()
      await trigger('birthday')
    },
    onBlur: async () => {
      clearErrors('birthday')
      await confirmPerson()
    },
    invalidBirthday: (date) => differenceInCalendarYears(new Date(), date) <= 102,
  }

  return <BirthdayInput {...birthdayDateOptions} />
}
