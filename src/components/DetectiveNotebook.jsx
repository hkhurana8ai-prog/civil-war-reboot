import { LEVELS } from '../gameData'

const TAG_STYLES = {
  SOCIETY:    'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40',
  GOVERNMENT: 'bg-purple-500/20 text-purple-400 border border-purple-500/40',
  ECONOMY:    'bg-amber-500/20 text-amber-400 border border-amber-500/40',
}

export default function DetectiveNotebook({ levels, unlockedClues, currentLevelId }) {
  return (
    <aside className="w-72 flex-shrink-0 flex flex-col border border-slate-700 rounded-lg bg-[#1e293b] overflow-hidden border-neon-cyan">
      <div className="px-4 py-2.5 border-b border-slate-700 bg-[#162032]">
        <h2 className="text-xs font-bold tracking-widest text-cyan-400 neon-cyan">
          📒 DETECTIVE NOTEBOOK
        </h2>
        <p className="text-[10px] text-slate-500 mt-0.5">Solve puzzles to unlock evidence</p>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {levels.map((lvl) => {
          const unlocked = unlockedClues.includes(lvl.id)
          const isCurrent = lvl.id === currentLevelId
          return (
            <div
              key={lvl.id}
              className={`rounded border p-3 transition-all duration-500
                ${unlocked
                  ? 'border-green-500/40 bg-green-500/5 border-neon-green'
                  : isCurrent
                    ? 'border-cyan-500/40 bg-cyan-500/5 animate-pulse'
                    : 'border-slate-700 bg-slate-800/30 opacity-50'
                }
              `}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold text-slate-400 tracking-wider">
                  LEVEL {lvl.id}
                </span>
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${TAG_STYLES[lvl.clue.tag] || ''}`}>
                  {lvl.clue.tag}
                </span>
              </div>

              {unlocked ? (
                <>
                  <h3 className="text-xs font-bold text-white mb-1 leading-tight">
                    {lvl.clue.headline}
                  </h3>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    {lvl.clue.body}
                  </p>
                  <div className="mt-2 text-[9px] text-green-400 font-bold tracking-widest">
                    ✓ EVIDENCE LOGGED
                  </div>
                </>
              ) : (
                <div className="text-center py-2">
                  <div className="text-2xl mb-1">🔒</div>
                  <p className="text-[10px] text-slate-500">
                    {isCurrent ? 'Solve this level to unlock' : `Complete Level ${lvl.id}`}
                  </p>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </aside>
  )
}
