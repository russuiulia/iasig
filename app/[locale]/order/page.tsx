// pages/order.tsx
'use client';
import {
  sectionWrapper,
  subtitle,
  title,
  titleWrapper,
} from '@/components/primitives';
import { Order } from '@/modules/shared/order/order';
import { useEffect, useState } from 'react';

export default function OrderPage() {
  const [orderId, setOrderId] = useState<string | null>('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const order = params.get('order');
      setOrderId(order);
    }
  }, []);

  return (
    <section className={sectionWrapper({ class: 'mt-16 lg:mt-44' })}>
      <div className="flex flex-col gap-0 md:gap-8">
        <div>
          <div className={titleWrapper({ class: 'items-center' })}>
            <div>
              <h1 className={title({ size: 'lg' })}>Comanda nr.&nbsp;</h1>
              <h1 className={title({ color: 'yellow', size: 'lg' })}>
                {orderId}
              </h1>
            </div>
          </div>
        </div>
      </div>
      <Order />
    </section>
    // <div>
    //   <h1>Order Page</h1>
    //   {orderId ? <p>Your order ID is: {orderId}</p> : <p>Loading...</p>}
    // </div>
  );
}
