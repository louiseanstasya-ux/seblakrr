"use client"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useAppSelector, useAppDispatch } from "@/hook/redux"
import { kurangiPoin } from "@/store/reducer/user"
import { CheckCircle2, X, Gift, Coins } from "lucide-react"
import { useTheme } from "@/context/theme"

const rewards = [
  { name: "Kerupuk",     poin: 250, emoji: "🍘", desc: "Kerupuk renyah favorit" },
  { name: "Telur",       poin: 150, emoji: "🥚", desc: "Tambahan telur gurih" },
  { name: "Bakso",       poin: 250, emoji: "🍡", desc: "Bakso kenyal lezat" },
  { name: "Ceker Ayam",  poin: 250, emoji: "🍗", desc: "Ceker empuk berbumbu" },
  { name: "Mie Instan",  poin: 200, emoji: "🍜", desc: "Mie kenyal ekstra" },
  { name: "Somay",       poin: 150, emoji: "🥟", desc: "Somay lembut kukus" },
  { name: "Sawi",        poin: 150, emoji: "🥬", desc: "Sawi segar bergizi" },
  { name: "Kapas Daean", poin: 300, emoji: "🌿", desc: "Bahan premium pilihan" },
]

const howToEarnPoints = [
  { icon: "⭐", label: "Memberikan Ulasan", sub: "Ulasan jujur = poin bonus" },
  { icon: "🛍️", label: "Setiap Transaksi", sub: "Beli seblak = dapat poin" },
]

interface ConfirmModalProps {
  reward: typeof rewards[0]
  poinUser: number
  onConfirm: () => void
  onCancel: () => void
}

function ConfirmModal({ reward, poinUser, onConfirm, onCancel }: ConfirmModalProps) {
  const cukup = poinUser >= reward.poin
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-[#1a0800] border border-orange-900/40 rounded-2xl p-6 w-full max-w-sm shadow-2xl"
      >
        <div className="text-center mb-4">
          <div className="text-6xl mb-3">{reward.emoji}</div>
          <h3 className="text-white font-extrabold text-xl">{reward.name}</h3>
          <p className="text-zinc-400 text-sm mt-1">{reward.desc}</p>
        </div>

        <div className="bg-[#0d0400] rounded-xl p-4 mb-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-zinc-400">Poin kamu</span>
            <span className="text-orange-400 font-bold">🪙 {poinUser.toLocaleString("id-ID")}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-zinc-400">Biaya tukar</span>
            <span className="text-red-400 font-bold">- 🪙 {reward.poin.toLocaleString("id-ID")}</span>
          </div>
          <div className="border-t border-orange-900/30 pt-2 flex justify-between text-sm">
            <span className="text-zinc-400">Sisa poin</span>
            <span className={`font-bold ${cukup ? "text-green-400" : "text-red-400"}`}>
              🪙 {cukup ? (poinUser - reward.poin).toLocaleString("id-ID") : "Tidak cukup"}
            </span>
          </div>
        </div>

        {!cukup && (
          <p className="text-red-400 text-xs text-center bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2 mb-4">
            Poin kamu tidak cukup untuk menukar reward ini.
          </p>
        )}

        <div className="flex gap-3">
          <button
            onClick={onConfirm}
            disabled={!cukup}
            className={`flex-1 font-bold py-2.5 rounded-xl transition-all text-sm ${
              cukup
                ? "bg-orange-600 hover:bg-orange-500 text-white"
                : "bg-zinc-800 text-zinc-600 cursor-not-allowed"
            }`}
          >
            Tukar Sekarang
          </button>
          <button
            onClick={onCancel}
            className="flex-1 bg-white/5 hover:bg-white/10 text-zinc-300 font-bold py-2.5 rounded-xl transition-all border border-white/10 text-sm"
          >
            Batal
          </button>
        </div>
      </motion.div>
    </div>
  )
}

interface SuccessModalProps {
  reward: typeof rewards[0]
  sisaPoin: number
  onClose: () => void
}

function SuccessModal({ reward, sisaPoin, onClose }: SuccessModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="bg-[#1a0800] border border-green-900/40 rounded-2xl p-6 w-full max-w-sm shadow-2xl text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: "spring" }}
          className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <CheckCircle2 className="w-8 h-8 text-green-400" />
        </motion.div>
        <h3 className="text-white font-extrabold text-xl mb-1">Berhasil Ditukar!</h3>
        <p className="text-zinc-400 text-sm mb-4">
          <span className="text-2xl">{reward.emoji}</span> <strong className="text-white">{reward.name}</strong> telah ditambahkan ke pesananmu.
        </p>
        <div className="bg-[#0d0400] rounded-xl px-4 py-3 mb-5">
          <p className="text-zinc-400 text-xs">Sisa poin kamu</p>
          <p className="text-orange-400 font-extrabold text-2xl">🪙 {sisaPoin.toLocaleString("id-ID")}</p>
        </div>
        <p className="text-zinc-500 text-xs mb-4">
          Tunjukkan konfirmasi ini ke kasir untuk mendapatkan bahan tambahanmu.
        </p>
        <button
          onClick={onClose}
          className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-2.5 rounded-xl transition-all"
        >
          Oke, Mengerti!
        </button>
      </motion.div>
    </div>
  )
}

