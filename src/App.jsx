import { useState, useCallback } from 'react'
import { LEVELS, TOTAL_LEVELS, getRank, getInitialState } from './gameData'
import Header from './components/Header'
import GlitchStage from './components/GlitchStage'
import DetectiveNotebook from './components/DetectiveNotebook'
import VictoryScreen from './components/VictoryScreen'

export default function App() {
  const [state, setState] = useState(getInitialState)

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
    setState(prev => ({
      ...getInitialState(),
      replayMode: true,
      screen: 'game',
    }))
  }, [])

  const currentLevelData = LEVELS[state.currentLevel]
  const rank = getRank(state.score)
  const isSolved = state.solvedLevels.includes(currentLevelData.id)

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
    <div className="min-h-screen bg-[#0f172a] text-white font-mono flex flex-col scanlines relative">
      <Header
        currentLevel={state.currentLevel}
        totalLevels={TOTAL_LEVELS}
        score={state.score}
        rank={rank}
        solvedLevels={state.solvedLevels}
        replayMode={state.replayMode}
        onSelectLevel={handleSelectLevel}
      />

      <main className="flex flex-1 gap-4 p-4 overflow-hidden">
        <GlitchStage
          levelData={currentLevelData}
          isSolved={isSolved}
          onSolved={(pts) => handleLevelSolved(currentLevelData.id, pts)}
          onNextLevel={handleNextLevel}
          isLastLevel={state.currentLevel === TOTAL_LEVELS - 1}
          allDone={state.solvedLevels.length === TOTAL_LEVELS}
          onViewResults={() => setState(prev => ({ ...prev, screen: 'victory' }))}
        />
        <DetectiveNotebook
          levels={LEVELS}
          unlockedClues={state.unlockedClues}
          currentLevelId={currentLevelData.id}
        />
      </main>
    </div>
  )
}
