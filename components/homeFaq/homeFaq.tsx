import { useTranslation } from '~/context/LanguageContext'
import { FaqItem } from '../faqItem/faqItem'
import { homeFaqsJson } from './homeFaq.constants'

const HomeFaq = ({ lang }): JSX.Element => {
  const { translate } = useTranslation()

  return (
    <section className="container">
      <h2 className="text-center md:pt-24 pt-14">{translate('faq-title')}</h2>
      <p className="text-center mt-6 md:mt-10">{translate('faq-subtitle')}</p>
      <div className="max-w-3xl mx-auto md:pb-48 pb-44">
        <dl className="mt-5 space-y-0">
          {homeFaqsJson[lang].map((faq, index) => (
            <FaqItem
              key={`home_faq_${lang}_${index + 1}`}
              question={faq.questionName}
              answer={faq.acceptedAnswerText}
            />
          ))}
        </dl>
      </div>
    </section>
  )
}

export default HomeFaq
