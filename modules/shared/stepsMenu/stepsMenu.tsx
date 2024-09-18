import { useTranslation } from '~/context/LanguageContext'

export interface StepsMenuProps {
  steps: string[]
  activeStep: string
  onChange: any
  cols?: number
}

// TODO: fix location where component is used to not relay on index, but on value
export const StepsMenu = ({
  steps,
  activeStep,
  onChange,
  cols = 3,
}: StepsMenuProps): JSX.Element => {
  const { translate } = useTranslation()

  return (
    <div
      className={`md:grid flex md:grid-cols-${cols} justify-center items-center md:pt-5 mb-10 xl:w-2/5 md:w-3/5 w-full mx-auto`}
      id="steps-menu"
    >
      {steps.map((value: string, index: number) => {
        const isActive =
          value == activeStep ? 'text-black-lightest border-black-lightest' : 'text-gray'

        return (
          <div
            key={value}
            className={`py-3 border-b-2 text-xxs flex-1 text-center ${isActive} font-medium`}
            role="button"
            tabIndex={-1}
            onClick={() => onChange(value)}
            // FIXME: is onKeyDown required here?
            onKeyDown={() => onChange(value)}
          >
            {index + 1}. {translate(`step-${value}`)}
          </div>
        )
      })}
    </div>
  )
}
