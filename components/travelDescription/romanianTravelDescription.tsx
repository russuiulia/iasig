import React from 'react'
import { useMedicalContext } from '~/modules/medical/medical-context/medical-context'
import { MedicalSteps } from '~/modules/medical/medical-context/medical-context.types'

const RomanianTravelDescription = (): JSX.Element => {
  const { activeStep } = useMedicalContext()

  return activeStep === MedicalSteps.TravelDetails ? (
    <>
      <section>
        <h2 className="text-black-lightest text-lg font-medium mb-2">Acoperire</h2>
        <p>
          Asigurare de călătorie acoperă cheltuieli neașteptate și necesare rezultate dintr-o boală
          acută sau rănire personală urmând un accident și deces în afara țării lor de origine.
          Polița include cheltuieli medicale de urgență, spitalizare, intervenții chirurgicale de
          urgență, repatriere în caz de deces și alte cheltuieli legate. Unele companii de asigurări
          acoperă, de asemenea, anularea sau întreruperea călătoriei și tratamentul dentar. Suma
          asigurată variază între 5.000 EUR și 60.000 EUR în funcție de destinația călătoriei.
          Conditiile de asigurare pentru mai multe companii, inclusiv:
        </p>
        <ul className="list-disc text-pink list-inside">
          <li className="underline">
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={`${process.env.NEXT_PUBLIC_HOST}medical/grawe`}
            >
              Grawe
            </a>
          </li>
          <li className="underline">
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={`${process.env.NEXT_PUBLIC_HOST}medical/intact`}
            >
              Intact
            </a>
          </li>
          <li className="underline">
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={`${process.env.NEXT_PUBLIC_HOST}medical/donaris`}
            >
              Donaris
            </a>
          </li>
          <li className="underline">
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={`${process.env.NEXT_PUBLIC_HOST}medical/moldcargo`}
            >
              Moldcargo
            </a>
          </li>
          <li className="underline">
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={`${process.env.NEXT_PUBLIC_HOST}medical/transelit`}
            >
              Transelit
            </a>
          </li>
        </ul>{' '}
        <p className="pb-10">pot fi revizuiți pentru toate ofertele enumerate.</p>
      </section>
      <section>
        <h2 className="text-black-lightest text-lg font-medium mb-2">Cost</h2>
        <p>
          Costul asigurării de călătorie pentru o singură călătorie este determinat în funcție de
          numărul de zile și variază în funcție de compania de asigurări, destinația de călătorie,
          suma asigurată, vârsta persoanei asigurate și riscurile suplimentare. În contrast,
          asigurarea multiplă, sau multivisa, are un preț fix pentru un anumit interval de timp.
          <br />
          Prețurile pentru ambele tipuri de asigurare, pentru călătorie singură sau multiplă, sunt
          listate în EUR, iar utilizatorul plătește în MDL la rata BNM.
        </p>
        <p className="mt-2 pb-10">
          Pentru a obține prețul exact și a compara ofertele pentru destinația ta de călătorie,
          completează formularul de mai{' '}
          <a className="text-pink" href="#steps-menu">
            sus
          </a>
          .
        </p>
      </section>
      <section>
        <h2 className="text-black-lightest text-lg font-medium mb-2">Excluderi</h2>
        <p>
          Polița de asigurare de călătorie nu acoperă condițiile medicale pre-existente,
          activitățile cu risc ridicat (cum ar fi sporturile extreme), activitățile ilegale, rănile
          auto-infligete sau afecțiunile de sănătate mintală. Alte excluderi includ cheltuielile
          legate de sarcină, dezastrele naturale sau epidemiile și tratamentul medical care nu este
          de urgență. Fiecare companie de asigurări are o listă specifică de activități care nu sunt
          acoperite. Pentru o listă completă de excluderi pentru fiecare companie puteți verifica
          aici:
        </p>
        <ul className="list-disc text-pink list-inside pb-10">
          <li className="underline">
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={`${process.env.NEXT_PUBLIC_HOST}medical/grawe/#grawe-uninsured-risks`}
            >
              Grawe
            </a>
          </li>
          <li className="underline">
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={`${process.env.NEXT_PUBLIC_HOST}medical/intact/#intact-uninsured-risks`}
            >
              Intact
            </a>
          </li>
          <li className="underline">
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={`${process.env.NEXT_PUBLIC_HOST}medical/donaris/#donaris-uninsured-risks`}
            >
              Donaris
            </a>
          </li>
          <li className="underline">
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={`${process.env.NEXT_PUBLIC_HOST}medical/moldcargo/#moldcargo-uninsured-risks`}
            >
              Moldcargo
            </a>
          </li>
          <li className="underline">
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={`${process.env.NEXT_PUBLIC_HOST}medical/transelit/#transelit-uninsured-risks`}
            >
              Transelit
            </a>
          </li>
        </ul>
      </section>
      <section>
        <h2 className="text-black-lightest text-lg font-medium mb-2">Daune</h2>
        <p className="pb-10">
          Asiguratul trebuie să contacteze imediat Compania de Asistență a asigurătorului în cazul
          unui risc asigurat și să furnizeze informațiile necesare. Asiguratorul organizează
          servicii medicale și alte servicii necesare conform contractului de asigurare. Asiguratul
          trebuie să prezinte politica de asigurare personalului medical și trebuie să declare în
          scris asigurătorului toate cheltuielile legate de riscul asigurat. Documentele relevante
          trebuie prezentate asiguratorului în termen de 30 de zile calendaristice, iar asiguratorul
          finalizează investigațiile și determină suma de despăgubire în termen de o lună. În cazul
          în care nu este posibilă stabilirea circumstanțelor, asiguratorul amână examinarea și
          notifică motivele.
        </p>
      </section>
      <section className="border-b-gray-lightest">
        <h2 className="text-black-lightest text-lg font-medium mb-2">Asistență</h2>

        <ul className="list-inside list-decimal pb-40">
          <li>Contactați imediat Compania de Asistență conform poliței de asigurare.</li>
          <li>
            Notificați Compania de Asistență în limba română sau engleză, oferind numele
            asiguratului, numărul poliței, un număr de telefon la care puteți fi contactat în
            străinătate și detalii despre eveniment.
          </li>
          <li>
            În caz de spitalizare, asiguratul sau medicul trebuie să anunțe Compania de Asistență în
            termen de 48 de ore, altfel, Compania nu va putea lua o decizie cu privire la acoperirea
            cheltuielilor de spitalizare.{' '}
          </li>
          <li>
            Dacă ați hotărât să suportați cheltuielile independent, solicitați medicului să vă ofere
            toate documentele care confirmă diagnosticul și spitalizarea, în original, semnate și
            ștampilate.
          </li>
          <li>
            Dacă ați achitat serviciile independent, în decurs de 24 de ore de la plată, trebuie să
            informați Compania de Asistență cu privire la data plății și suma cheltuielilor.
            Păstrați toate chitanțele și facturile originale pentru orice servicii primite legate de
            cazul asigurat.
          </li>
          <li>
            În termen de 30 de zile calendaristice de la data de revenire din călătorie, trebuie să
            contactați compania de asigurare pentru a depune o cerere privind plata îndemnizației de
            asigurare.
          </li>
          <li>
            În cazul decesului asiguratului ca urmare a cazului asigurat, rudele sau persoana de
            încredere trebuie să notifice asigurătorul în termen de 48 de ore.
          </li>
          <li>
            În cazul în care suferiți de orice boli cronice sau alte patologii, asigurați-vă că
            luați toate medicamentele necesare în timpul călătoriei.
          </li>
        </ul>
      </section>
    </>
  ) : (
    <></>
  )
}

export default RomanianTravelDescription
