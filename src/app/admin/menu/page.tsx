"use client"
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { Plus, X, Pencil, Save, Search, UtensilsCrossed, Tag, AlertTriangle, Upload, Loader2 } from "lucide-react";

interface MenuItem {
  _id: string;
  merchantId: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  section: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}

const SECTIONS = ["Seblak", "Rice Bowl", "Gorengan", "Minuman"];

const PRESET_IMAGES: { label: string; src: string }[] = [
  { label: "Seblak", src: "/menu-images/seblak.png" },
  { label: "Nasi Goreng", src: "/menu-images/nasi_goreng.png" },
  { label: "Rice Bowl", src: "/menu-images/rice_bowl.png" },
  { label: "Pisang Goreng", src: "/menu-images/pisang_goreng.png" },
  { label: "Kentang Goreng", src: "/menu-images/kentang_goreng.png" },
  { label: "Minuman", src: "/menu-images/minuman.png" },
];

const MOCK_MENU: MenuItem[] = [
  { _id: "seblak-001", merchantId: "seblakrr", title: "Seblak Original (Lv 1-3)", description: "Seblak dengan kuah gurih pedas khas RR, pilih level kepedasan 1-3 GRATIS! Isi: kerupuk, telur, sosis.", price: 15000, originalPrice: 18000, quantity: 100, section: "Seblak", image: "/menu-images/seblak.png", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { _id: "seblak-002", merchantId: "seblakrr", title: "Mix Level Seblak (Lv 1-3)", description: "Seblak campuran dengan topping komplit: kerupuk, mie, makaroni, telur & sosis. Level 1-3 GRATIS!", price: 18000, quantity: 100, section: "Seblak", image: "/menu-images/seblak.png", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { _id: "ricebowl-001", merchantId: "seblakrr", title: "Nasi Goreng Telur", description: "Nasi goreng wangi dengan bumbu spesial, telur mata sapi di atasnya, dan kerupuk renyah.", price: 15000, quantity: 100, section: "Rice Bowl", image: "/menu-images/nasi_goreng.png", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { _id: "ricebowl-002", merchantId: "seblakrr", title: "Nasi Goreng Sosis", description: "Nasi goreng bumbu spesial dengan irisan sosis sapi/ayam yang melimpah, disajikan panas.", price: 18000, quantity: 100, section: "Rice Bowl", image: "/menu-images/nasi_goreng.png", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { _id: "ricebowl-003", merchantId: "seblakrr", title: "Rice Bowl Nugget Sambal Matah", description: "Nasi putih hangat dengan nugget goreng krispi dan sambal matah segar khas Bali di atasnya.", price: 18000, quantity: 100, section: "Rice Bowl", image: "/menu-images/rice_bowl.png", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { _id: "ricebowl-004", merchantId: "seblakrr", title: "Rice Bowl Ayam Daun Jeruk", description: "Nasi putih dengan ayam goreng bumbu daun jeruk yang harum dan crispy.", price: 18000, quantity: 100, section: "Rice Bowl", image: "/menu-images/rice_bowl.png", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { _id: "goreng-001", merchantId: "seblakrr", title: "Kentang Goreng", description: "Kentang goreng renyah di luar, lembut di dalam. Disajikan dengan saus sambal & mayones.", price: 10000, quantity: 100, section: "Gorengan", image: "/menu-images/kentang_goreng.png", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { _id: "goreng-002", merchantId: "seblakrr", title: "Pisang Keju Susu", description: "Pisang goreng crispy topping keju parut dan susu kental manis.", price: 10000, quantity: 100, section: "Gorengan", image: "/menu-images/pisang_goreng.png", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { _id: "goreng-003", merchantId: "seblakrr", title: "Pisang Coklat Meses", description: "Pisang goreng crispy dibalut coklat leleh dan ditaburi meses warna-warni.", price: 10000, quantity: 100, section: "Gorengan", image: "/menu-images/pisang_goreng.png", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { _id: "minum-001", merchantId: "seblakrr", title: "Es Teh Manis", description: "Teh manis segar dengan es batu yang banyak.", price: 5000, quantity: 100, section: "Minuman", image: "/menu-images/minuman.png", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { _id: "minum-002", merchantId: "seblakrr", title: "Es Jeruk Segar", description: "Perasan jeruk asli dicampur sirup dan es batu.", price: 5000, quantity: 100, section: "Minuman", image: "/menu-images/minuman.png", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { _id: "minum-003", merchantId: "seblakrr", title: "Es Mangga", description: "Jus mangga segar dengan es batu.", price: 5000, quantity: 100, section: "Minuman", image: "/menu-images/minuman.png", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { _id: "minum-004", merchantId: "seblakrr", title: "Air Mineral Botol 600ml", description: "Air mineral botol 600ml, dingin dan menyegarkan.", price: 5000, quantity: 100, section: "Minuman", image: "/menu-images/minuman.png", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

const emptyForm = {
  title: "", description: "", price: "", originalPrice: "", section: "Seblak", image: "/menu-images/seblak.png",
};

export default function AdminMenu() {
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [activeSection, setActiveSection] = useState("Semua");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState<MenuItem | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const loadMenus = async () => {
    try {
      const res = await fetch("/api/seblak/menu");
      const data = await res.json();
      if (data.success && data.data.length > 0) {
        setMenus(data.data);
        return;
      }
    } catch { /* ignore */ }
    setMenus(MOCK_MENU);
  };

  const openAdd = () => {
    setEditTarget(null);
    setForm(emptyForm);
    setUploadError("");
    setShowModal(true);
  };

  const openEdit = (menu: MenuItem) => {
    setEditTarget(menu);
    setForm({
      title: menu.title,
      description: menu.description || "",
      price: String(menu.price),
      originalPrice: String(menu.originalPrice || ""),
      section: menu.section,
      image: menu.image,
    });
    setUploadError("");
    setShowModal(true);
  };

  const handleUploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Ukuran file maksimal 5MB");
      return;
    }
    setUploading(true);
    setUploadError("");
    try {
      const fd = new FormData();
      fd.append("image", file);
      const res = await fetch("/api/seblak/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.success) {
        setForm(f => ({ ...f, image: data.url }));
      } else {
        setUploadError(data.message || "Gagal upload");
      }
    } catch {
      setUploadError("Gagal upload gambar");
    } finally {
      setUploading(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { loadMenus(); }, []);

  const handleSave = async () => {
    if (!form.title.trim() || !form.price) return alert("Nama dan harga wajib diisi!");
    const payload = {
      title:         form.title.trim(),
      description:   form.description.trim(),
      price:         Number(form.price),
      originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
      section:       form.section,
      image:         form.image,
    };
    try {
      if (editTarget) {
        await fetch("/api/seblak/menu", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editTarget._id, ...payload }),
        });
      } else {
        await fetch("/api/seblak/menu", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
      await loadMenus();
    } catch { alert("Gagal menyimpan menu"); }
    setShowModal(false);
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch("/api/seblak/menu", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      await loadMenus();
    } catch { alert("Gagal menghapus menu"); }
    setDeleteConfirm(null);
  };

  const filtered = menus.filter(m => {
    const matchSection = activeSection === "Semua" || m.section === activeSection;
    const matchSearch = !search || m.title.toLowerCase().includes(search.toLowerCase());
    return matchSection && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Manajemen Menu</h1>
          <p className="text-zinc-500 text-sm mt-1">{menus.length} item tersedia dalam katalog</p>
        </div>
        <button
          id="tambah-menu-btn"
          onClick={openAdd}
          className="flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-orange-900/40"
        >
          <Plus className="w-5 h-5" /> Tambah Menu
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Cari nama menu..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-[#1a0800] border border-orange-900/30 text-white placeholder-zinc-600 pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:border-orange-500/50 text-sm transition-colors"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {["Semua", ...SECTIONS].map(s => (
            <button
              key={s}
              onClick={() => setActiveSection(s)}
              className={`px-4 py-2 rounded-xl whitespace-nowrap font-bold text-sm transition-all ${
                activeSection === s
                  ? 'bg-orange-600 text-white shadow-lg shadow-orange-900/50'
                  : 'bg-[#1a0800] border border-orange-900/30 text-zinc-400 hover:border-orange-500/30 hover:text-orange-400'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filtered.map(menu => (
          <div
            key={menu._id}
            className="bg-[#1a0800] border border-orange-900/30 rounded-2xl overflow-hidden hover:border-orange-500/30 transition-all group flex flex-col"
          >
            {/* Image */}
            <div className="relative h-40 bg-zinc-900 overflow-hidden">
              <Image src={menu.image} alt={menu.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
              {menu.originalPrice && menu.originalPrice > menu.price && (
                <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-extrabold px-2 py-1 rounded-md">
                  HEMAT Rp {(menu.originalPrice - menu.price).toLocaleString('id-ID')}
                </div>
              )}
              <div className="absolute top-2 right-2 bg-[#0d0400]/80 backdrop-blur-sm text-orange-400 text-[10px] font-bold px-2 py-1 rounded-md border border-orange-900/30">
                {menu.section}
              </div>
            </div>

            {/* Content */}
            <div className="p-4 flex flex-col flex-grow">
              <h3 className="text-white font-bold text-sm line-clamp-2 mb-1">{menu.title}</h3>
              <p className="text-zinc-500 text-xs line-clamp-2 flex-grow">{menu.description}</p>
              <div className="mt-3">
                {menu.originalPrice && (
                  <p className="text-zinc-600 text-[10px] line-through">Rp {menu.originalPrice.toLocaleString('id-ID')}</p>
                )}
                <p className="text-orange-400 font-extrabold text-sm">Rp {menu.price.toLocaleString('id-ID')}</p>
              </div>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => openEdit(menu)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-orange-600/10 border border-orange-500/20 text-orange-400 hover:bg-orange-600/20 rounded-xl text-xs font-bold transition-all"
                >
                  <Pencil className="w-3 h-3" /> Edit
                </button>
                <button
                  onClick={() => setDeleteConfirm(menu._id)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 rounded-xl text-xs font-bold transition-all"
                >
                  <X className="w-3 h-3" /> Hapus
                </button>
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full py-16 text-center">
            <UtensilsCrossed className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
            <p className="text-zinc-500 font-medium">Tidak ada menu ditemukan</p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div ref={modalRef} className="bg-[#1a0800] w-full max-w-lg rounded-3xl border border-orange-500/30 shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-orange-900/50 flex justify-between items-center bg-orange-600/10">
              <h3 className="text-white font-bold text-lg">
                {editTarget ? "✏️ Edit Menu" : "➕ Tambah Menu Baru"}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-zinc-400 hover:text-white bg-white/5 p-2 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 flex flex-col gap-4 max-h-[75vh] overflow-y-auto">
              {/* Title */}
              <div className="flex flex-col gap-1.5">
                <label className="text-zinc-400 text-xs font-bold uppercase tracking-wider">Nama Menu *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="cth: Seblak Komplit Level 3"
                  className="bg-[#0d0400] text-white border border-orange-900/30 focus:border-orange-500/50 rounded-xl px-4 py-3 text-sm outline-none transition-colors"
                />
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1.5">
                <label className="text-zinc-400 text-xs font-bold uppercase tracking-wider">Deskripsi</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="Deskripsi singkat menu..."
                  rows={3}
                  className="bg-[#0d0400] text-white border border-orange-900/30 focus:border-orange-500/50 rounded-xl px-4 py-3 text-sm outline-none transition-colors resize-none"
                />
              </div>

              {/* Price Row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-zinc-400 text-xs font-bold uppercase tracking-wider">Harga *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm">Rp</span>
                    <input
                      type="number"
                      value={form.price}
                      onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                      placeholder="15000"
                      className="bg-[#0d0400] text-white border border-orange-900/30 focus:border-orange-500/50 rounded-xl pl-10 pr-4 py-3 text-sm outline-none w-full transition-colors"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-zinc-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                    <Tag className="w-3 h-3" /> Harga Coret
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm">Rp</span>
                    <input
                      type="number"
                      value={form.originalPrice}
                      onChange={e => setForm(f => ({ ...f, originalPrice: e.target.value }))}
                      placeholder="Opsional"
                      className="bg-[#0d0400] text-white border border-orange-900/30 focus:border-orange-500/50 rounded-xl pl-10 pr-4 py-3 text-sm outline-none w-full transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Section */}
              <div className="flex flex-col gap-1.5">
                <label className="text-zinc-400 text-xs font-bold uppercase tracking-wider">Kategori *</label>
                <select
                  value={form.section}
                  onChange={e => setForm(f => ({ ...f, section: e.target.value }))}
                  className="bg-[#0d0400] text-white border border-orange-900/30 focus:border-orange-500/50 rounded-xl px-4 py-3 text-sm outline-none transition-colors"
                >
                  {SECTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              {/* Image Picker */}
              <div className="flex flex-col gap-2">
                <label className="text-zinc-400 text-xs font-bold uppercase tracking-wider">Gambar Menu</label>

                {/* Upload tombol */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className={`flex items-center justify-center gap-2 w-full py-3 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
                    uploading
                      ? "border-orange-500/50 bg-orange-500/5"
                      : "border-orange-900/40 hover:border-orange-500/50 hover:bg-orange-500/5"
                  }`}
                >
                  {uploading ? (
                    <><Loader2 className="w-4 h-4 text-orange-400 animate-spin" /><span className="text-orange-400 text-sm font-bold">Mengupload...</span></>
                  ) : (
                    <><Upload className="w-4 h-4 text-zinc-400" /><span className="text-zinc-400 text-sm">Upload foto dari perangkat Anda</span></>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleUploadFile}
                />
                {uploadError && (
                  <p className="text-red-400 text-xs">{uploadError}</p>
                )}

                {/* Preview gambar yang diupload atau dipilih */}
                {form.image && (
                  <div className="relative h-28 w-full rounded-xl overflow-hidden border border-orange-500/30">
                    <Image src={form.image} alt="Preview" fill className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-2">
                      <span className="text-white text-[10px] font-bold bg-black/40 px-2 py-1 rounded-lg">Gambar Terpilih</span>
                    </div>
                  </div>
                )}

                {/* Preset gambar */}
                <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mt-1">— atau pilih gambar bawaan —</p>
                <div className="grid grid-cols-3 gap-2">
                  {PRESET_IMAGES.map(img => (
                    <button
                      key={img.src}
                      onClick={() => setForm(f => ({ ...f, image: img.src }))}
                      className={`relative h-20 rounded-xl overflow-hidden border-2 transition-all ${
                        form.image === img.src ? 'border-orange-500 shadow-lg shadow-orange-900/50' : 'border-orange-900/30 hover:border-orange-500/50'
                      }`}
                    >
                      <Image src={img.src} alt={img.label} fill className="object-cover" />
                      <div className={`absolute inset-0 ${form.image === img.src ? 'bg-orange-600/30' : 'bg-black/40'} flex items-end p-1`}>
                        <span className="text-white text-[9px] font-bold">{img.label}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowModal(false)} className="flex-1 py-3 bg-white/5 border border-orange-900/30 text-zinc-400 hover:text-white rounded-xl font-bold transition-all text-sm">
                  Batal
                </button>
                <button onClick={handleSave} className="flex-1 py-3 bg-orange-600 hover:bg-orange-500 text-white rounded-xl font-bold transition-all text-sm flex items-center justify-center gap-2 shadow-lg shadow-orange-900/40">
                  <Save className="w-4 h-4" /> Simpan Menu
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#1a0800] rounded-2xl border border-red-500/30 p-6 max-w-sm w-full text-center">
            <AlertTriangle className="w-10 h-10 text-red-400 mx-auto mb-3" />
            <h3 className="text-white font-bold text-lg mb-1">Hapus Menu Ini?</h3>
            <p className="text-zinc-400 text-sm mb-6">Tindakan ini tidak dapat dibatalkan.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 bg-white/5 border border-orange-900/30 text-zinc-400 rounded-xl font-bold text-sm hover:text-white transition-all">Batal</button>
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold text-sm transition-all">Hapus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
