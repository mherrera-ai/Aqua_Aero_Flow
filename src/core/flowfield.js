export class FlowField {
  constructor(canvas) {
    this.canvas = canvas
    this.cellSize = 20
    this.cols = Math.ceil(canvas.width / this.cellSize)
    this.rows = Math.ceil(canvas.height / this.cellSize)
    this.field = []
  }

  update(seed, time, turbulence) {
    this.field = []
    this.cols = Math.ceil(this.canvas.width / this.cellSize)
    this.rows = Math.ceil(this.canvas.height / this.cellSize)

    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        const angle =
          (Math.sin(x * 0.1 + time * 0.001 + seed) + Math.cos(y * 0.1 + time * 0.001 + seed)) *
          Math.PI *
          turbulence
        const force = {
          x: Math.cos(angle) * 0.1,
          y: Math.sin(angle) * 0.1,
        }
        this.field.push(force)
      }
    }
  }

  applyAudioReactive(audioData) {
    if (!audioData || !this.field.length) return

    const bass = audioData.bass || 0
    const mid = audioData.mid || 0

    this.field.forEach((force, _i) => {
      const modifier = 1 + bass * 0.5 + mid * 0.3
      force.x *= modifier
      force.y *= modifier
    })
  }

  getField() {
    return this.field
  }
}
