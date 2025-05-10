import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { colClassMap } from '@/lib/utils';
import { DataListProps } from '@/models/data.model';
import PaginationComponent from '@/components/pagination';

export default function DataList<T>({ data, columns, pagination, cb }: DataListProps<T>) {
  const colCount = columns.length;
  const gridClass = colClassMap[colCount] || 'grid-cols-1';
  return (
    <Card className="w-full rounded-2xl shadow">
      <CardContent className="p-4 space-y-4">
        {/* Header */}
        <div className={`grid ${gridClass} text-sm font-semibold text-muted-foreground px-2`}>
          {/*<span className="3ws:invisible">#</span>*/}
          {columns.map((col, idx) => (
            <span key={idx}>{col.title}</span>
          ))}
        </div>
        <Separator />

        {/* Rows */}
        <ul className="space-y-2">
          {data.map((row, index) => (
            <li
              key={index}
              className={`grid ${gridClass} start-0 border-b-1 px-2 py-2 text-sm hover:bg-accent transition-colors`}
            >
              {/*<span className="font-medium xs:invisible">{index + 1}</span>*/}
              {columns.map((col, colIndex) => (
                <span className="overflow-hidden text-ellipsis" key={colIndex}>
                  {col.render
                    ? col.render(row[col.key], row, index)
                    : String(row[col.key] ?? '')}
                </span>
              ))}
            </li>
          ))}
        </ul>
        {
          pagination && pagination.total && pagination.page_total > 1 && (
            <PaginationComponent currentPage={pagination.page_index} totalPages={pagination.page_total}
                                 onPageChangeAction={cb} />
          )
        }
      </CardContent>
    </Card>
  );
}
