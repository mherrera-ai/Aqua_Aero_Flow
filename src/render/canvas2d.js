import { colorSchemes } from '../utils/color.js'

export class Canvas2DRenderer {
  constructor(canvas, config) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.config = config
  }

  clear() {
    const scheme = colorSchemes[this.config.colorScheme]
    this.ctx.fillStyle = scheme.background
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
  }

  drawParticle(particle, time) {
    const scheme = colorSchemes[this.config.colorScheme]
    const colors = Math.random() > 0.5 ? scheme.primary : scheme.secondary
    const color = colors[particle.colorIndex % colors.length]

    const opacity = Math.min(1, particle.life / 20) * (1 - (particle.life / particle.maxLife) * 0.5)

    if (particle.trail.length > 1) {
      this.ctx.beginPath()
      this.ctx.moveTo(particle.trail[0].x, particle.trail[0].y)
      for (let i = 1; i < particle.trail.length; i++) {
        const point = particle.trail[i]
        this.ctx.lineTo(point.x, point.y)
      }
      this.ctx.strokeStyle =
        color +
        Math.floor(opacity * 50)
          .toString(16)
          .padStart(2, '0')
      this.ctx.lineWidth = particle.size * 0.5
      this.ctx.stroke()
    }

    this.ctx.shadowBlur = 20 * this.config.glowIntensity
    this.ctx.shadowColor = color

    this.ctx.beginPath()
    this.ctx.arc(
      particle.x,
      particle.y,
      particle.size + Math.sin(time * 0.01 + particle.phase) * 0.5,
      0,
      Math.PI * 2
    )
    this.ctx.fillStyle =
      color +
      Math.floor(opacity * 255)
        .toString(16)
        .padStart(2, '0')
    this.ctx.fill()

    this.ctx.shadowBlur = 0
  }

  drawHUD(fps, audioActive, recordingCountdown) {
    const padding = 10
    const lineHeight = 20
    let y = padding

    this.ctx.font = '12px monospace'
    this.ctx.fillStyle = '#00ffff'

    if (fps !== undefined) {
      this.ctx.fillText(`FPS: ${fps}`, padding, (y += lineHeight))
    }

    if (audioActive) {
      this.ctx.fillStyle = '#00ff00'
      this.ctx.fillText('Audio Reactive', padding, (y += lineHeight))
    }

    if (recordingCountdown > 0) {
      this.ctx.fillStyle = '#ff0000'
      this.ctx.font = 'bold 24px monospace'
      this.ctx.fillText(`Recording: ${recordingCountdown}s`, this.canvas.width / 2 - 80, 40)
    }
  }

  resize(width, height) {
    this.canvas.width = width
    this.canvas.height = height
  }
}
