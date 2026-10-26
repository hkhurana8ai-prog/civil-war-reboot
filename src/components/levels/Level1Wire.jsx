import { useState, useEffect, useCallback, useRef } from 'react'
import { sounds } from '../../sounds'

// Directions: 0=N, 1=E, 2=S, 3=W
const OPPOSITE = [2, 3, 0, 1]

const BASE_CONNS = {
  source:   [1],
  target:   [3],
  straight: [0, 2],
  elbow:    [0, 1],
  tee:      [0, 1, 2],
  cross:    [0, 1, 2, 3],
}

function getConns(type, rot) {
  const base = BASE_CONNS[type] ?? []
  if (type === 'source' || type === 'target' || type === 'cross') return base
  return base.map(d => (d + rot) % 4)
}

// SVG paths at rotation=0. CSS rotation on the <svg> element handles other orientations.
const SVG_PATH = {
  straight: 'M 20 3 L 20 37',
  elbow:    'M 20 3 L 20 20 L 37 20',
  tee:      'M 20 3 L 20 37 M 20 20 L 37 20',
  cross:    'M 20 3 L 20 37 M 3 20 L 37 20',
  source:   'M 20 20 L 37 20',
  target:   'M 3 20 L 20 20',
}

// Grid: t=type, r=logical rotation (0-3), d=visual degrees (accumulates so rotation always goes forward)
// Source at (2,0) opens East. Target at (2,4) opens West.
// Designed so NO path exists at initial rotations, but 3 valid paths exist:
//   Middle:  rotate (2,1)→r1, (2,3)→r3
//   Top:     rotate (2,1)→r2, (0,1)→r1, (0,3)→r2, (2,3)→r3
//   Bottom:  rotate (2,1)→r1, (4,3)→r3, (2,3)→r1
const INITIAL = [
  [{t:'elbow',r:0,d:0},   {t:'elbow',r:0,d:0},   {t:'straight',r:1,d:90}, {t:'elbow',r:0,d:0},   {t:'elbow',r:3,d:270}],
  [{t:'straight',r:0,d:0},{t:'straight',r:0,d:0}, {t:'cross',r:0,d:0},    {t:'straight',r:0,d:0},{t:'straight',r:0,d:0}],
  [{t:'source',r:0,d:0},  {t:'tee',r:0,d:0},      {t:'cross',r:0,d:0},    {t:'tee',r:2,d:180},   {t:'target',r:0,d:0}],
  [{t:'straight',r:0,d:0},{t:'straight',r:0,d:0}, {t:'cross',r:0,d:0},    {t:'straight',r:0,d:0},{t:'straight',r:0,d:0}],
  [{t:'elbow',r:3,d:270}, {t:'elbow',r:0,d:0},    {t:'straight',r:1,d:90},{t:'elbow',r:1,d:90},  {t:'elbow',r:2,d:180}],
]

function makeGrid() {
  return INITIAL.map(row => row.map(c => ({ ...c })))
}

function computeConnected(grid) {
  const seen = new Set(['2,0'])
  const q = [[2, 0]]
  const dirs = [[-1,0,0],[0,1,1],[1,0,2],[0,-1,3]]
  while (q.length) {
    const [r, c] = q.shift()
    const conns = getConns(grid[r][c].t, grid[r][c].r)
    for (const [dr, dc, dir] of dirs) {
      if (!conns.includes(dir)) continue
      const nr = r + dr, nc = c + dc
      if (nr < 0 || nr >= 5 || nc < 0 || nc >= 5) continue
      const key = `${nr},${nc}`
      if (seen.has(key)) continue
      if (getConns(grid[nr][nc].t, grid[nr][nc].r).includes(OPPOSITE[dir])) {
        seen.add(key)
        q.push([nr, nc])
      }
    }
  }
  return seen
}

function WireTile({ cell, lit, onClick }) {
  const { t, r, d } = cell
  const isFixed = t === 'source' || t === 'target'
  const isSource = t === 'source'
  const isTarget = t === 'target'
  const wireColor = lit ? '#22c55e' : '#475569'

  return (
    <div
      onClick={!isFixed ? onClick : undefined}
      className={[
        'w-10 h-10 rounded border select-none relative',
        isFixed ? 'cursor-default' :
          'cursor-pointer active:scale-90 transition-transform duration-75',
        isSource ? 'border-cyan-500/60 bg-cyan-950' :
        isTarget ? (lit ? 'border-green-500/60 bg-green-950' : 'border-amber-500/60 bg-amber-950') :
        lit ? 'border-green-700/50 bg-green-950/60' :
        'border-slate-700 bg-[#0a0f1e] hover:border-slate-500',
      ].join(' ')}
    >
      {lit && !isFixed && (
        <div className="absolute inset-0 rounded pointer-events-none"
          style={{ boxShadow: '0 0 6px rgba(34,197,94,0.25)' }} />
      )}
      <svg
        viewBox="0 0 40 40"
        className="w-full h-full"
        style={{
          transform: `rotate(${isFixed ? r * 90 : d}deg)`,
          transition: isFixed ? 'none' : 'transform 0.14s ease',
          transformOrigin: '50% 50%',
        }}
      >
        <path
          d={SVG_PATH[t]}
          stroke={wireColor}
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          style={{ transition: 'stroke 0.2s' }}
        />
        {/* Center dot for multi-connection tiles */}
        {!isFixed && (
          <circle cx={20} cy={20} r={4} fill={wireColor}
            style={{ transition: 'fill 0.2s' }} />
        )}
        {isSource && (
          <>
            <circle cx={20} cy={20} r={8} fill="#0e7490" />
            <text x={20} y={20.5} textAnchor="middle" dominantBaseline="middle"
              fontSize="9" fontWeight="bold" fill="white" fontFamily="monospace">S</text>
          </>
        )}
        {isTarget && (
          <>
            <circle cx={20} cy={20} r={8} fill={lit ? '#166534' : '#92400e'}
              style={{ transition: 'fill 0.3s' }} />
            <text x={20} y={20.5} textAnchor="middle" dominantBaseline="middle"
              fontSize="8" fontWeight="bold" fill="white" fontFamily="monospace">P</text>
          </>
        )}
      </svg>
    </div>
  )
}

