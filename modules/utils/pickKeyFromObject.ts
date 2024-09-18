export const pickKeyFromObject = (obj: Record<string, any> | undefined, keys: string[]) => {
  if (!obj) {
    return {}
  }

  const result = {}
  Object.keys(obj).map((key) => {
    if (keys.includes(key)) {
      result[key] = obj[key]
    }
  })

  return result
}
