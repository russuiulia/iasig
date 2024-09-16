import { doc, getFirestore, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { firebaseApp } from '../services/firebase';

import { orderV2 } from '../modules/shared/orderV2';

export const useLiveDocument = (collection: string, id: string) => {
  const [data, setData] = useState({} as any);
  const [isLoading, setIsLoading] = useState(true);
  const [retryIdx, setRetryIdx] = useState(0);
  const { transformV2ToV1 } = orderV2();
  useEffect(() => {
    if (!id) {
      return;
    }

    const docRef = doc(getFirestore(firebaseApp), collection, id);
    const unsubscribe = onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          setData(transformV2ToV1(snapshot.data() as any, id));
          setIsLoading(false);
        }
      },
      (error) => {
        console.log(
          `useLiveDocument error [${error.code}]: ${error.message}`,
          error
        );
        setTimeout(() => {
          setRetryIdx(retryIdx + 1);
        }, 1000);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [id, collection, retryIdx]);

  return { data, isLoading };
};
