import { Disclosure } from '@headlessui/react'

export const FaqItem = ({
  question,
  answer,
}: {
  question: string
  answer: string
}): JSX.Element => {
  return (
    <Disclosure as="div" className="py-4 m-0 border-b border-b-gray-lightest">
      {({ open }) => (
        <>
          <dt>
            <Disclosure.Button className="text-left w-full flex justify-between items-start text-gray-400 focus:outline-none">
              <span className={`text-black-lightest flex-1 font-medium`}>{question}</span>
              <span className="ml-6 h-7 flex items-center">
                {open ? (
                  <img
                    alt="drop-up"
                    src="/images/dropdown.svg"
                    width={24}
                    height={28}
                    className="transform rotate-180"
                  />
                ) : (
                  <img alt="drop-down" src="/images/dropdown.svg" width={24} height={28} />
                )}
              </span>
            </Disclosure.Button>
          </dt>
          <Disclosure.Panel as="dd" className="mt-2 pr-12 text-left">
            <p
              className="text-left"
              dangerouslySetInnerHTML={{
                __html: answer,
              }}
            />
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  )
}
