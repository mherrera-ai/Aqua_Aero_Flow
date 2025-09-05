// @ts-check
import { PresetManager } from '../core/presets.js'

export class UIControls {
  constructor(config, callbacks) {
    this.config = config
    this.callbacks = callbacks
    this.presetManager = new PresetManager()
    this.recorder = null
    this.elements = {}
    this.isDragging = false
    this.panelCollapsed = false
    this.activeTab = 'main'

    this.init()
  }

  init() {
    this.createControlPanel()
    this.attachEventListeners()
    this.setupKeyboardShortcuts()
    this.loadQueryPreset()
    this.checkAccessibility()
  }

  createControlPanel() {
    const panel = document.createElement('div')
    panel.className = 'controls'
    panel.setAttribute('role', 'region')
    panel.setAttribute('aria-label', 'Aqua Aero Flow Control Panel')

    panel.innerHTML = `
      <div class="controls-header">
        <h3>Aqua Aero Flow Control Panel</h3>
        <div class="window-buttons">
          <button class="toggle-collapse" aria-label="Minimize">_</button>
        </div>
      </div>
      
      <div class="controls-body">
        <div class="tab-container">
          <div class="tab-buttons">
            <button class="tab-button active" data-tab="main">Main</button>
            <button class="tab-button" data-tab="visual">Visual</button>
            <button class="tab-button" data-tab="presets">Presets</button>
            <button class="tab-button" data-tab="tools">Tools</button>
            <button class="tab-button" data-tab="about">About</button>
          </div>
          
          <div class="tab-content">
            <!-- Main Tab -->
            <div class="tab-pane active" id="main-tab">
              <div class="control-group">
                <label for="particleCount">Particle Count</label>
                <div class="control-content">
                  <input type="range" id="particleCount" min="100" max="2000" value="${this.config.particleCount}"
                         aria-valuemin="100" aria-valuemax="2000" aria-valuenow="${this.config.particleCount}">
                  <span class="value" id="particleValue">${this.config.particleCount}</span>
                </div>
              </div>
              
              <div class="control-group">
                <label for="flowSpeed">Flow Speed</label>
                <div class="control-content">
                  <input type="range" id="flowSpeed" min="0.1" max="3" step="0.1" value="${this.config.flowSpeed}"
                         aria-valuemin="0.1" aria-valuemax="3" aria-valuenow="${this.config.flowSpeed}">
                  <span class="value" id="speedValue">${this.config.flowSpeed}</span>
                </div>
              </div>
              
              <div class="control-group">
                <label for="turbulence">Turbulence</label>
                <div class="control-content">
                  <input type="range" id="turbulence" min="0" max="3" step="0.1" value="${this.config.turbulence}"
                         aria-valuemin="0" aria-valuemax="3" aria-valuenow="${this.config.turbulence}">
                  <span class="value" id="turbulenceValue">${this.config.turbulence}</span>
                </div>
              </div>
              
              <div class="control-group">
                <label for="visualMode">Mode</label>
                <div class="control-content">
                  <select id="visualMode" aria-label="Visualization Mode">
                    <option value="flow">Flow Field</option>
                    <option value="vortex">Vortex</option>
                    <option value="waves">Waves</option>
                    <option value="spiral">Spiral</option>
                    <option value="nebula">Nebula</option>
                  </select>
                </div>
              </div>
            </div>
            
            <!-- Visual Tab -->
            <div class="tab-pane" id="visual-tab">
              <div class="control-group">
                <label for="waveAmplitude">Wave Amplitude</label>
                <div class="control-content">
                  <input type="range" id="waveAmplitude" min="0" max="200" value="${this.config.waveAmplitude}"
                         aria-valuemin="0" aria-valuemax="200" aria-valuenow="${this.config.waveAmplitude}">
                  <span class="value" id="waveValue">${this.config.waveAmplitude}</span>
                </div>
              </div>
              
              <div class="control-group">
                <label for="trailLength">Trail Length</label>
                <div class="control-content">
                  <input type="range" id="trailLength" min="1" max="50" value="${this.config.trailLength}"
                         aria-valuemin="1" aria-valuemax="50" aria-valuenow="${this.config.trailLength}">
                  <span class="value" id="trailValue">${this.config.trailLength}</span>
                </div>
              </div>
              
              <div class="control-group">
                <label for="glowIntensity">Glow Intensity</label>
                <div class="control-content">
                  <input type="range" id="glowIntensity" min="0" max="2" step="0.1" value="${this.config.glowIntensity}"
                         aria-valuemin="0" aria-valuemax="2" aria-valuenow="${this.config.glowIntensity}">
                  <span class="value" id="glowValue">${this.config.glowIntensity}</span>
                </div>
              </div>
              
              <div class="control-group">
                <label for="colorScheme">Color Scheme</label>
                <div class="control-content">
                  <select id="colorScheme" aria-label="Color Scheme">
                    <option value="aqua">Aqua Dream</option>
                    <option value="ocean">Deep Ocean</option>
                    <option value="aurora">Aurora</option>
                    <option value="vapor">Vapor Wave</option>
                    <option value="ice">Ice Crystal</option>
                    <option value="plasma">Plasma Flow</option>
                    <option value="nebula">Nebula</option>
                    <option value="colorblind">Color-blind Friendly</option>
                  </select>
                </div>
              </div>
            </div>
            
            <!-- Presets Tab -->
            <div class="tab-pane" id="presets-tab">
              <div class="control-group">
                <label>Built-in Presets</label>
                <div class="control-content">
                  <div class="preset-buttons">
                    <button onclick="window.uiControls.loadPreset('calm')">Calm Waters</button>
                    <button onclick="window.uiControls.loadPreset('storm')">Storm</button>
                    <button onclick="window.uiControls.loadPreset('galaxy')">Galaxy</button>
                    <button onclick="window.uiControls.loadPreset('matrix')">Matrix</button>
                  </div>
                </div>
              </div>
              
              <div class="separator"></div>
              
              <div class="control-group">
                <label>Custom Presets</label>
                <div class="control-content">
                  <input type="text" id="presetName" placeholder="Enter preset name..." aria-label="Custom preset name">
                  <button id="savePreset">Save Current Settings</button>
                  <select id="customPresets" aria-label="Custom presets">
                    <option value="">Load custom preset...</option>
                  </select>
                  <button id="sharePreset">Share Preset URL</button>
                </div>
              </div>
            </div>
            
            <!-- Tools Tab -->
            <div class="tab-pane" id="tools-tab">
              <div class="action-buttons">
                <button id="snapshot" aria-label="Take snapshot">
                  <span class="icon">📷</span> Snapshot
                </button>
                <button id="record" aria-label="Record video">
                  <span class="icon">🎬</span> Record 10s
                </button>
                <button id="fullscreen" aria-label="Toggle fullscreen">
                  <span class="icon">⛶</span> Fullscreen
                </button>
                <button id="reset" aria-label="Reset visualization">
                  <span class="icon">↺</span> Reset All
                </button>
              </div>
              
              <div class="separator"></div>
              
              <div class="control-group">
                <label>Recording Status</label>
                <div class="control-content">
                  <div id="recording-status" style="padding: 4px;">
                    <span>Ready to record</span>
                  </div>
                  <div class="progress-bar" id="recording-progress" style="display: none;">
                    <div class="progress-bar-fill" style="width: 0%"></div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- About Tab -->
            <div class="tab-pane" id="about-tab">
              <div style="padding: 8px; font-size: 11px; line-height: 1.4;">
                <strong>Aqua Aero Flow v1.0.0</strong><br>
                <div class="separator"></div>
                Interactive particle visualization<br>
                Built with pure JavaScript + WebGL<br><br>
                
                <strong>Keyboard Shortcuts:</strong><br>
                [1-5] Switch modes<br>
                [ ] Adjust flow speed<br>
                F - Fullscreen<br>
                R - Reset<br>
                S - Snapshot<br><br>
                
                <strong>Privacy:</strong><br>
                No data collection<br>
                All processing local<br><br>
                
                <div style="text-align: center; margin-top: 8px;">
                  <small>© 2024 Aqua Aero Flow</small>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="info-panel">
          <div id="fps-counter">FPS: <span>60</span></div>
          <div id="particle-counter">Particles: <span>${this.config.particleCount}</span></div>
          <div id="render-mode">Mode: <span>Canvas2D</span></div>
        </div>
      </div>
    `

    document.body.appendChild(panel)
    this.elements.panel = panel
    window.uiControls = this
  }

