import { queryAll, queryGet } from '@/lib/db';
import Link from 'next/link';
import Pagination from '@/components/Pagination';
import SwipeToNavigate from '@/components/SwipeToNavigate';

export const revalidate = 0; // Dynamic route

const ITEMS_PER_PAGE = 48;

async function searchProducts(q, page = 1) {
  const offset = (page - 1) * ITEMS_PER_PAGE;
  // Use LIKE with wildcards for simple search
  const searchTerm = `%${q}%`;
  const sql = `
    SELECT id, itemid, title, price, item_sold, category, image_link, product_link, shop_rating
    FROM products
    WHERE title LIKE ?
    ORDER BY item_sold DESC
    LIMIT ? OFFSET ?
  `;
  try {
    return await queryAll(sql, [searchTerm, ITEMS_PER_PAGE, offset]);
  } catch (e) {
    console.error(e);
    return [];
  }
}

async function getSearchCount(q) {
  const searchTerm = `%${q}%`;
  const sql = `SELECT COUNT(*) as count FROM products WHERE title LIKE ?`;
  try {
    const row = await queryGet(sql, [searchTerm]);
    return row ? row.count : 0;
  } catch (e) {
    console.error(e);
    return 0;
  }
}

export async function generateMetadata(props) {
  const searchParams = await props.searchParams;
  const q = searchParams.q || '';
  return {
    title: q ? `ผลการค้นหาสำหรับ "${q}" | 7SHOP MEGA MALL` : 'ค้นหาสินค้า | 7SHOP MEGA MALL',
    description: `ค้นหาสินค้า ${q} จากกว่า 1 ล้านรายการใน 7SHOP MEGA MALL เพื่อรับโปรโมชั่นที่ดีที่สุด`,
  };
}

export default async function SearchPage(props) {
  const searchParams = await props.searchParams;
  const q = searchParams.q || '';
  const page = parseInt(searchParams.page || '1', 10);
  
  if (!q) {
    return (
      <main className="main-content">
        <h1 className="section-title">กรุณาระบุคำค้นหา</h1>
      </main>
    );
  }

  const products = await searchProducts(q, page);
  const totalCount = await getSearchCount(q);
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  return (
    <main className="main-content">
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="section-title" style={{ marginTop: '1rem', fontSize: '2rem' }}>
          ผลการค้นหา: "{q}"
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>พบสินค้าทั้งหมด {totalCount.toLocaleString()} รายการ</p>
      </div>

      {products.length === 0 ? (
        <div style={{ padding: '4rem 0', textAlign: 'center', color: 'var(--text-secondary)' }}>
          <h2>ไม่พบสินค้าที่คุณค้นหา</h2>
          <p>ลองใช้คำค้นหาอื่นดูอีกครั้งครับ</p>
        </div>
      ) : (
        <SwipeToNavigate currentPage={page} totalPages={totalPages}>
        <div className="products-grid">
          {products.map((p) => (
            <a href={p.product_link} target="_blank" rel="noopener noreferrer" className="product-card" key={p.id}>
              <div className="product-image-container">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.image_link} alt={p.title} className="product-image" loading="lazy" />
              </div>
              <div className="product-info">
                <h3 className="product-title">{p.title}</h3>
                <div className="product-meta">
                  <span className="product-price">฿{p.price.toLocaleString('th-TH')}</span>
                  <span className="product-sold">ขายแล้ว {p.item_sold.toLocaleString()}</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </SwipeToNavigate>
      )}

      <Pagination currentPage={page} totalPages={totalPages} />
    </main>
  );
}
