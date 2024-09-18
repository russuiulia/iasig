/* eslint-disable @next/next/no-img-element */
import { Spinner } from '../spinner/spinner'
export interface IsgButtonProps {
  text?: string
  styleClass?: string
  type?: any
  imgSrc?: string
  onClick?: any
  leftImgSrc?: string
  isLoading?: boolean
  isPink?: boolean
  isGhost?: boolean
  styleClassIcon?: string
  disabled?: boolean
  id?: string
}

export const IsgButton = ({
  text,
  styleClass,
  type,
  imgSrc,
  onClick,
  leftImgSrc,
  isLoading,
  styleClassIcon,
  isPink = true,
  isGhost = false,
  disabled = false,
  id = '',
}: IsgButtonProps): JSX.Element => {
  const leftImgSrcStyle = leftImgSrc ? 'ml-2' : ''
  const imgSrcStyle = imgSrc ? 'mr-3' : ''
  return (
    <button
      id={id}
      type={type}
      className={`btn inline-flex justify-center items-center ${
        disabled || isLoading ? 'opacity-50 pointer-events-none' : ''
      }  focus:shadow-outline hover:opacity-80  ${
        isPink ? 'text-white bg-pink rounded-full' : ''
      } ${
        isGhost ? 'text-pink border-dashed border-gray-100 border rounded inter-500 ' : ''
      } ${styleClass}`}
      disabled={disabled || isLoading}
      onClick={onClick}
    >
      {leftImgSrc ? (
        <img src={leftImgSrc} alt="icon" width={20} height={20} className={`${styleClassIcon}`} />
      ) : null}
      {isLoading ? (
        <>
          <p className={`${leftImgSrcStyle} mr-3`}>{text}</p>
          <Spinner />
        </>
      ) : (
        <>
          <span className={`${leftImgSrcStyle} ${imgSrcStyle}`}>{text}</span>
          {imgSrc ? <img src={imgSrc} alt="icon" className={`${styleClassIcon}`} /> : null}
        </>
      )}
    </button>
  )
}
