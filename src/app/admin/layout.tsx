"use client"
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ShoppingBag, UtensilsCrossed, ExternalLink, ChevronRight, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@radix-ui/react-tooltip';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard, desc: 'Ringkasan & statistik' },
    { name: 'Pesanan', href: '/admin/orders', icon: ShoppingBag, desc: 'Kelola pesanan masuk' },
    { name: 'Manajemen Menu', href: '/admin/menu', icon: UtensilsCrossed, desc: 'Tambah, edit, hapus menu' },
  ];

  return (
    <div className="flex h-screen bg-[#0d0400] overflow-hidden">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-[#140800] border-r border-orange-900/30 flex flex-col shrink-0 transition-all duration-200 overflow-hidden`}>
        {/* Logo */}
        <div className="p-4 border-b border-orange-900/30">
          <div className={`flex items-center ${sidebarOpen ? 'gap-3' : 'justify-center'}`}>
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-900/50 shrink-0">
              <span className="text-white font-extrabold text-sm">SR</span>
            </div>
            {sidebarOpen && (
              <div>
                <h1 className="text-white font-extrabold text-base leading-tight">SeblakRR</h1>
                <p className="text-orange-500 text-xs font-bold">Admin Panel</p>
              </div>
            )}
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {sidebarOpen && (
            <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest px-3 mb-3">Menu Utama</p>
          )}
          <TooltipProvider delayDuration={0}>
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Tooltip key={item.name}>
                  <TooltipTrigger asChild>
                    <Link
                      href={item.href}
                      className={`flex items-center rounded-xl transition-all group ${
                        sidebarOpen ? 'gap-3 px-4 py-3' : 'justify-center p-3'
                      } ${
                        isActive
                          ? 'bg-orange-600 text-white shadow-lg shadow-orange-900/50'
                          : 'text-zinc-400 hover:bg-orange-500/10 hover:text-orange-400'
                      }`}
                    >
                      <item.icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : 'text-zinc-500 group-hover:text-orange-400'}`} />
                      {sidebarOpen && (
                        <div className="flex-1 min-w-0">
                          <p className={`font-bold text-sm truncate ${isActive ? 'text-white' : ''}`}>{item.name}</p>
                          <p className={`text-[10px] truncate ${isActive ? 'text-orange-200' : 'text-zinc-600'}`}>{item.desc}</p>
                        </div>
                      )}
                      {sidebarOpen && isActive && <ChevronRight className="w-4 h-4 text-white/60 shrink-0" />}
                    </Link>
                  </TooltipTrigger>
                  {!sidebarOpen && (
                    <TooltipContent side="right" className="bg-zinc-800 text-white text-xs border-zinc-700">
                      {item.name}
                    </TooltipContent>
                  )}
                </Tooltip>
              );
            })}
          </TooltipProvider>
        </nav>

        {/* Footer Sidebar */}
        <div className="p-4 border-t border-orange-900/30 space-y-2">
          {sidebarOpen && (
            <>
              <Link
                href="/"
                target="_blank"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-zinc-400 hover:text-orange-400 hover:bg-orange-500/10 transition-all text-sm font-medium group"
              >
                <ExternalLink className="w-4 h-4 group-hover:text-orange-400" />
                Lihat Halaman User
              </Link>
              <div className="px-4 py-2">
                <p className="text-zinc-700 text-[10px]">Seblak RR © 2025 · Simulasi</p>
              </div>
            </>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Top Bar */}
        <div className="sticky top-0 z-10 bg-[#0d0400]/80 backdrop-blur-md border-b border-orange-900/20 px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label={sidebarOpen ? 'Tutup sidebar' : 'Buka sidebar'}
              className="p-2 rounded-lg text-zinc-400 hover:text-orange-400 hover:bg-orange-500/10 transition-colors shrink-0"
            >
              {sidebarOpen
                ? <PanelLeftClose className="w-5 h-5" />
                : <PanelLeftOpen  className="w-5 h-5" />}
            </button>
            <div>
              <p className="text-zinc-500 text-xs">Panel Admin</p>
              <h2 className="text-white font-bold text-sm">
                {navItems.find(n => n.href === pathname)?.name || 'Dashboard'}
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-orange-600/10 border border-orange-500/20 rounded-xl px-3 py-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-green-400 text-xs font-bold">Simulasi Aktif</span>
          </div>
        </div>

        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
