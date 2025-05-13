import '@/lib/init';
import Customer from '@/models/customer.model';
import { PipelineStage } from 'mongoose';

export async function GET(request: Request) {
  const queryStr = new URL(request.url).searchParams;

  // Lấy param query
  const pageIndex = Number(queryStr.get('page_index')) || 1;
  const pageSize = Number(queryStr.get('page_size')) || 10;
  const sortOrder = queryStr.get('sort') === '1' ? 1 : -1;
  const orderId = queryStr.get('orderId') || null;
  const phone = queryStr.get('phone') || undefined;
  // const address = queryStr.get('address') || undefined;
  // const fullname = queryStr.get('fullname') || undefined;

  // Tính skip
  const skip = (pageIndex - 1) * pageSize;

  const pipeline: PipelineStage[] = [
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
          {
            $lookup: {
              from: 'orders',
              localField: 'orders',
              foreignField: '_id',
              as: 'orders',
              pipeline: [
                {
                  $project: {
                    _id: 0,
                    customer: 0,
                  },
                },
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
          {
            $addFields: {
              point: {
                $let: {
                  vars: {
                    // truyền orderId vào để kiểm tra
                    queryOrderId: orderId,
                  },
                  in: {
                    $cond: [
                      { $ne: ['$$queryOrderId', null] }, // nếu orderId có tồn tại
                      {
                        $reduce: {
                          input: '$orders',
                          initialValue: 0,
                          in: {
                            $cond: [
                              { $eq: ['$$this.id', '$$queryOrderId'] }, // kiểm tra đúng id
                              '$$value',
                              { $add: ['$$value', '$$this.point'] },
                            ],
                          },
                        },
                      },
                      { $sum: '$orders.point' }, // không có orderId, cộng tất cả
                    ],
                  },
                },
              },
            },
          },
          {
            $addFields: {
              id: { $toString: '$_id' },
            },
          },
          {
            $project: {
              _id: 0,
              __v: 0,
            },
          },
        ],
      },
    },
  ];
  if (phone) {
    pipeline.unshift({
      $match: {
        phone,
      },
    });
  }

  const result = await Customer.aggregate(pipeline);
  if (!result || !result.length) {
    return new Response(JSON.stringify({ message: 'Customer not found' }), {
      status: 201,
    });
  }
  return new Response(JSON.stringify(result[0]), {
    status: 200,
  });
}
