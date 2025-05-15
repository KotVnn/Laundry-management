import { IMetaPagination } from '@/interfaces/pagination.interface';
import '@/lib/init';
import Order from '@/models/order.model';
import { PipelineStage, Types } from 'mongoose';
import moment from 'moment';
import { IOrder } from '@/interfaces/order.interface';
import Customer from '@/models/customer.model';

export async function GET(request: Request) {
  const queryStr = new URL(request.url).searchParams;

  // Lấy param query
  const pageIndex = Number(queryStr.get('page_index')) || 1;
  const pageSize = Number(queryStr.get('page_size')) || 10;
  const sortOrder = queryStr.get('sort') === '1' ? 1 : -1;
  const note = queryStr.get('note') || undefined;
  const idCus = queryStr.get('idCus') || undefined;

  const status = queryStr.get('status') || undefined;
  const orderId = queryStr.get('orderId') || undefined;

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
        $or: [
          ...(note ? [{ note: new RegExp(note, 'i') }] : [{}]),
          ...(status ? [{ status }] : [{}]),
        ],
        ...(orderId ? { id: orderId } : {}),
        ...(idCus ? { customer: new Types.ObjectId(idCus) } : {}),
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
                  $addFields: {
                    id: { $toString: '$_id' },
                  },
                },
                {
                  $project: {
                    _id: 0,
                    fullName: 1,
                    phone: 1,
                    address: 1,
                    pointUsed: 1,
                    point: 1,
                    id: 1,
                  },
                },
              ],
            },
          },
          { $unwind: '$customer' },
          {
            $lookup: {
              from: "status",
              let: { sttList: "$status.stt" },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $in: ["$_id", "$$sttList"]
                    }
                  }
                },
                {
                  $addFields: {
                    mID: { $toString: "$_id" }
                  }
                },
                {
                  $project: {
                    _id: 0,
                    name: 1,
                    mID: 1,
                    stt: "$_id"
                  }
                }
              ],
              as: "statusData"
            }
          },
          {
            $addFields: {
              status: {
                $map: {
                  input: "$status",
                  as: "s",
                  in: {
                    $mergeObjects: [
                      "$$s",
                      {
                        $let: {
                          vars: {
                            matched: {
                              $first: {
                                $filter: {
                                  input: "$statusData",
                                  as: "d",
                                  cond: { $eq: ["$$d.stt", "$$s.stt"] }
                                }
                              }
                            }
                          },
                          in: {
                            name: "$$matched.name",
                            mID: "$$matched.mID"
                          }
                        }
                      }
                    ]
                  }
                }
              }
            }
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

export async function POST(req: Request) {
  try {
    const order: IOrder = await req.json();
    const phoneSanitized = order.customer.phone.replace(/[-. +]/g, '');

    // Nếu khách hàng chưa có id, tạo mới
    if (!order.customer.id.length) {
      await Customer.findOneAndUpdate({ phone: phoneSanitized }, {
        fullName: order.customer.fullName,
        phone: phoneSanitized,
        pointUsed: 0,
        address: order.customer.address,
      }, { upsert: true });
    }

    // Tìm khách hàng theo số điện thoại
    const cus = await Customer.findOne({ phone: phoneSanitized });
    if (!cus) return new Response(JSON.stringify({ message: 'Customer not found' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });

    const obj = {
      id: moment().format('MM-DD-YY-HHmm').replace(/-/g, ''),
      quantity: order.quantity,
      date: new Date(),
      usePoint: !!order.discount,
      point: order.point,
      note: order.note,
      total: order.total,
      discount: order.discount,
      status: [{ stt: new Types.ObjectId(order.newStatus ? order.newStatus : '') }],
      customer: cus._id ? cus._id : cus._doc._id,
    };

    let newOrder: any;
    try {
      // Tạo đơn hàng mới
      newOrder = await Order.create(obj);
      newOrder.save();
    } catch (error: any) {
      return new Response(JSON.stringify({ message: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Cập nhật danh sách đơn hàng của khách hàng
    await Customer.findOneAndUpdate(
      { phone: phoneSanitized },
      {
        $push: {
          orders: {
            $each: [newOrder._id],
            $position: 0,
          },
        },
      },
    );

    return new Response(JSON.stringify(newOrder), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
