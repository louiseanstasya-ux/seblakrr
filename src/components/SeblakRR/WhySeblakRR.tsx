"use client"
import { motion } from "framer-motion"
import { CheckCircle2, Shield, Zap, Smartphone, Monitor, Tablet, Laptop } from "lucide-react"
import { useTheme } from "@/context/theme"

const reasons = [
  "Membuat waktu menunggu lebih menyenangkan dan tidak membosankan",
  "Tracking pesanan real-time — tidak perlu tanya kasir",
  "Sistem poin yang adil dan transparan dari game & ulasan",
  "Hadiah berupa bahan seblak yang nyata dan bermanfaat",
  "Meningkatkan loyalitas dan frekuensi kunjungan pelanggan",
  "Mendukung digitalisasi bisnis kuliner secara menyeluruh",
]

const techFeatures = [
  { icon: <Smartphone className="w-6 h-6" />, title: "Web Responsif", desc: "Akses mudah tanpa install aplikasi, langsung dari browser smartphone." },
  { icon: <Shield className="w-6 h-6" />, title: "Data Aman", desc: "Sistem aman dan terlindungi, data pelanggan dijaga kerahasiaannya." },
  { icon: <Zap className="w-6 h-6" />, title: "Real-time Update", desc: "Status pesanan diperbarui secara otomatis dan instan." },
  { icon: <CheckCircle2 className="w-6 h-6" />, title: "Mudah Digunakan", desc: "Antarmuka intuitif, langsung bisa digunakan tanpa tutorial." },
]

const devices = [
  { icon: <Smartphone className="w-7 h-7" />, name: "Smartphone" },
  { icon: <Tablet className="w-7 h-7" />, name: "Tablet" },
  { icon: <Laptop className="w-7 h-7" />, name: "Laptop" },
  { icon: <Monitor className="w-7 h-7" />, name: "Desktop" },
]

export default function WhySeblakRR() {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  const bg = isDark ? "bg-[#0d0400]" : "bg-white"
  const heading = isDark ? "text-white" : "text-zinc-900"
  const sub = isDark ? "text-zinc-400" : "text-zinc-500"
  const liText = isDark ? "text-zinc-300" : "text-zinc-600"
  const cardBg = isDark ? "bg-white/5 border-white/10 hover:border-orange-500/30" : "bg-orange-50 border-orange-100 hover:border-orange-300"
  const cardTitle = isDark ? "text-white" : "text-zinc-900"
  const cardSub = isDark ? "text-zinc-500" : "text-zinc-500"
  const deviceBg = isDark ? "bg-white/5 border-white/10 hover:border-orange-500/30 hover:bg-orange-500/5 text-orange-400" : "bg-orange-50 border-orange-100 hover:border-orange-300 text-orange-500"
  const deviceLabel = isDark ? "text-zinc-400" : "text-zinc-500"
  const ownerBg = isDark ? "bg-gradient-to-r from-orange-900/30 to-red-900/30 border-orange-500/30" : "bg-orange-50 border-orange-200"
  const ownerList = isDark ? "text-zinc-400" : "text-zinc-600"

  return (
    <section id="kontak" className={`py-24 transition-colors duration-300 ${bg}`}>
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left */}
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }} viewport={{ once: true }}>
            <span className="text-orange-500 text-sm font-bold uppercase tracking-widest">✅ Keunggulan</span>
            <h2 className={`${heading} text-4xl font-extrabold mt-3 mb-3`}>
              Kenapa <span className="text-orange-500">SeblakRR</span>?
            </h2>
            <p className={`${sub} text-sm leading-relaxed mb-8 max-w-md`}>
              SeblakRR bukan sekadar sistem antrian digital. Ini adalah ekosistem yang menghubungkan pelanggan dengan pengalaman menunggu yang bermakna sekaligus menguntungkan.
            </p>
            <ul className="space-y-4">
              {reasons.map((r, i) => (
                <motion.li key={r} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }} className={`flex items-start gap-3 ${liText}`}>
                  <CheckCircle2 className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm leading-relaxed">{r}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Right */}
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }} viewport={{ once: true }} className="space-y-8">
            <div>
              <span className="text-orange-500 text-sm font-bold uppercase tracking-widest">🛡 Teknologi & Keamanan</span>
              <div className="grid grid-cols-2 gap-4 mt-5">
                {techFeatures.map((t, i) => (
                  <motion.div key={t.title} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }}
                    className={`border rounded-2xl p-4 flex items-start gap-3 transition-all ${cardBg}`}>
                    <div className="text-orange-400 mt-0.5 flex-shrink-0">{t.icon}</div>
                    <div>
                      <p className={`font-bold text-sm ${cardTitle}`}>{t.title}</p>
                      <p className={`text-xs mt-0.5 leading-relaxed ${cardSub}`}>{t.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div>
              <span className="text-orange-500 text-sm font-bold uppercase tracking-widest">📱 Perangkat yang Didukung</span>
              <p className={`text-xs mt-1 mb-4 ${sub}`}>Tidak perlu install aplikasi — cukup buka browser.</p>
              <div className="flex flex-wrap gap-4">
                {devices.map((d, i) => (
                  <motion.div key={d.name} initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }}
                    className={`flex flex-col items-center gap-2 border rounded-2xl px-6 py-4 transition-all ${deviceBg}`}>
                    {d.icon}
                    <span className={`text-xs font-medium ${deviceLabel}`}>{d.name}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} viewport={{ once: true }}
              className={`border rounded-2xl p-5 ${ownerBg}`}>
              <p className="text-orange-400 text-sm font-bold mb-2">👨‍🍳 Manfaat untuk Pemilik Usaha</p>
              <ul className={`space-y-1.5 text-sm ${ownerList}`}>
                <li>• Mengurangi pertanyaan berulang ke kasir</li>
                <li>• Ulasan pelanggan sebagai bahan evaluasi layanan</li>
                <li>• Data engagement pelanggan yang terukur</li>
                <li>• Meningkatkan repeat order lewat program reward</li>
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
