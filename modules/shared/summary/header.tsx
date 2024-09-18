/* eslint-disable @next/next/no-img-element */
import { InsuranceType } from '../types/insurance';
import { Status } from '~/constants';
import { ORDER_CARDS_SOURCE } from '~/constants/orderCardSource';
import { useTranslation } from '~/context/LanguageContext';
import { IsgOrder } from '~/services/interfaces/order';

export interface SummaryHeaderProps {
  order: IsgOrder<any>;
  id: string;
}

export const SummaryHeader = ({
  order,
  id,
}: SummaryHeaderProps): JSX.Element => {
  const { translate } = useTranslation();
  const isVignette = order.insuranceType === InsuranceType.RO_VIGNETTE;

  const isCompleted = order.status === Status.COMPLETED;

  return (
    <div className="grid justify-center md:mt-28 mt-20">
      {(ORDER_CARDS_SOURCE as any)[order.status] && (
        <img
          src={(ORDER_CARDS_SOURCE as any)[order.status]}
          alt="summary-header"
          width={129}
          height={144}
          className="mx-auto"
        />
      )}

      <h3 className="mb-2 mt-4">
        {translate(
          `${isVignette && isCompleted ? 'vignette:' : ''}payment-title:${order.status}`
        )}{' '}
      </h3>
      <div className="mb-8 text-xl text-black-lightest">
        {translate('payment-order')}{' '}
        <span translate="no" className="bg-gray-lightest py-1 px-4">
          {id}
        </span>
      </div>
    </div>
  );
};
