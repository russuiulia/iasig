import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Status, orderIdRegex } from '../../../constants';
import { firebaseApp } from '../../../services/firebase';
import { useLiveDocument } from '../../../utils/useLive';

import { PreOrder } from '../../../interfaces/preOrder';
// import { OrderContent } from '../orderContent/orderContent';
import { isV2Order } from '../orderV2/types';
import {
  InsuranceType,
  InsuranceTypeSlugs,
  ItemName,
} from '../types/insurance';

export const Order = (): JSX.Element => {
  const router = useRouter();

  const [errorCard, setErrorCard] = useState(false);

  const [loading, setLoading] = useState(true);

  const { data: orderDetails, isLoading } = useLiveDocument(
    'orders',
    `${router.query.order}`
  );
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const redirectToProductPreOrder = (preOrder: PreOrder<any>) => {
      if (!isV2Order(preOrder as any)) {
        setNotFound(true);
        return;
      }
      const firstProductType = preOrder?.productTypes?.[0];
      if (!firstProductType) {
        setNotFound(true);
      }
      const slug = InsuranceTypeSlugs[firstProductType!];
      if (!slug) {
        setNotFound(true);
      }
      router.push(`/${slug}?order=${router.query.order}`);
    };

    const getOrder = async () => {
      if (!router.isReady) return;

      if (orderIdRegex.test(`${router?.query?.order}`)) {
        const docRef = doc(
          getFirestore(firebaseApp),
          'orders',
          `${router.query.order}`
        );
        const preOrderDocRef = doc(
          getFirestore(firebaseApp),
          'pre-orders',
          `${router.query.order}`
        );
        const docSnap = await getDoc(docRef);
        const preOrderDocSnap = await getDoc(preOrderDocRef);
        if (docSnap.exists() || preOrderDocSnap.exists()) {
          setNotFound(false);
          setLoading(false);
          const preOrder = preOrderDocSnap.data() as PreOrder<any>;

          if (!preOrder.confirmed) {
            redirectToProductPreOrder(preOrder);
          }
        } else {
          setNotFound(true);
          setLoading(false);
        }
      } else {
        setNotFound(true);
        setLoading(false);
      }
    };

    getOrder();
  }, [router.isReady, router.query.order]);

  useEffect(() => {
    setErrorCard(!Object.keys(orderDetails).length);
    if (Object.keys(orderDetails).length) {
      const priceEUR = [
        InsuranceType.RCA,
        InsuranceType.MEDICAL_OPTIONAL,
        InsuranceType.REAL_ESTATE,
        InsuranceType.RO_VIGNETTE,
      ].includes(orderDetails?.insuranceType)
        ? Number(orderDetails?.details?.price) / 100
        : Number(orderDetails?.details?.priceEUR) * 0.2;
      if (
        [Status.PAID, Status.ISSUED, Status.COMPLETED].includes(
          orderDetails?.status
        )
      ) {
        const companyName = orderDetails?.details?.companyName;
        const orderId = router.query.order;
        // ga.purchase(priceEUR, orderId, ItemName[orderDetails.insuranceType], companyName)
        // fbq.purchase(priceEUR, orderId, ItemName[orderDetails.insuranceType], companyName)
        // fba.purchase(priceEUR, orderId, ItemName[orderDetails.insuranceType], companyName)
      }
    }
  }, [Object.keys(orderDetails || {}).length]);

  return (
    <div className="pb-24 md:pt-0 pt-6">
      {notFound ? (
        <p>Not found</p>
      ) : (
        // <OrderContent
        //   order={orderDetails}
        //   isLoading={isLoading || loading}
        //   errorCard={errorCard}
        //   id={router.query.order as string}
        // />
        <div>{orderDetails}</div>
      )}
    </div>
  );
};
