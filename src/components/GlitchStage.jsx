import { useEffect, useRef, useState } from 'react'
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

const COMPLETE_MESSAGES = {
  1: 'Live news reporting restored!',
  2: '4 million people freed — forever.',
  3: 'Gender barriers broken — careers unlocked.',
  4: 'Industrial economy secured.',
  5: 'The Union stands — secession defeated!',
}

export default function GlitchStage({ levelData, isSolved, onSolved, onNextLevel, isLastLevel, allDone, onViewResults }) {
  const prevSolved = useRef(isSolved)
  const [showComplete, setShowComplete] = useState(false)

  useEffect(() => {
    if (!prevSolved.current && isSolved) {
      sounds.unlock()
      setShowComplete(true)
      setTimeout(() => setShowComplete(false), 2000)
    }
    prevSolved.current = isSolved
  }, [isSolved])

  const LevelComponent = LEVEL_COMPONENTS[levelData.id]

  return (
    <section className="flex flex-col h-full relative">

      {/* Level-complete celebration overlay */}
      {showComplete && (
        <div className="absolute inset-0 z-30 flex items-center justify-center"
          style={{ background: 'rgba(5, 30, 15, 0.92)', backdropFilter: 'blur(6px)' }}>
          <div className="text-center px-8">
            <div className="text-8xl mb-5 animate-pop">✅</div>
            <div
              className="font-black text-green-400 tracking-widest mb-3 neon-green"
              style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}
            >
              GLITCH FIXED!
            </div>
            <div className="text-xl text-green-300/80 mb-2">{levelData.title}</div>
            <div className="text-base text-slate-400">{COMPLETE_MESSAGES[levelData.id]}</div>
            <div className="mt-5 text-sm text-green-500 font-bold tracking-widest animate-flicker">
              +{levelData.points} pts — Evidence logged in notebook
            </div>
          </div>
        </div>
      )}

      {/* Stage header */}
      <div className="px-6 py-3 border-b border-slate-700 bg-[#0c1628] flex items-center justify-between flex-shrink-0">
        <div>
          <h2 className="text-xs font-bold tracking-widest text-amber-400">
            ⚠ GLITCH STAGE — LEVEL {levelData.id} OF 5
          </h2>
          <p className="text-xl font-black text-white mt-0.5">{levelData.title}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-all
            ${isSolved
              ? 'border-green-500 text-green-400 bg-green-500/10'
              : 'border-red-500 text-red-400 bg-red-500/10 animate-flicker'
            }`}
          >
            {isSolved ? '✓ GLITCH FIXED' : '● GLITCH ACTIVE'}
          </span>
          <span className="text-xs text-slate-600 border border-slate-700 rounded px-2 py-1">
            +{levelData.points} pts
          </span>
        </div>
      </div>

      {/* Scrollable puzzle area */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-6 pt-5 pb-3">
          <GlitchedItem levelId={levelData.id} isSolved={isSolved} />
          {!isSolved && (
            <div className="text-center mt-2 mb-4">
              <div className="inline-flex items-center gap-2 border border-red-500/30 bg-red-500/5 rounded-lg px-4 py-1.5">
                <span className="text-red-400 text-xs animate-flicker">●</span>
                <span className="text-red-300 text-xs font-bold tracking-wider">
                  {levelData.glitchMessage} — REPAIR REQUIRED
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="px-6 pb-8">
          {LevelComponent ? (
            <LevelComponent
              isSolved={isSolved}
              onSolved={() => onSolved(levelData.points)}
            />
          ) : (
            <div className="text-slate-500 text-center mt-12 text-sm">Loading puzzle...</div>
          )}
        </div>
      </div>

      {/* Navigation footer */}
      {isSolved && !showComplete && (
        <div className="border-t border-slate-700 px-6 py-3 flex justify-between items-center bg-[#0c1628] flex-shrink-0">
          <div className="text-sm text-green-400 font-bold">
            +{levelData.points} pts — Evidence logged →
          </div>
          <div className="flex gap-3">
            {!isLastLevel && (
              <button
                onClick={() => { sounds.click(); onNextLevel() }}
                className="px-5 py-2 text-sm font-bold rounded-xl border-2 border-cyan-400 text-cyan-400
                           hover:bg-cyan-400/10 transition-all tracking-wider active:scale-95"
              >
                NEXT LEVEL →
              </button>
            )}
            {isLastLevel && allDone && (
              <button
                onClick={() => { sounds.success(); onViewResults() }}
                className="px-5 py-2 text-sm font-bold rounded-xl border-2 border-amber-400 text-amber-400
                           hover:bg-amber-400/10 transition-all tracking-wider active:scale-95"
                style={{ boxShadow: '0 0 16px rgba(245,158,11,0.25)', animation: 'pulse_gold 1.5s ease-in-out infinite' }}
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
