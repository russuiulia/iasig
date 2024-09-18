import React from 'react'
import { useRcaContext } from '~/modules/rca/rca-context/rca-context'
import { RcaSteps } from '~/modules/rca/rca-context/rca-context.types'

const RomanianRcaDescription = (): JSX.Element => {
  const { activeStep } = useRcaContext()
  return activeStep === RcaSteps.InsuredDetails ? (
    <>
      <section>
        <h2 className="text-black-lightest text-lg font-medium mb-2">Acoperire</h2>
        <p>
          Asigurarea RCA este o asigurare de răspundere civilă auto valabilă pe teritoriul
          Republicii Moldova. Obiectul asigurării constă în acordarea despăgubirii de asigurare
          pentru daune cauzate în rezultatul accidentelor de autovehicul produse pe teritoriul
          Republicii Moldova. Riscurile asigurate includ prejudiciile suferite de terţe persoane,
          precum vătămarea corporală sau decesul, avarierea sau distrugerea bunurilor.
        </p>
        <p className="mt-4">
          Limitele maxime de despăgubire pentru daunele produse de autovehicule sunt:
        </p>
        <ul className="list-disc ml-10">
          <li>
            Până la <b>𝟭𝟬𝟬 𝟬𝟬𝟬 𝗲𝘂𝗿𝗼</b> pentru avarieri sau distrugeri de bunuri (comparativ cu un
            milion de lei în prezent);
          </li>
          <li>
            Până la <b>𝟭𝟬𝟬 𝟬𝟬𝟬 𝗲𝘂𝗿𝗼</b> pentru fiecare persoană păgubită în caz de vătămări
            corporale sau deces, dar nu mai mult de <b>𝟱𝟬𝟬 𝟬𝟬𝟬 𝗲𝘂𝗿𝗼</b>, indiferent de numărul
            persoanelor păgubite într-un accident rutier (comparativ cu un milion de lei în
            prezent);
          </li>
          <li>
            Până la <b>𝟭𝟱 𝟬𝟬𝟬 𝗹𝗲𝗶</b> pentru daune revendicate în baza procedurii de constatare
            amiabilă a accidentului;
          </li>
          <li>
            Până la <b>𝟱 𝟬𝟬𝟬 𝗲𝘂𝗿𝗼</b> pentru prejudiciile morale (doar ca urmare a dizabilității sau
            a decesului) pentru o persoană vătămată, dar nu mai mult de <b>𝟭𝟬 𝟬𝟬𝟬 𝗲𝘂𝗿𝗼</b>,
            indiferent de numărul persoanelor vătămate.
          </li>
        </ul>
        <p className="mt-4 pb-10">
          Limite maxime de despăgubire se aplică pentru fiecare accident în parte, indiferent de
          numărul de autovehicule implicate în accident.
        </p>
      </section>
      <section>
        <h2 className="text-black-lightest text-lg font-medium mb-2">Cost</h2>
        <p>
          Costul asigurării de răspundere civilă auto (RCA) în Republica Moldova variază în funcție
          de mai mulți factori, inclusiv de: tipul autovehiculului, capacitatea cilindrică/electric,
          statutul persoanei asigurate (juridică/fizică), domiciliu persoanei asigurate, istoricul
          de conducere a persoanei asigurate (Bonus/Malus), modul de utilizare a vehicului.
        </p>
        <p className="mt-4 pb-10">
          Pentru o obține un preț exact, completați formularul de mai{' '}
          <a className="text-pink" href="#steps-menu">
            sus
          </a>
          .
        </p>
      </section>
      <section>
        <h2 className="text-black-lightest text-lg font-medium mb-2">Acțiuni în caz de dauna</h2>
        <ul className="list-decimal	ml-4 pb-10">
          <li>
            În cazul unor pagube minore (estimate pana la 15 000 MDL), puteți opta pentru o
            constatare amiabilă, constatarea amiabilă este o opțiune simplă și poate fi efectuată
            doar când 2 (două) vehicule sunt implicate în accident și ambele au documentele valide
            (asigurare RCA, raport de revizie tehnica).
          </li>
          <li>
            În cazul în care ați optat pentru constatarea amiabilă, completați împreună cu celălalt
            conducator al vehiculului și faceți-vă fiecare o copie. Formularul de constatare îl
            puteți descărca{' '}
            <a
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink"
              href={process.env.NEXT_PUBLIC_AMICABLE_SETTLEMENT}
            >
              aici
            </a>
            .
          </li>
          <li>
            În cazul în care nu este posibilă o constatare amiabilă, solicitați întocmirea unui
            raport de poliție și obțineți o copie a acestuia.
          </li>
          <li>
            Notificați imediat compania dvs. de asigurare și furnizați-le toate informațiile și
            documentele necesare pentru a începe procesul de daună.
          </li>
          <li>
            Verificați și documentați toate pagubele și faceți fotografii ale acestora, dacă este
            posibil.
          </li>
        </ul>
      </section>
      <section>
        <h2 className="text-black-lightest text-lg font-medium mb-2">Excluderi</h2>
        <p className="pb-10">
          Nu sunt acoperite de contractul de asigurare prejudicii aduse proprietății persoanelor
          asigurate de răspundere civilă auto, în cazul în care aceste prejudicii sunt cauzate de un
          autovehicul aflat în posesia acestora, partea de prejudiciu care depășește limitele maxime
          ale despăgubirilor de asigurare prevăzute de lege, pagube cauzate de pierderea sau
          distrugerea hârtiilor de valoare, bani, pietre prețioase, obiecte din metale prețioase și
          proprietăți intelectuale, pagubele produse la locul de muncă prin intermediul utilajelor
          sau instalațiilor montate pe autovehicul, accidentele care au loc în timpul încărcării și
          descărcării mărfurilor, poluarea mediului, accidentele produse în timpul întrecerilor și
          antrenamentelor sportive, pagubele produse în situații în care răspunderea asigurătorului
          nu a început sau s-a încheiat, precum și despăgubiri pentru pagube morale.
        </p>
      </section>
      <section className="border-b-gray-lightest">
        <h2 className="text-black-lightest text-lg font-medium mb-2">Prelungire</h2>
        <p className="pb-40">
          Pentru a prelungi asigurarea auto RCA în Moldova, este suficient să completați formularul
          de mai{' '}
          <a className="text-pink" href="#steps-menu">
            sus
          </a>
          , alegeți perioada asigurată, efectuați plata și primiți polița pe email. Este important
          să solicitați prelungirea asigurării înainte de data expirării contractului actual, altfel
          veți fi expus riscului de a circula fără asigurare valabilă.
        </p>
      </section>
    </>
  ) : (
    <></>
  )
}

export default RomanianRcaDescription
