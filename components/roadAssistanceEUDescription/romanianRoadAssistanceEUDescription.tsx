import React from 'react'

import { useRoadAssistanceEUContext } from '~/modules/roadAssistanceEU/road-assistance-eu-context/road-assistance-eu-context'
import { RoadAssistanceEUSteps } from '~/modules/roadAssistanceEU/road-assistance-eu-context/road-assistance-eu-context.types'

const RomanianRoadAssistanceEUDescription = (): JSX.Element => {
  const { activeStep } = useRoadAssistanceEUContext()

  return activeStep === RoadAssistanceEUSteps.Vehicle ? (
    <>
      <section>
        <h2 className="text-black-lightest text-lg font-medium mb-2">Accident</h2>
        <p className="pb-10">
          Tractare în urma unui eveniment rutier din care auto implicat a devenit nedeplasabil,
          număr nelimitat de evenimente pe durata de valabilitate a abonamentelor.
        </p>
      </section>
      <section>
        <h2 className="text-black-lightest text-lg font-medium mb-2">
          Depanare la locul evenimentului
        </h2>
        <p className="pb-10">
          Serviciul de depanare a autovehiculului imobilizat, realizat de către o echipă de
          intervenție la locul evenimentului. Scopul serviciului de asistență rutieră este refacerea
          temporară a capacității de deplasare a autovehiculului imobilizat, pentru continuarea
          călătoriei. Autonom Assistance acoperă costurile de deplasare a echipei de intervenție și
          manopera operațiunilor de intervenție efectuate de către echipa de intervenție.
        </p>
      </section>
      <section>
        <h2 className="text-black-lightest text-lg font-medium mb-2">
          Tractare defecțiune tehnică
        </h2>
        <p className="pb-10">
          Serviciul de transport al autovehiculului imobilizat de la locul incidentului către cel
          mai apropiat service în limita a 100km/sens. Costurile suplimentare generate de diferența
          de distanță se vor refactura mai departe către Utilizator.
        </p>
      </section>

      <section>
        <h2 className="text-black-lightest text-lg font-medium mb-2">Parcare</h2>
        <p className="pb-10">
          În cazul în care evenimentul are loc în afara orelor de program, Autonom Assistance va
          depozita mașina avariată fără costuri până în prima zi lucratoare a unității reparatoare
          selectate de către Client. Autonom Assistance va acoperi costurile serviciului pe o
          perioadă de 5 zile, în limita a 50 RON pe zi TVA inclus.
        </p>
      </section>
      <section>
        <h2 className="text-black-lightest text-lg font-medium mb-2">
          Recuperare din afara carosabilului
        </h2>
        <p className="pb-10">
          Serviciul de recuperare din afara carosabilului a autoturismului eligibil în urma unui
          accident rutier este acoperit doar dacă ieșirea în afara carosabilului s-a produs ca
          urmare a unui accident/defecțiune survenită pe un drum asfaltat.
        </p>
      </section>
      <section className="border-b-gray-lightest">
        <h2 className="text-black-lightest text-lg font-medium mb-2">Repatriere pasageri</h2>
        <p className="pb-10">
          Serviciul de transport al pasagerilor aflați în autovehiculul imobilizat din locația
          imobilizarii în România. Limita de despăgubire este 500 EURO/eveniment TVA inclus. Numărul
          pasagerilor nu poate depăși numărul de locuri înscrise în certificatul de înmatriculare al
          autoturismului. Autonom Assistance va organiza acest serviciu numai daca s-a efectuat
          serviciul de TRACTARE către o unitate reparatoare agreată și doar în cazul în care
          reparația mașinii imobilizate nu poate fi finalizată în termen de 10 zile lucratoare.
        </p>
      </section>
      <section className="border-b-gray-lightest">
        <h2 className="text-black-lightest text-lg font-medium mb-2">Repatriere mașină</h2>
        <p className="pb-10">
          Serviciul de transport al autovehiculului imobilizat, în limita a 1000 EURO TVA inclus.
          Autonom Assistance va efectua acest serviciu numai dacă a fost realizat serviciul de
          tractare locală și în cazul în care reparația autovehiculului imobilizate depășește 7 zile
          lucrătoare. Termenul de 7 zile se aplică doar pentru abonamentele cu acoperire la nivel
          european. În cazul unui eveniment rutier pe teritoriul României, soldat cu imobilizarea
          autovehiculului, repatrierea se va efectua fără limita de 7 zile, în funcție de caz.
        </p>
      </section>
    </>
  ) : (
    <></>
  )
}

export default RomanianRoadAssistanceEUDescription
