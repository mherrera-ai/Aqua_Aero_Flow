// @ts-check

/**
 * @typedef {Object} ColorScheme
 * @property {string[]} primary - Primary colors
 * @property {string[]} secondary - Secondary colors
 * @property {string} background - Background color
 */

/**
 * Available color schemes
 * @type {Object.<string, ColorScheme>}
 */
export const colorSchemes = {
  aqua: {
    primary: ['#00ffff', '#00ccff', '#0099ff'],
    secondary: ['#00ff99', '#00ffcc', '#00cccc'],
    background: 'rgba(0, 20, 40, 0.02)',
  },
  ocean: {
    primary: ['#0066cc', '#004499', '#002266'],
    secondary: ['#00aaff', '#0088cc', '#006699'],
    background: 'rgba(0, 10, 30, 0.02)',
  },
  aurora: {
    primary: ['#00ff00', '#00ff66', '#00ffcc'],
    secondary: ['#ff00ff', '#cc00ff', '#9900ff'],
    background: 'rgba(10, 0, 20, 0.02)',
  },
  vapor: {
    primary: ['#ff00ff', '#ff66ff', '#ffccff'],
    secondary: ['#00ffff', '#66ffff', '#ccffff'],
    background: 'rgba(20, 0, 20, 0.02)',
  },
  ice: {
    primary: ['#ccffff', '#99ffff', '#66ffff'],
    secondary: ['#ffffff', '#e6ffff', '#ccf0ff'],
    background: 'rgba(10, 20, 30, 0.02)',
  },
  plasma: {
    primary: ['#ff0066', '#ff3366', '#ff6666'],
    secondary: ['#6600ff', '#9933ff', '#cc66ff'],
    background: 'rgba(20, 0, 10, 0.02)',
  },
  nebula: {
    primary: ['#ff1493', '#ff69b4', '#ff86c1'],
    secondary: ['#9400d3', '#8a2be2', '#7b68ee'],
    background: 'rgba(10, 0, 20, 0.02)',
  },
  colorblind: {
    primary: ['#0173b2', '#029e73', '#56b4e9'],
    secondary: ['#e69f00', '#f0e442', '#cc79a7'],
    background: 'rgba(20, 20, 20, 0.02)',
  },
}

/**
 * Convert hex color to rgba
 * @param {string} hex - Hex color code
 * @param {number} [alpha=1] - Alpha value (0-1)
 * @returns {string} RGBA color string
 */
export function hexToRgba(hex, alpha = 1) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (result) {
    return `rgba(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}, ${alpha})`
  }
  return hex
}

/**
 * Interpolate between two colors
 * @param {string} color1 - First hex color
 * @param {string} color2 - Second hex color
 * @param {number} factor - Interpolation factor (0-1)
 * @returns {string} Interpolated hex color
 */
export function interpolateColors(color1, color2, factor) {
  const c1 = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color1)
  const c2 = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color2)

  if (c1 && c2) {
    const r = Math.round(parseInt(c1[1], 16) + (parseInt(c2[1], 16) - parseInt(c1[1], 16)) * factor)
    const g = Math.round(parseInt(c1[2], 16) + (parseInt(c2[2], 16) - parseInt(c1[2], 16)) * factor)
    const b = Math.round(parseInt(c1[3], 16) + (parseInt(c2[3], 16) - parseInt(c1[3], 16)) * factor)
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
  }
  return color1
}

/**
 * Get random color from scheme
 * @param {string} schemeName - Name of color scheme
 * @returns {string} Random hex color from scheme
 */
export function getRandomColor(schemeName) {
  const scheme = colorSchemes[schemeName] || colorSchemes.aqua
  const allColors = [...scheme.primary, ...scheme.secondary]
  return allColors[Math.floor(Math.random() * allColors.length)]
}

/**
 * Blend two colors (alias for interpolateColors with 0.5 factor)
 * @param {string} color1 - First hex color
 * @param {string} color2 - Second hex color
 * @param {number} [factor=0.5] - Blend factor
 * @returns {string} Blended hex color
 */
export function blendColors(color1, color2, factor = 0.5) {
  return interpolateColors(color1, color2, factor)
}
