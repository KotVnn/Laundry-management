import '@/lib/init';
import Order from '@/models/order.model';

export async function POST(req: Request) {
  const { order } = await req.json();
  const rs = await Order.insertOne(order);
  return Response.json(rs);
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { order } = await req.json();
  const rs = await Order.findOneAndUpdate({ id }, order, { new: true });
  return Response.json(rs);
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const rs = await Order.findOneAndDelete({ id });
  return Response.json(rs);
}