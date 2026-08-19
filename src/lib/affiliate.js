/**
 * Converts a standard Shopee product URL into an Affiliate Universal Link.
 *
 * @param {string} productLink - The original Shopee product link.
 * @returns {string} - The affiliate-wrapped Shopee link.
 */
export function getAffiliateLink(productLink) {
  const AFF_ID = '15394320001';

  if (!productLink || typeof productLink !== 'string') {
    return '#';
  }

  try {
    const url = new URL(productLink);
    let originalUrl = productLink;

    // 1. ถ้าลิงก์ในฐานข้อมูลถูกครอบด้วย shope.ee/an_redir มาอยู่แล้ว ให้ดึงเอาเฉพาะลิงก์แท้ๆ (origin_link) ออกมา
    // เพื่อป้องกันการซ้อนทับกันของ Redirect ซึ่งอาจทำให้ Tracking หลุด
    if (url.searchParams.has('origin_link')) {
      originalUrl = decodeURIComponent(url.searchParams.get('origin_link'));
    }

    const cleanUrl = new URL(originalUrl);
    
    // 2. เติมพารามิเตอร์ของ Affiliate ให้ครบถ้วนตามกฎของ Shopee
    cleanUrl.searchParams.set('utm_source', `an_${AFF_ID}`);
    cleanUrl.searchParams.set('utm_medium', 'affiliates');
    cleanUrl.searchParams.set('utm_campaign', 'default_campaign');
    cleanUrl.searchParams.set('aff_id', AFF_ID);

    // 3. ส่งกลับเป็นลิงก์โดยตรง (Direct Link) Shopee Mobile Web จะทำการเปิด App ให้เองอย่างถูกต้อง
    return cleanUrl.toString();
  } catch (error) {
    console.error('Error generating affiliate link:', error);
    // Fallback to original link if parsing fails
    return productLink;
  }
}
