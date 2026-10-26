import { useState, useRef, useEffect } from 'react'
import { sounds } from '../../sounds'

// Routes light up one-by-one as slider crosses each threshold
const ROUTES = [
  { from: [18, 78], to: [28, 22], name: 'New Orleans → Chicago',   threshold: 18 },
  { from: [42, 72], to: [48, 24], name: 'Atlanta → Pittsburgh',    threshold: 38 },
  { from: [62, 76], to: [72, 20], name: 'Charleston → New York',   threshold: 58 },
  { from: [30, 74], to: [58, 22], name: 'Memphis → Philadelphia',  threshold: 72 },
]

const SOUTH_CITIES = [
  { name: 'New Orleans', x: 18, y: 78 },
  { name: 'Atlanta',     x: 42, y: 72 },
  { name: 'Charleston',  x: 62, y: 76 },
  { name: 'Memphis',     x: 30, y: 74 },
]

const NORTH_CITIES = [
  { name: 'Chicago',      x: 28, y: 22 },
  { name: 'Pittsburgh',   x: 48, y: 24 },
  { name: 'New York',     x: 72, y: 20 },
  { name: 'Philadelphia', x: 58, y: 22 },
]

function RouteMap({ value, solved }) {
  const activeRoutes = ROUTES.filter(r => value >= r.threshold).length

  return (
    <div className="relative rounded-2xl overflow-hidden border-2 border-slate-700"
      style={{ background: 'radial-gradient(ellipse at 50% 100%, #1a0d00 0%, #060d1a 60%)' }}>
      <svg viewBox="0 0 100 100" className="w-full" style={{ height: 240 }}>
        {/* Grid */}
        {[20,40,60,80].map(x => (
          <line key={`v${x}`} x1={x} y1={0} x2={x} y2={100} stroke="#1e293b" strokeWidth="0.4" />
        ))}
        {[25,50,75].map(y => (
          <line key={`h${y}`} x1={0} y1={y} x2={100} y2={y} stroke="#1e293b" strokeWidth="0.4" />
        ))}

        {/* Dividing line (Mason-Dixon) */}
        <line x1={0} y1={50} x2={100} y2={50} stroke="#334155" strokeWidth="0.8" strokeDasharray="3,2" />
        <text x={1} y={49} fontSize="2.8" fill="#475569">— MASON-DIXON LINE —</text>

        {/* Route lines */}
        {ROUTES.map((route, i) => {
          const active = value >= route.threshold
          const [x1, y1] = route.from
          const [x2, y2] = route.to
          // Control point for curve
          const cx = (x1 + x2) / 2 + (i % 2 === 0 ? -6 : 6)
          const cy = (y1 + y2) / 2
          const d = `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`
          return (
            <g key={i}>
              {/* Shadow/glow when active */}
              {active && (
                <path d={d} stroke="#22c55e" strokeWidth="3" fill="none" opacity="0.15" />
              )}
              <path
                d={d}
                stroke={active ? '#22c55e' : '#ef4444'}
                strokeWidth="1.5"
                strokeDasharray={active ? 'none' : '2.5,2'}
                fill="none"
                opacity={active ? 0.9 : 0.5}
                style={{ transition: 'stroke 0.4s, opacity 0.4s' }}
              />
              {/* Train icon on active routes */}
              {active && (
                <text
                  x={(x1 + x2) / 2}
                  y={(y1 + y2) / 2}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="5"
                >🚂</text>
              )}
            </g>
          )
        })}

        {/* Southern cities */}
        {SOUTH_CITIES.map((city, i) => (
          <g key={i}>
            <circle cx={city.x} cy={city.y} r={2.5} fill="#f59e0b" opacity="0.9" />
            <text x={city.x} y={city.y + 5.5} textAnchor="middle" fontSize="2.6" fill="#92400e">{city.name}</text>
          </g>
        ))}

        {/* Northern cities */}
        {NORTH_CITIES.map((city, i) => (
          <g key={i}>
            <circle cx={city.x} cy={city.y} r={2.5} fill="#06b6d4" opacity="0.9" />
            <text x={city.x} y={city.y - 4} textAnchor="middle" fontSize="2.6" fill="#06b6d4">{city.name}</text>
          </g>
        ))}

        {/* Region labels */}
        <text x={50} y={96} textAnchor="middle" fontSize="4" fill="#92400e" fontWeight="bold">
          SOUTH — AGRARIAN ECONOMY
        </text>
        <text x={50} y={7} textAnchor="middle" fontSize="4" fill="#06b6d4" fontWeight="bold">
          NORTH — INDUSTRIAL ECONOMY
        </text>
      </svg>

      {/* Route counter badge */}
      <div className="absolute top-3 right-3 border border-slate-600 bg-slate-900/80 rounded-lg px-2.5 py-1.5 text-center">
        <div className="text-xs text-slate-500 tracking-wider">ROUTES</div>
        <div className={`text-lg font-black ${activeRoutes > 0 ? 'text-green-400' : 'text-slate-600'}`}>
          {activeRoutes}/{ROUTES.length}
        </div>
        <div className="text-xs text-slate-600">active</div>
      </div>
    </div>
  )
}

