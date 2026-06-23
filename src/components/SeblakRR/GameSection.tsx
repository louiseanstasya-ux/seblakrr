"use client"
import { useEffect, useRef, useState, useCallback } from "react"
import { useTheme } from "@/context/theme"
import { useAppDispatch } from "@/hook/redux"
import { tambahPoin } from "@/store/reducer/user"

// ─── Types ────────────────────────────────────────────────────────────────────

type ItemType = "ingredient" | "obstacle"

interface FallingItem {
  id: number
  x: number       // % of game area width (0–100)
  y: number       // px from top
  type: ItemType
  emoji: string
  speed: number   // px per tick
}

type GameStatus = "idle" | "running" | "finished"

// ─── Constants ────────────────────────────────────────────────────────────────

const INGREDIENTS = ["🍘", "🍡", "🥚", "🍗", "🍜", "🥟"]
const OBSTACLES   = ["🪨", "💣"]

const GAME_DURATION  = 60   // seconds
const SPAWN_INTERVAL = 1200 // ms
const TICK_MS        = 30   // ms per physics tick (~33 fps)
const BOWL_WIDTH_PX  = 80
const GAME_HEIGHT    = 400  // px
const BOWL_Y_OFFSET  = 48   // px from bottom where bowl sits

// ─── Helpers ──────────────────────────────────────────────────────────────────

let nextId = 1

