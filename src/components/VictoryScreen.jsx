import { LEVELS } from '../gameData'

const TAG_STYLES = {
  SOCIETY:    'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40',
  GOVERNMENT: 'bg-purple-500/20 text-purple-400 border border-purple-500/40',
  ECONOMY:    'bg-amber-500/20 text-amber-400 border border-amber-500/40',
}

export default function VictoryScreen({ score, rank, unlockedClues, onReplay, onSelectLevel }) {
  return (
    <div className="min-h-screen bg-[#0f172a] font-mono flex flex-col items-center justify-start py-8 px-4">
      {/* Banner */}
      <div className="text-center mb-8">
        <div className="text-5xl mb-3">🏆</div>
        <h1 className="text-3xl font-bold tracking-widest neon-gold text-amber-400 mb-1">
          TIMELINE RESTORED!
        </h1>
        <p className="text-slate-400 text-sm tracking-wider">
          The Civil War's legacy is secured. History is safe.
        </p>
      </div>

      {/* Score + Rank */}
      <div className="flex gap-8 mb-8">
        <div className="text-center border border-amber-500 bg-amber-500/10 rounded-lg px-6 py-4 border-neon-gold">
          <div className="text-[10px] text-slate-500 tracking-widest mb-1">FINAL SCORE</div>
          <div className="text-3xl font-bold text-amber-400 neon-gold">{score.toLocaleString()}</div>
        </div>
        <div className="text-center border border-cyan-500 bg-cyan-500/10 rounded-lg px-6 py-4 border-neon-cyan">
          <div className="text-[10px] text-slate-500 tracking-widest mb-1">DETECTIVE RANK</div>
          <div className={`text-lg font-bold ${rank.color}`}>{rank.label.toUpperCase()}</div>
        </div>
      </div>

      {/* Civil War Stats */}
      <div className="w-full max-w-2xl mb-8">
        <h2 className="text-[11px] font-bold tracking-widest text-slate-500 mb-3">
          ── CIVIL WAR STATISTICS ──────────────────────
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="border border-red-500/40 bg-red-500/5 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-red-400 neon-red">620,000</div>
            <div className="text-[10px] text-slate-400 mt-1 tracking-wider">ESTIMATED CASUALTIES</div>
            <div className="text-[10px] text-slate-600 mt-1">Deadliest American conflict</div>
          </div>
          <div className="border border-green-500/40 bg-green-500/5 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-green-400 neon-green">4,000,000</div>
            <div className="text-[10px] text-slate-400 mt-1 tracking-wider">PEOPLE FREED</div>
            <div className="text-[10px] text-slate-600 mt-1">Via the 13th Amendment, 1865</div>
          </div>
        </div>
      </div>

      {/* Evidence Summary */}
      <div className="w-full max-w-2xl mb-8">
        <h2 className="text-[11px] font-bold tracking-widest text-slate-500 mb-3">
          ── EVIDENCE SUMMARY ──────────────────────────
        </h2>
        <div className="space-y-3">
          {LEVELS.map((lvl) => {
            const unlocked = unlockedClues.includes(lvl.id)
            return (
              <div
                key={lvl.id}
                className={`rounded border p-3 flex items-start gap-3
                  ${unlocked ? 'border-green-500/30 bg-green-500/5' : 'border-slate-700 opacity-40'}
                `}
              >
                <span className="text-green-400 text-lg mt-0.5">{unlocked ? '✓' : '○'}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-bold text-white">{lvl.clue.headline}</span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${TAG_STYLES[lvl.clue.tag] || ''}`}>
                      {lvl.clue.tag}
                    </span>
                  </div>
                  {unlocked && (
                    <p className="text-[11px] text-slate-400">{lvl.clue.body}</p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4 flex-wrap justify-center mb-8">
        <button
          onClick={onReplay}
          className="px-6 py-2.5 text-sm font-bold rounded border border-amber-400 text-amber-400
                     hover:bg-amber-400/10 transition-all tracking-widest"
        >
          ↺ REPLAY FULL GAME
        </button>
        <div className="flex gap-2 flex-wrap justify-center">
          {LEVELS.map((lvl, i) => (
            <button
              key={lvl.id}
              onClick={() => onSelectLevel(i)}
              className="px-3 py-2 text-xs font-bold rounded border border-slate-600 text-slate-400
                         hover:border-cyan-400 hover:text-cyan-400 transition-all"
            >
              L{lvl.id}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
