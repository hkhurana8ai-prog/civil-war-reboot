let ctx = null

function getCtx() {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)()
  return ctx
}

function tone(freq, type, duration, volume = 0.3) {
  try {
    const ac = getCtx()
    const osc = ac.createOscillator()
    const gain = ac.createGain()
    osc.connect(gain)
    gain.connect(ac.destination)
    osc.type = type
    osc.frequency.setValueAtTime(freq, ac.currentTime)
    gain.gain.setValueAtTime(volume, ac.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + duration)
    osc.start(ac.currentTime)
    osc.stop(ac.currentTime + duration)
  } catch (_) {}
}

export const sounds = {
  click() {
    tone(440, 'square', 0.08, 0.15)
  },
  success() {
    const ac = getCtx()
    const notes = [523, 659, 784, 1047]
    notes.forEach((freq, i) => {
      setTimeout(() => tone(freq, 'sine', 0.2, 0.25), i * 80)
    })
  },
  error() {
    tone(180, 'sawtooth', 0.25, 0.2)
    setTimeout(() => tone(140, 'sawtooth', 0.25, 0.2), 120)
  },
  tick() {
    tone(880, 'square', 0.04, 0.08)
  },
  unlock() {
    const ac = getCtx()
    tone(600, 'sine', 0.15, 0.2)
    setTimeout(() => tone(800, 'sine', 0.15, 0.2), 100)
    setTimeout(() => tone(1000, 'sine', 0.2, 0.25), 200)
  },
}
