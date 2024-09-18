/* eslint-disable @next/next/no-img-element */
import { IsgImage } from '../isgImage/isgImage'
import styles from './isgHeader.module.scss'
export interface Props {
  title: string
  subtitle?: string
  color?: string
  imgSrc?: string
  smallHeader?: boolean
  textHeaderAlign?: string
  imgCloudflare?: boolean
}

export const IsgHeader = ({
  title,
  subtitle,
  color,
  imgSrc,
  smallHeader = false,
  imgCloudflare = true,
  textHeaderAlign = 'text-center',
}: Props): JSX.Element => {
  return (
    <>
      <div className={`${styles.headerImg} absolute top-0 z-0`} />
      {title || subtitle ? (
        <div className="relative container">
          <div
            id="header"
            className={`${smallHeader ? 'pt-4' : 'pt-14'} w-full flex flex-col h-full ${
              styles[`${color}Card`] || ''
            } rounded-2xl  ${color || imgSrc ? 'md:pb-14 mt-52 pb-4' : 'pt-20'}`}
          >
            {imgSrc && (
              <div className="right-0 left-0 mx-auto md:w-96 w-76 -mt-40 md:-mt-54">
                <IsgImage
                  src={imgSrc}
                  imgCloudflare={imgCloudflare}
                  className="object-contain mx-auto md:h-56 h-36"
                  showOriginal={false}
                />
              </div>
            )}
            <section className={`${textHeaderAlign} sm:pt-8 md:pt-0`}>
              <h1 className={`md:text-6xl text-3xl ${subtitle ? 'md:mb-6' : ''} mb-2`}>{title}</h1>
              {subtitle ? (
                <p className="text-sm md:text-lg text-black-lightest px-1 md:px-10">{subtitle}</p>
              ) : null}
            </section>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  )
}
