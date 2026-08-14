import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: '7SHOP MEGA MALL | ศูนย์รวมสินค้าคุณภาพกว่าล้านรายการ',
  description: 'ช้อปสนุกทุกวันกับสินค้านับล้านรายการ ค้นพบสินค้ายอดฮิต โปรโมชั่นเด็ด และดีลที่ดีที่สุดจากทุกหมวดหมู่ จัดส่งตรงถึงมือคุณ',
  keywords: 'ช้อปปิ้ง, ออนไลน์, สินค้าขายดี, สินค้าราคาถูก, 7shop, megamall',
  robots: 'index, follow',
};

export default function RootLayout({ children }) {
  return (
    <html lang="th">
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
