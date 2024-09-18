import { NextSeo } from 'next-seo'
import { IsgHeader } from '~/components/shared/isgHeading/isgHeader'
import { Order } from '../order/order'
import styles from './paymentPage.module.scss'

export const PaymentPage = (): JSX.Element => {
  return (
    <>
      <NextSeo noindex={true} nofollow={true} />
      <IsgHeader title="" />
      <div className={`${styles.paymentPage} container`}>
        <Order />
      </div>
    </>
  )
}
