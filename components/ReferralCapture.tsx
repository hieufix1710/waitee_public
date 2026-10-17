'use client';

import { useEffect } from 'react';
import { captureRefFromUrl } from '@/lib/referral';

/**
 * Headless component that captures an affiliate referral code (`?ref=<code>`)
 * from the URL once on mount and stores it for later submission.
 */
export default function ReferralCapture() {
  useEffect(() => {
    captureRefFromUrl();
  }, []);

  return null;
}
