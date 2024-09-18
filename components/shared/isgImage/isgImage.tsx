/* eslint-disable @next/next/no-img-element */
export const IsgImage = ({
  width,
  height,
  src,
  className = '',
  showOriginal = true,
  showSmall = true,
  imgCloudflare = true,
}: {
  width?: number
  height?: number
  src: string
  className?: string
  showOriginal?: boolean
  showSmall?: boolean
  imgCloudflare?: boolean
}): JSX.Element => {
  const xlImage = showOriginal ? 'public' : 'medium'
  const smallImage = showSmall ? 'small' : 'medium'

  return (
    <picture>
      <source
        media="(max-width: 425px)"
        srcSet={imgCloudflare ? `${process.env.NEXT_PUBLIC_CF_LINK}/${src}/${smallImage}` : src}
      />
      <source
        media="(max-width: 768px)"
        srcSet={imgCloudflare ? `${process.env.NEXT_PUBLIC_CF_LINK}/${src}/medium` : src}
      />
      <img
        src={imgCloudflare ? `${process.env.NEXT_PUBLIC_CF_LINK}/${src}/${xlImage}` : src}
        alt="iAsig"
        width={width}
        height={height}
        className={className}
      />
    </picture>
  )
}
