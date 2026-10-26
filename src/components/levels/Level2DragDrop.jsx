export default function Level2DragDrop({ isSolved, onSolved }) {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <div className="text-4xl mb-3">📜</div>
        <p className="text-slate-400 text-sm mb-4">Drag & Drop Puzzle — Coming Phase 4</p>
        {!isSolved && (
          <button onClick={onSolved} className="px-4 py-2 border border-cyan-400 text-cyan-400 text-xs rounded hover:bg-cyan-400/10">
            [DEV] Solve
          </button>
        )}
      </div>
    </div>
  )
}
