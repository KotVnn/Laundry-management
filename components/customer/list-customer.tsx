'use client';

import { GET_METHOD } from '@/lib/req';
import React, { useEffect, useState } from 'react';
import { IMetaPagination, IQueryString } from '@/interfaces/pagination.interface';
import { ICustomer } from '@/interfaces/customer.interface';
import { IComboBox } from '@/interfaces/combobox.interface';
import { Column } from '@/models/data.model';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ComboboxComponent } from '@/components/combobox';
import DataList from '@/components/table/data-list';
import Link from 'next/link';
import { API_URL } from '@/lib/utils';

export function ListCustomer() {
  const [result, setResult] = useState<IMetaPagination | null>();
  const [sort, setSort] = useState<string>('-1');
  const [pageSize, setPageSize] = useState<number>(0);

  const sortArr: IComboBox[] = [
    { value: '-1', label: 'Mới nhất' }, { value: '1', label: 'Cũ nhất' },
  ];
  const pageSizeArr: IComboBox[] = [
    { value: '10', label: '10' }, { value: '20', label: '20' }, { value: '50', label: '50' }, {
      value: '100',
      label: '100',
    },
  ];

  const [query, setQuery] = useState<IQueryString>({
    page_index: 1,
    page_size: pageSize,
    sort: '-1',
  });

  const handleGetData = (type?: string, value?: string) => {
    if (query && pageSize) {
      let page_index = query.page_index;
      let page_size = pageSize;
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

      GET_METHOD(`${API_URL}/customer?page_index=${page_index}&page_size=${page_size}&sort=${sort}`).then((result: IMetaPagination) => {
        setResult(result);
      });
    }
  };

  const viewDetail = (el: React.ReactNode, row: ICustomer) => {
    return (
      <Sheet>
        <SheetTrigger className="cursor-pointer">
          {el}
        </SheetTrigger>
        <SheetContent className="overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{row.fullName}</SheetTitle>
            <SheetDescription>
              {row.address}
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    );
  };

  const columns: Column<ICustomer>[] = [
    {
      title: 'Khách hàng', key: 'fullName', render: (_, val: ICustomer) => viewDetail(
        <>
          <p className="text-left">{val.fullName && val.fullName.length ? val.fullName : 'Khách lẻ'}</p>
          <p className="text-left text-sm text-muted-foreground mt-1">
            {val.address}
          </p>
          <p className="text-left text-sm text-muted-foreground mt-1">
            {val.phone}
          </p>
        </>
        , val),
    },
    {
      title: 'Số đơn',
      key: 'orders',
      render: (_, val: ICustomer) => <Link href={`/man/order/customer/${val.id}`}>{val.orders.length}</Link>,
    },
    {
      title: 'Điểm',
      key: 'orders',
      render: (val) => val.reduce((sum: any, order: any) => sum + (order.point || 0), 0),
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
    handleGetData();
  }, []);

  return result && result.data && result.meta && (
    <div className="flex flex-col gap-4 p-4 pt-0" style={{ minHeight: '100vh' }}>
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <ComboboxComponent frameworks={sortArr} current={sort} cb={(val: string) => handleGetData('sort', val)} />
        <ComboboxComponent frameworks={pageSizeArr} current={`${pageSize}`}
                           cb={(val: string) => handleGetData('page_size', val)} />
      </div>
      <DataList data={result.data} columns={columns} pagination={result.meta}
                cb={(page_index: number) => handleGetData('page_index', page_index.toString())} />
    </div>
  );
}