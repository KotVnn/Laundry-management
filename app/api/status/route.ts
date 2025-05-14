import '@/lib/init';
import Status from '@/models/status.model';
import moment from 'moment/moment';

export async function GET() {
  return new Response(JSON.stringify(await Status.aggregate()
    .sort({ id: 1 })
      .addFields({
        mID: {$toString: '$_id'}
      })
    .exec()
    )
  )
}

export function POST() {
  return new Response(moment().format('MM-DD-YY-HHmm').replace(/-/g, ''));
}