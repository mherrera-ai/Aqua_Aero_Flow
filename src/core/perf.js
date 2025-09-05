export class PerformanceManager {
  constructor(config) {
    this.config = config
    this.fps = 60
    this.frameCount = 0
    this.lastTime = performance.now()
    this.samples = []
    this.maxSamples = 60
    this.adaptiveEnabled = true
    this.minParticles = 200
    this.maxParticles = 2000
    this.targetFPS = 50
    this.lastAdjustment = 0
    this.adjustmentCooldown = 2000
  }

  update() {
    this.frameCount++
    const currentTime = performance.now()
    const delta = currentTime - this.lastTime

    if (delta >= 1000) {
      this.fps = Math.round((this.frameCount * 1000) / delta)
      this.samples.push(this.fps)

      if (this.samples.length > this.maxSamples) {
        this.samples.shift()
      }

      this.frameCount = 0
      this.lastTime = currentTime

      if (this.adaptiveEnabled && currentTime - this.lastAdjustment > this.adjustmentCooldown) {
        this.adjustParticleCount()
        this.lastAdjustment = currentTime
      }
    }
  }

  adjustParticleCount() {
    const avgFPS = this.getAverageFPS()

    if (avgFPS < this.targetFPS - 5) {
      const reduction = Math.max(50, Math.floor(this.config.particleCount * 0.1))
      this.config.particleCount = Math.max(this.minParticles, this.config.particleCount - reduction)
    } else if (avgFPS > this.targetFPS + 10) {
      const increase = Math.min(50, Math.floor(this.config.particleCount * 0.1))
      this.config.particleCount = Math.min(this.maxParticles, this.config.particleCount + increase)
    }
  }

  getAverageFPS() {
    if (this.samples.length === 0) return this.fps
    const sum = this.samples.reduce((a, b) => a + b, 0)
    return Math.round(sum / this.samples.length)
  }

  getFPS() {
    return this.fps
  }

  setAdaptive(enabled) {
    this.adaptiveEnabled = enabled
  }

  checkReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }

  getOptimalSettings() {
    const reducedMotion = this.checkReducedMotion()

    if (reducedMotion) {
      return {
        particleCount: 200,
        trailLength: 5,
        glowIntensity: 0.5,
        flowSpeed: 0.5,
      }
    }

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

    if (isMobile) {
      return {
        particleCount: 300,
        trailLength: 10,
        glowIntensity: 0.8,
        flowSpeed: 1.0,
      }
    }

    return null
  }
}
