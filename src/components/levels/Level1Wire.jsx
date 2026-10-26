import { useState, useEffect, useCallback, useRef } from 'react'
import { sounds } from '../../sounds'

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

// SVG wire paths at rotation=0
const SVG_PATH = {
  straight: 'M 32 4 L 32 60',
  elbow:    'M 32 4 L 32 32 L 60 32',
  tee:      'M 32 4 L 32 60 M 32 32 L 60 32',
  cross:    'M 32 4 L 32 60 M 4 32 L 60 32',
  source:   'M 32 32 L 60 32',
  target:   'M 4 32 L 32 32',
}

// Grid: source at (2,0) opens East, target at (2,4) opens West
// Initial state has no valid path — 3 solutions exist after rotations
const INITIAL = [
  [{t:'elbow',r:0,d:0},{t:'elbow',r:0,d:0},{t:'straight',r:1,d:90},{t:'elbow',r:0,d:0},{t:'elbow',r:3,d:270}],
  [{t:'straight',r:0,d:0},{t:'straight',r:0,d:0},{t:'cross',r:0,d:0},{t:'straight',r:0,d:0},{t:'straight',r:0,d:0}],
  [{t:'source',r:0,d:0},{t:'tee',r:0,d:0},{t:'cross',r:0,d:0},{t:'tee',r:2,d:180},{t:'target',r:0,d:0}],
  [{t:'straight',r:0,d:0},{t:'straight',r:0,d:0},{t:'cross',r:0,d:0},{t:'straight',r:0,d:0},{t:'straight',r:0,d:0}],
  [{t:'elbow',r:3,d:270},{t:'elbow',r:0,d:0},{t:'straight',r:1,d:90},{t:'elbow',r:1,d:90},{t:'elbow',r:2,d:180}],
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
  const wireColor = lit ? '#22c55e' : '#334155'
  const glowColor = isSource ? '#06b6d4' : isTarget && lit ? '#22c55e' : isTarget ? '#f59e0b' : null

  return (
    <div
      onClick={!isFixed ? onClick : undefined}
      className={[
        'w-16 h-16 rounded-lg border-2 select-none relative transition-colors duration-200',
        isFixed ? 'cursor-default' : 'cursor-pointer active:scale-90 hover:brightness-125 transition-all duration-75',
        isSource ? 'border-cyan-500 bg-cyan-950/60' :
        isTarget ? (lit ? 'border-green-500 bg-green-950/60' : 'border-amber-500 bg-amber-950/60') :
        lit ? 'border-green-700/60 bg-green-950/40' :
        'border-slate-700 bg-[#080e1c] hover:border-slate-500',
      ].join(' ')}
      style={glowColor ? { boxShadow: `0 0 12px ${glowColor}40` } : undefined}
    >
      {lit && !isFixed && (
        <div className="absolute inset-0 rounded-lg pointer-events-none"
          style={{ boxShadow: '0 0 10px rgba(34,197,94,0.2)' }} />
      )}
      <svg
        viewBox="0 0 64 64"
        className="w-full h-full"
        style={{
          transform: `rotate(${isFixed ? r * 90 : d}deg)`,
          transition: isFixed ? 'none' : 'transform 0.15s ease',
          transformOrigin: '50% 50%',
        }}
      >
        <path
          d={SVG_PATH[t]}
          stroke={wireColor}
          strokeWidth="7"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          style={{ transition: 'stroke 0.2s' }}
        />
        {!isFixed && (
          <circle cx={32} cy={32} r={5} fill={wireColor} style={{ transition: 'fill 0.2s' }} />
        )}
        {isSource && (
          <>
            <circle cx={32} cy={32} r={12} fill="#0e7490" />
            <text x={32} y={32.5} textAnchor="middle" dominantBaseline="middle"
              fontSize="13" fontWeight="bold" fill="white" fontFamily="monospace">S</text>
          </>
        )}
        {isTarget && (
          <>
            <circle cx={32} cy={32} r={12} fill={lit ? '#166534' : '#92400e'}
              style={{ transition: 'fill 0.3s' }} />
            <text x={32} y={32.5} textAnchor="middle" dominantBaseline="middle"
              fontSize="11" fontWeight="bold" fill="white" fontFamily="monospace">P</text>
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
    <div className="flex flex-col items-center gap-5 py-2">
      {/* Instructions */}
      <div className="text-center max-w-lg">
        <p className="text-sm text-slate-300 leading-relaxed">
          The telegraph network is down —{' '}
          <span className="text-amber-400 font-bold">click tiles to rotate them</span>{' '}
          and build a wire path from the{' '}
          <span className="text-cyan-400 font-bold">SOURCE [S]</span>{' '}
          to the{' '}
          <span className="text-amber-400 font-bold">PRINTING PRESS [P]</span>.
        </p>
        <p className="text-xs text-slate-600 mt-1">Multiple paths work — find any route!</p>
      </div>

      {/* Win banner */}
      {isWon && (
        <div className="border-2 border-green-500 bg-green-950/40 rounded-xl px-8 py-3 text-center w-full max-w-lg"
          style={{ boxShadow: '0 0 20px rgba(34,197,94,0.25)' }}>
          <div className="text-green-400 font-black text-lg tracking-wider">⚡ CIRCUIT COMPLETE!</div>
          <div className="text-sm text-green-300/80 mt-1">
            Telegraph lines restored — live war reporting is back online!
          </div>
        </div>
      )}

      {/* Grid with labels */}
      <div className="flex items-center gap-6">
        <div className="text-right">
          <div className="text-xs font-black text-cyan-400 tracking-wider uppercase">Source</div>
          <div className="text-[10px] text-slate-600">Telegraph</div>
          <div className="text-[10px] text-slate-700 mt-1">▶</div>
        </div>

        <div
          className="grid gap-1.5 p-3 rounded-2xl border-2 border-slate-800"
          style={{
            gridTemplateColumns: 'repeat(5, 4rem)',
            background: 'radial-gradient(ellipse at center, #060d1c, #020810)',
            boxShadow: 'inset 0 0 30px rgba(0,0,0,0.5)',
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

        <div>
          <div className="text-xs font-black text-amber-400 tracking-wider uppercase">Press</div>
          <div className="text-[10px] text-slate-600">Printing</div>
          <div className="text-[10px] text-slate-700 mt-1">◀</div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-6 text-sm text-slate-500">
        <span>
          Rotations:{' '}
          <span className="text-white font-bold text-base">{moves}</span>
        </span>
        {!isWon && (
          <button
            onClick={handleReset}
            className="px-4 py-1.5 border border-slate-700 rounded-lg hover:border-slate-500 hover:text-slate-300 transition-all text-xs"
          >
            ↺ Reset Puzzle
          </button>
        )}
      </div>

      {/* Legend */}
      <div className="flex gap-8 text-xs text-slate-600">
        <span className="flex items-center gap-2">
          <span className="w-6 h-0.5 bg-slate-600 rounded inline-block" />
          Not connected
        </span>
        <span className="flex items-center gap-2">
          <span className="w-6 h-0.5 bg-green-500 rounded inline-block" />
          Connected to source
        </span>
      </div>
    </div>
  )
}
