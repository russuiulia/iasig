import React, { useState } from 'react'
import { differenceInCalendarDays, differenceInCalendarYears, isValid } from 'date-fns'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { v4 as uuid } from 'uuid'

import { MedicalPersonBirthday } from '../medical-person-birthday/medical-person-birthday'
import { MedicalPerson } from '../types'
import { IsgButton } from '~/components/shared/isgButton/isgButton'
import { useTranslation } from '~/context/LanguageContext'

export interface MedicalPersonsProps {
  onAction: () => void
}

export const MedicalPersons = ({ onAction }: MedicalPersonsProps): JSX.Element => {
  const { control } = useFormContext()
  const { fields, append, remove, update } = useFieldArray({
    name: 'persons',
    control,
  })

  const [tempPersons, setTempPersons] = useState<MedicalPerson[]>([])

  const persons = fields.filter((field) => field?.id !== fields?.[0]?.id)

  const addNewPerson = () => {
    setTempPersons([
      ...tempPersons,
      {
        id: uuid(),
        fullName: '',
        firstName: '',
        lastName: '',
        idnp: '',
        birthday: null,
        passport: '',
        address: 'Republic of Moldova',
      },
    ])
    onAction()
  }

  const removePerson = (index: number) => remove(index)

  const confirmPerson = (person: MedicalPerson, index?: number) => {
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
      {persons.map((field, index) => (
        <section key={field.id} className={`mt-4 relative`}>
          <div className="mb-6">
            <PersonInput
              onDelete={() => removePerson(index + 1)}
              onConfirm={confirmPerson}
              person={field as any}
            />
          </div>
        </section>
      ))}
      {tempPersons.map((field: MedicalPerson, index: number) => (
        <section key={`tempPersons-${field.id}`} className={`mt-4 relative`}>
          <div className="mb-6">
            <PersonInput
              id={field.id}
              onDelete={() => removeTempPerson(index)}
              onConfirm={(person: MedicalPerson) => confirmPerson(person, index)}
              person={field as any}
            />
          </div>
        </section>
      ))}
      <div>
        <div className="flex justify-left">
          <AddNewPersonButton onClick={() => addNewPerson()} />
        </div>
      </div>
    </div>
  )
}

const AddNewPersonButton = ({ onClick }: { onClick: () => void }): JSX.Element => {
  const { translate } = useTranslation()

  return (
    <IsgButton
      type="button"
      isPink={false}
      imgSrc="/images/add-icon.svg"
      text={translate('add-person')}
      isGhost={true}
      onClick={onClick}
      styleClass="mt-4 py-4 h-14 w-full"
    />
  )
}

const PersonInput = ({
  onDelete,
  onConfirm,
  person,
  id,
}: {
  onDelete?: () => void
  onConfirm: (person: MedicalPerson) => void
  person: MedicalPerson
  id?: string
}): JSX.Element => {
  return (
    <div className="mb-6">
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
      <MedicalPersonBirthday id={id} onConfirm={onConfirm} person={person} />
    </div>
  )
}
