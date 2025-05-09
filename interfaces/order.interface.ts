import { ICustomer } from '@/interfaces/customer.interface';
import { IStatus } from '@/interfaces/status.interface';

export interface IOrderStatus {
  stt: IStatus;
  time: Date;
}

export interface IOrder {
  id: string;
  note: string;
  point: number;
  usePoint: number;
  total: number;
  discount: number;
  date: Date;
  status: IOrderStatus[];
  customer: ICustomer;
}
