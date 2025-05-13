import '@/lib/init';
import Customer from '@/models/customer.model';
import { NextRequest } from 'next/server';

export async function GET(_: NextRequest, { params }: { params: Promise<{ phone: string }> }) {
  const { phone } = await params;
  const result = await Customer.aggregate([
    {
      $match: { phone },
    },
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
          $sum: '$orders.point',
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
  ]);
  if (!result || !result.length) {
    return new Response(JSON.stringify({ message: 'Customer not found' }), {
      status: 201,
    });
  }
  return new Response(JSON.stringify(result[0]), {
    status: 200,
  });
}
