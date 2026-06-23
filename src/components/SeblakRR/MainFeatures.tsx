"use client"
import { motion } from "framer-motion"
import { ClipboardList, Gamepad2, Star, Trophy, Gift, MessageSquare } from "lucide-react"
import { useTheme } from "@/context/theme"

const features = [
  {
    icon: <ClipboardList className="w-6 h-6" />,
    title: "Tracking Pesanan Real-Time",
    tag: "Tracking",
    desc: "Pantau status pesanan secara langsung tanpa perlu bertanya ke kasir. Status berubah otomatis: Diterima → Sedang Dimasak → Siap Diambil.",
    color: "from-orange-500 to-red-500",
    highlight: "Notifikasi otomatis saat pesanan siap diambil!",
  },
  {
    icon: <Gamepad2 className="w-6 h-6" />,
    title: 'Mini Game "Main Seblak!"',
    tag: "Game",
    desc: "Bermain mini game bertema seblak langsung dari smartphone selama menunggu. Skor tinggi = lebih banyak poin yang dikumpulkan.",
    color: "from-red-600 to-orange-600",
    highlight: "Semakin sering bermain, semakin banyak poin!",
  },
  {
    icon: <Star className="w-6 h-6" />,
    title: "Sistem Poin Loyalitas",
    tag: "Poin",
    desc: "Poin diperoleh dari bermain game dan memberikan ulasan. Poin tersimpan di akun pelanggan dan bisa ditukar kapan saja dengan reward pilihan.",
    color: "from-yellow-500 to-amber-600",
    highlight: "Poin dari game + ulasan = lebih banyak reward!",
  },
  {
    icon: <Trophy className="w-6 h-6" />,
    title: "Ranking & Leaderboard Bulanan",
    tag: "Ranking",
    desc: "Leaderboard menampilkan pelanggan dengan poin tertinggi setiap bulan. Kompetisi sehat yang mendorong pelanggan untuk terus aktif dan kembali berkunjung.",
    color: "from-amber-600 to-red-600",
    highlight: "Posisi teratas mendapat hadiah ekstra spesial!",
  },
  {
    icon: <Gift className="w-6 h-6" />,
    title: "Tukar Poin dengan Reward",
    tag: "Reward",
    desc: "Poin dapat ditukar dengan bahan tambahan seblak (kerupuk, telur, bakso, ceker, mie, dll) atau hadiah lainnya. Proses penukaran mudah dan digital.",
    color: "from-orange-600 to-yellow-500",
    highlight: "Klik Tukar → Reward langsung tercatat di kasir!",
  },
  {
    icon: <MessageSquare className="w-6 h-6" />,
    title: "Ulasan & Rating Pelanggan",
    tag: "Ulasan",
    desc: "Setelah menikmati makanan, pelanggan memberi rating bintang dan komentar tentang rasa, pelayanan, dan kenyamanan. Ulasan ini menjadi bahan evaluasi pemilik usaha.",
    color: "from-orange-600 to-amber-500",
    highlight: "Memberikan ulasan juga menghasilkan poin tambahan!",
  },
]

const props = [
  {
    icon: "⏱️",
    label: "Waktu Tunggu Lebih Seru",
    desc: "Tracking real-time + mini game mengubah momen bosan menjadi pengalaman menyenangkan.",
  },
  {
    icon: "🏆",
    label: "Program Loyalitas",
    desc: "Sistem poin yang adil — dari game, ulasan, dan aktivitas lain. Semakin aktif, semakin banyak hadiah.",
  },
  {
    icon: "🎁",
    label: "Reward Nyata",
    desc: "Poin ditukar dengan bahan tambahan seblak atau hadiah menarik langsung dari restoran.",
  },
]

export default function MainFeatures() {
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const bg = isDark ? "bg-gradient-to-b from-[#0d0400] to-[#130600]" : "bg-gradient-to-b from-orange-50 to-amber-50"
  const heading = isDark ? "text-white" : "text-zinc-900"
  const sub = isDark ? "text-zinc-400" : "text-zinc-500"
  const cardBg = isDark ? "bg-white/5 border-white/10 hover:border-orange-500/40" : "bg-white border-orange-100 hover:border-orange-400/50 shadow-sm"
  const hlBg = isDark ? "bg-orange-500/10 border-orange-500/20" : "bg-orange-50 border-orange-300"
  const hlText = isDark ? "text-orange-300" : "text-orange-600"
  const propBg = isDark ? "bg-orange-600/10 border-orange-500/20" : "bg-orange-50 border-orange-200"

  return (
    <section id="fitur" className={`py-24 ${bg} transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-orange-500 text-sm font-bold uppercase tracking-widest">
            ⚙️ Fitur Unggulan
          </span>
          <h2 className={`${heading} text-4xl md:text-5xl font-extrabold mt-3`}>
            Fitur Lengkap <span className="text-orange-500">SeblakRR</span>
          </h2>
          <p className={`${sub} mt-4 max-w-xl mx-auto`}>
            Setiap fitur dirancang khusus untuk membuat waktu tunggu lebih
            bermakna — bagi pelanggan maupun pemilik usaha.
          </p>
        </motion.div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              className={`group border rounded-3xl p-6 hover:-translate-y-1 transition-all flex flex-col ${cardBg}`}
            >
              <div
                className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center text-white mb-4 shadow-md`}
              >
                {f.icon}
              </div>
              <span className="text-orange-500 text-[11px] font-bold uppercase tracking-widest">
                {f.tag}
              </span>
              <h3 className={`${heading} text-lg font-bold mt-1 mb-2`}>{f.title}</h3>
              <p className={`${sub} text-sm leading-relaxed flex-1`}>{f.desc}</p>
              <div className={`mt-4 border rounded-xl px-3 py-2 ${hlBg}`}>
                <p className={`${hlText} text-xs`}>✨ {f.highlight}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 3 props section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {props.map((p, i) => (
            <motion.div
              key={p.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.15 }}
              viewport={{ once: true }}
              className={`flex items-start gap-4 border rounded-2xl p-5 ${propBg}`}
            >
              <span className="text-4xl flex-shrink-0">{p.icon}</span>
              <div>
                <h4 className={`${heading} font-bold text-base mb-1`}>{p.label}</h4>
                <p className={`${sub} text-sm leading-relaxed`}>{p.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
