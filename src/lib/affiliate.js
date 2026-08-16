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
    
    // Add standard UTM parameters for tracking
    url.searchParams.set('utm_source', `an_${AFF_ID}`);
    url.searchParams.set('utm_medium', 'affiliates');
    url.searchParams.set('utm_campaign', 'default_campaign');
    url.searchParams.set('aff_id', AFF_ID);

    // Encode the modified URL
    const encodedOriginalUrl = encodeURIComponent(url.toString());

    // Construct the Universal Link format which forces the app to open and tracks the affiliate ID
    const universalLink = `https://shopee.co.th/universal-link/?url=${encodedOriginalUrl}&aff_id=${AFF_ID}`;

    return universalLink;
  } catch (error) {
    console.error('Error generating affiliate link:', error);
    // Fallback to original link if parsing fails
    return productLink;
  }
}
