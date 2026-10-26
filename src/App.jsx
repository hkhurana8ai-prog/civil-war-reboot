import { useState, useCallback } from 'react'
import { LEVELS, TOTAL_LEVELS, getRank, getInitialState } from './gameData'
import SplashScreen from './components/SplashScreen'
import Header from './components/Header'
import GlitchStage from './components/GlitchStage'
import DetectiveNotebook from './components/DetectiveNotebook'
import VictoryScreen from './components/VictoryScreen'

export default function App() {
  const [started, setStarted] = useState(false)
  const [state, setState] = useState(getInitialState)
  const [notebookOpen, setNotebookOpen] = useState(true)

  const handleLevelSolved = useCallback((levelId, pointsEarned) => {
    setState(prev => {
      const alreadySolved = prev.solvedLevels.includes(levelId)
      const newScore = alreadySolved ? prev.score : prev.score + pointsEarned
      const newSolved = alreadySolved ? prev.solvedLevels : [...prev.solvedLevels, levelId]
      const newClues = prev.unlockedClues.includes(levelId)
        ? prev.unlockedClues
        : [...prev.unlockedClues, levelId]
      const allDone = newSolved.length === TOTAL_LEVELS
      return {
        ...prev,
        score: newScore,
        solvedLevels: newSolved,
        unlockedClues: newClues,
        screen: allDone && !prev.replayMode ? 'victory' : prev.screen,
        replayMode: allDone ? true : prev.replayMode,
      }
    })
  }, [])

  const handleNextLevel = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentLevel: Math.min(prev.currentLevel + 1, TOTAL_LEVELS - 1),
    }))
  }, [])

  const handleSelectLevel = useCallback((index) => {
    setState(prev => ({ ...prev, currentLevel: index, screen: 'game' }))
  }, [])

  const handleReplay = useCallback(() => {
    setState({ ...getInitialState(), replayMode: true, screen: 'game' })
    setStarted(true)
  }, [])

  if (!started) return <SplashScreen onStart={() => setStarted(true)} />

  const currentLevelData = LEVELS[state.currentLevel]
  const rank = getRank(state.score)
  const isSolved = state.solvedLevels.includes(currentLevelData.id)
  const allDone = state.solvedLevels.length === TOTAL_LEVELS

  if (state.screen === 'victory') {
    return (
      <VictoryScreen
        score={state.score}
        rank={rank}
        unlockedClues={state.unlockedClues}
        onReplay={handleReplay}
        onSelectLevel={handleSelectLevel}
      />
    )
  }

  return (
    <div className="h-screen bg-[#0f172a] text-white font-mono flex flex-col overflow-hidden">
      <Header
        currentLevel={state.currentLevel}
        score={state.score}
        rank={rank}
        solvedLevels={state.solvedLevels}
        replayMode={state.replayMode}
        onSelectLevel={handleSelectLevel}
      />

      <main className="flex flex-1 overflow-hidden relative">
        {/* Main game area */}
        <div className={`flex-1 overflow-hidden transition-all duration-300 ${notebookOpen ? '' : 'w-full'}`}>
          <GlitchStage
            levelData={currentLevelData}
            isSolved={isSolved}
            onSolved={(pts) => handleLevelSolved(currentLevelData.id, pts)}
            onNextLevel={handleNextLevel}
            isLastLevel={state.currentLevel === TOTAL_LEVELS - 1}
            allDone={allDone}
            onViewResults={() => setState(prev => ({ ...prev, screen: 'victory' }))}
          />
        </div>

        {/* Notebook toggle tab */}
        <button
          onClick={() => setNotebookOpen(o => !o)}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-slate-800 border border-slate-700 border-r-0 rounded-l-lg px-1 py-4 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/40 transition-all"
          style={{ right: notebookOpen ? '17rem' : 0 }}
          title={notebookOpen ? 'Hide notebook' : 'Show notebook'}
        >
          <span className="text-xs" style={{ writingMode: 'vertical-rl' }}>
            {notebookOpen ? '▶ NOTEBOOK' : '◀ NOTEBOOK'}
          </span>
        </button>

        {/* Detective Notebook — collapsible */}
        <div className={`flex-shrink-0 border-l border-slate-700 transition-all duration-300 overflow-hidden ${notebookOpen ? 'w-68' : 'w-0'}`}
          style={{ width: notebookOpen ? '17rem' : 0 }}>
          {notebookOpen && (
            <DetectiveNotebook
              levels={LEVELS}
              unlockedClues={state.unlockedClues}
              currentLevelId={currentLevelData.id}
            />
          )}
        </div>
      </main>
    </div>
  )
}
