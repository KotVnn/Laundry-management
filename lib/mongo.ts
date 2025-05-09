import mongoose from 'mongoose';

if (!process.env['MONGODB_URI']) {
  throw new Error('Vui lòng đặt biến môi trường MONGODB_URI trong .env.local');
}

const uri = process.env['MONGODB_URI'];

/**
 * Cached connection for MongoDB.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached) {
    if (cached.conn) {
      return cached.conn;
    }

    if (!cached.promise) {
      console.log('Connecting to MongoDB...', uri);
      cached.promise = mongoose.connect(uri).then((mongoose) => {
        return mongoose;
      });
    }
    cached.conn = await cached.promise;
    return cached.conn;
  }
}

export default dbConnect;
