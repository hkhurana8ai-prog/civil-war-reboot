export const RANKS = [
  { minScore: 0,   label: 'Rookie Inspector',  color: 'text-slate-400' },
  { minScore: 100, label: 'Field Agent',        color: 'text-cyan-400' },
  { minScore: 250, label: 'Senior Detective',   color: 'text-amber-400' },
  { minScore: 450, label: 'Master Detective',   color: 'text-yellow-300' },
]

export const LEVELS = [
  {
    id: 1,
    title: 'Press Freedom',
    topic: 'SOCIETY',
    topicColor: 'bg-cyan-500',
    glitchedItem: 'Smartphone',
    glitchMessage: 'ERROR: NO LIVE NEWS',
    clue: {
      headline: 'War Reporters & Press Freedom',
      body: 'Civil War telegraphs enabled journalists to report battles in near-real-time — the birth of live news. The press became a permanent pillar of American democracy.',
      tag: 'SOCIETY',
    },
    points: 100,
  },
  {
    id: 2,
    title: '13th Amendment',
    topic: 'GOVERNMENT',
    topicColor: 'bg-purple-500',
    glitchedItem: 'Constitution',
    glitchMessage: 'DOCUMENT CORRUPTED',
    clue: {
      headline: 'The 13th Amendment (1865)',
      body: 'Ratified on December 6, 1865, the 13th Amendment abolished slavery and freed approximately 4 million enslaved people — the largest single legal transformation in American history.',
      tag: 'GOVERNMENT',
    },
    points: 100,
  },
  {
    id: 3,
    title: "Women's Roles",
    topic: 'SOCIETY',
    topicColor: 'bg-cyan-500',
    glitchedItem: 'Surgeon Badge',
    glitchMessage: 'ACCESS DENIED',
    clue: {
      headline: "Women's Wartime Roles",
      body: 'Women served as nurses, spies, and farm operators during the Civil War. These roles shattered traditional gender barriers and laid the groundwork for modern professional equality.',
      tag: 'SOCIETY',
    },
    points: 100,
  },
  {
    id: 4,
    title: 'Economy & Rail',
    topic: 'ECONOMY',
    topicColor: 'bg-amber-500',
    glitchedItem: 'GPS Cargo Map',
    glitchMessage: 'ROUTES BROKEN',
    clue: {
      headline: 'Industrial & Railroad Boom',
      body: "The South's agrarian economy collapsed while the North's industrial and railroad network exploded. This shift permanently reshaped America's economic geography and connected the nation.",
      tag: 'ECONOMY',
    },
    points: 100,
  },
  {
    id: 5,
    title: 'Federal Union',
    topic: 'GOVERNMENT',
    topicColor: 'bg-purple-500',
    glitchedItem: 'US Map',
    glitchMessage: 'UNION FRAGMENTED',
    clue: {
      headline: 'Preserving the Federal Union',
      body: 'The Union victory ended the threat of permanent secession. Federal authority over the states was cemented, creating the unified national government we rely on today.',
      tag: 'GOVERNMENT',
    },
    points: 150,
  },
]

export const TOTAL_LEVELS = LEVELS.length

export function getRank(score) {
  for (let i = RANKS.length - 1; i >= 0; i--) {
    if (score >= RANKS[i].minScore) return RANKS[i]
  }
  return RANKS[0]
}

export function getInitialState() {
  return {
    screen: 'game',       // 'game' | 'victory'
    currentLevel: 0,      // index into LEVELS
    score: 0,
    solvedLevels: [],     // array of level ids that are solved
    unlockedClues: [],    // array of level ids whose clues are visible
    replayMode: false,    // true after first full completion
  }
}