  attachEventListeners() {
    // Tab switching
    const tabButtons = this.elements.panel.querySelectorAll('.tab-button')
    const tabPanes = this.elements.panel.querySelectorAll('.tab-pane')

    tabButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const targetTab = button.dataset.tab

        // Update active states
        tabButtons.forEach((b) => b.classList.remove('active'))
        tabPanes.forEach((p) => p.classList.remove('active'))

        button.classList.add('active')
        document.getElementById(`${targetTab}-tab`).classList.add('active')

        this.activeTab = targetTab
      })
    })

    // Get control elements
    this.elements.particleCount = document.getElementById('particleCount')
    this.elements.flowSpeed = document.getElementById('flowSpeed')
    this.elements.turbulence = document.getElementById('turbulence')
    this.elements.waveAmplitude = document.getElementById('waveAmplitude')
    this.elements.trailLength = document.getElementById('trailLength')
    this.elements.glowIntensity = document.getElementById('glowIntensity')
    this.elements.colorScheme = document.getElementById('colorScheme')
    this.elements.visualMode = document.getElementById('visualMode')

    // Range inputs
    this.elements.particleCount.addEventListener('input', (e) => {
      this.config.particleCount = parseInt(e.target.value)
      document.getElementById('particleValue').textContent = e.target.value
      document.getElementById('particle-counter').querySelector('span').textContent = e.target.value
      e.target.setAttribute('aria-valuenow', e.target.value)
    })

    this.elements.flowSpeed.addEventListener('input', (e) => {
      this.config.flowSpeed = parseFloat(e.target.value)
      document.getElementById('speedValue').textContent = e.target.value
      e.target.setAttribute('aria-valuenow', e.target.value)
    })

    this.elements.turbulence.addEventListener('input', (e) => {
      this.config.turbulence = parseFloat(e.target.value)
      document.getElementById('turbulenceValue').textContent = e.target.value
      e.target.setAttribute('aria-valuenow', e.target.value)
    })

    this.elements.waveAmplitude.addEventListener('input', (e) => {
      this.config.waveAmplitude = parseInt(e.target.value)
      document.getElementById('waveValue').textContent = e.target.value
      e.target.setAttribute('aria-valuenow', e.target.value)
    })

    this.elements.trailLength.addEventListener('input', (e) => {
      this.config.trailLength = parseInt(e.target.value)
      document.getElementById('trailValue').textContent = e.target.value
      e.target.setAttribute('aria-valuenow', e.target.value)
    })

    this.elements.glowIntensity.addEventListener('input', (e) => {
      this.config.glowIntensity = parseFloat(e.target.value)
      document.getElementById('glowValue').textContent = e.target.value
      e.target.setAttribute('aria-valuenow', e.target.value)
    })

    // Selects
    this.elements.colorScheme.addEventListener('change', (e) => {
      this.config.colorScheme = e.target.value
    })

    this.elements.visualMode.addEventListener('change', (e) => {
      this.config.visualMode = e.target.value
    })

    // Removed non-functional checkboxes

    // Action buttons
    document.getElementById('sharePreset').addEventListener('click', () => {
      const url = this.presetManager.exportToURL(this.config)
      navigator.clipboard.writeText(url).then(() => {
        this.showTooltip('Preset URL copied to clipboard!')
      })
    })

    document.getElementById('snapshot').addEventListener('click', () => {
      if (this.callbacks.snapshot) {
        this.callbacks.snapshot()
        this.showTooltip('Snapshot saved!')
      }
    })

    document.getElementById('record').addEventListener('click', () => {
      if (this.callbacks.record) {
        this.startRecordingUI()
        this.callbacks.record()
      }
    })

    document.getElementById('fullscreen').addEventListener('click', () => {
      this.toggleFullscreen()
    })

    document.getElementById('reset').addEventListener('click', () => {
      this.reset()
      this.showTooltip('Settings reset to defaults')
    })

    document.getElementById('savePreset').addEventListener('click', () => {
      const name = document.getElementById('presetName').value.trim()
      if (name) {
        this.presetManager.saveCustomPreset(name, this.config)
        this.updateCustomPresets()
        document.getElementById('presetName').value = ''
        this.showTooltip(`Preset "${name}" saved!`)
      }
    })

    document.getElementById('customPresets').addEventListener('change', (e) => {
      if (e.target.value) {
        const preset = this.presetManager.getPreset(e.target.value)
        if (preset) {
          this.applyPreset(preset)
        }
      }
    })

    // Window controls
    document.querySelector('.toggle-collapse').addEventListener('click', () => {
      this.togglePanel()
    })

    this.setupPanelDrag()
  }

  startRecordingUI() {
    const status = document.getElementById('recording-status')
    const progress = document.getElementById('recording-progress')
    const progressFill = progress.querySelector('.progress-bar-fill')

    status.querySelector('span').textContent = 'Recording...'
    progress.style.display = 'block'

    let percent = 0
    const interval = setInterval(() => {
      percent += 10
      progressFill.style.width = `${percent}%`

      if (percent >= 100) {
        clearInterval(interval)
        setTimeout(() => {
          status.querySelector('span').textContent = 'Ready to record'
          progress.style.display = 'none'
          progressFill.style.width = '0%'
          this.showTooltip('Recording saved!')
        }, 500)
      }
    }, 1000)
  }

  setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return

      switch (e.key) {
        case '1':
        case '2':
        case '3':
        case '4':
        case '5': {
          const modes = ['flow', 'vortex', 'waves', 'spiral', 'nebula']
          const index = parseInt(e.key) - 1
          if (modes[index]) {
            this.config.visualMode = modes[index]
            this.elements.visualMode.value = modes[index]
          }
          break
        }
        case '[':
          this.config.flowSpeed = Math.max(0.1, this.config.flowSpeed - 0.1)
          this.updateControls()
          break
        case ']':
          this.config.flowSpeed = Math.min(3, this.config.flowSpeed + 0.1)
          this.updateControls()
          break
        case 'f':
        case 'F':
          if (!e.ctrlKey && !e.metaKey) {
            e.preventDefault()
            this.toggleFullscreen()
          }
          break
        case 'r':
        case 'R':
          if (!e.ctrlKey && !e.metaKey) {
            e.preventDefault()
            this.reset()
          }
          break
        case 's':
        case 'S':
          if (!e.ctrlKey && !e.metaKey) {
            e.preventDefault()
            if (this.callbacks.snapshot) {
              this.callbacks.snapshot()
            }
          }
          break
        // Removed audio reactive toggle
      }
    })
  }

  setupPanelDrag() {
    const header = this.elements.panel.querySelector('.controls-header')
    let startX, startY, initialX, initialY

    const handleStart = (e) => {
      if (e.target.closest('.window-buttons')) return
      this.isDragging = true
      startX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX
      startY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY
      const rect = this.elements.panel.getBoundingClientRect()
      initialX = rect.left
      initialY = rect.top
      this.elements.panel.style.transition = 'none'
    }

    const handleMove = (e) => {
      if (!this.isDragging) return
      e.preventDefault()
      const currentX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX
      const currentY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY
      const dx = currentX - startX
      const dy = currentY - startY

      const newX = Math.max(0, Math.min(window.innerWidth - 100, initialX + dx))
      const newY = Math.max(0, Math.min(window.innerHeight - 50, initialY + dy))

      this.elements.panel.style.left = `${newX}px`
      this.elements.panel.style.top = `${newY}px`
      this.elements.panel.style.right = 'auto'
    }

    const handleEnd = () => {
      this.isDragging = false
      this.elements.panel.style.transition = ''
    }

    header.addEventListener('mousedown', handleStart)
    header.addEventListener('touchstart', handleStart, { passive: false })
    document.addEventListener('mousemove', handleMove)
    document.addEventListener('touchmove', handleMove, { passive: false })
    document.addEventListener('mouseup', handleEnd)
    document.addEventListener('touchend', handleEnd)
  }

  togglePanel() {
    this.panelCollapsed = !this.panelCollapsed
    this.elements.panel.classList.toggle('collapsed')
    const toggle = this.elements.panel.querySelector('.toggle-collapse')
    toggle.textContent = this.panelCollapsed ? '□' : '_'
  }

  loadPreset(name) {
    const preset = this.presetManager.getPreset(name)
    if (preset) {
      this.applyPreset(preset)
      this.showTooltip(`Loaded preset: ${name}`)
    }
  }

  applyPreset(preset) {
    Object.assign(this.config, preset)
    this.updateControls()
  }

  updateControls() {
    if (this.elements.particleCount) {
      this.elements.particleCount.value = this.config.particleCount
      document.getElementById('particleValue').textContent = this.config.particleCount
      document.getElementById('particle-counter').querySelector('span').textContent =
        this.config.particleCount
    }

    if (this.elements.flowSpeed) {
      this.elements.flowSpeed.value = this.config.flowSpeed
      document.getElementById('speedValue').textContent = this.config.flowSpeed.toFixed(1)
    }

    if (this.elements.turbulence) {
      this.elements.turbulence.value = this.config.turbulence
      document.getElementById('turbulenceValue').textContent = this.config.turbulence.toFixed(1)
    }

    if (this.elements.waveAmplitude) {
      this.elements.waveAmplitude.value = this.config.waveAmplitude
      document.getElementById('waveValue').textContent = this.config.waveAmplitude
    }

    if (this.elements.trailLength) {
      this.elements.trailLength.value = this.config.trailLength
      document.getElementById('trailValue').textContent = this.config.trailLength
    }

    if (this.elements.glowIntensity) {
      this.elements.glowIntensity.value = this.config.glowIntensity
      document.getElementById('glowValue').textContent = this.config.glowIntensity.toFixed(1)
    }

    if (this.elements.colorScheme) {
      this.elements.colorScheme.value = this.config.colorScheme
    }

    if (this.elements.visualMode) {
      this.elements.visualMode.value = this.config.visualMode
    }
  }

  updateCustomPresets() {
    const select = document.getElementById('customPresets')
    const customPresets = this.presetManager.customPresets

    select.innerHTML = '<option value="">Load custom preset...</option>'
    Object.keys(customPresets).forEach((name) => {
      const option = document.createElement('option')
      option.value = name
      option.textContent = name
      select.appendChild(option)
    })
  }

  loadQueryPreset() {
    const preset = this.presetManager.loadFromQuery()
    if (preset) {
      this.applyPreset(preset)
      this.showTooltip('Preset loaded from URL')
    }
  }

  checkAccessibility() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      this.config.particleCount = 200
      this.config.trailLength = 5
      this.config.glowIntensity = 0.5
      this.updateControls()
    }
  }

  toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  }

  reset() {
    this.config.particleCount = 500
    this.config.flowSpeed = 1
    this.config.turbulence = 1
    this.config.waveAmplitude = 50
    this.config.trailLength = 10
    this.config.glowIntensity = 0.8
    this.config.colorScheme = 'aqua'
    this.config.visualMode = 'flow'
    this.updateControls()
    if (this.callbacks.reset) {
      this.callbacks.reset()
    }
  }

  showTooltip(message) {
    const tooltip = document.createElement('div')
    tooltip.className = 'tooltip'
    tooltip.textContent = message
    document.body.appendChild(tooltip)

    setTimeout(() => {
      tooltip.classList.add('show')
    }, 10)

    setTimeout(() => {
      tooltip.classList.remove('show')
      setTimeout(() => {
        document.body.removeChild(tooltip)
      }, 300)
    }, 2000)
  }

  updateFPS(fps) {
    const counter = document.getElementById('fps-counter')
    if (counter) {
      counter.querySelector('span').textContent = fps
    }
  }

  getAudioData() {
    // Audio reactive mode removed
    return null
  }

  setRecorder(recorder) {
    this.recorder = recorder
  }
}
