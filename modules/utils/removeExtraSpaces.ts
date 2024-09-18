export const removeExtraSpaces = (value: string) => {
  return value
    ? value
        ?.split(/\s+/)
        ?.filter((word) => word !== '')
        ?.join(' ')
    : ''
}
