export class Recorder {
  constructor(canvas) {
    this.canvas = canvas
    this.mediaRecorder = null
    this.chunks = []
    this.isRecording = false
    this.countdown = 0
  }

  async startRecording(duration = 10000) {
    if (this.isRecording) return

    const stream = this.canvas.captureStream(30)
    const options = {
      mimeType: 'video/webm;codecs=vp9',
      videoBitsPerSecond: 5000000,
    }

    if (!MediaRecorder.isTypeSupported(options.mimeType)) {
      options.mimeType = 'video/webm'
    }

    try {
      this.mediaRecorder = new MediaRecorder(stream, options)
      this.chunks = []
      this.isRecording = true
      this.countdown = Math.ceil(duration / 1000)

      this.mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          this.chunks.push(e.data)
        }
      }

      this.mediaRecorder.onstop = () => {
        const blob = new Blob(this.chunks, { type: 'video/webm' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `aqua-aero-${Date.now()}.webm`
        a.click()
        URL.revokeObjectURL(url)
        this.isRecording = false
        this.countdown = 0
      }

      this.mediaRecorder.start()

      const countdownInterval = setInterval(() => {
        this.countdown--
        if (this.countdown <= 0) {
          clearInterval(countdownInterval)
        }
      }, 1000)

      setTimeout(() => {
        if (this.mediaRecorder && this.isRecording) {
          this.mediaRecorder.stop()
        }
      }, duration)

      return true
    } catch (err) {
      console.error('Recording failed:', err)
      this.isRecording = false
      return false
    }
  }

  takeSnapshot(scale = 2) {
    const tempCanvas = document.createElement('canvas')
    const tempCtx = tempCanvas.getContext('2d')

    tempCanvas.width = this.canvas.width * scale
    tempCanvas.height = this.canvas.height * scale

    tempCtx.scale(scale, scale)
    tempCtx.drawImage(this.canvas, 0, 0)

    tempCanvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `aqua-aero-${Date.now()}.png`
      a.click()
      URL.revokeObjectURL(url)
    }, 'image/png')
  }

  getCountdown() {
    return this.countdown
  }

  isActive() {
    return this.isRecording
  }
}
