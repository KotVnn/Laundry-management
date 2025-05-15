'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import * as React from 'react';
import { useEffect, useState } from 'react';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { toast } from 'sonner';
import { GET_METHOD, POST_METHOD } from '@/lib/req';
import { ICustomer } from '@/interfaces/customer.interface';
import { IOrder } from '@/interfaces/order.interface';
import { OrderDetailComp } from '@/components/order/order-detail';
import { API_URL } from '@/lib/utils';

export default function CreateOrder() {
  const [phone, setPhone] = useState('');
  const [order, setOrder] = useState<IOrder | undefined>();

  const handleChangePhone = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(e.target.value.replace(/\+84/g, '0').replace(/ |[a-zA-Z]/g, '').trim());
  };

  const handleSubmit = () => {
    POST_METHOD(`${API_URL}/order`, order).then((rs) => {
      toast.success('Tạo đơn thành công', { description: JSON.stringify(rs) });
    }).catch((err) => {
      toast.error('Tạo đơn không thành công', { description: err.message });
    })
  };

  useEffect(() => {
    setOrder(undefined);
    if (!phone.length || phone.length != 10) return;
    GET_METHOD(`${API_URL}/customer/detail/${phone.replace(/\+84| /g, '0').trim()}`)
      .then((cus: ICustomer) => {
        setOrder({
          id: '',
          note: '',
          point: 1,
          usePoint: 0,
          total: 10000,
          discount: 0,
          quantity: 1,
          date: new Date(),
          status: [],
          customer: (cus && cus.phone ? { ...cus } : {
            id: '',
            fullName: '',
            address: '',
            phone,
            point: 0,
            pointUse: 0,
            orders: [],
          }),
        });
      })
      .catch((err) => {
        toast.error(err.message);
      });
  }, [phone]);

  return (
    <div className="flex flex-col items-start gap-4">
      <h2 className="text-xl font-semibold text-center">Tạo đơn giặt mới</h2>

      <div className="space-y-2">
        <Label htmlFor="phone">Số điện thoại</Label>
        <Input maxLength={16} value={phone} onChange={handleChangePhone} id="phone"
               placeholder="Nhập số điện thoại..." />
      </div>

      <Sheet>
        <SheetTrigger disabled={!order}>
          <div
            className="inline-block px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 cursor-pointer transition">
            Tạo đơn mới
          </div>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Tạo đơn mới</SheetTitle>
            <SheetDescription />
          </SheetHeader>
          {order && (
            <OrderDetailComp order={order} setOrderAction={setOrder} />
          )}
          <SheetClose>
            <div onClick={handleSubmit}
                 className="inline-block px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 cursor-pointer transition">
              Tạo đơn
            </div>
          </SheetClose>
        </SheetContent>
      </Sheet>
    </div>
  );
}
