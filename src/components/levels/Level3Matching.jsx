import { useState, useRef, useEffect } from 'react'
import { sounds } from '../../sounds'

const PAIRS = [
  {
    id: 'nurse',
    left:  { icon: '🏥', title: 'Army Nurse',       desc: 'Tended to wounded soldiers in Civil War field hospitals' },
    right: { icon: '👩‍⚕️', title: 'Healthcare Pro',   desc: 'Doctor, surgeon, or nurse practitioner' },
  },
  {
    id: 'farmer',
    left:  { icon: '🌾', title: 'Field Farmhand',   desc: 'Kept farms and food supply running while men were at war' },
    right: { icon: '🚜', title: 'Agri. Engineer',   desc: 'Designs modern farming systems and crop technology' },
  },
  {
    id: 'supply',
    left:  { icon: '📦', title: 'Supply Organizer', desc: 'Managed troops\' food, medicine, and equipment' },
    right: { icon: '📊', title: 'Logistics Manager', desc: 'Oversees global supply chains and distribution networks' },
  },
  {
    id: 'spy',
    left:  { icon: '🕵️', title: 'Battlefield Spy',  desc: 'Gathered enemy intelligence and smuggled information' },
    right: { icon: '🛡️', title: 'Intel Analyst',    desc: 'CIA, NSA, or national security professional' },
  },
  {
    id: 'telegraph',
    left:  { icon: '📡', title: 'Telegraph Op.',    desc: 'Transmitted urgent military communications by wire' },
    right: { icon: '💻', title: 'Comms Engineer',   desc: 'Designs digital communication and network systems' },
  },
]

// Right column shown in shuffled order
const RIGHT_ORDER = ['spy', 'telegraph', 'nurse', 'supply', 'farmer']

