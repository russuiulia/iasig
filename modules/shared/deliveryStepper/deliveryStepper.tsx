import { HiOutlineCheck } from 'react-icons/hi'
import { IoIosClose } from 'react-icons/io'
import { ProgressBar, Step } from 'react-step-progress-bar'
import { Spinner } from '~/components/shared/spinner/spinner'
import { useTranslation } from '~/context/LanguageContext'
import styles from './deliveryStepper.module.scss'
import { DELIVERY_STATUS } from './deliveryStepper.constants'

export interface DeliveryStepper {
  status: DELIVERY_STATUS
}

export const DeliveryStepper = ({ status }: DeliveryStepper): JSX.Element => {
  const { translate } = useTranslation()
  const percentByStatus = {
    [DELIVERY_STATUS.SCHEDULED]: { percent: 50 },
    [DELIVERY_STATUS.DELIVERED]: { percent: 100 },
    [DELIVERY_STATUS.CANCELED]: { percent: 100 },
  }

  return status ? (
    <div className={`${styles.progressContainer}`}>
      <ProgressBar height={2} percent={percentByStatus[status].percent} filledBackground="#EDF1F6">
        <Step>
          {() => (
            <div style={{ display: 'block', position: 'relative' }}>
              <div
                className={`${styles.circleContainer} ${
                  status === DELIVERY_STATUS.SCHEDULED ? styles.scale : ''
                }`}
              >
                <div
                  className={`${styles.circle} ${
                    percentByStatus[status].percent < 50 ? styles.circleInactive : ''
                  }`}
                >
                  {[DELIVERY_STATUS.SCHEDULED].includes(status) ? <Spinner /> : null}
                  {[DELIVERY_STATUS.DELIVERED].includes(status) ? (
                    <HiOutlineCheck className={styles.check} />
                  ) : null}
                  {[DELIVERY_STATUS.CANCELED].includes(status) ? (
                    <IoIosClose className={styles.close} />
                  ) : null}
                </div>
              </div>
              <div className={styles.stepTitle}>{translate(DELIVERY_STATUS.SCHEDULED)}</div>
            </div>
          )}
        </Step>
        <Step>
          {() => (
            <div style={{ display: 'block', position: 'relative' }}>
              <div>
                <div
                  className={`${styles.circle} ${
                    percentByStatus[status].percent < 100 ? styles.circleInactive : ''
                  }`}
                >
                  {[DELIVERY_STATUS.DELIVERED].includes(status) ? (
                    <HiOutlineCheck className={styles.check} />
                  ) : null}
                  {[DELIVERY_STATUS.CANCELED].includes(status) ? (
                    <IoIosClose className={styles.close} />
                  ) : null}
                </div>
              </div>
              <div className={styles.stepTitle}>
                {translate(
                  status === DELIVERY_STATUS.CANCELED
                    ? DELIVERY_STATUS.CANCELED
                    : DELIVERY_STATUS.DELIVERED
                )}
              </div>
            </div>
          )}
        </Step>
      </ProgressBar>
    </div>
  ) : (
    <></>
  )
}
