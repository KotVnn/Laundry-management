import dbConnect from '@/lib/mongo';

(async () => {
  await dbConnect();
})();
