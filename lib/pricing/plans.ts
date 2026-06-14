export type BillingCycle = 'monthly' | 'yearly';

export interface LandingPlan {
  id: string;
  name: string;
  description: string;
  cta: string;
  features: string[];
  billingCycle: BillingCycle;
  price: number;
  popular?: boolean;
  tag?: string;
  max_products?: number | null;
  max_staff?: number;
  max_branches?: number;
}

export interface RemotePlanResponse {
  id: number;
  name: string;
  price: number;
  billing_cycle: string | number;
  description?: string;
  max_products?: number | null;
  max_staff?: number;
  max_branches?: number;
}

function formatLimit(value: number | null | undefined, label: string): string {
  if (value === null || value === undefined) return `Không giới hạn ${label}`;
  return `${value} ${label}`;
}

export function normalizeBillingCycle(value: string | number): BillingCycle | null {
  if (value === 0 || value === '0' || value === 'monthly') return 'monthly';
  if (value === 1 || value === '1' || value === 'yearly') return 'yearly';
  return null;
}

function buildFeatures(plan: RemotePlanResponse): string[] {
  const features: string[] = [];
  if (plan.max_products !== undefined) features.push(formatLimit(plan.max_products, 'sản phẩm'));
  if (plan.max_branches !== undefined) features.push(formatLimit(plan.max_branches, 'chi nhánh'));
  if (plan.max_staff !== undefined) features.push(formatLimit(plan.max_staff, 'nhân viên'));
  return features;
}

export function mapRemotePlansToLanding(remotePlans: RemotePlanResponse[]): LandingPlan[] {
  return remotePlans
    .map(plan => {
      const billingCycle = normalizeBillingCycle(plan.billing_cycle);
      if (!billingCycle) return null;

      return {
        id: `${plan.id}-${billingCycle}`,
        name: plan.name,
        description: plan.description?.trim() || 'Gói dịch vụ dành cho nhu cầu vận hành của cửa hàng.',
        cta: plan.price === 0 ? 'Bắt đầu miễn phí' : 'Dùng thử 14 ngày',
        features: buildFeatures(plan),
        billingCycle,
        price: Number(plan.price || 0),
        popular: undefined,
        tag: undefined,
        max_products: plan.max_products,
        max_staff: plan.max_staff,
        max_branches: plan.max_branches,
      } as LandingPlan;
    })
    .filter((plan): plan is LandingPlan => Boolean(plan))
    .sort((leftPlan, rightPlan) => {
      if (leftPlan.billingCycle !== rightPlan.billingCycle) {
        return leftPlan.billingCycle === 'monthly' ? -1 : 1;
      }
      return leftPlan.price - rightPlan.price;
    });
}

export interface ComparisonRow {
  feature: string;
  values: Record<string, string | boolean>;
}

export function buildComparisonRows(plans: LandingPlan[]): ComparisonRow[] {
  const monthlyPlans = plans.filter(p => p.billingCycle === 'monthly');
  if (monthlyPlans.length === 0) return [];

  const rows: ComparisonRow[] = [];

  if (monthlyPlans.some(p => p.max_products !== undefined)) {
    const values: Record<string, string | boolean> = {};
    for (const plan of monthlyPlans) {
      values[plan.name] = plan.max_products === null ? 'Không giới hạn' : String(plan.max_products);
    }
    rows.push({ feature: 'Sản phẩm', values });
  }

  if (monthlyPlans.some(p => p.max_branches !== undefined)) {
    const values: Record<string, string | boolean> = {};
    for (const plan of monthlyPlans) {
      values[plan.name] = String(plan.max_branches ?? 1);
    }
    rows.push({ feature: 'Chi nhánh', values });
  }

  if (monthlyPlans.some(p => p.max_staff !== undefined)) {
    const values: Record<string, string | boolean> = {};
    for (const plan of monthlyPlans) {
      values[plan.name] = String(plan.max_staff ?? 1);
    }
    rows.push({ feature: 'Nhân viên', values });
  }

  rows.push(
    { feature: 'Quản lý bán hàng', values: Object.fromEntries(monthlyPlans.map(p => [p.name, true])) },
    { feature: 'Báo cáo chi tiết', values: Object.fromEntries(monthlyPlans.map(p => [p.name, p.price > 0])) },
    { feature: 'Hỗ trợ trực tuyến', values: Object.fromEntries(monthlyPlans.map(p => [p.name, p.price > 0 ? 'Ưu tiên' : 'Cộng đồng'])) },
  );

  return rows;
}

export const CYCLE_LABEL: Record<BillingCycle, string> = {
  monthly: 'tháng',
  yearly: 'năm',
};
