import { useState, useEffect, useRef } from 'react'
import { LEVELS } from '../gameData'
import { sounds } from '../sounds'

// Animated number counter using rAF
function useCounter(target, duration = 2000, delay = 600) {
  const [count, setCount] = useState(0)
  const started = useRef(false)

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (started.current) return
      started.current = true
      const startTime = performance.now()
      function step(now) {
        const progress = Math.min((now - startTime) / duration, 1)
        const eased = 1 - Math.pow(1 - progress, 3) // ease-out cubic
        setCount(Math.round(eased * target))
        if (progress < 1) requestAnimationFrame(step)
      }
      requestAnimationFrame(step)
    }, delay)
    return () => clearTimeout(timeout)
  }, [target, duration, delay])

  return count
}

const TAG_STYLES = {
  SOCIETY:    'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50',
  GOVERNMENT: 'bg-purple-500/20 text-purple-400 border border-purple-500/50',
  ECONOMY:    'bg-amber-500/20 text-amber-400 border border-amber-500/50',
}

const RANK_ICONS = {
  'Rookie Inspector': '🔍',
  'Field Agent':      '🕵️',
  'Senior Detective': '⭐',
  'Master Detective': '🏆',
}

// Floating star particles
function Stars() {
  const stars = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 3}s`,
    size: Math.random() > 0.5 ? '1rem' : '0.6rem',
    duration: `${3 + Math.random() * 4}s`,
  }))

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {stars.map(s => (
        <div
          key={s.id}
          className="absolute bottom-0 text-amber-400 opacity-0"
          style={{
            left: s.left,
            fontSize: s.size,
            animationName: 'floatUp',
            animationDuration: s.duration,
            animationDelay: s.delay,
            animationIterationCount: 'infinite',
            animationTimingFunction: 'ease-in',
          }}
        >
          ★
        </div>
      ))}
      <style>{`
        @keyframes floatUp {
          0%   { transform: translateY(0) rotate(0deg); opacity: 0; }
          10%  { opacity: 0.7; }
          90%  { opacity: 0.4; }
          100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
        }
      `}</style>
    </div>
  )
}

export default function VictoryScreen({ score, rank, unlockedClues, onReplay, onSelectLevel }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80)
    sounds.success()
    return () => clearTimeout(t)
  }, [])

  const displayScore      = useCounter(score, 1800, 400)
  const displayCasualties = useCounter(620000, 2400, 800)
  const displayFreed      = useCounter(4000000, 2800, 800)

  return (
    <div
      className={`min-h-screen bg-[#0a0f1e] font-mono flex flex-col transition-opacity duration-700 ${visible ? 'opacity-100' : 'opacity-0'}`}
      style={{ background: 'radial-gradient(ellipse at 50% 0%, #0f2040 0%, #080c18 70%)' }}
    >
      <Stars />

      <div className="relative z-10 flex flex-col items-center px-6 md:px-16 py-10 gap-10">

        {/* ── Hero ───────────────────────────────────────── */}
        <div className="text-center">
          <div className="text-7xl mb-4">🏆</div>
          <h1
            className="font-black neon-gold text-amber-400 tracking-widest leading-tight mb-3"
            style={{ fontSize: 'clamp(2.5rem, 7vw, 6rem)' }}
          >
            TIMELINE RESTORED!
          </h1>
          <p className="text-slate-400 text-xl tracking-wide">
            The Civil War's legacy is secured. History is safe, Detective.
          </p>
        </div>

        {/* ── Score / Rank / Levels ──────────────────────── */}
        <div className="grid grid-cols-3 gap-5 w-full max-w-4xl">
          <div className="border-2 border-amber-500 bg-amber-500/5 rounded-2xl p-6 text-center"
            style={{ boxShadow: '0 0 20px rgba(245,158,11,0.15)' }}>
            <div className="text-xs text-slate-500 tracking-widest uppercase mb-2">Final Score</div>
            <div className="font-black text-amber-400 neon-gold leading-none" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}>
              {displayScore.toLocaleString()}
            </div>
            <div className="text-slate-600 text-sm mt-1">out of 550</div>
          </div>

          <div className="border-2 border-cyan-500 bg-cyan-500/5 rounded-2xl p-6 text-center"
            style={{ boxShadow: '0 0 20px rgba(6,182,212,0.15)' }}>
            <div className="text-xs text-slate-500 tracking-widest uppercase mb-2">Detective Rank</div>
            <div className="text-5xl mb-2">{RANK_ICONS[rank.label]}</div>
            <div className={`text-lg font-black ${rank.color} tracking-wide`}>{rank.label}</div>
          </div>

          <div className="border-2 border-green-500 bg-green-500/5 rounded-2xl p-6 text-center"
            style={{ boxShadow: '0 0 20px rgba(34,197,94,0.15)' }}>
            <div className="text-xs text-slate-500 tracking-widest uppercase mb-2">Levels Completed</div>
            <div className="font-black text-green-400 neon-green leading-none" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}>
              5/5
            </div>
            <div className="text-slate-600 text-sm mt-1">All glitches fixed ✓</div>
          </div>
        </div>

        {/* ── Civil War Stats ────────────────────────────── */}
        <div className="w-full max-w-4xl">
          <div className="text-xs text-slate-600 tracking-[0.4em] uppercase mb-4 text-center">
            ── Civil War By The Numbers ──────────────────────────────────
          </div>
          <div className="grid grid-cols-2 gap-5">
            <div className="border-2 border-red-500/40 bg-red-950/20 rounded-2xl p-6 text-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-5 flex items-center justify-center select-none">
                <span style={{ fontSize: 120 }}>⚔️</span>
              </div>
              <div className="relative">
                <div className="text-xs text-slate-500 tracking-widest uppercase mb-2">Estimated Casualties</div>
                <div className="font-black text-red-400 neon-red leading-none mb-2" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
                  {displayCasualties.toLocaleString()}
                </div>
                <div className="text-slate-500 text-sm">Deadliest conflict in American history</div>
              </div>
            </div>

            <div className="border-2 border-green-500/40 bg-green-950/20 rounded-2xl p-6 text-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-5 flex items-center justify-center select-none">
                <span style={{ fontSize: 120 }}>🕊️</span>
              </div>
              <div className="relative">
                <div className="text-xs text-slate-500 tracking-widest uppercase mb-2">People Freed</div>
                <div className="font-black text-green-400 neon-green leading-none mb-2" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
                  {displayFreed.toLocaleString()}
                </div>
                <div className="text-slate-500 text-sm">Via the 13th Amendment, Dec 6, 1865</div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Evidence Summary ───────────────────────────── */}
        <div className="w-full max-w-4xl">
          <div className="text-xs text-slate-600 tracking-[0.4em] uppercase mb-4 text-center">
            ── Evidence Collected ────────────────────────────────────────
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {LEVELS.map((lvl) => {
              const unlocked = unlockedClues.includes(lvl.id)
              return (
                <div
                  key={lvl.id}
                  className={`rounded-2xl border p-5 flex gap-4 items-start transition-all
                    ${unlocked
                      ? 'border-green-500/30 bg-green-950/15'
                      : 'border-slate-700 opacity-30'
                    }`}
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-full border-2 border-green-500/50 flex items-center justify-center">
                    <span className="text-green-400 font-black text-sm">{lvl.id}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className="text-sm font-black text-white">{lvl.clue.headline}</span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded ${TAG_STYLES[lvl.clue.tag] || ''}`}>
                        {lvl.clue.tag}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">{lvl.clue.body}</p>
                    {unlocked && (
                      <div className="text-xs text-green-500 font-bold mt-2 tracking-wider">✓ Evidence Verified</div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* ── Presentation Pitch ─────────────────────────── */}
        <div className="w-full max-w-4xl border border-slate-700 bg-slate-900/40 rounded-2xl p-6">
          <div className="text-xs text-slate-600 tracking-widest uppercase mb-3">📋 One-Minute Presentation Pitch</div>
          <p className="text-slate-300 text-base leading-relaxed italic">
            "In <span className="text-cyan-400 font-bold not-italic">Civil War Reboot</span>, you act as a time detective
            fixing modern glitched items by solving historical puzzles. It demonstrates how the Civil War's outcome —
            like the 13th Amendment, live press reporting, and the industrial railroad boom —
            <span className="text-amber-400 font-bold not-italic"> directly shapes our everyday lives today.</span>"
          </p>
        </div>

        {/* ── Replay buttons ─────────────────────────────── */}
        <div className="flex flex-col items-center gap-5 pb-8">
          <button
            onClick={() => { sounds.click(); onReplay() }}
            className="px-12 py-4 border-2 border-amber-400 text-amber-400 font-black text-lg rounded-2xl
                       hover:bg-amber-400/10 active:scale-95 transition-all tracking-widest"
            style={{ boxShadow: '0 0 20px rgba(245,158,11,0.2)' }}
          >
            ↺ REPLAY FULL GAME
          </button>

          <div className="flex flex-col items-center gap-2">
            <span className="text-xs text-slate-600 tracking-widest">JUMP TO A LEVEL</span>
            <div className="flex gap-3">
              {LEVELS.map((lvl, i) => (
                <button
                  key={lvl.id}
                  onClick={() => { sounds.click(); onSelectLevel(i) }}
                  className="w-12 h-12 text-sm font-black rounded-xl border-2 border-slate-600 text-slate-400
                             hover:border-cyan-400 hover:text-cyan-400 transition-all active:scale-95"
                  title={lvl.title}
                >
                  L{lvl.id}
                </button>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
