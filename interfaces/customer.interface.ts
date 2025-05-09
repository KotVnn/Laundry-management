import { IOrder } from '@/interfaces/order.interface';

export interface ICustomer {
  fullName: string;
  address: string;
  phone: string;
  pointUse: number;
  orders: IOrder[];
}
