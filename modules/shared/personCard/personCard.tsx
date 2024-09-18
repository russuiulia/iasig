/* eslint-disable @next/next/no-img-element */
import { format } from 'date-fns'

import { MedicalPerson } from '~/modules/medical/types'

export interface PersonCardProps {
  person: MedicalPerson
  error: boolean
}

export const PersonCard = ({ person, error }: PersonCardProps): JSX.Element => {
  const showFullName = (person.firstName || person.lastName) && person.fullName

  return (
    <div className={`flex items-center justify-between w-full`}>
      <div className="flex">
        <img
          src="/images/user.png"
          width="20"
          height="20"
          alt="user"
          className="object-contain mr-2"
        />

        <div className="text-gray">
          <div className="hidden sm:block" translate="no">
            {showFullName && <span>{person.fullName}, </span>}
            {person.idnp && <span>{person.idnp}, </span>}
            {person.passport && <span>{person.passport}, </span>}
            {format(person.birthday as Date, 'dd.MM.yyyy')}
          </div>
          <div className="sm:hidden block" translate="no">
            {showFullName && <span>{person.fullName}, </span>}
            {person.idnp && <span>{person.idnp}, </span>}
            <div>
              {person.passport && <span>{person.passport}, </span>}
              {format(person.birthday as Date, 'dd.MM.yyyy')}
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center">
        {error && (
          <img
            src="/images/error.svg"
            width="20"
            height="20"
            alt="error"
            className="object-contain lg:mr-6 sm:mr-4 mr-2"
          />
        )}
      </div>
    </div>
  )
}
