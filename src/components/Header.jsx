import { useEffect, useRef, useState } from 'react'
import { LEVELS } from '../gameData'
import { sounds } from '../sounds'

function AnimatedScore({ score }) {
  const [display, setDisplay] = useState(score)
  const prev = useRef(score)

  useEffect(() => {
    if (score === prev.current) return
    const diff = score - prev.current
    const steps = 20
    const stepVal = diff / steps
    let i = 0
    const id = setInterval(() => {
      i++
      setDisplay(Math.round(prev.current + stepVal * i))
      if (i >= steps) { clearInterval(id); setDisplay(score); prev.current = score }
    }, 30)
    return () => clearInterval(id)
  }, [score])

  return <span>{display.toLocaleString()}</span>
}

const RANK_ICONS = {
  'Rookie Inspector':  '🔍',
  'Field Agent':       '🕵️',
  'Senior Detective':  '⭐',
  'Master Detective':  '🏆',
}

export default function Header({ currentLevel, totalLevels, score, rank, solvedLevels, replayMode, onSelectLevel }) {
  const maxUnlocked = solvedLevels.length > 0
    ? Math.max(...solvedLevels.map(id => LEVELS.findIndex(l => l.id === id)))
    : -1

  return (
    <header className="border-b border-slate-700 bg-[#0c1424] px-4 py-2.5 flex items-center justify-between gap-4 flex-wrap flex-shrink-0">
      {/* Title */}
      <div className="flex flex-col">
        <h1 className="text-base font-black tracking-widest neon-cyan text-cyan-400 leading-tight">
          ⚡ CIVIL WAR REBOOT
        </h1>
        <span className="text-[9px] text-slate-600 tracking-wider uppercase">Time Detective Agency</span>
      </div>

      {/* Level pills */}
      <div className="flex gap-1.5 flex-wrap items-center">
        <span className="text-[9px] text-slate-600 mr-1 tracking-wider hidden sm:block">LEVELS:</span>
        {LEVELS.map((lvl, i) => {
          const solved = solvedLevels.includes(lvl.id)
          const active = i === currentLevel
          const unlocked = replayMode || i <= maxUnlocked + 1
          return (
            <button
              key={lvl.id}
              onClick={() => { if (unlocked) { sounds.click(); onSelectLevel(i) } }}
              title={`Level ${lvl.id}: ${lvl.title}`}
              className={`w-8 h-8 text-[11px] rounded border font-bold transition-all
                ${active
                  ? 'border-cyan-400 text-cyan-400 bg-cyan-400/10 scale-110'
                  : solved
                    ? 'border-green-500/60 text-green-400 bg-green-500/5'
                    : 'border-slate-700 text-slate-600 bg-transparent'
                }
                ${unlocked ? 'cursor-pointer hover:opacity-80' : 'cursor-not-allowed opacity-30'}
              `}
            >
              {solved ? '✓' : lvl.id}
            </button>
          )
        })}
      </div>

      {/* Score + Rank */}
      <div className="flex items-center gap-4">
        <div className="text-right">
          <div className="text-[9px] text-slate-600 tracking-widest uppercase">Score</div>
          <div className="text-xl font-black neon-gold text-amber-400 leading-tight">
            <AnimatedScore score={score} />
          </div>
        </div>
        <div className="border-l border-slate-700 pl-4 text-right">
          <div className="text-[9px] text-slate-600 tracking-widest uppercase">Rank</div>
          <div className={`text-xs font-bold ${rank.color} tracking-wide flex items-center gap-1`}>
            <span>{RANK_ICONS[rank.label]}</span>
            <span>{rank.label}</span>
          </div>
        </div>
      </div>
    </header>
  )
}
