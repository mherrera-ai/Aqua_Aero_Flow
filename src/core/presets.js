export class PresetManager {
  constructor() {
    this.defaultPresets = {
      calm: {
        particleCount: 300,
        flowSpeed: 0.5,
        turbulence: 0.5,
        waveAmplitude: 30,
        trailLength: 20,
        glowIntensity: 1.0,
        colorScheme: 'aqua',
        visualMode: 'waves',
      },
      storm: {
        particleCount: 1500,
        flowSpeed: 2.5,
        turbulence: 2.5,
        waveAmplitude: 150,
        trailLength: 5,
        glowIntensity: 1.5,
        colorScheme: 'ocean',
        visualMode: 'flow',
      },
      galaxy: {
        particleCount: 1000,
        flowSpeed: 1.0,
        turbulence: 1.5,
        waveAmplitude: 100,
        trailLength: 30,
        glowIntensity: 2.0,
        colorScheme: 'aurora',
        visualMode: 'spiral',
      },
      matrix: {
        particleCount: 800,
        flowSpeed: 1.5,
        turbulence: 0.2,
        waveAmplitude: 10,
        trailLength: 40,
        glowIntensity: 1.2,
        colorScheme: 'vapor',
        visualMode: 'vortex',
      },
    }
    this.customPresets = this.loadCustomPresets()
  }

  loadCustomPresets() {
    try {
      const saved = localStorage.getItem('aquaAeroPresets')
      return saved ? JSON.parse(saved) : {}
    } catch {
      return {}
    }
  }

  saveCustomPreset(name, config) {
    this.customPresets[name] = { ...config }
    localStorage.setItem('aquaAeroPresets', JSON.stringify(this.customPresets))
  }

  deleteCustomPreset(name) {
    delete this.customPresets[name]
    localStorage.setItem('aquaAeroPresets', JSON.stringify(this.customPresets))
  }

  getPreset(name) {
    return this.defaultPresets[name] || this.customPresets[name]
  }

  getAllPresets() {
    return {
      ...this.defaultPresets,
      ...this.customPresets,
    }
  }

  exportToURL(config) {
    const data = btoa(JSON.stringify(config))
    return `${window.location.origin}${window.location.pathname}?p=${data}`
  }

  importFromURL(url) {
    try {
      const params = new URL(url).searchParams
      const data = params.get('p')
      if (data) {
        return JSON.parse(atob(data))
      }
    } catch (err) {
      console.error('Failed to import preset from URL:', err)
    }
    return null
  }

  loadFromQuery() {
    const params = new URLSearchParams(window.location.search)
    const data = params.get('p')
    if (data) {
      try {
        return JSON.parse(atob(data))
      } catch (err) {
        console.error('Failed to load preset from query:', err)
      }
    }
    return null
  }
}
