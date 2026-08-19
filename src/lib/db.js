import postgres from 'postgres';

let sql = null;

export function getDb() {
  if (!sql) {
    if (!process.env.SUPABASE_URL) {
      console.error('SUPABASE_URL is not set');
    }
    sql = postgres(process.env.SUPABASE_URL, { ssl: 'require' });
  }
  return sql;
}

export async function queryAll(queryString, params = []) {
  const db = getDb();
  let paramIndex = 1;
  const pgQueryString = queryString.replace(/\?/g, () => `$${paramIndex++}`);
  const result = await db.unsafe(pgQueryString, params);
  return result.map(row => {
    if (row.count !== undefined) {
      row.count = Number(row.count);
    }
    return row;
  });
}

export async function queryGet(queryString, params = []) {
  const db = getDb();
  let paramIndex = 1;
  const pgQueryString = queryString.replace(/\?/g, () => `$${paramIndex++}`);
  const result = await db.unsafe(pgQueryString, params);
  const row = result[0];
  if (row && row.count !== undefined) {
    row.count = Number(row.count);
  }
  return row;
}
