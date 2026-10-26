import { useState, useEffect, useRef } from 'react'
import { sounds } from '../../sounds'

const CHIPS = [
  { id: 'a13',         text: '13th Amendment',        answerSlot: 0 },
  { id: 'slavery',     text: 'slavery',               answerSlot: 1 },
  { id: 'involuntary', text: 'involuntary servitude', answerSlot: 2 },
  { id: 'usa',         text: 'United States',         answerSlot: 3 },
  { id: '1865',        text: 'December 6, 1865',      answerSlot: 4 },
  // Distractors
  { id: 'a14',         text: '14th Amendment',        answerSlot: -1 },
  { id: 'forced',      text: 'forced labor',          answerSlot: -1 },
  { id: 'conf',        text: 'Confederate States',    answerSlot: -1 },
]

const POOL_ORDER = ['a14', 'slavery', '1865', 'conf', 'a13', 'involuntary', 'forced', 'usa']

function getChip(id) { return CHIPS.find(c => c.id === id) }

export default function Level2DragDrop({ isSolved, onSolved }) {
  const [filled, setFilled] = useState([null, null, null, null, null])
  const [dragId, setDragId] = useState(null)
  const [shakingSlot, setShakingSlot] = useState(null)
  const [overSlot, setOverSlot] = useState(null)
  const [localSolved, setLocalSolved] = useState(false)
  const [poppingSlot, setPoppingSlot] = useState(null)
  const onSolvedRef = useRef(onSolved)
  useEffect(() => { onSolvedRef.current = onSolved }, [onSolved])

  function handleDrop(slotIndex) {
    setOverSlot(null)
    if (!dragId || filled[slotIndex] !== null) return
    const chip = getChip(dragId)
    if (!chip) return

    if (chip.answerSlot === slotIndex) {
      sounds.unlock()
      setPoppingSlot(slotIndex)
      setTimeout(() => setPoppingSlot(null), 250)
      setFilled(prev => {
        const next = [...prev]
        next[slotIndex] = dragId
        if (next.every(Boolean)) {
          setTimeout(() => {
            sounds.success()
            setLocalSolved(true)
            setTimeout(() => onSolvedRef.current(), 1200)
          }, 100)
        }
        return next
      })
    } else {
      sounds.error()
      setShakingSlot(slotIndex)
      setTimeout(() => setShakingSlot(null), 450)
    }
    setDragId(null)
  }

  const isWon = localSolved || isSolved
  const placedIds = new Set(filled.filter(Boolean))
  const poolChips = POOL_ORDER.filter(id => !placedIds.has(id))

  const renderSlot = (slotIndex, width = 'w-52') => {
    const chipId = filled[slotIndex]
    const chip = chipId ? getChip(chipId) : null
    const isShaking = shakingSlot === slotIndex
    const isOver = overSlot === slotIndex
    const isPopping = poppingSlot === slotIndex

    return (
      <span
        onDragOver={e => { e.preventDefault(); setOverSlot(slotIndex) }}
        onDragLeave={() => setOverSlot(null)}
        onDrop={() => handleDrop(slotIndex)}
        className={[
          'inline-flex items-center justify-center px-3 py-1.5 mx-1 rounded-lg border-2 font-bold text-sm transition-all duration-150',
          width,
          chip
            ? `border-green-500 bg-green-950/60 text-green-300 ${isPopping ? 'animate-pop' : ''}`
            : isShaking
              ? 'border-red-500 bg-red-950/40 text-red-400 animate-shake'
              : isOver
                ? 'border-cyan-400 bg-cyan-950/50 text-cyan-300 scale-105'
                : 'border-dashed border-slate-600 bg-slate-900/60 text-slate-600',
        ].join(' ')}
      >
        {chip
          ? <span className="flex items-center gap-1.5"><span className="text-green-400">✓</span>{chip.text}</span>
          : isOver
            ? <span className="text-xs tracking-wider">DROP HERE</span>
            : <span className="text-xs tracking-widest opacity-60">[ blank ]</span>
        }
      </span>
    )
  }

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto w-full">
      <div className="text-center">
        <p className="text-sm text-slate-300">
          <span className="text-amber-400 font-bold">Drag</span> the correct phrases from the word bank into the{' '}
          <span className="text-cyan-400 font-bold">[ blank ]</span> slots to restore the amendment
        </p>
        <p className="text-xs text-slate-600 mt-1">Watch out — some phrases are decoys!</p>
      </div>

      {/* Document */}
      <div
        className="rounded-2xl border-2 border-amber-900/40 p-6 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0d0a04 0%, #0a0806 50%, #0d0a04 100%)',
          boxShadow: 'inset 0 0 40px rgba(245,158,11,0.03), 0 0 20px rgba(0,0,0,0.4)',
        }}
      >
        {/* Decorative watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
          style={{ opacity: 0.025 }}>
          <div className="text-amber-200 text-[120px] font-black rotate-12 leading-none">US</div>
        </div>

        {/* Top seal row */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-amber-900/30">
          <div className="w-8 h-8 rounded-full border-2 border-amber-800/40 flex items-center justify-center text-amber-800 text-xs">⭐</div>
          <div className="text-center">
            <div className="text-xs tracking-[0.4em] text-amber-700/80 font-bold uppercase">United States Constitution</div>
            <div className="text-[10px] tracking-widest text-slate-600 mt-0.5">
              {isWon ? '— Document Fully Restored —' : '— ⚠ Phrases Corrupted — Restore to Ratify —'}
            </div>
          </div>
          <div className="w-8 h-8 rounded-full border-2 border-amber-800/40 flex items-center justify-center text-amber-800 text-xs">⭐</div>
        </div>

        {/* Amendment body */}
        <div className="space-y-5 leading-loose">

          {/* Amendment header */}
          <div className="flex items-center gap-3 flex-wrap text-sm">
            <span className="text-slate-500 uppercase tracking-widest text-xs font-bold">Amendment:</span>
            {renderSlot(0, 'w-48')}
            <span className="text-slate-500 text-xs">— Section 1</span>
          </div>

          {/* Main clause */}
          <div className="border-l-4 border-amber-900/30 pl-4">
            <p className="text-slate-300 text-sm leading-9">
              <span className="text-slate-400">"Neither</span>
              {renderSlot(1, 'w-32')}
              <span className="text-slate-400"> nor </span>
              {renderSlot(2, 'w-52')}
              <span className="text-slate-400">,</span>
              <br />
              <span className="text-slate-400">except as a punishment for crime whereof the party shall</span>
              <br />
              <span className="text-slate-400">have been duly convicted, shall exist within the </span>
              {renderSlot(3, 'w-40')}
              <span className="text-slate-400">,</span>
              <br />
              <span className="text-slate-400">or any place subject to their jurisdiction."</span>
            </p>
          </div>

          {/* Ratification line */}
          <div className="flex items-center gap-3 flex-wrap text-sm border-t border-amber-900/20 pt-4">
            <span className="text-slate-500 uppercase tracking-widest text-xs font-bold">Ratified:</span>
            {renderSlot(4, 'w-44')}
            {isWon && <span className="text-green-400 text-xs font-bold">✓ Ratified by Congress</span>}
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-5 pt-4 border-t border-amber-900/20">
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-slate-600 tracking-widest uppercase">Progress</span>
            <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 rounded-full transition-all duration-500"
                style={{ width: `${(filled.filter(Boolean).length / 5) * 100}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-500 font-bold">{filled.filter(Boolean).length}/5</span>
          </div>
        </div>
      </div>

      {/* Win banner */}
      {isWon && (
        <div className="border-2 border-green-500 bg-green-950/30 rounded-xl px-6 py-3 text-center"
          style={{ boxShadow: '0 0 20px rgba(34,197,94,0.2)' }}>
          <div className="text-green-400 font-black text-lg tracking-wider">✓ AMENDMENT RESTORED!</div>
          <div className="text-sm text-green-300/80 mt-1">
            4 million enslaved people freed — the 13th Amendment stands forever.
          </div>
        </div>
      )}

      {/* Word bank */}
      {!isWon && (
        <div className="border border-slate-700 bg-slate-900/40 rounded-xl p-4">
          <div className="text-xs text-slate-500 tracking-widest uppercase mb-3 flex items-center gap-2">
            <span>📚</span>
            <span>Word Bank — drag phrases into the document</span>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {poolChips.map(id => {
              const chip = getChip(id)
              if (!chip) return null
              const isDragging = dragId === id
              return (
                <div
                  key={id}
                  draggable
                  onDragStart={() => { sounds.click(); setDragId(id) }}
                  onDragEnd={() => setDragId(null)}
                  className={[
                    'px-4 py-2.5 text-sm font-bold rounded-xl border-2 cursor-grab active:cursor-grabbing select-none transition-all duration-150',
                    isDragging
                      ? 'border-cyan-500/60 text-cyan-400 bg-cyan-950/40 opacity-50 scale-95'
                      : 'border-slate-600 text-slate-200 bg-slate-800/70 hover:border-amber-500/60 hover:text-amber-300 hover:bg-amber-950/20 hover:scale-105',
                  ].join(' ')}
                >
                  {chip.text}
                </div>
              )
            })}
          </div>
          <div className="mt-3 text-[10px] text-slate-700 flex items-center gap-1.5">
            <span>⚠</span>
            <span>Some phrases are historically inaccurate decoys — only correct facts belong in the document</span>
          </div>
        </div>
      )}
    </div>
  )
}
