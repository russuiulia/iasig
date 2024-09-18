import React from 'react'
import { useMedicalContext } from '~/modules/medical/medical-context/medical-context'
import { MedicalSteps } from '~/modules/medical/medical-context/medical-context.types'

const RussianTravelDescription = (): JSX.Element => {
  const { activeStep } = useMedicalContext()

  return activeStep === MedicalSteps.TravelDetails ? (
    <>
      <section>
        <h2 className="text-black-lightest text-lg font-medium mb-2">Покрытие</h2>
        <p>
          Медицинское страхование для путешествий за границу покрывают неожиданные и необходимые
          расходы, возникшие вследствие острого заболевания или личной травмы в результате
          несчастного случая и смерти за пределами своей родной страны. Полис включает в себя
          расходы на экстренную медицинскую помощь, госпитализацию, экстренную операцию, экстренную
          репатриацию в случае смерти и другие связанные расходы. Некоторые страховые компании также
          покрывают отмену или прерывание поездки и стоматологическое лечение. Страховые суммы
          варьируются от 5 000 евро до 60 000 евро в зависимости от места назначения путешествия.
          Условия страхования нескольких компаний, включая:
        </p>
        <ul className="list-disc text-pink list-inside">
          <li className="underline">
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={`${process.env.NEXT_PUBLIC_HOST}ru/travel/grawe`}
            >
              Grawe
            </a>
          </li>
          <li className="underline">
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={`${process.env.NEXT_PUBLIC_HOST}ru/travel/intact`}
            >
              Intact
            </a>
          </li>
          <li className="underline">
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={`${process.env.NEXT_PUBLIC_HOST}ru/travel/donaris`}
            >
              Donaris
            </a>
          </li>
          <li className="underline">
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={`${process.env.NEXT_PUBLIC_HOST}ru/travel/moldcargo`}
            >
              Moldcargo
            </a>
          </li>
          <li className="underline">
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={`${process.env.NEXT_PUBLIC_HOST}ru/travel/transelit`}
            >
              Transelit
            </a>
          </li>
        </ul>{' '}
        <p className="pb-10">могут быть рассмотрены для всех перечисленных предложений.</p>
      </section>
      <section>
        <h2 className="text-black-lightest text-lg font-medium mb-2">Стоимость</h2>
        <p>
          Стоимость страховки для одной поездки рассчитывается на дневной основе и зависит от
          страховой компании, направления путешествия, застрахованной суммы, возраста
          застрахованного и дополнительных рисков. В отличие от этого, многоразовая страховка, или
          мультивиза, имеет фиксированную цену на определенный период. Цены на одноразовую и
          многоразовую страховку указаны в EUR, а пользователь платит в MDL по курсу BNM.
        </p>
        <p className="mt-2 pb-10">
          Чтобы узнать точную цену и сравнить предложения для вашего направления путешествия, просто
          заполните форму, предоставленную{' '}
          <a className="text-pink" href="#steps-menu">
            выше
          </a>
          .
        </p>
      </section>
      <section>
        <h2 className="text-black-lightest text-lg font-medium mb-2">Исключения</h2>
        <p>
          Полис страхования путешественников не покрывает предварительно существующие медицинские
          состояния, высокорискованные действия (например, экстремальные виды спорта), незаконные
          действия, самопричиненные травмы, психические заболевания. Другие исключения включают
          расходы, связанные с беременностью, природными катастрофами или эпидемиями и неотложной
          медицинской помощью. У каждой страховой компании есть свой список действий, которые не
          покрываются. Для получения подробного списка исключений для каждой компании вы можете
          проверить здесь:
        </p>
        <ul className="list-disc text-pink list-inside pb-10">
          <li className="underline">
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={`${process.env.NEXT_PUBLIC_HOST}ru/travel/grawe/#grawe-uninsured-risks`}
            >
              Grawe
            </a>
          </li>
          <li className="underline">
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={`${process.env.NEXT_PUBLIC_HOST}ru/travel/intact/#intact-uninsured-risks`}
            >
              Intact
            </a>
          </li>
          <li className="underline">
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={`${process.env.NEXT_PUBLIC_HOST}ru/travel/donaris/#donaris-uninsured-risks`}
            >
              Donaris
            </a>
          </li>
          <li className="underline">
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={`${process.env.NEXT_PUBLIC_HOST}ru/travel/moldcargo/#moldcargo-uninsured-risks`}
            >
              Moldcargo
            </a>
          </li>
          <li className="underline">
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={`${process.env.NEXT_PUBLIC_HOST}ru/travel/transelit/#transelit-uninsured-risks`}
            >
              Transelit
            </a>
          </li>
        </ul>
      </section>
      <section>
        <h2 className="text-black-lightest text-lg font-medium mb-2">Страховой случай</h2>
        <p className="pb-10">
          Застрахованный должен немедленно связаться с компанией по оказанию помощи страховщика в
          случае страхового случая и предоставить необходимую информацию. Страховщик организует
          медицинскую помощь и другие необходимые услуги в соответствии с условиями страхового
          договора. Застрахованный должен предъявить свою страховую полис медицинскому персоналу и
          сообщить страховщику в письменной форме обо всех расходах, связанных со страховым случаем.
          Соответствующие документы должны быть представлены страховщику в течение 30 календарных
          дней, а страховщик завершает расследование и определяет размер возмещения в течение
          месяца. В случае невозможности установления обстоятельств страховщик откладывает
          рассмотрение и уведомляет о причинах.
        </p>
      </section>
      <section className="border-b-gray-lightest">
        <h2 className="text-black-lightest text-lg font-medium mb-2">Сервисный центр</h2>
        <ul className="list-inside list-decimal pb-40">
          <li>
            Свяжитесь незамедлительно с компанией помощи в соответствии с полисом страхования.
          </li>
          <li>
            Уведомите Компанию помощи на румынском или английском языках, указав имя
            застрахованного, номер полиса, телефон, по которому можно связаться с вами за границей,
            и детали произошедшего случая.
          </li>
          <li>
            В случае госпитализации застрахованный или врач должны уведомить Компанию помощи в
            течение 48 часов, в противном случае Компания не сможет принять решение о возмещении
            расходов на госпитализацию.
          </li>
          <li>
            Если вы решили не использовать страховку и оплатить услуги независимо, попросите врача
            предоставить вам все документы, подтверждающие диагноз и госпитализацию, в оригинале,
            подписанные и опечатанные.
          </li>
          <li>
            Если вы заплатили за услуги независимо, в течение 24 часов после оплаты вы должны
            сообщить Компании помощи дату и сумму расходов. Сохраняйте все оригинальные квитанции и
            счета за полученные услуги, связанные с застрахованным случаем.
          </li>
          <li>
            В течение 30 календарных дней с даты возвращения с поездки вы должны связаться со
            страховой компанией, чтобы подать заявку на страховое возмещение.
          </li>
          <li>
            В случае смерти застрахованного в результате застрахованного случая родственники или
            доверенное лицо должны уведомить Страховщика в течение 48 часов.
          </li>
          <li>
            Если у вас есть хронические заболевания или другие патологии, обязательно возьмите с
            собой все необходимые лекарства во время поездки.
          </li>
        </ul>
      </section>
    </>
  ) : (
    <></>
  )
}

export default RussianTravelDescription
