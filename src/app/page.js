import { queryAll } from '@/lib/db';
import Link from 'next/link';
import HeroCarousel from '@/components/HeroCarousel';

export const revalidate = 3600; // Cache for 1 hour

async function getTopProducts() {
  const sql = `
    SELECT id, itemid, title, price, item_sold, category, image_link, product_link, shop_rating
    FROM products
    ORDER BY item_sold DESC
    LIMIT 24
  `;
  try {
    return await queryAll(sql);
  } catch (e) {
    console.error(e);
    return [];
  }
}

async function getTopCategories() {
  const sql = `
    SELECT category, COUNT(*) as count 
    FROM products 
    GROUP BY category 
    ORDER BY count DESC 
    LIMIT 10
  `;
  try {
    return await queryAll(sql);
  } catch (e) {
    console.error(e);
    return [];
  }
}

export const metadata = {
  title: '7SHOP MEGA MALL | ศูนย์รวมสินค้าคุณภาพกว่าล้านรายการ',
  description: 'ช้อปสนุกทุกวันกับสินค้านับล้านรายการ ค้นพบสินค้ายอดฮิต โปรโมชั่นเด็ด และดีลที่ดีที่สุดจากทุกหมวดหมู่ จัดส่งตรงถึงมือคุณ',
  keywords: 'ช้อปปิ้ง, ออนไลน์, สินค้าขายดี, สินค้าราคาถูก, 7shop, megamall',
};

export default async function Home() {
  const topProducts = await getTopProducts();
  const topCategories = await getTopCategories();

  return (
    <main className="main-content">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">ช้อปสนุกทุกวัน<br/>กับสินค้านับล้านรายการ</h1>
          <p className="hero-subtitle">ค้นพบสินค้ายอดฮิต โปรโมชั่นเด็ด และดีลที่ดีที่สุดจากทุกหมวดหมู่ จัดส่งตรงถึงมือคุณ</p>
          <Link href="/best-sellers" className="hero-btn">เลือกดูสินค้าขายดี</Link>
        </div>
        
        {/* Dynamic Rotating Banner */}
        <HeroCarousel products={topProducts.slice(0, 8)} />
      </section>

      {/* Categories */}
      <section>
        <h2 className="section-title">หมวดหมู่ยอดฮิต</h2>
        <div className="categories-grid">
          {topCategories.map((cat, i) => (
            <Link href={`/category/${encodeURIComponent(cat.category)}`} key={i} className="category-pill">
              {cat.category} <span style={{ opacity: 0.6, fontSize: '0.875rem', marginLeft: '4px' }}>({cat.count.toLocaleString()})</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Best Sellers */}
      <section>
        <h2 className="section-title">
          🔥 สินค้าขายดีที่สุด
          <Link href="/best-sellers" style={{ fontSize: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>ดูทั้งหมด →</Link>
        </h2>
        
        <div className="products-grid">
          {topProducts.map((p) => (
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
      </section>
    </main>
  );
}
