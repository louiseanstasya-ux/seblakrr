"use client"
import { useEffect, useState } from "react";
import {
  CheckCircle2, ChefHat, ShoppingBag, Clock,
  XCircle, Loader2, Bell, CheckCheck, Ban
} from "lucide-react";

interface OrderItem {
  title: string;
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  antrian: string;
  nama: string;
  items: OrderItem[];
  grandTotal: number;
  status: "MASUK" | "DITERIMA" | "DIMASAK" | "SIAP" | "SELESAI" | "DITOLAK";
  paymentStatus: string;
  createdAt: string;
  estimasi?: number; // menit
  catatanTolak?: string;
}

// Urutan status
const STATUS_FLOW: Order["status"][] = ["MASUK", "DITERIMA", "DIMASAK", "SIAP", "SELESAI"];

const STATUS_CONFIG: Record<Order["status"], { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  MASUK:    { label: "Masuk",    color: "text-zinc-400",   bg: "bg-zinc-500/10 border-zinc-500/30",   icon: <Bell className="w-3.5 h-3.5" /> },
  DITERIMA: { label: "Diterima", color: "text-blue-400",   bg: "bg-blue-500/10 border-blue-500/30",   icon: <Clock className="w-3.5 h-3.5" /> },
  DIMASAK:  { label: "Dimasak",  color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/30", icon: <ChefHat className="w-3.5 h-3.5" /> },
  SIAP:     { label: "Siap Diambil", color: "text-orange-400", bg: "bg-orange-500/10 border-orange-500/30", icon: <ShoppingBag className="w-3.5 h-3.5" /> },
  SELESAI:  { label: "Selesai",  color: "text-green-400",  bg: "bg-green-500/10 border-green-500/30", icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
  DITOLAK:  { label: "Ditolak",  color: "text-red-400",    bg: "bg-red-500/10 border-red-500/30",     icon: <XCircle className="w-3.5 h-3.5" /> },
};

// Modal konfirmasi tolak
function TolakModal({ onConfirm, onCancel }: { onConfirm: (catatan: string) => void; onCancel: () => void }) {
  const [catatan, setCatatan] = useState("");
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="bg-[#1a0800] border border-red-900/40 rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <h3 className="text-white font-extrabold text-lg mb-2">Tolak Pesanan</h3>
        <p className="text-zinc-400 text-sm mb-4">Berikan alasan penolakan (opsional) agar customer tahu.</p>
        <textarea
          className="w-full bg-[#0d0400] border border-orange-900/30 rounded-xl text-white text-sm p-3 resize-none focus:outline-none focus:border-red-500/50"
          rows={3}
          placeholder="Contoh: Stok habis, restoran tutup, dll."
          value={catatan}
          onChange={e => setCatatan(e.target.value)}
        />
        <div className="flex gap-3 mt-4">
          <button
            onClick={() => onConfirm(catatan)}
            className="flex-1 bg-red-600 hover:bg-red-500 text-white font-bold py-2.5 rounded-xl transition-all"
          >
            Tolak Pesanan
          </button>
          <button
            onClick={onCancel}
            className="flex-1 bg-white/5 hover:bg-white/10 text-zinc-300 font-bold py-2.5 rounded-xl transition-all border border-white/10"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  );
}

// Modal terima + estimasi
function TerimaModal({ onConfirm, onCancel }: { onConfirm: (estimasi: number) => void; onCancel: () => void }) {
  const [estimasi, setEstimasi] = useState(15);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="bg-[#1a0800] border border-blue-900/40 rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <h3 className="text-white font-extrabold text-lg mb-2">Terima Pesanan</h3>
        <p className="text-zinc-400 text-sm mb-4">Tentukan estimasi waktu pengerjaan.</p>
        <div className="flex items-center gap-3 mb-4">
          {[10, 15, 20, 30, 45].map(m => (
            <button
              key={m}
              onClick={() => setEstimasi(m)}
              className={`px-4 py-2 rounded-xl font-bold text-sm transition-all border ${
                estimasi === m
                  ? "bg-orange-600 border-orange-500 text-white"
                  : "bg-white/5 border-white/10 text-zinc-400 hover:border-orange-500/30"
              }`}
            >
              {m} mnt
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 mb-4">
          <input
            type="number"
            min={1}
            max={120}
            value={estimasi}
            onChange={e => setEstimasi(Number(e.target.value))}
            className="w-24 bg-[#0d0400] border border-orange-900/30 rounded-xl text-white text-sm p-2 text-center focus:outline-none focus:border-orange-500/50"
          />
          <span className="text-zinc-400 text-sm">menit (custom)</span>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => onConfirm(estimasi)}
            className="flex-1 bg-orange-600 hover:bg-orange-500 text-white font-bold py-2.5 rounded-xl transition-all"
          >
            Terima & Kirim Estimasi
          </button>
          <button
            onClick={onCancel}
            className="flex-1 bg-white/5 hover:bg-white/10 text-zinc-300 font-bold py-2.5 rounded-xl transition-all border border-white/10"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [mounted, setMounted] = useState(false);
  const [filter, setFilter] = useState<Order["status"] | "SEMUA">("SEMUA");
  const [tolakTarget, setTolakTarget] = useState<string | null>(null);
  const [terimaTarget, setTerimaTarget] = useState<string | null>(null);

  const loadOrders = async () => {
    try {
      const res = await fetch("/api/seblak/orders");
      const data = await res.json();
      if (data.success) setOrders(JSON.parse(JSON.stringify(data.data)));
    } catch { /* ignore */ }
  };

  const updateStatus = async (id: string, status: Order["status"], extra?: Partial<Order>) => {
    try {
      await fetch("/api/seblak/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status, ...extra }),
      });
      await loadOrders();
    } catch { /* ignore */ }
  };

  const handleTerima = async (id: string, estimasi: number) => {
    await updateStatus(id, "DITERIMA", { estimasi });
    setTerimaTarget(null);
  };

  const handleTolak = async (id: string, catatan: string) => {
    await updateStatus(id, "DITOLAK", { catatanTolak: catatan });
    setTolakTarget(null);
  };

  useEffect(() => {
    setMounted(true);
    loadOrders();
    const interval = setInterval(loadOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  const nextStatus = (current: Order["status"]): Order["status"] | null => {
    const idx = STATUS_FLOW.indexOf(current);
    if (idx === -1 || idx >= STATUS_FLOW.length - 1) return null;
    return STATUS_FLOW[idx + 1];
  };

  const filtered = filter === "SEMUA" ? orders : orders.filter(o => o.status === filter);
  const counts = STATUS_FLOW.reduce((acc, s) => {
    acc[s] = orders.filter(o => o.status === s).length;
    return acc;
  }, {} as Record<string, number>);

  if (!mounted) return null;

  return (
    <div className="space-y-6">
      {/* Modal */}
      {terimaTarget && (
        <TerimaModal
          onConfirm={(est) => handleTerima(terimaTarget, est)}
          onCancel={() => setTerimaTarget(null)}
        />
      )}
      {tolakTarget && (
        <TolakModal
          onConfirm={(catatan) => handleTolak(tolakTarget, catatan)}
          onCancel={() => setTolakTarget(null)}
        />
      )}

      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-white">Manajemen Pesanan</h1>
        <p className="text-zinc-500 text-sm mt-1">Kelola dan update status pesanan secara real-time</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {(["SEMUA", ...STATUS_FLOW, "DITOLAK"] as const).map(s => {
          const count = s === "SEMUA" ? orders.length : (counts[s] ?? orders.filter(o => o.status === s).length);
          const cfg = s !== "SEMUA" ? STATUS_CONFIG[s] : null;
          return (
            <button
              key={s}
              onClick={() => setFilter(s as Order["status"] | "SEMUA")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold border transition-all ${
                filter === s
                  ? "bg-orange-600 border-orange-500 text-white"
                  : "bg-white/5 border-white/10 text-zinc-400 hover:border-orange-500/30 hover:text-white"
              }`}
            >
              {cfg?.icon}
              {s === "SEMUA" ? "Semua" : cfg?.label}
              {count > 0 && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${filter === s ? "bg-white/20" : "bg-white/10"}`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Order Cards */}
      <div className="space-y-4">
        {filtered.length === 0 && (
          <div className="bg-[#1a0800] border border-orange-900/30 rounded-2xl p-12 text-center">
            <ShoppingBag className="w-10 h-10 text-zinc-700 mx-auto mb-3" />
            <p className="text-zinc-500 font-medium">Tidak ada pesanan</p>
          </div>
        )}

        {filtered.map(order => {
          // Normalisasi status lama ke format baru
          const statusMap: Record<string, Order["status"]> = {
            RECEIVED: "MASUK",
            COOKING: "DIMASAK",
            READY: "SIAP",
            COMPLETED: "SELESAI",
          };
          const normalizedStatus: Order["status"] =
            STATUS_CONFIG[order.status] ? order.status : (statusMap[order.status] ?? "MASUK");
          const cfg = STATUS_CONFIG[normalizedStatus];
          const next = nextStatus(normalizedStatus);
          const nextCfg = next ? STATUS_CONFIG[next] : null;
          const isMasuk = normalizedStatus === "MASUK";
          const isTerminal = normalizedStatus === "SELESAI" || normalizedStatus === "DITOLAK";

          return (
            <div
              key={order._id}
              className={`bg-[#1a0800] border rounded-2xl overflow-hidden transition-all ${
                isMasuk ? "border-orange-500/50 shadow-lg shadow-orange-900/20" : "border-orange-900/30"
              }`}
            >
              {/* Card Header */}
              <div className="p-5 flex items-start gap-4">
                {/* Nomor antrian */}
                <div className="w-12 h-12 bg-orange-600/20 rounded-xl flex items-center justify-center shrink-0">
                  <span className="text-orange-400 font-extrabold text-lg">{order.antrian || "?"}</span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-white font-extrabold text-base">{order.nama}</p>
                    <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full border ${cfg.bg} ${cfg.color}`}>
                      {cfg.icon} {cfg.label}
                    </span>
                    {isMasuk && (
                      <span className="text-xs text-orange-400 font-bold animate-pulse">🔔 Butuh persetujuan</span>
                    )}
                  </div>
                  <p className="text-zinc-500 text-xs mt-1">
                    {new Date(order.createdAt).toLocaleString("id-ID")}
                    {order.estimasi && normalizedStatus !== "SELESAI" && normalizedStatus !== "DITOLAK" && (
                      <span className="ml-2 text-blue-400">· Estimasi {order.estimasi} menit</span>
                    )}
                  </p>

                  {/* Items */}
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {order.items.map((item, i) => (
                      <span key={i} className="text-xs bg-white/5 border border-white/10 text-zinc-300 px-2 py-0.5 rounded-lg">
                        {item.quantity}× {item.title}
                      </span>
                    ))}
                  </div>

                  {/* Catatan tolak */}
                  {order.status === "DITOLAK" && order.catatanTolak && (
                    <p className="mt-2 text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                      Alasan: {order.catatanTolak}
                    </p>
                  )}
                </div>

                {/* Total */}
                <div className="text-right shrink-0">
                  <p className="text-orange-400 font-extrabold text-lg">
                    Rp {(order.grandTotal || 0).toLocaleString("id-ID")}
                  </p>
                  <p className={`text-xs font-bold mt-1 ${order.paymentStatus === "PAID" ? "text-green-400" : "text-zinc-500"}`}>
                    {order.paymentStatus === "PAID" ? "✓ Lunas" : "Belum Bayar"}
                  </p>
                </div>
              </div>

              {/* Action Bar */}
              {!isTerminal && (
                <div className="px-5 pb-5 flex items-center gap-3 flex-wrap">
                  {/* Pesanan baru: Terima / Tolak */}
                  {isMasuk && (
                    <>
                      <button
                        onClick={() => setTerimaTarget(order._id)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl transition-all text-sm shadow-lg shadow-orange-900/30"
                      >
                        <CheckCheck className="w-4 h-4" />
                        Terima Pesanan
                      </button>
                      <button
                        onClick={() => setTolakTarget(order._id)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-red-600/20 hover:bg-red-600/40 text-red-400 font-bold rounded-xl transition-all text-sm border border-red-500/30"
                      >
                        <Ban className="w-4 h-4" />
                        Tolak
                      </button>
                    </>
                  )}

                  {/* Status berikutnya */}
                  {!isMasuk && next && nextCfg && (
                    <button
                      onClick={() => updateStatus(order._id, next)}
                      className="flex items-center gap-2 px-5 py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl transition-all text-sm shadow-lg shadow-orange-900/30"
                    >
                      {nextCfg.icon}
                      Tandai: {nextCfg.label}
                    </button>
                  )}

                  {/* Progress bar status */}
                  <div className="flex-1 hidden sm:flex items-center gap-1 min-w-0">
                    {STATUS_FLOW.map((s, i) => {
                      const currentIdx = STATUS_FLOW.indexOf(normalizedStatus);
                      const passed = i <= currentIdx;
                      return (
                        <div key={s} className="flex items-center gap-1 flex-1">
                          <div className={`h-1.5 flex-1 rounded-full transition-all ${passed ? "bg-orange-500" : "bg-white/10"}`} />
                          {i === STATUS_FLOW.length - 1 && (
                            <CheckCircle2 className={`w-4 h-4 shrink-0 ${passed ? "text-green-400" : "text-zinc-700"}`} />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
