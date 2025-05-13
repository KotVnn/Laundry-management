import { IOrder } from '@/interfaces/order.interface';

export interface ICustomer {
  id: string;
  fullName: string;
  address: string;
  phone: string;
  pointUse: number;
  point: number;
  orders: IOrder[];
}