export default function Level3Matching({ isSolved, onSolved }) {
  const [selectedLeft, setSelectedLeft] = useState(null)
  const [matched, setMatched] = useState(new Set())
  const [shaking, setShaking] = useState(null)   // pair id that is shaking (wrong)
  const [popping, setPopping] = useState(null)   // pair id that is popping (correct)
  const [localSolved, setLocalSolved] = useState(false)
  const onSolvedRef = useRef(onSolved)
  useEffect(() => { onSolvedRef.current = onSolved }, [onSolved])

  function handleLeftClick(pairId) {
    if (matched.has(pairId) || localSolved || isSolved) return
    sounds.click()
    setSelectedLeft(prev => prev === pairId ? null : pairId)
  }

  function handleRightClick(pairId) {
    if (matched.has(pairId) || localSolved || isSolved) return
    if (!selectedLeft) return

    if (selectedLeft === pairId) {
      // Correct match!
      sounds.unlock()
      setPopping(pairId)
      setTimeout(() => setPopping(null), 300)
      setSelectedLeft(null)
      setMatched(prev => {
        const next = new Set(prev)
        next.add(pairId)
        if (next.size === PAIRS.length) {
          setTimeout(() => {
            sounds.success()
            setLocalSolved(true)
            setTimeout(() => onSolvedRef.current(), 1100)
          }, 200)
        }
        return next
      })
    } else {
      // Wrong match
      sounds.error()
      setShaking(pairId)
      setTimeout(() => {
        setShaking(null)
        setSelectedLeft(null)
      }, 450)
    }
  }

  const isWon = localSolved || isSolved

  function LeftCard({ pair }) {
    const isSelected = selectedLeft === pair.id
    const isMatched  = matched.has(pair.id)
    const isPopping  = popping === pair.id

    return (
      <button
        onClick={() => handleLeftClick(pair.id)}
        disabled={isMatched || isWon}
        className={[
          'w-full text-left rounded-2xl border-2 p-4 transition-all duration-150',
          isMatched
            ? 'border-green-500 bg-green-950/50 cursor-default'
            : isSelected
              ? 'border-amber-400 bg-amber-950/40 scale-[1.02] cursor-pointer'
              : 'border-amber-800/50 bg-amber-950/20 hover:border-amber-500/70 hover:bg-amber-950/30 cursor-pointer',
          isPopping ? 'animate-pop' : '',
        ].join(' ')}
        style={isSelected ? { boxShadow: '0 0 16px rgba(245,158,11,0.3)' } : undefined}
      >
        <div className="flex items-start gap-3">
          <span className="text-3xl flex-shrink-0 mt-0.5">{pair.left.icon}</span>
          <div>
            <div className={`text-sm font-black tracking-wide leading-tight mb-1
              ${isMatched ? 'text-green-400' : isSelected ? 'text-amber-300' : 'text-amber-200'}`}>
              {pair.left.title}
            </div>
            <div className="text-xs text-slate-500 leading-snug">{pair.left.desc}</div>
            {isMatched && (
              <div className="text-xs text-green-400 font-bold mt-1 tracking-wider">✓ MATCHED</div>
            )}
          </div>
        </div>
      </button>
    )
  }

  function RightCard({ pairId }) {
    const pair     = PAIRS.find(p => p.id === pairId)
    const isMatched  = matched.has(pairId)
    const isShaking  = shaking === pairId
    const isPopping  = popping === pairId
    const isTarget   = selectedLeft !== null && !isMatched

    return (
      <button
        onClick={() => handleRightClick(pairId)}
        disabled={isMatched || !selectedLeft || isWon}
        className={[
          'w-full text-left rounded-2xl border-2 p-4 transition-all duration-150',
          isMatched
            ? 'border-green-500 bg-green-950/50 cursor-default'
            : isShaking
              ? 'border-red-500 bg-red-950/40 animate-shake cursor-pointer'
              : isTarget
                ? 'border-cyan-500/70 bg-cyan-950/30 hover:border-cyan-400 hover:bg-cyan-950/40 cursor-pointer'
                : 'border-cyan-900/50 bg-slate-900/40 opacity-50 cursor-not-allowed',
          isPopping ? 'animate-pop' : '',
        ].join(' ')}
        style={isTarget && !isMatched ? { boxShadow: '0 0 12px rgba(6,182,212,0.2)' } : undefined}
      >
        <div className="flex items-start gap-3">
          <span className="text-3xl flex-shrink-0 mt-0.5">{pair.right.icon}</span>
          <div>
            <div className={`text-sm font-black tracking-wide leading-tight mb-1
              ${isMatched ? 'text-green-400' : isTarget ? 'text-cyan-300' : 'text-cyan-600'}`}>
              {pair.right.title}
            </div>
            <div className="text-xs text-slate-500 leading-snug">{pair.right.desc}</div>
            {isMatched && (
              <div className="text-xs text-green-400 font-bold mt-1 tracking-wider">✓ MATCHED</div>
            )}
          </div>
        </div>
      </button>
    )
  }

  return (
    <div className="flex flex-col gap-5 max-w-3xl mx-auto w-full">
      {/* Instructions */}
      <div className="text-center">
        <p className="text-sm text-slate-300 leading-relaxed">
          <span className="text-amber-400 font-bold">Click a 1860s role</span> on the left,
          then <span className="text-cyan-400 font-bold">click its modern equivalent</span> on the right.
          Match all 5 pairs to restore the badge!
        </p>
        {selectedLeft && (
          <div className="mt-2 inline-flex items-center gap-2 border border-amber-500/40 bg-amber-950/30 rounded-lg px-4 py-1.5">
            <span className="text-amber-400 text-lg">{PAIRS.find(p => p.id === selectedLeft)?.left.icon}</span>
            <span className="text-amber-300 text-sm font-bold">
              "{PAIRS.find(p => p.id === selectedLeft)?.left.title}" selected — now pick the modern match →
            </span>
          </div>
        )}
      </div>

      {/* Win banner */}
      {isWon && (
        <div className="border-2 border-green-500 bg-green-950/30 rounded-2xl px-8 py-4 text-center"
          style={{ boxShadow: '0 0 20px rgba(34,197,94,0.2)' }}>
          <div className="text-green-400 font-black text-xl tracking-wider">✓ ALL ROLES MATCHED!</div>
          <div className="text-sm text-green-300/80 mt-1">
            Women's wartime contributions broke gender barriers and shaped modern careers forever.
          </div>
        </div>
      )}

      {/* Progress bar */}
      <div className="flex items-center gap-3">
        <span className="text-xs text-slate-600 tracking-wider uppercase">Matched</span>
        <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-500 rounded-full transition-all duration-500"
            style={{ width: `${(matched.size / PAIRS.length) * 100}%` }}
          />
        </div>
        <span className="text-sm font-bold text-slate-400">{matched.size}/{PAIRS.length}</span>
      </div>

      {/* Two-column card layout */}
      <div className="grid grid-cols-2 gap-4">
        {/* Left column header */}
        <div className="flex items-center gap-2 px-1">
          <span className="text-amber-500 text-lg">⏪</span>
          <span className="text-sm font-black text-amber-400 tracking-wider uppercase">1860s Roles</span>
        </div>
        <div className="flex items-center gap-2 px-1">
          <span className="text-sm font-black text-cyan-400 tracking-wider uppercase">Modern Careers</span>
          <span className="text-cyan-500 text-lg">⏩</span>
        </div>

        {/* Cards — left column in PAIRS order, right column shuffled */}
        <div className="flex flex-col gap-3">
          {PAIRS.map(pair => <LeftCard key={pair.id} pair={pair} />)}
        </div>
        <div className="flex flex-col gap-3">
          {RIGHT_ORDER.map(id => <RightCard key={id} pairId={id} />)}
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-6 text-xs text-slate-600 justify-center">
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 rounded border-2 border-amber-500 inline-block" />
          Select from left first
        </span>
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 rounded border-2 border-cyan-500 inline-block" />
          Then match on right
        </span>
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 rounded border-2 border-green-500 bg-green-950 inline-block" />
          Matched pair
        </span>
      </div>
    </div>
  )
}
