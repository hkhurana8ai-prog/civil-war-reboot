import { LEVELS } from '../gameData'

const TAG_STYLES = {
  SOCIETY:    'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40',
  GOVERNMENT: 'bg-purple-500/20 text-purple-400 border border-purple-500/40',
  ECONOMY:    'bg-amber-500/20 text-amber-400 border border-amber-500/40',
}

export default function DetectiveNotebook({ levels, unlockedClues, currentLevelId }) {
  return (
    <div className="flex flex-col h-full bg-[#0c1424]">
      <div className="px-4 py-3 border-b border-slate-700 flex-shrink-0">
        <h2 className="text-sm font-black tracking-widest text-cyan-400 neon-cyan">
          📒 DETECTIVE NOTEBOOK
        </h2>
        <p className="text-xs text-slate-600 mt-1">Solve puzzles to unlock evidence</p>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {levels.map((lvl) => {
          const unlocked = unlockedClues.includes(lvl.id)
          const isCurrent = lvl.id === currentLevelId
          return (
            <div
              key={lvl.id}
              className={`rounded-xl border p-3 transition-all duration-500
                ${unlocked
                  ? 'border-green-500/40 bg-green-500/5'
                  : isCurrent
                    ? 'border-cyan-500/40 bg-cyan-500/5'
                    : 'border-slate-700/60 bg-slate-800/20 opacity-50'
                }
              `}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-400 tracking-wider">
                  LVL {lvl.id}
                </span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded ${TAG_STYLES[lvl.clue.tag] || ''}`}>
                  {lvl.clue.tag}
                </span>
              </div>

              {unlocked ? (
                <>
                  <h3 className="text-sm font-black text-white mb-1.5 leading-snug">
                    {lvl.clue.headline}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {lvl.clue.body}
                  </p>
                  <div className="mt-2 text-xs text-green-400 font-bold tracking-wider">
                    ✓ EVIDENCE LOGGED
                  </div>
                </>
              ) : (
                <div className="text-center py-2">
                  <div className="text-2xl mb-1">🔒</div>
                  <p className="text-xs text-slate-500">
                    {isCurrent ? 'Solve this level to unlock' : `Complete Level ${lvl.id}`}
                  </p>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
