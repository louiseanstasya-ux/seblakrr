"use client"
import { useState, useEffect } from "react"
import { Menu, X, Star, Sun, Moon, Flame } from "lucide-react"
import { useAppSelector } from "@/hook/redux"
import { useTheme } from "@/context/theme"

const navLinks = ["Beranda", "Fitur", "Reward", "Ulasan", "Kontak"]

export default function NavbarSeblak() {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { nama, poin } = useAppSelector(state => state.user)
  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = theme === "dark"

  const navBg = isDark
    ? "bg-[#0d0400]/90 border-orange-900/30"
    : "bg-white/90 border-orange-200"

  const linkColor = isDark
    ? "text-zinc-400 hover:text-orange-400"
    : "text-zinc-600 hover:text-orange-500"

  const mobileMenuBg = isDark
    ? "bg-[#0d0400] border-orange-900/30"
    : "bg-white border-orange-200"

  const mobileLinkColor = isDark
    ? "text-zinc-300 hover:text-orange-400"
    : "text-zinc-700 hover:text-orange-500"

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-4 backdrop-blur-md border-b transition-colors duration-300 ${navBg}`}>
      {/* Logo */}
      <a href="/" className="flex items-center gap-2">
        {/* Icon logo */}
        <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-900/30">
          <Flame className="w-4 h-4 text-white" />
        </div>
        <span className="text-2xl font-extrabold">
          <span className={isDark ? "text-white" : "text-zinc-900"}>Seblak</span>
          <span className="text-orange-500">RR</span>
        </span>
      </a>

      {/* Desktop Links */}
      <ul className="hidden md:flex items-center gap-8">
        {navLinks.map((link) => (
          <li key={link}>
            <a
              href={`#${link.toLowerCase()}`}
              className={`text-sm font-medium transition-colors ${linkColor}`}
            >
              {link}
            </a>
          </li>
        ))}
      </ul>

      {/* Right Side */}
      <div className="hidden md:flex items-center gap-3">
        {/* Poin Badge */}
        {mounted && (nama || poin > 0) && (
          <div className={`flex items-center gap-2 border rounded-full px-4 py-2 ${isDark ? "bg-orange-600/15 border-orange-500/30" : "bg-orange-50 border-orange-300"}`}>
            <Star className="w-3.5 h-3.5 text-orange-400" />
            {nama && <span className={`text-xs font-medium ${isDark ? "text-zinc-300" : "text-zinc-700"}`}>{nama}</span>}
            {nama && poin > 0 && <span className={`text-xs ${isDark ? "text-zinc-600" : "text-zinc-400"}`}>·</span>}
            {poin > 0 && (
              <span className="text-orange-400 text-xs font-bold">{poin} Poin</span>
            )}
          </div>
        )}

        {/* Dark/Light toggle */}
        {mounted && (
          <button
            onClick={toggleTheme}
            aria-label="Toggle tema"
            className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all ${
              isDark
                ? "bg-white/5 border-white/10 text-yellow-400 hover:bg-yellow-400/10"
                : "bg-zinc-100 border-zinc-200 text-zinc-600 hover:bg-zinc-200"
            }`}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        )}

        <a
          href="#menu"
          className="flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white px-5 py-2.5 rounded-full font-bold transition-all"
        >
          Lihat Menu 🔥
        </a>
      </div>

      {/* Mobile: toggle + hamburger */}
      <div className="flex items-center gap-2 md:hidden">
        {mounted && (
          <button
            onClick={toggleTheme}
            aria-label="Toggle tema"
            className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all ${
              isDark
                ? "bg-white/5 border-white/10 text-yellow-400"
                : "bg-zinc-100 border-zinc-200 text-zinc-600"
            }`}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        )}
        <button
          className={isDark ? "text-white" : "text-zinc-800"}
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className={`absolute top-full left-0 right-0 border-b flex flex-col gap-4 px-6 py-6 md:hidden transition-colors ${mobileMenuBg}`}>
          {mounted && (nama || poin > 0) && (
            <div className={`flex items-center gap-2 border rounded-xl px-4 py-3 ${isDark ? "bg-orange-600/15 border-orange-500/30" : "bg-orange-50 border-orange-300"}`}>
              <Star className="w-4 h-4 text-orange-400" />
              <div>
                {nama && <p className={`text-sm font-bold ${isDark ? "text-white" : "text-zinc-900"}`}>{nama}</p>}
                <p className="text-orange-400 text-xs font-medium">{poin} Poin Loyalty</p>
              </div>
            </div>
          )}

          {navLinks.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              className={`font-medium transition-colors ${mobileLinkColor}`}
              onClick={() => setOpen(false)}
            >
              {link}
            </a>
          ))}
          <a
            href="#cta"
            className="inline-flex items-center justify-center bg-orange-600 text-white font-bold px-5 py-2.5 rounded-full"
            onClick={() => setOpen(false)}
          >
            Coba Sekarang 🔥
          </a>
        </div>
      )}
    </nav>
  )
}
