'use client';

import { ICustomer } from '@/interfaces/customer.interface';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { GET_METHOD } from '@/lib/req';
import { IOrder } from '@/interfaces/order.interface';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { API_URL } from '@/lib/utils';
import { Textarea } from '../ui/textarea';
import { IMetaPagination } from '@/interfaces/pagination.interface';
import { IStatus } from '@/interfaces/status.interface';
import { ComboboxComponent } from '@/components/combobox';
import { useAppContext } from '@/context/app-context';

export function OrderDetailComp({ order, setOrderAction }: {
  order: IOrder,
  setOrderAction: (newOrder: IOrder) => void;
}) {
  const [customer, setCustomer] = useState<ICustomer>({ ...order.customer });

  const [pointPlus, setPointPlus] = useState(0);
  const { config } = useAppContext()

  useEffect(() => {
    if (pointPlus) return;
    setPointPlus(Math.round(order.total / 100000 * config.discount));
    if (order.id.length) {
      GET_METHOD(`${API_URL}/customer?phone=${order.customer.phone}&orderId=${order.id}`)
        .then((rs: IMetaPagination) => {
          if (rs.data && rs.data.length) {
            setCustomer(rs.data[0]);
            setOrderAction({ ...order, customer: { ...rs.data[0] } });
          }
        })
    } else {
      if (status && status.length > 0 && !order.newStatus) order.newStatus = config.status[0].mID;
    }
  }, []);

  // Hàm cập nhật khách hàng, gọi setState để hai chiều đều cập nhật
  const handleCustomerChange = (field: keyof ICustomer, value: any) => {
    const newCustomer = { ...customer, [field]: value };
    setCustomer(newCustomer);
    setOrderAction({ ...order, customer: newCustomer });
  };


  // Hàm cập nhật đơn hàng
  const handleOrderChange = (field: keyof IOrder, value: any) => {
    if (field === 'discount') {
      if (value < 0) {
        value = 0;
      } else if (value > customer.point) {
        value = customer.point;
      }
      order.customer.point = customer.point - value;
    }
    if (field === 'total') {
      const p = Math.round((value / 100000) * config.discount);
      setPointPlus(p);
      if (order.id.length) {
        order.point = p;
      }
    }
    if (field === 'status') {
      if (!order.status.length) {
        order.newStatus = value;
      } else {
        if (order.status[order.status.length - 1].mID !== value) {
          order.newStatus = value;
        } else {
          order.newStatus = undefined;
        }
      }
      field = 'newStatus';
    }
    console.log(order, 'order detail');
    setOrderAction({ ...order, [field]: value });
  };

  return customer && customer.phone && (
    <div className="space-y-4 px-5 w-full mx-auto">
      {/* Tên khách hàng */}
      <div className="flex-col space-y-2">
        <Label htmlFor="fullName">Tên khách hàng</Label>
        <Input
          id="fullName"
          placeholder="Tên khách hàng"
          value={customer?.fullName}
          onChange={(e) => handleCustomerChange('fullName', e.target.value)}
          disabled={!!customer.id.length}
        />
      </div>
      {/* Địa chỉ */}
      <div className="flex-col space-y-2">
        <Label htmlFor="address">Địa chỉ</Label>
        <Input
          id="address"
          placeholder="Địa chỉ"
          value={customer?.address}
          onChange={(e) => handleCustomerChange('address', e.target.value)}
          disabled={!!customer.id.length}
        />
      </div>
      {/* Số điện thoại */}
      <div className="flex-col space-y-2">
        <Label htmlFor="phone">Số điện thoại</Label>
        <Input
          id="phone"
          placeholder="Số điện thoại"
          value={order.customer.phone}
          onChange={(e) => handleCustomerChange('phone', e.target.value)}
          // disabled={!!customer.phone.length}
          disabled
        />
      </div>
      {/* Điểm thưởng */}
      <div className="flex-col space-y-2">
        <Label htmlFor="point">Điểm thưởng x1000</Label>
        <Input
          type="number"
          id="point"
          placeholder="Điểm thưởng"
          value={order.customer.point}
          onChange={(e) => e.stopPropagation()}
          disabled
        />
      </div>
      {/* Khuyến mại */}
      <div className="flex-col space-y-2">
        <Label htmlFor="discount">Khuyến mãi x1000</Label>
        <Input
          type="number"
          id="discount"
          placeholder="Khuyến mãi"
          max={customer.point}
          value={order.discount}
          onChange={(e) => handleOrderChange('discount', e.target.valueAsNumber)}
          disabled={!customer.point}
        />
      </div>
      {/* Số lượng */}
      <div className="flex-col space-y-2">
        <Label htmlFor="quantity">Số lượng</Label>
        <Input
          type="number"
          id="quantity"
          placeholder="Số lượng"
          min={1}
          value={order?.quantity}
          onChange={(e) => handleOrderChange('quantity', e.target.valueAsNumber)}
        />
      </div>
      {/* Trạng thái */}
      {config.status && config.status.length > 0 && (
        <div className="flex-col space-y-2">
          <Label htmlFor="quantity">Trạng thái</Label>
          <ComboboxComponent frameworks={config.status.map((el: IStatus) => {
            return { label: el.name, value: el.mID };
          })} current={!order.status.length ? config.status[0].mID : order.status[order.status.length-1].mID} cb={(val: string) => handleOrderChange('status', val)} />
        </div>
      )}
      {/* Tổng tiền */}
      <div className="flex-col space-y-2">
        <Label htmlFor="total">Tổng tiền ({`+${pointPlus} điểm`})</Label>
        <Input
          type="number"
          id="total"
          placeholder="Tổng tiền"
          min={10}
          value={order?.total}
          onChange={(e) => handleOrderChange('total', e.target.valueAsNumber)}
        />
      </div>
      {/* Ghi chú */}
      <div className="flex-col space-y-2">
        <Label htmlFor="note">Ghi chú</Label>
        <Textarea
          value={order?.note}
          onChange={(e) => handleOrderChange('note', e.target.value)}
          placeholder="Type your note here."
        />
      </div>
    </div>
  );
}