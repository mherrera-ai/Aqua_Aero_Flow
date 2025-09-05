// @ts-check
import { Particle } from './core/particle.js'
import { FlowField } from './core/flowfield.js'
import { Recorder } from './core/recorder.js'
import { PerformanceManager } from './core/perf.js'
import { Canvas2DRenderer } from './render/canvas2d.js'
import { WebGLRenderer } from './render/webgl.js'
import { UIControls } from './ui/controls.js'
import './styles.css'

// Register Service Worker for PWA offline support
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((reg) => console.warn('SW registered:', reg.scope))
      .catch((err) => console.warn('SW registration failed:', err))
  })
}

class AquaAeroFlow {
  constructor() {
    this.canvas = document.getElementById('canvas')
    this.particles = []
    this.time = 0
    this.mouseX = window.innerWidth / 2
    this.mouseY = window.innerHeight / 2
    this.targetMouseX = this.mouseX
    this.targetMouseY = this.mouseY
    this.resizeTimeout = null
    this.lastFrameTime = performance.now()
    this.frameCount = 0
    this.fpsUpdateInterval = 500
    this.lastFpsUpdate = 0

    this.config = {
      particleCount: 500,
      flowSpeed: 1,
      turbulence: 1,
      waveAmplitude: 50,
      trailLength: 10,
      glowIntensity: 0.8,
      colorScheme: 'aqua',
      visualMode: 'flow',
      performanceMode: false,
    }

    this.init()
  }

  init() {
    this.setupCanvas()
    this.flowField = new FlowField(this.canvas)
    this.perfManager = new PerformanceManager(this.config)
    this.recorder = new Recorder(this.canvas)

    this.canvas2DRenderer = new Canvas2DRenderer(this.canvas, this.config)
    this.webGLRenderer = new WebGLRenderer(this.canvas, this.config)
    this.useWebGL = false

    this.uiControls = new UIControls(this.config, {
      reset: () => this.reset(),
      snapshot: () => this.takeSnapshot(),
      record: () => this.startRecording(),
      toggleWebGL: () => this.toggleWebGL(),
    })

    this.uiControls.setRecorder(this.recorder)

    const optimalSettings = this.perfManager.getOptimalSettings()
    if (optimalSettings) {
      Object.assign(this.config, optimalSettings)
      this.uiControls.updateControls()
    }

    this.initParticles()
    this.attachEventListeners()
    this.animate()
  }

  setupCanvas() {
    this.canvas.width = window.innerWidth
    this.canvas.height = window.innerHeight
  }

  initParticles() {
    this.particles = []
    for (let i = 0; i < this.config.particleCount; i++) {
      this.particles.push(new Particle(null, null, this.canvas, this.config))
    }
  }

  attachEventListeners() {
    this.canvas.addEventListener('mousemove', (e) => {
      this.targetMouseX = e.clientX
      this.targetMouseY = e.clientY
    })

    this.canvas.addEventListener('touchmove', (e) => {
      this.targetMouseX = e.touches[0].clientX
      this.targetMouseY = e.touches[0].clientY
    })

    window.addEventListener('resize', () => {
      this.canvas.width = window.innerWidth
      this.canvas.height = window.innerHeight
      this.flowField = new FlowField(this.canvas)

      if (this.useWebGL) {
        this.webGLRenderer.resize(window.innerWidth, window.innerHeight)
      }
    })
  }

  animate() {
    this.mouseX += (this.targetMouseX - this.mouseX) * 0.1
    this.mouseY += (this.targetMouseY - this.mouseY) * 0.1

    if (this.time % 5 === 0) {
      this.flowField.update(0, this.time, this.config.turbulence)

      const audioData = this.uiControls.getAudioData()
      if (audioData) {
        this.flowField.applyAudioReactive(audioData)

        if (this.config.colorScheme === 'nebula' && audioData.treble > 0.7) {
          const schemes = ['aurora', 'vapor', 'plasma', 'nebula']
          this.config.colorScheme = schemes[Math.floor(Math.random() * schemes.length)]
        }
      }
    }

    while (this.particles.length < this.config.particleCount) {
      this.particles.push(new Particle(null, null, this.canvas, this.config))
    }
    while (this.particles.length > this.config.particleCount) {
      this.particles.pop()
    }

    const audioData = this.uiControls.getAudioData()

    this.particles.forEach((particle) => {
      particle.maxTrailLength = this.config.trailLength
      particle.config = this.config

      if (audioData) {
        particle.applyAudioReactive(audioData)

        if (audioData.bass > 0.7) {
          this.config.flowSpeed = Math.min(3, this.config.flowSpeed * 1.1)
        } else {
          this.config.flowSpeed = Math.max(0.1, this.config.flowSpeed * 0.99)
        }

        if (audioData.mid > 0.6) {
          this.config.turbulence = Math.min(3, this.config.turbulence * 1.05)
        } else {
          this.config.turbulence = Math.max(0, this.config.turbulence * 0.98)
        }

        if (audioData.treble > 0.5) {
          this.config.waveAmplitude = Math.min(200, this.config.waveAmplitude * 1.02)
        } else {
          this.config.waveAmplitude = Math.max(0, this.config.waveAmplitude * 0.99)
        }
      }

      particle.update(this.flowField.getField(), this.mouseX, this.mouseY, this.time)
    })

    if (this.useWebGL && this.webGLRenderer.isAvailable()) {
      this.webGLRenderer.clear()
      this.webGLRenderer.drawParticles(this.particles)
    } else {
      this.canvas2DRenderer.clear()
      this.particles.forEach((particle) => {
        this.canvas2DRenderer.drawParticle(particle, this.time)
      })

      const recordingCountdown = this.recorder.getCountdown()
      this.canvas2DRenderer.drawHUD(this.perfManager.getFPS(), false, recordingCountdown)
    }

    this.perfManager.update()
    this.uiControls.updateFPS(this.perfManager.getFPS())

    this.time++
    requestAnimationFrame(() => this.animate())
  }

  toggleWebGL() {
    if (!this.webGLRenderer.isAvailable()) {
      this.uiControls.showTooltip('WebGL not available, using Canvas2D')
      return false
    }

    this.useWebGL = !this.useWebGL
    this.webGLRenderer.setBloom(this.useWebGL)

    if (!this.useWebGL) {
      this.canvas2DRenderer = new Canvas2DRenderer(this.canvas, this.config)
    }

    return this.useWebGL
  }

  takeSnapshot() {
    this.recorder.takeSnapshot(2)
    this.uiControls.showTooltip('Snapshot saved!')
  }

  async startRecording() {
    if (this.recorder.isActive()) {
      this.uiControls.showTooltip('Already recording...')
      return
    }

    const success = await this.recorder.startRecording(10000)
    if (success) {
      this.uiControls.showTooltip('Recording started - 10 seconds')
    } else {
      this.uiControls.showTooltip('Recording failed')
    }
  }

  reset() {
    this.initParticles()
    this.flowField = new FlowField(this.canvas)
    this.time = 0
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new AquaAeroFlow()
})
