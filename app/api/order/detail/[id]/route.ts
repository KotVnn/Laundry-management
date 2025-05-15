import '@/lib/init';
import Order from '@/models/order.model';
import { IOrder } from '@/interfaces/order.interface';
import Customer from '@/models/customer.model';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order: IOrder = await req.json();
  const rs = await Order.findOneAndUpdate({ id }, {
    note: order.note,
    point: order.point,
    usePoint: order.usePoint,
    total: order.total,
    discount: order.discount,
    quantity: order.quantity,
    ...(order.newStatus && order.newStatus !== order.status[order.status.length - 1].mID && {
      $push: {
        status: { stt: order.newStatus },
      },
    }),
  }, { new: true });
  return Response.json(rs);
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await Order.findOne({ id });
  if (!order) return new Response(JSON.stringify({ message: 'Order not found' }), {
    status: 500,
    headers: { 'Content-Type': 'application/json' },
  });
  try {
    await Customer.findOneAndUpdate(
      {
        orders: order._id ? order._id : order._doc._id,  // tìm Customer có order._id trong mảng orders
      },
      { $pull: { orders: order._id ? order._id : order._doc._id } },
    );
    const rs = await Order.findOneAndDelete({ id });
    return Response.json(rs);
  } catch (error: any) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
