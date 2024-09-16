import { Timestamp } from 'firebase/firestore';

import { Billing } from '../../interfaces/preOrder';
import { Status } from '../../interfaces/status';
import { AdditionalProduct } from '../../modules/shared/addons';
import {
  DocumentTypes,
  InsuranceType,
} from '../../modules/shared/types/insurance';

export enum DELIVERY_STATUS {
  SCHEDULED = 'scheduled',
  CANCELED = 'canceled',
  DELIVERED = 'delivered',
}
export interface CreateOrderBody<T> {
  insuranceType?: InsuranceType;
  details?: Partial<T>;
  contact?: Contact;
  contractor?: any;
  addons?: AdditionalProduct[];
}

export interface IsgOrder<T> {
  _v?: number;
  addons?: AdditionalProduct[];
  confirmed: boolean;
  createdAt: Date;
  completedAt: Timestamp;
  details?: T;
  orderId: string;
  insuranceRef: string;
  insuranceType: InsuranceType;
  documents?: DownloadFileURL[];
  addonAttachments?: DownloadFileURL[];
  status: Status;
  contact?: Contact;
  externalId: number;
  price?: number;
  deliveryRef?: string;
  payment: Payment;
  seller: Seller;
  invoice: { file: { name: DocumentTypes; type: string; url: string } };
  billing: Billing;
}

export type Payment = {
  receipts: Receipt[];
};

export type Seller = {
  IDNO: string;
  paymentMethods: PaymentMethod[];
};

export enum PaymentMethod {
  maib = 'maib',
  wire_transfer = 'wire-transfer',
  mia = 'mia',
  mpay = 'mpay',
}

export type Receipt = {
  amount: number;
  currency: string;
  receiptId: number;
  orderId: string;
  source: string; // maib
  transactionId: string;
  paidAt: Timestamp;
};

export interface DownloadFileURL {
  name: DocumentTypes;
  type: string;
  url: string;
  addonName?: string;
  addonType?: string;
}

export type Contact = {
  phone: string;
  email: string;
};

export type Delivery = {
  deliveryTime: Timestamp;
  description: string;
  orderId: string;
  lat: number;
  lon: number;
  address: string;
  contactPhone?: string;
  contactEmail?: string;
  status: DELIVERY_STATUS;
};

export interface GetPrice<T> {
  type: InsuranceType;
  values: T;
}
