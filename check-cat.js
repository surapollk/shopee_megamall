require('dotenv').config({ path: './.env' });
const { createClient } = require('@libsql/client');
const turso = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function run() {
  const res = await turso.execute(`SELECT category, COUNT(*) as count FROM products WHERE category LIKE '%คอม%' OR category LIKE '%แล็ป%' OR category LIKE '%แลป%' GROUP BY category`);
  console.log(res.rows);
}
run();
run();
