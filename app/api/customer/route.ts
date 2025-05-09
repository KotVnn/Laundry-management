import '@/lib/init';
import Customer from '@/models/customer.model'

export async function GET(request: Request) {
  const query = new URL(request.url).searchParams;
  const phone = query.get('phone');
  const customer = await Customer.findOne({ phone }, {_id: 0, __v: 0})
    .lean();
  if (!customer) {
    return new Response(JSON.stringify({ error: "Customer not found" }), {
      status: 404,
    });
  }
  return new Response(JSON.stringify(customer), {
    status: 200,
  });
}