export default function RewardCatalog() {
  const dispatch = useAppDispatch()
  const { poin, nama } = useAppSelector(state => state.user)
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const [mounted, setMounted] = useState(false)
  const [confirmReward, setConfirmReward] = useState<typeof rewards[0] | null>(null)
  const [successReward, setSuccessReward] = useState<{ reward: typeof rewards[0]; sisaPoin: number } | null>(null)

  useEffect(() => { setMounted(true) }, [])

  const bg = isDark ? "bg-[#130600]" : "bg-amber-50"
  const heading = isDark ? "text-white" : "text-zinc-900"
  const sub = isDark ? "text-zinc-400" : "text-zinc-500"
  const badgeBg = isDark ? "bg-orange-600/15 border-orange-500/30" : "bg-orange-100 border-orange-300"
  const badgeLabel = isDark ? "text-zinc-400" : "text-zinc-500"
  const earnBg = isDark ? "bg-white/5 border-white/10" : "bg-white border-orange-100 shadow-sm"
  const earnTitle = isDark ? "text-white" : "text-zinc-800"
  const earnSub = isDark ? "text-zinc-500" : "text-zinc-500"
  const infoBg = isDark ? "bg-orange-900/20 border-orange-500/20" : "bg-orange-50 border-orange-200"
  const infoText = isDark ? "text-zinc-400" : "text-zinc-600"

  const handleTukar = () => {
    if (!confirmReward) return
    dispatch(kurangiPoin(confirmReward.poin))
    const sisa = Math.max(0, poin - confirmReward.poin)
    setConfirmReward(null)
    setSuccessReward({ reward: confirmReward, sisaPoin: sisa })
  }

  return (
    <section id="reward" className={`py-24 transition-colors duration-300 ${bg}`}>
      {/* Modals */}
      <AnimatePresence>
        {confirmReward && (
          <ConfirmModal
            reward={confirmReward}
            poinUser={poin}
            onConfirm={handleTukar}
            onCancel={() => setConfirmReward(null)}
          />
        )}
        {successReward && (
          <SuccessModal
            reward={successReward.reward}
            sisaPoin={successReward.sisaPoin}
            onClose={() => setSuccessReward(null)}
          />
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-4"
        >
          <span className="text-orange-500 text-sm font-bold uppercase tracking-widest">
            🎁 Reward
          </span>
          <h2 className={`${heading} text-4xl md:text-5xl font-extrabold mt-3`}>
            Katalog Reward
          </h2>
          <p className={`${sub} mt-3 max-w-2xl mx-auto leading-relaxed`}>
            Tukar poin dengan berbagai bahan tambahan seblak favoritmu!
          </p>
        </motion.div>

        {/* Poin user badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          viewport={{ once: true }}
          className="flex justify-center mb-8"
        >
          <div className={`flex items-center gap-3 border rounded-2xl px-6 py-3 ${badgeBg}`}>
            <span className="text-2xl">🪙</span>
            <div>
              <p className={`text-xs ${badgeLabel}`}>
                {mounted && nama ? `Poin kamu, ${nama}` : "Poin kamu saat ini"}
              </p>
              <p className="text-orange-400 font-extrabold text-2xl leading-tight">
                {mounted ? poin.toLocaleString("id-ID") : "0"} Poin
              </p>
            </div>
          </div>
        </motion.div>

        {/* How to earn points */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          <p className="text-zinc-500 text-sm w-full text-center mb-2">Cara mendapatkan poin:</p>
          {howToEarnPoints.map((p) => (
            <div key={p.label} className={`flex items-center gap-2 border rounded-full px-4 py-2 ${earnBg}`}>
              <span className="text-xl">{p.icon}</span>
              <div>
                <p className={`text-sm font-semibold ${earnTitle}`}>{p.label}</p>
                <p className={`text-[11px] ${earnSub}`}>{p.sub}</p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
          {rewards.map((item, i) => {
            const bisaTukar = mounted && poin >= item.poin
            return (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                viewport={{ once: true }}
                className={`group border rounded-3xl p-5 flex flex-col items-center text-center transition-all hover:-translate-y-1 ${
                  bisaTukar
                    ? isDark
                      ? "bg-white/5 border-white/10 hover:border-orange-500/40 hover:bg-orange-500/5"
                      : "bg-white border-orange-100 hover:border-orange-400/50 shadow-sm hover:shadow-md"
                    : isDark
                      ? "bg-white/2 border-white/5 opacity-60"
                      : "bg-zinc-50 border-zinc-100 opacity-60"
                }`}
              >
                <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-5xl mb-3 group-hover:scale-105 transition-transform ${isDark ? "bg-orange-900/30" : "bg-orange-100"}`}>
                  {item.emoji}
                </div>
                <h3 className={`font-bold text-base mb-0.5 ${heading}`}>{item.name}</h3>
                <p className={`text-[11px] mb-2 ${sub}`}>{item.desc}</p>
                <p className="text-orange-400 font-extrabold text-lg mb-3">
                  🪙 {item.poin} Poin
                </p>
                <button
                  onClick={() => bisaTukar && setConfirmReward(item)}
                  className={`w-full text-sm font-bold py-2 rounded-xl transition-colors ${
                    bisaTukar
                      ? "bg-orange-600 hover:bg-orange-500 text-white"
                      : isDark ? "bg-zinc-800 text-zinc-600 cursor-not-allowed" : "bg-zinc-200 text-zinc-400 cursor-not-allowed"
                  }`}
                >
                  {bisaTukar ? "Tukar" : mounted ? `Kurang ${item.poin - poin} poin` : "Tukar"}
                </button>
              </motion.div>
            )
          })}
        </div>

        {/* Bottom info */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-10 text-center"
        >
          <div className={`inline-block border rounded-2xl px-6 py-4 ${infoBg}`}>
            <p className="text-orange-300 text-sm font-semibold mb-1">🔄 Cara Penukaran Reward</p>
            <p className={`text-sm ${infoText}`}>
              Pilih reward → Klik <span className="text-orange-400 font-bold">Tukar</span> → Konfirmasi digital →
              Tunjukkan ke kasir → Bahan tambahan langsung masuk ke pesananmu!
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
