require('dotenv').config({ path: './.env' });
const { createClient } = require('@libsql/client');
const postgres = require('postgres');
const path = require('path');

async function migrate() {
    const dbPath = path.join(__dirname, '..', 'database.sqlite');
    const localDb = createClient({ url: 'file:' + dbPath });
    
    let supabaseUrl = process.env.SUPABASE_URL;
    if (!supabaseUrl || supabaseUrl.includes('[YOUR-PASSWORD]')) {
        console.error('❌ กรุณาแก้รหัสผ่าน [YOUR-PASSWORD] ในไฟล์ web/.env ก่อนรันคำสั่งครับ');
        process.exit(1);
    }
    
    console.log('🔄 เชื่อมต่อกับ Supabase...');
    const sql = postgres(supabaseUrl, { ssl: 'require' });
    
    try {
        console.log('📦 สร้างตาราง products และ Index สำหรับการรองรับ 1 ล้าน Record...');
        await sql`
            CREATE TABLE IF NOT EXISTS products (
                id SERIAL PRIMARY KEY,
                itemid TEXT UNIQUE,
                title TEXT,
                price NUMERIC,
                item_sold INTEGER,
                category TEXT,
                image_link TEXT,
                product_link TEXT,
                shop_rating NUMERIC
            );
        `;
        
        // Add indexes
        await sql`CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);`;
        await sql`CREATE INDEX IF NOT EXISTS idx_products_item_sold ON products(item_sold DESC);`;
        
        try {
            await sql`CREATE EXTENSION IF NOT EXISTS pg_trgm;`;
            await sql`CREATE INDEX IF NOT EXISTS idx_products_title_trgm ON products USING gin (title gin_trgm_ops);`;
        } catch (e) {
            console.log('⚠️ ไม่สามารถสร้าง GIN Index ได้ (ข้ามไป):', e.message);
        }

        console.log('📥 กำลังดึงข้อมูลจาก Local Database (ทีละ 5,000 รายการ)...');
        let lastId = 0;
        let totalUploaded = 0;
        
        while (true) {
            const result = await localDb.execute({
                sql: 'SELECT * FROM products WHERE id > ? ORDER BY id ASC LIMIT 5000',
                args: [lastId]
            });
            const rows = result.rows;
            
            if (rows.length === 0) {
                break;
            }
            
            const values = rows.map(row => ({
                itemid: row.itemid ? String(row.itemid) : null,
                title: row.title,
                price: row.price,
                item_sold: row.item_sold,
                category: row.category,
                image_link: row.image_link,
                product_link: row.product_link,
                shop_rating: row.shop_rating
            }));
            
            await sql`
                INSERT INTO products ${sql(values)}
                ON CONFLICT (itemid) DO UPDATE SET
                    price = EXCLUDED.price,
                    item_sold = EXCLUDED.item_sold,
                    shop_rating = EXCLUDED.shop_rating
            `;
            
            totalUploaded += rows.length;
            lastId = rows[rows.length - 1].id;
            console.log(`✅ อัปโหลดแล้ว ${totalUploaded} / 1000000 รายการ...`);
        }
        
        console.log('🎉 ย้ายข้อมูลเสร็จสมบูรณ์ 100% !');
    } catch (err) {
        console.error('❌ เกิดข้อผิดพลาด:', err);
    } finally {
        await sql.end();
        process.exit(0);
    }
}

migrate();
