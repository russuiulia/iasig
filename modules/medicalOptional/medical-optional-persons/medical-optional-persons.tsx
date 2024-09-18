import React, { useState } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { IsgButton } from '~/components/shared/isgButton/isgButton'
import { MedicalOptionalPerson } from '../types'
import { MedicalOptionalPersonBirthday } from '../medical-optional-person-birthday/medical-optional-person-birthday'
import { differenceInCalendarDays, differenceInCalendarYears, isValid } from 'date-fns'
export interface MedicalOptionalPersonsProps {
  onAction: () => void
}

export const MedicalOptionalPersons = ({ onAction }: MedicalOptionalPersonsProps): JSX.Element => {
  const { control } = useFormContext()
  const { fields, append, update } = useFieldArray({
    name: 'persons',
    control,
  })

  const [tempPersons, setTempPersons] = useState<MedicalOptionalPerson[]>([])

  const confirmPerson = (person: MedicalOptionalPerson, index?: number) => {
    const personIndex = fields.findIndex((field) => field.id === person.id)
    if (personIndex !== -1) {
      update(personIndex, person)
      onAction()
      return
    }

    const isValidBirthday =
      person.birthday &&
      isValid(person.birthday) &&
      differenceInCalendarDays(person.birthday, new Date()) < 0 &&
      differenceInCalendarYears(new Date(), person.birthday) <= 102

    if (isValidBirthday) {
      if (index !== undefined) {
        append(person)
        removeTempPerson(index)
      } else {
        update(0, person)
      }
    } else {
      if (index) {
        const newData = [...tempPersons]
        newData[index] = person
        setTempPersons(newData)
      }
    }

    onAction()
  }

  const removeTempPerson = (index: number | undefined) =>
    setTempPersons([...tempPersons.filter((_, i) => i !== index)])

  return (
    <div>
      <section className={`mt-4 relative`}>
        <PersonInput id={fields[0]?.id} onConfirm={confirmPerson} person={fields[0] as any} />
      </section>
    </div>
  )
}

const PersonInput = ({
  onDelete,
  onConfirm,
  person,
  id,
}: {
  onDelete?: () => void
  onConfirm: (person: MedicalOptionalPerson) => void
  person: MedicalOptionalPerson
  id?: string
}): JSX.Element => {
  return (
    <div>
      {onDelete && (
        <IsgButton
          id="medicalDeletePerson"
          type="button"
          styleClassIcon="ml-auto"
          imgSrc="/images/remove.svg"
          text={''}
          onClick={onDelete}
          isPink={false}
          styleClass="absolute top-5 right-4 w-4 z-10"
        />
      )}
      <MedicalOptionalPersonBirthday id={id} onConfirm={onConfirm} person={person} />
    </div>
  )
}
