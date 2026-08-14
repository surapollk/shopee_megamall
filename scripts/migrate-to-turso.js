require('dotenv').config();
const { createClient } = require('@libsql/client');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const TURSO_URL = process.env.TURSO_DATABASE_URL;
const TURSO_TOKEN = process.env.TURSO_AUTH_TOKEN;

if (!TURSO_URL || !TURSO_TOKEN) {
  console.error('Error: TURSO_DATABASE_URL or TURSO_AUTH_TOKEN is missing in .env');
  process.exit(1);
}

const turso = createClient({
  url: TURSO_URL,
  authToken: TURSO_TOKEN,
});

const localDbPath = path.resolve(__dirname, '../../database.sqlite');
const localDb = new sqlite3.Database(localDbPath, sqlite3.OPEN_READONLY);

async function migrate() {
  console.log('Starting migration to Turso...');
  
  try {
    // 1. Create table on Turso
    console.log('Creating table on Turso...');
    await turso.execute(`
      CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        itemid TEXT,
        title TEXT,
        description TEXT,
        price INTEGER,
        stock INTEGER,
        item_sold INTEGER,
        category TEXT,
        image_link TEXT,
        product_link TEXT,
        shop_rating REAL
      )
    `);

    // 2. Read total rows from local DB
    const totalRow = await new Promise((resolve) => {
      localDb.get('SELECT COUNT(*) as count FROM products', (err, row) => resolve(row.count));
    });
    console.log(`Found ${totalRow} products in local database.`);

    // 3. Migrate in batches
    const BATCH_SIZE = 500;
    let offset = 0;
    
    while (offset < totalRow) {
      const rows = await new Promise((resolve, reject) => {
        localDb.all(`SELECT * FROM products LIMIT ${BATCH_SIZE} OFFSET ${offset}`, (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        });
      });

      if (rows.length === 0) break;

      const statements = rows.map(row => ({
        sql: `INSERT OR IGNORE INTO products (id, itemid, title, description, price, stock, item_sold, category, image_link, product_link, shop_rating) 
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          row.id ?? null,
          row.itemid ?? null,
          row.title ?? null,
          row.description ?? null,
          row.price ?? null,
          row.stock ?? null,
          row.item_sold ?? null,
          row.category ?? null,
          row.image_link ?? null,
          row.product_link ?? null,
          row.shop_rating ?? null
        ]
      }));

      // Execute batch transaction on Turso
      await turso.batch(statements, 'write');
      
      offset += rows.length;
      console.log(`Migrated ${offset} / ${totalRow} products... (${((offset/totalRow)*100).toFixed(2)}%)`);
    }

    console.log('Migration completed successfully!');
    
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    localDb.close();
  }
}

migrate();
