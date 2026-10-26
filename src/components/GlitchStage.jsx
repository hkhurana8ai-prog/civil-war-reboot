import { useEffect, useRef } from 'react'
import { sounds } from '../sounds'
import GlitchedItem from './GlitchedItem'
import Level1Wire from './levels/Level1Wire'
import Level2DragDrop from './levels/Level2DragDrop'
import Level3Matching from './levels/Level3Matching'
import Level4Slider from './levels/Level4Slider'
import Level5Map from './levels/Level5Map'

const LEVEL_COMPONENTS = {
  1: Level1Wire,
  2: Level2DragDrop,
  3: Level3Matching,
  4: Level4Slider,
  5: Level5Map,
}

export default function GlitchStage({ levelData, isSolved, onSolved, onNextLevel, isLastLevel, allDone, onViewResults }) {
  const prevSolved = useRef(isSolved)

  useEffect(() => {
    if (!prevSolved.current && isSolved) {
      sounds.unlock()
    }
    prevSolved.current = isSolved
  }, [isSolved])

  const LevelComponent = LEVEL_COMPONENTS[levelData.id]

  return (
    <section className="flex-1 flex flex-col border border-slate-700 rounded-lg bg-[#1e293b] overflow-hidden min-w-0">
      {/* Stage header */}
      <div className="px-4 py-2.5 border-b border-slate-700 bg-[#162032] flex items-center justify-between flex-shrink-0">
        <div>
          <h2 className="text-xs font-bold tracking-widest text-amber-400 neon-gold">
            ⚠ GLITCH STAGE
          </h2>
          <p className="text-[10px] text-slate-500 mt-0.5">
            Level {levelData.id} of 5 — {levelData.title}
          </p>
        </div>
        <span className={`text-[10px] font-bold px-2 py-1 rounded border transition-all
          ${isSolved
            ? 'border-green-500 text-green-400 bg-green-500/10'
            : 'border-red-500 text-red-400 bg-red-500/10 animate-flicker'
          }`}
        >
          {isSolved ? '✓ GLITCH FIXED' : '● GLITCH ACTIVE'}
        </span>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Broken item visual */}
        <GlitchedItem levelId={levelData.id} isSolved={isSolved} />

        {/* Objective label */}
        {!isSolved && (
          <div className="mb-4 text-center">
            <div className="inline-block border border-amber-500/40 bg-amber-500/5 rounded px-3 py-1">
              <span className="text-amber-400 text-[10px] font-bold tracking-widest">
                OBJECTIVE: FIX THE {levelData.glitchedItem.toUpperCase()}
              </span>
            </div>
          </div>
        )}

        {/* Level puzzle */}
        {LevelComponent ? (
          <LevelComponent
            isSolved={isSolved}
            onSolved={() => onSolved(levelData.points)}
          />
        ) : (
          <div className="text-slate-500 text-center mt-8 text-sm">Loading puzzle...</div>
        )}
      </div>

      {/* Bottom navigation */}
      {isSolved && (
        <div className="border-t border-slate-700 px-4 py-3 flex justify-between items-center bg-[#162032] flex-shrink-0">
          <div>
            <span className="text-xs text-green-400 font-bold">+{levelData.points} pts</span>
            <span className="text-[10px] text-slate-600 ml-2">Evidence logged in notebook →</span>
          </div>
          <div className="flex gap-2">
            {!isLastLevel && (
              <button
                onClick={() => { sounds.click(); onNextLevel() }}
                className="px-4 py-2 text-xs font-bold rounded border border-cyan-400 text-cyan-400
                           hover:bg-cyan-400/10 transition-all tracking-widest active:scale-95"
              >
                NEXT LEVEL →
              </button>
            )}
            {isLastLevel && allDone && (
              <button
                onClick={() => { sounds.success(); onViewResults() }}
                className="px-4 py-2 text-xs font-bold rounded border border-amber-400 text-amber-400
                           hover:bg-amber-400/10 transition-all tracking-widest animate-pulse active:scale-95"
              >
                VIEW RESULTS ★
              </button>
            )}
          </div>
        </div>
      )}
    </section>
  )
}
