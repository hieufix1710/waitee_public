export const appUrl = {
  ios: 'https://apps.apple.com/vn/app/waitee-pos/id6770238244',
  android: 'https://play.google.com/store/apps/details?id=com.dinohiu.waitee',
};

// Standalone affiliate app (external). Configurable at build time.
export const affiliateUrl = process.env.NEXT_PUBLIC_AFFILIATE_URL || 'http://localhost:3006';
