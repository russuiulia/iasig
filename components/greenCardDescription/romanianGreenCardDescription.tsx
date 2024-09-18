import React, { useState } from 'react'
import { IoMdCalendar, IoMdCar, IoMdArrowDown, IoMdArrowForward } from 'react-icons/io'

import { BasicTooltip } from '../basicTooltip/basicTooltip'
import { ALL_PRICES, CATEGORIES, ZONES } from '~/constants'
import { useTranslation } from '~/context/LanguageContext'
import { useGreenCardContext } from '~/modules/greenCard/green-card-context/green-card-context'
import { GreenCardSteps } from '~/modules/greenCard/green-card-context/green-card-context.types'
import { GreenCardValues } from '~/modules/greenCard/green-card-validity/green-card-validity.constants'

const RomanianGreenCardDescription = (): JSX.Element => {
  const { translate } = useTranslation()
  const [zone, setZone] = useState('CA')
  const { activeStep } = useGreenCardContext()

  return activeStep === GreenCardSteps.InsuranceDetails ? (
    <>
      <section>
        <h2 className="text-black-lightest text-lg font-medium mb-2">Acoperire</h2>
        <p>
          Cartea Verde este o asigurare obligatorie de răspundere civilă auto externă. Obiectul
          asigurării constă în acordarea despăgubirii de asigurare pentru daune cauzate în
          rezultatul accidentelor de autovehicul produse în afara țarii de catre vehicule
          înmatricualate în Republica Moldova. Riscurile asigurate includ prejudiciile suferite de
          terţe persoane, precum vătămarea corporală sau decesul, avarierea sau distrugerea
          bunurilor.
        </p>
        <p className="mt-2 pb-10">
          Suma asigurată se stabileşte de către Birourile Naţionale ale Asigurătorilor de
          Autovehicule din ţările unde s-a produs accidentul, în conformitate cu legea privind
          asigurarea obligatorie de răspundere civilă auto în vigoare la momentul accidentului.
        </p>
      </section>
      <section>
        <h2 className="text-black-lightest text-lg font-medium mb-2">Teritorii de valabilitate</h2>
        <p>
          Sistemul de Carte Verde cuprinde în prezent 46 de țări reprezentate de birouri naționale
          de asigurări, categorizate în 2 zone:
        </p>
        <ul className="list-disc ml-10">
          <li>Zona 1: Ucraina</li>
          <li>
            Zona 3: Toate țările membre (Austria, Albania, Andorra, Azerbaijan, Belgia, Bulgaria,
            Bosnia și Herzegovina, Elveția, Cipru, Republica Cehă, Germania, Danemarca, Spania,
            Estonia, Franța, Finlanda, Liechtenstein, Grecia, Ungaria, Croația, Italia, Iran,
            Irlanda, Islanda, Luxemburg, Lituania, Letonia, Malta, Maroc, Macedonia de Nord,
            Muntenegru, Norvegia, Olanda, Portugalia, Polonia, România, Suedia, Slovacia, Slovenia,
            Serbia, Tunisia, Turcia, Ucraina și Regatul Unit)
          </li>
        </ul>
      </section>
      <section>
        <h2 className="text-black-lightest text-lg font-medium mb-2">Cost</h2>
        <p>
          Prima de asigurare este reglementată de catre BNM și este stabilită în EUR, plata se
          efectuează în lei la cursul BNM în ziua plății. Prețul poliței de asigurare carte verde
          variază în funcție de categoria vehiculului și destinație conform tabelului de mai jos.
          Pentru remorcă se emite o carte verde separată, iar prețul acesteia este de 10% din
          valoarea calculată pentru vehiculul care tractează remorca.
        </p>
        <div className="pb-10">
          <ul className="flex flex-row list-none border-b-0 pl-0 mb-4" role="tablist">
            {ZONES.map((value) => (
              <li
                className={`flex-1 border-b-2 ${
                  zone === value
                    ? 'border-b-black-lightest text-black-lightest'
                    : 'border-b-gray-lightest'
                } lg:text-base text-xxs`}
                role="presentation"
                key={value}
              >
                <button
                  className="mx-auto block lg:py-3 py-1 hover:opacity-80 focus:opacity-80"
                  role="tab"
                  onClick={() => setZone(value)}
                >
                  {translate(`zone:${value}`, 'greenCard')}
                </button>
              </li>
            ))}
          </ul>
          {ZONES.map((value) => (
            <div className="tab-content text-black-lightest" id="tabs-tabContent" key={value}>
              <div
                className={`tab-pane fade overflow-auto ${
                  zone === value ? 'block transition duration-75' : 'hidden'
                }`}
                id={`tabs-${value}`}
                role="tabpanel"
              >
                <table className="border text-center w-full table-auto">
                  <thead className="border-b">
                    <tr className="bg-gray-lightest">
                      <th
                        scope="col"
                        className="lg:text-base text-xs font-medium lg:p-2 p-1 border-r"
                      >
                        <div className="flex items-center justify-center">
                          <IoMdCalendar />
                          <IoMdArrowDown className="md:mr-1" /> / <IoMdCar className="md:ml-1" />
                          <IoMdArrowForward />
                        </div>
                      </th>
                      <th
                        scope="col"
                        className="lg:text-base text-xxs font-medium text-center lg:p-2 p-1 border-r"
                      >
                        <BasicTooltip title={translate('vehicle:A', 'greenCard')}>
                          <img
                            src="/images/car-up-to-9-seats.svg"
                            alt="car up to 9 seats"
                            width="30px"
                            height="15px"
                            className="mx-auto"
                          />
                        </BasicTooltip>
                      </th>
                      <th
                        scope="col"
                        className="lg:text-base text-xxs font-medium text-center lg:p-2 p-1 border-r"
                      >
                        <BasicTooltip title={translate('vehicle:C1', 'greenCard')}>
                          <img
                            src="/images/truck-up-to-3-t.svg"
                            alt="truck up to 3 t"
                            width="30px"
                            height="15px"
                            className="mx-auto"
                          />
                        </BasicTooltip>
                      </th>
                      <th
                        scope="col"
                        className="lg:text-base text-xxs font-medium text-center lg:p-2 p-1 border-r"
                      >
                        <BasicTooltip title={translate('vehicle:C2', 'greenCard')}>
                          <img
                            src="/images/truck-above-3-t.svg"
                            alt="truck above 3 t"
                            width="30px"
                            height="15px"
                            className="mx-auto"
                          />
                        </BasicTooltip>
                      </th>
                      <th
                        scope="col"
                        className="lg:text-base text-xxs font-medium text-center lg:p-2 p-1 border-r"
                      >
                        <BasicTooltip title={translate('vehicle:E1', 'greenCard')}>
                          <img
                            src="/images/van-up-to-17-seats.svg"
                            alt="van up to 17 seats"
                            width="30px"
                            height="15px"
                            className="mx-auto"
                          />
                        </BasicTooltip>
                      </th>
                      <th
                        scope="col"
                        className="lg:text-base text-xxs font-medium text-center lg:p-2 p-1 border-r"
                      >
                        <BasicTooltip title={translate('vehicle:E2', 'greenCard')}>
                          <img
                            src="/images/bus-above-17-seats.svg"
                            alt="bus above 17 seats"
                            width="30px"
                            height="15px"
                            className="mx-auto"
                          />
                        </BasicTooltip>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {GreenCardValues.map((value, index) => (
                      <tr className="border-b" key={value}>
                        <td className="lg:p-2 p-1 whitespace-nowrap md:text-base text-xxs text-black-lightest border-r">
                          {translate(`validity:${value}`)}
                        </td>
                        {CATEGORIES.map((category) => (
                          <td
                            className="lg:p-2 p-1 whitespace-nowrap md:text-base text-xxs text-black-lightest border-r"
                            key={category}
                          >
                            € {ALL_PRICES[zone][index][value][category].toFixed(2)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-black-lightest text-lg font-medium mb-2">Eligibilitate</h2>
        <p className="pb-10">
          Companiile de asigurare din Republica Moldova, încheie contracte de asigurare Carte Verde
          exclusiv pentru autovehicule înmatriculate în Republica Moldova. Pentru a putea încheia
          contractul este necesar să dețineți certificatul de înmatriculare permanent.
        </p>
      </section>
      <section>
        <h2 className="text-black-lightest text-lg font-medium mb-2">Acțiuni în caz de daună</h2>
        <p className="pb-10">
          Evaluarea pagubelor şi plata despăgubirilor pentru asigurarea de răspundere civilă auto
          externă se fac de către Birourile Naţionale Carte Verde sau corespondenţii lor, conform
          legislaţiei în vigoare şi procedurilor stabilite. În cazul în care Birourile Naţionale nu
          pot plăti despăgubirile decât prin intermediul unui proces judiciar, Asigurătorul va oferi
          instrucţiuni asiguratului şi va plăti daunele prevăzute de hotărârea judecătorească.
          Rambursarea despăgubirilor şi cheltuielilor plătite terţelor păgubite se face de către
          Asigurător în valuta solicitată.
        </p>
        <p className="pb-10">
          Pentru asistenţă suplimentară, ataşat la poliţa de asigurare, găsiţi datele de contact ale
          unei companii cu care avem un parteneriat şi este specializată în regularizarea daunelor
          internaţionale și asistență în reclamații cu privire la recuperarea prejudiciilor.
        </p>
      </section>
      <section className="border-b-gray-lightest">
        <h2 className="text-black-lightest text-lg font-medium mb-2">Reziliere</h2>
        <p>
          Modificarea contractului poate fi efectuată în orice moment în interiorul perioadei de
          valabilitate sau până la intrarea în vigoare și trebuie să fie în formă scrisă în
          dependeță de *perioada asigurată. Contractul de asigurare poate fi reziliat de către părți
          prin acord scris sau hotărârea instanței. Rezilierea contractului presupune încetarea
          protecției și restituirea primelor de asigurare, cu excepția cazurilor în care
          asigurătorul a efectuat deja plăți de despăgubire sau a primit un aviz de accident.
        </p>
        <p className="mt-2">
          *În cazul polițelor emise pentru o perioadă scurtă de timp, cum ar fi 15 zile sau 1 lună,
          daca polița a intrat in vigoare nu se acordă rambursări parțiale sau integrale ale primei
          de asigurare.
        </p>
        <p className="mt-2 pb-40">
          **În cazul oricărui contract care poate fi reziliat, asigurătorul poate reține un comision
          de gestiune de 20% din suma calculată spre rambursare.
        </p>
      </section>
    </>
  ) : (
    <></>
  )
}

export default RomanianGreenCardDescription
