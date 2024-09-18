import { useTranslation } from '~/context/LanguageContext'
import { useRcaContext } from '~/modules/rca/rca-context/rca-context'
import { RcaSteps } from '~/modules/rca/rca-context/rca-context.types'
import { FaqItem } from '../faqItem/faqItem'
import { rcaFaqsJson } from './rcaFaq.constants'

const RcaFaq = ({ lang }): JSX.Element => {
  const { activeStep } = useRcaContext()
  const { translate } = useTranslation()

  return activeStep === RcaSteps.InsuredDetails ? (
    <section className="text-left md:text-center pt-20 pb-40">
      <h2 className="mb-6 md:mb-10 2xl:text-5xl md:text-4xl text-2xl">{translate('faq-title')}</h2>
      <dl className="space-y-2 border-b-gray-lightest w-full lg:w-8/12 mx-auto">
        {rcaFaqsJson[lang].map((faq, index) => (
          <FaqItem
            key={`rca_faq_${lang}_${index + 1}`}
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

export default RcaFaq
