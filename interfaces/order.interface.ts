import { ICustomer } from '@/interfaces/customer.interface';
import { IStatus } from '@/interfaces/status.interface';

export interface IOrderStatus extends IStatus {
  time: Date;
}

export interface IOrder {
  id: string;
  note: string;
  point: number;
  usePoint: number;
  total: number;
  discount: number;
  quantity: number;
  date: Date;
  status: IOrderStatus[];
  newStatus?: string;
  customer: ICustomer;
}
