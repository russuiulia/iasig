import styles from './ellipsisLoader.module.scss'

export const EllipsisLoader = (): JSX.Element => {
  return (
    <div className={styles.loadingContainer}>
      <div className={styles.loadingEllipsis}></div>
    </div>
  )
}
