import { describe, expect, it } from 'vitest';
import {
  buildComparisonRows,
  mapRemotePlansToLanding,
  normalizeBillingCycle,
  type RemotePlanResponse,
} from './plans';

describe('normalizeBillingCycle', () => {
  it('maps monthly markers', () => {
    expect(normalizeBillingCycle(0)).toBe('monthly');
    expect(normalizeBillingCycle('0')).toBe('monthly');
    expect(normalizeBillingCycle('monthly')).toBe('monthly');
  });

  it('maps yearly markers', () => {
    expect(normalizeBillingCycle(1)).toBe('yearly');
    expect(normalizeBillingCycle('1')).toBe('yearly');
    expect(normalizeBillingCycle('yearly')).toBe('yearly');
  });

  it('returns null for unknown values', () => {
    expect(normalizeBillingCycle('weekly')).toBeNull();
    expect(normalizeBillingCycle(2)).toBeNull();
  });
});

describe('mapRemotePlansToLanding', () => {
  const remote: RemotePlanResponse[] = [
    {
      id: 2,
      name: 'Yearly',
      price: 100,
      billing_cycle: 1,
      max_products: 100,
      max_branches: 2,
      max_staff: 5,
    },
    { id: 1, name: 'Free', price: 0, billing_cycle: 0 },
  ];

  it('composes ids, sorts monthly first and keeps prices numeric', () => {
    const plans = mapRemotePlansToLanding(remote);
    expect(plans.map((plan) => plan.id)).toEqual(['1-monthly', '2-yearly']);
    expect(plans.map((plan) => plan.billingCycle)).toEqual(['monthly', 'yearly']);
    expect(plans[1].price).toBe(100);
  });

  it('labels the free plan and builds features from limits', () => {
    const plans = mapRemotePlansToLanding(remote);
    expect(plans[0].cta).toBe('Bắt đầu miễn phí');
    expect(plans[0].features).toEqual([]);
    expect(plans[1].cta).toBe('Chọn gói');
    expect(plans[1].features).toEqual(['100 sản phẩm', '2 chi nhánh', '5 nhân viên']);
  });

  it('drops plans with an unknown billing cycle', () => {
    const plans = mapRemotePlansToLanding([
      { id: 3, name: 'Weekly', price: 10, billing_cycle: 'weekly' },
    ]);
    expect(plans).toEqual([]);
  });
});

describe('buildComparisonRows', () => {
  it('returns empty rows when there are no monthly plans', () => {
    expect(buildComparisonRows([])).toEqual([]);
  });

  it('adds product/branch/staff rows from monthly limits', () => {
    const plans = mapRemotePlansToLanding([
      { id: 1, name: 'Free', price: 0, billing_cycle: 0, max_products: 50, max_branches: 1 },
      { id: 2, name: 'Pro', price: 99, billing_cycle: 0, max_products: null, max_branches: 3 },
    ]);
    const rows = buildComparisonRows(plans);
    const products = rows.find((row) => row.feature === 'Sản phẩm');
    expect(products?.values).toEqual({ Free: '50', Pro: 'Không giới hạn' });
    expect(rows.some((row) => row.feature === 'Chi nhánh')).toBe(true);
  });
});
