export default function GlitchedItem({ levelId, isSolved }) {
  if (isSolved) return <FixedBadge levelId={levelId} />
  switch (levelId) {
    case 1: return <PhoneGlitch />
    case 2: return <ConstitutionGlitch />
    case 3: return <BadgeGlitch />
    case 4: return <GPSGlitch />
    case 5: return <MapGlitch />
    default: return null
  }
}

const FIXED_LABELS = {
  1: 'LIVE NEWS RESTORED',
  2: '13TH AMENDMENT RATIFIED',
  3: 'ACCESS GRANTED',
  4: 'ROUTES CONNECTED',
  5: 'UNION PRESERVED',
}

function FixedBadge({ levelId }) {
  return (
    <div className="flex justify-center mb-5">
      <div className="border-2 border-green-500 bg-green-500/10 rounded-2xl px-10 py-4 text-center"
        style={{ boxShadow: '0 0 20px rgba(34,197,94,0.2)' }}>
        <div className="text-4xl mb-2">✅</div>
        <div className="text-green-400 font-black text-lg tracking-widest neon-green">
          {FIXED_LABELS[levelId]}
        </div>
      </div>
    </div>
  )
}

function PhoneGlitch() {
  return (
    <div className="flex justify-center mb-5">
      <div className="relative border-4 border-slate-500 bg-slate-900 rounded-3xl p-3 shadow-2xl animate-pulse"
        style={{ width: 180 }}>
        <div className="bg-black rounded-2xl overflow-hidden" style={{ minHeight: 220 }}>
          <div className="h-3 bg-slate-800 flex items-center justify-center mb-2 rounded">
            <div className="w-10 h-1 bg-slate-600 rounded" />
          </div>
          <div className="p-3 space-y-2">
            <div className="text-red-400 font-black text-center text-base animate-glitch">⚠ ERROR</div>
            <div className="text-red-300 text-center text-sm leading-tight">NO LIVE<br />NEWS FEED</div>
            <div className="w-full h-px bg-red-500/30 my-2" />
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-2 rounded bg-slate-700 animate-pulse" style={{ animationDelay: `${i * 0.15}s`, width: `${70 + i * 8}%` }} />
            ))}
            <div className="text-slate-600 text-center text-xs mt-3">SIGNAL LOST</div>
            <div className="text-red-500 text-center text-xs font-bold animate-flicker">● DISCONNECTED</div>
          </div>
        </div>
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
          <div className="w-full h-1 bg-red-500/40 animate-bounce" style={{ marginTop: '45%' }} />
        </div>
      </div>
    </div>
  )
}

function ConstitutionGlitch() {
  return (
    <div className="flex justify-center mb-5">
      <div className="border-2 border-amber-800/50 bg-amber-950/30 rounded-xl p-5 font-mono shadow-2xl" style={{ width: 320 }}>
        <div className="text-amber-700 text-center font-black tracking-widest mb-3 text-sm">
          UNITED STATES CONSTITUTION
        </div>
        <div className="space-y-2.5">
          <div className="text-amber-600/70 text-sm">Amendment ██ — Section 1</div>
          <div className="flex gap-2 flex-wrap items-center text-sm">
            <span className="text-slate-500">Neither</span>
            <span className="bg-red-900/80 text-red-900 rounded px-4 py-0.5 text-sm">████████████</span>
            <span className="text-slate-500">nor</span>
          </div>
          <div className="flex gap-2 flex-wrap items-center text-sm">
            <span className="bg-red-900/80 text-red-900 rounded px-6 py-0.5 text-sm">████████████████████</span>
          </div>
          <div className="text-slate-500 text-sm">shall exist within the</div>
          <div className="flex gap-2 items-center text-sm">
            <span className="bg-red-900/80 text-red-900 rounded px-5 py-0.5 text-sm">████████████</span>
          </div>
          <div className="mt-2 text-red-500 animate-flicker font-black text-sm">
            ⚠ DOCUMENT CORRUPTED
          </div>
          <div className="flex gap-2 items-center text-sm">
            <span className="text-slate-500">Ratified:</span>
            <span className="bg-red-900/80 text-red-900 rounded px-3 py-0.5 text-sm">████</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function BadgeGlitch() {
  return (
    <div className="flex justify-center mb-5">
      <div className="relative border-2 border-red-500/60 bg-slate-900 rounded-2xl p-6 text-center animate-pulse shadow-2xl" style={{ width: 240 }}>
        <div className="text-6xl mb-3">⚕️</div>
        <div className="text-slate-300 font-black tracking-wider text-lg mb-1">ARMY SURGEON</div>
        <div className="text-slate-500 text-sm mb-4">FIELD HOSPITAL — 1863</div>
        <div className="border-2 border-red-500 bg-red-500/10 rounded-xl px-4 py-2.5">
          <div className="text-red-400 font-black animate-glitch tracking-widest text-base">
            ACCESS DENIED
          </div>
        </div>
        <div className="mt-3 flex justify-center gap-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className={`w-2.5 h-2.5 rounded-full ${i < 2 ? 'bg-red-500' : 'bg-slate-700'}`} />
          ))}
        </div>
      </div>
    </div>
  )
}

