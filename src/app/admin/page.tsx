"use client"
import { useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingBag, UtensilsCrossed, TrendingUp, Clock, CheckCircle, ChefHat, Star, ArrowRight, RefreshCw } from "lucide-react";

interface Order {
  id: string;
  antrian: string;
  nama: string;
  items: { title: string; quantity: number; price: number }[];
  grandTotal: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
}

interface MenuItem {
  _id: string;
  title: string;
  price: number;
  section: string;
}

const statusLabel: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  RECEIVED: { label: 'Diterima', color: 'text-blue-400 bg-blue-500/10 border-blue-500/30', icon: <Clock className="w-3 h-3" /> },
  COOKING: { label: 'Dimasak', color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30', icon: <ChefHat className="w-3 h-3" /> },
  READY: { label: 'Siap Diambil', color: 'text-orange-400 bg-orange-500/10 border-orange-500/30', icon: <ShoppingBag className="w-3 h-3" /> },
  COMPLETED: { label: 'Selesai', color: 'text-green-400 bg-green-500/10 border-green-500/30', icon: <CheckCircle className="w-3 h-3" /> },
};

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const [mounted, setMounted] = useState(false);

  const loadData = () => {
    try {
      const savedOrders = localStorage.getItem('seblakrr_orders');
      if (savedOrders) setOrders(JSON.parse(savedOrders));

      const savedMenu = localStorage.getItem('seblakrr_menu');
      if (savedMenu) {
        setMenus(JSON.parse(savedMenu));
      } else {
        // Hitung dari MOCK_MENU (13 item default)
        setMenus(Array(13).fill(null).map((_, i) => ({ _id: String(i), title: '', price: 0, section: '' })));
      }
    } catch { /* ignore */ }
    setLastRefresh(new Date());
  };

  useEffect(() => {
    setMounted(true);
    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  const todayOrders = orders.filter(o => {
    const d = new Date(o.createdAt);
    const now = new Date();
    return d.getDate() === now.getDate() && d.getMonth() === now.getMonth();
  });

  const pendingOrders = orders.filter(o => o.status !== 'COMPLETED');
  const completedOrders = orders.filter(o => o.status === 'COMPLETED');
  const totalRevenue = completedOrders.reduce((acc, o) => acc + (o.grandTotal || 0), 0);

  const statCards = [
    {
      label: 'Pesanan Hari Ini',
      value: todayOrders.length,
      sub: `${pendingOrders.length} masih diproses`,
      icon: <ShoppingBag className="w-6 h-6" />,
      color: 'from-orange-600 to-red-600',
    },
    {
      label: 'Pendapatan Hari Ini',
      value: `Rp ${totalRevenue.toLocaleString('id-ID')}`,
      sub: `dari ${completedOrders.length} pesanan selesai`,
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'from-green-700 to-emerald-600',
    },
    {
      label: 'Menu Aktif',
      value: menus.length || 13,
      sub: 'item tersedia di katalog',
      icon: <UtensilsCrossed className="w-6 h-6" />,
      color: 'from-purple-700 to-indigo-600',
    },
    {
      label: 'Pesanan Selesai',
      value: completedOrders.length,
      sub: 'total sepanjang hari',
      icon: <CheckCircle className="w-6 h-6" />,
      color: 'from-blue-700 to-cyan-600',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Dashboard</h1>
          <p className="text-zinc-500 text-sm mt-1">Selamat datang di panel admin Seblak RR 🔥</p>
        </div>
        <button
          onClick={loadData}
          className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-orange-900/30 rounded-xl text-zinc-400 hover:text-orange-400 hover:border-orange-500/30 transition-all text-sm font-medium"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="bg-[#1a0800] border border-orange-900/30 rounded-2xl p-5 relative overflow-hidden"
          >
            <div className={`absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br ${card.color} rounded-full opacity-20 blur-xl`} />
            <div className={`w-10 h-10 bg-gradient-to-br ${card.color} rounded-xl flex items-center justify-center text-white mb-4 shadow-lg`}>
              {card.icon}
            </div>
            <p className="text-zinc-400 text-xs font-bold uppercase tracking-wider mb-1">{card.label}</p>
            <p className="text-white font-extrabold text-2xl leading-tight">{card.value}</p>
            <p className="text-zinc-600 text-xs mt-1">{card.sub}</p>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="xl:col-span-2 bg-[#1a0800] border border-orange-900/30 rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-orange-900/30 flex items-center justify-between">
            <h3 className="text-white font-bold">Pesanan Terbaru</h3>
            <Link href="/admin/orders" className="text-orange-400 text-xs font-bold flex items-center gap-1 hover:text-orange-300 transition-colors">
              Lihat Semua <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-orange-900/20">
            {orders.slice(0, 6).map((order) => {
              const s = statusLabel[order.status] || statusLabel['RECEIVED'];
              return (
                <div key={order.id} className="p-4 flex items-center gap-4 hover:bg-white/2 transition-colors">
                  <div className="w-10 h-10 bg-orange-600/20 rounded-xl flex items-center justify-center">
                    <span className="text-orange-400 font-extrabold text-sm">{order.antrian}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-bold text-sm truncate">{order.nama}</p>
                    <p className="text-zinc-500 text-xs truncate">
                      {order.items.map(i => `${i.quantity}x ${i.title}`).join(', ')}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-orange-400 font-bold text-sm">Rp {(order.grandTotal || 0).toLocaleString('id-ID')}</p>
                    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${s.color}`}>
                      {s.icon} {s.label}
                    </span>
                  </div>
                </div>
              );
            })}
            {orders.length === 0 && (
              <div className="p-12 text-center">
                <ShoppingBag className="w-10 h-10 text-zinc-700 mx-auto mb-3" />
                <p className="text-zinc-500 font-medium">Belum ada pesanan masuk</p>
                <p className="text-zinc-700 text-xs mt-1">Pesanan dari halaman user akan muncul di sini</p>
              </div>
            )}
          </div>
          <div className="p-3 border-t border-orange-900/20 bg-[#140600]">
            <p className="text-zinc-700 text-[10px] text-center">
              Auto-refresh setiap 5 detik · Terakhir: {mounted && lastRefresh ? lastRefresh.toLocaleTimeString('id-ID') : '--:--:--'}
            </p>
          </div>
        </div>

        {/* Status Breakdown */}
        <div className="space-y-4">
          <div className="bg-[#1a0800] border border-orange-900/30 rounded-2xl p-5">
            <h3 className="text-white font-bold mb-4">Status Pesanan</h3>
            <div className="space-y-3">
              {Object.entries(statusLabel).map(([key, val]) => {
                const count = orders.filter(o => o.status === key).length;
                const total = orders.length || 1;
                return (
                  <div key={key}>
                    <div className="flex items-center justify-between mb-1">
                      <span className={`inline-flex items-center gap-1 text-xs font-bold ${val.color.split(' ')[0]}`}>
                        {val.icon} {val.label}
                      </span>
                      <span className="text-white font-bold text-sm">{count}</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${
                          key === 'RECEIVED' ? 'from-blue-500 to-blue-400' :
                          key === 'COOKING' ? 'from-yellow-500 to-orange-400' :
                          key === 'READY' ? 'from-orange-500 to-red-400' :
                          'from-green-500 to-emerald-400'
                        } rounded-full transition-all duration-500`}
                        style={{ width: `${(count / total) * 100}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-[#1a0800] border border-orange-900/30 rounded-2xl p-5">
            <h3 className="text-white font-bold mb-4">Aksi Cepat</h3>
            <div className="space-y-2">
              <Link href="/admin/orders" className="flex items-center gap-3 p-3 bg-orange-600/10 border border-orange-500/20 rounded-xl hover:border-orange-500/50 hover:bg-orange-600/20 transition-all group">
                <ShoppingBag className="w-4 h-4 text-orange-400" />
                <span className="text-white text-sm font-medium">Kelola Pesanan</span>
                <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-orange-400 ml-auto transition-colors" />
              </Link>
              <Link href="/admin/menu" className="flex items-center gap-3 p-3 bg-orange-600/10 border border-orange-500/20 rounded-xl hover:border-orange-500/50 hover:bg-orange-600/20 transition-all group">
                <UtensilsCrossed className="w-4 h-4 text-orange-400" />
                <span className="text-white text-sm font-medium">Tambah Menu Baru</span>
                <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-orange-400 ml-auto transition-colors" />
              </Link>
              <Link href="/" target="_blank" className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-xl hover:border-orange-500/20 transition-all group">
                <Star className="w-4 h-4 text-zinc-500" />
                <span className="text-zinc-400 text-sm font-medium">Buka Halaman User</span>
                <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400 ml-auto transition-colors" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
