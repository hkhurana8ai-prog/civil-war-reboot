import { LEVELS } from '../gameData'

export default function Header({ currentLevel, totalLevels, score, rank, solvedLevels, replayMode, onSelectLevel }) {
  return (
    <header className="border-b border-slate-700 bg-[#0c1424] px-4 py-3 flex items-center justify-between gap-4 flex-wrap">
      {/* Title */}
      <div className="flex flex-col">
        <h1 className="text-lg font-bold tracking-widest neon-cyan text-cyan-400 leading-tight">
          ⚡ CIVIL WAR REBOOT
        </h1>
        <span className="text-[10px] text-slate-500 tracking-wider">TIME DETECTIVE AGENCY</span>
      </div>

      {/* Level pills */}
      <div className="flex gap-1.5 flex-wrap">
        {LEVELS.map((lvl, i) => {
          const solved = solvedLevels.includes(lvl.id)
          const active = i === currentLevel
          const canClick = replayMode || solved || i <= Math.max(...solvedLevels.map(id => LEVELS.findIndex(l => l.id === id)), -1) + 1
          return (
            <button
              key={lvl.id}
              onClick={() => canClick && onSelectLevel(i)}
              title={lvl.title}
              className={`px-2.5 py-1 text-[11px] rounded border transition-all font-mono
                ${active ? 'border-cyan-400 text-cyan-400 bg-cyan-400/10 border-neon-cyan' : ''}
                ${solved && !active ? 'border-green-500 text-green-400' : ''}
                ${!solved && !active ? 'border-slate-700 text-slate-500' : ''}
                ${canClick ? 'cursor-pointer hover:opacity-80' : 'cursor-default opacity-40'}
              `}
            >
              {solved ? '✓' : `L${lvl.id}`}
            </button>
          )
        })}
      </div>

      {/* Score + Rank */}
      <div className="flex items-center gap-4 text-right">
        <div>
          <div className="text-[10px] text-slate-500 tracking-widest">SCORE</div>
          <div className="text-xl font-bold neon-gold text-amber-400">{score.toLocaleString()}</div>
        </div>
        <div className="border-l border-slate-700 pl-4">
          <div className="text-[10px] text-slate-500 tracking-widest">RANK</div>
          <div className={`text-sm font-bold ${rank.color} tracking-wide`}>{rank.label.toUpperCase()}</div>
        </div>
      </div>
    </header>
  )
}
