'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

// The web onboarding lives at /onboard (full sign-up + shop + email verification).
export default function SignupPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/onboard');
  }, [router]);

  return null;
}
