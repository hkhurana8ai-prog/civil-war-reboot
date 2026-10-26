import { useState, useEffect } from 'react'
import { sounds } from '../sounds'

export default function SplashScreen({ onStart }) {
  const [visible, setVisible] = useState(false)
  const [blink, setBlink] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100)
    const b = setInterval(() => setBlink(v => !v), 600)
    return () => { clearTimeout(t); clearInterval(b) }
  }, [])

  function handleStart() {
    sounds.success()
    onStart()
  }

  return (
    <div className={`min-h-screen bg-[#0f172a] flex flex-col items-center justify-center font-mono transition-opacity duration-700 ${visible ? 'opacity-100' : 'opacity-0'}`}>
      {/* Scanlines overlay */}
      <div className="fixed inset-0 pointer-events-none" style={{
        background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.06) 2px, rgba(0,0,0,0.06) 4px)'
      }} />

      {/* Top label */}
      <div className="text-[10px] tracking-[0.4em] text-slate-600 mb-6 uppercase">
        Time Detective Agency — Classified Mission
      </div>

      {/* Main title */}
      <div className="relative mb-2 select-none">
        <h1 className="text-5xl md:text-6xl font-black tracking-widest text-cyan-400 neon-cyan px-2">
          CIVIL WAR
        </h1>
        <h1 className="text-5xl md:text-6xl font-black tracking-widest text-amber-400 neon-gold px-2">
          REBOOT
        </h1>
        {/* Glitch overlay */}
        <div className="absolute inset-0 animate-glitch pointer-events-none opacity-20 text-red-400">
          <div className="text-5xl md:text-6xl font-black tracking-widest px-2">CIVIL WAR</div>
          <div className="text-5xl md:text-6xl font-black tracking-widest px-2">REBOOT</div>
        </div>
      </div>

      {/* Subtitle */}
      <p className="text-slate-400 text-sm tracking-widest mb-10 text-center px-4">
        FIX THE GLITCHES · RESTORE THE TIMELINE · UNCOVER HISTORY
      </p>

      {/* Mission brief */}
      <div className="border border-slate-700 bg-slate-800/40 rounded-lg p-5 max-w-md w-full mx-4 mb-10">
        <div className="text-[10px] font-bold text-amber-400 tracking-widest mb-3">⚠ MISSION BRIEFING</div>
        <p className="text-slate-300 text-xs leading-relaxed">
          Modern technology is glitching. Smartphones, GPS maps, legal documents —
          all corrupted by a rip in the timeline. Your mission: travel back to
          post-Civil War America, solve 5 historical puzzles, and restore history
          before it's lost forever.
        </p>
        <div className="mt-3 grid grid-cols-3 gap-2 text-[10px]">
          <div className="text-center border border-cyan-500/30 rounded p-1.5">
            <div className="text-cyan-400 font-bold text-lg">5</div>
            <div className="text-slate-500">Levels</div>
          </div>
          <div className="text-center border border-amber-500/30 rounded p-1.5">
            <div className="text-amber-400 font-bold text-lg">550</div>
            <div className="text-slate-500">Max Points</div>
          </div>
          <div className="text-center border border-purple-500/30 rounded p-1.5">
            <div className="text-purple-400 font-bold text-lg">4</div>
            <div className="text-slate-500">Ranks</div>
          </div>
        </div>
      </div>

      {/* Press start */}
      <button
        onClick={handleStart}
        className={`px-10 py-3 border-2 border-cyan-400 text-cyan-400 font-bold text-sm tracking-[0.3em] rounded
                    hover:bg-cyan-400/10 transition-all active:scale-95 border-neon-cyan
                    ${blink ? 'opacity-100' : 'opacity-40'}`}
      >
        ▶ PRESS START
      </button>

      {/* Footer */}
      <div className="absolute bottom-6 text-[10px] text-slate-700 tracking-widest">
        HISTORY IS IN YOUR HANDS, DETECTIVE
      </div>
    </div>
  )
}
