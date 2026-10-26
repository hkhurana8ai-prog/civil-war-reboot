import { useState, useEffect, useRef, useCallback } from 'react'
import { sounds } from '../../sounds'

const PIECES = [
  { id: 'ny', name: 'New York',      icon: '🗽', side: 'left'  },
  { id: 'va', name: 'Virginia',      icon: '🏛️', side: 'left'  },
  { id: 'oh', name: 'Ohio',          icon: '🌽', side: 'left'  },
  { id: 'fl', name: 'Florida',       icon: '🌴', side: 'left'  },
  { id: 'tx', name: 'Texas',         icon: '⭐', side: 'right' },
  { id: 'il', name: 'Illinois',      icon: '🏙️', side: 'right' },
  { id: 'ga', name: 'Georgia',       icon: '🍑', side: 'right' },
  { id: 'ma', name: 'Massachusetts', icon: '🎓', side: 'right' },
]

const TIME_LIMIT   = 15
const MAX_ATTEMPTS = 3

// SVG timer ring: r=42, circumference ≈ 264
const CIRC = 2 * Math.PI * 42

export default function Level5Map({ isSolved, onSolved }) {
  const [inShield,    setInShield]    = useState(new Set())
  const [timeLeft,    setTimeLeft]    = useState(TIME_LIMIT)
  const [attempts,    setAttempts]    = useState(0)
  const [phase,       setPhase]       = useState('playing')   // 'playing'|'between'|'hint'|'free'|'won'
  const [dragId,      setDragId]      = useState(null)
  const [shieldOver,  setShieldOver]  = useState(false)
  const [localSolved, setLocalSolved] = useState(false)
  const [justPlaced,  setJustPlaced]  = useState(null)

  const onSolvedRef = useRef(onSolved)
  useEffect(() => { onSolvedRef.current = onSolved }, [onSolved])

  // Countdown tick
  useEffect(() => {
    if (phase !== 'playing') return
    const id = setInterval(() => setTimeLeft(t => Math.max(0, t - 1)), 1000)
    return () => clearInterval(id)
  }, [phase])

  // Low-time sound
  useEffect(() => {
    if (phase === 'playing' && timeLeft > 0 && timeLeft <= 5) sounds.tick()
  }, [timeLeft, phase])

  // Timeout handler
  useEffect(() => {
    if (phase !== 'playing' || timeLeft > 0) return
    sounds.error()
    const next = attempts + 1
    setAttempts(next)
    if (next >= MAX_ATTEMPTS) {
      setPhase('hint')
    } else {
      setPhase('between')
      setTimeout(() => {
        setInShield(new Set())
        setTimeLeft(TIME_LIMIT)
        setPhase('playing')
      }, 2200)
    }
  }, [timeLeft, phase, attempts])

  const handleDrop = useCallback(() => {
    setShieldOver(false)
    if (!dragId || phase === 'won') return
    sounds.click()
    setJustPlaced(dragId)
    setTimeout(() => setJustPlaced(null), 300)

    setInShield(prev => {
      const next = new Set(prev)
      next.add(dragId)
      if (next.size === PIECES.length) {
        sounds.success()
        setLocalSolved(true)
        setPhase('won')
        setTimeout(() => onSolvedRef.current(), 1100)
      }
      return next
    })
    setDragId(null)
  }, [dragId, phase])

  const handleFreePlay = () => {
    setInShield(new Set())
    setPhase('free')
  }

  const isWon   = localSolved || isSolved
  const isFree  = phase === 'free'
  const secured = inShield.size
  const left    = PIECES.filter(p => p.side === 'left')
  const right   = PIECES.filter(p => p.side === 'right')

  // Timer ring
  const timerPct    = timeLeft / TIME_LIMIT
  const dashOffset  = CIRC * (1 - timerPct)
  const timerColor  = timeLeft > 8 ? '#06b6d4' : timeLeft > 4 ? '#f59e0b' : '#ef4444'

  return (
    <div className="flex flex-col items-center gap-5 max-w-3xl mx-auto w-full">

      {/* Instructions */}
      <div className="text-center">
        <p className="text-sm text-slate-300 leading-relaxed">
          <span className="text-red-400 font-bold">The Union is fracturing!</span>{' '}
          Drag all 8 state icons into the{' '}
          <span className="text-amber-400 font-bold">Federal Shield</span>{' '}
          before the {isFree ? 'last' : <span className="text-red-400 font-bold">{TIME_LIMIT}-second</span>} timer runs out!
        </p>
      </div>

      {/* Win banner */}
      {isWon && (
        <div className="border-2 border-green-500 bg-green-950/30 rounded-2xl px-8 py-4 text-center w-full"
          style={{ boxShadow: '0 0 20px rgba(34,197,94,0.2)' }}>
          <div className="text-green-400 font-black text-2xl tracking-wider">🦅 UNION PRESERVED!</div>
          <div className="text-sm text-green-300/80 mt-1">
            Federal authority over the states was cemented — secession defeated forever.
          </div>
        </div>
      )}

      {/* Failed banner */}
      {phase === 'between' && (
        <div className="border-2 border-red-500 bg-red-950/30 rounded-2xl px-8 py-3 text-center w-full animate-pulse">
          <div className="text-red-400 font-black text-lg">⏰ TIME EXPIRED!</div>
          <div className="text-sm text-red-300/70 mt-1">
            Attempt {attempts}/{MAX_ATTEMPTS} — Regrouping... {MAX_ATTEMPTS - attempts} attempt{MAX_ATTEMPTS - attempts !== 1 ? 's' : ''} remaining
          </div>
        </div>
      )}

      {/* Hint overlay */}
      {phase === 'hint' && (
        <div className="border-2 border-amber-500 bg-amber-950/20 rounded-2xl p-6 w-full">
          <div className="text-amber-400 font-black text-lg mb-2">📖 HISTORICAL CONTEXT</div>
          <p className="text-slate-300 text-sm leading-relaxed mb-4">
            After the Civil War, the Union victory permanently established that states cannot
            legally secede. The federal government's authority over all states was cemented —
            the United States remained one nation, not a collection of independent republics.
            This principle still protects national unity today.
          </p>
          <button
            onClick={handleFreePlay}
            className="px-6 py-2.5 border-2 border-cyan-400 text-cyan-400 font-bold rounded-xl hover:bg-cyan-400/10 transition-all text-sm tracking-wider"
          >
            ▶ CONTINUE (No Timer)
          </button>
        </div>
      )}

      {/* Timer + Attempt pips */}
      {!isWon && phase !== 'hint' && (
        <div className="flex items-center gap-8">
          {/* SVG countdown ring */}
          <div className="relative flex-shrink-0" style={{ width: 96, height: 96 }}>
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              {/* Track */}
              <circle cx={50} cy={50} r={42} fill="none" stroke="#1e293b" strokeWidth={6} />
              {/* Countdown arc */}
              {!isFree && phase !== 'between' && (
                <circle
                  cx={50} cy={50} r={42}
                  fill="none"
                  stroke={timerColor}
                  strokeWidth={6}
                  strokeLinecap="round"
                  strokeDasharray={`${CIRC - dashOffset} ${dashOffset}`}
                  style={{ transition: 'stroke-dasharray 0.9s linear, stroke 0.3s' }}
                />
              )}
              {isFree && (
                <circle cx={50} cy={50} r={42} fill="none" stroke="#06b6d4" strokeWidth={6} opacity="0.3" />
              )}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              {isFree ? (
                <span className="text-cyan-400 text-xs font-bold tracking-wider">FREE</span>
              ) : (
                <>
                  <span className="font-black leading-none" style={{ fontSize: 32, color: timerColor }}>
                    {phase === 'between' ? '✕' : timeLeft}
                  </span>
                  <span className="text-slate-600 text-xs">sec</span>
                </>
              )}
            </div>
          </div>

          {/* Attempt pips */}
          <div className="text-center">
            <div className="text-xs text-slate-600 tracking-widest uppercase mb-2">Attempts</div>
            <div className="flex gap-2">
              {Array.from({ length: MAX_ATTEMPTS }).map((_, i) => (
                <div
                  key={i}
                  className={`w-5 h-5 rounded-full border-2 transition-all ${
                    i < attempts
                      ? 'border-red-500 bg-red-500/40'
                      : 'border-slate-600 bg-transparent'
                  }`}
                />
              ))}
            </div>
            <div className="text-xs text-slate-600 mt-1">
              {attempts >= MAX_ATTEMPTS ? 'Hint unlocked' : `${MAX_ATTEMPTS - attempts} left`}
            </div>
          </div>

          {/* Progress */}
          <div className="text-center">
            <div className="text-xs text-slate-600 tracking-widest uppercase mb-1">Secured</div>
            <div className="text-4xl font-black text-amber-400">{secured}</div>
            <div className="text-xs text-slate-500">/ {PIECES.length} states</div>
          </div>
        </div>
      )}

      {/* Main puzzle: left | shield | right */}
      {!isWon && phase !== 'hint' && (
        <div className="flex items-stretch gap-4 w-full">
          {/* Left column */}
          <div className="flex flex-col gap-2.5 flex-1">
            <div className="text-xs text-slate-600 tracking-widest uppercase text-center mb-1">Drag these →</div>
            {left.map(p => (
              <PieceCard
                key={p.id}
                piece={p}
                placed={inShield.has(p.id)}
                dragging={dragId === p.id}
                justPlaced={justPlaced === p.id}
                onDragStart={() => { sounds.click(); setDragId(p.id) }}
                onDragEnd={() => setDragId(null)}
              />
            ))}
          </div>

          {/* Federal Shield drop zone */}
          <div
            onDragOver={e => { e.preventDefault(); setShieldOver(true) }}
            onDragLeave={() => setShieldOver(false)}
            onDrop={handleDrop}
            className={[
              'flex flex-col items-center justify-center rounded-2xl border-4 transition-all duration-200 flex-shrink-0',
              shieldOver
                ? 'border-cyan-400 bg-cyan-950/40 scale-105'
                : 'border-amber-600/60 bg-amber-950/10',
            ].join(' ')}
            style={{
              width: 200,
              minHeight: 280,
              boxShadow: shieldOver
                ? '0 0 30px rgba(6,182,212,0.3)'
                : '0 0 15px rgba(245,158,11,0.1)',
            }}
          >
            {/* Shield label */}
            <div className="text-xs font-black tracking-widest text-amber-400 uppercase mb-3">
              Federal Shield
            </div>

            {/* Eagle */}
            <div className={`text-5xl mb-3 transition-all ${shieldOver ? 'scale-110' : ''}`}>
              🦅
            </div>

            {/* Drop hint */}
            {secured === 0 && !shieldOver && (
              <div className="text-xs text-slate-600 text-center px-4 mb-3">
                Drop state icons here to secure the Union
              </div>
            )}

            {/* Placed pieces grid */}
            {secured > 0 && (
              <div className="grid grid-cols-2 gap-1.5 px-3 mb-3">
                {PIECES.filter(p => inShield.has(p.id)).map(p => (
                  <div
                    key={p.id}
                    className="border border-green-500/40 bg-green-950/40 rounded-lg px-2 py-1 text-center animate-pop"
                  >
                    <div className="text-base">{p.icon}</div>
                    <div className="text-[9px] text-green-400 font-bold leading-tight">{p.name}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Progress bar inside shield */}
            <div className="w-3/4 mt-auto mb-3">
              <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full transition-all duration-300"
                  style={{ width: `${(secured / PIECES.length) * 100}%` }}
                />
              </div>
              <div className="text-[10px] text-slate-600 text-center mt-1">{secured}/{PIECES.length}</div>
            </div>

            {shieldOver && (
              <div className="text-cyan-400 text-sm font-black animate-pulse mb-2">+ ADD TO UNION</div>
            )}
          </div>

          {/* Right column */}
          <div className="flex flex-col gap-2.5 flex-1">
            <div className="text-xs text-slate-600 tracking-widest uppercase text-center mb-1">← Drag these</div>
            {right.map(p => (
              <PieceCard
                key={p.id}
                piece={p}
                placed={inShield.has(p.id)}
                dragging={dragId === p.id}
                justPlaced={justPlaced === p.id}
                onDragStart={() => { sounds.click(); setDragId(p.id) }}
                onDragEnd={() => setDragId(null)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Solved — show all pieces in shield */}
      {isWon && (
        <div className="border-2 border-amber-600/60 bg-amber-950/10 rounded-2xl p-6 w-full flex flex-col items-center gap-4"
          style={{ boxShadow: '0 0 20px rgba(245,158,11,0.1)' }}>
          <div className="text-5xl">🦅</div>
          <div className="text-amber-400 font-black tracking-wider">FEDERAL SHIELD COMPLETE</div>
          <div className="grid grid-cols-4 gap-2">
            {PIECES.map(p => (
              <div key={p.id} className="border border-green-500/40 bg-green-950/40 rounded-lg px-2 py-1.5 text-center">
                <div className="text-xl">{p.icon}</div>
                <div className="text-[9px] text-green-400 font-bold">{p.name}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function PieceCard({ piece, placed, dragging, justPlaced, onDragStart, onDragEnd }) {
  if (placed) {
    return (
      <div className="border border-green-500/30 bg-green-950/20 rounded-xl px-3 py-2 flex items-center gap-2 opacity-40">
        <span className="text-lg">{piece.icon}</span>
        <div>
          <div className="text-xs font-bold text-green-500 tracking-wide">{piece.name}</div>
          <div className="text-[10px] text-green-700">✓ Secured</div>
        </div>
      </div>
    )
  }

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      className={[
        'border-2 rounded-xl px-3 py-2.5 flex items-center gap-2.5 cursor-grab active:cursor-grabbing select-none transition-all duration-100',
        dragging
          ? 'border-cyan-400 bg-cyan-950/40 opacity-50 scale-95'
          : justPlaced
            ? 'border-green-500 bg-green-950/40 animate-pop'
            : 'border-slate-600 bg-slate-800/60 hover:border-amber-500/70 hover:bg-amber-950/20 hover:scale-[1.02]',
      ].join(' ')}
    >
      <span className="text-2xl flex-shrink-0">{piece.icon}</span>
      <div>
        <div className="text-sm font-black text-slate-200 leading-tight">{piece.name}</div>
        <div className="text-[10px] text-slate-600">drag to shield</div>
      </div>
    </div>
  )
}
