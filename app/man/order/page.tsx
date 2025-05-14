'use client';

import { GET_METHOD, POST_METHOD, PUT_METHOD } from '@/lib/req';
import { IOrder } from '@/interfaces/order.interface';
import { Column } from '@/models/data.model';
import DataList from '@/components/table/data-list';
import { IMetaPagination, IQueryString } from '@/interfaces/pagination.interface';
import { ICustomer } from '@/interfaces/customer.interface';
import Link from 'next/link';
import moment from 'moment';
import { formatVND } from '@/lib/utils';
import { ComboboxComponent } from '@/components/combobox';
import { IComboBox } from '@/interfaces/combobox.interface';
import React, { useEffect, useState } from 'react';
import { DatePickerWithRangeComponent } from '@/components/date-range';
import { DateRange } from 'react-day-picker';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { OrderDetailComp } from '@/components/order/order-detail';
import { toast } from 'sonner';

export default function OrderPage() {
  const [result, setResult] = useState<IMetaPagination | null>();
  const [pageSize, setPageSize] = useState<number>(0);
  const [order, setOrder] = useState<IOrder>();
  const [sort, setSort] = useState<string>("-1");

  const sortArr: IComboBox[] = [
    { value: '-1', label: 'Mới nhất' }, { value: '1', label: 'Cũ nhất' },
  ];
  const pageSizeArr: IComboBox[] = [
    { value: '10', label: '10' }, { value: '20', label: '20' }, { value: '50', label: '50' }, {
      value: '100',
      label: '100',
    },
  ];
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: moment().subtract(5, 'day').toDate(),
    to: moment().add(1, 'day').toDate(),
  });
  const [query, setQuery] = useState<IQueryString>({
    page_index: 1,
    page_size: pageSize,
    from: date?.from ? moment(date?.from).toISOString() : moment().subtract(5, 'day').toISOString(),
    to: date?.to ? moment(date?.to).add(1, 'day').toISOString() : moment().add(1, 'day').toISOString(),
    sort: '-1',
  });

  const handleGetData = (type?: string, value?: string) => {
    if (query && pageSize) {
      let page_index = query.page_index;
      let page_size = pageSize;
      let from = date?.from ? moment(date?.from).toISOString() : moment().subtract(5, 'day').toISOString();
      let to = date?.to ? moment(date?.to).add(1, 'day').toISOString() : moment().add(1, 'day').toISOString();
      let sort = query.sort;
      switch (type) {
        case 'page_index':
          page_index = parseInt(value ? value : '1');
          setQuery({ ...query, page_index });
          break;
        case 'page_size':
          page_size = parseInt(value ? value : '10');
          setPageSize(page_size);
          localStorage.setItem('page_size', value ? value : '10');
          setQuery({ ...query, page_size });
          break;
        case 'range':
          from = value ? value.split(':')[0] : moment().subtract(5, 'day').toISOString();
          setQuery({ ...query, from });
          to = value ? value.split(':')[0] : moment().toISOString();
          setQuery({ ...query, to });
          break;
        case 'sort':
          sort = value === '1' ? '1' : '-1';
          setSort(sort);
          setQuery({ ...query, sort });
          break;
      }
      if (type !== 'page_index') {
        page_index = 1;
        setQuery({ ...query, page_index });
      }

      setResult(null);

      GET_METHOD(`/api/order?page_index=${page_index}&page_size=${page_size}&sort=${sort}&from=${from}&to=${to}`).then((result: IMetaPagination) => {
        setResult(result);
      });
    }
  };

  const handleSubmit = () => {
  };

  const handleUpdate = () => {
    if (!order) return;
    PUT_METHOD(`/api/order/detail/${order.id}`, order).then(() => {
      toast.success(`Thành công`, { description: `Update đơn #${order.id} thành công.` });
    }).catch(() => {
      toast.error('Thất bại', { description: `Update đơn #${order.id} thất bại.` });
    })
  };

  const handleOpen = (open: boolean, row: IOrder) => {
    if (open) {
      setOrder(row);
    } else {
      handleGetData();
    }
  };

  const viewDetail = (el: React.ReactNode, row: IOrder) => {
    return (
      <Sheet onOpenChange={(open) => handleOpen(open, row)}>
        <SheetTrigger className="cursor-pointer">
          {el}
        </SheetTrigger>
        <SheetContent className="overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Chi tiết đơn {row.id} ({row.status[row.status.length - 1].name})</SheetTitle>
            <SheetDescription />
          </SheetHeader>
          {order && (
            <OrderDetailComp order={order} setOrderAction={setOrder} />
          )}
          <div className="grid grid-cols-2 md:grid-cols-4 items-center justify-baseline p-3 gap-2">
            <div onClick={handleSubmit}
                 className="inline-block px-4 py-2 bg-red-700 text-white text-xs font-mono rounded hover:bg-red-800 cursor-pointer transition">
              <SheetClose className="cursor-pointer">Delete</SheetClose>
            </div>
            <div onClick={handleSubmit}
                 className="inline-block px-4 py-2 bg-teal-800 text-white text-xs font-mono rounded hover:bg-teal-950 cursor-pointer transition">
              <SheetClose className="cursor-pointer">Print</SheetClose>
            </div>
            <div onClick={handleSubmit}
                 className="inline-block px-4 py-2 bg-yellow-800 text-white text-xs font-mono rounded hover:bg-yellow-950 cursor-pointer transition">
              <SheetClose className="cursor-pointer">Next Status</SheetClose>
            </div>
            <div onClick={handleUpdate}
                 className="inline-block px-4 py-2 bg-blue-600 text-white text-xs font-mono rounded hover:bg-blue-700 cursor-pointer transition">
              <SheetClose className="cursor-pointer">Update</SheetClose>
            </div>
          </div>
          <div className="flex flex-row items-center justify-baseline p-2 gap-2 mb-2">
            {order && order.status && order.status.length > 0 && (
              <DataList data={order.status}
                        columns={[{ title: 'Trạng thái', key: 'name' }, {
                          title: 'Thời gian',
                          key: 'time',
                          render: (val: Date) => moment(val).format('HH:mm DD/MM/YYYY'),
                        }]}
                        pagination={{ page_total: 1, page_size: 1, page_index: 1, total: order.status.length }}
                        cb={() => {
                        }} />
            )}
          </div>
        </SheetContent>
      </Sheet>
    );
  };

  const columns: Column<IOrder>[] = [
    {
      title: 'Khách hàng', key: 'customer', render: (val: ICustomer) => <Link href={`/customer/${val.phone}`}>
        <p>{val.fullName && val.fullName.length ? val.fullName : 'Khách lẻ'}</p>
        <p className="text-sm text-muted-foreground mt-1">
          {val.address}
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          {val.phone}
        </p>
      </Link>,
    },
    {
      title: 'Tổng thu', key: 'date', render: (_, row: IOrder) => viewDetail(
        <>
          <p>{formatVND(row.total)} ({row.quantity})</p>
          <p className="text-sm text-muted-foreground mt-1">
            {moment(row.date).format('HH:mm DD/MM/YY')}
          </p>
        </>,
        row,
      ),
    },
    {
      title: 'Trạng thái', key: 'total', render: (_, row: IOrder) => viewDetail(
        <>
          <p className="text-left">{row.status[row.status.length - 1].name}</p>
          <p className="text-sm text-muted-foreground mt-1 text-left">
            {row.note}
          </p>
        </>,
        row,
      ),
    },
  ];

  useEffect(() => {
    if (localStorage.getItem('page_size')) {
      setPageSize(parseInt(localStorage.getItem('page_size') || '10'));
    } else {
      localStorage.setItem('page_size', '10');
      setPageSize(parseInt(localStorage.getItem('page_size') || '10'));
    }
    handleGetData();
  }, [pageSize]);

  useEffect(() => {
    if (date && date.from && date.to) {
      handleGetData();
    }
  }, [date]);

  return result && result.data && result.meta && (
    <div className="flex flex-col gap-4 p-4 pt-0" style={{ minHeight: '100vh' }}>
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <ComboboxComponent frameworks={sortArr} current={sort} cb={(val: string) => handleGetData('sort', val)} />
        <DatePickerWithRangeComponent date={date} setDate={setDate} />
        <ComboboxComponent frameworks={pageSizeArr} current={`${pageSize}`}
                           cb={(val: string) => handleGetData('page_size', val)} />
      </div>
      <DataList data={result.data} columns={columns} pagination={result.meta}
                cb={(page_index: number) => handleGetData('page_index', page_index.toString())} />
    </div>
  );
}