function GPSGlitch() {
  return (
    <div className="flex justify-center mb-5">
      <div className="border-2 border-slate-600 bg-slate-900 rounded-2xl p-5 shadow-2xl" style={{ width: 320 }}>
        <div className="flex items-center justify-between mb-3">
          <span className="text-slate-400 tracking-wider text-sm font-bold">GPS CARGO ROUTES</span>
          <span className="text-red-400 animate-flicker font-black text-sm">● OFFLINE</span>
        </div>
        <div className="relative bg-slate-800 rounded-xl overflow-hidden" style={{ height: 120 }}>
          {[...Array(4)].map((_, i) => (
            <div key={i} className="absolute w-full h-px bg-slate-700" style={{ top: `${(i + 1) * 20}%` }} />
          ))}
          {[...Array(5)].map((_, i) => (
            <div key={i} className="absolute h-full w-px bg-slate-700" style={{ left: `${(i + 1) * 20}%` }} />
          ))}
          <svg className="absolute inset-0 w-full h-full">
            <line x1="5%" y1="35%" x2="38%" y2="35%" stroke="#ef4444" strokeWidth="3" strokeDasharray="5,4" opacity="0.8" />
            <line x1="62%" y1="65%" x2="95%" y2="65%" stroke="#ef4444" strokeWidth="3" strokeDasharray="5,4" opacity="0.8" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-red-400 text-4xl font-black animate-glitch">✕</div>
          </div>
        </div>
        <div className="text-red-400 text-center mt-2 font-black text-sm">ROUTES BROKEN — SUPPLY CHAIN FAILED</div>
      </div>
    </div>
  )
}

function MapGlitch() {
  const pieces = [
    { top: '8%',  left: '12%', rotate: -10 },
    { top: '4%',  left: '48%', rotate: 6 },
    { top: '38%', left: '8%',  rotate: 14 },
    { top: '42%', left: '44%', rotate: -7 },
    { top: '32%', left: '72%', rotate: 10 },
    { top: '60%', left: '22%', rotate: -12 },
    { top: '58%', left: '60%', rotate: 8 },
    { top: '10%', left: '76%', rotate: -5 },
  ]
  return (
    <div className="flex justify-center mb-5">
      <div className="border-2 border-red-500/50 bg-slate-900 rounded-2xl p-5 shadow-2xl" style={{ width: 340 }}>
        <div className="text-slate-400 tracking-wider text-center mb-3 font-bold text-sm">
          UNITED STATES — STATUS: FRAGMENTED
        </div>
        <div className="relative bg-slate-800/60 rounded-xl overflow-hidden" style={{ height: 130 }}>
          {pieces.map((p, i) => (
            <div
              key={i}
              className="absolute w-12 h-8 border-2 border-slate-500 bg-slate-700 rounded text-xs text-slate-400 flex items-center justify-center font-bold"
              style={{ top: p.top, left: p.left, transform: `rotate(${p.rotate}deg)` }}
            >
              {String.fromCharCode(65 + i)}
            </div>
          ))}
          <div className="absolute inset-0 flex items-end justify-center pb-2">
            <span className="text-red-400 font-black animate-flicker text-sm">UNION FRAGMENTED</span>
          </div>
        </div>
      </div>
    </div>
  )
}
