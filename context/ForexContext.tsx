import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { getAllTodayCurrency } from '../services/firebase.service';
import { useRouter } from 'next/navigation';

export enum Currency {
  RON = 'RON',
  EUR = 'EUR',
  USD = 'USD',
  MDL = 'MDL',
}

export type ExchangeRate = Record<Currency, number>;

interface ForexProviderContextInterface {
  exchangeRate: ExchangeRate;
  exchangeRateLoaded: boolean;
  convert: (amount: number, from: Currency, to: Currency) => number;
}

export const ForexProviderContext =
  createContext<ForexProviderContextInterface>(
    {} as ForexProviderContextInterface
  );

interface ForexProviderInterface {
  children: React.ReactNode;
}

export const ForexProvider: React.FC<ForexProviderInterface> = ({
  children,
}) => {
  const { isReady } = useRouter();
  const [exchangeRate, setExchangeRate] = useState<ExchangeRate>({
    EUR: 1,
    RON: 1,
    USD: 1,
    MDL: 1,
  });
  const [exchangeRateLoaded, setExchangeRateLoaded] = useState(false);

  const convert = useCallback(
    (amount: number, from: Currency, to: Currency): number => {
      const fromRate = exchangeRate[from] || 1;
      const toRate = exchangeRate[to] || 1;
      return (amount * fromRate) / toRate;
    },
    [exchangeRate]
  );

  useEffect(() => {
    if (!isReady) {
      return;
    }
    getAllTodayCurrency().then((data) => {
      if (data) {
        setExchangeRate({ ...data, MDL: 1 });
        setExchangeRateLoaded(true);
      }
    });
  }, [isReady]);

  return (
    <ForexProviderContext.Provider
      value={{
        exchangeRate,
        exchangeRateLoaded,
        convert,
      }}
    >
      {children}
    </ForexProviderContext.Provider>
  );
};

export const useForex = (): ForexProviderContextInterface =>
  useContext(ForexProviderContext);
