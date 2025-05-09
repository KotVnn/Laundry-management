'use client'

import { OrderDetailComp } from '@/components/order/order-detail';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

export default function CreateOrder() {
  const [phone, setPhone] = useState('')
  return (
    <>
      <h2 className="text-xl font-semibold text-center">Tạo đơn giặt mới</h2>

      <div className="space-y-2">
        <Label htmlFor="phone">Số điện thoại</Label>
        <Input onChange={(e) => setPhone(e.target.value)} id="phone" placeholder="Nhập số điện thoại..." />
      </div>

      <OrderDetailComp obj={{ phone }} />
    </>
  )
}