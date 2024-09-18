import ContentLoader from 'react-content-loader'

export const PriceSummaryLoader = (): JSX.Element => {
  return (
    <ContentLoader
      speed={1}
      height={157}
      backgroundColor="#E5E7EB"
      foregroundColor="#E5E7EB"
      style={{
        backgroundColor: '#F2F5F8',
      }}
      animate={true}
      className="w-full mx-auto mb-8 mt-6 rounded-2xl px-6 py-8"
    >
      <rect x="0" y="0" rx="3" ry="3" width="100%" height="20" />

      <rect x="0" y="28" rx="3" ry="3" width="100%" height="20" />

      <rect x="0" y="56" rx="3" ry="3" width="100%" height="1" />

      <rect x="0" y="84" rx="3" ry="3" width="100%" height="20" />
    </ContentLoader>
  )
}
