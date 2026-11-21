import { MongoClient, ObjectId, type Db, type Document, type Filter } from "mongodb";

/** Shared MongoDB connection for server-only payment code. */
const globalForMongo = globalThis as typeof globalThis & {
  mongoClientPromise?: Promise<MongoClient>;
};

export async function getDb(): Promise<Db> {
  const url = process.env.DB_URL;
  if (!url) throw new Error("DB_URL is not configured");

  globalForMongo.mongoClientPromise ??= new MongoClient(url).connect();
  const client = await globalForMongo.mongoClientPromise;
  return client.db("equipment-rental-platform");
}

/** Matches ids returned by the API (strings) and raw Mongo ObjectIds. */
export function idFilter(id: string): Filter<Document> {
  if (ObjectId.isValid(id)) return { _id: new ObjectId(id) };
  // Legacy documents may store ids as plain strings.
  return { _id: id } as unknown as Filter<Document>;
}
