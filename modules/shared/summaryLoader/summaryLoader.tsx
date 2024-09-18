import React, { useEffect, useState } from 'react'
import ContentLoader from 'react-content-loader'

export const SummaryLoader = (): JSX.Element | null => {
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  if (!hasMounted) {
    return null
  }

  return <LoadForm />
}

const LoadForm = (): JSX.Element => {
  return (
    <ContentLoader
      speed={2}
      height={380}
      backgroundColor="#f3f3f3"
      foregroundColor="#ecebeb"
      style={{
        backgroundColor: '#f5f6f8',
      }}
      className="w-full my-4"
    >
      <rect x="24" y="29" rx="3" ry="3" width="22%" height="26" />
      <rect x="73.3%" y="29" rx="3" ry="3" width="25%" height="26" />

      <rect x="24" y="70" rx="3" ry="3" width="22%" height="48" />
      <rect x="40.8%" y="70" rx="3" ry="3" width="57.5%" height="48" />

      <rect x="24" y="127" rx="3" ry="3" width="20%" height="26" />
      <rect x="79.8%" y="127" rx="3" ry="3" width="18.5%" height="26" />

      <rect x="24" y="159" rx="3" ry="3" width="20%" height="26" />
      <rect x="79.8%" y="159" rx="3" ry="3" width="18.5%" height="26" />

      <rect x="24" y="190" rx="3" ry="3" width="20%" height="26" />
      <rect x="74.5%" y="190" rx="3" ry="3" width="23.8%" height="26" />

      <rect x="24" y="222" rx="3" ry="3" width="27%" height="26" />
      <rect x="79.8%" y="222" rx="3" ry="3" width="18.5%" height="26" />

      <rect x="24" y="253" rx="3" ry="3" width="20%" height="26" />
      <rect x="79.8%" y="253" rx="3" ry="3" width="18.5%" height="26" />

      <rect x="24" y="295" rx="3" ry="3" width="94.5%" height="1.7" />

      <rect x="24" y="311.5" rx="3" ry="3" width="17%" height="26" />
      <rect x="82.8%" y="311.5" rx="3" ry="3" width="15.5%" height="26" />
    </ContentLoader>
  )
}
