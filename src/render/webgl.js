export class WebGLRenderer {
  constructor(canvas, config) {
    this.canvas = canvas
    this.config = config
    this.gl = null
    this.program = null
    this.buffers = {}
    this.uniforms = {}
    this.bloomEnabled = false
    this.fallbackToCanvas2D = false

    this.init()
  }

  init() {
    try {
      this.gl = this.canvas.getContext('webgl2') || this.canvas.getContext('webgl')
      if (!this.gl) {
        this.fallbackToCanvas2D = true
        return false
      }

      const vertexShader = this.createShader(this.gl.VERTEX_SHADER, this.vertexShaderSource())
      const fragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, this.fragmentShaderSource())

      this.program = this.gl.createProgram()
      this.gl.attachShader(this.program, vertexShader)
      this.gl.attachShader(this.program, fragmentShader)
      this.gl.linkProgram(this.program)

      if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
        console.error('WebGL program linking failed')
        this.fallbackToCanvas2D = true
        return false
      }

      this.setupBuffers()
      this.setupUniforms()

      this.gl.enable(this.gl.BLEND)
      this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE)

      return true
    } catch (err) {
      console.error('WebGL initialization failed:', err)
      this.fallbackToCanvas2D = true
      return false
    }
  }

  createShader(type, source) {
    const shader = this.gl.createShader(type)
    this.gl.shaderSource(shader, source)
    this.gl.compileShader(shader)

    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      console.error('Shader compilation error:', this.gl.getShaderInfoLog(shader))
      this.gl.deleteShader(shader)
      return null
    }

    return shader
  }

  vertexShaderSource() {
    return `
      attribute vec2 a_position;
      attribute vec3 a_color;
      attribute float a_size;
      
      uniform vec2 u_resolution;
      uniform mat3 u_transform;
      
      varying vec3 v_color;
      
      void main() {
        vec2 position = (u_transform * vec3(a_position, 1.0)).xy;
        vec2 clipSpace = ((position / u_resolution) * 2.0) - 1.0;
        gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
        gl_PointSize = a_size;
        v_color = a_color;
      }
    `
  }

  fragmentShaderSource() {
    return `
      precision mediump float;
      
      varying vec3 v_color;
      uniform float u_bloom;
      
      void main() {
        vec2 coord = gl_PointCoord - vec2(0.5);
        float dist = length(coord);
        
        if (dist > 0.5) {
          discard;
        }
        
        float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
        
        if (u_bloom > 0.0) {
          float glow = exp(-dist * dist * 10.0) * u_bloom;
          gl_FragColor = vec4(v_color, alpha) + vec4(v_color * glow, glow * 0.5);
        } else {
          gl_FragColor = vec4(v_color, alpha);
        }
      }
    `
  }

  setupBuffers() {
    this.buffers.position = this.gl.createBuffer()
    this.buffers.color = this.gl.createBuffer()
    this.buffers.size = this.gl.createBuffer()
  }

  setupUniforms() {
    this.uniforms.resolution = this.gl.getUniformLocation(this.program, 'u_resolution')
    this.uniforms.transform = this.gl.getUniformLocation(this.program, 'u_transform')
    this.uniforms.bloom = this.gl.getUniformLocation(this.program, 'u_bloom')
  }

  clear() {
    if (this.fallbackToCanvas2D) return

    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height)
    this.gl.clearColor(0, 0.078, 0.156, 0.02)
    this.gl.clear(this.gl.COLOR_BUFFER_BIT)
  }

  drawParticles(particles) {
    if (this.fallbackToCanvas2D || !particles.length) return

    const positions = []
    const colors = []
    const sizes = []

    particles.forEach((particle) => {
      positions.push(particle.x, particle.y)

      const opacity =
        Math.min(1, particle.life / 20) * (1 - (particle.life / particle.maxLife) * 0.5)
      colors.push(0, 1, 1, opacity)
      sizes.push(particle.size * 2)
    })

    this.gl.useProgram(this.program)

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.position)
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(positions), this.gl.STATIC_DRAW)
    const positionLoc = this.gl.getAttribLocation(this.program, 'a_position')
    this.gl.enableVertexAttribArray(positionLoc)
    this.gl.vertexAttribPointer(positionLoc, 2, this.gl.FLOAT, false, 0, 0)

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.color)
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(colors), this.gl.STATIC_DRAW)
    const colorLoc = this.gl.getAttribLocation(this.program, 'a_color')
    this.gl.enableVertexAttribArray(colorLoc)
    this.gl.vertexAttribPointer(colorLoc, 4, this.gl.FLOAT, false, 0, 0)

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.size)
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(sizes), this.gl.STATIC_DRAW)
    const sizeLoc = this.gl.getAttribLocation(this.program, 'a_size')
    this.gl.enableVertexAttribArray(sizeLoc)
    this.gl.vertexAttribPointer(sizeLoc, 1, this.gl.FLOAT, false, 0, 0)

    this.gl.uniform2f(this.uniforms.resolution, this.canvas.width, this.canvas.height)
    this.gl.uniformMatrix3fv(this.uniforms.transform, false, [1, 0, 0, 0, 1, 0, 0, 0, 1])
    this.gl.uniform1f(this.uniforms.bloom, this.bloomEnabled ? this.config.glowIntensity : 0)

    this.gl.drawArrays(this.gl.POINTS, 0, particles.length)
  }

  setBloom(enabled) {
    this.bloomEnabled = enabled
  }

  resize(width, height) {
    this.canvas.width = width
    this.canvas.height = height
    if (!this.fallbackToCanvas2D) {
      this.gl.viewport(0, 0, width, height)
    }
  }

  isAvailable() {
    return !this.fallbackToCanvas2D
  }
}
