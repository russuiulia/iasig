/* eslint-disable @next/next/no-img-element */
export interface IsgDisclosureButtonProps {
  open: boolean
  onClick: () => void
}

export const IsgDisclosureButton = ({ open, onClick }: IsgDisclosureButtonProps): JSX.Element => {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center justify-center p-2 rounded-md hover:text-gray focus:outline-none focus:bg-transparent focus:text-black-lightest ring-transparent"
    >
      <span className="sr-only">Open main menu</span>
      {open ? (
        <img
          src="/images/close-icon.svg"
          alt="Close Icon"
          width={32}
          height={32}
          className="block"
          aria-hidden="true"
        />
      ) : (
        <img
          src="/images/menu-icon.svg"
          alt="menu"
          width={32}
          height={32}
          className="block"
          aria-hidden="true"
        />
      )}
    </button>
  )
}
