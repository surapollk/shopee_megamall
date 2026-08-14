const sqlite3 = require('sqlite3');
const path = require('path');

const dbPath = path.resolve(__dirname, '../database.sqlite');
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
  if (err) {
    console.error('Error opening db:', err);
    process.exit(1);
  }
});

db.all("SELECT product_link FROM products LIMIT 5", (err, rows) => {
  if (err) {
    console.error(err);
  } else {
    console.log("Product Links:");
    rows.forEach(r => console.log(r.product_link));
  }
  db.close();
});
