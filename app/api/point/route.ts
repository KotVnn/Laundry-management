import '@/lib/init';
import Point from '@/models/point.model';

export async function GET() {
  return new Response(JSON.stringify(await Point.findOne({}).lean()));
}