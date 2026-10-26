/* Animated "broken object" visuals shown above each puzzle */
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

function FixedBadge({ levelId }) {
  const labels = {
    1: 'LIVE NEWS RESTORED',
    2: '13TH AMENDMENT RATIFIED',
    3: 'ACCESS GRANTED',
    4: 'ROUTES CONNECTED',
    5: 'UNION PRESERVED',
  }
  return (
    <div className="flex justify-center mb-4">
      <div className="border-2 border-green-500 bg-green-500/10 rounded-lg px-6 py-3 text-center border-neon-green">
        <div className="text-2xl mb-1">✅</div>
        <div className="text-green-400 font-bold text-xs tracking-widest neon-green">
          {labels[levelId]}
        </div>
      </div>
    </div>
  )
}

function PhoneGlitch() {
  return (
    <div className="flex justify-center mb-4">
      <div className="relative w-28 border-4 border-slate-600 bg-slate-900 rounded-2xl p-2 shadow-xl animate-pulse">
        <div className="bg-black rounded-xl overflow-hidden" style={{ aspectRatio: '9/16', minHeight: 120 }}>
          <div className="h-2 bg-slate-800 flex items-center justify-center mb-1 rounded">
            <div className="w-6 h-0.5 bg-slate-600 rounded" />
          </div>
          <div className="p-2 space-y-1">
            <div className="text-[8px] text-red-400 font-bold animate-glitch text-center">
              ⚠ ERROR
            </div>
            <div className="text-[7px] text-red-300 text-center leading-tight">
              NO LIVE<br />NEWS FEED
            </div>
            <div className="w-full h-px bg-red-500/30 my-1" />
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-1 rounded bg-slate-700 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
            ))}
            <div className="text-[7px] text-slate-600 text-center mt-2">SIGNAL LOST</div>
          </div>
        </div>
        {/* Glitch scan line */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
          <div className="w-full h-0.5 bg-red-500/50 animate-bounce" style={{ marginTop: '40%' }} />
        </div>
      </div>
    </div>
  )
}

function ConstitutionGlitch() {
  return (
    <div className="flex justify-center mb-4">
      <div className="w-48 border-2 border-amber-800/50 bg-amber-950/30 rounded p-3 font-mono shadow-xl">
        <div className="text-[9px] text-amber-700 text-center font-bold tracking-widest mb-2">
          UNITED STATES CONSTITUTION
        </div>
        <div className="space-y-1.5">
          <div className="text-[8px] text-amber-600/70 leading-relaxed">
            Amendment ██ — Section 1
          </div>
          <div className="flex gap-1 flex-wrap">
            <span className="text-[8px] text-slate-600">Neither</span>
            <span className="bg-red-900 text-red-900 text-[8px] rounded px-3">████████████</span>
            <span className="text-[8px] text-slate-600">nor</span>
          </div>
          <div className="flex gap-1 flex-wrap items-center">
            <span className="bg-red-900 text-red-900 text-[8px] rounded px-4">████████████████</span>
            <span className="text-[8px] text-slate-600">shall</span>
          </div>
          <div className="text-[8px] text-slate-600">exist within the United States...</div>
          <div className="mt-1 text-[8px] text-red-500 animate-flicker font-bold">
            ⚠ DOCUMENT CORRUPTED
          </div>
          <div className="flex gap-1 items-center mt-1">
            <span className="text-[8px] text-slate-600">Ratified:</span>
            <span className="bg-red-900 text-red-900 text-[8px] rounded px-2">████</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function BadgeGlitch() {
  return (
    <div className="flex justify-center mb-4">
      <div className="relative border-2 border-red-500/60 bg-slate-900 rounded-lg p-4 text-center w-40 animate-pulse shadow-xl">
        <div className="text-3xl mb-2">⚕️</div>
        <div className="text-[9px] font-bold text-slate-400 tracking-wider mb-1">ARMY SURGEON</div>
        <div className="text-[8px] text-slate-600 mb-2">FIELD HOSPITAL — 1863</div>
        <div className="border border-red-500 bg-red-500/10 rounded px-2 py-1">
          <div className="text-[9px] font-bold text-red-400 animate-glitch tracking-widest">
            ACCESS DENIED
          </div>
        </div>
        <div className="mt-2 flex justify-center gap-1">
          {[...Array(4)].map((_, i) => (
            <div key={i} className={`w-1.5 h-1.5 rounded-full ${i < 2 ? 'bg-red-500' : 'bg-slate-700'}`} />
          ))}
        </div>
      </div>
    </div>
  )
}

function GPSGlitch() {
  return (
    <div className="flex justify-center mb-4">
      <div className="border-2 border-slate-600 bg-slate-900 rounded-lg p-3 w-52 shadow-xl">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[9px] text-slate-500 tracking-wider">GPS CARGO ROUTES</span>
          <span className="text-[8px] text-red-400 animate-flicker font-bold">● OFFLINE</span>
        </div>
        {/* Fake broken map grid */}
        <div className="relative bg-slate-800 rounded overflow-hidden" style={{ height: 80 }}>
          {/* Grid lines */}
          {[...Array(4)].map((_, i) => (
            <div key={i} className="absolute w-full h-px bg-slate-700" style={{ top: `${(i + 1) * 20}%` }} />
          ))}
          {[...Array(4)].map((_, i) => (
            <div key={i} className="absolute h-full w-px bg-slate-700" style={{ left: `${(i + 1) * 25}%` }} />
          ))}
          {/* Broken route lines */}
          <svg className="absolute inset-0 w-full h-full">
            <line x1="10%" y1="30%" x2="35%" y2="30%" stroke="#ef4444" strokeWidth="2" strokeDasharray="4,3" opacity="0.7" />
            <line x1="60%" y1="60%" x2="90%" y2="60%" stroke="#ef4444" strokeWidth="2" strokeDasharray="4,3" opacity="0.7" />
          </svg>
          {/* Gap / broken symbol */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-red-400 text-lg font-bold animate-glitch">✕</span>
          </div>
        </div>
        <div className="text-[8px] text-red-400 text-center mt-1.5 font-bold">ROUTES BROKEN</div>
      </div>
    </div>
  )
}

function MapGlitch() {
  const pieces = [
    { top: '10%', left: '15%', rotate: -8 },
    { top: '5%',  left: '50%', rotate: 5 },
    { top: '40%', left: '10%', rotate: 12 },
    { top: '45%', left: '45%', rotate: -6 },
    { top: '35%', left: '72%', rotate: 9 },
    { top: '65%', left: '25%', rotate: -10 },
    { top: '60%', left: '60%', rotate: 7 },
  ]
  return (
    <div className="flex justify-center mb-4">
      <div className="border-2 border-red-500/50 bg-slate-900 rounded-lg p-3 w-56 shadow-xl">
        <div className="text-[9px] text-slate-500 tracking-wider text-center mb-2">
          UNITED STATES — STATUS: FRAGMENTED
        </div>
        <div className="relative bg-slate-800 rounded overflow-hidden" style={{ height: 90 }}>
          {pieces.map((p, i) => (
            <div
              key={i}
              className="absolute w-8 h-6 border border-slate-500 bg-slate-700 rounded-sm text-[7px] text-slate-500 flex items-center justify-center"
              style={{ top: p.top, left: p.left, transform: `rotate(${p.rotate}deg)` }}
            >
              {String.fromCharCode(65 + i)}
            </div>
          ))}
          <div className="absolute inset-0 flex items-end justify-center pb-1">
            <span className="text-red-400 text-[8px] font-bold animate-flicker">UNION FRAGMENTED</span>
          </div>
        </div>
      </div>
    </div>
  )
}
