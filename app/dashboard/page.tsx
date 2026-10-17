'use client';

import BrandLogo from '@/components/BrandLogo';
import { authFetch, getStoredAuth, useAuth } from '@/lib/auth';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { getStoredRef } from '@/lib/referral';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowLeft,
  Building2,
  LogOut,
  MapPin,
  Plus,
  ShoppingCart,
  Store,
  User,
  X,
} from 'lucide-react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Toaster, toast } from 'sonner';

interface StoreItem {
  store_uid: string;
  store_name: string;
  store_address: string;
  tenant_name: string;
  role?: string;
  logo_url?: string | null;
}

interface ShopCategory {
  id: number | string;
  name: string;
}

interface ShopCategoriesResponse {
  source: 'remote' | 'fallback';
  categories: ShopCategory[];
}

export default function DashboardPage() {
  const { t } = useLanguage();
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [stores, setStores] = useState<StoreItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [tenantFilter, setTenantFilter] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  const [tenantName, setTenantName] = useState('');
  const [shopName, setShopName] = useState('');
  const [address, setAddress] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [creating, setCreating] = useState(false);
  // Which existing tenant the new shop belongs to. Empty string means "create a
  // brand-new tenant" (onboarding); a name means "add a branch to that tenant".
  const [targetTenant, setTargetTenant] = useState('');
  // Set when the branch would exceed the plan's included branches: holds the
  // extra fee Rails quoted so we can confirm it before actually creating.
  const [branchQuote, setBranchQuote] = useState<{
    amount: number;
    billingCycle: string;
    includedBranches: number;
  } | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: categoryOptions = [], isLoading: isCategoriesLoading } = useQuery({
    queryKey: ['shop-categories'],
    queryFn: async (): Promise<ShopCategory[]> => {
      try {
        const response = await fetch('/api/shop-categories', { cache: 'no-store' });
        const payload = (await response.json()) as ShopCategoriesResponse;
        return payload.categories;
      } catch {
        return [];
      }
    },
    staleTime: 5 * 60 * 1000,
  });

  const otherLabel: string = t.common.other ?? 'Other';

  // Distinct tenants the merchant can manage (owner/manager), so we only offer
  // "add a branch" where the backend will actually authorize it.
  const tenantOptions = useMemo(
    () =>
      Array.from(
        new Set(
          stores
            .filter((store) => !store.role || store.role === 'owner' || store.role === 'manager')
            .map((store) => store.tenant_name)
            .filter(Boolean),
        ),
      ),
    [stores],
  );

  // A chosen existing tenant means we add a branch to it; an empty selection
  // means onboarding a brand-new tenant from scratch.
  const isBranchMode = targetTenant !== '';

  const fetchStores = async () => {
    try {
      const auth = getStoredAuth();
      if (!auth) return;
      // When the user logged in with a specific tenant, only show the stores
      // they can access within it.
      const tenant = typeof auth.tenant === 'string' ? auth.tenant.trim() : '';
      setTenantFilter(tenant);

      // Sessions can hold either a Doorkeeper access token (OAuth) or a legacy
      // JWT (onboarding OTP); authFetch sends both headers so the backend
      // accepts either, and logs out + redirects on a 401.
      const res = await authFetch('/api/user/accessible-stores');
      if (res.ok) {
        const body = await res.json();
        const all: StoreItem[] = body?.data || [];
        setStores(tenant ? all.filter((store) => store.tenant_name === tenant) : all);
      }
    } catch {
      // empty
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!mounted) return;
    if (!isAuthenticated) {
      router.replace('/login');
      return;
    }
    fetchStores();
  }, [mounted, isAuthenticated, router]);

  const frontendUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3002';

  const handleOpenPos = (tenantName: string) => {
    try {
      const raw = localStorage.getItem('hiu-auth');
      if (raw) {
        const auth = JSON.parse(raw);
        auth.tenant = tenantName;
        const hashData = btoa(encodeURIComponent(JSON.stringify(auth)));
        window.location.href = `${frontendUrl}/login#auth=${hashData}&tenant=${encodeURIComponent(tenantName)}`;
        return;
      }
    } catch {
      // empty
    }
    window.location.href = `${frontendUrl}/login`;
  };

  const handleCreateShop = async () => {
    if (!tenantName.trim()) {
      toast.error('Vui lòng nhập tên cửa hàng (tenant)');
      return;
    }
    if (!shopName.trim()) {
      toast.error('Vui lòng nhập tên cửa hàng');
      return;
    }
    if (!address.trim()) {
      toast.error('Vui lòng nhập địa chỉ');
      return;
    }
    if (!categoryId) {
      toast.error('Vui lòng chọn loại hình kinh doanh');
      return;
    }
    if (categoryId === otherLabel && !customCategory.trim()) {
      toast.error('Vui lòng nhập ngành hàng cụ thể');
      return;
    }

    setCreating(true);
    try {
      const auth = getStoredAuth();
      if (!auth) {
        toast.error('Phiên đăng nhập hết hạn');
        return;
      }

      const ref = getStoredRef();

      const res = await authFetch('/api/user/onboard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user: { email: auth.user.email },
          tenantName: tenantName.trim(),
          ...(ref ? { ref } : {}),
          shop: {
            name: shopName.trim(),
            address: address.trim(),
            categoryId,
            customCategory: categoryId === otherLabel ? customCategory.trim() : undefined,
          },
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        toast.error(data.message || 'Tạo cửa hàng thất bại');
        return;
      }

      toast.success('Tạo cửa hàng thành công!');
      setShowCreateModal(false);
      resetShopForm();
      setLoading(true);
      await fetchStores();
    } catch {
      toast.error('Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setCreating(false);
    }
  };

  const resetShopForm = () => {
    setTenantName('');
    setShopName('');
    setAddress('');
    setCategoryId('');
    setCustomCategory('');
  };

  const closeCreateModal = () => {
    setShowCreateModal(false);
    setBranchQuote(null);
  };

  const handleCreateBranch = async (confirmed = false) => {
    if (!shopName.trim()) {
      toast.error('Vui lòng nhập tên chi nhánh');
      return;
    }
    if (!address.trim()) {
      toast.error('Vui lòng nhập địa chỉ');
      return;
    }

    setCreating(true);
    try {
      const auth = getStoredAuth();
      if (!auth) {
        toast.error('Phiên đăng nhập hết hạn');
        return;
      }

      const res = await authFetch('/api/user/branches', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tenant: targetTenant,
          shop: { name: shopName.trim(), address: address.trim() },
          confirmed,
        }),
      });

      const data = await res.json().catch(() => ({}));

      // Branch exceeds the plan's included branches: Rails returns a quote
      // instead of creating. Show the extra fee and wait for confirmation.
      if (res.ok && data?.confirmation_required) {
        setBranchQuote({
          amount: Number(data.extra_branch_amount) || 0,
          billingCycle: String(data.billing_cycle || 'monthly'),
          includedBranches: Number(data.included_branches) || 0,
        });
        return;
      }

      if (!res.ok) {
        toast.error(data.message || 'Tạo chi nhánh thất bại');
        return;
      }

      toast.success('Tạo chi nhánh thành công!');
      closeCreateModal();
      resetShopForm();
      setLoading(true);
      await fetchStores();
    } catch {
      toast.error('Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setCreating(false);
    }
  };

  const handleSubmit = () => (isBranchMode ? handleCreateBranch() : handleCreateShop());

  const openCreateModal = () => {
    resetShopForm();
    setBranchQuote(null);
    setTargetTenant(
      tenantFilter && tenantOptions.includes(tenantFilter) ? tenantFilter : tenantOptions[0] || '',
    );
    setShowCreateModal(true);
  };

  // Modal a11y: close on Escape, lock background scroll, move focus into the
  // dialog and restore it to the trigger when closed.
  useEffect(() => {
    if (!showCreateModal) return;
    previouslyFocusedRef.current = document.activeElement as HTMLElement | null;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowCreateModal(false);
        setBranchQuote(null);
        return;
      }
      if (event.key !== 'Tab' || !modalRef.current) return;
      const focusable = Array.from(
        modalRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;
      if (event.shiftKey && (active === first || active === modalRef.current)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const frame = window.requestAnimationFrame(() => modalRef.current?.focus());
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = originalOverflow;
      window.cancelAnimationFrame(frame);
      previouslyFocusedRef.current?.focus();
    };
  }, [showCreateModal]);

  if (!mounted || !user) {
    return (
      <main
        id="main-content"
        tabIndex={-1}
        aria-busy="true"
        aria-live="polite"
        className="flex min-h-screen items-center justify-center bg-zinc-50"
      >
        <span className="sr-only">{t.common.loading}</span>
        <div
          className="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"
          aria-hidden="true"
        />
      </main>
    );
  }

  return (
    <>
      <main id="main-content" tabIndex={-1} className="min-h-screen bg-zinc-50">
        <nav className="border-b border-zinc-200 bg-white px-6 py-4">
          <div className="mx-auto flex max-w-5xl items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600">
                <BrandLogo className="h-8 w-8 object-contain" />
              </div>
              <span className="text-lg font-bold text-zinc-900">WaiteeRetail</span>
            </Link>
            <div className="flex items-center gap-3">
              <Link
                href="/profile"
                className="hidden items-center gap-2 rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-50 sm:flex"
              >
                <User className="h-4 w-4" />
                {t.profile?.title || 'Hồ sơ'}
              </Link>
              <Link
                href="/"
                className="hidden items-center gap-2 rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-50 sm:flex"
              >
                <ArrowLeft className="h-4 w-4" />
                {t.common?.backHome || 'Về trang chủ'}
              </Link>
              <button
                onClick={() => {
                  logout();
                  router.push('/');
                }}
                className="flex items-center gap-2 rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-50"
              >
                <LogOut className="h-4 w-4 text-red-500" />
                {t.common?.logout || 'Đăng xuất'}
              </button>
            </div>
          </div>
        </nav>

        <div className="mx-auto max-w-3xl px-4 py-12">
          <div className="mb-8 rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50">
                <User className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-zinc-900">
                  {user.full_name || `${user.first_name} ${user.last_name}`}
                </h2>
                <p className="text-sm text-zinc-500">{user.email}</p>
              </div>
            </div>
          </div>

          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="flex items-center gap-2 text-lg font-bold text-zinc-900">
              <Store className="h-5 w-5 text-blue-600" />
              {tenantFilter
                ? `Cửa hàng trong ${tenantFilter}`
                : t.dashboard?.storeInfo || 'Cửa hàng của tôi'}
            </h3>
            {!loading && stores.length > 0 && tenantOptions.length > 0 && (
              <button
                onClick={openCreateModal}
                className="flex shrink-0 items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white transition-all hover:bg-blue-700"
              >
                <Plus className="h-4 w-4" />
                {t.dashboard?.addBranch || 'Thêm chi nhánh'}
              </button>
            )}
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="h-24 animate-pulse rounded-2xl bg-zinc-100" />
              ))}
            </div>
          ) : stores.length === 0 ? (
            <div className="rounded-2xl border border-zinc-100 bg-white p-8 text-center shadow-sm">
              <Store className="mx-auto mb-3 h-8 w-8 text-zinc-300" />
              <p className="mb-4 text-sm text-zinc-500">
                {tenantFilter
                  ? `Bạn không có cửa hàng nào trong ${tenantFilter}.`
                  : t.dashboard?.noStores || 'Chưa có cửa hàng nào'}
              </p>
              <button
                onClick={openCreateModal}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-blue-700"
              >
                <Plus className="h-4 w-4" />
                {t.dashboard?.createShop || 'Tạo cửa hàng'}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {stores.map((store) => (
                <div
                  key={store.store_uid}
                  className="rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm"
                >
                  <div className="mb-4 flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50">
                      <Building2 className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-zinc-900">{store.store_name}</p>
                      <p className="text-xs text-zinc-500">{store.store_address}</p>
                      <p className="mt-1 text-xs font-medium text-blue-600">{store.tenant_name}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleOpenPos(store.tenant_name)}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white transition-all hover:bg-blue-700"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    {t.dashboard?.openPos || 'Mở POS'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Create Shop Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <motion.div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="create-shop-title"
            tabIndex={-1}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full max-w-lg rounded-2xl border border-zinc-100 bg-white p-6 shadow-xl focus:outline-none"
          >
            <button
              type="button"
              onClick={closeCreateModal}
              aria-label={t.common.close}
              className="absolute right-4 top-4 text-zinc-400 transition-colors hover:text-zinc-600"
            >
              <X className="h-5 w-5" />
            </button>

            {branchQuote ? (
              <div>
                <h3 id="create-shop-title" className="mb-1 text-xl font-bold text-zinc-900">
                  {t.dashboard?.extraBranchTitle || 'Chi nhánh vượt gói'}
                </h3>
                <p className="mb-4 text-sm text-zinc-600">
                  {(
                    t.dashboard?.extraBranchMessage ||
                    'Cửa hàng của bạn đã đủ {{included}} chi nhánh trong gói. Thêm chi nhánh này sẽ tính thêm {{amount}}/{{cycle}}.'
                  )
                    .replace('{{included}}', String(branchQuote.includedBranches))
                    .replace('{{amount}}', `${branchQuote.amount.toLocaleString('vi-VN')}đ`)
                    .replace(
                      '{{cycle}}',
                      branchQuote.billingCycle === 'yearly'
                        ? t.dashboard?.yearlyCycleShort || 'năm'
                        : t.dashboard?.monthlyCycleShort || 'tháng',
                    )}
                </p>
                <p className="mb-6 rounded-xl bg-amber-50 px-4 py-3 text-xs text-amber-700">
                  {t.dashboard?.extraBranchNote ||
                    'Khoản phí này sẽ được cộng vào hoá đơn khi gia hạn gói.'}
                </p>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setBranchQuote(null)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-zinc-300 px-4 py-3 text-sm font-bold text-zinc-700 transition-all hover:bg-zinc-50"
                  >
                    {t.dashboard?.back || 'Quay lại'}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCreateBranch(true)}
                    disabled={creating}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {creating
                      ? t.dashboard?.creating || 'Đang tạo...'
                      : t.dashboard?.confirmCreate || 'Xác nhận tạo'}
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h3 id="create-shop-title" className="mb-1 text-xl font-bold text-zinc-900">
                  {isBranchMode
                    ? t.dashboard?.addBranch || 'Thêm chi nhánh'
                    : t.dashboard?.createShop || 'Tạo cửa hàng'}
                </h3>
                <p className="mb-6 text-sm text-zinc-500">
                  {isBranchMode
                    ? t.dashboard?.addBranchDescription || 'Thêm chi nhánh cho cửa hàng đang có.'
                    : t.dashboard?.createShopDescription ||
                      'Điền thông tin cửa hàng để bắt đầu bán hàng.'}
                </p>

                <div className="space-y-5">
                  {!tenantFilter && tenantOptions.length > 0 && (
                    <div>
                      <label
                        htmlFor="target-tenant"
                        className="mb-2 block text-sm font-semibold text-zinc-900"
                      >
                        {t.dashboard?.selectTenant || 'Chọn cửa hàng (tenant)'}
                      </label>
                      <select
                        id="target-tenant"
                        value={targetTenant}
                        onChange={(e) => setTargetTenant(e.target.value)}
                        className="block w-full rounded-xl border border-zinc-200 bg-white px-3 py-3 text-sm text-zinc-900 transition-all focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                      >
                        {tenantOptions.map((name) => (
                          <option key={name} value={name}>
                            {name}
                          </option>
                        ))}
                        <option value="">{t.dashboard?.newTenantOption || 'Tạo tenant mới'}</option>
                      </select>
                    </div>
                  )}

                  {!isBranchMode && (
                    <>
                      <div>
                        <span
                          id="category-label"
                          className="mb-2 block text-sm font-semibold text-zinc-900"
                        >
                          {t.dashboard?.selectCategory || 'Loại hình kinh doanh'}
                        </span>
                        {isCategoriesLoading ? (
                          <div className="grid grid-cols-2 gap-2" aria-hidden="true">
                            {Array.from({ length: 4 }).map((_, i) => (
                              <div key={i} className="h-12 animate-pulse rounded-xl bg-zinc-100" />
                            ))}
                          </div>
                        ) : (
                          <div
                            role="group"
                            aria-labelledby="category-label"
                            className="grid grid-cols-2 gap-2"
                          >
                            {categoryOptions.map((cat) => {
                              const isSelected = categoryId === String(cat.id);
                              return (
                                <button
                                  type="button"
                                  key={cat.id}
                                  aria-pressed={isSelected}
                                  onClick={() => {
                                    setCategoryId(String(cat.id));
                                    setCustomCategory('');
                                  }}
                                  className={`rounded-xl border px-3 py-3 text-sm font-medium transition-all ${
                                    isSelected
                                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                                      : 'border-zinc-200 bg-white text-zinc-700 hover:border-blue-300'
                                  }`}
                                >
                                  {cat.name}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      {categoryId === otherLabel && (
                        <div>
                          <label
                            htmlFor="custom-category"
                            className="mb-2 block text-sm font-semibold text-zinc-900"
                          >
                            {t.common?.other ? 'Ngành hàng cụ thể' : 'Specific Industry'}
                          </label>
                          <input
                            id="custom-category"
                            type="text"
                            value={customCategory}
                            onChange={(e) => setCustomCategory(e.target.value)}
                            placeholder="Ví dụ: Phụ kiện điện thoại"
                            className="block w-full rounded-xl border border-zinc-200 px-3 py-3 text-sm text-zinc-900 placeholder-zinc-500 transition-all focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                          />
                        </div>
                      )}

                      <div>
                        <label
                          htmlFor="tenant-name"
                          className="mb-2 block text-sm font-semibold text-zinc-900"
                        >
                          {t.signup?.step1?.tenantName || 'Tên cửa hàng (tenant)'}
                        </label>
                        <div className="relative">
                          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400">
                            <Building2 className="h-4 w-4" />
                          </div>
                          <input
                            id="tenant-name"
                            type="text"
                            value={tenantName}
                            onChange={(e) => setTenantName(e.target.value)}
                            placeholder={
                              t.signup?.step1?.tenantNamePlaceholder || 'Ví dụ: Cửa hàng của tôi'
                            }
                            className="block w-full rounded-xl border border-zinc-200 py-3 pl-10 pr-3 text-sm text-zinc-900 placeholder-zinc-500 transition-all focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  <div>
                    <label
                      htmlFor="shop-name"
                      className="mb-2 block text-sm font-semibold text-zinc-900"
                    >
                      {t.dashboard?.shopName || 'Tên cửa hàng'}
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400">
                        <Building2 className="h-4 w-4" />
                      </div>
                      <input
                        id="shop-name"
                        type="text"
                        value={shopName}
                        onChange={(e) => setShopName(e.target.value)}
                        placeholder={t.dashboard?.shopNamePlaceholder || 'Nhập tên cửa hàng'}
                        className="block w-full rounded-xl border border-zinc-200 py-3 pl-10 pr-3 text-sm text-zinc-900 placeholder-zinc-500 transition-all focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="shop-address"
                      className="mb-2 block text-sm font-semibold text-zinc-900"
                    >
                      {t.dashboard?.shopAddress || 'Địa chỉ đầy đủ'}
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute left-3 top-3 text-zinc-400">
                        <MapPin className="h-4 w-4" />
                      </div>
                      <textarea
                        id="shop-address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder={
                          t.dashboard?.shopAddressPlaceholder ||
                          'Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành'
                        }
                        rows={3}
                        className="block w-full resize-none rounded-xl border border-zinc-200 py-3 pl-10 pr-3 text-sm text-zinc-900 placeholder-zinc-500 transition-all focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={closeCreateModal}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-zinc-300 px-4 py-3 text-sm font-bold text-zinc-700 transition-all hover:bg-zinc-50"
                    >
                      {t.common?.cancel || 'Hủy'}
                    </button>
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={creating}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {creating
                        ? t.dashboard?.creating || 'Đang tạo...'
                        : isBranchMode
                          ? t.dashboard?.addBranch || 'Thêm chi nhánh'
                          : t.dashboard?.createShop || 'Tạo cửa hàng'}
                    </button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}

      <Toaster position="top-right" richColors />
    </>
  );
}
