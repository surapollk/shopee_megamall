import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-col">
          <h3>เกี่ยวกับ 7SHOP MEGA</h3>
          <p>
            เว็บไซต์อีคอมเมิร์ซที่รวบรวมสินค้าคุณภาพกว่าล้านรายการในราคาที่ดีที่สุด
            พร้อมโปรโมชั่นพิเศษทุกวัน ให้คุณช้อปสนุก สะดวก ปลอดภัย ส่งตรงถึงหน้าบ้าน
          </p>
        </div>
        
        <div className="footer-col">
          <h3>หมวดหมู่ยอดนิยม</h3>
          <div className="footer-links">
            <Link href="/category/ของใช้ในบ้านและเฟอร์นิเจอร์" onClick={() => window.scrollTo(0,0)}>ของใช้ในบ้านและเฟอร์นิเจอร์</Link>
            <Link href="/category/คอมพิวเตอร์" onClick={() => window.scrollTo(0,0)}>คอมพิวเตอร์</Link>
            <Link href="/category/แล็ปท็อป" onClick={() => window.scrollTo(0,0)}>แล็ปท็อป</Link>
            <Link href="/category/มือถือและแก็ดเจ็ต" onClick={() => window.scrollTo(0,0)}>มือถือและแก็ดเจ็ต</Link>
            <Link href="/category/ความงามและเครื่องสำอาง" onClick={() => window.scrollTo(0,0)}>ความงามและเครื่องสำอาง</Link>
            <Link href="/categories" onClick={() => window.scrollTo(0,0)}>ดูหมวดหมู่ทั้งหมด →</Link>
          </div>
        </div>

        <div className="footer-col">
          <h3>เมนูลัด</h3>
          <div className="footer-links">
            <Link href="/" onClick={() => window.scrollTo(0,0)}>หน้าแรก</Link>
            <Link href="/best-sellers" onClick={() => window.scrollTo(0,0)}>🔥 สินค้าขายดีที่สุด</Link>
            <Link href="#" onClick={() => window.scrollTo(0,0)}>ติดต่อเรา</Link>
            <Link href="#" onClick={() => window.scrollTo(0,0)}>นโยบายความเป็นส่วนตัว</Link>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} 7SHOP MEGA MALL. All rights reserved.</p>
      </div>
    </footer>
  );
}
