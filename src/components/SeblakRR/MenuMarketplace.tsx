"use client"
import React, { useState, useEffect } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { IMenu } from "@/types/menu"
import { useAppDispatch, useAppSelector } from "@/hook/redux"
import { addCheckOutItem, decrementCheckOutItem } from "@/store/reducer/checkout"
import { setNama, tambahPoin, kurangiPoin, hapusVoucher } from "@/store/reducer/user"
import { ShoppingCart, CheckCircle2, ChefHat, PackageCheck, X, Star, Gift, User, Banknote } from "lucide-react"

// =============================================
// DATA MENU SEBLAK RR (dari price list)
// =============================================
const MOCK_MENU: IMenu[] = [
  // --- SEBLAK ---
  {
    _id: "seblak-001",
    merchantId: "seblakrr",
    title: "Seblak Original (Lv 1-3)",
    description: "Seblak dengan kuah gurih pedas khas RR, pilih level kepedasan 1-3 GRATIS! Isi: kerupuk, telur, sosis.",
    price: 15000,
    originalPrice: 18000,
    quantity: 100,
    section: "Seblak",
    image: "/menu-images/seblak.png",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "seblak-002",
    merchantId: "seblakrr",
    title: "Mix Level Seblak (Lv 1-3)",
    description: "Seblak campuran dengan topping komplit: kerupuk, mie, makaroni, telur & sosis. Level 1-3 GRATIS!",
    price: 18000,
    quantity: 100,
    section: "Seblak",
    image: "/menu-images/seblak.png",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  // --- RICE BOWL ---
  {
    _id: "ricebowl-001",
    merchantId: "seblakrr",
    title: "Nasi Goreng Telur",
    description: "Nasi goreng wangi dengan bumbu spesial, telur mata sapi di atasnya, dan kerupuk renyah.",
    price: 15000,
    quantity: 100,
    section: "Rice Bowl",
    image: "/menu-images/nasi_goreng.png",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "ricebowl-002",
    merchantId: "seblakrr",
    title: "Nasi Goreng Sosis",
    description: "Nasi goreng bumbu spesial dengan irisan sosis sapi/ayam yang melimpah, disajikan panas.",
    price: 18000,
    quantity: 100,
    section: "Rice Bowl",
    image: "/menu-images/nasi_goreng.png",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "ricebowl-003",
    merchantId: "seblakrr",
    title: "Rice Bowl Nugget Sambal Matah",
    description: "Nasi putih hangat dengan nugget goreng krispi dan sambal matah segar khas Bali di atasnya.",
    price: 18000,
    quantity: 100,
    section: "Rice Bowl",
    image: "/menu-images/rice_bowl.png",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "ricebowl-004",
    merchantId: "seblakrr",
    title: "Rice Bowl Ayam Daun Jeruk",
    description: "Nasi putih dengan ayam goreng bumbu daun jeruk yang harum dan crispy, cocok untuk makan siang.",
    price: 18000,
    quantity: 100,
    section: "Rice Bowl",
    image: "/menu-images/rice_bowl.png",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  // --- GORENGAN ---
  {
    _id: "goreng-001",
    merchantId: "seblakrr",
    title: "Kentang Goreng",
    description: "Kentang goreng renyah di luar, lembut di dalam. Disajikan dengan saus sambal & mayones.",
    price: 10000,
    quantity: 100,
    section: "Gorengan",
    image: "/menu-images/kentang_goreng.png",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "goreng-002",
    merchantId: "seblakrr",
    title: "Pisang Keju Susu",
    description: "Pisang goreng crispy topping keju parut dan susu kental manis. Manis, gurih, dan creamy!",
    price: 10000,
    quantity: 100,
    section: "Gorengan",
    image: "/menu-images/pisang_goreng.png",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "goreng-003",
    merchantId: "seblakrr",
    title: "Pisang Coklat Meses",
    description: "Pisang goreng crispy dibalut coklat leleh dan ditaburi meses warna-warni yang ceria.",
    price: 10000,
    quantity: 100,
    section: "Gorengan",
    image: "/menu-images/pisang_goreng.png",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  // --- MINUMAN ---
  {
    _id: "minum-001",
    merchantId: "seblakrr",
    title: "Es Teh Manis",
    description: "Teh manis segar dengan es batu yang banyak. Penyegar terbaik setelah makan seblak pedas!",
    price: 5000,
    quantity: 100,
    section: "Minuman",
    image: "/menu-images/minuman.png",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "minum-002",
    merchantId: "seblakrr",
    title: "Es Jeruk Segar",
    description: "Perasan jeruk asli dicampur sirup dan es batu. Segar, manis, dan asam alami.",
    price: 5000,
    quantity: 100,
    section: "Minuman",
    image: "/menu-images/minuman.png",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "minum-003",
    merchantId: "seblakrr",
    title: "Es Mangga",
    description: "Jus mangga segar dengan es batu, manis alami dari buah mangga pilihan kualitas terbaik.",
    price: 5000,
    quantity: 100,
    section: "Minuman",
    image: "/menu-images/minuman.png",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "minum-004",
    merchantId: "seblakrr",
    title: "Air Mineral Botol 600ml",
    description: "Air mineral botol 600ml, dingin dan menyegarkan.",
    price: 5000,
    quantity: 100,
    section: "Minuman",
    image: "/menu-images/minuman.png",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const categories = ["Semua", "Seblak", "Rice Bowl", "Gorengan", "Minuman"];

export default function MenuMarketplace() {
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [menuData, setMenuData] = useState<IMenu[]>([]);
  const [currentOrderId, setCurrentOrderId] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("UNPAID");
  
  // Checkout & Tracking States
  const [orderStatus, setOrderStatus] = useState<'idle' | 'checkout' | 'tracking'>('idle');
  const [trackingState, setTrackingState] = useState<number>(0);
  const [queueNumber, setQueueNumber] = useState("");

  // Form nama & voucher state (lokal, untuk UI saja)
  const [namaInput, setNamaInput] = useState("");
  const [pakaiPoin, setPakaiPoin] = useState(false);
  const [poinTerdapat, setPoinTerdapat] = useState(0); // poin yang akan didapat dari order ini

  const dispatch = useAppDispatch();
  const checkoutItems = useAppSelector(state => state.checkOut);
  const { nama, poin } = useAppSelector(state => state.user);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await fetch("/api/seblak/menu");
        const data = await res.json();
        if (data.success && data.data.length > 0) {
          setMenuData(data.data);
          return;
        }
      } catch { /* ignore */ }
      // Fallback ke MOCK_MENU jika DB belum ada data
      setMenuData(MOCK_MENU);
    };
    fetchMenu();
  }, []);

  const filteredMenu = activeCategory === "Semua" 
    ? menuData 
    : menuData.filter(m => m.section === activeCategory);

  const totalCartItems = checkoutItems.reduce((acc, item) => acc + item.itemCount, 0);
  const subtotal = checkoutItems.reduce((acc, item) => acc + (item.price * item.itemCount), 0);
  const tax = subtotal * 0.11;
  const serviceFee = subtotal > 0 ? 2000 : 0;
  const discount = subtotal > 50000 ? 5000 : 0;

  // Diskon dari penukaran poin (100 poin = Rp 10.000)
  const POIN_PER_TUKAR = 100;
  const NILAI_VOUCHER = 10000;
  const diskonPoin = pakaiPoin && poin >= POIN_PER_TUKAR ? NILAI_VOUCHER : 0;

  const grandTotal = Math.max(0, subtotal + tax + serviceFee - discount - diskonPoin);
  const totalCartPrice = subtotal;

  // Hitung poin yang akan didapat dari order ini (setiap Rp 1.000 = 1 poin)
  const poinDari = Math.floor(subtotal / 1000);

  // Poll MongoDB untuk status pesanan dari admin (setiap 5 detik)
  useEffect(() => {
    if (orderStatus !== 'tracking' || !currentOrderId) return;
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/seblak/orders?id=${currentOrderId}`);
        const data = await res.json();
        const order = data.data;
        if (!order) return;
        setPaymentStatus(order.paymentStatus);
        const statusMap: Record<string, number> = {
          MASUK: 0, DITERIMA: 0, DIMASAK: 1, SIAP: 2, SELESAI: 3, DITOLAK: 3
        };
        const newState = statusMap[order.status] ?? 0;
        setTrackingState(newState);
        if (order.status === 'SELESAI') {
          dispatch(tambahPoin(poinDari));
        }
      } catch { /* ignore */ }
    }, 5000);
    return () => clearInterval(interval);
  }, [orderStatus, currentOrderId, poinDari, dispatch]);

  const handleCheckoutClick = () => {
    setNamaInput(nama); // pre-fill dari Redux jika sudah ada nama
    setPakaiPoin(false);
    setPoinTerdapat(poinDari);
    setOrderStatus('checkout');
  };

  const confirmOrder = async () => {
    const namaPemesan = namaInput.trim() || nama || 'Guest';
    if (namaInput.trim()) dispatch(setNama(namaInput.trim()));
    if (pakaiPoin && poin >= POIN_PER_TUKAR) {
      dispatch(kurangiPoin(POIN_PER_TUKAR));
      dispatch(hapusVoucher());
    }

    try {
      // Kirim pesanan ke MongoDB
      const res = await fetch("/api/seblak/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nama: namaPemesan,
          items: checkoutItems.map(i => ({ title: i.title, quantity: i.itemCount, price: i.price })),
          subtotal,
          grandTotal,
          diskonPoin,
        }),
      });
      const data = await res.json();
      const orderId = data.data?._id;
      const antrian = data.data?.antrian ?? String(Math.floor(Math.random() * 900) + 100);

      setQueueNumber(antrian);
      setCurrentOrderId(orderId);
      setPaymentStatus('UNPAID');
      setOrderStatus('tracking');
      setTrackingState(0);
    } catch {
      // Fallback ke simulasi lokal jika API gagal
      const simulatedQueueNum = String(Math.floor(Math.random() * 900) + 100);
      setQueueNumber(simulatedQueueNum);
      setCurrentOrderId(simulatedQueueNum);
      setPaymentStatus('UNPAID');
      setOrderStatus('tracking');
      setTrackingState(0);
    }
  };

  const updateOrderStatus = (orderId: string, status: string, paymentStatus?: string) => {
    try {
      const existing = JSON.parse(localStorage.getItem('seblakrr_orders') || '[]');
      const updated = existing.map((o: { id: string; status: string; paymentStatus: string }) =>
        o.id === orderId
          ? { ...o, status, ...(paymentStatus ? { paymentStatus } : {}) }
          : o
      );
      localStorage.setItem('seblakrr_orders', JSON.stringify(updated));
    } catch { /* ignore */ }
  };

  const finishOrder = () => {
    setOrderStatus('idle');
    setTrackingState(0);
    setPakaiPoin(false);
  };

  const confirmPayment = async () => {
    if (!currentOrderId) return;
    try {
      await fetch("/api/seblak/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: currentOrderId, paymentStatus: "PAID" }),
      });
      setPaymentStatus("PAID");
    } catch { /* ignore */ }
  };

  return (
    <section id="menu" className="py-20 relative bg-[#0d0400]">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-orange-600 rounded-full blur-[150px] opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        
        {/* Header & Promo */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
          <div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4">
              Pesan <span className="text-orange-500">Sekarang!</span>
            </h2>
            <p className="text-zinc-400 text-lg">Pilih menu favoritmu, kami yang urus sisanya.</p>
          </div>
          <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl p-4 md:p-6 flex items-center gap-4 w-full md:w-auto shadow-lg shadow-orange-900/40 border border-orange-500/50">
            <div className="text-3xl">🔥</div>
            <div>
              <h3 className="text-white font-bold text-lg leading-tight">PROMO HARI INI</h3>
              <p className="text-orange-100 text-xs md:text-sm">Beli 2 Seblak Komplit, Gratis 1 Minuman!</p>
            </div>
          </div>
        </div>

        {/* Categories Tab */}
        <div className="flex overflow-x-auto scrollbar-hide gap-3 mb-10 pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2.5 rounded-full whitespace-nowrap font-bold text-sm transition-all ${
                activeCategory === cat 
                  ? "bg-orange-600 text-white shadow-lg shadow-orange-900/50" 
                  : "bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white border border-white/10"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filteredMenu.map((item) => {
            const cartItem = checkoutItems.find(i => i._id === item._id);
            const qty = cartItem?.itemCount || 0;

            const handleAdd = () => {
              dispatch(addCheckOutItem(item));
              // Note: We bypass syncCartWithDB to avoid MongoDB API errors since this is a static demo
            };

            const handleMin = () => {
              dispatch(decrementCheckOutItem(String(item._id)));
            };

            return (
              <motion.div 
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                key={String(item._id)} 
                className="bg-[#1a0800] rounded-3xl border border-orange-900/30 overflow-hidden hover:border-orange-500/50 transition-all group flex flex-col"
              >
                {/* Image */}
                <div className="relative h-40 md:h-48 w-full bg-zinc-900 overflow-hidden">
                  <Image src={item.image} alt={item.title} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                  
                  {/* Badge Discount */}
                  {item.originalPrice && item.originalPrice > item.price && (
                    <div className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-extrabold px-2 py-1 rounded-md shadow-lg">
                      HEMAT Rp {(item.originalPrice - item.price).toLocaleString('id-ID')}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4 md:p-5 flex flex-col flex-grow">
                  <div className="flex-grow">
                    <h3 className="text-white font-bold text-sm md:text-base line-clamp-2 mb-1">{item.title}</h3>
                    <p className="text-zinc-500 text-xs line-clamp-2 leading-relaxed">{item.description}</p>
                  </div>
                  
                  <div className="mt-4 flex flex-col gap-3">
                    <div>
                      {item.originalPrice && (
                        <p className="text-[10px] text-zinc-500 line-through">Rp {item.originalPrice.toLocaleString('id-ID')}</p>
                      )}
                      <p className="text-orange-400 font-extrabold text-sm md:text-base">Rp {item.price.toLocaleString('id-ID')}</p>
                    </div>

                    {/* Add to Cart Actions */}
                    {qty === 0 ? (
                      <button 
                        onClick={handleAdd}
                        className="w-full bg-white/5 border border-orange-500/50 hover:bg-orange-600 hover:border-orange-600 text-orange-500 hover:text-white font-bold text-xs py-2 rounded-xl transition-all flex items-center justify-center gap-2"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        Tambah
                      </button>
                    ) : (
                      <div className="w-full flex items-center justify-between bg-orange-600 rounded-xl px-2 py-1.5">
                        <button onClick={handleMin} className="w-6 h-6 flex items-center justify-center text-white bg-orange-700 rounded-lg hover:bg-orange-800 font-bold">−</button>
                        <span className="text-white font-bold text-xs">{qty}</span>
                        <button onClick={handleAdd} className="w-6 h-6 flex items-center justify-center text-white bg-orange-700 rounded-lg hover:bg-orange-800 font-bold">+</button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Sticky Cart Notch (Only show if idle) */}
      <AnimatePresence>
        {totalCartItems > 0 && orderStatus === 'idle' && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-6 left-6 right-6 md:left-auto md:right-12 md:w-80 z-50"
          >
            <div 
              onClick={handleCheckoutClick}
              className="bg-orange-600 shadow-2xl shadow-orange-900/50 rounded-2xl p-4 flex items-center justify-between cursor-pointer hover:bg-orange-500 transition-colors border border-orange-400/30"
            >
              <div className="flex items-center gap-3">
                <div className="bg-white text-orange-600 w-10 h-10 flex items-center justify-center rounded-xl font-extrabold text-lg">
                  {totalCartItems}
                </div>
                <div>
                  <p className="text-white font-bold text-sm leading-tight">Keranjang Anda</p>
                  <p className="text-orange-200 font-medium text-xs">Rp {totalCartPrice.toLocaleString('id-ID')}</p>
                </div>
              </div>
              <button className="bg-white/20 text-white text-xs font-bold px-4 py-2 rounded-xl backdrop-blur-sm">
                Checkout →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Checkout Modal */}
      <AnimatePresence>
        {orderStatus === 'checkout' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-end justify-center md:items-center bg-black/80 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="bg-[#1a0800] w-full max-w-md rounded-3xl border border-orange-500/30 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Header */}
              <div className="p-5 border-b border-orange-900/50 flex justify-between items-center bg-orange-600/10">
                <h3 className="text-white font-bold text-lg">Ringkasan Pesanan</h3>
                <button onClick={() => setOrderStatus('idle')} className="text-zinc-400 hover:text-white bg-white/5 p-2 rounded-full">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Items List */}
              <div className="p-5 overflow-y-auto flex-grow flex flex-col gap-4">
                {checkoutItems.map((item) => (
                  <div key={String(item._id)} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 relative rounded-lg overflow-hidden border border-orange-900/30">
                        <Image src={item.image} alt={item.title} fill className="object-cover" />
                      </div>
                      <div>
                        <p className="text-white font-bold text-sm">{item.title}</p>
                        <p className="text-zinc-500 text-xs">{item.itemCount} x Rp {item.price.toLocaleString('id-ID')}</p>
                      </div>
                    </div>
                    <p className="text-orange-400 font-bold text-sm">
                      Rp {(item.price * item.itemCount).toLocaleString('id-ID')}
                    </p>
                  </div>
                ))}

                {/* Form Nama */}
                <div className="mt-2 bg-white/5 border border-orange-500/20 rounded-xl p-4 flex flex-col gap-2">
                  <label className="text-zinc-400 text-xs font-bold flex items-center gap-2 uppercase tracking-wider">
                    <User className="w-3.5 h-3.5" /> Nama Pemesan
                  </label>
                  <input
                    id="nama-pemesan"
                    type="text"
                    value={namaInput}
                    onChange={e => setNamaInput(e.target.value)}
                    placeholder="Masukkan nama Anda..."
                    className="bg-transparent text-white placeholder-zinc-600 text-sm font-medium outline-none border-b border-orange-900/50 pb-1 focus:border-orange-500 transition-colors"
                  />
                </div>

                {/* Panel Poin */}
                <div className="mt-1 bg-gradient-to-br from-orange-600/20 to-red-900/20 border border-orange-500/30 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-orange-400" />
                      <span className="text-white font-bold text-sm">Poin Loyalty Anda</span>
                    </div>
                    <span className="text-orange-400 font-extrabold text-lg">{poin} Poin</span>
                  </div>

                  {/* Poin yang akan didapat */}
                  <div className="text-xs text-zinc-400 mb-3 flex items-center gap-1.5">
                    <Gift className="w-3 h-3 text-orange-500" />
                    <span>Order ini akan memberikan <strong className="text-orange-400">{poinDari} poin</strong> baru</span>
                  </div>

                  {/* Tukar Poin */}
                  {poin >= POIN_PER_TUKAR ? (
                    <button
                      id="tukar-poin-btn"
                      onClick={() => setPakaiPoin(prev => !prev)}
                      className={`w-full text-xs font-bold py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 ${
                        pakaiPoin
                          ? 'bg-green-600/30 border border-green-500/50 text-green-400'
                          : 'bg-orange-600/20 border border-orange-500/30 text-orange-400 hover:bg-orange-600/40'
                      }`}
                    >
                      {pakaiPoin
                        ? <><CheckCircle2 className="w-4 h-4" /> 100 Poin Digunakan → Diskon Rp 10.000</>
                        : <><Gift className="w-4 h-4" /> Tukar 100 Poin untuk Diskon Rp 10.000</>}
                    </button>
                  ) : (
                    <div className="text-xs text-zinc-600 text-center py-1.5">
                      Butuh {POIN_PER_TUKAR - poin} poin lagi untuk menukar voucher diskon
                    </div>
                  )}
                </div>

                {/* Promo Info */}
                {discount > 0 && (
                  <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-3 flex justify-between items-center">
                    <span className="text-orange-400 text-xs font-bold flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" /> Promo Diskon Rp 5.000 Dipakai
                    </span>
                  </div>
                )}

                {/* Detail Pembayaran (Struk) */}
                <div className="mt-2 bg-[#140600] border border-orange-900/30 rounded-xl p-4 flex flex-col gap-3 shadow-inner">
                  <h4 className="text-white font-bold text-sm mb-1">Detail Struk Pembayaran</h4>
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-400">Subtotal</span>
                    <span className="text-white font-medium">Rp {subtotal.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-400">Pajak (11%)</span>
                    <span className="text-white font-medium">Rp {tax.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-400">Biaya Layanan</span>
                    <span className="text-white font-medium">Rp {serviceFee.toLocaleString('id-ID')}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-xs text-green-400">
                      <span>Diskon Promo</span>
                      <span>- Rp {discount.toLocaleString('id-ID')}</span>
                    </div>
                  )}
                  {diskonPoin > 0 && (
                    <div className="flex justify-between text-xs text-yellow-400">
                      <span>🎁 Diskon Poin (100 poin)</span>
                      <span>- Rp {diskonPoin.toLocaleString('id-ID')}</span>
                    </div>
                  )}
                  <div className="w-full h-px bg-orange-900/50 my-1" />
                  <div className="flex justify-between text-sm font-bold">
                    <span className="text-white">Total Keseluruhan</span>
                    <span className="text-orange-500">Rp {grandTotal.toLocaleString('id-ID')}</span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-5 bg-[#0d0400] border-t border-orange-900/50">
                <div className="flex justify-between items-center mb-4">
                  <p className="text-zinc-400 text-sm">Total Pembayaran</p>
                  <p className="text-white font-extrabold text-xl">Rp {grandTotal.toLocaleString('id-ID')}</p>
                </div>
                <button 
                  onClick={confirmOrder}
                  className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold text-lg py-4 rounded-xl shadow-lg shadow-orange-900/50 transition-colors"
                >
                  Bayar & Pesan Sekarang
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tracking Modal */}
      <AnimatePresence>
        {orderStatus === 'tracking' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#1a0800] w-full max-w-lg rounded-3xl border border-orange-500/30 shadow-2xl p-8 relative overflow-hidden text-center"
            >
              {/* Confetti / Glow */}
              <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-orange-600/20 to-transparent pointer-events-none" />

              <h2 className="text-orange-500 font-extrabold text-2xl mb-1 tracking-tight">Status Pesanan</h2>
              <p className="text-zinc-400 text-sm mb-6">Pantau pesanan Anda secara real-time</p>

              {/* Info Banner */}
              <div className="bg-orange-600/10 border border-orange-500/30 rounded-2xl p-5 mb-4 flex justify-around gap-2">
                <div>
                  <p className="text-zinc-500 text-xs uppercase font-bold tracking-wider mb-1">Pemesan</p>
                  <p className="text-white font-extrabold text-lg">{nama || 'Guest'}</p>
                </div>
                <div className="w-px bg-orange-900/50" />
                <div>
                  <p className="text-zinc-500 text-xs uppercase font-bold tracking-wider mb-1">No. Antrian</p>
                  <p className="text-white font-extrabold text-2xl">{queueNumber}</p>
                </div>
                <div className="w-px bg-orange-900/50" />
                <div>
                  <p className="text-zinc-500 text-xs uppercase font-bold tracking-wider mb-1">Status Bayar</p>
                  <p className={`font-extrabold text-xl mt-1 flex items-center justify-center ${paymentStatus === 'PAID' ? 'text-green-500' : 'text-red-500'}`}>
                    {paymentStatus === 'PAID' ? 'LUNAS' : 'BELUM BAYAR'}
                  </p>
                </div>
              </div>

              {/* Tombol Konfirmasi Bayar */}
              {paymentStatus !== 'PAID' && (
                <motion.button
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={confirmPayment}
                  className="w-full mb-6 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-green-900/30"
                >
                  <Banknote className="w-5 h-5" />
                  Konfirmasi Sudah Bayar (Cash / Transfer)
                </motion.button>
              )}
              {paymentStatus === 'PAID' && (
                <div className="w-full mb-6 flex items-center justify-center gap-2 bg-green-600/20 border border-green-500/30 text-green-400 font-bold py-3 rounded-xl text-sm">
                  <CheckCircle2 className="w-4 h-4" /> Pembayaran Dikonfirmasi ✓
                </div>
              )}

              {/* Poin Earned Banner (hanya muncul setelah selesai) */}
              {trackingState === 3 && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="mb-6 bg-gradient-to-r from-orange-600/30 to-yellow-600/20 border border-orange-500/40 rounded-2xl p-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center">
                      <Star className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-left">
                      <p className="text-orange-400 font-bold text-sm">Selamat! Poin bertambah 🎉</p>
                      <p className="text-zinc-400 text-xs">Total poin Anda sekarang: <strong className="text-white">{poin} poin</strong></p>
                    </div>
                  </div>
                  <span className="text-yellow-400 font-extrabold text-xl">+{poinDari}</span>
                </motion.div>
              )}

              {/* Timeline */}
              <div className="flex flex-col gap-6 text-left relative before:absolute before:inset-y-2 before:left-[19px] before:w-0.5 before:bg-orange-900/50">
                
                {/* Diterima */}
                <div className={`flex gap-4 relative z-10 transition-all duration-500 ${trackingState >= 0 ? 'opacity-100' : 'opacity-30'}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${trackingState >= 0 ? 'bg-orange-600 border-orange-600 text-white shadow-[0_0_15px_rgba(2ea,88,12,0.5)]' : 'bg-[#1a0800] border-zinc-700 text-zinc-500'}`}>
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className={`font-bold ${trackingState >= 0 ? 'text-white' : 'text-zinc-500'}`}>Pesanan Diterima</h4>
                    <p className="text-zinc-500 text-xs">Kasir telah mengkonfirmasi pesanan Anda.</p>
                  </div>
                </div>

                {/* Dimasak */}
                <div className={`flex gap-4 relative z-10 transition-all duration-500 ${trackingState >= 1 ? 'opacity-100' : 'opacity-30'}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${trackingState >= 1 ? 'bg-orange-600 border-orange-600 text-white shadow-[0_0_15px_rgba(2ea,88,12,0.5)]' : 'bg-[#1a0800] border-zinc-700 text-zinc-500'}`}>
                    <ChefHat className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className={`font-bold ${trackingState >= 1 ? 'text-white' : 'text-zinc-500'}`}>Sedang Dimasak</h4>
                    <p className="text-zinc-500 text-xs">Koki kami sedang menyiapkan seblak spesial Anda 🔥</p>
                  </div>
                </div>

                {/* Siap Diambil */}
                <div className={`flex gap-4 relative z-10 transition-all duration-500 ${trackingState >= 2 ? 'opacity-100' : 'opacity-30'}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${trackingState >= 2 ? 'bg-orange-600 border-orange-600 text-white shadow-[0_0_15px_rgba(2ea,88,12,0.5)]' : 'bg-[#1a0800] border-zinc-700 text-zinc-500'}`}>
                    <PackageCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className={`font-bold ${trackingState >= 2 ? 'text-white' : 'text-zinc-500'}`}>Siap Diambil!</h4>
                    <p className="text-zinc-500 text-xs">Pesanan sudah jadi. Silakan menuju kasir.</p>
                  </div>
                </div>

              </div>

              {/* Selesai Button */}
              {trackingState === 3 && (
                <motion.button 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  onClick={finishOrder}
                  className="mt-8 w-full bg-white text-orange-600 font-extrabold text-lg py-4 rounded-xl shadow-xl hover:bg-orange-50 transition-colors"
                >
                  Selesai & Pesan Lagi
                </motion.button>
              )}

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
