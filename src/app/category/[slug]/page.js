import { queryAll, queryGet } from '@/lib/db';
import Link from 'next/link';
import { getAffiliateLink } from '@/lib/affiliate';
import Pagination from '@/components/Pagination';
import SwipeToNavigate from '@/components/SwipeToNavigate';

export const revalidate = 3600;

const ITEMS_PER_PAGE = 48;

async function getProductsByCategory(category, page = 1) {
  const offset = (page - 1) * ITEMS_PER_PAGE;
  const sql = `
    SELECT id, itemid, title, price, item_sold, image_link, product_link, shop_rating
    FROM products
    WHERE category = ?
    ORDER BY item_sold DESC
    LIMIT ? OFFSET ?
  `;
  try {
    return await queryAll(sql, [category, ITEMS_PER_PAGE, offset]);
  } catch (e) {
    console.error(e);
    return [];
  }
}

async function getCategoryCount(category) {
  const sql = `SELECT COUNT(*) as count FROM products WHERE category = ?`;
  try {
    const row = await queryGet(sql, [category]);
    return row ? row.count : 0;
  } catch (e) {
    console.error(e);
    return 0;
  }
}

// Generate static params for the top 20 categories to make them super fast
export async function generateStaticParams() {
  const sql = `SELECT category FROM products GROUP BY category ORDER BY COUNT(*) DESC LIMIT 20`;
  try {
    const cats = await queryAll(sql);
    return cats.map(c => ({ slug: c.category }));
  } catch (e) {
    return [];
  }
}

export async function generateMetadata(props) {
  const params = await props.params;
  const category = decodeURIComponent(params.slug);
  return {
    title: `${category} ยอดฮิต อัปเดตล่าสุด | 7SHOP MEGA MALL`,
    description: `เลือกช้อปสินค้าในหมวดหมู่ ${category} กว่าแสนรายการที่ขายดีที่สุด การันตีคุณภาพและราคาถูกที่สุดที่ 7SHOP MEGA MALL`,
  };
}

export default async function CategoryPage(props) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  
  const category = decodeURIComponent(params.slug);
  const page = parseInt(searchParams.page || '1', 10);
  
  const products = await getProductsByCategory(category, page);
  const totalCount = await getCategoryCount(category);
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  return (
    <main className="main-content">
      <div style={{ marginBottom: '2rem' }}>
        <Link href="/" style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>← กลับหน้าแรก</Link>
        <h1 className="section-title" style={{ marginTop: '1rem', fontSize: '2.5rem' }}>
          {category}
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>พบสินค้าทั้งหมด {totalCount.toLocaleString()} รายการ (เรียงตามยอดขาย)</p>
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
