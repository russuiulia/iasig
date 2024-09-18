import { IsgButton } from '~/components/shared/isgButton/isgButton'
import { sendContactEmail } from '~/services/api.services'
import { useForm } from 'react-hook-form'
import { emailValidator } from '~/constants/validators'
import { useState, BaseSyntheticEvent } from 'react'
import { SuccessAlert } from '../../successAlert/successAlert'
import { DangerAlert } from '../../dangerAlert/dangerAlert'
import { IsgHeader } from '~/components/shared/isgHeading/isgHeader'
import { useTranslation } from '~/context/LanguageContext'
import { NextSeo } from 'next-seo'

export const ContactPage = (): JSX.Element => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [danger, setDanger] = useState(false)

  const { translate } = useTranslation()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ mode: 'onBlur' })

  const onSubmit = async (data): Promise<void> => {
    setLoading(true)
    const res = await sendContactEmail(data)
    if (res) {
      setSuccess(true)
      setDanger(false)
      resetDefaultValues()
    } else {
      setDanger(true)
      setSuccess(false)
    }
    setLoading(false)
    hideAlert()
  }

  const resetDefaultValues = () => {
    reset(
      {
        name: '',
        email: '',
        message: '',
      },
      {
        keepErrors: true,
        keepDirty: true,
      }
    )
  }

  const hideAlert = (): void => {
    setTimeout(() => {
      setDanger(false)
      setSuccess(false)
    }, 3000)
  }

  const validateEmail = (email: string): boolean => {
    return emailValidator.test(email)
  }

  return (
    <>
      <IsgHeader
        title={translate('title', 'contact')}
        imgSrc="c13aa955-3ce1-4306-fe53-17dbe71d0600"
      />
      <NextSeo
        languageAlternates={[
          {
            hrefLang: 'ro',
            href: `${process.env.NEXT_PUBLIC_HOST}contact/`,
          },
          {
            hrefLang: 'ru',
            href: `${process.env.NEXT_PUBLIC_HOST}ru/contact/`,
          },
          {
            hrefLang: 'en',
            href: `${process.env.NEXT_PUBLIC_HOST}en/contact/`,
          },
        ]}
      />
      <div className="container">
        <div className="px-4 md:pb-24 pb-14">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-6">
              <label htmlFor="contactName">{translate('name', 'contact')}</label>
              <div className="mt-1">
                <input
                  id="contactName"
                  type="text"
                  {...register('name', {
                    required: {
                      value: true,
                      message: translate('fieldRequired:error'),
                    },
                  })}
                  defaultValue={name}
                  onChange={(e: BaseSyntheticEvent) => setName(e.target.value)}
                />
                <p className="text-danger">{errors.name?.message}</p>
              </div>
            </div>
            <div className="mb-6">
              <label htmlFor="contactEmail">{translate('email', 'contact')}</label>
              <div className="mt-1">
                <input
                  id="formEmail"
                  type="email"
                  {...register('email', {
                    required: {
                      value: true,
                      message: translate('fieldRequired:error'),
                    },
                    validate: validateEmail,
                  })}
                  defaultValue={email}
                  onChange={(e: BaseSyntheticEvent) => {
                    if (validateEmail(e.target.value)) {
                      setEmail(e.target.value)
                    }
                  }}
                />
                <p className="text-danger">
                  {errors.email?.type === 'validate'
                    ? translate('email:error')
                    : errors.email?.message}
                </p>
              </div>
            </div>
            <div>
              <label htmlFor="contactMessage">{translate('message', 'contact')}</label>
              <div className="mt-1">
                <textarea
                  id="contactMessage"
                  rows={4}
                  {...register('message', {
                    required: {
                      value: true,
                      message: translate('fieldRequired:error'),
                    },
                  })}
                  defaultValue={message}
                  onChange={(e: BaseSyntheticEvent) => setMessage(e.target.value)}
                />
                <p className="text-danger">{errors.message?.message}</p>
              </div>
            </div>

            {success && <SuccessAlert success={success} />}
            {danger && (
              <DangerAlert
                text={translate('failed-message')}
                danger={danger}
                close={() => setDanger(false)}
              />
            )}
            <div className="flex justify-center">
              <IsgButton
                type="submit"
                imgSrc="/images/white-arrow.svg"
                text={translate('send-message')}
                styleClass="mt-6 py-4 h-12 sm:w-44 w-full"
                isLoading={loading}
              />
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
