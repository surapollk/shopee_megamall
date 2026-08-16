import { queryAll, queryGet } from '@/lib/db';
import Link from 'next/link';
import { getAffiliateLink } from '@/lib/affiliate';
import Pagination from '@/components/Pagination';
import SwipeToNavigate from '@/components/SwipeToNavigate';

export const revalidate = 3600;

const ITEMS_PER_PAGE = 48;

async function getBestSellers(page = 1) {
  const offset = (page - 1) * ITEMS_PER_PAGE;
  const sql = `
    SELECT id, itemid, title, price, item_sold, category, image_link, product_link, shop_rating
    FROM products
    ORDER BY item_sold DESC
    LIMIT ? OFFSET ?
  `;
  try {
    return await queryAll(sql, [ITEMS_PER_PAGE, offset]);
  } catch (e) {
    console.error(e);
    return [];
  }
}

async function getTotalCount() {
  const sql = `SELECT COUNT(*) as count FROM products`;
  try {
    const row = await queryGet(sql);
    return row ? row.count : 0;
  } catch (e) {
    console.error(e);
    return 0;
  }
}

export async function generateMetadata() {
  return {
    title: 'สินค้าขายดีที่สุด อัปเดตล่าสุด | 7SHOP MEGA MALL',
    description: 'รวมสินค้าขายดีที่สุดกว่าล้านรายการใน 7SHOP MEGA MALL เลือกช้อปสินค้าคุณภาพที่คนไทยนิยมมากที่สุด',
  };
}

export default async function BestSellersPage(props) {
  const searchParams = await props.searchParams;
  const page = parseInt(searchParams.page || '1', 10);
  
  const products = await getBestSellers(page);
  const totalCount = await getTotalCount();
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  return (
    <main className="main-content">
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="section-title" style={{ marginTop: '1rem', fontSize: '2.5rem' }}>
          🔥 สินค้าขายดีที่สุด (Best Sellers)
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>สุดยอดสินค้าขายดีจากผู้ใช้งานทั้งหมด {totalCount.toLocaleString()} รายการ</p>
      </div>

      <SwipeToNavigate currentPage={page} totalPages={totalPages}>
        <div className="products-grid">
          {products.map((p) => (
            <a href={getAffiliateLink(p.product_link)} target="_blank" rel="noopener noreferrer" className="product-card" key={p.id}>
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

      <Pagination currentPage={page} totalPages={totalPages} />
    </main>
  );
}
