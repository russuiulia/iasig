/* eslint-disable @next/next/no-img-element */
import { useState } from 'react';

import { useTranslation } from '~/context/LanguageContext';
import { Status } from '~/interfaces/status';
import { BaggageSummary } from '~/modules/baggage/baggage-summary/baggage-summary';
import { GreenCardSummary } from '~/modules/greenCard/green-card-summary/green-card-summary';
import { MdVignetteSummary } from '~/modules/mdVignette/md-vignette-summary/md-vignette-summary';
import { MedicalSummary } from '~/modules/medical/medical-summary/medical-summary';
import { MedicalOptionalSummary } from '~/modules/medicalOptional/medical-optional-summary/medical-optional-summary';
import { RcaSummary } from '~/modules/rca/rca-summary/rca-summary';
import { RealEstateSummary } from '~/modules/realEstate/real-estate-summary/real-estate-summary';
import { RoadAssistanceEUSummary } from '~/modules/roadAssistanceEU/road-assistance-eu-summary/road-assistance-eu-summary';
import { RoadTaxSummary } from '~/modules/roadTax/road-tax-summary/road-tax-summary';
import { RoVignetteSummary } from '~/modules/roVignette/ro-vignette-summary/ro-vignette-summary';
import { InsuranceType } from '~/modules/shared/types/insurance';
import { IsgOrder } from '~/services/interfaces/order';

export interface SummaryProps {
  order: IsgOrder<any>;
}

const summaryInfo = (props: SummaryProps): JSX.Element => {
  const { order } = props;
  const contact = {
    phone: order.contact?.phone,
    email: order.contact?.email,
  };

  switch (order?.insuranceType) {
    case InsuranceType.RCA:
      return <RcaSummary {...order.details} {...contact} />;
    case InsuranceType.GREEN_CARD:
      return (
        <GreenCardSummary
          addons={order.addons || []}
          {...order.details}
          {...contact}
        />
      );
    case InsuranceType.MEDICAL:
      return <MedicalSummary {...order.details} {...contact} />;
    case InsuranceType.MEDICAL_OPTIONAL:
      return <MedicalOptionalSummary {...order.details} {...contact} />;
    case InsuranceType.REAL_ESTATE:
      return <RealEstateSummary {...order.details} {...contact} />;
    case InsuranceType.RO_VIGNETTE:
      return <RoVignetteSummary {...contact} {...order.details} />;
    case InsuranceType.BAGGAGE:
      return <BaggageSummary {...contact} {...order.details} />;
    case InsuranceType.ROAD_TAX:
      return <RoadTaxSummary {...contact} {...order.details} />;
    case InsuranceType.MD_VIGNETTE:
      return <MdVignetteSummary {...contact} {...order.details} />;
    case InsuranceType.ROAD_SIDE_ASSISTANCE_EU:
      return <RoadAssistanceEUSummary {...contact} {...order.details} />;
    default:
      return <></>;
  }
};

export const Summary = ({ order }: SummaryProps): JSX.Element => {
  const { translate } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const args = { order };

  return (
    <div className="d-flex align-items-center justify-content-center mt-4">
      <div
        className={`${expanded ? '' : 'h-16 overflow-hidden'} ${
          order?.status === Status.COMPLETED ? `block` : 'hidden'
        }`}
      >
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center justify-between focus:outline-none px-6 py-4 rounded-2xl bg-gray-lightest w-full mb-2 font-medium text-black-lightest"
        >
          {translate('order-details')} 
          <img
            src="/images/black-dropdown.svg"
            alt="black-dropdown"
            width={20}
            height={20}
            className={`${expanded && 'transform rotate-180'}`}
          />
        </button>
        {summaryInfo(args)}
      </div>
      <div
        className={`${order?.status === Status.COMPLETED ? `hidden w-full mx-auto` : 'block'}`}
      >
        {summaryInfo(args)}
      </div>
    </div>
  );
};
