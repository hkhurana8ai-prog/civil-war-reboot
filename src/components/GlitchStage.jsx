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
  const LevelComponent = LEVEL_COMPONENTS[levelData.id]

  return (
    <section className="flex-1 flex flex-col border border-slate-700 rounded-lg bg-[#1e293b] overflow-hidden">
      {/* Stage header */}
      <div className="px-4 py-2.5 border-b border-slate-700 bg-[#162032] flex items-center justify-between">
        <div>
          <h2 className="text-xs font-bold tracking-widest text-amber-400 neon-gold">
            ⚠ GLITCH STAGE
          </h2>
          <p className="text-[10px] text-slate-500 mt-0.5">
            Level {levelData.id}: {levelData.title}
          </p>
        </div>
        <span className={`text-[10px] font-bold px-2 py-1 rounded border
          ${isSolved
            ? 'border-green-500 text-green-400 bg-green-500/10'
            : 'border-amber-500 text-amber-400 bg-amber-500/10 animate-flicker'
          }`}
        >
          {isSolved ? '✓ GLITCH FIXED' : '● GLITCH DETECTED'}
        </span>
      </div>

      {/* Glitch label on the broken object */}
      {!isSolved && (
        <div className="mx-4 mt-4 text-center">
          <div className="inline-block border border-red-500 bg-red-500/10 rounded px-3 py-1.5 animate-glitch">
            <span className="text-red-400 text-xs font-bold tracking-widest neon-red">
              [{levelData.glitchedItem.toUpperCase()}] {levelData.glitchMessage}
            </span>
          </div>
        </div>
      )}

      {/* Level puzzle */}
      <div className="flex-1 overflow-auto p-4">
        {LevelComponent ? (
          <LevelComponent
            isSolved={isSolved}
            onSolved={() => onSolved(levelData.points)}
          />
        ) : (
          <div className="text-slate-500 text-center mt-8">Loading puzzle...</div>
        )}
      </div>

      {/* Navigation */}
      {isSolved && (
        <div className="border-t border-slate-700 px-4 py-3 flex justify-between items-center bg-[#162032]">
          <span className="text-xs text-green-400 font-bold">+{levelData.points} pts earned</span>
          {!isLastLevel ? (
            <button
              onClick={onNextLevel}
              className="px-4 py-2 text-xs font-bold rounded border border-cyan-400 text-cyan-400
                         hover:bg-cyan-400/10 transition-all tracking-widest"
            >
              NEXT LEVEL →
            </button>
          ) : allDone ? (
            <button
              onClick={onViewResults}
              className="px-4 py-2 text-xs font-bold rounded border border-amber-400 text-amber-400
                         hover:bg-amber-400/10 transition-all tracking-widest animate-pulse"
            >
              VIEW RESULTS ★
            </button>
          ) : null}
        </div>
      )}
    </section>
  )
}
