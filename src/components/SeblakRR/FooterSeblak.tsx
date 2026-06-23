"use client"
import { Flame } from "lucide-react"
import { useTheme } from "@/context/theme"

export default function FooterSeblak() {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  const bg = isDark ? "bg-[#080200] border-white/5" : "bg-white border-orange-100"
  const brandText = isDark ? "text-white" : "text-zinc-900"
  const tagline = isDark ? "text-zinc-600" : "text-zinc-400"
  const link = isDark ? "text-zinc-500 hover:text-orange-400" : "text-zinc-500 hover:text-orange-500"
  const divider = isDark ? "text-zinc-700" : "text-zinc-300"
  const copy = isDark ? "text-zinc-700" : "text-zinc-400"
  const borderTop = isDark ? "border-white/5" : "border-orange-100"

  return (
    <footer className={`border-t py-10 transition-colors duration-300 ${bg}`}>
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-md">
              <Flame className="w-4 h-4 text-white" />
            </div>
            <span className="text-2xl font-extrabold">
              <span className={brandText}>Seblak</span>
              <span className="text-orange-500">RR</span>
            </span>
            <span className={`text-sm ml-1 ${tagline}`}>– Bikin Menunggu Jadi Momen yang Berharga!</span>
          </div>

          {/* Contact */}
          <div className="flex flex-col sm:flex-row items-center gap-4 text-sm">
            <a href="https://instagram.com/seblakrr" className={`transition-colors flex items-center gap-1 ${link}`}>
              📸 @seblakrr
            </a>
            <span className={`hidden sm:block ${divider}`}>|</span>
            <a href="tel:+6281234567890" className={`transition-colors flex items-center gap-1 ${link}`}>
              📞 0812-3456-7890
            </a>
            <span className={`hidden sm:block ${divider}`}>|</span>
            <a href="https://www.seblakrr.com" className={`transition-colors flex items-center gap-1 ${link}`}>
              🌐 www.seblakrr.com
            </a>
          </div>
        </div>

        <div className={`mt-6 pt-6 border-t text-center ${borderTop}`}>
          <p className={`text-xs ${copy}`}>
            © 2025 SeblakRR. All rights reserved. Made with 🔥 for the best seblak experience.
          </p>
        </div>
      </div>
    </footer>
  )
}
