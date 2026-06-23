"use client"
import Image from "next/image"
import { motion } from "framer-motion"
import { Gamepad2, Star, Gift, ArrowRight, Smartphone } from "lucide-react"
import { useTheme } from "@/context/theme"

const features = [
  { icon: <Smartphone className="w-6 h-6" />, label: "Buka Web" },
  { icon: <Gamepad2 className="w-6 h-6" />, label: "Main Game" },
  { icon: <Star className="w-6 h-6" />, label: "Kumpulkan Poin" },
  { icon: <Gift className="w-6 h-6" />, label: "Tukar Reward" },
]

export default function HeroSection() {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  const heroBg = isDark
    ? "bg-gradient-to-br from-[#1a0400] via-[#0d0400] to-[#1a0800]"
    : "bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100"
  const bottomWave = isDark
    ? "bg-gradient-to-t from-[#0d0400] to-transparent"
    : "bg-gradient-to-t from-orange-50 to-transparent"
  const glowOpacity = isDark ? "opacity-30" : "opacity-10"
  const heading = isDark ? "text-white" : "text-zinc-900"
  const sub = isDark ? "text-zinc-300" : "text-zinc-600"
  const badgeBg = isDark ? "bg-orange-500/20 border-orange-500/30" : "bg-orange-100 border-orange-300"
  const featureCardBg = isDark
    ? "bg-white/5 border-white/10 hover:bg-orange-500/10 hover:border-orange-500/30"
    : "bg-white border-orange-100 hover:bg-orange-50 hover:border-orange-300 shadow-sm"
  const featureLabel = isDark ? "text-white" : "text-zinc-700"
  const floatCard = isDark
    ? "bg-[#1a0800] border-orange-500/30 shadow-black/40"
    : "bg-white border-orange-200 shadow-orange-100/60"
  const floatTitle = isDark ? "text-orange-400" : "text-orange-500"
  const floatSub = isDark ? "text-zinc-400" : "text-zinc-500"
  const ctaSecondary = isDark
    ? "border-white/20 text-white hover:bg-white/5"
    : "border-orange-300 text-zinc-700 hover:bg-orange-50"

  return (
    <section id="beranda" className={`relative min-h-screen flex items-center pt-20 overflow-hidden transition-colors duration-300 ${heroBg}`}>
      {/* Glow blobs */}
      <div className={`absolute inset-0 ${glowOpacity}`}>
        <div className="absolute top-20 left-10 w-72 h-72 bg-orange-600 rounded-full blur-[120px]" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-red-700 rounded-full blur-[160px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-yellow-600 rounded-full blur-[200px]" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 grid lg:grid-cols-2 gap-12 items-center py-20">
        {/* Left */}
        <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} className="flex flex-col items-start">
          {/* Badge */}
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className={`mb-6 inline-flex items-center gap-2 border rounded-full px-4 py-1.5 ${badgeBg}`}>
            <span className="text-orange-400 text-xs font-bold uppercase tracking-widest">
              🔥 Level Up Your Waiting Time!
            </span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className={`text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-4 ${heading}`}>
            Seblak<span className="text-orange-500">RR</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className={`text-lg leading-relaxed max-w-lg mb-8 ${sub}`}>
            Sistem digital interaktif yang mengubah waktu tunggu pesananmu menjadi pengalaman seru — dengan{" "}
            <span className="text-orange-400 font-semibold">tracking pesanan real-time</span>,{" "}
            <span className="text-orange-400 font-semibold">mini game</span>,{" "}
            <span className="text-orange-400 font-semibold">poin loyalitas</span>, dan{" "}
            <span className="text-orange-400 font-semibold">reward menarik</span>.
          </motion.p>

          {/* Feature icons */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10 w-full max-w-md">
            {features.map((f, i) => (
              <motion.div key={f.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + i * 0.1 }}
                className={`flex flex-col items-center gap-2 border rounded-2xl p-3 transition-all cursor-pointer group ${featureCardBg}`}>
                <div className="text-orange-400 group-hover:scale-110 transition-transform">{f.icon}</div>
                <span className={`text-[11px] font-semibold text-center ${featureLabel}`}>{f.label}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="flex flex-col sm:flex-row gap-4">
            <a href="#alur" className="group inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white font-bold px-8 py-4 rounded-full shadow-xl shadow-orange-900/40 transition-all">
              Lihat Cara Kerja
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <a href="#fitur" className={`inline-flex items-center justify-center gap-2 border font-semibold px-8 py-4 rounded-full transition-all ${ctaSecondary}`}>
              Jelajahi Fitur
            </a>
          </motion.div>
        </motion.div>

        {/* Right — Food Image + floating cards */}
        <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }} className="relative flex justify-center items-center">
          <div className="relative w-72 h-72 md:w-96 md:h-96">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-orange-500/30 to-red-600/30 blur-2xl" />
            <div className="absolute inset-4 rounded-full overflow-hidden border-4 border-orange-500/30">
              <Image src="/seblak_bowl.png" alt="Seblak RR" fill className="object-cover" priority />
            </div>
          </div>

          {/* Floating: Status Pesanan */}
          <motion.div animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            className={`absolute top-4 right-0 md:-right-4 border rounded-2xl p-4 shadow-xl backdrop-blur-md ${floatCard}`}>
            <p className={`text-xs font-bold mb-2 ${floatTitle}`}>📋 Status Pesanan</p>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <p className="text-green-400 text-[11px]">✓ Pesanan Diterima</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                <p className="text-orange-400 text-[11px]">🔥 Sedang Dimasak</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-zinc-400" />
                <p className={`text-[11px] ${floatSub}`}>⏳ Siap Diambil</p>
              </div>
            </div>
          </motion.div>

          {/* Floating: No Antrian */}
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut", delay: 0.5 }}
            className={`absolute bottom-12 left-0 md:-left-4 border rounded-2xl p-4 shadow-xl backdrop-blur-md ${floatCard}`}>
            <p className={`text-xs font-bold mb-1 ${floatTitle}`}>🎟 No. Antrian</p>
            <p className={`text-3xl font-extrabold ${heading}`}>#1257</p>
            <p className={`text-[10px] mt-1 ${floatSub}`}>Estimasi: 11–20 menit</p>
          </motion.div>

          {/* Floating: Poin */}
          <motion.div animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 2.8, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-0 right-4 bg-orange-600 rounded-2xl px-4 py-2.5 shadow-lg shadow-orange-900/40">
            <p className="text-white text-sm font-bold">🪙 720 Poin Saya</p>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className={`absolute bottom-0 left-0 right-0 h-24 ${bottomWave}`} />
    </section>
  )
}
