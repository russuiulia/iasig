import { differenceInCalendarYears, differenceInYears } from 'date-fns'
import React from 'react'
import { useFormContext } from 'react-hook-form'
import { BirthdayInput, BirthdayInputProps } from '~/components/mui/birthday-input/birthday-input'
import { useTranslation } from '~/context/LanguageContext'

export interface ContractorBirthdayProps {
  id?: string
  value: Date
  name?: string
}

export const ContractorBirthday = ({
  id,
  value,
  name = 'contractorBirthday',
}: ContractorBirthdayProps): JSX.Element => {
  const { translate } = useTranslation()

  const {
    control,
    setValue,
    clearErrors,
    trigger,
    formState: { errors, dirtyFields },
  } = useFormContext()

  const birthdayDateOptions: BirthdayInputProps = {
    label: translate(name),
    name,
    value,
    dirtyFields,
    id,
    errors,
    disableFuture: true,
    disableOpenPicker: true,
    inputFormat: 'dd.MM.yyyy',
    mask: '__.__.____',
    control: control,
    onChange: (date) => {
      setValue(name, date)
      clearErrors(name)
      trigger(name)
    },
    onBlur: () => {
      clearErrors(name)
    },
    invalidBirthday: (date) => differenceInCalendarYears(new Date(), date) <= 102,
    checkIfIsAdult: (date) => differenceInYears(new Date(), date) >= 18,
  }

  return <BirthdayInput {...birthdayDateOptions} />
}
