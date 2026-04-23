import { drizzle } from "drizzle-orm/neon-http";

type DatabaseClient = ReturnType<typeof drizzle>;

let cachedDb: DatabaseClient | null = null;

export function getDb(): DatabaseClient {
  if (cachedDb) {
    return cachedDb;
  }

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required");
  }

  cachedDb = drizzle(databaseUrl);
  return cachedDb;
}

export const db = new Proxy({} as DatabaseClient, {
  get(_target, prop) {
    const client = getDb() as unknown as Record<PropertyKey, unknown>;
    return client[prop];
  },
}) as DatabaseClient;
