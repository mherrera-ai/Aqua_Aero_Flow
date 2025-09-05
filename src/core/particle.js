export class Particle {
  constructor(x, y, canvas, config) {
    this.canvas = canvas
    this.config = config
    this.x = x || Math.random() * canvas.width
    this.y = y || Math.random() * canvas.height
    this.vx = 0
    this.vy = 0
    this.size = Math.random() * 3 + 1
    this.trail = []
    this.maxTrailLength = config.trailLength
    this.life = Math.random() * 100
    this.maxLife = 100 + Math.random() * 100
    this.colorIndex = Math.floor(Math.random() * 3)
    this.phase = Math.random() * Math.PI * 2
  }

  update(flowField, mouseX, mouseY, time) {
    const gridX = Math.floor(this.x / 20)
    const gridY = Math.floor(this.y / 20)
    const index = gridY * Math.ceil(this.canvas.width / 20) + gridX

    if (flowField[index]) {
      const force = flowField[index]
      this.vx += force.x * this.config.flowSpeed
      this.vy += force.y * this.config.flowSpeed
    }

    const distToMouse = Math.hypot(this.x - mouseX, this.y - mouseY)
    if (distToMouse < 150) {
      const angle = Math.atan2(this.y - mouseY, this.x - mouseX)
      const force = ((150 - distToMouse) / 150) * 2
      this.vx += Math.cos(angle) * force
      this.vy += Math.sin(angle) * force
    }

    if (this.config.visualMode === 'vortex') {
      const centerX = this.canvas.width / 2
      const centerY = this.canvas.height / 2
      const angle = Math.atan2(this.y - centerY, this.x - centerX) + 0.1
      this.vx += Math.cos(angle) * 0.5
      this.vy += Math.sin(angle) * 0.5
    }

    if (this.config.visualMode === 'waves') {
      this.vy += Math.sin(this.x * 0.01 + time * 0.01) * this.config.waveAmplitude * 0.01
      this.vx += Math.cos(this.y * 0.01 + time * 0.01) * this.config.waveAmplitude * 0.01
    }

    if (this.config.visualMode === 'spiral') {
      const centerX = this.canvas.width / 2
      const centerY = this.canvas.height / 2
      const angle = Math.atan2(this.y - centerY, this.x - centerX)
      const spiral = angle + Math.hypot(this.x - centerX, this.y - centerY) * 0.001
      this.vx += Math.cos(spiral) * 0.5
      this.vy += Math.sin(spiral) * 0.5
    }

    this.vx *= 0.98
    this.vy *= 0.98

    this.trail.push({ x: this.x, y: this.y })
    if (this.trail.length > this.maxTrailLength) {
      this.trail.shift()
    }

    this.x += this.vx
    this.y += this.vy

    if (this.x < 0) this.x = this.canvas.width
    if (this.x > this.canvas.width) this.x = 0
    if (this.y < 0) this.y = this.canvas.height
    if (this.y > this.canvas.height) this.y = 0

    this.life++
    if (this.life > this.maxLife) {
      this.respawn()
    }
  }

  respawn() {
    if (this.config.visualMode === 'nebula') {
      const angle = Math.random() * Math.PI * 2
      const radius = Math.random() * 200
      this.x = this.canvas.width / 2 + Math.cos(angle) * radius
      this.y = this.canvas.height / 2 + Math.sin(angle) * radius
    } else {
      this.x = Math.random() * this.canvas.width
      this.y = Math.random() * this.canvas.height
    }
    this.vx = 0
    this.vy = 0
    this.life = 0
    this.trail = []
  }

  applyAudioReactive(audioData) {
    if (!audioData) return
    const bass = audioData.bass || 0
    const mid = audioData.mid || 0
    const treble = audioData.treble || 0

    this.vx += (bass - 0.5) * 2
    this.vy += (mid - 0.5) * 1.5
    this.size = Math.max(1, this.size + (treble - 0.5) * 0.5)
  }
}
