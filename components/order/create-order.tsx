'use client';

import { OrderDetailComp } from '@/components/order/order-detail';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

export default function CreateOrder() {
  const [phone, setPhone] = useState('');

  const handleChangePhone = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(e.target.value.replace(/\+84/g, '0').replace(/ |[a-zA-Z]/g, '').trim());
  };

  return (
    <div className="flex flex-col items-start gap-4">
      <h2 className="text-xl font-semibold text-center">Tạo đơn giặt mới</h2>

      <div className="space-y-2">
        <Label htmlFor="phone">Số điện thoại</Label>
        <Input maxLength={16} value={phone} onChange={handleChangePhone} id="phone"
               placeholder="Nhập số điện thoại..." />
      </div>

      <OrderDetailComp obj={{ phone }} />
    </div>
  );
}
