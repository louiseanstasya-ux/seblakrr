"use client"
import { motion } from "framer-motion"
import { QrCode, Globe, ClipboardList, Gamepad2, Trophy, Gift, Star, CheckCircle } from "lucide-react"
import { useTheme } from "@/context/theme"

const steps = [
  {
    id: 1,
    icon: <QrCode className="w-7 h-7" />,
    title: "Pesan & Dapat QR",
    shortTitle: "Scan QR",
    desc: "Pelanggan melakukan pemesanan seperti biasa. Setelah pesanan dicatat, pelanggan mendapatkan nomor antrian beserta QR Code yang terhubung langsung ke sistem SeblakRR.",
    detail: "QR Code ini berfungsi sebagai kunci akses ke seluruh fitur sistem.",
    color: "from-orange-600 to-red-600",
    glow: "shadow-orange-700/40",
  },
  {
    id: 2,
    icon: <Globe className="w-7 h-7" />,
    title: "Masuk ke Website",
    shortTitle: "Masuk Web",
    desc: "Setelah scan QR, pelanggan diarahkan ke website SeblakRR. Di sini bisa melihat nomor antrian, estimasi waktu, promo aktif, dan berbagai menu yang tersedia.",
    detail: "Tidak perlu tanya kasir lagi — semua informasi ada di satu tempat.",
    color: "from-amber-500 to-orange-600",
    glow: "shadow-amber-700/40",
  },
  {
    id: 3,
    icon: <ClipboardList className="w-7 h-7" />,
    title: "Tracking Pesanan Real-Time",
    shortTitle: "Tracking",
    desc: "Pantau status pesanan secara transparan: Diterima → Sedang Dimasak → Siap Diambil. Ketika makanan siap, status otomatis berubah dan pelanggan bisa segera mengambilnya.",
    detail: "Mengurangi antrean pertanyaan ke kasir secara signifikan.",
    color: "from-red-500 to-orange-500",
    glow: "shadow-red-700/40",
  },
  {
    id: 4,
    icon: <Gamepad2 className="w-7 h-7" />,
    title: "Main Game Sambil Nunggu",
    shortTitle: "Main Game",
    desc: "Untuk mengisi waktu tunggu, pelanggan dapat memainkan mini game 'Main Seblak!' di website via smartphone. Semakin tinggi skor, semakin banyak poin yang diperoleh.",
    detail: "Game bertema seblak yang relevan dan seru untuk dimainkan.",
    color: "from-orange-500 to-yellow-500",
    glow: "shadow-orange-600/40",
  },
  {
    id: 5,
    icon: <Trophy className="w-7 h-7" />,
    title: "Ranking & Leaderboard",
    shortTitle: "Ranking",
    desc: "Poin dari game dan ulasan tersimpan di akun pelanggan. Leaderboard bulanan menampilkan pelanggan dengan poin tertinggi, menciptakan kompetisi sehat yang mendorong kunjungan ulang.",
    detail: "Poin bisa juga didapat dari memberikan ulasan produk & layanan.",
    color: "from-yellow-500 to-amber-600",
    glow: "shadow-yellow-700/40",
  },
  {
    id: 6,
    icon: <Gift className="w-7 h-7" />,
    title: "Tukar Reward & Beri Ulasan",
    shortTitle: "Reward & Ulasan",
    desc: "Poin yang terkumpul dapat ditukar dengan reward berupa bahan tambahan seblak (kerupuk, telur, bakso, dll) atau hadiah lainnya. Setelah makan, pelanggan memberikan rating dan ulasan.",
    detail: "Ulasan jadi bahan evaluasi pemilik untuk meningkatkan kualitas layanan.",
    color: "from-amber-600 to-red-600",
    glow: "shadow-amber-700/40",
  },
]

const trackingStatus = [
  { label: "Pesanan Diterima", icon: <CheckCircle className="w-4 h-4" />, done: true },
  { label: "Sedang Dimasak 🔥", icon: <CheckCircle className="w-4 h-4" />, active: true },
  { label: "Siap Diambil ✅", icon: <CheckCircle className="w-4 h-4" />, done: false },
]

