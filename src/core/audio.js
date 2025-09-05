export class AudioReactive {
  constructor() {
    this.audioContext = null
    this.analyser = null
    this.source = null
    this.dataArray = null
    this.isActive = false
    this.permissionDenied = false
  }

  async init() {
    if (this.permissionDenied) return false

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

      this.audioContext = new (window.AudioContext || window.webkitAudioContext)()
      this.analyser = this.audioContext.createAnalyser()
      this.analyser.fftSize = 256
      this.analyser.smoothingTimeConstant = 0.8

      this.source = this.audioContext.createMediaStreamSource(stream)
      this.source.connect(this.analyser)

      const bufferLength = this.analyser.frequencyBinCount
      this.dataArray = new Uint8Array(bufferLength)

      this.isActive = true
      return true
    } catch (err) {
      console.warn('Audio permission denied:', err)
      this.permissionDenied = true
      return false
    }
  }

  getFrequencyData() {
    if (!this.isActive || !this.analyser) return null

    this.analyser.getByteFrequencyData(this.dataArray)

    const bufferLength = this.dataArray.length
    const bassEnd = Math.floor(bufferLength * 0.1)
    const midEnd = Math.floor(bufferLength * 0.5)

    let bass = 0,
      mid = 0,
      treble = 0

    for (let i = 0; i < bassEnd; i++) {
      bass += this.dataArray[i]
    }
    bass = bass / (bassEnd * 255)

    for (let i = bassEnd; i < midEnd; i++) {
      mid += this.dataArray[i]
    }
    mid = mid / ((midEnd - bassEnd) * 255)

    for (let i = midEnd; i < bufferLength; i++) {
      treble += this.dataArray[i]
    }
    treble = treble / ((bufferLength - midEnd) * 255)

    return { bass, mid, treble, raw: this.dataArray }
  }

  toggle() {
    if (this.isActive) {
      this.stop()
      return false
    } else {
      return this.init()
    }
  }

  stop() {
    if (this.source) {
      this.source.disconnect()
      this.source = null
    }
    if (this.audioContext) {
      this.audioContext.close()
      this.audioContext = null
    }
    this.analyser = null
    this.dataArray = null
    this.isActive = false
  }

  isEnabled() {
    return this.isActive
  }
}
