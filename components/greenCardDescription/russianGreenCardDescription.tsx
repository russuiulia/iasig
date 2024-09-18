import React, { useState } from 'react'
import { IoMdCalendar, IoMdCar, IoMdArrowDown, IoMdArrowForward } from 'react-icons/io'

import { BasicTooltip } from '../basicTooltip/basicTooltip'
import { ALL_PRICES, CATEGORIES, ZONES } from '~/constants'
import { useTranslation } from '~/context/LanguageContext'
import { useGreenCardContext } from '~/modules/greenCard/green-card-context/green-card-context'
import { GreenCardSteps } from '~/modules/greenCard/green-card-context/green-card-context.types'
import { GreenCardValues } from '~/modules/greenCard/green-card-validity/green-card-validity.constants'

const RussianGreenCardDescription = (): JSX.Element => {
  const { translate } = useTranslation()
  const [zone, setZone] = useState('CA')
  const { activeStep } = useGreenCardContext()

  return activeStep === GreenCardSteps.InsuranceDetails ? (
    <>
      <section>
        <h2 className="text-black-lightest text-lg font-medium mb-2">Покрытие</h2>
        <p>
          Карта Зеленая является обязательным страхованием гражданской ответственности за наружное
          использование моторных транспортных средств. Целью страхования является предоставление
          компенсации за ущерб, причиненный в результате аварий на моторных транспортных средствах,
          произошедших за пределами страны и вызванных транспортными средствами, зарегистрированными
          в Республике Молдова. Застрахованными рисками являются ущерб, понесенный третьими лицами,
          такими как телесные повреждения или смерть, повреждение или уничтожение имущества.
        </p>
        <p className="mt-2 pb-10">
          Застрахованная сумма определяется Национальными бюро автостраховщиков в странах, где
          произошла авария, в соответствии с законом о обязательном страховании гражданской
          ответственности за использование моторных транспортных средств, действующим на момент
          аварии.
        </p>
      </section>
      <section>
        <h2 className="text-black-lightest text-lg font-medium mb-2">Область действия</h2>
        <p>
          Система Зеленой Карты в настоящее время включает 46 стран, представленных национальными
          страховыми бюро, разделенных на 2 зоны:{' '}
        </p>
        <ul className="list-disc ml-10 pb-10">
          <li>Зона 1: Украина</li>
          <li>
            Зона 3: Все члены (Австрия, Албания, Андорра, Азербайджан, Бельгия, Болгария, Босния и
            Герцеговина, Швейцария, Кипр, Чехия, Германия, Дания, Испания, Эстония, Франция,
            Финляндия, Лихтенштейн, Греция, Венгрия, Хорватия, Италия, Иран, Ирландия, Исландия,
            Люксембург, Литва, Латвия, Мальта, Марокко, Северная Македония, Черногория, Норвегия,
            Нидерланды, Португалия, Польша, Румыния, Швеция, Словакия, Словения, Сербия, Тунис,
            Турция, Украина и Великобритания)
          </li>
        </ul>
      </section>
      <section>
        <h2 className="text-black-lightest text-lg font-medium mb-2">Стоимость</h2>
        <p>
          Страховая премия регулируется BNM и устанавливается в EUR, оплата производится в леях по
          курсу BNM на день оплаты. Цена на страховой полис "Зеленая карта" варьируется в
          зависимости от категории и направления транспортного средства, согласно таблице ниже. Для
          прицепов выдается отдельный полис "Зеленая карта", а цена составляет 10% от расчетной
          стоимости транспортного средства, которое буксирует прицеп.
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
                className={`tab-pane fadeoverflow-auto ${
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
        <h2 className="text-black-lightest text-lg font-medium mb-2">Допустимость</h2>
        <p className="pb-10">
          Компании страхования в Республике Молдова заключают контракты страхования Зелёная карта
          исключительно для транспортных средств, зарегистрированных в Республике Молдова. Чтобы
          заключить договор, необходимо иметь постоянный регистрационный сертификат.
        </p>
      </section>
      <section>
        <h2 className="text-black-lightest text-lg font-medium mb-2">Страховой случай</h2>
        <p className="pb-10">
          Процедура урегулирования убытков и выплаты компенсаций по страхованию ответственности
          перед третьими лицами, заключенному в рамках системы Зеленая Карта, осуществляется
          Национальными бюро по Зеленой Карте или их представителями, в соответствии с действующим
          законодательством и установленными процедурами. Если Национальные бюро могут выплатить
          компенсацию только через судебный процесс, Страховщик предоставит инструкции
          застрахованному лицу и выплатит убытки, предусмотренные решением суда. Возврат компенсаций
          и расходов, уплаченных третьим сторонам, осуществляется Страховщиком в запрошенной валюте.
        </p>
        <p className="pb-10">
          Для дополнительной помощи ознакомьтесь с прилагаемой к страховому полису контактной
          информацией нашей партнерской компании, специализирующейся на урегулировании международных
          претензий и поддержке в возмещении ущерба. Они помогают нашим клиентам упростить и
          ускорить процесс обработки претензий.
        </p>
      </section>
      <section className="border-b-gray-lightest">
        <h2 className="text-black-lightest text-lg font-medium mb-2">Расторжение</h2>
        <p>
          Контракт может быть изменен в любое время в период действия или до вступления в силу и
          должен быть оформлен письменно в зависимости от застрахованного периода. Страховой
          контракт может быть расторгнут по взаимному соглашению в письменной форме или решению
          суда. Расторжение контракта подразумевает прекращение защиты и возмещение страховых
          премий, за исключением случаев, когда страховщик уже выплатил компенсации или получил
          уведомление об аварии.
        </p>
        <p className="mt-2">
          *В случае страховых полисов, выданных на короткий срок, например, 15 дней или 1 месяц,
          частичное или полное возмещение страховой премии не будет произведено, если полис вступил
          в силу.
        </p>
        <p className="mt-2 pb-40">
          ** В случае любого контракта, который может быть расторгнут, страховщик может удержать
          комиссионное вознаграждение в размере 20% от рассчитанной суммы для возмещения.
        </p>
      </section>
    </>
  ) : (
    <></>
  )
}

export default RussianGreenCardDescription