export default function HowItWorks() {
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const bg = isDark ? "bg-[#0d0400]" : "bg-orange-50"
  const cardBg = isDark ? "bg-white/5 border-white/10 hover:border-orange-500/30" : "bg-white border-orange-100 hover:border-orange-400/50 shadow-sm"
  const heading = isDark ? "text-white" : "text-zinc-900"
  const sub = isDark ? "text-zinc-400" : "text-zinc-500"
  const detailBg = isDark ? "bg-orange-500/10 border-orange-500/20" : "bg-orange-50 border-orange-300"
  const detailText = isDark ? "text-orange-300" : "text-orange-600"
  const flowBg = isDark ? "bg-gradient-to-r from-orange-900/20 via-red-900/20 to-orange-900/20 border-orange-500/20" : "bg-orange-100 border-orange-300"
  const flowChip = isDark ? "bg-white/10 border-white/10 text-zinc-300" : "bg-white border-orange-200 text-zinc-700"

  return (
    <section id="alur" className={`py-24 relative ${bg} transition-colors duration-300`}>
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-700 rounded-full blur-[160px]" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-red-800 rounded-full blur-[130px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-6"
        >
          <span className="text-orange-500 text-sm font-bold uppercase tracking-widest">
            📋 Alur Penggunaan
          </span>
          <h2 className={`${heading} text-4xl md:text-5xl font-extrabold mt-3`}>
            Bagaimana{" "}
            <span className="text-orange-500">SeblakRR</span>{" "}
            Bekerja?
          </h2>
          <p className={`${sub} mt-4 max-w-2xl mx-auto text-base leading-relaxed`}>
            Dari saat pelanggan memesan hingga makanan siap diambil — semua proses
            terhubung dalam satu sistem digital yang interaktif dan menyenangkan.
          </p>
        </motion.div>

        {/* Mini tracking visual */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          viewport={{ once: true }}
          className="flex items-center justify-center gap-2 mb-14 flex-wrap"
        >
          {trackingStatus.map((s, i) => (
            <div key={s.label} className="flex items-center gap-2">
              <div
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border ${
                  s.done
                    ? "bg-green-900/30 border-green-700/40 text-green-400"
                    : s.active
                    ? isDark ? "bg-orange-900/30 border-orange-500/50 text-orange-300 animate-pulse" : "bg-orange-100 border-orange-400 text-orange-600 animate-pulse"
                    : isDark ? "bg-white/5 border-white/10 text-zinc-500" : "bg-zinc-100 border-zinc-200 text-zinc-400"
                }`}
              >
                {s.label}
              </div>
              {i < trackingStatus.length - 1 && (
                <span className={`text-lg ${isDark ? "text-zinc-600" : "text-zinc-400"}`}>→</span>
              )}
            </div>
          ))}
        </motion.div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              className={`group border rounded-3xl p-6 transition-all hover:-translate-y-1 ${cardBg}`}
            >
              {/* Step number */}
              <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-orange-600 text-white text-sm font-extrabold flex items-center justify-center shadow-lg">
                {step.id}
              </div>

              {/* Icon */}
              <div
                className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white mb-4 shadow-lg ${step.glow}`}
              >
                {step.icon}
              </div>

              <h3 className={`${heading} text-lg font-bold mb-2`}>{step.title}</h3>
              <p className={`${sub} text-sm leading-relaxed mb-3`}>{step.desc}</p>
              <div className={`border rounded-xl px-3 py-2 ${detailBg}`}>
                <p className={`${detailText} text-xs leading-relaxed`}>💡 {step.detail}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Flow summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          viewport={{ once: true }}
          className={`mt-14 border rounded-3xl p-6 md:p-8 text-center ${flowBg}`}
        >
          <p className="text-orange-400 text-sm font-bold uppercase tracking-widest mb-3">
            🔄 Ringkasan Alur
          </p>
          <div className="flex flex-wrap justify-center items-center gap-2 text-sm">
            {["Pesan Makanan", "Dapat QR Code", "Scan QR", "Cek Antrian", "Tracking Status", "Main Game", "Kumpulkan Poin", "Tukar Reward", "Makanan Siap", "Beri Ulasan"].map((item, i, arr) => (
              <span key={item} className="flex items-center gap-2">
                <span className={`border px-3 py-1.5 rounded-full font-medium ${flowChip}`}>{item}</span>
                {i < arr.length - 1 && <span className="text-orange-600 font-bold">→</span>}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
