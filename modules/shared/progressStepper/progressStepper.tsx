import { HiOutlineCheck } from 'react-icons/hi'
import { IoIosClose } from 'react-icons/io'
import { ProgressBar, Step } from 'react-step-progress-bar'
import { Spinner } from '~/components/shared/spinner/spinner'
import { useTranslation } from '~/context/LanguageContext'
import { Status } from '~/interfaces/status'
import styles from './progressStepper.module.scss'

export interface ProgressStepperProps {
  status: Status
}

export const ProgressStepper = ({ status }: ProgressStepperProps): JSX.Element => {
  const { translate } = useTranslation()

  const percentByStatus = {
    [Status.DRAFT]: { percent: 50 },
    [Status.PAID]: { percent: 100 },
    [Status.PROCESSING]: { percent: 100 },
    [Status.ISSUED]: { percent: 100 },
    [Status.EXPIRED]: { percent: 50 },
    [Status.REFUNDED]: { percent: 50 },
    [Status.FAILED]: { percent: 100 },
    [Status.COMPLETED]: { percent: 100 },
  }
  const textSteps = {
    [Status.DRAFT]: {
      step1: `${translate('payment-waiting')}`,
      step2: `${translate('payment-status:completed')}`,
    },
    [Status.PAID]: {
      step1: `${translate('payment-status:paid')}`,
      step2: `${translate('payment-insurance-delivering')}`,
    },
    [Status.PROCESSING]: {
      step1: `${translate('payment-status:paid')}`,
      step2: `${translate('payment-insurance-delivering')}`,
    },
    [Status.ISSUED]: {
      step1: `${translate('payment-status:paid')}`,
      step2: `${translate('payment-insurance-delivering')}`,
    },
    [Status.EXPIRED]: {
      step1: `${translate('payment-status:expired')}`,
      step2: `${translate('payment-status:completed')}`,
    },
    [Status.REFUNDED]: {
      step1: `${translate('payment-status:refunded')}`,
      step2: `${translate('payment-status:completed')}`,
    },
    [Status.FAILED]: {
      step1: `${translate('payment-status:paid')}`,
      step2: `${translate('payment-status:failed')}`,
    },
    [Status.COMPLETED]: {
      step1: `${translate('payment-status:paid')}`,
      step2: `${translate('payment-status:completed')}`,
    },
  }

  return status ? (
    <div className={`${styles.progressContainer}`}>
      <ProgressBar height={2} percent={percentByStatus[status].percent} filledBackground="#025FEA">
        <Step>
          {({ accomplished }) => (
            <div style={{ display: 'block', position: 'relative' }}>
              <div className={styles.circleContainer}>
                <div className={styles.circle}>
                  {accomplished ? <HiOutlineCheck className={styles.check} /> : <Spinner />}
                </div>
              </div>
              <div className={styles.stepTitle}>{translate('payment-order-created')}</div>
            </div>
          )}
        </Step>
        <Step>
          {() => (
            <div style={{ display: 'block', position: 'relative' }}>
              <div
                className={`${styles.circleContainer} ${
                  [Status.DRAFT].includes(status) ? styles.scale : ''
                }`}
              >
                <div
                  className={`${styles.circle} ${
                    percentByStatus[status].percent < 50 ? styles.circleInactive : ''
                  }`}
                >
                  {[Status.DRAFT].includes(status) ? <Spinner /> : null}
                  {[
                    Status.FAILED,
                    Status.PAID,
                    Status.PROCESSING,
                    Status.ISSUED,
                    Status.COMPLETED,
                  ].includes(status) ? (
                    <HiOutlineCheck className={styles.check} />
                  ) : null}
                  {[Status.EXPIRED, Status.REFUNDED].includes(status) ? (
                    <IoIosClose className={styles.close} />
                  ) : null}
                </div>
              </div>
              <div className={styles.stepTitle}>{textSteps[status].step1}</div>
            </div>
          )}
        </Step>
        <Step>
          {() => (
            <div style={{ display: 'block', position: 'relative' }}>
              <div
                className={`${styles.circleContainer} ${
                  [Status.PAID, Status.ISSUED].includes(status) ? styles.scale : ''
                }`}
              >
                <div
                  className={`${styles.circle} ${
                    percentByStatus[status].percent < 100 ? styles.circleInactive : ''
                  }`}
                >
                  {[Status.PAID, Status.ISSUED, Status.PROCESSING].includes(status) ? (
                    <Spinner />
                  ) : null}
                  {[Status.COMPLETED].includes(status) ? (
                    <HiOutlineCheck className={styles.check} />
                  ) : null}
                  {[Status.FAILED].includes(status) ? (
                    <IoIosClose className={styles.close} />
                  ) : null}
                </div>
              </div>
              <div className={styles.stepTitle}>{textSteps[status].step2}</div>
            </div>
          )}
        </Step>
      </ProgressBar>
    </div>
  ) : (
    <></>
  )
}
