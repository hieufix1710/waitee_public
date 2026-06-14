'use client';

import BrandLogo from '@/components/BrandLogo';
import { useAuth } from '@/lib/auth';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { Building2, LogOut, ShoppingCart, Store, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface StoreItem {
  store_uid: string;
  store_name: string;
  store_address: string;
  tenant_name: string;
  tenant_id: number;
}

export default function DashboardPage() {
  const { t } = useLanguage();
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [stores, setStores] = useState<StoreItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!isAuthenticated) { router.replace('/login'); return; }

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
      } catch { /* empty */ }
      finally { setLoading(false); }
    };
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
    } catch { /* empty */ }
    window.location.href = `${frontendUrl}/login`;
  };

  if (!mounted || !user) return null;

  return (
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

        <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-zinc-900">
          <Store className="h-5 w-5 text-blue-600" />
          {t.dashboard?.storeInfo || 'Cửa hàng của tôi'}
        </h3>

        {loading ? (
          <div className="space-y-3">
            {[1, 2].map(i => (
              <div key={i} className="h-24 animate-pulse rounded-2xl bg-zinc-100" />
            ))}
          </div>
        ) : stores.length === 0 ? (
          <div className="rounded-2xl border border-zinc-100 bg-white p-8 text-center shadow-sm">
            <Store className="mx-auto mb-3 h-8 w-8 text-zinc-300" />
            <p className="text-sm text-zinc-500">{t.dashboard?.noStores || 'Chưa có cửa hàng nào'}</p>
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
  );
}
