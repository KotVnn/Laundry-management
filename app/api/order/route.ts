import { IMetaPagination } from '@/interfaces/pagination.interface';
import '@/lib/init';
import Order from '@/models/order.model';
import { PipelineStage } from 'mongoose';
import moment from 'moment';

export async function GET(request: Request) {
  const queryStr = new URL(request.url).searchParams;

  // Lấy param query
  const pageIndex = Number(queryStr.get('page_index')) || 1;
  const pageSize = Number(queryStr.get('page_size')) || 10;
  const sortOrder = queryStr.get('sort') === '1' ? 1 : -1;
  const phone = queryStr.get('phone') || undefined;
  const status = queryStr.get('status') || undefined;

  // Xử lý ngày từ param, dùng moment để dễ dàng xử lý
  const fromDate = queryStr.get('from')
    ? moment(queryStr.get('from'))
    : moment('2020-01-01'); // default từ 1/1/2020 nếu không có tham số từ

  const toDate = queryStr.get('to')
    ? moment(queryStr.get('to'))
    : moment(); // đến giờ hiện tại nếu không có tham số to

  // Tính skip
  const skip = (pageIndex - 1) * pageSize;

  // Tạo pipeline với điều kiện lọc ngày
  const pipeline: PipelineStage[] = [
    // Phần filter chung cho cả đếm và dữ liệu
    {
      $match: {
        date: {
          $gte: fromDate.toDate(),
          $lte: toDate.toDate(),
        },
        ...(phone ? { phone } : {}),
        ...(status ? { status } : {}),
      },
    },
    {
      $facet: {
        totalCount: [
          { $count: 'count' },
        ],
        data: [
          // Sắp xếp
          { $sort: { _id: sortOrder } },
          // Phân trang
          { $skip: skip },
          { $limit: pageSize },
          // Các lookup, unwind, addFields,... như hiện tại của bạn
          {
            $lookup: {
              from: 'customers',
              localField: 'customer',
              foreignField: '_id',
              as: 'customer',
              pipeline: [
                {
                  $project: {
                    _id: 0,
                    fullName: 1,
                    phone: 1,
                    address: 1,
                    pointUsed: 1,
                  },
                },
              ],
            },
          },
          { $unwind: '$customer' },
          {
            $lookup: {
              from: 'status',
              localField: 'status.stt',
              foreignField: '_id',
              as: 'statusData',
              pipeline: [
                {
                  $project: {
                    name: 1,
                    _id: 0,
                  },
                },
              ],
            },
          },
          {
            $addFields: {
              status: {
                $map: {
                  input: { $range: [0, { $size: '$status' }] },
                  as: 'idx',
                  in: {
                    $mergeObjects: [
                      {
                        name: { $arrayElemAt: ['$statusData.name', '$$idx'] },
                        time: { $arrayElemAt: ['$status.time', '$$idx'] },
                      },
                    ],
                  },
                },
              },
            },
          },
          {
            $project: {
              _id: 0,
              statusData: 0,
              __v: 0,
            },
          },
        ],
      },
    },
  ];


  const orders = await Order.aggregate(pipeline).exec();

  if (!orders) {
    return new Response(JSON.stringify({ error: 'Orders not found' }), {
      status: 500,
    });
  }
  const total = orders[0].totalCount[0]?.count || 0;
  const data: IMetaPagination = {
    meta: {
      page_size: pageSize,
      page_index: pageIndex,
      page_total: Math.ceil(total / pageSize),
      total,
    },
    data: orders[0].data,
  };
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}