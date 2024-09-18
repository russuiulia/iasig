/* eslint-disable @next/next/no-img-element */

export interface SocialMediaItemProps {
  href: string
  ariaLabel: string
  imgSrc: string
}

export const SocialMediaItem = ({ href, ariaLabel, imgSrc }: SocialMediaItemProps): JSX.Element => {
  return (
    <a target="_blank" rel="noreferrer" href={href} aria-label={ariaLabel} className="mr-6">
      <img src={imgSrc} alt={ariaLabel} width={24} height={24} />
    </a>
  )
}
