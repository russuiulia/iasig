/* eslint-disable @next/next/no-img-element */
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material'
import React, { useState } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { PersonCard } from '~/modules/shared/personCard/personCard'
import { useMedicalOptionalValidations } from '../hooks'
import { MedicalOptionalPersonEditor } from '../medical-optional-person-editor/medical-optional-person-editor'
import { MedicalOptionalPerson } from '../types'
import { MedicalOptionalErrorType } from '../types/medical-optional-errors'

interface MedicalOptionalPersonsInfoProps {
  onAction: () => void
}

export const MedicalOptionalPersonsInfo = ({
  onAction,
}: MedicalOptionalPersonsInfoProps): JSX.Element => {
  const {
    control,
    setError,
    formState: { errors },
  } = useFormContext()
  const { fields, update } = useFieldArray({
    name: 'persons',
    control,
  })

  const { getDuplicatedPersonIDNP } = useMedicalOptionalValidations()

  const [expanded, setExpanded] = useState<number | null>(0)

  const confirmPerson = (person: MedicalOptionalPerson) => {
    const duplicated = getDuplicatedPersonIDNP(fields as MedicalOptionalPerson[], person)
    const isSamePerson = duplicated?.id === person?.id

    if (duplicated && !isSamePerson) {
      setError('form', { type: MedicalOptionalErrorType.duplicated }, { shouldFocus: true })
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
              <MedicalOptionalPersonEditor person={field as any} onConfirm={confirmPerson} />
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
