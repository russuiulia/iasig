import { useTranslation } from '~/context/LanguageContext'
import { useGreenCardContext } from '~/modules/greenCard/green-card-context/green-card-context'
import { GreenCardSteps } from '~/modules/greenCard/green-card-context/green-card-context.types'
import { FaqItem } from '../faqItem/faqItem'
import { greenCardFaqsJson } from './greenCardFaq.constants'

const GreenCardFaq = ({ lang }): JSX.Element => {
  const { activeStep } = useGreenCardContext()
  const { translate } = useTranslation()

  return activeStep === GreenCardSteps.InsuranceDetails ? (
    <section className="text-left md:text-center pt-20 pb-40">
      <h2 className="mb-6 md:mb-10 2xl:text-5xl md:text-4xl text-2xl">{translate('faq-title')}</h2>
      <dl className="space-y-2 border-b-gray-lightest w-full lg:w-8/12 mx-auto">
        {greenCardFaqsJson[lang].map((faq, index) => (
          <FaqItem
            key={`greenCard_faq_${lang}_${index + 1}`}
            question={faq.questionName}
            answer={faq.acceptedAnswerText}
          />
        ))}
      </dl>
    </section>
  ) : (
    <></>
  )
}

export default GreenCardFaq