export default function Level4Slider({ isSolved, onSolved }) {
  const [value, setValue] = useState(0)
  const [locked, setLocked] = useState(false)
  const [localSolved, setLocalSolved] = useState(false)
  const onSolvedRef = useRef(onSolved)
  useEffect(() => { onSolvedRef.current = onSolved }, [onSolved])

  const THRESHOLD = 75
  const canLock = value >= THRESHOLD && !locked

  // Interpolated stats
  const railMiles    = Math.round(value * 350)
  const factoryCount = Math.round(value * 140)
  const farmDep      = Math.round(100 - value * 0.85)
  const freedWorkers = Math.round(value * 40000)

  function handleLock() {
    if (!canLock) return
    sounds.success()
    setLocked(true)
    setLocalSolved(true)
    setTimeout(() => onSolvedRef.current(), 1200)
  }

  function handleSlider(e) {
    if (locked || isSolved) return
    const v = Number(e.target.value)
    setValue(v)
    if (v % 10 === 0) sounds.tick()
  }

  const isWon = localSolved || isSolved

  // Slider fill color gradient based on value
  const sliderBg = `linear-gradient(to right, #92400e 0%, #d97706 ${value * 0.4}%, #06b6d4 ${value}%, #1e293b ${value}%)`

  return (
    <div className="flex flex-col gap-5 max-w-3xl mx-auto w-full">
      <div className="text-center">
        <p className="text-sm text-slate-300 leading-relaxed">
          Drag the slider from{' '}
          <span className="text-amber-400 font-bold">Southern Farm Reliance</span>{' '}
          all the way to{' '}
          <span className="text-cyan-400 font-bold">Northern Industry & Rail</span>.
          Watch the cargo routes come online!
        </p>
      </div>

      {/* Win banner */}
      {isWon && (
        <div className="border-2 border-green-500 bg-green-950/30 rounded-2xl px-8 py-4 text-center"
          style={{ boxShadow: '0 0 20px rgba(34,197,94,0.2)' }}>
          <div className="text-green-400 font-black text-xl tracking-wider">🚂 ECONOMIC SHIFT COMPLETE!</div>
          <div className="text-sm text-green-300/80 mt-1">
            The North's industrial boom permanently reshaped America's economy and connected the nation by rail.
          </div>
        </div>
      )}

      {/* GPS Map */}
      <RouteMap value={value} solved={isWon} />

      {/* Slider */}
      <div className="space-y-3">
        <div className="flex justify-between text-xs font-bold tracking-wider">
          <span className="text-amber-500">🌾 SOUTHERN FARM ECONOMY</span>
          <span className={`text-lg font-black ${value >= THRESHOLD ? 'text-green-400' : 'text-white'}`}>
            {value}%
          </span>
          <span className="text-cyan-400">NORTHERN INDUSTRY & RAIL 🏭</span>
        </div>

        <div className="relative">
          <input
            type="range"
            min={0}
            max={100}
            value={value}
            onChange={handleSlider}
            disabled={locked || isSolved}
            className="w-full h-4 rounded-full outline-none cursor-pointer appearance-none disabled:cursor-default"
            style={{
              background: sliderBg,
              WebkitAppearance: 'none',
            }}
          />
          {/* Threshold marker */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-white/30 pointer-events-none"
            style={{ left: `${THRESHOLD}%` }}
          />
          <div
            className="absolute -bottom-5 text-[10px] text-slate-600 tracking-wider"
            style={{ left: `${THRESHOLD}%`, transform: 'translateX(-50%)' }}
          >
            75% threshold
          </div>
        </div>
      </div>

      {/* Lock-in button */}
      <div className="flex justify-center pt-2">
        {!isWon && (
          <div className="text-center">
            {value < THRESHOLD ? (
              <div className="text-sm text-slate-500 border border-slate-700 rounded-xl px-6 py-3">
                Keep going — drag to at least{' '}
                <span className="text-amber-400 font-bold">75%</span>{' '}
                to complete the industrial shift
              </div>
            ) : (
              <button
                onClick={handleLock}
                className="px-10 py-3 border-2 border-cyan-400 text-cyan-400 font-black text-base rounded-xl
                           hover:bg-cyan-400/15 active:scale-95 transition-all tracking-wider animate-pulse"
                style={{ boxShadow: '0 0 20px rgba(6,182,212,0.25)' }}
              >
                🔒 COMMIT THE SHIFT →
              </button>
            )}
          </div>
        )}
      </div>

      {/* Live stats grid */}
      <div className="grid grid-cols-2 gap-3">
        <StatBar
          label="Southern Farm Reliance"
          value={farmDep}
          max={100}
          color="amber"
          unit="%"
        />
        <StatBar
          label="Northern Industry"
          value={value}
          max={100}
          color="cyan"
          unit="%"
        />
        <StatBar
          label="Rail Miles Built"
          value={railMiles}
          max={35000}
          color="green"
          unit=""
          display={railMiles.toLocaleString() + ' mi'}
        />
        <StatBar
          label="Factory Workers"
          value={freedWorkers}
          max={4000000}
          color="purple"
          unit=""
          display={freedWorkers.toLocaleString()}
        />
      </div>

      <style>{`
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: white;
          cursor: grab;
          box-shadow: 0 0 12px rgba(6,182,212,0.6), 0 2px 6px rgba(0,0,0,0.5);
          border: 2px solid #06b6d4;
          transition: transform 0.1s;
        }
        input[type=range]::-webkit-slider-thumb:active {
          cursor: grabbing;
          transform: scale(1.2);
        }
        input[type=range]:disabled::-webkit-slider-thumb {
          cursor: default;
          border-color: #22c55e;
          box-shadow: 0 0 12px rgba(34,197,94,0.6);
        }
      `}</style>
    </div>
  )
}

function StatBar({ label, value, max, color, unit, display }) {
  const pct = Math.min(100, (value / max) * 100)
  const colors = {
    amber:  { bar: 'bg-amber-500',  text: 'text-amber-400'  },
    cyan:   { bar: 'bg-cyan-500',   text: 'text-cyan-400'   },
    green:  { bar: 'bg-green-500',  text: 'text-green-400'  },
    purple: { bar: 'bg-purple-500', text: 'text-purple-400' },
  }
  const c = colors[color]

  return (
    <div className="border border-slate-700 bg-slate-900/40 rounded-xl p-3">
      <div className="flex justify-between items-baseline mb-2">
        <span className="text-xs text-slate-500 tracking-wide">{label}</span>
        <span className={`text-sm font-black ${c.text}`}>
          {display ?? (value + unit)}
        </span>
      </div>
      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
        <div
          className={`h-full ${c.bar} rounded-full transition-all duration-100`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
