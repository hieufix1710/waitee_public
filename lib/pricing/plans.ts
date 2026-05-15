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
}

export interface RemotePlanResponse {
  id: number;
  name: string;
  price: number;
  billing_cycle: string | number;
  description?: string;
}

export const LANDING_PLANS: LandingPlan[] = [
  {
    id: 'free-monthly',
    name: 'Free',
    description: 'Miễn phí trọn đời với các tính năng thiết yếu để bắt đầu.',
    cta: 'Bắt đầu miễn phí',
    features: [
      '100 sản phẩm',
      '1 chi nhánh',
      '1 nhân viên',
      'Báo cáo cơ bản',
    ],
    billingCycle: 'monthly',
    price: 0,
    tag: 'MIỄN PHÍ',
  },
  {
    id: 'basic-monthly',
    name: 'Gói cơ bản',
    description: 'Phù hợp cho cửa hàng đang vận hành ổn định hằng ngày.',
    cta: 'Dùng thử 14 ngày',
    features: [
      'Quản lý bán hàng, tồn kho, đơn hàng',
      'Hỗ trợ trực tuyến',
      'Báo cáo chi tiết',
      'Phù hợp cửa hàng vừa và nhỏ',
    ],
    billingCycle: 'monthly',
    price: 120000,
    popular: true,
    tag: 'PHỔ BIẾN',
  },
  {
    id: 'basic-yearly',
    name: 'Gói cơ bản',
    description: 'Gói theo năm cho kế hoạch vận hành dài hạn.',
    cta: 'Dùng thử 14 ngày',
    features: [
      'Quản lý bán hàng, tồn kho, đơn hàng',
      'Hỗ trợ trực tuyến',
      'Báo cáo chi tiết',
      'Thanh toán theo năm',
    ],
    billingCycle: 'yearly',
    price: 1200000,
    tag: 'THEO NĂM',
  },
];

const DEFAULT_FEATURES_BY_PLAN: Record<string, string[]> = {
  free: ['100 sản phẩm', '1 chi nhánh', '1 nhân viên', 'Báo cáo cơ bản'],
  'gói cơ bản': [
    'Quản lý bán hàng, tồn kho, đơn hàng',
    'Hỗ trợ trực tuyến',
    'Báo cáo chi tiết',
    'Phù hợp cửa hàng vừa và nhỏ',
  ],
};

function normalizeName(name: string): string {
  return name.trim().toLowerCase();
}

export function normalizeBillingCycle(value: string | number): BillingCycle | null {
  if (value === 0 || value === '0' || value === 'monthly') return 'monthly';
  if (value === 1 || value === '1' || value === 'yearly') return 'yearly';
  return null;
}

function getDefaultTag(name: string, cycle: BillingCycle): string | undefined {
  const normalized = normalizeName(name);
  if (normalized === 'free') return 'MIỄN PHÍ';
  if (normalized === 'gói cơ bản' && cycle === 'monthly') return 'PHỔ BIẾN';
  if (cycle === 'yearly') return 'THEO NĂM';
  return undefined;
}

export function mapRemotePlansToLanding(remotePlans: RemotePlanResponse[]): LandingPlan[] {
  const mappedPlans = remotePlans
    .map(plan => {
      const billingCycle = normalizeBillingCycle(plan.billing_cycle);
      if (!billingCycle) return null;

      const normalizedName = normalizeName(plan.name);
      const template = LANDING_PLANS.find(
        item => normalizeName(item.name) === normalizedName && item.billingCycle === billingCycle
      );

      const fallbackFeatures = DEFAULT_FEATURES_BY_PLAN[normalizedName] || [
        'Quản lý bán hàng và vận hành',
        'Báo cáo doanh thu',
        'Hỗ trợ kỹ thuật',
      ];

      return {
        id: `${plan.id}-${billingCycle}`,
        name: plan.name,
        description:
          plan.description?.trim() ||
          template?.description ||
          'Gói dịch vụ dành cho nhu cầu vận hành của cửa hàng.',
        cta: template?.cta || (plan.price === 0 ? 'Bắt đầu miễn phí' : 'Dùng thử 14 ngày'),
        features: template?.features || fallbackFeatures,
        billingCycle,
        price: Number(plan.price || 0),
        popular: template?.popular,
        tag: template?.tag || getDefaultTag(plan.name, billingCycle),
      } as LandingPlan;
    })
    .filter((plan): plan is LandingPlan => Boolean(plan));

  if (mappedPlans.length === 0) {
    return LANDING_PLANS;
  }

  return mappedPlans.sort((leftPlan, rightPlan) => {
    if (leftPlan.billingCycle !== rightPlan.billingCycle) {
      return leftPlan.billingCycle === 'monthly' ? -1 : 1;
    }
    return leftPlan.price - rightPlan.price;
  });
}

export const PRICING_COMPARISON_ROWS = [
  { feature: 'Sản phẩm', free: '100', basic: 'Theo gói hiện hành' },
  { feature: 'Chi nhánh', free: '1', basic: 'Theo gói hiện hành' },
  { feature: 'Nhân viên', free: '1', basic: 'Theo gói hiện hành' },
  { feature: 'Quản lý bán hàng', free: true, basic: true },
  { feature: 'Báo cáo chi tiết', free: false, basic: true },
  { feature: 'Hỗ trợ trực tuyến', free: 'Cộng đồng', basic: 'Ưu tiên' },
];

export const CYCLE_LABEL: Record<BillingCycle, string> = {
  monthly: 'tháng',
  yearly: 'năm',
};
