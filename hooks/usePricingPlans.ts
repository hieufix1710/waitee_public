import { useEffect, useMemo, useState } from 'react';
import { LANDING_PLANS, type BillingCycle, type LandingPlan } from '@/lib/pricing/plans';

interface PricingPlansApiResponse {
  source?: 'remote' | 'fallback';
  plans?: LandingPlan[];
}

export function usePricingPlans() {
  const [plans, setPlans] = useState<LandingPlan[]>(LANDING_PLANS);

  useEffect(() => {
    let isMounted = true;

    async function fetchPlans() {
      try {
        const response = await fetch('/api/pricing-plans', {
          method: 'GET',
          cache: 'no-store',
        });

        if (!response.ok) return;

        const payload = (await response.json()) as PricingPlansApiResponse;
        if (!isMounted || !Array.isArray(payload.plans) || payload.plans.length === 0) return;

        setPlans(payload.plans);
      } catch {
        return;
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
  };
}