export default function Level1Wire({ isSolved, onSolved }) {
  const [grid, setGrid] = useState(makeGrid)
  const [connected, setConnected] = useState(() => computeConnected(makeGrid()))
  const [moves, setMoves] = useState(0)
  const [localSolved, setLocalSolved] = useState(false)
  const calledRef = useRef(false)
  const onSolvedRef = useRef(onSolved)
  useEffect(() => { onSolvedRef.current = onSolved }, [onSolved])

  useEffect(() => {
    const conn = computeConnected(grid)
    setConnected(conn)
    if (conn.has('2,4') && !localSolved && !calledRef.current) {
      calledRef.current = true
      setTimeout(() => {
        sounds.success()
        setLocalSolved(true)
        setTimeout(() => onSolvedRef.current(), 1100)
      }, 60)
    }
  }, [grid])

  const handleClick = useCallback((ri, ci) => {
    if (localSolved || isSolved) return
    sounds.click()
    setGrid(prev => {
      const next = prev.map(row => row.map(c => ({ ...c })))
      const cell = next[ri][ci]
      cell.r = (cell.r + 1) % 4
      cell.d = cell.d + 90
      return next
    })
    setMoves(m => m + 1)
  }, [localSolved, isSolved])

  const handleReset = () => {
    sounds.click()
    const g = makeGrid()
    setGrid(g)
    setConnected(computeConnected(g))
    setMoves(0)
    setLocalSolved(false)
    calledRef.current = false
  }

  const isWon = localSolved || isSolved

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="text-center">
        <p className="text-xs text-slate-400">
          Click tiles to rotate. Connect{' '}
          <span className="text-cyan-400 font-bold">SOURCE [S]</span>
          {' '}to the{' '}
          <span className="text-amber-400 font-bold">PRINTING PRESS [P]</span>
        </p>
        <p className="text-[10px] text-slate-600 mt-0.5">
          Multiple paths exist — find any route through the wires
        </p>
      </div>

      {isWon && (
        <div className="border border-green-500 bg-green-950/40 rounded-lg px-6 py-2 text-center"
          style={{ boxShadow: '0 0 14px rgba(34,197,94,0.2)' }}>
          <div className="text-green-400 font-bold text-sm tracking-wider">⚡ CIRCUIT COMPLETE!</div>
          <div className="text-[10px] text-green-300/70 mt-0.5">
            Telegraph lines restored — live news is back online!
          </div>
        </div>
      )}

      <div className="flex items-center gap-4">
        <div className="text-right w-16">
          <div className="text-[9px] font-bold text-cyan-400 tracking-wider">SOURCE</div>
          <div className="text-[8px] text-slate-600">Telegraph</div>
        </div>

        {/* Circuit board background */}
        <div
          className="grid gap-1 p-2.5 rounded-xl border border-slate-800"
          style={{
            gridTemplateColumns: 'repeat(5, 2.5rem)',
            background: 'radial-gradient(circle at 50% 50%, #050d1a, #020810)',
          }}
        >
          {grid.map((row, ri) =>
            row.map((cell, ci) => (
              <WireTile
                key={`${ri}-${ci}`}
                cell={cell}
                lit={connected.has(`${ri},${ci}`)}
                onClick={() => handleClick(ri, ci)}
              />
            ))
          )}
        </div>

        <div className="w-16">
          <div className="text-[9px] font-bold text-amber-400 tracking-wider">PRESS</div>
          <div className="text-[8px] text-slate-600">Printing</div>
        </div>
      </div>

      <div className="flex items-center gap-6 text-[10px] text-slate-500">
        <span>Rotations: <span className="text-slate-200 font-bold">{moves}</span></span>
        {!isWon && (
          <button onClick={handleReset}
            className="px-3 py-1 border border-slate-700 rounded hover:border-slate-500 hover:text-slate-300 transition-all">
            ↺ Reset
          </button>
        )}
      </div>

      <div className="flex gap-6 text-[9px] text-slate-700">
        <span className="flex items-center gap-1.5">
          <span className="w-4 h-0.5 bg-slate-600 rounded inline-block" />
          Disconnected
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-4 h-0.5 bg-green-500 rounded inline-block" />
          Connected to source
        </span>
      </div>
    </div>
  )
}
