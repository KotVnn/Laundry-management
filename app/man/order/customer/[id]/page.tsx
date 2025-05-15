import { OrderList } from '@/components/order/list-order';

export default async function OrderViaPhoneCustomerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <OrderList idCus={id} />;
}