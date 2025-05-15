import '@/lib/init';
import Config from '@/models/config.model';
import Status from '@/models/status.model';
import { IStatus } from '@/interfaces/status.interface';

export async function GET() {
  const config = await Config.findOne({}).lean();
  const status: IStatus[] = await Status.aggregate()
    .sort({ id: 1 })
    .addFields({
      mID: {$toString: '$_id'}
    })
    .exec();
  return new Response(JSON.stringify({ ...config, status}));
}