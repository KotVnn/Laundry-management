// app/api/logout/route.ts
import { cookies } from 'next/headers';

export async function GET() {
  const cc = await cookies();
  cc.delete('accessToken');
  return new Response(JSON.stringify({ message: 'Logout successfully' }));
}
