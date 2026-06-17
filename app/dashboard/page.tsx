'use client';

import BrandLogo from '@/components/BrandLogo';
import { useAuth } from '@/lib/auth';
import { useLanguage } from '@/lib/i18n/LanguageContext';
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
  X
} from 'lucide-react';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Toaster, toast } from 'sonner';

interface StoreItem {
  store_uid: string;
  store_name: string;
  store_address: string;
  tenant_name: string;
  tenant_id: number;
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
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [tenantName, setTenantName] = useState('');
  const [shopName, setShopName] = useState('');
  const [address, setAddress] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => { setMounted(true); }, []);

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

  const fetchStores = async () => {
    try {
      const raw = localStorage.getItem('hiu-auth');
      if (!raw) return;
      const auth = JSON.parse(raw);
      const token = `Bearer ${auth.access_token}`;
      const res = await fetch('/api/user/my-stores', {
        headers: { 'X-Waitee-Token': token },
      });
      if (res.ok) {
        const body = await res.json();
        setStores(body?.data || []);
      }
    } catch {
      // empty
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!mounted) return;
    if (!isAuthenticated) { router.replace('/login'); return; }
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
    if (!tenantName.trim()) { toast.error('Vui lòng nhập tên cửa hàng (tenant)'); return; }
    if (!shopName.trim()) { toast.error('Vui lòng nhập tên cửa hàng'); return; }
    if (!address.trim()) { toast.error('Vui lòng nhập địa chỉ'); return; }
    if (!categoryId) { toast.error('Vui lòng chọn loại hình kinh doanh'); return; }
    if (categoryId === otherLabel && !customCategory.trim()) {
      toast.error('Vui lòng nhập ngành hàng cụ thể');
      return;
    }

    setCreating(true);
    try {
      const raw = localStorage.getItem('hiu-auth');
      if (!raw) { toast.error('Phiên đăng nhập hết hạn'); return; }
      const auth = JSON.parse(raw);

      const res = await fetch('/api/user/onboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user: { email: auth.user.email },
          tenantName: tenantName.trim(),
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

  const openCreateModal = () => {
    resetShopForm();
    setShowCreateModal(true);
  };

  if (!mounted || !user) return null;

  return (
    <>
      <main className="min-h-screen bg-zinc-50">
        <nav className="border-b border-zinc-200 bg-white px-6 py-4">
          <div className="mx-auto flex max-w-5xl items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600">
                <BrandLogo className="h-8 w-8 object-contain" />
              </div>
              <span className="text-lg font-bold text-zinc-900">WaiteeRetail</span>
            </div>
            <button
              onClick={() => { logout(); router.push('/'); }}
              className="flex items-center gap-2 rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-50"
            >
              <LogOut className="h-4 w-4" />
              {t.common?.logout || 'Đăng xuất'}
            </button>
          </div>
        </nav>

        <div className="mx-auto max-w-3xl px-4 py-12">
          <div className="mb-8 rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50">
                <User className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-zinc-900">{user.full_name || `${user.first_name} ${user.last_name}`}</h2>
                <p className="text-sm text-zinc-500">{user.email}</p>
              </div>
            </div>
          </div>

          <div className="mb-4 flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-lg font-bold text-zinc-900">
              <Store className="h-5 w-5 text-blue-600" />
              {t.dashboard?.storeInfo || 'Cửa hàng của tôi'}
            </h3>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2].map(i => (
                <div key={i} className="h-24 animate-pulse rounded-2xl bg-zinc-100" />
              ))}
            </div>
          ) : stores.length === 0 ? (
            <div className="rounded-2xl border border-zinc-100 bg-white p-8 text-center shadow-sm">
              <Store className="mx-auto mb-3 h-8 w-8 text-zinc-300" />
              <p className="mb-4 text-sm text-zinc-500">
                {t.dashboard?.noStores || 'Chưa có cửa hàng nào'}
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
              {stores.map(store => (
                <div key={store.store_uid} className="rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm">
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
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full max-w-lg rounded-2xl border border-zinc-100 bg-white p-6 shadow-xl"
          >
            <button
              type="button"
              onClick={() => setShowCreateModal(false)}
              className="absolute right-4 top-4 text-zinc-400 transition-colors hover:text-zinc-600"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="mb-1 text-xl font-bold text-zinc-900">
              {t.dashboard?.createShop || 'Tạo cửa hàng'}
            </h3>
            <p className="mb-6 text-sm text-zinc-500">
              {t.dashboard?.createShopDescription || 'Điền thông tin cửa hàng để bắt đầu bán hàng.'}
            </p>

            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-zinc-900">
                  {t.dashboard?.selectCategory || 'Loại hình kinh doanh'}
                </label>
                {isCategoriesLoading ? (
                  <div className="grid grid-cols-2 gap-2">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="h-12 animate-pulse rounded-xl bg-zinc-100" />
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    {categoryOptions.map(cat => {
                      const isSelected = categoryId === String(cat.id);
                      return (
                        <button
                          type="button"
                          key={cat.id}
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
                  <label className="mb-2 block text-sm font-semibold text-zinc-900">
                    {t.common?.other ? 'Ngành hàng cụ thể' : 'Specific Industry'}
                  </label>
                  <input
                    type="text"
                    value={customCategory}
                    onChange={e => setCustomCategory(e.target.value)}
                    placeholder="Ví dụ: Phụ kiện điện thoại"
                    className="block w-full rounded-xl border border-zinc-200 px-3 py-3 text-sm text-zinc-900 placeholder-zinc-400 transition-all focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                  />
                </div>
              )}

              <div>
                <label className="mb-2 block text-sm font-semibold text-zinc-900">
                  {t.signup?.step1?.tenantName || 'Tên cửa hàng (tenant)'}
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400">
                    <Building2 className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    value={tenantName}
                    onChange={e => setTenantName(e.target.value)}
                    placeholder={t.signup?.step1?.tenantNamePlaceholder || 'Ví dụ: Cửa hàng của tôi'}
                    className="block w-full rounded-xl border border-zinc-200 py-3 pl-10 pr-3 text-sm text-zinc-900 placeholder-zinc-400 transition-all focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-zinc-900">
                  {t.dashboard?.shopName || 'Tên cửa hàng'}
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400">
                    <Building2 className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    value={shopName}
                    onChange={e => setShopName(e.target.value)}
                    placeholder={t.dashboard?.shopNamePlaceholder || 'Nhập tên cửa hàng'}
                    className="block w-full rounded-xl border border-zinc-200 py-3 pl-10 pr-3 text-sm text-zinc-900 placeholder-zinc-400 transition-all focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-zinc-900">
                  {t.dashboard?.shopAddress || 'Địa chỉ đầy đủ'}
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute left-3 top-3 text-zinc-400">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <textarea
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    placeholder={t.dashboard?.shopAddressPlaceholder || 'Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành'}
                    rows={3}
                    className="block w-full resize-none rounded-xl border border-zinc-200 py-3 pl-10 pr-3 text-sm text-zinc-900 placeholder-zinc-400 transition-all focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-zinc-300 px-4 py-3 text-sm font-bold text-zinc-700 transition-all hover:bg-zinc-50"
                >
                  {t.common?.cancel || 'Hủy'}
                </button>
                <button
                  type="button"
                  onClick={handleCreateShop}
                  disabled={creating}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {creating
                    ? (t.dashboard?.creating || 'Đang tạo...')
                    : (t.dashboard?.createShop || 'Tạo cửa hàng')}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      <Toaster position="top-right" richColors />
    </>
  );
}
