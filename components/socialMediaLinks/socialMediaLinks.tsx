import { SocialMediaItem } from '../socialMediaItem/socialMediaItem'

interface Item {
  href: string
  ariaLabel: string
  imgSrc: string
}

export interface SocialMediaLinksProps {
  socialMedias: Item[]
}

export const SocialMediaLinks = ({ socialMedias }: SocialMediaLinksProps): JSX.Element => {
  return (
    <>
      {socialMedias.map((item: Item, index: number) => (
        <SocialMediaItem
          key={index}
          href={item.href}
          ariaLabel={item.ariaLabel}
          imgSrc={item.imgSrc}
        />
      ))}
    </>
  )
}
