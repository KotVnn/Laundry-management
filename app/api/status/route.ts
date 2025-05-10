import '@/lib/init';
import Status from '@/models/status.model';

export async function GET() {
  return new Response(JSON.stringify(await Status.find({}, { _id: 0, __v: 0 }).sort({ id: 1 })));
}