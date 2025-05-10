'use client'

import { GET_METHOD } from '@/lib/req';
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

export default function OrderPage() {
  const [result, setResult] = useState<IMetaPagination | null>();
  const [pageSize, setPageSize] = useState<number>(0);
  const sortArr: IComboBox[] = [
    {value: "-1", label: "Mới nhất"}, {value: "1", label: "Cũ nhất"}
  ]
  const pageSizeArr: IComboBox[] = [
    {value: "10", label: "10"}, {value: "20", label: "20"}, {value: "50", label: "50"}, {value: "100", label: "100"}
  ]
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: moment().subtract(5, 'day').toDate(),
    to: moment().add(1, 'day').toDate(),
  })
  const [query, setQuery] = useState<IQueryString>({
    page_index: 1,
    page_size: pageSize,
    from: date?.from ? moment(date?.from).toISOString() : moment().subtract(5, 'day').toISOString(),
    to: date?.to ? moment(date?.to).add(1, 'day').toISOString() : moment().add(1, 'day').toISOString(),
    sort: "-1"
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
          page_index = parseInt(value ? value : "1")
          setQuery({...query, page_index})
          break;
        case 'page_size':
          page_size = parseInt(value ? value : "10")
          setPageSize(page_size)
          localStorage.setItem('page_size', value ? value : "10")
          setQuery({...query, page_size})
          break;
        case 'range':
          from = value ? value.split(':')[0] : moment().subtract(5, 'day').toISOString()
          setQuery({...query, from})
          to = value ? value.split(':')[0] : moment().toISOString()
          setQuery({...query, to})
          break;
        case 'sort':
          sort = value === "1" ? "1" : "-1";
          setQuery({...query, sort})
          break;
      }
      if (type !== 'page_index') {
        page_index = 1;
        setQuery({...query, page_index})
      }

      setResult(null);

      GET_METHOD(`/api/order?page_index=${page_index}&page_size=${page_size}&sort=${sort}&from=${from}&to=${to}`).then((result: IMetaPagination) => {
        setResult(result);
      })
    }
  }

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
      title: 'Tổng thu', key: 'date', render: (_, row: IOrder) => (
        <>
          <p>{formatVND(row.total)} ({row.quantity})</p>
          <p className="text-sm text-muted-foreground mt-1">
            {moment(row.date).format('HH:mm DD/MM/YY')}
          </p>
        </>
      ),
    },
    {
      title: 'Trạng thái', key: 'total', render: (_, row: IOrder) => (
        <>
          <p>{row.status[row.status.length - 1].name}</p>
          <p className="text-sm text-muted-foreground mt-1">
            {row.note}
          </p>
        </>
      ),
    },
  ];

  useEffect(() => {
    if (localStorage.getItem('page_size')) {
      setPageSize(parseInt(localStorage.getItem('page_size') || "10"))
    } else {
      localStorage.setItem('page_size', "10")
      setPageSize(parseInt(localStorage.getItem('page_size') || "10"))
    }
    handleGetData();
  }, [pageSize])

  useEffect(() => {
    if (date && date.from && date.to) {
      handleGetData();
    }
  }, [date])

  return result && result.data && result.meta && (
    <div className="flex flex-col gap-4 p-4 pt-0" style={{minHeight: '100vh'}}>
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <ComboboxComponent frameworks={sortArr} current={query.sort} cb={(val: string) => handleGetData("sort", val)}/>
        <DatePickerWithRangeComponent date={date} setDate={setDate} />
        <ComboboxComponent frameworks={pageSizeArr} current={`${pageSize}`} cb={(val: string) => handleGetData("page_size", val)}/>
      </div>
      <DataList data={result.data} columns={columns} pagination={result.meta} cb={(page_index: number) => handleGetData("page_index", page_index.toString())} />
    </div>
  );
}