function spawnItem(elapsed: number): FallingItem {
  const isObstacle = Math.random() < 0.2
  const emoji = isObstacle
    ? OBSTACLES[Math.floor(Math.random() * OBSTACLES.length)]
    : INGREDIENTS[Math.floor(Math.random() * INGREDIENTS.length)]

  // Speed increases every 15 seconds
  const speedMultiplier = 1 + Math.floor(elapsed / 15) * 0.25
  const baseSpeed = 2.5 + Math.random() * 1.5

  return {
    id: nextId++,
    x: 5 + Math.random() * 90, // 5–95% so it doesn't clip edges
    y: -40,
    type: isObstacle ? "obstacle" : "ingredient",
    emoji,
    speed: baseSpeed * speedMultiplier,
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function GameSection() {
  const { theme } = useTheme()
  const dispatch   = useAppDispatch()
  const isDark     = theme === "dark"

  // Game area ref for width measurement
  const gameAreaRef = useRef<HTMLDivElement>(null)

  // Game state stored in refs to avoid stale closures in intervals
  const statusRef      = useRef<GameStatus>("idle")
  const scoreRef       = useRef(0)
  const timerRef       = useRef(GAME_DURATION)
  const bowlXRef       = useRef(50)   // % of game area width
  const itemsRef       = useRef<FallingItem[]>([])
  const elapsedRef     = useRef(0)    // seconds elapsed
  const pointFlashRef  = useRef<{ id: number; x: number; y: number; points: number }[]>([])

  // Reactive UI state (only update what needs to re-render)
  const [status,      setStatus]      = useState<GameStatus>("idle")
  const [score,       setScore]       = useState(0)
  const [timeLeft,    setTimeLeft]    = useState(GAME_DURATION)
  const [bowlX,       setBowlX]       = useState(50)
  const [items,       setItems]       = useState<FallingItem[]>([])
  const [pointFlash,  setPointFlash]  = useState<{ id: number; x: number; y: number; points: number }[]>([])
  const [claimed,     setClaimed]     = useState(false)
  const [finalScore,  setFinalScore]  = useState(0)

  // Interval handles
  const physicsTimer = useRef<ReturnType<typeof setInterval> | null>(null)
  const countdownTimer = useRef<ReturnType<typeof setInterval> | null>(null)
  const spawnTimer   = useRef<ReturnType<typeof setInterval> | null>(null)

  // Touch tracking
  const touchStartX  = useRef<number | null>(null)

  // ── Cleanup ────────────────────────────────────────────────────────────────

  const clearAllTimers = useCallback(() => {
    if (physicsTimer.current)  clearInterval(physicsTimer.current)
    if (countdownTimer.current) clearInterval(countdownTimer.current)
    if (spawnTimer.current)    clearInterval(spawnTimer.current)
    physicsTimer.current  = null
    countdownTimer.current = null
    spawnTimer.current    = null
  }, [])

  // ── End game ───────────────────────────────────────────────────────────────

  const endGame = useCallback(() => {
    clearAllTimers()
    statusRef.current = "finished"
    setStatus("finished")
    setFinalScore(scoreRef.current)
    setClaimed(false)
  }, [clearAllTimers])

  // ── Physics tick ───────────────────────────────────────────────────────────

  const runPhysics = useCallback(() => {
    if (statusRef.current !== "running") return

    const gameAreaWidth = gameAreaRef.current?.clientWidth ?? 400
    const bowlPx = (bowlXRef.current / 100) * gameAreaWidth
    const catchZoneY = GAME_HEIGHT - BOWL_Y_OFFSET - 24 // item center when overlapping bowl

    let newScore = scoreRef.current
    const flashes: typeof pointFlash = []
    const flashCleanupIds: number[] = []

    const updatedItems: FallingItem[] = []

    for (const item of itemsRef.current) {
      const newY = item.y + item.speed

      // Convert item x% to px
      const itemPx = (item.x / 100) * gameAreaWidth

      // Collision check: item center within bowl range, at bowl Y level
      const withinX = Math.abs(itemPx - bowlPx) < BOWL_WIDTH_PX / 2 + 16
      const atBowlY = newY >= catchZoneY && newY <= catchZoneY + item.speed + 10

      if (withinX && atBowlY) {
        // Caught!
        if (item.type === "ingredient") {
          newScore = newScore + 1
          flashes.push({ id: item.id, x: item.x, y: newY, points: +1 })
        } else {
          newScore = Math.max(0, newScore - 1)
          flashes.push({ id: item.id, x: item.x, y: newY, points: -1 })
        }
        flashCleanupIds.push(item.id)
        continue // remove item (caught)
      }

      // Off-screen check
      if (newY > GAME_HEIGHT + 40) {
        continue // remove item (missed)
      }

      updatedItems.push({ ...item, y: newY })
    }

    itemsRef.current = updatedItems
    scoreRef.current = newScore

    // Schedule flash removal
    if (flashes.length > 0) {
      pointFlashRef.current = [...pointFlashRef.current, ...flashes]
      setPointFlash([...pointFlashRef.current])
      setTimeout(() => {
        pointFlashRef.current = pointFlashRef.current.filter(
          f => !flashCleanupIds.includes(f.id)
        )
        setPointFlash([...pointFlashRef.current])
      }, 600)
    }

    setScore(newScore)
    setItems([...updatedItems])
  }, [])

  // ── Start game ─────────────────────────────────────────────────────────────

  const startGame = useCallback(() => {
    clearAllTimers()

    // Reset all refs
    scoreRef.current  = 0
    timerRef.current  = GAME_DURATION
    bowlXRef.current  = 50
    itemsRef.current  = []
    elapsedRef.current = 0
    pointFlashRef.current = []
    nextId = 1
    statusRef.current = "running"

    // Reset UI state
    setScore(0)
    setTimeLeft(GAME_DURATION)
    setBowlX(50)
    setItems([])
    setPointFlash([])
    setClaimed(false)
    setStatus("running")

    // Physics tick
    physicsTimer.current = setInterval(runPhysics, TICK_MS)

    // Spawn items
    spawnTimer.current = setInterval(() => {
      if (statusRef.current !== "running") return
      const newItem = spawnItem(elapsedRef.current)
      itemsRef.current = [...itemsRef.current, newItem]
      setItems([...itemsRef.current])
    }, SPAWN_INTERVAL)

    // Countdown
    countdownTimer.current = setInterval(() => {
      if (statusRef.current !== "running") return
      timerRef.current  -= 1
      elapsedRef.current += 1
      setTimeLeft(timerRef.current)
      if (timerRef.current <= 0) {
        endGame()
      }
    }, 1000)
  }, [clearAllTimers, runPhysics, endGame])

  // ── Keyboard controls ──────────────────────────────────────────────────────

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (statusRef.current !== "running") return
      const step = 5
      if (e.key === "ArrowLeft") {
        bowlXRef.current = Math.max(5, bowlXRef.current - step)
        setBowlX(bowlXRef.current)
      } else if (e.key === "ArrowRight") {
        bowlXRef.current = Math.min(95, bowlXRef.current + step)
        setBowlX(bowlXRef.current)
      }
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [])

  // ── Touch controls ─────────────────────────────────────────────────────────

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }, [])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (statusRef.current !== "running") return
    const gameAreaWidth = gameAreaRef.current?.clientWidth ?? 400
    const touch = e.touches[0]
    const rect  = gameAreaRef.current?.getBoundingClientRect()
    if (!rect) return
    const relX = touch.clientX - rect.left
    const pct  = Math.min(95, Math.max(5, (relX / gameAreaWidth) * 100))
    bowlXRef.current = pct
    setBowlX(pct)
  }, [])

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (statusRef.current !== "running") return
    if (touchStartX.current === null) return
    const dx = e.changedTouches[0].clientX - touchStartX.current
    if (Math.abs(dx) < 10) {
      // Tap — move toward tap location
      const gameAreaWidth = gameAreaRef.current?.clientWidth ?? 400
      const rect = gameAreaRef.current?.getBoundingClientRect()
      if (!rect) return
      const relX = e.changedTouches[0].clientX - rect.left
      const pct  = Math.min(95, Math.max(5, (relX / gameAreaWidth) * 100))
      bowlXRef.current = pct
      setBowlX(pct)
    }
    touchStartX.current = null
  }, [])

  // ── Claim points ───────────────────────────────────────────────────────────

  const claimPoints = useCallback(() => {
    if (finalScore > 0) {
      dispatch(tambahPoin(finalScore))
    }
    setClaimed(true)
  }, [dispatch, finalScore])

  // ── Cleanup on unmount ────────────────────────────────────────────────────

  useEffect(() => {
    return () => clearAllTimers()
  }, [clearAllTimers])

  // ── Derived ────────────────────────────────────────────────────────────────

  const timerColor =
    timeLeft > 20 ? "text-green-400" : timeLeft > 10 ? "text-yellow-400" : "text-red-400"

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <section
      id="game"
      className={`py-16 px-4 transition-colors duration-300 ${
        isDark ? "bg-[#0d0400]" : "bg-orange-50"
      }`}
    >
      <div className="max-w-xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-orange-500/20 border border-orange-500/30 rounded-full px-4 py-1.5 mb-4">
            <span className="text-sm font-semibold text-orange-400">🪙 Kumpulkan Poin!</span>
          </div>
          <h2
            className={`text-3xl md:text-4xl font-bold mb-3 ${
              isDark ? "text-white" : "text-zinc-900"
            }`}
          >
            Main Game 🎮
          </h2>
          <p className={`text-sm md:text-base ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
            Tangkap bahan seblak, hindari rintangan. Poin akan otomatis masuk ke akun kamu!
          </p>
        </div>

        {/* Game Card */}
        <div
          className={`rounded-2xl overflow-hidden shadow-2xl border ${
            isDark
              ? "bg-[#1a0800] border-orange-900/40"
              : "bg-white border-orange-200"
          }`}
        >
          {/* Scoreboard */}
          <div
            className={`flex items-center justify-between px-5 py-3 border-b ${
              isDark ? "border-orange-900/40 bg-[#120500]" : "border-orange-100 bg-orange-50"
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">🪙</span>
              <span className={`font-bold text-xl ${isDark ? "text-orange-400" : "text-orange-600"}`}>
                {score}
              </span>
              <span className={`text-sm ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>poin</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-lg">⏱️</span>
              <span className={`font-bold text-xl font-mono ${timerColor}`}>
                {String(Math.floor(timeLeft / 60)).padStart(2, "0")}:
                {String(timeLeft % 60).padStart(2, "0")}
              </span>
            </div>
          </div>

          {/* Game Area */}
          <div
            ref={gameAreaRef}
            className="relative w-full select-none overflow-hidden"
            style={{ height: GAME_HEIGHT, background: isDark ? "#0d0400" : "#fff7ed", cursor: "none" }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Background decoration */}
            <div className="absolute inset-0 opacity-5 pointer-events-none"
              style={{
                backgroundImage: "radial-gradient(circle, #f97316 1px, transparent 1px)",
                backgroundSize: "30px 30px"
              }}
            />

            {/* Falling Items */}
            {items.map(item => (
              <div
                key={item.id}
                className="absolute select-none pointer-events-none transition-none"
                style={{
                  left: `${item.x}%`,
                  top: item.y,
                  transform: "translate(-50%, -50%)",
                  fontSize: 28,
                  lineHeight: 1,
                  filter: item.type === "obstacle" ? "drop-shadow(0 0 6px #ef4444)" : "drop-shadow(0 0 4px #f97316)",
                }}
              >
                {item.emoji}
              </div>
            ))}

            {/* Point Flash */}
            {pointFlash.map(f => (
              <div
                key={`flash-${f.id}`}
                className="absolute pointer-events-none font-bold text-lg animate-bounce"
                style={{
                  left: `${f.x}%`,
                  top: f.y,
                  transform: "translate(-50%, -100%)",
                  color: f.points > 0 ? "#4ade80" : "#f87171",
                  textShadow: "0 0 8px currentColor",
                  zIndex: 20,
                }}
              >
                {f.points > 0 ? `+${f.points}` : f.points}
              </div>
            ))}

            {/* Bowl */}
            {status === "running" && (
              <div
                className="absolute pointer-events-none transition-none"
                style={{
                  left: `${bowlX}%`,
                  bottom: BOWL_Y_OFFSET - 20,
                  transform: "translateX(-50%)",
                  fontSize: 40,
                  lineHeight: 1,
                  filter: "drop-shadow(0 4px 8px rgba(249,115,22,0.6))",
                  zIndex: 10,
                }}
              >
                🍲
              </div>
            )}

            {/* Idle overlay */}
            {status === "idle" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/50 backdrop-blur-sm z-30">
                <div className="text-6xl animate-bounce">🍲</div>
                <p className={`text-lg font-semibold ${isDark ? "text-white" : "text-zinc-100"}`}>
                  Siap tangkap bahan seblak?
                </p>
                <button
                  onClick={startGame}
                  className="mt-2 px-8 py-3 rounded-full bg-orange-500 hover:bg-orange-400 active:scale-95 text-white font-bold text-lg shadow-lg shadow-orange-500/40 transition-all"
                >
                  Mulai Game 🚀
                </button>
              </div>
            )}

            {/* Finished overlay */}
            {status === "finished" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/60 backdrop-blur-sm z-30 p-6">
                <div className="text-5xl">🏆</div>
                <h3 className="text-white text-2xl font-bold text-center">
                  Game Selesai!
                </h3>
                <div className={`rounded-2xl px-8 py-4 text-center shadow-xl ${isDark ? "bg-[#1a0800] border border-orange-800" : "bg-white border border-orange-200"}`}>
                  <p className={`text-sm mb-1 ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>Total Poin Kamu</p>
                  <p className="text-4xl font-black text-orange-400">
                    {finalScore} <span className="text-2xl">🪙</span>
                  </p>
                </div>

                {!claimed ? (
                  <button
                    onClick={claimPoints}
                    className="mt-2 px-8 py-3 rounded-full bg-orange-500 hover:bg-orange-400 active:scale-95 text-white font-bold text-lg shadow-lg shadow-orange-500/40 transition-all"
                  >
                    {finalScore > 0 ? "🎁 Klaim Poin!" : "Tutup"}
                  </button>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <p className="text-green-400 font-semibold text-lg">
                      ✅ Poin berhasil diklaim!
                    </p>
                  </div>
                )}

                <button
                  onClick={startGame}
                  className={`px-6 py-2 rounded-full border font-semibold text-sm transition-all active:scale-95 ${
                    isDark
                      ? "border-orange-700 text-orange-300 hover:bg-orange-900/40"
                      : "border-orange-300 text-orange-600 hover:bg-orange-50"
                  }`}
                >
                  🔄 Main Lagi
                </button>
              </div>
            )}
          </div>

          {/* Instructions */}
          <div
            className={`px-5 py-4 text-xs space-y-1 border-t ${
              isDark ? "border-orange-900/40 bg-[#120500] text-zinc-400" : "border-orange-100 bg-orange-50 text-zinc-500"
            }`}
          >
            <p className="font-semibold text-sm mb-2">
              🕹️ <span className={isDark ? "text-zinc-200" : "text-zinc-700"}>Cara Main:</span>
            </p>
            <ul className="space-y-1 list-none">
              <li>⌨️ Keyboard: <kbd className={`px-1 py-0.5 rounded text-xs ${isDark ? "bg-zinc-700 text-zinc-200" : "bg-zinc-200 text-zinc-700"}`}>←</kbd> <kbd className={`px-1 py-0.5 rounded text-xs ${isDark ? "bg-zinc-700 text-zinc-200" : "bg-zinc-200 text-zinc-700"}`}>→</kbd> untuk gerakkan mangkuk</li>
              <li>📱 Mobile: Swipe atau tap kiri/kanan area game</li>
              <li>✅ Tangkap: {INGREDIENTS.join(" ")} → <span className="text-green-400 font-semibold">+1 poin</span></li>
              <li>❌ Hindari: {OBSTACLES.join(" ")} → <span className="text-red-400 font-semibold">-1 poin</span></li>
              <li>⚡ Kecepatan naik setiap 15 detik!</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
