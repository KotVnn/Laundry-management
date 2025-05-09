declare namespace NodeJS {
  interface Global {
    _mongoClientPromise?: Promise<any>;
    mongoose?: { conn: import('mongoose'); promise: Promise<typeof import('mongoose')> | null };
  }
}

declare const global: NodeJS.Global;
