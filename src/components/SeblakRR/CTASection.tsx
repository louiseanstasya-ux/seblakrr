"use client"
import { motion } from "framer-motion"
import { QrCode } from "lucide-react"

export default function CTASection() {
  return (
    <section
      id="cta"
      className="py-24 relative overflow-hidden bg-gradient-to-br from-orange-700 via-red-700 to-orange-900"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-80 h-80 bg-yellow-400 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-red-900 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          {/* QR Icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-white/20 backdrop-blur-md mb-6 border border-white/30">
            <QrCode className="w-10 h-10 text-white" />
          </div>

          <h2 className="text-white text-4xl md:text-6xl font-extrabold leading-tight mb-4">
            Ayo Coba{" "}
            <span className="italic">Sekarang!</span>
          </h2>
          <p className="text-orange-100 text-lg md:text-xl max-w-2xl mx-auto mb-6 leading-relaxed">
            Scan QR di meja dan rasakan sendiri pengalaman menunggu yang lebih seru,
            lebih interaktif, dan penuh hadiah bersama <strong>SeblakRR</strong>!
          </p>

          {/* Step reminder */}
          <div className="inline-flex flex-wrap justify-center gap-2 mb-10 text-sm">
            {["Scan QR", "→", "Pantau Pesanan", "→", "Main Game", "→", "Tukar Reward"].map((s, i) => (
              <span
                key={i}
                className={s === "→" ? "text-orange-300 font-bold" : "bg-white/20 text-white font-semibold px-3 py-1 rounded-full"}
              >
                {s}
              </span>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              href="#menu"
              className="inline-flex items-center justify-center gap-2 bg-white text-orange-700 font-extrabold px-10 py-4 rounded-full shadow-xl text-lg hover:bg-orange-50 transition-colors"
            >
              🔥 Lihat Menu Pesanan
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              href="#alur"
              className="inline-flex items-center justify-center gap-2 border-2 border-white/60 text-white font-bold px-10 py-4 rounded-full hover:bg-white/10 transition-colors text-lg"
            >
              Lihat Alur Kerja
            </motion.a>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            viewport={{ once: true }}
            className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto"
          >
            {[
              { val: "Real-Time", label: "Tracking Pesanan" },
              { val: "6+ Fitur", label: "Interaktif" },
              { val: "4.9★", label: "Rating Pelanggan" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-white text-2xl font-extrabold">{s.val}</p>
                <p className="text-orange-200 text-sm mt-1">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
