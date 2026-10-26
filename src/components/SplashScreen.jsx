import { useState, useEffect } from 'react'
import { sounds } from '../sounds'

export default function SplashScreen({ onStart }) {
  const [blink, setBlink] = useState(true)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80)
    const b = setInterval(() => setBlink(v => !v), 550)
    return () => { clearTimeout(t); clearInterval(b) }
  }, [])

  return (
    <div
      className={`min-h-screen bg-[#0f172a] font-mono flex flex-col transition-opacity duration-500 ${visible ? 'opacity-100' : 'opacity-0'}`}
      style={{
        background: 'radial-gradient(ellipse at 50% 30%, #0f2040 0%, #0f172a 60%)',
      }}
    >
      {/* Scanline texture */}
      <div className="fixed inset-0 pointer-events-none" style={{
        background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.04) 3px, rgba(0,0,0,0.04) 6px)',
        zIndex: 0,
      }} />

      <div className="relative z-10 flex flex-col min-h-screen px-8 md:px-16 py-10">
        {/* Top label */}
        <div className="text-center text-slate-600 tracking-[0.5em] text-sm uppercase mb-6">
          Time Detective Agency — Classified Mission
        </div>

        {/* Giant title */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="relative w-full text-center mb-4 select-none">
            {/* Shadow/glitch layer */}
            <div className="absolute inset-0 pointer-events-none" style={{ animation: 'glitch 3s infinite' }}>
              <div className="text-red-500/20 font-black leading-none"
                style={{ fontSize: 'clamp(4rem, 12vw, 10rem)', letterSpacing: '-0.02em' }}>
                CIVIL WAR
              </div>
              <div className="text-red-500/20 font-black leading-none"
                style={{ fontSize: 'clamp(4rem, 12vw, 10rem)', letterSpacing: '-0.02em' }}>
                REBOOT
              </div>
            </div>

            <h1 className="font-black leading-none neon-cyan text-cyan-400"
              style={{ fontSize: 'clamp(4rem, 12vw, 10rem)', letterSpacing: '-0.02em' }}>
              CIVIL WAR
            </h1>
            <h1 className="font-black leading-none neon-gold text-amber-400"
              style={{ fontSize: 'clamp(4rem, 12vw, 10rem)', letterSpacing: '-0.02em' }}>
              REBOOT
            </h1>
          </div>

          <p className="text-slate-400 text-xl md:text-2xl tracking-widest text-center mb-12">
            FIX THE GLITCHES &nbsp;·&nbsp; RESTORE THE TIMELINE &nbsp;·&nbsp; UNCOVER HISTORY
          </p>

          {/* Mission briefing — wide card */}
          <div
            className="w-full max-w-5xl border border-slate-700 rounded-2xl p-8 mb-10"
            style={{ background: 'rgba(15,23,42,0.8)', backdropFilter: 'blur(4px)' }}
          >
            <div className="text-amber-400 text-sm font-bold tracking-widest mb-4 flex items-center gap-2">
              <span className="animate-flicker">⚠</span> MISSION BRIEFING
            </div>

            <p className="text-slate-300 text-lg md:text-xl leading-relaxed mb-8">
              Modern technology is <span className="text-red-400 font-bold">glitching</span>. Smartphones, GPS maps,
              legal documents — all corrupted by a rip in the timeline. Your mission: travel back to
              post-Civil War America, <span className="text-cyan-400 font-bold">solve 5 historical puzzles</span>,
              and restore history before it's lost forever.
            </p>

            <div className="grid grid-cols-3 gap-6">
              <div className="text-center border border-cyan-500/30 rounded-xl p-5 bg-cyan-500/5">
                <div className="text-cyan-400 font-black mb-1" style={{ fontSize: 'clamp(2rem, 5vw, 4rem)' }}>5</div>
                <div className="text-slate-400 text-base tracking-wider">Levels</div>
              </div>
              <div className="text-center border border-amber-500/30 rounded-xl p-5 bg-amber-500/5">
                <div className="text-amber-400 font-black mb-1" style={{ fontSize: 'clamp(2rem, 5vw, 4rem)' }}>550</div>
                <div className="text-slate-400 text-base tracking-wider">Max Points</div>
              </div>
              <div className="text-center border border-purple-500/30 rounded-xl p-5 bg-purple-500/5">
                <div className="text-purple-400 font-black mb-1" style={{ fontSize: 'clamp(2rem, 5vw, 4rem)' }}>4</div>
                <div className="text-slate-400 text-base tracking-wider">Ranks</div>
              </div>
            </div>
          </div>

          {/* Press Start */}
          <button
            onClick={() => { sounds.success(); onStart() }}
            className={`
              border-2 border-cyan-400 text-cyan-400 font-black rounded-2xl
              hover:bg-cyan-400/10 active:scale-95 transition-all
              tracking-[0.3em] uppercase
              ${blink ? 'opacity-100' : 'opacity-30'}
            `}
            style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.8rem)', padding: '1.2rem 4rem' }}
          >
            ▶ &nbsp; PRESS START
          </button>
        </div>

        <div className="text-center text-slate-700 text-sm tracking-widest mt-8">
          HISTORY IS IN YOUR HANDS, DETECTIVE
        </div>
      </div>
    </div>
  )
}
