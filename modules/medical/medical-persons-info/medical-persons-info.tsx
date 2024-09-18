/* eslint-disable @next/next/no-img-element */
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material'
import React, { useState } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { PersonCard } from '~/modules/shared/personCard/personCard'
import { useMedicalValidations } from '../hooks'
import { MedicalPersonEditor } from '../medical-person-editor/medical-person-editor'
import { MedicalPerson } from '../types'
import { MedicalErrorType } from '../types/medical-errors'

interface MedicalPersonsInfoProps {
  onAction: () => void
}

export const MedicalPersonsInfo = ({ onAction }: MedicalPersonsInfoProps): JSX.Element => {
  const {
    control,
    setError,
    formState: { errors },
  } = useFormContext()
  const { fields, update } = useFieldArray({
    name: 'persons',
    control,
  })

  const { getDuplicatedPersonIDNP } = useMedicalValidations()

  const [expanded, setExpanded] = useState<number | null>(0)

  const confirmPerson = (person: MedicalPerson) => {
    const duplicated = getDuplicatedPersonIDNP(fields as MedicalPerson[], person)
    const isSamePerson = duplicated?.id === person?.id

    if (duplicated && !isSamePerson) {
      setError('form', { type: MedicalErrorType.duplicated }, { shouldFocus: true })
      return
    }

    const personIndex = fields.findIndex((field) => field.id === person.id)
    update(personIndex, person)

    onAction()
  }

  const handleChange = (index: number) => (_, newExpanded: boolean) => {
    setExpanded(newExpanded ? index : null)
  }

  return (
    <div>
      {fields.map((field, index) => {
        return (
          <Accordion
            key={field.id}
            expanded={expanded === index}
            onChange={handleChange(index)}
            className="mb-3"
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel3d-content"
              id="panel3d-header"
            >
              <PersonCard person={field as any} error={!!errors?.persons?.[index]} />
            </AccordionSummary>
            <AccordionDetails>
              <MedicalPersonEditor person={field as any} onConfirm={confirmPerson} />
            </AccordionDetails>
          </Accordion>
        )
      })}
    </div>
  )
}

const ExpandMoreIcon = () => (
  <img alt="arrow-down" src="/images/arrow-down.svg" width={12} height={10} />
)
