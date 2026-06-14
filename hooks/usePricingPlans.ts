'use client';

import { useEffect, useMemo, useState } from 'react';
import { type BillingCycle, type LandingPlan, mapRemotePlansToLanding } from '@/lib/pricing/plans';

export function usePricingPlans() {
  const [plans, setPlans] = useState<LandingPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchPlans() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/backend-api/api/man/plans', {
          method: 'GET',
          cache: 'no-store',
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch plans: ${response.status}`);
        }

        const payload = (await response.json()) as any[];
        if (!isMounted || !Array.isArray(payload) || payload.length === 0) return;

        setPlans(mapRemotePlansToLanding(payload));
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to load plans');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchPlans();

    return () => {
      isMounted = false;
    };
  }, []);

  const plansByCycle = useMemo(() => {
    return plans.reduce<Record<BillingCycle, LandingPlan[]>>(
      (accumulator, plan) => {
        accumulator[plan.billingCycle].push(plan);
        return accumulator;
      },
      { monthly: [], yearly: [] }
    );
  }, [plans]);

  return {
    plans,
    plansByCycle,
    loading,
    error,
  };
}
