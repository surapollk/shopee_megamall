import { queryAll } from '@/lib/db';
import Link from 'next/link';

export const revalidate = 3600;

async function getAllCategories() {
  const sql = `
    SELECT category, COUNT(*) as count 
    FROM products 
    GROUP BY category 
    ORDER BY count DESC 
  `;
  try {
    return await queryAll(sql);
  } catch (e) {
    console.error(e);
    return [];
  }
}

export const metadata = {
  title: 'หมวดหมู่สินค้าทั้งหมด | 7SHOP MEGA MALL',
  description: 'รวมหมวดหมู่สินค้ายอดฮิตที่คุณต้องไม่พลาด ช้อปปิ้งของใช้ในบ้าน มือถือ ความงาม แฟชั่น และอื่นๆ อีกมากมาย',
};

export default async function CategoriesPage() {
  const categories = await getAllCategories();

  return (
    <main className="main-content">
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="section-title" style={{ marginTop: '1rem', fontSize: '2.5rem' }}>
          🏷️ หมวดหมู่สินค้าทั้งหมด
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>เลือกช้อปสินค้าจากหมวดหมู่ที่คุณสนใจ</p>
      </div>

      <div className="categories-grid" style={{ gap: '1.5rem' }}>
        {categories.map((cat, i) => (
          <Link 
            href={`/category/${encodeURIComponent(cat.category)}`} 
            key={i} 
            className="category-pill"
            style={{ fontSize: '1.125rem', padding: '1rem 2rem' }}
          >
            {cat.category} <span style={{ opacity: 0.6, fontSize: '0.875rem', marginLeft: '4px' }}>({cat.count.toLocaleString()})</span>
          </Link>
        ))}
      </div>
    </main>
  );
}
