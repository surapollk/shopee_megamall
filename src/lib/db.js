import { createClient } from '@libsql/client';

let client = null;

export function getDb() {
  if (!client) {
    if (!process.env.TURSO_DATABASE_URL) {
      console.error('TURSO_DATABASE_URL is not set');
    }
    client = createClient({
      url: process.env.TURSO_DATABASE_URL,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });
  }
  return client;
}

export async function queryAll(sql, params = []) {
  const db = getDb();
  const result = await db.execute({ sql, args: params });
  // @libsql/client returns rows as an array of objects
  return result.rows;
}

export async function queryGet(sql, params = []) {
  const db = getDb();
  const result = await db.execute({ sql, args: params });
  return result.rows[0];
}
