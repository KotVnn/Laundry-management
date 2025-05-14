import '@/lib/init';
import Order from '@/models/order.model';
import { IOrder } from '@/interfaces/order.interface';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order: IOrder = await req.json();
  console.log(order, 'order backend');
  const rs = await Order.findOneAndUpdate({ id }, {
    note: order.note,
    point: order.point,
    usePoint: order.usePoint,
    total: order.total,
    discount: order.discount,
    quantity: order.quantity,
    ...(order.newStatus && {
      $push: {
        status: { stt: order.newStatus }
      },
    }),
  }, { new: true });
  return Response.json(rs);
}