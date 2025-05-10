'use client';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ICustomer } from '@/interfaces/customer.interface';
import { useEffect, useState } from 'react';
import { GET_METHOD } from '@/lib/req';
import { toast } from 'sonner';
import { IOrder } from '@/interfaces/order.interface';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { API_URL } from '@/lib/utils';
import { Textarea } from '../ui/textarea';

export function OrderDetailComp({ obj }: { obj: { phone?: string; orderId?: string } }) {
  const [customer, setCustomer] = useState<ICustomer>({
    fullName: '',
    address: '',
    phone: '',
    point: 0,
    pointUse: 0,
    orders: [],
  });
  const [order, setOrder] = useState<IOrder>({
    id: '',
    note: '',
    point: 0,
    usePoint: 0,
    total: 10,
    discount: 0,
    quantity: 1,
    date: new Date,
    status: [],
    customer,
  });

  useEffect(() => {
    if (obj.phone && obj.phone.length === 10) {
      GET_METHOD(`/api/customer/detail/${obj.phone.replace(/\+84| /g, '0').trim()}`)
        .then((cus: ICustomer) => {
          setCustomer(cus);
        })
        .catch((err) => {
          toast.error(err.message);
        });
    } else if (obj.orderId) {
      GET_METHOD(`${API_URL}/order/detail/${obj.orderId}`)
        .then((ord: IOrder) => {
          setOrder(ord);
          setCustomer(ord.customer);
        })
        .catch((err) => {
          toast.error(err.message);
        });
    }
  }, [obj]);

  return (
    <Sheet>
      <SheetTrigger>
        <div className="inline-block px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 cursor-pointer transition">
          {obj.orderId ? `Xem đơn ${obj.orderId}` : 'Tạo đơn mới'}
        </div>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{obj.orderId ? `Xem đơn ${obj.orderId}` : 'Tạo đơn mới'}</SheetTitle>
          <SheetDescription />
        </SheetHeader>
        <div className="space-y-4 px-5 w-full mx-auto">
          <div className="flex-col space-y-2">
            <Label htmlFor="fullName">Tên khách hàng</Label>
            <Input disabled={!obj.orderId || !customer} id="fullName" placeholder="Tên khách hàng"
                   value={customer?.fullName} />
          </div>
          <div className="flex-col space-y-2">
            <Label htmlFor="address">Địa chỉ</Label>
            <Input disabled={!obj.orderId || !customer} id="address" placeholder="Địa chỉ" value={customer?.address} />
          </div>
          <div className="flex-col space-y-2">
            <Label htmlFor="phone">Số điện thoại</Label>
            <Input disabled={!obj.orderId || !customer} id="phone" placeholder="Số điện thoại"
                   value={customer?.phone} />
          </div>
          <div className="flex-col space-y-2">
            <Label htmlFor="point">Điểm thưởng</Label>
            <Input type="number" disabled={!obj.orderId || !customer} id="point" placeholder="Điểm thưởng"
                   value={customer?.point} />
          </div>
          <div className="flex-col space-y-2">
            <Label htmlFor="coupon">Khuyến mãi x1000</Label>
            <Input type="number" disabled={!customer} id="coupon" placeholder="Khuyến mại"
                   value={order && order.discount ? order.discount : 0} />
          </div>
          <div className="flex-col space-y-2">
            <Label htmlFor="quantity">Số lượng</Label>
            <Input type="number" min={1} id="quantity" placeholder="Số lượng"
                   value={order && order.quantity ? order.quantity : 1} />
          </div>
          <div className="flex-col space-y-2">
            <Label htmlFor="total">Tổng tiền x1000</Label>
            <Input type="number" min={10} id="total" placeholder="Tổng tiền"
                   value={order && order.total ? order.total : 10} />
          </div>
          <div className="flex-col space-y-2">
            <Label htmlFor="total">Tổng tiền x1000</Label>
            <Textarea value={order?.note} placeholder="Type your note here." />
          </div>

          <Button type="submit">Update profile</Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
