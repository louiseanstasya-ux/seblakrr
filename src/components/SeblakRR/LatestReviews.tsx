"use client"
import { motion } from "framer-motion"
import { useTheme } from "@/context/theme"

const reviews = [
  {
    name: "Rina S.",
    avatar: "RS",
    stars: 5,
    time: "20 menit lalu",
    comment:
      "Seblaknya enak banget, pedas pas, bahan lengkap & pelayanannya ramah!",
    avatarColor: "from-pink-600 to-rose-700",
  },
  {
    name: "Dewi Purnama",
    avatar: "DP",
    stars: 5,
    time: "35 menit lalu",
    comment:
      "Porsi pas, topping lengkap, nagih!",
    avatarColor: "from-violet-600 to-purple-700",
  },
  {
    name: "Mour Sari",
    avatar: "MS",
    stars: 5,
    time: "1 jam lalu",
    comment:
      "Best banget! Level 3 pedasnya juara 🔥",
    avatarColor: "from-orange-600 to-amber-700",
  },
  {
    name: "Budi Hartono",
    avatar: "BH",
    stars: 5,
    time: "1 jam lalu",
    comment:
      "Tempat nyaman, makanan enak, rekomen!",
    avatarColor: "from-teal-600 to-cyan-700",
  },
  {
    name: "Siti Maulida",
    avatar: "SM",
    stars: 5,
    time: "2 jam lalu",
    comment:
      "Sambil nunggu bisa main game! Seru banget sistemnya, udah dapet 2.300 poin.",
    avatarColor: "from-emerald-600 to-green-700",
  },
  {
    name: "Andi Wijaya",
    avatar: "AW",
    stars: 4,
    time: "3 jam lalu",
    comment:
      "Game-nya bikin nagih, reward-nya keren. Tambahkan lebih banyak pilihan reward ya!",
    avatarColor: "from-blue-600 to-indigo-700",
  },
]

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < count ? "text-orange-400" : "text-zinc-700"}>
          ★
        </span>
      ))}
    </div>
  )
}

export default function LatestReviews() {
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const bg = isDark ? "bg-gradient-to-b from-[#130600] to-[#0d0400]" : "bg-gradient-to-b from-amber-50 to-orange-50"
  const heading = isDark ? "text-white" : "text-zinc-900"
  const sub = isDark ? "text-zinc-400" : "text-zinc-500"
  const cardBg = isDark ? "bg-white/5 border-white/10 hover:border-orange-500/30" : "bg-white border-orange-100 hover:border-orange-300 shadow-sm"
  const commentText = isDark ? "text-zinc-300" : "text-zinc-600"
  const timeText = isDark ? "text-zinc-600" : "text-zinc-400"
  const nameText = isDark ? "text-white" : "text-zinc-900"

  return (
    <section id="ulasan" className={`py-24 ${bg} transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="text-orange-500 text-sm font-bold uppercase tracking-widest">
            ⭐ Ulasan
          </span>
          <h2 className={`${heading} text-4xl md:text-5xl font-extrabold mt-3`}>
            Ulasan Terbaru
          </h2>
          <p className={`${sub} mt-3 max-w-md mx-auto`}>
            Ribuan pelanggan puas dengan pengalaman SeblakRR!
          </p>
        </motion.div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {reviews.map((r, i) => (
            <motion.div
              key={r.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              className={`border rounded-3xl p-5 transition-all hover:-translate-y-0.5 ${cardBg}`}
            >
              <div className="flex items-start gap-3 mb-3">
                {/* Avatar */}
                <div
                  className={`w-10 h-10 rounded-full bg-gradient-to-br ${r.avatarColor} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}
                >
                  {r.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-bold text-sm ${nameText}`}>{r.name}</p>
                  <Stars count={r.stars} />
                </div>
                <span className={`text-[11px] whitespace-nowrap ${timeText}`}>{r.time}</span>
              </div>
              <p className={`text-sm leading-relaxed ${commentText}`}>
                &ldquo;{r.comment}&rdquo;
              </p>
            </motion.div>
          ))}
        </div>

        {/* See All */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-10 text-center"
        >
          <button className="inline-flex items-center gap-2 border border-orange-500/40 text-orange-400 font-semibold px-6 py-3 rounded-full hover:bg-orange-500/10 transition-all text-sm">
            Lihat Semua Ulasan →
          </button>
        </motion.div>
      </div>
    </section>
  )
}
