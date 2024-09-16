export interface Validation<T> {
  isValid: boolean
  field?: string
  type?: T
}
