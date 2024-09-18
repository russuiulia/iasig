import styles from './isgErrorCard.module.scss'
export interface ErrorCardProps {
  content: string
  className?: string
}
export const ErrorCard = ({ content, className }: ErrorCardProps): JSX.Element => {
  return <div className={`${styles.containerDanger} alert-danger ${className}`}>{content}</div>
}
