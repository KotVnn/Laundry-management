import { IPagination } from '@/interfaces/pagination.interface';

export type Column<T> = {
  title: string
  key: keyof T
  render?: (value: any, row: T, index: number) => React.ReactNode
}

export type DataListProps<T> = {
  data: T[]
  columns: Column<T>[]
  pagination: IPagination
  cb: (page: number) => void
}